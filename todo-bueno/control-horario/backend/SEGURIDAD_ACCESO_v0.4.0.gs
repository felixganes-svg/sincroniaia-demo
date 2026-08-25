/*
 * TODO BUENO · CONTROL HORARIO · BÁSICA v0.4.0
 * SEGURIDAD DE ACCESO — BLOQUE 1
 *
 * Protección en BACKEND:
 * - 5 intentos fallidos sobre el mismo código => bloqueo 45 s
 * - desbloqueo automático
 * - éxito => limpia contador
 * - mensaje neutro
 * - no guarda el PIN probado en LOG
 *
 * IMPORTANTE:
 * En Código.gs, dentro de ejecutarAccion_(), cambiar SOLO:
 *   if (action === 'fichar') return fichar_(p.codigo, p.request_id, p.confirmar_salida);
 * por:
 *   if (action === 'fichar') return ficharSeguro_(p.codigo, p.request_id, p.confirmar_salida);
 */

var SEG_ACCESO = {
  MAX_FALLOS: 5,
  BLOQUEO_SEGUNDOS: 45,
  VENTANA_FALLOS_SEGUNDOS: 120
};

function ficharSeguro_(codigo, requestId, confirmarSalida) {
  var limpio = limpiarCodigo_(codigo);
  var cache = CacheService.getScriptCache();
  var huella = huellaAcceso_(limpio || String(codigo || ''));
  var keyFallos = 'SEG_FAIL_' + huella;
  var keyBloqueo = 'SEG_BLOCK_' + huella;

  /* Si ya está bloqueado, no llamamos a la lógica normal de fichaje. */
  if (cache.get(keyBloqueo)) {
    registrarEventoSeguridad_('BLOQUEO_ACTIVO', 'Intento durante bloqueo temporal');
    return {
      ok: false,
      error: 'No se pudo validar el código. Espera unos segundos e inténtalo de nuevo.',
      seguridad: 'BLOQUEO_TEMPORAL'
    };
  }

  /* Formato inválido: se trata como fallo de acceso, sin revelar más. */
  if (!/^\d{4}$/.test(limpio)) {
    return registrarFalloAcceso_(cache, keyFallos, keyBloqueo);
  }

  var respuesta;
  try {
    respuesta = fichar_(limpio, requestId, confirmarSalida);
  } catch (e) {
    /* Un error técnico no debe consumir intentos de autenticación. */
    registrarEventoSeguridad_('ERROR_TECNICO', String(e && e.message ? e.message : e));
    throw e;
  }

  /* Acceso correcto: reiniciamos contador y bloqueo para ese código. */
  if (respuesta && respuesta.ok) {
    cache.remove(keyFallos);
    cache.remove(keyBloqueo);
    return respuesta;
  }

  /* No contar como fallo de autenticación un bloqueo interno por concurrencia. */
  var err = String((respuesta && respuesta.error) || '');
  if (err.indexOf('procesando otro fichaje') >= 0) return respuesta;

  /* Cualquier otro rechazo de acceso se responde de forma neutra. */
  return registrarFalloAcceso_(cache, keyFallos, keyBloqueo);
}

function registrarFalloAcceso_(cache, keyFallos, keyBloqueo) {
  var fallos = Number(cache.get(keyFallos) || 0) + 1;
  cache.put(keyFallos, String(fallos), SEG_ACCESO.VENTANA_FALLOS_SEGUNDOS);

  registrarEventoSeguridad_('ACCESO_FALLIDO', 'Intento de acceso rechazado');

  if (fallos >= SEG_ACCESO.MAX_FALLOS) {
    cache.put(keyBloqueo, '1', SEG_ACCESO.BLOQUEO_SEGUNDOS);
    cache.remove(keyFallos);
    registrarEventoSeguridad_('BLOQUEO_INICIADO', 'Bloqueo temporal de 45 segundos');

    return {
      ok: false,
      error: 'No se pudo validar el código. Espera unos segundos e inténtalo de nuevo.',
      seguridad: 'BLOQUEO_TEMPORAL'
    };
  }

  return {
    ok: false,
    error: 'Código no válido'
  };
}

function huellaAcceso_(valor) {
  var bytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    String(valor || ''),
    Utilities.Charset.UTF_8
  );
  return bytes.map(function(b) {
    var v = (b < 0 ? b + 256 : b).toString(16);
    return ('0' + v).slice(-2);
  }).join('').slice(0, 24);
}

function registrarEventoSeguridad_(evento, detalle) {
  /* Nunca se envía ni almacena aquí el código introducido. */
  try {
    if (typeof registrarLog_ === 'function') {
      registrarLog_('WARN', 'seguridad_acceso_' + evento, String(detalle || ''));
    }
  } catch (e) {
    /* El LOG no debe impedir un fichaje o un bloqueo. */
  }
}
