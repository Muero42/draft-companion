const CACHE='draft-companion-v11.8.0-rc4.48';
const ASSETS=['./','./index.html','./styles.css','./app.js?v=11.8.0-rc4.48','./manifest.webmanifest','./icon.svg'];
const BASE='v11.8.0-rc4.46',TARGET='v11.8.0-rc4.48';
function patchApp(s){
  s=s.replaceAll(BASE,TARGET).replaceAll('11.8.0-rc4.46','11.8.0-rc4.48');
  const old1="      snapshotLimit=els.snapshotMode.value==='full'?40:25,\n      availableSnapshot=scored.slice().sort((a,b)=>a.r.rank-b.r.rank).slice(0,snapshotLimit),";
  const new1="      snapshotLimit=els.snapshotMode.value==='full'?40:25,\n      preDraftSimulationPool=!picks.length&&current===1,\n      availableSnapshot=scored.slice().sort((a,b)=>a.r.rank-b.r.rank).slice(0,preDraftSimulationPool?scored.length:snapshotLimit),";
  const old2="    lines.push('','VERFÜGBARE SPIELER NACH PANEL');";
  const new2="    lines.push('',preDraftSimulationPool?'VOLLSTÄNDIGER SIMULATIONSPOOL (NUR PRE-DRAFT)':'VERFÜGBARE SPIELER NACH PANEL');";
  if(!s.includes(old1)||!s.includes(old2))throw new Error('rc4.48 patch anchors missing');
  return s.replace(old1,new1).replace(old2,new2);
}
function patchText(path,s){
  if(path.endsWith('/app.js'))return patchApp(s);
  if(path.endsWith('/index.html')||path.endsWith('/manifest.webmanifest')||path.endsWith('/'))return s.replaceAll(BASE,TARGET).replaceAll('11.8.0-rc4.46','11.8.0-rc4.48');
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
self.addEventListener('install',e=>e.waitUntil((async()=>{const c=await caches.open(CACHE);for(const url of ASSETS){try{const r=await transformed(new Request(url,{cache:'reload'}));if(r.ok)await c.put(url,r.clone())}catch{}}await self.skipWaiting()})()));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith((async()=>{try{const r=await transformed(e.request);const c=await caches.open(CACHE);c.put(e.request,r.clone()).catch(()=>{});return r}catch{return (await caches.match(e.request))||Response.error()}})())});
