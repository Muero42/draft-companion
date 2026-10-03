import fs from 'node:fs';
import vm from 'node:vm';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
const app=fs.readFileSync('app.js','utf8').replace(/\r\n/g,'\n');
const prior=execFileSync('git',['show','d222582ab14bfed6b3b58d613bb2f9f82bb6a806:app.js'],{encoding:'utf8'}).replace(/\r\n/g,'\n');
const reviewed=process.argv.includes('--reviewed')?execFileSync('git',['show','36da1388876bdc86b3dec97e44b7f6608f884489:app.js'],{encoding:'utf8'}).replace(/\r\n/g,'\n'):app;
function source(src,name){const s=src.indexOf('function '+name+'(');assert(s>=0,name);const e=src.indexOf('\nfunction ',s+1);return(src.slice(s-6,s)==='async '?'async ':'')+src.slice(s,e<0?undefined:e);}
const element=()=>({innerHTML:'',style:{},value:'9'});
// Execute the actual pass and Waiver renderer, not a surrogate cancellation loop.
for(const lane of (process.argv.includes('--rc4218-ordering')?[]:['Weekly','Trade','Watcher','failure','expiry','context'])){
  let now=1000;class Clock extends Date{static now(){return now}}
  const els=Object.fromEntries(['rosterList','rosterBenchStatus','rosterBenchList','rosterFaStatus','rosterFaList','tradeStatus','tradeList','waiverStatus','waiverList','seasonActionStatus','seasonActionList','slot'].map(k=>[k,element()]));
  const pair={action:'CLEAR ADD',freshEvidencePresent:true,score:5,fa:{p:{id:'fa',name:'FA',pos:'WR',team:'A'}},drop:{p:{id:'drop',name:'Drop',pos:'WR',team:'B'}},horizons:{weekly:10},structural:{reason:'OLD VERIFIED EDGE'},confidence:80};
  const box={Date:Clock,console:{error(){}},els,seasonRenderRevision:0,lastPostDraftPairs:[],lastDraftContext:{draftComplete:true,mine:[],rankedAvailable:[],players:{},seasonRows:[{p:{id:'drop'}}],season:{ok:true,generated_at:1000},picks:[],teams:10},seasonDecisionDeadline:()=>2000,seasonUiYield:async()=>{},seasonLineupHtml:()=>'',renderRosterBenchAudit:()=>{},seasonLiveAuthority:()=>true,waiverMarketSummary:()=>({sufficient:true,overMarket:false,bidLowPct:1,bidHighPct:2,ownRemaining:100,opponents:[]}),renderQbOpportunityBoard:()=>'',renderSpecialTeamsBoard:()=>'',renderSeasonActionBoard:()=>{},scheduleSeasonDecisionExpiry:()=>{},esc:String};
  vm.createContext(box);
  for(const name of ['seasonClearDecisionSurfaces','seasonRenderPassCurrent','runSeasonSurface','blockSeasonDependentSurface','rerenderPostDraftFromContext','renderWaiverWorkspace'])if(reviewed.includes('function '+name+'('))vm.runInContext(source(reviewed,name),box);
  box.renderRosterFaAudit=()=>{box.lastPostDraftPairs=[pair]};
  box.renderTradeWorkspace=async()=>{els.tradeList.innerHTML='STALE ACTION';if(lane==='expiry')now=2000;else if(lane==='context')box.lastDraftContext={...box.lastDraftContext};else box.seasonRenderRevision++;throw Error('SEASON_RENDER_SUPERSEDED');};
  assert.equal(await box.rerenderPostDraftFromContext(),false,lane+' must abort whole pass');
  assert.equal(box.lastPostDraftPairs.length,0,lane+' must discard completed old FA ranking');
  for(const name of ['tradeList','waiverList','seasonActionList','rosterBenchList'])assert.equal(els[name].innerHTML,'',lane+' stale surface '+name);
}
console.log('RC4219_PASS_REVISION_CANCEL_PASS: six invalidations after completed FA prevent stale Waiver publication');
if(!process.argv.includes('--reviewed')&&!process.argv.includes('--rc4218-ordering')){
  let followups=0,waivers=0,watchdogCleared=0;
  const els=new Proxy({},{get(o,k){return o[k]??=element()}});
  const box={Date,navigator:{onLine:true},console:{error(){}},els,lastDraftContext:null,lastPostDraftPairs:[],seasonBootstrapBusy:false,seasonLiveRefreshPromise:null,seasonRenderRunning:false,seasonRenderQueued:false,seasonRenderRevision:0,seasonDecisionDeadline:()=>Infinity,seasonUiYield:async()=>{},seasonBootstrapWatchdogArm:()=>1,seasonBootstrapWatchdogClear:()=>watchdogCleared++,fetchSeasonLeagueState:async()=>({ok:true,league:{},my_roster:{}}),seasonDirectoryCached:async()=>({players:{},fetchedAt:Date.now()}),seasonDirectoryFresh:()=>true,seasonDirectoryBind:()=>{},seasonRosterShell:()=>[],seasonRosterRows:()=>[{p:{id:'drop'},seasonStatus:'ACTIVE'}],seasonAvailablePlayers:()=>[{id:'fa'}],seasonAvailableSpecialTeams:()=>[],postDraftRosterCounts:()=>({}),seasonLineupHtml:()=>'',LIVE_DRAFT_ID_2026:'fixture',SEASON_SPECIAL_TEAMS_MODEL:{},renderRosterBenchAudit:()=>{},renderRosterFaAudit:()=>{box.lastPostDraftPairs=[{action:'CLEAR ADD'}]},renderTradeWorkspace:async()=>{box.seasonRenderRevision++;box.seasonRenderQueued=true;throw Error('SEASON_RENDER_SUPERSEDED')},renderWaiverWorkspace:()=>waivers++,renderSeasonActionBoard:()=>{},queueSeasonRerender:()=>{followups++;box.seasonRenderQueued=false},renderSeasonLiveStateFreshness:()=>{},esc:String};
  vm.createContext(box);for(const name of ['seasonClearDecisionSurfaces','seasonRenderPassCurrent','runSeasonSurface','blockSeasonDependentSurface','bootstrapSeasonWorkspace'])vm.runInContext(source(app,name),box);
  assert.equal((await box.bootstrapSeasonWorkspace()).skipped,'render-superseded');
  assert.equal(waivers,0);assert.equal(box.lastPostDraftPairs.length,0);assert.equal(box.seasonRenderRunning,false);assert.equal(box.seasonBootstrapBusy,false);assert.equal(watchdogCleared,1);assert.equal(followups,1);
  console.log('RC4219_BOOTSTRAP_CANCEL_PASS: no dependent publication, busy/watchdog cleanup, exactly one deferred followup');
}
// Real production scoring/lineup/legality/evidence functions on identical fixtures.
// Only source adapters/research acquisition are fixture boundaries, as in the
// existing decision tests. No scoring or legality function is stubbed here.
const now=Date.now();class Clock extends Date{static now(){return now}}
const row=(id,pos,rank,points,status='ACTIVE')=>({p:{id,name:id,pos,team:'AAA',bye:7},r:{rank},a:rank,points,seasonStatus:status,pk:{pick_no:100}});
const rows=[row('qb','QB',30,20),row('rb','RB',150,8),row('wr','WR',150,10),row('wr2','WR',150,10),row('te','TE',40,12),row('bench','WR',200,1),row('reserve','RB',10,30,'RESERVE')];
const fas=Array.from({length:8},(_,i)=>row('fa'+i,i===7?'QB':'WR',50,i===6?1:18));
const roster={roster_id:1,players:rows.map(x=>x.p.id),reserve:['reserve'],taxi:[]};
const rosters=[roster,...Array.from({length:9},(_,i)=>({roster_id:i+2,players:[],reserve:[],taxi:[]}))];
const season={ok:true,source:'Sleeper direct',generated_at:now,player_directory:{fetchedAt:now},roster_id:1,my_roster:roster,rosters,league_rosters:rosters,ownership:Object.fromEntries(rows.map(x=>[x.p.id,{roster_id:1,reserve:x.seasonStatus==='RESERVE',taxi:false}])),league:{season:'2026',roster_positions:['QB','RB','WR','TE','FLEX','WRRB_FLEX','BN','BN']},transaction_round:2};
const record=(x,metric,value)=>({playerId:x.p.id,metric,value,season:2026,week:2,scoring:'HALF_PPR',status:'VERIFIED',confidence:.9,sourceId:'fixture-primary',sourceUrl:'https://example.test/chart',publishedAt:now-1000,verifiedAt:now-500,expiresAt:now+60000});
const baseRecords=[...rows,...fas].flatMap(x=>[record(x,'projected_points',x.points),record(x,'trade_value',20)]);
function fixture(src,missing=false){
  let records=missing?baseRecords.filter(x=>!x.playerId.startsWith('fa')):baseRecords;
  const memory=new Map([['v190_seasonEvidence',JSON.stringify(records)]]);let parses=0,scores=0,sentinel=null;
  const box={Date:Clock,console,setTimeout,clearTimeout,els:{},localStorage:{getItem:k=>memory.get(k)??null,setItem:(k,v)=>memory.set(k,v)},JSON:{...JSON,parse:s=>{parses++;return JSON.parse(s)},stringify:JSON.stringify},BOONE_TRADE_VALUE_CACHE_KEY:'trade',adaptBooneTradeEvidence:()=>({available:true,values:Object.fromEntries(records.filter(x=>x.metric==='trade_value').map(x=>[x.playerId,x]))}),lastDraftContext:{season},lastPostDraftPairs:[],seasonRenderRevision:0,SEASON_PLAYERS_MAX_AGE_MS:21600000,SEASON_RANKING_AUTO_MS:10800000,SLEEPER_NON_STARTER_SLOTS:new Set(['BN','IR','TAXI']),clamp:(n,lo,hi)=>Math.max(lo,Math.min(hi,n)),loadResearchEvents:()=>[],actionableResearchEvents:()=>[],researchPlayerState:()=>[],researchHint:()=>null,week1WaiverMarketSignal:()=>null,rankFor:name=>[...rows,...fas].find(x=>x.p.name===name)?.r,adpFor:name=>[...rows,...fas].find(x=>x.p.name===name)?.a};
  Object.assign(box,{seasonDstTeam:x=>x,PittiGameContextV1:{CACHE_KEY:'verified-future-game-fixture',validateSnapshot:()=>({ok:true}),contextForTeam:()=>({status:'VERIFIED',locked:false})}});vm.createContext(box);const storeLine=src.split('\n').find(x=>x.startsWith('const store='));vm.runInContext(storeLine,box);vm.runInContext(src.split('\n').find(x=>x.startsWith('const norm=')),box);
  vm.runInContext(src.slice(src.indexOf('function seasonEvidenceContext('),src.indexOf('function fpStoreKey(')),box);
  for(const name of ['seasonSlotEligible','tradeStarterSlots','tradeBestLineup','seasonStructurallyDroppable','postDraftRosterCounts','seasonRosterCapitalScore','postDraftOpportunityProxy','postDraftUpsideProxy','freshAcquisitionEvidence','seasonHorizonSplit','seasonWaiverRelevance','postDraftSwapScore','seasonReadUnit','seasonDrainWorkSync','seasonRunWork','seasonFaWork','seasonUiYield','renderRosterFaAudit','tradeMarginalLineupValue','tradeRosterNeed','tradeOfferCandidates','seasonTradeOfferWork'])if(src.includes('function '+name+'('))vm.runInContext(source(src,name),box);
  const score=box.postDraftSwapScore;box.postDraftSwapScore=(...args)=>{scores++;if(scores===1)setTimeout(()=>sentinel=scores,0);return score(...args)};
  return{box,counts:()=>({scores,parses,sentinel}),setRecords:next=>{records=next;memory.set('v190_seasonEvidence',JSON.stringify(next));}};
}
for(const missing of [false,true]){
  const before=fixture(prior,missing),after=fixture(process.argv.includes('--rc4218-ordering')?prior:app,missing);
  before.box.renderRosterFaAudit(rows,fas.map(x=>x.p),true,{render:false});
  const oldResult=JSON.stringify(before.box.lastPostDraftPairs);const oldCount=before.counts();
  assert.equal(oldCount.sentinel,null,'actual rc4.218 blocks timer until renderer returns');
  await new Promise(r=>setTimeout(r,0));
  if(!missing)assert.equal(before.counts().sentinel,oldCount.scores);
  await after.box.renderRosterFaAudit(rows,fas.map(x=>x.p),true,{render:false,cooperative:true});
  assert.equal(JSON.stringify(after.box.lastPostDraftPairs),oldResult,'pre-repair vs cooperative scores, order, ties, drops, actions and horizons');
  assert.equal(after.counts().scores,oldCount.scores,'same actual scoring work, not a cheaper surrogate');
  if(!missing){assert(oldCount.scores>4);assert(after.counts().sentinel>0&&after.counts().sentinel<=4,'actual renderer must execute sentinel inside scoring before completion');assert(after.counts().parses<oldCount.parses,'production JSON parsing reduced');assert(before.box.lastPostDraftPairs.some(x=>x.action!=='HOLD'),'fixture exercises positive decisions');assert(!after.box.lastPostDraftPairs.some(x=>x.drop.seasonStatus!=='ACTIVE'));}
  else assert.equal(after.box.lastPostDraftPairs.length,0,'missing current FA evidence stays unavailable');
}
console.log('RC4219_REAL_SCORER_PARITY_PASS: actual rc4.218 timer blocked; actual repaired scorer yields; identical scores/order/ties/protected drops/actions and missing-evidence outcomes; production JSON.parse reuse');

// Real trade decisions and package sorting, including stable ties and offers.
const mine=[row('mrb','RB',100,5),row('mwr','WR',80,20),row('mextra','WR',90,19)],opp=[row('orb','RB',80,20),row('owr','WR',100,5),row('oextra','RB',90,19)];
const oldTrade=fixture(prior),newTrade=fixture(app);
for(const f of [oldTrade,newTrade]){
 const rr=[{roster_id:1,players:mine.map(x=>x.p.id),reserve:[],taxi:[]},{roster_id:2,players:opp.map(x=>x.p.id),reserve:[],taxi:[]},...rosters.slice(2)];
 f.box.lastDraftContext={season:{...season,my_roster:rr[0],rosters:rr,league_rosters:rr,ownership:Object.fromEntries(rr.flatMap(r=>r.players.map(id=>[id,{roster_id:r.roster_id,reserve:false,taxi:false}]))),league:{season:'2026',roster_positions:['RB','WR','BN','BN','BN']}}};
 f.setRecords([...mine,...opp].flatMap(x=>[record(x,'projected_points',x.points),record(x,'trade_value',20)]));
}
const originalOffers=oldTrade.box.tradeOfferCandidates(mine,opp,opp[2]);
const cooperativeOffers=await newTrade.box.seasonRunWork(newTrade.box.seasonTradeOfferWork(mine,opp,opp[2]));
assert(originalOffers.offers.length>0,'real bilateral verified gain fixture must exercise actionable offers');
const syncWork=newTrade.box.seasonTradeOfferWork(mine,opp,opp[2]);let syncStep;do{syncStep=syncWork.next()}while(!syncStep.done);const synchronousOffers=syncStep.value;
assert(cooperativeOffers.offers.length>0,'RC4220 preserves the positive bilateral fixture');
assert.equal(JSON.stringify(cooperativeOffers),JSON.stringify(synchronousOffers),'RC4220 sync vs cooperative decisions, acceptance, package order and ties');
console.log('RC4219_REAL_TRADE_PARITY_PASS: current synchronous vs cooperative actual bilateral decisions and package sorting');
