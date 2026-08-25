'use strict';
/* Pure mechanism controls for the rc4.63 repeated-position Safety threshold treatment.
   These controls intentionally do not execute the draft model; they verify the treatment contract
   at boundaries and exception semantics before expensive paired runs are interpreted. */
const assert=require('assert');
function admissible({gap,threshold,isNatural=false,isEliteSlide=false,alreadyRostered=true,pos='QB'}){
 if(!['QB','TE'].includes(pos)||!alreadyRostered)return true;
 if(isNatural||isEliteSlide)return true;
 return Number.isFinite(gap)&&gap>=threshold;
}
for(const threshold of[-15,0]){
 assert.equal(admissible({gap:threshold-.001,threshold}),false);
 assert.equal(admissible({gap:threshold,threshold}),true);
 assert.equal(admissible({gap:threshold+.001,threshold}),true);
 assert.equal(admissible({gap:-65,threshold,isNatural:true}),true);
 assert.equal(admissible({gap:-65,threshold,isEliteSlide:true}),true);
 assert.equal(admissible({gap:-65,threshold,alreadyRostered:false}),true);
 assert.equal(admissible({gap:-65,threshold,pos:'RB'}),true);
 assert.equal(admissible({gap:-65,threshold,pos:'WR'}),true);
}
// Observed exact parity-validated repeated-position sample extrema.
assert.equal(admissible({gap:-11.663,threshold:-15}),true);
assert.equal(admissible({gap:-15.001,threshold:-15}),false);
assert.equal(admissible({gap:-11.663,threshold:0}),false);
// Natural Pick-92 defect is far below either threshold and must be suppressed absent an elite-slide exception.
assert.equal(admissible({gap:-54.428049,threshold:-15}),false);
assert.equal(admissible({gap:-54.428049,threshold:0}),false);
console.log(JSON.stringify({status:'PASS',thresholds:[-15,0],controls:'boundary + natural leader + elite slide + first QB/TE + RB/WR noninterference + Pick92 defect',production_mutation:false},null,2));