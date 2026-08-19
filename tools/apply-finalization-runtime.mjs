import fs from 'node:fs';

const files=['app.js','index.html','manifest.webmanifest','sw.js','_worker.js','README.md'];
function mustReplace(src,from,to,label){
  if(!src.includes(from)) throw new Error(`missing anchor: ${label}`);
  return src.replace(from,to);
}
let app=fs.readFileSync('app.js','utf8');

app=mustReplace(app,
"const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));",
"const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));\nconst LIVE_DRAFT_ID_2026='1366053132970233856';\nfunction activeDraftSurface(){return localStorage.getItem('v118_draftSurface')==='live'?'live':'mock'}\nfunction resolveActiveDraftId(){return activeDraftSurface()==='live'?LIVE_DRAFT_ID_2026:draftId(els.draftInput.value)}\nfunction validateCanonicalLiveDraft({id,season,teams,rounds,slot}){const errors=[];if(String(id)!==LIVE_DRAFT_ID_2026)errors.push('Draft-ID');if(String(season)!=='2026')errors.push('Saison');if(Number(teams)!==10)errors.push('Teams');if(Number(rounds)!==15)errors.push('Runden');if(Number(slot)!==9)errors.push('Slot');return{ok:!errors.length,errors}}\nfunction visibleCoachCandidates(rows,normalCutCount=7){return rows.slice(0,10).map((row,i)=>({...row,outsideNormalCut:i>=normalCutCount}))}",
'core helpers');

app=mustReplace(app,
"  const id=draftId(els.draftInput.value);\n  if(!id)throw new Error('Draft-ID fehlt.');",
"  const surface=activeDraftSurface(),id=resolveActiveDraftId();\n  if(!id)throw new Error(surface==='live'?'LIVE-Draft-ID fehlt.':'Draft-ID fehlt.');",
'refresh id isolation');

app=mustReplace(app,
"      slot=Number(els.slot.value),\n      total=teams*rounds,",
"      slot=Number(els.slot.value),\n      liveGuard=surface==='live'?validateCanonicalLiveDraft({id,season:els.season.value,teams,rounds,slot}):{ok:true,errors:[]},\n      total=teams*rounds,",
'live metadata guard binding');

app=mustReplace(app,
"      current=Math.min(picks.length+1,total),",
"      current=Math.min(picks.length+1,total),",
'current anchor');

const guardAnchor="      next=nextOwn(current,teams,slot,total),";
app=mustReplace(app,guardAnchor,guardAnchor+"\n      liveGuardMessage=!liveGuard.ok?`LIVE-Draft blockiert: ${liveGuard.errors.join(', ')} stimmen nicht mit 2026/10 Teams/15 Runden/Slot 9 überein.`:'',",'live guard message');
const guardUse="    const state=rosterState(mine,players,current);";
app=mustReplace(app,guardUse,"    if(liveGuardMessage)throw new Error(liveGuardMessage);\n\n"+guardUse,'live guard enforcement');

app=mustReplace(app,
"function renderCoach(rows,state,current,next){\n  const top=rows.slice(0,5);",
"function renderCoach(rows,state,current,next){\n  const top=visibleCoachCandidates(rows,7);",
'top10 source');
app=mustReplace(app,
"<div class=\"coach-section-title\">Empfehlung + 4 Alternativen</div>",
"<div class=\"coach-section-title\">Empfehlung + Alternativen</div>",
'top10 heading');
app=mustReplace(app,
"${i===0?'EMPFEHLUNG · ':''}${x.action} · Tier ${x.r.tier||'–'} · Loss ${x.loss}",
"${i===0?'EMPFEHLUNG · ':''}${x.outsideNormalCut?'UNTER NORMAL-CUT · ':''}${x.action} · Tier ${x.r.tier||'–'} · Loss ${x.loss}",
'top10 label');
app=mustReplace(app,
"+top.map((x,i)=>`<article class=\"coach\">",
"+top.map((x,i)=>`${i===7?'<div class=\"coach-section-title\">Weitere sichtbare Kandidaten · unter Normal-Cut</div>':''}<article class=\"coach\">`,",
'top10 separator');

fs.writeFileSync('app.js',app);
for(const f of files){
  if(!fs.existsSync(f))continue;
  let s=fs.readFileSync(f,'utf8');
  s=s.replaceAll('rc4.50','rc4.52');
  fs.writeFileSync(f,s);
}
console.log('rc4.52 runtime patch applied');
