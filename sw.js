const CACHE='draft-companion-v11.8.0-rc4.178';
const BACKUP_CACHE='draft-companion-backup-export-v1';
const ASSETS=['./','./index.html','./styles.css','./app.js?v=v11.8.0-rc4.178','./decision-policy.js','./manifest.webmanifest','./icon.svg','./live-surface-v3.js?v=v11.8.0-rc4.178','./live-surface-v3.css?v=v11.8.0-rc4.178','./expert-board-export.js?v=20260826e','./expert-v2-board.js?v=20260826e','./expert-v3-board.js?v=20260828a'];
const BASE='v11.8.0-rc4.178',TARGET='v11.8.0-rc4.178';
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
self.addEventListener('install',e=>e.waitUntil((async()=>{const c=await caches.open(CACHE);for(const url of ASSETS){try{const r=await transformed(new Request(url,{cache:'reload'}));if(r.ok)await c.put(url,r.clone())}catch{}}await self.skipWaiting()})()));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE&&k!==BACKUP_CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;const u=new URL(e.request.url);if(u.pathname.startsWith('/__backup_download/')){e.respondWith((async()=>{const r=await caches.match(e.request);return r||new Response('Backup nicht mehr verfügbar.',{status:404})})());return;}e.respondWith((async()=>{try{const r=await transformed(e.request);const c=await caches.open(CACHE);c.put(e.request,r.clone()).catch(()=>{});return r}catch{return (await caches.match(e.request))||Response.error()}})())});