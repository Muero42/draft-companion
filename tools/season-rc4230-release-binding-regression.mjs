import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import assert from 'node:assert/strict';import crypto from 'node:crypto';import {execFileSync} from 'node:child_process';
import {RUNTIME_FILES} from './runtime-files.mjs';import {loadAuthority,validateAuthority} from './postmerge-authority-contract.mjs';import {rc4230Binding,rc4230FunctionalRuntime,rc4229AuthorityBeforeBinding} from './rc4230-release-baseline.mjs';
import {validateRc4230ProductionIdentity} from './rc4230-authority.mjs';
const f=rc4230Binding(),read=p=>fs.readFileSync(p,'utf8').replace(/\r\n/g,'\n'),historical=p=>execFileSync('git',['show',f.functionalHead+':'+p],{encoding:'utf8'}),blob=s=>{const b=Buffer.from(s);return crypto.createHash('sha1').update(Buffer.from('blob '+b.length+'\0')).update(b).digest('hex');};
assert.equal(RUNTIME_FILES.length,18);
const correction=f.diagnosticCorrection,baseApp=execFileSync('git',['show','fdab8774d63ea8e3ea142395f6f752f12168d90b:app.js'],{encoding:'utf8'});
assert.equal(correction.baseHead,'fdab8774d63ea8e3ea142395f6f752f12168d90b');assert(baseApp.includes(correction.old));assert(read('app.js').includes(correction.value));assert.equal(f.consensusCorrections.filter(p=>p.file==='app.js').reduce((text,p)=>text.replace(p.value,p.old),read('app.js')).replace(correction.value,correction.old),baseApp,'only diagnostic block changed from reviewed release');
for(const p of RUNTIME_FILES){assert.equal(blob(read(p)),f.runtimeBlobs[p]);assert.equal(rc4230FunctionalRuntime(read(p)),historical(p),'approved functional bytes '+p);assert.equal(blob(historical(p)),f.functionalBlobs[p]);}
for(const p of ['app.js','index.html','sw.js','manifest.webmanifest'])assert.deepEqual([...new Set(read(p).match(/v11\.8\.0-rc4\.\d+/g))],[f.version]);
for(const p of f.consensusCorrections){const prior=execFileSync('git',['show','b960186b389ab9beca1308769edf20abfd08b744:'+p.file],{encoding:'utf8'});assert(prior.includes(p.old));assert(read(p.file).includes(p.value));if(p.file!=='app.js')assert.equal(read(p.file).replace(p.value,p.old),prior,'exact rejection-precedence delta');}
const d=loadAuthority(),old=rc4229AuthorityBeforeBinding(d);assert.deepEqual(validateAuthority(d),[]);
assert.deepEqual(validateRc4230ProductionIdentity(d),[]);
// Mutate every component independently, bypassing fixture equality entirely.
let lineageNegatives=0;
for(const [file,path,fields] of [
  ['PITTI_CURRENT_STATE.json',['runtime','production_deployment'],['version','source_commit','tree','pr','deployment_id']],
  ['PITTI_COMMAND_CONTRACTS.json',['currentBoundary','productionDeployment'],['version','sourceCommit','tree','pr','deploymentId']],
  ['PITTI_EXECUTION_LOCK.json',['authority','liveVerificationTargets',0],['version','mergeCommit','runtimeTree','pr','deploymentId','reviewedHead']]
])for(const field of fields){const bad=structuredClone(d);let obj=bad[file];for(const key of path)obj=obj[key];obj[field]=field==='pr'?231:field.startsWith('deployment')?'ab7a9b02-d8e1-4244-969d-9ec3254798d4':'WRONG_RELEASE';assert(validateRc4230ProductionIdentity(bad).length,file+' '+field);lineageNegatives++;}
for(const field of ['sourceBaseline','failClosedRecovery'])for(const [from,to] of [
  ['PR232','PR231'],['0951da55-4845-49ec-ada3-550922c071e7','ab7a9b02-d8e1-4244-969d-9ec3254798d4'],
  ['v11.8.0-rc4.229 Production','v11.8.0-rc4.228 Production'],['a7f27740d33a7a39127d51515cc2fd8c3d9f28ff','WRONG_MAIN'],
  ['7c6984ea77f70fd56a261110225476047d93fdd1','WRONG_TREE'],['c5612d947512ebdb6dc8ec632c5cbbda4b883132','WRONG_REVIEWED_HEAD']
]){const bad=structuredClone(d);bad['PITTI_EXECUTION_LOCK.json'].authority[field]=bad['PITTI_EXECUTION_LOCK.json'].authority[field].replace(from,to);assert(validateRc4230ProductionIdentity(bad).length,field+' '+from);lineageNegatives++;}
console.log('RC4230_PRODUCTION_IDENTITY_PASS independent semantic tuple; '+lineageNegatives+' cross-release negatives');
for(const p of ['PITTI_CURRENT_STATE.json','PITTI_EXECUTION_LOCK.json','PITTI_COMMAND_CONTRACTS.json','PITTI_HANDOFF_SEAL.json'])assert.deepEqual(old[p],JSON.parse(historical(p)),p+' exact functional authority inverse');
assert.deepEqual(f.functionalSealIntegrity,JSON.parse(historical('PITTI_HANDOFF_SEAL.json')).integrity);
for(const key of ['auto','autoBlock','codexBudgetGuard'])assert.deepEqual(d['PITTI_COMMAND_CONTRACTS.json'][key],old['PITTI_COMMAND_CONTRACTS.json'][key]);
const c=d['PITTI_CURRENT_STATE.json'],production=c.runtime.production_deployment;
for(const candidate of [c.runtime_candidate,d['PITTI_EXECUTION_LOCK.json'].runtimeCandidate,d['PITTI_COMMAND_CONTRACTS.json'].currentBoundary.runtimeCandidate]){
  assert.deepEqual(candidate.preview_audit.accepted_conclusions,['STRUCTURAL_CANDIDATE','CONCLUSIVE_UNAVAILABLE']);assert.equal(candidate.preview_audit.ambiguous_acceptable,false);assert.equal(candidate.preview_audit.acceptance_proven,false);assert.equal(candidate.merge_eligible,false);
}
assert.equal(production.version,'v11.8.0-rc4.229');assert.equal(production.source_commit,'a7f27740d33a7a39127d51515cc2fd8c3d9f28ff');assert.equal(production.tree,'7c6984ea77f70fd56a261110225476047d93fdd1');assert.equal(production.deployment_id,'0951da55-4845-49ec-ada3-550922c071e7');assert.equal(production.pr,232);assert.equal(production.pr_state,'MERGED');assert.equal(production.device_acceptance_proven,false);
assert.equal(c.runtime.ci.strict,'307/307 PASS');assert.equal(c.runtime.ci.checks,'8/8 SUCCESS');assert.equal(c.runtime_candidate.published,false);assert.equal(c.runtime_candidate.deployed,false);assert.equal(c.runtime_candidate.merged,false);assert.equal(c.runtime_candidate.preview_audit.week,5);assert.equal(c.runtime_candidate.preview_audit.environment,'CLOUDFLARE_PR_PREVIEW');
for(const mutate of [x=>x.runtime_candidate.preview_audit.required=false,x=>x.runtime_candidate.preview_audit.acceptance_proven=true,x=>x.runtime_candidate.merge_eligible=true,x=>x.runtime_candidate.exact_head_ci='PASS',x=>x.runtime_candidate.cloud_validation='PASS',x=>x.runtime_candidate.published=true,x=>x.runtime_candidate.merged=true,x=>x.runtime_candidate.deployed=true,x=>x.runtime_candidate.adapter_implemented=true,x=>x.runtime.production_deployment.version='v11.8.0-rc4.230',x=>x.runtime.production_deployment.device_acceptance_proven=true]){const bad=structuredClone(d);mutate(bad['PITTI_CURRENT_STATE.json']);assert(validateAuthority(bad).length,'overclaim rejected');}
assert.equal(execFileSync('git',['ls-files','.pitti-cloud-output'],{encoding:'utf8'}).trim(),'');
const harness=fs.mkdtempSync(path.join(os.tmpdir(),'pitti-rc4230-no-git-'));
for(const file of execFileSync('git',['ls-files'],{encoding:'utf8'}).trim().split('\n')){if(file.startsWith('dist/'))continue;const target=path.join(harness,file);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(file,target);}
assert.equal(fs.existsSync(path.join(harness,'.git')),false);
const output=execFileSync(process.execPath,['tools/pitti_guardrail_check.mjs'],{cwd:harness,encoding:'utf8',env:{...process.env,PITTI_SKIP_SEAL_INTEGRITY:'0',PITTI_CANDIDATE_PREFLIGHT:'1'}});assert.match(output,/PITTI_GUARDRAILS_PASS/);
console.log('RC4230_RELEASE_BINDING_PASS 18 exact functional blobs; v306; Production rc229 PR232; unmerged unpublished rc230; mandatory exact-head CI AND real Week5 preview; 11 overclaim negatives; no-Git guardrail/seal PASS');
