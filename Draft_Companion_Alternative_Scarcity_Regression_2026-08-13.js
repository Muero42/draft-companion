'use strict';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function alt(rank,alts){
  if(!alts.length)return{bestGap:24,nearEqual:0,qualityAlternatives:0,bonus:4};
  alts=[...alts].sort((a,b)=>a-b); const bestGap=Math.max(0,alts[0]-rank);
  const nearEqual=alts.filter(x=>x<=rank+8).length, qualityAlternatives=alts.filter(x=>x<=rank+15).length;
  let bonus=clamp(bestGap*.24,0,4.5); if(nearEqual>=2)bonus-=2; else if(nearEqual===1)bonus-=1; else if(qualityAlternatives===0)bonus+=1;
  return{bestGap,nearEqual,qualityAlternatives,bonus:clamp(bonus,-2,5)};
}
function mru(pos,current,n){let x=0;if(pos==='RB'&&current>=81){if(n>=7)x-=3.5;else if(n>=6)x-=2;else if(n<=3)x+=1;}if(pos==='WR'&&current>=81){if(n>=8)x-=6;else if(n>=7)x-=4;else if(n>=6)x-=1.5;else if(n<=4)x+=.5;}return x;}
const scarceTE=alt(80,[96,103,111]); const deepQB=alt(71,[78,85,88]);
if(!(scarceTE.bonus>deepQB.bonus))throw new Error(`scarcity ordering failed ${JSON.stringify({scarceTE,deepQB})}`);
if(!(mru('WR',132,7)<mru('RB',132,5)))throw new Error('late roster marginal utility failed');
console.log('PASS alternative scarcity / positional replacement ordering');
console.log('PASS late 7-WR saturation vs RB5 marginal utility');
