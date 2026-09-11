const CACHE='sincroniaia-consulta-v3';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.svg','./icon-512.svg','./name-edit-patch.js'];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;

  if(event.request.mode==='navigate'){
    event.respondWith(
      fetch(event.request)
        .then(async response=>{
          const html=await response.text();
          const injected=html.includes('name-edit-patch.js')
            ? html
            : html.replace('</body>','<script src="./name-edit-patch.js?v=3"></script></body>');
          return new Response(injected,{
            status:response.status,
            statusText:response.statusText,
            headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-cache'}
          });
        })
        .catch(()=>caches.match('./index.html'))
    );
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response=>{
        const copy=response.clone();
        caches.open(CACHE).then(cache=>cache.put(event.request,copy));
        return response;
      })
      .catch(()=>caches.match(event.request))
  );
});
