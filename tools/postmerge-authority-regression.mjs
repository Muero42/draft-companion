import fs from 'node:fs';
import {execFileSync,spawnSync} from 'node:child_process';import {RUNTIME_FILES} from './runtime-files.mjs';import {MAIN,BASE,BASE_TREE,OBSERVED} from './postmerge-authority-contract.mjs';
import assert from 'node:assert/strict';import {loadAuthority,validateAuthority,validateContinuationEvidence,validatePhysicalPrerequisites} from './postmerge-authority-contract.mjs';
const b=loadAuthority();assert.deepEqual(validateAuthority(b),[],'baseline v274 authority must validate');
const cases=[
 ['generation',d=>d['PITTI_CURRENT_STATE.json'].handoff_generation='old'],
 ['main',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4214_source_production.merge_commit='a'.repeat(40)],
 ['tree',d=>d['PITTI_CURRENT_STATE.json'].runtime.current_physical_acceptance.tree='b'.repeat(40)],
 ['deployment',d=>d['PITTI_CURRENT_STATE.json'].runtime.production_deployment.deployment_id='wrong'],
 ['physical overclaim',d=>{d['PITTI_CURRENT_STATE.json'].runtime.current_physical_acceptance.proven=true;d['PITTI_CURRENT_STATE.json'].runtime.current_physical_acceptance.acceptance='PASS'}],
 ['app blob',d=>d['PITTI_CURRENT_STATE.json'].historical_superseded.rc4211_pr207_source_production.app_blob='c'.repeat(40)],
 ['historical device tree',d=>d['PITTI_CURRENT_STATE.json'].runtime.latest_device_evidence.version='v11.8.0-rc4.213'],
 ['panel overclaim',d=>d['PITTI_CURRENT_STATE.json'].runtime.independent_evidence_lane_status.pitti_panel='AVAILABLE'],
 ['team total',d=>d['PITTI_CURRENT_STATE.json'].runtime.independent_evidence_lane_status.team_total='AVAILABLE'],
 ['candidate',d=>d['PITTI_CURRENT_STATE.json'].candidate_work.pr=205],
 ['lock device',d=>d['PITTI_EXECUTION_LOCK.json'].runtime.androidVerified=true],
 ['command device',d=>d['PITTI_COMMAND_CONTRACTS.json'].currentBoundary.productionDeployment.deviceAcceptanceProven=true],
 ['runtime lock',d=>d['PITTI_EXECUTION_LOCK.json'].runtime.appVersion='v11.8.0-rc4.212'],
 ['RB overclaim',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4214_source_production.repair_scope.rb_wrong_position='FIXED'],
 ['selected identity overclaim',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4214_source_production.repair_scope.selected_pitti='AVAILABLE'],
 ['broad baseline',d=>d['PITTI_CURRENT_STATE.json'].runtime.last_broad_physical_evidence_baseline.version='v11.8.0-rc4.214'],
 ['postmerge CI overclaim',d=>d['PITTI_CURRENT_STATE.json'].runtime.ci.current_exact_main_head_ci='PASS'],
 ['quota policy',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4214_source_production.repair_scope.storage='CLEAR_ALL'],
 ['historical quota',d=>d['PITTI_CURRENT_STATE.json'].historical_superseded.rc4213_device_evidence.persistence.projected_points=488],
 ['historical source',d=>d['PITTI_CURRENT_STATE.json'].historical_superseded.rc4213_source_production.pr=213],
 ['latest observed',d=>d['PITTI_CURRENT_STATE.json'].runtime.latest_android_observed='v11.8.0-rc4.212'],
 ['installed observed',d=>d['PITTI_CURRENT_STATE.json'].runtime.installed_android='v11.8.0-rc4.212'],
 ['camel observed',d=>d['PITTI_CURRENT_STATE.json'].runtime.latestAndroidVersionObserved='v11.8.0-rc4.212'],
 ['lock observed',d=>d['PITTI_EXECUTION_LOCK.json'].runtime.latestAndroidVersionObserved='v11.8.0-rc4.212'],
 ['premature physical',d=>d['PITTI_CURRENT_STATE.json'].authority_continuation.physical_executable=true],
 ['stale main',d=>d['PITTI_CURRENT_STATE.json'].authority.canonical_main=MAIN],
 ['wrong waiting gate',d=>d['PITTI_CURRENT_STATE.json'].auto_execution_state.waiting_external[0].gate='RC4213_PHYSICAL_PENDING'],
 ['published receipt',d=>d['PITTI_CURRENT_STATE.json'].runtime_candidate.historical_validation_and_publication.strict.passed=249],
 ['unpublished confusion',d=>d['PITTI_EXECUTION_LOCK.json'].runtimeCandidate.status='LOCAL_UNPUBLISHED'],
 ['old continuation',d=>d['PITTI_HANDOFF_SEAL.json'].authority_continuation.sequence[1]='V272_MERGE_POSTMERGE_CHECKS'],
 ['old physical wording',d=>d['README.md']='rc4.214 PHYSICAL PENDING\n'+d['README.md']],
 ['immutable old head',d=>d['PITTI_CURRENT_STATE.json'].runtime_candidate.published_head='860323b908217c11272b74f9e5b2c2a2c417b1c5'],
 ['immutable observed head',d=>d['PITTI_EXECUTION_LOCK.json'].runtimeCandidate.published_head=OBSERVED],
 ['unpublished correction',d=>d['PITTI_HANDOFF_SEAL.json'].authority_continuation.corrective_candidate_publication='LOCAL_UNPUBLISHED'],
 ['old action',d=>d['PITTI_COMMAND_CONTRACTS.json'].currentBoundary.exactNextAction='Validate and commit local rc4.215 candidate'],
 ['missing exact-head rule',d=>d['PITTI_CURRENT_STATE.json'].runtime_candidate.exact_head_rule=''],
 ['seal',d=>d['PITTI_HANDOFF_SEAL.json'].exact_gate='DONE']
];
for(const[n,f]of cases){const d=structuredClone(b);f(d);assert(validateAuthority(d).length,`must reject ${n}`)}
const h='a'.repeat(40),ev={fresh:true,repo:'Muero42/draft-companion',canonicalBranch:'main',canonicalHead:h,head:h,clean:true,branch:'main',prState:'MERGED',containingCommitVerified:true,ciHead:h,authorizedWorkPackage:true,checks:['project_guardrails','release_contract_v2','candidate_package'].map(name=>({name,result:'PASS'}))};
assert.deepEqual(validateContinuationEvidence(ev),[]);
for(const f of[x=>x.fresh=false,x=>x.clean=false,x=>x.containingCommitVerified=false,x=>x.ciHead='b'.repeat(40),x=>x.authorizedWorkPackage=false,x=>x.checks.push({name:'project_guardrails',result:'PASS'})]){const x=structuredClone(ev);f(x);assert(validateContinuationEvidence(x).length)}
console.log(`POSTMERGE_AUTHORITY_REGRESSION_PASS generation=v274 mutations=${cases.length} external=6`);

assert.equal(RUNTIME_FILES.length,17);
assert(fs.readFileSync('app.js','utf8').includes("const APP_VERSION='v11.8.0-rc4.215'"),'runtime must remain rc4.215');
const parentProbe=spawnSync('git',['cat-file','-e',OBSERVED+'^{commit}'],{encoding:'utf8'});
if(parentProbe.error)throw parentProbe.error;
if(parentProbe.status!==0){
  assert.equal(execFileSync('git',['rev-parse','--is-shallow-repository'],{encoding:'utf8'}).trim(),'true','required parent missing outside a shallow checkout');
  // Fetch only the pinned parent. Network/auth/object failures remain fatal.
  execFileSync('git',['fetch','--no-tags','--depth=1','origin',OBSERVED],{stdio:'inherit'});
  execFileSync('git',['cat-file','-e',OBSERVED+'^{commit}'],{stdio:'inherit'});
}
for(const file of RUNTIME_FILES){const expected=execFileSync('git',['rev-parse',OBSERVED+':'+file],{encoding:'utf8'}).trim(),actual=execFileSync('git',['hash-object','--path='+file,file],{encoding:'utf8'}).trim();assert.equal(actual,expected,'authority-only runtime blob changed: '+file);}
console.log('RC4215_RUNTIME_SCOPE_PASS all 17 runtime files identical to historical observed runtime source '+OBSERVED);

const physicalEvidence={...ev,canonicalTree:'c'.repeat(40),publicationExactHeadPass:true,rc4215Merged:true,postmergeChecksPass:true,authorityParent:BASE,production:{status:'SUCCESS',sourceCommit:h,tree:'c'.repeat(40),deploymentId:'new-v274-deployment'},runtimeVersion:'v11.8.0-rc4.215',runtimeFileCount:17,reviewedCandidateHead:OBSERVED,runtimeIdentityBase:OBSERVED,runtimeBlobsIdentical:true};
assert.deepEqual(validatePhysicalPrerequisites(physicalEvidence),[]);
const physicalMutations=[e=>e.publicationExactHeadPass=false,e=>e.rc4215Merged=false,e=>e.postmergeChecksPass=false,e=>e.canonicalHead=BASE,e=>e.canonicalTree=BASE_TREE,e=>e.production.sourceCommit=MAIN,e=>e.production.tree='d'.repeat(40),e=>e.production.status='PENDING',e=>e.runtimeFileCount=16,e=>e.runtimeBlobsIdentical=false,e=>e.runtimeVersion='v11.8.0-rc4.213',e=>e.fresh=false];
for(const mutate of physicalMutations){const e=structuredClone(physicalEvidence);mutate(e);assert(validatePhysicalPrerequisites(e).length,'premature/stale physical prerequisite accepted');}
console.log('V274_CONTINUATION_PASS: aliases, publication-first state, dynamic main, physical prerequisite positive + '+physicalMutations.length+' negatives');

// A fresh future PR head is valid independently of historical publication receipts.
for(const head of ['d'.repeat(40),'e'.repeat(40)]){const fresh={...ev,branch:'codex/rc4215-season-live-refresh-repair',prState:'OPEN',head,prHead:head,ciHead:head};assert.deepEqual(validateContinuationEvidence(fresh),[]);assert(validateContinuationEvidence({...fresh,ciHead:OBSERVED}).length,'historical CI cannot certify a future PR head');}
console.log('SELF_REFERENCE_SAFE_PASS dynamic future heads; historical CI rejected');
