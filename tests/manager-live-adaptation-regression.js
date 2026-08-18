'use strict';
const assert = require('assert');

const POSITIONS = ['QB','RB','WR','TE'];
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));

/* Deterministic reference contract for the mandatory 2026 live-adaptation layer.
   This is deliberately isolated from production until every invariant passes against
   the real rc4.50 manager/Return-v2 path. */
function updateLivePrior(state, observation){
  const s=JSON.parse(JSON.stringify(state));
  const {pos, autodraftProbability=0, isUser=false}=observation;
  if(isUser || !POSITIONS.includes(pos)) return s;

  // Suspected autodraft must not teach a human preference. Fade the live-human
  // contribution continuously; at >= 0.65 it is a strict no-learn branch.
  if(autodraftProbability>=0.65){
    s.autodraftProbability=Math.max(s.autodraftProbability||0,autodraftProbability);
    return s;
  }
  const humanWeight=clamp(1-autodraftProbability,0,1);
  const n=(s.humanObservations||0)+humanWeight;
  const phaseCounts={...(s.phaseCounts||{})};
  phaseCounts[pos]=(phaseCounts[pos]||0)+humanWeight;
  s.phaseCounts=phaseCounts;
  s.humanObservations=n;
  s.autodraftProbability=Math.max(s.autodraftProbability||0,autodraftProbability);

  // Bounded sequential evidence: one pick cannot flip the regime; repeated coherent
  // picks can progressively outweigh history. 0.12 per effective human observation,
  // capped at 0.72 current-draft weight.
  s.currentDraftWeight=clamp(n*0.12,0,0.72);
  return s;
}

function livePositionMultiplier(state,pos,historicalMultiplier=1){
  const n=state.humanObservations||0;
  if(!n) return historicalMultiplier;
  const observed=(state.phaseCounts?.[pos]||0)/n;
  const neutral=0.25;
  const live=clamp(1+(observed-neutral)*1.2,0.70,1.60);
  const w=state.currentDraftWeight||0;
  return historicalMultiplier*(1-w)+live*w;
}

const base={humanObservations:0,phaseCounts:{},currentDraftWeight:0,autodraftProbability:0};

// 1. Known/suspected autodraft branch is absolute no-learn for personal preference.
const auto=updateLivePrior(base,{pos:'RB',autodraftProbability:0.80});
assert.strictEqual(auto.humanObservations,0);
assert.deepStrictEqual(auto.phaseCounts,{});
assert.strictEqual(livePositionMultiplier(auto,'RB',1.25),1.25);

// 2. One surprising human pick is bounded: historical prior remains dominant.
const one=updateLivePrior(base,{pos:'QB',autodraftProbability:0});
assert(one.currentDraftWeight<=0.12+1e-12);
const oneQB=livePositionMultiplier(one,'QB',0.80);
assert(oneQB<1.00,'one pick must not abruptly reverse a strong historical wait-QB prior');

// 3. Repeated coherent current-draft evidence progressively outweighs stale history.
let repeated=base;
for(let i=0;i<6;i++) repeated=updateLivePrior(repeated,{pos:'RB',autodraftProbability:0});
assert.strictEqual(repeated.currentDraftWeight,0.72);
assert(livePositionMultiplier(repeated,'RB',0.80)>1.0,'coherent 2026 evidence should be able to overturn history');

// 4. Partial autodraft suspicion downweights learning rather than contaminating it.
const partial=updateLivePrior(base,{pos:'WR',autodraftProbability:0.40});
assert(Math.abs(partial.humanObservations-0.60)<1e-12);
assert(partial.currentDraftWeight<one.currentDraftWeight);

// 5. User picks never update opponent profiles.
const user=updateLivePrior(base,{pos:'TE',isUser:true});
assert.deepStrictEqual(user,base);

// 6. Determinism/provenance: same frozen observations => byte-identical state/output.
const obs=[{pos:'WR',autodraftProbability:0},{pos:'RB',autodraftProbability:0.1},{pos:'WR',autodraftProbability:0}];
const run=()=>obs.reduce(updateLivePrior,base);
assert.strictEqual(JSON.stringify(run()),JSON.stringify(run()));
assert.strictEqual(livePositionMultiplier(run(),'WR',1.05),livePositionMultiplier(run(),'WR',1.05));

console.log('PASS manager-live-adaptation-regression');
