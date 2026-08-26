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
  if(botonInforme){
    botonInforme.addEventListener('click',function(){setTimeout(reiniciarInforme,25)});
  }

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
          html+='<table style="margin-top:14px"><tr><th>Fecha</th><th>Horario / marcajes</th><th>Total día</th></tr>';
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
