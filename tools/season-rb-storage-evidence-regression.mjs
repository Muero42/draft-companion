import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import evidence from '../weekly-evidence-v2.js';
const now=Date.parse('2026-09-28T12:00:00Z'),context={season:2026,week:3,scoring:'HALF',verifiedAt:now},sleeperPlayers={},broad={},selected={},projections={};
let id=1;
for(const position of evidence.POSITIONS){
 const rows=Array.from({length:position==='RB'?111:80},(_,i)=>{const fpid=id++;sleeperPlayers[fpid]={full_name:`${position} ${i}`,position,team:'AAA',fantasy_data_id:fpid};return{fpid,name:`${position} ${i}`,position_id:position,team_id:'AAA',rank_ecr:i+1,stats:{points_half:10}}});
 broad[position]={season:2026,week:3,scoring:'HALF',position_id:position,last_updated:'09/28',players:rows};
 const ids=['317','285','835','3585','120','22'];
 selected[position]={providerResponsePresent:true,providerPayload:{...broad[position],players:rows.slice(0,position==='RB'?106:80),filters:ids.join(':'),total_experts:ids.length,expert_pub:Object.fromEntries(ids.map(id=>[id,'Provider']))},requestedExperts:ids.map(id=>({id,name:`Expert ${id}`})),requestProvenance:{season:2026,week:3,scoring:'HALF',position,experts:'show',requestedExpertIds:ids}};
 projections[position]={providerPayload:{...broad[position],players:rows.slice()},requestProvenance:{season:2026,week:3,position,scope:'WEEKLY',queryShape:evidence.WEEKLY_PROJECTION_QUERY_SHAPE}};
}
context.sleeperPlayers=sleeperPlayers;
const other={...broad.RB.players[0],position_id:'OTHER',fpid:99999};
broad.RB.players.push(other);selected.RB.providerPayload.players.push(other);
for(const [payloads,fn,count] of [[broad,evidence.weeklyRankLane,111],[selected,evidence.selectedWeeklyRankLane,106]]){
 const result=fn(payloads,context),p=result.lane.coverage.positions.RB;
 assert.equal(p.status,'AVAILABLE');assert.equal(p.rejectedPositionRows,1);assert.equal(p.rankedRows,count);assert.equal(p.mappedRows,count);
 assert.equal(result.rejects.filter(r=>r.position==='RB'&&r.reason==='WRONG_POSITION').length,1);
 assert(!result.records.some(r=>String(r.sourcePlayerId)==='99999'));
 for(const type of ['contaminated','wrongPayload']){
  const bad=structuredClone(payloads),raw=bad.RB.providerPayload||bad.RB;
  if(type==='wrongPayload')raw.position_id='WR';else for(let i=0;i<20;i++)raw.players[i].position_id='WR';
  const rejected=fn(bad,context);assert.equal(rejected.lane.coverage.positions.RB.reason,'WRONG_POSITION');assert(!rejected.records.some(r=>r.position==='RB'));
 }
}
const unbound=structuredClone(selected);delete unbound.RB.providerPayload.expert_pub;
assert.equal(evidence.selectedWeeklyRankLane(unbound,context).lane.coverage.positions.RB.reason,'UNPROVEN_EXPERT_IDENTITY');
const snapshot=evidence.buildSnapshot({...context,projectionPayloads:projections,rankingPayloads:broad,selectedRankingPayloads:selected});
assert.equal(snapshot.lanes.projections.status,'AVAILABLE');
const protectedKeys=['v7_apiKey','pitti.season.state','v117_researchEvidence','v118_returnValidation','v118_decisionFixtures','v7_decisionLog','pitti.boone','pitti.watcher','v7_rank_history'];
function storage(limit,extra={}){
 const memory=new Map([...protectedKeys.map(k=>[k,'SECRET_'+k]),[evidence.CACHE_KEY,JSON.stringify({...snapshot,snapshotId:'previous'})],...Object.entries(extra)]),attempts=[];
 return{memory,attempts,get length(){return memory.size},key:i=>[...memory.keys()][i],getItem:k=>memory.get(k)??null,removeItem:k=>memory.delete(k),setItem(k,v){attempts.push(evidence.decodeStorageSnapshot(JSON.parse(v)));const size=[...memory].reduce((sum,[key,value])=>sum+(key===k?0:value.length),v.length);if(size>limit)throw Object.assign(new Error('quota'),{name:'QuotaExceededError'});memory.set(k,v)}};
}
const fullSize=JSON.stringify(snapshot).length,protectedSize=protectedKeys.reduce((n,k)=>n+('SECRET_'+k).length,0);
const recovered=storage(fullSize+protectedSize+20,{'v7_rank_317':'x'.repeat(fullSize),'v7_rank_285':'small'});
const persisted=evidence.atomicWrite(recovered,snapshot);
assert(!persisted.persistence?.mode?.includes('PROJECTION_ONLY'));assert.equal(recovered.memory.has('v7_rank_317'),false);assert.equal(recovered.memory.get('v7_rank_285'),'small','stop eviction once full snapshot fits');
assert(recovered.attempts.length>=3);assert(recovered.attempts.every(x=>x.records.some(r=>r.metric==='weekly_rank')));
for(const key of protectedKeys)assert.equal(recovered.memory.get(key),'SECRET_'+key);
const read=evidence.decodeStorageSnapshot(JSON.parse(recovered.getItem(evidence.CACHE_KEY)));
for(const position of evidence.POSITIONS){const expected=snapshot.records.filter(r=>r.metric==='projected_points'&&r.position===position);const actual=read.records.filter(r=>r.metric==='projected_points'&&r.position===position&&evidence.weeklyRecordChronology(r,context,now));assert(expected.length>0);assert.deepEqual(actual,expected,'all available projection positions survive read-back');}
const fallback=storage(JSON.stringify(evidence.encodeStorageSnapshot(evidence.projectionOnlyStorageSnapshot(snapshot))).length+protectedSize+Math.floor((JSON.stringify(evidence.encodeStorageSnapshot(snapshot)).length-JSON.stringify(evidence.encodeStorageSnapshot(evidence.projectionOnlyStorageSnapshot(snapshot))).length)/3),{'v7_rank_317':'x'.repeat(fullSize)});
assert.equal(evidence.atomicWrite(fallback,snapshot).persistence.mode,'LOCAL_STORAGE_PROJECTION_ONLY');
for(const key of protectedKeys)assert.equal(fallback.memory.get(key),'SECRET_'+key);
const blocked=storage(1,{'v7_rank_317':'rebuildable'}),previous=blocked.getItem(evidence.CACHE_KEY);
assert.throws(()=>evidence.atomicWrite(blocked,snapshot),{name:'QuotaExceededError'});assert.equal(blocked.getItem(evidence.CACHE_KEY),previous);
const app=fs.readFileSync('app.js','utf8'),start=app.indexOf('function weeklyEvidencePersistenceDiagnostic('),end=app.indexOf('function startSitCompletionDiagnostic(',start);
const diagnosticStorage=storage(Infinity,{'untrusted/SECRET_TOKEN':'SECRET_VALUE'}),sandbox={localStorage:diagnosticStorage,store:{get:()=>snapshot},PittiWeeklyEvidenceV2:evidence};
vm.runInNewContext(app.slice(start,end),sandbox);const diagnostic=sandbox.weeklyEvidencePersistenceDiagnostic(),serialized=JSON.stringify(diagnostic);
assert.equal(diagnostic.localStorageUsageEstimate.topKeys.length,10);
assert(diagnostic.localStorageUsageEstimate.topKeys.every(x=>Object.keys(x).sort().join(',')==='characters,key'&&Number.isInteger(x.characters)));
assert(!serialized.includes('SECRET_'));
console.log('RC4214_RB_STORAGE_PASS: isolated row containment, identity, strict contamination, minimal cache recovery, fallback, atomicity, four-position read-back, secret-safe sizes');
