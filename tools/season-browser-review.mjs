// Offline browser contract: all external requests are fixture responses, never live league data.
import fs from 'node:fs';import path from 'node:path';import http from 'node:http';import assert from 'node:assert/strict';import {createRequire} from 'node:module';
import {physicalShape} from './fixtures/rc4223/physical-shape.mjs';
import {dstFixture} from './season-decision-quality-regression.mjs';
const require=createRequire(import.meta.url),{chromium}=require(process.env.PITTI_PLAYWRIGHT||'playwright');
const root=process.cwd(),output=process.argv[2];if(!output)throw Error('Explicit output directory required');fs.mkdirSync(output,{recursive:true});
const gameFixture=JSON.parse(fs.readFileSync('tools/fixtures/rc4222/espn-week4.json'));
const rows=[['q','QB'],['r','RB'],['w1','WR'],['w2','WR'],['t','TE'],['w3','WR'],['r2','RB'],['k','K'],['d','DEF'],['b','RB'],['ir','RB'],['fa','RB'],['fd','DEF']];
const players=Object.fromEntries(rows.map(([id,position])=>[id,{full_name:'Fixture '+id,position,team:'BUF',active:true,status:'Active',search_rank:50,bye_week:7}]));
const rosters=Array.from({length:10},(_,i)=>({roster_id:i+1,owner_id:'u'+i,players:i===0?rows.slice(0,11).map(x=>x[0]):[],starters:i===0?rows.slice(0,9).map(x=>x[0]):[],reserve:i===0?['ir']:[],taxi:[],settings:{waiver_budget_used:0}}));
const league={league_id:'fixture',season:'2026',total_rosters:10,settings:{leg:4,waiver_budget:100},roster_positions:['QB','RB','WR','WR','TE','FLEX','WRRB_FLEX','K','DEF',...Array(6).fill('BN')]};
const tradeSnapshot=()=>{const now=Date.now(),url='https://sports.yahoo.com/fantasy/article/fantasy-football-week-1-justin-boones-rb-trade-value-charts-193804763.html',ids=rows.filter(([,position])=>['QB','RB','WR','TE'].includes(position)).map(([id])=>id);return{schema:'pitti.boone-trade-values.v1',snapshotId:'browser-fixture-'+now,season:2026,week:4,scoring:'HALF_PPR',sourceId:'yahoo_justin_boone_trade_values',sourceProvider:'Yahoo Sports',sourceAuthor:'Justin Boone',sourceEdition:'boone-yahoo-2026-week-4',fetchedAt:now,lastSuccessAt:now,expiresAt:now+86400000,status:'AVAILABLE',coverage:{positions:Object.fromEntries(['QB','RB','WR','TE'].map(position=>[position,{status:'AVAILABLE',sourceCount:30,mapped:30,mappingCoverage:1,sourceUrl:url,publishedAt:now-1000}])),sourceRows:120,mappedRows:120},records:ids.map((playerId,index)=>({schema:'pitti.season-evidence.v1',playerId,sleeperId:playerId,sourcePlayerName:players[playerId].full_name,mappingMethod:'EXACT_NORMALIZED_NAME_POSITION',mappingVersion:'boone-sleeper-v1',metric:'trade_value',value:50-index,unit:'BOONE_TRADE_VALUE',position:players[playerId].position,season:2026,week:4,scoring:'HALF_PPR',status:'VERIFIED',sourceId:'yahoo_justin_boone_trade_values',sourceProvider:'Yahoo Sports',sourceAuthor:'Justin Boone',sourceEdition:'boone-yahoo-2026-week-4',sourceUrl:url,publishedAt:now-1000,sourcePublishedAt:new Date(now-1000).toISOString(),sourceUpdatedAt:new Date(now-1000).toISOString(),sourceTimePrecision:'TIMESTAMP',verifiedAt:now,expiresAt:now+86400000,provenance:{provider:'Yahoo Sports',author:'Justin Boone',chartPosition:players[playerId].position,selectedColumn:players[playerId].position==='QB'?'1QB':'HALF'},confidence:.95})),rejections:[]};};
const server=http.createServer((req,res)=>{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname),file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));if(!file.startsWith(root+path.sep)||!fs.existsSync(file)){res.writeHead(404).end();return;}res.setHeader('content-type',/\.m?js$/.test(file)?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.html')?'text/html':'application/json');let body=fs.readFileSync(file);if(file===path.join(root,'app.js'))body=body.toString()+"\nwindow.__review={card:seasonRosterCardHtml,model:seasonRosterDisplayModel,environment:seasonEnvironmentSignal,weather:seasonWeatherSignal,actual:seasonActualSnapshot,startSit:seasonStartSitPresentation,header:renderSeasonDataCompactHeader,context:()=>lastDraftContext,rerender:rerenderPostDraftFromContext,news:seasonNewsReactions,pairs:()=>lastPostDraftPairs,state:()=>({queued:seasonRenderQueued,running:seasonRenderRunning,revision:seasonRenderRevision,live:!!seasonLiveRefreshPromise,generated:lastDraftContext?.season?.generated_at,now:Date.now()})};";res.end(body);});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
let browser;try{
 browser=await chromium.launch({headless:true,...(process.env.PITTI_BROWSER?{executablePath:process.env.PITTI_BROWSER}:{})});
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,serviceWorkers:'block'}),page=await context.newPage(),errors=[],failedRequests=[];let compactDirectoryRequests=0,rawDirectoryRequests=0;
 page.on('pageerror',e=>errors.push(e.message));
 page.on('requestfailed',r=>failedRequests.push({url:r.url(),error:r.failure()?.errorText}));
 await page.clock.install();
 // This scenario models online fixture responses even when the host namespace has no network.
 await context.addInitScript(()=>Object.defineProperty(navigator,'onLine',{configurable:true,get:()=>true}));
 await context.route('**/*',route=>{const u=new URL(route.request().url());if(u.origin===origin&&u.pathname==='/api/wr-matchup-context')return route.fulfill({status:502,contentType:'application/json',body:JSON.stringify({status:'UNAVAILABLE'})});if(u.origin===origin&&u.pathname==='/api/boone-trade-values')return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(tradeSnapshot())});if(u.origin===origin&&u.pathname==='/api/season-players'){compactDirectoryRequests++;return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({schema:'pitti.players.v1',fetchedAt:Date.now(),players})});}if(u.origin===origin&&u.pathname==='/api/nfl-week-context')return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({season:2026,week:4,sourceUrl:'https://cdn.espn.com/core/nfl/scoreboard?xhr=1&year=2026&seasontype=2&week=4',events:gameFixture.events})});if(u.origin===origin)return route.continue();let body={};if(u.hostname==='api.sleeper.app'){if(u.pathname.endsWith('/state/nfl'))body={season:'2026',season_type:'regular',week:4};else if(u.pathname.endsWith('/players/nfl')){rawDirectoryRequests++;return route.abort();}else if(u.pathname.endsWith('/matchups/4'))body=rosters.map(r=>({...r,players_points:Object.fromEntries((r.players||[]).map(id=>[id,0]))}));else if(u.pathname.endsWith('/rosters'))body=rosters;else if(u.pathname.endsWith('/users'))body=rosters.map(r=>({user_id:r.owner_id,display_name:r.owner_id}));else if(u.pathname.includes('/transactions/'))body=[];else if(u.pathname.endsWith('/picks'))body=[];else if(u.pathname.includes('/draft/'))body={draft_id:'1366053132970233856',league_id:'fixture',slot_to_roster_id:{9:1},settings:{teams:10,rounds:15}};else body=league;}return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(body)});});
 await page.addInitScript(()=>{localStorage.setItem('v118_seasonLeagueId','fixture');localStorage.setItem('v118_seasonUserId','u0');const now=Date.now();localStorage.setItem('v190_seasonEvidence',JSON.stringify(['projected_points','weekly_rank'].map(metric=>({playerId:'q',metric,value:metric==='weekly_rank'?3:17,season:2026,week:4,scoring:'HALF_PPR',status:'VERIFIED',confidence:.9,sourceId:'fixture',sourceUrl:'https://example.test/data',publishedAt:now-1000,verifiedAt:now-500,expiresAt:now+60000}))));});
 await page.goto(origin,{waitUntil:'domcontentloaded'});try{await page.waitForFunction(()=>window.__review?.context()?.season?.ok,{timeout:30000});}catch(error){const diagnostic={errors,failedRequests,body:(await page.locator('body').innerText()).slice(0,16000)};fs.writeFileSync(path.join(output,'startup-failure.json'),JSON.stringify(diagnostic,null,2));console.error(JSON.stringify(diagnostic));throw error;}
 assert(compactDirectoryRequests>0,'compact directory fixture consumed');assert.equal(rawDirectoryRequests,0,'normal startup must not request raw Sleeper directory');
 await page.waitForFunction(()=>document.querySelector('#rosterList')?.textContent.includes('17.0'));
 const rosterText=await page.locator('#rosterList').innerText();assert.match(rosterText,/17\.0/);assert.match(rosterText,/QB3/);assert.equal(await page.locator('#seasonDiagnosticCopyBtn').count(),1,'mobile Season diagnostic action present');assert.equal(await page.locator('#seasonDiagnosticCopyBtn').isVisible(),false,'diagnostic stays under collapsed advanced');
 await page.waitForFunction(()=>document.querySelector('#tradeStatus')?.textContent?.includes('gemappt'),{timeout:10000});
 assert.equal(await page.locator('#rosterList .lineup-row').count(),11);
 for(const id of ['seasonLiveStateStatus','seasonRankingStatus','rosterBenchStatus'])assert((await page.locator('#'+id).textContent()).trim().length>0,id+' must render');
 assert.match(await page.locator('#rosterBenchStatus').textContent(),/Start\/Sit/);
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
 assert.doesNotMatch(await page.locator('#rosterList').innerText(),/17\.0/,'expired projections are removed even while ownership refresh succeeds');

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


 const shape=physicalShape(await page.evaluate(()=>Date.now()),players);
 const persistedProof=await page.evaluate(shape=>{const api=window.PittiWeeklyEvidenceV2,start=performance.now(),snapshot=api.buildSnapshot({season:2026,week:4,scoring:'HALF_PPR',projectionPayloads:shape.projections,projectionPositions:api.PROJECTION_POSITIONS,rankingPayloads:shape.ranks,selectedRankingPayloads:shape.selected,sleeperPlayers:shape.players,verifiedAt:Date.now()}),buildMs=performance.now()-start,persistAt=performance.now(),stored=api.atomicWrite(localStorage,snapshot);return{buildMs,persistMs:performance.now()-persistAt,records:stored.records.length,characters:localStorage.getItem(api.CACHE_KEY).length,mode:stored.persistence.mode,now:Date.now()};},shape);
 assert.equal(persistedProof.records,1585);assert.equal(persistedProof.mode,'LOCAL_STORAGE_COMPACT');
 await page.reload({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.__review?.context()?.season?.ok,{timeout:30000});await page.locator('[data-workspace-target="roster"]').click();
 await page.evaluate(()=>window.__review.rerender()); assert.match(await page.locator('#rosterList').innerText(),/QB1/,'compact exact selected ranks visible after page reload');
 const reopened=await context.newPage();await reopened.clock.install({time:new Date(persistedProof.now)});await reopened.goto(origin,{waitUntil:'domcontentloaded'});await reopened.waitForFunction(()=>window.__review?.context()?.season?.ok,{timeout:30000});await reopened.locator('[data-workspace-target="roster"]').click();await reopened.evaluate(()=>window.__review.rerender());assert.match(await reopened.locator('#rosterList').innerText(),/QB1/,'new document in existing storage context consumes compact ranks');await reopened.close();
 assert.equal(rawDirectoryRequests,0,'browser review must not request raw Sleeper directory');

 // Presentation fixtures use production renderers; synthetic conditions are not device evidence.
 const visuals=await page.evaluate(()=>{
  const c=window.__review.context(),now=Date.now(),base={season:c.season,context:{season:2026,week:4,scoring:'HALF_PPR'},now,valid:true,live:true,api:{contextForTeam:()=>null},snapshot:{},records:[],actual:null,totals:Array.from({length:32},(_,i)=>10+i),gameTotals:Array.from({length:16},(_,i)=>30+i),scripts:Array.from({length:32},(_,i)=>i-16)};
  const card=(name,pos,team,opp,roof,injury='',state='PREGAME',points='13.0',rank=12)=>{
   const game={status:'VERIFIED',team,opponent:opp,home:team==='NO'||team==='CLE',roof,locked:state!=='PREGAME',gameState:state,impliedTeamTotal:21.3,spread:3,vegas:{status:'VERIFIED',expiresAt:now+600000,total:39.5,homeImpliedTotal:24.3,awayImpliedTotal:21.3},weather:{status:'VERIFIED',temperature:21,windKmh:10,gustKmh:20,precipitationProbability:0}};
   const m=window.__review.model({p:{id:name,name,pos,team,injury},seasonStatus:'ACTIVE'},{...base,api:{contextForTeam:()=>game}});m.score=state==='FINAL'?'6.4 → 9.0':state==='LIVE'?'10.6 → 7.4':injury==='Out'?'—':points;m.rank=rank?pos+rank:null;m.missingProspective=false;if(['FINAL','LIVE'].includes(state))m.actual={status:'VERIFIED'};if(state==='FINAL'){m.score=pos==='RB'?'10.6 → 18.6':'6.4 → 9.0';m.delta={value:pos==='RB'?8:2.6,grade:'POSITIVE',tolerance:2};}
   return window.__review.card(m,pos,pos.toLowerCase());
  };
  const html=[card('Christian Watson','WR','GB','TB','OUTDOOR'),card('Chris Olave','WR','NO','ATL','DOME','','PREGAME','15.4',4),card('Kenyon Sadiq','TE','NYJ','MIA','OUTDOOR','Questionable','PREGAME','8.8',null),card('Justin Jefferson','WR','MIN','CHI','DOME','Out','PREGAME','—',null),card('Quinshon Judkins','RB','CLE','PIT','OUTDOOR','','FINAL','10.6',23),card('Cleveland DST','DST','CLE','PIT','OUTDOOR','','FINAL','6.4',null),card('Harrison Mevis','K','LAR','ARI','DOME','','PREGAME','8.4',null),card('Minnesota DST','DST','MIN','CHI','OUTDOOR','','PREGAME','7.4',null),card('Zach Charbonnet','RB','SEA','LAC','OUTDOOR','PUP','PREGAME','—',null),card('Bucky Irving','RB','TB','GB','OUTDOOR','','PREGAME','14.7',19),card('Live fixture','RB','BUF','BAL','OUTDOOR','','LIVE','10.6',19),card('Locked fixture','QB','PIT','CLE','OUTDOOR','','UNKNOWN','17.0',3)].join('');
  document.body.innerHTML='<main class="shell"><section class="card"><h2>Kader</h2><div class="season-data-card is-healthy"><div class="season-data-compact">✓ Kader &lt; 1 Min. · ✓ Weekly 1 Min. · Daten aktuell</div></div><div id="visualRoster">'+html+'</div><h3>Start/Sit</h3><div class="notice ok"><b>LINEUP OPTIMAL</b></div><div class="start-sit-action"><b>1 ÄNDERUNG</b><span>↑ Downs starten</span><span>↓ Pickens Bank</span><b>+1.7</b></div></section></main>';
  return {cards:12,syntheticPresentation:true};
 });
 const mobile=[];
 for(const width of [360,390,430]){await page.setViewportSize({width,height:844});const metrics=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,nameMin:Math.min(...[...document.querySelectorAll('.roster-player-name')].map(e=>parseFloat(getComputedStyle(e).fontSize))),pointsMin:Math.min(...[...document.querySelectorAll('.roster-points')].map(e=>parseFloat(getComputedStyle(e).fontSize))),rowMin:Math.min(...[...document.querySelectorAll('.roster-signal')].map(e=>parseFloat(getComputedStyle(e).fontSize))),fullWidth:[...document.querySelectorAll('.roster-signal')].every(e=>{const card=e.closest('article');return Math.abs(e.getBoundingClientRect().left-card.getBoundingClientRect().left-parseFloat(getComputedStyle(card).paddingLeft)-1)<2}),heights:[...document.querySelectorAll('.roster-decision-card')].map(e=>({name:e.getAttribute('aria-label'),height:e.getBoundingClientRect().height})),tiny:document.querySelectorAll('.roster-decision-card .tiny').length}));assert.equal(metrics.overflow,false);assert(metrics.nameMin>=16.5&&metrics.pointsMin>=16&&metrics.rowMin>=14);assert.equal(metrics.tiny,0);assert.equal(metrics.fullWidth,true);const screenshot=path.join(output,'roster-'+width+'.png');await page.screenshot({path:screenshot,fullPage:true});mobile.push({width,...metrics,screenshot});}
 fs.writeFileSync(path.join(output,'mobile-review.json'),JSON.stringify({status:'PASS',...visuals,mobile,physicalAndroid:false},null,2));
 const receipt={mobile,rankPersistenceReload:persistedProof,refresh:{drainSteps,transientHolds,before:refreshBefore,final:refreshFinal},compactDirectoryRequests,rawDirectoryRequests,status:'PASS',browser:'Chromium desktop mobile emulation',viewport:'390x844',network:'all external responses mocked',checks:['real module startup','automatic Boone endpoint ingestion','Week-4 Sleeper state and current-week evidence','live/ranking/Start-Sit status areas','11 roster rows incl IR','async rerender routing','Waiver v3 mobile route','shipped D/ST Week 4/5/6 MONITOR and exact missing evidence','Trade v8 fail-closed mobile route','workspace clicks','no horizontal overflow','no duplicate starter grid','automatic four-minute ownership refresh with renewed visible age','independent expiry of stale projections','waiver projection-only suppression and ranked survivor','DST net ordering and team dedup','compact zero-evidence and future horizons','no uncaught errors'],physicalAndroid:false};fs.writeFileSync(path.join(output,'browser-review.json'),JSON.stringify(receipt,null,2));console.log(JSON.stringify(receipt));
}finally{await browser?.close();await new Promise(r=>server.close(r));}
