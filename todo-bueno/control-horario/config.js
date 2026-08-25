window.TODO_BUENO_CONFIG = {
  VERSION: "0.3.9",
  API_URL: "https://script.google.com/macros/s/AKfycbzvN72QIBEiJ6ZJ5coC8BVTvLWYqhYzIUDeGH4oZPNuZ5GdMiAuc6g2dIJ3J067b1dLFg/exec"
};

window.addEventListener('load', function () {
  var version = document.querySelector('.brand .small');
  if (version) version.textContent = 'v0.3.9';

  // MODO BÁSICO: ordenamos la pantalla sin eliminar funciones.
  var botonesMenu = document.querySelectorAll('#empresaMenu .no-print .btn');
  botonesMenu.forEach(function (b) {
    var txt = (b.textContent || '').trim();
    if (txt === 'Mostrar trabajadores') b.textContent = 'Trabajadores';
    if (txt === 'Seguridad y auxilio') {
      b.style.display = '';
      b.removeAttribute('data-basic-hidden');
      b.textContent = 'Seguridad y auxilio';
    }
  });

  // Explicación clara de la función de auxilio.
  var fichaSeg = document.getElementById('fichaSeguridad');
  if (fichaSeg && !document.getElementById('explicacionAuxilioBasic')) {
    var info = document.createElement('div');
    info.id = 'explicacionAuxilioBasic';
    info.className = 'notice';
    info.style.marginBottom = '14px';
    info.innerHTML = '<b>Aviso discreto al responsable</b><p class="small" style="margin:7px 0 0">La empresa puede definir un código secreto de auxilio. Si un trabajador lo utiliza, la pantalla se comporta como un fichaje normal y el sistema genera una alerta para la persona responsable indicada por la empresa. No sustituye al 112 ni realiza llamadas automáticas a emergencias.</p>';
    var grid = fichaSeg.querySelector('.form-grid');
    if (grid) fichaSeg.insertBefore(info, grid);
  }

  // Panel: quién está trabajando ahora.
  var panel = document.getElementById('fichaPanel');
  if (panel && !document.getElementById('trabajandoAhoraBasic')) {
    var bloque = document.createElement('div');
    bloque.id = 'trabajandoAhoraBasic';
    bloque.className = 'notice';
    bloque.style.marginTop = '14px';
    bloque.innerHTML = '<h3 style="margin-bottom:8px">Trabajando ahora</h3>' +
      '<div id="trabajandoAhoraResumen" class="muted">Cargando…</div>' +
      '<div id="trabajandoAhoraLista" style="margin-top:8px"></div>' +
      '<div id="fueraAhoraResumen" class="muted small" style="margin-top:10px"></div>';
    var alertas = document.getElementById('bloqueAlertas');
    if (alertas && alertas.parentNode === panel) panel.insertBefore(bloque, alertas);
    else panel.appendChild(bloque);
  }

  function renderTrabajandoAhoraBasic() {
    var lista = Array.isArray(window.trabajadoresPanel) ? window.trabajadoresPanel : [];
    var activos = lista.filter(function (t) { return t.activo !== false; });
    var trabajando = activos.filter(function (t) {
      return String(t.estado || '').toUpperCase() === 'TRABAJANDO';
    });
    var fuera = activos.length - trabajando.length;
    var resumen = document.getElementById('trabajandoAhoraResumen');
    var detalle = document.getElementById('trabajandoAhoraLista');
    var fueraEl = document.getElementById('fueraAhoraResumen');
    if (!resumen || !detalle || !fueraEl) return;
    resumen.textContent = trabajando.length + (trabajando.length === 1 ? ' trabajador' : ' trabajadores');
    detalle.innerHTML = trabajando.length ? trabajando.map(function (t) {
      return '<div style="padding:9px 0;border-bottom:1px solid #ead9c6"><b>' + String(t.nombre || t.codigo || 'Trabajador') + '</b> · <span class="ok">Trabajando</span></div>';
    }).join('') : '<p class="muted small">No hay trabajadores fichados como trabajando en este momento.</p>';
    fueraEl.textContent = 'Fuera: ' + fuera;
  }

  if (typeof window.actualizarTotalesEmpresa === 'function') {
    var actualizarOriginal = window.actualizarTotalesEmpresa;
    window.actualizarTotalesEmpresa = function () {
      actualizarOriginal.apply(this, arguments);
      renderTrabajandoAhoraBasic();
    };
  }
  renderTrabajandoAhoraBasic();

  // Baja: se conserva histórico y código.
  window.darBaja = function (codigo, nombre) {
    if (!confirm('Dar de baja a ' + nombre + '?\n\nSe conservarán su código y todos sus fichajes.')) return;
    var aviso = document.getElementById('empresaAviso');
    if (aviso) {
      aviso.textContent = 'Procesando baja…';
      aviso.classList.remove('hidden');
    }
    api('darBaja', {owner: OWNER, codigo: codigo}, function (r) {
      if (!r.ok) {
        if (aviso) aviso.classList.add('hidden');
        alert(r.error || 'No se pudo registrar la baja');
        return;
      }
      var t = trabajadoresPanel.find(function (x) { return String(x.codigo) === String(codigo); });
      if (t) {
        t.activo = false;
        t.estado = 'Baja';
        if (r.vigente_hasta) t.vigente_hasta = r.vigente_hasta;
      }
      renderTrabajadores();
      actualizarTotalesEmpresa();
      if (aviso) {
        aviso.textContent = 'Baja registrada correctamente.';
        aviso.classList.remove('hidden');
        setTimeout(function () { aviso.classList.add('hidden'); }, 2200);
      }
      alert('Baja registrada correctamente.');
    });
  };
});
