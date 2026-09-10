const CACHE='draft-companion-v11.8.0-rc4.193-static-v2';
const BACKUP_CACHE='draft-companion-backup-export-v1';
const ASSETS=['./','./index.html','./styles.css','./app.js?v=v11.8.0-rc4.193','./decision-policy.js','./weekly-evidence-v2.js?v=v11.8.0-rc4.193','./manifest.webmanifest','./icon.svg','./live-surface-v3.js?v=v11.8.0-rc4.193','./live-surface-v3.css?v=v11.8.0-rc4.193','./expert-board-export.js?v=20260826e','./expert-v2-board.js?v=20260826e','./expert-v3-board.js?v=20260828a'];
const BASE='v11.8.0-rc4.193',TARGET='v11.8.0-rc4.193';
// Only the bounded app shell belongs in CacheStorage. Live API responses have
// their own freshness rules and may carry a new cache-busting URL on every load.
const SCOPE=new URL(self.registration.scope);
const STATIC_URLS=new Map(ASSETS.map(asset=>{const url=new URL(asset,SCOPE);return[url.pathname,url.href]}));
function staticCacheKey(request){
  const url=new URL(request.url);
  return url.origin===SCOPE.origin?STATIC_URLS.get(url.pathname)||null:null;
}
function patchApp(s){
  // rc4.175+: the canonical runtime already contains the historical pre-draft/full-pool
  // and backup-download fixes. Do not mutate current app.js in the service worker.
  return s.replaceAll(BASE,TARGET);
}
function patchText(path,s){
  if(path.endsWith('/app.js'))return patchApp(s);
  if(path.endsWith('/index.html')||path.endsWith('/manifest.webmanifest')||path.endsWith('/'))return s.replaceAll(BASE,TARGET).replaceAll('11.8.0-rc4.60','11.8.0-rc4.60');
  return s;
}
async function transformed(req){
  const net=await fetch(req,{cache:'no-store'});
  if(!net.ok)return net;
  const u=new URL(req.url),path=u.pathname;
  if(!(path.endsWith('/app.js')||path.endsWith('/index.html')||path.endsWith('/manifest.webmanifest')||path.endsWith('/')))return net;
  const text=patchText(path,await net.text());
  const h=new Headers(net.headers);h.delete('content-length');h.delete('content-encoding');
  return new Response(text,{status:net.status,statusText:net.statusText,headers:h});
}
self.addEventListener('message',e=>{
  const d=e.data||{};if(d.type!=='PITTI_BACKUP_STORE')return;
  e.waitUntil((async()=>{try{
    const token=String(d.token||'').replace(/[^a-z0-9_-]/gi,''),name=String(d.name||'draft-companion-backup.json').replace(/[\r\n"\\]/g,'_'),text=String(d.text||'');
    if(!token||!text)throw new Error('Backup-Daten fehlen.');
    const url=new URL('/__backup_download/'+token,self.location.origin).href,cache=await caches.open(BACKUP_CACHE);
    await cache.put(url,new Response(text,{headers:{'content-type':'application/json; charset=utf-8','content-disposition':`attachment; filename="${name}"`,'cache-control':'no-store'}}));
    e.ports?.[0]?.postMessage({ok:true});
  }catch(err){e.ports?.[0]?.postMessage({ok:false,error:err?.message||String(err)})}})());
});
self.addEventListener('install',e=>e.waitUntil((async()=>{
  const cache=await caches.open(CACHE);
  // Do not replace a working offline shell with a partially downloaded one.
  for(const asset of ASSETS){
    const url=new URL(asset,SCOPE).href,response=await transformed(new Request(url,{cache:'reload'}));
    if(!response.ok)throw new Error('Runtime asset unavailable: '+asset);
    await cache.put(url,response);
  }
  await self.skipWaiting();
})()));
self.addEventListener('activate',e=>e.waitUntil((async()=>{
  // Remove only rebuildable app caches, including the former unbounded API
  // copies. Backup exports and unrelated caches are not part of this migration.
  for(const key of await caches.keys())if(key.startsWith('draft-companion-v')&&key!==CACHE)await caches.delete(key);
  await self.clients.claim();
})()));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const url=new URL(e.request.url);
  if(url.origin===SCOPE.origin&&url.pathname.startsWith('/__backup_download/')){
    e.respondWith((async()=>{const cache=await caches.open(BACKUP_CACHE);return(await cache.match(e.request))||new Response('Backup nicht mehr verfügbar.',{status:404})})());
    return;
  }
  const key=staticCacheKey(e.request);
  if(!key)return;
  e.respondWith((async()=>{
    try{
      const response=await transformed(e.request);
      if(response.ok){
        // Cache errors must not discard an otherwise usable network response.
        const copy=response.clone();
        e.waitUntil(caches.open(CACHE).then(cache=>cache.put(key,copy)).catch(()=>{}));
      }
      return response;
    }catch{
      const cache=await caches.open(CACHE);
      return(await cache.match(key))||Response.error();
    }
  })());
});
