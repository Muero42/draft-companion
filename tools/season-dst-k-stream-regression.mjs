import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const evidence=require('../season-evidence-layer.js');
const stream=require('../dst-k-season-stream.js');

const now=Date.parse('2026-09-06T12:00:00Z'),asOf='2026-09-06T10:00:00Z';
const player=(id,name,pos,team,dropCost=.2,seasonStatus='ACTIVE')=>({p:{id,name,pos,team},dropCost,seasonStatus});
const currentDst=player('dst-old','Old DST','DST','OLD',.1),futureDst=player('dst-future','Future DST','DST','FUT'),ownedDst=player('dst-owned','Owned DST','DST','OWN');
const rosterK=player('k-live','Live K','K','LIV'),betterK=player('k-better','Better K','K','BET'),marginalK=player('k-marginal','Marginal K','K','MAR');
const rb=player('rb-drop','Drop RB','RB','RB',.2),qb=player('qb-only','Only QB','QB','QB',0),te=player('te-only','Only TE','TE','TE',0),ir=player('ir-star','IR Star','RB','IR',0,'RESERVE');
const meta=(week,gameId,team)=>({provider:'Verified Weekly',sourceAsOf:asOf,verified:true,verifiedAt:asOf,week,gameId,team});
const rows=[];
function addWeek(row,week,projection,rank,opponent,total=44,spread=0,stadium='DOME'){
  const gameId=`${row.p.id}-w${week}`,m=meta(week,gameId,row.p.team);
  rows.push(evidence.normalizeDatum('PLAYER_PROJECTION',projection,{...m,playerId:row.p.id,unit:'HALF_PPR_POINTS'},{now}));
  rows.push(evidence.normalizeDatum('POSITIONAL_RANK',rank,{...m,playerId:row.p.id},{now}));
  rows.push(evidence.normalizeDatum('OPPONENT',opponent,{...m,playerId:row.p.id},{now}));
  rows.push(evidence.normalizeDatum('GAME_TOTAL',total,m,{now}));
  rows.push(evidence.normalizeDatum('TEAM_SPREAD',spread,m,{now}));
  rows.push(evidence.normalizeDatum('STADIUM_TYPE',stadium,m,{now}));
}
addWeek(currentDst,1,7,12,'AAA');addWeek(currentDst,2,6,16,'BBB');
addWeek(futureDst,1,7.1,11,'CCC');addWeek(futureDst,2,10,2,'DDD',37,-7);
addWeek(ownedDst,1,14,1,'EEE');addWeek(ownedDst,2,14,1,'FFF');
addWeek(rosterK,1,8,10,'GGG');addWeek(betterK,1,10,2,'HHH');addWeek(marginalK,1,8.4,8,'III');
const cache=evidence.createCache(rows),baseRoster=[currentDst,rosterK,rb,qb,te,ir];

let dst=stream.evaluateDst({roster:baseRoster,candidates:[futureDst,ownedDst],ownedPlayerIds:['dst-old','dst-owned','k-live'],evidenceCache:cache,week:1,activeLimit:5});
assert.deepEqual(dst.map(x=>x.candidate.p.id),['dst-future'],'owned/unavailable D/ST must never be an add candidate');
assert.equal(dst[0].status,'STREAM/ADD');assert.equal(dst[0].earlyStash,true);assert.equal(dst[0].capacity.drop.p.id,'rb-drop');
assert.notEqual(dst[0].capacity.drop.p.id,'ir-star','Reserve/IR cannot satisfy stream capacity');

const costlyRoster=baseRoster.map(x=>x.p.id==='rb-drop'?{...x,dropCost:9}:x);
dst=stream.evaluateDst({roster:costlyRoster,candidates:[futureDst],ownedPlayerIds:[],evidenceCache:cache,week:1,activeLimit:5});
assert.equal(dst[0].status,'MONITOR','future matchup cannot clear a larger live roster/drop cost');
assert.equal(stream.ordinaryDrops(costlyRoster).some(x=>x.p.id==='qb-only'||x.p.id==='te-only'||x.p.id==='ir-star'),false,'only-active QB/TE and IR protections must survive shared capacity logic');

const staleRows=rows.map(x=>x.playerId==='dst-future'?{...x,status:'STALE',fresh:false}:x);
dst=stream.evaluateDst({roster:baseRoster,candidates:[futureDst],ownedPlayerIds:[],evidenceCache:evidence.createCache(staleRows),week:1,activeLimit:5});
assert.equal(dst[0].status,'MONITOR');assert.equal(dst[0].actionable,false,'stale matchup/Vegas/weather evidence must fail closed');

let kick=stream.evaluateKicker({roster:baseRoster,candidates:[betterK,marginalK,rb,ownedDst],ownedPlayerIds:['k-live','k-better'],evidenceCache:cache,week:1});
assert.deepEqual(kick.candidates.map(x=>x.candidate.p.id),['k-marginal'],'kickers compare only with available kickers');
assert.equal(kick.status,'HOLD');assert.equal(kick.best.reason,'MARGINAL_EDGE_AVOID_CHURN');
kick=stream.evaluateKicker({roster:baseRoster,candidates:[betterK],ownedPlayerIds:['k-live'],evidenceCache:cache,week:1});
assert.equal(kick.status,'STREAM/ADD');assert.equal(kick.best.drop.p.id,'k-live','live rostered kicker is replacement authority');

const historicalK=player('k-history','Historical K','K','HIS');
kick=stream.evaluateKicker({roster:[rosterK],historicalRoster:[historicalK],candidates:[marginalK],ownedPlayerIds:['k-live'],evidenceCache:cache,week:1});
assert.equal(kick.current.p.id,'k-live','historical draft state cannot override live Sleeper roster');
assert.equal(stream.ordinaryDrops([qb,te,rb]).every(x=>['RB','WR'].includes(x.p.pos)),true,'D/ST capacity cannot raw-compare protected QB/TE/K');
console.log('season D/ST + K stream regression PASS');
