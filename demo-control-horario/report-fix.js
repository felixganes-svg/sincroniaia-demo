window.addEventListener('load', function () {
  function esc(v){return String(v==null?'':v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;')}

  function sinDuplicadosConsecutivos(marcajes){
    var salida=[];
    (Array.isArray(marcajes)?marcajes:[]).forEach(function(m){
      var tipo=String((m&&m.tipo)||'').toUpperCase();
      
      var hora=String((m&&m.hora)||'');
      var anterior=salida.length?salida[salida.length-1]:null;
      if(anterior && String(anterior.tipo||'').toUpperCase()===tipo && String(anterior.hora||'')===hora) return;
      salida.push(m);
    });
    return salida;
  }

  function reiniciarInforme(){
    var trabajador=document.getElementById('fTrabajador');
    var desde=document.getElementById('fDesde');
    var hasta=document.getElementById('fHasta');
    var destino=document.getElementById('informe');
    if(trabajador) trabajador.value='';
    if(desde) desde.value='';
    if(hasta) hasta.value='';
    if(destino) destino.innerHTML='';
  }

  if(typeof window.abrirFichaEmpresa==='function'){
    var abrirFichaEmpresaOriginal=window.abrirFichaEmpresa;
    window.abrirFichaEmpresa=function(tipo){
      if(tipo==='informe') reiniciarInforme();
      var resultado=abrirFichaEmpresaOriginal.apply(this,arguments);
      if(tipo==='informe') setTimeout(reiniciarInforme,0);
      return resultado;
    };
  }

  var botonInforme=document.querySelector('#empresaMenu button[onclick*="abrirFichaEmpresa(\'informe\')"]');
  if(botonInforme) botonInforme.addEventListener('click',function(){setTimeout(reiniciarInforme,25)});

  function textoPeriodo(){
    var desde=document.getElementById('fDesde');
    var hasta=document.getElementById('fHasta');
    var d=desde&&desde.value?desde.value:'';
    var h=hasta&&hasta.value?hasta.value:'';
    if(!d&&!h) return '';
    if(d&&h) return 'Periodo: '+d+' a '+h;
    return d?'Desde: '+d:'Hasta: '+h;
  }

  function prepararDocumentoPDF(){
    var informe=document.getElementById('informe');
    if(!informe || !informe.querySelector('.informe-detallado')) return null;
    var cont=document.createElement('div');
    cont.style.cssText='font-family:Arial,sans-serif;color:#392414;background:#fff;padding:0;margin:0;width:100%;';
    var cab=document.createElement('div');
    cab.style.cssText='text-align:center;margin:0 0 18px 0;padding:0 0 12px 0;border-bottom:1px solid #ead9c6;';
    cab.innerHTML='<h1 style="font-size:22px;margin:0 0 5px 0">Panadería Todo Bueno Mataró</h1><div style="font-size:15px;font-weight:700">Informe de fichajes</div>'+(textoPeriodo()?'<div style="font-size:11px;color:#77695f;margin-top:5px">'+esc(textoPeriodo())+'</div>':'');
    cont.appendChild(cab);
    var copia=informe.querySelector('.informe-detallado').cloneNode(true);
    var pistaDeslizar=copia.querySelector('.pista-deslizar');
    if(pistaDeslizar) pistaDeslizar.remove();
    copia.querySelectorAll('.card').forEach(function(card){
      card.style.cssText='border:1px solid #ead9c6;border-radius:10px;padding:14px;margin:0 0 14px 0;background:#fff;box-shadow:none;page-break-inside:avoid;break-inside:avoid;';
    });
    copia.querySelectorAll('.topline').forEach(function(el){el.style.cssText='display:flex;justify-content:space-between;align-items:flex-start;gap:12px;'});
    copia.querySelectorAll('table').forEach(function(tabla){tabla.style.cssText='width:100%;border-collapse:collapse;margin-top:12px;font-size:10px;page-break-inside:avoid;break-inside:avoid;';});
    copia.querySelectorAll('th,td').forEach(function(celda){celda.style.cssText='text-align:left;padding:6px;border-bottom:1px solid #ead9c6;vertical-align:top;';});
    copia.querySelectorAll('tr').forEach(function(fila){fila.style.pageBreakInside='avoid';fila.style.breakInside='avoid';});
    cont.appendChild(copia);
    return cont;
  }

  var cargandoPDF=false;
  function asegurarMotorPDF(done){
    if(typeof window.html2pdf==='function'){done(true);return}
    if(cargandoPDF){setTimeout(function(){asegurarMotorPDF(done)},250);return}
    cargandoPDF=true;
    var s=document.createElement('script');
    s.src='https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    s.referrerPolicy='no-referrer';
    s.onload=function(){cargandoPDF=false;done(typeof window.html2pdf==='function')};
    s.onerror=function(){cargandoPDF=false;done(false)};
    document.head.appendChild(s);
  }

  window.descargarInformePDF=function(){
    var doc=prepararDocumentoPDF();
    if(!doc){alert('Primero consulta un informe.');return}
    var boton=document.querySelector('#fichaInforme .actions button[onclick*="descargarInformePDF"]');
    var textoOriginal=boton?boton.textContent:'';
    if(boton){boton.disabled=true;boton.textContent='Generando PDF…'}
    asegurarMotorPDF(function(ok){
      if(!ok){if(boton){boton.disabled=false;boton.textContent=textoOriginal||'Descargar PDF'}alert('No se ha podido cargar el generador de PDF. Comprueba la conexión y vuelve a intentarlo.');return}
      var ahora=new Date();
      var nombre='Todo-Bueno-Control-Horario-'+ahora.getFullYear()+'-'+String(ahora.getMonth()+1).padStart(2,'0')+'-'+String(ahora.getDate()).padStart(2,'0')+'.pdf';
      var opciones={margin:[10,10,10,10],filename:nombre,image:{type:'jpeg',quality:0.98},html2canvas:{scale:2,useCORS:true,backgroundColor:'#ffffff'},jsPDF:{unit:'mm',format:'a4',orientation:'portrait'},pagebreak:{mode:['css','legacy'],avoid:['.card','tr']}};
      window.html2pdf().set(opciones).from(doc).save().then(function(){if(boton){boton.disabled=false;boton.textContent=textoOriginal||'Descargar PDF'}}).catch(function(){if(boton){boton.disabled=false;boton.textContent=textoOriginal||'Descargar PDF'}alert('No se ha podido generar el PDF. Vuelve a intentarlo.')});
    });
  };

  var botonPDF=document.querySelector('#fichaInforme .actions button[onclick*="window.print"]');
  if(botonPDF){botonPDF.textContent='Descargar PDF';botonPDF.setAttribute('onclick','descargarInformePDF()')}

  window.cargarInforme=function(){
    var codigo=document.getElementById('fTrabajador').value;
    var desde=document.getElementById('fDesde').value;
    var hasta=document.getElementById('fHasta').value;
    var destino=document.getElementById('informe');
    if(destino) destino.innerHTML='<p class="muted">Cargando informe…</p>';
    api('informe',{owner:OWNER,codigo:codigo,desde:desde,hasta:hasta},function(r){
      if(!r||!r.ok){if(destino)destino.innerHTML='';alert((r&&r.error)?r.error:'No se pudo cargar el informe.');return}
      var trabajadores=Array.isArray(r.trabajadores)?r.trabajadores:[];
      if(!trabajadores.length){destino.innerHTML='<p class="muted">No hay trabajadores para el periodo seleccionado.</p>';return}
      var html='<div class="informe-detallado">';
      trabajadores.forEach(function(t){
        html+='<div class="card" style="margin:14px 0;padding:16px"><div class="topline"><div><h3 style="margin:0">'+esc(t.nombre||'')+'</h3><p class="muted small" style="margin:5px 0 0">Código '+esc(t.codigo||'')+'</p></div><div style="text-align:right"><span class="muted small">Total periodo</span><br><b style="font-size:22px">'+esc(t.total||'0:00')+'</b></div></div>';
        var dias=Array.isArray(t.dias)?t.dias:[];
        if(!dias.length){
          html+='<p class="muted small" style="margin-top:14px">Sin fichajes en este periodo.</p>';
        }else{
          html+='<p class="muted small pista-deslizar" style="margin:14px 0 6px">Desliza hacia los lados para ver todos los datos →</p><table style="margin-top:0"><tr><th>Fecha</th><th>Horario / marcajes</th><th>Total día</th></tr>';
          dias.forEach(function(d){
            var marcajes=sinDuplicadosConsecutivos(d.marcajes);
            var textoMarcajes=marcajes.map(function(m){
              var tipo=String(m.tipo||'').toUpperCase()==='ENTRADA'?'Entrada':(String(m.tipo||'').toUpperCase()==='SALIDA'?'Salida':String(m.tipo||''));
              return '<b>'+esc(tipo)+'</b> '+esc(m.hora||'—');
            }).join(' &nbsp;·&nbsp; ');
            html+='<tr><td>'+esc(d.fecha||d.fecha_iso||'')+'</td><td>'+(textoMarcajes||'—')+'</td><td><b>'+esc(d.total||'0:00')+'</b></td></tr>';
          });
          html+='</table>';
        }
        html+='</div>';
      });
      html+='</div>';
      destino.innerHTML=html;
    });
  };
});
