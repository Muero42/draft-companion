import assert from 'node:assert/strict';
import fs from 'node:fs';
import trade from '../trade-team-needs-v2.js';

const player=(id,pos,value,pick,status='ACTIVE')=>({p:{id,name:id,pos},draft_pick:pick,seasonStatus:status,value});
const evidence=(rows,extra={})=>trade.adaptEvidence({source:'Verified current redraft chart',as_of:new Date().toISOString(),values:Object.fromEntries(rows.map(x=>[x.p.id,{value:x.value,...extra[x.p.id]}]))});
const slots=['QB','RB','WR','WR','TE','FLEX','W/R','K','DST'];

// TE is legal at FLEX: two valued TEs can both enter the canonical lineup.
{
  const rows=[player('qb','QB',40,20),player('rb1','RB',40,21),player('rb2','RB',35,22),player('wr1','WR',40,23),player('wr2','WR',35,24),player('te1','TE',45,25),player('te2','TE',42,26)];
  const lineup=trade.bestLineup(rows,evidence(rows).values,slots);
  assert.equal(lineup.assignments.filter(x=>x.player?.p.pos==='TE').length,2,'TE2 must remain FLEX-legal');
}

const mine=[player('mine-wr1','WR',80,10),player('JSN','WR',50,60),player('mine-rb','RB',10,130),player('mine-qb','QB',40,50),player('mine-te','TE',35,70),player('mine-wr2','WR',70,25),player('mine-wr3','WR',65,35),player('mine-wr4','WR',60,40)];
const opponent=[player('opp-rb1','RB',80,8),player('Gibbs','RB',50,5),player('opp-wr','WR',10,120),player('opp-qb','QB',40,45),player('opp-te','TE',35,75),player('opp-rb2','RB',70,18),player('opp-rb3','RB',65,28),player('opp-rb4','RB',60,38)];
const all=[...mine,...opponent],fresh=evidence(all);

// JSN -> Gibbs and every severe immediate draft-capital reversal fail hard without news.
{
  const x=trade.evaluateOffer({mine,opponent,give:[mine[1]],get:[opponent[1]],evidence:fresh,slots,maxActive:15,season:{week:0}});
  assert.equal(x.reason,'SEVERE_DRAFT_CAPITAL_REVERSAL');assert.equal(x.actionable,false);
  const explained=evidence(all,{Gibbs:{fresh_reversal_evidence:true,reversal_evidence_source:'verified injury report',reversal_evidence_as_of:new Date().toISOString()}});
  const y=trade.evaluateOffer({mine,opponent,give:[mine[1]],get:[opponent[1]],evidence:explained,slots,maxActive:15,season:{week:0}});
  assert.equal(y.actionable,true,'explicit fresh reversal evidence may pass the plausibility gate');
  const later=trade.evaluateOffer({mine,opponent,give:[mine[1]],get:[opponent[1]],evidence:fresh,slots,maxActive:15,season:{week:2}});
  assert.notEqual(later.reason,'SEVERE_DRAFT_CAPITAL_REVERSAL','Week 2+ disables hard pre-Week-1 veto');
  const ambiguous=trade.evaluateOffer({mine,opponent,give:[mine[1]],get:[opponent[1]],evidence:fresh,slots,maxActive:15,season:{}});
  assert.equal(ambiguous.reason,'TEMPORAL_STATE_UNVERIFIED','ambiguous temporal state fails closed');
}

// An offered position the opponent cannot use and replacement loss on either side reject.
{
  const stacked=[player('opp-wr-star','WR',70,20),player('opp-wr2','WR',65,30),player('opp-rb-only','RB',50,40),player('oq','QB',30,50),player('ot','TE',30,60)];
  const ours=[player('our-rb-extra','RB',50,42),player('our-rb-star','RB',70,12),player('our-wr-only','WR',45,35),player('mq','QB',30,51),player('mt','TE',30,61),player('our-rb3','RB',60,22)];
  const ev=evidence([...stacked,...ours]);
  const noNeed=trade.evaluateOffer({mine:ours,opponent:stacked,give:[ours[0]],get:[stacked[0]],evidence:ev,slots,maxActive:15,season:{week:2}});
  assert.equal(noNeed.actionable,false);assert.notEqual(noNeed.reason,'BILATERAL_UTILITY_PASS');
  const replacement=trade.evaluateOffer({mine:ours,opponent:stacked,give:[ours[2]],get:[stacked[2]],evidence:ev,slots,maxActive:15,season:{week:2}});
  assert.equal(replacement.actionable,false,'loss of the only useful WR invalidates a raw-value target');
}

// Reserve does not create capacity; a 1-for-2 into a full active roster is illegal.
{
  const fillers=Array.from({length:11},(_,i)=>player('f'+i,i%2?'RB':'WR',5,100+i));
  const full=[...mine,...fillers].slice(0,15),opp=[...opponent,player('extra','WR',50,80)];
  const ev=evidence([...full,...opp]);
  const x=trade.evaluateOffer({mine:full,opponent:opp,give:[full[0]],get:[opp[0],opp[1]],evidence:ev,slots,maxActive:15,season:{week:2}});
  assert.equal(x.reason,'ILLEGAL_ROSTER_CAPACITY');
}

// Missing/stale current values can never produce an actionable offer.
{
  const stale=trade.adaptEvidence({source:'old chart',as_of:'2026-01-01T00:00:00Z',values:{}});
  const x=trade.evaluateOffer({mine,opponent,give:[mine[1]],get:[opponent[1]],evidence:stale,slots,season:{week:2}});
  assert.equal(x.status,'MONITOR');assert.equal(x.actionable,false);assert.equal(x.reason,'STALE_VALUATION');
}

const app=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');
assert.ok(app.includes('Sleeper roster_id is a league roster identifier, NOT the historical draft slot.'));
assert.ok(app.includes("temporalPhase==='PRE_WEEK_1'"),'runtime trade veto must derive from temporal authority');
assert.ok(!app.includes('preWeek1:true'),'runtime must not permanently force pre-Week-1 mode');
console.log('season trade team-needs v2 regression PASS');
