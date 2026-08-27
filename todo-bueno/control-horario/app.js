var CFG=window.TODO_BUENO_CONFIG||{};
var OWNER='7826';
var currentCode='';
var pendingCode='';
var countdownId=null;
var fichando=false;
var trabajadoresPanel=[];
var filtroTrabajadores='ACTIVOS';
var altaCodigoComprobado='';
var altaCodigoDisponible=false;
var altaConsultaSecuencia=0;
var miComputoRespuesta=null;
var miComputoPeriodo='hoy';

function api(action,params,done){
  if(!CFG.API_URL){done({ok:false,error:'BACKEND_NO_CONFIGURADO'});return;}
  var cb='tbcb_'+Date.now()+'_'+Math.floor(Math.random()*9999);
  var s=document.createElement('script');
  window[cb]=function(data){try{done(data);}finally{delete window[cb];s.remove();}};
  var q=['action='+encodeURIComponent(action),'callback='+encodeURIComponent(cb)];
  Object.keys(params||{}).forEach(function(k){q.push(encodeURIComponent(k)+'='+encodeURIComponent(params[k]==null?'':params[k]));});
  s.src=CFG.API_URL+(CFG.API_URL.indexOf('?')>=0?'&':'?')+q.join('&');
  s.onerror=function(){delete window[cb];s.remove();done({ok:false,error:'No se pudo conectar con el servicio'});};
  document.body.appendChild(s);
}

function esc(v){return String(v==null?'':v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}
function showAviso(txt){var a=document.getElementById('aviso');a.textContent=txt;a.classList.remove('hidden');}
function hideAviso(){document.getElementById('aviso').classList.add('hidden');}
function pin(){var s='';document.querySelectorAll('.pin input').forEach(function(x){s+=x.value.replace(/\D/g,'');});return s;}
function limpiarPin(){document.querySelectorAll('.pin input').forEach(function(x){x.value='';});var p=document.querySelector('.pin input');if(p)p.focus();}

function procesarCodigo(){
  if(fichando)return;
  hideAviso();
  var c=pin();
  if(c.length!==4){showAviso('Introduce un código de 4 cifras');return;}
  fichando=true;
  var requestId='tb_'+Date.now()+'_'+Math.random().toString(36).slice(2);
  var b=document.getElementById('btnFichar');b.disabled=true;b.textContent='Registrando…';
  api('fichar',{codigo:c,request_id:requestId},function(r){
    fichando=false;b.disabled=false;b.textContent='Fichar';
    if(!r||!r.ok){showAviso(r&&r.error?r.error:'No se pudo registrar el fichaje');limpiarPin();return;}
    if(r.rol==='EMPRESA'){if(r.owner)OWNER=String(r.owner);abrirEmpresa();return;}
    if(r.requiere_confirmacion_salida){pendingCode=c;document.getElementById('kiosk').classList.add('hidden');document.getElementById('salidaNombre').textContent=r.nombre||'';document.getElementById('confirmarSalida').classList.remove('hidden');return;}
    currentCode=c;mostrarConfirmacion(r);
  });
}

function confirmarSalidaAhora(){
  if(fichando||!pendingCode)return;
  fichando=true;
  var c=pendingCode;
  var requestId='tb_'+Date.now()+'_'+Math.random().toString(36).slice(2);
  api('fichar',{codigo:c,request_id:requestId,confirmar_salida:'SI'},function(r){
    fichando=false;
    if(!r||!r.ok){alert(r&&r.error?r.error:'No se pudo registrar la salida');cancelarSalida();return;}
    pendingCode='';document.getElementById('confirmarSalida').classList.add('hidden');currentCode=c;mostrarConfirmacion(r);
  });
}
function cancelarSalida(){pendingCode='';document.getElementById('confirmarSalida').classList.add('hidden');volverKiosk();}

function mostrarConfirmacion(r){
  document.getElementById('kiosk').classList.add('hidden');
  document.getElementById('confirmacion').classList.remove('hidden');
  document.getElementById('confTitulo').textContent=r.tipo==='ENTRADA'?'Entrada registrada':'Salida registrada';
  document.getElementById('confNombre').textContent=(r.resumen&&r.resumen.nombre)||r.nombre||'';
  document.getElementById('confDetalle').innerHTML=r.tipo==='ENTRADA'?'<p>Hora de entrada · <b>'+esc(r.hora||'')+'</b></p><p class="ok">Trabajando</p>':'<p>Hora de salida · <b>'+esc(r.hora||'')+'</b></p><p>Total de hoy · <b>'+esc((r.resumen&&r.resumen.hoy)||'0:00')+'</b></p>';
  document.getElementById('btnComputo').classList.remove('hidden');
  var n=3;document.getElementById('contador').textContent=n;
  countdownId=setInterval(function(){n--;document.getElementById('contador').textContent=n;if(n<=0){clearInterval(countdownId);volverKiosk();}},1000);
}

function verMiComputo(){
  if(countdownId)clearInterval(countdownId);
  api('resumen',{codigo:currentCode},function(r){
    if(!r||!r.ok){alert(r&&r.error?r.error:'No se pudo cargar el cómputo');return;}
    document.getElementById('confirmacion').classList.add('hidden');
    document.getElementById('miComputo').classList.remove('hidden');
    document.getElementById('compNombre').textContent=(r.resumen&&r.resumen.nombre)||'';
    document.getElementById('compHoy').textContent=(r.resumen&&r.resumen.hoy)||'0:00';
    document.getElementById('compSemana').textContent=(r.resumen&&r.resumen.semana)||'0:00';
    document.getElementById('compMes').textContent=(r.resumen&&r.resumen.mes)||'0:00';
    miComputoRespuesta=r;mostrarPeriodoComputo('hoy');
  });
}
function mostrarPeriodoComputo(periodo){
  miComputoPeriodo=periodo;
  [['compBtnHoy','hoy'],['compBtnSemana','semana'],['compBtnMes','mes']].forEach(function(x){var b=document.getElementById(x[0]);if(!b)return;b.classList.remove('primary','secondary');b.classList.add(periodo===x[1]?'primary':'secondary');});
  var destino=document.getElementById('compDetalleContenido');if(!destino)return;
  var detalle=miComputoRespuesta&&miComputoRespuesta.detalle&&miComputoRespuesta.detalle[periodo];
  if(!detalle){destino.innerHTML='<p class="muted small">No hay detalle disponible para este periodo.</p>';return;}
  var dias=Array.isArray(detalle.dias)?detalle.dias:[];
  var html='<div class="notice" style="margin-bottom:12px"><b>Total del periodo: '+esc(detalle.total||'0:00')+'</b></div>';
  if(!dias.length){destino.innerHTML=html+'<p class="muted small">Sin fichajes registrados en este periodo.</p>';return;}
  html+='<div style="overflow-x:auto"><table><tr><th>Fecha</th><th>Marcajes</th><th>Total día</th></tr>';
  dias.forEach(function(d){var marcas=(Array.isArray(d.marcajes)?d.marcajes:[]).map(function(m){var tipo=String(m.tipo||'').toUpperCase()==='ENTRADA'?'Entrada':'Salida';return '<b>'+tipo+'</b> '+esc(m.hora||'—');}).join(' &nbsp;·&nbsp; ');html+='<tr><td>'+esc(d.fecha||d.fecha_iso||'')+'</td><td>'+(marcas||'—')+'</td><td><b>'+esc(d.total||'0:00')+'</b></td></tr>';});
  html+='</table></div>';destino.innerHTML=html;
}

function volverKiosk(){
  if(countdownId)clearInterval(countdownId);
  ['confirmarSalida','confirmacion','miComputo','empresa'].forEach(function(id){var e=document.getElementById(id);if(e)e.classList.add('hidden');});
  document.getElementById('kiosk').classList.remove('hidden');
  currentCode='';pendingCode='';limpiarPin();
}
function abrirEmpresa(){document.getElementById('kiosk').classList.add('hidden');document.getElementById('empresa').classList.remove('hidden');limpiarPin();volverMenuEmpresa();}
function parseM(v){var p=String(v||'0:00').split(':'),neg=p[0].charAt(0)==='-';if(neg)p[0]=p[0].slice(1);var m=Number(p[0]||0)*60+Number(p[1]||0);return neg?-m:m;}
function fmt(m){var s=m<0?'-':'';m=Math.abs(m);return s+Math.floor(m/60)+':'+('0'+(m%60)).slice(-2);}

function abrirFichaEmpresa(cual){
  document.getElementById('empresaMenu').classList.add('hidden');
  ['fichaPanel','fichaTrabajadores','fichaInforme','fichaNuevo','fichaQR','fichaBackup'].forEach(function(id){document.getElementById(id).classList.add('hidden');});
  if(cual==='panel'){document.getElementById('fichaPanel').classList.remove('hidden');cargarEmpresa();}
  if(cual==='trabajadores'){document.getElementById('fichaTrabajadores').classList.remove('hidden');setFiltroTrabajadores('ACTIVOS');cargarEmpresa();}
  if(cual==='informe'){document.getElementById('fichaInforme').classList.remove('hidden');cargarEmpresa();}
  if(cual==='nuevo'){document.getElementById('fichaNuevo').classList.remove('hidden');limpiarAlta();}
  if(cual==='qr')document.getElementById('fichaQR').classList.remove('hidden');
  if(cual==='backup')document.getElementById('fichaBackup').classList.remove('hidden');
}
function volverMenuEmpresa(){['fichaPanel','fichaTrabajadores','fichaInforme','fichaNuevo','fichaQR','fichaBackup'].forEach(function(id){document.getElementById(id).classList.add('hidden');});document.getElementById('empresaMenu').classList.remove('hidden');}

function setFiltroTrabajadores(filtro){filtroTrabajadores=filtro;actualizarBotonesFiltro();renderTrabajadores();}
function actualizarBotonesFiltro(){[['btnActivos','ACTIVOS'],['btnBajas','BAJAS'],['btnTodos','TODOS']].forEach(function(x){var b=document.getElementById(x[0]);b.classList.remove('primary','secondary');b.classList.add(filtroTrabajadores===x[1]?'primary':'secondary');});}
function cargarEmpresa(){
  api('panel',{owner:OWNER},function(r){
    if(!r||!r.ok){alert(r&&r.error?r.error:'No se pudo cargar el panel');volverKiosk();return;}
    trabajadoresPanel=Array.isArray(r.trabajadores)?r.trabajadores:[];
    actualizarTotalesEmpresa();renderTrabajandoAhora();cargarSelectorInforme();
    if(!document.getElementById('fichaTrabajadores').classList.contains('hidden'))renderTrabajadores();
  });
}
function actualizarTotalesEmpresa(){var h=0,s=0,m=0;trabajadoresPanel.forEach(function(t){if(t.activo!==false){h+=parseM(t.hoy);s+=parseM(t.semana);m+=parseM(t.mes);}});document.getElementById('empHoy').textContent=fmt(h);document.getElementById('empSemana').textContent=fmt(s);document.getElementById('empMes').textContent=fmt(m);}
function renderTrabajandoAhora(){
  var activos=trabajadoresPanel.filter(function(t){return t.activo!==false;});
  var trabajando=activos.filter(function(t){return String(t.estado||'').toUpperCase()==='TRABAJANDO';});
  document.getElementById('trabajandoAhoraResumen').textContent=trabajando.length+(trabajando.length===1?' trabajador':' trabajadores');
  document.getElementById('trabajandoAhoraLista').innerHTML=trabajando.length?trabajando.map(function(t){return '<div style="padding:9px 0;border-bottom:1px solid #ead9c6"><b>'+esc(t.nombre||t.codigo||'Trabajador')+'</b> · <span class="ok">Trabajando</span></div>';}).join(''):'<p class="muted small">No hay trabajadores fichados como trabajando en este momento.</p>';
  document.getElementById('fueraAhoraResumen').textContent='Fuera: '+(activos.length-trabajando.length);
}
function renderTrabajadores(){
  var lista=trabajadoresPanel.filter(function(t){if(filtroTrabajadores==='ACTIVOS')return t.activo!==false;if(filtroTrabajadores==='BAJAS')return t.activo===false;return true;});
  var x='<table><tr><th>Código</th><th>Nombre</th><th>Contrato</th><th>Estado</th><th>Hoy</th><th>Semana</th><th>Mes</th><th></th></tr>';
  lista.forEach(function(t){x+='<tr><td>'+esc(t.codigo)+'</td><td>'+esc(t.nombre)+'</td><td>'+esc(t.horas_contrato)+' h</td><td>'+esc(t.estado)+'</td><td>'+esc(t.hoy)+'</td><td>'+esc(t.semana)+'</td><td>'+esc(t.mes)+'</td><td>'+(t.activo!==false?'<button class="btn secondary" style="padding:8px 10px;font-size:13px" onclick="darBaja(\''+esc(t.codigo)+'\',\''+esc(String(t.nombre).replace(/'/g,'&#39;'))+'\')">Dar de baja</button>':'<span class="muted">Código conservado</span>')+'</td></tr>';});
  x+='</table>';document.getElementById('tablaTrabajadores').innerHTML=x;
}
function cargarSelectorInforme(){var s=document.getElementById('fTrabajador');if(!s)return;var x='<option value="">Todos los trabajadores</option>';trabajadoresPanel.forEach(function(t){x+='<option value="'+esc(t.codigo)+'">'+esc(t.nombre)+' ('+esc(t.codigo)+')</option>';});s.innerHTML=x;}
function darBaja(codigo,nombre){
  if(!confirm('Dar de baja a '+nombre+'?\n\nSe conservarán su código y todos sus fichajes.'))return;
  var aviso=document.getElementById('empresaAviso');if(aviso){aviso.textContent='Procesando baja…';aviso.classList.remove('hidden');}
  api('darBaja',{owner:OWNER,codigo:codigo},function(r){
    if(!r||!r.ok){if(aviso)aviso.classList.add('hidden');alert(r&&r.error?r.error:'No se pudo registrar la baja');return;}
    var t=trabajadoresPanel.find(function(x){return String(x.codigo)===String(codigo);});if(t){t.activo=false;t.estado='Baja';}
    renderTrabajadores();actualizarTotalesEmpresa();renderTrabajandoAhora();
    if(aviso){aviso.textContent='Baja registrada correctamente.';aviso.classList.remove('hidden');setTimeout(function(){aviso.classList.add('hidden');},2200);}
  });
}

function estadoCodigoAlta(texto,tipo){var e=document.getElementById('altaCodigoEstado');e.textContent=texto||'';e.className='small';e.style.color='';if(tipo==='ok')e.className='small ok';else if(tipo==='error')e.style.color='#b91c1c';else e.className='small muted';}
function habilitarAlta(ok){['altaNombre','altaHoras','altaActivo'].forEach(function(id){document.getElementById(id).disabled=!ok;});document.getElementById('btnGuardarTrabajador').disabled=!ok;}
function limpiarDatosAlta(){document.getElementById('altaNombre').value='';document.getElementById('altaHoras').value='';document.getElementById('altaActivo').value='SI';}
function limpiarAlta(){document.getElementById('altaCodigo').value='';limpiarDatosAlta();altaCodigoComprobado='';altaCodigoDisponible=false;altaConsultaSecuencia++;estadoCodigoAlta('','muted');habilitarAlta(false);setTimeout(function(){document.getElementById('altaCodigo').focus();},0);}
function validarCodigoAlta(){
  var el=document.getElementById('altaCodigo');var codigo=String(el.value||'').replace(/\D/g,'').slice(0,4);el.value=codigo;
  altaCodigoComprobado='';altaCodigoDisponible=false;altaConsultaSecuencia++;var sec=altaConsultaSecuencia;habilitarAlta(false);
  if(codigo.length<4){estadoCodigoAlta(codigo.length?'Introduce las 4 cifras para comprobar el código.':'','muted');return false;}
  limpiarDatosAlta();estadoCodigoAlta('Comprobando código…','muted');
  api('validarCodigoTrabajador',{owner:OWNER,codigo:codigo},function(r){
    if(sec!==altaConsultaSecuencia||document.getElementById('altaCodigo').value!==codigo)return;
    if(!r||!r.ok){estadoCodigoAlta(r&&r.error?r.error:'No se pudo comprobar el código.','error');return;}
    altaCodigoComprobado=codigo;altaCodigoDisponible=r.disponible===true;
    if(altaCodigoDisponible){estadoCodigoAlta('Código disponible ✓','ok');habilitarAlta(true);document.getElementById('altaNombre').focus();}
    else{limpiarDatosAlta();estadoCodigoAlta(r.mensaje||'Código no disponible. Este código ya está registrado.','error');}
  });
  return false;
}
function guardarTrabajador(){
  var codigo=String(document.getElementById('altaCodigo').value||'');
  if(codigo.length!==4||!altaCodigoDisponible||altaCodigoComprobado!==codigo){estadoCodigoAlta('Primero comprueba que el código esté disponible.','error');return;}
  var nombre=document.getElementById('altaNombre').value.trim();var horas=document.getElementById('altaHoras').value;
  if(!nombre){alert('Indica el nombre y apellidos.');return;}if(!horas){alert('Indica las horas semanales.');return;}
  var b=document.getElementById('btnGuardarTrabajador');b.disabled=true;b.textContent='Guardando…';
  api('crearTrabajador',{owner:OWNER,codigo:codigo,nombre:nombre,horas:horas,activo:document.getElementById('altaActivo').value},function(r){
    b.textContent='Guardar trabajador';
    if(!r||!r.ok){altaCodigoDisponible=false;altaCodigoComprobado='';habilitarAlta(false);estadoCodigoAlta(r&&r.error?r.error:'No se pudo crear el trabajador.','error');return;}
    limpiarAlta();cargarEmpresa();alert('Trabajador creado correctamente.');
  });
}

document.querySelectorAll('.pin input').forEach(function(el,i,a){
  el.addEventListener('input',function(){el.value=el.value.replace(/\D/g,'');if(el.value&&a[i+1])a[i+1].focus();});
  el.addEventListener('keydown',function(e){if(e.key==='Backspace'&&!el.value&&a[i-1])a[i-1].focus();});
});

window.addEventListener('load',function(){
  var v=document.querySelector('.brand .small');if(v)v.textContent='v'+(CFG.VERSION||'0.4.2');
  habilitarAlta(false);
});
