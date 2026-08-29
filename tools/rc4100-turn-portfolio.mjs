import fs from 'node:fs';
import assert from 'node:assert/strict';
const app=fs.readFileSync('app.js','utf8');
const grab=name=>{
  const s=app.indexOf(`function ${name}`);assert.ok(s>=0,name+' missing');
  let i=app.indexOf('{',s),d=0;
  for(let j=i;j<app.length;j++){if(app[j]==='{')d++;else if(app[j]==='}'){d--;if(d===0)return app.slice(s,j+1)}}
  throw new Error(name+' parse');
};
const src=grab('applyTurnPortfolioOrdering');
const factory=new Function('normalCandidateAdmissible',src+';return applyTurnPortfolioOrdering');
const fn=factory(()=>true);
const row=(name,pos,ret,panel,rawScore=50,extra={})=>({p:{name,pos},ret,r:{rank:panel},rawScore,score:rawScore,action:ret>=.72?'WAIT':'—',reasons:[],...extra});
{
  const leader=row('Deferable Leader','QB',.961,76.6,100);
  const alt=row('Comparable Alternative','RB',.808,100.2,47);
  const other=row('Too Late Alternative','RB',.71,116.4,30);
  const out=fn([leader,alt,other],89,92);
  assert.equal(out[0],alt,'short-turn portfolio should take the comparable lower-return alternative first');
  assert.match(alt.reasons.join(' | '),/Turn-Portfolio/,'portfolio rationale missing');
  assert.match(leader.reasons.join(' | '),/Folgepick/,'deferred leader rationale missing');
  assert.equal(leader.rawScore,100,'leader score must not be retuned');
  assert.equal(alt.rawScore,47,'alternative score must not be retuned');
}
{
  const leader=row('Long Turn Leader','QB',.96,76.6,100);
  const alt=row('Long Turn Alt','RB',.60,90,80);
  assert.equal(fn([leader,alt],92,109)[0],leader,'long turn with non-urgent alternative must keep leader');
}
{
  const leader=row('Long Turn Deferable Leader','RB',.933,137.2,100);
  const alt=row('Urgent Close Alternative','TE',.006,141.2,92);
  const out=fn([leader,alt],132,149);
  assert.equal(out[0],alt,'long-turn WAIT leader should defer to close-quality genuinely urgent alternative');
  assert.match(alt.reasons.join(' | '),/Turn-Portfolio/,'long-turn rationale missing');
}
{
  const leader=row('Long Turn Too Far Leader','RB',.95,137.2,100);
  const alt=row('Urgent But Too Far','TE',.01,160,92);
  assert.equal(fn([leader,alt],132,149)[0],leader,'long-turn quality cliff must block override');
}
{
  const leader=row('Moderate Return Leader','QB',.80,76.6,100);
  const alt=row('Moderate Alt','RB',.60,90,80);
  assert.equal(fn([leader,alt],89,92)[0],leader,'leader below defer threshold must remain first');
}
{
  const leader=row('High Return Leader','RB',.87,130.3,100);
  const alt=row('Too Much Quality Drop','RB',.48,163.2,31);
  assert.equal(fn([leader,alt],129,132)[0],leader,'quality cliff >25 panel ranks must block override');
}
{
  const leader=row('High Return Leader','QB',.96,80,100);
  const blocked=row('Blocked Alt','RB',.70,90,90,{recommendationBlocked:true});
  assert.equal(fn([leader,blocked],89,92)[0],leader,'blocked alternative must never be promoted');
}
// Exact rc4.104 OOS regression from draft 1399308446632800256, pick129:
{
  const leader=row('Generic Leader','RB',.9011111111111111,130.35,100);
  const zero=row('Generic Score-Zero Alternative','WR',.7988888888888889,139.75,0);
  const out=fn([leader,zero],129,132);
  assert.equal(out[0],leader,'short-turn score-0 alternative must not displace a score-100 leader');
  assert.equal(zero.rawScore,0,'quality floor must not mutate the alternative score');
  assert.equal(zero.ret,.7988888888888889,'quality floor must not mutate Return-v2');
}
assert.ok(!src.includes("De'Zhaun Stribling")&&!src.includes('Chris Rodriguez'),'rc4.105 fix must remain player-generic');
assert.ok(!src.includes('Trevor Lawrence')&&!src.includes('Blake Corum'),'player-name forcing detected');
// Exact mandatory rc4.101 pick-132 fixture: Spears was #1 at 93.3% Return,
// Andrews #2 at 0.6%, panel gap 4.05 and raw-score gap 7.9. rc4.104 must
// present Andrews first while leaving both raw scores and Return untouched.
{
  const spears=row('Tyjae Spears','RB',.9333333333333333,137.2,100);
  const andrews=row('Mark Andrews','TE',.005555555555555556,141.25,92.1);
  const out=fn([spears,andrews],132,149);
  assert.equal(out[0],andrews,'pick132 frozen fixture must defer Spears to urgent Andrews');
  assert.equal(spears.rawScore,100);
  assert.equal(andrews.rawScore,92.1);
  assert.equal(spears.ret,.9333333333333333);
  assert.equal(andrews.ret,.005555555555555556);
}
console.log('RC4100_TURN_PORTFOLIO_PASS');
