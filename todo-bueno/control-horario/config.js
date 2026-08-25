window.TODO_BUENO_CONFIG = {
  VERSION: "0.3.7",
  API_URL: "https://script.google.com/macros/s/AKfycbzvN72QIBEiJ6ZJ5coC8BVTvLWYqhYzIUDeGH4oZPNuZ5GdMiAuc6g2dIJ3J067b1dLFg/exec"
};

window.addEventListener('load', function () {
  var version = document.querySelector('.brand .small');
  if (version) version.textContent = 'v0.3.7';

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
