'use strict';
const assert=require('assert');
function safetyEligible({pos,count,raw,bestSkill,natural=false,elite=false}){
 if(!['QB','TE'].includes(pos)||count<1)return true;
 return natural||elite||(Number.isFinite(bestSkill)&&raw>=bestSkill-1.0);
}
let n=0;function t(x,w){assert.equal(safetyEligible(x),w);n++}
// First QB/TE unchanged.
t({pos:'QB',count:0,raw:1,bestSkill:10},true);
t({pos:'TE',count:0,raw:1,bestSkill:10},true);
// Repeat QB/TE can receive safety only inside the explicit near-tie band.
t({pos:'QB',count:1,raw:9.01,bestSkill:10},true);
t({pos:'TE',count:1,raw:9,bestSkill:10},true);
t({pos:'QB',count:1,raw:8.99,bestSkill:10},false);
t({pos:'TE',count:2,raw:7,bestSkill:10},false);
// Natural leaders and existing elite slides remain eligible regardless of gap.
t({pos:'QB',count:1,raw:2,bestSkill:10,natural:true},true);
t({pos:'TE',count:3,raw:2,bestSkill:10,elite:true},true);
// Skill positions are untouched.
t({pos:'RB',count:9,raw:1,bestSkill:10},true);
t({pos:'WR',count:9,raw:1,bestSkill:10},true);
// Frozen natural pick92 shape: ordinary QB2 huge raw deficit must fail safety eligibility.
t({pos:'QB',count:1,raw:47.739460,bestSkill:102.167509},false);
console.log(JSON.stringify({status:'PASS',tests:n,scope:'repeat-QB/TE safety-only near-tie eligibility',raw_deficit_band:1.0,frozen_pick92_blocked:true,natural_repeat_preserved:true,elite_slide_preserved:true,rb_wr_unchanged:true,late_wr_patch_bundled:false,hard_ban:false,production_mutation:false},null,2));
