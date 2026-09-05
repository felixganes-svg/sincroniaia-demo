
// SINCRONIAIA · LAB ENCARGOS TICKET ABIERTO v0.1
(function(){
const ENC_PREFIX='tpv_lab_encargos_libreta_v1_';

function encLineId(){return 'L'+Date.now().toString(36)+Math.random().toString(36).slice(2,6)}
function encGroupId(){return 'G'+Date.now().toString(36)+Math.random().toString(36).slice(2,6)}
function encStatusLabel(o){return o.status||'Pendiente'}
function orderAllLines(o){
  let out=[...(o.items||[])];
  (o.groups||[]).forEach(g=>(g.items||[]).forEach(l=>out.push(l)));
  return out;
}
function orderGroupForLine(o,lineId){
  return (o.groups||[]).find(g=>(g.items||[]).some(l=>String(l.id)===String(lineId)))||null;
}
function findOrderLine(o,lineId){
  let l=(o.items||[]).find(x=>String(x.id)===String(lineId));
  if(l)return l;
  for(const g of (o.groups||[])){l=(g.items||[]).find(x=>String(x.id)===String(lineId));if(l)return l}
  return null;
}
function effectiveProductForLine(l){
  let code=l.substituteCode||l.code;
  return products.find(p=>p.code===code)||null;
}
function orderPreparedTotal(o){
  return round(orderAllLines(o).reduce((s,l)=>s+Number(l.total||0),0));
}
function orderLinesReady(o){
  let ls=orderAllLines(o);
  return ls.length>0&&ls.every(l=>l.status==='Preparado'||l.status==='No servido');
}
function orderHasServedLines(o){
  return orderAllLines(o).some(l=>l.status==='Preparado'&&Number(l.qty)>0);
}
function displayQty(q,u){
  if(q===null||q===undefined||q==='')return 'Pendiente';
  return u==='kg'?Number(q).toFixed(3).replace('.',',')+' kg':String(Number(q)).replace('.',',')+' ud';
}
function lineRequestedText(l){
  if(l.requestedQty===null||l.requestedQty===undefined||l.requestedQty==='')return 'Cantidad/peso pendiente';
  return 'Solicitado: '+displayQty(l.requestedQty,l.unit);
}
function lineEffectiveName(l){
  return l.substituteName||l.name;
}
function lineStateHtml(l){
  let sub=l.substituteName?'<br><small><b>Sustituido:</b> '+esc(l.name)+' → '+esc(l.substituteName)+'</small>':'';
  let note=l.prepNotes?'<br><small>Preparación: '+esc(l.prepNotes)+'</small>':'';
  if(l.status==='Preparado'){
    return '<small>'+displayQty(l.qty,l.effectiveUnit||l.unit)+' × '+euro(l.price)+'/'+esc(l.effectiveUnit||l.unit)+' = <b>'+euro(l.total)+'</b></small>'+sub+note;
  }
  if(l.status==='No servido'){
    return '<small><b>NO SERVIDO · cantidad 0 · 0,00 €</b></small>'+sub+note;
  }
  return '<small>'+esc(lineRequestedText(l))+' · <b>Pendiente de preparar</b></small>'+sub+note;
}
function groupTitle(g){
  if(g.type==='tray')return g.name||('Bandeja '+(g.people||'')+' personas');
  return g.name||'Grupo';
}

pilotSnapshot=function(){
  return {version:2,savedAt:new Date().toISOString(),company,sellers,products,tickets,zReports,sellerMems,customSubsections,orders};
};
persistPilotState=function(){};
save=function(){
  localStorage.setItem(ENC_PREFIX+'company',JSON.stringify(company));
  localStorage.setItem(ENC_PREFIX+'sellers',JSON.stringify(sellers));
  localStorage.setItem(ENC_PREFIX+'products',JSON.stringify(products));
  localStorage.setItem(ENC_PREFIX+'tickets',JSON.stringify(tickets));
  localStorage.setItem(ENC_PREFIX+'zReports',JSON.stringify(zReports));
  localStorage.setItem(ENC_PREFIX+'sellerMems',JSON.stringify(sellerMems));
  localStorage.setItem(ENC_PREFIX+'customSubsections',JSON.stringify(customSubsections));
  localStorage.setItem(ENC_PREFIX+'orders',JSON.stringify(orders));
};
restorePilotState=function(){
  try{
    let initialized=localStorage.getItem(ENC_PREFIX+'initialized');
    if(initialized){
      company=JSON.parse(localStorage.getItem(ENC_PREFIX+'company')||JSON.stringify(company));
      sellers=JSON.parse(localStorage.getItem(ENC_PREFIX+'sellers')||JSON.stringify(sellers));
      products=JSON.parse(localStorage.getItem(ENC_PREFIX+'products')||JSON.stringify(products));
      tickets=JSON.parse(localStorage.getItem(ENC_PREFIX+'tickets')||'[]');
      zReports=JSON.parse(localStorage.getItem(ENC_PREFIX+'zReports')||'[]');
      sellerMems=JSON.parse(localStorage.getItem(ENC_PREFIX+'sellerMems')||'{}');
      customSubsections=JSON.parse(localStorage.getItem(ENC_PREFIX+'customSubsections')||'{}');
      orders=JSON.parse(localStorage.getItem(ENC_PREFIX+'orders')||'[]');
    }else{
      tickets=[];
      zReports=[];
      orders=[];
      sellerMems={};
      sellers=sellers.map(s=>({...s,active:false}));
      localStorage.setItem(ENC_PREFIX+'initialized','1');
    }
    ensureMems();
    ensureEnabledSubsections();
    pilotReady=true;
    save();
  }catch(e){
    console.warn('LAB Encargos: no se pudo restaurar el estado',e);
    pilotReady=true;
  }
  render();
};

ordersModal=function(){
  let sorted=[...orders].sort((a,b)=>(a.pickupDate+' '+(a.pickupTime||'')).localeCompare(b.pickupDate+' '+(b.pickupTime||'')));
  modal('<h2>Encargos</h2>'+
    '<p class="notice"><b>ENCARGO = ticket abierto.</b> Se añaden artículos ahora y los pesos/cantidades reales se incorporan al preparar. Al finalizar la preparación se genera la venta y el ticket con importe cerrado.</p>'+
    '<div class="grid two"><button class="primary" onclick="newOrderModal()">+ NUEVO ENCARGO</button>'+
    '<input id="orderQuery" placeholder="Buscar cliente, teléfono, fecha o nº" oninput="refreshOrderList()"></div>'+
    '<div id="orderList">'+orderRows(sorted)+'</div>'+
    '<p><button onclick="closeModal()">Cerrar</button></p>');
};
orderRows=function(list){
  if(!list.length)return '<p>No hay encargos.</p>';
  return list.map(o=>{
    let total=orderPreparedTotal(o);
    let ticket=o.ticketNumber?' · Ticket '+esc(o.ticketNumber):'';
    return '<div class="line"><div><b>'+esc(o.number)+' · '+esc(o.customer)+'</b><br><small>'+
      esc(o.pickupDate)+' '+esc(o.pickupTime||'')+' · '+esc(o.phone||'Sin teléfono')+
      '<br><b>'+esc(encStatusLabel(o))+'</b>'+ticket+(o.ticketNumber?' · '+euro(total):'')+
      '</small></div><button onclick="openOrder(\''+o.id+'\')">Abrir</button></div>';
  }).join('');
};
refreshOrderList=function(){
  let q=(document.getElementById('orderQuery')?.value||'').toLowerCase();
  let list=orders.filter(o=>((o.number||'')+' '+(o.customer||'')+' '+(o.phone||'')+' '+(o.pickupDate||'')+' '+(o.status||'')).toLowerCase().includes(q));
  document.getElementById('orderList').innerHTML=orderRows(list);
};
newOrderModal=function(){
  let active=activeSellers();
  modal('<h2>Nuevo encargo</h2>'+
    '<div class="grid two">'+
      '<div><label>Cliente</label><input id="orderCustomer"></div>'+
      '<div><label>Teléfono</label><input id="orderPhone" inputmode="tel"></div>'+
      '<div><label>Fecha recogida</label><input id="orderDate" type="date"></div>'+
      '<div><label>Hora aproximada</label><input id="orderTime" type="time"></div>'+
    '</div>'+
    '<label>Observaciones generales</label><textarea id="orderNotes" rows="2" placeholder="Ej: lo recogerá su hija; entregar en dos bolsas"></textarea>'+
    '<label>Vendedor que recoge el encargo</label><select id="orderSeller">'+active.map(s=>'<option>'+esc(s.name)+'</option>').join('')+'</select>'+
    (active.length?'':'<p class="warn">Debes iniciar un vendedor antes de registrar el encargo.</p>')+
    '<p><button class="primary" '+(active.length?'':'disabled')+' onclick="createOrder()">GUARDAR Y AÑADIR ARTÍCULOS</button> <button onclick="ordersModal()">Cancelar</button></p>');
};
createOrder=function(){
  let customer=(document.getElementById('orderCustomer')?.value||'').trim();
  let pickupDate=document.getElementById('orderDate')?.value||'';
  let seller=document.getElementById('orderSeller')?.value||'';
  if(!customer||!pickupDate||!seller)return alert('Indica cliente, fecha de recogida y vendedor.');
  let n=nextOrderNumber();
  let o={
    id:Date.now(),number:'E-'+n,customer,
    phone:(document.getElementById('orderPhone')?.value||'').trim(),
    pickupDate,pickupTime:document.getElementById('orderTime')?.value||'',
    notes:(document.getElementById('orderNotes')?.value||'').trim(),
    createdAt:new Date().toLocaleString('es-ES'),createdBy:seller,
    status:'Pendiente',items:[],groups:[],ticketNumber:null,ticketId:null
  };
  orders.unshift(o);save();openOrder(o.id);
};

function topLineHtml(o,l){
  return '<div class="line"><div><b>'+esc(l.name)+'</b><br>'+lineStateHtml(l)+'</div>'+
    '<div>'+(l.status==='Preparado'?'<b>'+euro(l.total)+'</b><br>':'')+
    (!o.ticketId?'<button onclick="prepareOrderLine(\''+o.id+'\',\''+l.id+'\')">'+(l.status==='Pendiente'?'PREPARAR':'MODIFICAR')+'</button>':'')+
    '</div></div>';
}
function groupHtml(o,g){
  let rows=(g.items||[]).map(l=>topLineHtml(o,l)).join('')||'<p class="muted">Todavía no hay productos en esta bandeja.</p>';
  return '<div class="panel"><h3>'+esc(groupTitle(g))+'</h3>'+
    (g.notes?'<p><small>'+esc(g.notes)+'</small></p>':'')+
    rows+
    (!o.ticketId?'<p><button onclick="orderAddProduct(\''+o.id+'\',\''+g.id+'\')">+ AÑADIR PRODUCTO A LA BANDEJA</button></p>':'')+
    '</div>';
}
openOrder=function(id){
  let o=orders.find(x=>String(x.id)===String(id));
  if(!o)return alert('Encargo no encontrado.');
  let total=orderPreparedTotal(o);
  let lines=orderAllLines(o);
  let top=(o.items||[]).map(l=>topLineHtml(o,l)).join('');
  let groups=(o.groups||[]).map(g=>groupHtml(o,g)).join('');
  let controls='';
  if(o.ticketId){
    let t=tickets.find(x=>String(x.id)===String(o.ticketId));
    controls='<div class="panel"><h3>Venta generada</h3><p class="notice"><b>Ticket nº '+esc(o.ticketNumber)+'</b> · Importe cerrado: <b>'+euro(t?.total??total)+'</b><br>Pago: <b>'+esc(t?.paymentStatus||'Pendiente')+'</b></p>'+
      (t?.paymentStatus==='Pendiente'?'<button class="primary" onclick="chargePreparedOrder(\''+o.id+'\')">COBRAR TICKET</button>':'')+
      (t?.paymentStatus==='Cobrado'&&o.status!=='Entregado'?'<button class="green" onclick="markOrderDelivered(\''+o.id+'\')">MARCAR ENTREGADO</button>':'')+
      '<button onclick="openStoredTicket(\''+(o.ticketId||'')+'\')">Ver ticket</button></div>';
  }else{
    controls='<div class="grid two">'+
      '<button onclick="orderAddProduct(\''+o.id+'\',null)">+ AÑADIR ARTÍCULO</button>'+
      '<button onclick="newOrderTrayModal(\''+o.id+'\')">+ AÑADIR BANDEJA</button>'+
      '<button class="primary" '+(orderLinesReady(o)&&orderHasServedLines(o)?'':'disabled')+' onclick="finalizeOrderPreparation(\''+o.id+'\')">FINALIZAR PREPARACIÓN</button>'+
      '<button onclick="ordersModal()">Volver a encargos</button>'+
      '</div>';
  }
  modal('<h2>'+esc(o.number)+' · '+esc(o.customer)+'</h2>'+
    '<p><b>Recogida:</b> '+esc(o.pickupDate)+' '+esc(o.pickupTime||'')+
    '<br><b>Teléfono:</b> '+esc(o.phone||'—')+
    '<br><b>Vendedor:</b> '+esc(o.createdBy)+
    '<br><b>Estado:</b> '+esc(o.status)+
    (o.notes?'<br><b>Observaciones:</b> '+esc(o.notes):'')+'</p>'+
    (top?'<div class="panel"><h3>Artículos</h3>'+top+'</div>':'')+
    groups+
    (!lines.length?'<p class="notice">Añade artículos normales o una bandeja. El peso/cantidad puede quedar pendiente hasta la preparación.</p>':'')+
    '<h2>Total preparado: '+euro(total)+'</h2>'+controls);
};

orderAddProduct=function(id,groupId){
  modal('<h2>Añadir artículo al encargo</h2>'+
    '<label>Buscar por nombre o código</label><input id="orderProductSearch" autofocus placeholder="Ej: Havarti, chorizo, 000020" oninput="refreshOrderProductSearch(\''+id+'\',\''+(groupId||'')+'\')">'+
    '<div id="orderProductResults">'+orderProductSearchRows(id,'',groupId)+'</div>'+
    '<p><button onclick="openOrder(\''+id+'\')">Cancelar</button></p>');
  setTimeout(()=>document.getElementById('orderProductSearch')?.focus(),50);
};
window.orderProductSearchRows=function(id,q,groupId){
  q=(q||'').trim().toLowerCase();
  let list=products.filter(p=>p.active!==false&&(!q||(p.name+' '+p.code+' '+p.area+' '+p.subcat).toLowerCase().includes(q))).slice(0,30);
  if(!list.length)return '<p>No encontrado.</p>';
  return list.map(p=>'<div class="line"><div><b>'+esc(p.name)+'</b><br><small>'+esc(p.code)+' · '+euro(p.price)+'/'+esc(p.unit)+'</small></div>'+
    '<button onclick="orderSelectProduct(\''+id+'\',\''+p.code+'\',\''+(groupId||'')+'\')">Añadir</button></div>').join('');
};
window.refreshOrderProductSearch=function(id,groupId){
  let q=document.getElementById('orderProductSearch')?.value||'';
  document.getElementById('orderProductResults').innerHTML=orderProductSearchRows(id,q,groupId||null);
};
window.orderSelectProduct=function(id,code,groupId){
  let p=products.find(x=>x.code===code);
  if(!p)return alert('Artículo no encontrado.');
  modal('<h2>'+esc(p.name)+'</h2><p>Precio actual: '+euro(p.price)+' / '+esc(p.unit)+' <small>(el precio definitivo será el vigente al preparar)</small></p>'+
    '<label>Cantidad/peso solicitado (opcional)</label>'+
    '<input id="orderRequestedQty" type="number" inputmode="decimal" step="'+(p.unit==='kg'?'0.001':'1')+'" placeholder="Puede quedar vacío">'+
    '<label>Preparación / observaciones de esta línea</label><input id="orderLineNotes" placeholder="Ej: cortar fino, 4 filetes, sin hueso">'+
    '<p><button class="primary" onclick="saveOrderRequestedProduct(\''+id+'\',\''+code+'\',\''+(groupId||'')+'\')">AÑADIR AL ENCARGO</button> <button onclick="openOrder(\''+id+'\')">Cancelar</button></p>');
};
window.saveOrderRequestedProduct=function(id,code,groupId){
  let o=orders.find(x=>String(x.id)===String(id)),p=products.find(x=>x.code===code);
  if(!o||!p||o.ticketId)return alert('No se puede modificar este encargo.');
  let raw=(document.getElementById('orderRequestedQty')?.value||'').trim();
  let requested=raw===''?null:Number(raw);
  if(requested!==null&&(!Number.isFinite(requested)||requested<0))return alert('Cantidad/peso solicitado no válido.');
  let l={
    id:encLineId(),code:p.code,name:p.name,unit:p.unit,
    requestedQty:requested,prepNotes:(document.getElementById('orderLineNotes')?.value||'').trim(),
    status:'Pendiente',qty:null,price:null,total:0,normalTotal:0,discount:0
  };
  let g=(o.groups||[]).find(x=>String(x.id)===String(groupId));
  if(g)g.items.push(l);else o.items.push(l);
  o.status='Pendiente';save();openOrder(o.id);
};

window.newOrderTrayModal=function(id){
  modal('<h2>Nueva bandeja</h2>'+
    '<div class="grid two"><div><label>Personas</label><input id="trayPeople" type="number" inputmode="numeric" min="1" value="6"></div>'+
    '<div><label>Nombre opcional</label><input id="trayName" placeholder="Ej: Bandeja ibérica"></div></div>'+
    '<label>Observaciones de la bandeja</label><input id="trayNotes" placeholder="Ej: cortar fino; colocar separado">'+
    '<p><button class="primary" onclick="createOrderTray(\''+id+'\')">CREAR BANDEJA</button> <button onclick="openOrder(\''+id+'\')">Cancelar</button></p>');
};
window.createOrderTray=function(id){
  let o=orders.find(x=>String(x.id)===String(id));if(!o||o.ticketId)return;
  let people=Math.max(1,Number(document.getElementById('trayPeople')?.value||1));
  let custom=(document.getElementById('trayName')?.value||'').trim();
  let g={id:encGroupId(),type:'tray',people,name:custom||('Bandeja '+people+' personas'),notes:(document.getElementById('trayNotes')?.value||'').trim(),items:[]};
  o.groups=o.groups||[];o.groups.push(g);save();orderAddProduct(o.id,g.id);
};

window.prepareOrderLine=function(orderId,lineId){
  let o=orders.find(x=>String(x.id)===String(orderId)),l=o&&findOrderLine(o,lineId);
  if(!o||!l||o.ticketId)return alert('Línea no disponible.');
  let p=effectiveProductForLine(l);
  if(!p)return alert('El artículo ya no existe en el catálogo.');
  modal('<h2>Preparar · '+esc(lineEffectiveName(l))+'</h2>'+
    (l.substituteName?'<p class="warn">Solicitado: <b>'+esc(l.name)+'</b><br>Sustituto: <b>'+esc(l.substituteName)+'</b></p>':'')+
    '<p>'+esc(lineRequestedText(l))+'<br>Precio vigente ahora: <b>'+euro(p.price)+' / '+esc(p.unit)+'</b></p>'+
    '<label>'+(p.unit==='kg'?'Peso real preparado (kg)':'Unidades reales preparadas')+'</label>'+
    '<input id="preparedQty" type="number" inputmode="decimal" step="'+(p.unit==='kg'?'0.001':'1')+'" value="'+(l.status==='Preparado'?l.qty:'')+'" autofocus>'+
    '<p><button class="primary" onclick="savePreparedOrderLine(\''+orderId+'\',\''+lineId+'\')">GUARDAR LÍNEA</button>'+
    ' <button onclick="markOrderLineZero(\''+orderId+'\',\''+lineId+'\')">CANTIDAD 0 · NO SERVIR</button>'+
    ' <button onclick="substituteOrderLine(\''+orderId+'\',\''+lineId+'\')">SUSTITUIR ARTÍCULO</button>'+
    ' <button onclick="openOrder(\''+orderId+'\')">Cancelar</button></p>');
  setTimeout(()=>document.getElementById('preparedQty')?.focus(),50);
};
window.savePreparedOrderLine=function(orderId,lineId){
  let o=orders.find(x=>String(x.id)===String(orderId)),l=o&&findOrderLine(o,lineId),p=l&&effectiveProductForLine(l);
  if(!o||!l||!p||o.ticketId)return alert('Línea no disponible.');
  let qty=Number(document.getElementById('preparedQty')?.value);
  if(!Number.isFinite(qty)||qty<=0)return alert('Introduce un peso/cantidad mayor que 0.');
  let calc=calcLine(p,qty);
  l.qty=qty;l.effectiveUnit=p.unit;l.price=p.price;l.normalTotal=calc.normal;l.total=calc.total;l.discount=calc.disc;l.offerLabel=calc.label;l.offerPrice=calc.appliedPrice;l.status='Preparado';l.preparedAt=new Date().toLocaleString('es-ES');
  o.status=orderLinesReady(o)?'Preparado para finalizar':'En preparación';save();openOrder(o.id);
};
window.markOrderLineZero=function(orderId,lineId){
  let o=orders.find(x=>String(x.id)===String(orderId)),l=o&&findOrderLine(o,lineId);
  if(!o||!l||o.ticketId)return;
  if(!confirm('Esta línea quedará como NO SERVIDA, cantidad 0 e importe 0,00 €. ¿Continuar?'))return;
  l.qty=0;l.price=0;l.normalTotal=0;l.total=0;l.discount=0;l.status='No servido';l.notServedAt=new Date().toLocaleString('es-ES');
  o.status=orderLinesReady(o)?'Preparado para finalizar':'En preparación';save();openOrder(o.id);
};
window.substituteOrderLine=function(orderId,lineId){
  modal('<h2>Sustituir artículo</h2><p class="notice">El artículo originalmente solicitado se conservará como referencia.</p>'+
    '<input id="subProductSearch" autofocus placeholder="Buscar sustituto..." oninput="refreshSubProductSearch(\''+orderId+'\',\''+lineId+'\')">'+
    '<div id="subProductResults">'+subProductSearchRows(orderId,lineId,'')+'</div>'+
    '<p><button onclick="prepareOrderLine(\''+orderId+'\',\''+lineId+'\')">Cancelar</button></p>');
};
window.subProductSearchRows=function(orderId,lineId,q){
  q=(q||'').trim().toLowerCase();
  let o=orders.find(x=>String(x.id)===String(orderId)),l=o&&findOrderLine(o,lineId);
  let list=products.filter(p=>p.active!==false&&p.code!==l?.code&&(!q||(p.name+' '+p.code).toLowerCase().includes(q))).slice(0,30);
  return list.map(p=>'<div class="line"><div><b>'+esc(p.name)+'</b><br><small>'+esc(p.code)+' · '+euro(p.price)+'/'+esc(p.unit)+'</small></div>'+
    '<button onclick="selectOrderSubstitute(\''+orderId+'\',\''+lineId+'\',\''+p.code+'\')">Usar</button></div>').join('')||'<p>No encontrado.</p>';
};
window.refreshSubProductSearch=function(orderId,lineId){
  document.getElementById('subProductResults').innerHTML=subProductSearchRows(orderId,lineId,document.getElementById('subProductSearch')?.value||'');
};
window.selectOrderSubstitute=function(orderId,lineId,code){
  let o=orders.find(x=>String(x.id)===String(orderId)),l=o&&findOrderLine(o,lineId),p=products.find(x=>x.code===code);
  if(!o||!l||!p||o.ticketId)return;
  l.substituteCode=p.code;l.substituteName=p.name;l.substituteUnit=p.unit;l.status='Pendiente';l.qty=null;l.price=null;l.total=0;l.normalTotal=0;l.discount=0;
  save();prepareOrderLine(orderId,lineId);
};

window.finalizeOrderPreparation=function(id){
  let o=orders.find(x=>String(x.id)===String(id));
  if(!o||o.ticketId)return alert('Este encargo ya ha generado una venta.');
  if(!orderLinesReady(o))return alert('Todavía quedan líneas pendientes de preparar.');
  if(!orderHasServedLines(o))return alert('No hay ningún artículo servido. No se puede generar una venta a 0,00 €.');
  let active=activeSellers();
  modal('<h2>Finalizar preparación · '+esc(o.number)+'</h2>'+
    '<p class="warn"><b>Esta acción genera la venta y el ticket.</b> Pesos, cantidades, precios e importe quedarán cerrados. Cualquier corrección posterior se hará mediante Rectificación.</p>'+
    '<h2>Total definitivo: '+euro(orderPreparedTotal(o))+'</h2>'+
    '<label>Vendedor que finaliza la preparación</label><select id="preparedBySeller">'+active.map(s=>'<option>'+esc(s.name)+'</option>').join('')+'</select>'+
    (active.length?'':'<p class="warn">Debe haber un vendedor iniciado.</p>')+
    '<p><button class="primary" '+(active.length?'':'disabled')+' onclick="confirmFinalizeOrderPreparation(\''+id+'\')">GENERAR VENTA + TICKET</button> <button onclick="openOrder(\''+id+'\')">Cancelar</button></p>');
};
window.confirmFinalizeOrderPreparation=function(id){
  let o=orders.find(x=>String(x.id)===String(id));if(!o||o.ticketId)return;
  let seller=document.getElementById('preparedBySeller')?.value||'';if(!seller)return alert('Selecciona vendedor.');
  let saleItems=[];
  (o.items||[]).forEach(l=>{if(l.status==='Preparado'&&Number(l.qty)>0)saleItems.push(orderLineToTicket(l,null))});
  (o.groups||[]).forEach(g=>(g.items||[]).forEach(l=>{if(l.status==='Preparado'&&Number(l.qty)>0)saleItems.push(orderLineToTicket(l,g))}));
  let total=round(saleItems.reduce((s,l)=>s+Number(l.total||0),0));
  let number=String(Math.max(0,...tickets.map(x=>Number(x.number)||0))+1).padStart(4,'0');
  let now=new Date().toLocaleString('es-ES');
  let t={
    id:Date.now(),number,date:now,seller,method:'Pendiente de cobro',paymentStatus:'Pendiente',
    total,cashGiven:null,change:null,automaticDiscount:0,automaticDiscountName:'',offerDiscount:offerDiscount(saleItems),
    orderNumber:o.number,items:saleItems
  };
  tickets.unshift(t);
  o.status='Preparado · pendiente de cobro';o.preparedAt=now;o.preparedBy=seller;o.ticketNumber=number;o.ticketId=t.id;
  save();
  modal(preparedOrderTicketHtml(o,t)+'<button onclick="openOrder(\''+o.id+'\')">Volver al encargo</button>');
};
window.orderLineToTicket=function(l,g){
  let name=lineEffectiveName(l);
  if(l.substituteName)name=name+' (sustituye '+l.name+')';
  if(g)name=groupTitle(g)+' · '+name;
  return {
    code:l.substituteCode||l.code,name,qty:l.qty,unit:l.effectiveUnit||l.unit,price:l.price,
    normalTotal:l.normalTotal,total:l.total,discount:l.discount||0,offerLabel:l.offerLabel||'',offerPrice:l.offerPrice||null,
    orderGroup:g?groupTitle(g):'',originalRequested:l.name,substituted:!!l.substituteName,time:new Date().toLocaleTimeString('es-ES')
  };
};
window.preparedOrderTicketHtml=function(o,t){
  return '<div id="printTicket"><h2>TICKET Nº '+esc(t.number)+'</h2>'+
    '<p><b>'+esc(company.name)+'</b><br>Encargo: '+esc(o.number)+'<br>'+esc(t.date)+'<br>Preparado por: '+esc(t.seller)+'</p>'+
    t.items.map(receiptLineHtml).join('')+
    '<div class="totals"><div class="final"><span>TOTAL CERRADO</span><b>'+euro(t.total)+'</b></div></div>'+
    '<p><b>Estado de pago: PENDIENTE DE COBRO</b></p></div>';
};

window.chargePreparedOrder=function(id){
  let o=orders.find(x=>String(x.id)===String(id)),t=o&&tickets.find(x=>String(x.id)===String(o.ticketId));
  if(!o||!t||t.paymentStatus!=='Pendiente')return alert('Este ticket ya no está pendiente de cobro.');
  let active=activeSellers();
  modal('<h2>Cobrar ticket nº '+esc(t.number)+'</h2><h2>Total cerrado: '+euro(t.total)+'</h2>'+
    '<p>Selecciona vendedor que cobra.</p><div class="sellerKeys">'+active.map(s=>'<button class="brand" onclick="orderPayment(\''+o.id+'\',\''+esc(s.name)+'\')">'+esc(s.name)+'</button>').join('')+'</div>'+
    (active.length?'':'<p class="warn">No hay vendedores iniciados.</p>')+
    '<p><button onclick="openOrder(\''+o.id+'\')">Cancelar</button></p>');
};
orderPayment=function(id,seller){
  let o=orders.find(x=>String(x.id)===String(id)),t=o&&tickets.find(x=>String(x.id)===String(o.ticketId));
  if(!o||!t)return;
  modal('<h2>Cobrar ticket nº '+esc(t.number)+'</h2><h2>Total: '+euro(t.total)+'</h2>'+
    '<div class="grid two"><button class="primary" onclick="orderCash(\''+o.id+'\',\''+esc(seller)+'\')">Efectivo</button>'+
    '<button onclick="finishOrderPay(\''+o.id+'\',\''+esc(seller)+'\',\'Tarjeta\')">Tarjeta</button>'+
    '<button onclick="finishOrderPay(\''+o.id+'\',\''+esc(seller)+'\',\'Bizum\')">Bizum</button>'+
    '<button onclick="finishOrderPay(\''+o.id+'\',\''+esc(seller)+'\',\'Mixto\')">Mixto</button></div>'+
    '<p><button onclick="chargePreparedOrder(\''+o.id+'\')">Volver</button></p>');
};
orderCash=function(id,seller){
  let o=orders.find(x=>String(x.id)===String(id)),t=o&&tickets.find(x=>String(x.id)===String(o.ticketId));
  if(!o||!t)return;
  modal('<h2>Pago efectivo · Ticket '+esc(t.number)+'</h2><h2>Total: '+euro(t.total)+'</h2>'+
    '<label>Entrega cliente</label><input id="orderCashGiven" type="number" inputmode="decimal" step="0.01" oninput="updateOrderCashChange(\''+id+'\')">'+
    '<h2>Devolución: <span id="orderChange">'+euro(0)+'</span></h2>'+
    '<button class="primary" onclick="finishOrderCash(\''+id+'\',\''+esc(seller)+'\')">FINALIZAR COBRO</button> <button onclick="orderPayment(\''+id+'\',\''+esc(seller)+'\')">Volver</button>');
};
window.updateOrderCashChange=function(id){
  let o=orders.find(x=>String(x.id)===String(id)),t=o&&tickets.find(x=>String(x.id)===String(o.ticketId)),el=document.getElementById('orderCashGiven');
  if(!t||!el)return;
  let raw=el.value.trim();
  if(raw===''){document.getElementById('orderChange').textContent=euro(0);return}
  let amount=Number(raw),d=amount-t.total;
  document.getElementById('orderChange').textContent=d<0?'Faltan '+euro(Math.abs(d)):euro(d);
};
window.finishOrderCash=function(id,seller){
  let o=orders.find(x=>String(x.id)===String(id)),t=o&&tickets.find(x=>String(x.id)===String(o.ticketId)),el=document.getElementById('orderCashGiven');
  if(!t||!el)return;
  let raw=el.value.trim(),amount=raw===''?t.total:Number(raw);
  if(!Number.isFinite(amount))return alert('Introduce un importe válido.');
  finishOrderPay(id,seller,'Efectivo',amount);
};
finishOrderPay=function(id,seller,method,cashGiven=0){
  let o=orders.find(x=>String(x.id)===String(id)),t=o&&tickets.find(x=>String(x.id)===String(o.ticketId));
  if(!o||!t||t.paymentStatus!=='Pendiente')return alert('El ticket ya no está pendiente de cobro.');
  if(method==='Efectivo'&&cashGiven<t.total)return alert('El importe entregado es insuficiente.');
  t.method=method;t.paymentStatus='Cobrado';t.cashGiven=method==='Efectivo'?cashGiven:null;t.change=method==='Efectivo'?round(cashGiven-t.total):null;t.paidAt=new Date().toLocaleString('es-ES');t.paidBy=seller;
  o.status='Cobrado · pendiente de entrega';o.paidAt=t.paidAt;o.paidBy=seller;
  save();modal(receiptHtml(t));
};
window.markOrderDelivered=function(id){
  let o=orders.find(x=>String(x.id)===String(id)),t=o&&tickets.find(x=>String(x.id)===String(o.ticketId));
  if(!o||!t||t.paymentStatus!=='Cobrado')return alert('Primero debe cobrarse el ticket.');
  o.status='Entregado';o.deliveredAt=new Date().toLocaleString('es-ES');save();openOrder(o.id);
};



// ===== ENCARGOS COMO TICKET APARCADO · MISMA NAVEGACIÓN QUE VENTA =====
let parkedOrderContext=null;
const baseRenderVenta=renderVenta;
const baseSelectProduct=selectProduct;
const baseDirectSaleModal=directSaleModal;
const baseOrdersModal=ordersModal;
const baseSetArea=setArea;

function parkedOrder(){
  return parkedOrderContext?orders.find(o=>String(o.id)===String(parkedOrderContext.orderId)):null;
}
function parkedGroup(){
  let o=parkedOrder();
  return o&&parkedOrderContext&&parkedOrderContext.groupId
    ?(o.groups||[]).find(g=>String(g.id)===String(parkedOrderContext.groupId))
    :null;
}
function parkedLineCount(){
  let o=parkedOrder();
  return o?orderAllLines(o).length:0;
}

window.startParkedOrderSelection=function(orderId,groupId=null){
  let o=orders.find(x=>String(x.id)===String(orderId));
  if(!o||o.ticketId)return alert('Este encargo ya ha generado un ticket de venta y no admite cambios.');
  parkedOrderContext={orderId:String(orderId),groupId:groupId?String(groupId):null};
  closeModal();
  screen='venta';role='venta';area='Carne';subcat='';azScope=null;atRoot=true;
  render();
};

window.parkCurrentOrder=function(){
  parkedOrderContext=null;
  screen='venta';atRoot=true;area='Carne';subcat='';azScope=null;
  baseOrdersModal();
};

window.viewParkedOrder=function(){
  let o=parkedOrder();
  if(o)openOrder(o.id);
};

ordersModal=function(){
  parkedOrderContext=null;
  return baseOrdersModal();
};

setArea=function(a){
  if(parkedOrderContext&&a==='Encargos')return viewParkedOrder();
  return baseSetArea(a);
};

renderVenta=function(app,bar){
  if(!parkedOrderContext)return baseRenderVenta(app,bar);
  let o=parkedOrder();
  if(!o||o.ticketId){
    parkedOrderContext=null;
    return baseRenderVenta(app,bar);
  }
  let filtered=filteredProducts(),g=parkedGroup();
  bar.style.display='block';
  let heading=g?('BANDEJA APARCADA · '+groupTitle(g)):('TICKET APARCADO · '+o.number);
  app.innerHTML=
    '<div class="panel">'+
      '<div class="saleTop"><strong>'+heading+
      '<br><small>'+esc(o.customer)+' · '+esc(o.pickupDate)+' '+esc(o.pickupTime||'')+'</small></strong>'+
      '<button onclick="parkCurrentOrder()">APARCAR</button></div>'+
      '<p class="notice"><b>Mismo recorrido que una venta.</b> Usa Carnicería, Charcutería, Elaborados, Código o A-Z. Los artículos se guardan en este ticket aparcado y todavía pueden añadirse, modificarse o eliminarse.</p>'+
      salesViewHtml(filtered)+
    '</div>';
  bar.innerHTML=
    '<div class="inner compact">'+
      '<button onclick="viewParkedOrder()">VER TICKET · '+parkedLineCount()+' LÍNEAS</button>'+
      '<button class="primary" onclick="parkCurrentOrder()">APARCAR TICKET</button>'+
    '</div>';
};

selectProduct=function(code){
  if(!parkedOrderContext)return baseSelectProduct(code);
  let o=parkedOrder(),g=parkedGroup();
  if(!o)return alert('Encargo no encontrado.');
  return orderSelectProduct(o.id,code,g?g.id:null);
};

directSaleModal=function(section){
  if(!parkedOrderContext)return baseDirectSaleModal(section);
  alert('En un ticket de encargo aparcado selecciona un artículo del catálogo.');
};

orderAddProduct=function(id,groupId){
  startParkedOrderSelection(id,groupId||null);
};

createOrder=function(){
  let customer=(document.getElementById('orderCustomer')?.value||'').trim();
  let pickupDate=document.getElementById('orderDate')?.value||'';
  let seller=document.getElementById('orderSeller')?.value||'';
  if(!customer||!pickupDate||!seller)return alert('Indica cliente, fecha de recogida y vendedor.');
  let n=nextOrderNumber();
  let o={
    id:Date.now(),number:'E-'+n,customer,
    phone:(document.getElementById('orderPhone')?.value||'').trim(),
    pickupDate,pickupTime:document.getElementById('orderTime')?.value||'',
    notes:(document.getElementById('orderNotes')?.value||'').trim(),
    createdAt:new Date().toLocaleString('es-ES'),createdBy:seller,
    status:'Aparcado · pendiente',items:[],groups:[],ticketNumber:null,ticketId:null
  };
  orders.unshift(o);
  save();
  startParkedOrderSelection(o.id,null);
};

saveOrderRequestedProduct=function(id,code,groupId){
  let o=orders.find(x=>String(x.id)===String(id)),p=products.find(x=>x.code===code);
  if(!o||!p||o.ticketId)return alert('No se puede modificar este encargo.');
  let raw=(document.getElementById('orderRequestedQty')?.value||'').trim();
  let requested=raw===''?null:Number(raw);
  if(requested!==null&&(!Number.isFinite(requested)||requested<0))return alert('Cantidad/peso solicitado no válido.');
  let l={
    id:encLineId(),code:p.code,name:p.name,unit:p.unit,
    requestedQty:requested,
    prepNotes:(document.getElementById('orderLineNotes')?.value||'').trim(),
    status:'Pendiente',qty:null,price:null,total:0,normalTotal:0,discount:0
  };
  let g=(o.groups||[]).find(x=>String(x.id)===String(groupId));
  if(g)g.items.push(l);else o.items.push(l);
  o.status='Aparcado · pendiente';
  save();
  parkedOrderContext={orderId:String(o.id),groupId:g?String(g.id):null};
  closeModal();atRoot=true;area='Carne';subcat='';azScope=null;render();
  flash(p.name+' añadido al ticket aparcado');
};

createOrderTray=function(id){
  let o=orders.find(x=>String(x.id)===String(id));
  if(!o||o.ticketId)return;
  let people=Math.max(1,Number(document.getElementById('trayPeople')?.value||1));
  let custom=(document.getElementById('trayName')?.value||'').trim();
  let g={
    id:encGroupId(),type:'tray',people,
    name:custom||('Bandeja '+people+' personas'),
    notes:(document.getElementById('trayNotes')?.value||'').trim(),
    items:[]
  };
  o.groups=o.groups||[];
  o.groups.push(g);
  o.status='Aparcado · pendiente';
  save();
  startParkedOrderSelection(o.id,g.id);
};

window.removeParkedOrderLine=function(orderId,lineId){
  let o=orders.find(x=>String(x.id)===String(orderId));
  if(!o||o.ticketId)return alert('El ticket de venta ya está generado y no se puede modificar.');
  let line=findOrderLine(o,lineId);
  if(!line)return alert('Línea no encontrada.');
  if(!confirm('¿Eliminar '+line.name+' del ticket aparcado?'))return;
  let i=(o.items||[]).findIndex(x=>String(x.id)===String(lineId));
  if(i>=0)o.items.splice(i,1);
  for(const g of (o.groups||[])){
    let j=(g.items||[]).findIndex(x=>String(x.id)===String(lineId));
    if(j>=0){g.items.splice(j,1);break}
  }
  o.status='Aparcado · pendiente';
  save();
  openOrder(o.id);
};

window.editParkedOrderLine=function(orderId,lineId){
  let o=orders.find(x=>String(x.id)===String(orderId)),l=o&&findOrderLine(o,lineId);
  if(!o||!l||o.ticketId)return alert('Esta línea ya pertenece a un ticket de venta cerrado.');
  modal(
    '<h2>Modificar línea · '+esc(l.name)+'</h2>'+
    '<label>Cantidad/peso solicitado (opcional)</label>'+
    '<input id="editRequestedQty" type="number" inputmode="decimal" step="'+(l.unit==='kg'?'0.001':'1')+'" value="'+(l.requestedQty??'')+'" placeholder="Puede quedar vacío">'+
    '<label>Preparación / observaciones</label>'+
    '<input id="editOrderLineNotes" value="'+esc(l.prepNotes||'')+'" placeholder="Ej: cortar fino, 4 filetes, sin hueso">'+
    '<p><button class="primary" onclick="saveParkedOrderLineEdit(\''+orderId+'\',\''+lineId+'\')">GUARDAR CAMBIOS</button> '+
    '<button onclick="prepareOrderLine(\''+orderId+'\',\''+lineId+'\')">PESO / PREPARACIÓN</button> '+
    '<button class="danger" onclick="removeParkedOrderLine(\''+orderId+'\',\''+lineId+'\')">ELIMINAR LÍNEA</button> '+
    '<button onclick="openOrder(\''+orderId+'\')">Cancelar</button></p>'
  );
};

window.saveParkedOrderLineEdit=function(orderId,lineId){
  let o=orders.find(x=>String(x.id)===String(orderId)),l=o&&findOrderLine(o,lineId);
  if(!o||!l||o.ticketId)return;
  let raw=(document.getElementById('editRequestedQty')?.value||'').trim();
  let q=raw===''?null:Number(raw);
  if(q!==null&&(!Number.isFinite(q)||q<0))return alert('Cantidad/peso no válido.');
  l.requestedQty=q;
  l.prepNotes=(document.getElementById('editOrderLineNotes')?.value||'').trim();
  o.status='Aparcado · pendiente';
  save();
  openOrder(o.id);
};

window.removeOrderTray=function(orderId,groupId){
  let o=orders.find(x=>String(x.id)===String(orderId));
  if(!o||o.ticketId)return alert('El ticket de venta ya está generado y no se puede modificar.');
  let g=(o.groups||[]).find(x=>String(x.id)===String(groupId));
  if(!g)return;
  if(!confirm('¿Eliminar '+groupTitle(g)+' y todas sus líneas del ticket aparcado?'))return;
  o.groups=o.groups.filter(x=>String(x.id)!==String(groupId));
  o.status='Aparcado · pendiente';
  save();
  openOrder(o.id);
};

topLineHtml=function(o,l){
  let buttons='';
  if(!o.ticketId){
    buttons=
      '<button onclick="editParkedOrderLine(\''+o.id+'\',\''+l.id+'\')">MODIFICAR</button> '+
      '<button class="danger" onclick="removeParkedOrderLine(\''+o.id+'\',\''+l.id+'\')">ELIMINAR</button>';
  }
  return '<div class="line"><div><b>'+esc(l.name)+'</b><br>'+lineStateHtml(l)+'</div>'+
    '<div>'+(l.status==='Preparado'?'<b>'+euro(l.total)+'</b><br>':'')+buttons+'</div></div>';
};

groupHtml=function(o,g){
  let rows=(g.items||[]).map(l=>topLineHtml(o,l)).join('')||'<p class="muted">Todavía no hay productos en esta bandeja.</p>';
  return '<div class="panel"><h3>'+esc(groupTitle(g))+'</h3>'+
    (g.notes?'<p><small>'+esc(g.notes)+'</small></p>':'')+
    rows+
    (!o.ticketId?'<p><button onclick="orderAddProduct(\''+o.id+'\',\''+g.id+'\')">+ AÑADIR PRODUCTO</button> '+
    '<button class="danger" onclick="removeOrderTray(\''+o.id+'\',\''+g.id+'\')">ELIMINAR BANDEJA</button></p>':'')+
    '</div>';
};



// ===== CENTRO DE ENCARGOS · INACABADOS / PAGO / RECOGIDA =====
let orderWorkView='inacabados';

function orderProgress(o){
  let lines=orderAllLines(o);
  let completed=lines.filter(l=>l.status==='Preparado'||l.status==='No servido').length;
  return {total:lines.length,completed,pending:Math.max(0,lines.length-completed)};
}
function orderTicket(o){
  return o&&o.ticketId?tickets.find(t=>String(t.id)===String(o.ticketId)):null;
}
function orderForTicket(t){
  return orders.find(o=>String(o.ticketId)===String(t.id)||(t.orderNumber&&String(o.number)===String(t.orderNumber)))||null;
}
function paymentText(t){
  return t&&t.paymentStatus==='Cobrado'?'✅ PAGADO':'⏳ PENDIENTE DE PAGO';
}
function pickupText(o){
  return o&&o.status==='Entregado'?'✅ RECOGIDO':'⏳ PENDIENTE DE RECOGER';
}
function orderMatchesWorkView(o,view){
  let p=orderProgress(o),t=orderTicket(o);
  if(view==='inacabados')return !o.ticketId&&(p.total===0||p.pending>0);
  if(view==='preparados')return !o.ticketId&&p.total>0&&p.pending===0;
  if(view==='cobrar')return !!o.ticketId&&(!t||t.paymentStatus!=='Cobrado')&&o.status!=='Entregado';
  if(view==='recoger')return !!o.ticketId&&o.status!=='Entregado';
  if(view==='recogidos')return o.status==='Entregado';
  return true;
}
function orderWorkCount(view){
  return orders.filter(o=>orderMatchesWorkView(o,view)).length;
}
function orderWorkLabel(view){
  return ({inacabados:'INACABADOS',preparados:'PREPARADOS',cobrar:'POR COBRAR',recoger:'POR RECOGER',recogidos:'RECOGIDOS',todos:'TODOS'})[view]||'TODOS';
}
window.setOrderWorkView=function(view){
  orderWorkView=view;
  ordersModal(view);
};

ordersModal=function(view=orderWorkView){
  parkedOrderContext=null;
  orderWorkView=view||'inacabados';
  let list=orders.filter(o=>orderMatchesWorkView(o,orderWorkView))
    .sort((a,b)=>(a.pickupDate+' '+(a.pickupTime||'')).localeCompare(b.pickupDate+' '+(b.pickupTime||'')));
  modal(
    '<h2>Encargos</h2>'+
    '<p class="notice"><b>Centro de trabajo.</b> Los inacabados muestran qué queda por preparar. Pago y recogida se controlan por separado.</p>'+
    '<div class="grid two"><button class="primary" onclick="newOrderModal()">+ NUEVO ENCARGO</button>'+
    '<input id="orderQuery" placeholder="Buscar cliente, teléfono, fecha o nº" oninput="refreshOrderList()"></div>'+
    '<div class="bigmenu">'+
      '<button class="'+(orderWorkView==='inacabados'?'active':'')+'" onclick="setOrderWorkView(\'inacabados\')">INACABADOS · '+orderWorkCount('inacabados')+'</button>'+
      '<button class="'+(orderWorkView==='preparados'?'active':'')+'" onclick="setOrderWorkView(\'preparados\')">PREPARADOS · '+orderWorkCount('preparados')+'</button>'+
      '<button class="'+(orderWorkView==='cobrar'?'active':'')+'" onclick="setOrderWorkView(\'cobrar\')">POR COBRAR · '+orderWorkCount('cobrar')+'</button>'+
      '<button class="'+(orderWorkView==='recoger'?'active':'')+'" onclick="setOrderWorkView(\'recoger\')">POR RECOGER · '+orderWorkCount('recoger')+'</button>'+
      '<button class="'+(orderWorkView==='recogidos'?'active':'')+'" onclick="setOrderWorkView(\'recogidos\')">RECOGIDOS · '+orderWorkCount('recogidos')+'</button>'+
      '<button class="'+(orderWorkView==='todos'?'active':'')+'" onclick="setOrderWorkView(\'todos\')">TODOS · '+orders.length+'</button>'+
    '</div>'+
    '<h3>'+orderWorkLabel(orderWorkView)+'</h3>'+
    '<div id="orderList">'+orderRows(list)+'</div>'+
    '<p><button onclick="closeModal()">Cerrar</button></p>'
  );
};

orderRows=function(list){
  if(!list.length)return '<p class="notice">No hay encargos en este estado.</p>';
  return list.map(o=>{
    let p=orderProgress(o),t=orderTicket(o),total=t?Number(t.total||0):orderPreparedTotal(o);
    let progress=o.ticketId
      ?'<b>'+paymentText(t)+'</b><br><b>'+pickupText(o)+'</b>'
      :'<b>Preparación: '+p.completed+' de '+p.total+' artículos</b><br>'+
       (p.pending>0?'⏳ '+p.pending+' pendientes':'✅ Todos los artículos resueltos');
    let action='<button onclick="openOrder(\''+o.id+'\')">ABRIR</button>';
    if(o.ticketId&&t&&t.paymentStatus!=='Cobrado')action='<button class="primary" onclick="chargePreparedOrder(\''+o.id+'\')">COBRAR</button> '+action;
    if(o.ticketId&&t&&t.paymentStatus==='Cobrado'&&o.status!=='Entregado')action='<button class="green" onclick="markOrderDelivered(\''+o.id+'\')">ENTREGAR</button> '+action;
    return '<div class="line"><div><b>'+esc(o.number)+' · '+esc(o.customer)+'</b><br><small>'+
      esc(o.pickupDate)+' '+esc(o.pickupTime||'')+' · '+esc(o.phone||'Sin teléfono')+
      (o.ticketNumber?'<br>Ticket nº '+esc(o.ticketNumber)+' · '+euro(total):'')+
      '<br>'+progress+'</small></div><div>'+action+'</div></div>';
  }).join('');
};

refreshOrderList=function(){
  let q=(document.getElementById('orderQuery')?.value||'').trim().toLowerCase();
  let list=orders.filter(o=>orderMatchesWorkView(o,orderWorkView)).filter(o=>
    ((o.number||'')+' '+(o.customer||'')+' '+(o.phone||'')+' '+(o.pickupDate||'')+' '+(o.status||'')).toLowerCase().includes(q)
  ).sort((a,b)=>(a.pickupDate+' '+(a.pickupTime||'')).localeCompare(b.pickupDate+' '+(b.pickupTime||'')));
  document.getElementById('orderList').innerHTML=orderRows(list);
};

const openOrderBeforeProgress=openOrder;
openOrder=function(id){
  openOrderBeforeProgress(id);
  let o=orders.find(x=>String(x.id)===String(id));
  if(!o)return;
  let p=orderProgress(o),t=orderTicket(o),box=document.getElementById('modalBox');
  if(!box)return;
  let h2=box.querySelector('h2');
  if(!h2)return;
  let info=document.createElement('div');
  info.className='notice';
  if(o.ticketId){
    info.innerHTML='<b>Encargo nº '+esc(o.number)+' · '+esc(o.customer)+'</b><br>'+
      paymentText(t)+'<br>'+pickupText(o);
  }else{
    info.innerHTML='<b>Preparación: '+p.completed+' de '+p.total+' artículos completados</b><br>'+
      (p.pending>0?'⏳ Quedan '+p.pending+' artículos por preparar':'✅ No quedan artículos pendientes');
  }
  h2.insertAdjacentElement('afterend',info);
};

topLineHtml=function(o,l){
  let buttons='';
  if(!o.ticketId){
    buttons=
      '<button class="'+(l.status==='Pendiente'?'primary':'')+'" onclick="prepareOrderLine(\''+o.id+'\',\''+l.id+'\')">'+
        (l.status==='Pendiente'?'PESO / CANTIDAD':'CAMBIAR PESO')+
      '</button> '+
      '<button onclick="editParkedOrderLine(\''+o.id+'\',\''+l.id+'\')">MODIFICAR</button> '+
      '<button class="danger" onclick="removeParkedOrderLine(\''+o.id+'\',\''+l.id+'\')">ELIMINAR</button>';
  }
  return '<div class="line"><div><b>'+esc(l.name)+'</b><br>'+lineStateHtml(l)+'</div>'+
    '<div>'+(l.status==='Preparado'?'<b>'+euro(l.total)+'</b><br>':'')+buttons+'</div></div>';
};

groupHtml=function(o,g){
  let gp=(g.items||[]),done=gp.filter(l=>l.status==='Preparado'||l.status==='No servido').length;
  let rows=gp.map(l=>topLineHtml(o,l)).join('')||'<p class="muted">Todavía no hay productos en esta bandeja.</p>';
  return '<div class="panel"><h3>'+esc(groupTitle(g))+' · '+done+'/'+gp.length+' preparados</h3>'+
    (g.notes?'<p><small>'+esc(g.notes)+'</small></p>':'')+
    rows+
    (!o.ticketId?'<p><button onclick="orderAddProduct(\''+o.id+'\',\''+g.id+'\')">+ AÑADIR PRODUCTO</button> '+
    '<button class="danger" onclick="removeOrderTray(\''+o.id+'\',\''+g.id+'\')">ELIMINAR BANDEJA</button></p>':'')+
    '</div>';
};

window.parkCurrentOrder=function(){
  parkedOrderContext=null;
  screen='venta';atRoot=true;area='Carne';subcat='';azScope=null;
  ordersModal('inacabados');
};

// Tickets: mostrar encargo, pago y recogida
const receiptHtmlBeforeOrderStatus=receiptHtml;
receiptHtml=function(t,reprint=false){
  let html=receiptHtmlBeforeOrderStatus(t,reprint);
  if(!t||!t.orderNumber)return html;
  let o=orderForTicket(t);
  let label='<p><b>Encargo nº '+esc(t.orderNumber)+(o?' · '+esc(o.customer):'')+'</b><br>'+
    paymentText(t)+'<br>'+pickupText(o)+'</p>';
  return html.replace(/(<div id="printTicket"><h2>[^<]*<\/h2>)/,'$1'+label);
};

storedTicketRows=function(list){
  return list.map(t=>{
    let o=orderForTicket(t),enc=t.orderNumber?'<br><small><b>Encargo nº '+esc(t.orderNumber)+(o?' · '+esc(o.customer):'')+'</b><br>'+paymentText(t)+' · '+pickupText(o)+'</small>':'';
    let rectify=t.rectifies?'<span class="tag">Rectificativo</span>':'<button onclick="requestTicketCorrection(\''+t.id+'\')">Rectificar</button>';
    return '<tr><td><b>'+esc(t.number)+'</b>'+(t.rectifies?'<br><small>Rectifica nº '+esc(t.rectifies)+'</small>':'')+enc+
      '</td><td>'+esc(t.date)+'</td><td>'+esc(t.seller)+'</td><td>'+esc(t.method)+'</td><td>'+euro(t.total)+'</td>'+
      '<td><button onclick="openStoredTicket(\''+t.id+'\')">Ver / imprimir</button> '+rectify+'</td></tr>';
  }).join('')||'<tr><td colspan="6">No se encontraron tickets.</td></tr>';
};

saleTicketLookupRows=function(q){
  q=(q||'').trim().toLowerCase();
  let list=tickets.filter(t=>{
    let o=orderForTicket(t),items=(t.items||[]).map(i=>i.name).join(' ');
    let haystack=(t.number+' '+t.date+' '+t.seller+' '+t.method+' '+t.total+' '+Number(t.total).toLocaleString('es-ES')+' '+items+' '+(t.orderNumber||'')+' '+(o?.customer||'')).toLowerCase();
    return !q||haystack.includes(q);
  }).slice(0,30);
  return list.map(t=>{
    let o=orderForTicket(t);
    let enc=t.orderNumber?'<br><small><b>Encargo nº '+esc(t.orderNumber)+(o?' · '+esc(o.customer):'')+'</b><br>'+paymentText(t)+' · '+pickupText(o)+'</small>':'';
    let rectify=t.rectifies?'<span class="tag">Rectificativo</span>':'<button onclick="requestTicketCorrection(\''+t.id+'\')">Rectificar</button>';
    return '<div class="line"><div><b>Ticket nº '+esc(t.number)+'</b><br><small>'+esc(t.date)+' · '+esc(t.seller)+' · '+esc(t.method)+' · '+euro(t.total)+'</small>'+enc+
      '</div><div><button onclick="openStoredTicket(\''+t.id+'\')">Ver / copia</button> '+rectify+'</div></div>';
  }).join('')||'<p>No se encontró ningún ticket con esos datos.</p>';
};



// ===== ENCARGO COMPLETADO SIN GENERAR TICKET · PENDIENTES ARRIBA =====
function isResolvedOrderLine(l){
  return l&&((l.status==='Preparado')||(l.status==='No servido'));
}
function sortPreparationLines(lines){
  if(!Array.isArray(lines))return;
  lines.sort((a,b)=>{
    let ra=isResolvedOrderLine(a)?1:0,rb=isResolvedOrderLine(b)?1:0;
    if(ra!==rb)return ra-rb;
    let ta=String(a.preparedAt||a.notServedAt||''),tb=String(b.preparedAt||b.notServedAt||'');
    return ta.localeCompare(tb);
  });
}
function sortOrderPreparation(o){
  if(!o)return;
  sortPreparationLines(o.items||[]);
  (o.groups||[]).forEach(g=>sortPreparationLines(g.items||[]));
}
function syncParkedOrderStatus(o){
  if(!o||o.ticketId)return;
  sortOrderPreparation(o);
  let p=orderProgress(o);
  if(p.total>0&&p.pending===0){
    o.status='Encargo completado · ticket pendiente de generar';
    o.completedAt=o.completedAt||new Date().toLocaleString('es-ES');
  }else{
    o.status='Aparcado · inacabado';
    o.completedAt=null;
  }
}

window.savePreparedOrderLine=function(orderId,lineId){
  let o=orders.find(x=>String(x.id)===String(orderId)),l=o&&findOrderLine(o,lineId),p=l&&effectiveProductForLine(l);
  if(!o||!l||!p||o.ticketId)return alert('Línea no disponible.');
  let qty=Number(document.getElementById('preparedQty')?.value);
  if(!Number.isFinite(qty)||qty<=0)return alert('Introduce un peso/cantidad mayor que 0.');
  let calc=calcLine(p,qty);
  l.qty=qty;
  l.effectiveUnit=p.unit;
  l.price=p.price;
  l.normalTotal=calc.normal;
  l.total=calc.total;
  l.discount=calc.disc;
  l.offerLabel=calc.label;
  l.offerPrice=calc.appliedPrice;
  l.status='Preparado';
  l.preparedAt=new Date().toLocaleString('es-ES');
  syncParkedOrderStatus(o);
  save();
  openOrder(o.id);
};

window.markOrderLineZero=function(orderId,lineId){
  let o=orders.find(x=>String(x.id)===String(orderId)),l=o&&findOrderLine(o,lineId);
  if(!o||!l||o.ticketId)return;
  if(!confirm('Esta línea quedará como NO SERVIDA, cantidad 0 e importe 0,00 €. ¿Continuar?'))return;
  l.qty=0;
  l.price=0;
  l.normalTotal=0;
  l.total=0;
  l.discount=0;
  l.status='No servido';
  l.notServedAt=new Date().toLocaleString('es-ES');
  syncParkedOrderStatus(o);
  save();
  openOrder(o.id);
};

const saveOrderRequestedProductBeforeCompletion=saveOrderRequestedProduct;
saveOrderRequestedProduct=function(id,code,groupId){
  saveOrderRequestedProductBeforeCompletion(id,code,groupId);
  let o=orders.find(x=>String(x.id)===String(id));
  if(o&&!o.ticketId){
    syncParkedOrderStatus(o);
    save();
  }
};

const createOrderTrayBeforeCompletion=createOrderTray;
createOrderTray=function(id){
  let o=orders.find(x=>String(x.id)===String(id));
  if(o&&!o.ticketId){
    o.status='Aparcado · inacabado';
    o.completedAt=null;
    save();
  }
  return createOrderTrayBeforeCompletion(id);
};

const removeParkedOrderLineBeforeCompletion=removeParkedOrderLine;
removeParkedOrderLine=function(orderId,lineId){
  removeParkedOrderLineBeforeCompletion(orderId,lineId);
  let o=orders.find(x=>String(x.id)===String(orderId));
  if(o&&!o.ticketId){
    syncParkedOrderStatus(o);
    save();
  }
};

const removeOrderTrayBeforeCompletion=removeOrderTray;
removeOrderTray=function(orderId,groupId){
  removeOrderTrayBeforeCompletion(orderId,groupId);
  let o=orders.find(x=>String(x.id)===String(orderId));
  if(o&&!o.ticketId){
    syncParkedOrderStatus(o);
    save();
  }
};

const selectOrderSubstituteBeforeCompletion=selectOrderSubstitute;
selectOrderSubstitute=function(orderId,lineId,code){
  let o=orders.find(x=>String(x.id)===String(orderId));
  if(o&&!o.ticketId){
    o.status='Aparcado · inacabado';
    o.completedAt=null;
  }
  return selectOrderSubstituteBeforeCompletion(orderId,lineId,code);
};

topLineHtml=function(o,l){
  let buttons='';
  if(!o.ticketId){
    buttons=
      '<button class="'+(l.status==='Pendiente'?'primary':'')+'" onclick="prepareOrderLine(\''+o.id+'\',\''+l.id+'\')">'+
        (l.status==='Pendiente'?'PESO / CANTIDAD':'CAMBIAR PESO')+
      '</button> '+
      '<button onclick="editParkedOrderLine(\''+o.id+'\',\''+l.id+'\')">MODIFICAR</button> '+
      '<button class="danger" onclick="removeParkedOrderLine(\''+o.id+'\',\''+l.id+'\')">ELIMINAR</button>';
  }
  let state=l.status==='Pendiente'?'⏳ PENDIENTE':(l.status==='Preparado'?'✅ PREPARADO':'⊘ NO SERVIDO');
  return '<div class="line"><div><b>'+esc(l.name)+'</b><br><small><b>'+state+'</b></small><br>'+lineStateHtml(l)+'</div>'+
    '<div>'+(l.status==='Preparado'?'<b>'+euro(l.total)+'</b><br>':'')+buttons+'</div></div>';
};

groupHtml=function(o,g){
  sortPreparationLines(g.items||[]);
  let gp=(g.items||[]),done=gp.filter(isResolvedOrderLine).length,pending=gp.length-done;
  let rows=gp.map(l=>topLineHtml(o,l)).join('')||'<p class="muted">Todavía no hay productos en esta bandeja.</p>';
  return '<div class="panel"><h3>'+esc(groupTitle(g))+' · '+done+'/'+gp.length+' preparados'+(pending?' · '+pending+' pendientes':' · ✅ COMPLETA')+'</h3>'+
    (g.notes?'<p><small>'+esc(g.notes)+'</small></p>':'')+
    rows+
    (!o.ticketId?'<p><button onclick="orderAddProduct(\''+o.id+'\',\''+g.id+'\')">+ AÑADIR PRODUCTO</button> '+
    '<button class="danger" onclick="removeOrderTray(\''+o.id+'\',\''+g.id+'\')">ELIMINAR BANDEJA</button></p>':'')+
    '</div>';
};

const openOrderBeforeCompletedState=openOrder;
openOrder=function(id){
  let o=orders.find(x=>String(x.id)===String(id));
  if(o&&!o.ticketId){
    syncParkedOrderStatus(o);
    save();
  }
  openOrderBeforeCompletedState(id);
  o=orders.find(x=>String(x.id)===String(id));
  if(!o||o.ticketId)return;
  let p=orderProgress(o),box=document.getElementById('modalBox');
  if(!box)return;
  let notices=[...box.querySelectorAll('.notice')];
  let progressNotice=notices.find(n=>(n.textContent||'').includes('Preparación:'));
  if(p.total>0&&p.pending===0){
    if(progressNotice)progressNotice.innerHTML='<b>✅ ENCARGO COMPLETADO</b><br>'+p.completed+' de '+p.total+' artículos preparados.<br><b>El encargo sigue aparcado y editable hasta generar el ticket de venta.</b>';
    [...box.querySelectorAll('button')].forEach(b=>{
      if((b.textContent||'').trim()==='FINALIZAR PREPARACIÓN')b.textContent='GENERAR VENTA + TICKET';
    });
  }else if(progressNotice){
    progressNotice.innerHTML='<b>Preparación: '+p.completed+' de '+p.total+' artículos completados</b><br>⏳ Quedan '+p.pending+' artículos por preparar.';
  }
};

window.finalizeOrderPreparation=function(id){
  let o=orders.find(x=>String(x.id)===String(id));
  if(!o||o.ticketId)return alert('Este encargo ya ha generado una venta.');
  syncParkedOrderStatus(o);
  if(!orderLinesReady(o))return alert('Todavía quedan líneas pendientes de preparar.');
  if(!orderHasServedLines(o))return alert('No hay ningún artículo servido. No se puede generar una venta a 0,00 €.');
  let active=activeSellers();
  modal(
    '<h2>Generar venta + ticket · '+esc(o.number)+'</h2>'+
    '<p class="warn"><b>El encargo ya está completado.</b> Hasta este momento seguía siendo un ticket aparcado editable. Al generar la venta, artículos, pesos, precios e importe quedarán cerrados y cualquier corrección posterior irá por Rectificación.</p>'+
    '<h2>Total definitivo: '+euro(orderPreparedTotal(o))+'</h2>'+
    '<label>Vendedor que genera el ticket</label><select id="preparedBySeller">'+active.map(s=>'<option>'+esc(s.name)+'</option>').join('')+'</select>'+
    (active.length?'':'<p class="warn">Debe haber un vendedor iniciado.</p>')+
    '<p><button class="primary" '+(active.length?'':'disabled')+' onclick="confirmFinalizeOrderPreparation(\''+id+'\')">GENERAR VENTA + TICKET</button> '+
    '<button onclick="openOrder(\''+id+'\')">SEGUIR MODIFICANDO</button></p>'
  );
};

const confirmFinalizeBeforeCompletion=confirmFinalizeOrderPreparation;
confirmFinalizeOrderPreparation=function(id){
  confirmFinalizeBeforeCompletion(id);
  let o=orders.find(x=>String(x.id)===String(id));
  if(o&&o.ticketId){
    o.status='Ticket generado · pendiente de cobro';
    save();
  }
};




// ===== CORRECCIÓN UX · GUARDAR ENCARGO COMPLETADO =====
window.saveCompletedParkedOrder=function(id){
  let o=orders.find(x=>String(x.id)===String(id));
  if(!o||o.ticketId)return alert('Este encargo ya tiene ticket de venta.');
  syncParkedOrderStatus(o);
  let p=orderProgress(o);
  if(!(p.total>0&&p.pending===0))return alert('Todavía quedan artículos pendientes de preparar.');
  o.status='Encargo completado · ticket pendiente de generar';
  o.completedAt=o.completedAt||new Date().toLocaleString('es-ES');
  save();
  parkedOrderContext=null;
  screen='venta';atRoot=true;area='Carne';subcat='';azScope=null;
  ordersModal('preparados');
};

window.parkCurrentOrder=function(){
  let o=parkedOrder();
  if(o&&!o.ticketId){
    syncParkedOrderStatus(o);
    save();
    let p=orderProgress(o);
    parkedOrderContext=null;
    screen='venta';atRoot=true;area='Carne';subcat='';azScope=null;
    return ordersModal(p.total>0&&p.pending===0?'preparados':'inacabados');
  }
  parkedOrderContext=null;
  screen='venta';atRoot=true;area='Carne';subcat='';azScope=null;
  ordersModal('inacabados');
};

const openOrderBeforeSaveCompletedButton=openOrder;
openOrder=function(id){
  openOrderBeforeSaveCompletedButton(id);
  let o=orders.find(x=>String(x.id)===String(id));
  if(!o||o.ticketId)return;
  let p=orderProgress(o),box=document.getElementById('modalBox');
  if(!box||!(p.total>0&&p.pending===0))return;

  let existing=[...box.querySelectorAll('button')].find(b=>(b.textContent||'').includes('GUARDAR ENCARGO COMPLETADO'));
  if(existing)return;

  let controls=[...box.querySelectorAll('button')].find(b=>(b.textContent||'').trim()==='GENERAR VENTA + TICKET');
  let saveBtn=document.createElement('button');
  saveBtn.className='green';
  saveBtn.textContent='GUARDAR ENCARGO COMPLETADO';
  saveBtn.setAttribute('onclick',"saveCompletedParkedOrder('"+o.id+"')");
  if(controls){
    controls.insertAdjacentElement('beforebegin',saveBtn);
    controls.insertAdjacentText('beforebegin',' ');
  }else{
    let target=box.querySelector('.notice')||box;
    target.insertAdjacentElement('afterend',saveBtn);
  }
};



// ===== TPV COMPARTIDO MIENTRAS SE PREPARA EL ENCARGO =====
window.parkOrderAndReturnToSale=function(id){
  let o=orders.find(x=>String(x.id)===String(id));
  if(!o)return alert('Encargo no encontrado.');
  if(!o.ticketId){
    syncParkedOrderStatus(o);
    save();
  }
  parkedOrderContext=null;
  closeModal();
  screen='venta';
  role='venta';
  atRoot=true;
  area='Carne';
  subcat='';
  azScope=null;
  render();
  flash('Encargo '+o.number+' aparcado · TPV libre para vender');
};

window.prepareOrderLine=function(orderId,lineId){
  let o=orders.find(x=>String(x.id)===String(orderId)),l=o&&findOrderLine(o,lineId);
  if(!o||!l||o.ticketId)return alert('Línea no disponible.');
  let p=effectiveProductForLine(l);
  if(!p)return alert('El artículo ya no existe en el catálogo.');
  let active=activeSellers();
  if(!active.length)return alert('Debe haber al menos un vendedor iniciado para preparar una línea.');
  let selected=l.preparedBy||active[0].name;
  modal(
    '<h2>Preparar · '+esc(lineEffectiveName(l))+'</h2>'+
    (l.substituteName?'<p class="warn">Solicitado: <b>'+esc(l.name)+'</b><br>Sustituto: <b>'+esc(l.substituteName)+'</b></p>':'')+
    '<p>'+esc(lineRequestedText(l))+'<br>Precio vigente ahora: <b>'+euro(p.price)+' / '+esc(p.unit)+'</b></p>'+
    '<label>Vendedor que prepara</label>'+
    '<select id="linePreparedBy">'+active.map(s=>'<option '+(s.name===selected?'selected':'')+'>'+esc(s.name)+'</option>').join('')+'</select>'+
    '<label>'+(p.unit==='kg'?'Peso real preparado (kg)':'Unidades reales preparadas')+'</label>'+
    '<input id="preparedQty" type="number" inputmode="decimal" step="'+(p.unit==='kg'?'0.001':'1')+'" value="'+(l.status==='Preparado'?l.qty:'')+'" autofocus>'+
    '<p><button class="primary" onclick="savePreparedOrderLine(\''+orderId+'\',\''+lineId+'\',false)">GUARDAR Y SEGUIR ENCARGO</button> '+
    '<button class="brand" onclick="savePreparedOrderLine(\''+orderId+'\',\''+lineId+'\',true)">GUARDAR Y VOLVER A VENTA</button></p>'+
    '<p><button onclick="markOrderLineZero(\''+orderId+'\',\''+lineId+'\')">CANTIDAD 0 · NO SERVIR</button> '+
    '<button onclick="substituteOrderLine(\''+orderId+'\',\''+lineId+'\')">SUSTITUIR ARTÍCULO</button> '+
    '<button onclick="openOrder(\''+orderId+'\')">Cancelar</button></p>'
  );
  setTimeout(()=>document.getElementById('preparedQty')?.focus(),50);
};

window.savePreparedOrderLine=function(orderId,lineId,returnToSale=false){
  let o=orders.find(x=>String(x.id)===String(orderId)),l=o&&findOrderLine(o,lineId),p=l&&effectiveProductForLine(l);
  if(!o||!l||!p||o.ticketId)return alert('Línea no disponible.');
  let qty=Number(document.getElementById('preparedQty')?.value);
  let preparedBy=(document.getElementById('linePreparedBy')?.value||'').trim();
  if(!preparedBy)return alert('Selecciona el vendedor que prepara.');
  if(!Number.isFinite(qty)||qty<=0)return alert('Introduce un peso/cantidad mayor que 0.');
  let calc=calcLine(p,qty);
  l.qty=qty;
  l.effectiveUnit=p.unit;
  l.price=p.price;
  l.normalTotal=calc.normal;
  l.total=calc.total;
  l.discount=calc.disc;
  l.offerLabel=calc.label;
  l.offerPrice=calc.appliedPrice;
  l.status='Preparado';
  l.preparedAt=new Date().toLocaleString('es-ES');
  l.preparedBy=preparedBy;
  syncParkedOrderStatus(o);
  save();
  if(returnToSale)return parkOrderAndReturnToSale(o.id);
  openOrder(o.id);
};

window.markOrderLineZero=function(orderId,lineId){
  let o=orders.find(x=>String(x.id)===String(orderId)),l=o&&findOrderLine(o,lineId);
  if(!o||!l||o.ticketId)return;
  let preparedBy=(document.getElementById('linePreparedBy')?.value||'').trim();
  if(!preparedBy)return alert('Selecciona el vendedor que resuelve esta línea.');
  if(!confirm('Esta línea quedará como NO SERVIDA, cantidad 0 e importe 0,00 €. ¿Continuar?'))return;
  l.qty=0;
  l.price=0;
  l.normalTotal=0;
  l.total=0;
  l.discount=0;
  l.status='No servido';
  l.notServedAt=new Date().toLocaleString('es-ES');
  l.preparedBy=preparedBy;
  syncParkedOrderStatus(o);
  save();
  openOrder(o.id);
};

topLineHtml=function(o,l){
  let buttons='';
  if(!o.ticketId){
    buttons=
      '<button class="'+(l.status==='Pendiente'?'primary':'')+'" onclick="prepareOrderLine(\''+o.id+'\',\''+l.id+'\')">'+
        (l.status==='Pendiente'?'PESO / CANTIDAD':'CAMBIAR PESO')+
      '</button> '+
      '<button onclick="editParkedOrderLine(\''+o.id+'\',\''+l.id+'\')">MODIFICAR</button> '+
      '<button class="danger" onclick="removeParkedOrderLine(\''+o.id+'\',\''+l.id+'\')">ELIMINAR</button>';
  }
  let state=l.status==='Pendiente'?'⏳ PENDIENTE':(l.status==='Preparado'?'✅ PREPARADO':'⊘ NO SERVIDO');
  let by=l.preparedBy&&l.status!=='Pendiente'?'<br><small><b>Preparado por: '+esc(l.preparedBy)+'</b></small>':'';
  return '<div class="line"><div><b>'+esc(l.name)+'</b><br><small><b>'+state+'</b></small>'+by+'<br>'+lineStateHtml(l)+'</div>'+
    '<div>'+(l.status==='Preparado'?'<b>'+euro(l.total)+'</b><br>':'')+buttons+'</div></div>';
};

const openOrderBeforeSharedTpv=openOrder;
openOrder=function(id){
  openOrderBeforeSharedTpv(id);
  let o=orders.find(x=>String(x.id)===String(id)),box=document.getElementById('modalBox');
  if(!o||!box||o.ticketId)return;
  if([...box.querySelectorAll('button')].some(b=>(b.textContent||'').includes('APARCAR Y VOLVER A VENTA')))return;
  let h2=box.querySelector('h2');
  if(!h2)return;
  let btn=document.createElement('button');
  btn.className='brand';
  btn.textContent='APARCAR Y VOLVER A VENTA';
  btn.setAttribute('onclick',"parkOrderAndReturnToSale('"+o.id+"')");
  h2.insertAdjacentElement('afterend',btn);
  let note=document.createElement('p');
  note.className='muted';
  note.textContent='El encargo queda guardado. El TPV vuelve a Venta para que cualquier vendedor pueda seguir atendiendo.';
  btn.insertAdjacentElement('afterend',note);
};



// ===== LAB ENCARGOS · LIBRETA DIGITAL =====
const notebookPreparerByOrder={};

function nbEscAttr(v){
  return esc(String(v??'')).replace(/"/g,'&quot;');
}
function notebookPreparer(o){
  let active=activeSellers();
  let remembered=notebookPreparerByOrder[String(o.id)];
  if(remembered&&active.some(s=>s.name===remembered))return remembered;
  if(o.createdBy&&active.some(s=>s.name===o.createdBy))return o.createdBy;
  return active[0]?.name||'';
}
window.setNotebookPreparer=function(orderId){
  let el=document.getElementById('nbPreparer_'+orderId);
  if(el)notebookPreparerByOrder[String(orderId)]=el.value;
};
function nbGroupLabel(o,l){
  let g=orderGroupForLine(o,l.id);
  return g?'<div class="nb-sub"><b>'+esc(groupTitle(g))+'</b></div>':'';
}
function notebookPendingRow(o,l){
  let p=effectiveProductForLine(l),unit=p?.unit||l.unit||'kg';
  let step=unit==='kg'?'0.001':'1';
  return '<div class="nb-row pending">'+
    '<div class="nb-name">'+esc(lineEffectiveName(l))+'</div>'+
    nbGroupLabel(o,l)+
    (l.prepNotes?'<div class="nb-sub">Preparación: <b>'+esc(l.prepNotes)+'</b></div>':'')+
    '<div class="nb-state pending">⏳ PENDIENTE</div>'+
    '<div class="nb-entry"><label>Peso / cantidad real</label>'+
      '<div class="qtybox"><input id="nbQty_'+l.id+'" inputmode="decimal" type="number" step="'+step+'" placeholder="'+(unit==='kg'?'0,000':'0')+'"><span class="unit">'+esc(unit)+'</span></div>'+
      '<button class="primary save" onclick="saveNotebookWeight(\''+o.id+'\',\''+l.id+'\')">GUARDAR</button>'+
    '</div>'+
    '<div class="nb-row-actions">'+
      '<button onclick="duplicateNotebookLine(\''+o.id+'\',\''+l.id+'\')">DUPLICAR</button>'+
      '<button onclick="editParkedOrderLine(\''+o.id+'\',\''+l.id+'\')">MODIFICAR</button>'+
      '<button onclick="notebookNoServe(\''+o.id+'\',\''+l.id+'\')">NO SERVIR</button>'+
      '<button class="danger" onclick="removeParkedOrderLine(\''+o.id+'\',\''+l.id+'\')">ELIMINAR</button>'+
    '</div>'+
  '</div>';
}
function notebookPreparedRow(o,l){
  let p=effectiveProductForLine(l),unit=l.effectiveUnit||p?.unit||l.unit||'kg';
  let step=unit==='kg'?'0.001':'1';
  if(l.status==='No servido'){
    return '<div class="nb-row zero">'+
      '<div class="nb-name">'+esc(lineEffectiveName(l))+'</div>'+
      nbGroupLabel(o,l)+
      (l.prepNotes?'<div class="nb-sub">Preparación: <b>'+esc(l.prepNotes)+'</b></div>':'')+
      '<div class="nb-state">⊘ NO SERVIDO'+(l.preparedBy?' · '+esc(l.preparedBy):'')+'</div>'+
      '<div class="nb-row-actions"><button onclick="resetNotebookLine(\''+o.id+'\',\''+l.id+'\')">VOLVER A PENDIENTE</button><button onclick="duplicateNotebookLine(\''+o.id+'\',\''+l.id+'\')">DUPLICAR</button><button class="danger" onclick="removeParkedOrderLine(\''+o.id+'\',\''+l.id+'\')">ELIMINAR</button></div>'+
    '</div>';
  }
  return '<div class="nb-row done">'+
    '<div class="nb-name">'+esc(lineEffectiveName(l))+'</div>'+
    nbGroupLabel(o,l)+
    (l.prepNotes?'<div class="nb-sub">Preparación: <b>'+esc(l.prepNotes)+'</b></div>':'')+
    '<div class="nb-state done">✅ PREPARADO</div>'+
    '<div class="nb-prepared-data">'+displayQty(l.qty,unit)+(l.preparedBy?' · Preparado por: '+esc(l.preparedBy):'')+'</div>'+
    '<div class="nb-entry"><label>Cambiar peso / cantidad</label>'+
      '<div class="qtybox"><input id="nbQty_'+l.id+'" inputmode="decimal" type="number" step="'+step+'" value="'+nbEscAttr(l.qty)+'"><span class="unit">'+esc(unit)+'</span></div>'+
      '<button class="save" onclick="saveNotebookWeight(\''+o.id+'\',\''+l.id+'\')">GUARDAR</button>'+
    '</div>'+
    '<div class="nb-row-actions">'+
      '<button onclick="duplicateNotebookLine(\''+o.id+'\',\''+l.id+'\')">DUPLICAR</button>'+
      '<button onclick="editParkedOrderLine(\''+o.id+'\',\''+l.id+'\')">MODIFICAR</button>'+
      '<button class="danger" onclick="removeParkedOrderLine(\''+o.id+'\',\''+l.id+'\')">ELIMINAR</button>'+
    '</div>'+
  '</div>';
}
function notebookOrderHtml(o){
  syncParkedOrderStatus(o);
  let p=orderProgress(o),lines=orderAllLines(o);
  let pending=lines.filter(l=>!isResolvedOrderLine(l));
  let done=lines.filter(isResolvedOrderLine);
  let active=activeSellers(),selected=notebookPreparer(o);
  let complete=p.total>0&&p.pending===0;
  let prepSelect=active.length
    ?'<div class="nb-preparer"><b>Preparando ahora</b><select id="nbPreparer_'+o.id+'" onchange="setNotebookPreparer(\''+o.id+'\')">'+active.map(s=>'<option '+(s.name===selected?'selected':'')+'>'+esc(s.name)+'</option>').join('')+'</select></div>'
    :'<p class="warn">Inicia un vendedor para poder guardar pesos/cantidades.</p>';

  return '<div class="nb-wrap">'+
    '<div class="nb-head">'+
      '<div class="nb-title">'+esc(o.number)+' · '+esc(o.customer)+'</div>'+
      '<div class="nb-meta">Recogida: <b>'+esc(o.pickupDate)+' '+esc(o.pickupTime||'')+'</b></div>'+
      (o.notes?'<div class="nb-note">'+esc(o.notes)+'</div>':'')+
      '<div class="nb-status '+(complete?'done':'pending')+'">'+(complete?'✅ COMPLETADO':'⏳ INACABADO')+'</div>'+
      '<div class="nb-progress">'+p.completed+' de '+p.total+' preparados · '+p.pending+' pendientes</div>'+
    '</div>'+
    '<div class="nb-top-actions"><button class="brand" onclick="parkOrderAndReturnToSale(\''+o.id+'\')">APARCAR Y VOLVER A VENTA</button></div>'+
    prepSelect+
    (complete?'<div class="nb-complete">✅ ENCARGO COMPLETADO<br><small>El ticket de venta todavía no se ha generado.</small></div>':'')+
    (pending.length?'<div class="nb-section-title pending">POR PREPARAR ('+pending.length+')</div><div class="nb-list">'+pending.map(l=>notebookPendingRow(o,l)).join('')+'</div>':'')+
    (done.length?'<div class="nb-section-title done">PREPARADOS ('+done.length+')</div><div class="nb-list">'+done.map(l=>notebookPreparedRow(o,l)).join('')+'</div>':'')+
    '<div class="nb-bottom-actions">'+
      '<button class="primary" onclick="notebookAddLineModal(\''+o.id+'\')">+ AÑADIR LÍNEA</button>'+
      '<button onclick="newOrderTrayModal(\''+o.id+'\')">+ AÑADIR BANDEJA</button>'+
      (complete?'<button class="green" onclick="saveCompletedParkedOrder(\''+o.id+'\')">GUARDAR ENCARGO COMPLETADO</button>':'')+
      (complete&&orderHasServedLines(o)?'<button class="primary" onclick="finalizeOrderPreparation(\''+o.id+'\')">GENERAR VENTA + TICKET</button>':'')+
      '<button onclick="ordersModal(\''+(complete?'preparados':'inacabados')+'\')">VOLVER A ENCARGOS</button>'+
    '</div>'+
    '<div class="nb-total"><span>Total actual preparado</span><b>'+euro(orderPreparedTotal(o))+'</b></div>'+
  '</div>';
}

const openOrderBeforeNotebook=openOrder;
openOrder=function(id){
  let o=orders.find(x=>String(x.id)===String(id));
  if(!o)return alert('Encargo no encontrado.');
  if(o.ticketId)return openOrderBeforeNotebook(id);
  syncParkedOrderStatus(o);
  save();
  modal(notebookOrderHtml(o));
};

window.saveNotebookWeight=function(orderId,lineId){
  let o=orders.find(x=>String(x.id)===String(orderId)),l=o&&findOrderLine(o,lineId),p=l&&effectiveProductForLine(l);
  if(!o||!l||!p||o.ticketId)return alert('Línea no disponible.');
  let raw=(document.getElementById('nbQty_'+lineId)?.value||'').trim().replace(',','.');
  let qty=Number(raw);
  let preparedBy=(document.getElementById('nbPreparer_'+orderId)?.value||notebookPreparer(o)||'').trim();
  if(!preparedBy)return alert('Selecciona o inicia el vendedor que prepara.');
  if(!Number.isFinite(qty)||qty<=0)return alert('Introduce un peso/cantidad mayor que 0.');
  let calc=calcLine(p,qty);
  l.qty=qty;
  l.effectiveUnit=p.unit;
  l.price=p.price;
  l.normalTotal=calc.normal;
  l.total=calc.total;
  l.discount=calc.disc;
  l.offerLabel=calc.label;
  l.offerPrice=calc.appliedPrice;
  l.status='Preparado';
  l.preparedAt=new Date().toLocaleString('es-ES');
  l.preparedBy=preparedBy;
  notebookPreparerByOrder[String(o.id)]=preparedBy;
  syncParkedOrderStatus(o);
  save();
  openOrder(o.id);
};

window.notebookNoServe=function(orderId,lineId){
  let o=orders.find(x=>String(x.id)===String(orderId)),l=o&&findOrderLine(o,lineId);
  if(!o||!l||o.ticketId)return;
  let preparedBy=(document.getElementById('nbPreparer_'+orderId)?.value||notebookPreparer(o)||'').trim();
  if(!preparedBy)return alert('Selecciona o inicia el vendedor que resuelve esta línea.');
  if(!confirm('¿Marcar '+l.name+' como NO SERVIDO?'))return;
  l.qty=0;l.price=0;l.normalTotal=0;l.total=0;l.discount=0;
  l.status='No servido';
  l.notServedAt=new Date().toLocaleString('es-ES');
  l.preparedBy=preparedBy;
  syncParkedOrderStatus(o);
  save();
  openOrder(o.id);
};

window.resetNotebookLine=function(orderId,lineId){
  let o=orders.find(x=>String(x.id)===String(orderId)),l=o&&findOrderLine(o,lineId);
  if(!o||!l||o.ticketId)return;
  l.status='Pendiente';l.qty=null;l.price=null;l.normalTotal=0;l.total=0;l.discount=0;
  l.preparedAt=null;l.notServedAt=null;l.preparedBy=null;
  syncParkedOrderStatus(o);
  save();openOrder(o.id);
};

window.duplicateNotebookLine=function(orderId,lineId){
  let o=orders.find(x=>String(x.id)===String(orderId)),l=o&&findOrderLine(o,lineId);
  if(!o||!l||o.ticketId)return alert('No se puede duplicar esta línea.');
  let copy={
    ...l,id:encLineId(),status:'Pendiente',qty:null,price:null,total:0,normalTotal:0,discount:0,
    preparedAt:null,notServedAt:null,preparedBy:null,effectiveUnit:null,offerLabel:'',offerPrice:null
  };
  let g=orderGroupForLine(o,lineId);
  let arr=g?(g.items||[]):(o.items||[]);
  let pos=arr.findIndex(x=>String(x.id)===String(lineId));
  arr.splice(pos>=0?pos+1:arr.length,0,copy);
  syncParkedOrderStatus(o);
  save();openOrder(o.id);
};

window.notebookAddLineModal=function(orderId){
  let o=orders.find(x=>String(x.id)===String(orderId));
  if(!o||o.ticketId)return;
  modal('<h2>Añadir línea · '+esc(o.number)+'</h2>'+
    '<input id="nbProductSearch" autofocus placeholder="Escribe artículo o código" oninput="refreshNotebookProductSearch(\''+orderId+'\')">'+
    '<div id="nbProductResults">'+notebookProductRows(orderId,'')+'</div>'+
    '<p><button onclick="openOrder(\''+orderId+'\')">Cancelar</button></p>');
  setTimeout(()=>document.getElementById('nbProductSearch')?.focus(),50);
};
function notebookProductRows(orderId,q){
  q=(q||'').trim().toLowerCase();
  let list=products.filter(p=>p.active!==false&&(!q||(p.name+' '+p.code).toLowerCase().includes(q))).slice(0,30);
  return list.map(p=>'<div class="line"><div><b>'+esc(p.name)+'</b><br><small>'+esc(p.code)+' · '+euro(p.price)+'/'+esc(p.unit)+'</small></div><button onclick="notebookPickProduct(\''+orderId+'\',\''+p.code+'\')">AÑADIR</button></div>').join('')||'<p>No encontrado.</p>';
}
window.refreshNotebookProductSearch=function(orderId){
  let q=document.getElementById('nbProductSearch')?.value||'';
  document.getElementById('nbProductResults').innerHTML=notebookProductRows(orderId,q);
};
window.notebookPickProduct=function(orderId,code){
  let p=products.find(x=>x.code===code);
  if(!p)return;
  modal('<h2>'+esc(p.name)+'</h2>'+
    '<p>Se añadirá como línea pendiente. El peso/cantidad real se anotará después directamente en la libreta.</p>'+
    '<label>Preparación / observaciones</label><input id="nbNewLineNote" autofocus placeholder="Ej: 3 cortes, fino, al vacío">'+
    '<p><button class="primary" onclick="notebookAddProduct(\''+orderId+'\',\''+code+'\')">AÑADIR LÍNEA</button> <button onclick="notebookAddLineModal(\''+orderId+'\')">Volver</button></p>');
};
window.notebookAddProduct=function(orderId,code){
  let o=orders.find(x=>String(x.id)===String(orderId)),p=products.find(x=>x.code===code);
  if(!o||!p||o.ticketId)return;
  o.items=o.items||[];
  o.items.push({
    id:encLineId(),code:p.code,name:p.name,unit:p.unit,requestedQty:null,
    prepNotes:(document.getElementById('nbNewLineNote')?.value||'').trim(),
    status:'Pendiente',qty:null,price:null,total:0,normalTotal:0,discount:0
  });
  syncParkedOrderStatus(o);
  save();openOrder(o.id);
};



// ===== INFORME X/Z · DESGLOSE DE PAGOS + IMPRESIÓN REAL =====
function reportTicketPending(t){
  return !!t && (t.paymentStatus==='Pendiente' || t.method==='Pendiente de cobro');
}
function reportPaymentData(list){
  let d={cash:0,card:0,bizum:0,mixed:0,pending:0,returns:0,other:0,paidTotal:0};
  (list||[]).forEach(t=>{
    let amount=Number(t.total)||0;
    if(reportTicketPending(t)){
      d.pending=round(d.pending+amount);
      return;
    }
    d.paidTotal=round(d.paidTotal+amount);
    if(t.method==='Efectivo')d.cash=round(d.cash+amount);
    else if(t.method==='Tarjeta')d.card=round(d.card+amount);
    else if(t.method==='Bizum')d.bizum=round(d.bizum+amount);
    else if(t.method==='Mixto')d.mixed=round(d.mixed+amount);
    else if(t.method==='Devolución'||t.method==='Cobro diferencia')d.returns=round(d.returns+amount);
    else d.other=round(d.other+amount);
  });
  return d;
}

reportData=function(list){
  let bySeller={},directLines=[];
  list.forEach(t=>{
    let n=t.seller||'Sin vendedor';
    if(!bySeller[n])bySeller[n]={seller:n,count:0,total:0,negativeCount:0,negativeTotal:0,discounts:0};
    let r=bySeller[n],amount=Number(t.total)||0;
    r.count++;
    r.total=round(r.total+amount);
    if(amount<0){r.negativeCount++;r.negativeTotal=round(r.negativeTotal+amount)}
    r.discounts=round(r.discounts+Number(t.offerDiscount||0)+Number(t.automaticDiscount||t.dayDiscount||0));
    (t.items||[]).filter(l=>l.direct).forEach(l=>directLines.push(l));
  });
  let rows=Object.values(bySeller),directByArea={};
  directLines.forEach(l=>{
    let a=l.area||'Sin sección';
    directByArea[a]=round((directByArea[a]||0)+Number(l.total||0));
  });
  let payments=reportPaymentData(list);
  return {
    tickets:list.length,
    total:round(list.reduce((s,t)=>s+(Number(t.total)||0),0)),
    paidTotal:payments.paidTotal,
    pendingTotal:payments.pending,
    payments,
    negativeCount:list.filter(t=>Number(t.total)<0).length,
    negativeTotal:round(list.filter(t=>Number(t.total)<0).reduce((s,t)=>s+Number(t.total),0)),
    discounts:round(list.reduce((s,t)=>s+Number(t.offerDiscount||0)+Number(t.automaticDiscount||t.dayDiscount||0),0)),
    directCount:directLines.length,
    directTotal:round(directLines.reduce((s,l)=>s+Number(l.total||0),0)),
    directByArea,
    rows
  };
};

reportBlock=function(data,title,dateText){
  let p=data.payments||{cash:0,card:0,bizum:0,mixed:0,pending:data.pendingTotal||0,returns:0,other:0,paidTotal:data.paidTotal||0};
  return '<div class="panel">'+
    '<h2>'+title+'</h2>'+
    '<p class="muted">'+esc(dateText)+'</p>'+
    '<div class="totals">'+
      '<div><span>Tickets generados</span><b>'+data.tickets+'</b></div>'+
      '<div><span>Total tickets generados</span><b>'+euro(data.total)+'</b></div>'+
      '<div><span>Total cobrado</span><b>'+euro(data.paidTotal||0)+'</b></div>'+
      '<div><span>Pendiente de cobro</span><b>'+euro(data.pendingTotal||0)+'</b></div>'+
    '</div>'+
    '<h3>Formas de pago</h3>'+
    '<div class="totals">'+
      '<div><span>Efectivo</span><b>'+euro(p.cash||0)+'</b></div>'+
      '<div><span>Tarjeta</span><b>'+euro(p.card||0)+'</b></div>'+
      '<div><span>Bizum</span><b>'+euro(p.bizum||0)+'</b></div>'+
      '<div><span>Mixto</span><b>'+euro(p.mixed||0)+'</b></div>'+
      ((p.returns||0)!==0?'<div><span>Devoluciones / ajustes</span><b>'+euro(p.returns||0)+'</b></div>':'')+
      ((p.other||0)!==0?'<div><span>Otros movimientos</span><b>'+euro(p.other||0)+'</b></div>':'')+
      '<div class="final"><span>EFECTIVO ESPERADO EN CAJA</span><b>'+euro((p.cash||0)+((p.returns||0)<0?(p.returns||0):0))+'</b></div>'+
    '</div>'+
    (Number(p.mixed||0)!==0?'<p class="warn"><b>Mixto:</b> esta LAB todavía no guarda el desglose interno efectivo/tarjeta; por eso su parte en efectivo no se suma al efectivo esperado.</p>':'')+
    '<div class="totals">'+
      '<div><span>Ventas directas</span><b>'+(data.directCount||0)+' · '+euro(data.directTotal||0)+'</b></div>'+
      Object.entries(data.directByArea||{}).map(([a,v])=>'<div><span>Directa · '+areaLabel(a)+'</span><b>'+euro(v)+'</b></div>').join('')+
      '<div><span>Ventas negativas</span><b>'+data.negativeCount+' · '+euro(data.negativeTotal)+'</b></div>'+
      '<div><span>Descuentos realizados</span><b>'+euro(data.discounts)+'</b></div>'+
      '<div class="final"><span>VENTA TOTAL REGISTRADA</span><b>'+euro(data.total)+'</b></div>'+
    '</div>'+
    '<div class="tableWrap"><table><thead><tr><th>Vendedor</th><th>Tickets</th><th>Venta</th><th>Negativas</th><th>Descuentos</th></tr></thead><tbody>'+
      data.rows.map(r=>'<tr><td>'+esc(r.seller)+'</td><td>'+r.count+'</td><td>'+euro(r.total)+'</td><td>'+r.negativeCount+' · '+euro(r.negativeTotal)+'</td><td>'+euro(r.discounts)+'</td></tr>').join('')+
      (data.rows.length?'':'<tr><td colspan="5">Sin ventas registradas en este periodo.</td></tr>')+
    '</tbody></table></div>'+
  '</div>';
};

cashExpectedFrom=function(list){
  let p=reportPaymentData(list);
  return round((p.cash||0)+((p.returns||0)<0?(p.returns||0):0));
};

function reportPrintInner(data,title,dateText){
  let p=data.payments||{};
  let expected=round((p.cash||0)+((p.returns||0)<0?(p.returns||0):0));
  return '<h2>'+esc(title)+'</h2>'+
    '<p>'+esc(company.name)+'<br>'+esc(dateText)+'</p>'+
    '<div class="totals">'+
      '<div><span>Tickets</span><b>'+data.tickets+'</b></div>'+
      '<div><span>Total generado</span><b>'+euro(data.total)+'</b></div>'+
      '<div><span>Total cobrado</span><b>'+euro(data.paidTotal||0)+'</b></div>'+
      '<div><span>Pendiente cobro</span><b>'+euro(data.pendingTotal||0)+'</b></div>'+
    '</div>'+
    '<p><b>FORMAS DE PAGO</b></p>'+
    '<div class="totals">'+
      '<div><span>Efectivo</span><b>'+euro(p.cash||0)+'</b></div>'+
      '<div><span>Tarjeta</span><b>'+euro(p.card||0)+'</b></div>'+
      '<div><span>Bizum</span><b>'+euro(p.bizum||0)+'</b></div>'+
      '<div><span>Mixto</span><b>'+euro(p.mixed||0)+'</b></div>'+
      ((p.returns||0)!==0?'<div><span>Devol./ajustes</span><b>'+euro(p.returns||0)+'</b></div>':'')+
      '<div class="final"><span>EFECTIVO ESPERADO</span><b>'+euro(expected)+'</b></div>'+
    '</div>'+
    '<p><b>VENDEDORES</b></p>'+
    (data.rows||[]).map(r=>'<div class="line"><div><b>'+esc(r.seller)+'</b><br><small>'+r.count+' tickets</small></div><b>'+euro(r.total)+'</b></div>').join('')+
    (Number(p.mixed||0)!==0?'<p><small>Mixto sin desglose interno en esta LAB.</small></p>':'');
}

window.printXReport=function(){
  let list=openPeriodTickets();
  let data=reportData(list);
  let since=zReports[0]?new Date(zReports[0].closedAt).toLocaleString('es-ES'):'Inicio de registros';
  modal('<div id="printTicket">'+reportPrintInner(data,'INFORME X','Periodo abierto desde: '+since)+'</div>'+
    '<button class="primary" onclick="window.print()">IMPRIMIR</button> <button onclick="closeModal()">Cerrar</button>');
  setTimeout(()=>window.print(),50);
};

reportsHtml=function(){
  let list=openPeriodTickets(),data=reportData(list),
      since=zReports[0]?new Date(zReports[0].closedAt).toLocaleString('es-ES'):'Inicio de registros',
      expected=cashExpectedFrom(list);
  return '<div id="cashReport">'+reportBlock(data,'Informe X · Consulta de caja','Periodo abierto desde: '+since)+'</div>'+
    (company.cashMode==='shared'
      ?'<div class="panel"><h2>Cuadre de caja compartida</h2>'+
       '<p>Efectivo esperado por movimientos registrados: <b>'+euro(expected)+'</b></p>'+
       '<label>Efectivo contado en el cajón</label>'+
       '<input id="sharedCashCount" type="number" inputmode="decimal" step="0.01">'+
       '<button onclick="showSharedCashDifference('+expected+')">Calcular diferencia</button>'+
       '<h3 id="sharedCashDifference"></h3>'+
       '<p class="notice">Si lo dejas vacío, se tomará el efectivo esperado como valor asumido y se indicará que no hubo recuento manual.</p>'+
       '<p class="warn">La diferencia corresponde al cajón compartido. No se asigna automáticamente a ningún vendedor.</p></div>'
      :'')+
    '<div class="panel"><div class="grid two">'+
      '<button onclick="printXReport()">Imprimir X</button>'+
      '<button class="danger" '+(!list.length?'disabled':'')+' onclick="closeZReport()">HACER Z · CERRAR PERIODO</button>'+
    '</div><p class="warn"><b>X:</b> consulta sin cerrar. <b>Z:</b> guarda el cierre definitivo del periodo; no elimina los tickets.</p></div>'+
    '<div class="panel"><h2>Histórico de cierres Z</h2>'+
      zReports.map((z,i)=>'<div class="line"><div><b>Z nº '+z.number+'</b><br><small>'+esc(z.date)+' · '+z.data.tickets+' tickets · '+euro(z.data.total)+'</small></div><button onclick="showZReport('+i+')">Ver Z</button></div>').join('')+
      (zReports.length?'':'<p>No se ha realizado ningún cierre Z.</p>')+
    '</div>';
};

showSharedCashDifference=function(expected){
  let el=document.getElementById('sharedCashCount'),out=document.getElementById('sharedCashDifference');
  if(!el||!out)return;
  let raw=(el.value||'').trim();
  let assumed=raw==='';
  let counted=assumed?Number(expected):Number(raw);
  if(!Number.isFinite(counted))return alert('Introduce un importe válido.');
  let d=round(counted-Number(expected||0));
  if(assumed){
    out.textContent='Sin recuento manual · se toma el efectivo esperado '+euro(counted)+' · diferencia asumida: '+euro(0);
    out.style.color='#8a5a00';
  }else{
    out.textContent='Diferencia de caja compartida: '+euro(d);
    out.style.color=d===0?'green':'#c62828';
  }
};

showZReport=function(i){
  let z=zReports[i];
  if(!z)return;
  modal('<div id="printTicket">'+reportPrintInner(z.data,'INFORME Z Nº '+z.number,'Cierre: '+z.date)+'</div>'+
    '<button class="primary" onclick="window.print()">Imprimir Z</button> <button onclick="closeModal()">Cerrar</button>');
};

})();
