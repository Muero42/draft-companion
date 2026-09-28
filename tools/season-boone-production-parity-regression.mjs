import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {adaptBooneTradeEvidence,validateBooneTradeValueSnapshot,buildBooneTradeValueSnapshot,CACHE_KEY,POSITIONS,MIN_COUNTS,WEEK1_URLS,PEAKED_GATE} from '../boone-trade-values-v1.mjs';
import {adaptBooneTradeEvidence as diagnosticAdapter} from '../trade-boone-source-contract-v1.mjs';
import {RUNTIME_FILES} from './runtime-files.mjs';

const app=fs.readFileSync('app.js','utf8').replace(/\r\n/g,'\n');
const source=name=>{const i=app.indexOf('function '+name+'(');assert(i>=0,name);return app.slice(i,app.indexOf('\nfunction ',i+1));};
// Frozen baseline from canonical 5fd246dd5ac2cab6780926817247a14a53261d32.
// Hash equality makes using the current decision body below equivalent to the old body.
for(const [name,hash] of Object.entries({seasonTradeDecision:'99e57d63d34374e5b6be88959fc3da58d504b8b289537a71df721be546ef6b69',seasonProjectionLineup:'228ad5a9558e6bd3e5303439ca9e1d0a2252d3fdde86d1c6dcd6cb052e0723c0'}))assert.equal(crypto.createHash('sha256').update(source(name)).digest('hex'),hash,name+' semantic source unchanged');
const oldCache=`function seasonEvidenceCache(){
  const legacy=store.get('v190_seasonEvidence',[]),weekly=store.get(globalThis.PittiWeeklyEvidenceV2?.CACHE_KEY||'pitti.weekly-evidence.v2.current',null),trade=store.get(BOONE_TRADE_VALUE_CACHE_KEY,null),context=seasonEvidenceContext();
  const usable=globalThis.PittiWeeklyEvidenceV2?.validateSnapshot?.(weekly,context,Date.now())?.ok===true?weekly.records:[];
  const tradeUsable=validateBooneTradeValueSnapshot(trade,context,Date.now()).ok?trade.records:[];
  return[...usable,...tradeUsable,...(Array.isArray(legacy)?legacy:[])];
}`;
const now=Date.parse('2026-09-27T12:00:00Z');
class Clock extends Date {static now(){return now;}}
// Synthetic fixtures, not claims about current provider data.
const players={},charts={};
for(const position of POSITIONS){
  const rows=Array.from({length:MIN_COUNTS[position]},(_,i)=>({name:`Fixture ${position} ${i}`,position,value:20,rank:i+1}));
  rows.forEach((r,i)=>{players[position+i]={full_name:r.name,position,team:'FA'};});
  charts[position]={ok:true,players:rows,sourceUrl:WEEK1_URLS[position],publishedAt:now-1000,modifiedAt:now-1000,sourceAt:now-1000,column:position==='QB'?'1QB':'HALF'};
}
const snapshot=buildBooneTradeValueSnapshot({charts,sleeperPlayers:players,season:2026,week:2,verifiedAt:now});
const p=(id,pos)=>({p:{id,name:players[id].full_name,pos},pk:{pick_no:20},seasonStatus:'ACTIVE'});
function fixture(){
  const mine=[p('RB0','RB'),p('WR0','WR'),p('WR1','WR'),p('QB0','QB'),p('TE0','TE')];
  const opponent=[p('RB1','RB'),p('WR2','WR'),p('RB2','RB'),p('QB1','QB'),p('TE1','TE')];
  const rosters=Array.from({length:10},(_,i)=>({roster_id:i+1,players:(i===0?mine:i===1?opponent:[]).map(r=>r.p.id),reserve:[],taxi:[]}));
  const season={ok:true,source:'Sleeper direct',generated_at:now,league_rosters:rosters,my_roster:rosters[0],ownership:Object.fromEntries(rosters.flatMap(r=>r.players.map(id=>[id,{roster_id:r.roster_id,reserve:false,taxi:false}]))),league:{season:'2026',roster_positions:['QB','RB','WR','TE','BN','BN','BN']},current_nfl_week:2,transaction_round:2};
  const points=[5,20,19,15,10,20,5,19,15,10];
  const projections=[...mine,...opponent].map((r,i)=>({playerId:r.p.id,metric:'projected_points',value:points[i],season:2026,week:2,scoring:'HALF_PPR',status:'VERIFIED',confidence:.9,sourceId:'synthetic-weekly',sourceUrl:'https://example.test/weekly',publishedAt:now-1000,verifiedAt:now,expiresAt:now+60000}));
  return{mine,opponent,give:[mine[2]],get:[opponent[2]],season,projections,snapshot:structuredClone(snapshot)};
}
function execute(f,old=false){
  const cache=new Map([[CACHE_KEY,f.snapshot],['v190_seasonEvidence',[...f.projections,...(f.legacy||[])]]]);
  const s={Date:Clock,console,BOONE_TRADE_VALUE_CACHE_KEY:CACHE_KEY,adaptBooneTradeEvidence,validateBooneTradeValueSnapshot,store:{get:(k,d)=>cache.get(k)??d},lastDraftContext:{season:f.season},SLEEPER_NON_STARTER_SLOTS:new Set(['BN','IR','TAXI'])};
  vm.createContext(s);
  for(const name of ['seasonSlotEligible','tradeStarterSlots','tradeBestLineup','seasonEvidenceContext','seasonTemporalPhase','seasonEvidenceValue','seasonEvidenceCache','seasonWeeklyMetric','tradeValueEdition','seasonLiveAuthority','seasonRosterAuthority','seasonProjectionLineup','seasonTradeDecision'])vm.runInContext(name==='seasonEvidenceCache'&&old?oldCache:source(name),s);
  return{result:JSON.parse(JSON.stringify(s.seasonTradeDecision(f.mine,f.opponent,f.give,f.get,f.season))),records:s.seasonEvidenceCache()};
}
let parity=0;
const compare=f=>{const before=execute(f,true),after=execute(f);assert.deepEqual(after.result,before.result,'all decision fields including acceptance must match');parity++;return after.result;};
const valid=fixture(),pass=compare(valid);
assert.equal(pass.actionable,true);assert.equal(pass.ourGain,14);assert.equal(pass.opponentGain,14);assert.equal(pass.giveValue,20);assert.equal(pass.getValue,20);assert.equal(pass.acceptance.heuristic,true);
for(const value of [17,16.99]){const f=fixture();f.snapshot.records.find(r=>r.playerId==='WR1').value=value;const r=compare(f);assert.equal(r.actionable,value===17,'15% exact threshold');}
for(const phase of [0,1,2]){const f=fixture();f.season.transaction_round=phase;f.give[0].pk.pick_no=55;f.get[0].pk.pick_no=4;const r=compare(f);if(!phase)assert.equal(r.status,'DRAFT_PREFERENCE_UNRESOLVED');else assert.equal(r.revealedPreferencePenalty,12);}
{const f=fixture();f.projections.find(r=>r.playerId==='RB2').value=1;assert.equal(compare(f).actionable,false,'market values alone cannot create projected lineup gain');}
for(const mutate of [f=>{f.season.source='unverified';},f=>{f.season.ownership.WR1.roster_id=9;},f=>{f.mine.pop();},f=>{f.give=[f.mine[3]];},f=>{f.give=[f.mine[4]];},f=>{f.give[0].seasonStatus='IR';},f=>{f.give[0].seasonStatus='RESERVE';},f=>{f.give=[f.give[0],f.give[0]];},f=>{f.season.league.roster_positions=['QB','RB','WR','TE','BN'];f.get=[f.opponent[1],f.opponent[2]];}]){const f=fixture();mutate(f);assert.equal(compare(f).actionable,false);}
for(const mutate of [s=>{s.week=1;},s=>{s.season=2025;},s=>{s.scoring='PPR';},s=>{s.lastSuccessAt=now-25*3600000;},s=>{s.expiresAt=now;},s=>{s.coverage.positions.TE.status='UNAVAILABLE';},s=>{s.records.push({...s.records[0]});},s=>{s.records[0].conflict=true;},s=>{s.records[0]=null;},s=>{s.sourceId='arbitrary';}]){
  const f=fixture();mutate(f.snapshot);const r=execute(f);assert.equal(r.result.actionable,false);assert.equal(r.records.filter(r=>r.metric==='trade_value').length,0);
}
{const f=fixture();f.snapshot.records=f.snapshot.records.filter(r=>r.playerId!=='WR1');f.snapshot.coverage.positions.WR.mapped--;assert.equal(execute(f).result.status,'UNAVAILABLE');}
{const f=fixture();f.legacy=f.snapshot.records;f.snapshot={available:true,source:'arbitrary',as_of:new Date(now).toISOString(),values:{WR1:{value:20},RB2:{value:20}}};assert.equal(execute(f).result.actionable,false,'generic cache map + legacy records cannot bypass Boone');}
for(const r of execute(valid).records.filter(r=>r.metric==='trade_value'))assert.equal(r.value,snapshot.records.find(x=>x.playerId===r.playerId).value);
assert.equal(adaptBooneTradeEvidence,diagnosticAdapter,'one shared source contract');
assert.equal(adaptBooneTradeEvidence(snapshot,{season:2026,week:2,scoring:'HALF_PPR'},now).secondarySourceGate,PEAKED_GATE);
assert.equal(RUNTIME_FILES.length,17);assert(!RUNTIME_FILES.includes('trade-boone-source-contract-v1.mjs'));
const runtime=fs.readFileSync('boone-trade-values-v1.mjs','utf8');assert(!runtime.includes("from './trade-team-needs-v2.js'"));assert(!app.includes('evaluateBooneTradeOffer'));
assert(app.includes("APP_VERSION='v11.8.0-rc4.213'"));
console.log(`BOONE_PRODUCTION_PARITY_PASS ${parity} equal decisions; strict evidence negatives; 17 runtime files; no formula drift`);
