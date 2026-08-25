window.TODO_BUENO_CONFIG = {
  VERSION: "0.4.0-TEST-SOS",
  API_URL: "https://script.google.com/macros/s/AKfycbzvN72QIBEiJ6ZJ5coC8BVTvLWYqhYzIUDeGH4oZPNuZ5GdMiAuc6g2dIJ3J067b1dLFg/exec"
};

window.addEventListener('load', function () {
  var version = document.querySelector('.brand .small');
  if (version) version.textContent = 'v0.4.0 TEST SOS+';

  var codigoSOSActual = localStorage.getItem('todoBuenoSOSActual') || '7670';

  function actualizarVistaSOS(codigo) {
    if (codigo && /^\d{4}$/.test(String(codigo))) {
      codigoSOSActual = String(codigo);
      localStorage.setItem('todoBuenoSOSActual', codigoSOSActual);
    }
    var el = document.getElementById('codigoSOSActualValor');
    if (el) el.textContent = codigoSOSActual;
    var a1 = document.getElementById('segAuxEmpresa');
    var a2 = document.getElementById('segAuxEmpresa2');
    if (a1) a1.placeholder = 'Vacío = mantener ' + codigoSOSActual;
    if (a2) a2.placeholder = 'Repite solo si lo cambias';
  }

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

  var fichaSeg = document.getElementById('fichaSeguridad');
  if (fichaSeg) {
    var gridSeg = fichaSeg.querySelector('.form-grid');

    if (!document.getElementById('explicacionAuxilioBasic')) {
      var info = document.createElement('div');
      info.id = 'explicacionAuxilioBasic';
      info.className = 'notice';
      info.style.marginBottom = '14px';
      info.innerHTML = '<b>Aviso discreto al responsable</b><p class="small" style="margin:7px 0 0">La empresa dispone de un único código general SOS+. Al utilizarlo se genera una alerta silenciosa. La pantalla muestra una respuesta neutra, no abre el panel de empresa y no crea un fichaje falso. No sustituye al 112 ni realiza llamadas automáticas a emergencias.</p>';
      if (gridSeg) fichaSeg.insertBefore(info, gridSeg);
    }

    if (!document.getElementById('sosActualBox')) {
      var actual = document.createElement('div');
      actual.id = 'sosActualBox';
      actual.className = 'notice';
      actual.style.marginBottom = '14px';
      actual.innerHTML = '<h3 style="margin:0 0 6px">Código SOS+ actual: <span id="codigoSOSActualValor">7670</span></h3>' +
        '<p class="small" style="margin:0">Este código viene configurado inicialmente. Puedes mantenerlo o sustituirlo por otro código de 4 cifras.</p>';
      if (gridSeg) fichaSeg.insertBefore(actual, gridSeg);
    }

    var auxInput = document.getElementById('segAuxEmpresa');
    var auxInput2 = document.getElementById('segAuxEmpresa2');
    if (auxInput && auxInput.closest('.field')) {
      var lab1 = auxInput.closest('.field').querySelector('label');
      if (lab1) lab1.textContent = 'Nuevo código SOS+';
      auxInput.value = '';
    }
    if (auxInput2 && auxInput2.closest('.field')) {
      var lab2 = auxInput2.closest('.field').querySelector('label');
      if (lab2) lab2.textContent = 'Repetir nuevo código SOS+';
      auxInput2.value = '';
    }

    var notaSeg = fichaSeg.querySelector('.form-grid + p.muted.small');
    if (notaSeg) {
      notaSeg.textContent = 'Si dejas los dos campos SOS+ vacíos, el código actual sigue siendo válido. Si introduces uno nuevo, sustituirá al anterior.';
    }

    var guardarBtn = fichaSeg.querySelector('button.btn.primary');
    if (guardarBtn) guardarBtn.textContent = 'Guardar cambios';

    actualizarVistaSOS(codigoSOSActual);
  }

  /* Al abrir Seguridad intentamos leer la configuración real desde el panel.
     El backend v0.4.0 devuelve seguridad; si aún no está desplegado, mantenemos 7670 conocido. */
  if (typeof window.abrirFichaEmpresa === 'function') {
    var abrirFichaOriginal = window.abrirFichaEmpresa;
    window.abrirFichaEmpresa = function (cual) {
      abrirFichaOriginal.apply(this, arguments);
      if (cual !== 'seguridad') return;
      api('panel', {owner: OWNER}, function (r) {
        if (!r || !r.ok || !r.seguridad) {
          actualizarVistaSOS(codigoSOSActual);
          return;
        }
        if (r.seguridad.codigo_auxilio_empresa) actualizarVistaSOS(r.seguridad.codigo_auxilio_empresa);
        var email = document.getElementById('segEmailAlertas');
        if (email) email.value = r.seguridad.email_alertas || '';
      });
    };
  }

  /* Vacío = conservar. Si no se cambia nada de SOS+, no obligamos a escribir 7670. */
  window.guardarSeguridadEmpresa = function () {
    var c1 = document.getElementById('segCodigoEmpresa').value.trim();
    var c2 = document.getElementById('segCodigoEmpresa2').value.trim();
    var a1 = document.getElementById('segAuxEmpresa').value.trim();
    var a2 = document.getElementById('segAuxEmpresa2').value.trim();
    var email = document.getElementById('segEmailAlertas').value.trim();

    if (c1 || c2) {
      if (!/^\d{4}$/.test(c1) || c1 !== c2) {
        alert('Revisa el nuevo código de empresa');
        return;
      }
    }

    if (a1 || a2) {
      if (!/^\d{4}$/.test(a1) || a1 !== a2) {
        alert('Revisa el nuevo código SOS+');
        return;
      }
      if ((c1 || OWNER) === a1) {
        alert('El código de empresa y el código SOS+ deben ser distintos');
        return;
      }
    }

    /* Si todo lo editable está vacío, simplemente se conserva la configuración. */
    if (!c1 && !a1 && !email) {
      alert('Sin cambios. El código SOS+ ' + codigoSOSActual + ' sigue activo.');
      return;
    }

    api('configSeguridad', {
      owner: OWNER,
      codigo_empresa: c1,
      codigo_auxilio_empresa: a1,
      email_alertas: email
    }, function (r) {
      if (!r.ok) {
        alert(r.error || 'No se pudo actualizar la seguridad');
        return;
      }

      if (r.owner) OWNER = String(r.owner);
      if (a1) actualizarVistaSOS(a1);
      else if (r.codigo_auxilio_empresa) actualizarVistaSOS(r.codigo_auxilio_empresa);

      document.getElementById('segCodigoEmpresa').value = '';
      document.getElementById('segCodigoEmpresa2').value = '';
      document.getElementById('segAuxEmpresa').value = '';
      document.getElementById('segAuxEmpresa2').value = '';

      if (a1) {
        alert('Código SOS+ actualizado correctamente. El código anterior ha quedado desactivado.');
      } else {
        alert('Seguridad actualizada. El código SOS+ ' + codigoSOSActual + ' sigue activo.');
      }
    });
  };

  var fichaNuevo = document.getElementById('fichaNuevo');
  if (fichaNuevo) {
    var auxAlta = document.getElementById('altaAuxilio');
    if (auxAlta && auxAlta.closest('.field')) auxAlta.closest('.field').remove();
    var introAlta = fichaNuevo.querySelector('p.muted.small');
    if (introAlta) introAlta.textContent = 'Cada trabajador utiliza únicamente su código personal de 4 cifras. El código general SOS+ pertenece a la empresa y se configura en Seguridad y auxilio.';
  }

  window.limpiarAlta = function () {
    ['altaCodigo','altaNombre','altaHoras','altaHasta'].forEach(function (id) {
      var el = document.getElementById(id); if (el) el.value = '';
    });
    var activo = document.getElementById('altaActivo'); if (activo) activo.value = 'SI';
    var desde = document.getElementById('altaDesde'); if (desde) desde.value = '';
  };

  window.guardarTrabajador = function () {
    if (!validarCodigoAlta()) {
      var cod = document.getElementById('altaCodigo'); if (cod) cod.focus();
      return;
    }
    var p = {
      owner:OWNER,
      codigo:document.getElementById('altaCodigo').value,
      nombre:document.getElementById('altaNombre').value,
      horas:document.getElementById('altaHoras').value,
      activo:document.getElementById('altaActivo').value,
      desde:document.getElementById('altaDesde').value,
      hasta:document.getElementById('altaHasta').value
    };
    api('crearTrabajador',p,function(r){
      if(!r.ok){alert(r.error||'No se pudo crear el trabajador');return;}
      limpiarAlta();
      var ce=document.getElementById('altaCodigoEstado');
      if(ce){ce.textContent='';ce.className='small muted';ce.style.color='';}
      if(typeof cargarEmpresa==='function') cargarEmpresa();
      alert('Trabajador creado correctamente.');
    });
  };

  var panel = document.getElementById('fichaPanel');
  if (panel && !document.getElementById('trabajandoAhoraBasic')) {
    var bloque = document.createElement('div');
    bloque.id = 'trabajandoAhoraBasic';
    bloque.className = 'notice';
    bloque.style.marginTop = '14px';
    bloque.innerHTML = '<h3 style="margin-bottom:8px">Trabajando ahora</h3><div id="trabajandoAhoraResumen" class="muted">Cargando…</div><div id="trabajandoAhoraLista" style="margin-top:8px"></div><div id="fueraAhoraResumen" class="muted small" style="margin-top:10px"></div>';
    var alertas = document.getElementById('bloqueAlertas');
    if (alertas && alertas.parentNode === panel) panel.insertBefore(bloque, alertas); else panel.appendChild(bloque);
  }

  function renderTrabajandoAhoraBasic() {
    var lista = Array.isArray(window.trabajadoresPanel) ? window.trabajadoresPanel : [];
    var activos = lista.filter(function(t){return t.activo!==false;});
    var trabajando = activos.filter(function(t){return String(t.estado||'').toUpperCase()==='TRABAJANDO';});
    var resumen=document.getElementById('trabajandoAhoraResumen'), detalle=document.getElementById('trabajandoAhoraLista'), fueraEl=document.getElementById('fueraAhoraResumen');
    if(!resumen||!detalle||!fueraEl)return;
    resumen.textContent=trabajando.length+(trabajando.length===1?' trabajador':' trabajadores');
    detalle.innerHTML=trabajando.length?trabajando.map(function(t){return '<div style="padding:9px 0;border-bottom:1px solid #ead9c6"><b>'+String(t.nombre||t.codigo||'Trabajador')+'</b> · <span class="ok">Trabajando</span></div>';}).join(''):'<p class="muted small">No hay trabajadores fichados como trabajando en este momento.</p>';
    fueraEl.textContent='Fuera: '+(activos.length-trabajando.length);
  }

  if(typeof window.actualizarTotalesEmpresa==='function'){
    var actualizarOriginal=window.actualizarTotalesEmpresa;
    window.actualizarTotalesEmpresa=function(){actualizarOriginal.apply(this,arguments);renderTrabajandoAhoraBasic();};
  }
  renderTrabajandoAhoraBasic();

  window.darBaja=function(codigo,nombre){
    if(!confirm('Dar de baja a '+nombre+'?\n\nSe conservarán su código y todos sus fichajes.'))return;
    var aviso=document.getElementById('empresaAviso');
    if(aviso){aviso.textContent='Procesando baja…';aviso.classList.remove('hidden');}
    api('darBaja',{owner:OWNER,codigo:codigo},function(r){
      if(!r.ok){if(aviso)aviso.classList.add('hidden');alert(r.error||'No se pudo registrar la baja');return;}
      var t=trabajadoresPanel.find(function(x){return String(x.codigo)===String(codigo);});
      if(t){t.activo=false;t.estado='Baja';if(r.vigente_hasta)t.vigente_hasta=r.vigente_hasta;}
      renderTrabajadores();actualizarTotalesEmpresa();
      if(aviso){aviso.textContent='Baja registrada correctamente.';aviso.classList.remove('hidden');setTimeout(function(){aviso.classList.add('hidden');},2200);}
      alert('Baja registrada correctamente.');
    });
  };
});
