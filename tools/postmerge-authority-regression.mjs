import fs from 'node:fs';import {execFileSync,spawnSync} from 'node:child_process';import {RUNTIME_FILES} from './runtime-files.mjs';import assert from 'node:assert/strict';import {MAIN,TREE,BASE,BASE_TREE,OBSERVED,loadAuthority,validateAuthority,validateContinuationEvidence,validatePhysicalPrerequisites} from './postmerge-authority-contract.mjs';
const b=loadAuthority();assert.deepEqual(validateAuthority(b),[],'baseline v275 authority must validate');
const cases=[
 ['generation',d=>d['PITTI_CURRENT_STATE.json'].handoff_generation='old'],
 ['main',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4215_source_production.merge_commit='a'.repeat(40)],
 ['tree',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4215_source_production.merged_tree='b'.repeat(40)],
 ['deployment',d=>d['PITTI_CURRENT_STATE.json'].runtime.production_deployment.deployment_id='wrong'],
 ['physical overclaim',d=>{d['PITTI_CURRENT_STATE.json'].runtime.current_physical_acceptance.proven=true;d['PITTI_CURRENT_STATE.json'].runtime.current_physical_acceptance.acceptance='PASS'}],
 ['source',d=>d['PITTI_CURRENT_STATE.json'].authority.source_candidate='v11.8.0-rc4.214'],
 ['source reverts to Production',d=>d['PITTI_CURRENT_STATE.json'].authority.source_candidate='v11.8.0-rc4.215'],
 ['lock reverts to Production',d=>d['PITTI_EXECUTION_LOCK.json'].runtime.appVersion='v11.8.0-rc4.215'],
 ['runtime/source mismatch',d=>d['app.js']=d['app.js'].replace("const APP_VERSION='v11.8.0-rc4.216'","const APP_VERSION='v11.8.0-rc4.217'")],
 ['published regresses to local',d=>d['PITTI_CURRENT_STATE.json'].runtime_candidate.status='LOCAL_UNPUBLISHED'],
 ['candidate deployment invented',d=>d['PITTI_CURRENT_STATE.json'].runtime_candidate.production_proven=false],
 ['immutable candidate head',d=>d['PITTI_EXECUTION_LOCK.json'].runtimeCandidate.published_head='f'.repeat(40)],
 ['lock runtime',d=>d['PITTI_EXECUTION_LOCK.json'].runtime.appVersion='v11.8.0-rc4.214'],
 ['device invention',d=>d['PITTI_CURRENT_STATE.json'].runtime.latest_android_observed='v11.8.0-rc4.216'],
 ['postmerge CI overclaim',d=>d['PITTI_CURRENT_STATE.json'].runtime.ci.current_exact_main_head_ci='FAILED_AUTHORITY_DRIFT'],
 ['team total',d=>d['PITTI_CURRENT_STATE.json'].runtime.independent_evidence_lane_status.team_total='AVAILABLE'],
 ['premature physical',d=>d['PITTI_CURRENT_STATE.json'].authority_continuation.physical_executable=true],
 ['wrong waiting gate',d=>d['PITTI_CURRENT_STATE.json'].auto_execution_state.waiting_external[0].gate='RC4215_PRODUCTION_PHYSICAL_ACCEPTANCE_PENDING'],
 ['candidate merge',d=>d['PITTI_CURRENT_STATE.json'].runtime_candidate.merged=false],
 ['candidate physical',d=>d['PITTI_EXECUTION_LOCK.json'].runtimeCandidate.physical_accepted=true],
 ['immutable authority head',d=>d['PITTI_HANDOFF_SEAL.json'].authority_continuation.canonical_main='f'.repeat(40)],
 ['old action',d=>d['PITTI_COMMAND_CONTRACTS.json'].currentBoundary.exactNextAction='create rc4.215 PR'],
 ['old gate prose',d=>d['README.md']='RC4215_PR_EXACT_HEAD_CI_PENDING\n'+d['README.md']],
 ['seal',d=>d['PITTI_HANDOFF_SEAL.json'].exact_gate='DONE'],
 ['repair dst',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4215_source_production.repair_scope.dst='CHANGED'],
 ['repair retry',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4215_source_production.repair_scope.provider_retry='RELAXED']
];
for(const[n,f]of cases){const d=structuredClone(b);f(d);assert(validateAuthority(d).length,`must reject ${n}`)}

const aliasMutations=[
 ['PITTI_EXECUTION_LOCK.json','status','V274_RC4215_PR_EXACT_HEAD_CI_PENDING'],
 ['PITTI_EXECUTION_LOCK.json','authority.reconciledBaseMain','a1e6c0e4ca22a4709353840d78414f2ba6d3d5ee'],
 ['PITTI_CURRENT_STATE.json','authority.reconciled_base_main','faa6d37971fd6149b039f1b6c5a6106c5e978f10'],
 ['PITTI_COMMAND_CONTRACTS.json','currentBoundary.reconciledBaseMain','a1e6c0e4ca22a4709353840d78414f2ba6d3d5ee'],
 ['PITTI_EXECUTION_LOCK.json','runtime.latestSourceRegressionVerified','PR213 rc4.214 PASS'],
 ['PITTI_EXECUTION_LOCK.json','runtime.latestDeployedCandidate','rc4.215 unmerged/nonproduction'],
 ['PITTI_EXECUTION_LOCK.json','runtime.androidAuthority','rc4.215 is local only'],
 ['PITTI_EXECUTION_LOCK.json','runtime.android_authority','rc4.215 is local only'],
 ['PITTI_EXECUTION_LOCK.json','runtime.deployedPagesVersion','v11.8.0-rc4.214'],
 ['PITTI_EXECUTION_LOCK.json','runtime.deployedPagesHead','a1e6c0e4ca22a4709353840d78414f2ba6d3d5ee'],
 ['PITTI_CURRENT_STATE.json','runtime.deployed_pages_head','a1e6c0e4ca22a4709353840d78414f2ba6d3d5ee'],
 ['PITTI_COMMAND_CONTRACTS.json','currentBoundary.deployedPagesVersion','v11.8.0-rc4.214'],
 ['PITTI_COMMAND_CONTRACTS.json','currentBoundary.runtimeVersion','v11.8.0-rc4.214'],
 ['PITTI_COMMAND_CONTRACTS.json','currentBoundary.currentResearchGate','RC4215_PR_EXACT_HEAD_CI_PENDING'],
 ['PITTI_COMMAND_CONTRACTS.json','seasonCompanion.nextGate','RC4215_PR_EXACT_HEAD_CI_PENDING'],
 ['PITTI_CURRENT_STATE.json','runtime.source_candidate_status','RELEASE_CANDIDATE_VALIDATING'],
 ['PITTI_CURRENT_STATE.json','runtime.package_reference_scope','rc4.214 CURRENT'],
 ['PITTI_CURRENT_STATE.json','runtime.local_candidate_package.version','v11.8.0-rc4.214'],
 ['PITTI_EXECUTION_LOCK.json','runtime.localCandidatePackage.version','v11.8.0-rc4.214'],
 ['PITTI_COMMAND_CONTRACTS.json','currentBoundary.localCandidatePackage.version','v11.8.0-rc4.214'],
 ['PITTI_COMMAND_CONTRACTS.json','currentBoundary.latestPackageReextract','NEW_REEXTRACTION_PASS'],
 ['PITTI_COMMAND_CONTRACTS.json','currentBoundary.deploymentParity','PR213 SUCCESS'],
 ['PITTI_CURRENT_STATE.json','runtime.deployed_pages_app_byte_parity_with_main',true],
 ['PITTI_EXECUTION_LOCK.json','runtime.deployedPagesAppByteParityWithMain',true],
 ['PITTI_CURRENT_STATE.json','runtime.mainGhPagesParity',true],
 ['PITTI_CURRENT_STATE.json','runtime.local_candidate_package.sha256','invented'],
 ['PITTI_HANDOFF_SEAL.json','note','rc4.215 is local only'],
 ['PITTI_CURRENT_STATE.json','runtime.latest_device_evidence.version','v11.8.0-rc4.214'],
 ['PITTI_CURRENT_STATE.json','runtime.latest_device_evidence.acceptance','PASS'],
 ['PITTI_CURRENT_STATE.json','runtime.last_broad_physical_evidence_baseline.version','v11.8.0-rc4.215'],
 ['PITTI_CURRENT_STATE.json','authority.rc4214_source_production.pr',215]
];
for(const [file,path,value] of aliasMutations){const d=structuredClone(b),keys=path.split('.'),leaf=keys.pop();let o=d[file];for(const key of keys)o=o[key];o[leaf]=value;assert(validateAuthority(d).length,'must reject stale/current or invented alias '+path);}
// Explicit historical sections are evidence, never current aliases to rewrite.
for(const file of ['HANDOFF_COMPLETENESS_MATRIX.md','NEW_CHAT_HANDOFF_CURRENT.md','PITTI_AUTO_PREFLIGHT.md','PITTI_NEW_CHAT_BOOTSTRAP.md','PITTI_PROJECT_STATE.md','README.md']){const d=structuredClone(b);d[file]+='\n## HISTORICAL regression fixture\nrc4.214 / V274_RC4215_PR_EXACT_HEAD_CI_PENDING / RC4215_PR_EXACT_HEAD_CI_PENDING / rc4.215 is local only\n';assert.deepEqual(validateAuthority(d),[],'historical prose must remain allowed');}
console.log('CURRENT_ALIAS_REGRESSION_PASS '+aliasMutations.length+' negatives; physical/history and historical document positives');

const h='a'.repeat(40),ev={fresh:true,repo:'Muero42/draft-companion',canonicalBranch:'main',canonicalHead:h,head:h,clean:true,branch:'main',prState:'MERGED',containingCommitVerified:true,ciHead:h,authorizedWorkPackage:true,checks:['project_guardrails','release_contract_v2','candidate_package'].map(name=>({name,result:'PASS'}))};
assert.deepEqual(validateContinuationEvidence(ev),[]);
for(const f of[x=>x.fresh=false,x=>x.clean=false,x=>x.containingCommitVerified=false,x=>x.ciHead='b'.repeat(40),x=>x.authorizedWorkPackage=false,x=>x.checks.push({name:'project_guardrails',result:'PASS'})]){const x=structuredClone(ev);f(x);assert(validateContinuationEvidence(x).length)}
console.log(`POSTMERGE_AUTHORITY_REGRESSION_PASS generation=v278 mutations=${cases.length} external=6`);
assert.equal(RUNTIME_FILES.length,17);assert(fs.readFileSync('app.js','utf8').includes("const APP_VERSION='v11.8.0-rc4.216'"),'runtime must remain rc4.215');
const published='f08ea197e4252aabe0d3e024c4b1078deda02f82';
for(const file of RUNTIME_FILES)assert.equal(execFileSync('git',['rev-parse',published+':'+file],{encoding:'utf8'}).trim(),execFileSync('git',['hash-object','--path='+file,file],{encoding:'utf8'}).trim(),'published runtime changed: '+file);
console.log('RC4216_RUNTIME_IDENTITY_PASS 17/17 identical to published '+published);
for(const mode of ['candidate','main']){const env={...process.env,PITTI_SKIP_SEAL_INTEGRITY:'0'};delete env.PITTI_CANDIDATE_PREFLIGHT;if(mode==='candidate')env.PITTI_CANDIDATE_PREFLIGHT='1';const r=spawnSync(process.execPath,['tools/pitti_guardrail_check.mjs'],{encoding:'utf8',env});assert.equal(r.status,0,mode+' guardrail must pass with normal seal integrity: '+r.stdout+r.stderr);console.log('PR217_'+mode.toUpperCase()+'_GUARDRAIL_PASS');}
const future='c'.repeat(40),physical={...ev,canonicalHead:future,head:future,ciHead:future,canonicalTree:'d'.repeat(40),publicationExactHeadPass:true,rc4216Merged:true,postmergeChecksPass:true,authorityParent:BASE,production:{status:'SUCCESS',sourceCommit:future,tree:'d'.repeat(40),deploymentId:'future-v275-deployment'},runtimeVersion:'v11.8.0-rc4.216',runtimeFileCount:17,reviewedCandidateHead:OBSERVED,runtimeIdentityBase:OBSERVED,runtimeBlobsIdentical:true};
assert.deepEqual(validatePhysicalPrerequisites(physical),[]);
const muts=[e=>e.publicationExactHeadPass=false,e=>e.rc4216Merged=false,e=>e.postmergeChecksPass=false,e=>e.canonicalHead=BASE,e=>e.canonicalTree=BASE_TREE,e=>e.production.status='PENDING',e=>e.production.sourceCommit=MAIN,e=>e.runtimeFileCount=16,e=>e.runtimeBlobsIdentical=false,e=>e.runtimeVersion='v11.8.0-rc4.214'];
for(const f of muts){const x=structuredClone(physical);f(x);assert(validatePhysicalPrerequisites(x).length,'premature/stale physical prerequisite accepted');}
console.log('RC4216_CONTINUATION_PASS authority-first physical prerequisite positive + '+muts.length+' negatives');
for(const head of ['e'.repeat(40),'f'.repeat(40)]){const x={...ev,branch:'codex/v275-rc4215-postmerge-authority',prState:'OPEN',head,prHead:head,ciHead:head};assert.deepEqual(validateContinuationEvidence(x),[]);assert(validateContinuationEvidence({...x,ciHead:OBSERVED}).length,'historical runtime CI cannot certify future authority PR');}
console.log('SELF_REFERENCE_SAFE_PASS dynamic future candidate head');
