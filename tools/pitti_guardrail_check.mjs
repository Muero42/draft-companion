import fs from 'node:fs';
import crypto from 'node:crypto';

const fail=(msg)=>{console.error(`PITTI_GUARDRAIL_FAIL: ${msg}`);process.exitCode=1};
const must=(cond,msg)=>{if(!cond)fail(msg)};
const text=p=>fs.readFileSync(p,'utf8');

const lock=JSON.parse(text('PITTI_EXECUTION_LOCK.json'));
const state=text('PITTI_PROJECT_STATE.md');
const preflight=text('PITTI_AUTO_PREFLIGHT.md');
const app=text('app.js');
const readme=text('README.md');

must(lock.schema==='pitti.execution-lock.v1','execution lock schema');
must(lock.runtime?.appVersion==='v11.8.0-rc4.64','runtime version lock drift');
must(lock.runtime?.productionPanelMustRemainSelectable===true,'incumbent selectable invariant missing');
must(lock.auto?.continueWhileAutonomousWorkExists===true,'AUTO continuity invariant missing');
must(lock.auto?.parallelizeIndependentLanesWhileWaiting===true,'AUTO parallel-lane invariant missing');
must(lock.auto?.statusOnlyOutputWhileUsefulWorkExists===false,'status-only prohibition missing');
must(lock.auto?.checkpointWriteThroughAfterMaterialChange===true,'checkpoint write-through invariant missing');
must(lock.auto?.retryRejectedPathWithoutNewEvidence===false,'rejected-path retry invariant missing');

for(const token of [
  'Source of Truth for PITTI/Draft Companion execution',
  'AUTO means end-to-end autonomous execution',
  'Never silently revive a rejected/obsolete approach',
  'Material decisions, implementations, verifications, failures, rejected approaches, artifact state and next gates must be written here promptly',
  'New-chat recovery: read this file first',
  'Built/prepared != deployed != Android verified',
  'Regression prevention is technical where possible'
]) must(state.includes(token),`project-state invariant missing: ${token}`);

for(const token of [
  'Use before every PITTI AUTO execution and after any chat handoff',
  'ANTI-REGRESSION',
  'END-TO-END ROUTE',
  'AUTO CONTINUITY',
  'CHECKPOINT WRITE-THROUGH',
  'USER INTERRUPTION TEST',
  'PITTI-SPECIFIC CANARIES'
]) must(preflight.includes(token),`preflight gate missing: ${token}`);

must(readme.includes('v11.8.0-rc4.64'),'README active runtime drift');
must(app.includes("const USER_HARD_QB_EXCLUSIONS=new Set(['genosmith','aaronrodgers'])"),'QB hard-exclusion canary drift');
must(app.includes("function normalCandidateAdmissible(row)"),'normal candidate admissibility guard missing');
must(app.includes('Safety must not resurrect a repeated QB/TE'),'repeat-QB/TE safety guard missing');
must(app.includes("Progressive WR-Sättigung")||app.includes('WR-Sättigung'),'WR saturation canary missing');
must(app.includes('function simulateReturnV2('),'Return-v2 kernel missing');
must(app.includes('function applyPlayerQualitySafetyGate('),'Value-Safety gate missing');

// Known rejected Expert-v2 temporary pool must never silently land in runtime.
for(const name of ['Guilherme Gianni','Michael Bobal','Ryan Weisse'])
  must(!app.includes(name),`rejected temporary Expert-v2 runtime name leaked: ${name}`);

const e=lock.expertV2||{};
must(e.status==='SHADOW_NOT_PROMOTED','Expert-v2 status must stay shadow until gate passes');
must(e.integration==='ADDITIVE_SELECTABLE_ONLY','Expert-v2 additive/selectable invariant missing');
must(e.brownExcluded===true,'Brown exclusion missing');
must(e.erickson==='CHALLENGER_ONLY','Erickson challenger invariant missing');
must(e.koerner==='NO_CURRENT_DRAFT_ACQUISITION_PAYWALL','Koerner current-draft acquisition lock drift');
must(e.draftSharksCountAsOneSourceFamily===true,'Draft Sharks family-count invariant missing');
must(e.temporaryWeisseGianniBobalPoolRejected===true,'temporary pool quarantine missing');
must(e.weightsAreProduction===false,'shadow weights must not be marked production');
must(e.currentGate==='EXACT_FIXED_RC464_KERNEL_AB_WITH_END_TO_END_RETURN_V2_RERUN','current Expert-v2 gate drift');

const expectedWeights={
  QB:{'Draft Sharks':35,'Nick Mariano':25,'Dalton Del Don':20,'Justin Boone':10,'Pat Fitzmaurice':10},
  RB:{'Draft Sharks':35,'Nick Mariano':25,'Dalton Del Don':25,'Pat Fitzmaurice':15},
  WR:{'Nick Mariano':35,'Draft Sharks':30,'Pat Fitzmaurice':15,'Dalton Del Don':10,'Justin Boone':10},
  TE:{'Draft Sharks':35,'Pat Fitzmaurice':30,'Dalton Del Don':25,'Justin Boone':10}
};
must(JSON.stringify(e.weights)===JSON.stringify(expectedWeights),'Expert-v2 recovered shadow weights drift');

for(const [pos,w] of Object.entries(e.weights||{})){
  const sum=Object.values(w).reduce((a,b)=>a+Number(b||0),0);
  must(sum===100,`${pos} weights sum ${sum}, expected 100`);
}

const digest=crypto.createHash('sha256').update(JSON.stringify(lock)).digest('hex');
if(!process.exitCode)console.log(`PITTI_GUARDRAILS_PASS lock_sha256=${digest} app=${lock.runtime.appVersion} gate=${e.currentGate}`);
