import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';

let app=fs.readFileSync('app.js','utf8').replace(/\r\n/g,'\n');
function source(name){
  const start=app.indexOf('function '+name+'(');assert(start>=0,name);
  const end=app.slice(start+1).search(/\n(?:async )?function /);
  return (app.slice(start-6,start)==='async '?'async ':'')+app.slice(start,end<0?undefined:start+1+end);
}
function fixture({warm=false,expiry=false,repeated=false,missing=false,expired=false,completion=null}={}){
  let now=1000000,passes=0,directoryFetches=0,visibleBeforeExpiry=false,completed=false;
  const timers=new Map(),memory=new Map();
  const season={ok:true,source:'Sleeper direct',generated_at:now,player_directory:{fetchedAt:now}};
  const directory={schema:'pitti.players.v1',fetchedAt:now,players:{fixture:{}}};
  const rows=[{p:{id:'drop'},seasonStatus:'ACTIVE'}];
  if(!missing)memory.set('weekly',{snapshotId:'fixture',lastSuccessAt:now,records:[{expiresAt:expired?now-1:expiry?now+10:now+100000}]});
  if(repeated)memory.get('weekly').records=[10,20,30].map(delta=>({expiresAt:now+delta}));
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
    renderSeasonActionBoard:()=>{visibleBeforeExpiry=els.waiverList.innerHTML.includes('JETZT ENTSCHEIDEN');if(repeated||(expiry&&now===1000000))now+=10;if(completion==='weekly'&&!completed){completed=true;box.queueSeasonRerender()}},
    updateStatus:()=>{},renderSeasonRankingFreshness:()=>{},renderSeasonLiveStateFreshness:()=>{},localStorage:{setItem:()=>{}}};
  vm.createContext(box);
  vm.runInContext(app.slice(app.indexOf('let seasonRenderQueued='),app.indexOf('\nlet seasonLiveRefreshPromise')),box);
  for(const name of ['seasonDirectoryFresh','seasonDirectoryBind','runSeasonSurface','blockSeasonDependentSurface','seasonDecisionDeadline','scheduleSeasonDecisionExpiry','bootstrapSeasonWorkspace','rerenderPostDraftFromContext','renderWaiverWorkspace'])vm.runInContext(source(name),box);
  return {box,els,memory,timers,stats:()=>({passes,directoryFetches,visibleBeforeExpiry}),setNow:value=>now=value,
    startQueue:()=>{box.lastDraftContext={draftComplete:true,mine:[],rankedAvailable:[],players:directory.players,season,seasonRows:rows,picks:[],teams:10};box.queueSeasonRerender()}};
}
async function settle(f){
  for(let i=0;i<100;i++){await Promise.resolve();if(!vm.runInContext('seasonRenderRunning',f.box))return;}
  assert.fail('render queue did not settle');
}
// Preserve the pinned historical reproduction, then execute the real candidate.
const candidate=app;
app=execFileSync('git',['show','171933ed024525e5c3bb7df864ab07d3bc27bb82:app.js'],{encoding:'utf8'}).replace(/\r\n/g,'\n');
for(const warm of [false,true]){
  const baseline=fixture({warm,expiry:true});await baseline.box.bootstrapSeasonWorkspace();await settle(baseline);
  assert(baseline.stats().visibleBeforeExpiry);
  assert.match(baseline.els.waiverStatus.textContent,/Berechnung ausstehend oder überholt/);
  assert.equal(baseline.els.waiverList.innerHTML,'');
  assert.equal(baseline.stats().passes,1);assert.equal(baseline.timers.size,0);
}
console.log('DIAGNOSIS_REPRODUCED: released cold/warm expiry clears board without replacement pass or expiry timer.');
app=candidate;
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
for(const start of ['cold','warm','queue'])for(const repeated of [false,true]){
  const f=fixture({warm:start==='warm',expiry:true,repeated});
  if(start==='queue')f.startQueue();else await f.box.bootstrapSeasonWorkspace();
  await settle(f);
  assert.equal(f.stats().passes,2,'bounded to one expiry successor');
  if(repeated){
    assert.match(f.els.waiverStatus.textContent,/erneut abgelaufen/);
    assert.equal(f.els.waiverList.innerHTML,'');assert.equal(f.box.lastPostDraftPairs.length,0);
    // An independent refresh starts a new generation and can recover normally.
    f.memory.delete('weekly');f.box.renderSeasonActionBoard=()=>{};f.box.queueSeasonRerender();await settle(f);
    assert.equal(f.stats().passes,3);assert.match(f.els.waiverStatus.textContent,/Decision Board/);
  }else assert.match(f.els.waiverStatus.textContent,/Decision Board/);
}
// Multiple completion notifications during one pending yield coalesce. Expiry
// and external completion together must not cause duplicate/reentrant passes.
{
  const f=fixture({expiry:true,completion:'weekly'});let active=0,maxActive=0;
  const render=f.box.rerenderPostDraftFromContext;
  f.box.rerenderPostDraftFromContext=async()=>{active++;maxActive=Math.max(maxActive,active);try{return await render()}finally{active--}};
  f.startQueue();f.box.queueSeasonRerender();f.box.queueSeasonRerender();await settle(f);
  assert.equal(maxActive,1);assert.equal(f.stats().passes,2);
  assert.match(f.els.waiverStatus.textContent,/Decision Board/);
}
// Bootstrap and queued rendering must share ownership even during acquisition.
{
  const f=fixture();f.startQueue();
  assert.equal((await f.box.bootstrapSeasonWorkspace({force:true})).busy,true,'bootstrap must not enter an active queued renderer');
  await settle(f);
}
{
  const f=fixture();let release;
  const fetch=f.box.fetchSeasonLeagueState;f.box.fetchSeasonLeagueState=()=>new Promise(resolve=>release=async()=>resolve(await fetch()));
  const boot=f.box.bootstrapSeasonWorkspace();f.box.queueSeasonRerender();
  await Promise.resolve();assert.equal(f.stats().passes,0);
  assert.equal(vm.runInContext('seasonRenderQueued',f.box),true,'wake-up must remain queued while bootstrap owns acquisition');
  await release();await boot;await settle(f);assert.match(f.els.waiverStatus.textContent,/Decision Board/);
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
console.log('DECISION_LIFECYCLE_PASS: actual runtime; 12 cold/warm cases, six bounded-expiry/recovery cases, burst coalescing/max concurrency 1; context/revision and cache rejection. Domain scoring stubbed; no Android acceptance claim.');
