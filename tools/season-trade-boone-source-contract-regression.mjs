import assert from 'node:assert/strict';
import {buildBooneTradeValueSnapshot,POSITIONS,MIN_COUNTS,WEEK1_URLS} from '../boone-trade-values-v1.mjs';
import {adaptBooneTradeEvidence,evaluateBooneTradeOffer,PEAKED_GATE} from '../trade-boone-source-contract-v1.mjs';
import trade from '../trade-team-needs-v2.js';

// Synthetic test data only, not provider evidence.
const now=Date.parse('2026-09-27T12:00:00Z'),context={season:2026,week:3,scoring:'HALF_PPR'};
const charts={},players={};
for(const position of POSITIONS){
  const rows=Array.from({length:MIN_COUNTS[position]},(_,i)=>({name:`Synthetic ${position} ${i}`,position,value:100-i,rank:i+1}));
  for(const [i,row] of rows.entries())players[`${position}${i}`]={full_name:row.name,position,team:'FA'};
  charts[position]={ok:true,players:rows,sourceUrl:WEEK1_URLS[position],publishedAt:now-3600000,modifiedAt:now-3600000,sourceAt:now-3600000,column:position==='QB'?'1QB':'HALF'};
}
const snapshot=buildBooneTradeValueSnapshot({charts,sleeperPlayers:players,...context,verifiedAt:now});
const fresh=adaptBooneTradeEvidence(snapshot,context,now);
assert.equal(fresh.available,true);assert.equal(fresh.scoring,'HALF_PPR');assert.equal(fresh.secondarySourceGate,PEAKED_GATE);
assert.equal(fresh.source,snapshot.sourceId);assert.equal(fresh.unit,'BOONE_TRADE_VALUE');
for(const row of snapshot.records){assert.equal(fresh.values[row.sleeperId].value,row.value);assert.deepEqual(fresh.values[row.playerId].provenance,row.provenance);assert(!Object.hasOwn(fresh.values,row.sourcePlayerName));}
const bad=(mutate,reason)=>{const s=structuredClone(snapshot);mutate(s);const ev=adaptBooneTradeEvidence(s,context,now);assert.equal(ev.available,false,reason);assert.equal(ev.reason,reason);assert.deepEqual(ev.values,{});};
bad(s=>{s.lastSuccessAt=now-25*3600000;},'STALE');
bad(s=>{s.expiresAt=now;},'STALE');
bad(s=>{delete s.expiresAt;},'STALE');
bad(s=>{s.week=2;},'CONTEXT_MISMATCH');bad(s=>{s.season=2025;},'CONTEXT_MISMATCH');bad(s=>{s.scoring='PPR';},'CONTEXT_MISMATCH');
assert.equal(adaptBooneTradeEvidence(snapshot,{...context,scoring:'PPR'},now).available,false);
bad(s=>{s.coverage.positions.TE.status='UNAVAILABLE';},'PARTIAL_POSITION_COVERAGE');
bad(s=>{s.records=s.records.filter(r=>r.position!=='TE');},'PARTIAL_POSITION_COVERAGE');
bad(s=>{s.records.push({...s.records[0]});},'DUPLICATE_PLAYER_RECORD');
bad(s=>{s.records.push({...s.records[0],value:1});},'DUPLICATE_PLAYER_RECORD');
bad(s=>{s.schema='other';},'SCHEMA_OR_STATUS');bad(s=>{s.sourceId='unverified-secondary';},'INVALID_SOURCE');
for(const patch of [{schema:'other'},{sourceId:'other'},{week:2},{season:2025},{scoring:'PPR'},{sleeperId:'other'},{value:null},{value:'50'},{unit:'PERCENTILE'},{status:'UNAVAILABLE'},{conflict:true}])bad(s=>{Object.assign(s.records[0],patch);},'INVALID_RECORDS');
bad(s=>{s.records[0]=null;},'INVALID_RECORDS');
bad(s=>{s.records[0].publishedAt=now-9*86400000;},'STALE');
bad(s=>{s.records[0].expiresAt=now;},'INVALID_RECORDS');
bad(s=>{s.records[0].provenance.selectedColumn='PPR';},'INVALID_PROVENANCE');
assert.equal(adaptBooneTradeEvidence(snapshot,context,now,['missing']).reason,'PLAYER_VALUE_UNAVAILABLE');

const p=(id,pos)=>({p:{id,name:players[id].full_name,pos},seasonStatus:'ACTIVE'});
const mine=[p('QB0','QB'),p('TE0','TE'),p('RB31','RB'),...Array.from({length:6},(_,i)=>p(`WR${i}`,'WR'))];
const opponent=[p('QB1','QB'),p('TE1','TE'),p('WR59','WR'),...Array.from({length:6},(_,i)=>p(`RB${i}`,'RB'))];
const offer={mine,opponent,give:[mine[4]],get:[opponent[4]],snapshot,context,now};
const result=evaluateBooneTradeOffer(offer);
assert.equal(result.actionable,true);assert.equal(result.reason,'BILATERAL_UTILITY_PASS');
assert.deepEqual(result,trade.evaluateOffer({...offer,evidence:fresh,season:{week:3},currentDate:now}),'bridge preserves utility/gap/acceptance algorithm');
assert.equal(evaluateBooneTradeOffer({...offer,now:now+25*3600000}).status,'MONITOR','decision rechecks expiry');
const generic={source:'unverified-secondary',as_of:new Date(now).toISOString(),values:fresh.values};
assert.equal(trade.adaptEvidence(generic,now).available,true,'diagnostic: generic engine is not a source boundary');
assert.equal(evaluateBooneTradeOffer({...offer,snapshot:generic}).actionable,false);
assert.equal(evaluateBooneTradeOffer({...offer,snapshot:fresh}).actionable,false,'adapted values are not a raw snapshot');
const missing=structuredClone(snapshot);missing.records=missing.records.filter(r=>r.playerId!==mine[4].p.id);missing.coverage.positions.WR.mapped--;
const absent=evaluateBooneTradeOffer({...offer,snapshot:missing});assert.equal(absent.status,'MONITOR');assert.equal(absent.reason,'PLAYER_VALUE_UNAVAILABLE');
for(const idx of [0,1])assert.equal(evaluateBooneTradeOffer({...offer,give:[mine[idx]]}).reason,'ONLY_ACTIVE_QB_TE');
for(const status of ['IR','RESERVE']){
  const reserve={...mine[4],seasonStatus:status},roster=mine.filter(r=>r!==mine[4]).concat(reserve);
  assert.equal(evaluateBooneTradeOffer({...offer,mine:roster,give:[reserve]}).reason,'NON_ACTIVE_OR_UNOWNED_PLAYER');
  assert.equal(trade.rosterUtility(roster,fresh.values),trade.rosterUtility(roster.filter(r=>r!==reserve),fresh.values));
}
const gap=structuredClone(snapshot);gap.records.find(r=>r.playerId===opponent[4].p.id).value=60;gap.records.find(r=>r.playerId===mine[2].p.id).value=10;
assert.equal(evaluateBooneTradeOffer({...offer,snapshot:gap}).reason,'TRADE_VALUE_GAP');
const notImproved=evaluateBooneTradeOffer({...offer,give:[mine[2]],get:[opponent[4]]});
assert.equal(notImproved.actionable,false);assert.equal(notImproved.reason,'OPPONENT_UTILITY_NOT_IMPROVED');
console.log('TRADE_BOONE_SOURCE_CONTRACT_PASS: source boundary, native scale, context, malformed/duplicate/coverage/expiry negatives, core guards, bilateral utility and gap; '+PEAKED_GATE);
