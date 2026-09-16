/* SINCRONIAIA TPV · LAB FUSIÓN
   Seguridad de intentos v2
   - Empresa: 5 fallos -> bloqueo 2 min.
   - Vendedor: 5 fallos -> bloqueo individual 15 s.
   - Mensaje visible de intento X de 5.
   - Contador por código de vendedor.
*/
(function(){
  'use strict';

  var KEY='sincroniaia_fusion_security_attempts_v2';
  var EMP_MAX=5, EMP_LOCK=120000;
  var SELL_MAX=5, SELL_LOCK=15000;

  function read(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(e){return {}}}
  function write(s){try{localStorage.setItem(KEY,JSON.stringify(s))}catch(e){}}
  function clean(r){
    r=r||{fails:0,until:0};
    if(Number(r.until||0)>0 && Number(r.until)<=Date.now()){r.fails=0;r.until=0}
    return r;
  }
  function getEmp(){var s=read();s.emp=clean(s.emp);write(s);return s.emp}
  function setEmp(r){var s=read();s.emp=r;write(s)}
  function getSeller(code){var s=read(),k=String(code||'').trim();s.sell=s.sell||{};s.sell[k]=clean(s.sell[k]);write(s);return s.sell[k]}
  function setSeller(code,r){var s=read(),k=String(code||'').trim();s.sell=s.sell||{};s.sell[k]=r;write(s)}
  function left(until){return Math.max(1,Math.ceil((Number(until||0)-Date.now())/1000))}
  function clearInput(id){var f=document.getElementById(id);if(f){f.value='';setTimeout(function(){try{f.focus()}catch(e){}},0)}}
  function findByCode(code){return (typeof sellers!=='undefined'&&Array.isArray(sellers))?sellers.find(function(x){return String(x.code)===String(code)}):null}
  function findByName(name){return (typeof sellers!=='undefined'&&Array.isArray(sellers))?sellers.find(function(x){return String(x.name)===String(name)}):null}

  function sellerFail(code,inputId){
    var r=getSeller(code);
    if(Number(r.until||0)>Date.now()){
      clearInput(inputId);
      alert('Este vendedor está bloqueado. Espera '+left(r.until)+' segundos.');
      return {blocked:true};
    }
    r.fails=Number(r.fails||0)+1;
    if(r.fails>=SELL_MAX){
      r.fails=SELL_MAX;r.until=Date.now()+SELL_LOCK;setSeller(code,r);clearInput(inputId);
      alert('5 intentos incorrectos. Vendedor bloqueado durante 15 segundos.');
      return {blocked:true};
    }
    setSeller(code,r);clearInput(inputId);
    alert('Código o PIN incorrecto. Intento '+r.fails+' de 5.');
    return {blocked:false};
  }
  function sellerGate(code,inputId,pin){
    var r=getSeller(code);
    if(Number(r.until||0)>Date.now()){
      clearInput(inputId);alert('Este vendedor está bloqueado. Espera '+left(r.until)+' segundos.');return {ok:false,blocked:true,s:null};
    }
    var s=findByCode(code);
    if(!s || String(s.pin||'')!==String(pin||'')){
      sellerFail(code,inputId);return {ok:false,blocked:false,s:s};
    }
    setSeller(code,{fails:0,until:0});
    return {ok:true,blocked:false,s:s};
  }

  function install(){
    if(window.__fusionSecurityAttemptsV2)return;
    if(typeof loginSeller!=='function' || typeof checkEmpresaCode!=='function'){return setTimeout(install,100)}
    window.__fusionSecurityAttemptsV2=true;

    var baseTryEmpresaCode=window.tryEmpresaCode;
    window.tryEmpresaCode=function(){
      var r=getEmp();
      if(Number(r.until||0)>Date.now())return;
      var f=document.getElementById('adminCodeInput');
      if(f && String(f.value)===String(company.adminCode||'')){setEmp({fails:0,until:0})}
      return baseTryEmpresaCode.apply(this,arguments);
    };

    window.checkEmpresaCode=function(){
      var r=getEmp(),f=document.getElementById('adminCodeInput');
      if(Number(r.until||0)>Date.now()){
        clearInput('adminCodeInput');alert('Acceso Empresa bloqueado. Espera '+left(r.until)+' segundos.');return;
      }
      if(f && String(f.value)===String(company.adminCode||'')){
        setEmp({fails:0,until:0});closeModal();role='empresa';screen='empresa';adminTab='menu';render();return;
      }
      r.fails=Number(r.fails||0)+1;
      if(r.fails>=EMP_MAX){r.fails=EMP_MAX;r.until=Date.now()+EMP_LOCK;setEmp(r);clearInput('adminCodeInput');alert('5 intentos incorrectos. Acceso Empresa bloqueado durante 2 minutos.');return}
      setEmp(r);clearInput('adminCodeInput');alert('Código Empresa incorrecto. Intento '+r.fails+' de 5.');
    };

    window.loginSeller=function(){
      var code=(document.getElementById('sellerCodeLogin')?.value||'').trim();
      var pin=document.getElementById('sellerPinLogin')?.value||'';
      var g=sellerGate(code,'sellerPinLogin',pin);if(!g.ok)return;
      var s=g.s;
      if(s.enabled===false){clearInput('sellerPinLogin');return alert('Este vendedor no tiene acceso habilitado. Contacta con Empresa.')}
      s.active=true;if(!s.loginAt)s.loginAt=Date.now();ensureMems();save();closeModal();render();
    };

    if(typeof quickConfirmSeller==='function')window.quickConfirmSeller=function(code){
      var pin=document.getElementById('quickSellerPin')?.value||'';var g=sellerGate(code,'quickSellerPin',pin);if(!g.ok)return;var s=g.s;
      if(s.enabled===false)return alert('Este vendedor no tiene acceso habilitado. Contacta con Empresa.');
      s.active=true;if(!s.loginAt)s.loginAt=Date.now();sellerMems[s.name]=sellerMems[s.name]||[];save();saveLineToSeller(s.name);
    };

    if(typeof vnConfirmSeller==='function')window.vnConfirmSeller=function(code){
      var pin=document.getElementById('vnSellerPin')?.value||'';var g=sellerGate(code,'vnSellerPin',pin);if(!g.ok)return;var s=g.s;
      if(s.enabled===false)return alert('Este vendedor no tiene acceso habilitado. Contacta con Empresa.');
      s.active=true;if(!s.loginAt)s.loginAt=Date.now();sellerMems[s.name]=sellerMems[s.name]||[];save();saveLineToSeller(s.name);
    };

    if(typeof openMyActivity==='function')window.openMyActivity=function(name){
      var s=findByName(name),f=document.getElementById('activityPin'),code=s?s.code:name,pin=f?.value||'';
      var g=sellerGate(code,'activityPin',pin);if(!g.ok)return;
      if(!s||!s.active){clearInput('activityPin');return alert('Sesión de vendedor no iniciada.')}
      var d=sellerActivityData(name),individual=company.cashMode==='individual';
      modal(`<div id="personalX"><h2>Mi actividad · ${esc(name)}</h2><p class="muted">Desde ${new Date(d.since).toLocaleString('es-ES')}</p><div class="totals"><div><span>Tickets</span><b>${d.count}</b></div><div><span>Efectivo</span><b>${euro(d.cash)}</b></div><div><span>Tarjeta</span><b>${euro(d.card)}</b></div><div><span>Bizum</span><b>${euro(d.bizum)}</b></div><div><span>Mixto</span><b>${euro(d.mixed)}</b></div><div><span>Devoluciones / rectificaciones</span><b>${euro(d.returns)}</b></div><div class="final"><span>VENTA NETA PERSONAL</span><b>${euro(d.total)}</b></div></div>${company.cashMode==='shared'?'<p class="warn"><b>Caja compartida:</b> estos datos identifican ventas registradas, pero cualquier diferencia de efectivo pertenece al cajón común.</p>':individual?`<div class="panel"><h3>Cuadre individual</h3><p>Efectivo esperado por ventas: <b>${euro(d.cash+d.returns)}</b></p><label>Efectivo contado</label><input id="personalCashCount" type="number" step="0.01"><button onclick="showPersonalDifference(${d.cash+d.returns})">Calcular diferencia</button><h3 id="personalCashDifference"></h3></div>`:'<p class="notice">Configuración mixta: el responsable debe indicar si este vendedor utiliza cajón propio o compartido.</p>'}<h3>Tickets del periodo</h3>${d.list.map(t=>`<div class="line"><div><b>Nº ${esc(t.number)}</b><br><small>${esc(t.date)} · ${esc(t.method)}</small></div><b>${euro(t.total)}</b></div>`).join('')||'<p>Sin ventas cerradas en esta sesión.</p>'}</div><p><button class="primary" onclick="window.print()">Imprimir X personal</button> <button onclick="closeModal()">Cerrar</button></p>`);
    };
  }
  install();
})();