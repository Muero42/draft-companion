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
const names=app.split('\n').find(line=>line.startsWith('const norm='))+'\n'+app.split('\n').find(line=>line.startsWith('function normalizedExpertName('));
const http=app.slice(app.indexOf('function seasonAcquisitionHttpReason('),app.indexOf('function seasonAcquisitionDirectory('));
function setup({directory=source(),control=payload([317,22]),filtered=payload(),status=200,error=null,bodyState='JSON',filteredBodyState=bodyState}={}){
  const calls=[],box={Date:class extends Date{static now(){return now}},PittiWeeklyEvidenceV2:weekly,PittiSeasonDecisionV1:engine,lastDraftContext:{players},seasonUiYield:async()=>{},diagnosticRetryAfter:ms=>ms==null?null:ms/1000,fpProxyRequest:async(route,options)=>{calls.push({route,options});if(error)throw error;return{status,bodyState:calls.length===1?bodyState:filteredBodyState,data:calls.length===1?control:filtered,retryAfterMs:7200000};}};
  vm.createContext(box);vm.runInContext(names+http+app.slice(begin,end),box);
  return{calls,box,run:(extra={})=>box.seasonIndividualRankRouteResearch({season:2026,week:5,source:directory,...extra})};
}
let cases=0;
const directoryCases=[
  ['lowercase',source([{id:'317',name:'justin boone'}]),'MATCH'],
  ['uppercase',source([{id:'317',name:'JUSTIN BOONE'}]),'MATCH'],
  ['formatting',source([{id:'317',name:' Justin  Boone '}]),'MATCH'],
  ['equivalent duplicates',source([{id:'317',name:'Justin Boone'},{id:'317',name:'JUSTIN BOONE'}]),'MATCH'],
  ['normalized wrong ID',source([{id:'999',name:'JUSTIN BOONE'}]),'CONFLICT'],
  ['hidden normalized conflict',source([{id:'317',name:'Justin Boone'},{id:'999',name:'JUSTIN BOONE'}]),'CONFLICT'],
  ['cased wrong name',source([{id:'317',name:'ANOTHER EXPERT'}]),'CONFLICT'],
  ['normalized dual conflict',source([{id:'317',name:'ANOTHER EXPERT'},{id:'999',name:'justin boone'}]),'CONFLICT'],
  ['unrelated duplicates',source([{id:'22',name:'Other Expert'},{id:'22',name:'OTHER EXPERT'}]),'UNRESOLVED'],
  ['stale normalized conflict',{...source([{id:'999',name:'JUSTIN BOONE'}]),verifiedAt:now-3600001},'UNRESOLVED'],
  ['wrong-context normalized conflict',{...source([{id:'999',name:'JUSTIN BOONE'}]),week:4},'UNRESOLVED'],
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
 ['malformed',null,'FILTERED_CONTEXT_AMBIGUOUS']
];
for(const [name,filtered,outcome='FILTERED_CONTEXT_AMBIGUOUS'] of filteredCases){const r=await setup({filtered}).run();assert.equal(r.outcome,outcome,'filtered '+name);cases++;}
for(const [name,time,valid] of [['now',now,true],['past',now-60000,true],['36h',now-36*3600000,true],['old',now-36*3600000-1,false],['future1',now+1,false],['future30m',now+1800000,false],['missing',null,false],['invalid','invalid',false]]){
  const filtered=payload();if(time===null)delete filtered.last_updated;else filtered.last_updated=typeof time==='number'?new Date(time).toISOString():time;const r=await setup({filtered}).run();assert.equal(r.requests[1].freshChronology,valid,name);assert.equal(r.outcome,valid?'FILTERED_STRUCTURAL_CANDIDATE':'FILTERED_CONTEXT_AMBIGUOUS',name);cases++;
}
const normal=setup();await normal.run();assert.deepEqual(normal.calls.map(x=>x.route),['/nfl/2026/rankings?week=5&range=true&rankstats=true','/nfl/2026/rankings?week=5&filters=317&range=true&rankstats=true']);assert(normal.calls.every(x=>x.options.timeoutMs===8000&&x.options.preserveMalformed));await normal.run();assert.equal(normal.calls.length,2);
const parallel=setup();await Promise.all([parallel.run(),parallel.run()]);assert.equal(parallel.calls.length,2);
for(const [,directory] of directoryCases){const x=setup({directory});await x.run({blocked:true});assert.equal(x.calls.length,0);}
const poisoned=changed(payload(),p=>{p.token=secret;p.ecr_experts[secret]={QB:[secret]};p.players.forEach(row=>{row.token=secret;row.rank[secret]=secret;});});const safe=await setup({control:poisoned,filtered:poisoned,directory:source([{id:'317',name:'Justin Boone',token:secret},{id:'22',name:secret}])}).run();assert(!JSON.stringify(safe).includes(secret));assert(!JSON.stringify(safe).includes('Synthetic QB'));assert.equal(safe.secretSafety,'ALLOWLIST_ONLY_NO_KEYS_HEADERS_TOKENS_OR_RAW_BODIES');

// Inventory exercises the extracted production parser without any provider access.
const shape=p=>setup().box.seasonIndividualRankRouteShape(p,{season:2026,week:5});
const genuineEmpty={...payload(),players:[]};
for(const [name,filtered,expected='FILTERED_CONTEXT_AMBIGUOUS',bodyState='JSON'] of [
  ['wrong week empty',{...genuineEmpty,week:4}],
  ['wrong season empty',{...genuineEmpty,season:2025}],
  ['null empty',null],
  ['unknown metadata empty',{...genuineEmpty,ecr_experts:{SECRET_KEY_NAME:{QB:[317]}}}],
  ['malformed body',genuineEmpty,'FILTERED_CONTEXT_AMBIGUOUS','INVALID_JSON'],
  ['missing players',changed(payload(),p=>{delete p.players;})],
  ['non-array players',{...genuineEmpty,players:{}}],
  ['truncated empty',{...genuineEmpty,ecr_experts:Object.fromEntries(Array.from({length:129},(_,i)=>[String(i+1),{QB:[317]}]))}],
  ['proven empty',genuineEmpty,'FILTERED_RESPONSE_EMPTY_OR_UNUSABLE'],
  ['positive unchanged',payload(),'FILTERED_STRUCTURAL_CANDIDATE']
]){const x=setup({filtered,filteredBodyState:bodyState}),r=await x.run();assert.equal(r.outcome,expected,name);assert.equal(r.requests[1].playersArrayPresent,Array.isArray(filtered?.players),name);assert.equal(x.calls.length,2);assert.equal(r.strictAccepted,false);assert.equal(r.adapterImplemented,false);cases++;}
const exact=shape(payload());assert.equal(exact.availableExpertDimensionPaths[0].path,'WK5-HALF.QB');assert.equal(exact.availableExpertDimensionPaths[0].validExpertCount,1);assert.equal(exact.availableExpertDimensionPaths[0].containsConfiguredExpert317,true);assert.equal(exact.availableRankDimensionPaths[0].rows,24);
for(const [dimension,position] of [['WK5-PPR','QB'],['WK5-HALF','RB']]){
  const p=payload();p.ecr_experts={[dimension]:{[position]:[317,987654]}};p.experts={[dimension]:{[position]:2}};
  const r=await setup({control:p}).run();assert.equal(r.outcome,'EXPECTED_CONTEXT_NOT_ADVERTISED');assert.equal(r.requests[0].availableExpertDimensionPaths[0].path,dimension+'.'+position);assert(!JSON.stringify(r).includes('987654'));cases++;
}
const multiple=payload();multiple.ecr_experts['WK5-PPR']={QB:[987654]};multiple.experts['WK5-PPR']={QB:1};assert.equal(shape(multiple).availableExpertDimensionPaths.length,2);assert.equal((await setup({control:multiple}).run()).outcome,'FILTERED_STRUCTURAL_CANDIDATE');cases++;
const emptyContexts={...payload(),ecr_experts:{},experts:{}};assert.equal((await setup({control:emptyContexts}).run()).outcome,'EXPECTED_CONTEXT_NOT_ADVERTISED');cases++;
const numeric={...payload(),ecr_experts:{987654:{'WK5-HALF':{QB:[317,987654]}}}};const numericShape=shape(numeric);assert.equal(numericShape.availableExpertDimensionPaths[0].containsConfiguredExpert317,true);assert(numericShape.expertTopologyProfile.numericKeyCount>0);assert(!JSON.stringify(numericShape).includes('987654'));assert.equal((await setup({control:numeric}).run()).outcome,'FILTERED_CONTEXT_AMBIGUOUS');cases++;
const numericIds={...payload(),ecr_experts:{'WK5-HALF':{QB:{317:true,987654:1}}}};assert.equal(shape(numericIds).availableExpertDimensionPaths[0].validExpertCount,2);assert(!JSON.stringify(shape(numericIds)).includes('987654'));cases++;
for(const ecr_experts of [{[secret]:{QB:[317]}},{'WK5-HALF':{QB:{}}},{ECR:{'WK5-PPR':{QB:[317]}}},null]){const p={...payload(),ecr_experts,experts:{}};assert.equal((await setup({control:p}).run()).outcome,'FILTERED_CONTEXT_AMBIGUOUS');assert(!JSON.stringify(shape(p)).includes(secret));cases++;}
const truncated={...payload(),ecr_experts:Object.fromEntries(Array.from({length:129},(_,i)=>[String(i+1),{'WK5-HALF':{QB:[317]}}]))};assert.equal(shape(truncated).topologyTruncated,true);assert.equal((await setup({control:truncated}).run()).outcome,'FILTERED_CONTEXT_AMBIGUOUS');cases++;
const frequencies=payload();frequencies.players[0].rank.ECR={'WK5-PPR':{QB:1}};const freq=shape(frequencies).availableRankDimensionPaths;assert.equal(freq.find(x=>x.path==='WK5-HALF.QB').rows,23);assert.equal(freq.find(x=>x.path==='WK5-PPR.QB').rows,1);cases++;
for(const [value,status] of [[new Date(now).toISOString(),'FRESH'],[new Date(now-36*3600000-1).toISOString(),'STALE'],[new Date(now+1).toISOString(),'FUTURE'],[undefined,'MISSING_OR_UNPARSABLE'],['bad','MISSING_OR_UNPARSABLE']]){const p=payload();if(value===undefined)delete p.last_updated;else p.last_updated=value;assert.equal(shape(p).chronologyStatus,status);cases++;}
const absent=shape(payload([987654]));assert.equal(absent.availableExpertDimensionPaths[0].containsConfiguredExpert317,false);assert(!JSON.stringify(absent).includes('987654'));cases++;

// Real provider topology: week is top-level, QB availability is STD, ranks include HALF.
const realTopology=(fresh=false)=>{
  const p=payload(Array.from({length:14},(_,i)=>i===0?317:i));
  p.ecr_experts={STD:{QB:[317,...Array.from({length:13},(_,i)=>i+1)]},HALF:{RB:[317],WR:[317],TE:[317]}};
  p.experts={STD:{QB:14},HALF:{RB:1,WR:1,TE:1}};
  p.players.forEach((r,i)=>r.rank.ECR={STD:{QB:i+1},HALF:{QB:i+1},PPR:{QB:i+1}});
  if(!fresh)delete p.last_updated;
  return p;
};
const realControl=realTopology(),realEmpty={...realTopology(),players:[]};
const real=await setup({control:realControl,filtered:realEmpty}).run();
assert.equal(real.requests[0].metadataUnambiguous,true);assert.equal(real.requests[0].expectedContextAbsent,false);
assert.equal(real.requests[0].availabilityRankContextProven,true);assert.equal(real.requests[0].expert317Present,true);
assert.equal(real.requests[1].chronologyStatus,'MISSING_OR_UNPARSABLE');
assert.equal(real.outcome,'FILTERED_CONTEXT_AMBIGUOUS','missing chronology is deliberately not conclusive');cases++;
const freshControl=realTopology(true),freshEmpty={...realTopology(true),players:[]};
for(const [name,control,filtered,directory=source(),expected='FILTERED_CONTEXT_AMBIGUOUS'] of [
 ['fresh bound negative',freshControl,freshEmpty,source(),'FILTERED_RESPONSE_EMPTY_OR_UNUSABLE'],
 ['unknown directory',freshControl,freshEmpty,null],
 ['conflicting directory',freshControl,freshEmpty,source([{id:'317',name:'Wrong'}])],
 ['missing filtered chronology',freshControl,realEmpty],
 ['missing control chronology',realControl,freshEmpty],
 ['wrong week',freshControl,{...freshEmpty,week:4}],
 ['wrong season',freshControl,{...freshEmpty,season:2025}],
 ['no requested rank context',changed(freshControl,p=>p.players.forEach(r=>delete r.rank.ECR.HALF)),freshEmpty],
 ['malformed ranks',changed(freshControl,p=>p.players[0].rank.ECR.HALF.QB='bad'),freshEmpty],
 ['conflicting rank week',changed(freshControl,p=>p.players[0].rank.ECR['WK4-HALF']={QB:1}),freshEmpty],
 ['unknown ranks',changed(freshControl,p=>p.players[0].rank.ECR[secret]=1),freshEmpty],
 ['unknown metadata',freshControl,changed(freshEmpty,p=>p.ecr_experts[secret]=[317])],
 ['malformed metadata',freshControl,changed(freshEmpty,p=>p.ecr_experts.STD.QB=null)],
 ['wrong count',freshControl,changed(freshEmpty,p=>p.experts.STD.QB=15)],
 ['no configured target',freshControl,changed(freshEmpty,p=>p.ecr_experts.STD.QB[0]=999)],
 ['conflicting alias',freshControl,changed(freshEmpty,p=>{p.ecr_experts['WK5-HALF']={QB:[999]};})],
 ['conflicting week metadata',freshControl,changed(freshEmpty,p=>{p.ecr_experts['WK4-HALF']={QB:[317]};})],
 ['conflicting counts path',freshControl,changed(freshEmpty,p=>{p.experts={HALF:{QB:14}};})],
 ['truncated',freshControl,changed(freshEmpty,p=>p.ecr_experts.STD.QB=Array.from({length:2001},(_,i)=>i+1))],
 ['not array',freshControl,{...freshEmpty,players:{}}],
 ['stale',freshControl,{...freshEmpty,last_updated:new Date(now-37*3600000).toISOString()}],
 ['future',freshControl,{...freshEmpty,last_updated:new Date(now+1).toISOString()}],
]){const x=setup({control,filtered,directory}),r=await x.run();assert.equal(r.outcome,expected,name);assert(x.calls.length<=2);assert.equal(r.strictAccepted,false);assert.equal(r.adapterImplemented,false);assert(!JSON.stringify(r).includes(secret));cases++;}
// Other positions in the all-position control do not erase the observed HALF.QB rank context.
const mixedControl=changed(freshControl,p=>p.players.push({rank:{ECR:{HALF:{RB:1}}}}));
assert.equal((await setup({control:mixedControl,filtered:freshEmpty}).run()).outcome,'FILTERED_RESPONSE_EMPTY_OR_UNUSABLE');cases++;
// Numeric expert-ID maps are valid leaves, not numeric topology wrappers.
const mappedExperts=changed(freshControl,p=>p.ecr_experts.STD.QB=Object.fromEntries(p.ecr_experts.STD.QB.map(id=>[id,true])));
assert.equal(shape(mappedExperts).metadataTopologyComplete,true);assert.equal(shape(mappedExperts).expert317Present,true);cases++;
for(const position of ['QB','K','DST','RB','WR','TE'])for(const scoring of ['HALF','PPR']){
 const p={season:2026,week:5,ecr_experts:{STD:{[position]:[317]}},experts:{STD:{[position]:1}},players:[{rank:{ECR:{[scoring]:{[position]:1}}}}]};
 const r=setup().box.seasonIndividualRankRouteShape(p,{season:2026,week:5,position,scoring});
 assert.equal(r.metadataUnambiguous,['QB','K','DST'].includes(position),position+' '+scoring+' neutral availability');
 assert.equal(r.availabilityRankContextProven,true);cases++;
}
const canonicalPositive=changed(realTopology(true),p=>{p.ecr_experts.STD.QB=[317];p.experts.STD.QB=1;});
for(const [name,p,expected='FILTERED_CONTEXT_AMBIGUOUS'] of [
 ['positive',canonicalPositive,'FILTERED_STRUCTURAL_CANDIDATE'],
 ['zero ranks without chronology',changed(canonicalPositive,p=>{delete p.last_updated;p.players.forEach(r=>r.rank.ECR.HALF.QB=0);})],
 ['no chronology',changed(canonicalPositive,p=>delete p.last_updated)],
 ['multiple experts',freshControl],
 ['shallow',{...canonicalPositive,players:canonicalPositive.players.slice(0,2)}],
 ['unmapped',changed(canonicalPositive,p=>p.players.forEach(r=>{r.id=99999;r.player_name='Unknown';}))],
 ['unknown rank leaf',changed(canonicalPositive,p=>p.players[0].rank.ECR[secret]=1)],
 ['wrong rank context',changed(canonicalPositive,p=>p.players.forEach(r=>delete r.rank.ECR.HALF))],
]){assert.equal((await setup({control:freshControl,filtered:p}).run()).outcome,expected,name);cases++;}

// Consensus fixtures follow the public v2 experts_available contract; no provider calls.
const consensusPlayers=Object.fromEntries(Array.from({length:67},(_,i)=>[String(i+1),{full_name:'Fixture QB '+i,position:'QB',team:'BUF',fantasy_data_id:i+1}]));
const consensusPayload=()=>({season:2026,week:5,position:'QB',scoring:'HALF',ranking_type_name:'weekly',filters:'317',total_experts:1,expert_name:{317:'Justin Boone'},expert_pub:{317:new Date(now).toISOString()},last_updated:new Date(now).toISOString(),players:Object.entries(consensusPlayers).map(([id,p],i)=>({player_id:Number(id),player_name:p.full_name,position_id:'QB',team_id:'BUF',rank_ecr:i+1,rank_min:i+1,rank_max:i+1,rank_ave:i+1}))});
const availabilityPayload=()=>({...consensusPayload(),filters:null,experts_available:{total:1,included:[317],excluded:[],last_update:now/1000}});
const broadPayload=()=>({...consensusPayload(),filters:null,total_experts:14,expert_name:{22:'Other'}});
function consensusSetup({control=availabilityPayload(),filtered=consensusPayload(),directory=source(),status=200,bodyState='JSON',error=false}={}){
 const x=setup({directory});x.box.lastDraftContext={players:consensusPlayers};const calls=[];
 x.box.fpProxyRequest=async(route,options)=>{calls.push({route,options});if(error)throw {code:'TIMEOUT',message:secret};return {status,bodyState,data:calls.length===1?control:filtered,retryAfterMs:7200000};};
 return {calls,run:extra=>x.box.seasonConsensusFilterResearch({season:2026,week:5,source:directory,...extra}),box:x.box};
}
let consensusCases=0;
for(const [name,control,filtered,expected='AMBIGUOUS',directory=source()] of [
 ['exact',availabilityPayload(),consensusPayload(),'EXACT_INDIVIDUAL_FILTER'],
 ['real broad fallback',availabilityPayload(),broadPayload(),'FILTER_NOT_HONORED'],
 ['wrong filter broad',availabilityPayload(),{...broadPayload(),filters:'22'},'FILTER_NOT_HONORED'],
 ['unavailable',changed(availabilityPayload(),p=>{p.experts_available={total:1,included:[22],excluded:[],last_update:now/1000};p.expert_name={22:'Other'};}),broadPayload(),'EXPERT_NOT_AVAILABLE_FOR_CONTEXT'],
 ['absent versus exact',changed(availabilityPayload(),p=>{p.experts_available={total:1,included:[22],excluded:[],last_update:now/1000};p.expert_name={22:'Other'};}),consensusPayload()],
 ['filtered availability contradiction',availabilityPayload(),{...consensusPayload(),experts_available:{total:1,included:[22],excluded:[],last_update:now/1000}}],
 ['missing availability',consensusPayload(),broadPayload()],
 ['malformed availability',changed(availabilityPayload(),p=>p.experts_available.included='317'),broadPayload()],
 ['stale availability',changed(availabilityPayload(),p=>p.experts_available.last_update-=37*3600),broadPayload()],
 ['future availability',changed(availabilityPayload(),p=>p.experts_available.last_update++),broadPayload()],
 ['duplicate availability',changed(availabilityPayload(),p=>p.experts_available.included=[317,317]),broadPayload()],
 ['overlap availability',changed(availabilityPayload(),p=>p.experts_available.excluded=[317]),broadPayload()],
 ['wrong availability total',changed(availabilityPayload(),p=>p.experts_available.total=14),broadPayload()],
 ['missing chronology',availabilityPayload(),changed(broadPayload(),p=>delete p.last_updated)],
 ['stale chronology',availabilityPayload(),{...broadPayload(),last_updated:new Date(now-37*3600000).toISOString()}],
 ['future chronology',availabilityPayload(),{...broadPayload(),last_updated:new Date(now+1).toISOString()}],
 ['conflicting chronology',availabilityPayload(),{...broadPayload(),last_updated_ts:now/1000-172800}],
 ['wrong week',availabilityPayload(),{...broadPayload(),week:4}],
 ['wrong season',availabilityPayload(),{...broadPayload(),season:2025}],
 ['wrong position',availabilityPayload(),{...broadPayload(),position:'RB'}],
 ['wrong scoring',availabilityPayload(),{...broadPayload(),scoring:'PPR'}],
 ['wrong type',availabilityPayload(),{...broadPayload(),ranking_type_name:'draft'}],
 ['context conflict',availabilityPayload(),{...broadPayload(),year:2025}],
 ['control wrong context',{...availabilityPayload(),week:4},broadPayload()],
 ['unknown filters',availabilityPayload(),{...broadPayload(),filters:{317:true}}],
 ['bad names',availabilityPayload(),{...broadPayload(),expert_name:[]}],
 ['wrong name',availabilityPayload(),{...consensusPayload(),expert_name:{317:'Other'}}],
 ['foreign target name',availabilityPayload(),{...broadPayload(),expert_name:{22:'Justin Boone'}}],
 ['broad conflicting bound name',availabilityPayload(),{...broadPayload(),expert_name:{317:'Justin Boone'}}],
 ['shallow',availabilityPayload(),{...consensusPayload(),players:consensusPayload().players.slice(0,2)}],
 ['unmapped',availabilityPayload(),changed(consensusPayload(),p=>p.players.forEach(r=>{r.player_id=99999;r.player_name='Unknown';}))],
 ['non numeric',availabilityPayload(),changed(consensusPayload(),p=>p.players[0].rank_ecr='bad')],
 ['non collapsed ranks',availabilityPayload(),changed(consensusPayload(),p=>p.players[0].rank_ave=1.5)],
 ['no rows',availabilityPayload(),{...consensusPayload(),players:[]}],
 ['directory conflict',availabilityPayload(),consensusPayload(),'AMBIGUOUS',source([{id:'317',name:'Other'}])],
]){const x=consensusSetup({control,filtered,directory}),r=await x.run();assert.equal(r.outcome,expected,'consensus '+name);assert(x.calls.length<=2);assert.equal(r.strictAccepted,false);assert.equal(r.adapterImplemented,false);assert(!JSON.stringify(r).includes('Other'));consensusCases++;}
const actualFallback=await consensusSetup({filtered:broadPayload()}).run();assert.equal(actualFallback.requests[1].existingStrictRejection,'FILTER_NOT_HONORED');assert.equal(actualFallback.requests[1].sourceRows,67);assert.equal(actualFallback.requests[1].mappedRows,67);
assert.equal(engine.individualPayloadValid(broadPayload(),{season:2026,week:5,position:'QB',expertId:'317',expertName:'Justin Boone',sourceUpdatedAt:now,now}),false);
for(const opts of [{status:401},{status:403},{status:429},{error:true},{bodyState:'INVALID_JSON'}]){const x=consensusSetup(opts),r=await x.run();assert.equal(r.outcome,'AMBIGUOUS');const n=x.calls.length;await x.run();assert.equal(x.calls.length,n);assert(n<=2);consensusCases++;}
const concurrent=consensusSetup();await Promise.all([concurrent.run(),concurrent.run()]);assert.equal(concurrent.calls.length,2);assert.deepEqual(concurrent.calls.map(c=>c.route),['/nfl/2026/consensus-rankings?week=5&position=QB&scoring=HALF&experts=available','/nfl/2026/consensus-rankings?week=5&position=QB&scoring=HALF&filters=317&experts=show']);
const blockedConsensus=consensusSetup();await blockedConsensus.run({blocked:true});assert.equal(blockedConsensus.calls.length,0);
const poisonedConsensus=await consensusSetup({filtered:changed(broadPayload(),p=>{p[secret]=secret;p.expert_name={987654:secret};p.expert_pub={987654:secret};})}).run();assert(!JSON.stringify(poisonedConsensus).includes(secret));assert(!JSON.stringify(poisonedConsensus).includes('987654'));
assert.equal((app.match(/await seasonConsensusFilterResearch\(/g)||[]).length,1);assert(app.slice(app.indexOf('async function runSeasonAcquisitionAudit('),begin).includes('await seasonConsensusFilterResearch'));
console.log('RC4230_CONSENSUS_FILTER_PASS '+consensusCases+' cases; real 67-row fallback; exact/absent/contradiction; two-request budget; secret safety; diagnostic only');

// Exact inverse proof pins every unmodified runtime byte, including all consumers/normal traffic.
for(const file of RUNTIME_FILES){const actual=fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n'),baseline=execFileSync('git',['show','a7f27740d33a7a39127d51515cc2fd8c3d9f28ff:'+file],{encoding:'utf8'});assert.equal(rc4229HistoricalRuntime(file,actual),baseline,file+' exact bounded delta');}
assert.equal((app.match(/await seasonIndividualRankRouteResearch\(/g)||[]).length,1);assert(app.slice(app.indexOf('async function runSeasonAcquisitionAudit('),begin).includes('await seasonIndividualRankRouteResearch'));

// Copy UI executes production handlers; it only copies the last produced acquisition report.
const ids=['seasonDiagnosticStatus','seasonDiagnosticOutput','seasonAcquisitionCopyBtn','seasonAcquisitionAuditBtn'],els=Object.fromEntries(ids.map(id=>[id,{disabled:id==='seasonAcquisitionCopyBtn',select(){this.selected=true;}}]));let acquired=0,auditResult;const copied=[],report={schema:'pitti.season-acquisition-audit.v1',value:'original'};
const box={$:id=>els[id],navigator:{clipboard:{writeText:async text=>copied.push(text)}},runSeasonAcquisitionAudit:async()=>{acquired++;return auditResult?await auditResult():report;}};vm.createContext(box);vm.runInContext(app.slice(app.indexOf('// RC4230 separate copy'),app.indexOf('\n\nif(els.seasonRefreshEvidenceBtn)')),box);
await els.seasonAcquisitionCopyBtn.onclick();assert.equal(copied.length,0);await els.seasonAcquisitionAuditBtn.onclick();assert.equal(els.seasonAcquisitionCopyBtn.disabled,false);els.seasonDiagnosticOutput.value='generic report';await els.seasonAcquisitionCopyBtn.onclick();assert.equal(copied[0],JSON.stringify(report));assert.equal(acquired,1);box.navigator.clipboard.writeText=async()=>{throw Error('clipboard');};await els.seasonAcquisitionCopyBtn.onclick();assert.equal(els.seasonDiagnosticOutput.value,JSON.stringify(report));assert.equal(els.seasonDiagnosticOutput.selected,true);assert.equal(acquired,1);
// A new attempt must invalidate A before its first await, including its textarea fallback.
box.navigator.clipboard.writeText=async text=>copied.push(text);
let rejectB;auditResult=()=>new Promise((resolve,reject)=>{rejectB=reject;});
const pendingB=els.seasonAcquisitionAuditBtn.onclick();assert.equal(els.seasonAcquisitionCopyBtn.disabled,true);assert.equal(els.seasonDiagnosticOutput.value,'');assert.equal(els.seasonDiagnosticOutput.hidden,true);const count=copied.length;await els.seasonAcquisitionCopyBtn.onclick();assert.equal(copied.length,count);
rejectB(Error('audit failure'));await pendingB;const failure=els.seasonDiagnosticStatus.textContent;assert(failure.includes('nicht verfügbar'));await els.seasonAcquisitionCopyBtn.onclick();assert.equal(copied.length,count);assert.equal(els.seasonDiagnosticStatus.textContent,failure);assert.equal(els.seasonAcquisitionCopyBtn.disabled,true);
// Failure with no stored report stays unavailable.
auditResult=async()=>{throw Error('again');};await els.seasonAcquisitionAuditBtn.onclick();await els.seasonAcquisitionCopyBtn.onclick();assert.equal(copied.length,count);assert.equal(els.seasonAcquisitionCopyBtn.disabled,true);
const latest={schema:'pitti.season-acquisition-audit.v1',value:'latest'};auditResult=async()=>latest;await els.seasonAcquisitionAuditBtn.onclick();assert.equal(els.seasonAcquisitionCopyBtn.disabled,false);const acquisitions=acquired;await els.seasonAcquisitionCopyBtn.onclick();await els.seasonAcquisitionCopyBtn.onclick();assert.equal(copied.at(-1),JSON.stringify(latest));assert.equal(copied.at(-2),JSON.stringify(latest));assert.equal(acquired,acquisitions);
// An older clipboard promise cannot overwrite a newer attempt's error/status or restore its textarea.
for(const rejectClipboard of [false,true]){auditResult=async()=>latest;await els.seasonAcquisitionAuditBtn.onclick();let finishCopy;box.navigator.clipboard.writeText=()=>new Promise((resolve,reject)=>{finishCopy=()=>rejectClipboard?reject(Error('clipboard')):resolve();});const pendingCopy=els.seasonAcquisitionCopyBtn.onclick();auditResult=async()=>{throw Error('later failure');};await els.seasonAcquisitionAuditBtn.onclick();const status=els.seasonDiagnosticStatus.textContent;finishCopy();await pendingCopy;assert.equal(els.seasonDiagnosticStatus.textContent,status);assert.equal(els.seasonDiagnosticOutput.value,'');assert.equal(els.seasonAcquisitionCopyBtn.disabled,true);}
auditResult=async()=>({schema:'pitti.season-data-diagnostic.v1'});await els.seasonAcquisitionAuditBtn.onclick();assert.equal(els.seasonAcquisitionCopyBtn.disabled,true);
console.log('RC4230_COPY_SEQUENCE_PASS initial/success/pending/failure/latest/repeated/clipboard-race; no acquisition on copy');
assert(fs.readFileSync('index.html','utf8').includes('id="seasonAcquisitionCopyBtn" class="secondary" type="button" disabled'));
console.log('RC4230_ACQUISITION_CONTRACT_PASS '+cases+' table cases; directory raw-conflict; transport/cardinality/backoff; nested fail-closed; chronology; secrets; exact18-runtime-inverse; copy no request');
