
// SINCRONIAIA · LAB MODIFICAR VENTA ABIERTA v0.1
// Regla: SUBTOTAL solo consulta. Las correcciones se hacen en circuito separado,
// con motivo obligatorio y trazabilidad. Tickets cerrados: rectificación autorizada.

var saleAdjustments=[];

(function(){
const MV_PREFIX='tpv_lab_modificar_venta_v1_';

const adminProductListState={
  area:'Todos',
  sub:'Todos',
  status:'Todos',
  query:''
};

function rememberAdminProductListState(){
  const areaEl=document.getElementById('listArea');
  const subEl=document.getElementById('listSub');
  const statusEl=document.getElementById('listStatus');
  const queryEl=document.getElementById('listQuery');
  if(!areaEl||!subEl||!statusEl||!queryEl)return;
  adminProductListState.area=areaEl.value||'Todos';
  adminProductListState.sub=subEl.value||'Todos';
  adminProductListState.status=statusEl.value||'Todos';
  adminProductListState.query=queryEl.value||'';
}

function restoreAdminProductListState(){
  const areaEl=document.getElementById('listArea');
  const subEl=document.getElementById('listSub');
  const statusEl=document.getElementById('listStatus');
  const queryEl=document.getElementById('listQuery');
  if(!areaEl||!subEl||!statusEl||!queryEl)return;

  const areaValues=Array.from(areaEl.options||[]).map(o=>o.value);
  areaEl.value=areaValues.includes(adminProductListState.area)?adminProductListState.area:'Todos';

  const areaValue=areaEl.value;
  const subs=areaValue==='Todos'
    ?[...new Set(products.flatMap(productSubs))].sort()
    :allSubsForArea(areaValue);

  subEl.innerHTML='<option value="Todos">Todas</option>'+subs.map(s=>'<option>'+esc(s)+'</option>').join('');
  subEl.value=(adminProductListState.sub==='Todos'||subs.includes(adminProductListState.sub))
    ?adminProductListState.sub
    :'Todos';

  statusEl.value=['Todos','Altas','Bajas'].includes(adminProductListState.status)
    ?adminProductListState.status
    :'Todos';
  queryEl.value=adminProductListState.query||'';

  baseFilterAdminProducts();
}

const baseFilterAdminProducts=filterAdminProducts;
filterAdminProducts=function(){
  rememberAdminProductListState();
  return baseFilterAdminProducts();
};

const baseRefreshAdminSubFilter=refreshAdminSubFilter;
refreshAdminSubFilter=function(){
  const result=baseRefreshAdminSubFilter();
  rememberAdminProductListState();
  return result;
};

const baseEditProduct=editProduct;
editProduct=function(code){
  rememberAdminProductListState();
  return baseEditProduct(code);
};

function cloneLine(l){return JSON.parse(JSON.stringify(l||{}))}
function adjustmentReason(){
  const sel=document.getElementById('openSaleReason');
  const other=document.getElementById('openSaleReasonOther');
  let code=(sel?.value||'').trim();
  if(!code){alert('Selecciona el motivo de la modificación.');return null}
  if(code==='Otro'){
    let detail=(other?.value||'').trim();
    if(!detail){alert('Escribe el motivo de la modificación.');return null}
    return detail;
  }
  return code;
}
function reasonOtherToggle(){
  let sel=document.getElementById('openSaleReason'),box=document.getElementById('openSaleReasonOtherBox');
  if(box)box.hidden=sel?.value!=='Otro';
}
function logOpenSaleAdjustment(action,before,after,reason){
  saleAdjustments.unshift({
    id:'A'+Date.now().toString(36)+Math.random().toString(36).slice(2,5),
    date:new Date().toLocaleString('es-ES'),
    seller:selectedCloseSeller||before?.seller||'Sin vendedor',
    action,
    reason,
    code:before?.code||'',
    name:before?.name||'',
    before:cloneLine(before),
    after:after?cloneLine(after):null
  });
  if(saleAdjustments.length>1000)saleAdjustments.length=1000;
}
function recalcOpenLine(line,qty){
  if(line.direct){
    let total=round(qty*Number(line.price||0));
    return {...line,qty,normalTotal:total,total,discount:0,offerLabel:'',offerPrice:Number(line.price||0)};
  }
  let p=products.find(x=>x.code===line.code);
  if(!p){
    let total=round(qty*Number(line.price||0));
    return {...line,qty,normalTotal:total,total,discount:0,offerLabel:'',offerPrice:Number(line.price||0)};
  }
  let calcProduct={...p,price:Number(line.price||p.price)};
  let c=calcLine(calcProduct,qty);
  return {...line,qty,normalTotal:c.normal,total:c.total,discount:c.disc,offerLabel:c.label,offerPrice:c.appliedPrice};
}

pilotSnapshot=function(){
  return {version:3,savedAt:new Date().toISOString(),company,sellers,products,tickets,zReports,sellerMems,customSubsections,orders,saleAdjustments};
};
persistPilotState=function(){};
save=function(){
  localStorage.setItem(MV_PREFIX+'company',JSON.stringify(company));
  localStorage.setItem(MV_PREFIX+'sellers',JSON.stringify(sellers));
  localStorage.setItem(MV_PREFIX+'products',JSON.stringify(products));
  localStorage.setItem(MV_PREFIX+'tickets',JSON.stringify(tickets));
  localStorage.setItem(MV_PREFIX+'zReports',JSON.stringify(zReports));
  localStorage.setItem(MV_PREFIX+'sellerMems',JSON.stringify(sellerMems));
  localStorage.setItem(MV_PREFIX+'customSubsections',JSON.stringify(customSubsections));
  localStorage.setItem(MV_PREFIX+'orders',JSON.stringify(orders));
  localStorage.setItem(MV_PREFIX+'saleAdjustments',JSON.stringify(saleAdjustments));
};
restorePilotState=function(){
  try{
    let initialized=localStorage.getItem(MV_PREFIX+'initialized');
    if(initialized){
      company=JSON.parse(localStorage.getItem(MV_PREFIX+'company')||JSON.stringify(company));
      sellers=JSON.parse(localStorage.getItem(MV_PREFIX+'sellers')||JSON.stringify(sellers));
      products=JSON.parse(localStorage.getItem(MV_PREFIX+'products')||JSON.stringify(products));
      tickets=JSON.parse(localStorage.getItem(MV_PREFIX+'tickets')||'[]');
      zReports=JSON.parse(localStorage.getItem(MV_PREFIX+'zReports')||'[]');
      sellerMems=JSON.parse(localStorage.getItem(MV_PREFIX+'sellerMems')||'{}');
      customSubsections=JSON.parse(localStorage.getItem(MV_PREFIX+'customSubsections')||'{}');
      orders=JSON.parse(localStorage.getItem(MV_PREFIX+'orders')||'[]');
      saleAdjustments=JSON.parse(localStorage.getItem(MV_PREFIX+'saleAdjustments')||'[]');
    }else{
      tickets=[];zReports=[];orders=[];sellerMems={};saleAdjustments=[];
      sellers=sellers.map(s=>({...s,active:false}));
      localStorage.setItem(MV_PREFIX+'initialized','1');
    }
    ensureMems();ensureEnabledSubsections();pilotReady=true;save();
  }catch(e){
    console.warn('LAB Modificar venta: no se pudo restaurar el estado',e);
    pilotReady=true;
  }
  render();
};

importPilotBackup=function(input){
  let file=input.files&&input.files[0];if(!file)return;
  let reader=new FileReader();
  reader.onload=()=>{
    try{
      let d=JSON.parse(reader.result);
      if(!d.company||!Array.isArray(d.products)||!Array.isArray(d.tickets))throw new Error('Formato no válido');
      if(!confirm('La copia sustituirá los datos actuales de esta LAB. ¿Continuar?'))return;
      company=d.company;sellers=Array.isArray(d.sellers)?d.sellers:sellers;products=d.products;tickets=d.tickets;
      zReports=Array.isArray(d.zReports)?d.zReports:[];sellerMems=d.sellerMems||{};customSubsections=d.customSubsections||{};
      orders=Array.isArray(d.orders)?d.orders:[];saleAdjustments=Array.isArray(d.saleAdjustments)?d.saleAdjustments:[];
      ensureMems();ensureEnabledSubsections();save();render();alert('Copia restaurada correctamente.');
    }catch(e){alert('No se ha podido leer esta copia: '+e.message)}
  };
  reader.readAsText(file);input.value='';
};

showTicket=function(){
  modal(
    '<h2>Subtotal · '+esc(selectedCloseSeller)+'</h2>'+
    (cart.length?cart.map(l=>'<div class="line"><div><b>'+esc(l.name)+'</b><br><small>'+
      String(l.qty).replace('.',',')+' '+l.unit+' × '+euro(l.price)+' = '+euro(l.total)+'</small>'+
      (l.discount>0?'<br><small>Oferta: -'+euro(l.discount)+'</small>':'')+
      '</div></div>').join(''):'<p>No hay líneas.</p>')+
    '<h2>Total provisional: '+euro(totalBeforeManual(cart))+'</h2>'+
    '<div class="grid two">'+
      '<button class="brand" onclick="continueSelling()">SEGUIR VENDIENDO</button>'+
      '<button onclick="openSaleModification()">MODIFICAR VENTA</button>'+
      '<button class="primary" onclick="subtotalModal()">COBRAR / CERRAR VENTA</button>'+
    '</div>'+
    '<p class="notice"><b>Subtotal es solo consulta.</b> Para cambiar o retirar un artículo usa MODIFICAR VENTA. La acción quedará registrada.</p>'
  );
};

openSaleModification=function(){
  if(!cart.length)return alert('No hay líneas en la venta abierta.');
  modal(
    '<h2>Modificar venta abierta · '+esc(selectedCloseSeller)+'</h2>'+
    '<p class="notice">Esta venta todavía no está cobrada. Puedes corregir peso/cantidad o retirar una línea. El precio no se modifica desde aquí y el motivo es obligatorio.</p>'+
    cart.map((l,i)=>'<div class="line"><div><b>'+esc(l.name)+'</b><br><small>'+
      String(l.qty).replace('.',',')+' '+l.unit+' × '+euro(l.price)+' = '+euro(l.total)+
      '</small></div><button onclick="editOpenSaleLine('+i+')">MODIFICAR</button></div>').join('')+
    '<h3>Total provisional: '+euro(totalBeforeManual(cart))+'</h3>'+
    '<p><button onclick="showTicket()">Volver al subtotal</button></p>'
  );
};

editOpenSaleLine=function(index){
  let l=cart[index];if(!l)return alert('Línea no encontrada.');
  modal(
    '<h2>Modificar · '+esc(l.name)+'</h2>'+
    '<p><b>Precio bloqueado:</b> '+euro(l.price)+' / '+esc(l.unit)+'</p>'+
    '<div class="grid two"><div><label>'+(l.unit==='kg'?'Peso correcto (kg)':'Cantidad correcta')+'</label>'+
      '<input id="openSaleQty" type="number" inputmode="decimal" min="'+(l.unit==='kg'?'0.001':'1')+'" step="'+(l.unit==='kg'?'0.001':'1')+'" value="'+Number(l.qty)+'"></div>'+
      '<div><label>Motivo obligatorio</label><select id="openSaleReason" onchange="reasonOtherToggle()">'+
        '<option value="">Seleccionar motivo…</option>'+
        '<option>Cliente no lo quiere</option>'+
        '<option>Cliente quiere menos / más cantidad</option>'+
        '<option>Artículo introducido por error</option>'+
        '<option>Peso / cantidad incorrecta</option>'+
        '<option>Otro</option>'+
      '</select></div></div>'+
    '<div id="openSaleReasonOtherBox" hidden><label>Indica el motivo</label><input id="openSaleReasonOther" maxlength="120" placeholder="Motivo"></div>'+
    '<p class="warn">Retirar una línea de una venta abierta no borra un ticket: todavía no existe ticket cerrado. La retirada queda en el registro de Empresa.</p>'+
    '<div class="grid two">'+
      '<button class="primary" onclick="saveOpenSaleQty('+index+')">GUARDAR CAMBIO</button>'+
      '<button class="danger" onclick="removeOpenSaleLine('+index+')">RETIRAR ARTÍCULO</button>'+
    '</div>'+
    '<p><button onclick="openSaleModification()">Cancelar</button></p>'
  );
};

saveOpenSaleQty=function(index){
  let l=cart[index];if(!l)return alert('Línea no encontrada.');
  let reason=adjustmentReason();if(!reason)return;
  let qty=Number(document.getElementById('openSaleQty')?.value);
  if(!Number.isFinite(qty)||qty<=0)return alert('Indica un peso o cantidad válido.');
  if(l.unit==='ud'&&!Number.isInteger(qty))return alert('Las unidades deben ser un número entero.');
  if(Math.abs(qty-Number(l.qty))<0.0000001)return alert('No hay ningún cambio en el peso o cantidad.');
  let before=cloneLine(l),after=recalcOpenLine(l,qty);
  cart[index]=after;
  sellerMems[selectedCloseSeller]=cart.map(cloneLine);
  logOpenSaleAdjustment('CAMBIO PESO/CANTIDAD',before,after,reason);
  save();
  flash('Línea modificada y registrada');
  openSaleModification();
};

removeOpenSaleLine=function(index){
  let l=cart[index];if(!l)return alert('Línea no encontrada.');
  let reason=adjustmentReason();if(!reason)return;
  if(!confirm('Retirar '+l.name+' de esta venta abierta?'))return;
  let before=cloneLine(l);
  cart.splice(index,1);
  sellerMems[selectedCloseSeller]=cart.map(cloneLine);
  logOpenSaleAdjustment('LÍNEA RETIRADA',before,null,reason);
  save();
  if(!cart.length){
    closeModal();atRoot=true;subcat='';render();flash('Artículo retirado. La venta queda vacía.');
    return;
  }
  flash('Artículo retirado y registrado');
  openSaleModification();
};

saleAdjustmentsHtml=function(){
  let rows=saleAdjustments.slice(0,300);
  return '<div class="panel"><h2>Modificaciones de ventas abiertas</h2>'+
    '<p class="notice">Registro de cambios realizados antes del cobro. Los tickets cerrados siguen su circuito de Rectificación autorizada.</p>'+
    (rows.length?rows.map(a=>'<div class="line"><div><b>'+esc(a.action)+' · '+esc(a.name)+'</b><br><small>'+
      esc(a.date)+' · '+esc(a.seller)+' · Motivo: '+esc(a.reason)+
      (a.before?'<br>Antes: '+String(a.before.qty).replace('.',',')+' '+esc(a.before.unit)+' · '+euro(a.before.total):'')+
      (a.after?'<br>Después: '+String(a.after.qty).replace('.',',')+' '+esc(a.after.unit)+' · '+euro(a.after.total):'')+
      '</small></div><span class="tag">REGISTRADO</span></div>').join(''):'<p>No hay modificaciones registradas.</p>')+
    '</div>';
};

adminMenu=function(){
  return '<div class="panel"><div class="saleTop"><strong>Empresa</strong><button onclick="goHome()">← Salir a inicio</button></div>'+
    '<p class="notice"><b>LAB aislada:</b> los datos pertenecen a esta prueba. Haz copias periódicas.</p>'+
    '<div class="adminCards">'+
      '<button class="primary" onclick="openAdminTab(\'config\')">Configuración</button>'+
      '<button onclick="openAdminTab(\'discounts\')">Descuentos automáticos</button>'+
      '<button onclick="openAdminTab(\'tickets\')">Tickets guardados</button>'+
      '<button onclick="openAdminTab(\'reports\')">Informes X / Z</button>'+
      '<button onclick="openAdminTab(\'sellers\')">Configurar vendedores</button>'+
      '<button onclick="openAdminTab(\'subsections\')">Subsecciones</button>'+
      '<button onclick="openAdminTab(\'products\')">Artículos</button>'+
      '<button onclick="openAdminTab(\'adjustments\')">Modificaciones venta abierta</button>'+
      '<button class="brand" onclick="openAdminTab(\'data\')">Datos locales y copias</button>'+
    '</div></div>';
};
renderEmpresa=function(app){
  if(adminTab==='menu'){app.innerHTML=adminMenu();return}
  const views={
    config:['Configuración',configHtml],
    discounts:['Descuentos automáticos',discountsHtml],
    tickets:['Tickets guardados',ticketHistoryHtml],
    reports:['Informes X / Z',reportsHtml],
    sellers:['Configurar vendedores',sellersHtml],
    subsections:['Subsecciones',subsectionsHtml],
    products:['Artículos',productsHtml],
    adjustments:['Modificaciones venta abierta',saleAdjustmentsHtml],
    data:['Datos locales y copias',localDataHtml]
  };
  const view=views[adminTab]||views.config;
  app.innerHTML='<div class="panel adminTop"><button onclick="openAdminTab(\'menu\')">← Empresa</button><strong>'+view[0]+'</strong></div>'+view[1]();
  if(adminTab==='products')restoreAdminProductListState();
};

window.reasonOtherToggle=reasonOtherToggle;
})();

// Marca visible adicional para evitar confundir esta LAB con otras.
document.addEventListener('DOMContentLoaded',()=>{
  const small=document.querySelector('header small');
  if(small)small.textContent='DIBAL LAB v1.3 · LAB MODIFICAR VENTA ABIERTA · TRAZABILIDAD';
});
