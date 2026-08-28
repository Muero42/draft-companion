import fs from 'node:fs';
import crypto from 'node:crypto';

const fail=(msg)=>{console.error(`PITTI_GUARDRAIL_FAIL: ${msg}`);process.exitCode=1};
const must=(cond,msg)=>{if(!cond)fail(msg)};
const text=p=>fs.readFileSync(p,'utf8');

const lock=JSON.parse(text('PITTI_EXECUTION_LOCK.json'));
const state=text('PITTI_PROJECT_STATE.md');
const preflight=text('PITTI_AUTO_PREFLIGHT.md');
const app=text('app.js');
const rc484=text('tools/rc484-draft-critical.mjs');
const policy=text('decision-policy.js');
const readme=text('README.md');
const commandContract=JSON.parse(text('PITTI_COMMAND_CONTRACTS.json'));
const bootstrap=text('PITTI_NEW_CHAT_BOOTSTRAP.md');
const handoffMatrix=text('HANDOFF_COMPLETENESS_MATRIX.md');
const currentHandoff=text('NEW_CHAT_HANDOFF_CURRENT.md');
const evidenceAnalyzer=text('tools/analyze-decision-evidence.mjs');
const releaseContract=text('PITTI_RELEASE_CONTRACT_V2.md');
const releaseWorkflow=text('.github/workflows/release-contract-v2.yml');
const packageWorkflow=text('.github/workflows/release-contract-v2-package.yml');
const preDraftFreshnessGate=text('tools/pre-draft-freshness-gate.mjs');
const emergencyQueueContract=text('tools/emergency-queue-contract.mjs');
const current=JSON.parse(text('PITTI_CURRENT_STATE.json'));
const seal=JSON.parse(text('PITTI_HANDOFF_SEAL.json'));
const handoffGeneration=(currentHandoff.match(/Handoff generation:\s*`([^`]+)`/)||[])[1];
const gitBlobSha=(p)=>{
  const b=fs.readFileSync(p);
  const h=crypto.createHash('sha1');
  h.update(Buffer.from(`blob ${b.length}\0`));
  h.update(b);
  return h.digest('hex');
};

must(lock.schema==='pitti.execution-lock.v1','execution lock schema');
must(lock.runtime?.appVersion===((app.match(/const APP_VERSION='([^']+)'/)||[])[1]),'runtime version lock drift');
must(lock.runtime?.productionPanelMustRemainSelectable===true,'incumbent selectable invariant missing');
must(lock.auto?.continueWhileAutonomousWorkExists===true,'AUTO continuity invariant missing');
must(lock.auto?.parallelizeIndependentLanesWhileWaiting===true,'AUTO parallel-lane invariant missing');
must(lock.auto?.statusOnlyOutputWhileUsefulWorkExists===false,'status-only prohibition missing');
must(lock.auto?.checkpointWriteThroughAfterMaterialChange===true,'checkpoint write-through invariant missing');
must(lock.auto?.retryRejectedPathWithoutNewEvidence===false,'rejected-path retry invariant missing');
must(lock.auto?.longBlocksByDefault===true,'long-block AUTO invariant missing');
must(lock.auto?.userReminderRequired===false,'AUTO must never require repeated user reminder');
must(lock.auto?.blockedGateStopsOnlyDependentLane===true,'blocked-gate lane isolation missing');
must(lock.auto?.reinventoryAfterEveryWorkPackage===true,'post-package re-inventory invariant missing');
must(lock.auto?.oneInventoryPerAutoTurnIsInsufficient===true,'single-inventory AUTO regression guard missing');
must(lock.auto?.promiseOnlyAutoResponseForbidden===true,'promise-only AUTO response prohibition missing');
must(lock.auto?.externalGateValidStopOnlyAfterIndependentLaneExhaustion===true,'external gate exhaustion invariant missing');

for(const token of [
  'Source of Truth for PITTI/Draft Companion execution',
  'AUTO means end-to-end autonomous execution',
  'Never silently revive a rejected/obsolete approach',
  'Material decisions, implementations, verifications, failures, rejected approaches, artifact state and next gates must be written here promptly',
  'New-chat recovery: read this file first',
  'Built/prepared != deployed != Android verified',
  'Regression prevention is technical where possible',
  'three selectable profiles',
  'Expert-v2 ALL positions',
  'Expert-v2 WR-only'
]) must(state.includes(token),`project-state invariant missing: ${token}`);

for(const token of [
  'Use before every PITTI AUTO execution and after any chat handoff',
  'ANTI-REGRESSION',
  'END-TO-END ROUTE',
  'AUTO CONTINUITY',
  'CHECKPOINT WRITE-THROUGH',
  'USER INTERRUPTION TEST',
  'PITTI-SPECIFIC CANARIES',
  'AUTO is a repeated work loop, not a one-package action',
  'Re-inventory after **EVERY** completed work package',
  'Promise-only AUTO responses are invalid',
  'external/device/OOS gate is a valid interruption only after all independent'
]) must(preflight.includes(token),`preflight gate missing: ${token}`);

must(readme.includes('v11.8.0-rc4.64'),'README production/control baseline drift');
must(readme.includes(current.runtime?.test_challenger||'v11.8.0-rc4.86'),'README current candidate missing');
must(!app.includes('USER_HARD_QB_EXCLUSIONS'),'player-name QB exclusion must not exist');
must(!app.includes('USER HARD EXCLUSION'),'player-name hard-exclusion scoring must not exist');
must(!/genosmith|aaronrodgers/i.test(app),'Geno/Rodgers must not receive player-name runtime treatment');
must(app.includes("function normalCandidateAdmissible(row)"),'normal candidate admissibility guard missing');
must(app.includes("const normal=source.filter(normalCandidateAdmissible)"),'normal-cut rows must precede fallback in visible Top-10');
must(app.includes("if(visible.length<10)"),'fallback fill must only occur after normal-cut selection');
must(policy.includes('USER_DRAFT_QB_LIMIT=1'),'user one-QB runtime invariant missing');
must(app.includes("from './decision-policy.js'"),'decision policy wiring missing');
must(app.includes("Progressive WR-Sättigung")||app.includes('WR-Sättigung'),'WR saturation canary missing');
must(app.includes('function simulateReturnV2('),'Return-v2 kernel missing');
must(app.includes('function applyPlayerQualitySafetyGate('),'Value-Safety gate missing');

for(const name of ['Guilherme Gianni','Michael Bobal']) must(!app.includes(name),`temporary availability-only expert leaked into runtime: ${name}`);
must(!text('expert-v2-board.js').includes('Ryan Weisse'),'Weisse must not leak into frozen Expert-v2 board');
must(text('expert-v3-board.js').includes("schema:'pitti-expert-v3-board.v1'"),'Expert-v3 board missing');
for(const token of ["{name:'Ryan Weisse',pos:'RB'}","{name:'Wolf of Roto Street',pos:'TE'}","{name:'Todd D Clark',pos:'QB'}","{name:'Joey Wright',pos:'WR'}"]) must(app.includes(token),`Expert-v3 acquisition target missing: ${token}`);

const e=lock.expertV2||{};
must(e.status==='THREE_SELECTABLE_PROFILES_CURRENT_AUTHORITY_NO_FINAL_WINNER','three-profile Expert-v2 authority drift');
must(e.integration==='SELECTABLE_ABC_COMPARISON','A/B/C profile comparison invariant missing');
must(e.control==='incumbent/control','incumbent control identity drift');
must(e.controlRemainsSelectable===true,'incumbent must remain selectable');
must(e.fullV2RemainsSelectable===true,'Expert-v2 ALL must remain selectable');
must(e.wrOnlyRemainsSelectable===true,'Expert-v2 WR-only must remain selectable');
must(e.historicalFullV2Regression==='RETAIN_AS_EVIDENCE_NOT_AS_PROFILE_DELETION','historical full-v2 evidence semantics drift');
must(JSON.stringify(e.profiles)===JSON.stringify(['incumbent/control','Expert-v2 ALL positions','Expert-v2 WR-only']),'profile set/order drift');
must(JSON.stringify(e.displayOrder)===JSON.stringify(['Draft Sharks Team','Dalton Del Don','Pat Fitzmaurice','Nick Mariano','Justin Boone']),'expert display order drift');
must(e.displayValues==='INDIVIDUAL_PLAYER_RANKS_NOT_WEIGHTS','expert display value semantics drift');
must(e.sourceLocks?.['Derek Brown']==='EXCLUDED_FROM_NEW_V2','Brown exclusion missing');
must(e.sourceLocks?.['Andrew Erickson']==='CHALLENGER_ONLY_NO_CURRENT_NUMERIC_VOTE','Erickson challenger invariant missing');
must(e.sourceLocks?.['Sean Koerner']==='NO_CURRENT_DRAFT_ACQUISITION_PAYWALL_WATCHLIST_ONLY','Koerner acquisition lock drift');
must(e.sourceLocks?.['Draft Sharks Team']==='COUNT_EXACTLY_ONCE_AS_CORRELATED_FAMILY','Draft Sharks family-count invariant missing');
must(e.sourceLocks?.Weisse_Gianni_Bobal==='NO_AUTO_RESTORE_AVAILABILITY_ONLY; FRESH_INDIVIDUAL_QUALIFICATION_ALLOWED','temporary pool qualification semantics drift');
must(e.weightsAreFinalWinner===false,'no Expert-v2 profile may be mislabeled final winner');
must(e.oldWrOnlyRejectionSemanticsAreAuthority===false,'obsolete WR-only authority resurrected');
must(lock.league?.userDraftQbLimit===1,'user one-QB strategy lock drift');
must(lock.league?.userQb2Policy==='HARD_USER_STRATEGY_EXCLUSION_AFTER_QB1','user QB2 policy drift');
must(/^1\.\d+\.\d+$/.test(String(commandContract.version||'')),'repo command contract version malformed');
must(commandContract.sourceOrder?.includes('PITTI_CURRENT_STATE.json'),'CURRENT missing from takeover source order');
must(commandContract.sourceOrder?.includes('PITTI_HANDOFF_SEAL.json'),'SEAL missing from takeover source order');
must(commandContract.auto?.longestSafeBlocks===true,'repo command contract long-block drift');
must(commandContract.auto?.userReminderRequired===false,'repo command contract reminder drift');
must(commandContract.auto?.reinventoryAfterEveryWorkPackage===true,'repo command contract post-package inventory drift');
must(commandContract.auto?.blockedGateStopsOnlyDependentLane===true,'repo command contract lane isolation drift');
must(commandContract.auto?.promiseOnlyResponseForbidden===true,'repo command contract promise-only guard drift');
must(commandContract.auto?.externalGateValidStopOnlyAfterIndependentLaneExhaustion===true,'repo command contract external-gate guard drift');
must(commandContract.auto?.autoBlockCorrectionTrigger?.trigger==='AUTO BLOCK','AUTO BLOCK command contract missing');
must(commandContract.currentBoundary?.androidAuthority===current.runtime?.android_authority,'command contract Android authority drift');
must(commandContract.currentBoundary?.latestPackageSha256===current.runtime?.latest_package_sha256,'command contract package reference hash drift');
must(commandContract.currentBoundary?.packageReferenceRun===current.runtime?.package_reference_run,'package reference run drift');
must(commandContract.currentBoundary?.deployedPagesAppByteParityWithMain===current.runtime?.deployed_pages_app_byte_parity_with_main,'main/pages parity state drift');
must(current.handoff_generation===seal.handoff_generation,'CURRENT/SEAL generation mismatch');
must(current.handoff_generation===handoffGeneration,'CURRENT/Handoff generation mismatch');
const sealPending=seal.status==='SUPERSEDED_PENDING_RESEAL'&&seal.handoff_ready===false&&seal.second_pass_pass===false;
must((seal.status==='PASS'&&seal.handoff_ready===true&&seal.second_pass_pass===true)||sealPending,'handoff seal state invalid');
const integrityBypass=process.env.PITTI_SKIP_SEAL_INTEGRITY==='1'||sealPending;
const requiredSealFiles=['PITTI_CURRENT_STATE.json','NEW_CHAT_HANDOFF_CURRENT.md','PITTI_COMMAND_CONTRACTS.json','PITTI_NEW_CHAT_BOOTSTRAP.md','HANDOFF_COMPLETENESS_MATRIX.md','PITTI_EXECUTION_LOCK.json','PITTI_PROJECT_STATE.md','PITTI_AUTO_PREFLIGHT.md','app.js','live-surface-v3.js'];
if(!integrityBypass){
  must(Object.keys(seal.integrity||{}).length>=requiredSealFiles.length,'handoff seal integrity set unexpectedly empty/incomplete');
  for(const p of requiredSealFiles) must(Object.prototype.hasOwnProperty.call(seal.integrity||{},p),`handoff seal missing required integrity entry: ${p}`);
}
if(integrityBypass) console.log('PITTI_GUARDRAIL_INFO: seal-integrity checks bypassed for explicit pre-seal candidate validation only');
if(!integrityBypass){
for(const [p,expected] of Object.entries(seal.integrity||{})){
  must(fs.existsSync(p),`seal-listed file missing: ${p}`);
  if(fs.existsSync(p)) must(gitBlobSha(p)===expected,`seal blob mismatch: ${p}`);
}
}
must(current.handoff?.transaction_in_progress===false,'sealed takeover still marked transaction_in_progress');
const generationVersion=(current.handoff_generation.match(/-v(\d+)$/)||[])[1];
must(generationVersion,'CURRENT generation version missing');
must(handoffMatrix.includes(`REPO v${generationVersion}`),'handoff matrix generation label drift');
must(preflight.includes('HANDOFF TRANSACTION STATE'),'preflight handoff transaction gate missing');
must(releaseWorkflow.includes('node tools/rc483-draft-critical.mjs'),'release workflow missing rc4.83 gate');
must(releaseWorkflow.includes('node tools/rc485-draft-critical.mjs'),'release workflow missing rc4.85 gate');
must(releaseWorkflow.includes('node tools/rc486-draft-critical.mjs'),'release workflow missing rc4.86 gate');
must(releaseWorkflow.includes('node tools/rc487-draft-critical.mjs'),'release workflow missing rc4.87 gate');
must(releaseWorkflow.includes('node tools/rc488-draft-critical.mjs'),'release workflow missing rc4.88 gate');
must(releaseWorkflow.includes('node tools/rc489-draft-critical.mjs'),'release workflow missing rc4.89 gate');
must(releaseWorkflow.includes('node tools/rc490-draft-critical.mjs'),'release workflow missing rc4.90 gate');
must(releaseWorkflow.includes('node tools/rc491-return-calibration.mjs'),'release workflow missing rc4.91 gate');
must(releaseWorkflow.includes('node tools/rc496-draft-critical.mjs'),'release workflow missing rc4.96 gate');
must(packageWorkflow.includes('node tools/rc483-draft-critical.mjs'),'package workflow missing rc4.83 gate');
must(packageWorkflow.includes('node tools/rc485-draft-critical.mjs'),'package workflow missing rc4.85 gate');
must(packageWorkflow.includes('node tools/rc486-draft-critical.mjs'),'package workflow missing rc4.86 gate');
must(packageWorkflow.includes('node tools/rc487-draft-critical.mjs'),'package workflow missing rc4.87 gate');
must(packageWorkflow.includes('node tools/rc488-draft-critical.mjs'),'package workflow missing rc4.88 gate');
must(packageWorkflow.includes('node tools/rc489-draft-critical.mjs'),'package workflow missing rc4.89 gate');
must(packageWorkflow.includes('node tools/rc490-draft-critical.mjs'),'package workflow missing rc4.90 gate');
must(packageWorkflow.includes('node tools/rc491-return-calibration.mjs'),'package workflow missing rc4.91 gate');
must(packageWorkflow.includes('node tools/rc496-draft-critical.mjs'),'package workflow missing rc4.96 gate');
must(packageWorkflow.includes('VERSION="$(sed -n'),'package version must derive from APP_VERSION');
must(!packageWorkflow.includes('Draft_Companion_v11.8.0-rc4.82_PREINSTALL.zip'),'stale hard-coded rc4.82 package path resurrected');
must(releaseContract.includes('Exact v2 weights:'),'release contract expert-weight lock missing');
must(preDraftFreshnessGate.includes('PRE_DRAFT_FRESHNESS_FAIL'),'pre-draft freshness fail-closed gate missing');
must(preDraftFreshnessGate.includes("--max-age-days"),'pre-draft freshness age control missing');
must(emergencyQueueContract.includes('EMERGENCY_QUEUE_CONTRACT_PASS'),'emergency queue contract missing');
must(emergencyQueueContract.includes('only one QB while QB1 open'),'emergency queue one-QB canary missing');
must(emergencyQueueContract.includes('only one TE while TE1 open'),'emergency queue one-TE canary missing');

for(const token of ['production/control','Android version authority','latest package/re-extract','work package -> checkpoint -> re-inventory','user must never need to remind'])
  must(bootstrap.includes(token),`repo bootstrap invariant missing: ${token}`);
for(const token of ['rc4.84','rc4.85','rc4.86','rc4.87','rc4.88','rc4.89','rc4.90','AUTO durability','Execution witness','Old-error scan'])
  must(handoffMatrix.includes(token),`repo handoff matrix invariant missing: ${token}`);
must(lock.authority?.libraryMirrorStatus?.includes('STALE_'),'stale Library mirror status must remain explicit until persistence is proven');
must(lock.authority?.failClosedRecovery?.includes('never claim a newer Library generation persisted unless files.list proves it'),'Library persistence fail-closed rule missing');
for(const token of ['Library mirror is stale/writeback-blocked','rc4.82','rc4.83','Re-inventory after EVERY completed work package'])
  must(currentHandoff.includes(token),`current handoff invariant missing: ${token}`);

for(const token of ['pitti-decision-evidence-v2','QB2_VIOLATION','WR6_PLUS_COACH','WR7_PLUS_COACH','TE2_COACH','USER_OVERRIDE','CHOSEN_OUTSIDE_TOP16','telemetryComplete','hardQb2Pass','OOS promotion evidence must come from the realistic mock gate','OOS promotion evidence must use user slot 9','ACUTE_STATUS_CONFOUND','acuteStatusConfoundCount','cleanDecisionCount','cleanHardQb2Pass','cleanSaturatedWrCount','cleanWr7PlusCount'])
  must(evidenceAnalyzer.includes(token),`Evidence-v2 analyzer invariant missing: ${token}`);

const digest=crypto.createHash('sha256').update(JSON.stringify(lock)).digest('hex');
if(!process.exitCode)console.log(`PITTI_GUARDRAILS_PASS lock_sha256=${digest} app=${lock.runtime.appVersion} gate=${e.currentGate}`);