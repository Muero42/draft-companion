import fs from 'node:fs';import {execFileSync,spawnSync} from 'node:child_process';import {RUNTIME_FILES} from './runtime-files.mjs';import assert from 'node:assert/strict';import {MAIN,TREE,BASE,BASE_TREE,OBSERVED,loadAuthority,validateAuthority,validateContinuationEvidence,validatePhysicalPrerequisites} from './postmerge-authority-contract.mjs';
const b=loadAuthority();assert.deepEqual(validateAuthority(b),[],'baseline v275 authority must validate');
const cases=[
 ['generation',d=>d['PITTI_CURRENT_STATE.json'].handoff_generation='old'],
 ['main',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4215_source_production.merge_commit='a'.repeat(40)],
 ['tree',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4215_source_production.merged_tree='b'.repeat(40)],
 ['deployment',d=>d['PITTI_CURRENT_STATE.json'].runtime.production_deployment.deployment_id='wrong'],
 ['physical overclaim',d=>{d['PITTI_CURRENT_STATE.json'].runtime.current_physical_acceptance.proven=true;d['PITTI_CURRENT_STATE.json'].runtime.current_physical_acceptance.acceptance='PASS'}],
 ['source',d=>d['PITTI_CURRENT_STATE.json'].authority.source_candidate='v11.8.0-rc4.214'],
 ['lock runtime',d=>d['PITTI_EXECUTION_LOCK.json'].runtime.appVersion='v11.8.0-rc4.214'],
 ['device invention',d=>d['PITTI_CURRENT_STATE.json'].runtime.latest_android_observed='v11.8.0-rc4.215'],
 ['postmerge CI overclaim',d=>d['PITTI_CURRENT_STATE.json'].runtime.ci.current_exact_main_head_ci='PASS'],
 ['team total',d=>d['PITTI_CURRENT_STATE.json'].runtime.independent_evidence_lane_status.team_total='AVAILABLE'],
 ['premature physical',d=>d['PITTI_CURRENT_STATE.json'].authority_continuation.physical_executable=true],
 ['wrong waiting gate',d=>d['PITTI_CURRENT_STATE.json'].auto_execution_state.waiting_external[0].gate='RC4215_PRODUCTION_PHYSICAL_ACCEPTANCE_PENDING'],
 ['candidate merge',d=>d['PITTI_CURRENT_STATE.json'].runtime_candidate.merged=false],
 ['candidate physical',d=>d['PITTI_EXECUTION_LOCK.json'].runtimeCandidate.physical_accepted=true],
 ['immutable authority head',d=>d['PITTI_HANDOFF_SEAL.json'].authority_continuation.published_head='f'.repeat(40)],
 ['old action',d=>d['PITTI_COMMAND_CONTRACTS.json'].currentBoundary.exactNextAction='create rc4.215 PR'],
 ['old gate prose',d=>d['README.md']='RC4215_PR_EXACT_HEAD_CI_PENDING\n'+d['README.md']],
 ['seal',d=>d['PITTI_HANDOFF_SEAL.json'].exact_gate='DONE'],
 ['repair dst',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4215_source_production.repair_scope.dst='CHANGED'],
 ['repair retry',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4215_source_production.repair_scope.provider_retry='RELAXED']
];
for(const[n,f]of cases){const d=structuredClone(b);f(d);assert(validateAuthority(d).length,`must reject ${n}`)}
const h='a'.repeat(40),ev={fresh:true,repo:'Muero42/draft-companion',canonicalBranch:'main',canonicalHead:h,head:h,clean:true,branch:'main',prState:'MERGED',containingCommitVerified:true,ciHead:h,authorizedWorkPackage:true,checks:['project_guardrails','release_contract_v2','candidate_package'].map(name=>({name,result:'PASS'}))};
assert.deepEqual(validateContinuationEvidence(ev),[]);
for(const f of[x=>x.fresh=false,x=>x.clean=false,x=>x.containingCommitVerified=false,x=>x.ciHead='b'.repeat(40),x=>x.authorizedWorkPackage=false,x=>x.checks.push({name:'project_guardrails',result:'PASS'})]){const x=structuredClone(ev);f(x);assert(validateContinuationEvidence(x).length)}
console.log(`POSTMERGE_AUTHORITY_REGRESSION_PASS generation=v275 mutations=${cases.length} external=6`);
assert.equal(RUNTIME_FILES.length,17);assert(fs.readFileSync('app.js','utf8').includes("const APP_VERSION='v11.8.0-rc4.215'"),'runtime must remain rc4.215');
const p=spawnSync('git',['cat-file','-e',OBSERVED+'^{commit}'],{encoding:'utf8'});if(p.error)throw p.error;if(p.status!==0){assert.equal(execFileSync('git',['rev-parse','--is-shallow-repository'],{encoding:'utf8'}).trim(),'true');execFileSync('git',['fetch','--no-tags','--depth=1','origin',OBSERVED],{stdio:'inherit'});}
for(const file of RUNTIME_FILES){const expected=execFileSync('git',['rev-parse',OBSERVED+':'+file],{encoding:'utf8'}).trim(),actual=execFileSync('git',['hash-object','--path='+file,file],{encoding:'utf8'}).trim();assert.equal(actual,expected,'authority-only runtime blob changed: '+file);}
console.log('RC4215_RUNTIME_SCOPE_PASS all 17 runtime files identical to reviewed PR215 head '+OBSERVED);
const future='c'.repeat(40),physical={...ev,canonicalHead:future,head:future,ciHead:future,canonicalTree:'d'.repeat(40),publicationExactHeadPass:true,rc4215Merged:true,v275AuthorityMerged:true,postmergeChecksPass:true,authorityParent:BASE,production:{status:'SUCCESS',sourceCommit:future,tree:'d'.repeat(40),deploymentId:'future-v275-deployment'},runtimeVersion:'v11.8.0-rc4.215',runtimeFileCount:17,reviewedCandidateHead:OBSERVED,runtimeIdentityBase:OBSERVED,runtimeBlobsIdentical:true};
assert.deepEqual(validatePhysicalPrerequisites(physical),[]);
const muts=[e=>e.publicationExactHeadPass=false,e=>e.v275AuthorityMerged=false,e=>e.postmergeChecksPass=false,e=>e.canonicalHead=BASE,e=>e.canonicalTree=BASE_TREE,e=>e.production.status='PENDING',e=>e.production.sourceCommit=MAIN,e=>e.runtimeFileCount=16,e=>e.runtimeBlobsIdentical=false,e=>e.runtimeVersion='v11.8.0-rc4.214'];
for(const f of muts){const x=structuredClone(physical);f(x);assert(validatePhysicalPrerequisites(x).length,'premature/stale physical prerequisite accepted');}
console.log('V275_CONTINUATION_PASS authority-first physical prerequisite positive + '+muts.length+' negatives');
for(const head of ['e'.repeat(40),'f'.repeat(40)]){const x={...ev,branch:'codex/v275-rc4215-postmerge-authority',prState:'OPEN',head,prHead:head,ciHead:head};assert.deepEqual(validateContinuationEvidence(x),[]);assert(validateContinuationEvidence({...x,ciHead:OBSERVED}).length,'historical runtime CI cannot certify future authority PR');}
console.log('SELF_REFERENCE_SAFE_PASS v275 dynamic authority head');
