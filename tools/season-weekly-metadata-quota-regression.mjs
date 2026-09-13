import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const app=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');
function sourceOf(name,{async=false}={}){
  const marker=`${async?'async ':''}function ${name}(`,start=app.indexOf(marker);
  assert(start>=0,`${name} missing`);
  const brace=app.indexOf('){',start)+1;let depth=0;
  for(let i=brace;i<app.length;i++){
    if(app[i]==='{')depth++;
    else if(app[i]==='}'&&--depth===0)return app.slice(start,i+1);
  }
  throw new Error(`${name} unterminated`);
}

const retryKey='pitti.weekly-evidence.v2.retryAfterUntil',lastSuccessKey='pitti.weekly-evidence.v2.lastSuccess';
const cache=new Map(),quotaKeys=new Set([retryKey,lastSuccessKey]),store={
  get:(key,fallback)=>cache.has(key)?cache.get(key):fallback,
  set:(key,value)=>{if(quotaKeys.has(key))throw Object.assign(new Error('quota full'),{name:'QuotaExceededError'});cache.set(key,value);return true}
};
const positions=['QB','RB','WR','TE'],records=[...Array(8)].map((_,i)=>({metric:'projected_points',playerId:String(i)}));
const projectionSnapshot={snapshotId:'projection-partial',lastSuccessAt:100,status:'DEGRADED',records,lanes:{projections:{status:'PARTIAL',coverage:{positions:{QB:{status:'AVAILABLE'},RB:{status:'AVAILABLE'},WR:{status:'UNAVAILABLE'},TE:{status:'AVAILABLE'}}}},expertWeeklyRanks:{status:'UNAVAILABLE'}},panel:{weeklyRank:{status:'UNAVAILABLE'}}};
const finalCandidate={...projectionSnapshot,snapshotId:'full-before-quota',records:[...records,{metric:'weekly_rank',playerId:'rank'}],lanes:{...projectionSnapshot.lanes,expertWeeklyRanks:{status:'AVAILABLE'}},panel:{weeklyRank:{status:'BROAD_CONSENSUS_ONLY'}}};
const persistedFallback={...projectionSnapshot,snapshotId:'full-before-quota',persistence:{mode:'LOCAL_STORAGE_PROJECTION_ONLY'},lanes:{...projectionSnapshot.lanes,expertWeeklyRanks:{status:'UNAVAILABLE',reason:'STORAGE_QUOTA_PROJECTION_ONLY'}}};
let writes=0,rerenders=0,renderedSnapshot=null;
const api={CACHE_KEY:'weekly',buildSnapshot:({rankingPayloads})=>Object.keys(rankingPayloads||{}).length?finalCandidate:projectionSnapshot,atomicWrite(storage,candidate){
  writes++;
  const actual=writes===1?{...projectionSnapshot,refreshStage:candidate.refreshStage}:persistedFallback;
  cache.set(this.CACHE_KEY,actual);
  return actual;
}};
const els={season:{value:'2026'},scoring:{value:'HALF'},seasonRefreshEvidenceBtn:{disabled:false},seasonRankingStatus:{className:'',textContent:''}};
const context={
  Date:{now:()=>1_000},Number,String,Array,Object,Math,Promise,console,
  WEEKLY_PROJECTION_POSITIONS:positions,SEASON_RANKING_AUTO_MS:1,SEASON_RANKING_RETRY_MS:1,
  seasonRankingRefreshBusy:false,store,els,navigator:{onLine:true},lastDraftContext:{players:{},season:{}},localStorage:{},
  currentSleeperNflWeek:async()=>7,
  fpProxyRequest:async path=>{
    if(path.includes('/projections')&&path.includes('position=WR'))return{ok:false,status:429,retryAfterMs:120_000,data:null};
    return{ok:true,status:200,data:path.includes('consensus-rankings')?{rank:true}:{projection:true}};
  },
  fetch:async()=>({ok:false,status:503,json:async()=>({})}),
  codedError:(code,message,status)=>Object.assign(new Error(message),{code,status}),
  renderSeasonRankingFreshness:note=>{renderedSnapshot=cache.get(api.CACHE_KEY);els.seasonRankingStatus.textContent=note},
  rerenderPostDraftFromContext:()=>{rerenders++},PittiWeeklyEvidenceV2:api
};
context.globalThis=context;
vm.createContext(context);
vm.runInContext([
  sourceOf('persistSeasonProjectionRetryAfter'),
  sourceOf('persistSeasonWeeklyMetadata'),
  sourceOf('refreshSeasonRankings',{async:true})
].join('\n'),context);

const result=await context.refreshSeasonRankings({force:true,trigger:'metadata-quota-regression'});
assert.equal(writes,2,'Retry-After quota failure must not block projection-stage or final publication');
assert.equal(cache.get(api.CACHE_KEY),persistedFallback,'the successful final fallback must remain authoritative');
assert.equal(result.ok,true,'post-commit metadata quota failure must not become an outer refresh failure');
assert.equal(result.snapshotId,persistedFallback.snapshotId);
assert.equal(result.count,persistedFallback.records.length);
assert.equal(result.status,'DEGRADED');
assert.equal(result.projectionStatus,'PARTIAL');
assert.equal(result.rankStatus,'UNAVAILABLE');
assert.equal(rerenders,1,'the persisted fallback must rerender normally');
assert.equal(renderedSnapshot,persistedFallback,'the freshness renderer must observe the actual persisted fallback');
assert.match(els.seasonRankingStatus.textContent,/Ranks UNAVAILABLE/);
assert.doesNotMatch(els.seasonRankingStatus.textContent,/letzter verifizierter Stand bleibt unverändert/);
assert.equal(cache.has(retryKey),false,'failed auxiliary Retry-After persistence must remain best-effort');
assert.equal(cache.has(lastSuccessKey),false,'failed last-success side-key persistence must remain best-effort');

const retrySource=sourceOf('persistSeasonProjectionRetryAfter');
assert.match(retrySource,/Math\.max\(current,next\)/,'Retry-After persistence must retain max/non-shortening semantics');
assert.match(retrySource,/try\{store\.set\(key,until\)\}catch/,'Retry-After side-key write must be quota-safe');

console.log('SEASON_WEEKLY_METADATA_QUOTA_REGRESSION_PASS');
