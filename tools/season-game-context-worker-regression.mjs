import assert from 'node:assert/strict';
import fs from 'node:fs';
const worker=fs.readFileSync('_worker.js','utf8'),moduleUrl=new URL('../boone-trade-values-v1.mjs',import.meta.url).href,source=worker.replace("'./boone-trade-values-v1.mjs'",JSON.stringify(moduleUrl));
const load=async suffix=>(await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}#${suffix}`)).default;
const nativeFetch=globalThis.fetch;
try{
  const calls=[];
  globalThis.fetch=async(url,options)=>{calls.push({url:String(url),options});return new Response('forbidden',{status:403})};
  let runtime=await load('http');let response=await runtime.fetch(new Request('https://pitti.invalid/api/nfl-week-context?season=2026&week=2'),{ASSETS:{fetch:()=>new Response('asset')}}),body=await response.json();
  assert.equal(response.status,502);assert.equal(body.failureType,'UPSTREAM_HTTP_ERROR');assert.equal(body.upstreamStatus,403);assert.equal(calls.length,3,'bounded ESPN-hosted acquisition must exhaust exactly three sanctioned variants');
  assert(calls.every(call=>call.url.startsWith('https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?')));
  assert(calls.every(call=>call.options?.headers?.accept==='application/json'&&/PITTI-Companion/.test(call.options?.headers?.['user-agent']||'')));
  assert(calls.every(call=>call.options?.cf?.cacheTtl===900&&call.options?.cf?.cacheEverything===true));
  assert(Array.isArray(body.attempts)&&body.attempts.length===3);
  assert(!JSON.stringify(body).includes('forbidden'),'raw upstream response body must never leak');
  globalThis.fetch=async()=>{throw new Error('secret upstream detail')};runtime=await load('exception');response=await runtime.fetch(new Request('https://pitti.invalid/api/nfl-week-context?season=2026&week=2'),{ASSETS:{fetch:()=>new Response('asset')}});body=await response.json();
  assert.equal(response.status,502);assert.deepEqual({failureType:body.failureType,upstreamStatus:body.upstreamStatus},{failureType:'FETCH_EXCEPTION',upstreamStatus:null});assert(!JSON.stringify(body).includes('secret upstream detail'),'fetch exception detail must remain sanitized');
  let attempt=0;globalThis.fetch=async()=>{attempt++;if(attempt===1)return new Response(JSON.stringify({events:[]}),{status:200,headers:{'content-type':'application/json'}});return new Response(JSON.stringify({events:Array.from({length:13},(_,i)=>({id:String(i+1)}))}),{status:200,headers:{'content-type':'application/json'}})};
  runtime=await load('fallback');response=await runtime.fetch(new Request('https://pitti.invalid/api/nfl-week-context?season=2026&week=2'),{ASSETS:{fetch:()=>new Response('asset')}});body=await response.json();
  assert.equal(response.status,200);assert.equal(body.events.length,13);assert.equal(body.acquisition.variant,2);assert.equal(body.acquisition.attempts[0].failureType,'INCOMPLETE_WEEK');
}finally{globalThis.fetch=nativeFetch}
console.log('SEASON_GAME_CONTEXT_WORKER_REGRESSION_PASS');
