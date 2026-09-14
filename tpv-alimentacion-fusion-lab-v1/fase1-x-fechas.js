(function(){
  'use strict';

  function ymdLocal(d){
    d=d||new Date();
    return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
  }

  function enhanceReportsHtml(){
    if(typeof window.reportsHtml!=='function') return;
    const original=window.reportsHtml;
    window.reportsHtml=function(){
      let h=original.apply(this,arguments);
      const today=ymdLocal();
      h=h.replace(/<input id="reportFrom" type="date"(?: value="[^"]*")?>/i,'<input id="reportFrom" type="date" value="'+today+'">');
      h=h.replace(/<input id="reportTo" type="date"(?: value="[^"]*")?>/i,'<input id="reportTo" type="date" value="'+today+'">');
      if(h.indexOf('id="xDateResult"')===-1){
        h=h.replace(/(<p class="notice">Consultar admite un día o un rango[\s\S]*?<\/p>)/i,'<div id="xDateResult" style="margin-top:12px"></div>$1');
      }
      return h;
    };
  }

  function filteredTickets(from,to){
    if(typeof window.ticketsByDateRange==='function') return window.ticketsByDateRange(from,to,false);
    const source=Array.isArray(window.tickets)?window.tickets:[];
    return source.filter(function(t){
      let d='';
      if(typeof window.ticketDay==='function') d=window.ticketDay(t);
      if(!d){
        const n=Number(t&&t.id);
        if(Number.isFinite(n)&&n>100000000000){
          const dt=new Date(n);
          d=ymdLocal(dt);
        }else{
          const m=String((t&&t.date)||'').match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
          if(m)d=m[3]+'-'+m[2].padStart(2,'0')+'-'+m[1].padStart(2,'0');
        }
      }
      return d&&d>=from&&d<=to;
    });
  }

  window.showXByDate=function(){
    let from=(document.getElementById('reportFrom')||{}).value||'';
    let to=(document.getElementById('reportTo')||{}).value||'';
    if(!from&&!to){
      from=to=ymdLocal();
      const f=document.getElementById('reportFrom'),t=document.getElementById('reportTo');
      if(f)f.value=from;if(t)t.value=to;
    }
    if(!from)from=to;
    if(!to)to=from;
    if(from>to)return alert('La fecha Desde no puede ser posterior a Hasta.');

    const list=filteredTickets(from,to);
    const label=from===to
      ? 'Jornada '+(typeof window.formatYmd==='function'?window.formatYmd(from):from)
      : 'Del '+(typeof window.formatYmd==='function'?window.formatYmd(from):from)+' al '+(typeof window.formatYmd==='function'?window.formatYmd(to):to);

    if(typeof window.reportData!=='function'||typeof window.reportBlock!=='function'){
      return alert('No se puede generar el informe por fechas en esta vista.');
    }

    const html=window.reportBlock(window.reportData(list),'Informe X · Consulta por fechas',label);
    const target=document.getElementById('xDateResult');
    if(target){
      target.innerHTML=html+'<div class="panel"><button class="primary" onclick="window.print()">Imprimir X por fechas</button></div>';
      target.scrollIntoView({behavior:'smooth',block:'start'});
    }else if(typeof window.modal==='function'){
      window.modal(html+'<button class="primary" onclick="window.print()">Imprimir X</button> <button onclick="closeModal()">Cerrar</button>');
    }
  };

  enhanceReportsHtml();
})();
