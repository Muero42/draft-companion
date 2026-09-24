import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import evidence from '../weekly-evidence-v2.js';

const app=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');
const start=app.indexOf("const WEEKLY_PROJECTION_POSITIONS=");
const end=app.indexOf('async function fpProxyRequest',start);
const parserStart=app.indexOf('function arrays('),parserEnd=app.indexOf('const DRAFT_POOL_LIMITS',parserStart);
assert(start>=0&&end>start&&parserStart>=0&&parserEnd>parserStart,'selected weekly acquisition production block missing');
const norm=value=>String(value||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
const configured={QB:['Justin Boone','Dalton Del Don','Sean Koerner','Pat Fitzmaurice'],RB:['Justin Boone','Dalton Del Don','Kev Wheeler','Ryan Weisse','Sean Koerner','Pat Fitzmaurice'],WR:['Justin Boone','Dalton Del Don','Sean Koerner','Pat Fitzmaurice'],TE:['Dalton Del Don','Justin Boone','Sean Koerner','Pat Fitzmaurice']};
const counts={QB:20,RB:48,WR:60,TE:20};
const sleeperPlayers={};let nextPlayer=1000;
const rankingRows={};
for(const [position,count] of Object.entries(counts))rankingRows[position]=Array.from({length:count},(_,index)=>{const fpid=nextPlayer++;sleeperPlayers[`sleeper-${fpid}`]={full_name:`${position} Player ${index+1}`,position,team:'AAA',fantasy_data_id:fpid};return{fpid,name:`${position} Player ${index+1}`,position_id:position,rank_ecr:index+1,last_updated:'09/23'}});

function officialDirectoryRows(){
  const byName=new Map();let id=500;
  for(const names of Object.values(configured))for(const name of names)if(!byName.has(norm(name)))byName.set(norm(name),{expert_id:String(++id),expert_name:name,source:'Fixture'});
  return[...byName.values()];
}
function directoryPayload(rows=officialDirectoryRows()){return{experts:rows}}
function harness({directoryResponse={ok:true,status:200,retryAfterMs:null,data:directoryPayload()},selectedResponse}={}){
  const calls=[];let directoryCalls=0;
  const context={
    norm,
    fpProxyRequest:async path=>{
      calls.push(path);const url=new URL(path,'https://fp.invalid');
      if(url.pathname.endsWith('/rankings/experts')){directoryCalls++;return typeof directoryResponse==='function'?directoryResponse({path,url}):directoryResponse;}
      const position=url.searchParams.get('position'),ids=(url.searchParams.get('filters')||'').split(':').filter(Boolean);
      if(selectedResponse)return selectedResponse({path,url,position,ids});
      return{ok:true,status:200,retryAfterMs:null,data:{season:2026,week:3,position_id:position,scoring:'HALF',filters:ids.join(':'),total_experts:ids.length,expert_name:Object.fromEntries(ids.map(id=>[id,`Expert ${id}`])),expert_pub:Object.fromEntries(ids.map(id=>[id,'Fixture'])),last_updated:'09/23',players:rankingRows[position]}};
    },
    Number,String,Array,Object,RegExp,Error,Promise,URL,Map,Set
  };
  context.globalThis=context;vm.createContext(context);
  vm.runInContext(app.slice(start,end)+app.slice(parserStart,parserEnd)+';globalThis.__selectedAcquisition={consensusWeeklyExperts,exactRankingExpertMap,resolveSeasonWeeklyExpertIds,acquireSelectedWeeklyRankPayloads,SEASON_WEEKLY_SELECTED_EXPERTS};',context);
  return{api:context.__selectedAcquisition,calls,get directoryCalls(){return directoryCalls},get selectedCalls(){return calls.filter(path=>path.includes('/consensus-rankings?'))}};
}
function broadIdentityPayloads(){
  const out={};let id=100;
  for(const [position,names] of Object.entries(configured)){const entries=names.map(name=>[String(++id),name]);out[position]={expert_name:Object.fromEntries(entries),expert_pub:Object.fromEntries(entries.map(([expertId])=>[expertId,'Fixture']))};}
  return out;
}
function broadWithoutIdentities(){return Object.fromEntries(Object.keys(configured).map(position=>[position,{season:2026,week:3,position_id:position,scoring:'HALF',last_updated:'09/23',players:rankingRows[position]}]));}

{
  const h=harness(),acquired=await h.api.acquireSelectedWeeklyRankPayloads({season:2026,week:3,directoryPayloads:broadIdentityPayloads()});
  assert.equal(h.directoryCalls,0,'complete broad metadata must remain primary without Ranking Experts fallback');
  assert.equal(h.selectedCalls.length,4,'primary path issues one filtered request per position');
  for(const position of Object.keys(configured)){const row=acquired.selectedRankingPayloads[position];assert.equal(row.providerResponsePresent,true);assert.equal(row.requestedExperts.length,configured[position].length);assert(row.requestProvenance.requestedExpertIds.every(id=>/^\d+$/.test(id)));}
}

{
  const rows=officialDirectoryRows(),byName=new Map(rows.map(row=>[norm(row.expert_name),row.expert_id])),h=harness({directoryResponse:{ok:true,status:200,retryAfterMs:null,data:directoryPayload(rows)},selectedResponse:({position,ids})=>({ok:true,status:200,retryAfterMs:null,data:{season:2026,week:3,position_id:position,scoring:'HALF',filters:ids.join(':'),total_experts:ids.length,expert_name:Object.fromEntries(ids.map(id=>[id,rows.find(row=>row.expert_id===id).expert_name])),expert_pub:Object.fromEntries(ids.map(id=>[id,'Fixture'])),last_updated:'09/23',players:rankingRows[position]}})}),broad=broadWithoutIdentities(),acquired=await h.api.acquireSelectedWeeklyRankPayloads({season:2026,week:3,directoryPayloads:broad});
  assert.equal(h.directoryCalls,1,'missing broad identities must trigger exactly one authenticated directory request per resolution');
  assert.equal(h.selectedCalls.length,4,'fallback must issue exactly one filtered selected request per position');
  assert(h.calls[0]==='/nfl/2026/rankings/experts?include_overall=true','fallback must use the official authenticated Ranking Experts endpoint once without positional duplication');
  for(const position of Object.keys(configured)){const envelope=acquired.selectedRankingPayloads[position],expected=configured[position].map(name=>byName.get(norm(name))).sort((a,b)=>Number(a)-Number(b));assert.equal(JSON.stringify(envelope.requestProvenance.requestedExpertIds),JSON.stringify(expected));}
  const snapshot=evidence.buildSnapshot({season:2026,week:3,scoring:'HALF_PPR',projectionPayloads:{},rankingPayloads:broad,selectedRankingPayloads:acquired.selectedRankingPayloads,sleeperPlayers,verifiedAt:Date.parse('2026-09-23T12:00:00Z')});
  assert.equal(snapshot.lanes.pittiSelectedWeeklyRanks.status,'AVAILABLE','provider-confirmed exact fallback identities must produce usable selected weekly ranks');
  assert(snapshot.records.some(row=>row.metric==='weekly_rank'&&row.sourceId==='fantasypros_pitti_selected_weekly_panel'));
}

const rows=officialDirectoryRows();
for(const [label,response] of [
  ['directory HTTP failure',{ok:false,status:503,retryAfterMs:null,data:{error:'redacted'}}],
  ['directory HTTP 429',{ok:false,status:429,retryAfterMs:0,data:{error:'redacted'}}],
  ['missing numeric IDs',{ok:true,status:200,retryAfterMs:null,data:directoryPayload(rows.map(row=>({...row,expert_id:null})))}],
  ['non-numeric IDs',{ok:true,status:200,retryAfterMs:null,data:directoryPayload(rows.map(row=>({...row,expert_id:`id-${row.expert_id}`})))}],
  ['ambiguous exact name',{ok:true,status:200,retryAfterMs:null,data:directoryPayload([...rows,{...rows[0],expert_id:'999999'}])}]
]){
  const h=harness({directoryResponse:response}),acquired=await h.api.acquireSelectedWeeklyRankPayloads({season:2026,week:3,directoryPayloads:broadWithoutIdentities()});
  assert.equal(h.directoryCalls,1,`${label}: fallback is bounded to one call with no retry loop`);
  if(label==='ambiguous exact name'){
    const ambiguousName=rows[0].expert_name;
    for(const position of Object.keys(configured).filter(position=>configured[position].includes(ambiguousName)))assert(acquired.resolved[position].missing.includes(ambiguousName),`${label}: conflicting numeric IDs must remain unresolved`);
  }else{
    assert.equal(h.selectedCalls.length,0,`${label}: no selected request without exact numeric IDs`);
    assert(Object.values(acquired.resolved).every(row=>row.requested.length===0),`${label}: identities must remain fail-closed`);
  }
  if(label==='directory HTTP 429'){assert.equal(acquired.directoryResults[0].status,'fulfilled');assert.equal(acquired.directoryResults[0].value.status,429);assert.equal(acquired.directoryResults[0].value.retryAfterMs,0);}
}

const productionBlock=app.slice(start,end),refresh=app.slice(app.indexOf('async function refreshSeasonRankings('),app.indexOf('\nfunction startSeasonRankingRefreshScheduler',app.indexOf('async function refreshSeasonRankings(')));
assert(refresh.includes('scoring=HALF&experts=show'),'broad current-week responses must still request provider expert identity metadata');
assert(refresh.indexOf('const rankResponses=')<refresh.indexOf('acquireSelectedWeeklyRankPayloads({season,week,directoryPayloads:rankingPayloads})'),'selected acquisition must derive IDs only after current-week position responses arrive');
assert(productionBlock.includes('/rankings/experts?include_overall=true'),'selected weekly acquisition must use official Ranking Experts identity fallback');
assert(!productionBlock.includes('loadPublicExpertDirectory'),'public HTML directory must not be an identity authority for selected weekly ranks');
assert(!/\b(?:Justin Boone|Dalton Del Don|Sean Koerner|Pat Fitzmaurice|Kev Wheeler|Ryan Weisse)\b[^\n]*\b\d{2,}\b/.test(productionBlock),'selected expert IDs must never be hardcoded');
console.log('SEASON_SELECTED_WEEKLY_ACQUISITION_REGRESSION_PASS');
