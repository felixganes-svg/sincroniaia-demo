const CACHE='sincroniaia-control-horario-pwa-v2';
const ROOT='./';
const APP=['./','./app.html','./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(c=>c.addAll(APP)));self.skipWaiting();});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(req.mode==='navigate'){
    const isDirectApp=url.pathname.endsWith('/app.html');
    if(isDirectApp){
      event.respondWith(fetch(ROOT,{cache:'no-store'}).catch(()=>caches.match(ROOT)));
      return;
    }
    event.respondWith(fetch(req,{cache:'no-store'}).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(req,copy));return r;}).catch(()=>caches.match(req).then(x=>x||caches.match(ROOT))));
    return;
  }
  event.respondWith(fetch(req).then(r=>{if(url.origin===location.origin){const copy=r.clone();caches.open(CACHE).then(c=>c.put(req,copy));}return r;}).catch(()=>caches.match(req)));
});
