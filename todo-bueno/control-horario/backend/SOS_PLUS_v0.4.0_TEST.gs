/*
 * TODO BUENO · CONTROL HORARIO
 * v0.4.0 TEST SOS+
 *
 * PARCHE DE PRUEBA sobre Code.gs v0.3.7.
 * NO sustituye el MASTER sellado.
 *
 * Objetivo:
 * - Un solo código general de auxilio por empresa (prueba: 7670).
 * - Los códigos de auxilio individuales históricos dejan de activar alertas.
 * - El código general NO abre el panel de empresa.
 * - El código general NO crea un fichaje falso porque no identifica a un trabajador.
 * - Tras activar la alerta, la interfaz recibe "Código no válido" como respuesta neutra.
 *
 * INSTALACIÓN DE PRUEBA:
 * 1) En Apps Script del proyecto TODO_BUENO_CONTROL_HORARIO_v0.1 crear archivo SOS_PLUS_TEST.gs.
 * 2) Pegar este archivo completo.
 * 3) Guardar.
 * 4) Crear una NUEVA implementación de prueba. No sustituir todavía la implementación MASTER.
 * 5) En EMPRESAS configurar codigo_auxilio_empresa = 7670 y un email de prueba.
 */

var SOS_PLUS_TEST = {
  VERSION: '0.4.0-TEST-SOS',
  CODIGO_PRUEBA: '7670'
};

/* Guardamos las funciones originales de v0.3.7. */
var __tb_fichar_v037 = fichar_;

/*
 * Sustituimos únicamente el punto de entrada del fichaje.
 * El resto del motor v0.3.7 continúa funcionando igual.
 */
fichar_ = function(codigo, requestId, confirmarSalida) {
  codigo = limpiarCodigo_(codigo);

  if (codigo.length !== 4) {
    return {ok:false,error:'Introduce un código de 4 cifras'};
  }

  var cfgEmpresa = configEmpresa_();

  /* Acceso normal de empresa: sin cambios. */
  if (configCoincideOwner_(cfgEmpresa, codigo)) {
    return {
      ok:true,
      rol:'EMPRESA',
      owner:limpiarCodigo_(cfgEmpresa.codigo_empresa || CFG.OWNER_CODE)
    };
  }

  /*
   * SOS+ GENERAL.
   * Registra la alerta, pero no identifica trabajador ni registra entrada/salida.
   * Devuelve una respuesta neutra que la pantalla actual ya sabe manejar.
   */
  if (configCoincideAuxEmpresa_(cfgEmpresa, codigo)) {
    var ahora = new Date();
    var fechaIso = Utilities.formatDate(ahora, CFG.TZ, 'yyyy-MM-dd');
    var hora = Utilities.formatDate(ahora, CFG.TZ, 'HH:mm');

    registrarAlertaAuxilioEmpresa_(fechaIso, hora, ahora);
    registrarLog_(
      'ALERTA',
      'sos_plus_general',
      'SOS+ general activado · ' + fechaIso + ' ' + hora
    );

    /*
     * Importante: no devolvemos rol EMPRESA y no mostramos ninguna palabra
     * relacionada con auxilio/SOS. Tampoco generamos un fichaje inventado.
     */
    return {ok:false,error:'Código no válido'};
  }

  /*
   * Desactivamos los códigos de auxilio individuales antiguos.
   * Se conservan en la hoja por histórico, pero dejan de tener efecto.
   */
  var antiguoAux = buscarTrabajadorPorCodigoAuxilio_(codigo);
  if (antiguoAux) {
    return {ok:false,error:'Código no válido'};
  }

  /* Cualquier código personal normal sigue usando el motor v0.3.7 aprobado. */
  return __tb_fichar_v037(codigo, requestId, confirmarSalida);
};

/*
 * Utilidad opcional para preparar la prueba en la hoja.
 * Ejecutar MANUALMENTE una sola vez desde Apps Script si se desea.
 * Configura únicamente 7670; no modifica el código normal de empresa.
 * El email se deja intacto.
 */
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
      return {
        ok:true,
        version:SOS_PLUS_TEST.VERSION,
        codigo_general:SOS_PLUS_TEST.CODIGO_PRUEBA
      };
    }
  }
  throw new Error('Empresa no encontrada');
}

/* Verificación sin activar ninguna alerta. */
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
    codigos_individuales_historicos:antiguos,
    comportamiento_general:'ALERTA + respuesta neutra; sin fichaje y sin panel empresa',
    comportamiento_auxilio_individual:'DESACTIVADO por este parche'
  };
  Logger.log(JSON.stringify(r));
  return r;
}
