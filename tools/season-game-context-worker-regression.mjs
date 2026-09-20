import assert from 'node:assert/strict';
import fs from 'node:fs';
const worker=fs.readFileSync('_worker.js','utf8'),moduleUrl=new URL('../boone-trade-values-v1.mjs',import.meta.url).href,source=worker.replace("'./boone-trade-values-v1.mjs'",JSON.stringify(moduleUrl));
const load=async suffix=>(await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}#${suffix}`)).default;
const nativeFetch=globalThis.fetch;
try{
  let upstreamUrl='',upstreamOptions=null;
  globalThis.fetch=async(url,options)=>{upstreamUrl=String(url);upstreamOptions=options;return new Response('forbidden',{status:403})};
  let runtime=await load('http');let response=await runtime.fetch(new Request('https://pitti.invalid/api/nfl-week-context?season=2026&week=2'),{ASSETS:{fetch:()=>new Response('asset')}}),body=await response.json();
  assert.equal(response.status,502);assert.deepEqual({failureType:body.failureType,upstreamStatus:body.upstreamStatus},{failureType:'UPSTREAM_HTTP_ERROR',upstreamStatus:403});assert.equal(body.sourceUrl,upstreamUrl);
  assert.equal(upstreamUrl,'https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?dates=2026&seasontype=2&week=2&limit=100');
  assert.deepEqual(upstreamOptions.cf,{cacheTtl:900,cacheEverything:true},'Cloudflare cache options must not alter request URL semantics');
  globalThis.fetch=async()=>{throw new Error('secret upstream detail')};runtime=await load('exception');response=await runtime.fetch(new Request('https://pitti.invalid/api/nfl-week-context?season=2026&week=2'),{ASSETS:{fetch:()=>new Response('asset')}});body=await response.json();
  assert.equal(response.status,502);assert.deepEqual({failureType:body.failureType,upstreamStatus:body.upstreamStatus},{failureType:'FETCH_EXCEPTION',upstreamStatus:null});assert(!JSON.stringify(body).includes('secret upstream detail'),'fetch exception detail must remain sanitized');
}finally{globalThis.fetch=nativeFetch}
console.log('SEASON_GAME_CONTEXT_WORKER_REGRESSION_PASS');
