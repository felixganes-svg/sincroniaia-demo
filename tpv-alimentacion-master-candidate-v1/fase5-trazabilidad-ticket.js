// SINCRONIAIA · LAB FUSIÓN · FASE 5 v8
// Trazabilidad visible y persistente de correcciones/retiradas en venta abierta.
(function(){
  function clone(v){try{return JSON.parse(JSON.stringify(v));}catch(e){return v}}
  function getReason(){
    var sel=document.getElementById('openSaleReason');
    var other=document.getElementById('openSaleReasonOther');
    var v=(sel&&sel.value||'').trim();
    if(!v){alert('Selecciona el motivo de la modificación.');return null}
    if(v==='Otro'){
      var d=(other&&other.value||'').trim();
      if(!d){alert('Escribe el motivo de la modificación.');return null}
      return d;
    }
    return v;
  }
  function escHtml(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function fmtQty(v,unit){var n=Number(v)||0;return unit==='kg'?n.toFixed(3).replace('.',','):String(n).replace('.',',')}
  function money(v){return typeof euro==='function'?euro(Number(v)||0):(Number(v)||0).toFixed(2).replace('.',',')+' €'}

  var REMOVED_KEY='tpv_fusion_fase5_removed_pending_v8';
  var CORRECTION_KEY='tpv_fusion_fase5_corrections_pending_v8';
  function loadList(key){try{var d=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(d)?d:[]}catch(e){return []}}
  var removedPending=loadList(REMOVED_KEY);
  var correctionsPending=loadList(CORRECTION_KEY);
  function savePending(){
    try{localStorage.setItem(REMOVED_KEY,JSON.stringify(removedPending))}catch(e){}
    try{localStorage.setItem(CORRECTION_KEY,JSON.stringify(correctionsPending))}catch(e){}
  }
  function currentSeller(){return (typeof selectedCloseSeller!=='undefined'&&selectedCloseSeller)?selectedCloseSeller:''}
  function forSeller(list,seller){return list.filter(function(x){return !x.seller||x.seller===seller})}

  function correctionBlock(tr,l){
    var b=tr.before||{},a=tr.after||{},unit=b.unit||(l&&l.unit)||'ud';
    var dq=(Number(a.qty)||0)-(Number(b.qty)||0);
    var dt=(Number(a.total)||0)-(Number(b.total)||0);
    return '<div style="margin:5px 0 8px;padding:7px 9px;border:1px dashed #c62828;border-radius:8px;background:#fff7f7">'+
      '<small><b>ORIGINAL:</b> '+fmtQty(b.qty,unit)+' '+escHtml(unit)+' × '+money(b.price)+' = '+money(b.total)+'</small><br>'+ 
      '<small><b style="color:#c62828">CORRECCIÓN:</b> '+(dq<0?'-':'+')+fmtQty(Math.abs(dq),unit)+' '+escHtml(unit)+' · '+(dt<0?'-':'+')+money(Math.abs(dt))+'</small><br>'+ 
      '<small><b>RESULTADO:</b> '+fmtQty(a.qty,unit)+' '+escHtml(unit)+' = '+money(a.total)+'</small><br>'+ 
      '<small><b>Motivo:</b> '+escHtml(tr.reason||'Sin motivo')+'</small></div>';
  }
  function removedBlock(tr){
    var b=tr.before||{},unit=b.unit||'ud';
    return '<div style="margin:5px 0 8px;padding:7px 9px;border:1px dashed #c62828;border-radius:8px;background:#fff7f7">'+
      '<b style="color:#c62828">ARTÍCULO ANULADO</b><br>'+ 
      '<small><b>'+escHtml(b.name||'Artículo')+'</b></small><br>'+ 
      '<small><b>ORIGINAL:</b> '+fmtQty(b.qty,unit)+' '+escHtml(unit)+' × '+money(b.price)+' = '+money(b.total)+'</small><br>'+ 
      '<small><b style="color:#c62828">ANULACIÓN:</b> -'+fmtQty(b.qty,unit)+' '+escHtml(unit)+' · -'+money(b.total)+'</small><br>'+ 
      '<small><b>Motivo:</b> '+escHtml(tr.reason||'Sin motivo')+'</small></div>';
  }
  function openTraceHtml(){
    var seller=currentSeller(),html='';
    forSeller(correctionsPending,seller).forEach(function(tr){html+=correctionBlock(tr,tr.after)});
    var rem=forSeller(removedPending,seller);
    if(rem.length){
      html+='<div style="margin-top:8px"><b style="color:#c62828">ANULACIONES EN ESTA VENTA</b>';
      rem.forEach(function(tr){html+=removedBlock(tr)});
      html+='</div>';
    }
    return html;
  }

  function install(){
    if(window.__fusionFase5InstalledV8)return;
    if(typeof saveOpenSaleQty!=='function' || typeof receiptLineHtml!=='function' || typeof finishPay!=='function' || typeof openSaleModification!=='function' || typeof showTicket!=='function')return setTimeout(install,120);
    window.__fusionFase5InstalledV8=true;

    var baseOpenSaleModification=openSaleModification;
    openSaleModification=function(){
      var out=baseOpenSaleModification.apply(this,arguments);
      try{
        var trace=openTraceHtml(),box=document.getElementById('modalBox');
        if(box&&trace){
          var total=Array.from(box.querySelectorAll('h2')).find(function(h){return /Total provisional/i.test(h.textContent||'')});
          var wrap=document.createElement('div');
          wrap.innerHTML='<div class="notice" style="margin-top:10px"><b>TRAZABILIDAD DE ESTA VENTA</b>'+trace+'</div>';
          if(total)box.insertBefore(wrap.firstChild,total);else box.appendChild(wrap.firstChild);
        }
        if(box&&typeof cart!=='undefined'&&cart.length){
          var go=document.createElement('button');go.className='primary';go.style.cssText='width:100%;margin-top:12px;min-height:54px';
          go.textContent='CONTINUAR AL SUBTOTAL / COBRAR';go.onclick=function(){showTicket()};box.appendChild(go);
        }
      }catch(e){console.warn('FASE5 v8: no se pudo mostrar trazabilidad/salida',e)}
      return out;
    };

    removeOpenSaleLine=function(index){
      var c=(typeof cart!=='undefined'?cart:null),l=(c&&c[index])?c[index]:null;
      if(!l)return alert('Línea no encontrada.');
      var reason=getReason();if(!reason)return;
      if(!confirm('Retirar '+l.name+' de esta venta abierta?'))return;
      var before=clone(l),seller=currentSeller();
      c.splice(index,1);
      if(typeof sellerMems!=='undefined'&&seller)sellerMems[seller]=c.map(clone);
      removedPending.push({type:'REMOVED',id:'R'+Date.now().toString(36)+Math.random().toString(36).slice(2,5),date:new Date().toLocaleString('es-ES'),reason:reason,seller:seller,before:before});
      savePending();
      if(typeof logOpenSaleAdjustment==='function'){try{logOpenSaleAdjustment('LÍNEA RETIRADA',before,null,reason)}catch(e){}}
      if(typeof save==='function')save();
      if(c.length){flash('Artículo retirado y registrado');openSaleModification()}
      else{closeModal();try{atRoot=true;subcat='';render()}catch(e){}flash('Artículo retirado. La venta queda vacía.')}
    };

    var baseSaveQty=saveOpenSaleQty;
    saveOpenSaleQty=function(index){
      var qty=Number(document.getElementById('openSaleQty')&&document.getElementById('openSaleQty').value);
      if(Number.isFinite(qty)&&qty===0)return removeOpenSaleLine(index);
      var c=(typeof cart!=='undefined'?cart:null),before=(c&&c[index])?clone(c[index]):null,reason=getReason(),seller=currentSeller();
      if(!reason)return;
      var out=baseSaveQty.apply(this,arguments);
      try{
        c=(typeof cart!=='undefined'?cart:null);var after=(c&&c[index])?clone(c[index]):null;
        if(before&&after&&Math.abs(Number(before.qty)-Number(after.qty))>0.0000001){
          var tr={type:'QTY_CHANGE',id:'C'+Date.now().toString(36)+Math.random().toString(36).slice(2,5),date:new Date().toLocaleString('es-ES'),reason:reason,seller:seller,before:clone(before),after:clone(after)};
          correctionsPending.push(tr);
          savePending();
          if(c[index]){
            c[index]._openSaleTrace=c[index]._openSaleTrace||[];
            c[index]._openSaleTrace.push(clone(tr));
          }
          if(typeof sellerMems!=='undefined'&&seller)sellerMems[seller]=c.map(clone);
          if(typeof save==='function')save();
          setTimeout(function(){try{openSaleModification()}catch(e){}},0);
        }
      }catch(e){console.warn('FASE5 v8: no se pudo registrar corrección',e)}
      return out;
    };

    var baseLine=receiptLineHtml;
    receiptLineHtml=function(l){var html=baseLine.apply(this,arguments);try{((l&&l._openSaleTrace)||[]).forEach(function(tr){html+=correctionBlock(tr,l)})}catch(e){}return html};

    var baseReceipt=receiptHtml;
    receiptHtml=function(t,reprint){
      var html=baseReceipt.apply(this,arguments);
      try{
        var corrections=(t&&t._openSaleCorrectionTrace&&t._openSaleCorrectionTrace.length)?t._openSaleCorrectionTrace:[];
        corrections.forEach(function(tr){html+=correctionBlock(tr,tr.after)});
        var rem=(t&&t._removedOpenSaleTrace&&t._removedOpenSaleTrace.length)?t._removedOpenSaleTrace:[];
        if(rem.length){
          var block='<div style="margin:8px 0"><b style="color:#c62828">ANULACIONES EN VENTA ABIERTA</b>';
          rem.forEach(function(tr){block+=removedBlock(tr)});block+='</div>';html+=block;
        }
      }catch(e){}
      return html;
    };

    var baseFinish=finishPay;
    finishPay=function(method,cashGiven){
      var seller=currentSeller(),pendingRemoved=forSeller(removedPending,seller),pendingCorrections=forSeller(correctionsPending,seller);
      var out=baseFinish.apply(this,arguments);
      try{
        if(typeof tickets!=='undefined'&&tickets[0]){
          if(pendingRemoved.length)tickets[0]._removedOpenSaleTrace=(tickets[0]._removedOpenSaleTrace||[]).concat(clone(pendingRemoved));
          if(pendingCorrections.length)tickets[0]._openSaleCorrectionTrace=(tickets[0]._openSaleCorrectionTrace||[]).concat(clone(pendingCorrections));
          removedPending=removedPending.filter(function(x){return pendingRemoved.indexOf(x)===-1});
          correctionsPending=correctionsPending.filter(function(x){return pendingCorrections.indexOf(x)===-1});
          savePending();
          if(typeof save==='function')save();
        }
      }catch(e){console.warn('FASE5 v8: no se pudo asociar trazabilidad al ticket',e)}
      return out;
    };
  }
  install();
})();
