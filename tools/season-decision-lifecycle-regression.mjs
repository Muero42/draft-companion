import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

let app=fs.readFileSync('app.js','utf8').replace(/\r\n/g,'\n');
function source(name){
  const start=app.indexOf('function '+name+'(');assert(start>=0,name);
  const end=app.slice(start+1).search(/\n(?:async )?function /);
  return (app.slice(start-6,start)==='async '?'async ':'')+app.slice(start,end<0?undefined:start+1+end);
}
function fixture({warm=false,expiry=false,missing=false,expired=false,completion=null}={}){
  let now=1000000,passes=0,directoryFetches=0,visibleBeforeExpiry=false,completed=false;
  const timers=new Map(),memory=new Map();
  const season={ok:true,source:'Sleeper direct',generated_at:now,player_directory:{fetchedAt:now}};
  const directory={schema:'pitti.players.v1',fetchedAt:now,players:{fixture:{}}};
  const rows=[{p:{id:'drop'},seasonStatus:'ACTIVE'}];
  if(!missing)memory.set('weekly',{snapshotId:'fixture',lastSuccessAt:now,records:[{expiresAt:expired?now-1:expiry?now+10:now+100000}]});
  const els=new Proxy({},{get:(o,k)=>o[k]??={innerHTML:'',textContent:'',style:{},value:'9'}});
  const box={Date:class extends Date{static now(){return now}},console:{error(){}},els,navigator:{onLine:true},
    store:{get:(key,fallback)=>memory.get(key)??fallback},PittiWeeklyEvidenceV2:{CACHE_KEY:'weekly'},BOONE_TRADE_VALUE_CACHE_KEY:'trade',
    SEASON_PLAYERS_MAX_AGE_MS:21600000,SEASON_RANKING_AUTO_MS:3600000,loadResearchEvents:()=>[],seasonDecisionTimer:null,
    setTimeout:(fn,delay)=>{const id=timers.size+1;timers.set(id,{fn,delay});return id},clearTimeout:id=>timers.delete(id),
    seasonBootstrapBusy:false,seasonLiveRefreshPromise:null,lastDraftContext:null,lastPostDraftPairs:[],
    seasonUiYield:async()=>{await Promise.resolve()},seasonBootstrapWatchdogArm:()=>1,seasonBootstrapWatchdogClear:()=>{},
    fetchSeasonLeagueState:async()=>season,seasonDirectoryCached:async()=>warm?directory:null,
    seasonDirectoryRefresh:async()=>{directoryFetches++;return directory},seasonRosterShell:()=>rows,
    seasonRosterRows:()=>rows,seasonAvailablePlayers:()=>[{id:'fa'}],seasonAvailableSpecialTeams:()=>[],
    postDraftRosterCounts:()=>({}),seasonLineupHtml:()=>'<roster>',LIVE_DRAFT_ID_2026:'fixture',SEASON_SPECIAL_TEAMS_MODEL:{},
    refreshSeasonActualScores:()=>{},refreshSeasonWrMatchup:()=>{},renderRosterBenchAudit:()=>{passes++},
    // Domain acquisition/scoring is deliberately stubbed. Only orchestration and
    // actual Waiver rendering are under test; this cannot certify recommendations.
    renderRosterFaAudit:()=>{box.lastPostDraftPairs=[]},
    renderTradeWorkspace:()=>{els.tradeStatus.textContent='DOMAIN HOLD';els.tradeList.innerHTML='domain diagnostics';if(completion==='trade'&&!completed){completed=true;box.queueSeasonRerender()}},
    seasonLiveAuthority:()=>true,renderQbOpportunityBoard:()=>'',renderSpecialTeamsBoard:()=>'',esc:String,
    renderSeasonActionBoard:()=>{visibleBeforeExpiry=els.waiverList.innerHTML.includes('JETZT ENTSCHEIDEN');if(expiry&&now===1000000)now+=10;if(completion==='weekly'&&!completed){completed=true;box.queueSeasonRerender()}},
    updateStatus:()=>{},renderSeasonRankingFreshness:()=>{},renderSeasonLiveStateFreshness:()=>{},localStorage:{setItem:()=>{}}};
  vm.createContext(box);
  vm.runInContext(app.slice(app.indexOf('let seasonRenderQueued='),app.indexOf('\nlet seasonLiveRefreshPromise')),box);
  for(const name of ['seasonDirectoryFresh','seasonDirectoryBind','runSeasonSurface','blockSeasonDependentSurface','seasonDecisionDeadline','scheduleSeasonDecisionExpiry','bootstrapSeasonWorkspace','rerenderPostDraftFromContext','renderWaiverWorkspace'])vm.runInContext(source(name),box);
  return {box,els,memory,timers,stats:()=>({passes,directoryFetches,visibleBeforeExpiry}),setNow:value=>now=value};
}
async function settle(f){
  for(let i=0;i<100;i++){await Promise.resolve();if(!vm.runInContext('seasonRenderRunning',f.box))return;}
  assert.fail('render queue did not settle');
}
// Diagnostic contract: reproduce the released defect before testing a proposed
// correction in an isolated VM. The sealed runtime is intentionally unchanged.
for(const warm of [false,true]){
  const baseline=fixture({warm,expiry:true});await baseline.box.bootstrapSeasonWorkspace();await settle(baseline);
  assert(baseline.stats().visibleBeforeExpiry);
  assert.match(baseline.els.waiverStatus.textContent,/Berechnung ausstehend oder überholt/);
  assert.equal(baseline.els.waiverList.innerHTML,'');
  assert.equal(baseline.stats().passes,1);assert.equal(baseline.timers.size,0);
}
console.log('DIAGNOSIS_REPRODUCED: released cold/warm expiry clears board without replacement pass or expiry timer.');
const original=source('seasonRenderPassCurrent');
assert(original.includes('seasonClearDecisionSurfaces();return false;'));
app=app.replace(original,original.replace('seasonClearDecisionSurfaces();return false;',
  'seasonClearDecisionSurfaces();\n  if(lastDraftContext===c&&seasonRenderRevision===revision&&Date.now()>=deadline)seasonRenderQueued=true;\n  return false;'));
for(const warm of [false,true])for(const mode of ['fresh','missing','expired','weekly','trade','expiry']){
  const f=fixture({warm,missing:mode==='missing',expired:mode==='expired',expiry:mode==='expiry',completion:mode});
  await f.box.bootstrapSeasonWorkspace();await settle(f);
  assert.equal(f.stats().directoryFetches,warm?0:1);
  assert.match(f.els.waiverStatus.textContent,/Decision Board v3/,`${warm?'warm':'cold'} ${mode}: domain explanation must survive settled rendering`);
  assert.match(f.els.waiverList.innerHTML,/Kein/);
  assert(!f.els.waiverList.innerHTML.includes('ACTIONABLE'));
  assert.equal(f.els.tradeStatus.textContent,'DOMAIN HOLD');
  assert.equal(f.stats().passes,['weekly','trade','expiry'].includes(mode)?2:1,'one follow-up per invalidation');
  assert(f.timers.size>0,'settled pass rearms evidence expiry');
  if(mode==='expiry')assert(f.stats().visibleBeforeExpiry,'board was visible before expiry cleared it');
}
// Never revalidate the obsolete generation or context. Their owner must queue
// replacement work; an expiry follow-up may only be requested by the current pass.
for(const reason of ['context','revision']){
  const f=fixture();await f.box.bootstrapSeasonWorkspace();await settle(f);
  const old=f.box.lastDraftContext;
  if(reason==='context')f.box.lastDraftContext={...old};else vm.runInContext('seasonRenderRevision++',f.box);
  assert.equal(f.box.seasonRenderPassCurrent(old,0,0),false);
  assert.equal(vm.runInContext('seasonRenderQueued',f.box),false);
  assert.equal(f.els.waiverList.innerHTML,'');
}
// Decision cache admission is independent from the shared rendering guard.
const cache=fixture();vm.runInContext(source('seasonDecisionCached'),cache.box);
Object.assign(cache.box,{seasonEvidenceContext:()=>({season:2026,week:5}),seasonDecisionModels:{season:2026,week:5,weeklySnapshotId:'fixture',generatedAt:1000000,models:{fa:{expiresAt:1000010}}}});
assert(cache.box.seasonDecisionCached('fa'));
cache.memory.set('weekly',{snapshotId:'replacement'});assert.equal(cache.box.seasonDecisionCached('fa'),null);
cache.memory.set('weekly',{snapshotId:'fixture'});cache.setNow(1000010);assert.equal(cache.box.seasonDecisionCached('fa'),null);
cache.setNow(999999);assert.equal(cache.box.seasonDecisionCached('fa'),null);
console.log('DIAGNOSTIC_CANDIDATE_PASS: isolated correction, 12 cold/warm ordering/evidence cases; obsolete context/revision rejection; snapshot/expiry/clock cache rejection. Domain scoring stubbed; runtime unchanged; no Android acceptance claim.');
