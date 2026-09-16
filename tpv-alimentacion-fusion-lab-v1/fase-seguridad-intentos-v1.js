/* SINCRONIAIA TPV · LAB FUSIÓN
   Seguridad de intentos de acceso
   - Empresa: 5 intentos incorrectos -> bloqueo 2 min.
   - Vendedor: 5 intentos incorrectos -> bloqueo individual 15 s.
   - Un acceso correcto reinicia el contador.
   - No cierra ventas ni afecta a otros vendedores.
*/
(function(){
  'use strict';

  const STORAGE_KEY='sincroniaia_fusion_security_attempts_v1';
  const EMPRESA_MAX=5;
  const EMPRESA_LOCK_MS=2*60*1000;
  const SELLER_MAX=5;
  const SELLER_LOCK_MS=15*1000;

  function load(){
    try{
      const v=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');
      return v&&typeof v==='object'?v:{};
    }catch(e){return {}}
  }
  function save(v){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(v))}catch(e){}}
  function state(){
    const s=load();
    if(!s.empresa)s.empresa={fails:0,lockedUntil:0};
    if(!s.sellers)s.sellers={};
    return s;
  }
  function now(){return Date.now()}
  function secondsLeft(until){return Math.max(0,Math.ceil((Number(until||0)-now())/1000))}
  function normalize(rec){
    rec=rec||{fails:0,lockedUntil:0};
    if(Number(rec.lockedUntil||0)<=now() && Number(rec.lockedUntil||0)>0){
      rec.fails=0;rec.lockedUntil=0;
    }
    return rec;
  }
  function sellerKey(codeOrName){return String(codeOrName||'').trim().toLowerCase()||'desconocido'}

  function empresaRec(){
    const s=state();s.empresa=normalize(s.empresa);save(s);return s.empresa;
  }
  function empresaLocked(){const r=empresaRec();return Number(r.lockedUntil||0)>now()?r:null}
  function resetEmpresa(){const s=state();s.empresa={fails:0,lockedUntil:0};save(s)}
  function failEmpresa(){
    const s=state();const r=normalize(s.empresa||{});r.fails=Number(r.fails||0)+1;
    let locked=false;
    if(r.fails>=EMPRESA_MAX){r.fails=EMPRESA_MAX;r.lockedUntil=now()+EMPRESA_LOCK_MS;locked=true}
    s.empresa=r;save(s);return {locked:locked,rec:r};
  }

  function getSellerRec(key){
    const s=state();key=sellerKey(key);s.sellers[key]=normalize(s.sellers[key]||{fails:0,lockedUntil:0});save(s);return s.sellers[key];
  }
  function sellerLocked(key){const r=getSellerRec(key);return Number(r.lockedUntil||0)>now()?r:null}
  function resetSeller(key){const s=state();s.sellers[sellerKey(key)]={fails:0,lockedUntil:0};save(s)}
  function failSeller(key){
    const s=state();key=sellerKey(key);const r=normalize(s.sellers[key]||{});r.fails=Number(r.fails||0)+1;
    let locked=false;
    if(r.fails>=SELLER_MAX){r.fails=SELLER_MAX;r.lockedUntil=now()+SELLER_LOCK_MS;locked=true}
    s.sellers[key]=r;save(s);return {locked:locked,rec:r};
  }

  function clearFocus(id){
    const f=document.getElementById(id);if(f){f.value='';setTimeout(function(){try{f.focus()}catch(e){}},0)}
  }

  function install(){
    if(window.__fusionSecurityAttemptsV1)return;
    if(typeof window.tryEmpresaCode!=='function' || typeof window.checkEmpresaCode!=='function' || typeof window.loginSeller!=='function'){
      return setTimeout(install,120);
    }
    window.__fusionSecurityAttemptsV1=true;

    const baseTryEmpresaCode=window.tryEmpresaCode;
    window.tryEmpresaCode=function(){
      const lock=empresaLocked();
      if(lock)return;
      const el=document.getElementById('adminCodeInput');
      if(el && String(el.value)===String(company.adminCode||''))resetEmpresa();
      return baseTryEmpresaCode.apply(this,arguments);
    };

    const baseCheckEmpresaCode=window.checkEmpresaCode;
    window.checkEmpresaCode=function(){
      const lock=empresaLocked();
      if(lock){clearFocus('adminCodeInput');alert('Acceso Empresa bloqueado temporalmente. Espera '+secondsLeft(lock.lockedUntil)+' segundos.');return}
      const f=document.getElementById('adminCodeInput');
      const ok=f && String(f.value)===String(company.adminCode||'');
      if(ok){resetEmpresa();return baseCheckEmpresaCode.apply(this,arguments)}
      const result=failEmpresa();
      if(result.locked){clearFocus('adminCodeInput');alert('5 intentos incorrectos. Acceso Empresa bloqueado durante 2 minutos.');return}
      return baseCheckEmpresaCode.apply(this,arguments);
    };

    const baseLoginSeller=window.loginSeller;
    window.loginSeller=function(){
      const code=(document.getElementById('sellerCodeLogin')?.value||'').trim();
      const pin=document.getElementById('sellerPinLogin')?.value||'';
      const s=(typeof sellers!=='undefined'&&Array.isArray(sellers))?sellers.find(function(x){return String(x.code)===String(code)}):null;
      const key=s?s.code:code;
      const lock=sellerLocked(key);
      if(lock){clearFocus('sellerPinLogin');alert('Este vendedor está bloqueado temporalmente. Espera '+secondsLeft(lock.lockedUntil)+' segundos.');return}
      const ok=!!(s && String(s.pin||'')===String(pin));
      if(ok){resetSeller(key);return baseLoginSeller.apply(this,arguments)}
      const result=failSeller(key);
      if(result.locked){clearFocus('sellerPinLogin');alert('5 intentos incorrectos. Este vendedor queda bloqueado durante 15 segundos.');return}
      return baseLoginSeller.apply(this,arguments);
    };

    function wrapSellerPinFunction(name,inputId,keyFromArgs){
      const base=window[name];if(typeof base!=='function')return;
      window[name]=function(){
        const key=keyFromArgs.apply(this,arguments);
        const s=(typeof sellers!=='undefined'&&Array.isArray(sellers))?sellers.find(function(x){return String(x.code)===String(key)||String(x.name)===String(key)}):null;
        const realKey=s?(s.code||s.name):key;
        const lock=sellerLocked(realKey);
        if(lock){clearFocus(inputId);alert('Este vendedor está bloqueado temporalmente. Espera '+secondsLeft(lock.lockedUntil)+' segundos.');return}
        const pin=document.getElementById(inputId)?.value||'';
        const ok=!!(s && String(s.pin||'')===String(pin));
        if(ok){resetSeller(realKey);return base.apply(this,arguments)}
        const result=failSeller(realKey);
        if(result.locked){clearFocus(inputId);alert('5 intentos incorrectos. Este vendedor queda bloqueado durante 15 segundos.');return}
        return base.apply(this,arguments);
      };
    }

    wrapSellerPinFunction('quickConfirmSeller','quickSellerPin',function(code){return code});
    wrapSellerPinFunction('vnConfirmSeller','vnSellerPin',function(code){return code});
    wrapSellerPinFunction('openMyActivity','activityPin',function(name){return name});

    window.securityAttemptsStatus=function(){return state()};
  }

  install();
})();
