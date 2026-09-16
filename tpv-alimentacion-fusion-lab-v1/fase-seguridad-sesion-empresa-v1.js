/* SINCRONIAIA TPV · LAB FUSIÓN
   Seguridad sesión Empresa
   - Caducidad tras 5 minutos de inactividad.
   - Cualquier interacción dentro de Empresa reinicia el contador.
   - Salir a inicio elimina la autorización inmediatamente.
   - No cierra vendedores ni borra ventas pendientes.
*/
(function(){
  'use strict';

  const EMPRESA_IDLE_MS = 5 * 60 * 1000;
  let empresaIdleTimer = null;

  function clearEmpresaTimer(){
    if(empresaIdleTimer){
      clearTimeout(empresaIdleTimer);
      empresaIdleTimer = null;
    }
  }

  function expireEmpresaSession(){
    empresaIdleTimer = null;
    if(typeof role === 'undefined' || role !== 'empresa') return;
    try{ if(typeof closeModal === 'function') closeModal(); }catch(e){}
    role = null;
    screen = 'home';
    if(typeof adminTab !== 'undefined') adminTab = 'menu';
    if(typeof render === 'function') render();
    alert('Sesión Empresa cerrada por 5 minutos de inactividad.');
  }

  function armEmpresaTimer(){
    clearEmpresaTimer();
    if(typeof role !== 'undefined' && role === 'empresa'){
      empresaIdleTimer = setTimeout(expireEmpresaSession, EMPRESA_IDLE_MS);
    }
  }

  window.touchEmpresaSession = function(){
    if(typeof role !== 'undefined' && role === 'empresa') armEmpresaTimer();
  };

  const originalTryEmpresaCode = window.tryEmpresaCode;
  if(typeof originalTryEmpresaCode === 'function'){
    window.tryEmpresaCode = function(){
      const result = originalTryEmpresaCode.apply(this, arguments);
      if(typeof role !== 'undefined' && role === 'empresa') armEmpresaTimer();
      return result;
    };
  }

  const originalCheckEmpresaCode = window.checkEmpresaCode;
  if(typeof originalCheckEmpresaCode === 'function'){
    window.checkEmpresaCode = function(){
      const result = originalCheckEmpresaCode.apply(this, arguments);
      if(typeof role !== 'undefined' && role === 'empresa') armEmpresaTimer();
      return result;
    };
  }

  const originalGoHome = window.goHome;
  if(typeof originalGoHome === 'function'){
    window.goHome = function(){
      clearEmpresaTimer();
      return originalGoHome.apply(this, arguments);
    };
  }

  ['pointerdown','keydown','input','change'].forEach(evt=>{
    document.addEventListener(evt, function(){
      if(typeof role !== 'undefined' && role === 'empresa') armEmpresaTimer();
    }, true);
  });
})();
