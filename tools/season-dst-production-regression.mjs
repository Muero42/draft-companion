import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
import {RUNTIME_FILES} from './runtime-files.mjs';
const app=fs.readFileSync('app.js','utf8');
function source(name){const start=app.indexOf('function '+name+'(');assert(start>=0,name);const brace=app.indexOf('){',start)+1;let n=0;for(let i=brace;i<app.length;i++){if(app[i]==='{')n++;else if(app[i]==='}'&&--n===0)return app.slice(start,i+1);}throw Error(name);}
const now=Date.now(),cache=new Map(),p=(id,pos,status='ACTIVE')=>({p:{id,name:id,pos,team:id},seasonStatus:status});
const rows=[p('q','QB'),p('r','RB'),p('w','WR'),p('t','TE'),p('old','DST'),p('k','K'),p('bench','RB'),p('reserve','RB','RESERVE'),p('taxi','RB','TAXI')];
const roster={roster_id:1,players:rows.map(x=>x.p.id),reserve:['reserve'],taxi:['taxi']};
const season={ok:true,source:'Sleeper direct',generated_at:now,player_directory:{fetchedAt:now},league:{season:'2026',roster_positions:['QB','RB','WR','TE','DEF','K','BN']},my_roster:roster,current_nfl_week:4,league_rosters:[roster,...Array.from({length:9},(_,i)=>({roster_id:i+2,players:i===8?['owned']:[],reserve:[],taxi:[]}))],ownership:Object.fromEntries(rows.map(x=>[x.p.id,{roster_id:1,reserve:x.seasonStatus==='RESERVE',taxi:x.seasonStatus==='TAXI'}]))};
const c={draftComplete:true,season,seasonRows:rows,availableDST:[p('free','DST').p,p('owned','DST').p,p('old','DST').p]};
const s={console,Date,Map,Set,Math,Number,String,Object,Array,lastDraftContext:c,store:{get:(k,f)=>cache.get(k)??f},BOONE_TRADE_VALUE_CACHE_KEY:'trade',adaptBooneTradeEvidence:()=>({available:false,values:{}}),esc:String,els:{waiverList:{}},SLEEPER_NON_STARTER_SLOTS:new Set(['BN','IR','TAXI'])};s.globalThis=s;// These model-unit fixtures provide verified future game context at the source boundary.
  Object.assign(s,{seasonDstTeam:x=>x,PittiGameContextV1:{CACHE_KEY:'verified-future-game-fixture',validateSnapshot:()=>({ok:true}),contextForTeam:()=>({status:'VERIFIED',locked:false})}});if(s.globalThis)s.globalThis.PittiGameContextV1=s.PittiGameContextV1;
  vm.createContext(s);
for(const name of ['seasonEvidenceContext','seasonEvidenceValue','seasonEvidenceCache','seasonLiveAuthority','seasonRosterAuthority','seasonStructurallyDroppable','seasonCurrentWeekEligibility','seasonWeeklyMetric','seasonProjectionLineup','tradeBestLineup','tradeStarterSlots','seasonSlotEligible','seasonDstTeam','seasonDstEvidence','seasonDstPlan','renderSeasonDstPlanner','historicalSpecialTeamsBaselineAllowed','renderSpecialTeamsBoard'])vm.runInContext(source(name),s);
vm.runInContext("const SPECIAL_TEAMS_W1_BASELINE_EXPIRES_AT=Date.parse('2026-09-08T12:00:00Z')",s);
const record=(id,week,value)=>({playerId:id,season:2026,week,metric:'projected_points',value,status:'VERIFIED',scoring:'HALF_PPR',confidence:.9,sourceId:'verified-fixture',sourceUrl:'https://example.test/fixture',publishedAt:now-1000,verifiedAt:now-500,expiresAt:now+60000,gameId:id+'-'+week});
const evidence=rows.filter(x=>['QB','RB','WR','TE'].includes(x.p.pos)).map(x=>record(x.p.id,4,x.p.id==='bench'?1:10));
for(const week of [4,5,6])for(const id of ['old','free'])evidence.push(record(id,week,id==='old'?7:week===4?7.2:week===5?10:11));
const games=evidence.filter(r=>['old','free'].includes(r.playerId)).map(r=>({...r,opponent:'OPP',dome:false,kickoffAt:new Date(now+(r.week-3)*86400000).toISOString()}));
cache.set('v190_seasonEvidence',evidence);cache.set('v190_gameContext',games);
let plan=s.seasonDstPlan(c,now);assert.deepEqual(Array.from(plan.horizons,h=>h.week),[4,5,6]);
assert.equal(plan.current.p.id,'old');assert.equal(plan.kicker.p.id,'k');
assert(plan.horizons.every(h=>h.decisions.length===1),'ownership union excludes own and opponent-owned even if ownership map omits opponent');
assert.equal(plan.horizons[0].decisions[0].status,'HOLD');
for(const h of plan.horizons.slice(1)){const d=h.decisions[0];assert.equal(d.status,'STASH');assert.equal(d.capacity.drop.p.id,'bench');assert.equal(d.capacity.cost,(h.week-4)*.5);assert(d.net>=1.25);}
let html=s.renderSpecialTeamsBoard(now);for(const week of [4,5,6])assert(html.includes('WEEK '+week));assert(html.includes('STASH · free'));assert(html.includes('DROP: bench'));assert(!/RotoBaller|Current-week Special Teams evidence is not verified|vs ARI/.test(html));
// Insufficient, stale, mismatched or conflicting evidence cannot authorize a stash.
for(const mutate of [rs=>rs.filter(r=>r.week!==6),rs=>rs.map(r=>r.week===6?{...r,expiresAt:now-1}:r),rs=>rs.map(r=>r.week===6?{...r,gameId:'wrong'}:r),rs=>[...rs,{...rs.find(r=>r.playerId==='free'&&r.week===6),conflict:true}]]){cache.set('v190_seasonEvidence',mutate(evidence));assert.equal(s.seasonDstPlan(c,now).horizons[2].decisions[0].status,'MONITOR');}
cache.set('v190_seasonEvidence',evidence.map(r=>r.playerId==='free'&&r.week===5?{...r,value:8}:r));assert.equal(s.seasonDstPlan(c,now).horizons[1].decisions[0].status,'HOLD','positive edge below slot cost plus threshold stays HOLD');
cache.set('v190_seasonEvidence',evidence);
rows.find(x=>x.p.id==='bench').protected=true;
assert.equal(s.seasonDstPlan(c,now).horizons[1].decisions[0].status,'HOLD','replacing the starting RB with the protected bench RB costs more than the stash benefit');
for(const id of ['r','w'])rows.find(x=>x.p.id===id).protected=true;
assert.equal(s.seasonDstPlan(c,now).horizons[1].decisions[0].status,'MONITOR','IR/taxi, protected players and sole QB/TE cannot fund a stash');
for(const id of ['bench','r','w'])delete rows.find(x=>x.p.id===id).protected;
season.league.roster_positions.push('BN');plan=s.seasonDstPlan(c,now);assert.equal(plan.horizons[1].decisions[0].capacity.drop,null);assert.equal(plan.horizons[1].decisions[0].capacity.cost,.5);season.league.roster_positions.pop();
cache.set('v190_seasonEvidence',evidence.map(r=>r.playerId==='free'&&r.week===4?{...r,value:10}:r));let d=s.seasonDstPlan(c,now).horizons[0].decisions[0];assert.equal(d.status,'ADD');assert.equal(d.capacity.drop.p.id,'old','current D/ST replaces only D/ST');
cache.set('v190_gameContext',[]);assert(s.seasonDstPlan(c,now).horizons.every(h=>h.decisions[0].status==='MONITOR'));
season.generated_at=now-300001;assert.equal(s.seasonDstPlan(c,now).live,false);assert(!s.renderSpecialTeamsBoard(now).includes('STASH ·'));
assert.equal(RUNTIME_FILES.length,18);assert(RUNTIME_FILES.includes('app.js'));assert(!RUNTIME_FILES.includes('dst-k-season-stream.js'));assert(app.includes('return renderSeasonDstPlanner(c,now)'));
console.log('SEASON_DST_PRODUCTION_PASS: shipped Week 4/5/6 planner, binding/freshness, ownership, protected capacity, thresholds, optional context isolation');
