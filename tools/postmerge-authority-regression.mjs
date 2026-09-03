import assert from 'node:assert/strict';
import {loadAuthority,validateAuthority} from './postmerge-authority-contract.mjs';
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
];
for(const [name,mutate] of cases) {const d=structuredClone(baseline);mutate(d);assert.ok(validateAuthority(d).length>0,`must reject ${name}`);}
const historical=structuredClone(baseline);
historical['PITTI_CURRENT_STATE.json'].historical_superseded.example='V233_STRICT_GATES_THEN_MERGE_AND_LOCAL_CODEX_REAUDIT';
assert.deepEqual(validateAuthority(historical),[],'explicit historical provenance remains legal');
console.log(`POSTMERGE_AUTHORITY_REGRESSION_PASS ${cases.length} negative cases + historical preservation`);
