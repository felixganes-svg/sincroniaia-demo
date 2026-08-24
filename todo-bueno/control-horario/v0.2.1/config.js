window.TODO_BUENO_CONFIG = {
  VERSION: "0.3.0",
  API_URL: "https://script.google.com/macros/s/AKfycbxONpdyc9QUwgfZMPBqvtG_x0ENDBDAfdbWzDKnD3ZwSW9II15oxt0Z0indN-971CzxEA/exec"
};

document.addEventListener('DOMContentLoaded', function () {
  var brand = document.querySelector('.brand p');
  if (brand && brand.textContent.indexOf('v0.3.0') === -1) {
    brand.innerHTML = 'Control horario <span class="small">v0.3.0</span>';
  }

  var oldProcesar = window.procesarCodigo;
  window.procesarCodigo = function () {
    if (window.fichando) return;
    hideAviso();
    var c = pin();
    if (c.length !== 4) { showAviso('Introduce un código de 4 cifras'); return; }
    if (c === '7826') { abrirEmpresa(); return; }
    return oldProcesar();
  };

  var menu = document.querySelector('#empresaMenu .no-print');
  if (menu && !document.getElementById('btnSeguridadAuxilio')) {
    var b = document.createElement('button');
    b.id = 'btnSeguridadAuxilio';
    b.className = 'btn secondary';
    b.textContent = 'Seguridad y auxilio';
    b.onclick = function () { abrirFichaEmpresa('seguridad'); };
    var first = menu.querySelector('button');
    if (first && first.nextSibling) menu.insertBefore(b, first.nextSibling);
    else menu.appendChild(b);
  }

  var empresa = document.getElementById('empresa');
  if (empresa && !document.getElementById('fichaSeguridad')) {
    var s = document.createElement('div');
    s.id = 'fichaSeguridad';
    s.className = 'card hidden';
    s.innerHTML = '<div class="topline"><div><h2>Seguridad y auxilio</h2><p class="muted">Acceso de empresa y alerta silenciosa</p></div><button class="btn secondary" style="width:auto" onclick="volverMenuEmpresa()">Volver</button></div>' +
      '<div class="form-grid">' +
      '<div class="field"><label>Nuevo código de empresa</label><input id="segCodigoEmpresa" maxlength="4" inputmode="numeric" placeholder="4 cifras"></div>' +
      '<div class="field"><label>Repetir código de empresa</label><input id="segCodigoEmpresa2" maxlength="4" inputmode="numeric" placeholder="4 cifras"></div>' +
      '<div class="field"><label>Código de auxilio de empresa</label><input id="segAuxEmpresa" maxlength="4" inputmode="numeric" placeholder="4 cifras secretas"></div>' +
      '<div class="field"><label>Repetir código de auxilio</label><input id="segAuxEmpresa2" maxlength="4" inputmode="numeric" placeholder="4 cifras secretas"></div>' +
      '<div class="field"><label>Email para alertas</label><input id="segEmailAlertas" type="email" placeholder="correo@empresa.com"></div>' +
      '</div><p class="muted small">El código de auxilio debe ser distinto del código normal y de todos los códigos de trabajadores.</p>' +
      '<button class="btn primary" onclick="guardarSeguridadEmpresa()">Guardar seguridad</button>';
    empresa.appendChild(s);
  }

  var oldAbrir = window.abrirFichaEmpresa;
  window.abrirFichaEmpresa = function (cual) {
    if (cual !== 'seguridad') return oldAbrir(cual);
    var menuEl = document.getElementById('empresaMenu');
    if (menuEl) menuEl.classList.add('hidden');
    ['fichaPanel','fichaTrabajadores','fichaInforme','fichaNuevo','fichaBackup','fichaSeguridad'].forEach(function(id){
      var el=document.getElementById(id); if(el) el.classList.add('hidden');
    });
    document.getElementById('fichaSeguridad').classList.remove('hidden');
  };

  var oldVolver = window.volverMenuEmpresa;
  window.volverMenuEmpresa = function () {
    var fs=document.getElementById('fichaSeguridad'); if(fs) fs.classList.add('hidden');
    return oldVolver();
  };

  window.guardarSeguridadEmpresa = function () {
    var c1=document.getElementById('segCodigoEmpresa').value.trim();
    var c2=document.getElementById('segCodigoEmpresa2').value.trim();
    var a1=document.getElementById('segAuxEmpresa').value.trim();
    var a2=document.getElementById('segAuxEmpresa2').value.trim();
    var email=document.getElementById('segEmailAlertas').value.trim();
    if(c1 && (!/^\d{4}$/.test(c1) || c1!==c2)){alert('Revisa el nuevo código de empresa');return;}
    if(!/^\d{4}$/.test(a1) || a1!==a2){alert('Revisa el código de auxilio de empresa');return;}
    if(c1 && c1===a1){alert('El código normal y el de auxilio deben ser distintos');return;}
    api('configSeguridad',{owner:'7826',codigo_empresa:c1,codigo_auxilio_empresa:a1,email_alertas:email},function(r){
      if(!r || !r.ok){alert('La pantalla ya está preparada. Falta activar esta función en el backend de Apps Script.');return;}
      alert('Seguridad actualizada correctamente');
      volverMenuEmpresa();
    });
  };
});
