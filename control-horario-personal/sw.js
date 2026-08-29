self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    try{const keys=await caches.keys();await Promise.all(keys.filter(k=>k.startsWith('sincroniaia-control-horario')).map(k=>caches.delete(k)));}catch(e){}
    try{await self.registration.unregister();}catch(e){}
    try{await self.clients.claim();}catch(e){}
  })());
});
// PWA cache desactivada temporalmente: la app debe cargar siempre la versión publicada.
