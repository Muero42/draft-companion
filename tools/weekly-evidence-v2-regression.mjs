import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import evidence from '../weekly-evidence-v2.js';

const now=Date.parse('2026-09-10T12:00:00Z'),season=2026,week=1;
const counts={QB:24,RB:60,WR:70,TE:24},players={},payloads={};
let id=1;
for(const [position,count] of Object.entries(counts)){
  const rows=[];
  for(let i=0;i<count;i++,id++){
    players[String(id)]={full_name:`${position} Player ${i}`,position,team:'AAA',fantasy_data_id:10000+id};
    rows.push({fpid:10000+id,name:`${position} Player ${i}`,position_id:position,team_id:'AAA',stats:{points:999,points_half:20-i/100}});
  }
  payloads[position]={season,week,updated:'2026-09-10',players:rows};
}

const snapshot=evidence.buildSnapshot({season,week,scoring:'HALF',projectionPayloads:payloads,sleeperPlayers:players,verifiedAt:now});
assert.equal(snapshot.schema,'pitti.weekly-evidence.v2');
assert.equal(snapshot.lanes.projections.status,'AVAILABLE');
assert.equal(snapshot.records.length,Object.values(counts).reduce((a,b)=>a+b,0));
assert(snapshot.records.every(r=>r.metric==='projected_points'&&r.value!==999&&r.provenance.field==='stats.points_half'));
assert(snapshot.records.every(r=>r.sourcePublishedAt===null&&r.sourcePublishedDate==='2026-09-10'&&r.sourceTimePrecision==='DATE'),'date-only source precision must never be fabricated into a timestamp');
assert(snapshot.records.every(r=>!new URL(r.sourceUrl).searchParams.has('scoring')&&new URL(r.sourceUrl).searchParams.get('ros')==='false'));
assert.deepEqual(evidence.validateSnapshot(snapshot,{season,week,scoring:'HALF_PPR'},now),{ok:true});
assert.equal(evidence.validateSnapshot(snapshot,{season,week:2,scoring:'HALF_PPR'},now).reason,'CONTEXT_MISMATCH');
assert.equal(evidence.validateSnapshot(snapshot,{season,week,scoring:'PPR'},now).reason,'CONTEXT_MISMATCH');
assert.equal(evidence.validateSnapshot(snapshot,{season,week,scoring:'HALF'},now+evidence.MAX_AGE_MS+1).reason,'STALE');

const indexes=evidence.sleeperIndexes({...players,collision:{full_name:'QB Player 0',position:'QB',team:'AAA'}});
assert.equal(evidence.mapFantasyProsPlayer({name:'QB Player 0',position_id:'QB',team_id:'AAA'},indexes).reason,'NAME_POSITION_COLLISION');
assert.equal(evidence.mapFantasyProsPlayer({name:'QB Player 1',position_id:'QB',team_id:'BBB'},indexes).reason,'TEAM_MISMATCH');

const wrong={...payloads,QB:{...payloads.QB,week:2}};
const unavailable=evidence.buildSnapshot({season,week,scoring:'HALF',projectionPayloads:wrong,sleeperPlayers:players,verifiedAt:now});
assert.equal(unavailable.lanes.projections.status,'PARTIAL');
assert.equal(unavailable.records.length,0,'partial multi-position fetch must not publish a mixed snapshot');

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

// Regression for the physical Android failure: the old implementation staged a full
// TEMP copy before CURRENT. Under realistic localStorage pressure that doubled peak
// demand and could fail even though a direct atomic replacement fits. A stale pending
// copy from such a failure must be removed before the replacement is attempted.
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

// If direct replacement still exceeds quota, only the same explicitly rebuildable /
// historical keys already used by the app quota policy may be evicted before one retry.
const recoveryMemory=new Map([
  [evidence.CACHE_KEY,prior],
  ['v118_decisionFixtures','ACTIVE_EVIDENCE'],
  ['v118_returnValidation','x'.repeat(text.length)],
  ['v117_researchEvidence','x'.repeat(text.length)]
]);
const recoveryLimit=text.length+prior.length+'ACTIVE_EVIDENCE'.length+256;
const recoveryStorage={
  setItem(k,v){
    let total=0;
    for(const [key,value] of recoveryMemory)total+=key===k?0:String(value).length;
    total+=String(v).length;
    if(total>recoveryLimit){const e=new Error('QuotaExceededError');e.name='QuotaExceededError';e.code=22;throw e}
    recoveryMemory.set(k,v);
  },
  getItem:k=>recoveryMemory.get(k)??null,
  removeItem:k=>recoveryMemory.delete(k)
};
evidence.atomicWrite(recoveryStorage,snapshot);
assert.equal(JSON.parse(recoveryMemory.get(evidence.CACHE_KEY)).snapshotId,snapshot.snapshotId,'quota recovery retry must publish the verified snapshot');
assert.equal(recoveryMemory.get('v118_decisionFixtures'),'ACTIVE_EVIDENCE','active decision evidence must survive quota recovery');
assert.equal(recoveryMemory.has('v118_returnValidation'),false);
assert.equal(recoveryMemory.has('v117_researchEvidence'),false);

const app=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8'),valueStart=app.indexOf('function seasonEvidenceValue('),valueEnd=app.indexOf('\nfunction seasonEvidenceCache',valueStart),context={Date,Number,String,Array,Object,RegExp,Set};
vm.createContext(context);vm.runInContext(app.slice(valueStart,valueEnd)+';globalThis.pick=seasonEvidenceValue;',context);
const picked=context.pick(snapshot.records,snapshot.records[0].playerId,'projected_points',{season,week,scoring:'HALF_PPR'},now+1000);
assert.equal(picked.status,'VERIFIED');
assert.equal(picked.sourcePublishedAt,null,'consumer must not manufacture a timestamp from date-only source metadata');
assert(fs.readFileSync(new URL('../_worker.js',import.meta.url),'utf8').includes("headers['retry-after']=retryAfter"),'proxy must preserve upstream Retry-After for the client lifecycle');

console.log('WEEKLY_EVIDENCE_V2_REGRESSION_PASS');

// Weekly rank lane remains independent from projections and labels broad ECR honestly.
const rankPayloads={};
for(const [position,count] of Object.entries(evidence.RANK_MIN_COUNTS))rankPayloads[position]={season,week,scoring:'HALF_PPR',updated:'2026-09-10',players:Array.from({length:count},(_,i)=>({fpid:10001+Object.entries(counts).slice(0,Object.keys(counts).indexOf(position)).reduce((n,[,v])=>n+v,0)+i,name:`${position} Player ${i}`,position_id:position,team_id:'AAA',rank_ecr:i+1}))};
const ranked=evidence.buildSnapshot({season,week,scoring:'HALF',projectionPayloads:payloads,rankingPayloads:rankPayloads,sleeperPlayers:players,verifiedAt:now});
assert.equal(ranked.lanes.expertWeeklyRanks.status,'AVAILABLE');
assert.equal(ranked.panel.weeklyRank.status,'BROAD_CONSENSUS_ONLY');
assert(ranked.records.some(x=>x.metric==='weekly_rank'));
const wrongRank={...rankPayloads,QB:{...rankPayloads.QB,week:2}};
const degradedRank=evidence.buildSnapshot({season,week,scoring:'HALF',projectionPayloads:payloads,rankingPayloads:wrongRank,sleeperPlayers:players,verifiedAt:now});
assert.equal(degradedRank.lanes.projections.status,'AVAILABLE');
assert.equal(degradedRank.lanes.expertWeeklyRanks.status,'PARTIAL');
assert(degradedRank.records.some(x=>x.metric==='projected_points'),'rank failure must preserve projection records');
assert(!degradedRank.records.some(x=>x.metric==='weekly_rank'&&x.position==='QB'),'wrong-week ranks fail closed');
