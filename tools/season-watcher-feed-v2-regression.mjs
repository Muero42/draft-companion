import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const app=fs.readFileSync('app.js','utf8');
const start=app.indexOf('async function syncWatcherFeed(');
const end=app.indexOf('\n/*',start);
assert(start>=0&&end>start,'watcher sync implementation is present');
const syncSource=app.slice(start,end);

async function run(feed){
  const writes=[],ingested=[];
  const context={
    AbortController,clearTimeout,setTimeout,
    WATCHER_FEED_URL:'https://watcher.test/companion-feed',WATCHER_SYNC_META_KEY:'watcher-meta',
    els:{watcherSyncStatus:{}},
    fetch:async()=>({ok:true,json:async()=>feed}),
    store:{set:(key,value)=>writes.push({key,value})},
    watcherEvidenceInput:row=>({id:`watcher_${row.id}`,playerId:String(row.player_id||''),critical:false}),
    appendResearchEvidence:input=>{ingested.push(input);return{added:true,event:input}},
    seasonEvidenceContext:()=>({season:2026,week:1,scoring:'HALF_PPR'}),
    seasonEvidenceValue:()=>({status:'UNAVAILABLE'}),
    rerenderPostDraftFromContext:()=>{},updateResearchCacheStatus:()=>{}
  };
  vm.createContext(context);vm.runInContext(syncSource,context);
  return{result:await context.syncWatcherFeed(),writes,ingested,status:context.els.watcherSyncStatus};
}

const event={id:'evt-1',player_id:'player-1'};
const pass=await run({schema:'draft-companion.watcher-feed.v2',gate:{overall:'PASS'},events:[event]});
assert.equal(pass.result.ok,true);assert.equal(pass.result.gate,'PASS');assert.equal(pass.result.added,1);
assert.equal(pass.ingested.length,1,'v2 PASS reaches existing research ingestion');
assert(!pass.writes.some(x=>x.key==='v190_seasonEvidence'),'v2 without seasonEvidence cannot populate weekly metrics');

const failed=await run({schema:'draft-companion.watcher-feed.v2',gate:{overall:'FAIL'},events:[event]});
assert.equal(failed.result.ok,false);assert.equal(failed.result.gate,'FAIL');
assert.equal(failed.ingested.length,0,'v2 FAIL cannot ingest research evidence');

for(const schema of ['draft-companion.watcher-feed.v3','unknown',null]){
  const unsupported=await run({schema,gate:{overall:'PASS'},events:[event]});
  assert.equal(unsupported.result.ok,false);assert.equal(unsupported.result.gate,'UNAVAILABLE');assert.equal(unsupported.result.added,0);
  assert.equal(unsupported.ingested.length,0,'unsupported schema cannot ingest research evidence');
}

const legacy=await run({schema:'draft-companion.watcher-feed.v1',gate:{overall:'PASS'},events:[event]});
assert.equal(legacy.ingested.length,1,'the previously supported exact v1 schema remains compatible');
console.log('SEASON_WATCHER_FEED_V2_PASS');
