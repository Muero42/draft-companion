import assert from 'node:assert/strict';
import {loadAuthority,validateAuthority,validateContinuationEvidence} from './postmerge-authority-contract.mjs';
const b=loadAuthority();assert.deepEqual(validateAuthority(b),[]);
const cases=[
 ['v245 current',d=>d.PITTI_CURRENT_STATE_json.handoff_generation='20260912T1317Z-v245'],
 ['rc4198 source',d=>d.PITTI_CURRENT_STATE_json.authority.source_candidate='v11.8.0-rc4.198'],
 ['rc4196 newest device',d=>d.PITTI_CURRENT_STATE_json.runtime.latest_device_evidence.version='v11.8.0-rc4.196'],
 ['c9 production',d=>d.PITTI_CURRENT_STATE_json.runtime.production_deployment.source_commit='c9f7eb1a3dea788fb56eac517dab63b39ed9ef59'],
 ['rc4199 deployed',d=>d.PITTI_CURRENT_STATE_json.runtime.production_deployment.version='v11.8.0-rc4.199'],
 ['rc4199 observed',d=>d.PITTI_CURRENT_STATE_json.runtime.latest_device_evidence.version='v11.8.0-rc4.199'],
 ['rc4199 accepted',d=>d.PITTI_CURRENT_STATE_json.runtime.latest_device_evidence.acceptance='PASS'],
 ['quota verdict erased',d=>d.PITTI_CURRENT_STATE_json.runtime.latest_device_evidence.classification='PASS'],
 ['merge means deployment',d=>d.PITTI_CURRENT_STATE_json.authority.promotion.merge_implies_deployment=true],
 ['deployment means acceptance',d=>d.PITTI_CURRENT_STATE_json.authority.rc4199_candidate.device_acceptance_proven=true],
 ['preview production',d=>d.PITTI_CURRENT_STATE_json.runtime.preview_candidate='v11.8.0-rc4.199 PRODUCTION'],
 ['PR frozen',d=>d.PITTI_CURRENT_STATE_json.authority.rc4199_candidate.pr_state='OPEN'],
 ['stale CI head',d=>d.PITTI_CURRENT_STATE_json.runtime.ci.validated_code_head='0c44351c31fb396b51053b54d5b15098c38b628e'],
 ['seal generation stale',d=>d.PITTI_HANDOFF_SEAL_json.handoff_generation='20260912T1317Z-v245'],
 ['old branch operative',d=>d.PITTI_HANDOFF_SEAL_json.branch_locks.branch='pitti/rc4198-operational-restore-or1'],
 ['archive canonical',d=>d.PITTI_CURRENT_STATE_json.runtime.local_candidate_package.sha256='sha256:bad'],
 ['package count',d=>d.PITTI_EXECUTION_LOCK_json.runtime.localCandidatePackage.files=16],
 ['rollback erased',d=>d.PITTI_CURRENT_STATE_json.runtime.accepted_android='v11.8.0-rc4.198'],
 ['QB2 ban',d=>d.PITTI_CURRENT_STATE_json.qb_policy.season.qb2_exception_allowed=false]
];
for(const [n,m] of cases){const d=structuredClone(b);const x={PITTI_CURRENT_STATE_json:d['PITTI_CURRENT_STATE.json'],PITTI_EXECUTION_LOCK_json:d['PITTI_EXECUTION_LOCK.json'],PITTI_COMMAND_CONTRACTS_json:d['PITTI_COMMAND_CONTRACTS.json'],PITTI_HANDOFF_SEAL_json:d['PITTI_HANDOFF_SEAL.json']};m(x);assert.ok(validateAuthority(d).length,`reject ${n}`)}
const h='a'.repeat(40),main='b'.repeat(40),checks=['project_guardrails','release_contract_v2','candidate_package'].map(name=>({name,result:'PASS'}));
const pre={fresh:true,repo:'Muero42/draft-companion',canonicalBranch:'main',canonicalHead:main,head:h,clean:true,branch:'feature',prState:'OPEN',prHead:h,ciHead:h,checks,authorizedWorkPackage:true};
const bytes=JSON.stringify(b);assert.deepEqual(validateContinuationEvidence(pre),[]);assert.deepEqual(validateContinuationEvidence({...pre,branch:'main',prState:'MERGED',canonicalHead:h,containingCommitVerified:true}),[]);assert.equal(JSON.stringify(b),bytes);
for(const [n,p] of [['stale',{fresh:false}],['old head',{ciHead:main}],['hardcoded PR mismatch',{prHead:main}],['unverified containment',{branch:'main',prState:'MERGED',canonicalHead:h,containingCommitVerified:false}],['unauthorized',{authorizedWorkPackage:false}]])assert.ok(validateContinuationEvidence({...pre,...p}).length,n);
console.log(`POSTMERGE_AUTHORITY_REGRESSION_PASS generation=v246 negatives=${cases.length} external=5 pre_post_promotion=PASS`);
