/*
 * TODO BUENO · CONTROL HORARIO
 * v0.4.0 TEST SOS+
 *
 * PARCHE DE PRUEBA sobre Code.gs v0.3.7.
 * NO sustituye el MASTER sellado.
 */

var SOS_PLUS_TEST = {
  VERSION: '0.4.0-TEST-SOS',
  CODIGO_PRUEBA: '7670'
};

/* ======================== SOS+ GENERAL ======================== */

var __tb_fichar_v037 = fichar_;

fichar_ = function(codigo, requestId, confirmarSalida) {
  codigo = limpiarCodigo_(codigo);

  if (codigo.length !== 4) {
    return {ok:false,error:'Introduce un código de 4 cifras'};
  }

  var cfgEmpresa = configEmpresa_();

  if (configCoincideOwner_(cfgEmpresa, codigo)) {
    return {
      ok:true,
      rol:'EMPRESA',
      owner:limpiarCodigo_(cfgEmpresa.codigo_empresa || CFG.OWNER_CODE)
    };
  }

  if (configCoincideAuxEmpresa_(cfgEmpresa, codigo)) {
    var ahora = new Date();
    var fechaIso = Utilities.formatDate(ahora, CFG.TZ, 'yyyy-MM-dd');
    var hora = Utilities.formatDate(ahora, CFG.TZ, 'HH:mm');

    registrarAlertaAuxilioEmpresa_(fechaIso, hora, ahora);
    registrarLog_('ALERTA','sos_plus_general','SOS+ general activado · ' + fechaIso + ' ' + hora);

    return {ok:false,error:'Código no válido'};
  }

  var antiguoAux = buscarTrabajadorPorCodigoAuxilio_(codigo);
  if (antiguoAux) return {ok:false,error:'Código no válido'};

  return __tb_fichar_v037(codigo, requestId, confirmarSalida);
};

/* ======================== PANEL + CONFIGURACIÓN SOS+ ======================== */

var __tb_panel_v037 = panel_;
panel_ = function(owner) {
  var r = __tb_panel_v037(owner);
  if (!r || !r.ok) return r;
  var cfg = configEmpresa_();
  r.seguridad = {
    codigo_empresa: limpiarCodigo_(cfg.codigo_empresa || CFG.OWNER_CODE),
    codigo_auxilio_empresa: limpiarCodigo_(cfg.codigo_auxilio_empresa || ''),
    email_alertas: String(cfg.email_alertas || '').trim()
  };
  r.version_sos_plus = SOS_PLUS_TEST.VERSION;
  return r;
};

configSeguridad_ = function(p) {
  var cfgActual = configEmpresa_();
  if (!configCoincideOwner_(cfgActual, p.owner)) return {ok:false,error:'Acceso no autorizado'};

  var codigoEmpresaActual = limpiarCodigo_(cfgActual.codigo_empresa || CFG.OWNER_CODE);
  var codigoAuxilioActual = limpiarCodigo_(cfgActual.codigo_auxilio_empresa || '');

  var codigoEmpresaNuevo = limpiarCodigo_(p.codigo_empresa || '');
  var codigoAuxilioNuevo = limpiarCodigo_(p.codigo_auxilio_empresa || '');
  var email = String(p.email_alertas || '').trim();

  /* Vacío = conservar el valor actual. */
  var codigoEmpresaFinal = codigoEmpresaNuevo || codigoEmpresaActual;
  var codigoAuxilioFinal = codigoAuxilioNuevo || codigoAuxilioActual || SOS_PLUS_TEST.CODIGO_PRUEBA;

  if (codigoEmpresaFinal.length !== 4)
    return {ok:false,error:'El código de empresa debe tener 4 cifras'};
  if (codigoAuxilioFinal.length !== 4)
    return {ok:false,error:'El código SOS+ debe tener 4 cifras'};
  if (codigoEmpresaFinal === codigoAuxilioFinal)
    return {ok:false,error:'El código de empresa y el código SOS+ deben ser distintos'};

  if (codigoEmpresaFinal !== codigoEmpresaActual && codigoEnUso_(codigoEmpresaFinal))
    return {ok:false,error:'El nuevo código de empresa ya está utilizado'};

  if (codigoAuxilioFinal !== codigoAuxilioActual) {
    if (codigoAuxilioFinal === codigoEmpresaFinal)
      return {ok:false,error:'El código de empresa y el código SOS+ deben ser distintos'};

    var trabajadores = listarTrabajadores_();
    for (var i=0;i<trabajadores.length;i++) {
      if (limpiarCodigo_(trabajadores[i].codigo) === codigoAuxilioFinal)
        return {ok:false,error:'El nuevo código SOS+ ya está utilizado por un trabajador'};
      if (limpiarCodigo_(trabajadores[i].codigo_auxilio) === codigoAuxilioFinal)
        return {ok:false,error:'El nuevo código SOS+ coincide con un código histórico reservado'};
    }
  }

  var sh = hoja_('EMPRESAS');
  asegurarColumna_(sh,'codigo_empresa');
  asegurarColumna_(sh,'codigo_auxilio_empresa');
  asegurarColumna_(sh,'email_alertas');

  var h = cabeceras_(sh);
  var datos = sh.getRange(2,1,Math.max(1,sh.getLastRow()-1),sh.getLastColumn()).getValues();
  var idxEmpresa = h.indexOf('empresa_id');
  var fila = -1;
  for (var j=0;j<datos.length;j++) {
    if (String(datos[j][idxEmpresa]) === CFG.EMPRESA_ID) { fila=j+2; break; }
  }
  if (fila < 0) return {ok:false,error:'Empresa no encontrada'};

  sh.getRange(fila,h.indexOf('codigo_empresa')+1).setValue(codigoEmpresaFinal);
  sh.getRange(fila,h.indexOf('codigo_auxilio_empresa')+1).setValue(codigoAuxilioFinal);
  sh.getRange(fila,h.indexOf('email_alertas')+1).setValue(email);

  registrarLog_('CONFIG','seguridad_empresa','Seguridad actualizada · SOS+ '+codigoAuxilioFinal);

  return {
    ok:true,
    mensaje:'Seguridad actualizada correctamente',
    owner:codigoEmpresaFinal,
    codigo_auxilio_empresa:codigoAuxilioFinal,
    codigo_auxilio_anterior:codigoAuxilioActual,
    codigo_auxilio_cambiado:(codigoAuxilioFinal !== codigoAuxilioActual)
  };
};

/* ======================== ALTA SIN AUXILIO INDIVIDUAL ======================== */

crearTrabajador_ = function(p) {
  if (!esCodigoEmpresa_(p.owner)) return {ok:false,error:'Acceso no autorizado'};

  var codigo = limpiarCodigo_(p.codigo);
  var nombre = String(p.nombre || '').trim();
  var horas = Number(p.horas || 0);

  if (codigo.length !== 4) return {ok:false,error:'El código debe tener 4 cifras'};
  if (esCodigoEmpresa_(codigo) || esCodigoAuxilioEmpresa_(codigo))
    return {ok:false,error:'Código no disponible. Este código ya está registrado.'};
  if (!nombre) return {ok:false,error:'Falta el nombre del trabajador'};
  if (!horas || horas <= 0) return {ok:false,error:'Indica las horas semanales'};
  if (codigoEnUso_(codigo)) return {ok:false,error:'Código no disponible. Este código ya está registrado.'};

  var sh = hoja_('TRABAJADORES');
  asegurarColumna_(sh,'codigo');
  asegurarColumna_(sh,'codigo_auxilio');
  var headers = cabeceras_(sh);
  var id = siguienteIdTrabajador_();

  appendObjeto_(sh, headers, {
    empresa_id:CFG.EMPRESA_ID,
    trabajador_id:id,
    codigo:codigo,
    codigo_auxilio:'',
    nombre:nombre,
    horas_contrato_semana:horas,
    vigente_desde:String(p.desde || '') || Utilities.formatDate(new Date(), CFG.TZ, 'yyyy-MM-dd'),
    vigente_hasta:String(p.hasta || ''),
    activo:String(p.activo || 'SI').toUpperCase() === 'NO' ? 'NO' : 'SI',
    observaciones:'',
    actualizado:Utilities.formatDate(new Date(), CFG.TZ, 'yyyy-MM-dd HH:mm:ss')
  });

  registrarLog_('OK','crear_trabajador',id+' · '+nombre+' · '+codigo+' · sin auxilio individual');

  return {ok:true,trabajador:{trabajador_id:id,codigo:codigo,nombre:nombre,horas_contrato:horas}};
};

/* ======================== PREPARACIÓN Y VERIFICACIÓN ======================== */

function prepararSOSPlus7670_TEST() {
  var sh = hoja_('EMPRESAS');
  asegurarColumna_(sh, 'codigo_auxilio_empresa');
  var h = cabeceras_(sh);
  var datos = sh.getRange(2,1,Math.max(1,sh.getLastRow()-1),sh.getLastColumn()).getValues();
  var idxEmpresa = h.indexOf('empresa_id');
  var idxAux = h.indexOf('codigo_auxilio_empresa');

  for (var i=0; i<datos.length; i++) {
    if (String(datos[i][idxEmpresa]) === CFG.EMPRESA_ID) {
      sh.getRange(i+2, idxAux+1).setValue(SOS_PLUS_TEST.CODIGO_PRUEBA);
      registrarLog_('CONFIG','sos_plus_test','Código general SOS+ TEST = 7670');
      return {ok:true,version:SOS_PLUS_TEST.VERSION,codigo_general:SOS_PLUS_TEST.CODIGO_PRUEBA};
    }
  }
  throw new Error('Empresa no encontrada');
}

function verificarSOSPlus_TEST() {
  var cfg = configEmpresa_();
  var auxGeneral = limpiarCodigo_(cfg.codigo_auxilio_empresa || '');
  var antiguos = listarTrabajadores_().filter(function(t) {
    return limpiarCodigo_(t.codigo_auxilio || '').length === 4;
  }).map(function(t) {
    return {
      trabajador_id:String(t.trabajador_id || ''),
      codigo:limpiarCodigo_(t.codigo || ''),
      codigo_auxilio_historico:limpiarCodigo_(t.codigo_auxilio || '')
    };
  });

  var r = {
    ok:true,
    version:SOS_PLUS_TEST.VERSION,
    codigo_empresa:codigoEmpresaActual_(),
    codigo_auxilio_general:auxGeneral,
    codigo_prueba_esperado:SOS_PLUS_TEST.CODIGO_PRUEBA,
    general_configurado:(auxGeneral === SOS_PLUS_TEST.CODIGO_PRUEBA),
    alta_nuevo_trabajador:'SIN CODIGO AUXILIO INDIVIDUAL',
    codigos_individuales_historicos:antiguos,
    comportamiento_general:'ALERTA + respuesta neutra; sin fichaje y sin panel empresa',
    comportamiento_auxilio_individual:'DESACTIVADO por este parche',
    campo_auxilio_vacio:'CONSERVA EL CODIGO ACTUAL'
  };
  Logger.log(JSON.stringify(r));
  return r;
}
