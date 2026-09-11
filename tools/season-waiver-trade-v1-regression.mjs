import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const app=fs.readFileSync('app.js','utf8').replace(/\r\n/g,'\n');
function source(name){
  const start=app.indexOf(`function ${name}(`);assert.notEqual(start,-1,`missing ${name}`);
  const brace=app.indexOf('{',start);let depth=0;
  for(let i=brace;i<app.length;i++){if(app[i]==='{')depth++;if(app[i]==='}'&&--depth===0)return app.slice(start,i+1);}
  throw new Error(`unterminated ${name}`);
}
const now=Date.now(),cache=new Map(),rank=new Map();
const playerRows={};
const addPlayer=(id,pos,points,weeklyRank)=>{playerRows[id]={full_name:id,position:pos,team:'TST'};rank.set(id,weeklyRank);return{playerId:id,metric:'projected_points',value:points,season:2026,week:2,scoring:'HALF_PPR',status:'VERIFIED',confidence:.9,sourceId:'fantasypros-weekly',sourceUrl:'https://example.test/weekly',publishedAt:now-1000,verifiedAt:now-500,expiresAt:now+60000};};
const evidence=[];
const rosters=Array.from({length:10},(_,i)=>{const n=i+1,ids=[`rb${n}`,`wr${n}`,`te${n}`];for(const [j,id] of ids.entries())evidence.push(addPlayer(id,['RB','WR','TE'][j],i===1&&j===1?4:12+j,20+i+j));return{roster_id:n,owner_id:`owner${n}`,manager_name:`Manager ${n}`,manager_profile_name:`Manager ${n}`,players:ids,starters:ids,reserve:[],taxi:i===8?[`taxi${n}`]:[],faab_remaining:100-i*4,waiver_budget_used:i*4};});
evidence.push(addPlayer('target','WR',18,7),addPlayer('taxi9','WR',30,1));
const season={ok:true,source:'Sleeper direct',generated_at:now,roster_id:1,my_roster:rosters[0],league_rosters:rosters,rosters,transactions:[{type:'waiver',status:'complete',roster_ids:[2],settings:{waiver_bid:9}}],faab_budget:100,league:{season:'2026',roster_positions:['RB','WR','TE','FLEX','BN']},transaction_round:2,ownership:Object.fromEntries(rosters.flatMap(r=>[...r.players,...r.taxi].map(id=>[id,{roster_id:r.roster_id,reserve:false,taxi:r.taxi.includes(id)}])))};
const sandbox={Date,console,globalThis:{},lastDraftContext:{season,players:playerRows},SLEEPER_NON_STARTER_SLOTS:new Set(['BN','IR','TAXI']),store:{get:(k,f)=>cache.get(k)??f},rankFor:name=>({rank:rank.get(name)??100}),weeklyLineupEvidence:p=>({consensus:rank.get(p.name)??null}),managerProfile:()=>({historical:{positions:{WR:{finalCount:2}}}}),clamp:(v,min,max)=>Math.max(min,Math.min(max,v))};
vm.createContext(sandbox);
for(const name of ['sleeperPlayerRow','seasonSlotEligible','tradeStarterSlots','tradeBestLineup','seasonEvidenceContext','seasonEvidenceValue','seasonEvidenceCache','seasonWeeklyMetric','seasonProjectionLineup','seasonRosterPlayerRows','waiverOpponentMarket','waiverMarketSummary'])vm.runInContext(source(name),sandbox);
cache.set('v190_seasonEvidence',evidence);
const target={p:{id:'target',name:'target',pos:'WR',team:'TST'},r:{rank:7},seasonStatus:'ACTIVE'};
let market=sandbox.waiverOpponentMarket(target,playerRows);
assert.equal(market.length,9,'all nine opponents must be evaluated');
assert.ok(market.every(x=>x.position==='WR'&&x.evaluation_status==='VERIFIED'),'skill-position need must use verified live lineup evidence');
assert.ok(market.every(x=>Number.isFinite(x.faab_remaining)),'every opponent remaining FAAB must be retained');
assert.ok(market.some(x=>x.current_season_bid_prior>0),'current-season completed waiver bids remain bounded priors');
assert.ok(!market.find(x=>x.roster_id===9).position_players.includes('taxi9'),'taxi/reserve player cannot count as active positional depth');
const pair={fa:target,structural:{utility:5}};
let summary=sandbox.waiverMarketSummary(pair,playerRows);
assert.equal(summary.sufficient,true,'complete nine-team live need and budget evidence may produce a FAAB band');
assert.ok(Number.isFinite(summary.bidLowPct)&&Number.isFinite(summary.bidHighPct),'supported market produces practical bounded FAAB range');
cache.set('v190_seasonEvidence',evidence.filter(x=>x.playerId!=='wr10'));
summary=sandbox.waiverMarketSummary(pair,playerRows);
assert.equal(summary.sufficient,false,'one unavailable opponent evaluation fails the market closed');
assert.equal(summary.bidLowPct,null,'incomplete market cannot fabricate a FAAB band');

for(const token of ['Waiver/FA Decision Board v3','ADD ${esc(x.fa.p.name)} / DROP ${esc(x.drop.p.name)}','THIS WEEK','ROS','KONTINGENZ','Stärkste Konkurrenz','Invalidator','Trade Offer Board v8','KONKRETE ANGEBOTE','ausdrücklich heuristisch','Fallback:','TRADE HOLD'])assert.ok(app.includes(token),`mobile decision surface missing ${token}`);
assert.ok(app.indexOf("'<div class=\"coach-section-title\">JETZT ENTSCHEIDEN · SKILL-POSITIONEN</div>'+skill")<app.indexOf('renderQbOpportunityBoard()+renderSpecialTeamsBoard()'),'skill ADD/DROP decisions must render before secondary QB and special-team lanes');
console.log('SEASON_WAIVER_TRADE_V1_PASS: nine-team market, fail-closed FAAB, mobile actions and concrete trades');
