import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {execFileSync} from 'node:child_process';
import * as engine from '../season-decision-engine-v1.mjs';
import weekly from '../weekly-evidence-v2.js';
import {RUNTIME_FILES} from './runtime-files.mjs';
import {rc4229HistoricalRuntime} from './rc4230-diagnostic-baseline.mjs';

const app=fs.readFileSync('app.js','utf8').replace(/\r\n/g,'\n'),now=Date.parse('2026-10-06T08:00:00Z'),secret='SECRET_RC4230_NEVER_EXPORT';
const players=Object.fromEntries(Array.from({length:24},(_,i)=>[String(i+1),{full_name:'Synthetic QB '+i,position:'QB',team:'BUF',fantasy_data_id:i+1}]));
const payload=(ids=[317])=>({season:2026,week:5,experts:{'WK5-HALF':{QB:ids.length}},ecr_experts:{'WK5-HALF':{QB:ids}},last_updated:new Date(now).toISOString(),players:Object.entries(players).map(([id,p],i)=>({id:Number(id),player_name:p.full_name,position_id:'QB',team_id:'BUF',rank:{ECR:{'WK5-HALF':{QB:i+1}}}}))});
const source=(experts=[{id:'317',name:'Justin Boone'}])=>({schema:'pitti.season-decision-sources.v1',season:2026,week:5,verifiedAt:now,directories:{QB:{position:'QB',season:2026,week:5,verifiedAt:now,experts}}});
const begin=app.indexOf('// BEGIN RC4228 DIAGNOSTIC ONLY'),end=app.indexOf('// END RC4228 DIAGNOSTIC ONLY');
const http=app.slice(app.indexOf('function seasonAcquisitionHttpReason('),app.indexOf('function seasonAcquisitionDirectory('));
function setup({directory=source(),control=payload([317,22]),filtered=payload(),status=200,error=null,bodyState='JSON'}={}){
  const calls=[],box={Date:class extends Date{static now(){return now}},PittiWeeklyEvidenceV2:weekly,PittiSeasonDecisionV1:engine,lastDraftContext:{players},seasonUiYield:async()=>{},diagnosticRetryAfter:ms=>ms==null?null:ms/1000,fpProxyRequest:async(route,options)=>{calls.push({route,options});if(error)throw error;return{status,bodyState,data:calls.length===1?control:filtered,retryAfterMs:7200000};}};
  vm.createContext(box);vm.runInContext(http+app.slice(begin,end),box);
  return{calls,box,run:(extra={})=>box.seasonIndividualRankRouteResearch({season:2026,week:5,source:directory,...extra})};
}
let cases=0;
const directoryCases=[
  ['match',source(),'MATCH'],['empty',source([]),'UNRESOLVED'],['null',null,'UNRESOLVED'],['absent',{},'UNRESOLVED'],
  ['stale',{...source(),verifiedAt:now-3600001},'UNRESOLVED'],['wrong week',{...source(),week:4},'UNRESOLVED'],
  ['future',{...source(),verifiedAt:now+1},'UNRESOLVED'],['bad schema',{...source(),schema:'invalid'},'UNRESOLVED'],
  ['directory stale',{...source(),directories:{QB:{...source().directories.QB,verifiedAt:now-3600001}}},'UNRESOLVED'],
  ['directory context',{...source(),directories:{QB:{...source().directories.QB,position:'RB'}}},'UNRESOLVED'],
  ['unrelated',source([{id:'22',name:secret}]),'UNRESOLVED'],['malformed',source([{id:'317',name:null},{id:null,name:'Justin Boone'},{id:'317',name:''}]),'UNRESOLVED'],
  ['id conflict',source([{id:'317',name:'Other'}]),'CONFLICT'],['name conflict',source([{id:'22',name:'Justin Boone'}]),'CONFLICT'],
  ['both',source([{id:'317',name:'Other'},{id:'22',name:'Justin Boone'}]),'CONFLICT'],
  ['duplicate id hidden',source([{id:'317',name:'Justin Boone'},{id:'317',name:'Other'}]),'CONFLICT'],
  ['duplicate name hidden',source([{id:'317',name:'Justin Boone'},{id:'22',name:'Justin Boone'}]),'CONFLICT'],
  ['duplicate exact',source([{id:'317',name:'Justin Boone'},{id:'317',name:'Justin Boone'}]),'MATCH']
];
for(const [name,directory,status] of directoryCases){const x=setup({directory}),r=await x.run();assert.equal(r.directoryIdentityStatus,status,name);assert.equal(r.directoryIdentityProven,status==='MATCH',name);assert.equal(r.identityBasis,'CONFIGURED_DIAGNOSTIC_TARGET');assert.equal(x.calls.length,status==='CONFLICT'?0:2,name);assert.equal(r.outcome,status==='CONFLICT'?'FILTERED_CONTEXT_AMBIGUOUS':'FILTERED_STRUCTURAL_CANDIDATE',name);assert.equal(r.adapterImplemented,false);assert.equal(r.strictAccepted,false);assert(!JSON.stringify(r).includes(secret));cases++;}
for(const status of [401,403,429]){const x=setup({status}),r=await x.run();assert.equal(x.calls.length,1);assert.equal(r.requests[0].retryAfterSeconds,7200);await x.run();assert.equal(x.calls.length,1);assert.equal(vm.runInContext('seasonIndividualRouteRetryAt',x.box),now+7200000);cases++;}
for(const code of ['NETWORK','TIMEOUT']){const x=setup({error:{code,message:secret,token:secret}}),r=await x.run();assert.equal(x.calls.length,1);assert.equal(r.requests[0].rejectionReason,code);assert(!JSON.stringify(r).includes(secret));cases++;}
const malformed=await setup({control:null,filtered:null,bodyState:'INVALID_JSON'}).run();assert.equal(malformed.outcome,'FILTERED_CONTEXT_AMBIGUOUS');assert.equal(malformed.requests[0].rejectionReason,'MALFORMED_PAYLOAD');cases++;
const changed=(p,fn)=>{const copy=structuredClone(p);fn(copy);return copy;};
const controlCases=[
 ['not advertised',payload([22]),'EXPERT_NOT_ADVERTISED_FOR_CONTEXT'],
 ['season',{...payload(),season:2025}],['week',{...payload(),week:4}],['nested week',changed(payload(),p=>p.ecr_experts={'WK4-HALF':{QB:[317]}})],
 ['STD',changed(payload(),p=>p.ecr_experts={'WK5-STD':{QB:[317]}})],['PPR',changed(payload(),p=>p.ecr_experts={'WK5-PPR':{QB:[317]}})],
 ['position',changed(payload(),p=>p.ecr_experts={'WK5-HALF':{RB:[317]}})],
 ['multiple',changed(payload(),p=>p.ecr_experts={QB:{'WK5-HALF':[317]},'WK5-HALF':{QB:[317]}})],
 ['bad ids',changed(payload(),p=>p.ecr_experts={'WK5-HALF':{QB:[317,'bad']}})],
 ['oversized',changed(payload(),p=>p.ecr_experts={'WK5-HALF':{QB:Array.from({length:2001},(_,i)=>i+1)}})],
 ['truncated keys',changed(payload(),p=>{p.ecr_experts=Object.fromEntries(Array.from({length:129},(_,i)=>['unknown'+i,1]));p.ecr_experts['WK5-HALF']={QB:[317]};})]
];
for(const [name,control,outcome='FILTERED_CONTEXT_AMBIGUOUS'] of controlCases){const r=await setup({control}).run();assert.equal(r.outcome,outcome,'control '+name);cases++;}
const filteredCases=[
 ['empty',{...payload(),players:[]},'FILTERED_RESPONSE_EMPTY_OR_UNUSABLE'],
 ['zero',changed(payload(),p=>p.players.forEach(row=>row.rank.ECR['WK5-HALF'].QB=0)),'FILTERED_RESPONSE_EMPTY_OR_UNUSABLE'],
 ['depth',{...payload(),players:payload().players.slice(0,2)}],
 ['mapping',changed(payload(),p=>p.players.forEach(row=>{row.id=99999;row.player_name='Unknown';}))],
 ['multi expert',payload([317,22])],['wrong expert',payload([22])],['wrong count',changed(payload(),p=>p.experts['WK5-HALF'].QB=22)],
 ['week',{...payload(),week:4}],['season',{...payload(),season:2025}],
 ['position',changed(payload(),p=>p.players.forEach(row=>row.rank.ECR={'WK5-HALF':{RB:1}}))],['nested week',changed(payload(),p=>p.players.forEach(row=>row.rank.ECR={'WK4-HALF':{QB:1}}))],
 ['wrong metadata position',changed(payload(),p=>p.ecr_experts={'WK5-HALF':{RB:[317]}})],
 ['STD',changed(payload(),p=>p.players.forEach(row=>row.rank.ECR={'WK5-STD':{QB:1}}))],
 ['PPR',changed(payload(),p=>p.players.forEach(row=>row.rank.ECR={'WK5-PPR':{QB:1}}))],
 ['multiple ranks',changed(payload(),p=>p.players.forEach(row=>row.rank.ECR={QB:{'WK5-HALF':1},'WK5-HALF':{QB:1}}))],
 ['malformed',null,'FILTERED_RESPONSE_EMPTY_OR_UNUSABLE']
];
for(const [name,filtered,outcome='FILTERED_CONTEXT_AMBIGUOUS'] of filteredCases){const r=await setup({filtered}).run();assert.equal(r.outcome,outcome,'filtered '+name);cases++;}
for(const [name,time,valid] of [['now',now,true],['past',now-60000,true],['36h',now-36*3600000,true],['old',now-36*3600000-1,false],['future1',now+1,false],['future30m',now+1800000,false],['missing',null,false],['invalid','invalid',false]]){
  const filtered=payload();if(time===null)delete filtered.last_updated;else filtered.last_updated=typeof time==='number'?new Date(time).toISOString():time;const r=await setup({filtered}).run();assert.equal(r.requests[1].freshChronology,valid,name);assert.equal(r.outcome,valid?'FILTERED_STRUCTURAL_CANDIDATE':'FILTERED_CONTEXT_AMBIGUOUS',name);cases++;
}
const normal=setup();await normal.run();assert.deepEqual(normal.calls.map(x=>x.route),['/nfl/2026/rankings?week=5&range=true&rankstats=true','/nfl/2026/rankings?week=5&filters=317&range=true&rankstats=true']);assert(normal.calls.every(x=>x.options.timeoutMs===8000&&x.options.preserveMalformed));await normal.run();assert.equal(normal.calls.length,2);
const parallel=setup();await Promise.all([parallel.run(),parallel.run()]);assert.equal(parallel.calls.length,2);
for(const [,directory] of directoryCases){const x=setup({directory});await x.run({blocked:true});assert.equal(x.calls.length,0);}
const poisoned=changed(payload(),p=>{p.token=secret;p.ecr_experts[secret]={QB:[secret]};p.players.forEach(row=>{row.token=secret;row.rank[secret]=secret;});});const safe=await setup({control:poisoned,filtered:poisoned,directory:source([{id:'317',name:'Justin Boone',token:secret},{id:'22',name:secret}])}).run();assert(!JSON.stringify(safe).includes(secret));assert(!JSON.stringify(safe).includes('Synthetic QB'));assert.equal(safe.secretSafety,'ALLOWLIST_ONLY_NO_KEYS_HEADERS_TOKENS_OR_RAW_BODIES');

// Exact inverse proof pins every unmodified runtime byte, including all consumers/normal traffic.
for(const file of RUNTIME_FILES){const actual=fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n'),baseline=execFileSync('git',['show','a7f27740d33a7a39127d51515cc2fd8c3d9f28ff:'+file],{encoding:'utf8'});assert.equal(rc4229HistoricalRuntime(file,actual),baseline,file+' exact bounded delta');}
assert.equal((app.match(/await seasonIndividualRankRouteResearch\(/g)||[]).length,1);assert(app.slice(app.indexOf('async function runSeasonAcquisitionAudit('),begin).includes('await seasonIndividualRankRouteResearch'));

// Copy UI executes production handlers; it only copies the last produced acquisition report.
const ids=['seasonDiagnosticStatus','seasonDiagnosticOutput','seasonAcquisitionCopyBtn','seasonAcquisitionAuditBtn'],els=Object.fromEntries(ids.map(id=>[id,{disabled:id==='seasonAcquisitionCopyBtn',select(){this.selected=true;}}]));let acquired=0;const copied=[],report={schema:'pitti.season-acquisition-audit.v1',value:'original'};
const box={$:id=>els[id],navigator:{clipboard:{writeText:async text=>copied.push(text)}},runSeasonAcquisitionAudit:async()=>{acquired++;return report;}};vm.createContext(box);vm.runInContext(app.slice(app.indexOf('// RC4230 separate copy'),app.indexOf('\n\nif(els.seasonRefreshEvidenceBtn)')),box);
await els.seasonAcquisitionCopyBtn.onclick();assert.equal(copied.length,0);await els.seasonAcquisitionAuditBtn.onclick();assert.equal(els.seasonAcquisitionCopyBtn.disabled,false);els.seasonDiagnosticOutput.value='generic report';await els.seasonAcquisitionCopyBtn.onclick();assert.equal(copied[0],JSON.stringify(report));assert.equal(acquired,1);box.navigator.clipboard.writeText=async()=>{throw Error('clipboard');};await els.seasonAcquisitionCopyBtn.onclick();assert.equal(els.seasonDiagnosticOutput.value,JSON.stringify(report));assert.equal(els.seasonDiagnosticOutput.selected,true);assert.equal(acquired,1);
assert(fs.readFileSync('index.html','utf8').includes('id="seasonAcquisitionCopyBtn" class="secondary" type="button" disabled'));
console.log('RC4230_ACQUISITION_CONTRACT_PASS '+cases+' table cases; directory raw-conflict; transport/cardinality/backoff; nested fail-closed; chronology; secrets; exact18-runtime-inverse; copy no request');
