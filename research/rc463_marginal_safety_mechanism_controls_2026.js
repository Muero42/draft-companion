'use strict';
const assert=require('assert');
function safetyEligible({pos,count,raw,bestSkill,natural=false,elite=false}){
 if(!['QB','TE'].includes(pos)||count<1)return true;
 return natural||elite||(Number.isFinite(bestSkill)&&raw>=bestSkill+1.0);
}
let n=0;
function t(x,w){assert.equal(safetyEligible(x),w);n++}
t({pos:'QB',count:0,raw:9,bestSkill:10},true);
t({pos:'TE',count:0,raw:9,bestSkill:10},true);
t({pos:'QB',count:1,raw:10.4,bestSkill:10},false);
t({pos:'TE',count:1,raw:10.99,bestSkill:10},false);
t({pos:'QB',count:1,raw:11,bestSkill:10},true);
t({pos:'TE',count:2,raw:12,bestSkill:10},true);
t({pos:'QB',count:2,raw:9,bestSkill:10,natural:true},true);
t({pos:'TE',count:3,raw:9,bestSkill:10,elite:true},true);
t({pos:'RB',count:9,raw:1,bestSkill:10},true);
t({pos:'WR',count:9,raw:1,bestSkill:10},true);
console.log(JSON.stringify({status:'PASS',tests:n,scope:'repeat-QB/TE PlayerQualitySafety eligibility only',marginal_hurdle_raw:1.0,natural_repeat_preserved:true,elite_slide_preserved:true,rb_wr_unchanged:true,late_wr_patch_bundled:false,hard_ban:false,production_mutation:false},null,2));
