/* SINCRONIAIA TPV · LAB FUSIÓN
   Informes X/Z · visibilidad de rectificaciones
   - No altera el cálculo original del X/Z.
   - Añade detalle explícito de rectificaciones ya incluidas en el total.
   - Se aplica también a consultas por fecha y a nuevos cierres Z.
*/
(function(){
  'use strict';

  function money(v){
    return (typeof euro==='function') ? euro(Number(v)||0) : (Number(v)||0).toFixed(2).replace('.',',')+' €';
  }
  function escHtml(s){
    return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]});
  }

  function install(){
    if(window.__fusionInformesRectificacionesV1)return;
    if(typeof window.reportData!=='function' || typeof window.reportBlock!=='function'){
      return setTimeout(install,120);
    }
    window.__fusionInformesRectificacionesV1=true;

    var baseReportData=window.reportData;
    var baseReportBlock=window.reportBlock;

    window.reportData=function(list){
      var data=baseReportData.apply(this,arguments) || {};
      var source=Array.isArray(list)?list:[];
      var rects=source.filter(function(t){return !!(t&&t.rectifies)}).map(function(t){
        return {
          number:t.number,
          date:t.date,
          seller:t.seller||'Sin vendedor',
          method:t.method||'',
          total:Number(t.total)||0,
          rectifies:t.rectifies
        };
      });
      data._rectifications=rects;
      data._rectificationPositive=rects.filter(function(t){return t.total>0}).reduce(function(s,t){return s+t.total},0);
      data._rectificationNegative=rects.filter(function(t){return t.total<0}).reduce(function(s,t){return s+t.total},0);
      data._rectificationNet=rects.reduce(function(s,t){return s+t.total},0);
      return data;
    };

    window.reportBlock=function(data,title,dateText){
      var html=baseReportBlock.apply(this,arguments);
      var rects=(data&&Array.isArray(data._rectifications))?data._rectifications:[];
      if(!rects.length)return html;

      var pos=Number(data._rectificationPositive)||0;
      var neg=Number(data._rectificationNegative)||0;
      var net=Number(data._rectificationNet)||0;

      var rows=rects.map(function(t){
        var kind=t.total<0?'DEVOLUCIÓN':'COBRO DIFERENCIA';
        return '<tr>'+
          '<td><b>'+escHtml(t.number)+'</b></td>'+
          '<td>'+escHtml(t.date)+'</td>'+
          '<td>'+escHtml(t.seller)+'</td>'+
          '<td>'+escHtml(kind)+'</td>'+
          '<td>'+money(t.total)+'</td>'+
          '<td>Rectifica nº '+escHtml(t.rectifies)+'</td>'+
        '</tr>';
      }).join('');

      html += '<div class="panel" id="xzRectifications">'+
        '<h3>Rectificaciones incluidas en este informe</h3>'+
        '<p class="notice">Estos importes ya están incluidos en el resultado total del X/Z. Se muestran aquí de forma separada para que puedan comprobarse.</p>'+
        '<div class="totals">'+
          '<div><span>Tickets rectificativos</span><b>'+rects.length+'</b></div>'+
          '<div><span>Cobros por diferencia</span><b>'+money(pos)+'</b></div>'+
          '<div><span>Devoluciones</span><b>'+money(neg)+'</b></div>'+
          '<div class="final"><span>IMPACTO NETO RECTIFICACIONES</span><b>'+money(net)+'</b></div>'+
        '</div>'+
        '<div class="tableWrap"><table><thead><tr><th>Ticket</th><th>Fecha</th><th>Vendedor</th><th>Tipo</th><th>Importe</th><th>Original</th></tr></thead><tbody>'+rows+'</tbody></table></div>'+
      '</div>';
      return html;
    };
  }

  install();
})();
