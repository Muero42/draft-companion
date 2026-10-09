import fs from 'node:fs';import crypto from 'node:crypto';import assert from 'node:assert/strict';import {execFileSync} from 'node:child_process';
import {RUNTIME_FILES} from './runtime-files.mjs';
import {loadAuthority,validateAuthority} from './postmerge-authority-contract.mjs';
import {rc4231Binding,rc4230RuntimeBeforeRepair,rc4230AuthorityBeforeRepair} from './rc4231-release-baseline.mjs';
const read=p=>fs.readFileSync(p,'utf8').replace(/\r\n/g,'\n'),f=rc4231Binding(),historical=p=>execFileSync('git',['show',f.parent+':'+p],{encoding:'utf8'}).replace(/\r\n/g,'\n');
const blob=s=>{const b=Buffer.from(s);return crypto.createHash('sha1').update(Buffer.from('blob '+b.length+'\0')).update(b).digest('hex')};
assert.equal(f.version,'v11.8.0-rc4.231');assert.equal(f.generation,'20261009T2010Z-v308');
assert.equal(f.baselineHead,'171933ed024525e5c3bb7df864ab07d3bc27bb82');assert.equal(f.parent,'3e352462b534a9b0a9233664ec4239e6a676b535');
assert.deepEqual(Object.keys(f.runtimeBlobs),[...RUNTIME_FILES]);assert.equal(RUNTIME_FILES.length,18);
assert.deepEqual(f.runtimePatches.map(p=>p.name),['seasonClearDecisionSurfaces','seasonRenderPassCurrent','queueSeasonRerender','bootstrap queue handoff','bootstrap owner guard','bootstrap acquisition ownership']);
const changed=[];
for(const p of RUNTIME_FILES){
  const current=read(p),old=historical(p);
  assert.equal(blob(current),f.runtimeBlobs[p],p+' successor manifest');assert.equal(blob(old),f.baselineBlobs[p],p+' immutable baseline');
  assert.equal(rc4230RuntimeBeforeRepair(current),old,p+' exact inverse; no unrelated changes');
  if(current!==old)changed.push(p);
}
assert.deepEqual(changed,['index.html','app.js','manifest.webmanifest','sw.js']);
for(const p of changed.filter(p=>p!=='app.js'))assert.equal(read(p).replaceAll(f.version,'v11.8.0-rc4.230'),historical(p),p+' version only');
for(const p of changed)assert.deepEqual([...new Set(read(p).match(/v11\.8\.0-rc4\.\d+/g))],[f.version]);
const d=loadAuthority();assert.deepEqual(validateAuthority(d),[]);
const previous=rc4230AuthorityBeforeRepair(d);assert.deepEqual(validateAuthority(previous),[]);
for(const p of Object.keys(previous))assert.deepEqual(typeof previous[p]==='string'?previous[p].replace(/\r\n/g,'\n'):previous[p],p.endsWith('.json')?JSON.parse(historical(p)):historical(p),p+' exact previous authority reconstruction');
for(const k of ['auto','autoBlock','codexBudgetGuard'])assert.deepEqual(d['PITTI_COMMAND_CONTRACTS.json'][k],previous['PITTI_COMMAND_CONTRACTS.json'][k],k+' permission boundary');
assert.equal(d['PITTI_CURRENT_STATE.json'].runtime.latest_device_evidence.classification,'USER_CONFIRMED_LOADING_NAVIGATION_PASS');
assert.equal(d['PITTI_CURRENT_STATE.json'].runtime.latest_device_evidence.full_product_acceptance,false);
assert.deepEqual(d['PITTI_CURRENT_STATE.json'].runtime.production_deployment,previous['PITTI_CURRENT_STATE.json'].runtime.production_deployment,'no new deployment receipt');
let negatives=0;
for(const file of ['PITTI_CURRENT_STATE.json','PITTI_EXECUTION_LOCK.json','PITTI_COMMAND_CONTRACTS.json','PITTI_HANDOFF_SEAL.json']){
  const bad=structuredClone(d);bad[file].handoff_generation='20261008T1818Z-v307';assert(validateAuthority(bad).length);negatives++;
}
for(const [file,path]of [['PITTI_CURRENT_STATE.json','runtime_candidate'],['PITTI_EXECUTION_LOCK.json','runtimeCandidate'],['PITTI_COMMAND_CONTRACTS.json','currentBoundary.runtimeCandidate'],['PITTI_HANDOFF_SEAL.json','runtime_candidate']]){
  for(const [key,value]of [['version','v11.8.0-rc4.230'],['published',true],['merged',true],['deployed',true],['physical_accepted',true],['production_proven',true],['merge_eligible',true],['publication_authorized',true],['exact_head_ci','PASS'],['parser_carry_forward_applies',true]]){
    const bad=structuredClone(d);let x=bad[file];for(const k of path.split('.'))x=x[k];x[key]=value;assert(validateAuthority(bad).length,file+' '+key);negatives++;
  }
}
for(const p of f.runtimePatches){
  const mutated=read('app.js').replace(p.value,p.value+'\n// unexpected runtime change');
  assert.notEqual(rc4230RuntimeBeforeRepair(mutated),historical('app.js'),'inverse must retain unapproved bytes');
}
console.log(`RC4231_RELEASE_BINDING_PASS: 18 runtime blobs, four deliberate differences (three version-only), exact historical inverse, ${negatives} authority negatives; local/unpublished/no carry-forward.`);
