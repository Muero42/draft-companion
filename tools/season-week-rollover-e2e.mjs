// Offline integration: real Sleeper-week adapter, refresh, persistence and decision consumers.
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import weekly from '../weekly-evidence-v2.js';
import lineup from '../lineup-start-sit-v2.js';
const app=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');
function source(name){
  const match=new RegExp(`(?:async )?function ${name}\\(`).exec(app);assert(match,name);
  const start=match.index,brace=app.indexOf('){',start)+1;let depth=0;
  for(let i=brace;i<app.length;i++){if(app[i]==='{')depth++;else if(app[i]==='}'&&--depth===0)return app.slice(start,i+1);}
  throw Error(name);
}
const now=Date.parse('2026-09-30T12:00:00Z'),players={},payloads={};
for(const [position,count] of Object.entries({QB:24,RB:60,WR:70,TE:24})){
  const rows=Array.from({length:count},(_,i)=>{const id=position+i;players[id]={full_name:id,position,team:'BUF',fantasy_data_id:Object.keys(players).length+1000};return{fpid:players[id].fantasy_data_id,name:id,position_id:position,team_id:'BUF',stats:{points_half:i===0?10:25}};});
  payloads[position]={season:2026,week:3,positions:position,scoring:'STD',updated:'2026-09-30',players:rows};
}
const row=(id,status='ACTIVE')=>({p:{id,name:id,pos:players[id].position,team:'BUF'},seasonStatus:status});
const rows=['QB0','RB0','WR0','WR1','TE0','RB2','WR2','RB3'].map(id=>row(id));rows.push(row('RB4','RESERVE'));
const target=row('RB1'),drop=rows[1],slots=['QB','RB','WR','WR','TE','FLEX','WRRB_FLEX','K','DEF',...Array(6).fill('BN')];
const rosters=Array.from({length:10},(_,i)=>({roster_id:i+1,players:i?[]:rows.map(x=>x.p.id),reserve:i?[]:['RB4'],taxi:[],starters:i?[]:rows.slice(0,7).map(x=>x.p.id)}));
const season={ok:true,source:'Sleeper direct',generated_at:now,league:{season:'2026',settings:{leg:3},roster_positions:slots},transaction_round:3,current_nfl_week:3,my_roster:rosters[0],league_rosters:rosters,ownership:Object.fromEntries(rows.map(x=>[x.p.id,{roster_id:1,reserve:x.seasonStatus==='RESERVE',taxi:false}]))};
const cache=new Map(),storage={getItem:k=>cache.has(k)?JSON.stringify(cache.get(k)):null,setItem:(k,v)=>cache.set(k,JSON.parse(v)),removeItem:k=>cache.delete(k)};
let reportedWeek=3,failProjections=false,staleRanks=false,requests=[],observedWeeks=[];
class Clock extends Date{static now(){return now;}}
const sandbox={Date:Clock,console,URL,Number,String,Array,Object,Math,Promise,Map,Set,
  PittiWeeklyEvidenceV2:weekly,PittiLineupStartSitV2:lineup,
  WEEKLY_PROJECTION_POSITIONS:['QB','RB','WR','TE'],SEASON_RANKING_AUTO_MS:10800000,SEASON_RANKING_RETRY_MS:2700000,
  seasonRankingRefreshBusy:false,localStorage:storage,store:{get:(k,f)=>cache.get(k)??f,set:(k,v)=>{cache.set(k,v);return true;}},
  els:{season:{value:'2026'},scoring:{value:'HALF'},seasonRefreshEvidenceBtn:{},seasonRankingStatus:{}},navigator:{onLine:true},
  lastDraftContext:{season,players},S:'https://api.sleeper.app/v1',
  jf:async()=>({season:'2026',season_type:'regular',week:reportedWeek}),
  codedError:(code,message)=>Object.assign(Error(message),{code}),
  fpProxyRequest:async path=>{requests.push(path);const u=new URL(path,'https://fixture.invalid');if(staleRanks&&path.includes('/consensus-rankings'))return{ok:true,status:200,data:{season:2026,week:3,scoring:'HALF',position_id:u.searchParams.get('position'),last_updated:'09/30',players:payloads[u.searchParams.get('position')].players.map((r,i)=>({...r,rank_ecr:i+1,last_updated:'09/30'}))}};return path.includes('/projections')&&!failProjections?{ok:true,status:200,data:{...payloads[u.searchParams.get('position')],week:Number(u.searchParams.get('week'))}}:{ok:false,status:503};},
  fetch:async()=>({ok:false,status:503,json:async()=>({})}),
  persistSeasonProjectionRetryAfter:()=>0,persistSeasonWeeklyMetadata:(k,v)=>cache.set(k,v),renderSeasonRankingFreshness:()=>{},
  rerenderPostDraftFromContext:()=>observedWeeks.push(season.current_nfl_week),
  BOONE_TRADE_VALUE_CACHE_KEY:'trade',adaptBooneTradeEvidence:()=>({available:false,values:{}}),SLEEPER_NON_STARTER_SLOTS:new Set(['BN','IR','TAXI'])
};sandbox.globalThis=sandbox;vm.createContext(sandbox);
for(const name of ['deriveSleeperNflWeek','currentSleeperNflWeek','isTransientSleeperNflStateError','deriveSleeperLeagueWeekFallback','refreshSeasonRankings','seasonEvidenceContext','seasonEvidenceValue','seasonEvidenceCache','seasonWeeklyMetric','seasonWeeklyEvidenceValueMap','seasonSlotEligible','tradeStarterSlots','tradeBestLineup','seasonLiveAuthority','seasonRosterAuthority','seasonLegalDrop','seasonProjectionLineup','seasonAcquisitionDecision'])vm.runInContext(source(name),sandbox);
const initial=await sandbox.refreshSeasonRankings({auto:true});assert.equal(initial.ok,true);
const week3=cache.get(weekly.CACHE_KEY);assert.equal(week3.week,3);assert.equal(week3.lanes.projections.status,'AVAILABLE');
requests=[];const same=await sandbox.refreshSeasonRankings({auto:true});assert.equal(same.skipped,'fresh');assert.equal(requests.length,0);assert.equal(season.current_nfl_week,3,'never infer Week 4 from calendar date');
reportedWeek=4;staleRanks=true;requests=[];
const rollover=await sandbox.refreshSeasonRankings({auto:true,trigger:'resume'});
assert.equal(rollover.ok,true);assert.notEqual(rollover.skipped,'fresh','fresh Week 3 must not suppress authoritative Week 4 refresh');
assert.equal(season.current_nfl_week,4);const week4=cache.get(weekly.CACHE_KEY);
assert.equal(week4.lanes.expertWeeklyRanks.status,'UNAVAILABLE','provider Week-3 ranks cannot be relabeled as Week 4');assert.equal(week4.week,4);assert(week4.records.length>0&&week4.records.every(r=>r.week===4));
assert.equal(requests.filter(p=>p.includes('/projections?week=4')).length,4);
assert.equal(weekly.validateSnapshot(week3,{season:2026,week:4,scoring:'HALF_PPR'},now).ok,false);
assert.equal(sandbox.seasonWeeklyMetric(target.p,'projected_points').week,4);
const values=sandbox.seasonWeeklyEvidenceValueMap(rows,season,4,now);
assert.equal(values.gameValid,false);assert(!values.values.RB4,'Reserve excluded');
const evidence=lineup.adaptEvidence({week:4,scoring:'HALF_PPR',source:'verified',as_of:new Date(now).toISOString(),players:values.values},{week:4,now});
const result=lineup.evaluate({roster:rows,evidence,week:4,slots:['QB','RB','WR','WR','TE','FLEX','W/R'],currentAssignments:rows.slice(0,7).map((x,slotIndex)=>({playerId:x.p.id,slotIndex})),now});
assert(result.lineup.complete,'Start/Sit survives unavailable ranks, Team Total, weather and game context');
assert(result.changes.length>0,'current-week projections produce useful lineup changes');
assert.equal(sandbox.seasonAcquisitionDecision(drop,target,rows,season).action,'CLEAR ADD','Week 4 live-unowned ADD/DROP uses actual current records');
season.ownership.RB1={roster_id:10};assert.equal(sandbox.seasonAcquisitionDecision(drop,target,rows,season).action,'HOLD');delete season.ownership.RB1;
assert.equal(sandbox.seasonAcquisitionDecision(rows.at(-1),target,rows,season).action,'HOLD');
cache.set(weekly.CACHE_KEY,week3);cache.set('v190_seasonEvidence',week3.records);
assert.notEqual(sandbox.seasonWeeklyMetric(target.p,'projected_points').status,'VERIFIED');
assert.equal(sandbox.seasonAcquisitionDecision(drop,target,rows,season).action,'HOLD','legacy Week 3 also cannot drive actionable Week 4 decisions');
// Even failed acquisition and provider Retry-After must immediately invalidate Week 3 consumers.
for(const rateLimited of [false,true]){
  season.current_nfl_week=3;failProjections=true;requests=[];observedWeeks=[];
  cache.set('pitti.weekly-evidence.v2.retryAfterUntil',rateLimited?now+60000:0);
  const failed=await sandbox.refreshSeasonRankings({force:!rateLimited,auto:true});
  assert.equal(failed.ok,false);assert.equal(season.current_nfl_week,4);
  assert(observedWeeks.includes(4),'week authority rerenders before optional acquisition can fail');
  assert.equal(cache.get(weekly.CACHE_KEY),week3,'failed refresh retains cache without making it current');
  assert.equal(sandbox.seasonAcquisitionDecision(drop,target,rows,season).action,'HOLD');
  if(rateLimited)assert.equal(requests.length,0,'respect provider retry-after across rollover');
}
console.log('SEASON_WEEK_ROLLOVER_E2E_PASS: Sleeper 3 -> 4, persistence, Start/Sit, ADD/DROP, stale rejection, optional-lane isolation');
