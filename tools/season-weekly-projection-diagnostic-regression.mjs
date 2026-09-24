import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import evidence from '../weekly-evidence-v2.js';
import gameContext from '../game-context-v1.js';

const app=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');
const start=app.indexOf('const FP_DIAGNOSTIC_TIMEOUT_MS=');
const end=app.indexOf('function slugifyExpert',start);
assert(start>=0&&end>start,'weekly projection diagnostic production block missing');
const parserStart=app.indexOf('function arrays('),parserEnd=app.indexOf('const DRAFT_POOL_LIMITS',parserStart);
assert(parserStart>=0&&parserEnd>parserStart,'shared expert parser production block missing');
const source=app.slice(start,end)+app.slice(parserStart,parserEnd)+`;globalThis.__weeklyDiagnostic={fpProxyRequest,proxyCall,deriveSleeperNflWeek,summarizeWeeklyProjectionPayload,weeklyProjectionFailure,runAuthenticatedWeeklyProjectionDiagnostic,formatAuthenticatedWeeklyProjectionDiagnostic,runCurrentWeekRankDiagnostic,runSelectedPittiPanelDiagnostic,weeklyEvidencePersistenceDiagnostic,startSitCompletionDiagnostic,runCanonicalGameContextDiagnostic,runPhysicalEvidenceLaneDiagnostic,formatPhysicalEvidenceLaneDiagnostic};`;
const secretSentinel='SENSITIVE_SENTINEL_DO_NOT_RENDER';
const fixedNow=Date.parse('2026-09-19T12:00:00Z');
class FixedDate extends Date{
  constructor(...args){super(...(args.length?args:[fixedNow]))}
  static now(){return fixedNow}
}
const response=(status,data,raw=null,headers={})=>({ok:status>=200&&status<300,status,headers:{get:name=>headers[String(name).toLowerCase()]??null},async text(){return raw??JSON.stringify(data)},async json(){if(raw!=null)return JSON.parse(raw);return data}});
const projectedRows=(position,count,{missingPoints=0,missingIds=0}={})=>Array.from({length:count},(_,i)=>({
  ...(i<missingIds?{}:{fpid:1000+i}),name:`${position} Player ${i+1}`,position_id:position,
  stats:i<missingPoints?{points:99}:{points:99,points_half:20-i/10}
}));
function runtime({fetchImpl,jfImpl,season='2026',lastDraftContext=null,storageSnapshot=null,lineupStartSitV2=null,weeklyValueMap=()=>({values:{},gameValid:false}),liveAuthority=()=>false}={}){
  const storageMap=new Map();
  if(storageSnapshot)storageMap.set(evidence.CACHE_KEY,JSON.stringify(storageSnapshot));
  const localStorage={get length(){return storageMap.size},key:index=>[...storageMap.keys()][index]??null,getItem:key=>storageMap.get(key)??null,setItem:(key,value)=>storageMap.set(key,String(value)),removeItem:key=>storageMap.delete(key)};
  const store={get:(key,fallback)=>{try{const value=localStorage.getItem(key);return value==null?fallback:JSON.parse(value)}catch{return fallback}}};
  const context={
    AbortController,setTimeout,clearTimeout,Date:FixedDate,Math,Number,String,Array,Object,RegExp,Error,norm:value=>String(value||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim(),
    fetch:fetchImpl||(()=>{throw new Error('unexpected fetch')}),
    jf:jfImpl||(()=>Promise.resolve({season,season_type:'regular',week:7})),
    S:'https://api.sleeper.app/v1',APP_VERSION:'v11.8.0-rc4.209',PittiWeeklyEvidenceV2:evidence,PittiGameContextV1:gameContext,PittiLineupStartSitV2:lineupStartSitV2,lastDraftContext,localStorage,store,seasonWeeklyEvidenceValueMap:weeklyValueMap,seasonLiveAuthority:liveAuthority,els:{apiKey:{value:secretSentinel},season:{value:String(season)}}
  };
  vm.runInNewContext(source,context);
  return context.__weeklyDiagnostic;
}

{
  const counts={QB:24,RB:60,WR:70,TE:24},players={'roster-qb':{full_name:'Roster Quarterback',position:'QB',team:'AAA',fantasy_data_id:999999}},seasonState={my_roster:{players:['roster-qb'],reserve:[],taxi:[]}};
  const api=runtime({lastDraftContext:{players,season:seasonState},jfImpl:async()=>({season:'2026',season_type:'regular',week:7}),fetchImpl:async url=>{const path=decodeURIComponent(new URL(url,'https://local.invalid').searchParams.get('path')),position=new URL(path,'https://fp.invalid').searchParams.get('position');return response(200,{season:2026,week:7,positions:position,players:projectedRows(position,counts[position]),updated:'2026-09-10'})}});
  const report=await api.runAuthenticatedWeeklyProjectionDiagnostic();
  assert.equal(report.classification,'SUFFICIENT','provider access may be fully sufficient');
  assert.equal(report.consumer.validation.ok,false,'same-path consumer must expose downstream mapping failure');
  assert(report.consumer.positions.every(row=>row.sourceRows===counts[row.position]&&row.consumerUsableRecords===0&&row.rejectReasonCounts.NO_MATCH===counts[row.position]));
  assert.equal(JSON.stringify(report.consumer.roster.unusable.map(player=>[player.name,player.id])),JSON.stringify([['Roster Quarterback','roster-qb']]),'roster diagnostic must identify exact unusable active skill player');
  assert.match(api.formatAuthenticatedWeeklyProjectionDiagnostic(report).join('\n'),/AUTHENTICATED PROJECTION ACCESS = SUFFICIENT[\s\S]*END-TO-END CONSUMER = UNAVAILABLE/);
}

{
  // Production-shaped rc4.201 response: HTTP 200 with current scope, fpid and
  // stats.points_half coverage, but no optional top-level `positions` echo.
  const counts={QB:24,RB:60,WR:70,TE:24},players={};let id=1000;
  for(const [position,count] of Object.entries(counts))for(let i=0;i<count;i++,id++)players[`sleeper-${id}`]={full_name:`${position} Player ${i+1}`,position,team:'AAA',fantasy_data_id:id};
  const seasonState={my_roster:{players:['sleeper-1000'],reserve:[],taxi:[]}};
  const api=runtime({lastDraftContext:{players,season:seasonState},jfImpl:async()=>({season:'2026',season_type:'regular',week:7}),fetchImpl:async url=>{
    const path=decodeURIComponent(new URL(url,'https://local.invalid').searchParams.get('path')),position=new URL(path,'https://fp.invalid').searchParams.get('position');
    const offset=Object.entries(counts).slice(0,Object.keys(counts).indexOf(position)).reduce((sum,[,count])=>sum+count,0);
    return response(200,{season:2026,week:7,updated:'09/14',players:projectedRows(position,counts[position]).map((row,i)=>({...row,fpid:1000+offset+i}))});
  }});
  const report=await api.runAuthenticatedWeeklyProjectionDiagnostic();
  assert.equal(report.classification,'SUFFICIENT');
  assert.deepEqual(report.consumer.validation,{ok:true});
  assert.equal(report.consumer.roster.usableCount,1);
  assert(report.consumer.positions.every(row=>row.consumerUsableRecords===counts[row.position]&&row.finalLaneStatus==='AVAILABLE'));
  const formatted=api.formatAuthenticatedWeeklyProjectionDiagnostic(report).join('\n');
  assert.match(formatted,/source-time=DATE:2026-09-14/);
  assert.match(formatted,/END-TO-END CONSUMER = USABLE/);
}

{
  let capturedUrl='',capturedOptions=null,logCount=0;
  const api=runtime({fetchImpl:async(url,options)=>{capturedUrl=url;capturedOptions=options;return response(200,{ok:true})}});
  const oldLog=console.log;console.log=()=>{logCount++};
  try{const result=await api.fpProxyRequest('/nfl/2026/projections?week=7&position=QB');assert.equal(result.status,200)}finally{console.log=oldLog}
  assert.equal(capturedOptions.headers['x-fp-key'],secretSentinel,'existing x-fp-key credential header must be used');
  assert(!capturedUrl.includes(secretSentinel),'credential must never enter URL/query string');
  assert.equal(logCount,0,'credential request must not log');
}

{
  const api=runtime({fetchImpl:async()=>response(200,null,'{not valid json')});
  const result=await api.fpProxyRequest('/nfl/2026/projections?week=7&position=QB',{preserveMalformed:true});
  assert.equal(result.ok,true,'HTTP success remains a fulfilled current response');
  assert.equal(result.data,null,'invalid JSON must not fabricate provider fields');
  assert.equal(result.bodyState,'INVALID_JSON','collector must preserve malformed HTTP-success provenance');
}

{
  const paths=[];
  const api=runtime({
    jfImpl:async url=>{assert.match(url,/\/state\/nfl\?/);return{season:'2026',season_type:'regular',week:7}},
    fetchImpl:async url=>{const path=decodeURIComponent(new URL(url,'https://local.invalid').searchParams.get('path'));paths.push(path);const pos=new URL(path,'https://fp.invalid').searchParams.get('position');return response(200,{season:2026,week:7,count:WEEK_COUNTS[pos],players:projectedRows(pos,WEEK_COUNTS[pos]),updated:'2026-09-10'})}
  });
  const WEEK_COUNTS={QB:24,RB:60,WR:70,TE:24};
  const report=await api.runAuthenticatedWeeklyProjectionDiagnostic();
  assert.equal(report.classification,'SUFFICIENT');
  assert.deepEqual(paths.map(path=>new URL(path,'https://fp.invalid').searchParams.get('position')),['QB','RB','WR','TE']);
  assert(paths.every(path=>path.includes('week=7')&&!path.includes('week=1')),'week must come from current Sleeper NFL state, never a hardcoded Week 1');
  assert(paths.every(path=>{const params=new URL(path,'https://fp.invalid').searchParams;return !params.has('scoring')&&!params.has('ros')}),'authenticated weekly projection requests must omit both scoring and ros');
  const text=api.formatAuthenticatedWeeklyProjectionDiagnostic(report).join('\n');
  assert.match(text,/>10=yes/);assert.match(text,/numeric stats\.points_half=/);assert.match(text,/updated=2026-09-10/);
  assert.match(text,/query=week\+position · ros=omitted/);assert(!text.includes('ros=false'),'diagnostic output must describe the omitted-ROS query truthfully');
  assert(!text.includes(secretSentinel),'API key must never be rendered in diagnostic output');
}

{
  const api=runtime(),base={season:2026,week:7,status:200};
  const partial=api.summarizeWeeklyProjectionPayload({season:2026,week:7,players:projectedRows('QB',24,{missingPoints:3,missingIds:2})},{...base,position:'QB'});
  assert.equal(partial.pointsHalfCount,21,'missing points_half must be counted as missing, not coerced to zero');
  assert.equal(partial.identityCount,22,'missing FantasyPros identity must be counted, not fabricated');
  assert.equal(partial.result,'PARTIAL');
  const wrongSeason=api.summarizeWeeklyProjectionPayload({season:2025,week:7,players:projectedRows('QB',24)},{...base,position:'QB'});
  const wrongWeek=api.summarizeWeeklyProjectionPayload({season:2026,week:6,players:projectedRows('QB',24)},{...base,position:'QB'});
  const rosRanking=api.summarizeWeeklyProjectionPayload({season:2026,week:7,ranking_type:'ros',rankings:{HALF:{}},players:projectedRows('QB',24)},{...base,position:'QB'});
  const draftRanking=api.summarizeWeeklyProjectionPayload({season:2026,week:7,ranking_type:'draft',players:projectedRows('QB',24)},{...base,position:'QB'});
  assert.equal(wrongSeason.reason,'WRONG_SEASON');assert.equal(wrongWeek.reason,'WRONG_WEEK');
  assert.equal(rosRanking.reason,'NON_WEEKLY_PROJECTION_PAYLOAD');assert.equal(draftRanking.reason,'NON_WEEKLY_PROJECTION_PAYLOAD');
  const wrongField=api.summarizeWeeklyProjectionPayload({season:2026,week:7,players:projectedRows('QB',24,{missingPoints:24})},{...base,position:'QB'});
  assert.equal(wrongField.pointsHalfCount,0,'generic points must never substitute for stats.points_half');
}

for(const [status,reason] of [[401,'HTTP_401'],[403,'HTTP_403'],[404,'HTTP_404'],[429,'HTTP_429'],[503,'HTTP_5XX']]){
  const api=runtime({fetchImpl:async()=>response(status,{error:'redacted'})});
  const report=await api.runAuthenticatedWeeklyProjectionDiagnostic();
  assert(report.rows.every(row=>row.reason===reason),`HTTP ${status} must remain explicit`);
  assert.equal(report.classification,'INSUFFICIENT');
}

{
  const api=runtime({fetchImpl:async()=>response(200,null,'not json')});
  await assert.rejects(api.fpProxyRequest('/nfl/2026/projections?week=7&position=QB'),error=>error.code==='MALFORMED_PAYLOAD');
  assert.equal((await api.proxyCall('/legacy-diagnostic')).raw,'not json','existing proxyCall malformed-200 behavior must remain intact');
  const report=await api.runAuthenticatedWeeklyProjectionDiagnostic();
  assert(report.rows.every(row=>row.reason==='MALFORMED_PAYLOAD'),'malformed payload must remain distinguishable');
}
{
  const api=runtime({fetchImpl:async()=>response(429,null,'',{ 'retry-after':'120' })});
  await assert.rejects(api.fpProxyRequest('/nfl/2026/projections?week=7&position=WR'),error=>error.code==='MALFORMED_PAYLOAD'&&error.status===429&&error.retryAfterMs===120_000,'empty/non-JSON 429 must retain status and Retry-After metadata for settled-result persistence');
}
{
  const api=runtime({fetchImpl:(url,options)=>new Promise((resolve,reject)=>options.signal.addEventListener('abort',()=>{const error=new Error('aborted');error.name='AbortError';reject(error)}))});
  await assert.rejects(api.fpProxyRequest('/nfl/2026/projections?week=7&position=QB',{timeoutMs:5}),error=>error.code==='TIMEOUT');
}
{
  const api=runtime();
  assert.throws(()=>api.deriveSleeperNflWeek({season:'2025',season_type:'regular',week:7},2026),error=>error.code==='SLEEPER_SEASON_MISMATCH');
  assert.throws(()=>api.deriveSleeperNflWeek({season:'2026',season_type:'pre',week:0},2026),error=>error.code==='SLEEPER_NOT_REGULAR_SEASON');
}
{
  const api=runtime({fetchImpl:async()=>response(502,{error:'sanitized',failureType:'UPSTREAM_HTTP_ERROR',upstreamStatus:403})}),game=await api.runCanonicalGameContextDiagnostic({season:2026,week:2});
  assert.equal(game.httpStatus,502);assert.equal(game.upstreamStatus,403);assert.equal(game.failureType,'UPSTREAM_HTTP_ERROR');assert.equal(game.status,'UNAVAILABLE');assert.equal(game.validation,'INCOMPLETE_WEEK');
}

{
  const counts={QB:24,RB:60,WR:70,TE:24},players={};let next=1000;
  for(const [position,count] of Object.entries(counts))for(let i=0;i<count;i++,next++)players[`sleeper-${next}`]={full_name:`${position} Player ${i+1}`,position,team:'AAA',fantasy_data_id:next};
  const selectedNames={QB:['Justin Boone','Dalton Del Don','Sean Koerner','Pat Fitzmaurice'],RB:['Justin Boone','Dalton Del Don','Kev Wheeler','Ryan Weisse','Sean Koerner','Pat Fitzmaurice'],WR:['Justin Boone','Dalton Del Don','Sean Koerner','Pat Fitzmaurice'],TE:['Dalton Del Don','Justin Boone','Sean Koerner','Pat Fitzmaurice']};
  const directoryRows=[];let nextExpert=100;for(const name of [...new Set(Object.values(selectedNames).flat())])directoryRows.push({expert_name:name,source:'Fixture',expert_id:String(++nextExpert)});const idToName=Object.fromEntries(directoryRows.map(row=>[row.expert_id,row.expert_name]));let directoryCalls=0;
  const seasonState={my_roster:{players:['sleeper-1000','sleeper-1024'],reserve:[],taxi:[]}},gamePairs=[['AAA','BBB'],['CCC','DDD'],['EEE','FFF'],['GGG','HHH'],['III','JJJ'],['KKK','LLL'],['MMM','NNN'],['OOO','PPP'],['QQQ','RRR'],['SSS','TTT'],['UUU','VVV'],['WWW','XXX'],['YYY','ZZZ']],events=gamePairs.map(([home,away],i)=>({id:String(i+1),date:'2026-09-27T17:00:00Z',competitions:[{venue:{fullName:`${home} Field`,...(i===0?{indoor:true}:i===1?{}:{indoor:false})},competitors:[{homeAway:'home',team:{abbreviation:home}},{homeAway:'away',team:{abbreviation:away}}]}]}));
  const paths=[],api=runtime({lastDraftContext:{players,season:seasonState},jfImpl:async()=>({season:'2026',season_type:'regular',week:2}),fetchImpl:async url=>{
    const parsed=new URL(url,'https://local.invalid');
    if(parsed.pathname==='/api/nfl-week-context')return response(200,{season:2026,week:2,sourceUrl:'https://site.api.espn.com/sanitized',events});
    const path=decodeURIComponent(parsed.searchParams.get('path'));paths.push(path);const upstream=new URL(path,'https://fp.invalid'),position=upstream.searchParams.get('position');
    if(upstream.pathname.endsWith('/rankings/experts')){directoryCalls++;return response(200,{experts:directoryRows});}
    if(upstream.pathname.endsWith('/projections')&&position==='QB')return response(429,{error:'redacted'},null,{'retry-after':'120'});
    const offset=Object.entries(counts).slice(0,Object.keys(counts).indexOf(position)).reduce((sum,[,count])=>sum+count,0),rows=projectedRows(position,counts[position]).map((row,i)=>({...row,fpid:1000+offset+i,...(upstream.pathname.endsWith('/consensus-rankings')?{rank_ecr:i+1}:{})})),filterIds=(upstream.searchParams.get('filters')||'').split(':').filter(Boolean),expertName=Object.fromEntries(filterIds.map(id=>[id,idToName[id]]));
    return response(200,{season:2026,week:2,position_id:position,scoring:'HALF',updated:'2026-09-19',...(upstream.pathname.endsWith('/consensus-rankings')&&filterIds.length?{filters:filterIds.join(':'),total_experts:Object.keys(expertName).length,expert_name:expertName,expert_pub:Object.fromEntries(Object.keys(expertName).map(id=>[id,'Fixture']))}:{}),players:rows});
  }});
  const report=await api.runPhysicalEvidenceLaneDiagnostic(),text=api.formatPhysicalEvidenceLaneDiagnostic(report);
  assert.equal(report.schema,'pitti.physical-evidence-lanes-diagnostic.v2');
  assert.equal(report.weeklyProjections.positions.QB.httpStatus,429);assert.equal(report.weeklyProjections.positions.QB.retryAfterSeconds,120);
  assert.equal(report.weeklyProjections.positions.RB.scoringParameterPresent,false);assert.equal(report.weeklyProjections.positions.RB.rosPresent,false);
  assert.equal(report.expertRanks.status,'AVAILABLE');assert.equal(report.expertRanks.positions.QB.primaryRejectionReason,null);
  assert.equal(report.selectedPittiPanel.status,'AVAILABLE',JSON.stringify(report.selectedPittiPanel));assert.equal(report.selectedPittiPanel.positions.QB.filteredRequestHttpStatus,200);assert.equal(report.selectedPittiPanel.positions.QB.requestedExpertCount,4);assert.deepEqual(report.selectedPittiPanel.positions.QB.providerReturnedExpertNames,selectedNames.QB);
  assert.equal(directoryCalls,1,'diagnostic v2 must exercise the same single-call authenticated Ranking Experts fallback as production');
  assert.equal(report.canonicalGameContext.status,'AVAILABLE');assert.equal(report.canonicalGameContext.coverage.acceptedGames,13);
  assert.deepEqual(report.canonicalGameContext.games.slice(0,3).map(row=>row.weatherReason),['INDOOR_NO_WEATHER_REQUIRED','ROOF_UNKNOWN','FRESH_FORECAST_UNAVAILABLE']);
  assert(paths.length===13,'diagnostic must issue four projections, four broad ranks, one identity directory and four selected requests');
  assert(paths.slice(0,4).every(path=>path.includes('/projections?')&&path.includes('week=2')&&!path.includes('ros=')&&!path.includes('scoring=')),'projection diagnostic must run first and preserve explicit week/position with ros and scoring omitted');
  assert(paths.slice(4,8).every(path=>path.includes('/consensus-rankings?')&&path.includes('week=2')&&path.includes('scoring=HALF')&&path.includes('experts=show')&&!path.includes('filters=')),'broad rank diagnostic must run second and request expert identity metadata');
  assert.equal(paths[8],'/nfl/2026/rankings/experts?include_overall=true','official identity fallback must run once after broad ranks');
  assert(paths.slice(9,13).every(path=>path.includes('/consensus-rankings?')&&path.includes('week=2')&&path.includes('scoring=HALF')&&path.includes('experts=show')&&path.includes('filters=')),'selected PITTI diagnostic must run after the bounded identity fallback with exact expert filters');
  assert(!text.includes(secretSentinel));for(const key of ['weeklyProjections','expertRanks','selectedPittiPanel','persistence','requestRateLimit','startSitCompletion','canonicalGameContext','apiKeyIncluded','authorizationHeadersIncluded','rawProviderBodiesIncluded','cookiesIncluded','tokensIncluded'])assert(text.includes(key),`combined report missing ${key}`);
}

{
  const now=fixedNow,stored={snapshotId:'wev2-safe-metadata',lastSuccessAt:now,records:[{metric:'projected_points'},{metric:'projected_points'}],lanes:{projections:{status:'AVAILABLE'},expertWeeklyRanks:{status:'UNAVAILABLE',reason:'STORAGE_QUOTA_PROJECTION_ONLY'},pittiSelectedWeeklyRanks:{status:'UNAVAILABLE',reason:'STORAGE_QUOTA_PROJECTION_ONLY'}},persistence:{mode:'LOCAL_STORAGE_PROJECTION_ONLY',reason:'STORAGE_QUOTA'},retainedPriorRecords:3},season={league:{season:'2026',roster_positions:['QB']},my_roster:{starters:['p1']}},rows=[{seasonStatus:'ACTIVE',p:{id:'p1',pos:'QB'}}],values={p1:{projected_points:20,projection_status:'VERIFIED',rank_available:false}};
  const lineup={adaptEvidence:value=>({available:true,...value}),evaluate:()=>({status:'RECOMMENDED',reason:'OK',lineup:{complete:true,assignments:[{slot:'QB',player:rows[0]}]}})};
  const api=runtime({storageSnapshot:stored,lastDraftContext:{season,seasonRows:rows},lineupStartSitV2:lineup,weeklyValueMap:()=>({values,gameValid:true}),liveAuthority:()=>false});
  const persistence=api.weeklyEvidencePersistenceDiagnostic();
  assert.equal(persistence.snapshotId,'wev2-safe-metadata');assert.equal(persistence.metricCounts.projected_points,2);assert.equal(persistence.metricCounts.weekly_rank,0);assert.equal(persistence.quotaEvidence.projectionOnly,true);assert.equal(persistence.localStorageUsageEstimate.status,'AVAILABLE');
  const completion=api.startSitCompletionDiagnostic({season:2026,week:2});
  assert.equal(completion.missingProjectionCount,0);assert.equal(completion.optimizerComplete,true);assert.equal(completion.consumerComplete,false);assert.equal(completion.primaryIncompletionReason,'LIVE_SEASON_AUTHORITY_UNAVAILABLE');
}

{
  const names={QB:['Justin Boone','Dalton Del Don','Sean Koerner','Pat Fitzmaurice'],RB:['Justin Boone','Dalton Del Don','Kev Wheeler','Ryan Weisse','Sean Koerner','Pat Fitzmaurice'],WR:['Justin Boone','Dalton Del Don','Sean Koerner','Pat Fitzmaurice'],TE:['Dalton Del Don','Justin Boone','Sean Koerner','Pat Fitzmaurice']},directoryPayloads={};
  for(const [position,configured] of Object.entries(names)){const pairs=configured.map((name,index)=>[String(100+index),name]);directoryPayloads[position]={expert_name:Object.fromEntries(pairs),expert_pub:Object.fromEntries(pairs.map(([id])=>[id,'Fixture']))};}
  const api=runtime({fetchImpl:async()=>response(429,{error:'redacted'},null,{})}),selected=await api.runSelectedPittiPanelDiagnostic({season:2026,week:2,sleeperPlayers:{},directoryPayloads});
  for(const position of ['QB','RB','WR','TE']){assert.equal(selected.positions[position].filteredRequestHttpStatus,429);assert.equal(selected.positions[position].retryAfterSeconds,0);assert.equal(selected.positions[position].primaryRejectionReason,'HTTP_429');}
}

assert(app.includes('runPhysicalEvidenceLaneDiagnostic')&&app.includes("'diagnosticCopyBtn'")&&app.includes('Diagnose kopieren'),'one-pass physical diagnostic UI missing');
assert(!app.slice(start,end).includes('console.'),'weekly diagnostic production path must not log');
const productionStart=app.indexOf('async function refreshSeasonRankings('),productionEnd=app.indexOf('\nfunction startSeasonRankingRefreshScheduler',productionStart),productionBlock=app.slice(productionStart,productionEnd);
for(const [label,block] of [['authenticated diagnostic',app.slice(start,end)],['production refresh',productionBlock]]){
  assert(block.includes('/projections?week=${week}&position=${position}'),`${label} must request explicit week and position`);
  assert(!/\/projections\?[^`'"\n]*\bros=/.test(block),`${label} weekly projection request must omit ros`);
  assert(block.includes("queryShape:'EXPLICIT_WEEK_POSITION_ROS_OMITTED'"),`${label} must record truthful omitted-ROS request provenance`);
  assert(!/requestProvenance:\{[^}]*\bros\s*:/.test(block),`${label} must not record a ros value in request provenance`);
}
console.log('SEASON_WEEKLY_PROJECTION_DIAGNOSTIC_REGRESSION_PASS');
