import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const source=fs.readFileSync('sw.js','utf8');

function harness(sequence=[]){
  const handlers={},calls=[];
  const fetch=async request=>{
    calls.push(request.url);
    const next=sequence.shift();
    if(next==='ABORT')return await new Promise((resolve,reject)=>{
      request.signal?.addEventListener('abort',()=>{const error=new Error('aborted');error.name='AbortError';reject(error);},{once:true});
    });
    if(next==='BODY_STALL')return new Response(new ReadableStream({start(controller){
      request.signal?.addEventListener('abort',()=>{const error=new Error('aborted body');error.name='AbortError';controller.error(error);},{once:true});
    }}),{status:200,headers:{'content-type':'application/json'}});
    if(next instanceof Response)return next;
    return new Response(JSON.stringify({ok:true}),{status:200,headers:{'content-type':'application/json'}});
  };
  let timerId=0;
  const context={
    URL,Request,Response,Headers,AbortController,JSON,
    fetch,
    setTimeout(fn){const id=++timerId;queueMicrotask(fn);return id;},
    clearTimeout(){},
    caches:{open:async()=>({put:async()=>{},match:async()=>null}),keys:async()=>[],delete:async()=>true},
    self:{registration:{scope:'https://example.test/'},location:{origin:'https://example.test'},clients:{claim:async()=>{}},skipWaiting:async()=>{},addEventListener:(name,fn)=>handlers[name]=fn}
  };
  vm.createContext(context);vm.runInContext(source,context);
  const request=async url=>{
    let result;
    handlers.fetch({request:new Request(url),respondWith:p=>{result=p;},waitUntil:()=>{}});
    return result?await result:undefined;
  };
  return{request,calls};
}

{
  const h=harness(['BODY_STALL']);
  const path=encodeURIComponent('/nfl/2026/consensus-rankings?week=1&position=TE&scoring=HALF');
  const response=await h.request(`https://example.test/api/fantasypros?path=${path}`);
  assert.equal(response.status,504,'headers without a completed body remain inside the rank deadline');
  assert.match(await response.text(),/FANTASYPROS_RANK_TIMEOUT/);
  assert.equal(h.calls.length,1,'a stalled rank body must not add a retry');
}

{
  const h=harness(['ABORT']);
  const path=encodeURIComponent('/nfl/2026/consensus-rankings?week=1&position=RB&scoring=HALF');
  const response=await h.request(`https://example.test/api/fantasypros?path=${path}`);
  assert.equal(response.status,504,'optional weekly rank latency must fail fast instead of blocking projection persistence');
  assert.match(await response.text(),/FANTASYPROS_RANK_TIMEOUT/);
  assert.equal(h.calls.length,1,'rank lane must stay bounded to one upstream attempt');
}

{
  const h=harness([new Response('upstream failed',{status:503}),new Response('{"players":[]}',{status:200,headers:{'content-type':'application/json'}})]);
  const path=encodeURIComponent('/nfl/2026/projections?week=1&position=RB&ros=false');
  const response=await h.request(`https://example.test/api/fantasypros?path=${path}`);
  assert.equal(response.status,200,'projection lane gets one bounded retry on transient 5xx');
  assert.equal(h.calls.length,2,'projection retry count must remain bounded');
}

{
  const h=harness([new Response('rate limited',{status:429})]);
  const path=encodeURIComponent('/nfl/2026/projections?week=1&position=WR&ros=false');
  const response=await h.request(`https://example.test/api/fantasypros?path=${path}`);
  assert.equal(response.status,429,'429 must preserve provider backoff semantics');
  assert.equal(h.calls.length,1,'429 must not be retried by the service worker');
}

{
  const h=harness([]);
  const response=await h.request('https://example.test/api/nfl-week-context?season=2026&week=1');
  assert.equal(response,undefined,'unrelated live APIs must continue bypassing CacheStorage/service-worker proxy logic');
}

console.log('SEASON_FP_PROXY_RESILIENCE_PASS: ranks fail fast, projections retry once, 429/backoff and unrelated APIs preserved');
