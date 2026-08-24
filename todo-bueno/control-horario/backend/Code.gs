var CFG = {
  VERSION: '0.2.1',
  SPREADSHEET_ID: '1ShVF1jKQal-jlErDwY8_ugfpH5d1oX2JUNGvfX5a2hc',
  EMPRESA_ID: 'EMP-TODOBUENO-PILOTO',
  CENTRO_ID: 'CENTRO-TB-001',
  TZ: 'Europe/Madrid',
  OWNER_CODE: '7826',
  BACKUP_FOLDER: 'SINCRONIAIA_BACKUPS_TODO_BUENO'
};

function doGet(e) {
  try {
    var p = (e && e.parameter) || {};
    var action = p.action || 'ping';
    var result;

    if (action === 'ping') result = {ok:true,version:CFG.VERSION,servicio:'TODO BUENO CONTROL HORARIO'};
    else if (action === 'fichar') result = ficharPorCodigo_(p.codigo);
    else if (action === 'resumen') result = resumenPorCodigo_(p.codigo);
    else if (action === 'panel') result = panelEmpresa_(p.owner);
    else if (action === 'crearTrabajador') result = crearTrabajador_(p.owner,p.codigo,p.nombre,p.horas,p.desde,p.hasta,p.activo);
    else if (action === 'informe') result = informe_(p.owner,p.desde,p.hasta,p.codigo || '');
    else result = {ok:false,error:'Acción no válida'};

    return output_(result,p.callback);
  } catch (err) {
    return output_({ok:false,error:String(err)}, e && e.parameter ? e.parameter.callback : '');
  }
}

function doPost(e) {
  try {
    var body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    return output_({ok:true,recibido:body},'');
  } catch (err) {
    return output_({ok:false,error:String(err)},'');
  }
}

function output_(obj, callback) {
  var text = JSON.stringify(obj);
  if (callback) {
    return ContentService.createTextOutput(callback + '(' + text + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(text).setMimeType(ContentService.MimeType.JSON);
}

function ss_(){ return SpreadsheetApp.openById(CFG.SPREADSHEET_ID); }
function sh_(name){ var s=ss_().getSheetByName(name); if(!s) throw new Error('Falta la hoja '+name); return s; }
function now_(){ var d=new Date(); return {d:d,fecha:Utilities.formatDate(d,CFG.TZ,'dd/MM/yyyy'),iso:Utilities.formatDate(d,CFG.TZ,'yyyy-MM-dd'),hora:Utilities.formatDate(d,CFG.TZ,'HH:mm')}; }
function fmt_(m){ var sign=m<0?'-':''; m=Math.abs(Math.round(m)); return sign+Math.floor(m/60)+':'+('0'+(m%60)).slice(-2); }
function min_(hhmm){ var p=String(hhmm).split(':'); return Number(p[0])*60+Number(p[1]); }
function diff_(a,b){ var d=min_(b)-min_(a); return d<0?d+1440:d; }

function ensurePinColumn_(){
  var sh=sh_('TRABAJADORES'), last=sh.getLastColumn(), h=sh.getRange(1,1,1,last).getDisplayValues()[0], ix=h.indexOf('pin');
  if(ix<0){ sh.getRange(1,last+1).setValue('pin'); ix=last; }
  return ix;
}

function trabajadores_(){
  var sh=sh_('TRABAJADORES'), pinIx=ensurePinColumn_(), rows=sh.getDataRange().getDisplayValues(), h=rows[0], out=[], i;
  for(i=1;i<rows.length;i++){
    if(rows[i][h.indexOf('empresa_id')]!==CFG.EMPRESA_ID) continue;
    out.push({
      row:i+1,
      trabajador_id:rows[i][h.indexOf('trabajador_id')],
      codigo:rows[i][pinIx],
      nombre:rows[i][h.indexOf('nombre')],
      horas:Number(rows[i][h.indexOf('horas_contrato_semana')]||0),
      activo:String(rows[i][h.indexOf('activo')]).toUpperCase(),
      desde:rows[i][h.indexOf('vigente_desde')],
      hasta:rows[i][h.indexOf('vigente_hasta')]
    });
  }
  return out;
}

function findCodigo_(codigo){
  var t=trabajadores_(),i;
  codigo=String(codigo||'');
  for(i=0;i<t.length;i++) if(t[i].codigo===codigo) return t[i];
  return null;
}

function fichajes_(trabajadorId){
  var sh=sh_('FICHAJES'), rows=sh.getDataRange().getDisplayValues(); if(rows.length<2) return [];
  var h=rows[0], out=[],i,r;
  for(i=1;i<rows.length;i++){
    r=rows[i];
    if(r[h.indexOf('empresa_id')]!==CFG.EMPRESA_ID) continue;
    if(trabajadorId && r[h.indexOf('trabajador_id')]!==trabajadorId) continue;
    out.push({fecha:r[h.indexOf('fecha')],fecha_iso:r[h.indexOf('fecha_iso')],tipo:r[h.indexOf('tipo')],hora:r[h.indexOf('hora')],nombre:r[h.indexOf('nombre')],trabajador_id:r[h.indexOf('trabajador_id')]});
  }
  out.sort(function(a,b){ var aa=a.fecha_iso+' '+a.hora,bb=b.fecha_iso+' '+b.hora; return aa<bb?-1:aa>bb?1:0; });
  return out;
}

function minutosDia_(arr){ var total=0,ent=null,i; for(i=0;i<arr.length;i++){ if(arr[i].tipo==='ENTRADA') ent=arr[i].hora; else if(arr[i].tipo==='SALIDA'&&ent){ total+=diff_(ent,arr[i].hora); ent=null; } } return total; }
function totalRango_(f,desde,hasta){ var por={},i,key,total=0; for(i=0;i<f.length;i++){ if(desde&&f[i].fecha_iso<desde) continue; if(hasta&&f[i].fecha_iso>hasta) continue; key=f[i].fecha_iso; if(!por[key])por[key]=[]; por[key].push(f[i]); } for(key in por) if(por.hasOwnProperty(key)) total+=minutosDia_(por[key]); return total; }

function resumenTrabajador_(t){
  var f=fichajes_(t.trabajador_id), n=now_(), d=n.d, dow=(d.getDay()+6)%7, lunes=new Date(d), mesInicio=new Date(d.getFullYear(),d.getMonth(),1), ultimo=f.length?f[f.length-1]:null;
  lunes.setDate(d.getDate()-dow);
  var desdeSemana=Utilities.formatDate(lunes,CFG.TZ,'yyyy-MM-dd'), desdeMes=Utilities.formatDate(mesInicio,CFG.TZ,'yyyy-MM-dd');
  return {
    codigo:t.codigo,nombre:t.nombre,horas_contrato:t.horas,
    estado:ultimo&&ultimo.tipo==='ENTRADA'?'TRABAJANDO':'FUERA',
    hoy:fmt_(totalRango_(f,n.iso,n.iso)),
    semana:fmt_(totalRango_(f,desdeSemana,n.iso)),
    mes:fmt_(totalRango_(f,desdeMes,n.iso))
  };
}

function ficharPorCodigo_(codigo){
  codigo=String(codigo||'');
  if(codigo===CFG.OWNER_CODE) return {ok:true,rol:'EMPRESA'};
  var t=findCodigo_(codigo); if(!t||t.activo!=='SI') return {ok:false,error:'Código no válido'};
  var n=now_(), f=fichajes_(t.trabajador_id), hoy=[],i; for(i=0;i<f.length;i++) if(f[i].fecha_iso===n.iso) hoy.push(f[i]);
  var tipo=(hoy.length&&hoy[hoy.length-1].tipo==='ENTRADA')?'SALIDA':'ENTRADA';
  var sh=sh_('FICHAJES'), h=sh.getRange(1,1,1,sh.getLastColumn()).getDisplayValues()[0], row=[];
  row[h.indexOf('fichaje_id')]='F-'+Utilities.getUuid(); row[h.indexOf('empresa_id')]=CFG.EMPRESA_ID; row[h.indexOf('trabajador_id')]=t.trabajador_id; row[h.indexOf('nombre')]=t.nombre; row[h.indexOf('fecha')]=n.fecha; row[h.indexOf('fecha_iso')]=n.iso; row[h.indexOf('tipo')]=tipo; row[h.indexOf('hora')]=n.hora; row[h.indexOf('centro_id')]=CFG.CENTRO_ID; row[h.indexOf('centro')]='Centro principal'; row[h.indexOf('gps_estado')]='NO_USADO'; row[h.indexOf('creado')]=Utilities.formatDate(n.d,CFG.TZ,'yyyy-MM-dd HH:mm'); sh.appendRow(row);
  log_('OK','fichaje',t.trabajador_id+' · '+tipo+' · '+n.hora);
  return {ok:true,rol:'TRABAJADOR',tipo:tipo,hora:n.hora,resumen:resumenTrabajador_(t)};
}

function resumenPorCodigo_(codigo){ var t=findCodigo_(codigo); if(!t) return {ok:false,error:'Código no válido'}; return {ok:true,resumen:resumenTrabajador_(t)}; }

function authOwner_(owner){ if(String(owner||'')!==CFG.OWNER_CODE) throw new Error('Acceso no autorizado'); }
function panelEmpresa_(owner){ authOwner_(owner); var t=trabajadores_(),out=[],i; for(i=0;i<t.length;i++) if(t[i].activo==='SI') out.push(resumenTrabajador_(t[i])); return {ok:true,trabajadores:out}; }

function crearTrabajador_(owner,codigo,nombre,horas,desde,hasta,activo){
  authOwner_(owner); codigo=String(codigo||'').replace(/\D/g,''); nombre=String(nombre||'').trim(); horas=Number(horas);
  if(codigo.length!==4||!nombre||!horas) return {ok:false,error:'Faltan datos obligatorios'};
  if(codigo===CFG.OWNER_CODE) return {ok:false,error:'Código reservado'};
  if(findCodigo_(codigo)) return {ok:false,error:'El código ya existe'};
  var sh=sh_('TRABAJADORES'), pinIx=ensurePinColumn_(), rows=sh.getDataRange().getDisplayValues(), h=rows[0], n=1,id='',i,exists,row=[];
  while(true){ id='TRAB-TB-'+('000'+n).slice(-3); exists=false; for(i=1;i<rows.length;i++) if(rows[i][h.indexOf('trabajador_id')]===id){exists=true;break;} if(!exists)break; n++; }
  row[h.indexOf('empresa_id')]=CFG.EMPRESA_ID; row[h.indexOf('trabajador_id')]=id; row[h.indexOf('nombre')]=nombre; row[h.indexOf('horas_contrato_semana')]=horas; row[h.indexOf('vigente_desde')]=desde||Utilities.formatDate(new Date(),CFG.TZ,'yyyy-MM-dd'); row[h.indexOf('vigente_hasta')]=hasta||''; row[h.indexOf('activo')]=(activo||'SI').toUpperCase(); row[h.indexOf('observaciones')]=''; row[h.indexOf('actualizado')]=Utilities.formatDate(new Date(),CFG.TZ,'dd/MM/yyyy'); row[pinIx]=codigo; sh.appendRow(row);
  log_('OK','crear_trabajador',id+' · '+nombre+' · '+codigo);
  return {ok:true,trabajador_id:id,codigo:codigo};
}

function informe_(owner,desde,hasta,codigo){
  authOwner_(owner); var t=trabajadores_(),out=[],i,r,f;
  for(i=0;i<t.length;i++){
    if(codigo&&t[i].codigo!==codigo) continue;
    f=fichajes_(t[i].trabajador_id); r=totalRango_(f,desde||'',hasta||'');
    out.push({codigo:t[i].codigo,nombre:t[i].nombre,total:fmt_(r)});
  }
  return {ok:true,desde:desde||'',hasta:hasta||'',trabajadores:out};
}

function instalarCopiaDiaria(){
  var triggers=ScriptApp.getProjectTriggers(),i; for(i=0;i<triggers.length;i++) if(triggers[i].getHandlerFunction()==='crearCopiaSeguridad') ScriptApp.deleteTrigger(triggers[i]);
  ScriptApp.newTrigger('crearCopiaSeguridad').timeBased().everyDays(1).atHour(23).nearMinute(59).create();
  return 'Copia diaria instalada';
}

function crearCopiaSeguridad(){
  var folders=DriveApp.getFoldersByName(CFG.BACKUP_FOLDER), folder=folders.hasNext()?folders.next():DriveApp.createFolder(CFG.BACKUP_FOLDER), file=DriveApp.getFileById(CFG.SPREADSHEET_ID), stamp=Utilities.formatDate(new Date(),CFG.TZ,'yyyy-MM-dd_HHmm');
  file.makeCopy('TODO_BUENO_CONTROL_HORARIO_BACKUP_'+stamp,folder); log_('OK','backup','Copia automática '+stamp);
}

function prepararPinsDemo(){
  var sh=sh_('TRABAJADORES'), pinIx=ensurePinColumn_(), t=trabajadores_(), demos=['1001','1002','1003'],i;
  for(i=0;i<t.length&&i<demos.length;i++) if(!t[i].codigo) sh.getRange(t[i].row,pinIx+1).setValue(demos[i]);
  return 'PIN demo preparados';
}

function log_(nivel,accion,detalle){ sh_('LOG').appendRow([Utilities.formatDate(new Date(),CFG.TZ,'yyyy-MM-dd HH:mm:ss'),nivel,accion,detalle]); }

function testConexion(){ var ss=ss_(); Logger.log(JSON.stringify({ok:true,hoja:ss.getName(),version:CFG.VERSION})); }
