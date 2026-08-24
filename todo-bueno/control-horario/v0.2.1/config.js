window.TODO_BUENO_CONFIG = {
  VERSION: "0.2.6",
  API_URL: "https://script.google.com/macros/s/AKfycbxONpdyc9QUwgfZMPBqvtG_x0ENDBDAfdbWzDKnD3ZwSW9II15oxt0Z0indN-971CzxEA/exec"
};

/* v0.2.6: confirmación de salida inmediata sin bloquear una salida voluntaria. */
document.addEventListener('DOMContentLoaded', function () {
  var kiosk = document.getElementById('kiosk');
  var confirmacion = document.getElementById('confirmacion');
  if (kiosk && confirmacion && !document.getElementById('confirmarSalida')) {
    var s = document.createElement('section');
    s.id = 'confirmarSalida';
    s.className = 'card hidden success';
    s.innerHTML = '<div class="big">?</div>' +
      '<h2>Acabas de registrar tu entrada</h2>' +
      '<h3 id="salidaNombre"></h3>' +
      '<p>Vas a registrar ahora una salida.</p>' +
      '<p><b>¿Es correcto?</b></p>' +
      '<div class="actions">' +
      '<button class="btn primary" onclick="confirmarSalidaAhora()">Sí, registrar salida</button>' +
      '<button class="btn secondary" onclick="cancelarSalida()">No, volver</button>' +
      '</div>';
    confirmacion.parentNode.insertBefore(s, confirmacion);
  }

  window.tbPendingCode = '';

  window.procesarCodigo = function () {
    if (window.fichando) return;
    hideAviso();
    var c = pin();
    if (c.length !== 4) { showAviso('Introduce un código de 4 cifras'); return; }
    window.fichando = true;
    var requestId = 'tb_' + Date.now() + '_' + Math.random().toString(36).slice(2);
    var b = document.getElementById('btnFichar');
    b.disabled = true;
    b.textContent = 'Registrando…';
    api('fichar', { codigo: c, request_id: requestId }, function (r) {
      window.fichando = false;
      b.disabled = false;
      b.textContent = 'Fichar';
      if (!r.ok) {
        showAviso(r.error === 'BACKEND_NO_CONFIGURADO' ? 'La conexión del piloto todavía no está activada.' : r.error);
        limpiarPin();
        return;
      }
      if (r.rol === 'EMPRESA') { abrirEmpresa(); return; }
      if (r.requiere_confirmacion_salida) {
        window.tbPendingCode = c;
        document.getElementById('kiosk').classList.add('hidden');
        document.getElementById('salidaNombre').textContent = r.nombre || '';
        document.getElementById('confirmarSalida').classList.remove('hidden');
        return;
      }
      window.currentCode = c;
      mostrarConfirmacion(r);
    });
  };

  window.confirmarSalidaAhora = function () {
    if (window.fichando || !window.tbPendingCode) return;
    window.fichando = true;
    var c = window.tbPendingCode;
    var requestId = 'tb_' + Date.now() + '_' + Math.random().toString(36).slice(2);
    api('fichar', { codigo: c, request_id: requestId, confirmar_salida: 'SI' }, function (r) {
      window.fichando = false;
      if (!r.ok) { alert(r.error); cancelarSalida(); return; }
      window.tbPendingCode = '';
      document.getElementById('confirmarSalida').classList.add('hidden');
      window.currentCode = c;
      mostrarConfirmacion(r);
    });
  };

  window.cancelarSalida = function () {
    window.tbPendingCode = '';
    var s = document.getElementById('confirmarSalida');
    if (s) s.classList.add('hidden');
    volverKiosk();
  };
});
