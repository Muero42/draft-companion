import fs from 'node:fs';
// Reuse the established cold/warm orchestration fixture without weakening its
// original assertions. Providers/scorers are stubbed; game validation is real.
const harness=fs.readFileSync('tools/season-decision-lifecycle-regression.mjs','utf8').split('// Preserve the pinned historical reproduction')[0];
const gameUrl=new URL('../game-context-v1.js',import.meta.url).href;
await import('data:text/javascript;base64,'+Buffer.from(harness+`
const game=(await import(${JSON.stringify(gameUrl)})).default;
async function setup({warm=false,slow=false}={}){
 const f=fixture({warm}),b=f.box,now=()=>b.Date.now(),start=now();
 const events=Array.from({length:13},(_,i)=>({id:String(i+1),date:new Date(start+(i===0?-3600000:86400000)).toISOString(),status:{type:{state:i===0?'in':'pre',completed:false}},competitions:[{venue:{fullName:'Field '+i,indoor:true},pittiAcquiredAt:start-70000,competitors:[{id:'h'+i,homeAway:'home',team:{abbreviation:'H'+i}},{id:'a'+i,homeAway:'away',team:{abbreviation:'A'+i}}],odds:[{overUnder:44,spread:0,details:'PK',provider:{id:'1',name:'fixture'}}]}]}));
 const payload={season:2026,week:5,events,sourceUrl:'https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?dates=2026'};
 b.PittiGameContextV1={...game,validateSnapshot:(s,c,t=now())=>game.validateSnapshot(s,c,t)};
 f.memory.set(game.CACHE_KEY,game.buildSnapshot({...payload,verifiedAt:start-70000}));
 b.seasonEvidenceContext=()=>({season:2026,week:5});b.persistSeasonWeeklyMetadata=(k,v)=>f.memory.set(k,v);
 let fetches=0,writes=0;const persist=b.persistSeasonWeeklyMetadata;b.persistSeasonWeeklyMetadata=(k,v)=>{writes++;persist(k,v)};
 b.fetch=async()=>{fetches++;return{ok:true,json:async()=>payload}};
 vm.runInContext('let seasonGameContextFlight=null;',b);
 if(app.includes('function seasonGameContextEquivalent('))vm.runInContext(source('seasonGameContextEquivalent'),b);
 vm.runInContext(source('refreshSeasonGameContext'),b);
 if(slow){const fa=b.renderRosterFaAudit,trade=b.renderTradeWorkspace,action=b.renderSeasonActionBoard;
  b.renderRosterFaAudit=()=>{f.setNow(now()+17200);return fa()};b.renderTradeWorkspace=()=>{f.setNow(now()+23300);return trade()};b.renderSeasonActionBoard=()=>{f.setNow(now()+2200);return action()};}
 await b.bootstrapSeasonWorkspace();await settle(f);
 return Object.assign(f,{payload,now,trace:()=>b.seasonRenderPassCurrent.diagnostic.snapshot(),counters:()=>({fetches,writes})});
}
// Historical reproduction: same response, no changed game data, full rerender.
const candidate=app;app=execFileSync('git',['show','670e0745a72e9b1acf38d2151928f0e73f7d1e7b:app.js'],{encoding:'utf8'}).replace(/\\r\\n/g,'\\n');
const prior=await setup({slow:true});prior.setNow(prior.now()+25000);
await prior.box.refreshSeasonGameContext({season:2026,week:5});await settle(prior);
assert(prior.stats().passes>1);assert(prior.trace().events.some(e=>e.event==='REQUEST'&&e.trigger==='game'));
console.log('GAME_REFRESH_REPRODUCED rc4234: identical background response requests another full pass.');app=candidate;
// A completed slow pass remains visible; no revision, write, pass, or freshness extension.
for(const warm of [false,true]){
 const f=await setup({warm,slow:true}),b=f.box,old=JSON.stringify(f.memory.get(game.CACHE_KEY)),revision=f.trace().revision,passes=f.stats().passes,waiver=f.els.waiverList.innerHTML,trade=f.els.tradeList.innerHTML;
 const deadline=b.seasonDecisionDeadline(b.lastDraftContext,f.now());f.setNow(f.now()+25000);
 await b.refreshSeasonGameContext({season:2026,week:5});await settle(f);
 assert.equal(f.trace().revision,revision);assert.equal(f.stats().passes,passes);assert.equal(f.counters().writes,0);
 assert.equal(JSON.stringify(f.memory.get(game.CACHE_KEY)),old);assert.equal(b.seasonDecisionDeadline(b.lastDraftContext,f.now()),deadline);
 assert.equal(f.els.waiverList.innerHTML,waiver);assert.equal(f.els.tradeList.innerHTML,trade);
 assert(f.trace().events.some(e=>e.event==='GAME_UNCHANGED'));assert(!waiver.includes('ACTIONABLE'));
 // Repeat refresh and navigate: neither starts a new decision pass.
 b.document={body:{dataset:{}},querySelectorAll:()=>[]};vm.runInContext(source('setWorkspace').split('// Startup-critical')[0],b);
 for(let i=0;i<3;i++){f.setNow(f.now()+10000);await b.refreshSeasonGameContext({season:2026,week:5});for(const name of ['waiver','trade','waiver'])b.setWorkspace(name);}
 assert.equal(f.stats().passes,passes);assert.equal(f.trace().revision,revision);assert.equal(f.counters().writes,0);
}
// All actual dependency changes and failures still invalidate synchronously.
for(const change of ['venue','state','odds','odds-unavailable','weather','source','http','network','expired-odds']){
 const f=await setup(),b=f.box,revision=f.trace().revision;
 const c=f.payload.events[1].competitions[0];
 if(change==='venue')c.venue.fullName='Other Field';if(change==='state')f.payload.events[0].status.type={state:'post',completed:true};
 if(change==='odds')c.odds[0].overUnder=48;if(change==='odds-unavailable')delete c.odds;if(change==='weather')c.venue.indoor=false;
 if(change==='source')f.payload.sourceUrl='https://cdn.espn.com/core/nfl/scoreboard';
 if(change==='http')b.fetch=async()=>({ok:false,json:async()=>({failureType:'UPSTREAM_UNAVAILABLE'})});
 if(change==='network')b.fetch=async()=>{throw Error('private upstream error')};
 if(change==='expired-odds')f.memory.get(game.CACHE_KEY).games[1].vegas.expiresAt=f.now();
 let release;b.seasonUiYield=()=>new Promise(r=>release=r);
 await b.refreshSeasonGameContext({season:2026,week:5});assert.equal(f.trace().revision,revision+1,change);
 assert.equal(f.els.waiverList.innerHTML,'');assert.equal(f.els.tradeList.innerHTML,'');assert.match(f.els.tradeStatus.textContent,/HOLD/);
 b.seasonUiYield=async()=>{};release();await settle(f);assert(!f.els.waiverList.innerHTML.includes('ACTIONABLE'));
}
// A response from a replaced league/context, even with the same season/week,
// cannot write or invalidate the replacement. Flights bind to context identity.
{
 const f=await setup(),b=f.box;let complete;b.fetch=()=>new Promise(r=>complete=r);
 const pending=b.refreshSeasonGameContext({season:2026,week:5}),old=JSON.stringify(f.memory.get(game.CACHE_KEY)),revision=f.trace().revision;
 b.lastDraftContext={...b.lastDraftContext,season:{...b.lastDraftContext.season,league_id:'other'}};
 complete({ok:true,json:async()=>f.payload});await pending;assert.equal(f.counters().writes,0);assert.equal(f.trace().revision,revision);assert.equal(JSON.stringify(f.memory.get(game.CACHE_KEY)),old);
}
// Equivalent game response cannot suppress a concurrent live/player update.
{
 const f=await setup(),b=f.box;let complete,requests=0;b.fetch=()=>{requests++;return new Promise(r=>complete=r)};
 const a=b.refreshSeasonGameContext({season:2026,week:5}),other=b.refreshSeasonGameContext({season:2026,week:5});
 assert.equal(requests,1,'same-context overlapping refreshes share the request');
 b.lastDraftContext.seasonRows[0].p.injury='OUT';b.queueSeasonRerender(false,'live');
 const revision=f.trace().revision;complete({ok:true,json:async()=>f.payload});await Promise.all([a,other]);await settle(f);
 assert.equal(f.trace().revision,revision);assert.equal(f.counters().writes,0);assert(f.stats().passes>1);
 vm.runInContext(source('seasonCurrentWeekEligibility'),b);b.seasonDstTeam=x=>x;b.lastDraftContext.seasonRows[0].p.team='H1';
 assert.equal(b.seasonCurrentWeekEligibility(b.lastDraftContext.seasonRows[0],b.lastDraftContext.season).eligible,false);
}
// An equivalent response during slow work must not create a duplicate pass;
// expiry still wins against that pass and retains the existing bounded retry.
for(const expire of [false,true]){
 const f=await setup(),b=f.box;let finish,started;const entered=new Promise(r=>started=r);let once=false;
 b.renderRosterFaAudit=async()=>{if(!once){once=true;started();await new Promise(r=>finish=r);}};
 const before=f.stats().passes;b.queueSeasonRerender(false,'weekly');await entered;
 if(expire)f.setNow(1100000);
 const revision=f.trace().revision;await b.refreshSeasonGameContext({season:2026,week:5});assert.equal(f.trace().revision,revision);
 finish();await settle(f);assert.equal(f.stats().passes,before+(expire?2:1));
 if(expire)assert(f.trace().events.some(e=>e.event==='EXPIRY_RETRY'));
}
// Comparison does not hide nested provenance/time changes or extend old TTLs.
{
 const f=await setup(),b=f.box,old=f.memory.get(game.CACHE_KEY),fresh=game.buildSnapshot({...f.payload,verifiedAt:f.now()});
 assert(b.seasonGameContextEquivalent(old,fresh,{season:2026,week:5},f.now()));
 for(const mutate of [s=>s.games[1].vegas.verifiedAt++,s=>s.games[1].vegas.expiresAt++,s=>s.games[1].sourceUrl+='&changed=1',s=>s.games[1].expiresAt=old.games[1].expiresAt-1,s=>s.expiresAt=old.expiresAt-1,s=>s.week=6]){
  const changed=structuredClone(fresh);mutate(changed);assert.equal(b.seasonGameContextEquivalent(old,changed,{season:2026,week:5},f.now()),false);
 }
 assert.equal(b.seasonGameContextEquivalent(old,fresh,{season:2026,week:5},old.expiresAt),false);
}
console.log('GAME_REFRESH_REVISION_PASS: identical/slow/repeated/navigation; changed state/odds/weather/source/failures; context, concurrent live update, expiry retry; no phantom authorization or TTL extension.');
`).toString('base64'));
