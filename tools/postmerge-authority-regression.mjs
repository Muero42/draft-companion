import fs from 'node:fs';import {execFileSync,spawnSync} from 'node:child_process';import {RUNTIME_FILES} from './runtime-files.mjs';import assert from 'node:assert/strict';import {MAIN,TREE,BASE,BASE_TREE,OBSERVED,CANONICAL,CANONICAL_TREE,PREVIOUS_MAIN,PREVIOUS_TREE,REVIEWED,PRODUCTION_DEPLOY,loadAuthority,validateAuthority,validateContinuationEvidence,validatePhysicalPrerequisites} from './postmerge-authority-contract.mjs';
const b=loadAuthority();assert.deepEqual(validateAuthority(b),[],'baseline v275 authority must validate');
const cases=[
 ['minor UI canonical head drift',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4223_minor_ui_source_production.merge_commit='f'.repeat(40)],
 ['minor UI physical overclaim',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4223_minor_ui_source_production.minor_ui_physical_test_proven=true],
 ['rc4223 core PASS lost',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4223_android_core_acceptance.acceptance='PENDING'],
 ['rc4223 core acceptance reopened',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4223_android_core_acceptance.functional_acceptance_reopened=true],
 ['rc4223 stale cloud head',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4223_source_production.merge_commit='f'.repeat(40)],
 ['rc4223 physical overclaim',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4223_source_production.physical_acceptance_proven=true],
 ['rc4223 reviewed tree drift',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4223_source_production.reviewed_tree='f'.repeat(40)],
 ['rc4223 wrong exact-head check',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4223_source_production.postmerge_check_runs[0].head='f'.repeat(40)],
 ['rc4223 fake browser scope',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4223_source_production.browser_scope='PHYSICAL_ANDROID'],
 ['rc4223 missing static parity',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4223_source_production.served_static_parity='NOT_PROVEN'],
 ['rc4222 stale cloud head',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4222_source_production.merge_commit='f'.repeat(40)],
 ['rc4222 physical overclaim',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4222_source_production.physical_acceptance_proven=true],
 ['rc4222 reviewed tree drift',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4222_source_production.reviewed_tree='f'.repeat(40)],
 ['rc4222 wrong exact-head check',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4222_source_production.postmerge_check_runs[0].head='f'.repeat(40)],
 ['rc4222 fake browser scope',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4222_source_production.browser_scope='PHYSICAL_ANDROID'],
 ['rc4222 missing static parity',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4222_source_production.served_static_parity='NOT_PROVEN'],
 ['rc4221 stale cloud head',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4221_source_production.merge_commit='f'.repeat(40)],
 ['rc4221 physical overclaim',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4221_source_production.physical_acceptance_proven=true],
 ['rc4221 reviewed tree drift',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4221_source_production.reviewed_tree='f'.repeat(40)],
 ['rc4221 wrong exact-head check',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4221_source_production.postmerge_check_runs[0].head='f'.repeat(40)],

 ['rc4220 stale cloud head',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4220_source_production.merge_commit='f'.repeat(40)],
 ['rc4220 physical overclaim',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4220_source_production.physical_acceptance_proven=true],
 ['rc4220 reviewed tree drift',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4220_source_production.reviewed_tree='f'.repeat(40)],
 ['rc4220 wrong exact-head check',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4220_source_production.postmerge_check_runs[0].head='f'.repeat(40)],

 ['rc4219 stale cloud head',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4219_source_production.merge_commit='f'.repeat(40)],
 ['rc4219 physical overclaim',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4219_source_production.physical_acceptance_proven=true],
 ['rc4219 stale browser output',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4219_source_production.transient_hold_empty=false],
 ['rc4219 reviewed tree drift',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4219_source_production.reviewed_tree='f'.repeat(40)],
 ['stale current physical alias',d=>d['PITTI_EXECUTION_LOCK.json'].runtime.currentPhysicalAcceptance.acceptance='FAIL'],
 ['stale camel-case Android alias',d=>d['PITTI_CURRENT_STATE.json'].runtime.androidAuthority='rc4.218 PHYSICAL PENDING'],
 ['review gate replacing physical classification',d=>d['PITTI_COMMAND_CONTRACTS.json'].currentBoundary.productionDeployment.physicalClassification='RC4219_LOCAL_ADVERSARIAL_REVIEW_PENDING'],
 ['historical source observation rewrite',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4218_source_production.observed_at='2026-10-02T08:11:29Z'],
 ['rc4218 canonical receipt drift',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4218_source_production.merge_commit='f'.repeat(40)],
 ['rc4218 raw startup regression',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4218_source_production.rawDirectoryRequests=1],
 ['rc4218 physical responsiveness overclaim',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4218_source_production.physical_responsiveness_proven=true],
 ['rc4218 strict receipt drift',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4218_source_production.cloud_strict='254/254 PASS'],
 ['candidate branch mismatch',d=>d['PITTI_CURRENT_STATE.json'].runtime_candidate.branch='codex/rc4218-mobile-refresh-responsiveness'],
 ['continuation branch mismatch',d=>d['PITTI_EXECUTION_LOCK.json'].authorityContinuation.published_branch='codex/rc4216-waiver-dst-decision-quality'],
 ['root cause overclaim',d=>d['PITTI_CURRENT_STATE.json'].runtime.latest_device_evidence.responsiveness='FAIL'],
 ['current main reverts',d=>d['PITTI_CURRENT_STATE.json'].authority.canonical_main=PREVIOUS_MAIN],
 ['Production reverts',d=>d['PITTI_CURRENT_STATE.json'].runtime.deployed_production_version='v11.8.0-rc4.216'],
 ['PR218 receipt changes',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4217_source_production.reviewed_head='f'.repeat(40)],
 ['root next action stale',d=>d['PITTI_COMMAND_CONTRACTS.json'].exactNextAction='Publish PR217'],
 ['generation',d=>d['PITTI_CURRENT_STATE.json'].handoff_generation='old'],
 ['main',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4215_source_production.merge_commit='a'.repeat(40)],
 ['tree',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4215_source_production.merged_tree='b'.repeat(40)],
 ['deployment',d=>d['PITTI_CURRENT_STATE.json'].runtime.production_deployment.deployment_id='wrong'],
 ['physical overclaim',d=>{d['PITTI_CURRENT_STATE.json'].runtime.current_physical_acceptance.proven=true;d['PITTI_CURRENT_STATE.json'].runtime.current_physical_acceptance.acceptance='FULL_PASS'}],
 ['source',d=>d['PITTI_CURRENT_STATE.json'].authority.source_candidate='v11.8.0-rc4.214'],
 ['source reverts to Production',d=>d['PITTI_CURRENT_STATE.json'].authority.source_candidate='v11.8.0-rc4.215'],
 ['lock reverts to Production',d=>d['PITTI_EXECUTION_LOCK.json'].runtime.appVersion='v11.8.0-rc4.215'],
 ['runtime/source mismatch',d=>d['app.js']=d['app.js'].replace("const APP_VERSION='v11.8.0-rc4.225'","const APP_VERSION='v11.8.0-rc4.224'")],
 ['published regresses to local',d=>d['PITTI_CURRENT_STATE.json'].runtime_candidate.status='PUBLISHED_PR_CANDIDATE'],
 ['candidate deployment proof missing',d=>d['PITTI_CURRENT_STATE.json'].runtime_candidate.production_proven=false],
 ['immutable candidate head',d=>d['PITTI_EXECUTION_LOCK.json'].runtimeCandidate.published_head='f'.repeat(40)],
 ['lock runtime',d=>d['PITTI_EXECUTION_LOCK.json'].runtime.appVersion='v11.8.0-rc4.214'],
 ['wrong CHI diagnosis',d=>d['PITTI_CURRENT_STATE.json'].historical_superseded.v280_before_rc4218.latest_device_evidence.positive.dst_opponents.CHI='NYG'],
 ['device invention',d=>d['PITTI_CURRENT_STATE.json'].runtime.latest_android_observed='v11.8.0-rc4.217'],
 ['postmerge CI overclaim',d=>d['PITTI_CURRENT_STATE.json'].runtime.ci.current_exact_main_head_ci='FAILED_AUTHORITY_DRIFT'],
 ['team total',d=>d['PITTI_CURRENT_STATE.json'].runtime.independent_evidence_lane_status.team_total='AVAILABLE'],
 ['premature physical',d=>d['PITTI_CURRENT_STATE.json'].authority_continuation.physical_executable=true],
 ['unexpected waiting gate',d=>d['PITTI_CURRENT_STATE.json'].auto_execution_state.waiting_external.push({gate:'RC4215_PRODUCTION_PHYSICAL_ACCEPTANCE_PENDING'})],
 ['candidate merge proof missing',d=>d['PITTI_CURRENT_STATE.json'].runtime_candidate.merged=false],
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
 ['PITTI_CURRENT_STATE.json','runtime.deployed_pages_app_byte_parity_with_main',false],
 ['PITTI_EXECUTION_LOCK.json','runtime.deployedPagesAppByteParityWithMain',false],
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
console.log(`POSTMERGE_AUTHORITY_REGRESSION_PASS generation=v297 mutations=${cases.length} external=6`);
assert.equal(RUNTIME_FILES.length,17);assert(fs.readFileSync('app.js','utf8').includes("const APP_VERSION='v11.8.0-rc4.225'"));
const initial225=JSON.parse(fs.readFileSync('tools/fixtures/rc4225/initial-runtime-blobs.json'));for(const file of RUNTIME_FILES)assert.equal(execFileSync('git',['rev-parse','d01f021ef2802df2467618412476cb26d8a05818:'+file],{encoding:'utf8'}).trim(),initial225[file],'initial RC4225 runtime receipt drift: '+file);
const runtime225=JSON.parse(fs.readFileSync('tools/fixtures/rc4225/runtime-blobs.json')),runtime224=JSON.parse(fs.readFileSync('tools/fixtures/rc4224/runtime-blobs.json')),runtime223=JSON.parse(fs.readFileSync('tools/fixtures/rc4223/runtime-blobs.json'));assert.deepEqual(Object.keys(runtime225).sort(),[...RUNTIME_FILES].sort());for(const file of RUNTIME_FILES){assert.equal(execFileSync('git',['hash-object','--path='+file,file],{encoding:'utf8'}).trim(),runtime225[file],'RC4225 candidate bytes drift: '+file);assert.equal(execFileSync('git',['rev-parse','9a4422a2b562ec0dc3688aa2b663f29709b9c3af:'+file],{encoding:'utf8'}).trim(),runtime224[file],'historical rc4224 identity changed: '+file);assert.equal(execFileSync('git',['rev-parse','977390b3c440de8f4e1e61aa4f6b9f064a2f0c2f:'+file],{encoding:'utf8'}).trim(),runtime223[file],'historical rc4223 receipt changed: '+file);if(!['app.js','index.html','styles.css','_worker.js','sw.js','manifest.webmanifest'].includes(file))assert.equal(runtime225[file],runtime224[file],'unrelated runtime changed: '+file);}
console.log('RC4225_RUNTIME_SCOPE_PASS manifest17, six bounded presentation/version/optional endpoint files, eleven unchanged; historical rc4223/224 retained');
for(const mode of ['candidate','main']){const env={...process.env,PITTI_SKIP_SEAL_INTEGRITY:'0'};delete env.PITTI_CANDIDATE_PREFLIGHT;if(mode==='candidate')env.PITTI_CANDIDATE_PREFLIGHT='1';const r=spawnSync(process.execPath,['tools/pitti_guardrail_check.mjs'],{encoding:'utf8',env});assert.equal(r.status,0,mode+' guardrail must pass with normal seal integrity: '+r.stdout+r.stderr);console.log('RC4222_'+mode.toUpperCase()+'_GUARDRAIL_PASS');}
const future='c'.repeat(40),physical={...ev,canonicalHead:CANONICAL,head:CANONICAL,ciHead:CANONICAL,canonicalTree:CANONICAL_TREE,publicationExactHeadPass:true,rc4225Merged:true,postmergeChecksPass:true,authorityParent:'d01f021ef2802df2467618412476cb26d8a05818',production:{status:'SUCCESS',sourceCommit:CANONICAL,tree:CANONICAL_TREE,deploymentId:'future-v275-deployment'},runtimeVersion:'v11.8.0-rc4.225',runtimeFileCount:17,reviewedCandidateHead:REVIEWED,runtimeIdentityBase:REVIEWED,runtimeBlobsIdentical:true};
assert.deepEqual(validatePhysicalPrerequisites(physical),[]);
assert(validatePhysicalPrerequisites({...physical,canonicalHead:'c7a509e6865ade6e56043f23b19e2577a3755293'}).length,'prior rc4217 canonical main cannot authorize rc4218 physical');
const muts=[e=>e.publicationExactHeadPass=false,e=>e.rc4225Merged=false,e=>e.postmergeChecksPass=false,e=>e.canonicalHead=MAIN,e=>e.canonicalTree=TREE,e=>e.production.status='PENDING',e=>e.production.sourceCommit=MAIN,e=>e.runtimeFileCount=16,e=>e.runtimeBlobsIdentical=false,e=>e.runtimeVersion='v11.8.0-rc4.214'];
for(const f of muts){const x=structuredClone(physical);f(x);assert(validatePhysicalPrerequisites(x).length,'premature/stale physical prerequisite accepted');}
console.log('RC4216_CONTINUATION_PASS authority-first physical prerequisite positive + '+muts.length+' negatives');
for(const head of ['e'.repeat(40),'f'.repeat(40)]){const x={...ev,branch:'codex/v275-rc4215-postmerge-authority',prState:'OPEN',head,prHead:head,ciHead:head};assert.deepEqual(validateContinuationEvidence(x),[]);assert(validateContinuationEvidence({...x,ciHead:OBSERVED}).length,'historical runtime CI cannot certify future authority PR');}
console.log('SELF_REFERENCE_SAFE_PASS dynamic future candidate head');
