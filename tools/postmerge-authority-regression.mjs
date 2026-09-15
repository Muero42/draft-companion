import assert from 'node:assert/strict';
import {loadAuthority,validateAuthority,validateContinuationEvidence} from './postmerge-authority-contract.mjs';

const baseline=loadAuthority();
assert.deepEqual(validateAuthority(baseline),[],'baseline v254 authority must validate');

const cases=[
  ['generation regression',d=>d['PITTI_CURRENT_STATE.json'].handoff_generation='20260914T1727Z-v252'],
  ['rc4.203 resurrected as current source',d=>d['PITTI_CURRENT_STATE.json'].authority.source_candidate='v11.8.0-rc4.203'],
  ['wrong canonical merge',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4204_source_merge.merge_commit='fb458e076de6710a91f1162e504b5b79fb67167c'],
  ['wrong repair head',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4204_source_merge.repair_head='4aeaf65b264739583daa50e2a730b3243b350f5d'],
  ['PR175 becomes repair lane',d=>d['PITTI_EXECUTION_LOCK.json'].authority.liveVerificationTargets.find(x=>x.pr===175).lane='CURRENT_RC4.204_RUNTIME_REPAIR_LANE'],
  ['PR176 loses merged provenance',d=>d['PITTI_EXECUTION_LOCK.json'].authority.liveVerificationTargets=d['PITTI_EXECUTION_LOCK.json'].authority.liveVerificationTargets.filter(x=>x.pr!==176)],
  ['ros=false restored',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4204_source_merge.repair_semantics='ros=false is correct weekly semantics'],
  ['unsupported scoring introduced',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4204_source_merge.repair_semantics='omit ros but add scoring=HALF'],
  ['stats points authority removed',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4204_source_merge.repair_semantics='omit ros'],
  ['rc4.204 falsely deployed',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4204_candidate.deployment_proven=true],
  ['rc4.204 falsely device observed',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4204_candidate.device_observation_proven=true],
  ['rc4.204 falsely accepted',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4204_candidate.device_acceptance_proven=true],
  ['rc4.203 production regressed',d=>d['PITTI_CURRENT_STATE.json'].runtime.deployed_production_version='v11.8.0-rc4.202'],
  ['rc4.203 device failure erased',d=>d['PITTI_CURRENT_STATE.json'].runtime.latest_device_evidence.acceptance='PASS'],
  ['device verdict changed',d=>d['PITTI_CURRENT_STATE.json'].runtime.latest_device_evidence.classification='RC4.203_PHYSICAL_PASS'],
  ['preview becomes production',d=>d['PITTI_CURRENT_STATE.json'].runtime.preview_candidate='v11.8.0-rc4.204 Production VERIFIED'],
  ['archive SHA promoted canonical',d=>d['PITTI_CURRENT_STATE.json'].runtime.latest_package_sha256='d9fc7432c5cbea4a48a3fda97c13151bb56e0a14a8ea7deeb81822faa51400f3'],
  ['archive scope erased',d=>d['PITTI_CURRENT_STATE.json'].runtime.local_candidate_package.archive_sha_semantics='CANONICAL'],
  ['watcher head changed',d=>d['PITTI_EXECUTION_LOCK.json'].authority.liveVerificationTargets.find(x=>x.repository==='Muero42/pitti-watcher').expectedHead='bad'],
  ['accepted rollback changed',d=>d['PITTI_CURRENT_STATE.json'].runtime.accepted_android='v11.8.0-rc4.204'],
  ['gate implies execution',d=>d['PITTI_COMMAND_CONTRACTS.json'].currentGate='PRODUCTION_DEPLOYED'],
];
for(const [name,mutate] of cases){const d=structuredClone(baseline);mutate(d);assert.ok(validateAuthority(d).length>0,`must reject ${name}`);}

const head='a'.repeat(40),main='b'.repeat(40);
const evidence={fresh:true,repo:'Muero42/draft-companion',canonicalBranch:'main',canonicalHead:main,head,clean:true,branch:'codex/rc4.204-postmerge-reseal',prState:'OPEN',prHead:head,ciHead:head,authorizedWorkPackage:true,checks:['project_guardrails','release_contract_v2','candidate_package'].map(name=>({name,result:'PASS'}))};
assert.deepEqual(validateContinuationEvidence(evidence),[]);
for(const [name,mutate] of [['stale evidence',e=>e.fresh=false],['dirty tree',e=>e.clean=false],['wrong PR head',e=>e.prHead=main],['wrong CI head',e=>e.ciHead=main],['missing authorization',e=>e.authorizedWorkPackage=false],['duplicate PASS',e=>e.checks.push({name:'project_guardrails',result:'PASS'})],['mixed check',e=>e.checks[0].result='FAIL']]){
  const e=structuredClone(evidence);mutate(e);assert.ok(validateContinuationEvidence(e).length>0,`must reject ${name}`);
}
console.log(`POSTMERGE_AUTHORITY_REGRESSION_PASS generation=v254 mutations=${cases.length} external=7`);
