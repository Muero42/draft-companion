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
vm.createContext(sandbox);
for(const name of ['seasonSlotEligible','tradeStarterSlots','tradeBestLineup','seasonStructurallyDroppable'])vm.runInContext(functionSource(name),sandbox);
vm.runInContext(app.slice(app.indexOf('function seasonEvidenceContext('),app.indexOf('function fpStoreKey(')),sandbox);
const player=(id,pos,rank=50,status='ACTIVE')=>({p:{id,name:id,pos,bye:7},r:{rank},seasonStatus:status,pk:{pick_no:20}});
const liveRosters=(mine,opponent=[])=>{season.league_rosters=Array.from({length:10},(_,i)=>({roster_id:i+1,players:(i===0?mine:i===1?opponent:[]).map(x=>x.p.id),reserve:(i===0?mine:i===1?opponent:[]).filter(x=>x.seasonStatus==='RESERVE').map(x=>x.p.id),taxi:[]}));season.my_roster=season.league_rosters[0];season.ownership=Object.fromEntries(season.league_rosters.flatMap(r=>r.players.map(id=>[id,{roster_id:r.roster_id,reserve:r.reserve.includes(id),taxi:false}])));};
const record=(p,metric,value,extra={})=>({playerId:p.p.id,metric,value,season:2026,week:2,scoring:'HALF_PPR',status:'VERIFIED',confidence:.9,sourceId:'fixture-primary',sourceUrl:'https://example.test/fixture',publishedAt:now-1000,verifiedAt:now-500,expiresAt:now+10000,...extra});
const prior=execFileSync('git',['show','7565a44e3ad92191317ed8ad828cf4b98afb6939:app.js'],{encoding:'utf8'});
const oldBox={...sandbox};vm.createContext(oldBox);for(const name of ['seasonSlotEligible','tradeStarterSlots','tradeBestLineup'])vm.runInContext(functionSource(name),oldBox);vm.runInContext(prior.slice(prior.indexOf('function seasonEvidenceContext('),prior.indexOf('function fpStoreKey(')),oldBox);
const mine=[player('mrb','RB'),player('mwr','WR'),player('msell','RB')],opp=[player('orb','RB'),player('owr','WR'),player('obuy','WR')];
season.league.roster_positions=['RB','WR','BN','BN','BN'];
function reset(points=[5,10,9,12,12,20],values=[20,20,20,20,20,20]){season.generated_at=now;season.transaction_round=2;liveRosters(mine,opp);cache.set('v190_seasonEvidence',[...mine,...opp].flatMap((p,i)=>[record(p,'projected_points',points[i]),record(p,'trade_value',values[i])]));}
reset();
const old=oldBox.seasonTradeDecision(mine,opp,[mine[2]],[opp[2]],season),next=sandbox.seasonTradeDecision(mine,opp,[mine[2]],[opp[2]],season);

assert.equal(old.status,'NO_BILATERAL_GAIN');assert(old.ourGain>0&&old.opponentGain<0&&old.fairnessPct<=15);
assert.equal(next.actionable,true);assert.equal(next.acceptance.label,'LOW');assert.equal(next.acceptance.calibrated,false);assert(next.exploratory&&next.opponentFit.depthRepair);
reset([5,10,9,12,12,20],[20,20,1,20,20,100]);let d=sandbox.seasonTradeDecision(mine,opp,[mine[2]],[opp[2]],season);assert(!d.actionable,'wild underpayment suppressed even with depth repair');
mine[2].pk.pick_no=1;opp[2].pk.pick_no=60;d=sandbox.seasonTradeDecision(mine,opp,[mine[2]],[opp[2]],season);assert(!d.actionable,'historical preference cannot rescue wild offer');mine[2].pk.pick_no=opp[2].pk.pick_no=20;
reset();const withNeed=sandbox.seasonTradeDecision(mine,opp,[mine[2]],[opp[2]],season);opp[1].p.pos='RB';reset();const withoutNeed=sandbox.seasonTradeDecision(mine,opp,[mine[2]],[opp[2]],season);assert(withNeed.acceptance.score>withoutNeed.acceptance.score,'live need raises plausibility');opp[1].p.pos='WR';
reset([5,20,19,20,5,19]);mine[2].p.pos='WR';opp[2].p.pos='RB';reset([5,20,19,20,5,19]);d=sandbox.seasonTradeDecision(mine,opp,[mine[2]],[opp[2]],season);assert(d.actionable&&d.ourGain>0&&d.opponentGain>0,'mutually beneficial baseline retained');
mine[2].p.pos='RB';opp[2].p.pos='WR';reset();
// Cross-sectional weekly and market order diverge within a position; no mixing units.
const extra=[player('rb3','RB'),player('wr3','WR')];cache.set('v190_seasonEvidence',[...cache.get('v190_seasonEvidence'),...extra.flatMap(p=>[record(p,'projected_points',15),record(p,'trade_value',25)])]);
// Four comparable players per position are required before identifying divergence.
const more=[player('rb4','RB'),player('wr4','WR')];cache.set('v190_seasonEvidence',[...cache.get('v190_seasonEvidence'),...more.flatMap(p=>[record(p,'projected_points',18),record(p,'trade_value',28)])]);
let records=cache.get('v190_seasonEvidence');records.find(x=>x.playerId==='msell'&&x.metric==='trade_value').value=30;records.find(x=>x.playerId==='obuy'&&x.metric==='trade_value').value=25;
sandbox.lastDraftContext.players=Object.fromEntries([...mine,...opp,...extra,...more].map(x=>[x.p.id,{position:x.p.pos}]));
d=sandbox.seasonTradeDecision(mine,opp,[mine[2]],[opp[2]],season);assert(d.actionable);assert(d.opportunities.some(x=>x.kind==='BUY LOW'));assert(d.opportunities.some(x=>x.kind==='SELL HIGH'));
for(const mutate of [r=>r.filter(x=>x.metric!=='trade_value'),r=>r.map(x=>x.metric==='trade_value'?{...x,expiresAt:now-1}:x),r=>r.map(x=>x.metric==='projected_points'?{...x,expiresAt:now-1}:x)]){reset();cache.set('v190_seasonEvidence',mutate(cache.get('v190_seasonEvidence')));assert(!sandbox.seasonTradeDecision(mine,opp,[mine[2]],[opp[2]],season).actionable,'missing/stale valuation or lineup fails closed');}
reset();season.generated_at=now-600000;assert(!sandbox.seasonTradeDecision(mine,opp,[mine[2]],[opp[2]],season).actionable);reset();season.ownership.obuy.roster_id=9;assert(!sandbox.seasonTradeDecision(mine,opp,[mine[2]],[opp[2]],season).actionable);
// Zero starting delta can still improve verified bench replacement value.
reset([20,25,5,20,25,10]);d=sandbox.seasonTradeDecision(mine,opp,[mine[2]],[opp[2]],season);assert.equal(d.ourGain,0);assert(d.ourUtility>0&&d.actionable,'bench target need not start immediately');
// Execute real bounded package generator both synchronously and through yields.
reset();sandbox.seasonRenderRevision=0;sandbox.seasonDecisionDeadline=()=>Infinity;let yielded=0;sandbox.seasonUiYield=async()=>{yielded++};
vm.runInContext('let seasonUnitEvidence=null;',sandbox);for(const name of ['seasonReadUnit','seasonRunWork','seasonDrainWorkSync','seasonTradeOfferWork'])vm.runInContext(functionSource(name),sandbox);
const synchronous=sandbox.seasonDrainWorkSync(sandbox.seasonTradeOfferWork(mine,opp,opp[2]));const cooperative=await sandbox.seasonRunWork(sandbox.seasonTradeOfferWork(mine,opp,opp[2]));assert.equal(JSON.stringify(cooperative),JSON.stringify(synchronous));assert(yielded>0&&cooperative.evaluated<=126&&cooperative.offers.length<=12);
const shapes=new Set();const real=sandbox.seasonTradeDecision; sandbox.seasonTradeDecision=(a,b,g,h,live)=>{shapes.add(g.length+':'+h.length);return real(a,b,g,h,live)};await sandbox.seasonRunWork(sandbox.seasonTradeOfferWork(mine,opp,opp[2]));assert.deepEqual([...shapes].sort(),['1:1','1:2','2:1','2:2']);
sandbox.seasonUiYield=async()=>{sandbox.seasonRenderRevision++};await assert.rejects(sandbox.seasonRunWork(sandbox.seasonTradeOfferWork(mine,opp,opp[2])),/SUPERSEDED/);

// Real rendered asymmetric card exposes separate axes and never invents generic positional needs.
reset();sandbox.els={tradeStatus:{},tradeList:{innerHTML:''}};sandbox.validateBooneTradeValueSnapshot=()=>({ok:false});vm.runInContext(functionSource('renderTradeWorkspace'),sandbox);
const cardDecision=sandbox.seasonTradeDecision(mine,opp,[mine[2]],[opp[2]],season);const offer={gives:[mine[2]],gets:[opp[2]],decision:cardDecision,acceptance:cardDecision.acceptance};
sandbox.renderTradeWorkspace([],{},1,10,true,{targets:[{slot:2,manager:{manager_name:'Fixture opponent',faab_remaining:37},oppNeeds:[{pos:'TE',need:8}],offers:[offer]}]});
const html=sandbox.els.tradeList.innerHTML;assert(html.includes('EXPLORATORY / AGGRESSIVE OFFER')&&html.includes('gleich oder schwächer'));assert(!html.includes('TRADE HOLD'));assert(html.includes('LOW')&&!html.includes('27%'));assert(!html.includes('TE 0'));assert(html.includes('Fixture opponent')&&html.includes('FAAB 37'),'retain live manager/FAAB context');
// Repeated current acquisitions must be for this recipient, unique and current season.
sandbox.lastDraftContext.players={txrb:{position:'RB'}};const tx={transaction_id:'one',status:'complete',created:now-1000,roster_ids:[1,2],adds:{txrb:2}};season.transactions=[tx,tx];
assert.equal(sandbox.seasonTradeDecision(mine,opp,[mine[2]],[opp[2]],season).managerEvidence.currentAcquisitions,1,'duplicates are one transaction');
season.transactions=[{...tx,adds:{txrb:1}}];assert.equal(sandbox.seasonTradeDecision(mine,opp,[mine[2]],[opp[2]],season).managerEvidence.currentAcquisitions,0,'other recipient does not prove opponent acquisition');
season.transactions=[{...tx,created:now-31*86400000}];assert.equal(sandbox.seasonTradeDecision(mine,opp,[mine[2]],[opp[2]],season).managerEvidence.currentAcquisitions,0,'old transactions cannot inflate acceptance');season.transactions=[];
for(const field of ['PITTI BENEFIT','MARKET PRICE','OPPONENT FIT','ACCEPTANCE PLAUSIBILITY','WHY THEY MIGHT ACCEPT','WHY WE WANT IT','INVALIDATOR'])assert(app.includes(field));
assert(!/result.actionable=result.ourGain>0&&result.opponentGain>0/.test(app));
console.log('RC4220_TRADE_MODEL_PASS: actual rc4219 asymmetric rejection; RC4220 LOW exploratory admission; live need; history cannot rescue unfairness; BUY_LOW/SELL_HIGH; bilateral preservation; bench utility; evidence negatives; bounded four package shapes; sync/cooperative parity; cancellation.');
