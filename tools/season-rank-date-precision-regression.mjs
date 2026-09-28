import assert from 'node:assert/strict';
import evidence from '../weekly-evidence-v2.js';
import game from '../game-context-v1.js';

const now=Date.parse('2026-09-28T08:49:47.051Z');
const context={season:2026,week:3,scoring:'HALF_PPR',verifiedAt:now};
const sleeperPlayers={},rankings={},selected={},projections={};
const sourceCounts={QB:61,RB:112,WR:177,TE:113};
const projectionCounts={QB:[72,72],RB:[114,106],WR:[200,199],TE:[112,111]};
let id=100;
for(const position of evidence.POSITIONS){
  const rows=[];
  const [total,mapped]=projectionCounts[position];
  for(let i=0;i<Math.max(sourceCounts[position],total);i++){
    const fpid=++id,name=`${position} fixture ${i}`;
    // The ranking fixture maps all rows; projection-only unknowns stay unmapped.
    if(i<mapped||i>=total)sleeperPlayers[String(fpid)]={full_name:name,position,team:'AAA',fantasy_data_id:fpid};
    rows.push({fpid,name,position_id:position,team_id:'AAA',rank_ecr:i+1,stats:{points_half:10}});
  }
  rankings[position]={season:2026,week:3,scoring:'HALF',position_id:position,last_updated:'09/27',players:rows.slice(0,sourceCounts[position])};
  projections[position]={providerPayload:{season:2026,week:3,scoring:'STD',position_id:position,last_updated:'09/27',players:rows.slice(0,total)},requestProvenance:{season:2026,week:3,position,scope:'WEEKLY',queryShape:evidence.WEEKLY_PROJECTION_QUERY_SHAPE}};
  const ids=position==='RB'?['317','285','835','3585','120','22']:['317','285','120','22'];
  const requested=ids.map(id=>({id,name:`Expert ${id}`}));
  selected[position]={providerPayload:{...structuredClone(rankings[position]),filters:ids.join(':'),total_experts:ids.length,expert_name:Object.fromEntries(requested.map(x=>[x.id,x.name])),expert_pub:Object.fromEntries(ids.map(id=>[id,'Fixture']))},requestedExperts:requested,requestProvenance:{season:2026,week:3,position,scoring:'HALF',experts:'show',requestedExpertIds:ids}};
}
context.sleeperPlayers=sleeperPlayers;
const broad=evidence.weeklyRankLane(rankings,context);
assert.equal(broad.lane.status,'AVAILABLE');
assert(broad.records.every(r=>r.sourceTimePrecision==='DATE'&&r.sourcePublishedAt===null&&r.sourcePublishedDate==='2026-09-27'&&r.metric==='broad_weekly_ecr_rank'));
assert(broad.records.every(r=>evidence.weeklyRecordChronology(r,context,now)));
assert(broad.records.every(r=>!evidence.weeklyRecordChronology(r,context,now+evidence.EVIDENCE_TTL_MS+1)));
assert.equal(evidence.selectedWeeklyRankLane(selected,context).lane.status,'AVAILABLE');
for(const date of ['09/26','09/29','invalid']){
  const old=structuredClone(rankings),oldSelected=structuredClone(selected);
  for(const pos of evidence.POSITIONS){old[pos].last_updated=date;oldSelected[pos].providerPayload.last_updated=date;}
  assert.equal(evidence.weeklyRankLane(old,context).records.length,0,date);
  assert.equal(evidence.selectedWeeklyRankLane(oldSelected,context).records.length,0,date);
}
for(const stamp of ['2026-09-27T08:49:47.050Z','2026-09-28T08:49:47.052Z']){
  const old=structuredClone(rankings);for(const pos of evidence.POSITIONS)old[pos].last_updated=stamp;
  assert.equal(evidence.weeklyRankLane(old,context).records.length,0,'exact timestamps retain exact TTL');
}
const missing=structuredClone(selected);
for(const pos of evidence.POSITIONS){delete missing[pos].providerPayload.expert_name;delete missing[pos].providerPayload.expert_pub;}
assert.equal(evidence.selectedWeeklyRankLane(missing,context).records.length,0,'HTTP success/request IDs cannot prove provider identity');
const wrong=structuredClone(selected);wrong.QB.providerPayload.expert_name['999']='Unexpected';
assert.equal(evidence.selectedWeeklyRankLane(wrong,context).lane.coverage.positions.QB.status,'UNAVAILABLE');
const mixed=structuredClone(rankings);mixed.RB.players[0].position_id='WR';
assert.equal(evidence.weeklyRankLane(mixed,context).lane.coverage.positions.RB.status,'AVAILABLE','isolated wrong-position row is contained');
assert.equal(evidence.weeklyRankLane(mixed,context).lane.coverage.positions.RB.rejectedPositionRows,1);
assert.deepEqual(evidence.rankingPayloadDiagnostic(mixed.RB).positionCounts,{WR:1,RB:111});
assert.equal(evidence.rankingPayloadDiagnostic(missing.RB.providerPayload).identityFieldTypes.expert_name,'ABSENT');
const snapshot=evidence.buildSnapshot({...context,projectionPayloads:projections,rankingPayloads:rankings,selectedRankingPayloads:missing});
assert.equal(snapshot.lanes.projections.status,'AVAILABLE');
assert.equal(snapshot.records.filter(r=>r.metric==='projected_points').length,488);
assert.equal(snapshot.records.filter(r=>r.metric==='weekly_rank').length,0);
assert(snapshot.records.some(r=>r.metric==='broad_weekly_ecr_rank'));
const events=Array.from({length:16},(_,i)=>({id:String(i),date:'2026-09-27T17:00:00Z',competitions:[{venue:{fullName:`Fixture ${i}`,indoor:i===0},competitors:[{homeAway:'home',team:{abbreviation:`H${i}`}},{homeAway:'away',team:{abbreviation:`A${i}`}}]}]}));
const games=game.buildSnapshot({season:2026,week:3,events,verifiedAt:now,sourceUrl:'https://site.api.espn.com/test'});
assert.equal(game.validateSnapshot(games,context,now).ok,true);
assert.equal(games.coverage.acceptedGames,16);assert.equal(games.coverage.acceptedTeams,32);
assert.equal(games.games[0].weather.reason,'INDOOR_NO_WEATHER_REQUIRED');
assert(games.games.slice(1).every(g=>g.weather.reason==='FRESH_FORECAST_UNAVAILABLE'));
assert(games.games.every(g=>g.vegas.status==='UNAVAILABLE'));
console.log('SEASON_RANK_DATE_PRECISION_PASS: W3 previous-date ranks, stale rejection, 488 projections, identity isolation and bounded shape diagnostics');
