(()=>{
'use strict';
const VERSION='v11.8.0-rc4.61';
const $=id=>document.getElementById(id);
const q=s=>document.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function isLive(){return document.body.classList.contains('draft-live-view')}
function ensureSurface(){
  if($('liveDecisionSurface'))return $('liveDecisionSurface');
  const host=$('coachSectionCard');if(!host)return null;
  const box=document.createElement('section');box.id='liveDecisionSurface';box.className='live-decision-surface live-only';
  box.innerHTML='<div class="live-decision-head"><div><b>LIVE Decision</b><span id="liveDecisionMeta">Wartet auf Analyse</span></div><button id="liveJumpCoach" class="secondary" type="button" aria-label="Zur Analyse">↓ Analyse</button></div><div id="liveDecisionCards" class="live-decision-cards"></div><div class="live-decision-actions"><button id="liveCopyHandoff" class="secondary" type="button" disabled>Chat-Handoff kopieren</button><button id="liveFullDiagnostic" class="secondary" type="button" disabled>Full Diagnostic kopieren</button></div><div id="liveHandoffStatus" class="tiny"></div>';
  host.parentNode.insertBefore(box,host);
  $('liveJumpCoach').addEventListener('click',()=>host.scrollIntoView({behavior:'smooth',block:'start'}));
  $('liveCopyHandoff').addEventListener('click',()=>copyText(compactHandoff(),'Kompakter Chat-Handoff kopiert.'));
  $('liveFullDiagnostic').addEventListener('click',()=>copyText($('snapshot')?.value||'','Full Diagnostic Snapshot kopiert.'));
  return box;
}
function coachRows(){return [...document.querySelectorAll('#coachList .coach')].slice(0,5)}
function rowData(row,i){
  const name=row.querySelector('h3')?.textContent?.trim()||`Kandidat ${i+1}`;
  const score=row.querySelector('.score')?.textContent?.trim()||'–';
  const metrics=[...row.querySelectorAll('.metric')].map(x=>x.textContent.replace(/\s+/g,' ').trim()).filter(Boolean).slice(0,4);
  const tags=[...row.querySelectorAll('.tag')].map(x=>x.textContent.trim()).filter(Boolean).slice(0,3);
  return{name,score,metrics,tags};
}
function currentMeta(){
  const status=$('draftStatus')?.textContent?.trim()||'Noch keine Live-Analyse.';
  return status.replace(/\s+/g,' ');
}
function compactHandoff(){
  const rows=coachRows().map(rowData);
  const lines=['===== PITTI LIVE DECISION =====',`App-Version: ${VERSION}`,currentMeta(),''];
  if(!rows.length)lines.push('Keine bewerteten Kandidaten sichtbar.');
  rows.forEach((x,i)=>lines.push(`${i+1}. ${x.name} | Coach ${x.score}${x.metrics.length?' | '+x.metrics.join(' · '):''}${x.tags.length?' | '+x.tags.join(' · '):''}`));
  lines.push('','AUFGABE: Live-Pick prüfen. Panel bleibt Baseline; nur entscheidungsändernde aktuelle Evidenz darf den Coach-Topfavoriten/TAKE-WAIT-Pfad überstimmen. Nenne Favorit(en), 2–3 Alternativen, Return-Chancen und Confidence.');
  return lines.join('\n');
}
async function copyText(text,ok){
  const status=$('liveHandoffStatus');
  if(!text){if(status)status.textContent='Noch keine Analyse verfügbar.';return}
  try{await navigator.clipboard.writeText(text);if(status)status.textContent=ok}catch{if(status)status.textContent='Kopieren nicht möglich – Browser-Berechtigung prüfen.'}
}
function render(){
  const box=ensureSurface();if(!box)return;
  box.hidden=!isLive();if(!isLive())return;
  const rows=coachRows().map(rowData),cards=$('liveDecisionCards'),meta=$('liveDecisionMeta');
  if(meta)meta.textContent=currentMeta();
  if(cards)cards.innerHTML=rows.length?rows.map((x,i)=>`<article class="live-decision-card${i===0?' primary':''}"><div class="live-decision-rank">${i+1}</div><div><b>${esc(x.name)}</b><small>${esc(x.metrics.slice(0,2).join(' · ')||'Details im Coach')}</small></div><strong>${esc(x.score)}</strong></article>`).join(''):'<div class="notice">Analyse starten; danach erscheinen hier die Top-Kandidaten.</div>';
  if($('liveCopyHandoff'))$('liveCopyHandoff').disabled=!rows.length;
  if($('liveFullDiagnostic'))$('liveFullDiagnostic').disabled=!($('snapshot')?.value);
}
function boot(){
  ensureSurface();render();
  const obs=new MutationObserver(()=>render());
  obs.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['class','hidden']});
  document.addEventListener('click',e=>{if(e.target?.id==='liveViewBtn'||e.target?.id==='refreshBtn')setTimeout(render,0)});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
