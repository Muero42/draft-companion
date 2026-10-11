import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
const app=fs.readFileSync('app.js','utf8').replace(/\r\n/g,'\n');
function source(name){const start=app.indexOf('function '+name+'('),end=app.slice(start+1).search(/\n(?:async )?function /);assert(start>=0);return(app.slice(start-6,start)==='async '?'async ':'')+app.slice(start,end<0?undefined:start+1+end);}
const secret='SECRET_TOKEN_RAW_BODY_MUST_NOT_APPEAR';
function fixture(){
 let now=1000;
 const els=new Proxy({},{get:(o,k)=>o[k]??={innerHTML:'',textContent:'',value:'9'}});
 const c={draftComplete:true,mine:[],rankedAvailable:[],players:{},seasonRows:[{p:{id:'private-player-id'}}],season:{ok:true,generated_at:900,player_directory:{fetchedAt:800}},picks:[],teams:10};
 const box={Date:class extends Date{static now(){return now}},console:{error(){}},els,lastDraftContext:c,lastPostDraftPairs:[],
  seasonUiYield:async()=>{},seasonDecisionDeadline:()=>2000,seasonLineupHtml:()=>'',renderRosterBenchAudit:()=>{},renderRosterFaAudit:()=>{},renderTradeWorkspace:()=>{},renderWaiverWorkspace:()=>{},renderSeasonActionBoard:()=>{},scheduleSeasonDecisionExpiry:()=>{}};
 vm.createContext(box);vm.runInContext(app.slice(app.indexOf('let seasonRenderQueued='),app.indexOf('\nlet seasonLiveRefreshPromise')),box);
 for(const name of ['runSeasonSurface','blockSeasonDependentSurface','rerenderPostDraftFromContext'])vm.runInContext(source(name),box);
 const trace=box.seasonRenderPassCurrent.diagnostic;
 return{box,els,c,trace,setNow:v=>now=v};
}
async function drain(f){for(let i=0;i<100;i++)await Promise.resolve();assert.equal(f.trace.snapshot().running,false);}
const good=fixture();good.box.queueSeasonRerender(false,'weekly');await drain(good);
let out=good.trace.snapshot();assert.equal(out.events[0].trigger,'weekly');assert.equal(out.lastCompletedStage,'action');assert(out.events.some(e=>e.event==='PASS_DONE'));assert.equal(out.queued,false);
for(const stage of ['roster','lineup','fa','trade','waiver','action'])assert(out.events.some(e=>e.event==='STAGE_DONE'&&e.stage===stage),stage);
const bad=fixture();bad.box.seasonLineupHtml=()=>{throw new TypeError(secret)};bad.box.queueSeasonRerender(false,'live');await drain(bad);
out=bad.trace.snapshot();assert(out.events.some(e=>e.event==='STAGE_START'&&e.stage==='roster'));assert(!out.events.some(e=>e.event==='STAGE_DONE'));assert.equal(out.events.at(-1).event,'ERROR');assert.equal(out.events.at(-1).errorType,'TypeError');assert(!JSON.stringify(out).includes(secret));assert.match(bad.els.waiverStatus.textContent,/Berechnung ausstehend/,'diagnostics do not silently change existing failure behavior');
const missing=fixture();missing.box.lastDraftContext=null;missing.box.queueSeasonRerender();await drain(missing);assert(missing.trace.snapshot().events.some(e=>e.reason==='CONTEXT_INCOMPLETE'));
const lane=fixture();lane.box.renderRosterFaAudit=()=>{throw Error(secret)};lane.box.queueSeasonRerender();await drain(lane);assert(lane.trace.snapshot().events.some(e=>e.event==='STAGE_ERROR'&&e.stage==='fa'));assert(lane.trace.snapshot().events.some(e=>e.event==='STAGE_DONE'&&e.stage==='trade'));assert(!lane.trace.snapshot().events.some(e=>e.event==='STAGE_START'&&e.stage==='waiver'));
for(const reason of ['CONTEXT_REPLACED','REVISION_CHANGED','DEADLINE_EXPIRED']){
 const f=fixture();
 if(reason==='CONTEXT_REPLACED')f.box.lastDraftContext={...f.c};
 if(reason==='REVISION_CHANGED')vm.runInContext('seasonRenderRevision++',f.box);
 if(reason==='DEADLINE_EXPIRED')f.setNow(2000);
 assert.equal(f.box.seasonRenderPassCurrent(f.c,0,2000),false);
 out=f.trace.snapshot();assert(out.events.some(e=>e.reason===reason));
 if(reason==='CONTEXT_REPLACED'){const e=out.events.find(e=>e.event==='ABORT');assert.notEqual(e.contextId,e.passContextId);}
 if(reason==='DEADLINE_EXPIRED'){
  assert.equal(out.queued,true);assert(out.events.some(e=>e.event==='EXPIRY_RETRY'));
  vm.runInContext('seasonRenderQueued=false',f.box);f.box.seasonRenderPassCurrent(f.c,0,2000);
  assert(f.trace.snapshot().events.some(e=>e.event==='RETRY_LIMIT'));assert.equal(f.trace.snapshot().queued,false);
 }
}
// Capture is bounded, allowlisted, detached, nonpersistent and independent of providers.
for(let i=0;i<1000;i++)good.trace.record('REQUEST',{trigger:secret,errorType:secret,reason:secret,stage:secret,context:{secret},deadline:Infinity,raw:secret});
out=good.trace.snapshot();assert.equal(out.events.length,64);assert(out.dropped>0);assert(JSON.stringify(out).length<40000);assert(!JSON.stringify(out).includes(secret));assert(!JSON.stringify(out).includes('private-player-id'));assert.equal(out.events.at(-1).deadlineAt,null);
out.events[0].reason=secret;assert(!JSON.stringify(good.trace.snapshot()).includes(secret));
assert.doesNotThrow(()=>good.trace.record('REQUEST',{get stage(){throw Error(secret)}}));
// Execute the existing copy/export path, with empty domain fixtures and network/storage-write traps.
let copied='';const f=fixture();Object.assign(f.box,{APP_VERSION:'fixture',store:{get:()=>null,set:()=>assert.fail('diagnostic wrote storage')},seasonEvidenceContext:()=>({season:2026,week:5}),SEASON_PROJECTION_POSITIONS:[],WEEKLY_PROJECTION_POSITIONS:[],BOONE_TRADE_VALUE_CACHE_KEY:'trade',seasonAcquisitionDiagnostic:()=>({}),seasonActualScoreDiagnostic:()=>({}),validateBooneTradeValueSnapshot:()=>({ok:false}),lastSeasonTradeFunnel:null,seasonDstTeam:x=>x,
  navigator:{clipboard:{writeText:async text=>copied=text}},$:()=>null,fetch:()=>assert.fail('diagnostic acquired data')});
f.box.lastDraftContext.seasonRows=[];for(const name of ['seasonDataDiagnostic','copySeasonDataDiagnostic'])vm.runInContext(source(name),f.box);
f.trace.record('REQUEST',{trigger:'expiry'});await f.box.copySeasonDataDiagnostic();assert.equal(JSON.parse(copied).renderLifecycle.events[0].trigger,'expiry');
// Navigation carries its own event without starting work.
f.box.document={body:{dataset:{}},querySelectorAll:()=>[]};f.box.localStorage={setItem:()=>{}};f.box.renderSeasonRankingFreshness=()=>{};vm.runInContext(source('setWorkspace').split('// Startup-critical')[0],f.box);f.box.setWorkspace('trade');assert.equal(f.trace.snapshot().events.at(-1).workspace,'trade');assert.equal(f.trace.snapshot().running,false);
console.log('RENDER_DIAGNOSTIC_PASS completion/error/preflight/domain failure; context/revision/expiry/retry limit; 64-entry bound, secret safety, detached export, no requests/writes; navigation correlation.');
