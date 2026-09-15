// SINCRONIAIA · LAB FUSIÓN · FASE 5 v6
// Trazabilidad visible de correcciones y retiradas en venta abierta.
// RETIRAR ARTÍCULO elimina directamente la línea, guarda motivo y trazabilidad.
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
  var removedPending=[];

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
    var c=(typeof cart!=='undefined'?cart:[]),html='';
    c.forEach(function(l){((l&&l._openSaleTrace)||[]).forEach(function(tr){html+=correctionBlock(tr,l)})});
    if(removedPending.length){
      html+='<div style="margin-top:8px"><b style="color:#c62828">ANULACIONES EN ESTA VENTA</b>';
      removedPending.forEach(function(tr){html+=removedBlock(tr)});
      html+='</div>';
    }
    return html;
  }

  function install(){
    if(window.__fusionFase5InstalledV6)return;
    if(typeof saveOpenSaleQty!=='function' || typeof receiptLineHtml!=='function' || typeof finishPay!=='function' || typeof openSaleModification!=='function')return setTimeout(install,120);
    window.__fusionFase5InstalledV6=true;

    var baseOpenSaleModification=openSaleModification;
    openSaleModification=function(){
      var out=baseOpenSaleModification.apply(this,arguments);
      try{
        var trace=openTraceHtml(),box=document.getElementById('modalBox');
        if(trace&&box){
          var total=Array.from(box.querySelectorAll('h2')).find(function(h){return /Total provisional/i.test(h.textContent||'')});
          var wrap=document.createElement('div');
          wrap.innerHTML='<div class="notice" style="margin-top:10px"><b>TRAZABILIDAD DE ESTA VENTA</b>'+trace+'</div>';
          if(total)box.insertBefore(wrap.firstChild,total);else box.appendChild(wrap.firstChild);
        }
      }catch(e){console.warn('FASE5 v6: no se pudo mostrar trazabilidad',e)}
      return out;
    };

    // Sustitución directa: no depende de la función antigua.
    removeOpenSaleLine=function(index){
      var c=(typeof cart!=='undefined'?cart:null);
      var l=(c&&c[index])?c[index]:null;
      if(!l)return alert('Línea no encontrada.');
      var reason=getReason();if(!reason)return;
      if(!confirm('Retirar '+l.name+' de esta venta abierta?'))return;
      var before=clone(l),seller=(typeof selectedCloseSeller!=='undefined'?selectedCloseSeller:'');
      c.splice(index,1);
      if(typeof sellerMems!=='undefined'&&seller)sellerMems[seller]=c.map(clone);
      removedPending.push({type:'REMOVED',date:new Date().toLocaleString('es-ES'),reason:reason,seller:seller,before:before});
      if(typeof logOpenSaleAdjustment==='function'){
        try{logOpenSaleAdjustment('LÍNEA RETIRADA',before,null,reason)}catch(e){}
      }
      if(typeof save==='function')save();
      if(c.length){
        flash('Artículo retirado y registrado');
        openSaleModification();
      }else{
        closeModal();
        try{atRoot=true;subcat='';render()}catch(e){}
        flash('Artículo retirado. La venta queda vacía.');
      }
    };

    var baseSaveQty=saveOpenSaleQty;
    saveOpenSaleQty=function(index){
      var qty=Number(document.getElementById('openSaleQty')&&document.getElementById('openSaleQty').value);
      if(Number.isFinite(qty)&&qty===0)return removeOpenSaleLine(index);
      var c=(typeof cart!=='undefined'?cart:null),before=(c&&c[index])?clone(c[index]):null,reason=getReason();
      if(!reason)return;
      var out=baseSaveQty.apply(this,arguments);
      try{
        c=(typeof cart!=='undefined'?cart:null);var after=(c&&c[index])?c[index]:null;
        if(before&&after&&Math.abs(Number(before.qty)-Number(after.qty))>0.0000001){
          after._openSaleTrace=after._openSaleTrace||[];
          after._openSaleTrace.push({type:'QTY_CHANGE',date:new Date().toLocaleString('es-ES'),reason:reason,before:clone(before),after:clone(after)});
          if(typeof selectedCloseSeller!=='undefined'&&typeof sellerMems!=='undefined'&&selectedCloseSeller)sellerMems[selectedCloseSeller]=c.map(clone);
          if(typeof save==='function')save();
          setTimeout(function(){try{openSaleModification()}catch(e){}},0);
        }
      }catch(e){console.warn('FASE5 v6: no se pudo adjuntar trazabilidad',e)}
      return out;
    };

    var baseLine=receiptLineHtml;
    receiptLineHtml=function(l){var html=baseLine.apply(this,arguments);try{((l&&l._openSaleTrace)||[]).forEach(function(tr){html+=correctionBlock(tr,l)})}catch(e){}return html};

    var baseReceipt=receiptHtml;
    receiptHtml=function(t,reprint){
      var html=baseReceipt.apply(this,arguments);
      try{
        var rem=(t&&t._removedOpenSaleTrace&&t._removedOpenSaleTrace.length)?t._removedOpenSaleTrace:removedPending;
        if(!rem||!rem.length)return html;
        var block='<div style="margin:8px 0"><b style="color:#c62828">ANULACIONES EN VENTA ABIERTA</b>';
        rem.forEach(function(tr){block+=removedBlock(tr)});block+='</div>';
        if(/<div class=["']totals["']/.test(html))html=html.replace(/<div class=(["'])totals\1/,block+'<div class="totals"');else html+=block;
      }catch(e){}
      return html;
    };

    var baseFinish=finishPay;
    finishPay=function(method,cashGiven){
      var pending=removedPending.slice(),out=baseFinish.apply(this,arguments);
      try{
        if(pending.length&&typeof tickets!=='undefined'&&tickets[0]){
          tickets[0]._removedOpenSaleTrace=(tickets[0]._removedOpenSaleTrace||[]).concat(pending);
          removedPending=removedPending.filter(function(x){return pending.indexOf(x)===-1});
          if(typeof save==='function')save();
        }
      }catch(e){}
      return out;
    };
  }
  install();
})();
