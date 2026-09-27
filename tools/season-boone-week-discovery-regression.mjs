// Original uncommitted diagnostic promoted to a strict-suite regression; all HTML is synthetic.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {POSITIONS,MIN_COUNTS,adaptBooneTradeEvidence,discoverBooneTradeChartUrls} from '../boone-trade-values-v1.mjs';
const now=Date.parse('2026-09-27T12:00:00Z'),labels={QB:'quarterback',RB:'running back',WR:'wide receiver',TE:'tight end'};
const surfaces=['https://sports.yahoo.com/author/justin-boone/','https://sports.yahoo.com/fantasy/news/','https://sports.yahoo.com/fantasy/football/news/'];
const worker=fs.readFileSync('_worker.js','utf8').replace("'./boone-trade-values-v1.mjs'",JSON.stringify(new URL('../boone-trade-values-v1.mjs',import.meta.url).href));
const {default:runtime}=await import('data:text/javascript;base64,'+Buffer.from(worker).toString('base64'));
const nativeFetch=globalThis.fetch,nativeNow=Date.now;
function fixture(week){
  const urls=Object.fromEntries(POSITIONS.map(p=>[p,'https://sports.yahoo.com/fantasy/article/2026-justin-boones-trade-value-'+labels[p].replaceAll(' ','-')+'-week-'+week+'-fixture.html'])),players={},pages={};
  const links=POSITIONS.map(p=>'<a href="'+urls[p]+'">'+p+'</a>').join('');
  for(const p of POSITIONS){
    const rows=Array.from({length:MIN_COUNTS[p]},(_,i)=>{const name='Fixture Athlete '+(POSITIONS.indexOf(p)*100+i);players[p+i]={full_name:name,position:p,team:'FA'};return '<tr><td>'+(i+1)+'</td><td>'+name+'</td><td>'+(100-i)+'</td></tr>';}).join('');
    pages[p]='<script type="application/ld+json">{"datePublished":"2026-09-26T12:00:00Z","dateModified":"2026-09-26T12:00:00Z"}</script><h1>2026 Justin Boone trade value '+labels[p]+' Week '+week+'</h1><table><tr><th>Rk</th><th>Player</th><th>'+(p==='QB'?'1QB':'HALF')+'</th></tr>'+rows+'</table>';
  }
  return{week,urls,players,pages,links,seed:'<a href="'+urls.QB+'">Justin Boone trade value charts QB Week '+week+'</a>'};
}
async function run(f,{modes=['429','SEED','EMPTY'],partial=false,mutate}={}){
  const pages={...f.pages};pages.QB+=partial?'':f.links;if(mutate)mutate(pages);
  const requests=[];
  globalThis.fetch=async input=>{
    const url=String(input);requests.push(url);const i=surfaces.indexOf(url);
    if(i>=0){const mode=modes[i];if(mode==='THROW')throw new Error('PRIVATE_EXCEPTION_MUST_NOT_LEAK');return new Response(mode==='ALL'?f.links:mode==='SEED'?f.seed:'',{status:mode==='429'?429:200});}
    if(url==='https://api.sleeper.app/v1/players/nfl')return Response.json(f.players);
    const p=POSITIONS.find(p=>f.urls[p]===url);if(p)return new Response(pages[p]);
    throw new Error('Unexpected fixture request');
  };
  const response=await runtime.fetch(new Request('https://fixture.invalid/api/boone-trade-values?season=2026&week='+f.week),{}),payload=await response.json();
  assert(requests.length<=14);assert.equal(new Set(requests).size,requests.length,'deduplicated requests');
  assert(!JSON.stringify(payload).includes('PRIVATE_EXCEPTION'));
  return{status:response.status,payload,requests};
}
try{
  Date.now=()=>now;
  for(const week of [2,3,4]){
    const f=fixture(week),direct=await run(f,{modes:['ALL','EMPTY','EMPTY']});
    assert.equal(direct.status,200);assert(!direct.requests.includes(surfaces[1]));
    const fallback=await run(f);assert.equal(fallback.status,200);
    assert.equal(fallback.payload.acquisition.attempts[0].failureType,'AUTHOR_HTTP_429');
    assert.equal(fallback.payload.acquisition.attempts[0].upstreamStatus,429);
    assert(fallback.payload.acquisition.attempts.some(a=>a.status==='VALIDATED_SEED'));
    assert(!fallback.requests.includes(surfaces[2]));
    assert.equal(adaptBooneTradeEvidence(fallback.payload,{season:2026,week,scoring:'HALF_PPR'},now).available,true);
    for(const p of POSITIONS)assert.equal(fallback.payload.records.find(r=>r.playerId===p+'0').value,100);
  }
  const f=fixture(3);
  assert.equal((await run(f,{modes:['EMPTY','SEED','EMPTY']})).status,200);
  assert.equal((await run(f,{modes:['429','EMPTY','SEED']})).status,200);
  const failed=await run(f,{modes:['429','429','429']});
  assert.equal(failed.status,422);assert.deepEqual(failed.payload.records,[]);
  assert.deepEqual(failed.payload.acquisition.attempts.map(a=>a.failureType),['AUTHOR_HTTP_429','FANTASY_NEWS_HTTP_429','FANTASY_FOOTBALL_NEWS_HTTP_429']);
  assert.equal((await run(f,{modes:['THROW','SEED','EMPTY']})).payload.acquisition.attempts[0].failureType,'AUTHOR_NETWORK_ERROR');
  const partial=await run(f,{partial:true});assert.equal(partial.status,422);assert(partial.payload.acquisition.attempts.some(a=>a.failureType==='SEED_CROSSLINKS_INCOMPLETE'));
  for(const mutate of [
    p=>{p.TE=p.TE.replaceAll('2026','2025');},
    p=>{p.TE=p.TE.replace('Week 3','Week 2');},
    p=>{p.TE=p.TE.replace('tight end','quarterback');},
    p=>{p.TE=p.TE.replaceAll('2026-09-26','2026-08-01');},
    p=>{p.TE=p.TE.replace('Justin Boone','Other Author');},
    p=>{p.TE=p.TE.replace('HALF','PPR');},
    p=>{p.QB=p.QB.replace('1QB','2QB');},
    p=>{p.TE='';},
    p=>{p.TE=p.TE.replace('Fixture Athlete 301</td>','Fixture Athlete 300</td>');}
  ]){const r=await run(f,{mutate});assert.equal(r.status,422,String(mutate));assert.deepEqual(r.payload.records,[]);}
  for(const html of [f.seed.replaceAll('week-3','week-2').replaceAll('Week 3','Week 2'),f.seed.replaceAll('2026','2025'),f.seed.replaceAll('justin-boones','other-author').replaceAll('Justin Boone','Other Author'),f.seed.replaceAll('trade-value','rankings').replaceAll('trade value','rankings'),f.seed.replaceAll('sports.yahoo.com','third-party.test')])assert(POSITIONS.every(p=>discoverBooneTradeChartUrls(html,{season:2026,week:3})[p].length===0));
  const oversized=Array.from({length:30},(_,i)=>f.seed.replace('fixture.html','fixture'+i+'.html')).join('');assert.equal(discoverBooneTradeChartUrls(oversized,{season:2026,week:3}).QB.length,2);
  console.log('BOONE_WEEK_DISCOVERY_REGRESSION_PASS: bounded author/news/validated-seed chain weeks 2/3/4; strict negatives, classifications, native values and request bounds; synthetic only');
}finally{globalThis.fetch=nativeFetch;Date.now=nativeNow;}
