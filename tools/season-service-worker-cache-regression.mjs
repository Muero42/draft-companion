import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const source=fs.readFileSync('sw.js','utf8');
function worker(scope='https://example.test/draft-companion/'){
  const buckets=new Map(),handlers={};let online=true,failAsset=null,quota=false,claimed=false,skipped=false;
  const absolute=input=>new URL(typeof input==='string'?input:input.url,scope).href;
  const cache=name=>{
    if(!buckets.has(name))buckets.set(name,new Map());const data=buckets.get(name);
    return{put:async(key,response)=>{if(quota)throw Error('quota');data.set(absolute(key),response.clone());},match:async key=>data.get(absolute(key))?.clone()};
  };
  const caches={open:async name=>cache(name),keys:async()=>[...buckets.keys()],delete:async name=>buckets.delete(name),match:async key=>{for(const data of buckets.values()){const hit=data.get(absolute(key));if(hit)return hit.clone();}}};
  const context={URL,Request,Response,Headers,caches,self:{registration:{scope},location:{origin:new URL(scope).origin},addEventListener:(name,fn)=>handlers[name]=fn,skipWaiting:async()=>{skipped=true;},clients:{claim:async()=>{claimed=true;}}},fetch:async request=>{if(!online)throw Error('offline');if(failAsset&&request.url.includes(failAsset))return new Response('failed',{status:503});return new Response('asset:'+new URL(request.url).pathname);}};
  vm.createContext(context);vm.runInContext(source,context);
  const lifecycle=async name=>{let done;handlers[name]({waitUntil:p=>{done=p;}});await done;};
  const request=async url=>{const pending=[];let result;handlers.fetch({request:new Request(absolute(url)),respondWith:p=>{result=p;},waitUntil:p=>pending.push(p)});const response=await result;await Promise.all(pending);return response;};
  return{scope,buckets,cache,lifecycle,request,setOnline:v=>online=v,setFailure:v=>failAsset=v,setQuota:v=>quota=v,get claimed(){return claimed;},get skipped(){return skipped;},handlers};
}

for(const scope of ['https://example.test/','https://example.test/draft-companion/']){
  const w=worker(scope);await w.lifecycle('install');assert(w.skipped);
  const current=[...w.buckets.keys()][0],shell=w.buckets.get(current),count=shell.size;assert.equal(count,12);
  for(let i=0;i<100;i++){
    assert.equal(await w.request('https://api.sleeper.app/v1/players/nfl?_='+i),undefined,'API uses normal network, never CacheStorage');
    assert.equal(await w.request('/api/expert-ranking?refresh='+i),undefined);
    assert.equal(await w.request('https://other.test/app.js?x='+i),undefined,'same filename on another origin is not runtime');
    await w.request('app.js?refresh='+i);
  }
  assert.equal(shell.size,count,'cache size remains bounded across reload URLs');
  await w.cache('draft-companion-v11.8.0-rc4.190').put('https://api.sleeper.app/v1/players/nfl?_=old',new Response('large old response'));
  await w.cache('draft-companion-backup-export-v1').put('/__backup_download/saved',new Response('user backup'));
  await w.cache('another-app').put('/other',new Response('unrelated data'));
  await w.lifecycle('activate');assert(w.claimed);
  assert(!w.buckets.has('draft-companion-v11.8.0-rc4.190'),'legacy unbounded cache removed');
  assert(w.buckets.has('another-app'),'unrelated cache preserved');
  w.setOnline(false);assert.equal(await(await w.request('/__backup_download/saved')).text(),'user backup');
  assert.equal(await(await w.request('app.js?refresh=offline')).text(),'asset:'+new URL('app.js',scope).pathname);
  assert.equal(await w.request('https://api.sleeper.app/v1/players/nfl?_=offline'),undefined,'offline cannot resurrect old live data');
  w.setOnline(true);w.setFailure('app.js');assert.equal((await w.request('app.js')).status,503);
  w.setOnline(false);assert.equal((await w.request('app.js')).status,200,'HTTP failures do not poison offline shell');
  w.setOnline(true);w.setFailure(null);w.setQuota(true);assert.equal((await w.request('app.js')).status,200,'quota does not discard online response');
}
const incomplete=worker();incomplete.setFailure('styles.css');await assert.rejects(()=>incomplete.lifecycle('install'));
assert.equal(incomplete.skipped,false,'incomplete install cannot replace working worker');
console.log('SEASON_SERVICE_WORKER_CACHE_PASS: bounded runtime, API bypass, scoped migration, backups, offline, quota and atomic installation');
