import fs from 'node:fs';import assert from 'node:assert/strict';
const a=fs.readFileSync('app.js','utf8'),h=fs.readFileSync('index.html','utf8');
const v=(a.match(/const APP_VERSION='([^']+)'/)||[])[1];assert.equal(v,'v11.8.0-rc4.175');
for(const id of ['seasonRefreshLiveBtn','seasonRefreshRanksBtn']){assert.ok(!h.includes('id="'+id+'"'),'manual Season refresh control resurrected: '+id);assert.ok(!a.includes("'"+id+"'"),'manual Season refresh wiring resurrected: '+id);}
assert.ok(h.includes('id="seasonLiveStateStatus"')&&h.includes('id="seasonRankingStatus"'),'Season status surfaces missing');
assert.ok(a.includes('const rosterResult=await bootstrapSeasonWorkspace();'),'automatic roster bootstrap missing');
assert.ok(a.includes('void refreshSeasonRankings({auto:true});'),'automatic ranking refresh missing');
assert.ok(a.includes('SEASON_RANKING_AUTO_MS=12*60*60*1000'),'12h ranking freshness policy missing');
assert.ok(a.includes("setInterval(()=>{if(!document.hidden)void syncWatcherFeed()},15*60*1000)"),'watcher cadence missing');
for(const t of ["'Season-Identität',6000","'Sleeper Kader',7000","'Season Spieler',15000"])assert(a.includes(t),'timeout missing '+t);
assert(a.includes("e?.name==='AbortError'")&&a.includes('clearTimeout(timer)'),'abort cleanup missing');
const ss=a.indexOf('function sanitizeResearchEvents('),se=a.indexOf('\nfunction loadResearchEvents',ss);assert(ss>=0&&se>ss);
const sanitize=new Function('return ('+a.slice(ss,se).replace('function sanitizeResearchEvents','function')+')')();
assert.equal(sanitize([null,7,'bad',[],{}, {playerId:'ok'}]).length,2);
console.log('SEASON_INTERACTION_E2E_GATE_PASS rc4.175 automatic-only');