const CACHE='draft-companion-v11.8.0-rc4.49';
const ASSETS=['./','./index.html','./styles.css','./app.js?v=11.8.0-rc4.49','./manifest.webmanifest','./icon.svg'];
const BASE='v11.8.0-rc4.46',TARGET='v11.8.0-rc4.49';
function patchApp(s){
  s=s.replaceAll(BASE,TARGET).replaceAll('11.8.0-rc4.46','11.8.0-rc4.49');
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
  const text=JSON.stringify(v,null,2),file=new File([text],name,{type:'application/json'}),u=URL.createObjectURL(file);
  document.getElementById('pitti-backup-export')?.remove();
  const box=document.createElement('div');box.id='pitti-backup-export';
  box.style='position:fixed;z-index:2147483647;left:12px;right:12px;bottom:12px;padding:14px;background:#101b2d;color:#fff;border:2px solid #6f8fca;border-radius:14px;box-shadow:0 6px 28px #000a;font:16px sans-serif';
  const title=document.createElement('b');title.textContent='Sicherung bereit';
  const info=document.createElement('div');info.textContent='Die JSON-Datei ist erzeugt. Du kannst sie direkt teilen oder lokal speichern.';info.style='margin-top:8px;font-size:14px;line-height:1.35';
  const share=document.createElement('button');share.type='button';share.textContent='Teilen / an ChatGPT senden';share.style='display:block;width:100%;margin-top:12px;padding:12px;font-weight:700';
  const save=document.createElement('a');save.textContent='Datei speichern';save.href=u;save.download=name;save.rel='noopener';save.style='display:block;margin-top:8px;padding:12px;background:#2d4267;color:#fff;text-align:center;text-decoration:none;border-radius:8px;font-weight:700';
  const close=document.createElement('button');close.type='button';close.textContent='Schließen';close.style='display:block;width:100%;margin-top:8px;padding:9px';
  share.onclick=async()=>{try{if(navigator.share&&(!navigator.canShare||navigator.canShare({files:[file]}))){await navigator.share({files:[file],title:'Draft Companion Sicherung'});}else{share.textContent='Teilen nicht unterstützt – Datei speichern';}}catch(e){if(e?.name!=='AbortError')share.textContent='Teilen fehlgeschlagen – Datei speichern';}};
  close.onclick=()=>{URL.revokeObjectURL(u);box.remove()};
  box.append(title,info,share,save,close);document.body.append(box);
  setTimeout(()=>{if(!document.body.contains(box))URL.revokeObjectURL(u)},60000);
}`;
  if(!s.includes(old1)||!s.includes(old2)||!s.includes(old3))throw new Error('rc4.49 patch anchors missing');
  return s.replace(old1,new1).replace(old2,new2).replace(old3,new3);
}
function patchText(path,s){
  if(path.endsWith('/app.js'))return patchApp(s);
  if(path.endsWith('/index.html')||path.endsWith('/manifest.webmanifest')||path.endsWith('/'))return s.replaceAll(BASE,TARGET).replaceAll('11.8.0-rc4.46','11.8.0-rc4.49');
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
