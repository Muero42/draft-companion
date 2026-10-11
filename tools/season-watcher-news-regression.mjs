import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const app=fs.readFileSync('app.js','utf8'),at=Date.now();
const event={version:'a'.repeat(64),articleId:'123',playerId:'11628',headline:'Marvin Harrison Jr. trade rumors continue',sourceUrl:'https://www.espn.com/nfl/story/_/id/123/fixture',sourcePublishedAt:at-60000,sourceUpdatedAt:at-1000,observedAt:at,classification:'REPORT_REQUIRES_EVALUATION'};
const news={schema:'pitti.news-evidence.v1',status:'PASS',events:[event]};
let cache=[],feed={schema:'draft-companion.watcher-feed.v2',gate:{overall:'FAIL',market:'FAIL',player_state_status:'FAIL'},newsEvidence:news};
const c={Date,URL,AbortController,setTimeout,clearTimeout,Math,Number,String,Boolean,Set,
 WATCHER_FEED_URL:'https://watcher.test/companion-feed',WATCHER_SYNC_META_KEY:'meta',els:{watcherSyncStatus:{}},store:{set(){}},
 fetch:async()=>({ok:true,json:async()=>feed}),loadResearchEvents:()=>cache,saveResearchEvents:rows=>{cache=rows;return{ok:true};},
 updateResearchCacheStatus(){},queueSeasonRerender(){},clamp:(v,min,max)=>Math.min(max,Math.max(min,v)),norm:s=>String(s).toLowerCase()};
vm.createContext(c);
vm.runInContext(app.slice(app.indexOf('function evidenceIdentity('),app.indexOf('function updateResearchCacheStatus(')),c);
const start=app.indexOf('async function syncWatcherFeed(');vm.runInContext(app.slice(start,app.indexOf('\n/*',start)),c);
assert.equal(c.watcherNewsInputs(news,at).length,1);
for(const status of ['FAIL','STALE','DISABLED'])assert.equal(c.watcherNewsInputs({...news,status},at).length,0);
for(const change of [{sourcePublishedAt:0},{sourceUpdatedAt:at+1},{observedAt:at-2000},{sourceUrl:'https://evil.test'},{version:'bad'},{classification:'CONFIRMED'}])assert.equal(c.watcherNewsInputs({...news,events:[{...event,...change}]},at).length,0);
assert.equal((await c.syncWatcherFeed()).newsAdded,1,'news is independent of failed Market/Player lanes');
assert.equal(cache.length,1);assert.equal(cache[0].verified,false);assert.equal(cache[0].eventOccurredAt,null,'publication is not the event time');
assert.equal(c.researchEventsAt(at-1).length,0,'no hindsight before observed/version time');
assert.equal(c.actionableResearchEvents({id:'11628',name:'Marvin Harrison'}).length,0,'news cannot silently influence decisions');
assert.match(c.researchHint({id:'11628',name:'Marvin Harrison'}),/Nachrichtenhinweis/);
assert.equal((await c.syncWatcherFeed()).newsAdded,0,'repeat poll is idempotent');assert.equal(cache.length,1);
feed={...feed,newsEvidence:{...news,status:'FAIL',events:[]}};await c.syncWatcherFeed();assert.equal(cache.length,1,'outage preserves cache');
console.log('SEASON_WATCHER_NEWS_PASS');
