import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const app=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');
function sourceOf(name,{async=false}={}){
  const marker=`${async?'async ':''}function ${name}(`,start=app.indexOf(marker);assert(start>=0,`${name} missing`);
  const brace=app.indexOf('){',start)+1;let depth=0;
  for(let i=brace;i<app.length;i++){if(app[i]==='{')depth++;else if(app[i]==='}'&&--depth===0)return app.slice(start,i+1);}
  throw new Error(`${name} unterminated`);
}
const positions=['QB','RB','WR','TE'],retryKey='pitti.weekly-evidence.v2.retryAfterUntil';
async function run({projectionFailures={},rankFailures={},existingRetry=0,malformedProjectionPosition=null}={}){
  const cache=new Map(existingRetry?[[retryKey,existingRetry]]:[]);let calls=0,writes=0,capturedProjectionPayloads=null;
  const store={get:(key,fallback)=>cache.has(key)?cache.get(key):fallback,set:(key,value)=>{cache.set(key,value)}};
  const projection={snapshotId:'projection',lastSuccessAt:1000,status:'DEGRADED',records:[{metric:'projected_points'}],lanes:{projections:{status:'AVAILABLE',coverage:{positions:Object.fromEntries(positions.map(p=>[p,{status:'AVAILABLE'}]))}},expertWeeklyRanks:{status:'UNAVAILABLE'}},panel:{weeklyRank:{status:'UNAVAILABLE'}}};
  const final={...projection,snapshotId:'final'};
  const api={CACHE_KEY:'weekly',buildSnapshot:({projectionPayloads,rankingPayloads})=>{if(!capturedProjectionPayloads)capturedProjectionPayloads=projectionPayloads;return Object.keys(rankingPayloads||{}).length?final:projection},atomicWrite(storage,value){writes++;cache.set(this.CACHE_KEY,value);return value}};
  const context={Date:{now:()=>1000},Number,String,Array,Object,Math,Promise,console,WEEKLY_PROJECTION_POSITIONS:positions,SEASON_RANKING_AUTO_MS:1,SEASON_RANKING_RETRY_MS:1,seasonRankingRefreshBusy:false,store,els:{season:{value:'2026'},scoring:{value:'HALF'},seasonRefreshEvidenceBtn:{},seasonRankingStatus:{}},navigator:{onLine:true},lastDraftContext:{players:{},season:{}},localStorage:{},currentSleeperNflWeek:async()=>1,
    fpProxyRequest:async (path,options)=>{calls++;const position=new URLSearchParams(path.split('?')[1]).get('position'),isProjection=path.includes('/projections'),failure=isProjection?projectionFailures[position]:rankFailures[position];if(failure?.reject)throw Object.assign(new Error('malformed 429'),failure);if(failure)return{ok:false,status:failure.status,retryAfterMs:failure.retryAfterMs,data:null};if(isProjection&&position===malformedProjectionPosition){assert.equal(options?.preserveMalformed,true);return{ok:true,status:200,data:null,bodyState:'INVALID_JSON'}}return{ok:true,status:200,data:{},bodyState:'JSON'}},
    fetch:async()=>({ok:false,status:503,json:async()=>({})}),codedError:(code,message,status)=>Object.assign(new Error(message),{code,status}),persistSeasonWeeklyMetadata:(key,value)=>store.set(key,value),renderSeasonRankingFreshness:()=>{},rerenderPostDraftFromContext:()=>{},PittiWeeklyEvidenceV2:api};
  context.globalThis=context;vm.createContext(context);vm.runInContext([sourceOf('persistSeasonProjectionRetryAfter'),sourceOf('refreshSeasonRankings',{async:true})].join('\n'),context);
  return{result:await context.refreshSeasonRankings({force:true}),cache,calls,writes,get capturedProjectionPayloads(){return capturedProjectionPayloads}};
}

const rankOnly=await run({rankFailures:{QB:{status:429,retryAfterMs:30_000},RB:{reject:true,status:429,retryAfterMs:90_000}}});
assert.equal(rankOnly.result.ok,true,'optional rank 429s must not become projection failure');
assert.equal(rankOnly.cache.get(retryKey),91_000,'normal and malformed rank 429 paths must preserve their maximum Retry-After');
const combined=await run({projectionFailures:{WR:{status:429,retryAfterMs:120_000}},rankFailures:{QB:{status:429,retryAfterMs:180_000}}});
assert.equal(combined.cache.get(retryKey),181_000,'rank persistence must lengthen, never shorten, a projection-lane deadline');
const unrelated=await run({rankFailures:{QB:{status:503},RB:{reject:true,status:503}}});
assert.equal(unrelated.result.ok,true);
assert.equal(unrelated.cache.has(retryKey),false,'unrelated optional non-429 failures must not create Retry-After state');
const malformedSuccess=await run({malformedProjectionPosition:'QB'});
assert(Object.prototype.hasOwnProperty.call(malformedSuccess.capturedProjectionPayloads,'QB'),'invalid-JSON HTTP success must not disappear through Promise.allSettled');
assert.equal(malformedSuccess.capturedProjectionPayloads.QB.providerPayload,null);
assert.equal(JSON.stringify(malformedSuccess.capturedProjectionPayloads.QB.providerResponse),JSON.stringify({present:true,bodyState:'INVALID_JSON'}));
const gated=await run({existingRetry:200_000});
assert.equal(gated.result.skipped,'retry-after','manual force refresh must honor persisted Retry-After');
assert.equal(gated.calls,0);
assert.equal(gated.writes,0);
console.log('SEASON_WEEKLY_RANK_RETRY_REGRESSION_PASS');
