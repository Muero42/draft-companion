// Offline browser contract: all external requests are fixture responses, never live league data.
import fs from 'node:fs';import path from 'node:path';import http from 'node:http';import assert from 'node:assert/strict';import {createRequire} from 'node:module';
import {dstFixture} from './season-decision-quality-regression.mjs';
const require=createRequire(import.meta.url),{chromium}=require(process.env.PITTI_PLAYWRIGHT||'playwright');
const root=process.cwd(),output=process.argv[2];if(!output)throw Error('Explicit output directory required');fs.mkdirSync(output,{recursive:true});
const rows=[['q','QB'],['r','RB'],['w1','WR'],['w2','WR'],['t','TE'],['w3','WR'],['r2','RB'],['k','K'],['d','DEF'],['b','RB'],['ir','RB'],['fa','RB'],['fd','DEF']];
const players=Object.fromEntries(rows.map(([id,position])=>[id,{full_name:'Fixture '+id,position,team:'BUF',active:true,status:'Active',search_rank:50,bye_week:7}]));
const rosters=Array.from({length:10},(_,i)=>({roster_id:i+1,owner_id:'u'+i,players:i===0?rows.slice(0,11).map(x=>x[0]):[],starters:i===0?rows.slice(0,9).map(x=>x[0]):[],reserve:i===0?['ir']:[],taxi:[],settings:{waiver_budget_used:0}}));
const league={league_id:'fixture',season:'2026',total_rosters:10,settings:{leg:4,waiver_budget:100},roster_positions:['QB','RB','WR','WR','TE','FLEX','WRRB_FLEX','K','DEF',...Array(6).fill('BN')]};
const tradeSnapshot=()=>{const now=Date.now(),url='https://sports.yahoo.com/fantasy/article/fantasy-football-week-1-justin-boones-rb-trade-value-charts-193804763.html',ids=rows.filter(([,position])=>['QB','RB','WR','TE'].includes(position)).map(([id])=>id);return{schema:'pitti.boone-trade-values.v1',snapshotId:'browser-fixture-'+now,season:2026,week:4,scoring:'HALF_PPR',sourceId:'yahoo_justin_boone_trade_values',sourceProvider:'Yahoo Sports',sourceAuthor:'Justin Boone',sourceEdition:'boone-yahoo-2026-week-4',fetchedAt:now,lastSuccessAt:now,expiresAt:now+86400000,status:'AVAILABLE',coverage:{positions:Object.fromEntries(['QB','RB','WR','TE'].map(position=>[position,{status:'AVAILABLE',sourceCount:30,mapped:30,mappingCoverage:1,sourceUrl:url,publishedAt:now-1000}])),sourceRows:120,mappedRows:120},records:ids.map((playerId,index)=>({schema:'pitti.season-evidence.v1',playerId,sleeperId:playerId,sourcePlayerName:players[playerId].full_name,mappingMethod:'EXACT_NORMALIZED_NAME_POSITION',mappingVersion:'boone-sleeper-v1',metric:'trade_value',value:50-index,unit:'BOONE_TRADE_VALUE',position:players[playerId].position,season:2026,week:4,scoring:'HALF_PPR',status:'VERIFIED',sourceId:'yahoo_justin_boone_trade_values',sourceProvider:'Yahoo Sports',sourceAuthor:'Justin Boone',sourceEdition:'boone-yahoo-2026-week-4',sourceUrl:url,publishedAt:now-1000,sourcePublishedAt:new Date(now-1000).toISOString(),sourceUpdatedAt:new Date(now-1000).toISOString(),sourceTimePrecision:'TIMESTAMP',verifiedAt:now,expiresAt:now+86400000,provenance:{provider:'Yahoo Sports',author:'Justin Boone',chartPosition:players[playerId].position,selectedColumn:players[playerId].position==='QB'?'1QB':'HALF'},confidence:.95})),rejections:[]};};
const server=http.createServer((req,res)=>{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname),file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));if(!file.startsWith(root+path.sep)||!fs.existsSync(file)){res.writeHead(404).end();return;}res.setHeader('content-type',/\.m?js$/.test(file)?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.html')?'text/html':'application/json');let body=fs.readFileSync(file);if(file===path.join(root,'app.js'))body=body.toString()+"\nwindow.__review={context:()=>lastDraftContext,rerender:rerenderPostDraftFromContext,news:seasonNewsReactions,pairs:()=>lastPostDraftPairs,state:()=>({queued:seasonRenderQueued,running:seasonRenderRunning,revision:seasonRenderRevision,live:!!seasonLiveRefreshPromise,generated:lastDraftContext?.season?.generated_at,now:Date.now()})};";res.end(body);});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
let browser;try{
 browser=await chromium.launch({headless:true,...(process.env.PITTI_BROWSER?{executablePath:process.env.PITTI_BROWSER}:{})});
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,serviceWorkers:'block'}),page=await context.newPage(),errors=[],failedRequests=[];let compactDirectoryRequests=0,rawDirectoryRequests=0;
 page.on('pageerror',e=>errors.push(e.message));
 page.on('requestfailed',r=>failedRequests.push({url:r.url(),error:r.failure()?.errorText}));
 await page.clock.install();
 // This scenario models online fixture responses even when the host namespace has no network.
 await page.addInitScript(()=>Object.defineProperty(navigator,'onLine',{configurable:true,get:()=>true}));
 await page.route('**/*',route=>{const u=new URL(route.request().url());if(u.origin===origin&&u.pathname==='/api/boone-trade-values')return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(tradeSnapshot())});if(u.origin===origin&&u.pathname==='/api/season-players'){compactDirectoryRequests++;return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({schema:'pitti.players.v1',fetchedAt:Date.now(),players})});}if(u.origin===origin)return route.continue();let body={};if(u.hostname==='api.sleeper.app'){if(u.pathname.endsWith('/state/nfl'))body={season:'2026',season_type:'regular',week:4};else if(u.pathname.endsWith('/players/nfl')){rawDirectoryRequests++;return route.abort();}else if(u.pathname.endsWith('/rosters'))body=rosters;else if(u.pathname.endsWith('/users'))body=rosters.map(r=>({user_id:r.owner_id,display_name:r.owner_id}));else if(u.pathname.includes('/transactions/'))body=[];else if(u.pathname.endsWith('/picks'))body=[];else if(u.pathname.includes('/draft/'))body={draft_id:'1366053132970233856',league_id:'fixture',slot_to_roster_id:{9:1},settings:{teams:10,rounds:15}};else body=league;}return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(body)});});
 await page.addInitScript(()=>{localStorage.setItem('v118_seasonLeagueId','fixture');localStorage.setItem('v118_seasonUserId','u0');const now=Date.now();localStorage.setItem('v190_seasonEvidence',JSON.stringify(['projected_points','weekly_rank'].map(metric=>({playerId:'q',metric,value:metric==='weekly_rank'?3:17,season:2026,week:4,scoring:'HALF_PPR',status:'VERIFIED',confidence:.9,sourceId:'fixture',sourceUrl:'https://example.test/data',publishedAt:now-1000,verifiedAt:now-500,expiresAt:now+60000}))));});
 await page.goto(origin,{waitUntil:'domcontentloaded'});try{await page.waitForFunction(()=>window.__review?.context()?.season?.ok,{timeout:30000});}catch(error){const diagnostic={errors,failedRequests,body:(await page.locator('body').innerText()).slice(0,16000)};fs.writeFileSync(path.join(output,'startup-failure.json'),JSON.stringify(diagnostic,null,2));console.error(JSON.stringify(diagnostic));throw error;}
 assert(compactDirectoryRequests>0,'compact directory fixture consumed');assert.equal(rawDirectoryRequests,0,'normal startup must not request raw Sleeper directory');
 const rosterText=await page.locator('#rosterList').innerText();assert.match(rosterText,/Proj.: 17.00 Half-PPR/);assert.match(rosterText,/W4 Pos.-Rang: #3 PITTI/);assert.equal(await page.locator('#seasonDiagnosticCopyBtn').count(),1,'mobile Season diagnostic action present');
 await page.waitForFunction(()=>document.querySelector('#tradeStatus')?.textContent?.includes('gemappt'),{timeout:10000});
 assert.equal(await page.locator('#rosterList .lineup-row').count(),11);
 for(const id of ['seasonLiveStateStatus','seasonRankingStatus','rosterBenchStatus'])assert((await page.locator('#'+id).textContent()).trim().length>0,id+' must render');
 assert.match(await page.locator('#rosterBenchStatus').textContent(),/Week-4/);
 await page.evaluate(()=>window.__review.rerender());
 assert.equal(await page.locator('#rosterFaList').isVisible(),false);
 assert.equal(await page.locator('#rosterSummary').isVisible(),false);
 assert.equal(await page.locator('#rosterBenchList').innerText().then(t=>t.includes('Fixture q')),false,'starter grid must not repeat compact roster');
 for(const workspace of ['waiver','trade','live','roster']){const button=page.locator('[data-workspace-target="'+workspace+'"]');assert.equal(await button.count(),1);await button.click();assert.equal(await page.locator('[data-workspace="'+workspace+'"]').first().isVisible(),true);if(workspace==='waiver'){const board=await page.locator('#waiverList').innerText();for(const w of [4,5,6])assert(board.includes('WEEK '+w));assert(board.includes('MONITOR'));assert(!board.includes('Fixture fd'),'missing DST evidence must not produce pseudo-ranked cards');assert(!board.includes('Current-week Special Teams evidence is not verified.'));assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'waiver mobile overflow');assert.match(await page.locator('#waiverStatus').innerText(),/Waiver\/FA Decision Board v3/);}if(workspace==='trade'){assert.match(await page.locator('#tradeStatus').innerText(),/Trade Offer Board v9/);assert.match(await page.locator('#tradeList').innerText(),/TRADE HOLD/);}}
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'mobile horizontal overflow');
 assert.deepEqual(errors,[],'uncaught runtime errors');

 // Read-only test hooks are appended to the served module, never shipped in app.js.
 await page.evaluate(()=>{
   window.__refreshReview={holds:[]};
   window.__refreshObserver=new MutationObserver(()=>{
     const waiver=document.querySelector('#waiverStatus').textContent,trade=document.querySelector('#tradeStatus').textContent;
     const state=window.__review.state();
     // Capture the clearing boundary once per revision, before its new partial work.
     if(waiver.startsWith('HOLD')&&trade.startsWith('HOLD')&&!window.__refreshReview.holds.some(h=>h.state.revision===state.revision))window.__refreshReview.holds.push({
       empty:['rosterBenchList','rosterFaList','tradeList','waiverList','seasonActionList'].every(id=>!document.getElementById(id)?.innerHTML),
       pairs:window.__review.pairs().length,state
     });
   });
   window.__refreshObserver.observe(document.body,{childList:true,subtree:true,characterData:true});
 });
 const refreshBefore=await page.evaluate(()=>window.__review.state());
 await page.clock.fastForward(300010);
 // fastForward coalesces elapsed intervals; fetch continuations can schedule zero-delay
 // yields after it returns. Service those timers explicitly, with a finite virtual budget.
 let refreshFinal,drainSteps=0;
 for(;drainSteps<200;drainSteps++){
   await page.clock.runFor(10);
   refreshFinal=await page.evaluate(()=>({state:window.__review.state(),waiver:document.querySelector('#waiverStatus').textContent,trade:document.querySelector('#tradeStatus').textContent}));
   if(!refreshFinal.state.running&&!refreshFinal.state.queued&&!refreshFinal.state.live&&refreshFinal.state.generated>refreshBefore.generated&&refreshFinal.waiver.includes('Waiver/FA Decision Board v3')&&refreshFinal.trade.includes('Trade Offer Board v9'))break;
 }
 await page.evaluate(()=>window.__refreshObserver.disconnect());
 const transientHolds=await page.evaluate(()=>window.__refreshReview.holds);
 assert(transientHolds.length>0,'refresh must expose transient fail-closed HOLD');
 assert(transientHolds.every(h=>h.empty&&h.pairs===0),'no stale ADD/trade recommendation survives supersession');
 assert(transientHolds.some(h=>h.state.running||h.state.queued),'HOLD belongs to pending replacement render');
 assert(drainSteps<200,'automatic refresh must finish within bounded virtual drain; no pending render');
 assert(refreshFinal.state.revision>refreshBefore.revision,'automatic refresh queues replacement render');
 assert.deepEqual(errors,[],'automatic refresh has no uncaught browser errors');
 assert.match(await page.locator('#waiverStatus').textContent(),/Waiver\/FA Decision Board v3/,'successful four-minute live refresh keeps Waiver authority fresh');
 assert.match(await page.locator('#tradeStatus').textContent(),/Trade Offer Board v9/,'successful four-minute live refresh keeps Trade authority fresh');
 assert.match(await page.locator('#seasonLiveStateAge').textContent(),/(?:< 1 Min\.|1 Min\.)/,'visible live age follows refreshed season.generated_at');
 assert.doesNotMatch(await page.locator('#rosterList').innerText(),/Proj\.: 17\.00 Half-PPR/,'expired projections are removed even while ownership refresh succeeds');

 const f=dstFixture(await page.evaluate(()=>Date.now()));
 await page.evaluate(f=>{
   const c=window.__review.context(),now=Date.now();Object.assign(c.players,f.players);c.players.d.team='CIN';c.seasonRows.find(r=>r.p.id==='d').p.team='CIN';
   c.availableDST=Object.entries(f.players).filter(([id])=>id!=='CIN').map(([id,p])=>({id,name:p.full_name,pos:p.position,team:p.team}));
   c.players.noise={full_name:'Projection-only Deep Fixture',position:'RB',team:'BUF'};
   c.rankedAvailable=[{id:'fa',name:'Fixture fa',pos:'RB',team:'BUF'},{id:'noise',name:'Projection-only Deep Fixture',pos:'RB',team:'BUF'}];
   const record=(id,metric,value)=>({playerId:id,metric,value,season:2026,week:4,scoring:'HALF_PPR',status:'VERIFIED',confidence:.9,sourceId:'fixture',sourceUrl:'https://example.test/weekly',publishedAt:now-1000,verifiedAt:now,expiresAt:now+60000});
   const evidence=c.seasonRows.filter(r=>['QB','RB','WR','TE'].includes(r.p.pos)).map(r=>record(r.p.id,'projected_points',10));evidence.push(record('fa','projected_points',35),record('fa','weekly_rank',5),record('noise','projected_points',40));
   localStorage.setItem('v190_seasonEvidence',JSON.stringify(evidence));localStorage.setItem('pitti.weekly-dst.v1.current',JSON.stringify(f.dst));localStorage.setItem('pitti.game-context.v1.current',JSON.stringify(f.game));return window.__review.rerender();
 },f);
 await page.locator('[data-workspace-target="waiver"]').click();
 const board=await page.locator('#waiverList').innerText();assert(!board.includes('Projection-only Deep Fixture'),'projection alone must not surface');assert(board.includes('ADD Fixture fa'),'evidence-backed waiver survives');
 const dstSections=page.locator('#waiverList details');assert.equal(await dstSections.count(),3);const ranked=await dstSections.first().locator('article').allTextContents();assert(ranked[0].includes('MIN'),'highest verified net first');assert.equal(ranked.filter(x=>x.includes('MIN')).length,1,'canonical defense dedup');assert.equal(await dstSections.nth(1).locator('article').count(),0);assert.equal(await dstSections.nth(2).locator('article').count(),0);
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'decision fixture mobile overflow');
 await page.evaluate(()=>{localStorage.removeItem('pitti.weekly-dst.v1.current');return window.__review.rerender()});assert.equal(await page.locator('#waiverList details article').count(),0,'zero-evidence compact horizons');assert.deepEqual(errors,[]);

 assert.equal(rawDirectoryRequests,0,'browser review must not request raw Sleeper directory');
 const receipt={refresh:{drainSteps,transientHolds,before:refreshBefore,final:refreshFinal},compactDirectoryRequests,rawDirectoryRequests,status:'PASS',browser:'Chromium desktop mobile emulation',viewport:'390x844',network:'all external responses mocked',checks:['real module startup','automatic Boone endpoint ingestion','Week-4 Sleeper state and current-week evidence','live/ranking/Start-Sit status areas','11 roster rows incl IR','async rerender routing','Waiver v3 mobile route','shipped D/ST Week 4/5/6 MONITOR and exact missing evidence','Trade v8 fail-closed mobile route','workspace clicks','no horizontal overflow','no duplicate starter grid','automatic four-minute ownership refresh with renewed visible age','independent expiry of stale projections','waiver projection-only suppression and ranked survivor','DST net ordering and team dedup','compact zero-evidence and future horizons','no uncaught errors'],physicalAndroid:false};fs.writeFileSync(path.join(output,'browser-review.json'),JSON.stringify(receipt,null,2));console.log(JSON.stringify(receipt));
}finally{await browser?.close();await new Promise(r=>server.close(r));}
