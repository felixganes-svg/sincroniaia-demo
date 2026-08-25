var CFG = {
  VERSION: '0.3.7',
  SPREADSHEET_ID: '1ShVF1jKQal-jlErDwY8_ugfpH5d1oX2JUNGvfX5a2hc',
  EMPRESA_ID: 'EMP-TODOBUENO-PILOTO',
  CENTRO_ID: 'CENTRO-TB-001',
  CENTRO: 'Panadería Todo Bueno Mataró',
  TZ: 'Europe/Madrid',
  OWNER_CODE: '7826',
  BACKUP_FOLDER: 'SINCRONIAIA_BACKUP_TODO_BUENO'
};

function doGet(e) {
  try {
    var p = (e && e.parameter) ? e.parameter : {};
    return salida_(ejecutarAccion_(p.action || 'ping', p), p.callback);
  } catch (err) {
    return salida_({ok:false,error:String(err && err.message ? err.message : err)},
      e && e.parameter ? e.parameter.callback : '');
  }
}

function doPost(e) {
  try {
    var body = {};
    if (e && e.postData && e.postData.contents) body = JSON.parse(e.postData.contents);
    return salida_(ejecutarAccion_(body.action || 'ping', body), body.callback || '');
  } catch (err) {
    return salida_({ok:false,error:String(err && err.message ? err.message : err)}, '');
  }
}

function ejecutarAccion_(action, p) {
  if (action === 'ping') return {ok:true,version:CFG.VERSION,servicio:'TODO BUENO CONTROL HORARIO'};
  if (action === 'fichar') return fichar_(p.codigo, p.request_id, p.confirmar_salida);
  if (action === 'resumen') return resumen_(p.codigo);
  if (action === 'panel') return panel_(p.owner);
  if (action === 'crearTrabajador') return crearTrabajador_(p);
  if (action === 'darBaja') return darBaja_(p);
  if (action === 'informe') return informe_(p);
  if (action === 'detalleTrabajador') return detalleTrabajador_(p);
  if (action === 'configSeguridad') return configSeguridad_(p);
  if (action === 'resumenMensualTrabajador') return resumenMensualTrabajador_(p);
  if (action === 'registrarCalendario') return registrarCalendario_(p);
  return {ok:false,error:'Acción no válida: ' + action};
}

function salida_(obj, callback) {
  var texto = JSON.stringify(obj);
  if (callback) {
    return ContentService.createTextOutput(callback + '(' + texto + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(texto).setMimeType(ContentService.MimeType.JSON);
}

/* ======================== FICHAJE ======================== */


function configEmpresa_() {
  var sh = hoja_('EMPRESAS');
  var datos = datosObjetos_(sh);
  for (var i=0;i<datos.length;i++) {
    if (String(datos[i].empresa_id || '') === CFG.EMPRESA_ID) {
      return {
        codigo_empresa: limpiarCodigo_(datos[i].codigo_empresa || CFG.OWNER_CODE),
        codigo_auxilio_empresa: limpiarCodigo_(datos[i].codigo_auxilio_empresa || ''),
        email_alertas: String(datos[i].email_alertas || '').trim()
      };
    }
  }
  return {codigo_empresa:CFG.OWNER_CODE,codigo_auxilio_empresa:'',email_alertas:''};
}

function codigoEmpresaActual_() {
  var c = configEmpresa_().codigo_empresa;
  return c && c.length === 4 ? c : CFG.OWNER_CODE;
}

function esCodigoEmpresa_(codigo) {
  return limpiarCodigo_(codigo) === codigoEmpresaActual_();
}

function esCodigoAuxilioEmpresa_(codigo) {
  var aux = configEmpresa_().codigo_auxilio_empresa;
  return aux && aux.length === 4 && limpiarCodigo_(codigo) === aux;
}

function registrarAlertaAuxilioEmpresa_(fechaIso, hora, ahora) {
  var sh = obtenerHojaAlertas_();
  var h = cabeceras_(sh);
  appendObjeto_(sh,h,{
    alerta_id:'ALERTA-'+Utilities.getUuid(),
    empresa_id:CFG.EMPRESA_ID,
    trabajador_id:'',
    nombre:'Empresa · Todo Bueno',
    fecha_iso:fechaIso,
    hora:hora,
    origen:'EMPRESA',
    tipo_fichaje:'ACCESO',
    estado:'AUXILIO',
    creado:Utilities.formatDate(ahora,CFG.TZ,'yyyy-MM-dd HH:mm:ss'),
    canal_notificacion:'EMAIL',
    detalle:'Alerta silenciosa desde acceso de empresa'
  });
  var email = configEmpresa_().email_alertas;
  if (email) {
    try {
      MailApp.sendEmail(
        email,
        'Alerta de auxilio · Todo Bueno',
        'Se ha activado el código de auxilio de empresa el '+fechaIso+' a las '+hora+'.'
      );
    } catch(e) {
      registrarLog_('ERROR','email_auxilio_empresa',String(e));
    }
  }
}


function todosFichajesEmpresa_() {
  return datosObjetos_(hoja_('FICHAJES')).filter(function(x) {
    return String(x.empresa_id) === CFG.EMPRESA_ID;
  }).sort(ordenFichajes_);
}

function agruparFichajesPorTrabajador_(fichajes) {
  var mapa = {};
  (fichajes || []).forEach(function(f) {
    var id = String(f.trabajador_id || '');
    if (!mapa[id]) mapa[id] = [];
    mapa[id].push(f);
  });
  return mapa;
}

function calcularResumenTrabajadorConFichajes_(t, fichajes) {
  var hoy = new Date();
  var fechaHoy = Utilities.formatDate(hoy, CFG.TZ, 'yyyy-MM-dd');
  var lunes = lunesDeSemana_(hoy);
  var inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  var f = fichajes || [];
  return {
    codigo:limpiarCodigo_(t.codigo),
    trabajador_id:t.trabajador_id,
    nombre:t.nombre,
    horas_contrato:Number(t.horas_contrato_semana || 0),
    hoy:formatoMinutos_(totalMinutos_(f, fechaHoy, fechaHoy)),
    semana:formatoMinutos_(totalMinutos_(f, Utilities.formatDate(lunes, CFG.TZ, 'yyyy-MM-dd'), fechaHoy)),
    mes:formatoMinutos_(totalMinutos_(f, Utilities.formatDate(inicioMes, CFG.TZ, 'yyyy-MM-dd'), fechaHoy))
  };
}

function buscarEnTrabajadoresPorCodigo_(todos, codigo, campo) {
  campo = campo || 'codigo';
  for (var i=0;i<(todos||[]).length;i++) {
    if (limpiarCodigo_(todos[i][campo]) === codigo) return todos[i];
  }
  return null;
}

function configCoincideOwner_(cfgEmpresa, codigo) {
  codigo = limpiarCodigo_(codigo);
  var actual = limpiarCodigo_((cfgEmpresa && cfgEmpresa.codigo_empresa) || CFG.OWNER_CODE);
  return codigo.length === 4 && codigo === actual;
}

function configCoincideAuxEmpresa_(cfgEmpresa, codigo) {
  codigo = limpiarCodigo_(codigo);
  var aux = limpiarCodigo_((cfgEmpresa && cfgEmpresa.codigo_auxilio_empresa) || '');
  return aux.length === 4 && codigo === aux;
}

function fichar_(codigo, requestId, confirmarSalida) {
  codigo = limpiarCodigo_(codigo);
  requestId = String(requestId || '').trim();

  if (codigo.length !== 4) return {ok:false,error:'Introduce un código de 4 cifras'};

  // Una sola lectura de EMPRESAS para resolver acceso normal/auxilio.
  var cfgEmpresa = configEmpresa_();
  if (configCoincideOwner_(cfgEmpresa, codigo)) {
    return {ok:true,rol:'EMPRESA',owner:limpiarCodigo_(cfgEmpresa.codigo_empresa || CFG.OWNER_CODE)};
  }
  if (configCoincideAuxEmpresa_(cfgEmpresa, codigo)) {
    var ahoraEmp = new Date();
    var fechaIsoEmp = Utilities.formatDate(ahoraEmp, CFG.TZ, 'yyyy-MM-dd');
    var horaEmp = Utilities.formatDate(ahoraEmp, CFG.TZ, 'HH:mm');
    registrarAlertaAuxilioEmpresa_(fechaIsoEmp, horaEmp, ahoraEmp);
    return {ok:true,rol:'EMPRESA',owner:limpiarCodigo_(cfgEmpresa.codigo_empresa || CFG.OWNER_CODE)};
  }

  // Idempotencia antes del trabajo pesado.
  if (requestId) {
    var cachePrevio = CacheService.getScriptCache();
    var keyPrevio = 'FICHAJE_REQ_' + requestId;
    var previo = cachePrevio.get(keyPrevio);
    if (previo) return JSON.parse(previo);
  }

  var lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) return {ok:false,error:'El sistema está procesando otro fichaje. Inténtalo de nuevo.'};

  try {
    // Una sola lectura de TRABAJADORES.
    var todos = listarTrabajadores_();
    var auxilio = buscarEnTrabajadoresPorCodigo_(todos, codigo, 'codigo_auxilio');
    var trabajador = auxilio || buscarEnTrabajadoresPorCodigo_(todos, codigo, 'codigo');

    if (!trabajador) return {ok:false,error:'Código no válido'};
    if (String(trabajador.activo).toUpperCase() !== 'SI') return {ok:false,error:'Trabajador dado de baja'};

    // Una sola lectura de FICHAJES para todo el proceso.
    var todosFichajes = todosFichajesEmpresa_();
    var fTrab = todosFichajes.filter(function(x) {
      return String(x.trabajador_id) === String(trabajador.trabajador_id);
    });
    var ultimo = fTrab.length ? fTrab[fTrab.length-1] : null;
    var tipo = (ultimo && String(ultimo.tipo).toUpperCase() === 'ENTRADA') ? 'SALIDA' : 'ENTRADA';

    var ahora = new Date();
    var fecha = Utilities.formatDate(ahora, CFG.TZ, 'dd/MM/yyyy');
    var fechaIso = Utilities.formatDate(ahora, CFG.TZ, 'yyyy-MM-dd');
    var hora = Utilities.formatDate(ahora, CFG.TZ, 'HH:mm');

    if (!auxilio && tipo === 'SALIDA' && String(confirmarSalida || '').toUpperCase() !== 'SI') {
      var segundos = segundosDesdeUltimoFichaje_(ultimo, ahora);
      if (segundos >= 0 && segundos <= 30) {
        return {
          ok:true,
          rol:'TRABAJADOR',
          requiere_confirmacion_salida:true,
          codigo:codigo,
          nombre:trabajador.nombre,
          hora_entrada:normalizarHora_(ultimo.hora),
          segundos_desde_entrada:segundos
        };
      }
    }

    var nuevo = registrarFichaje_(trabajador, tipo, fecha, fechaIso, hora, ahora);
    fTrab.push(nuevo);

    if (auxilio) {
      registrarAlertaAuxilio_(trabajador, tipo, fechaIso, hora, ahora);
    }

    var respuesta = {
      ok:true,
      rol:'TRABAJADOR',
      tipo:tipo,
      hora:hora,
      resumen:calcularResumenTrabajadorConFichajes_(trabajador, fTrab)
    };

    if (requestId) {
      CacheService.getScriptCache().put('FICHAJE_REQ_' + requestId, JSON.stringify(respuesta), 120);
    }
    return respuesta;
  } finally {
    lock.releaseLock();
  }
}

function segundosDesdeUltimoFichaje_(ultimo, ahora) {
  if (!ultimo) return -1;
  var creado = ultimo.creado;
  if (Object.prototype.toString.call(creado) === '[object Date]' && !isNaN(creado.getTime())) {
    return Math.max(0, Math.floor((ahora.getTime() - creado.getTime()) / 1000));
  }
  var s = String(creado || '').trim();
  var m = s.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?/);
  if (m) {
    var d = new Date(Number(m[1]), Number(m[2])-1, Number(m[3]), Number(m[4]), Number(m[5]), Number(m[6] || 0));
    return Math.max(0, Math.floor((ahora.getTime() - d.getTime()) / 1000));
  }
  var hu = normalizarHora_(ultimo.hora);
  if (!hu) return -1;
  var ha = Utilities.formatDate(ahora, CFG.TZ, 'HH:mm');
  var dif = horaAMinutos_(ha) - horaAMinutos_(hu);
  if (dif < 0) dif += 1440;
  return dif * 60;
}

function registrarFichaje_(trabajador, tipo, fecha, fechaIso, hora, ahora) {
  var sh = hoja_('FICHAJES');
  var headers = cabeceras_(sh);
  var registro = {
    fichaje_id:'F-' + Utilities.getUuid(),
    empresa_id:CFG.EMPRESA_ID,
    trabajador_id:trabajador.trabajador_id,
    nombre:trabajador.nombre,
    fecha:fecha,
    fecha_iso:fechaIso,
    tipo:tipo,
    hora:hora,
    centro_id:CFG.CENTRO_ID,
    centro:CFG.CENTRO,
    latitud:'',
    longitud:'',
    gps_estado:'NO_USADO',
    creado:Utilities.formatDate(ahora, CFG.TZ, 'yyyy-MM-dd HH:mm:ss')
  };
  appendObjeto_(sh, headers, registro);
  return registro;
}

/* ======================== RESUMEN ======================== */

function resumen_(codigo) {
  codigo = limpiarCodigo_(codigo);
  var t = buscarTrabajadorPorCodigo_(codigo);
  if (!t) return {ok:false,error:'Código no válido'};
  return {ok:true,resumen:calcularResumenTrabajador_(t)};
}

function calcularResumenTrabajador_(t) {
  return calcularResumenTrabajadorConFichajes_(t, fichajesTrabajador_(t.trabajador_id));
}

/* Cálculo tolerante a registros antiguos defectuosos:
   - una segunda ENTRADA mientras ya hay una abierta se ignora;
   - una SALIDA sin ENTRADA abierta se ignora;
   - solo suma pares válidos ENTRADA -> SALIDA. */
function totalMinutos_(fichajes, desde, hasta) {
  var porDia = {};
  fichajes.forEach(function(f) {
    var fi = normalizarFechaIso_(f.fecha_iso);
    if (!fi || fi < desde || fi > hasta) return;
    if (!porDia[fi]) porDia[fi] = [];
    porDia[fi].push(f);
  });

  var total = 0;
  Object.keys(porDia).forEach(function(fecha) {
    porDia[fecha].sort(ordenFichajes_);
    var entrada = null;

    porDia[fecha].forEach(function(x) {
      var tipo = String(x.tipo || '').toUpperCase();
      if (tipo === 'ENTRADA') {
        if (entrada === null) entrada = normalizarHora_(x.hora);
      } else if (tipo === 'SALIDA') {
        if (entrada !== null) {
          var salidaMin = horaAMinutos_(normalizarHora_(x.hora));
          var entradaMin = horaAMinutos_(entrada);
          if (!isNaN(salidaMin) && !isNaN(entradaMin)) {
            var min = salidaMin - entradaMin;
            if (min < 0) min += 1440;
            total += min;
          }
          entrada = null;
        }
      }
    });
  });
  return total;
}

function ordenFichajes_(a,b) {
  var ca = String(a.creado || '');
  var cb = String(b.creado || '');
  if (ca && cb && ca !== cb) return ca.localeCompare(cb);
  return String(a.hora || '').localeCompare(String(b.hora || ''));
}

function normalizarFechaIso_(v) {
  if (!v) return '';
  if (Object.prototype.toString.call(v) === '[object Date]' && !isNaN(v.getTime())) {
    return Utilities.formatDate(v, CFG.TZ, 'yyyy-MM-dd');
  }
  var s = String(v);
  var m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? (m[1]+'-'+m[2]+'-'+m[3]) : '';
}

function normalizarHora_(v) {
  if (v === null || v === undefined || v === '') return '';

  if (Object.prototype.toString.call(v) === '[object Date]' && !isNaN(v.getTime())) {
    return Utilities.formatDate(v, CFG.TZ, 'HH:mm');
  }

  if (typeof v === 'number') {
    var total = Math.round((v % 1) * 24 * 60);
    var h = Math.floor(total / 60) % 24;
    var m = total % 60;
    return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
  }

  var s = String(v).trim();

  var directo = s.match(/^(\d{1,2}):(\d{2})/);
  if (directo) {
    return ('0' + directo[1]).slice(-2) + ':' + directo[2];
  }

  var dentro = s.match(/\b(\d{1,2}):(\d{2})(?::\d{2})?\b/);
  if (dentro) {
    return ('0' + dentro[1]).slice(-2) + ':' + dentro[2];
  }

  return '';
}

function horaAMinutos_(hora) {
  var h = normalizarHora_(hora);
  if (!h) return NaN;
  var p = h.split(':');
  return Number(p[0] || 0) * 60 + Number(p[1] || 0);
}

function formatoMinutos_(m) {
  m = Math.round(Number(m || 0));
  var signo = m < 0 ? '-' : '';
  m = Math.abs(m);
  return signo + Math.floor(m/60) + ':' + ((m%60)<10 ? '0' : '') + (m%60);
}

function lunesDeSemana_(fecha) {
  var d = new Date(fecha.getTime());
  var dia = d.getDay();
  d.setHours(0,0,0,0);
  d.setDate(d.getDate() + (dia === 0 ? -6 : 1-dia));
  return d;
}

/* ======================== EMPRESA ======================== */

function panel_(owner) {
  var cfgEmpresa = configEmpresa_();
  if (!configCoincideOwner_(cfgEmpresa, owner)) return {ok:false,error:'Acceso no autorizado'};

  var trabajadores = listarTrabajadores_();
  var fichajes = todosFichajesEmpresa_();
  var porTrab = agruparFichajesPorTrabajador_(fichajes);
  var salida = [];

  trabajadores.forEach(function(t) {
    var codigo = limpiarCodigo_(t.codigo);
    if (codigo.length !== 4) return;

    var f = porTrab[String(t.trabajador_id)] || [];
    var r = calcularResumenTrabajadorConFichajes_(t, f);
    var activo = String(t.activo).toUpperCase() === 'SI';
    var ultimo = f.length ? f[f.length-1] : null;

    salida.push({
      codigo:codigo,
      trabajador_id:t.trabajador_id,
      nombre:t.nombre,
      horas_contrato:Number(t.horas_contrato_semana || 0),
      activo:activo,
      vigente_desde:fechaTexto_(t.vigente_desde),
      vigente_hasta:fechaTexto_(t.vigente_hasta),
      estado:activo ? ((ultimo && String(ultimo.tipo).toUpperCase() === 'ENTRADA') ? 'Trabajando' : 'Fuera') : 'Baja',
      hoy:r.hoy,
      semana:r.semana,
      mes:r.mes
    });
  });

  return {ok:true,version:CFG.VERSION,trabajadores:salida,alertas:listarAlertasAuxilio_(10)};
}

function crearTrabajador_(p) {
  if (!esCodigoEmpresa_(p.owner)) return {ok:false,error:'Acceso no autorizado'};

  var codigo = limpiarCodigo_(p.codigo);
  var nombre = String(p.nombre || '').trim();
  var horas = Number(p.horas || 0);
  var codigoAuxilio = limpiarCodigo_(p.codigo_auxilio);

  if (codigo.length !== 4) return {ok:false,error:'El código debe tener 4 cifras'};
  if (esCodigoEmpresa_(codigo) || esCodigoAuxilioEmpresa_(codigo)) return {ok:false,error:'Código no disponible. Este código ya está registrado.'};
  if (codigoAuxilio.length !== 4) return {ok:false,error:'El código de auxilio debe tener 4 cifras'};
  if (esCodigoEmpresa_(codigoAuxilio) || esCodigoAuxilioEmpresa_(codigoAuxilio)) return {ok:false,error:'Código no disponible. Este código ya está registrado.'};
  if (codigoAuxilio === codigo) return {ok:false,error:'El código normal y el código de auxilio deben ser distintos'};
  if (!nombre) return {ok:false,error:'Falta el nombre del trabajador'};
  if (!horas || horas <= 0) return {ok:false,error:'Indica las horas semanales'};
  if (codigoEnUso_(codigo)) return {ok:false,error:'Código no disponible. Este código ya está registrado.'};
  if (codigoEnUso_(codigoAuxilio)) return {ok:false,error:'Código no disponible. Este código ya está registrado.'};

  var sh = hoja_('TRABAJADORES');
  asegurarColumna_(sh,'codigo');
  asegurarColumna_(sh,'codigo_auxilio');
  var headers = cabeceras_(sh);
  var id = siguienteIdTrabajador_();

  appendObjeto_(sh, headers, {
    empresa_id:CFG.EMPRESA_ID,
    trabajador_id:id,
    codigo:codigo,
    codigo_auxilio:codigoAuxilio,
    nombre:nombre,
    horas_contrato_semana:horas,
    vigente_desde:String(p.desde || '') || Utilities.formatDate(new Date(), CFG.TZ, 'yyyy-MM-dd'),
    vigente_hasta:String(p.hasta || ''),
    activo:String(p.activo || 'SI').toUpperCase() === 'NO' ? 'NO' : 'SI',
    observaciones:'',
    actualizado:Utilities.formatDate(new Date(), CFG.TZ, 'yyyy-MM-dd HH:mm:ss')
  });

  return {ok:true,trabajador:{trabajador_id:id,codigo:codigo,nombre:nombre,horas_contrato:horas}};
}

function darBaja_(p) {
  var cfgEmpresa = configEmpresa_();
  if (!configCoincideOwner_(cfgEmpresa, p.owner)) return {ok:false,error:'Acceso no autorizado'};

  var codigo = limpiarCodigo_(p.codigo);
  if (codigo.length !== 4) return {ok:false,error:'Código no válido'};

  var sh = hoja_('TRABAJADORES');
  asegurarColumna_(sh,'codigo');
  var headers = cabeceras_(sh);
  var numRows = Math.max(0, sh.getLastRow()-1);
  if (!numRows) return {ok:false,error:'Trabajador no encontrado'};
  var datos = sh.getRange(2,1,numRows,sh.getLastColumn()).getValues();

  var iCodigo = headers.indexOf('codigo');
  var iActivo = headers.indexOf('activo');
  var iHasta = headers.indexOf('vigente_hasta');
  var iAct = headers.indexOf('actualizado');
  var iId = headers.indexOf('trabajador_id');

  for (var r=0; r<datos.length; r++) {
    if (limpiarCodigo_(datos[r][iCodigo]) !== codigo) continue;

    if (String(datos[r][iActivo] || '').toUpperCase() !== 'SI') {
      return {ok:false,error:'El trabajador ya está de baja'};
    }

    var id = String(datos[r][iId] || '');
    var fichajes = todosFichajesEmpresa_().filter(function(x) {
      return String(x.trabajador_id) === id;
    });
    var ultimo = fichajes.length ? fichajes[fichajes.length-1] : null;

    if (ultimo && String(ultimo.tipo).toUpperCase() === 'ENTRADA') {
      return {
        ok:false,
        error:'No se puede dar de baja. Tiene una jornada abierta. Registre primero la salida.'
      };
    }

    var ahora = new Date();
    sh.getRange(r+2,iActivo+1).setValue('NO');
    if (iHasta >= 0) sh.getRange(r+2,iHasta+1).setValue(Utilities.formatDate(ahora, CFG.TZ, 'yyyy-MM-dd'));
    if (iAct >= 0) sh.getRange(r+2,iAct+1).setValue(Utilities.formatDate(ahora, CFG.TZ, 'yyyy-MM-dd HH:mm:ss'));

    return {
      ok:true,
      codigo:codigo,
      activo:false,
      estado:'Baja',
      vigente_hasta:Utilities.formatDate(ahora, CFG.TZ, 'yyyy-MM-dd')
    };
  }
  return {ok:false,error:'Trabajador no encontrado'};
}

/* ======================== INFORMES ======================== */

function informe_(p) {
  var cfgEmpresa = configEmpresa_();
  if (!configCoincideOwner_(cfgEmpresa, p.owner)) return {ok:false,error:'Acceso no autorizado'};
  var desde = String(p.desde || ''), hasta = String(p.hasta || '');
  if (!desde || !hasta) return {ok:false,error:'Selecciona fecha desde y hasta'};
  if (desde > hasta) return {ok:false,error:'La fecha desde no puede ser posterior a la fecha hasta'};

  var trabajadores = listarTrabajadores_();
  var porTrab = agruparFichajesPorTrabajador_(todosFichajesEmpresa_());
  var filtroCodigo = limpiarCodigo_(p.codigo || '');
  var salida = [];

  trabajadores.forEach(function(t) {
    var codigo = limpiarCodigo_(t.codigo);
    if (codigo.length !== 4) return;
    if (filtroCodigo && codigo !== filtroCodigo) return;
    var f = porTrab[String(t.trabajador_id)] || [];
    salida.push({
      codigo:codigo,
      trabajador_id:t.trabajador_id,
      nombre:t.nombre,
      total:formatoMinutos_(totalMinutos_(f, desde, hasta))
    });
  });
  return {ok:true,desde:desde,hasta:hasta,trabajadores:salida};
}

/* ======================== DATOS ======================== */

function listarTrabajadores_() {
  return datosObjetos_(hoja_('TRABAJADORES')).filter(function(x) {
    return String(x.empresa_id) === CFG.EMPRESA_ID;
  });
}

function buscarTrabajadorPorCodigo_(codigo) {
  var todos = listarTrabajadores_();
  for (var i=0;i<todos.length;i++) {
    if (limpiarCodigo_(todos[i].codigo) === codigo) return todos[i];
  }
  return null;
}


function buscarTrabajadorPorCodigoAuxilio_(codigo) {
  var todos = listarTrabajadores_();
  for (var i=0;i<todos.length;i++) {
    if (limpiarCodigo_(todos[i].codigo_auxilio) === codigo) return todos[i];
  }
  return null;
}

function codigoEnUso_(codigo) {
  codigo = limpiarCodigo_(codigo);
  if (codigo.length !== 4) return false;
  if (esCodigoEmpresa_(codigo) || esCodigoAuxilioEmpresa_(codigo)) return true;
  var todos = listarTrabajadores_();
  for (var i=0;i<todos.length;i++) {
    if (limpiarCodigo_(todos[i].codigo) === codigo) return true;
    if (limpiarCodigo_(todos[i].codigo_auxilio) === codigo) return true;
  }
  return false;
}

function obtenerHojaAlertas_() {
  var ss = SpreadsheetApp.openById(CFG.SPREADSHEET_ID);
  var sh = ss.getSheetByName('ALERTAS');
  if (!sh) {
    sh = ss.insertSheet('ALERTAS');
    sh.appendRow([
      'alerta_id','empresa_id','trabajador_id','nombre','fecha_iso','hora',
      'tipo_fichaje','estado','creado','canal_notificacion','detalle'
    ]);
  }
  return sh;
}

function registrarAlertaAuxilio_(trabajador, tipo, fechaIso, hora, ahora) {
  var sh = obtenerHojaAlertas_();
  var headers = cabeceras_(sh);
  var alertaId = 'AUX-' + Utilities.getUuid();

  appendObjeto_(sh, headers, {
    alerta_id:alertaId,
    empresa_id:CFG.EMPRESA_ID,
    trabajador_id:trabajador.trabajador_id,
    nombre:trabajador.nombre,
    fecha_iso:fechaIso,
    hora:hora,
    tipo_fichaje:tipo,
    estado:'PENDIENTE',
    creado:Utilities.formatDate(ahora, CFG.TZ, 'yyyy-MM-dd HH:mm:ss'),
    canal_notificacion:'PANEL_EMPRESA',
    detalle:'Código de auxilio silencioso activado'
  });

  registrarLog_('ALERTA','auxilio',
    'Auxilio silencioso · ' + trabajador.trabajador_id + ' · ' + trabajador.nombre + ' · ' + fechaIso + ' ' + hora);

  enviarAvisoAuxilioEmail_(trabajador, fechaIso, hora);
  return alertaId;
}

function listarAlertasAuxilio_(limite) {
  var ss = SpreadsheetApp.openById(CFG.SPREADSHEET_ID);
  var sh = ss.getSheetByName('ALERTAS');
  if (!sh || sh.getLastRow() < 2) return [];

  var datos = datosObjetos_(sh).filter(function(a) {
    return String(a.empresa_id) === CFG.EMPRESA_ID;
  });

  datos.sort(function(a,b) {
    return String(b.creado || '').localeCompare(String(a.creado || ''));
  });

  return datos.slice(0, Number(limite || 10)).map(function(a) {
    return {
      alerta_id:String(a.alerta_id || ''),
      trabajador_id:String(a.trabajador_id || ''),
      nombre:String(a.nombre || ''),
      fecha_iso:normalizarFechaIso_(a.fecha_iso),
      hora:normalizarHora_(a.hora),
      estado:String(a.estado || 'PENDIENTE')
    };
  });
}

function obtenerEmailAlertas_() {
  var sh = hoja_('EMPRESAS');
  var datos = datosObjetos_(sh);
  for (var i=0;i<datos.length;i++) {
    if (String(datos[i].empresa_id) === CFG.EMPRESA_ID) {
      return String(datos[i].email_alertas || '').trim();
    }
  }
  return '';
}

function enviarAvisoAuxilioEmail_(trabajador, fechaIso, hora) {
  try {
    var email = obtenerEmailAlertas_();
    if (!email) return;
    MailApp.sendEmail({
      to:email,
      subject:'ALERTA DE AUXILIO · ' + CFG.CENTRO,
      body:
        'Se ha activado un código de auxilio silencioso.\n\n' +
        'Trabajador: ' + trabajador.nombre + '\n' +
        'Fecha: ' + fechaIso + '\n' +
        'Hora: ' + hora + '\n\n' +
        'Comprueba la situación de inmediato según el protocolo de la empresa.'
    });
  } catch (e) {
    registrarLog_('ERROR','email_auxilio',String(e));
  }
}

function fichajesTrabajador_(id) {
  return datosObjetos_(hoja_('FICHAJES')).filter(function(x) {
    return String(x.empresa_id) === CFG.EMPRESA_ID && String(x.trabajador_id) === String(id);
  }).sort(ordenFichajes_);
}

function ultimoFichajeTrabajador_(id) {
  var f = fichajesTrabajador_(id);
  return f.length ? f[f.length-1] : null;
}

function hoja_(nombre) {
  var sh = SpreadsheetApp.openById(CFG.SPREADSHEET_ID).getSheetByName(nombre);
  if (!sh) throw new Error('No existe la pestaña: ' + nombre);
  return sh;
}

function cabeceras_(sh) {
  if (sh.getLastColumn() < 1) return [];
  return sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0].map(function(x){return String(x).trim();});
}

function datosObjetos_(sh) {
  if (sh.getLastRow() < 2 || sh.getLastColumn() < 1) return [];
  var h = cabeceras_(sh);
  return sh.getRange(2,1,sh.getLastRow()-1,sh.getLastColumn()).getValues().map(function(row) {
    var o={}; for(var i=0;i<h.length;i++) o[h[i]]=row[i]; return o;
  });
}

function appendObjeto_(sh, headers, obj) {
  sh.appendRow(headers.map(function(h){return obj.hasOwnProperty(h) ? obj[h] : '';}));
}

function asegurarColumna_(sh,nombre) {
  var h=cabeceras_(sh);
  if (h.indexOf(nombre) < 0) sh.getRange(1,h.length+1).setValue(nombre);
}

function limpiarCodigo_(codigo) {
  return String(codigo || '').replace(/\D/g,'').substring(0,4);
}

function siguienteIdTrabajador_() {
  var max=0;
  listarTrabajadores_().forEach(function(t){
    var m=String(t.trabajador_id || '').match(/(\d+)$/);
    if(m) max=Math.max(max,Number(m[1]));
  });
  return 'TRAB-TB-' + ('000'+(max+1)).slice(-3);
}

function fechaTexto_(v) {
  if (!v) return '';
  if (Object.prototype.toString.call(v) === '[object Date]' && !isNaN(v.getTime()))
    return Utilities.formatDate(v, CFG.TZ, 'yyyy-MM-dd');
  return String(v);
}

/* ======================== DEMO / BACKUP / TEST ======================== */

function prepararPinsDemo() {
  var sh=hoja_('TRABAJADORES'); asegurarColumna_(sh,'codigo');
  var h=cabeceras_(sh), iId=h.indexOf('trabajador_id'), iCod=h.indexOf('codigo');
  var mapa={'TRAB-TB-001':'1001','TRAB-TB-002':'1002','TRAB-TB-003':'1003'};
  if(sh.getLastRow()<2) return;
  var v=sh.getRange(2,1,sh.getLastRow()-1,sh.getLastColumn()).getValues();
  for(var i=0;i<v.length;i++) if(mapa[String(v[i][iId]||'')]) sh.getRange(i+2,iCod+1).setValue(mapa[String(v[i][iId]||'')]);
  Logger.log('PIN demo preparados: 1001, 1002, 1003');
}


function prepararAuxilioDemo() {
  var sh = hoja_('TRABAJADORES');
  asegurarColumna_(sh,'codigo');
  asegurarColumna_(sh,'codigo_auxilio');

  var h = cabeceras_(sh);
  var iId = h.indexOf('trabajador_id');
  var iAux = h.indexOf('codigo_auxilio');
  var mapa = {
    'TRAB-TB-001':'6842',
    'TRAB-TB-002':'3917',
    'TRAB-TB-003':'8254'
  };

  if (sh.getLastRow() >= 2) {
    var v = sh.getRange(2,1,sh.getLastRow()-1,sh.getLastColumn()).getValues();
    for (var i=0;i<v.length;i++) {
      var id = String(v[i][iId] || '');
      if (mapa[id] && !limpiarCodigo_(v[i][iAux])) {
        sh.getRange(i+2,iAux+1).setValue(mapa[id]);
      }
    }
  }

  obtenerHojaAlertas_();

  var emp = hoja_('EMPRESAS');
  asegurarColumna_(emp,'email_alertas');

  var r = {
    ok:true,
    version:CFG.VERSION,
    codigos_auxilio_demo:{
      '1001':'6842',
      '1002':'3917',
      '1003':'8254'
    },
    hoja_alertas:true,
    email_alertas:'Configurable en EMPRESAS'
  };
  Logger.log(JSON.stringify(r));
  return r;
}

function instalarCopiaDiaria() {
  ScriptApp.getProjectTriggers().forEach(function(t){if(t.getHandlerFunction()==='crearCopiaSeguridad') ScriptApp.deleteTrigger(t);});
  ScriptApp.newTrigger('crearCopiaSeguridad').timeBased().everyDays(1).atHour(23).create();
  Logger.log('Copia diaria instalada.');
}

function crearCopiaSeguridad() {
  var archivo=DriveApp.getFileById(CFG.SPREADSHEET_ID), carpeta=obtenerCarpetaBackup_();
  var sello=Utilities.formatDate(new Date(),CFG.TZ,'yyyy-MM-dd_HH-mm');
  var nombre='TODO_BUENO_CONTROL_HORARIO_BACKUP_'+sello;
  archivo.makeCopy(nombre,carpeta);
  registrarLog_('OK','backup','Copia automática creada: '+nombre);
  return nombre;
}

function obtenerCarpetaBackup_() {
  var it=DriveApp.getFoldersByName(CFG.BACKUP_FOLDER);
  return it.hasNext()?it.next():DriveApp.createFolder(CFG.BACKUP_FOLDER);
}

function registrarLog_(estado,accion,detalle) {
  try { hoja_('LOG').appendRow([Utilities.formatDate(new Date(),CFG.TZ,'yyyy-MM-dd HH:mm:ss'),estado,accion,detalle]); }
  catch(e) { Logger.log('No se pudo escribir LOG: '+e); }
}

function testConexion() {
  var ss=SpreadsheetApp.openById(CFG.SPREADSHEET_ID);
  var r={ok:true,version:CFG.VERSION,hoja:ss.getName(),pestanas:ss.getSheets().map(function(s){return s.getName();})};
  Logger.log(JSON.stringify(r)); return r;
}

/* Verificación sin escribir fichajes nuevos. */
function verificarCorrecciones() {
  var trabajadores=listarTrabajadores_();
  var sinCodigo=trabajadores.filter(function(t){return limpiarCodigo_(t.codigo).length!==4;}).length;
  var t1001=buscarTrabajadorPorCodigo_('1001');
  var resumen1001=t1001 ? calcularResumenTrabajador_(t1001) : null;
  var panel=panel_(codigoEmpresaActual_());
  var panelSinCodigo=panel.trabajadores.filter(function(t){return limpiarCodigo_(t.codigo).length!==4;}).length;

  var muestraHoras = [];
  if (t1001) {
    fichajesTrabajador_(t1001.trabajador_id).slice(-10).forEach(function(f) {
      muestraHoras.push({
        tipo:String(f.tipo || ''),
        hora_original:String(f.hora || ''),
        hora_normalizada:normalizarHora_(f.hora),
        fecha_iso:normalizarFechaIso_(f.fecha_iso)
      });
    });
  }

  var r={
    ok:true,
    version:CFG.VERSION,
    trabajadores_sin_codigo_en_datos:sinCodigo,
    trabajadores_sin_codigo_en_panel:panelSinCodigo,
    resumen_1001:resumen1001,
    muestra_horas_1001:muestraHoras,
    total_trabajadores_panel:panel.trabajadores.length,
    proteccion_doble_envio:'request_id + LockService',
    confirmacion_salida_inmediata_segundos:30,
    bloqueo_temporal_segundos:0,
    auxilio_silencioso:true,
    alertas_registradas:listarAlertasAuxilio_(10).length
  };
  Logger.log(JSON.stringify(r)); return r;
}


function detalleTrabajador_(p) {
  if (!esCodigoEmpresa_(p.owner)) return {ok:false,error:'Acceso no autorizado'};

  var codigo = limpiarCodigo_(p.codigo);
  var trabajador = buscarTrabajadorPorCodigo_(codigo);
  if (!trabajador) return {ok:false,error:'Trabajador no encontrado'};

  var periodo = String(p.periodo || 'MES').toUpperCase();
  var hoy = new Date();
  var desde, hasta;

  if (periodo === 'HOY') {
    var iso = Utilities.formatDate(hoy, CFG.TZ, 'yyyy-MM-dd');
    desde = iso; hasta = iso;
  } else if (periodo === 'SEMANA') {
    var dia = Number(Utilities.formatDate(hoy, CFG.TZ, 'u')); // 1 lunes
    var d = new Date(hoy.getTime() - (dia - 1) * 86400000);
    desde = Utilities.formatDate(d, CFG.TZ, 'yyyy-MM-dd');
    hasta = Utilities.formatDate(hoy, CFG.TZ, 'yyyy-MM-dd');
  } else if (periodo === 'RANGO') {
    desde = String(p.desde || '');
    hasta = String(p.hasta || '');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(desde) || !/^\d{4}-\d{2}-\d{2}$/.test(hasta))
      return {ok:false,error:'Indica un rango de fechas válido'};
  } else {
    desde = Utilities.formatDate(hoy, CFG.TZ, 'yyyy-MM-01');
    hasta = Utilities.formatDate(hoy, CFG.TZ, 'yyyy-MM-dd');
  }

  var fichajes = fichajesTrabajador_(trabajador.trabajador_id).filter(function(f) {
    var iso = normalizarFechaIso_(f.fecha_iso || f.fecha);
    return iso >= desde && iso <= hasta;
  });

  fichajes.sort(function(a,b) {
    var ka = normalizarFechaIso_(a.fecha_iso || a.fecha) + ' ' + normalizarHora_(a.hora);
    var kb = normalizarFechaIso_(b.fecha_iso || b.fecha) + ' ' + normalizarHora_(b.hora);
    return kb.localeCompare(ka);
  });

  return {
    ok:true,
    trabajador:{
      codigo:codigo,
      nombre:trabajador.nombre,
      horas_contrato:Number(trabajador.horas_contrato_semana || trabajador.horas_contrato || 0),
      activo:String(trabajador.activo).toUpperCase()==='SI'
    },
    periodo:periodo,
    desde:desde,
    hasta:hasta,
    marcajes:fichajes.map(function(f) {
      return {
        fecha:normalizarFechaIso_(f.fecha_iso || f.fecha),
        hora:normalizarHora_(f.hora),
        tipo:String(f.tipo || '')
      };
    })
  };
}

function configSeguridad_(p) {
  if (!esCodigoEmpresa_(p.owner)) return {ok:false,error:'Acceso no autorizado'};

  var codigoEmpresa = limpiarCodigo_(p.codigo_empresa);
  var codigoAuxilio = limpiarCodigo_(p.codigo_auxilio_empresa);
  var email = String(p.email_alertas || '').trim();

  if (codigoEmpresa && codigoEmpresa.length !== 4)
    return {ok:false,error:'El código de empresa debe tener 4 cifras'};
  if (codigoAuxilio.length !== 4)
    return {ok:false,error:'El código de auxilio de empresa debe tener 4 cifras'};
  if (codigoEmpresa && codigoEmpresa === codigoAuxilio)
    return {ok:false,error:'El código normal y el de auxilio deben ser distintos'};
  if (codigoEmpresa && codigoEnUso_(codigoEmpresa) && codigoEmpresa !== codigoEmpresaActual_())
    return {ok:false,error:'El nuevo código de empresa ya está utilizado'};
  if (codigoEnUso_(codigoAuxilio))
    return {ok:false,error:'El código de auxilio ya está utilizado'};

  var sh = hoja_('EMPRESAS');
  asegurarColumna_(sh,'codigo_empresa');
  asegurarColumna_(sh,'codigo_auxilio_empresa');
  asegurarColumna_(sh,'email_alertas');

  var h = cabeceras_(sh);
  var datos = sh.getRange(2,1,Math.max(1,sh.getLastRow()-1),sh.getLastColumn()).getValues();
  var idxEmpresa = h.indexOf('empresa_id');
  var fila = -1;
  for (var i=0;i<datos.length;i++) {
    if (String(datos[i][idxEmpresa]) === CFG.EMPRESA_ID) { fila=i+2; break; }
  }
  if (fila < 0) return {ok:false,error:'Empresa no encontrada'};

  if (codigoEmpresa) sh.getRange(fila,h.indexOf('codigo_empresa')+1).setValue(codigoEmpresa);
  sh.getRange(fila,h.indexOf('codigo_auxilio_empresa')+1).setValue(codigoAuxilio);
  sh.getRange(fila,h.indexOf('email_alertas')+1).setValue(email);

  registrarLog_('CONFIG','seguridad_empresa','Configuración de seguridad actualizada');
  return {ok:true,mensaje:'Seguridad actualizada correctamente',owner:codigoEmpresa || codigoEmpresaActual_()};
}


function registrarCalendario_(p) {
  if (!esCodigoEmpresa_(p.owner)) return {ok:false,error:'Acceso no autorizado'};

  var tipo = String(p.tipo || '').toUpperCase();
  if (['VACACIONES','BAJA','AUSENCIA','FESTIVO'].indexOf(tipo) < 0)
    return {ok:false,error:'Tipo no válido'};

  var desde = String(p.desde || '');
  var hasta = String(p.hasta || desde);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(desde) || !/^\d{4}-\d{2}-\d{2}$/.test(hasta))
    return {ok:false,error:'Fechas no válidas'};
  if (hasta < desde) return {ok:false,error:'La fecha Hasta no puede ser anterior a Desde'};

  var trabajadorId = '';
  if (tipo !== 'FESTIVO') {
    var t = buscarTrabajadorPorCodigo_(limpiarCodigo_(p.codigo));
    if (!t) return {ok:false,error:'Trabajador no encontrado'};
    trabajadorId = String(t.trabajador_id);
  }

  var sh = hoja_('CALENDARIO');
  ['empresa_id','trabajador_id','calendario_id','tipo','descripcion','fecha_desde','fecha_hasta','computa_horas','observaciones','actualizado']
    .forEach(function(c){asegurarColumna_(sh,c)});

  var h = cabeceras_(sh);
  appendObjeto_(sh,h,{
    empresa_id:CFG.EMPRESA_ID,
    trabajador_id:trabajadorId,
    calendario_id:'CAL-'+Utilities.getUuid(),
    tipo:tipo,
    descripcion:String(p.descripcion || ''),
    fecha_desde:desde,
    fecha_hasta:hasta,
    computa_horas:'NO',
    observaciones:'',
    actualizado:Utilities.formatDate(new Date(),CFG.TZ,'yyyy-MM-dd HH:mm:ss')
  });

  registrarLog_('CALENDARIO','alta',tipo+' '+desde+' '+hasta+(trabajadorId?' · '+trabajadorId:''));
  return {ok:true};
}

function resumenMensualTrabajador_(p) {
  if (!esCodigoEmpresa_(p.owner)) return {ok:false,error:'Acceso no autorizado'};

  var trabajador = buscarTrabajadorPorCodigo_(limpiarCodigo_(p.codigo));
  if (!trabajador) return {ok:false,error:'Trabajador no encontrado'};

  var mes = String(p.mes || Utilities.formatDate(new Date(),CFG.TZ,'yyyy-MM'));
  if (!/^\d{4}-\d{2}$/.test(mes)) return {ok:false,error:'Mes no válido'};

  var inicio = mes + '-01';
  var partes = mes.split('-');
  var y = Number(partes[0]), m = Number(partes[1]);
  var ultimoDia = new Date(y, m, 0).getDate();
  var fin = mes + '-' + ('0'+ultimoDia).slice(-2);

  var fichajes = fichajesTrabajador_(trabajador.trabajador_id).filter(function(f){
    var iso = normalizarFechaIso_(f.fecha_iso || f.fecha);
    return iso >= inicio && iso <= fin;
  });

  var calendario = datosObjetos_(hoja_('CALENDARIO')).filter(function(c){
    if (String(c.empresa_id) !== CFG.EMPRESA_ID) return false;
    var tipo = String(c.tipo || '').toUpperCase();
    var esEmpresa = tipo === 'FESTIVO' && !String(c.trabajador_id || '');
    var esTrabajador = String(c.trabajador_id || '') === String(trabajador.trabajador_id);
    if (!esEmpresa && !esTrabajador) return false;
    var d = normalizarFechaIso_(c.fecha_desde);
    var h = normalizarFechaIso_(c.fecha_hasta || c.fecha_desde);
    return h >= inicio && d <= fin;
  });

  var porDia = {};
  fichajes.forEach(function(f){
    var iso = normalizarFechaIso_(f.fecha_iso || f.fecha);
    if (!porDia[iso]) porDia[iso] = {marcajes:[],eventos:[]};
    porDia[iso].marcajes.push({hora:normalizarHora_(f.hora),tipo:String(f.tipo || '')});
  });

  function fechaMasDias_(iso, dias) {
    var a=iso.split('-');
    var d=new Date(Number(a[0]),Number(a[1])-1,Number(a[2])+dias);
    return Utilities.formatDate(d,CFG.TZ,'yyyy-MM-dd');
  }

  calendario.forEach(function(c){
    var desde=normalizarFechaIso_(c.fecha_desde);
    var hasta=normalizarFechaIso_(c.fecha_hasta || c.fecha_desde);
    if (desde < inicio) desde=inicio;
    if (hasta > fin) hasta=fin;
    var cur=desde, guard=0;
    while(cur <= hasta && guard < 40){
      if (!porDia[cur]) porDia[cur]={marcajes:[],eventos:[]};
      porDia[cur].eventos.push({tipo:String(c.tipo || '').toUpperCase(),descripcion:String(c.descripcion || '')});
      cur=fechaMasDias_(cur,1); guard++;
    }
  });

  function minutosDia_(marcas){
    marcas.sort(function(a,b){return a.hora.localeCompare(b.hora)});
    var total=0, entrada=null;
    marcas.forEach(function(x){
      if (x.tipo==='ENTRADA' && entrada===null) entrada=x.hora;
      else if (x.tipo==='SALIDA' && entrada!==null){
        var e=entrada.split(':'), s=x.hora.split(':');
        var em=Number(e[0])*60+Number(e[1]), sm=Number(s[0])*60+Number(s[1]);
        if (sm>=em) total += sm-em;
        entrada=null;
      }
    });
    return total;
  }

  function fmtMin_(min){
    min=Math.max(0,Number(min||0));
    return Math.floor(min/60)+':'+('0'+(min%60)).slice(-2);
  }

  var resumen={horas_trabajadas:'0:00',dias_trabajados:0,vacaciones:0,baja:0,festivos:0,ausencias:0};
  var minutosMes=0, dias=[];

  Object.keys(porDia).sort().forEach(function(fecha){
    var d=porDia[fecha];
    var min=minutosDia_(d.marcajes);
    if (min>0){minutosMes+=min;resumen.dias_trabajados++;}

    var tipos=d.eventos.map(function(e){return e.tipo;});
    if (tipos.indexOf('VACACIONES')>=0) resumen.vacaciones++;
    if (tipos.indexOf('BAJA')>=0) resumen.baja++;
    if (tipos.indexOf('FESTIVO')>=0) resumen.festivos++;
    if (tipos.indexOf('AUSENCIA')>=0) resumen.ausencias++;

    var situacion='Sin marcaje';
    if (tipos.indexOf('VACACIONES')>=0) situacion='Vacaciones';
    else if (tipos.indexOf('BAJA')>=0) situacion='Baja';
    else if (tipos.indexOf('FESTIVO')>=0) situacion='Festivo';
    else if (tipos.indexOf('AUSENCIA')>=0) situacion='Ausencia';
    else if (d.marcajes.length) situacion='Trabajado';

    dias.push({
      fecha:fecha,
      situacion:situacion,
      marcajes:d.marcajes,
      total:fmtMin_(min)
    });
  });

  resumen.horas_trabajadas=fmtMin_(minutosMes);
  return {ok:true,mes:mes,resumen:resumen,dias:dias};
}