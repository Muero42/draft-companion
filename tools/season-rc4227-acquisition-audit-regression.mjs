import {rc4229HistoricalRuntime} from './rc4230-diagnostic-baseline.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import * as decision from '../season-decision-engine-v1.mjs';
import evidence from '../weekly-evidence-v2.js';

const app=rc4229HistoricalRuntime('app.js',fs.readFileSync('app.js','utf8').replace(/\r\n/g,'\n')),now=Date.parse('2026-10-04T08:00:00Z'),secret='SECRET_SENTINEL_NEVER_EXPORT';
const norm=s=>String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
const source={schema:'pitti.season-decision-sources.v1',season:2026,week:4,verifiedAt:now,directories:{}},players={};
const fpId=(position,i)=>1000+['QB','RB','WR','TE','K','DST'].indexOf(position)*100+i;
let id=100;
for(const position of decision.POSITIONS)source.directories[position]={season:2026,week:4,position,verifiedAt:now,experts:decision.CORE[position].map(name=>({id:String(++id),name,sourceUpdatedAt:now-3600000}))};
const singleton=(position,expert)=>({season:2026,week:4,position_id:position,scoring:'HALF',ranking_type_name:'weekly',filters:expert.id,total_experts:1,expert_name:{[expert.id]:expert.name},players:Array.from({length:decision.POLICY.depth[position]},(_,i)=>({fpid:fpId(position,i),name:`${position} ${i}`,position_id:position,team_id:'BUF',rank_ecr:i+1,rank_min:i+1,rank_max:i+1,rank_ave:i+1}))});
for(const position of [...decision.POSITIONS,'K','DST'])for(let i=0;i<(evidence.MIN_COUNTS[position]);i++)players[position+i]={full_name:`${position} ${i}`,position:position==='DST'?'DEF':position,team:'BUF',fantasy_data_id:fpId(position,i)};
const context=()=>{
  const calls=[],box={Date:class extends Date{static now(){return now}},PittiSeasonDecisionV1:decision,PittiWeeklyEvidenceV2:evidence,APP_VERSION:'local-diagnostic-candidate',SEASON_WEEKLY_SELECTED_EXPERTS:decision.CORE,WEEKLY_PROJECTION_POSITIONS:decision.POSITIONS,SEASON_PROJECTION_POSITIONS:[...decision.POSITIONS,'K','DST'],WEEKLY_PROJECTION_MIN_COUNTS:decision.POLICY.depth,normalizedExpertName:norm,els:{apiKey:{value:secret},season:{value:'2026'}},lastDraftContext:{players},seasonUiYield:async()=>{},currentSleeperNflWeek:async()=>4,jf:async()=>source,diagnosticRetryAfter:x=>x==null?null:x/1000};
  box.fpProxyRequest=async(path,options)=>{calls.push({path,options});const q=new URL(path,'https://fixture.invalid').searchParams,position=q.get('position');if(path.includes('consensus-rankings'))return{ok:true,status:200,bodyState:'JSON',data:singleton(position,source.directories[position].experts[0])};return{ok:true,status:200,bodyState:'JSON',data:{season:2026,week:4,updated:'10/04',players:Array.from({length:evidence.MIN_COUNTS[position]},(_,i)=>({fpid:fpId(position,i),name:`${position} ${i}`,position_id:position,team_id:'BUF',stats:{points_half:10}}))}};};
  vm.createContext(box);
  vm.runInContext(app.slice(app.indexOf('function weeklyProjectionMetadata('),app.indexOf('function weeklyProjectionFailure('))+app.slice(app.indexOf('// Bounded RC4.227 diagnosis only:'),app.indexOf('function slugifyExpert(')),box);
  return{box,calls};
};

const expert=source.directories.WR.experts[0],base=singleton('WR',expert),options={season:2026,week:4,position:'WR',expertId:expert.id,expertName:expert.name,sourceUpdatedAt:expert.sourceUpdatedAt,now};
assert.equal(decision.individualPayloadReason(base,options),null);
for(const [patch,reason]of [[{season:2025},'WRONG_SEASON'],[{week:3},'WRONG_WEEK'],[{position_id:'TE'},'WRONG_POSITION'],[{scoring:'HALF_PPR'},'WRONG_SCORING'],[{ranking_type_name:'ros'},'WRONG_RANKING_TYPE'],[{expert_name:{999:'Other'}},'EXPERT_IDENTITY_MISMATCH'],[{total_experts:2},'TOTAL_EXPERTS_NOT_ONE'],[{filters:'999'},'FILTER_NOT_HONORED'],[{players:null},'MISSING_PLAYERS'],[{players:base.players.slice(0,3)},'INSUFFICIENT_DEPTH'],[{players:base.players.map((r,i)=>i? r:{...r,rank_ave:1.5})},'UNVERIFIED_RANK_VALUE']]){assert.equal(decision.individualPayloadReason({...base,...patch},options),reason);assert.equal(decision.individualPayloadValid({...base,...patch},options),false);}
assert.equal(decision.individualPayloadReason(base,{...options,sourceUpdatedAt:now-73*3600000}),'STALE_SOURCE');
assert.equal(decision.individualPayloadReason({...base,players:base.players.map((r,i)=>i?r:null)},options),'UNVERIFIED_RANK_VALUE');
const a=context(),[audit,shared]=await Promise.all([a.box.runSeasonAcquisitionAudit(),a.box.runSeasonAcquisitionAudit()]);
assert.strictEqual(audit,shared);assert.equal(a.calls.length,10,'four shape probes and six primary projections; unresolved representative is not guessed');
assert(a.calls.every(c=>c.options.preserveMalformed===true));
for(const p of decision.POSITIONS){const row=audit.expertAcquisition.byPosition[p];assert.equal(row.activeResolved,decision.CORE[p].length);assert.equal(row.requests[0].result,'STRICT_SHAPE_ACCEPTED_NOT_SNAPSHOT');assert.equal(row.requests[0].mappedRows,decision.POLICY.depth[p]);}
for(const p of [...decision.POSITIONS,'K','DST']){const row=audit.projectionAcquisition.byPosition[p];assert.equal(row.responseClassification,'SUFFICIENT');assert.equal(row.mappedRows,evidence.MIN_COUNTS[p]);}
assert.equal(audit.individualRankRouteResearch.reason,'DIRECTORY_ID_UNRESOLVED');
assert(!JSON.stringify(audit).includes(secret));assert(!JSON.stringify(audit).includes('rawPayload'));
assert.equal((await a.box.runSeasonAcquisitionAudit()).status,'BACKOFF');assert.equal(a.calls.length,10,'repeated manual audit cannot create a request storm');
const name=a.box.seasonMissingExpertDiagnostic('Justin Boone');assert.equal(name.name,'Justin Boone');assert.equal(name.id,null);assert.equal(name.reason,'DIRECTORY_ID_UNRESOLVED');
assert.equal(a.box.seasonMissingExpertDiagnostic({id:'317',name:'Justin Boone',reason:'INDIVIDUAL_RESPONSE_NOT_VERIFIED'}).reason,'INDIVIDUAL_RESPONSE_NOT_VERIFIED');
const ambiguity=structuredClone(source);ambiguity.directories.WR.experts.push({...expert,id:'999'});assert(!a.box.seasonAcquisitionDirectory(ambiguity,'WR',{season:2026,week:4,now}).some(e=>e.name===expert.name));
const alias=structuredClone(source);alias.directories.WR.experts.push({...expert,name:'Other Name'});assert(!a.box.seasonAcquisitionDirectory(alias,'WR',{season:2026,week:4,now}).some(e=>e.id===expert.id));
const stale=structuredClone(source);stale.directories.WR.verifiedAt=now-3600001;assert.equal(a.box.seasonAcquisitionDirectory(stale,'WR',{season:2026,week:4,now}).length,0);
for(const status of [401,403,429]){const b=context();b.box.fpProxyRequest=async path=>{b.calls.push(path);return{ok:false,status,retryAfterMs:7200000,bodyState:'JSON',data:{error:secret}};};const r=await b.box.runSeasonAcquisitionAudit();assert.equal(b.calls.length,status===429?1:2,'hard failure stops its lane; 429 stops all lanes');assert.equal(r.expertAcquisition.byPosition.QB.requests[0].rejectionReason,`HTTP_${status}`);assert(!JSON.stringify(r).includes(secret));const retry=await b.box.runSeasonAcquisitionAudit();assert.equal(retry.status,'BACKOFF');assert.equal(b.calls.length,status===429?1:2);}
const missing=context();missing.box.els.apiKey.value='';assert.equal((await missing.box.runSeasonAcquisitionAudit()).status,'NO_CREDENTIAL');assert.equal(missing.calls.length,0);
const malformed=context();malformed.box.fpProxyRequest=async()=>({ok:true,status:200,bodyState:'INVALID_JSON',data:null});assert.equal((await malformed.box.runSeasonAcquisitionAudit()).expertAcquisition.byPosition.QB.requests[0].rejectionReason,'MALFORMED_PAYLOAD');
assert(app.includes('missingExperts:(x.missingExperts||[]).map(seasonMissingExpertDiagnostic)'));
console.log('RC4227_ACQUISITION_AUDIT_PASS strict rejection reasons, exact directory ambiguity, ten bounded serial probes, shared flight, six-position mapping, secret-safe output, hard-stop/backoff, missing credential, missing expert serialization');
