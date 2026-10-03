import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
const app=fs.readFileSync('app.js','utf8');
const functionSource=name=>{const start=app.indexOf('function '+name+'(');assert(start>=0,name);const end=app.indexOf('\nfunction ',start+1);return (app.slice(start-6,start)==='async '?'async ':'')+app.slice(start,end<0?undefined:end);};
const cache=new Map(),now=Date.now();
const season={ok:true,source:'Sleeper direct',generated_at:now,player_directory:{fetchedAt:now},league_rosters:Array.from({length:10},(_,i)=>({roster_id:i+1})),ownership:{},league:{season:'2026',roster_positions:['QB','RB','WR','TE','FLEX','WRRB_FLEX','BN','BN','BN','BN','BN','BN']},transaction_round:2};
// Decision-unit fixtures mock the source boundary; real validation is covered by the Production parity regression.
const sandbox={Date,console,BOONE_TRADE_VALUE_CACHE_KEY:'pitti.boone-trade-values.v1.current',adaptBooneTradeEvidence:()=>({available:true,values:Object.fromEntries((cache.get('v190_seasonEvidence')||[]).filter(r=>r.metric==='trade_value').map(r=>[r.playerId,r]))}),store:{get:(key,fallback)=>cache.get(key)??fallback},lastDraftContext:{season},SLEEPER_NON_STARTER_SLOTS:new Set(['BN','IR','TAXI']),esc:s=>String(s),loadResearchEvents:()=>[]};
// These model-unit fixtures provide verified future game context at the source boundary.
  Object.assign(sandbox,{seasonDstTeam:x=>x,PittiGameContextV1:{CACHE_KEY:'verified-future-game-fixture',validateSnapshot:()=>({ok:true}),contextForTeam:()=>({status:'VERIFIED',locked:false})}});if(sandbox.globalThis)sandbox.globalThis.PittiGameContextV1=sandbox.PittiGameContextV1;
  vm.createContext(sandbox);
for(const name of ['seasonSlotEligible','tradeStarterSlots','tradeBestLineup','seasonStructurallyDroppable'])vm.runInContext(functionSource(name),sandbox);
vm.runInContext(app.slice(app.indexOf('function seasonEvidenceContext('),app.indexOf('function fpStoreKey(')),sandbox);
const player=(id,pos,rank=50,status='ACTIVE')=>({p:{id,name:id,pos,bye:7},r:{rank},seasonStatus:status,pk:{pick_no:20}});
const liveRosters=(mine,opponent=[])=>{season.league_rosters=Array.from({length:10},(_,i)=>({roster_id:i+1,players:(i===0?mine:i===1?opponent:[]).map(x=>x.p.id),reserve:(i===0?mine:i===1?opponent:[]).filter(x=>x.seasonStatus==='RESERVE').map(x=>x.p.id),taxi:[]}));season.my_roster=season.league_rosters[0];season.ownership=Object.fromEntries(season.league_rosters.flatMap(r=>r.players.map(id=>[id,{roster_id:r.roster_id,reserve:r.reserve.includes(id),taxi:false}])));};
const record=(p,metric,value,extra={})=>({playerId:p.p.id,metric,value,season:2026,week:2,scoring:'HALF_PPR',status:'VERIFIED',confidence:.9,sourceId:'fixture-primary',sourceUrl:'https://example.test/fixture',publishedAt:now-1000,verifiedAt:now-500,expiresAt:now+10000,...extra});

// Actual core; synthetic evidence only at the provider boundary.
const mine=[player('mr','RB'),player('mw','WR'),player('mx','WR')],opp=[player('or','RB'),player('ow','WR'),player('ox','RB')];
function setup(values=[20,20,20,20,20,20]){season.generated_at=now;season.transaction_round=2;season.league.roster_positions=['RB','WR','BN','BN','BN'];season.transactions=[];liveRosters(mine,opp);sandbox.lastDraftContext.players=Object.fromEntries([...mine,...opp].map(x=>[x.p.id,{position:x.p.pos}]));cache.set('v190_seasonEvidence',[...mine,...opp].flatMap((p,i)=>[record(p,'projected_points',[5,20,19,20,5,19][i]),record(p,'trade_value',values[i])]));}
const decide=()=>sandbox.seasonTradeDecision(mine,opp,[mine[2]],[opp[2]],season);
setup();const neutral=decide();assert(neutral.actionable&&neutral.opportunities.length===0,'no invented divergence with insufficient positional cohort');
// Prior 50% cliff: same utility/score/need, adjacent values must have same admission.
const adjacent=[40,40.0001].map(v=>{setup([20,20,20,20,20,v]);return decide()});assert(adjacent.every(d=>d.actionable));assert.equal(adjacent[0].acceptance.score,adjacent[1].acceptance.score);
// Symmetric monotonic market cost: adverse deviation cannot increase plausibility.
for(const direction of ['underpay','overpay']){let previous=Infinity;for(const ratio of [1,1.05,1.1,1.18,1.25,1.5,2,2.001,2.5,4,10,100]){const vals=[20,20,20,20,20,20];vals[direction==='underpay'?5:2]=20*ratio;setup(vals);const d=decide();assert(d.acceptance.score<=previous,direction+' monotonic');previous=d.acceptance.score;if(ratio>=10)assert(!d.actionable,'extreme '+direction+' remains suppressed');}}
setup();mine[2].pk={player_id:'mx',pick_no:55,picked_by:'our-owner'};opp[2].pk={player_id:'ox',pick_no:4,picked_by:'draft-owner'};season.league_rosters[0].owner_id='our-owner';season.league_rosters[1].owner_id='new-owner';
assert.equal(decide().revealedPreferencePenalty,0,'another manager cannot inherit draft preference');assert.equal(decide().managerEvidence.historicalWeight,0);
season.league_rosters[1].owner_id='draft-owner';assert.equal(decide().revealedPreferencePenalty,12,'unique exact owner/player mapping retains shrunk penalty');assert.equal(decide().managerEvidence.historicalWeight,.25);
season.league_rosters[0].manager_name=season.league_rosters[1].manager_name='Duplicate name';assert.equal(decide().revealedPreferencePenalty,12,'display names cannot cross-map IDs');
season.league_rosters[2].owner_id='draft-owner';assert.equal(decide().revealedPreferencePenalty,0,'duplicate owner identity is ambiguous and neutral');delete season.league_rosters[2].owner_id;
opp[2].pk.player_id='other-player';assert.equal(decide().revealedPreferencePenalty,0,'wrong player/pick binding is neutral');opp[2].pk.player_id='ox';
season.league_rosters[1].roster_id=72;season.ownership.ox.roster_id=season.ownership.or.roster_id=season.ownership.ow.roster_id=72;season.league_rosters[1].owner_id='replacement-owner';assert.equal(decide().revealedPreferencePenalty,0,'changed roster ID and owner cannot inherit history');
setup();delete opp[2].pk.picked_by;assert.equal(decide().revealedPreferencePenalty,0,'missing mapping falls back to neutral');
assert.equal(decide().managerEvidence.transactionScope,'CURRENT_ROUND_PARTIAL');assert.equal(decide().managerEvidence.transactionRound,2);
// Rank swaps caused exclusively by microscopic values are ties, not buy/sell beliefs.
const tinyMine=[player('t1','WR'),player('t2','WR')],tinyOpp=[player('t3','WR'),player('t4','WR')],tinyRows=[...tinyMine,...tinyOpp];season.league.roster_positions=['WR','BN','BN','BN'];liveRosters(tinyMine,tinyOpp);sandbox.lastDraftContext.players=Object.fromEntries(tinyRows.map(x=>[x.p.id,{position:'WR'}]));
for(const delta of [0,1e-7,.001]){cache.set('v190_seasonEvidence',tinyRows.flatMap((p,i)=>[record(p,'projected_points',20+(i+1)*delta),record(p,'trade_value',20+(4-i)*delta)]));assert.equal(sandbox.seasonTradeDecision(tinyMine,tinyOpp,[tinyMine[0]],[tinyOpp[0]],season).opportunities.length,0,'noise/neutral must remain unclassified');}
// With material independent weekly and market differences, both labels remain available.
cache.set('v190_seasonEvidence',tinyRows.flatMap((p,i)=>[record(p,'projected_points',[5,10,20,15][i]),record(p,'trade_value',[30,25,20,28][i])]));let d=sandbox.seasonTradeDecision(tinyMine,tinyOpp,[tinyMine[0]],[tinyOpp[0]],season);assert(d.opportunities.some(o=>o.kind==='BUY LOW')&&d.opportunities.some(o=>o.kind==='SELL HIGH'));
cache.set('v190_seasonEvidence',cache.get('v190_seasonEvidence').map(r=>r.metric==='trade_value'?{...r,expiresAt:now-1}:r));d=sandbox.seasonTradeDecision(tinyMine,tinyOpp,[tinyMine[0]],[tinyOpp[0]],season);assert(!d.actionable&&!d.opportunities,'expired side cannot label divergence');
console.log('RC4220_ADVERSARIAL_PASS: noise/neutral/true/stale divergence; exact owner+player mapping, duplicate/missing/changed identities; current-round scope; both-direction market monotonicity; adjacent 50% admission; extreme suppression.');
