// SINCRONIAIA · LAB FUSIÓN · FASE 5
// Trazabilidad visible de correcciones realizadas en venta abierta.
// No modifica A/B. Añade metadatos a la línea corregida y los muestra en ticket/copia.
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
  function fmtQty(v,unit){
    var n=Number(v)||0;
    return unit==='kg'?n.toFixed(3).replace('.',','):String(n).replace('.',',');
  }
  function money(v){
    if(typeof euro==='function') return euro(Number(v)||0);
    return (Number(v)||0).toFixed(2).replace('.',',')+' €';
  }

  function install(){
    if(window.__fusionFase5Installed) return;
    if(typeof window.saveOpenSaleQty!=='function' || typeof window.receiptHtml!=='function'){
      return setTimeout(install,120);
    }
    window.__fusionFase5Installed=true;

    var baseSaveQty=window.saveOpenSaleQty;
    window.saveOpenSaleQty=function(index){
      var before=(window.cart&&window.cart[index])?clone(window.cart[index]):null;
      var reason=getReason();
      var out=baseSaveQty.apply(this,arguments);
      try{
        var after=(window.cart&&window.cart[index])?window.cart[index]:null;
        if(before&&after&&Math.abs(Number(before.qty)-Number(after.qty))>0.0000001){
          after._openSaleTrace=after._openSaleTrace||[];
          after._openSaleTrace.push({
            type:'QTY_CHANGE',
            date:new Date().toLocaleString('es-ES'),
            reason:reason,
            before:clone(before),
            after:clone(after),
            deltaQty:Number(after.qty)-Number(before.qty),
            deltaTotal:(Number(after.total)||0)-(Number(before.total)||0)
          });
          if(window.selectedCloseSeller && window.sellerMems){
            window.sellerMems[window.selectedCloseSeller]=window.cart.map(clone);
          }
          if(typeof window.save==='function') window.save();
        }
      }catch(e){console.warn('FASE5: no se pudo adjuntar trazabilidad a la línea',e)}
      return out;
    };

    if(typeof window.removeOpenSaleLine==='function'){
      var baseRemove=window.removeOpenSaleLine;
      window.removeOpenSaleLine=function(index){
        var before=(window.cart&&window.cart[index])?clone(window.cart[index]):null;
        var reason=getReason();
        var seller=window.selectedCloseSeller||'';
        var out=baseRemove.apply(this,arguments);
        try{
          if(before){
            var pending=JSON.parse(localStorage.getItem('tpv_fusion_fase5_removed')||'[]');
            pending.push({type:'REMOVED',date:new Date().toLocaleString('es-ES'),reason:reason,seller:seller,before:before});
            if(pending.length>100)pending=pending.slice(-100);
            localStorage.setItem('tpv_fusion_fase5_removed',JSON.stringify(pending));
          }
        }catch(e){console.warn('FASE5: no se pudo guardar retirada pendiente',e)}
        return out;
      };
    }

    var baseReceipt=window.receiptHtml;
    window.receiptHtml=function(t,copy){
      try{
        if(t && !t._fusionRemovedAttached){
          var pending=JSON.parse(localStorage.getItem('tpv_fusion_fase5_removed')||'[]');
          var mine=pending.filter(function(x){return !x.seller || x.seller===t.seller});
          if(mine.length){
            t._removedOpenSaleTrace=(t._removedOpenSaleTrace||[]).concat(mine);
            t._fusionRemovedAttached=true;
            pending=pending.filter(function(x){return mine.indexOf(x)===-1});
            localStorage.setItem('tpv_fusion_fase5_removed',JSON.stringify(pending));
            if(typeof window.save==='function') window.save();
          }
        }
      }catch(e){console.warn('FASE5: retirada pendiente no adjuntada',e)}

      var html=baseReceipt.apply(this,arguments);
      try{
        var traces=[];
        (t&&t.items||[]).forEach(function(item){
          (item._openSaleTrace||[]).forEach(function(x){traces.push(x)});
        });
        (t&&t._removedOpenSaleTrace||[]).forEach(function(x){traces.push(x)});
        if(!traces.length) return html;

        var block='<div class="panel" style="margin:10px 0;padding:10px;border:2px solid #c62828;background:#fff7f7">'+
          '<h3 style="margin:0 0 8px;color:#c62828">CORRECCIONES / ANULACIONES</h3>';
        traces.forEach(function(tr){
          var b=tr.before||{},a=tr.after||null,unit=b.unit||'ud';
          if(tr.type==='REMOVED'){
            block+='<div style="padding:7px 0;border-top:1px dashed #c9c9c9">'+
              '<b>'+escHtml(b.name||'Artículo')+'</b><br>'+ 
              '<small>ORIGINAL: '+fmtQty(b.qty,unit)+' '+escHtml(unit)+' × '+money(b.price)+' = '+money(b.total)+'</small><br>'+ 
              '<b style="color:#c62828">ANULADO: -'+fmtQty(b.qty,unit)+' '+escHtml(unit)+' = -'+money(b.total)+'</b><br>'+ 
              '<small><b>Motivo:</b> '+escHtml(tr.reason||'Sin motivo')+'</small></div>';
          }else{
            var dq=(Number(a&&a.qty)||0)-(Number(b.qty)||0);
            var dt=(Number(a&&a.total)||0)-(Number(b.total)||0);
            block+='<div style="padding:7px 0;border-top:1px dashed #c9c9c9">'+
              '<b>'+escHtml(b.name||'Artículo')+'</b><br>'+ 
              '<small>ORIGINAL: '+fmtQty(b.qty,unit)+' '+escHtml(unit)+' × '+money(b.price)+' = '+money(b.total)+'</small><br>'+ 
              '<b style="color:#c62828">CORRECCIÓN: '+(dq<0?'-':'+')+fmtQty(Math.abs(dq),unit)+' '+escHtml(unit)+' · '+(dt<0?'-':'+')+money(Math.abs(dt))+'</b><br>'+ 
              '<small>RESULTADO: '+fmtQty(a&&a.qty,unit)+' '+escHtml(unit)+' = '+money(a&&a.total)+'</small><br>'+ 
              '<small><b>Motivo:</b> '+escHtml(tr.reason||'Sin motivo')+'</small></div>';
          }
        });
        block+='</div>';

        if(/<div class=["']totals["']/.test(html)){
          html=html.replace(/<div class=(["'])totals\1/,block+'<div class="totals"');
        }else if(/<hr/i.test(html)){
          html=html.replace(/<hr/i,block+'<hr');
        }else{
          html+=block;
        }
      }catch(e){console.warn('FASE5: no se pudo pintar trazabilidad en ticket',e)}
      return html;
    };
  }
  install();
})();
