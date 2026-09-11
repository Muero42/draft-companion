import assert from 'node:assert/strict';
import fs from 'node:fs';
import lineup from '../lineup-start-sit-v2.js';

const row=(id,pos,projection,status='ACTIVE')=>({p:{id,name:id,pos},seasonStatus:status,projection});
const now=Date.now(),week=1;
const evidence=rows=>lineup.adaptEvidence({week,scoring:'HALF_PPR',source:'Verified Week 1 provider',as_of:new Date(now).toISOString(),players:Object.fromEntries(rows.map((x,i)=>[x.p.id,{projected_points:x.projection,positional_rank:i+1,opponent:'OPP'}]))},{week,now});
const base=[row('qb','QB',20),row('rb1','RB',15),row('rb2','RB',14),row('wr1','WR',16),row('wr2','WR',13),row('te1','TE',12),row('te2','TE',18),row('k','K',9),row('dst','DST',8),row('bench-wr','WR',8)];

assert.equal(lineup.eligible('FLEX','RB'),true);assert.equal(lineup.eligible('FLEX','WR'),true);assert.equal(lineup.eligible('FLEX','TE'),true);
assert.equal(lineup.eligible('W/R','RB'),true);assert.equal(lineup.eligible('W/R','WR'),true);assert.equal(lineup.eligible('W/R','TE'),false);
{
  const result=lineup.evaluate({roster:base,evidence:evidence(base),week,now});
  assert.equal(result.status,'RECOMMENDED');
  assert.equal(result.lineup.assignments.filter(x=>x.player?.p.pos==='TE').length,2,'TE2 must win a legal FLEX');
  const ids=result.lineup.assignments.map(x=>x.player?.p.id);assert.equal(new Set(ids).size,ids.length,'no player may be assigned twice');
  assert(result.lineup.assignments.every(x=>lineup.eligible(x.slot,x.player.p.pos)),'every assignment must satisfy exact slot eligibility');
}
{
  const reserve=row('historical-draft-star','RB',99,'RESERVE'),live=[...base,reserve],result=lineup.evaluate({roster:live,evidence:evidence(live),week,now});
  assert(!result.lineup.assignments.some(x=>x.player?.p.id===reserve.p.id),'Reserve/IR cannot start');
  assert(!result.lineup.assignedIds.has('historical-only-player'),'historical draft rows cannot overwrite the supplied live roster');
}
assert.equal(lineup.eligible('FLEX','K'),false);assert.equal(lineup.eligible('W/R','DST'),false);
{
  const result=lineup.evaluate({roster:base,evidence:evidence(base),week,now});
  assert(result.alternatives.every(x=>!['K','DST','DEF'].includes(x.start.p.pos)&&!['K','DST','DEF'].includes(x.bench.p.pos)),'special teams must be isolated');
}
for(const raw of [
  {week,scoring:'HALF_PPR',source:'old',as_of:'2026-01-01T00:00:00Z',players:{}},
  {week:2,scoring:'HALF_PPR',source:'wrong week',as_of:new Date(now).toISOString(),players:{}},
  {week,scoring:'HALF_PPR',source:'missing rows',as_of:new Date(now).toISOString()},
  {week,scoring:'PRESEASON',source:'ADP/ECR',as_of:new Date(now).toISOString(),players:{}}
])assert.equal(lineup.evaluate({roster:base,evidence:raw,week,now}).status,'UNAVAILABLE');
const incomplete=base.map(x=>({...x})),ev=evidence(incomplete);delete ev.values.qb;
assert.equal(lineup.evaluate({roster:incomplete,evidence:ev,week,now}).status,'MONITOR','missing player Week-N evidence must not be guessed');

const app=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');
assert(app.includes("seasonWeeklyMetric(p,'projected_points'"),'runtime lineup consumes verified weekly projections');
assert(app.includes('Sleeper liefert aktuelle Aufstellung, Ownership und die kanonischen Roster-Slots'),'runtime declares live Sleeper lineup authority');
assert(app.includes('THIS WEEK is the verified legal-lineup projection delta')&&app.includes('Draft/panel ranks and generic news scores may never substitute'),'preseason/draft rank cannot substitute for weekly evidence');
console.log('season lineup start-sit v2 regression PASS');
