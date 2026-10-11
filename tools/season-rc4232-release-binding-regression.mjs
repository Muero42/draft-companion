import {beforeNewsRuntime,beforeNewsAuthority} from './rc4233-news-baseline.mjs';
import fs from 'node:fs';import crypto from 'node:crypto';import assert from 'node:assert/strict';import {execFileSync} from 'node:child_process';
import {RUNTIME_FILES} from './runtime-files.mjs';
import {loadAuthority,validateAuthority} from './postmerge-authority-contract.mjs';
import {rc4232Binding,rc4231RuntimeBeforeDiagnostic,rc4231AuthorityBeforeDiagnostic} from './rc4232-release-baseline.mjs';
const read=p=>beforeNewsRuntime(fs.readFileSync(p,'utf8').replace(/\r\n/g,'\n')),f=rc4232Binding(),historical=p=>execFileSync('git',['show',f.parent+':'+p],{encoding:'utf8'}).replace(/\r\n/g,'\n');
const blob=s=>{const b=Buffer.from(s);return crypto.createHash('sha1').update(Buffer.from('blob '+b.length+'\0')).update(b).digest('hex')};
assert.equal(f.version,'v11.8.0-rc4.232');assert.equal(f.generation,'20261010T1302Z-v309');
assert.equal(f.baselineHead,'171933ed024525e5c3bb7df864ab07d3bc27bb82');assert.equal(f.parent,'52e441b620cd4c3ca8972f21067e7cd6386b61e5');
assert.deepEqual(Object.keys(f.runtimeBlobs),[...RUNTIME_FILES]);assert.equal(RUNTIME_FILES.length,18);
assert.equal(f.runtimePatches.length,31);
const changed=[];
for(const p of RUNTIME_FILES){
  const current=read(p),old=historical(p);
  assert.equal(blob(current),f.runtimeBlobs[p],p+' successor manifest');assert.equal(blob(old),f.baselineBlobs[p],p+' immutable baseline');
  assert.equal(rc4231RuntimeBeforeDiagnostic(current),old,p+' exact inverse; no unrelated changes');
  if(current!==old)changed.push(p);
}
assert.deepEqual(changed,['index.html','app.js','manifest.webmanifest','sw.js']);
for(const p of changed.filter(p=>p!=='app.js'))assert.equal(read(p).replaceAll(f.version,'v11.8.0-rc4.231'),historical(p),p+' version only');
for(const p of changed)assert.deepEqual([...new Set(read(p).match(/v11\.8\.0-rc4\.\d+/g))],[f.version]);
const d=beforeNewsAuthority(loadAuthority());assert.deepEqual(validateAuthority(d),[]);
const previous=rc4231AuthorityBeforeDiagnostic(d);assert.deepEqual(validateAuthority(previous),[]);
for(const p of Object.keys(previous))assert.deepEqual(typeof previous[p]==='string'?previous[p].replace(/\r\n/g,'\n'):previous[p],p.endsWith('.json')?JSON.parse(historical(p)):historical(p),p+' exact previous authority reconstruction');
for(const k of ['auto','autoBlock','codexBudgetGuard'])assert.deepEqual(d['PITTI_COMMAND_CONTRACTS.json'][k],previous['PITTI_COMMAND_CONTRACTS.json'][k],k+' permission boundary');
assert.equal(d['PITTI_CURRENT_STATE.json'].runtime.latest_device_evidence.classification,'SHARED_GENERIC_HOLD_PERSISTS_ON_BOTH_SURFACES');
assert.equal(d['PITTI_CURRENT_STATE.json'].runtime.latest_device_evidence.waiverTradesRepairAccepted,false);
assert.deepEqual(d['PITTI_CURRENT_STATE.json'].runtime.production_deployment,previous['PITTI_CURRENT_STATE.json'].runtime.production_deployment,'no new deployment receipt');
let negatives=0;
for(const file of ['PITTI_CURRENT_STATE.json','PITTI_EXECUTION_LOCK.json','PITTI_COMMAND_CONTRACTS.json','PITTI_HANDOFF_SEAL.json']){
  const bad=structuredClone(d);bad[file].handoff_generation='20261009T2010Z-v308';assert(validateAuthority(bad).length);negatives++;
}
for(const [file,path]of [['PITTI_CURRENT_STATE.json','runtime_candidate'],['PITTI_EXECUTION_LOCK.json','runtimeCandidate'],['PITTI_COMMAND_CONTRACTS.json','currentBoundary.runtimeCandidate'],['PITTI_HANDOFF_SEAL.json','runtime_candidate']]){
  for(const [key,value]of [['version','v11.8.0-rc4.231'],['published',true],['merged',true],['deployed',true],['physical_accepted',true],['production_proven',true],['merge_eligible',true],['publication_authorized',true],['exact_head_ci','PASS'],['parser_carry_forward_applies',true]]){
    const bad=structuredClone(d);let x=bad[file];for(const k of path.split('.'))x=x[k];x[key]=value;assert(validateAuthority(bad).length,file+' '+key);negatives++;
  }
}
for(const p of f.runtimePatches){
  const mutated=read('app.js').replace(p.value,p.value+'\n// unexpected runtime change');
  assert.notEqual(rc4231RuntimeBeforeDiagnostic(mutated),historical('app.js'),'inverse must retain unapproved bytes');
}
console.log(`RC4232_RELEASE_BINDING_PASS: 18 runtime blobs, four deliberate differences (three version-only), exact historical inverse, ${negatives} authority negatives; local/unpublished/no carry-forward.`);
