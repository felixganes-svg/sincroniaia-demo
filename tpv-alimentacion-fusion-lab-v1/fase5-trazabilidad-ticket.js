// SINCRONIAIA · LAB FUSIÓN · FASE 5 v2
// Trazabilidad visible de correcciones realizadas en venta abierta.
// No modifica A/B. Conserva original + corrección + motivo en ticket y copia.
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

  function install(){
    if(window.__fusionFase5InstalledV2)return;
    if(typeof saveOpenSaleQty!=='function' || typeof receiptLineHtml!=='function')return setTimeout(install,120);
    window.__fusionFase5InstalledV2=true;

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
          if(typeof selectedCloseSeller!=='undefined' && typeof sellerMems!=='undefined' && selectedCloseSeller){
            sellerMems[selectedCloseSeller]=c.map(clone);
          }
          if(typeof save==='function')save();
        }
      }catch(e){console.warn('FASE5 v2: no se pudo adjuntar trazabilidad',e)}
      return out;
    };

    var baseLine=receiptLineHtml;
    receiptLineHtml=function(l){
      var html=baseLine.apply(this,arguments);
      try{
        var traces=(l&&l._openSaleTrace)||[];
        if(!traces.length)return html;
        var extra='';
        traces.forEach(function(tr){
          var b=tr.before||{},a=tr.after||{},unit=b.unit||l.unit||'ud';
          var dq=(Number(a.qty)||0)-(Number(b.qty)||0);
          var dt=(Number(a.total)||0)-(Number(b.total)||0);
          extra+='<div style="margin:5px 0 8px;padding:7px 9px;border:1px dashed #c62828;border-radius:8px;background:#fff7f7">'+
            '<small><b>ORIGINAL:</b> '+fmtQty(b.qty,unit)+' '+escHtml(unit)+' × '+money(b.price)+' = '+money(b.total)+'</small><br>'+ 
            '<small><b style="color:#c62828">CORRECCIÓN:</b> '+(dq<0?'-':'+')+fmtQty(Math.abs(dq),unit)+' '+escHtml(unit)+' · '+(dt<0?'-':'+')+money(Math.abs(dt))+'</small><br>'+ 
            '<small><b>RESULTADO:</b> '+fmtQty(a.qty,unit)+' '+escHtml(unit)+' = '+money(a.total)+'</small><br>'+ 
            '<small><b>Motivo:</b> '+escHtml(tr.reason||'Sin motivo')+'</small></div>';
        });
        return html+extra;
      }catch(e){console.warn('FASE5 v2: no se pudo pintar corrección',e);return html}
    };
  }
  install();
})();
