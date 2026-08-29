const CACHE='sincroniaia-control-horario-pwa-v3';
const ROOT='./?pwa=v3';
const STATIC=['./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(c=>c.addAll(STATIC)));
  self.skipWaiting();
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('message',event=>{if(event.data==='SKIP_WAITING')self.skipWaiting();});
self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(req.mode==='navigate'){
    event.respondWith(fetch(ROOT,{cache:'no-store',redirect:'follow'}).catch(()=>fetch(req,{cache:'no-store'})).catch(()=>new Response('<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><p>Sin conexión. Vuelve a abrir Control Horario cuando tengas conexión.</p>',{headers:{'Content-Type':'text/html;charset=utf-8'}})));
    return;
  }
  event.respondWith(fetch(req,{cache:'no-store'}).then(r=>{if(url.origin===location.origin&&STATIC.some(x=>url.pathname.endsWith(x.replace('./','/')))){const copy=r.clone();caches.open(CACHE).then(c=>c.put(req,copy));}return r;}).catch(()=>caches.match(req)));
});
