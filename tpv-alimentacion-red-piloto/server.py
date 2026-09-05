#!/usr/bin/env python3
import json, mimetypes, os, sqlite3, threading
from datetime import datetime
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
from pathlib import Path
from urllib.parse import urlparse, parse_qs

ROOT = Path(__file__).resolve().parent
STATIC = ROOT / "static"
DB_PATH = Path(os.getenv('TPV_DB', str(ROOT / "tpv_local_red.db")))
LOCK = threading.RLock()

def now(): return datetime.now().astimezone().isoformat(timespec="seconds")
def money(v): return round(float(v or 0) + 1e-9, 2)
def db():
    con=sqlite3.connect(DB_PATH, timeout=10)
    con.row_factory=sqlite3.Row
    con.execute("PRAGMA foreign_keys=ON")
    con.execute("PRAGMA journal_mode=WAL")
    return con

def init_db():
    con=db()
    con.executescript("""
    CREATE TABLE IF NOT EXISTS settings(key TEXT PRIMARY KEY,value TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS sellers(id INTEGER PRIMARY KEY,name TEXT NOT NULL UNIQUE,code TEXT NOT NULL UNIQUE,pin TEXT NOT NULL,active INTEGER NOT NULL DEFAULT 0);
    CREATE TABLE IF NOT EXISTS products(code TEXT PRIMARY KEY,name TEXT NOT NULL,area TEXT NOT NULL,subcat TEXT NOT NULL,price REAL NOT NULL,unit TEXT NOT NULL,active INTEGER NOT NULL DEFAULT 1,updated_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS cart_lines(id INTEGER PRIMARY KEY AUTOINCREMENT,seller_id INTEGER NOT NULL,product_code TEXT,name TEXT NOT NULL,qty REAL NOT NULL,tare REAL NOT NULL DEFAULT 0,net_qty REAL NOT NULL,unit TEXT NOT NULL,price REAL NOT NULL,total REAL NOT NULL,created_at TEXT NOT NULL,FOREIGN KEY(seller_id) REFERENCES sellers(id));
    CREATE TABLE IF NOT EXISTS tickets(id INTEGER PRIMARY KEY AUTOINCREMENT,number TEXT NOT NULL UNIQUE,created_at TEXT NOT NULL,seller_id INTEGER NOT NULL,seller_name TEXT NOT NULL,method TEXT NOT NULL,total REAL NOT NULL,cash_given REAL,change_due REAL,device TEXT NOT NULL,FOREIGN KEY(seller_id) REFERENCES sellers(id));
    CREATE TABLE IF NOT EXISTS ticket_lines(id INTEGER PRIMARY KEY AUTOINCREMENT,ticket_id INTEGER NOT NULL,product_code TEXT,name TEXT NOT NULL,qty REAL NOT NULL,unit TEXT NOT NULL,price REAL NOT NULL,total REAL NOT NULL,FOREIGN KEY(ticket_id) REFERENCES tickets(id));
    CREATE TABLE IF NOT EXISTS orders(id INTEGER PRIMARY KEY AUTOINCREMENT,number TEXT NOT NULL UNIQUE,customer TEXT NOT NULL,phone TEXT,collection_at TEXT NOT NULL,notes TEXT,status TEXT NOT NULL DEFAULT 'Pendiente',created_at TEXT NOT NULL,created_by TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS order_lines(id INTEGER PRIMARY KEY AUTOINCREMENT,order_id INTEGER NOT NULL,product_code TEXT,name TEXT NOT NULL,qty REAL NOT NULL,unit TEXT NOT NULL,notes TEXT,FOREIGN KEY(order_id) REFERENCES orders(id));
    CREATE TABLE IF NOT EXISTS audit(id INTEGER PRIMARY KEY AUTOINCREMENT,created_at TEXT NOT NULL,actor TEXT NOT NULL,action TEXT NOT NULL,entity TEXT NOT NULL,entity_id TEXT NOT NULL,detail TEXT NOT NULL);
    CREATE TRIGGER IF NOT EXISTS tickets_no_update BEFORE UPDATE ON tickets BEGIN SELECT RAISE(ABORT,'Los tickets cerrados son inalterables'); END;
    CREATE TRIGGER IF NOT EXISTS tickets_no_delete BEFORE DELETE ON tickets BEGIN SELECT RAISE(ABORT,'Los tickets cerrados son inalterables'); END;
    CREATE TRIGGER IF NOT EXISTS ticket_lines_no_update BEFORE UPDATE ON ticket_lines BEGIN SELECT RAISE(ABORT,'Las líneas de ticket son inalterables'); END;
    CREATE TRIGGER IF NOT EXISTS ticket_lines_no_delete BEFORE DELETE ON ticket_lines BEGIN SELECT RAISE(ABORT,'Las líneas de ticket son inalterables'); END;
    """)
    con.execute("INSERT OR IGNORE INTO settings VALUES('company_name','Carnicería Demo')")
    con.execute("INSERT OR IGNORE INTO settings VALUES('admin_code','1234')")
    for i in range(1,5): con.execute("INSERT OR IGNORE INTO sellers(name,code,pin) VALUES(?,?,?)",(f'Vendedor {i}',str(i),str(i)*4))
    if con.execute("SELECT COUNT(*) FROM products").fetchone()[0]==0:
        catalog=json.loads((ROOT/'catalog.json').read_text(encoding='utf-8'))
        con.executemany("INSERT INTO products(code,name,area,subcat,price,unit,active,updated_at) VALUES(?,?,?,?,?,?,?,?)",[(p['code'],p['name'],p['area'],p.get('subcat') or p.get('cat') or 'Otros',p['price'],p['unit'],1 if p.get('active',True) else 0,now()) for p in catalog])
    con.commit();con.close()

def rows(cur): return [dict(r) for r in cur.fetchall()]
def audit(con,actor,action,entity,entity_id,detail): con.execute("INSERT INTO audit(created_at,actor,action,entity,entity_id,detail) VALUES(?,?,?,?,?,?)",(now(),actor,action,entity,str(entity_id),json.dumps(detail,ensure_ascii=False)))

class Handler(BaseHTTPRequestHandler):
    server_version="SINCRONIAIA-TPV-Local-Red/0.1"
    def log_message(self,fmt,*args): print(f"[{self.address_string()}] {fmt%args}")
    def send_json(self,obj,status=200):
        data=json.dumps(obj,ensure_ascii=False).encode();self.send_response(status);self.send_header('Content-Type','application/json; charset=utf-8');self.send_header('Content-Length',str(len(data)));self.send_header('Cache-Control','no-store');self.end_headers();self.wfile.write(data)
    def body(self):
        try:return json.loads(self.rfile.read(int(self.headers.get('Content-Length','0'))) or b'{}')
        except:return {}
    def admin(self,con): return self.headers.get('X-Admin-Code','')==con.execute("SELECT value FROM settings WHERE key='admin_code'").fetchone()[0]
    def require_admin(self,con):
        if self.admin(con): return True
        self.send_json({'error':'Código Empresa incorrecto'},403);return False
    def do_GET(self):
        u=urlparse(self.path)
        if u.path.startswith('/api/'):
            try:return self.api_get(u.path,parse_qs(u.query))
            except Exception as e:return self.send_json({'error':str(e)},500)
        path='index.html' if u.path=='/' else u.path.lstrip('/')
        file=(STATIC/path).resolve()
        if not str(file).startswith(str(STATIC.resolve())) or not file.is_file(): self.send_error(404);return
        data=file.read_bytes();self.send_response(200);self.send_header('Content-Type',mimetypes.guess_type(file.name)[0] or 'application/octet-stream');self.send_header('Content-Length',str(len(data)));self.end_headers();self.wfile.write(data)
    def do_POST(self):
        try:return self.api_post(urlparse(self.path).path,self.body())
        except sqlite3.IntegrityError as e:return self.send_json({'error':str(e)},409)
        except Exception as e:return self.send_json({'error':str(e)},500)
    def do_PUT(self):
        try:return self.api_put(urlparse(self.path).path,self.body())
        except Exception as e:return self.send_json({'error':str(e)},500)
    def do_DELETE(self):
        try:return self.api_delete(urlparse(self.path).path)
        except Exception as e:return self.send_json({'error':str(e)},500)
    def api_get(self,path,q):
        con=db()
        if path=='/api/bootstrap':
            company=con.execute("SELECT value FROM settings WHERE key='company_name'").fetchone()[0]
            result={'company':company,'products':rows(con.execute("SELECT * FROM products ORDER BY name")),'sellers':rows(con.execute("SELECT id,name,code,active FROM sellers ORDER BY id")),'carts':rows(con.execute("SELECT seller_id,COUNT(*) lines,ROUND(SUM(total),2) total FROM cart_lines GROUP BY seller_id")),'orders':rows(con.execute("SELECT * FROM orders ORDER BY collection_at,id"))}
        elif path=='/api/cart':
            seller=int(q.get('seller',['0'])[0]);result={'lines':rows(con.execute("SELECT * FROM cart_lines WHERE seller_id=? ORDER BY id",(seller,)))}
        elif path=='/api/tickets':
            if not self.require_admin(con): con.close();return
            result={'tickets':rows(con.execute("SELECT * FROM tickets ORDER BY id DESC LIMIT 300"))}
        elif path.startswith('/api/tickets/'):
            if not self.require_admin(con): con.close();return
            number=path.rsplit('/',1)[1];t=con.execute("SELECT * FROM tickets WHERE number=?",(number,)).fetchone();result={'ticket':dict(t) if t else None,'lines':rows(con.execute("SELECT * FROM ticket_lines WHERE ticket_id=?",(t['id'],))) if t else []}
        elif path.startswith('/api/orders/'):
            oid=int(path.rsplit('/',1)[1]);o=con.execute("SELECT * FROM orders WHERE id=?",(oid,)).fetchone();result={'order':dict(o) if o else None,'lines':rows(con.execute("SELECT * FROM order_lines WHERE order_id=?",(oid,)))}
        else: con.close();return self.send_json({'error':'Ruta no encontrada'},404)
        con.close();self.send_json(result)
    def api_post(self,path,d):
        con=db()
        if path=='/api/admin/login':
            if not self.require_admin(con): con.close();return
            con.close();return self.send_json({'ok':True})
        elif path=='/api/sellers/login':
            s=con.execute("SELECT * FROM sellers WHERE code=? AND pin=?",(str(d.get('code','')),str(d.get('pin','')))).fetchone()
            if not s: con.close();return self.send_json({'error':'Código o PIN incorrecto'},403)
            con.execute("UPDATE sellers SET active=1 WHERE id=?",(s['id'],));con.commit();result={'seller':{'id':s['id'],'name':s['name']}}
        elif path=='/api/cart/items':
            s=con.execute("SELECT * FROM sellers WHERE id=? AND active=1",(int(d.get('seller_id',0)),)).fetchone();p=con.execute("SELECT * FROM products WHERE code=? AND active=1",(str(d.get('code','')).zfill(6),)).fetchone()
            qty=float(d.get('qty',0));tare=float(d.get('tare',0) or 0);net=qty-tare if p and p['unit']=='kg' else qty
            if not s or not p or net<=0: con.close();return self.send_json({'error':'Vendedor, artículo, peso o cantidad no válido'},400)
            total=money(net*p['price']);cur=con.execute("INSERT INTO cart_lines(seller_id,product_code,name,qty,tare,net_qty,unit,price,total,created_at) VALUES(?,?,?,?,?,?,?,?,?,?)",(s['id'],p['code'],p['name'],qty,tare,net,p['unit'],p['price'],total,now()));con.commit();result={'id':cur.lastrowid,'total':total}
        elif path=='/api/tickets':
            with LOCK:
                con.execute('BEGIN IMMEDIATE');sid=int(d.get('seller_id',0));s=con.execute("SELECT * FROM sellers WHERE id=? AND active=1",(sid,)).fetchone();ls=rows(con.execute("SELECT * FROM cart_lines WHERE seller_id=? ORDER BY id",(sid,)))
                if not s or not ls: con.rollback();con.close();return self.send_json({'error':'No hay venta pendiente para este vendedor'},400)
                total=money(sum(x['total'] for x in ls));method=str(d.get('method','Efectivo'));cash=float(d.get('cash_given',0) or 0)
                if method=='Efectivo' and cash<total: con.rollback();con.close();return self.send_json({'error':'El importe entregado es insuficiente'},400)
                seq=con.execute("SELECT COALESCE(MAX(id),0)+1 FROM tickets").fetchone()[0];number=str(seq).zfill(6);change=money(cash-total) if method=='Efectivo' else None
                cur=con.execute("INSERT INTO tickets(number,created_at,seller_id,seller_name,method,total,cash_given,change_due,device) VALUES(?,?,?,?,?,?,?,?,?)",(number,now(),sid,s['name'],method,total,cash if method=='Efectivo' else None,change,str(d.get('device','Puesto'))))
                tid=cur.lastrowid;con.executemany("INSERT INTO ticket_lines(ticket_id,product_code,name,qty,unit,price,total) VALUES(?,?,?,?,?,?,?)",[(tid,x['product_code'],x['name'],x['net_qty'],x['unit'],x['price'],x['total']) for x in ls]);con.execute("DELETE FROM cart_lines WHERE seller_id=?",(sid,));audit(con,s['name'],'CERRAR_VENTA','ticket',number,{'total':total,'method':method});con.commit();result={'number':number,'total':total,'change':change}
        elif path=='/api/orders':
            if not self.require_admin(con): con.close();return
            items=d.get('items') or []
            if not d.get('customer') or not d.get('collection_at') or not items: con.close();return self.send_json({'error':'Faltan cliente, recogida o artículos'},400)
            seq=con.execute("SELECT COALESCE(MAX(id),0)+1 FROM orders").fetchone()[0];number='E-'+str(seq).zfill(5);cur=con.execute("INSERT INTO orders(number,customer,phone,collection_at,notes,status,created_at,created_by) VALUES(?,?,?,?,?,'Pendiente',?,?)",(number,d['customer'],d.get('phone',''),d['collection_at'],d.get('notes',''),now(),'Empresa'));oid=cur.lastrowid
            con.executemany("INSERT INTO order_lines(order_id,product_code,name,qty,unit,notes) VALUES(?,?,?,?,?,?)",[(oid,str(x.get('code','')).zfill(6),x['name'],float(x.get('qty',0)),x.get('unit','kg'),x.get('notes','')) for x in items]);audit(con,'Empresa','CREAR','encargo',number,d);con.commit();result={'id':oid,'number':number}
        elif path.startswith('/api/orders/') and path.endswith('/cart'):
            oid=int(path.split('/')[3]);sid=int(d.get('seller_id',0));s=con.execute("SELECT * FROM sellers WHERE id=? AND active=1",(sid,)).fetchone();o=con.execute("SELECT * FROM orders WHERE id=? AND status='Pendiente'",(oid,)).fetchone();ls=rows(con.execute("SELECT * FROM order_lines WHERE order_id=?",(oid,)))
            if not s or not o or not ls: con.close();return self.send_json({'error':'Encargo o vendedor no disponible'},400)
            final_qty={int(x['line_id']):float(x['qty']) for x in (d.get('quantities') or [])}
            for x in ls:
                qty=final_qty.get(x['id'],x['qty'])
                if qty<=0: continue
                p=con.execute("SELECT * FROM products WHERE code=?",(x['product_code'],)).fetchone();price=p['price'] if p else 0;total=money(qty*price);con.execute("INSERT INTO cart_lines(seller_id,product_code,name,qty,tare,net_qty,unit,price,total,created_at) VALUES(?,?,?,?,0,?,?,?,?,?)",(sid,x['product_code'],x['name'],qty,qty,x['unit'],price,total,now()))
            con.execute("UPDATE orders SET status='Cargado en venta' WHERE id=?",(oid,));con.commit();result={'ok':True}
        else: con.close();return self.send_json({'error':'Ruta no encontrada'},404)
        con.close();self.send_json(result,201)
    def api_put(self,path,d):
        con=db()
        if not self.require_admin(con): con.close();return
        if path.startswith('/api/products/'):
            code=path.rsplit('/',1)[1];old=con.execute("SELECT * FROM products WHERE code=?",(code,)).fetchone()
            if not old: con.close();return self.send_json({'error':'Artículo no encontrado'},404)
            name=str(d.get('name',old['name'])).strip();price=float(d.get('price',old['price']));area=str(d.get('area',old['area']));subcat=str(d.get('subcat',old['subcat']));active=1 if d.get('active',bool(old['active'])) else 0
            con.execute("UPDATE products SET name=?,price=?,area=?,subcat=?,active=?,updated_at=? WHERE code=?",(name,price,area,subcat,active,now(),code));audit(con,'Empresa','MODIFICAR','artículo',code,{'antes':dict(old),'después':d});con.commit();con.close();return self.send_json({'ok':True})
        con.close();self.send_json({'error':'Ruta no encontrada'},404)
    def api_delete(self,path):
        con=db()
        if path.startswith('/api/cart/items/'):
            line_id=int(path.rsplit('/',1)[1]);line=con.execute("SELECT id FROM cart_lines WHERE id=?",(line_id,)).fetchone()
            if not line: con.close();return self.send_json({'error':'Línea no encontrada'},404)
            con.execute("DELETE FROM cart_lines WHERE id=?",(line_id,));con.commit();con.close();return self.send_json({'ok':True})
        con.close();self.send_json({'error':'Ruta no encontrada'},404)

if __name__=='__main__':
    init_db();port=int(os.getenv('TPV_PORT','8080'))
    print(f"SINCRONIAIA TPV Local Red: http://localhost:{port}")
    print("Desde otra tablet usa: http://IP-DEL-ORDENADOR:8080")
    ThreadingHTTPServer(('0.0.0.0',port),Handler).serve_forever()
