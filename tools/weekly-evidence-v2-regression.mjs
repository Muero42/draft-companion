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

const prior='{"schema":"old","snapshotId":"keep"}',failingStorage={setItem(k,v){if(k===evidence.CACHE_KEY)throw Error('quota');memory.set(k,v)},getItem:k=>k===evidence.CACHE_KEY?prior:memory.get(k)??null,removeItem:k=>memory.delete(k)};
assert.throws(()=>evidence.atomicWrite(failingStorage,snapshot),/quota/);
assert.equal(failingStorage.getItem(evidence.CACHE_KEY),prior,'failed atomic publish must preserve the prior current snapshot');

const app=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8'),valueStart=app.indexOf('function seasonEvidenceValue('),valueEnd=app.indexOf('\nfunction seasonEvidenceCache',valueStart),context={Date,Number,String,Array,Object,RegExp,Set};
vm.createContext(context);vm.runInContext(app.slice(valueStart,valueEnd)+';globalThis.pick=seasonEvidenceValue;',context);
const picked=context.pick(snapshot.records,snapshot.records[0].playerId,'projected_points',{season,week,scoring:'HALF_PPR'},now+1000);
assert.equal(picked.status,'VERIFIED');
assert.equal(picked.sourcePublishedAt,null,'consumer must not manufacture a timestamp from date-only source metadata');
assert(fs.readFileSync(new URL('../_worker.js',import.meta.url),'utf8').includes("headers['retry-after']=retryAfter"),'proxy must preserve upstream Retry-After for the client lifecycle');

console.log('WEEKLY_EVIDENCE_V2_REGRESSION_PASS');
