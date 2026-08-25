'use strict';
/* Pure research regression for the v5 decision contract. No production code import/mutation.
   It guards the intended mechanism shape before interpreting full-draft distributions. */
const assert=require('assert');
function order(rows,pn,counts){
  rows=rows.map(x=>({...x,prio:Number(x.score||0)}));
  const valid=rows.filter(x=>!x.hardExcluded&&!x.recommendationBlocked&&Number.isFinite(x.raw));
  const bestSkill=valid.filter(x=>['RB','WR'].includes(x.pos)).sort((a,b)=>b.raw-a.raw||a.panel-b.panel)[0];
  if(bestSkill)for(const x of valid){
    const n=Number(counts[x.pos]||0);
    if(!((x.pos==='QB'||x.pos==='TE')&&n>=1))continue;
    const slide=Number.isFinite(x.adp)?pn-x.adp:0;
    const exceptional=x.pos==='QB'?(x.panel<=45&&slide>=35):(x.panel<=35&&slide>=30);
    if(!exceptional&&x.raw<bestSkill.raw+1.0)x.prio=Math.min(x.prio,bestSkill.prio-0.01);
  }
  if(pn>=120&&Number(counts.WR||0)>=6){
    const bestWR=valid.filter(x=>x.pos==='WR').sort((a,b)=>b.raw-a.raw||a.panel-b.panel)[0];
    const bestRB=valid.filter(x=>x.pos==='RB').sort((a,b)=>b.raw-a.raw||a.panel-b.panel)[0];
    if(bestWR&&bestRB){const gap=bestWR.raw-bestRB.raw;if(gap>=0&&gap<=1.0&&Number(counts.RB||0)<7)bestRB.prio=Math.max(bestRB.prio,bestWR.prio+0.01)}
  }
  return rows.sort((a,b)=>b.prio-a.prio||b.score-a.score||b.raw-a.raw||a.panel-b.panel).map(x=>x.name);
}
const r=(name,pos,score,raw,panel,adp)=>({name,pos,score,raw,panel,adp});
const tests=[];
function t(name,rows,pn,counts,want){const got=order(rows,pn,counts)[0];assert.equal(got,want,name+': '+got+' != '+want);tests.push(name)}
// Natural pick92 mechanism shape: ordinary QB2 cannot edge an almost-equal skill player merely by normalized score.
t('ordinary QB2 loses marginal near-tie',[r('QB2','QB',100,10.4,76,97.5),r('RB','RB',99,10.0,90,93.7)],92,{QB:1,RB:2,WR:5,TE:1},'RB');
// But a materially superior repeat QB can still win; this is not a hard ban.
t('material QB2 edge survives',[r('QB2','QB',100,12.0,70,90),r('RB','RB',90,10.0,90,95)],92,{QB:1,RB:2,WR:5,TE:1},'QB2');
// Existing exceptional-slide condition bypasses the hurdle.
t('exceptional QB slide survives',[r('EliteQB','QB',100,9.0,40,50),r('RB','RB',99,10.0,90,95)],92,{QB:1,RB:2,WR:5,TE:1},'EliteQB');
// First QB is untouched.
t('first QB untouched',[r('QB1','QB',100,9.0,80,90),r('RB','RB',99,10.0,90,95)],92,{QB:0,RB:2,WR:5,TE:1},'QB1');
// TE analogue.
t('ordinary TE2 loses marginal near-tie',[r('TE2','TE',100,10.4,80,100),r('WR','WR',99,10.0,90,95)],112,{QB:1,RB:3,WR:5,TE:1},'WR');
t('exceptional TE slide survives',[r('EliteTE','TE',100,9.0,30,70),r('WR','WR',99,10.0,90,95)],112,{QB:1,RB:3,WR:5,TE:1},'EliteTE');
// Late WR saturation: only a near-tie and only below RB7.
t('late WR6 near-tie favors RB',[r('WR7','WR',100,10.6,112,146),r('RB5','RB',99,10.0,128,143)],129,{QB:1,RB:4,WR:6,TE:1},'RB5');
t('late quality gap keeps WR',[r('WR','WR',100,12.0,112,146),r('RB','RB',91,10.0,128,160)],149,{QB:1,RB:6,WR:6,TE:1},'WR');
t('RB7 saturation disables WR correction',[r('WR','WR',100,10.5,112,146),r('RB8','RB',99,10.0,128,160)],149,{QB:1,RB:7,WR:6,TE:1},'WR');
console.log(JSON.stringify({status:'PASS',tests:tests.length,names:tests,production_mutation:false},null,2));
