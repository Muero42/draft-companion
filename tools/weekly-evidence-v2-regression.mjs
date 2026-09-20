import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {execFileSync} from 'node:child_process';
import evidence from '../weekly-evidence-v2.js';

const now=Date.parse('2026-09-10T12:00:00Z'),season=2026,week=1;
const appSource=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');
const workerSource=fs.readFileSync(new URL('../_worker.js',import.meta.url),'utf8');
const evidenceSource=fs.readFileSync(new URL('../weekly-evidence-v2.js',import.meta.url),'utf8');
assert(!/projections\?[^`'"\n]*scoring=HALF/.test(appSource+workerSource),'NFL projections must never reintroduce the unsupported scoring=HALF request parameter');
assert(!/projections\?[^`'"\n]*ros=false/.test(appSource+workerSource+evidenceSource),'weekly FantasyPros projection requests and source URLs must omit ros');
assert.deepEqual(evidence.WEEKLY_HALF_PPR_MAX,{QB:80,RB:70,WR:70,TE:70},'canonical weekly Half-PPR safety ceilings must remain intact');
const counts={QB:24,RB:60,WR:70,TE:24},players={},payloads={};
let id=1;
for(const [position,count] of Object.entries(counts)){
  const rows=[];
  for(let i=0;i<count;i++,id++){
    players[String(id)]={full_name:`${position} Player ${i}`,position,team:'AAA',fantasy_data_id:10000+id};
    rows.push({fpid:10000+id,name:`${position} Player ${i}`,position_id:position,team_id:'AAA',stats:{points:999,points_half:20-i/100}});
  }
  payloads[position]={providerPayload:{season,week,scoring:'STD',positions:position,updated:'2026-09-10',players:rows},requestProvenance:{season,week,position,scope:'WEEKLY',queryShape:evidence.WEEKLY_PROJECTION_QUERY_SHAPE}};
}

const snapshot=evidence.buildSnapshot({season,week,scoring:'HALF',projectionPayloads:payloads,sleeperPlayers:players,verifiedAt:now});
assert.equal(snapshot.schema,'pitti.weekly-evidence.v3');
assert.equal(snapshot.lanes.projections.status,'AVAILABLE');
assert.equal(snapshot.records.length,Object.values(counts).reduce((a,b)=>a+b,0));
assert(snapshot.records.every(r=>r.metric==='projected_points'&&r.value!==999&&r.provenance.field==='stats.points_half'));
assert(snapshot.records.every(r=>r.sourcePublishedAt===null&&r.sourcePublishedDate==='2026-09-10'&&r.sourceTimePrecision==='DATE'),'date-only source precision must never be fabricated into a timestamp');
assert(snapshot.records.every(r=>r.provenance.providerScoring==='STD'&&!Object.prototype.hasOwnProperty.call(r.provenance.request,'ros')&&!new URL(r.sourceUrl).searchParams.has('ros')&&!new URL(r.sourceUrl).searchParams.has('scoring')),'provider STD metadata must not suppress valid stats.points_half or fabricate ROS/scoring request provenance');
assert.deepEqual(evidence.validateSnapshot(snapshot,{season,week,scoring:'HALF_PPR'},now),{ok:true});
assert.equal(evidence.validateSnapshot(snapshot,{season,week:2,scoring:'HALF_PPR'},now).reason,'CONTEXT_MISMATCH');
assert.equal(evidence.validateSnapshot(snapshot,{season,week,scoring:'PPR'},now).reason,'CONTEXT_MISMATCH');
assert.equal(evidence.validateSnapshot(snapshot,{season,week,scoring:'HALF'},now+evidence.MAX_AGE_MS+1).reason,'STALE');

// rc4.199 physical failure: season/ROS-scale WR values must fail the entire WR
// position independently and can never enter a verified consumer record.
const seasonScaleWr=structuredClone(payloads);
for(const [i,value] of [270.6,224.8,210.6].entries())seasonScaleWr.WR.providerPayload.players[i].stats.points_half=value;
const semanticMismatch=evidence.buildSnapshot({season,week,scoring:'HALF',projectionPayloads:seasonScaleWr,sleeperPlayers:players,verifiedAt:now});
assert.equal(semanticMismatch.lanes.projections.coverage.positions.WR.status,'UNAVAILABLE');
assert.equal(semanticMismatch.lanes.projections.coverage.positions.WR.reason,'WEEKLY_PROJECTION_SEMANTIC_SCOPE_MISMATCH');
assert(!semanticMismatch.records.some(record=>record.position==='WR'&&record.metric==='projected_points'),'season-scale WR values cannot reach Start/Sit, Waiver, or Trade consumers');
assert.equal(semanticMismatch.lanes.projections.coverage.positions.RB.status,'AVAILABLE','a corrupt WR response must not erase a healthy position');
for(const position of evidence.POSITIONS){
  const outOfSafety=structuredClone(payloads);
  outOfSafety[position].providerPayload.players[0].stats.points_half=evidence.WEEKLY_HALF_PPR_MAX[position]+1;
  const rejected=evidence.buildSnapshot({season,week,scoring:'HALF',projectionPayloads:outOfSafety,sleeperPlayers:players,verifiedAt:now});
  assert.equal(rejected.lanes.projections.coverage.positions[position].reason,'WEEKLY_PROJECTION_SEMANTIC_SCOPE_MISMATCH',`${position} values above the canonical ceiling must fail closed`);
  assert(!rejected.records.some(record=>record.position===position&&record.metric==='projected_points'),`${position} out-of-safety evidence must not reach consumers`);
}

// Client request context is provenance, never provider proof. Missing or wrong
// upstream scope remains unavailable even when the request asked for Week 1 HALF.
const missingProviderScope={providerPayload:{players:payloads.QB.providerPayload.players},requestProvenance:{season,week,position:'QB',scope:'WEEKLY',queryShape:evidence.WEEKLY_PROJECTION_QUERY_SHAPE}};
const manufactured=evidence.buildSnapshot({season,week,scoring:'HALF',projectionPayloads:{QB:missingProviderScope},sleeperPlayers:players,verifiedAt:now});
assert.equal(manufactured.lanes.projections.coverage.positions.QB.status,'UNAVAILABLE');
assert.equal(manufactured.records.length,0);

// Existing rc4.199 v2 cache bytes are automatically invalid after the semantic
// schema upgrade and cannot be retained as prior weekly evidence.
const rc4199Persisted={...structuredClone(snapshot),schema:'pitti.weekly-evidence.v2',records:snapshot.records.map(record=>({...record,schema:'pitti.weekly-evidence.v2',value:record.position==='WR'?270.6:record.value}))};
assert.equal(evidence.validateSnapshot(rc4199Persisted,{season,week,scoring:'HALF'},now).reason,'SCHEMA');
const upgraded=evidence.buildSnapshot({season,week,scoring:'HALF',projectionPayloads:{RB:payloads.RB},sleeperPlayers:players,priorSnapshot:rc4199Persisted,verifiedAt:now+1000});
assert(!upgraded.records.some(record=>record.position==='WR'),'invalid rc4.199 evidence must not carry forward after upgrade');

const indexes=evidence.sleeperIndexes({...players,collision:{full_name:'QB Player 0',position:'QB',team:'AAA'}});
assert.equal(evidence.mapFantasyProsPlayer({name:'QB Player 0',position_id:'QB',team_id:'AAA'},indexes).reason,'NAME_POSITION_COLLISION');
assert.equal(evidence.mapFantasyProsPlayer({name:'QB Player 1',position_id:'QB',team_id:'BBB'},indexes).reason,'TEAM_MISMATCH');
const lawrenceIndexes=evidence.sleeperIndexes({'7523':{full_name:'Trevor Lawrence',position:'QB',team:'JAX',fantasy_data_id:22490}});
assert.deepEqual(evidence.mapFantasyProsPlayer({fpid:999999,name:'Trevor Lawrence',position_id:'QB',team_id:'JAC'},lawrenceIndexes),{ok:true,player:{id:'7523',name:'Trevor Lawrence',position:'QB',team:'JAX'},method:'EXACT_NAME_POSITION_TEAM',sourcePlayerId:'999999'},'FantasyPros JAC and Sleeper JAX are the same verified franchise identity');
assert.equal(evidence.mapFantasyProsPlayer({fpid:999999,name:'Trevor Lawrence',position_id:'QB',team_id:'TEN'},lawrenceIndexes).reason,'TEAM_MISMATCH','canonical aliasing must not weaken cross-team rejection');

const wrong={...payloads,QB:{...payloads.QB,providerPayload:{...payloads.QB.providerPayload,week:2}}};
const unavailable=evidence.buildSnapshot({season,week,scoring:'HALF',projectionPayloads:wrong,sleeperPlayers:players,verifiedAt:now});
assert.equal(unavailable.lanes.projections.status,'PARTIAL');
assert.equal(unavailable.records.length,Object.values(counts).reduce((a,b)=>a+b,0)-counts.QB,'healthy positions must remain independently publishable');
assert(!unavailable.records.some(record=>record.position==='QB'),'the failed fresh position must remain unavailable');
assert.deepEqual(evidence.validateSnapshot(unavailable,{season,week,scoring:'HALF_PPR'},now),{ok:true},'record-valid partial projection evidence remains consumable');
const retained=evidence.buildSnapshot({season,week,scoring:'HALF',projectionPayloads:wrong,sleeperPlayers:players,priorSnapshot:snapshot,verifiedAt:now+1000});
assert(!retained.records.some(record=>record.position==='QB'),'a present wrong-week response must purge prior failed-position records');
assert.equal(retained.lanes.projections.coverage.positions.QB.responseClassification,'DEFINITIVE_REJECTION');
// An AVAILABLE position is a complete authoritative refresh. If a formerly
// projected player disappears, that old row must disappear too; only lanes that
// failed to refresh may retain chronology-valid prior evidence.
const omittedRbId=snapshot.records.find(record=>record.position==='RB').playerId,newRbId='fresh-rb-replacement';
const refreshedPlayers={...players,[newRbId]:{full_name:'RB Fresh Replacement',position:'RB',team:'AAA',fantasy_data_id:999999}};
const refreshedRb={...payloads.RB,providerPayload:{...payloads.RB.providerPayload,players:[...payloads.RB.providerPayload.players.slice(1),{fpid:999999,name:'RB Fresh Replacement',position_id:'RB',team_id:'AAA',stats:{points_half:9.5}}]}};
const authoritativeRb=evidence.buildSnapshot({season,week,scoring:'HALF',projectionPayloads:{...wrong,RB:refreshedRb},sleeperPlayers:refreshedPlayers,priorSnapshot:snapshot,verifiedAt:now+1000});
assert.equal(authoritativeRb.lanes.projections.coverage.positions.RB.status,'AVAILABLE');
assert(!authoritativeRb.records.some(record=>record.metric==='projected_points'&&record.position==='RB'&&record.playerId===omittedRbId),'an AVAILABLE RB refresh must remove an omitted prior RB immediately');
assert(!authoritativeRb.records.some(record=>record.metric==='projected_points'&&record.position==='QB'),'a definitive failed QB lane must not retain chronology-valid prior projections');
// A mapped fresh response cannot claim replacement ownership until its provider
// chronology passes the same validation used by consumers. Another healthy position
// makes this a production-shaped partial snapshot that is actually publishable.
const futureChronology={...payloads,QB:{...payloads.QB,providerPayload:{...payloads.QB.providerPayload,updated:'2026-09-11T12:00:00Z'}}};
const chronologyRetained=evidence.buildSnapshot({season,week,scoring:'HALF',projectionPayloads:futureChronology,sleeperPlayers:players,priorSnapshot:snapshot,verifiedAt:now+1000});
assert.equal(chronologyRetained.lanes.projections.coverage.positions.QB.status,'PARTIAL');
assert.equal(chronologyRetained.lanes.projections.coverage.positions.RB.status,'AVAILABLE','another healthy position keeps the partial snapshot publishable');
assert.equal(chronologyRetained.lanes.projections.coverage.positions.QB.responseClassification,'DEFINITIVE_REJECTION');
assert.equal(chronologyRetained.records.filter(record=>record.position==='QB').length,0,'a present response with invalid chronology must purge prior projections');
const chronologyStorage=new Map(),chronologyStore={setItem:(key,value)=>chronologyStorage.set(key,value),getItem:key=>chronologyStorage.get(key)??null,removeItem:key=>chronologyStorage.delete(key)};
evidence.atomicWrite(chronologyStore,chronologyRetained);
assert.equal(JSON.parse(chronologyStorage.get(evidence.CACHE_KEY)).records.filter(record=>record.position==='QB').length,0,'persisted partial snapshot must exclude definitively rejected evidence');
const allFailed=evidence.buildSnapshot({season,week,scoring:'HALF',projectionPayloads:{},sleeperPlayers:players,priorSnapshot:snapshot,verifiedAt:now+2000});
assert.equal(allFailed.lanes.projections.status,'UNAVAILABLE');
assert.equal(allFailed.lastSuccessAt,snapshot.lastSuccessAt,'an all-position failure cannot claim a fresh success');
assert.equal(allFailed.lanes.projections.coverage.positions.QB.reason,'NO_CURRENT_PROVIDER_RESPONSE','an absent response must be classified before provider season fields are inspected');
assert.equal(allFailed.lanes.projections.coverage.positions.QB.responseClassification,'ABSENT_TRANSIENT');
assert(allFailed.records.some(record=>record.metric==='projected_points'&&record.position==='QB'&&record.verifiedAt===now),'an absent/transient lane retains chronology-valid stale fallback without restamping');

const memory=new Map(),storage={setItem(k,v){memory.set(k,v)},getItem:k=>memory.get(k)??null,removeItem:k=>memory.delete(k)};
evidence.atomicWrite(storage,snapshot);
assert.equal(JSON.parse(memory.get(evidence.CACHE_KEY)).snapshotId,snapshot.snapshotId);
assert.equal(memory.has(evidence.TEMP_KEY),false);

// A failed replacement must preserve the previously verified current snapshot.
const prior='{"schema":"old","snapshotId":"keep"}',failingMemory=new Map([[evidence.CACHE_KEY,prior]]),failingStorage={
  setItem(k,v){if(k===evidence.CACHE_KEY){const e=new Error('quota');e.name='QuotaExceededError';e.code=22;throw e}failingMemory.set(k,v)},
  getItem:k=>failingMemory.get(k)??null,
  removeItem:k=>failingMemory.delete(k)
};
assert.throws(()=>evidence.atomicWrite(failingStorage,snapshot),e=>e?.code==='STORAGE_QUOTA_EXCEEDED');
assert.equal(failingStorage.getItem(evidence.CACHE_KEY),prior,'failed atomic publish must preserve the prior current snapshot');
assert.equal(failingMemory.has(evidence.TEMP_KEY),false,'quota failure must not strand a second full pending snapshot');

// A stale pending copy from the old double-staging implementation is safe to remove.
const text=JSON.stringify(snapshot),pressureMemory=new Map([
  [evidence.CACHE_KEY,prior],
  [evidence.TEMP_KEY,'x'.repeat(text.length)],
  ['v118_decisionFixtures','ACTIVE_EVIDENCE']
]);
const pressureLimit=text.length+prior.length+'ACTIVE_EVIDENCE'.length+256;
const pressureStorage={
  setItem(k,v){
    let total=0;
    for(const [key,value] of pressureMemory)total+=key===k?0:String(value).length;
    total+=String(v).length;
    if(total>pressureLimit){const e=new Error('QuotaExceededError');e.name='QuotaExceededError';e.code=22;throw e}
    pressureMemory.set(k,v);
  },
  getItem:k=>pressureMemory.get(k)??null,
  removeItem:k=>pressureMemory.delete(k)
};
evidence.atomicWrite(pressureStorage,snapshot);
assert.equal(JSON.parse(pressureMemory.get(evidence.CACHE_KEY)).snapshotId,snapshot.snapshotId,'direct replacement must succeed without double-staging the payload');
assert.equal(pressureMemory.has(evidence.TEMP_KEY),false,'stale pending snapshot must be removed');
assert.equal(pressureMemory.get('v118_decisionFixtures'),'ACTIVE_EVIDENCE','active decision evidence must never be pruned');

const app=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8'),valueStart=app.indexOf('function seasonEvidenceValue('),valueEnd=app.indexOf('\nfunction seasonEvidenceCache',valueStart),context={Date,Number,String,Array,Object,RegExp,Set,PittiWeeklyEvidenceV2:evidence};
vm.createContext(context);vm.runInContext(app.slice(valueStart,valueEnd)+';globalThis.pick=seasonEvidenceValue;',context);
const picked=context.pick(snapshot.records,snapshot.records[0].playerId,'projected_points',{season,week,scoring:'HALF_PPR'},now+1000);
assert.equal(picked.status,'VERIFIED');
assert.equal(picked.sourcePublishedAt,null,'consumer must not manufacture a timestamp from date-only source metadata');
assert(fs.readFileSync(new URL('../_worker.js',import.meta.url),'utf8').includes("headers['retry-after']=retryAfter"),'proxy must preserve upstream Retry-After for the client lifecycle');

// The production projection response has no provider publication timestamp. Its
// retrieval is explicit and projection-only, while provider publication fields stay null.
const timestampLess=Object.fromEntries(Object.entries(payloads).map(([position,envelope])=>[position,{providerPayload:{season,week,scoring:'STD',positions:position,players:envelope.providerPayload.players.map(row=>({...row}))},requestProvenance:{season,week,position,scope:'WEEKLY',queryShape:evidence.WEEKLY_PROJECTION_QUERY_SHAPE}}]));
const retrievalSnapshot=evidence.buildSnapshot({season,week,scoring:'HALF',projectionPayloads:timestampLess,sleeperPlayers:players,verifiedAt:now});
assert.equal(retrievalSnapshot.lanes.projections.status,'AVAILABLE');
assert(retrievalSnapshot.records.every(row=>row.sourceTimePrecision==='RETRIEVAL'&&row.sourcePublishedAt===null&&row.sourcePublishedDate===null));
const retrievalRecord=retrievalSnapshot.records[0];
assert.equal(context.pick(retrievalSnapshot.records,retrievalRecord.playerId,'projected_points',{season,week,scoring:'HALF_PPR'},now+1000).status,'VERIFIED');
assert(retrievalSnapshot.records.every(row=>context.pick(retrievalSnapshot.records,row.playerId,'projected_points',{season,week,scoring:'HALF_PPR'},now+1000).status==='VERIFIED'),'every published mapped projection must pass the exact consumer path');

// rc4.201 physical reproduction: the authenticated projection response carried
// current season/week rows, FP identity and numeric stats.points_half, but did not
// echo the optional top-level `positions` field. The consumer incorrectly rejected
// all four successful request lanes before mapping, producing zero usable records.
const rc4201Physical=Object.fromEntries(Object.entries(payloads).map(([position,envelope])=>[position,{
  providerPayload:{season,week,scoring:'STD',players:envelope.providerPayload.players.map(row=>({...row}))},
  requestProvenance:{season,week,position,scope:'WEEKLY',queryShape:evidence.WEEKLY_PROJECTION_QUERY_SHAPE}
}]));
const rc4202Repaired=evidence.buildSnapshot({season,week,scoring:'HALF_PPR',projectionPayloads:rc4201Physical,sleeperPlayers:players,verifiedAt:now});
assert.equal(rc4202Repaired.lanes.projections.status,'AVAILABLE','request provenance and homogeneous row positions make an omitted response positions echo consumer-usable');
assert.equal(rc4202Repaired.records.filter(row=>row.metric==='projected_points').length,Object.values(counts).reduce((sum,count)=>sum+count,0));
assert.deepEqual(evidence.validateSnapshot(rc4202Repaired,{season,week,scoring:'HALF_PPR'},now),{ok:true});
for(const position of evidence.POSITIONS)assert.equal(rc4202Repaired.lanes.projections.coverage.positions[position].consumerUsableRecords,counts[position]);

// rc4.202 physical reproduction: FantasyPros' production response can publish a
// yearless current-week update date. Date.parse('09/10') resolves to 2001 in JS,
// so treating it as an absolute timestamp rejected every otherwise mapped row as
// stale INVALID_PROVIDER_CHRONOLOGY. Infer only the requested season and only
// inside the existing bounded eight-day retrieval window.
const physicalNow=Date.parse('2026-09-14T12:00:00Z');
const yearlessCurrentWeek=structuredClone(rc4201Physical);
for(const envelope of Object.values(yearlessCurrentWeek))envelope.providerPayload.updated='09/14';
const rc4203Repaired=evidence.buildSnapshot({season,week,scoring:'HALF_PPR',projectionPayloads:yearlessCurrentWeek,sleeperPlayers:players,verifiedAt:physicalNow});
assert.equal(rc4203Repaired.lanes.projections.status,'AVAILABLE');
assert.equal(rc4203Repaired.records.filter(row=>row.metric==='projected_points').length,Object.values(counts).reduce((sum,count)=>sum+count,0));
assert(rc4203Repaired.records.every(row=>row.sourceTimePrecision==='DATE'&&row.sourcePublishedDate==='2026-09-14'&&row.sourcePublishedAt===null));
assert.deepEqual(evidence.validateSnapshot(rc4203Repaired,{season,week,scoring:'HALF_PPR'},physicalNow),{ok:true});
for(const position of evidence.POSITIONS)assert.equal(rc4203Repaired.lanes.projections.coverage.positions[position].consumerUsableRecords,counts[position]);

for(const timezone of ['UTC','Europe/Berlin','America/Los_Angeles']){
  const script=`const e=require('./weekly-evidence-v2.js');process.stdout.write(JSON.stringify(e.sourceTime({updated:'September 14'},{season:2026,verifiedAt:Date.parse('2026-09-14T12:00:00Z'),allowSeasonDateInference:true})))`;
  const result=JSON.parse(execFileSync(process.execPath,['-e',script],{cwd:new URL('..',import.meta.url),env:{...process.env,TZ:timezone},encoding:'utf8'}));
  assert.deepEqual(result,{sourcePublishedAt:null,sourcePublishedDate:'2026-09-14',sourceTimePrecision:'DATE'},`named yearless dates must retain calendar components in ${timezone}`);
}

for(const malformed of ['13/40','02/30','September 32','not-a-date']){
  const malformedPayload=structuredClone(yearlessCurrentWeek);
  malformedPayload.QB.providerPayload.updated=malformed;
  const rejected=evidence.buildSnapshot({season,week,scoring:'HALF_PPR',projectionPayloads:malformedPayload,sleeperPlayers:players,priorSnapshot:rc4203Repaired,verifiedAt:physicalNow+1000});
  const lane=rejected.lanes.projections.coverage.positions.QB;
  assert.equal(lane.responseClassification,'DEFINITIVE_REJECTION',`${malformed} must be an explicit chronology rejection`);
  assert.equal(lane.reason,'INVALID_PROVIDER_CHRONOLOGY',`${malformed} must not become retrieval chronology`);
  assert.equal(lane.consumerUsableRecords,0);
  assert(!rejected.records.some(row=>row.metric==='projected_points'&&row.position==='QB'),'a rejected lane must purge both current and prior projection rows');
}

const chronologyAbsent=structuredClone(rc4201Physical);
const retrievalFallback=evidence.buildSnapshot({season,week,scoring:'HALF_PPR',projectionPayloads:chronologyAbsent,sleeperPlayers:players,verifiedAt:physicalNow});
assert.equal(retrievalFallback.lanes.projections.status,'AVAILABLE','truly absent chronology retains safe retrieval fallback');
assert(retrievalFallback.records.every(row=>row.sourceTimePrecision==='RETRIEVAL'));

const outOfWindowYearless=structuredClone(yearlessCurrentWeek);
for(const envelope of Object.values(outOfWindowYearless))envelope.providerPayload.updated='08/01';
const staleYearless=evidence.buildSnapshot({season,week,scoring:'HALF_PPR',projectionPayloads:outOfWindowYearless,sleeperPlayers:players,verifiedAt:physicalNow});
assert.equal(staleYearless.records.filter(row=>row.metric==='projected_points').length,0,'yearless dates outside the bounded retrieval window must remain fail-closed');

// The provider position echo is optional, but it is still evidence when present:
// both omission and an exact match are valid, while a contradiction fails closed.
const matchingPositionEcho=structuredClone(rc4201Physical);
matchingPositionEcho.QB.providerPayload.positions='QB';
const matchingPositionAccepted=evidence.buildSnapshot({season,week,scoring:'HALF_PPR',projectionPayloads:matchingPositionEcho,sleeperPlayers:players,verifiedAt:now});
assert.equal(matchingPositionAccepted.lanes.projections.coverage.positions.QB.status,'AVAILABLE','a matching explicit provider position echo must remain acceptable');
assert.equal(matchingPositionAccepted.lanes.projections.coverage.positions.QB.consumerUsableRecords,counts.QB);
const contradictoryPositionEcho=structuredClone(rc4201Physical);
contradictoryPositionEcho.QB.providerPayload.positions='RB';
const contradictoryPositionRejected=evidence.buildSnapshot({season,week,scoring:'HALF_PPR',projectionPayloads:contradictoryPositionEcho,sleeperPlayers:players,verifiedAt:now});
assert.equal(contradictoryPositionRejected.lanes.projections.coverage.positions.QB.status,'UNAVAILABLE','a contradictory explicit provider position echo must fail closed');
assert.equal(contradictoryPositionRejected.lanes.projections.coverage.positions.QB.reason,'WRONG_PROVIDER_POSITION');
assert.equal(contradictoryPositionRejected.lanes.projections.coverage.positions.QB.consumerUsableRecords,0);
assert(!contradictoryPositionRejected.records.some(row=>row.metric==='projected_points'&&row.position==='QB'),'contradictory provider position rows must never be persisted or reach weekly consumers');

for(const [label,mutate,reason] of [
  ['wrong request week',request=>({...request,week:week+1}),'INVALID_REQUEST_PROVENANCE'],
  ['wrong request season',request=>({...request,season:season-1}),'INVALID_REQUEST_PROVENANCE'],
  ['wrong request position',request=>({...request,position:'RB'}),'INVALID_REQUEST_PROVENANCE'],
  ['legacy ros=false request',request=>({...request,ros:false}),'INVALID_REQUEST_PROVENANCE'],
  ['ROS request',request=>({...request,ros:true}),'INVALID_REQUEST_PROVENANCE'],
  ['wrong request query shape',request=>({...request,queryShape:'EXPLICIT_WEEK_POSITION_ROS_FALSE'}),'INVALID_REQUEST_PROVENANCE'],
  ['missing request scope',request=>({...request,scope:null}),'INVALID_REQUEST_PROVENANCE']
]){
  const invalid={...rc4201Physical,QB:{...rc4201Physical.QB,requestProvenance:mutate(rc4201Physical.QB.requestProvenance)}};
  const rejected=evidence.buildSnapshot({season,week,scoring:'HALF_PPR',projectionPayloads:invalid,sleeperPlayers:players,verifiedAt:now});
  assert.equal(rejected.lanes.projections.coverage.positions.QB.status,'UNAVAILABLE',label);
  assert.equal(rejected.lanes.projections.coverage.positions.QB.reason,reason,label);
  assert(!rejected.records.some(row=>row.metric==='projected_points'&&row.position==='QB'),label);
}
const allZero=structuredClone(rc4201Physical);
for(const row of allZero.QB.providerPayload.players)row.stats.points_half=0;
const allZeroRejected=evidence.buildSnapshot({season,week,scoring:'HALF_PPR',projectionPayloads:allZero,sleeperPlayers:players,verifiedAt:now});
assert.equal(allZeroRejected.lanes.projections.coverage.positions.QB.status,'UNAVAILABLE','an all-zero weekly distribution must fail closed even with valid authenticated request provenance');
assert.equal(allZeroRejected.lanes.projections.coverage.positions.QB.reason,'ALL_ZERO_WEEKLY_PROJECTION_DISTRIBUTION');
assert(!allZeroRejected.records.some(row=>row.metric==='projected_points'&&row.position==='QB'),'all-zero rows must never be persisted as AVAILABLE projection evidence');
const contradictoryRos=structuredClone(rc4201Physical);
contradictoryRos.QB.providerPayload.ros=true;
const contradictoryRosRejected=evidence.buildSnapshot({season,week,scoring:'HALF_PPR',projectionPayloads:contradictoryRos,sleeperPlayers:players,verifiedAt:now});
assert.equal(contradictoryRosRejected.lanes.projections.coverage.positions.QB.status,'UNAVAILABLE','an explicit provider ros:true echo must override and contradict weekly request provenance');
assert.equal(contradictoryRosRejected.lanes.projections.coverage.positions.QB.reason,'CONTRADICTORY_PROVIDER_ROS_SCOPE');
assert(!contradictoryRosRejected.records.some(row=>row.metric==='projected_points'&&row.position==='QB'),'explicit provider ROS rows must never reach weekly consumers');

// Explicitly invalid current evidence is different from an absent/transient lane:
// in a mixed refresh it must purge chronology-valid prior records for that lane.
for(const [label,mutate,reason] of [
  ['wrong season',payload=>{payload.QB.providerPayload.season=season-1},'WRONG_SEASON'],
  ['wrong week',payload=>{payload.QB.providerPayload.week=week+1},'WRONG_WEEK'],
  ['invalid request provenance',payload=>{payload.QB.requestProvenance.scope='ROS'},'INVALID_REQUEST_PROVENANCE'],
  ['rankings payload',payload=>{payload.QB.providerPayload.rankings={HALF:{}}},'NON_WEEKLY_PROJECTION_PAYLOAD'],
  ['provider ROS scope label',payload=>{payload.QB.providerPayload.scope='rest-of-season'},'NON_WEEKLY_PROJECTION_PAYLOAD'],
  ['contradictory provider position',payload=>{payload.QB.providerPayload.positions='RB'},'WRONG_PROVIDER_POSITION'],
  ['contradictory provider ROS',payload=>{payload.QB.providerPayload.ros=true},'CONTRADICTORY_PROVIDER_ROS_SCOPE'],
  ['wrong row position',payload=>{payload.QB.providerPayload.players[0].position_id='RB'},'WRONG_POSITION'],
  ['weekly semantic ceiling mismatch',payload=>{payload.QB.providerPayload.players[0].stats.points_half=evidence.WEEKLY_HALF_PPR_MAX.QB+1},'WEEKLY_PROJECTION_SEMANTIC_SCOPE_MISMATCH'],
  ['all-zero distribution',payload=>{for(const row of payload.QB.providerPayload.players)row.stats.points_half=0},'ALL_ZERO_WEEKLY_PROJECTION_DISTRIBUTION'],
  ['present malformed response',payload=>{payload.QB.providerPayload={players:[]}},'MALFORMED_PROVIDER_RESPONSE'],
  ['present null response',payload=>{payload.QB.providerPayload=null},'MALFORMED_PROVIDER_RESPONSE']
]){
  const mixedRefresh=structuredClone(rc4201Physical);mutate(mixedRefresh);
  const purged=evidence.buildSnapshot({season,week,scoring:'HALF_PPR',projectionPayloads:mixedRefresh,sleeperPlayers:players,priorSnapshot:retrievalSnapshot,verifiedAt:now+1000});
  assert.equal(purged.lanes.projections.coverage.positions.QB.reason,reason,label);
  assert.equal(purged.lanes.projections.coverage.positions.QB.responseClassification,'DEFINITIVE_REJECTION',`${label}: present incompatible evidence must be classified as definitive`);
  assert.equal(purged.lanes.projections.coverage.positions.RB.status,'AVAILABLE',`${label}: another successful position must preserve legitimate PARTIAL behavior`);
  assert.equal(purged.lanes.projections.status,'PARTIAL',`${label}: mixed refresh remains PARTIAL`);
  assert.deepEqual(evidence.validateSnapshot(purged,{season,week,scoring:'HALF_PPR'},now+1000),{ok:true},`${label}: mixed snapshot remains valid`);
  assert.equal(purged.records.filter(row=>row.metric==='projected_points'&&row.position==='QB').length,0,`${label}: prior QB projections must be purged`);
  const priorQbPlayer=retrievalSnapshot.records.find(row=>row.metric==='projected_points'&&row.position==='QB').playerId;
  assert.notEqual(context.pick(purged.records,priorQbPlayer,'projected_points',{season,week,scoring:'HALF_PPR'},now+1000).status,'VERIFIED',`${label}: exact weekly consumer must not return the rejected lane`);
  const persisted=new Map(),store={setItem:(key,value)=>persisted.set(key,value),getItem:key=>persisted.get(key)??null,removeItem:key=>persisted.delete(key)};
  evidence.atomicWrite(store,purged);
  assert.equal(JSON.parse(persisted.get(evidence.CACHE_KEY)).records.filter(row=>row.metric==='projected_points'&&row.position==='QB').length,0,`${label}: persisted snapshot must contain no rejected-lane records`);
}
// Numeric source coverage alone is insufficient: mapped rows from a position
// below the aggregate identity threshold must not escape into a mixed snapshot.
const subThresholdMapping=structuredClone(rc4201Physical);
for(let i=0;i<3;i++){subThresholdMapping.QB.providerPayload.players[i].fpid=`unmapped-${i}`;subThresholdMapping.QB.providerPayload.players[i].name=`Unknown QB ${i}`;}
const mappingPurged=evidence.buildSnapshot({season,week,scoring:'HALF_PPR',projectionPayloads:subThresholdMapping,sleeperPlayers:players,priorSnapshot:retrievalSnapshot,verifiedAt:now+1000});
const mappingDiagnostics=mappingPurged.lanes.projections.coverage.positions.QB;
assert.equal(mappingDiagnostics.responseClassification,'DEFINITIVE_REJECTION');
assert.equal(mappingDiagnostics.reason,'INSUFFICIENT_MAPPING_COVERAGE');
assert.equal(mappingDiagnostics.mappedRows,21);
assert.equal(mappingDiagnostics.consumerUsableRecords,0);
assert.equal(mappingPurged.lanes.projections.coverage.positions.RB.status,'AVAILABLE');
assert.equal(mappingPurged.lanes.projections.status,'PARTIAL');
assert.equal(mappingPurged.records.filter(row=>row.metric==='projected_points'&&row.position==='QB').length,0,'sub-threshold mapping must purge both fresh and prior QB projections');
const mappingPriorPlayer=retrievalSnapshot.records.find(row=>row.metric==='projected_points'&&row.position==='QB').playerId;
assert.notEqual(context.pick(mappingPurged.records,mappingPriorPlayer,'projected_points',{season,week,scoring:'HALF_PPR'},now+1000).status,'VERIFIED','consumer must not return a mapped row from a definitively rejected position');
const mappingPersisted=new Map(),mappingStore={setItem:(key,value)=>mappingPersisted.set(key,value),getItem:key=>mappingPersisted.get(key)??null,removeItem:key=>mappingPersisted.delete(key)};
evidence.atomicWrite(mappingStore,mappingPurged);
assert.equal(JSON.parse(mappingPersisted.get(evidence.CACHE_KEY)).records.filter(row=>row.metric==='projected_points'&&row.position==='QB').length,0);
const transientMixed=structuredClone(rc4201Physical);delete transientMixed.QB;
const carried=evidence.buildSnapshot({season,week,scoring:'HALF_PPR',projectionPayloads:transientMixed,sleeperPlayers:players,priorSnapshot:retrievalSnapshot,verifiedAt:now+1000});
assert.equal(carried.lanes.projections.coverage.positions.QB.responseClassification,'ABSENT_TRANSIENT');
assert.equal(carried.lanes.projections.coverage.positions.RB.status,'AVAILABLE');
assert.equal(carried.lanes.projections.status,'PARTIAL');
assert(carried.records.some(row=>row.metric==='projected_points'&&row.position==='QB'&&row.verifiedAt===now),'a transport-style absent lane must retain chronology-valid prior evidence');
const carriedQbPlayer=retrievalSnapshot.records.find(row=>row.metric==='projected_points'&&row.position==='QB').playerId;
assert.equal(context.pick(carried.records,carriedQbPlayer,'projected_points',{season,week,scoring:'HALF_PPR'},now+1000).status,'VERIFIED','intentional stale fallback remains consumer-eligible only for absent/transient lanes');
for(const mutation of [
  row=>({...row,verifiedAt:now+2000,expiresAt:now+2000+evidence.EVIDENCE_TTL_MS}),
  row=>({...row,week:2}),row=>({...row,season:2025}),row=>({...row,scoring:'PPR'}),
  row=>({...row,verifiedAt:now-evidence.EVIDENCE_TTL_MS-1,expiresAt:now-1}),
  row=>({...row,sourceId:'unknown'}),row=>({...row,sourceUrl:'https://untrusted.example/projections'})
])assert.notEqual(context.pick([mutation(retrievalRecord)],retrievalRecord.playerId,'projected_points',{season,week,scoring:'HALF_PPR'},now+1000).status,'VERIFIED');
assert.notEqual(context.pick([{...retrievalRecord,metric:'weekly_rank',unit:'POSITIONAL_RANK'}],retrievalRecord.playerId,'weekly_rank',{season,week,scoring:'HALF_PPR'},now+1000).status,'VERIFIED','retrieval chronology must not leak to rank evidence');
assert.equal(evidence.mapFantasyProsPlayer({player_id:'missing',player_name:'QB Player 0',player_position_id:'QB',player_team_id:'AAA'},indexes).reason,'NAME_POSITION_COLLISION');

// Weekly rank lane remains independent from projections and labels broad ECR honestly.
const rankPayloads={};
for(const [position,count] of Object.entries(evidence.RANK_MIN_COUNTS))rankPayloads[position]={season,week,scoring:'HALF_PPR',updated:'2026-09-10',players:Array.from({length:count},(_,i)=>({fpid:10001+Object.entries(counts).slice(0,Object.keys(counts).indexOf(position)).reduce((n,[,v])=>n+v,0)+i,name:`${position} Player ${i}`,position_id:position,team_id:'AAA',rank_ecr:i+1}))};
const ranked=evidence.buildSnapshot({season,week,scoring:'HALF',projectionPayloads:payloads,rankingPayloads:rankPayloads,sleeperPlayers:players,verifiedAt:now});
assert.equal(ranked.lanes.expertWeeklyRanks.status,'AVAILABLE');
assert.equal(ranked.panel.weeklyRank.status,'UNAVAILABLE');assert.equal(ranked.panel.broadWeeklyEcr.status,'AVAILABLE');
assert(ranked.records.some(x=>x.metric==='broad_weekly_ecr_rank'));
const partialProjectionFullRanks=evidence.buildSnapshot({season,week,scoring:'HALF',projectionPayloads:{QB:payloads.QB,RB:payloads.RB,TE:payloads.TE},rankingPayloads:rankPayloads,sleeperPlayers:players,verifiedAt:now});
assert.equal(partialProjectionFullRanks.lanes.projections.status,'PARTIAL');
assert.equal(partialProjectionFullRanks.lanes.expertWeeklyRanks.status,'AVAILABLE');
assert.equal(partialProjectionFullRanks.status,'DEGRADED','fully available ranks must not promote partial projection coverage to top-level AVAILABLE');
const wrongRank={...rankPayloads,QB:{...rankPayloads.QB,week:2}};
const degradedRank=evidence.buildSnapshot({season,week,scoring:'HALF',projectionPayloads:payloads,rankingPayloads:wrongRank,sleeperPlayers:players,verifiedAt:now});
assert.equal(degradedRank.lanes.projections.status,'AVAILABLE');
assert.equal(degradedRank.lanes.expertWeeklyRanks.status,'PARTIAL');
assert(degradedRank.records.some(x=>x.metric==='projected_points'),'rank failure must preserve projection records');
assert(!degradedRank.records.some(x=>x.metric==='broad_weekly_ecr_rank'&&x.position==='QB'),'wrong-week broad ECR ranks fail closed');

const offsets={},productionRanks={};let rankOffset=0;
for(const [position,count] of Object.entries(evidence.RANK_MIN_COUNTS)){
  offsets[position]=rankOffset;
  productionRanks[position]={season,week,scoring:'HALF_PPR',rankings:Array.from({length:count},(_,i)=>({player_id:10001+rankOffset+i,player_name:`${position} Player ${i}`,player_position_id:position,player_team_id:'AAA',rank_ecr:i+1,last_updated:'09/10'}))};
  rankOffset+=counts[position];
}
const productionRanked=evidence.buildSnapshot({season,week,scoring:'HALF',projectionPayloads:timestampLess,rankingPayloads:productionRanks,sleeperPlayers:players,verifiedAt:now});
assert.equal(productionRanked.lanes.expertWeeklyRanks.status,'AVAILABLE');
for(const position of evidence.POSITIONS){const d=productionRanked.lanes.expertWeeklyRanks.coverage.positions[position];assert.equal(d.sourceRows,evidence.RANK_MIN_COUNTS[position]);assert.equal(d.freshRows,d.rankedRows);assert.equal(d.staleOrAmbiguousTimeCount,0);}
assert(productionRanked.records.filter(x=>x.metric==='broad_weekly_ecr_rank').every(x=>x.sourceTimePrecision==='DATE'&&x.sourcePublishedAt===null&&x.sourcePublishedDate==='2026-09-10'));
const mixed=structuredClone(productionRanks);mixed.QB.rankings[0].last_updated='08/01';mixed.QB.rankings[1].last_updated='not-a-date';
const mixedRanked=evidence.buildSnapshot({season,week,scoring:'HALF',projectionPayloads:timestampLess,rankingPayloads:mixed,sleeperPlayers:players,verifiedAt:now});
assert.equal(mixedRanked.lanes.expertWeeklyRanks.coverage.positions.QB.staleOrAmbiguousTimeCount,2);
assert.equal(mixedRanked.lanes.expertWeeklyRanks.coverage.positions.QB.status,'UNAVAILABLE','fresh-row minimum remains fail closed');
assert(mixedRanked.records.some(x=>x.metric==='projected_points'),'rank freshness failure must retain projections');

// Physical rc4.198 regression: when localStorage cannot fit the full projection+rank
// snapshot, replacing the previous current snapshot with a smaller projection-only
// snapshot must succeed without deleting protected research, return validation or active
// decision evidence. Rank evidence fails closed and projections remain consumable.
const quotaSnapshot=structuredClone(productionRanked);
const previousProjectionOnly=evidence.projectionOnlyStorageSnapshot(quotaSnapshot);
assert(previousProjectionOnly&&previousProjectionOnly.records.every(row=>row.metric==='projected_points'));
const previousText=JSON.stringify({...previousProjectionOnly,snapshotId:'previous-weekly'}),fullText=JSON.stringify(quotaSnapshot),projectionOnlyText=JSON.stringify(previousProjectionOnly);
assert(fullText.length>projectionOnlyText.length,'quota fallback fixture requires full snapshot to be larger');
const protectedResearch='RESEARCH_EVIDENCE_'+('r'.repeat(4096)),protectedReturns='RETURN_VALIDATION_'+('v'.repeat(4096)),protectedDecision='ACTIVE_EVIDENCE_'+('d'.repeat(4096));
const quotaMemory=new Map([
  [evidence.CACHE_KEY,previousText],
  ['v117_researchEvidence',protectedResearch],
  ['v118_returnValidation',protectedReturns],
  ['v118_decisionFixtures',protectedDecision]
]);
const protectedSize=protectedResearch.length+protectedReturns.length+protectedDecision.length;
const quotaLimit=protectedSize+previousText.length+Math.max(4096,Math.floor((fullText.length-projectionOnlyText.length)/3));
assert(protectedSize+projectionOnlyText.length<quotaLimit&&protectedSize+fullText.length>quotaLimit,'quota fixture must allow projection-only replacement but reject full snapshot');
const quotaStorage={
  setItem(k,v){
    let total=0;
    for(const [key,value] of quotaMemory)total+=key===k?0:String(value).length;
    total+=String(v).length;
    if(total>quotaLimit){const e=new Error('QuotaExceededError');e.name='QuotaExceededError';e.code=22;throw e}
    quotaMemory.set(k,v);
  },
  getItem:k=>quotaMemory.get(k)??null,
  removeItem:k=>quotaMemory.delete(k)
};
const quotaResult=evidence.atomicWrite(quotaStorage,quotaSnapshot),persistedQuota=JSON.parse(quotaMemory.get(evidence.CACHE_KEY));
assert.equal(quotaResult.persistence?.mode,'LOCAL_STORAGE_PROJECTION_ONLY');
assert.equal(persistedQuota.lanes.projections.status,'AVAILABLE');
assert.equal(persistedQuota.lanes.expertWeeklyRanks.status,'UNAVAILABLE');
assert.equal(persistedQuota.panel.weeklyRank.status,'UNAVAILABLE');
assert(persistedQuota.records.length>0&&persistedQuota.records.every(row=>row.metric==='projected_points'));
assert.equal(quotaMemory.get('v117_researchEvidence'),protectedResearch,'append-only research evidence must survive weekly quota recovery');
assert.equal(quotaMemory.get('v118_returnValidation'),protectedReturns,'return validation evidence must survive weekly quota recovery');
assert.equal(quotaMemory.get('v118_decisionFixtures'),protectedDecision,'active decision evidence must survive weekly quota recovery');
assert.equal(context.pick(persistedQuota.records,persistedQuota.records[0].playerId,'projected_points',{season,week,scoring:'HALF_PPR'},now+1000).status,'VERIFIED','projection-only persisted fallback must remain consumable');

console.log('WEEKLY_EVIDENCE_V2_REGRESSION_PASS');
