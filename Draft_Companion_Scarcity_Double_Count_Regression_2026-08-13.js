'use strict';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function alt(rank,alts){
 if(!alts.length)return{bestGap:24,nearEqual:0,qualityAlternatives:0,bonus:4};
 alts=[...alts].sort((a,b)=>a-b); const bestGap=Math.max(0,alts[0]-rank);
 const nearEqual=alts.filter(x=>x<=rank+8).length, qualityAlternatives=alts.filter(x=>x<=rank+15).length;
 let bonus=clamp(bestGap*.24,0,4.5); if(nearEqual>=2)bonus-=2; else if(nearEqual===1)bonus-=1; else if(qualityAlternatives===0)bonus+=1;
 return{bestGap,nearEqual,qualityAlternatives,bonus:clamp(bonus,-2,5)};
}
function legacyTierScore(sameTierCount,tierGap){let b=0;if(sameTierCount===1)b+=.75;else if(sameTierCount<=2)b+=.5;if(tierGap!=null&&tierGap>=8)b+=Math.min(.75,tierGap/20);return Math.min(1.5,b);}
function rc46ScarcityScore(rank,alts){return alt(rank,alts).bonus;}
const rank=80, alts=[96,103,111], legacy=legacyTierScore(1,16), replacement=alt(rank,alts).bonus;
if(!(legacy>0&&replacement>0))throw new Error('fixture must expose prior duplicate signal');
if(rc46ScarcityScore(rank,alts)!==replacement)throw new Error('rc4.7 must score replacement scarcity exactly once');
if(rc46ScarcityScore(rank,[82,84,87])>0)throw new Error('deep near-equal alternatives must not gain tier-boundary urgency');
console.log('PASS scarcity single-channel: tier geometry diagnostic, replacement scarcity scored once');
