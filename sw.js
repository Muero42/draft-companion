const CACHE='draft-companion-v11.8.0-rc4.128';
const BACKUP_CACHE='draft-companion-backup-export-v1';
const ASSETS=['./','./index.html','./styles.css','./app.js?v=v11.8.0-rc4.128','./decision-policy.js','./manifest.webmanifest','./icon.svg','./live-surface-v3.js?v=v11.8.0-rc4.128','./live-surface-v3.css?v=v11.8.0-rc4.128','./expert-board-export.js?v=20260826e','./expert-v2-board.js?v=20260826e','./expert-v3-board.js?v=20260828a'];
const BASE='v11.8.0-rc4.128',TARGET='v11.8.0-rc4.128';
function patchApp(s){
  s=s.replaceAll(BASE,TARGET).replaceAll('11.8.0-rc4.60','11.8.0-rc4.60');
  const old1="      snapshotLimit=els.snapshotMode.value==='full'?40:25,\n      availableSnapshot=scored.slice().sort((a,b)=>a.r.rank-b.r.rank).slice(0,snapshotLimit),";
  const new1="      snapshotLimit=els.snapshotMode.value==='full'?40:25,\n      preDraftSimulationPool=!picks.length&&current===1,\n      availableSnapshot=scored.slice().sort((a,b)=>a.r.rank-b.r.rank).slice(0,preDraftSimulationPool?scored.length:snapshotLimit),";
  const old2="    lines.push('','VERFÜGBARE SPIELER NACH PANEL');";
  const new2="    lines.push('',preDraftSimulationPool?'VOLLSTÄNDIGER SIMULATIONSPOOL (NUR PRE-DRAFT)':'VERFÜGBARE SPIELER NACH PANEL');";
  const old3=`async function downloadJson(name,v){
  const text=JSON.stringify(v,null,2),file=new File([text],name,{type:'application/json'});
  // Android/PWA: Web Share with a real File is more reliable than navigating to a blob URL.
  // It also lets the backup be shared directly to ChatGPT or saved with Android's file picker.
  try{
    if(navigator.share&&navigator.canShare?.({files:[file]})){
      await navigator.share({files:[file],title:'Draft Companion Sicherung'});
      return;
    }
  }catch(e){
    if(e?.name==='AbortError')return;
    console.warn('File share failed; falling back to download',e);
  }
  const u=URL.createObjectURL(file),a=document.createElement('a');
  a.href=u;a.download=name;a.rel='noopener';a.style.display='none';document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(u),10000);
}`;
  const new3=`async function downloadJson(name,v){
  const text=JSON.stringify(v,null,2),token='b'+Date.now().toString(36)+Math.random().toString(36).slice(2),path='/__backup_download/'+token;
  if(!('serviceWorker' in navigator)||!navigator.serviceWorker.controller)throw new Error('Service Worker noch nicht aktiv. App einmal vollständig neu öffnen.');
  await new Promise((resolve,reject)=>{
    const ch=new MessageChannel(),timer=setTimeout(()=>reject(new Error('Backup-Download konnte nicht vorbereitet werden.')),8000);
    ch.port1.onmessage=e=>{clearTimeout(timer);e.data?.ok?resolve():reject(new Error(e.data?.error||'Backup-Download fehlgeschlagen.'))};
    navigator.serviceWorker.controller.postMessage({type:'PITTI_BACKUP_STORE',token,name,text},[ch.port2]);
  });
  document.getElementById('pitti-backup-export')?.remove();
  const box=document.createElement('div');box.id='pitti-backup-export';
  box.style='position:fixed;z-index:2147483647;left:12px;right:12px;bottom:12px;padding:14px;background:#101b2d;color:#fff;border:2px solid #6f8fca;border-radius:14px;box-shadow:0 6px 28px #000a;font:16px sans-serif';
  const title=document.createElement('b');title.textContent='Sicherung bereit';
  const info=document.createElement('div');info.textContent='Die JSON-Datei liegt als echter Download bereit.';info.style='margin-top:8px;font-size:14px;line-height:1.35';
  const save=document.createElement('a');save.textContent='Sicherung herunterladen';save.href=path;save.target='_blank';save.rel='noopener';save.style='display:block;margin-top:12px;padding:12px;background:#eef1f6;color:#111;text-align:center;text-decoration:none;border-radius:8px;font-weight:700';
  const copy=document.createElement('button');copy.type='button';copy.textContent='Notfall-Fallback: JSON kopieren';copy.style='display:block;width:100%;margin-top:8px;padding:10px';
  copy.onclick=async()=>{try{await navigator.clipboard.writeText(text);copy.textContent='JSON kopiert';}catch{copy.textContent='Kopieren nicht möglich';}};
  const close=document.createElement('button');close.type='button';close.textContent='Schließen';close.style='display:block;width:100%;margin-top:8px;padding:9px';close.onclick=()=>box.remove();
  box.append(title,info,save,copy,close);document.body.append(box);
}`;
  if(!s.includes(old1)||!s.includes(old2)||!s.includes(old3))throw new Error('rc4.60 patch anchors missing');
  return s.replace(old1,new1).replace(old2,new2).replace(old3,new3);
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