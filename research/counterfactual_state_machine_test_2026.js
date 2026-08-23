'use strict';
/* Integration-level synthetic test of the exact state transition pattern required
   by the real rc4.59 counterfactual harness. It deliberately exercises opponent
   RNG draws before/after treatment, cloning, divergent availability, and replay. */
const assert=require('assert');
const {statefulRng}=require('./stateful_rng_2026');
const C=require('./decision_counterfactual_core_2026');
function mk(){return {pickNo:1,available:['a','b','c','d','e','f'],picks:[],rosters:{1:[],9:[]},outerRngState:null}}
function sync(s,r){s.outerRngState=r.snapshot()}
function opp(s,r){const ids=[...s.available].sort();const id=ids[Math.floor(r()*ids.length)];s.available=s.available.filter(x=>x!==id);s.picks.push({pick_no:s.pickNo,draft_slot:1,player_id:id});s.rosters[1].push(id);s.pickNo++;sync(s,r);return id}
function user(s,id){assert(s.available.includes(id));s.available=s.available.filter(x=>x!==id);s.picks.push({pick_no:s.pickNo,draft_slot:9,player_id:id});s.rosters[9].push(id);s.pickNo++}
const s=mk(),r=statefulRng(123456);sync(s,r);opp(s,r);opp(s,r);const treatment=C.deepClone(s);const fp=C.prefixFingerprint(treatment);
function branch(id){const b=C.deepClone(treatment),br=statefulRng(b.outerRngState);assert.strictEqual(C.prefixFingerprint(b),fp);user(b,id);sync(b,br);const after=[];while(b.available.length){after.push(opp(b,br))}return {b,after}}
const avail=[...treatment.available];const x=branch(avail[0]),x2=branch(avail[0]),y=branch(avail[1]);
assert.deepStrictEqual(x,x2,'same treatment failed deterministic replay');
assert.strictEqual(C.prefixFingerprint(treatment),fp,'base mutated by branch');
assert.notDeepStrictEqual(x.b.picks,y.b.picks,'different treatment did not alter branch');
// Outer stream is identical at treatment; the first random variate is therefore
// identical, while the chosen player may differ because the available set differs.
assert.deepStrictEqual(x.b.outerRngState,y.b.outerRngState,'branches consumed unequal outer RNG draws');
console.log(JSON.stringify({status:'PASS',shared_prefix:true,same_treatment_replay:true,base_immutable:true,equal_outer_draw_consumption:true,divergent_board_response:true}));
