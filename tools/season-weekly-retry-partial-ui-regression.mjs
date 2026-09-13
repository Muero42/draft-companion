import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import evidence from '../weekly-evidence-v2.js';

const app=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');
function sourceOf(name){
  let start=app.indexOf(`function ${name}(`);assert(start>=0,`${name} missing`);
  if(app.slice(Math.max(0,start-6),start)==='async ')start-=6;
  const brace=app.indexOf('){',start)+1;assert(brace>0,`${name} body missing`);let depth=0;
  for(let i=brace;i<app.length;i++){
    if(app[i]==='{')depth++;
    else if(app[i]==='}'&&--depth===0)return app.slice(start,i+1);
  }
  throw new Error(`${name} unterminated`);
}

const cache=new Map(),store={
  get:(key,fallback)=>cache.has(key)?cache.get(key):fallback,
  set:(key,value)=>{cache.set(key,value);return true}
};
const els={seasonRankingAge:{textContent:'',className:''},seasonRankingStatus:{textContent:'',className:''}};
const context={Date,Number,String,Array,Object,Math,store,els,WEEKLY_PROJECTION_POSITIONS:['QB','RB','WR','TE'],SEASON_RANKING_AUTO_MS:3*60*60*1000,seasonRankingRefreshBusy:false,PittiWeeklyEvidenceV2:evidence,FP_DIAGNOSTIC_TIMEOUT_MS:10_000,AbortController,setTimeout,clearTimeout,els:{...els,apiKey:{value:'test-key'}}};
context.globalThis=context;
vm.createContext(context);
vm.runInContext([sourceOf('codedError'),sourceOf('fpProxyRequest'),sourceOf('persistSeasonProjectionRetryAfter'),sourceOf('seasonProjectionCoverage'),sourceOf('renderSeasonRankingFreshness')].join('\n'),context);

const retryKey='pitti.weekly-evidence.v2.retryAfterUntil',observedAt=1_000_000;
context.fetch=async()=>({ok:false,status:429,headers:{get:name=>name.toLowerCase()==='retry-after'?'120':null},text:async()=>''});
const malformed429=await Promise.allSettled([context.fpProxyRequest('/nfl/2026/projections?week=7&position=WR')]);
context.persistSeasonProjectionRetryAfter(malformed429,observedAt);
assert.equal(cache.get(retryKey),observedAt+120_000,'non-JSON HTTP 429 must carry Retry-After through settled-result persistence');
cache.delete(retryKey);
context.persistSeasonProjectionRetryAfter([
  {status:'rejected',reason:{status:429,retryAfterMs:30_000}},
  {status:'fulfilled',value:['RB',{}]}
],observedAt);
assert.equal(cache.get(retryKey),observedAt+30_000,'partial success must still persist provider backoff');
context.persistSeasonProjectionRetryAfter([
  {status:'rejected',reason:{status:429,retryAfterMs:20_000}},
  {status:'rejected',reason:{status:429,retryAfterMs:90_000}},
  {status:'rejected',reason:{status:503,retryAfterMs:45_000}}
],observedAt);
assert.equal(cache.get(retryKey),observedAt+90_000,'maximum valid settled Retry-After must win');
cache.set(retryKey,observedAt+180_000);
context.persistSeasonProjectionRetryAfter([
  {status:'rejected',reason:{status:429,retryAfterMs:120_000}},
  {status:'rejected',reason:{status:429,retryAfterMs:60_000}}
],observedAt);
assert.equal(cache.get(retryKey),observedAt+180_000,'an existing later provider backoff must never be shortened');

const refresh=app.slice(app.indexOf('async function refreshSeasonRankings('),app.indexOf('\nconst SEASON_TRADE_VALUE_AUTO_MS'));
const settleAt=refresh.indexOf('const responses=await Promise.allSettled'),persistAt=refresh.indexOf('persistSeasonProjectionRetryAfter(responses'),snapshotAt=refresh.indexOf('const projectionSnapshot=api.buildSnapshot'),failureAt=refresh.indexOf("throw codedError('PROJECTION_LANE_UNAVAILABLE'");
assert(settleAt>=0&&persistAt>settleAt&&snapshotAt>persistAt&&failureAt>persistAt,'provider backoff must persist before partial publication or all-position fail-closed');
assert.match(refresh,/response\.status===429\?'HTTP_429'/,'HTTP 429 must remain a no-success projection result');

const now=Date.now(),season=2026,week=1,counts=evidence.MIN_COUNTS,players={},payloads={};let id=1;
for(const [position,count] of Object.entries(counts)){
  const rows=[];
  for(let i=0;i<count;i++,id++){
    players[id]={full_name:`${position} ${i}`,position,team:'AAA',fantasy_data_id:10_000+id};
    rows.push({fpid:10_000+id,name:`${position} ${i}`,position_id:position,team_id:'AAA',stats:{points_half:10}});
  }
  payloads[position]={season,week,players:rows};
}
const partial=evidence.buildSnapshot({season,week,scoring:'HALF',projectionPayloads:{QB:payloads.QB,RB:payloads.RB,TE:payloads.TE},sleeperPlayers:players,verifiedAt:now});
assert.equal(partial.lanes.projections.status,'PARTIAL');
assert.equal(partial.lanes.projections.coverage.positions.WR.status,'UNAVAILABLE');
cache.set(evidence.CACHE_KEY,partial);
context.renderSeasonRankingFreshness('Refresh abgeschlossen');
assert.match(els.seasonRankingStatus.className,/warn/,'partial completion must be a warning rather than success');
assert.match(els.seasonRankingStatus.textContent,/Projections PARTIAL.*QB AVAILABLE.*RB AVAILABLE.*WR UNAVAILABLE.*TE AVAILABLE/,'partial completion must expose every projection position');
context.renderSeasonRankingFreshness();
assert.match(els.seasonRankingStatus.className,/warn/,'snapshot-backed rerender must preserve partial warning state');
assert.match(els.seasonRankingStatus.textContent,/WR UNAVAILABLE/,'snapshot-backed rerender must preserve failed-position honesty');

const healthy=evidence.buildSnapshot({season,week,scoring:'HALF',projectionPayloads:payloads,sleeperPlayers:players,verifiedAt:now});
cache.set(evidence.CACHE_KEY,healthy);
context.renderSeasonRankingFreshness();
assert.match(els.seasonRankingStatus.className,/ok/,'all healthy positions retain the normal success state');
assert.match(els.seasonRankingStatus.textContent,/Projections AVAILABLE.*QB AVAILABLE.*RB AVAILABLE.*WR AVAILABLE.*TE AVAILABLE/);

console.log('SEASON_WEEKLY_RETRY_PARTIAL_UI_REGRESSION_PASS');
