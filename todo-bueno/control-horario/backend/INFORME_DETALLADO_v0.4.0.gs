/*
 * TODO BUENO · CONTROL HORARIO · BÁSICA v0.4.0
 * Ampliación del informe de fichajes: detalle diario por trabajador.
 *
 * Añadir como archivo .gs al proyecto de Apps Script.
 * Sustituye la función informe_ existente en tiempo de ejecución.
 */

informe_ = function(p) {
  var cfgEmpresa = configEmpresa_();
  if (!configCoincideOwner_(cfgEmpresa, p.owner)) {
    return {ok:false,error:'Acceso no autorizado'};
  }

  var desde = String(p.desde || '');
  var hasta = String(p.hasta || '');
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

    var todos = porTrab[String(t.trabajador_id)] || [];
    var periodo = todos.filter(function(f) {
      var fi = normalizarFechaIso_(f.fecha_iso);
      return fi && fi >= desde && fi <= hasta;
    }).sort(ordenFichajes_);

    var porDia = {};
    periodo.forEach(function(f) {
      var fi = normalizarFechaIso_(f.fecha_iso);
      if (!porDia[fi]) porDia[fi] = [];
      porDia[fi].push(f);
    });

    var dias = Object.keys(porDia).sort().map(function(fechaIso) {
      var fichajesDia = porDia[fechaIso].sort(ordenFichajes_);
      var marcajes = fichajesDia.map(function(f) {
        return {
          tipo:String(f.tipo || '').toUpperCase(),
          hora:normalizarHora_(f.hora)
        };
      });

      return {
        fecha_iso:fechaIso,
        fecha:fechaIso.split('-').reverse().join('/'),
        marcajes:marcajes,
        total:formatoMinutos_(totalMinutos_(fichajesDia, fechaIso, fechaIso))
      };
    });

    salida.push({
      codigo:codigo,
      trabajador_id:t.trabajador_id,
      nombre:t.nombre,
      activo:String(t.activo || '').toUpperCase() === 'SI',
      total:formatoMinutos_(totalMinutos_(periodo, desde, hasta)),
      dias:dias
    });
  });

  return {
    ok:true,
    desde:desde,
    hasta:hasta,
    modo:'DETALLADO',
    trabajadores:salida
  };
};
