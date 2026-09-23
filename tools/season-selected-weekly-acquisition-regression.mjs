import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const app=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');
const start=app.indexOf("const WEEKLY_PROJECTION_POSITIONS=");
const end=app.indexOf('async function fpProxyRequest',start);
assert(start>=0&&end>start,'selected weekly acquisition production block missing');
const calls=[];
const context={
  norm:value=>String(value||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim(),
  fpProxyRequest:async path=>{calls.push(path);const url=new URL(path,'https://fp.invalid'),position=url.searchParams.get('position'),ids=(url.searchParams.get('filters')||'').split(':').filter(Boolean);return{ok:true,status:200,data:{season:2026,week:3,position_id:position,scoring:'HALF',filters:ids.join(':'),total_experts:ids.length,expert_name:Object.fromEntries(ids.map(id=>[id,`Expert ${id}`])),expert_pub:Object.fromEntries(ids.map(id=>[id,'Fixture'])),last_updated:'09/23',players:[]}};},
  Number,String,Array,Object,RegExp,Error,Promise,URL
};
context.globalThis=context;
vm.createContext(context);
vm.runInContext(app.slice(start,end)+';globalThis.__selectedAcquisition={consensusWeeklyExperts,resolveSeasonWeeklyExpertIds,acquireSelectedWeeklyRankPayloads,SEASON_WEEKLY_SELECTED_EXPERTS};',context);
const api=context.__selectedAcquisition,directoryPayloads={};let nextId=100;
for(const position of ['QB','RB','WR','TE']){
  const configured=api.SEASON_WEEKLY_SELECTED_EXPERTS[position],entries=configured.map(name=>[String(++nextId),name]);
  directoryPayloads[position]={expert_name:Object.fromEntries(entries),expert_pub:Object.fromEntries(entries.map(([id])=>[id,'Fixture']))};
}
const acquired=await api.acquireSelectedWeeklyRankPayloads({season:2026,week:3,directoryPayloads});
assert.equal(calls.length,4,'one filtered selected-panel request is allowed per position');
assert(calls.every(path=>path.includes('/consensus-rankings?')&&path.includes('week=3')&&path.includes('scoring=HALF')&&path.includes('experts=show')&&path.includes('filters=')));
assert(calls.every(path=>!path.includes('/rankings/experts')),'undocumented rankings/experts directory must not gate the selected panel');
for(const position of ['QB','RB','WR','TE']){
  const row=acquired.selectedRankingPayloads[position];
  assert.equal(row.providerResponsePresent,true);
  assert.equal(row.requestedExperts.length,api.SEASON_WEEKLY_SELECTED_EXPERTS[position].length);
  assert.equal(JSON.stringify([...row.requestProvenance.requestedExpertIds].sort((a,b)=>Number(a)-Number(b))),JSON.stringify(row.requestProvenance.requestedExpertIds));
}
const missing=structuredClone(directoryPayloads);delete missing.QB.expert_name;delete missing.QB.expert_pub;calls.length=0;
const failClosed=await api.acquireSelectedWeeklyRankPayloads({season:2026,week:3,directoryPayloads:missing});
assert.equal(failClosed.selectedRankingPayloads.QB.providerResponsePresent,false,'missing current expert identity must not issue or fabricate a selected-panel request');
assert.equal(JSON.stringify(failClosed.selectedRankingPayloads.QB.requestedExperts),'[]');
assert.equal(calls.length,3,'healthy positions remain isolated from one missing expert-directory payload');

const refresh=app.slice(app.indexOf('async function refreshSeasonRankings('),app.indexOf('\nfunction startSeasonRankingRefreshScheduler',app.indexOf('async function refreshSeasonRankings(')));
assert(refresh.includes('scoring=HALF&experts=show'),'broad current-week responses must request provider expert identity metadata');
assert(refresh.indexOf('const rankResponses=')<refresh.indexOf('acquireSelectedWeeklyRankPayloads({season,week,directoryPayloads:rankingPayloads})'),'selected acquisition must derive IDs only after current-week position responses arrive');
assert(!app.slice(start,end).includes('/rankings/experts'),'selected weekly acquisition must not depend on the unavailable directory endpoint');

console.log('SEASON_SELECTED_WEEKLY_ACQUISITION_REGRESSION_PASS');
