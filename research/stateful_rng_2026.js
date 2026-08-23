'use strict';
/* Bit-exact stateful form of the rc4.59 full-policy harness RNG.
   Snapshot/restore is research instrumentation only; sequence math is unchanged. */
function statefulRng(seedOrState){
  let a=(typeof seedOrState==='object'?seedOrState.a:seedOrState)>>>0;
  let draws=(typeof seedOrState==='object'?(seedOrState.draws||0):0)>>>0;
  const r=function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;draws++;return((t^t>>>14)>>>0)/4294967296};
  r.snapshot=()=>({a:a>>>0,draws});
  r.clone=()=>statefulRng(r.snapshot());
  return r;
}
function legacyRng(seed){let a=seed>>>0;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
module.exports={statefulRng,legacyRng};
