import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {RUNTIME_FILES} from './runtime-files.mjs';
import {loadAuthority,validateAuthority} from './postmerge-authority-contract.mjs';
import {gameRefreshBinding,gameRefreshBlob,beforeGameRefreshRuntime,beforeGameRefreshAuthority} from './rc4235-game-refresh-baseline.mjs';
const f=gameRefreshBinding(),read=p=>fs.readFileSync(p,'utf8').replace(/\r\n/g,'\n');
const historical=p=>execFileSync('git',['show',f.parent+':'+p],{encoding:'utf8'}).replace(/\r\n/g,'\n');
assert.equal(f.parent,'e1c9af929e9c0080321e0e44876852e848942114');
assert.equal(f.version,'v11.8.0-rc4.235');assert.equal(f.generation,'20261011T2214Z-v312');
assert.deepEqual(Object.keys(f.runtimeBlobs),[...RUNTIME_FILES]);
const changed=[];
for(const p of RUNTIME_FILES){
 const actual=read(p),old=historical(p);
 assert.equal(gameRefreshBlob(actual),f.runtimeBlobs[p],p+' current bytes');assert.equal(gameRefreshBlob(old),f.baselineBlobs[p],p+' immutable parent');
 assert.equal(beforeGameRefreshRuntime(actual),old,p+' exact parent reconstruction');
 if(actual!==old)changed.push(p);
}
assert.deepEqual(changed,['index.html','app.js','manifest.webmanifest','sw.js']);
for(const p of changed.filter(p=>p!=='app.js'))assert.equal(read(p).replaceAll(f.version,'v11.8.0-rc4.234'),historical(p),p+' version only');
const d=loadAuthority();assert.deepEqual(validateAuthority(d),[]);
const old=beforeGameRefreshAuthority(d);assert.deepEqual(validateAuthority(old),[]);
for(const [p,v]of Object.entries(old))assert.deepEqual(typeof v==='string'?v.replace(/\r\n/g,'\n'):v,p.endsWith('.json')?JSON.parse(historical(p)):historical(p),p+' authority reconstruction');
assert.deepEqual(d['PITTI_COMMAND_CONTRACTS.json'].codexBudgetGuard,old['PITTI_COMMAND_CONTRACTS.json'].codexBudgetGuard);
assert.deepEqual(d['PITTI_CURRENT_STATE.json'].runtime.production_deployment,old['PITTI_CURRENT_STATE.json'].runtime.production_deployment);
assert.deepEqual(d['PITTI_CURRENT_STATE.json'].runtime.latest_device_evidence,old['PITTI_CURRENT_STATE.json'].runtime.latest_device_evidence);
let negatives=0;
for(const [p,path]of [['PITTI_CURRENT_STATE.json','runtime_candidate'],['PITTI_EXECUTION_LOCK.json','runtimeCandidate'],['PITTI_COMMAND_CONTRACTS.json','currentBoundary.runtimeCandidate'],['PITTI_HANDOFF_SEAL.json','runtime_candidate']]){
 for(const key of ['published','deployed','merged','physical_accepted','publication_authorized','merge_authorized','news_source_activated','background_push_proven']){
  const bad=structuredClone(d);let c=bad[p];for(const k of path.split('.'))c=c[k];c[key]=true;assert(validateAuthority(bad).length,p+' false promotion '+key);negatives++;
 }
}
for(const patch of f.runtimePatches){
 const mutated=read('app.js').replace(patch.value,patch.value+'\n// unrelated mutation\n');
 assert.notEqual(beforeGameRefreshRuntime(mutated),historical('app.js'),'inverse cannot hide extra bytes');
 const bad=structuredClone(d);bad['app.js']=mutated;assert(validateAuthority(bad).length);negatives++;
}
const missing=structuredClone(d);missing['app.js']=historical('app.js');assert(validateAuthority(missing).length);negatives++;
console.log(`GAME_REFRESH_BINDING_PASS: 18 runtime files, exact parent/authority inversion, ${negatives} negative cases; no inherited Production acceptance.`);
