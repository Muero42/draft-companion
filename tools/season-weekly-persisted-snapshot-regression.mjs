import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const app=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');
function sourceOf(name,{async=false}={}){
  const marker=`${async?'async ':''}function ${name}(`,start=app.indexOf(marker);
  assert(start>=0,`${name} missing`);
  const brace=app.indexOf('){',start)+1;let depth=0;
  assert(brace>0,`${name} body missing`);
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
const positions=['QB','RB','WR','TE'],fullRecords=[...Array(12)].map((_,i)=>({metric:i<8?'projected_points':'weekly_rank',playerId:String(i)}));
const projectionSnapshot={snapshotId:'projection-stage',lastSuccessAt:100,status:'DEGRADED',records:fullRecords.slice(0,8),lanes:{projections:{status:'AVAILABLE',coverage:{positions:Object.fromEntries(positions.map(p=>[p,{status:'AVAILABLE'}]))}},expertWeeklyRanks:{status:'UNAVAILABLE'}},panel:{weeklyRank:{status:'UNAVAILABLE'}}};
const fullSnapshot={...projectionSnapshot,snapshotId:'full-before-quota',status:'AVAILABLE',records:fullRecords,lanes:{...projectionSnapshot.lanes,expertWeeklyRanks:{status:'AVAILABLE'}},panel:{weeklyRank:{status:'BROAD_CONSENSUS_ONLY'}}};
const persistedFallback={...projectionSnapshot,snapshotId:'full-before-quota',status:'DEGRADED',persistence:{mode:'LOCAL_STORAGE_PROJECTION_ONLY'},lanes:{...projectionSnapshot.lanes,expertWeeklyRanks:{status:'UNAVAILABLE',reason:'STORAGE_QUOTA_PROJECTION_ONLY'}},panel:{weeklyRank:{status:'UNAVAILABLE'}}};
let writes=0,rerenders=0,renderedSnapshot=null;
const api={CACHE_KEY:'weekly',buildSnapshot:({rankingPayloads})=>Object.keys(rankingPayloads||{}).length?fullSnapshot:projectionSnapshot,atomicWrite(storage,candidate){
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
  currentSleeperNflWeek:async()=>7,fpProxyRequest:async path=>({ok:true,status:200,data:path.includes('consensus-rankings')?{rank:true}:{projection:true}}),
  fetch:async()=>({ok:false,status:503,json:async()=>({})}),
  codedError:(code,message)=>Object.assign(new Error(message),{code}),persistSeasonProjectionRetryAfter:()=>0,
  persistSeasonWeeklyMetadata:(key,value)=>store.set(key,value),
  renderSeasonRankingFreshness:note=>{renderedSnapshot=cache.get(api.CACHE_KEY);els.seasonRankingStatus.textContent=note},
  rerenderPostDraftFromContext:()=>{rerenders++},PittiWeeklyEvidenceV2:api
};
context.globalThis=context;
vm.createContext(context);
vm.runInContext(sourceOf('refreshSeasonRankings',{async:true}),context);

const result=await context.refreshSeasonRankings({force:true,trigger:'quota-regression'});
assert.equal(writes,2,'projection-stage and final snapshots must both be persisted');
assert.equal(result.snapshotId,persistedFallback.snapshotId);
assert.equal(result.status,'DEGRADED');
assert.equal(result.count,persistedFallback.records.length);
assert.equal(result.rankStatus,'UNAVAILABLE');
assert.equal(cache.get('pitti.weekly-evidence.v2.lastSuccess'),persistedFallback.lastSuccessAt);
assert.equal(rerenders,1);
assert.equal(renderedSnapshot,persistedFallback,'post-refresh renderer must observe the exact quota fallback returned by atomicWrite');
assert.match(els.seasonRankingStatus.textContent,new RegExp(`${persistedFallback.records.length} Records`));
assert.match(els.seasonRankingStatus.textContent,/Ranks UNAVAILABLE/);
assert.doesNotMatch(els.seasonRankingStatus.textContent,/Ranks AVAILABLE/);

const refreshSource=sourceOf('refreshSeasonRankings',{async:true});
assert.match(refreshSource,/persistedProjectionSnapshot=api\.atomicWrite/);
assert.match(refreshSource,/priorSnapshot:persistedProjectionSnapshot/);
assert.match(refreshSource,/const persistedSnapshot=api\.atomicWrite/);

// Once the projection-stage commit succeeds it is authoritative minimum
// progress, even if the later full write and its internal projection-only quota
// fallback both fail (represented by atomicWrite throwing on the final call).
writes=0;renderedSnapshot=null;
api.atomicWrite=function(storage,candidate){
  writes++;
  if(writes===2)throw Object.assign(new Error('final and fallback quota failure'),{code:'STORAGE_QUOTA_EXCEEDED'});
  const actual={...projectionSnapshot,refreshStage:candidate.refreshStage};cache.set(this.CACHE_KEY,actual);return actual;
};
const degradedResult=await context.refreshSeasonRankings({force:true,trigger:'final-write-failure-regression'});
assert.equal(writes,2);
assert.equal(degradedResult.ok,true,'a committed projection stage must not be reported as generic stale-state failure');
assert.equal(degradedResult.degraded,true);
assert.equal(degradedResult.snapshotId,projectionSnapshot.snapshotId);
assert.equal(degradedResult.rankStatus,'UNAVAILABLE');
assert.equal(cache.get(api.CACHE_KEY).snapshotId,projectionSnapshot.snapshotId,'cache must retain the committed projection-stage authority');
assert.equal(renderedSnapshot.snapshotId,projectionSnapshot.snapshotId,'rerender must use committed projection-stage authority');
assert.match(els.seasonRankingStatus.textContent,/Projektionen gespeichert/);
assert.match(els.seasonRankingStatus.textContent,/Rank-Persistenz fehlgeschlagen/);
assert.doesNotMatch(els.seasonRankingStatus.textContent,/letzter verifizierter Stand bleibt unverändert/);
assert.equal(vm.runInContext('seasonRankingRefreshBusy',context),false,'busy state must reset after final persistence failure');

console.log('SEASON_WEEKLY_PERSISTED_SNAPSHOT_REGRESSION_PASS');
