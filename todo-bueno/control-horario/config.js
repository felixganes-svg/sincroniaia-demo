window.TODO_BUENO_CONFIG = {
  VERSION: "0.4.0",
  API_URL: "https://script.google.com/macros/s/AKfycbzvN72QIBEiJ6ZJ5coC8BVTvLWYqhYzIUDeGH4oZPNuZ5GdMiAuc6g2dIJ3J067b1dLFg/exec"
};

window.addEventListener('load', function () {
  var version = document.querySelector('.brand .small');
  if (version) version.textContent = 'v0.4.0';

  /* BÁSICA: ocultar funciones que no forman parte de esta versión. */
  var botonSeguridad = document.querySelector('#empresaMenu button[onclick*="seguridad"]');
  if (botonSeguridad) botonSeguridad.style.display = 'none';
  var fichaSeguridad = document.getElementById('fichaSeguridad');
  if (fichaSeguridad) fichaSeguridad.style.display = 'none';
  var bloqueAlertas = document.getElementById('bloqueAlertas');
  if (bloqueAlertas) bloqueAlertas.style.display = 'none';

  var botonesMenu = document.querySelectorAll('#empresaMenu .no-print .btn');
  botonesMenu.forEach(function (b) {
    var txt = (b.textContent || '').trim();
    if (txt === 'Mostrar trabajadores') b.textContent = 'Trabajadores';
  });

  /* Alta básica: un único código personal por trabajador. */
  var fichaNuevo = document.getElementById('fichaNuevo');
  if (fichaNuevo) {
    var auxAlta = document.getElementById('altaAuxilio');
    if (auxAlta && auxAlta.closest('.field')) auxAlta.closest('.field').remove();
    var introAlta = fichaNuevo.querySelector('p.muted.small');
    if (introAlta) introAlta.textContent = 'Asigna un código personal de 4 cifras al trabajador. La fecha de finalización es opcional.';
  }

  var qrTexto = document.querySelector('#fichaQR .muted.small');
  if (qrTexto) qrTexto.textContent = 'Este QR abre únicamente la pantalla de fichaje.';

  window.limpiarAlta = function () {
    ['altaCodigo','altaNombre','altaHoras','altaHasta'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.value = '';
    });
    var activo = document.getElementById('altaActivo');
    if (activo) activo.value = 'SI';
    var desde = document.getElementById('altaDesde');
    if (desde) desde.value = '';
  };

  window.guardarTrabajador = function () {
    if (!validarCodigoAlta()) {
      var cod = document.getElementById('altaCodigo');
      if (cod) cod.focus();
      return;
    }
    var p = {
      owner: OWNER,
      codigo: document.getElementById('altaCodigo').value,
      nombre: document.getElementById('altaNombre').value,
      horas: document.getElementById('altaHoras').value,
      activo: document.getElementById('altaActivo').value,
      desde: document.getElementById('altaDesde').value,
      hasta: document.getElementById('altaHasta').value
    };
    api('crearTrabajador', p, function (r) {
      if (!r.ok) {
        alert(r.error || 'No se pudo crear el trabajador');
        return;
      }
      limpiarAlta();
      var ce = document.getElementById('altaCodigoEstado');
      if (ce) {
        ce.textContent = '';
        ce.className = 'small muted';
        ce.style.color = '';
      }
      if (typeof cargarEmpresa === 'function') cargarEmpresa();
      alert('Trabajador creado correctamente.');
    });
  };

  /* Panel básico: quién está trabajando ahora. */
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
    var aviso = document.getElementById('empresaAviso');
    if (aviso && aviso.parentNode === panel) panel.insertBefore(bloque, aviso);
    else panel.appendChild(bloque);
  }

  function renderTrabajandoAhoraBasic() {
    var lista = Array.isArray(window.trabajadoresPanel) ? window.trabajadoresPanel : [];
    var activos = lista.filter(function (t) { return t.activo !== false; });
    var trabajando = activos.filter(function (t) {
      return String(t.estado || '').toUpperCase() === 'TRABAJANDO';
    });
    var resumen = document.getElementById('trabajandoAhoraResumen');
    var detalle = document.getElementById('trabajandoAhoraLista');
    var fuera = document.getElementById('fueraAhoraResumen');
    if (!resumen || !detalle || !fuera) return;
    resumen.textContent = trabajando.length + (trabajando.length === 1 ? ' trabajador' : ' trabajadores');
    detalle.innerHTML = trabajando.length ? trabajando.map(function (t) {
      return '<div style="padding:9px 0;border-bottom:1px solid #ead9c6"><b>' +
        String(t.nombre || t.codigo || 'Trabajador') + '</b> · <span class="ok">Trabajando</span></div>';
    }).join('') : '<p class="muted small">No hay trabajadores fichados como trabajando en este momento.</p>';
    fuera.textContent = 'Fuera: ' + (activos.length - trabajando.length);
  }

  if (typeof window.actualizarTotalesEmpresa === 'function') {
    var actualizarOriginal = window.actualizarTotalesEmpresa;
    window.actualizarTotalesEmpresa = function () {
      actualizarOriginal.apply(this, arguments);
      renderTrabajandoAhoraBasic();
    };
  }
  renderTrabajandoAhoraBasic();

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

  /* INFORME DETALLADO: trabajador > día > marcajes > total diario > total periodo. */
  window.cargarInforme = function () {
    var codigo = document.getElementById('fTrabajador').value;
    var desde = document.getElementById('fDesde').value;
    var hasta = document.getElementById('fHasta').value;
    var destino = document.getElementById('informe');

    if (destino) destino.innerHTML = '<p class="muted">Cargando informe…</p>';

    api('informe', {owner: OWNER, codigo: codigo, desde: desde, hasta: hasta}, function (r) {
      if (!r.ok) {
        if (destino) destino.innerHTML = '';
        alert(r.error);
        return;
      }

      var trabajadores = Array.isArray(r.trabajadores) ? r.trabajadores : [];
      if (!trabajadores.length) {
        destino.innerHTML = '<p class="muted">No hay trabajadores para el periodo seleccionado.</p>';
        return;
      }

      var html = '<div class="informe-detallado">';
      trabajadores.forEach(function (t) {
        html += '<div class="card" style="margin:14px 0;padding:16px">';
        html += '<div class="topline"><div><h3 style="margin:0">' + escapeHtmlBasic(t.nombre || '') + '</h3>' +
          '<p class="muted small" style="margin:5px 0 0">Código ' + escapeHtmlBasic(t.codigo || '') + '</p></div>' +
          '<div style="text-align:right"><span class="muted small">Total periodo</span><br><b style="font-size:22px">' + escapeHtmlBasic(t.total || '0:00') + '</b></div></div>';

        var dias = Array.isArray(t.dias) ? t.dias : [];
        if (!dias.length) {
          html += '<p class="muted small" style="margin-top:14px">Sin fichajes en este periodo.</p>';
        } else {
          html += '<table style="margin-top:14px"><tr><th>Fecha</th><th>Horario / marcajes</th><th>Total día</th></tr>';
          dias.forEach(function (d) {
            var marcajes = Array.isArray(d.marcajes) ? d.marcajes : [];
            var textoMarcajes = marcajes.map(function (m) {
              var tipo = String(m.tipo || '').toUpperCase() === 'ENTRADA' ? 'Entrada' :
                (String(m.tipo || '').toUpperCase() === 'SALIDA' ? 'Salida' : String(m.tipo || ''));
              return '<b>' + escapeHtmlBasic(tipo) + '</b> ' + escapeHtmlBasic(m.hora || '—');
            }).join(' &nbsp;·&nbsp; ');
            html += '<tr><td>' + escapeHtmlBasic(d.fecha || d.fecha_iso || '') + '</td>' +
              '<td>' + (textoMarcajes || '—') + '</td>' +
              '<td><b>' + escapeHtmlBasic(d.total || '0:00') + '</b></td></tr>';
          });
          html += '</table>';
        }
        html += '</div>';
      });
      html += '</div>';
      destino.innerHTML = html;
    });
  };

  function escapeHtmlBasic(v) {
    return String(v == null ? '' : v)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
});
