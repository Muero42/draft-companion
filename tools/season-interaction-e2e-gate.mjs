import fs from 'node:fs';import assert from 'node:assert/strict';
const a=fs.readFileSync('app.js','utf8'),h=fs.readFileSync('index.html','utf8');
const v=(a.match(/const APP_VERSION='([^']+)'/)||[])[1];const n=Number((v.match(/rc4\.(\d+)/)||[])[1]);assert.ok(n>=176,'requires rc4.176+');
for(const id of ['seasonRefreshLiveBtn','seasonRefreshRanksBtn']){assert.ok(!h.includes('id="'+id+'"'),'manual Season refresh control resurrected: '+id);assert.ok(!a.includes("'"+id+"'"),'manual Season refresh wiring resurrected: '+id);}
assert.ok(h.includes('id="seasonLiveStateStatus"')&&h.includes('id="seasonRankingStatus"'),'Season status surfaces missing');
assert.ok(a.includes('const rosterResult=await bootstrapSeasonWorkspace();'),'automatic roster bootstrap missing');
assert.ok(a.includes("if(els.expertSearch&&els.expertsList)renderExperts();"),'Season startup must not require removed Draft expert DOM');
assert.ok(a.includes("if(els.decisionLog)renderLog();"),'Season startup must not require removed Draft decision-log DOM');
assert.ok(a.includes("if(els.autoRefresh?.checked)"),'Season startup must tolerate absent legacy auto-refresh control');
assert.ok(a.includes('void refreshSeasonRankings({auto:true});'),'automatic ranking refresh missing');
assert.ok(a.includes('SEASON_RANKING_AUTO_MS=12*60*60*1000'),'12h ranking freshness policy missing');
assert.ok(a.includes("setInterval(()=>{if(!document.hidden)void syncWatcherFeed()},15*60*1000)"),'watcher cadence missing');
for(const t of ["'Season-Identität',6000","'Sleeper Kader',7000","'Season Spieler',15000"])assert(a.includes(t),'timeout missing '+t);
assert(a.includes("e?.name==='AbortError'")&&a.includes('clearTimeout(timer)'),'abort cleanup missing');
const ss=a.indexOf('function sanitizeResearchEvents('),se=a.indexOf('\nfunction loadResearchEvents',ss);assert(ss>=0&&se>ss);
const sanitize=new Function('return ('+a.slice(ss,se).replace('function sanitizeResearchEvents','function')+')')();
assert.equal(sanitize([null,7,'bad',[],{}, {playerId:'ok'}]).length,2);

// Startup-tail dependency audit: every unguarded els.<id> used before the async Season bootstrap must exist in HTML.
const tailStart=a.indexOf('try{\n  renderAll();setAuto();updateStatus();');
const bootAt=a.indexOf('const rosterResult=await bootstrapSeasonWorkspace();',tailStart);
assert.ok(tailStart>=0&&bootAt>tailStart,'Season startup tail not found');
const tail=a.slice(tailStart,bootAt);
const htmlIds=new Set([...h.matchAll(/id="([^"]+)"/g)].map(m=>m[1]));
for(const m of tail.matchAll(/els\.([A-Za-z0-9_]+)/g)){
  const id=m[1], before=tail.slice(Math.max(0,m.index-80),m.index);
  if(/if\s*\(\s*els\.[A-Za-z0-9_]+/.test(before)||before.includes('els.'+id+'?'))continue;
  assert.ok(htmlIds.has(id),'unguarded missing DOM before Season bootstrap: '+id);
}
console.log('SEASON_INTERACTION_E2E_GATE_PASS '+v+' automatic-only');