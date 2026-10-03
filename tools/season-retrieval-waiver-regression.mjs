import fs from 'node:fs';
import weekly from '../weekly-evidence-v2.js';
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
const rosters=Array.from({length:10},(_,i)=>{const n=i+1,ids=[`rb${n}`,`wr${n}`,`te${n}`];for(const [j,id] of ids.entries())evidence.push(addPlayer(id,['RB','WR','TE'][j],i===1&&j===1?4:12+j,20+i+j));return{roster_id:n,owner_id:`owner${n}`,manager_name:`Manager ${n}`,manager_profile_name:`Manager ${n}`,players:ids,starters:ids,reserve:[],taxi:i===8?[`taxi${n}`]:[],faab_remaining:i===0?5:100-i*4,waiver_budget_used:i===0?95:i*4};});
evidence.push(addPlayer('target','WR',18,7),addPlayer('taxi9','WR',30,1));
const season={ok:true,source:'Sleeper direct',generated_at:now,player_directory:{fetchedAt:now},roster_id:1,my_roster:rosters[0],league_rosters:rosters,rosters,transactions:[{type:'waiver',status:'complete',roster_ids:[2],settings:{waiver_bid:9}}],faab_budget:100,league:{season:'2026',roster_positions:['RB','WR','TE','FLEX','BN']},transaction_round:2,ownership:Object.fromEntries(rosters.flatMap(r=>[...r.players,...r.taxi].map(id=>[id,{roster_id:r.roster_id,reserve:false,taxi:r.taxi.includes(id)}])))};
// Decision-unit fixtures mock the source boundary; real validation is covered by the Production parity regression.
const sandbox={Date,console,globalThis:{},lastDraftContext:{season,players:playerRows},SLEEPER_NON_STARTER_SLOTS:new Set(['BN','IR','TAXI']),BOONE_TRADE_VALUE_CACHE_KEY:'pitti.boone-trade-values.v1.current',adaptBooneTradeEvidence:()=>({available:false,values:{}}),store:{get:(k,f)=>cache.get(k)??f},rankFor:name=>({rank:rank.get(name)??100}),weeklyLineupEvidence:p=>({consensus:rank.get(p.name)??null}),managerProfile:()=>({historical:{positions:{WR:{finalCount:2}}}}),clamp:(v,min,max)=>Math.max(min,Math.min(max,v))};
vm.createContext(sandbox);
for(const name of ['sleeperPlayerRow','seasonSlotEligible','tradeStarterSlots','tradeBestLineup','seasonEvidenceContext','seasonEvidenceValue','seasonEvidenceCache','seasonWeeklyMetric','seasonLiveAuthority','seasonProjectionLineup','seasonRosterPlayerRows','waiverOpponentMarket','waiverMarketSummary'])vm.runInContext(source(name),sandbox);
cache.set('v190_seasonEvidence',evidence);
const target={p:{id:'target',name:'target',pos:'WR',team:'TST'},r:{rank:7},seasonStatus:'ACTIVE'};

// Exact legitimate RETRIEVAL shape used by the current provider acquisition.
for(const e of evidence){delete e.publishedAt;Object.assign(e,{schema:weekly.SCHEMA,sourceId:'fantasypros',position:playerRows[e.playerId].position,unit:'HALF_PPR_POINTS',sourceTimePrecision:'RETRIEVAL',sourcePublishedAt:null,sourcePublishedDate:null});e.sourceUrl='https://api.fantasypros.com/public/v2/json/nfl/2026/projections?week=2&position='+e.position;e.provenance={provider:'FantasyPros',field:'stats.points_half',providerScope:'WEEKLY',request:{scope:'WEEKLY',week:2,position:e.position,queryShape:weekly.WEEKLY_PROJECTION_QUERY_SHAPE}};assert.equal(weekly.weeklyRecordChronology(e,{season:2026,week:2,scoring:'HALF_PPR'},now),true);}
sandbox.globalThis.PittiWeeklyEvidenceV2=weekly;sandbox.freshAcquisitionEvidence=()=>null;sandbox.postDraftOpportunityProxy=()=>null;
for(const name of ['seasonEvidenceTimeLabel','weeklyLineupEvidence','weeklyEvidenceHtml'])vm.runInContext(source(name),sandbox);
sandbox.esc=x=>String(x);
assert.doesNotThrow(()=>sandbox.waiverOpponentMarket(target,playerRows));assert.equal(sandbox.waiverOpponentMarket(target,playerRows).length,9);
assert.doesNotThrow(()=>sandbox.waiverMarketSummary({fa:target,structural:{utility:5}},playerRows));
const display=sandbox.weeklyLineupEvidence(target.p);assert.match(sandbox.weeklyEvidenceHtml(display,target.p),/Abgerufen\/verifiziert/);assert.equal(display.projection.points,18);
assert.match(sandbox.seasonEvidenceTimeLabel({sourceTimePrecision:'TIMESTAMP',sourcePublishedAt:'2026-09-28T12:00:00Z'}),/^Quellzeit:/);
assert.equal(sandbox.seasonEvidenceTimeLabel({sourceTimePrecision:'DATE',sourcePublishedDate:'2026-09-28'}),'Quelldatum: 2026-09-28');
for(const e of [{},{sourceTimePrecision:'RETRIEVAL',verifiedAt:NaN},{sourceTimePrecision:'TIMESTAMP',sourcePublishedAt:'bad'},{sourceTimePrecision:'DATE',sourcePublishedDate:'2026-02-31'}])assert.equal(sandbox.seasonEvidenceTimeLabel(e),'Zeit nicht verfügbar');
console.log('RC4215_RETRIEVAL_WAIVER_PASS real chronology + nine-opponent market + distinct safe provenance');
