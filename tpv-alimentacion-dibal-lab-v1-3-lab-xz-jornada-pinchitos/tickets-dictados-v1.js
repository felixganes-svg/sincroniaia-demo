// SINCRONIAIA · TICKETS DICTADOS · IMPORTADOR v1
function dictatedBatch(){return Array.isArray(window.SINCRONIAIA_DICTATED_TICKETS)?window.SINCRONIAIA_DICTATED_TICKETS:[]}
function dictatedImported(){return tickets.filter(t=>t&&t.dictatedRef)}
function dictatedNextNumber(){
  return String(Math.max(0,...tickets.map(t=>Number(t.number)||0))+1).padStart(4,'0')
}
function dictatedLine(raw){
  const code=normalizeProductCode(raw.code||''),p=products.find(x=>x.code===code);
  const unit=raw.unit||(p&&p.unit)||'ud',qty=Number(raw.qty);
  const price=Number(raw.price!==undefined?raw.price:(p&&p.price));
  const total=raw.total!==undefined?Number(raw.total):round(qty*price);
  if(!code||!Number.isFinite(qty)||qty<=0||!Number.isFinite(price)||price<0||!Number.isFinite(total))throw new Error('Línea inválida');
  return {code,name:raw.name||(p&&p.name)||('Artículo '+code),qty,unit,price,normalTotal:raw.normalTotal!==undefined?Number(raw.normalTotal):round(qty*price),discount:Number(raw.discount)||0,total,direct:Boolean(raw.direct),area:raw.area||(p&&p.area)||''}
}
function buildDictatedTicket(raw,sequence=0){
  if(!raw||!String(raw.ref||'').trim())throw new Error('Falta referencia única');
  if(!String(raw.date||'').trim())throw new Error('Falta fecha/hora');
  if(!String(raw.seller||'').trim())throw new Error('Falta vendedor');
  if(!String(raw.method||'').trim())throw new Error('Falta forma de pago');
  if(!Array.isArray(raw.items)||!raw.items.length)throw new Error('Faltan líneas');
  const items=raw.items.map(dictatedLine);
  const calculated=round(items.reduce((s,l)=>s+Number(l.total||0),0));
  const total=raw.total!==undefined?Number(raw.total):calculated;
  if(!Number.isFinite(total)||Math.abs(total-calculated)>0.02)throw new Error('El total no cuadra con las líneas');
  let requested=String(raw.number||'').trim();
  let number=requested&&/^\d+$/.test(requested)&&!tickets.some(t=>String(t.number)===requested)?requested.padStart(4,'0'):dictatedNextNumber();
  const id=Date.now()+sequence;
  const method=String(raw.method).trim();
  const cashGiven=method==='Efectivo'?(raw.cashGiven!==undefined?Number(raw.cashGiven):total):null;
  const change=method==='Efectivo'?round(cashGiven-total):null;
  if(method==='Efectivo'&&(!Number.isFinite(cashGiven)||cashGiven<total))throw new Error('Efectivo entregado insuficiente');
  return {
    id,number,date:String(raw.date),seller:String(raw.seller),method,total,
    cashGiven,change,automaticDiscount:Number(raw.automaticDiscount)||0,
    automaticDiscountName:String(raw.automaticDiscountName||''),
    offerDiscount:Number(raw.offerDiscount)||0,items,
    dictatedRef:String(raw.ref),dictatedOriginalNumber:requested||null,
    dictatedImportedAt:new Date().toISOString(),dictated:true
  }
}
function applyDictatedTicketImports(){
  const batch=dictatedBatch();let added=0,errors=[];
  batch.forEach((raw,i)=>{
    if(tickets.some(t=>String(t.dictatedRef||'')===String(raw.ref||'')))return;
    try{tickets.unshift(buildDictatedTicket(raw,i));added++}
    catch(e){errors.push({ref:String(raw&&raw.ref||'?'),error:String(e.message||e)})}
  });
  window.SINCRONIAIA_LAST_DICTATED_IMPORT={added,errors,batch:batch.length};
  return window.SINCRONIAIA_LAST_DICTATED_IMPORT
}
function dictatedTicketsModal(){
  const batch=dictatedBatch(),imported=dictatedImported(),last=window.SINCRONIAIA_LAST_DICTATED_IMPORT||{added:0,errors:[],batch:batch.length};
  modal(`<h2>Ventas dictadas</h2>
    <p class="notice"><b>Importación automática y única.</b> Cada venta lleva una referencia interna; volver a abrir la LAB no duplica el ticket.</p>
    <div class="grid three">
      <div class="locked"><b>${batch.length}</b><br><small>tickets publicados en lote</small></div>
      <div class="locked"><b>${imported.length}</b><br><small>tickets dictados importados</small></div>
      <div class="locked"><b>${last.errors.length}</b><br><small>errores de importación</small></div>
    </div>
    ${imported.length?imported.map(t=>`<div class="line"><div><b>Ticket ${esc(t.number)} · ${euro(t.total)}</b><br><small>${esc(t.date)} · ${esc(t.seller)} · ${esc(t.method)} · ref. ${esc(t.dictatedRef)}</small></div><button onclick="openStoredTicket('${t.id}')">Ver</button></div>`).join(''):'<p>Aún no hay tickets reales dictados. El importador está preparado.</p>'}
    ${last.errors.length?'<p class="warn"><b>Hay tickets bloqueados por datos incompletos o descuadre.</b></p>':''}
    <p><button onclick="closeModal()">Cerrar</button></p>`)
}

// ===== REVISION 11/09/2026 · UX ENCARGOS =====
(function(){
  const renderVentaBeforeOrderUx=renderVenta;
  renderVenta=function(app,bar){
    renderVentaBeforeOrderUx(app,bar);
    const title=app?.querySelector('.saleTop strong')?.textContent||'';
    if(title.includes('TICKET APARCADO')||title.includes('BANDEJA APARCADA')){
      const topPark=[...app.querySelectorAll('.saleTop button')].find(b=>(b.textContent||'').trim()==='APARCAR');
      if(topPark)topPark.remove();
      const bottomPark=[...bar.querySelectorAll('button')].find(b=>(b.textContent||'').trim()==='APARCAR TICKET');
      if(bottomPark)bottomPark.textContent='APARCAR ENCARGO';
    }
  };

  const openOrderBeforeOrderUx=openOrder;
  openOrder=function(id){
    openOrderBeforeOrderUx(id);
    const o=orders.find(x=>String(x.id)===String(id));
    if(!o||!o.ticketId)return;
    const t=tickets.find(x=>String(x.id)===String(o.ticketId));
    if(!t)return;
    const prepared=round(orderPreparedTotal(o));
    const extra=round((t.items||[]).filter(l=>l&&l.orderExtra).reduce((s,l)=>s+Number(l.total||0),0));
    if(extra<=0)return;
    const box=document.getElementById('modalBox');
    if(!box)return;
    const venta=[...box.querySelectorAll('.panel')].find(p=>p.querySelector('h3')?.textContent.trim()==='Venta generada');
    if(!venta)return;
    const total=round(Number(t.total)||0);
    const summary=document.createElement('div');
    summary.className='panel';
    summary.innerHTML='<h3>Resumen del cobro</h3>'+
      '<div class="totals">'+
        '<div><span>Encargo preparado</span><b>'+euro(prepared)+'</b></div>'+
        '<div><span>Compra adicional</span><b>'+euro(extra)+'</b></div>'+
        '<div class="final"><span>'+(t.paymentStatus==='Pendiente'?'TOTAL A COBRAR':'TOTAL TICKET')+'</span><b>'+euro(total)+'</b></div>'+
      '</div>';
    venta.parentNode.insertBefore(summary,venta);
  };
})();
// ===== FIN REVISION UX ENCARGOS =====

// ===== REVISION 11/09/2026 · CIERRE TICKET ENCARGO CON DOS DESTINOS =====
(function(){
  function closeOrderReceiptToSale(){
    extraOrderSaleContext=null;
    parkedOrderContext=null;
    closeModal();
    screen='venta';role='venta';area='Carne';subcat='';azScope=null;atRoot=true;
    render();
  }
  window.closeOrderReceiptToSale=closeOrderReceiptToSale;

  wireOrderReceiptClose=function(orderId){
    setTimeout(()=>{
      const box=document.getElementById('modalBox');
      if(!box)return;
      const buttons=[...box.querySelectorAll('button')];
      const closeBtn=buttons.find(b=>/^cerrar/i.test((b.textContent||'').trim()));
      if(!closeBtn)return;
      closeBtn.textContent='CERRAR';
      closeBtn.onclick=()=>closeOrderReceiptToSale();
      let backBtn=[...box.querySelectorAll('button')].find(b=>(b.textContent||'').trim()==='VOLVER A ENCARGOS');
      if(!backBtn){
        backBtn=document.createElement('button');
        backBtn.textContent='VOLVER A ENCARGOS';
        backBtn.onclick=()=>closeOrderReceiptToOrders(orderId);
        closeBtn.insertAdjacentElement('afterend',backBtn);
      }
    },0);
  };
  window.wireOrderReceiptClose=wireOrderReceiptClose;
})();
// ===== FIN REVISION CIERRE TICKET ENCARGO =====
