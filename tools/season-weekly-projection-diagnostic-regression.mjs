import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const app=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');
const start=app.indexOf('const FP_DIAGNOSTIC_TIMEOUT_MS=');
const end=app.indexOf('function slugifyExpert',start);
assert(start>=0&&end>start,'weekly projection diagnostic production block missing');
const source=app.slice(start,end)+`;globalThis.__weeklyDiagnostic={fpProxyRequest,proxyCall,deriveSleeperNflWeek,summarizeWeeklyProjectionPayload,weeklyProjectionFailure,runAuthenticatedWeeklyProjectionDiagnostic,formatAuthenticatedWeeklyProjectionDiagnostic};`;
const secretSentinel='SENSITIVE_SENTINEL_DO_NOT_RENDER';
const response=(status,data,raw=null)=>({ok:status>=200&&status<300,status,async text(){return raw??JSON.stringify(data)}});
const projectedRows=(position,count,{missingPoints=0,missingIds=0}={})=>Array.from({length:count},(_,i)=>({
  ...(i<missingIds?{}:{fpid:1000+i}),name:`${position} Player ${i+1}`,position_id:position,
  stats:i<missingPoints?{points:99}:{points:99,points_half:20-i/10}
}));
function runtime({fetchImpl,jfImpl,season='2026'}={}){
  const context={
    AbortController,setTimeout,clearTimeout,Date,Math,Number,String,Array,Object,RegExp,Error,
    fetch:fetchImpl||(()=>{throw new Error('unexpected fetch')}),
    jf:jfImpl||(()=>Promise.resolve({season,season_type:'regular',week:7})),
    S:'https://api.sleeper.app/v1',els:{apiKey:{value:secretSentinel},season:{value:String(season)}}
  };
  vm.runInNewContext(source,context);
  return context.__weeklyDiagnostic;
}

{
  let capturedUrl='',capturedOptions=null,logCount=0;
  const api=runtime({fetchImpl:async(url,options)=>{capturedUrl=url;capturedOptions=options;return response(200,{ok:true})}});
  const oldLog=console.log;console.log=()=>{logCount++};
  try{const result=await api.fpProxyRequest('/nfl/2026/projections?week=7&position=QB&scoring=HALF&ros=false');assert.equal(result.status,200)}finally{console.log=oldLog}
  assert.equal(capturedOptions.headers['x-fp-key'],secretSentinel,'existing x-fp-key credential header must be used');
  assert(!capturedUrl.includes(secretSentinel),'credential must never enter URL/query string');
  assert.equal(logCount,0,'credential request must not log');
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
  assert(paths.every(path=>path.includes('scoring=HALF')&&path.includes('ros=false')),'weekly Half-PPR/ros=false semantics missing');
  const text=api.formatAuthenticatedWeeklyProjectionDiagnostic(report).join('\n');
  assert.match(text,/>10=yes/);assert.match(text,/numeric stats\.points_half=/);assert.match(text,/updated=2026-09-10/);
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
  const api=runtime({fetchImpl:(url,options)=>new Promise((resolve,reject)=>options.signal.addEventListener('abort',()=>{const error=new Error('aborted');error.name='AbortError';reject(error)}))});
  await assert.rejects(api.fpProxyRequest('/nfl/2026/projections?week=7&position=QB',{timeoutMs:5}),error=>error.code==='TIMEOUT');
}
{
  const api=runtime();
  assert.throws(()=>api.deriveSleeperNflWeek({season:'2025',season_type:'regular',week:7},2026),error=>error.code==='SLEEPER_SEASON_MISMATCH');
  assert.throws(()=>api.deriveSleeperNflWeek({season:'2026',season_type:'pre',week:0},2026),error=>error.code==='SLEEPER_NOT_REGULAR_SEASON');
}

assert(app.includes("const info=await loadExperts()")&&app.includes("for(const name of ['Pat Fitzmaurice'")&&app.includes('loadSleeperAdpDirect()'),'existing API diagnostic behavior must remain in place');
assert(!app.slice(start,end).includes('console.'),'weekly diagnostic production path must not log');
console.log('SEASON_WEEKLY_PROJECTION_DIAGNOSTIC_REGRESSION_PASS');
