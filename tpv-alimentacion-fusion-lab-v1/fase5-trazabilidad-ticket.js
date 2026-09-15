// SINCRONIAIA · LAB FUSIÓN · FASE 5 v3
// Trazabilidad visible de correcciones y retiradas en venta abierta.
// No modifica A/B. Conserva original + corrección/anulación + motivo en ticket y copia.
(function(){
  function clone(v){try{return JSON.parse(JSON.stringify(v));}catch(e){return v}}
  function getReason(){
    var sel=document.getElementById('openSaleReason');
    var other=document.getElementById('openSaleReasonOther');
    var v=(sel&&sel.value||'').trim();
    if(v==='Otro') return (other&&other.value||'').trim()||'Otro';
    return v||'Sin motivo';
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

  function install(){
    if(window.__fusionFase5InstalledV3)return;
    if(typeof saveOpenSaleQty!=='function' || typeof removeOpenSaleLine!=='function' || typeof receiptLineHtml!=='function' || typeof finishPay!=='function')return setTimeout(install,120);
    window.__fusionFase5InstalledV3=true;

    var baseSaveQty=saveOpenSaleQty;
    saveOpenSaleQty=function(index){
      var c=(typeof cart!=='undefined'?cart:null);
      var before=(c&&c[index])?clone(c[index]):null;
      var reason=getReason();
      var out=baseSaveQty.apply(this,arguments);
      try{
        c=(typeof cart!=='undefined'?cart:null);
        var after=(c&&c[index])?c[index]:null;
        if(before&&after&&Math.abs(Number(before.qty)-Number(after.qty))>0.0000001){
          after._openSaleTrace=after._openSaleTrace||[];
          after._openSaleTrace.push({type:'QTY_CHANGE',date:new Date().toLocaleString('es-ES'),reason:reason,before:clone(before),after:clone(after)});
          if(typeof selectedCloseSeller!=='undefined' && typeof sellerMems!=='undefined' && selectedCloseSeller){sellerMems[selectedCloseSeller]=c.map(clone)}
          if(typeof save==='function')save();
        }
      }catch(e){console.warn('FASE5 v3: no se pudo adjuntar trazabilidad',e)}
      return out;
    };

    var baseRemove=removeOpenSaleLine;
    removeOpenSaleLine=function(index){
      var c=(typeof cart!=='undefined'?cart:null);
      var before=(c&&c[index])?clone(c[index]):null;
      var reason=getReason();
      var seller=(typeof selectedCloseSeller!=='undefined'?selectedCloseSeller:'');
      var lenBefore=c?c.length:0;
      var out=baseRemove.apply(this,arguments);
      try{
        c=(typeof cart!=='undefined'?cart:null);
        if(before&&c&&c.length===lenBefore-1){
          removedPending.push({type:'REMOVED',date:new Date().toLocaleString('es-ES'),reason:reason,seller:seller,before:before});
        }
      }catch(e){console.warn('FASE5 v3: no se pudo registrar retirada',e)}
      return out;
    };

    var baseLine=receiptLineHtml;
    receiptLineHtml=function(l){
      var html=baseLine.apply(this,arguments);
      try{((l&&l._openSaleTrace)||[]).forEach(function(tr){html+=correctionBlock(tr,l)})}catch(e){console.warn('FASE5 v3: no se pudo pintar corrección',e)}
      return html;
    };

    var baseFinish=finishPay;
    finishPay=function(method,cashGiven){
      var pending=removedPending.slice();
      var out=baseFinish.apply(this,arguments);
      try{
        if(pending.length && typeof tickets!=='undefined' && tickets[0]){
          tickets[0]._removedOpenSaleTrace=(tickets[0]._removedOpenSaleTrace||[]).concat(pending);
          removedPending=removedPending.filter(function(x){return pending.indexOf(x)===-1});
          if(typeof save==='function')save();
        }
      }catch(e){console.warn('FASE5 v3: no se pudo asociar retirada al ticket',e)}
      return out;
    };

    var baseReceipt=receiptHtml;
    receiptHtml=function(t,reprint){
      var html=baseReceipt.apply(this,arguments);
      try{
        var rem=(t&&t._removedOpenSaleTrace)||[];
        if(!rem.length)return html;
        var block='<div style="margin:8px 0"><b style="color:#c62828">ANULACIONES EN VENTA ABIERTA</b>';
        rem.forEach(function(tr){block+=removedBlock(tr)});
        block+='</div>';
        if(/<div class=["']totals["']/.test(html))html=html.replace(/<div class=(["'])totals\1/,block+'<div class="totals"');
        else html+=block;
      }catch(e){console.warn('FASE5 v3: no se pudo pintar retirada en ticket',e)}
      return html;
    };
  }
  install();
})();
