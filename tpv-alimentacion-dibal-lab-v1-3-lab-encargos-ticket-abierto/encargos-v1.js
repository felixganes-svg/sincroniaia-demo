
// SINCRONIAIA · LAB ENCARGOS TICKET ABIERTO v0.1
(function(){
const ENC_PREFIX='tpv_lab_encargos_v1_';

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

})();
