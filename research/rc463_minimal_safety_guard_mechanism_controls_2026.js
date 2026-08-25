'use strict';
/* Pure research mechanism regression for the MINIMAL repeat-QB/TE PlayerQualitySafety guard.
   This deliberately contains NO v3/v5 late-WR ranking patch and NO production mutation. */
const assert=require('assert');
const threshold=pn=>pn<=30?7:pn<=70?9:pn<=110?11:13;
const r=(name,pos,raw,panel,adp)=>({name,pos,raw,panel,adp,hardExcluded:false,recommendationBlocked:false});
function fullSafety(rows,pn){
  rows=rows.map(x=>({...x}));const valid=rows.filter(x=>Number.isFinite(x.panel)&&Number.isFinite(x.raw)&&!x.hardExcluded&&!x.recommendationBlocked);const natural=valid.slice().sort((a,b)=>b.raw-a.raw||a.panel-b.panel)[0],best=Math.min(...valid.map(x=>x.panel)),th=threshold(pn),gap=natural.panel-best;if(gap>=th){const max=best+Math.max(3,Math.floor(th/2)),maxRaw=Math.max(...valid.map(x=>x.raw)),s=valid.filter(x=>x.panel<=max).sort((a,b)=>a.panel-b.panel||b.raw-a.raw)[0];if(s)s.raw=Math.max(s.raw,maxRaw+.25)}return rows.sort((a,b)=>b.raw-a.raw||a.panel-b.panel)}
function guardedSafety(rows,pn,counts){
  rows=rows.map(x=>({...x}));const all=rows.filter(x=>Number.isFinite(x.panel)&&Number.isFinite(x.raw)&&!x.hardExcluded&&!x.recommendationBlocked),natural=all.slice().sort((a,b)=>b.raw-a.raw||a.panel-b.panel)[0];
  const eligible=x=>{const n=Number(counts[x.pos]||0);if(!((x.pos==='QB'||x.pos==='TE')&&n>=1))return true;if(x===natural)return true;const slide=Number.isFinite(x.adp)?pn-x.adp:0;return x.pos==='QB'?(x.panel<=45&&slide>=35):(x.panel<=35&&slide>=30)};
  const pool=all.filter(eligible);assert(pool.length);const best=Math.min(...pool.map(x=>x.panel)),th=threshold(pn),gap=natural.panel-best;if(gap>=th){const max=best+Math.max(3,Math.floor(th/2)),maxRaw=Math.max(...all.map(x=>x.raw)),s=pool.filter(x=>x.panel<=max).sort((a,b)=>a.panel-b.panel||b.raw-a.raw)[0];if(s)s.raw=Math.max(s.raw,maxRaw+.25)}
  for(const x of rows)x.safetyEligible=eligible(x);return rows.sort((a,b)=>b.raw-a.raw||a.panel-b.panel)
}
const tests=[];function eq(name,a,b){assert.deepStrictEqual(a,b,name);tests.push(name)}
// First QB/TE: count zero must be exactly invariant.
for(const [pos,pn] of [['QB',69],['TE',109]]){const rows=[r('A',pos,80,50,60),r('B','RB',90,70,75),r('C','WR',89,72,80)];eq('first '+pos+' ordering invariant',guardedSafety(rows,pn,{QB:pos==='QB'?0:1,TE:pos==='TE'?0:1,RB:2,WR:4}).map(x=>[x.name,x.raw]),fullSafety(rows,pn).map(x=>[x.name,x.raw]))}
// Natural repeat win survives; repeat candidate is not suppressed.
{const rows=[r('NaturalQB2','QB',110,80,90),r('RB','RB',100,90,95),r('WR','WR',99,95,100)],g=guardedSafety(rows,112,{QB:1,TE:1,RB:3,WR:5});assert.equal(g[0].name,'NaturalQB2');assert(g.find(x=>x.name==='NaturalQB2').safetyEligible);tests.push('natural repeat QB win survives')}
{const rows=[r('NaturalTE2','TE',108,75,90),r('RB','RB',100,90,95),r('WR','WR',99,95,100)],g=guardedSafety(rows,112,{QB:1,TE:1,RB:3,WR:5});assert.equal(g[0].name,'NaturalTE2');assert(g.find(x=>x.name==='NaturalTE2').safetyEligible);tests.push('natural repeat TE win survives')}
// Exceptional slide remains safety eligible and may be promoted.
{const rows=[r('EliteQBSlide','QB',80,40,50),r('RB','RB',100,70,95),r('WR','WR',99,72,100)],g=guardedSafety(rows,92,{QB:1,TE:1,RB:2,WR:5});assert(g.find(x=>x.name==='EliteQBSlide').safetyEligible);assert.equal(g[0].name,'EliteQBSlide');tests.push('exceptional QB slide safety eligible')}
{const rows=[r('EliteTESlide','TE',80,30,70),r('RB','RB',100,65,100),r('WR','WR',99,67,105)],g=guardedSafety(rows,112,{QB:1,TE:1,RB:3,WR:5});assert(g.find(x=>x.name==='EliteTESlide').safetyEligible);assert.equal(g[0].name,'EliteTESlide');tests.push('exceptional TE slide safety eligible')}
// Ordinary repeat remains on board but cannot be safety-only resurrected.
{const rows=[r('OrdinaryQB2','QB',70,76,98),r('CorumLike','RB',102,90,94),r('WR','WR',90,95,105)],g=guardedSafety(rows,92,{QB:1,TE:1,RB:2,WR:5});const q=g.find(x=>x.name==='OrdinaryQB2');assert(q&&!q.hardExcluded&&!q.recommendationBlocked&&!q.safetyEligible);assert.equal(g[0].name,'CorumLike');tests.push('ordinary QB2 visible but no safety resurrection')}
// Late RB/WR order is untouched when no QB/TE safety resurrection is involved. This is not a late-WR policy.
for(const counts of [{QB:1,TE:1,RB:4,WR:6},{QB:1,TE:1,RB:7,WR:6}]){const rows=[r('WR','WR',101,112,146),r('RB','RB',100,128,160),r('QB2','QB',20,140,170)];eq('late RBWR unchanged '+counts.RB,guardedSafety(rows,149,counts).slice(0,2).map(x=>[x.name,x.raw]),fullSafety(rows,149).slice(0,2).map(x=>[x.name,x.raw]))}
console.log(JSON.stringify({status:'PASS',tests:tests.length,names:tests,scope:'minimal PlayerQualitySafety repeat-QB/TE promotion eligibility only',late_wr_policy_bundled:false,production_mutation:false},null,2));
