import {loadAuthority,validateAuthority,AUTHORITY_GATE} from './postmerge-authority-contract.mjs';
const base=loadAuthority(); const clone=()=>structuredClone(base);
const cases=[
 ['rc4.202 resurrected',d=>d['PITTI_CURRENT_STATE.json'].runtime.deployed_production_version='v11.8.0-rc4.202'],
 ['CURRENT Android alias resurrected',d=>d['PITTI_CURRENT_STATE.json'].runtime.android_authority='v11.8.0-rc4.202 latest'],
 ['rc4.193 work package made current',d=>d['PITTI_CURRENT_STATE.json'].weekly_evidence_v2_work.status='MERGED_TO_CANONICAL_MAIN_PRODUCTION_PENDING'],
 ['rc4.203 accepted',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4203_candidate.device_acceptance_proven=true],
 ['rc4.203 source-only',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4203_candidate.status='SOURCE_CANDIDATE_NOT_PRODUCTION'],
 ['stale v252',d=>d['PITTI_CURRENT_STATE.json'].handoff_generation='20260914T1727Z-v252'],
 ['PR174 candidate resurrection',d=>d['NEW_CHAT_HANDOFF_CURRENT.md']=d['NEW_CHAT_HANDOFF_CURRENT.md'].replace('merged via historical PR #174','source-only current PR #174 candidate')],
 ['LOCK PR175 removed',d=>d['PITTI_EXECUTION_LOCK.json'].authority.liveVerificationTargets=d['PITTI_EXECUTION_LOCK.json'].authority.liveVerificationTargets.filter(x=>x.pr!==175)],
 ['LOCK PR174 candidate',d=>d['PITTI_EXECUTION_LOCK.json'].authority.liveVerificationTargets.find(x=>x.pr===174).lane='CURRENT_RC4.203_CANDIDATE'],
 ['LOCK Android alias resurrected',d=>d['PITTI_EXECUTION_LOCK.json'].runtime.latestAndroidVerified='v11.8.0-rc4.202'],
 ['LOCK Production alias resurrected',d=>d['PITTI_EXECUTION_LOCK.json'].runtime.productionDeployment.version='v11.8.0-rc4.202'],
 ['COMMAND boundary resurrected',d=>d['PITTI_COMMAND_CONTRACTS.json'].currentBoundary.productionControl='rc4.202 latest Production'],
 ['COMMAND deployment object resurrected',d=>d['PITTI_COMMAND_CONTRACTS.json'].currentBoundary.productionDeployment.version='v11.8.0-rc4.202'],
 ['COMMAND Season gate resurrected',d=>d['PITTI_COMMAND_CONTRACTS.json'].seasonCompanion.nextGate='VERIFY_CANONICAL_AUTHORITY_THEN_AUTHORIZED_WORK'],
 ['PR163 overrides',d=>d['PITTI_HANDOFF_SEAL.json'].branch_locks.mutable_live_verification_targets.draft_companion_pr_163='may override v253'],
 ['watcher conflation',d=>d['PITTI_EXECUTION_LOCK.json']=JSON.parse(JSON.stringify(d['PITTI_EXECUTION_LOCK.json']).replaceAll('77221ceeb900458e95c32d78c1ad395a37422e5d','draft-companion-lane'))],
 ['UNKNOWN asserted',d=>d['docs/RC4203_WEEKLY_PROJECTION_ROOT_CAUSE_DIAGNOSIS_2026-09-14.md']=d['docs/RC4203_WEEKLY_PROJECTION_ROOT_CAUSE_DIAGNOSIS_2026-09-14.md'].replaceAll('UNKNOWN','PROVEN')],
 ['A/B bypass',d=>d['PITTI_CURRENT_STATE.json'].next_gate='IMPLEMENT_RC4204_NOW']
];
if(validateAuthority(base).length) throw new Error('baseline authority invalid: '+validateAuthority(base).join('; '));
for(const [name,mutate] of cases){const d=clone();mutate(d);if(!validateAuthority(d).length)throw new Error('mutation survived: '+name);}
console.log(`POSTMERGE_AUTHORITY_REGRESSION_PASS generation=v253 cases=${cases.length} gate=${AUTHORITY_GATE}`);