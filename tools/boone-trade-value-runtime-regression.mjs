import assert from 'node:assert/strict';
import fs from 'node:fs';
import {POSITIONS,MIN_COUNTS,WEEK1_URLS,parseBooneChartHtml,buildBooneTradeValueSnapshot,validateBooneTradeValueSnapshot,mapBoonePlayer,sleeperIndexes} from '../boone-trade-values-v1.mjs';

const now=Date.parse('2026-09-11T08:00:00Z'),season=2026,week=1;
const labels={QB:'quarterback',RB:'running back',WR:'wide receiver',TE:'tight end'};
const html=(position,{count=MIN_COUNTS[position],date='2026-09-09T19:47:44Z',header=position==='QB'?['Rk','Player','1QB','2QB']:['Rk','Player','HALF','PPR'],duplicate=false}={})=>{
  const rows=Array.from({length:count},(_,i)=>`<tr><td>${i+1}</td><td>${position} Player ${duplicate&&i===count-1?0:i}</td><td>${100-i}</td><td>${150-i}</td></tr>`).join('');
  return `<html><head><script type="application/ld+json">{"author":{"name":"Justin Boone"},"datePublished":"${date}","dateModified":"${date}"}</script></head><body><h1>Fantasy Football Week 1: Justin Boone's ${labels[position]} Trade Value Charts</h1><p>Join a Yahoo Fantasy Football league for the 2026 NFL season. Rest-of-season ${position} trade values.</p><table><tr>${header.map(x=>`<th>${x}</th>`).join('')}</tr>${rows}</table></body></html>`;
};
const players={};for(const position of POSITIONS)for(let i=0;i<MIN_COUNTS[position];i++)players[`${position}${i}`]={full_name:`${position} Player ${i}`,position,team:'AAA'};
const charts=Object.fromEntries(POSITIONS.map(position=>[position,parseBooneChartHtml(html(position),{position,season,week,sourceUrl:WEEK1_URLS[position],now})]));
for(const position of POSITIONS)assert.equal(charts[position].ok,true,position+' valid chart');
assert.equal(charts.QB.column,'1QB');assert.equal(charts.QB.players[0].value,100,'QB must select 1QB, not 2QB');
assert.equal(charts.RB.column,'HALF');assert.equal(charts.RB.players[0].value,100,'skill positions must select HALF, not PPR');

const snapshot=buildBooneTradeValueSnapshot({charts,sleeperPlayers:players,season,week,verifiedAt:now});
assert.equal(snapshot.status,'AVAILABLE');assert.equal(snapshot.records.length,Object.values(MIN_COUNTS).reduce((a,b)=>a+b,0));
assert.equal(validateBooneTradeValueSnapshot(snapshot,{season,week,scoring:'HALF_PPR'},now).ok,true);
assert(snapshot.records.every(row=>row.metric==='trade_value'&&row.sourceProvider==='Yahoo Sports'&&row.sourceAuthor==='Justin Boone'&&row.sourceEdition===snapshot.sourceEdition&&row.verifiedAt===now&&row.expiresAt>now));
assert(snapshot.records.every(row=>row.sourcePublishedAt==='2026-09-09T19:47:44.000Z'&&row.sourceUpdatedAt==='2026-09-09T19:47:44.000Z'));

assert.equal(parseBooneChartHtml(html('QB',{date:'2026-08-01T00:00:00Z'}),{position:'QB',season,week,sourceUrl:WEEK1_URLS.QB,now}).reason,'STALE_OR_INVALID_SOURCE_DATE');
assert.equal(parseBooneChartHtml('<html>Justin Boone Week 1 2026 quarterback trade value</html>',{position:'QB',season,week,sourceUrl:WEEK1_URLS.QB,now}).reason,'STALE_OR_INVALID_SOURCE_DATE');
assert.equal(parseBooneChartHtml(html('RB',{header:['Rk','Player','STD','PPR']}),{position:'RB',season,week,sourceUrl:WEEK1_URLS.RB,now}).reason,'MALFORMED_OR_INCOMPLETE_TABLE');
assert.equal(parseBooneChartHtml(html('WR',{duplicate:true}),{position:'WR',season,week,sourceUrl:WEEK1_URLS.WR,now}).reason,'DUPLICATE_SOURCE_NAME');
const partial=buildBooneTradeValueSnapshot({charts:{...charts,TE:{ok:false,position:'TE',reason:'SOURCE_URL_UNAVAILABLE'}},sleeperPlayers:players,season,week,verifiedAt:now});
assert.equal(partial.status,'UNAVAILABLE');assert.deepEqual(partial.records,[],'partial position coverage must publish no values');

const collisionPlayers={...players,collision:{full_name:'RB Player 0',position:'RB',team:'BBB'}},indexes=sleeperIndexes(collisionPlayers);
assert.equal(mapBoonePlayer(charts.RB.players[0],indexes).reason,'NAME_POSITION_COLLISION');
assert.equal(mapBoonePlayer({...charts.QB.players[0],team:'ZZZ'},sleeperIndexes(players)).reason,'TEAM_MISMATCH');
const collisionSnapshot=buildBooneTradeValueSnapshot({charts,sleeperPlayers:collisionPlayers,season,week,verifiedAt:now});
assert(!collisionSnapshot.records.some(row=>row.position==='RB'&&row.sourcePlayerName==='RB Player 0'),'ambiguous name must not map');
assert(collisionSnapshot.rejections.some(row=>row.reason==='NAME_POSITION_COLLISION'));
assert.equal(validateBooneTradeValueSnapshot(snapshot,{season,week,scoring:'HALF_PPR'},now+25*60*60*1000).reason,'STALE');

const worker=fs.readFileSync('_worker.js','utf8'),app=fs.readFileSync('app.js','utf8'),runtime=fs.readFileSync('tools/runtime-files.mjs','utf8');
for(const token of ["from './boone-trade-values-v1.mjs'","url.pathname==='/api/boone-trade-values'",'handleBooneTradeValues','buildBooneTradeValueSnapshot'])assert(worker.includes(token),'production Worker ingestion missing '+token);
for(const token of ["jf(`/api/boone-trade-values?season=${context.season}&week=${context.week}`",'atomicWriteBooneTradeValues','void refreshTradeValues({auto:true})','SEASON_TRADE_VALUE_AUTO_MS'])assert(app.includes(token),'automatic app ingestion missing '+token);
assert(runtime.includes("'boone-trade-values-v1.mjs'"),'production parser missing from runtime manifest');

const moduleUrl=new URL('../boone-trade-values-v1.mjs',import.meta.url).href;
const executableWorker=worker.replace("'./boone-trade-values-v1.mjs'",JSON.stringify(moduleUrl));
const {default:workerRuntime}=await import(`data:text/javascript;base64,${Buffer.from(executableWorker).toString('base64')}`);
const nativeFetch=globalThis.fetch;
globalThis.fetch=async input=>{
  const url=String(input);
  if(url==='https://sports.yahoo.com/author/justin-boone/')return new Response('<html></html>',{status:200,headers:{'content-type':'text/html'}});
  if(url==='https://api.sleeper.app/v1/players/nfl')return Response.json(players);
  const position=POSITIONS.find(candidate=>WEEK1_URLS[candidate]===url);
  if(position)return new Response(html(position),{status:200,headers:{'content-type':'text/html'}});
  throw new Error('Unexpected production fetch '+url);
};
try{
  const response=await workerRuntime.fetch(new Request('https://pitti.invalid/api/boone-trade-values?season=2026&week=1'),{ASSETS:{fetch:()=>new Response('asset')}});
  assert.equal(response.status,200,'actual production Worker route must ingest all sources');
  const payload=await response.json();
  assert.equal(payload.status,'AVAILABLE');
  assert.equal(payload.records.length,snapshot.records.length);
}finally{globalThis.fetch=nativeFetch;}
console.log('BOONE_TRADE_VALUE_RUNTIME_REGRESSION_PASS: production endpoint, parsing, mapping, freshness and negative coverage');
