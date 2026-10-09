import {rc4230RuntimeBeforeRepair,rc4230AuthorityBeforeRepair} from './rc4231-release-baseline.mjs';
import {rc4230PremergeAuthority,rc4230PostmergeBinding} from './rc4230-postmerge-authority.mjs';
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import assert from 'node:assert/strict';import crypto from 'node:crypto';import {execFileSync} from 'node:child_process';
import {RUNTIME_FILES} from './runtime-files.mjs';import {loadAuthority,validateAuthority} from './postmerge-authority-contract.mjs';import {rc4230Binding,rc4230FunctionalRuntime,rc4229AuthorityBeforeBinding} from './rc4230-release-baseline.mjs';
import {validateRc4230ProductionIdentity} from './rc4230-authority.mjs';
const f=rc4230Binding(),read=p=>rc4230RuntimeBeforeRepair(fs.readFileSync(p,'utf8').replace(/\r\n/g,'\n')),historical=p=>execFileSync('git',['show',f.functionalHead+':'+p],{encoding:'utf8'}),blob=s=>{const b=Buffer.from(s);return crypto.createHash('sha1').update(Buffer.from('blob '+b.length+'\0')).update(b).digest('hex');};
assert.equal(RUNTIME_FILES.length,18);
const correction=f.diagnosticCorrection,baseApp=execFileSync('git',['show','fdab8774d63ea8e3ea142395f6f752f12168d90b:app.js'],{encoding:'utf8'});
assert.equal(correction.baseHead,'fdab8774d63ea8e3ea142395f6f752f12168d90b');assert(baseApp.includes(correction.old));assert(read('app.js').includes(correction.value));assert.equal(f.consensusCorrections.filter(p=>p.file==='app.js').reduce((text,p)=>text.replace(p.value,p.old),read('app.js')).replace(correction.value,correction.old),baseApp,'only diagnostic block changed from reviewed release');
for(const p of RUNTIME_FILES){assert.equal(blob(read(p)),f.runtimeBlobs[p]);assert.equal(rc4230FunctionalRuntime(read(p)),historical(p),'approved functional bytes '+p);assert.equal(blob(historical(p)),f.functionalBlobs[p]);}
for(const p of ['app.js','index.html','sw.js','manifest.webmanifest'])assert.deepEqual([...new Set(read(p).match(/v11\.8\.0-rc4\.\d+/g))],[f.version]);
for(const p of f.consensusCorrections){const prior=execFileSync('git',['show','b960186b389ab9beca1308769edf20abfd08b744:'+p.file],{encoding:'utf8'});assert(prior.includes(p.old));assert(read(p.file).includes(p.value));if(p.file!=='app.js')assert.equal(read(p.file).replace(p.value,p.old),prior,'exact rejection-precedence delta');}
// One-time carry-forward is pinned to this parent evidence and these exact parser bytes.
const carry=f.parserOnlyEvidenceCarryForward,evidence=JSON.parse(read(carry.evidenceFile));
assert.equal(carry.sourceHead,'5a09c23499933933249ad62406fdbaf3796ccac8');assert.equal(evidence.sourceHead,carry.sourceHead);assert.equal(blob(read(carry.evidenceFile)),carry.evidenceBlob);assert.equal(blob(read('app.js')),carry.correctedAppBlob);
assert.equal(carry.scope,'ONE_TIME_EXACT_PARSER_BYTES_ONLY');assert.equal(carry.diagnosticOutcome,'FILTER_NOT_HONORED');assert.equal(carry.acceptedConclusion,'CONCLUSIVE_ROUTE_UNUSABLE');assert.equal(carry.expertUnavailableClaim,false);assert.equal(carry.acceptanceProven,true);assert.equal(carry.newLivePreviewRequired,false);
for(const key of ['requestBehaviorMustMatchSourceHead','exactHeadCloudRequired','localStrictRequired','postCommitReviewRequired'])assert.equal(carry[key],true);
const parentParserApp=execFileSync('git',['show',carry.sourceHead+':app.js'],{encoding:'utf8'}),withoutParser=x=>x.slice(0,x.indexOf('function seasonConsensusFilterShape'))+'PARSER'+x.slice(x.indexOf('// RC4229 nested route shape research:'));assert.equal(withoutParser(read('app.js')),withoutParser(parentParserApp),'only consensus response parser/classification changed');
console.log('RC4230_ONE_TIME_CARRY_FORWARD_PASS pinned parent/evidence/parser; negative route-unusable only; exact-head cloud still required');
const postmerge=rc4230AuthorityBeforeRepair(loadAuthority()),d=rc4230PremergeAuthority(postmerge),old=rc4229AuthorityBeforeBinding(d);assert.deepEqual(validateAuthority(d),[]);
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
  assert.deepEqual(candidate.preview_audit.accepted_conclusions,['STRUCTURAL_CANDIDATE','CONCLUSIVE_UNAVAILABLE','CONCLUSIVE_ROUTE_UNUSABLE']);assert.equal(candidate.preview_audit.ambiguous_acceptable,false);assert.equal(candidate.preview_audit.acceptance_proven,true);assert.equal(candidate.merge_eligible,true);
}
assert.equal(production.version,'v11.8.0-rc4.229');assert.equal(production.source_commit,'a7f27740d33a7a39127d51515cc2fd8c3d9f28ff');assert.equal(production.tree,'7c6984ea77f70fd56a261110225476047d93fdd1');assert.equal(production.deployment_id,'0951da55-4845-49ec-ada3-550922c071e7');assert.equal(production.pr,232);assert.equal(production.pr_state,'MERGED');assert.equal(production.device_acceptance_proven,false);
assert.equal(c.runtime.ci.strict,'307/307 PASS');assert.equal(c.runtime.ci.checks,'8/8 SUCCESS');assert.equal(c.runtime_candidate.published,true);assert.equal(c.runtime_candidate.deployed,false);assert.equal(c.runtime_candidate.merged,false);assert.equal(c.runtime_candidate.preview_audit.week,5);assert.equal(c.runtime_candidate.preview_audit.environment,'CLOUDFLARE_PR_PREVIEW');
for(const mutate of [x=>x.runtime_candidate.preview_audit.required=false,x=>x.runtime_candidate.preview_audit.acceptance_proven=false,x=>x.runtime_candidate.merge_eligible=false,x=>x.runtime_candidate.exact_head_ci='PENDING',x=>x.runtime_candidate.cloud_validation='PENDING',x=>x.runtime_candidate.published=false,x=>x.runtime_candidate.merged=true,x=>x.runtime_candidate.deployed=true,x=>x.runtime_candidate.adapter_implemented=true,x=>x.runtime.production_deployment.version='v11.8.0-rc4.230',x=>x.runtime.production_deployment.device_acceptance_proven=true]){const bad=structuredClone(d);mutate(bad['PITTI_CURRENT_STATE.json']);assert(validateAuthority(bad).length,'overclaim rejected');}
assert.equal(execFileSync('git',['ls-files','.pitti-cloud-output'],{encoding:'utf8'}).trim(),'');
// Canonical postmerge layer preserves the exact previous checkpoint and runtime.
assert.deepEqual(validateAuthority(postmerge),[]);const pm=rc4230PostmergeBinding();
for(const p of ['PITTI_CURRENT_STATE.json','PITTI_EXECUTION_LOCK.json','PITTI_COMMAND_CONTRACTS.json','PITTI_HANDOFF_SEAL.json'])assert.deepEqual(d[p],JSON.parse(execFileSync('git',['show',pm.main+':'+p],{encoding:'utf8'})),'exact premerge authority reconstruction');
for(const p of RUNTIME_FILES)assert.equal(read(p),execFileSync('git',['show',pm.main+':'+p],{encoding:'utf8'}),'canonical runtime unchanged');
assert.match(pm.generation,/^20261008T\d{4}Z-v307$/);assert.equal(postmerge['PITTI_CURRENT_STATE.json'].handoff_generation,pm.generation);
let postmergeNegatives=0;for(const [file,path]of [['PITTI_CURRENT_STATE.json','runtime_candidate'],['PITTI_EXECUTION_LOCK.json','runtimeCandidate'],['PITTI_COMMAND_CONTRACTS.json','currentBoundary.runtimeCandidate'],['PITTI_HANDOFF_SEAL.json','runtime_candidate']])for(const mutate of [x=>x.merge_commit='WRONG',x=>x.canonical_tree='WRONG',x=>x.production_deployment.deployment_id='WRONG',x=>x.postmerge_ci='FAIL',x=>x.cloudflare_status='FAIL',x=>x.physical_accepted=true,x=>x.adapter_implemented=true,x=>x.persistence_enabled=true,x=>x.consumer_enabled=true,x=>x.pr_state='OPEN',x=>x.production_deployment.version='v11.8.0-rc4.229']){const bad=structuredClone(postmerge);let x=bad[file];for(const k of path.split('.'))x=x[k];mutate(x);assert(validateAuthority(bad).length);postmergeNegatives++;}
console.log('RC4230_POSTMERGE_PASS '+postmergeNegatives+' negatives; exact18 canonical blobs; v307; v306 reconstructed; physical unproven');
// Authority-only reconciliation must leave every runtime blob identical to the verified published head.
for(const p of RUNTIME_FILES)assert.equal(read(p),execFileSync('git',['show','0af2fe5736d77e4bdba14d3e03cb4e7057092da2:'+p],{encoding:'utf8'}),'published runtime unchanged '+p);
assert.equal(f.generation,'20261006T0836Z-v306');assert.equal(f.generationDecision,'KEEP_V306_EXISTING_RC4230_RELEASE_CONTRACT_NO_GENERATION_INCREMENT_REQUIRED');
let receiptNegatives=0;
for(const [file,path]of [['PITTI_CURRENT_STATE.json','runtime_candidate'],['PITTI_EXECUTION_LOCK.json','runtimeCandidate'],['PITTI_COMMAND_CONTRACTS.json','currentBoundary.runtimeCandidate'],['PITTI_HANDOFF_SEAL.json','runtime_candidate']])for(const mutate of [x=>x.merged=true,x=>x.deployed=true,x=>x.physical_accepted=true,x=>x.adapter_implemented=true,x=>x.expert_unavailable_claim=true,x=>x.merge_authorized=true,x=>x.published_head='WRONG',x=>x.tree_sha='WRONG',x=>x.exact_head_ci='PENDING',x=>x.cloud_validation='PENDING',x=>x.preview_audit.source_head='WRONG',x=>x.preview_audit.request_behavior_unchanged=false,x=>x.preview_audit.expertUnavailableClaim=true]){const bad=structuredClone(d);let target=bad[file];for(const k of path.split('.'))target=target[k];mutate(target);assert(validateAuthority(bad).length,'reject unsafe receipt');receiptNegatives++;}
console.log('RC4230_AUTHORITY_RECONCILIATION_PASS '+receiptNegatives+' negatives; 18 exact published runtime blobs; v306 retained; merge unauthorized');
const harness=fs.mkdtempSync(path.join(os.tmpdir(),'pitti-rc4230-no-git-'));
for(const file of execFileSync('git',['ls-files'],{encoding:'utf8'}).trim().split('\n')){if(file.startsWith('dist/'))continue;const target=path.join(harness,file);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(file,target);}
assert.equal(fs.existsSync(path.join(harness,'.git')),false);
const output=execFileSync(process.execPath,['tools/pitti_guardrail_check.mjs'],{cwd:harness,encoding:'utf8',env:{...process.env,PITTI_SKIP_SEAL_INTEGRITY:'0',PITTI_CANDIDATE_PREFLIGHT:'1'}});assert.match(output,/PITTI_GUARDRAILS_PASS/);
console.log('RC4230_RELEASE_BINDING_PASS 18 exact functional blobs; v306; Production rc229 PR232; published unmerged rc230; exact-head receipt and one-time evidence satisfied; successor cloud required; 11 overclaim negatives; no-Git guardrail/seal PASS');
