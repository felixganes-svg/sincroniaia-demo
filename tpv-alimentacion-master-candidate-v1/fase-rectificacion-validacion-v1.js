/* SINCRONIAIA TPV · LAB FUSIÓN
   Rectificación · validación mínima
   1) Código Empresa correcto entra automáticamente.
   2) Peso/unidades o precio vacíos no se convierten en 0.
   LAB aislado: no modifica la base A/B.
*/
(function(){
  'use strict';

  window.requestTicketCorrection=function(id){
    let t=tickets.find(x=>String(x.id)===String(id));
    if(!t)return alert('Ticket no encontrado.');
    if(t.rectifies)return alert('Un ticket rectificativo no se modifica directamente.');
    correctionAuthorizedTicket=null;
    modal(`<h2>Autorización para rectificar</h2><p class="warn">La rectificación modifica el resultado económico de una venta cerrada. Requiere autorización de encargado o Empresa.</p><p><b>Ticket nº ${esc(t.number)}</b> · ${euro(t.total)}</p><label>Código encargado / Empresa</label><input id="correctionAuthCode" type="password" inputmode="numeric" autocomplete="off" autofocus placeholder="Código de autorización" oninput="tryTicketCorrectionCode('${t.id}')" onkeydown="if(event.key==='Enter'){event.preventDefault();checkTicketCorrectionCode('${t.id}')}" ><p><button class="primary" onclick="checkTicketCorrectionCode('${t.id}')">AUTORIZAR RECTIFICACIÓN</button> <button onclick="openStoredTicket('${t.id}')">Cancelar</button></p><p class="muted">Con el código correcto entrarás directamente.</p>`);
    setTimeout(()=>document.getElementById('correctionAuthCode')?.focus(),50);
  };

  window.tryTicketCorrectionCode=function(id){
    let f=document.getElementById('correctionAuthCode');
    if(!f)return;
    let code=String(f.value||'').trim();
    if(code===String(company.adminCode||'')){
      correctionAuthorizedTicket=String(id);
      beginTicketCorrection(id);
    }
  };

  const originalSaveTicketCorrection=window.saveTicketCorrection;
  window.saveTicketCorrection=function(id,index){
    let qtyEl=document.getElementById('correctQty');
    let priceEl=document.getElementById('correctPrice');
    let qtyRaw=String(qtyEl?.value??'').trim();
    let priceRaw=String(priceEl?.value??'').trim();

    if(qtyRaw===''){
      alert('Indica el peso o la cantidad correcta. Si quieres devolver toda la línea, escribe 0 expresamente.');
      qtyEl?.focus();
      return;
    }
    if(priceRaw===''){
      alert('Indica el precio correcto.');
      priceEl?.focus();
      return;
    }
    return originalSaveTicketCorrection(id,index);
  };
})();
