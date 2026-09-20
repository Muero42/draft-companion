import assert from 'node:assert/strict';
import evidence from '../weekly-evidence-v2.js';

const season=2026,week=2,now=Date.parse('2026-09-20T12:00:00Z');
const expertNames={
  QB:['Justin Boone','Dalton Del Don','Sean Koerner','Pat Fitzmaurice'],
  RB:['Justin Boone','Dalton Del Don','Kev Wheeler','Ryan Weisse','Sean Koerner','Pat Fitzmaurice'],
  WR:['Justin Boone','Dalton Del Don','Sean Koerner','Pat Fitzmaurice'],
  TE:['Dalton Del Don','Justin Boone','Sean Koerner','Pat Fitzmaurice']
};
const counts=evidence.RANK_MIN_COUNTS,players={},selectedPayloads={},broadPayloads={};
let playerId=10000,expertId=200;
for(const position of evidence.POSITIONS){
  const rows=[];
  for(let i=0;i<counts[position];i++){
    playerId++;
    players[String(playerId)]={full_name:`${position} Player ${i}`,position,team:'AAA',fantasy_data_id:playerId};
    rows.push({fpid:playerId,name:`${position} Player ${i}`,position_id:position,team_id:'AAA',rank_ecr:i+1,last_updated:'09/20'});
  }
  const requested=expertNames[position].map(name=>({id:String(++expertId),name,site:'Test Source'}));
  const ids=requested.map(x=>x.id);
  const expert_name=Object.fromEntries(requested.map(x=>[x.id,x.name]));
  const expert_pub=Object.fromEntries(requested.map(x=>[x.id,x.site]));
  selectedPayloads[position]={
    providerPayload:{season,week,position_id:position,scoring:'HALF',filters:ids.join(':'),total_experts:ids.length,expert_name,expert_pub,last_updated:'09/20',players:structuredClone(rows)},
    providerResponsePresent:true,
    requestProvenance:{season,week,position,scoring:'HALF',experts:'show',requestedExpertIds:ids},
    requestedExperts:requested,
    configuredExpertNames:[...expertNames[position]],
    missingDirectoryExperts:[]
  };
  broadPayloads[position]={season,week,scoring:'HALF_PPR',last_updated:'09/20',players:structuredClone(rows)};
}

const selected=evidence.selectedWeeklyRankLane(selectedPayloads,{season,week,scoring:'HALF_PPR',sleeperPlayers:players,verifiedAt:now});
assert.equal(selected.lane.status,'AVAILABLE');
assert.equal(selected.records.length,Object.values(counts).reduce((a,b)=>a+b,0));
assert(selected.records.every(row=>row.metric==='weekly_rank'&&row.sourceId==='fantasypros_pitti_selected_weekly_panel'));
assert(selected.records.every(row=>row.provenance.identityBound===true&&row.provenance.aggregation==='FILTERED_ECR_SELECTED_PITTI_PANEL'));
const noFilterEcho=structuredClone(selectedPayloads);for(const position of evidence.POSITIONS)delete noFilterEcho[position].providerPayload.filters;const noEchoResult=evidence.selectedWeeklyRankLane(noFilterEcho,{season,week,scoring:'HALF_PPR',sleeperPlayers:players,verifiedAt:now});assert.equal(noEchoResult.lane.status,'AVAILABLE','exact returned expert membership must prove identity when the provider omits its filter echo');
for(const position of evidence.POSITIONS){
  assert.equal(selected.lane.coverage.positions[position].status,'AVAILABLE');
  assert.deepEqual(selected.lane.coverage.positions[position].missingExperts,[]);
}

// An explicitly requested expert who supplies no current positional vote stays missing.
// If enough other selected experts remain, their filtered consensus is still usable.
const oneMissing=structuredClone(selectedPayloads);
const missingExpert=oneMissing.RB.requestedExperts[0];
delete oneMissing.RB.providerPayload.expert_name[missingExpert.id];
delete oneMissing.RB.providerPayload.expert_pub[missingExpert.id];
oneMissing.RB.providerPayload.total_experts--;
const missingResult=evidence.selectedWeeklyRankLane(oneMissing,{season,week,scoring:'HALF_PPR',sleeperPlayers:players,verifiedAt:now});
assert.equal(missingResult.lane.coverage.positions.RB.status,'AVAILABLE');
assert(missingResult.lane.coverage.positions.RB.missingExperts.includes(missingExpert.name));
assert(!missingResult.lane.coverage.positions.RB.actualExperts.some(expert=>expert.id===missingExpert.id));
assert(missingResult.records.filter(row=>row.position==='RB').every(row=>row.provenance.missingSelectedExperts.includes(missingExpert.name)));

// Provider identity binding is fail-closed.
const filterMismatch=structuredClone(selectedPayloads);
filterMismatch.QB.providerPayload.filters=filterMismatch.QB.requestedExperts.slice(1).map(x=>x.id).join(':');
const filterRejected=evidence.selectedWeeklyRankLane(filterMismatch,{season,week,scoring:'HALF_PPR',sleeperPlayers:players,verifiedAt:now});
assert.equal(filterRejected.lane.coverage.positions.QB.status,'UNAVAILABLE');
assert.equal(filterRejected.lane.coverage.positions.QB.reason,'FILTER_IDENTITY_MISMATCH');
assert.equal(filterRejected.records.filter(row=>row.position==='QB').length,0);

const unexpected=structuredClone(selectedPayloads);
unexpected.WR.providerPayload.expert_name['999']='Unexpected Expert';
unexpected.WR.providerPayload.expert_pub['999']='Unexpected Source';
unexpected.WR.providerPayload.total_experts++;
const unexpectedRejected=evidence.selectedWeeklyRankLane(unexpected,{season,week,scoring:'HALF_PPR',sleeperPlayers:players,verifiedAt:now});
assert.equal(unexpectedRejected.lane.coverage.positions.WR.status,'UNAVAILABLE');
assert.equal(unexpectedRejected.lane.coverage.positions.WR.reason,'UNPROVEN_EXPERT_IDENTITY');
assert.equal(unexpectedRejected.records.filter(row=>row.position==='WR').length,0);

const totalMismatch=structuredClone(selectedPayloads);
totalMismatch.TE.providerPayload.total_experts++;
const totalRejected=evidence.selectedWeeklyRankLane(totalMismatch,{season,week,scoring:'HALF_PPR',sleeperPlayers:players,verifiedAt:now});
assert.equal(totalRejected.lane.coverage.positions.TE.status,'UNAVAILABLE');
assert.equal(totalRejected.lane.coverage.positions.TE.reason,'UNPROVEN_EXPERT_IDENTITY');

const tooFew=structuredClone(selectedPayloads);
const keepId=tooFew.QB.requestedExperts[0].id;
tooFew.QB.providerPayload.expert_name=Object.fromEntries([[keepId,tooFew.QB.providerPayload.expert_name[keepId]]]);
tooFew.QB.providerPayload.expert_pub=Object.fromEntries([[keepId,tooFew.QB.providerPayload.expert_pub[keepId]]]);
tooFew.QB.providerPayload.total_experts=1;
const fewRejected=evidence.selectedWeeklyRankLane(tooFew,{season,week,scoring:'HALF_PPR',sleeperPlayers:players,verifiedAt:now});
assert.equal(fewRejected.lane.coverage.positions.QB.status,'UNAVAILABLE');
assert.equal(fewRejected.lane.coverage.positions.QB.reason,'INSUFFICIENT_SELECTED_EXPERTS');
assert.equal(fewRejected.records.filter(row=>row.position==='QB').length,0);

// A missing current selected-rank response may retain still-fresh same-week prior
// selected evidence, but a contradictory current response must purge that position.
const priorSelected=evidence.buildSnapshot({season,week,scoring:'HALF_PPR',selectedRankingPayloads:selectedPayloads,sleeperPlayers:players,verifiedAt:now});
assert(priorSelected.records.some(row=>row.metric==='weekly_rank'&&row.position==='QB'));
const absentCurrent=structuredClone(selectedPayloads);
absentCurrent.QB={...absentCurrent.QB,providerPayload:null,providerResponsePresent:false};
const retained=evidence.buildSnapshot({season,week,scoring:'HALF_PPR',selectedRankingPayloads:absentCurrent,sleeperPlayers:players,priorSnapshot:priorSelected,verifiedAt:now+1000});
assert.equal(retained.lanes.pittiSelectedWeeklyRanks.coverage.positions.QB.responsePresent,false);
assert(retained.records.some(row=>row.metric==='weekly_rank'&&row.position==='QB'),'fresh prior selected QB ranks must survive a missing current provider response');
const contradictoryCurrent=structuredClone(selectedPayloads);
contradictoryCurrent.QB.providerPayload.week=week+1;
const purged=evidence.buildSnapshot({season,week,scoring:'HALF_PPR',selectedRankingPayloads:contradictoryCurrent,sleeperPlayers:players,priorSnapshot:priorSelected,verifiedAt:now+1000});
assert.equal(purged.lanes.pittiSelectedWeeklyRanks.coverage.positions.QB.responsePresent,true);
assert(!purged.records.some(row=>row.metric==='weekly_rank'&&row.position==='QB'),'contradictory current selected QB response must purge prior rank evidence');

// Broad ECR is retained only as an explicitly separate stabilizer lane.
const broad=evidence.weeklyRankLane(broadPayloads,{season,week,scoring:'HALF_PPR',sleeperPlayers:players,verifiedAt:now});
assert.equal(broad.lane.status,'AVAILABLE');
assert.equal(broad.lane.panelStatus,'BROAD_CONSENSUS_ONLY');
assert.equal(broad.lane.metric,'broad_weekly_ecr_rank');
assert(broad.records.every(row=>row.metric==='broad_weekly_ecr_rank'&&row.sourceId==='fantasypros_weekly_ecr'));

console.log('SEASON_SELECTED_WEEKLY_PANEL_REGRESSION_PASS');
