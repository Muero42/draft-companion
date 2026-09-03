import assert from 'node:assert/strict';
import {loadAuthority,validateAuthority,validateContinuationEvidence} from './postmerge-authority-contract.mjs';
const baseline=loadAuthority();
assert.deepEqual(validateAuthority(baseline),[]);
const cases=[
  ['resurrected current gate',d=>d['PITTI_CURRENT_STATE.json'].currentWork.nextGate='V233_STRICT_GATES_THEN_MERGE_AND_LOCAL_CODEX_REAUDIT'],
  ['hidden duplicate gate',d=>d['PITTI_EXECUTION_LOCK.json'].nextGate='V233_STRICT_GATES_THEN_MERGE_AND_LOCAL_CODEX_REAUDIT'],
  ['merged PR pending CI',d=>d['PITTI_CURRENT_STATE.json'].authority.postmerge.pending_strict_ci=true],
  ['stale resume',d=>d['PITTI_EXECUTION_LOCK.json'].handoff.resume='After strict gates PASS, merge v233'],
  ['stale external wait',d=>d['PITTI_CURRENT_STATE.json'].auto_execution_state.waiting_external.push({id:'v233-strict-gates'})],
  ['false deployment PASS',d=>d['PITTI_CURRENT_STATE.json'].runtime.deployed_pages_app_byte_parity_with_main=true],
  ['false new device PASS',d=>d['PITTI_CURRENT_STATE.json'].runtime.latest_device_evidence.version='v11.8.0-rc4.189'],
  ['PR118 production promotion',d=>d['PITTI_CURRENT_STATE.json'].authority.pr118.status='MERGED/PRODUCTION'],
  ['generation drift',d=>d['PITTI_EXECUTION_LOCK.json'].handoffGeneration='20260903T0745Z-v233'],
  ['unperformed audit',d=>d['PITTI_CURRENT_STATE.json'].codex.audit_result='PENDING'],
  ['artifact misattribution',d=>d['PITTI_EXECUTION_LOCK.json'].runtime.preinstallHashSemantics='rc4.189 PASS'],
  ['historical override resurrected',d=>d['PITTI_AUTO_PREFLIGHT.md']+='\n## v233 CURRENT OVERRIDE\n'],
  ['bootstrap premerge gate',d=>d['PITTI_NEW_CHAT_BOOTSTRAP.md']+='\nCurrent gate: V233_STRICT_GATES_THEN_MERGE_AND_LOCAL_CODEX_REAUDIT\n'],
  ['CURRENT local only',d=>d['PITTI_CURRENT_STATE.json'].operative_scope='This work is local only'],
  ['false source containment',d=>d['PITTI_CURRENT_STATE.json'].source_authority='rc4.190 merged source on main'],
  ['permission reference drift',d=>d['PITTI_CURRENT_STATE.json'].authority.permission_contract='historical PR118'],
  ['frozen migration branch',d=>d['PITTI_CURRENT_STATE.json'].runtime.candidate_branch='pitti/rc4190-v234-migration'],
  ['nested historical-name bypass',d=>d['PITTI_CURRENT_STATE.json'].authority.historical_superseded={nextGate:'V233_STRICT_GATES_THEN_MERGE_AND_LOCAL_CODEX_REAUDIT'}],
  ['unmerged gate prerequisite',d=>d['PITTI_COMMAND_CONTRACTS.json'].gate_prerequisite='REQUIRES_UNMERGED_BRANCH'],
  ['static remote authorization',d=>d['PITTI_EXECUTION_LOCK.json'].remote_actions_authorized=false],
  ['immutable current PR122',d=>d['PITTI_CURRENT_STATE.json'].authority.pr122={status:'OPEN'}],
  ['immutable current merged PR122',d=>d['PITTI_CURRENT_STATE.json'].authority.pr122={status:'MERGED'}],
  ['static merge boolean',d=>d['PITTI_HANDOFF_SEAL.json'].merged=false],
  ['operative repair branch',d=>d['PITTI_HANDOFF_SEAL.json'].branch_locks.local_repair_branch='pitti/v234-postmerge-authority-repair'],
  ['hidden local prose',d=>d['PITTI_NEW_CHAT_BOOTSTRAP.md']+='\nThis work is local only.\n'],
  ['hidden immutable PR prose',d=>d['README.md']='PR #122 is OPEN\n'+d['README.md']],
  ['hidden unmerged prose',d=>d['HANDOFF_COMPLETENESS_MATRIX.md']+='\nThis gate requires an unmerged branch.\n'],
  ['authorization cannot be inferred from merge',d=>d['PITTI_CURRENT_STATE.json'].authority.promotion.permission_source='MERGE'],
  ['deployment cannot be inferred from merge',d=>d['PITTI_CURRENT_STATE.json'].authority.promotion.merge_implies_deployment=true],
  ['device cannot be inferred from merge',d=>d['PITTI_CURRENT_STATE.json'].authority.promotion.merge_implies_device_acceptance=true],
];
for(const [name,mutate] of cases) {const d=structuredClone(baseline);mutate(d);assert.ok(validateAuthority(d).length>0,`must reject ${name}`);}
const historical=structuredClone(baseline);
historical['PITTI_CURRENT_STATE.json'].historical_superseded.example='V233_STRICT_GATES_THEN_MERGE_AND_LOCAL_CODEX_REAUDIT';
assert.deepEqual(validateAuthority(historical),[],'explicit historical provenance remains legal');
const head='a'.repeat(40),main='b'.repeat(40);
const evidence={fresh:true,repo:'Muero42/draft-companion',canonicalBranch:'main',canonicalHead:main,head,clean:true,branch:'pitti/v234-postmerge-authority-repair',prState:'OPEN',prHead:head,ciHead:head,checks:['project_guardrails','release_contract_v2','candidate_package'].map(name=>({name,result:'PASS'})),authorizedWorkPackage:true};
const serialized=JSON.stringify(baseline);
for(const e of [evidence,{...evidence,branch:'main',prState:'MERGED',canonicalHead:head,containingCommitVerified:true}]) {
  assert.deepEqual(validateAuthority(baseline),[]);
  assert.deepEqual(validateContinuationEvidence(e),[],'identical checkpoint supports verified pre/post promotion contexts');
  assert.equal(JSON.stringify(baseline),serialized,'external observations must not rewrite authority');
}
const externalCases=[['stale evidence',{fresh:false}],['wrong repository',{repo:'other/repo'}],['dirty tree',{clean:false}],['wrong PR head',{prHead:main}],['checks from older head',{ciHead:main}],['missing gate',{checks:evidence.checks.slice(1)}],['unknown PR state',{prState:'UNKNOWN'}],['no authorization',{authorizedWorkPackage:false}],['unproved merge containment',{branch:'main',prState:'MERGED',canonicalHead:head,containingCommitVerified:false}]];
for(const [name,patch] of externalCases) assert.ok(validateContinuationEvidence({...evidence,...patch}).length,`reject ${name}`);
console.log(`POSTMERGE_AUTHORITY_REGRESSION_PASS ${cases.length} checkpoint negatives + ${externalCases.length} external-evidence negatives + unchanged pre/post promotion fixtures + historical preservation`);
