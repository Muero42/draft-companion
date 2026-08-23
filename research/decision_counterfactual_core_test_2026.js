'use strict';
const assert=require('assert');
const C=require('./decision_counterfactual_core_2026');
const players={a:{id:'a',name:'A',pos:'RB'},b:{id:'b',name:'B',pos:'WR'}};
const base={pickNo:9,available:['a','b'],picks:[],rosters:{9:[]},outerRngState:{seed:123,cursor:8},playerById:players};
const legal=()=>true;
function applyPick(s,p,pn,slot){s.picks.push({pick_no:pn,draft_slot:slot,player_id:p.id,metadata:{position:p.pos,player_name:p.name}});s.rosters[slot].push(p.id)}
const clone=C.deepClone(base);C.assertSamePrefix(base,clone);
const a=C.forceTreatment(base,players.a,{playerById:players,isRosterLegal:legal,applyPick});
assert.deepStrictEqual(base.picks,[]);assert.deepStrictEqual(base.available,['a','b']);assert.deepStrictEqual(a.outerRngState,base.outerRngState);assert.deepStrictEqual(a.available,['b']);
assert.throws(()=>C.forceTreatment(base,{id:'x'},{playerById:players,isRosterLegal:legal,applyPick}),/unknown candidate/);
const bad=C.deepClone(base);bad.outerRngState.cursor++;assert.throws(()=>C.assertSamePrefix(base,bad),/shared prefix mismatch/);
function badPick(s,p,pn,slot){applyPick(s,p,pn,slot);s.outerRngState.cursor++}
assert.throws(()=>C.forceTreatment(base,players.a,{playerById:players,isRosterLegal:legal,applyPick:badPick}),/advanced outer RNG/);
console.log(JSON.stringify({status:'PASS',tests:['clone-prefix','base-immutability','forced-treatment','unavailable-unknown-failclosed','prefix-rng-mismatch-failclosed','treatment-rng-advance-failclosed']}));
