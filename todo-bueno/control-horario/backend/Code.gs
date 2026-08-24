var CFG = {
  VERSION: '0.2.0',
  SPREADSHEET_ID: '1ShVF1jKQal-jlErDwY8_ugfpH5d1oX2JUNGvfX5a2hc',
  EMPRESA_ID: 'EMP-TODOBUENO-PILOTO',
  TZ: 'Europe/Madrid',
  OWNER_CODE: '7826'
};

/*
  BACKEND REAL TODO BUENO v0.2.0
  Este archivo se despliega como Web App de Apps Script.
  La interfaz pública de GitHub se conecta después pegando la URL /exec en config.js.
*/

function doGet(e) {
  return json_({ok:true, version:CFG.VERSION, servicio:'TODO BUENO CONTROL HORARIO'});
}

function doPost(e) {
  try {
    var body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    var action = body.action || '';
    if (action === 'ping') return json_({ok:true,version:CFG.VERSION});
    return json_({ok:false,error:'Acción no implementada todavía: '+action});
  } catch (err) {
    return json_({ok:false,error:String(err)});
  }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function testConexion() {
  var ss = SpreadsheetApp.openById(CFG.SPREADSHEET_ID);
  var nombres = ss.getSheets().map(function(s){return s.getName();});
  Logger.log(JSON.stringify({ok:true,hoja:ss.getName(),pestanas:nombres}));
}
