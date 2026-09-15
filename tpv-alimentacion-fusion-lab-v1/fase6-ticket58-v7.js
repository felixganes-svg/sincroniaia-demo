// SINCRONIAIA · LAB FUSIÓN · FASE 6 v7
// Generador 58 mm único. Corrige columnas desde origen; no superpone texto.
(function(){
  const LOGO='data:image/png;base64,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';
  let current=null;
  const W=384, CX=192;
  function money(v){return (Number(v)||0).toFixed(2).replace('.',',')+' €'}
  function plain(v){return (Number(v)||0).toFixed(2).replace('.',',')}
  function numTicket(v){let s=String(v??'').trim(),n=s.replace(/^0+(?=\d)/,'');return n||s||'—'}
  function seller(t){try{let s=typeof findSellerByName==='function'?findSellerByName(t.seller):null;if(s&&String(s.code||'').trim())return String(s.code).trim()}catch(e){}let m=String(t.seller||'').match(/\d+/);return m?m[0]:String(t.seller||'—')}
  function dateOnly(v){let s=String(v||'').trim(),m=s.match(/(\d{1,2}\/\d{1,2}\/\d{2,4})/);return m?m[1]:s||'—'}
  function qty(l){return String(l.unit)==='kg'?(Number(l.qty)||0).toFixed(3).replace('.',',')+' kg':String(Number(l.qty)||0).replace('.',',')+' ud'}
  function traceQty(v,u){let n=Number(v)||0;return u==='kg'?n.toFixed(3).replace('.',',')+' kg':String(n).replace('.',',')+' ud'}
  function traces(t){let out=[],seen={};function add(kind,tr,line){if(!tr)return;let k=tr.id||[kind,tr.date,tr.reason,tr.before&&tr.before.name,tr.before&&tr.before.qty,tr.after&&tr.after.qty].join('|');if(seen[k])return;seen[k]=1;out.push({kind,tr,line:line||null})};(t&&t._openSaleCorrectionTrace||[]).forEach(tr=>add('change',tr,tr.after));(t&&t.items||[]).forEach(l=>((l&&l._openSaleTrace)||[]).forEach(tr=>add('change',tr,l)));(t&&t._removedOpenSaleTrace||[]).forEach(tr=>add('removed',tr,null));return out}
  function payRows(t){let r=['Pago: '+String(t.method||'—')];if(t.method==='Mixto'&&t.paymentBreakdown){let p=t.paymentBreakdown;if(+p.cash>0)r.push('  Efectivo: '+money(p.cash));if(+p.card>0)r.push('  Tarjeta: '+money(p.card));if(+p.bizum>0)r.push('  Bizum: '+money(p.bizum))}if(t.method==='Efectivo'){if(Number.isFinite(+t.cashGiven))r.push('Entregado: '+money(t.cashGiven));if(Number.isFinite(+t.change))r.push('Cambio: '+money(t.change))}return r}
  function center(ctx,s,y,font){ctx.font=font;ctx.textAlign='center';ctx.fillText(s,CX,y);ctx.textAlign='left'}
  function line(ctx,y,w=2){ctx.fillRect(18,y,348,w)}
  function fit(ctx,s,max,start,weight='900'){let z=start;while(z>12){ctx.font=weight+' '+z+'px Arial';if(ctx.measureText(String(s)).width<=max)break;z--}return z}
  function wrap(ctx,text,x,y,maxWidth,lineHeight){let words=String(text||'').split(/\s+/),ln='';for(let w of words){let test=ln?ln+' '+w:w;if(ctx.measureText(test).width>maxWidth&&ln){ctx.fillText(ln,x,y);y+=lineHeight;ln=w}else ln=test}if(ln){ctx.fillText(ln,x,y);y+=lineHeight}return y}
  function loadLogo(){return new Promise((res,rej)=>{let i=new Image();i.onload=()=>res(i);i.onerror=rej;i.src=LOGO})}
  async function build(t,copy){
    const tr=traces(t), pays=payRows(t), items=t.items||[];
    const H=700+Math.max(1,items.length)*76+pays.length*29+(tr.length?100+tr.length*150:0)+(copy?38:0);
    const c=document.createElement('canvas');c.width=W;c.height=H;
    const ctx=c.getContext('2d',{alpha:false});ctx.imageSmoothingEnabled=false;ctx.fillStyle='#fff';ctx.fillRect(0,0,W,H);ctx.fillStyle='#000';ctx.textBaseline='alphabetic';
    let y=14;
    try{let logo=await loadLogo();const lw=230,lh=Math.round(logo.height*lw/logo.width),lx=Math.round((W-lw)/2);ctx.drawImage(logo,lx,y,lw,lh);y+=lh+34}catch(e){ctx.font='900 30px Arial';center(ctx,"CA L'ABRIL",y+35,ctx.font);y+=75}
    ctx.font='700 17px Arial';center(ctx,'Riera de Figuera Major N.2',y,ctx.font);y+=24;center(ctx,'Mataró',y,ctx.font);y+=24;center(ctx,'Telf. 936 22 70 04',y,ctx.font);y+=31;
    line(ctx,y,3);y+=32;ctx.font='900 25px Arial';center(ctx,'FACTURA SIMPLIFICADA',y,ctx.font);y+=31;line(ctx,y,2);y+=28;
    ctx.font='700 18px Arial';ctx.fillText('Fecha: '+dateOnly(t.date),20,y);y+=25;ctx.fillText('Ticket nº: '+numTicket(t.number),20,y);y+=25;ctx.fillText('Vendedor: '+seller(t),20,y);y+=28;
    line(ctx,y,2);y+=29;
    ctx.font='900 15px Arial';ctx.textAlign='left';ctx.fillText('ARTÍCULO',20,y);ctx.textAlign='right';ctx.fillText('CANT.',200,y);ctx.fillText('PRECIO',270,y);ctx.fillText('TOTAL',364,y);ctx.textAlign='left';
    y+=13;line(ctx,y,2);y+=27;
    items.forEach(l=>{
      const name=String(l.name||'Artículo').toUpperCase(),sz=fit(ctx,name,344,21,'900');
      ctx.font='900 '+sz+'px Arial';ctx.fillText(name,20,y);y+=29;
      ctx.font='700 17px Arial';ctx.textAlign='left';ctx.fillText(qty(l),20,y);
      ctx.textAlign='right';ctx.fillText(plain(l.price),262,y);
      ctx.font='900 19px Arial';ctx.fillText(money(l.total),364,y);
      ctx.textAlign='left';y+=28;line(ctx,y,1);y+=18;
    });
    line(ctx,y,3);y+=42;ctx.font='900 34px Arial';ctx.fillText('TOTAL',20,y);ctx.textAlign='right';ctx.font='900 37px Arial';ctx.fillText(money(t.total),364,y);ctx.textAlign='left';y+=18;line(ctx,y,3);y+=35;
    ctx.font='700 19px Arial';pays.forEach(r=>{ctx.fillText(r,20,y);y+=29});
    if(tr.length){
      line(ctx,y,2);y+=34;ctx.font='900 20px Arial';ctx.fillText('CORRECCIONES / ANULACIONES',20,y);y+=20;line(ctx,y,2);y+=27;
      tr.forEach(e=>{let q=e.tr||{};
        if(e.kind==='removed'){let b=q.before||{},u=b.unit||'ud';ctx.font='900 19px Arial';ctx.fillText('ARTÍCULO ANULADO',20,y);y+=24;ctx.font='900 16px Arial';y=wrap(ctx,String(b.name||'Artículo').toUpperCase(),20,y,344,19);ctx.font='700 15px Arial';y=wrap(ctx,'ORIGINAL: '+traceQty(b.qty,u)+' × '+money(b.price)+' = '+money(b.total),20,y,344,19);y=wrap(ctx,'ANULACIÓN: -'+traceQty(b.qty,u)+' · -'+money(b.total),20,y,344,19);y=wrap(ctx,'Motivo: '+String(q.reason||'Sin motivo'),20,y,344,19)}
        else{let b=q.before||{},a=q.after||{},u=b.unit||(e.line&&e.line.unit)||'ud',dq=(+a.qty||0)-(+b.qty||0),dt=(+a.total||0)-(+b.total||0);ctx.font='900 19px Arial';ctx.fillText('CORRECCIÓN',20,y);y+=24;ctx.font='900 16px Arial';y=wrap(ctx,String(b.name||(e.line&&e.line.name)||'Artículo').toUpperCase(),20,y,344,19);ctx.font='700 15px Arial';y=wrap(ctx,'ORIGINAL: '+traceQty(b.qty,u)+' × '+money(b.price)+' = '+money(b.total),20,y,344,19);y=wrap(ctx,'CORRECCIÓN: '+(dq<0?'-':'+')+traceQty(Math.abs(dq),u)+' · '+(dt<0?'-':'+')+money(Math.abs(dt)),20,y,344,19);y=wrap(ctx,'RESULTADO: '+traceQty(a.qty,u)+' = '+money(a.total),20,y,344,19);y=wrap(ctx,'Motivo: '+String(q.reason||'Sin motivo'),20,y,344,19)}
        line(ctx,y+3,1);y+=24;
      });
    }
    line(ctx,y,2);y+=34;ctx.font='900 22px Arial';center(ctx,'GRÀCIES PER LA COMPRA!',y,ctx.font);y+=32;if(copy){ctx.font='900 24px Arial';center(ctx,'*** COPIA ***',y,ctx.font)}
    return c;
  }
  function install(){
    if(window.__fusionFase6V7)return;
    if(typeof window.openTicket58Image!=='function')return setTimeout(install,120);
    window.__fusionFase6V7=true;
    window.openTicket58Image=async function(id,copy=false){
      let t=(typeof tickets!=='undefined')?tickets.find(x=>String(x.id)===String(id)):null;
      if(!t)return alert('Ticket no encontrado.');
      try{let canvas=await build(t,copy);canvas.toBlob(blob=>{if(!blob)return alert('No se pudo generar la imagen 58 mm.');if(current&&current.url)URL.revokeObjectURL(current.url);let url=URL.createObjectURL(blob);current={url,filename:'ticket_'+numTicket(t.number)+'_'+(copy?'copia_':'')+'58mm.png'};modal('<h2>'+(copy?'Copia':'Ticket')+' 58 mm · nº '+esc(numTicket(t.number))+'</h2><p class="notice"><b>Imagen PNG preparada para Fun Print.</b></p><div style="background:#eee;padding:10px;text-align:center;border-radius:12px"><img src="'+url+'" alt="Ticket 58 mm" style="width:min(100%,384px);height:auto;background:white"></div><div class="grid two" style="margin-top:12px"><button class="primary" onclick="downloadTicket58Current()">DESCARGAR IMAGEN 58 mm</button><button onclick="openTicket58Current()">ABRIR IMAGEN</button></div><p><button onclick="openStoredTicket(\''+String(t.id)+'\')">Volver al ticket</button> <button onclick="closeModal();render()">Cerrar</button></p>')} ,'image/png')}catch(e){console.error(e);alert('No se pudo generar el ticket 58 mm.')}
    };
    window.downloadTicket58Current=function(){if(!current||!current.url)return alert('Primero genera el ticket.');let a=document.createElement('a');a.href=current.url;a.download=current.filename;document.body.appendChild(a);a.click();a.remove()};
    window.openTicket58Current=function(){if(!current||!current.url)return alert('Primero genera el ticket.');window.open(current.url,'_blank','noopener')};
  }
  install();
})();