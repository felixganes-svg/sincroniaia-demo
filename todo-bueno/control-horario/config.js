window.TODO_BUENO_CONFIG = {
  VERSION: "0.3.8",
  API_URL: "https://script.google.com/macros/s/AKfycbzvN72QIBEiJ6ZJ5coC8BVTvLWYqhYzIUDeGH4oZPNuZ5GdMiAuc6g2dIJ3J067b1dLFg/exec"
};

window.addEventListener('load', function () {
  var version = document.querySelector('.brand .small');
  if (version) version.textContent = 'v0.3.8';

  // MODO BÁSICO: simplificamos la pantalla, pero NO eliminamos funciones.
  // Seguridad/Auxilio continúa disponible en el código para versiones superiores.
  var botonesMenu = document.querySelectorAll('#empresaMenu .no-print .btn');
  botonesMenu.forEach(function (b) {
    var txt = (b.textContent || '').trim();
    if (txt === 'Seguridad y auxilio') {
      b.style.display = 'none';
      b.setAttribute('data-basic-hidden', 'true');
    }
    if (txt === 'Mostrar trabajadores') {
      b.textContent = 'Trabajadores';
    }
  });

  // Añadimos al panel del propietario una lectura inmediata de quién está trabajando.
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
    var lista = Array.isArray(window.trabajadoresPanel) ? window.trabajadoresPanel :
      (typeof trabajadoresPanel !== 'undefined' && Array.isArray(trabajadoresPanel) ? trabajadoresPanel : []);
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
    if (!trabajando.length) {
      detalle.innerHTML = '<p class="muted small">No hay trabajadores fichados como trabajando en este momento.</p>';
    } else {
      detalle.innerHTML = trabajando.map(function (t) {
        return '<div style="padding:9px 0;border-bottom:1px solid #ead9c6"><b>' +
          String(t.nombre || t.codigo || 'Trabajador') + '</b> · <span class="ok">Trabajando</span></div>';
      }).join('');
    }
    fueraEl.textContent = 'Fuera: ' + fuera;
  }

  // Conservamos la función existente y añadimos la actualización visual del modo básico.
  if (typeof window.actualizarTotalesEmpresa === 'function') {
    var actualizarOriginal = window.actualizarTotalesEmpresa;
    window.actualizarTotalesEmpresa = function () {
      actualizarOriginal.apply(this, arguments);
      renderTrabajandoAhoraBasic();
    };
  } else if (typeof actualizarTotalesEmpresa === 'function') {
    var actualizarOriginalLocal = actualizarTotalesEmpresa;
    actualizarTotalesEmpresa = function () {
      actualizarOriginalLocal.apply(this, arguments);
      renderTrabajandoAhoraBasic();
    };
  }

  // Render inicial por si el panel ya tiene datos disponibles.
  renderTrabajandoAhoraBasic();

  // Corrección visual de la baja: mantenemos histórico y código.
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
