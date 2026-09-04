// Offline browser contract: all external requests are fixture responses, never live league data.
import fs from 'node:fs';import path from 'node:path';import http from 'node:http';import assert from 'node:assert/strict';import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{chromium}=require(process.env.PITTI_PLAYWRIGHT||'playwright');
const root=process.cwd(),output=process.argv[2];if(!output)throw Error('Explicit output directory required');fs.mkdirSync(output,{recursive:true});
const rows=[['q','QB'],['r','RB'],['w1','WR'],['w2','WR'],['t','TE'],['w3','WR'],['r2','RB'],['k','K'],['d','DEF'],['b','RB'],['ir','RB'],['fa','RB']];
const players=Object.fromEntries(rows.map(([id,position])=>[id,{full_name:'Fixture '+id,position,team:'BUF',active:true,status:'Active',search_rank:50,bye_week:7}]));
const rosters=Array.from({length:10},(_,i)=>({roster_id:i+1,owner_id:'u'+i,players:i===0?rows.slice(0,11).map(x=>x[0]):[],starters:i===0?rows.slice(0,9).map(x=>x[0]):[],reserve:i===0?['ir']:[],taxi:[],settings:{waiver_budget_used:0}}));
const league={league_id:'fixture',season:'2026',total_rosters:10,settings:{leg:2,waiver_budget:100},roster_positions:['QB','RB','WR','WR','TE','FLEX','WRRB_FLEX','K','DEF',...Array(6).fill('BN')]};
const server=http.createServer((req,res)=>{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname),file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));if(!file.startsWith(root+path.sep)||!fs.existsSync(file)){res.writeHead(404).end();return;}res.setHeader('content-type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.html')?'text/html':'application/json');let body=fs.readFileSync(file);if(file===path.join(root,'app.js'))body=body.toString()+"\nwindow.__review={context:()=>lastDraftContext,rerender:rerenderPostDraftFromContext,news:seasonNewsReactions};";res.end(body);});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
let browser;try{
 browser=await chromium.launch({headless:true,...(process.env.PITTI_BROWSER?{executablePath:process.env.PITTI_BROWSER}:{})});
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,serviceWorkers:'block'}),page=await context.newPage(),errors=[],failedRequests=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('requestfailed',r=>failedRequests.push({url:r.url(),error:r.failure()?.errorText}));
 await page.clock.install();
 // This scenario models online fixture responses even when the host namespace has no network.
 await page.addInitScript(()=>Object.defineProperty(navigator,'onLine',{configurable:true,get:()=>true}));
 await page.route('**/*',route=>{const u=new URL(route.request().url());if(u.origin===origin)return route.continue();let body={};if(u.hostname==='api.sleeper.app'){if(u.pathname.endsWith('/players/nfl'))body=players;else if(u.pathname.endsWith('/rosters'))body=rosters;else if(u.pathname.endsWith('/users'))body=rosters.map(r=>({user_id:r.owner_id,display_name:r.owner_id}));else if(u.pathname.includes('/transactions/'))body=[];else if(u.pathname.endsWith('/picks'))body=[];else if(u.pathname.includes('/draft/'))body={draft_id:'1366053132970233856',league_id:'fixture',slot_to_roster_id:{9:1},settings:{teams:10,rounds:15}};else body=league;}return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(body)});});
 await page.addInitScript(()=>{localStorage.setItem('v118_seasonLeagueId','fixture');localStorage.setItem('v118_seasonUserId','u0');const now=Date.now();localStorage.setItem('v190_seasonEvidence',JSON.stringify(['projected_points','weekly_rank'].map(metric=>({playerId:'q',metric,value:metric==='weekly_rank'?3:17,season:2026,week:2,scoring:'HALF_PPR',status:'VERIFIED',confidence:.9,sourceId:'fixture',sourceUrl:'https://example.test/data',publishedAt:now-1000,verifiedAt:now-500,expiresAt:now+60000}))));});
 await page.goto(origin,{waitUntil:'domcontentloaded'});try{await page.waitForFunction(()=>window.__review?.context()?.season?.ok,{timeout:30000});}catch(error){const diagnostic={errors,failedRequests,body:(await page.locator('body').innerText()).slice(0,16000)};fs.writeFileSync(path.join(output,'startup-failure.json'),JSON.stringify(diagnostic,null,2));console.error(JSON.stringify(diagnostic));throw error;}
 assert.match(await page.locator('#rosterList').innerText(),/W2 QB 3.*17 Pkt/);
 assert.equal(await page.locator('#rosterList .lineup-row').count(),11);
 await page.evaluate(()=>window.__review.rerender());
 assert.equal(await page.locator('#rosterFaList').isVisible(),false);
 assert.equal(await page.locator('#rosterSummary').isVisible(),false);
 assert.equal(await page.locator('#rosterBenchList').innerText().then(t=>t.includes('Fixture q')),false,'starter grid must not repeat compact roster');
 for(const workspace of ['waiver','trade','live','roster']){const button=page.locator('[data-workspace-target="'+workspace+'"]');assert.equal(await button.count(),1);await button.click();assert.equal(await page.locator('[data-workspace="'+workspace+'"]').first().isVisible(),true);}
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'mobile horizontal overflow');
 assert.deepEqual(errors,[],'uncaught runtime errors');
 await page.screenshot({path:path.join(output,'season-mobile.png'),fullPage:true});
 await page.clock.fastForward(300010);
 assert.match(await page.locator('#waiverStatus').textContent(),/HOLD.*abgelaufen/);
 assert.match(await page.locator('#tradeStatus').textContent(),/HOLD.*abgelaufen/);
 assert.doesNotMatch(await page.locator('#rosterList').innerText(),/17 Pkt/,'expired projections removed without user interaction');
 const receipt={status:'PASS',browser:'Chromium desktop mobile emulation',viewport:'390x844',network:'all external responses mocked',checks:['real module startup','initial current-week evidence','11 roster rows incl IR','async rerender routing','workspace clicks','no horizontal overflow','no duplicate starter grid','automatic expiry of projections and ownership','no uncaught errors'],physicalAndroid:false};fs.writeFileSync(path.join(output,'browser-review.json'),JSON.stringify(receipt,null,2));console.log(JSON.stringify(receipt));
}finally{await browser?.close();await new Promise(r=>server.close(r));}
