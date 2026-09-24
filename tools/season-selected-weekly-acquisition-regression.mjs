import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import evidence from '../weekly-evidence-v2.js';

const app=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');
const start=app.indexOf("const WEEKLY_PROJECTION_POSITIONS=");
const end=app.indexOf('async function fpProxyRequest',start);
assert(start>=0&&end>start,'selected weekly acquisition production block missing');
const norm=value=>String(value||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
const configured={QB:['Justin Boone','Dalton Del Don','Sean Koerner','Pat Fitzmaurice'],RB:['Justin Boone','Dalton Del Don','Kev Wheeler','Ryan Weisse','Sean Koerner','Pat Fitzmaurice'],WR:['Justin Boone','Dalton Del Don','Sean Koerner','Pat Fitzmaurice'],TE:['Dalton Del Don','Justin Boone','Sean Koerner','Pat Fitzmaurice']};
const counts={QB:20,RB:48,WR:60,TE:20};
const sleeperPlayers={};let nextPlayer=1000;
const rankingRows={};
for(const [position,count] of Object.entries(counts))rankingRows[position]=Array.from({length:count},(_,index)=>{const fpid=nextPlayer++;sleeperPlayers[`sleeper-${fpid}`]={full_name:`${position} Player ${index+1}`,position,team:'AAA',fantasy_data_id:fpid};return{fpid,name:`${position} Player ${index+1}`,position_id:position,rank_ecr:index+1,last_updated:'09/23'}});

function harness({publicRows=[],selectedResponse}={}){
  const calls=[];let directoryCalls=0;
  const context={
    norm,
    loadPublicExpertDirectory:async()=>{directoryCalls++;return publicRows},
    fpProxyRequest:async path=>{calls.push(path);const url=new URL(path,'https://fp.invalid'),position=url.searchParams.get('position'),ids=(url.searchParams.get('filters')||'').split(':').filter(Boolean);if(selectedResponse)return selectedResponse({path,url,position,ids});return{ok:true,status:200,retryAfterMs:null,data:{season:2026,week:3,position_id:position,scoring:'HALF',filters:ids.join(':'),total_experts:ids.length,expert_name:Object.fromEntries(ids.map(id=>[id,`Expert ${id}`])),expert_pub:Object.fromEntries(ids.map(id=>[id,'Fixture'])),last_updated:'09/23',players:rankingRows[position]}};},
    Number,String,Array,Object,RegExp,Error,Promise,URL,Map,Set
  };
  context.globalThis=context;vm.createContext(context);
  vm.runInContext(app.slice(start,end)+';globalThis.__selectedAcquisition={consensusWeeklyExperts,exactPublicDirectoryExpertMap,resolveSeasonWeeklyExpertIds,acquireSelectedWeeklyRankPayloads,SEASON_WEEKLY_SELECTED_EXPERTS};',context);
  return{api:context.__selectedAcquisition,calls,get directoryCalls(){return directoryCalls}};
}
function broadIdentityPayloads(){
  const out={};let id=100;
  for(const [position,names] of Object.entries(configured)){const entries=names.map(name=>[String(++id),name]);out[position]={expert_name:Object.fromEntries(entries),expert_pub:Object.fromEntries(entries.map(([expertId])=>[expertId,'Fixture']))};}
  return out;
}
function publicDirectoryRows(){
  const byName=new Map();let id=500;
  for(const names of Object.values(configured))for(const name of names)if(!byName.has(norm(name)))byName.set(norm(name),{name,site:'Fixture',apiId:String(++id)});
  return[...byName.values()];
}

{
  const h=harness({publicRows:publicDirectoryRows()}),acquired=await h.api.acquireSelectedWeeklyRankPayloads({season:2026,week:3,directoryPayloads:broadIdentityPayloads()});
  assert.equal(h.directoryCalls,0,'complete broad metadata must remain the primary identity path without directory fallback');
  assert.equal(h.calls.length,4,'primary path issues one filtered request per position');
  for(const position of Object.keys(configured)){const row=acquired.selectedRankingPayloads[position];assert.equal(row.providerResponsePresent,true);assert.equal(row.requestedExperts.length,configured[position].length);assert(row.requestProvenance.requestedExpertIds.every(id=>/^\d+$/.test(id)));}
}

{
  const rows=publicDirectoryRows(),byName=new Map(rows.map(row=>[norm(row.name),row.apiId])),h=harness({publicRows:rows,selectedResponse:({position,ids})=>({ok:true,status:200,retryAfterMs:null,data:{season:2026,week:3,position_id:position,scoring:'HALF',filters:ids.join(':'),total_experts:ids.length,expert_name:Object.fromEntries(ids.map(id=>[id,rows.find(row=>row.apiId===id).name])),expert_pub:Object.fromEntries(ids.map(id=>[id,'Fixture'])),last_updated:'09/23',players:rankingRows[position]}})}),broad=Object.fromEntries(Object.keys(configured).map(position=>[position,{season:2026,week:3,position_id:position,scoring:'HALF',last_updated:'09/23',players:rankingRows[position]}])),acquired=await h.api.acquireSelectedWeeklyRankPayloads({season:2026,week:3,directoryPayloads:broad});
  assert.equal(h.directoryCalls,1,'missing broad identities must trigger exactly one public-directory request for the whole resolution');
  assert.equal(h.calls.length,4,'fallback must issue exactly one filtered selected request per position');
  for(const position of Object.keys(configured)){const envelope=acquired.selectedRankingPayloads[position],expected=configured[position].map(name=>byName.get(norm(name))).sort((a,b)=>Number(a)-Number(b));assert.equal(JSON.stringify(envelope.requestProvenance.requestedExpertIds),JSON.stringify(expected));}
  const snapshot=evidence.buildSnapshot({season:2026,week:3,scoring:'HALF_PPR',projectionPayloads:{},rankingPayloads:broad,selectedRankingPayloads:acquired.selectedRankingPayloads,sleeperPlayers,verifiedAt:Date.parse('2026-09-23T12:00:00Z')});
  assert.equal(snapshot.lanes.pittiSelectedWeeklyRanks.status,'AVAILABLE','provider-confirmed exact fallback identities must produce usable selected weekly ranks');
  assert(snapshot.records.some(row=>row.metric==='weekly_rank'&&row.sourceId==='fantasypros_pitti_selected_weekly_panel'));
}

for(const [label,publicRows] of [
  ['directory failure',[]],
  ['missing apiId',publicDirectoryRows().map(row=>({...row,apiId:null}))],
  ['ambiguous id',[...publicDirectoryRows(),{...publicDirectoryRows()[0],apiId:'999999'}]]
]){
  const h=harness({publicRows}),broad=Object.fromEntries(Object.keys(configured).map(position=>[position,{players:rankingRows[position]}])),acquired=await h.api.acquireSelectedWeeklyRankPayloads({season:2026,week:3,directoryPayloads:broad});
  assert.equal(h.directoryCalls,1,`${label}: fallback is bounded to one call`);
  if(label==='ambiguous id'){
    const ambiguousName=publicDirectoryRows()[0].name;
    for(const position of Object.keys(configured).filter(position=>configured[position].includes(ambiguousName)))assert(acquired.resolved[position].missing.includes(ambiguousName),`${label}: conflicting numeric IDs must remain unresolved`);
  }else{
    assert.equal(h.calls.length,0,`${label}: no selected request without exact numeric IDs`);
    assert(Object.values(acquired.resolved).every(row=>row.requested.length===0),`${label}: identities must remain fail-closed`);
  }
}

const refresh=app.slice(app.indexOf('async function refreshSeasonRankings('),app.indexOf('\nfunction startSeasonRankingRefreshScheduler',app.indexOf('async function refreshSeasonRankings(')));
assert(refresh.includes('scoring=HALF&experts=show'),'broad current-week responses must still request provider expert identity metadata');
assert(refresh.indexOf('const rankResponses=')<refresh.indexOf('acquireSelectedWeeklyRankPayloads({season,week,directoryPayloads:rankingPayloads})'),'selected acquisition must derive IDs only after current-week position responses arrive');
assert(!app.slice(start,end).includes('/rankings/experts'),'selected weekly acquisition must not depend on the unavailable rankings/experts endpoint');
console.log('SEASON_SELECTED_WEEKLY_ACQUISITION_REGRESSION_PASS');
