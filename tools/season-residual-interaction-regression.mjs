import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const app=fs.readFileSync('app.js','utf8').replace(/\r\n/g,'\n');
const source=name=>{const start=app.indexOf('function '+name+'(');assert(start>=0,name);const end=app.indexOf('\nfunction ',start+1);return (app.slice(start-6,start)==='async '?'async ':'')+app.slice(start,end<0?undefined:end);};
const rows=Array.from({length:15},(_,i)=>({p:{id:'r'+i,name:'r'+i,pos:'WR'},r:{rank:200},seasonStatus:'ACTIVE'}));
const pool=Array.from({length:12000},(_,i)=>({id:'f'+i,name:'f'+i,pos:'WR'}));
let scores=0,ranked=0;
const box={console,setTimeout,clearTimeout,Date,els:{},lastDraftContext:{season:{}},lastPostDraftPairs:[],postDraftRosterCounts:()=>({WR:15}),seasonRosterCapitalScore:()=>1,rankFor:()=>{ranked++;return{rank:10}},adpFor:()=>10,seasonWaiverRelevance:()=>({available:true}),seasonLegalDrop:()=>true,postDraftSwapScore:(drop,fa)=>{scores++;return{drop,fa,action:'HOLD',score:1,structural:{utility:1}}}};
vm.createContext(box);for(const name of ['seasonDrainWorkSync','seasonFaWork','renderRosterFaAudit'])vm.runInContext(source(name),box);
if(process.argv.includes('--baseline')){
  let sentinel=false;setTimeout(()=>sentinel=true,0);
  box.renderRosterFaAudit(rows,pool,true,{render:false});
  assert.equal(sentinel,false);assert.equal(scores,160*15);assert.equal(ranked,12000);
  await new Promise(r=>setTimeout(r,0));assert(sentinel);
  let reads=0;
  const evidence={store:{get:(_k,f)=>{reads++;return f}},BOONE_TRADE_VALUE_CACHE_KEY:'trade',adaptBooneTradeEvidence:()=>({available:false}),seasonEvidenceContext:()=>({})};
  vm.createContext(evidence);vm.runInContext(source('seasonEvidenceCache'),evidence);
  for(let i=0;i<100;i++)evidence.seasonEvidenceCache();
  assert.equal(reads,300);
  console.log('RC4218_DIAGNOSIS_PROVEN: one FA surface ranks 12000 and scores 2400 pairs before UI sentinel; 100 evidence derivations read/parse 300 snapshots. Device duration remains unmeasured.');
  process.exit(0);
}
let yields=0,scoreAtSentinel=null,rankAtSentinel=null;
box.store={get:(_k,f)=>f};box.seasonRenderRevision=0;
box.seasonDecisionDeadline=()=>Infinity;
box.seasonUiYield=async()=>{yields++;await new Promise(r=>setImmediate(r));};
for(const name of ['seasonReadUnit','seasonRunWork','seasonFaWork','seasonTradeOfferWork'])vm.runInContext(source(name),box);
vm.runInContext('let seasonUnitEvidence=null;',box);
const originalScore=box.postDraftSwapScore;
box.postDraftSwapScore=(...args)=>{const value=originalScore(...args);if(scores===1)setImmediate(()=>scoreAtSentinel=scores);return value;};
box.rankFor=()=>{ranked++;if(ranked===1)setImmediate(()=>rankAtSentinel=ranked);return{rank:10};};
const baseline=box.renderRosterFaAudit(rows,pool,true,{render:false});
const expected=JSON.stringify(box.lastPostDraftPairs);
scores=0;ranked=0;box.lastPostDraftPairs=['STALE ACTION'];
const pending=box.renderRosterFaAudit(rows,pool,true,{render:false,cooperative:true});
assert.equal(box.lastPostDraftPairs.length,0,'no partial/stale ranking during work');
await pending;
assert.equal(scores,2400);assert.equal(ranked,12000);
assert(scoreAtSentinel>0&&scoreAtSentinel<=4,'navigation during FA scoring, at most four pairs per step');
assert(rankAtSentinel>0&&rankAtSentinel<=32,'navigation during directory ranking');
assert.equal(JSON.stringify(box.lastPostDraftPairs),expected,'complete decisions identical to synchronous semantics');
assert(yields>=975,'bounded work units');
// Trade package scoring must yield inside one target, preserving every offer.
let packages=0,tradeSentinel=null;
Object.assign(box,{tradeRosterNeed:()=>({need:1}),seasonTradeDecision:()=>{packages++;if(packages===1)setImmediate(()=>tradeSentinel=packages);return{actionable:true,fairnessPct:1,opponentGain:1,ourGain:1,acceptance:{score:1}}}});
const opponent=rows.map((x,i)=>({...x,p:{...x.p,id:'o'+i}})),target=opponent[0];
const model=await box.seasonRunWork(box.seasonTradeOfferWork(rows,opponent,target));
assert.equal(packages,435);assert.equal(model.offers.length,435);assert(tradeSentinel>0&&tradeSentinel<=4);
// Execute the full trade renderer at ten-team/15-player scale. Its UI stays
// empty until every target and package has completed; the sentinel runs inside it.
packages=0;tradeSentinel=null;let priorPackages=0;
const rosters=Array.from({length:10},(_,i)=>({roster_id:i+1,players:rows.map((_,j)=>'team'+i+'-'+j),reserve:[],taxi:[]}));
box.lastDraftContext={season:{ok:true,my_roster:rosters[0],rosters,league_rosters:rosters},seasonRows:rows};
box.els={tradeStatus:{},tradeList:{innerHTML:''}};
Object.assign(box,{sleeperPlayerRow:id=>({id,name:id,pos:'WR'}),seasonWeeklyMetric:()=>({status:'VERIFIED'}),tradeMarginalLineupValue:()=>({delta:10,starts:true}),researchHint:()=>null,clamp:(n,lo,hi)=>Math.max(lo,Math.min(hi,n)),BOONE_TRADE_VALUE_CACHE_KEY:'trade',seasonEvidenceContext:()=>({}),validateBooneTradeValueSnapshot:()=>({ok:false}),seasonLiveAuthority:()=>true});
box.seasonTradeDecision=()=>{packages++;if(packages===1)setImmediate(()=>tradeSentinel=packages);return{actionable:false};};
box.seasonUiYield=async()=>{assert(packages-priorPackages<=4);priorPackages=packages;assert.equal(box.els.tradeList.innerHTML,'');await new Promise(r=>setImmediate(r));};
for(const name of ['seasonTradeTargetWork','renderTradeWorkspace'])vm.runInContext(source(name),box);
await box.renderTradeWorkspace([],{},1,10,true,{cooperative:true});
assert.equal(packages,9*15*435);assert(tradeSentinel>0&&tradeSentinel<=4);assert.match(box.els.tradeList.innerHTML,/TRADE HOLD/);
// Storage reads and evidence adaptation are reused within a step, invalidated at
// the next yield; expiry predicates keep using the current clock.
let reads=0,adapts=0,value=1;
box.store.get=(_k,f)=>{reads++;return _k==='v190_seasonEvidence'?[{metric:'projected_points',value}]:f};
box.BOONE_TRADE_VALUE_CACHE_KEY='trade';box.adaptBooneTradeEvidence=()=>{adapts++;return{available:false}};box.seasonEvidenceContext=()=>({});
vm.runInContext(source('seasonEvidenceCache'),box);
box.seasonReadUnit(()=>{for(let i=0;i<100;i++)assert.equal(box.seasonEvidenceCache()[0].value,1)});
assert.equal(reads,3);assert.equal(adapts,1);value=2;
box.seasonReadUnit(()=>assert.equal(box.seasonEvidenceCache()[0].value,2));assert.equal(reads,6);
// A completion invalidates in-flight work before any partial result can publish.
scores=0;ranked=0;box.lastPostDraftPairs=[];
box.seasonUiYield=async()=>{box.seasonRenderRevision++;};
await assert.rejects(box.renderRosterFaAudit(rows,pool,true,{render:false,cooperative:true}),/SUPERSEDED/);
assert.equal(box.lastPostDraftPairs.length,0);
box.seasonDecisionDeadline=()=>Date.now();
await assert.rejects(box.seasonRunWork(box.seasonFaWork(rows,pool)),/SUPERSEDED/);
// Actual queue: Weekly/Trade/Watcher/failure/expiry requests coalesce while busy.
const queueStart=app.indexOf('let seasonRenderQueued='),queueEnd=app.indexOf('\nlet seasonLiveRefreshPromise',queueStart);
let runs=0,active=0,maxActive=0,release;
const queue={console,setTimeout,seasonUiYield:()=>new Promise(r=>setImmediate(r)),rerenderPostDraftFromContext:async()=>{runs++;active++;maxActive=Math.max(maxActive,active);if(runs===1)await new Promise(r=>release=r);active--;}};
vm.createContext(queue);vm.runInContext(app.slice(queueStart,queueEnd),queue);
queue.queueSeasonRerender();queue.queueSeasonRerender();queue.queueSeasonRerender();
while(!release)await new Promise(r=>setImmediate(r));
for(const lane of ['Weekly','Trade','Watcher','failure','expiry'])queue.queueSeasonRerender();
release();while(runs<2||active)await new Promise(r=>setImmediate(r));
await new Promise(r=>setImmediate(r));assert.equal(runs,2);assert.equal(maxActive,1);
assert(app.includes('function setWorkspace('));const navigation=source('setWorkspace');
assert(!/seasonBootstrapBusy|seasonRenderRunning|seasonLiveRefreshPromise/.test(navigation),'navigation not gated by busy flags');
console.log('RC4219_RESPONSIVENESS_PASS: 12000 candidates, 2400 FA scores, 58725 full-renderer trade packages; sentinel inside ranking/scoring; identical complete ranking; per-step cache invalidation; supersession/expiry fail closed; five completion lanes coalesce 2 runs/max concurrency 1.');
