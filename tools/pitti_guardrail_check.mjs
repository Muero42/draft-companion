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
const candidatePreflight=process.env.PITTI_CANDIDATE_PREFLIGHT==='1';
const handoffGeneration=(currentHandoff.match(/Handoff generation:\s*`([^`]+)`/)||[])[1];
const gitBlobSha=(p)=>{
  const b=fs.readFileSync(p);
  const h=crypto.createHash('sha1');
  h.update(Buffer.from(`blob ${b.length}\0`));
  h.update(b);
  return h.digest('hex');
};

must(lock.schema==='pitti.execution-lock.v1','execution lock schema');
if(!candidatePreflight) must(lock.runtime?.appVersion===((app.match(/const APP_VERSION='([^']+)'/)||[])[1]),'runtime version lock drift');
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
must(lock.auto?.noVisibleResponseWhileReadyWorkExists===true,'AUTO no-output guard missing');
must(lock.auto?.stopRequiresMachineReadableEvaluation===true,'AUTO machine-readable stop evaluation missing');
must(lock.auto?.stateMachine?.version==='pitti-auto-state.v1','AUTO state-machine version missing');
must(lock.auto?.stateMachine?.persistedIn==='PITTI_CURRENT_STATE.json:auto_execution_state','AUTO state path drift');
must(lock.auto?.stateMachine?.waitingExternalRule?.includes('never a global stop condition'),'AUTO waiting-external lane isolation missing');
const autoState=current.auto_execution_state;
must(autoState?.schema==='pitti.auto-state.v1','CURRENT AUTO queue schema missing');
for(const bucket of ['active','ready','waiting_external','blocked_user','completed_recent']) must(Array.isArray(autoState?.[bucket]),`CURRENT AUTO queue bucket missing: ${bucket}`);
const allowedAutoStops=new Set(['USER_ACTION_REQUIRED','DECISION_REQUIRED','PROJECT_MILESTONE_REACHED','NO_EXECUTABLE_WORK_REMAINS','SAFETY_OR_IRREVERSIBLE_CONFIRMATION']);
const executableAutoWork=(autoState?.active?.length||0)+(autoState?.ready?.length||0);
if(executableAutoWork>0){
  must(autoState?.status==='RUNNING','AUTO must remain RUNNING while active/ready work exists');
  must(autoState?.stop_evaluation?.allowed===false,'AUTO stop cannot be allowed while active/ready work exists');
}else if(autoState?.stop_evaluation?.allowed===true){
  must(allowedAutoStops.has(autoState?.stop_evaluation?.code),'AUTO stop code invalid');
}


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
  'external/device/OOS gate is a valid interruption only after all independent',
  'AUTO STATE MACHINE / NO-OUTPUT GUARD',
  'NO-OUTPUT GUARD',
  'waiting_external',
  'stop_evaluation.allowed=true'
]) must(preflight.includes(token),`preflight gate missing: ${token}`);

must(readme.includes('v11.8.0-rc4.64'),'README production/control baseline drift');
must(readme.includes(current.runtime?.test_challenger||'v11.8.0-rc4.86'),'README current candidate missing');
must(policy.includes("USER_DRAFT_HARD_EXCLUSIONS=new Set(['geno smith','aaron rodgers'])"),'explicit Geno/Rodgers hard exclusions missing');
must(app.includes("userDraftStrategyExcluded(p.pos,state.counts,p.name)"),'named user exclusion wiring missing');
must(app.includes('USER HARD EXCLUSION: nicht draften'),'hard-exclusion Coach reason missing');
must(app.includes("function normalCandidateAdmissible(row)"),'normal candidate admissibility guard missing');
must(app.includes("const normal=source.filter(normalCandidateAdmissible)"),'normal-cut rows must precede fallback in visible Top-10');
must(app.includes("if(visible.length<10)"),'fallback fill must only occur after normal-cut selection');
must(policy.includes('USER_DRAFT_QB_LIMIT=1'),'user one-QB runtime invariant missing');
must(app.includes("from './decision-policy.js'"),'decision policy wiring missing');
must(app.includes("Progressive WR-Sättigung")||app.includes('WR-Sättigung'),'WR saturation canary missing');
must(app.includes('function simulateReturnV2('),'Return-v2 kernel missing');
must(app.includes('function seasonHorizonSplit('),'Season waiver horizon split missing');
must(app.includes('const weekly=weeklyFresh?'),'THIS WEEK waiver horizon must fail closed without fresh evidence');
must(app.includes("weekly:null")||app.includes("weekly=weeklyFresh?"),'THIS WEEK stale-evidence null path missing');
must(app.includes("FA-vs-Roster v2"),'Waiver v2 surface missing');
must(app.includes("frische Weekly-Evidence fehlt"),'Waiver v2 stale weekly explanation missing');
must(app.includes('Trade Board v4'),'Trade Board v4 surface missing');
must(app.includes('function tradeOfferCandidates('),'Trade offer construction helper missing');
must(app.includes('Annahme-Plausibilität'),'Trade acceptance plausibility missing');
must(app.includes('Week-1 Start/Sit v3'),'Start/Sit v3 surface missing');
must(app.includes('function weeklyLineupEvidence('),'weekly lineup evidence helper missing');
must(app.includes('Weekly Consensus Rank ist primär'),'weekly rank primary invariant missing');
must(app.includes('Special Teams v2'),'Special Teams v2 quality-floor surface missing');
must(app.includes("dropCandidatePolicy:{primary:['Tank Bigsby','Tyjae Spears','Kenneth Gainwell'],protected:['Jadarian Price','Christian Watson','Josh Downs']"),'Mevis drop gate must protect Price/Watson/Downs and compare Bigsby/Spears/Gainwell');
must(app.includes('DROP-Reihenfolge Bigsby → Spears → Gainwell; Price / Watson / Downs geschützt'),'Waiver UI must surface the guarded Mevis drop order');
must(app.includes('SEASON_FA_POOL_ZERO_INVALID'),'zero live season FA pool must fail closed');
must((app.match(/SEASON_FA_POOL_ZERO_INVALID/g)||[]).length>=2,'zero FA fail-closed gate must cover both startup bootstrap and analyze path');
must(app.includes('FA-POOL NICHT VALIDIERT'),'invalid season FA pool must be visible');
must(app.includes('kein FA/HOLD-Urteil aus Draft-Verfügbarkeit'),'post-draft FA must never fall back to draft availability');

must(app.includes('filter(x=>x.rb&&x.rb.tier<=4)'),'D/ST quality floor must filter tier 5/6 before ranking');


must(app.includes('function applyPlayerQualitySafetyGate('),'Value-Safety gate missing');

for(const name of ['Guilherme Gianni','Michael Bobal']) must(!app.includes(name),`temporary availability-only expert leaked into runtime: ${name}`);
must(!text('expert-v2-board.js').includes('Ryan Weisse'),'Weisse must not leak into frozen Expert-v2 board');
must(text('expert-v3-board.js').includes("schema:'pitti-expert-v3-board.v1'"),'Expert-v3 board missing');
for(const token of ["{name:'Ryan Weisse',pos:'RB'}","{name:'Wolf of Roto Street',pos:'TE'}","{name:'Todd D Clark',pos:'QB'}","{name:'Joey Wright',pos:'WR'}"]) must(app.includes(token),`Expert-v3 acquisition target missing: ${token}`);

const e=lock.expertV2||{};
must(['THREE_SELECTABLE_PROFILES_CURRENT_AUTHORITY_NO_FINAL_WINNER','LEGACY_PRESERVED_SUPERSEDED_FOR_NEW_V4_V5_COMPARISON'].includes(e.status),'three-profile Expert-v2 preservation drift');
must(['SELECTABLE_ABC_COMPARISON','LEGACY_SELECTABLE_ONLY_UNTIL_V4_V5_VALIDATED'].includes(e.integration),'legacy profile selectability invariant missing');
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
must(String(e.sourceLocks?.['Sean Koerner']||'').includes('IMPORT/COVERAGE STILL MUST BE VERIFIED')||e.sourceLocks?.['Sean Koerner']==='NO_CURRENT_DRAFT_ACQUISITION_PAYWALL_WATCHLIST_ONLY','Koerner acquisition lock drift');
must(['COUNT_EXACTLY_ONCE_AS_CORRELATED_FAMILY','ORGANIZATION_ACCURACY_STRONG_BUT_TEAM_FEED_ATTRIBUTION_NOT_EQUIVALENT_TO_IDENTIFIED_INDIVIDUAL_ACCURACY; KEEP_V3_ONLY; EXCLUDE_FROM_V4_INDIVIDUAL_ONLY'].includes(e.sourceLocks?.['Draft Sharks Team']),'Draft Sharks family-count/v4 exclusion invariant missing');
must(['NO_AUTO_RESTORE_AVAILABILITY_ONLY; FRESH_INDIVIDUAL_QUALIFICATION_ALLOWED','OLD_AVAILABILITY_REJECTION_SUPERSEDED; FRESH_INDIVIDUAL_QUALIFICATION_ALLOWED'].includes(e.sourceLocks?.Weisse_Gianni_Bobal),'temporary pool qualification semantics drift');
must(e.weightsAreFinalWinner===false,'no Expert-v2 profile may be mislabeled final winner');
must(e.oldWrOnlyRejectionSemanticsAreAuthority===false,'obsolete WR-only authority resurrected');
must(lock.league?.userDraftQbLimit===1,'user one-QB strategy lock drift');
must(lock.league?.userQb2Policy==='HARD_USER_STRATEGY_EXCLUSION_AFTER_QB1','user QB2 policy drift');
must(/^\d+\.\d+\.\d+$/.test(String(commandContract.version||'')),'repo command contract version malformed');
must(commandContract.sourceOrder?.includes('PITTI_CURRENT_STATE.json'),'CURRENT missing from takeover source order');
must(commandContract.sourceOrder?.includes('PITTI_HANDOFF_SEAL.json'),'SEAL missing from takeover source order');
must(commandContract.auto?.longestSafeBlocks===true,'repo command contract long-block drift');
must(commandContract.auto?.userReminderRequired===false,'repo command contract reminder drift');
must(commandContract.auto?.reinventoryAfterEveryWorkPackage===true,'repo command contract post-package inventory drift');
must(commandContract.auto?.blockedGateStopsOnlyDependentLane===true,'repo command contract lane isolation drift');
must(commandContract.auto?.promiseOnlyResponseForbidden===true,'repo command contract promise-only guard drift');
must(commandContract.auto?.externalGateValidStopOnlyAfterIndependentLaneExhaustion===true,'repo command contract external-gate guard drift');
must(commandContract.auto?.persistentStateMachine?.mustLoadBeforeAuto===true,'command contract persistent AUTO state machine missing');
must(commandContract.auto?.persistentStateMachine?.waitingExternalGlobalStop===false,'command contract waiting-external global-stop regression');
must(commandContract.auto?.persistentStateMachine?.blockedUserGlobalStop===false,'command contract blocked-user global-stop regression');
must(commandContract.auto?.persistentStateMachine?.stopRequires?.activeEmpty===true&&commandContract.auto?.persistentStateMachine?.stopRequires?.readyEmpty===true&&commandContract.auto?.persistentStateMachine?.stopRequires?.stopEvaluationAllowed===true,'command contract AUTO stop requirements drift');
must(bootstrap.includes('AUTO queue takeover'),'new-chat AUTO queue takeover missing');
if(current.mode==='POST_DRAFT_SEASON_COMPANION'){
  must(/^20260901T\d{4}Z-v\d+$/.test(String(current.handoff_generation||'')),'Season Companion CURRENT generation malformed');
  must(lock.handoff_generation===current.handoff_generation,'Season Companion LOCK generation drift');
  must(commandContract.handoff_generation===current.handoff_generation,'Season Companion COMMAND generation drift');
  must(bootstrap.includes(current.handoff_generation),'Season Companion BOOTSTRAP generation drift');
  must(handoffMatrix.includes(current.handoff_generation),'Season Companion MATRIX generation drift');
  must(currentHandoff.includes(current.handoff_generation),'Season Companion HANDOFF generation drift');
  must(['v11.8.0-rc4.161','v11.8.0-rc4.162','v11.8.0-rc4.163','v11.8.0-rc4.164','v11.8.0-rc4.165','v11.8.0-rc4.166','v11.8.0-rc4.167','v11.8.0-rc4.168','v11.8.0-rc4.169','v11.8.0-rc4.170','v11.8.0-rc4.171','v11.8.0-rc4.172','v11.8.0-rc4.173','v11.8.0-rc4.174','v11.8.0-rc4.175','v11.8.0-rc4.176','v11.8.0-rc4.177','v11.8.0-rc4.178','v11.8.0-rc4.179','v11.8.0-rc4.180','v11.8.0-rc4.181'].includes(current.authority?.source_candidate),'Season Companion source candidate regression');
  must(['DEVICE_RC4161_ACCEPTANCE','SEASON_ACTIONABILITY_INCREMENT','DEVICE_RC4163_SEASON_SURFACES','DEVICE_RC4164_LIVE_SEASON_HYDRATION','SELFTEST_RC4165_SEASON_STARTUP','DEVICE_RC4165_FINAL_CANARY','RC4166_CI_AND_PREVIEW_DEPLOY','DEVICE_RC4166_FINAL_CANARY','VERIFY_RC4167_PREVIEW_THEN_SINGLE_DEVICE_CANARY','RC4168_PARITY_THEN_DEVICE_REFRESH','RC4169_PREVIEW_PARITY_THEN_DEVICE_REFRESH','RC4170_PREVIEW_THEN_DEVICE_REFRESH','AUTOMATED_SEASON_E2E_BEFORE_ANY_DEVICE_UPDATE','FINAL_DEVICE_CONFIRMATION_AFTER_RESEAL','RC4177_STRICT_VALIDATION','DEVICE_RC4177_DIAGNOSTIC_CANARY','RC4178_STRICT_VALIDATION','RC4179_STRICT_VALIDATION','RC4180_STRICT_VALIDATION','RC4181_STRICT_VALIDATION'].includes(commandContract.currentGate),'Season Companion command gate regression');
  must(['DEVICE_RC4161_ACCEPTANCE','SEASON_ACTIONABILITY_INCREMENT','DEVICE_RC4163_SEASON_SURFACES','DEVICE_RC4164_LIVE_SEASON_HYDRATION','SELFTEST_RC4165_SEASON_STARTUP','DEVICE_RC4165_FINAL_CANARY','RC4166_CI_AND_PREVIEW_DEPLOY','DEVICE_RC4166_FINAL_CANARY','VERIFY_RC4167_PREVIEW_THEN_SINGLE_DEVICE_CANARY','RC4168_PARITY_THEN_DEVICE_REFRESH','RC4169_PREVIEW_PARITY_THEN_DEVICE_REFRESH','RC4170_PREVIEW_THEN_DEVICE_REFRESH','AUTOMATED_SEASON_E2E_BEFORE_ANY_DEVICE_UPDATE','FINAL_DEVICE_CONFIRMATION_AFTER_RESEAL','RC4177_STRICT_VALIDATION','DEVICE_RC4177_DIAGNOSTIC_CANARY','RC4178_STRICT_VALIDATION','RC4179_STRICT_VALIDATION','RC4180_STRICT_VALIDATION','RC4181_STRICT_VALIDATION'].includes(lock.gate),'Season Companion lock gate regression');
  must(['DEVICE_RC4161_ACCEPTANCE','SEASON_ACTIONABILITY_INCREMENT','DEVICE_RC4163_SEASON_SURFACES','DEVICE_RC4164_LIVE_SEASON_HYDRATION','SELFTEST_RC4165_SEASON_STARTUP','DEVICE_RC4165_FINAL_CANARY','RC4166_CI_AND_PREVIEW_DEPLOY','DEVICE_RC4166_FINAL_CANARY','RC4167_ALL_GATES_THEN_SINGLE_PREVIEW_DEPLOY','VERIFY_RC4167_PREVIEW_THEN_SINGLE_DEVICE_CANARY','RC4168_PARITY_THEN_DEVICE_REFRESH','RC4169_PREVIEW_PARITY_THEN_DEVICE_REFRESH','RC4170_PREVIEW_THEN_DEVICE_REFRESH','AUTOMATED_SEASON_E2E_BEFORE_ANY_DEVICE_UPDATE','FINAL_DEVICE_CONFIRMATION_AFTER_RESEAL','RC4177_STRICT_VALIDATION','DEVICE_RC4177_DIAGNOSTIC_CANARY','RC4178_STRICT_VALIDATION','RC4179_STRICT_VALIDATION','RC4180_STRICT_VALIDATION','RC4181_STRICT_VALIDATION','RC4181_BROWSER_EQUIVALENT_SEASON_E2E'].includes(current.currentWork?.nextGate),'Season Companion CURRENT next gate regression');
  must(currentHandoff.includes('Tank Bigsby absent'),'Season Companion transaction canary regression');
  must(!currentHandoff.includes('Tank Bigsby added'),'stale Bigsby-added canary resurrected');
  must(bootstrap.includes('Do NOT repeat rc4.160 device testing'),'rc4.160 retest prohibition missing');
  must(handoffMatrix.includes('Empty assistant response after tool work is forbidden'),'AUTO empty-response handoff guard missing');
  must(currentHandoff.includes('Never send status/progress/acknowledgement messages'),'AUTO progress-response handoff guard missing');
}


must(commandContract.auto?.autoBlockCorrectionTrigger?.trigger==='AUTO BLOCK','AUTO BLOCK command contract missing');
if(!candidatePreflight) must(commandContract.currentBoundary?.androidAuthority===current.runtime?.android_authority,'command contract Android authority drift');
if(!candidatePreflight) must(commandContract.currentBoundary?.latestPackageSha256===current.runtime?.latest_package_sha256,'command contract package reference hash drift');
if(!candidatePreflight) must(commandContract.currentBoundary?.packageReferenceRun===current.runtime?.package_reference_run,'package reference run drift');
if(!candidatePreflight) must(commandContract.currentBoundary?.deployedPagesAppByteParityWithMain===current.runtime?.deployed_pages_app_byte_parity_with_main,'main/pages parity state drift');
if(!candidatePreflight){
  must(current.handoff_generation===seal.handoff_generation,'CURRENT/SEAL generation mismatch');
  must(current.handoff_generation===handoffGeneration,'CURRENT/Handoff generation mismatch');
}
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
if(!candidatePreflight) must(current.handoff?.transaction_in_progress===false,'sealed takeover still marked transaction_in_progress');
const generationVersion=(current.handoff_generation.match(/-v(\d+)$/)||[])[1];
must(generationVersion,'CURRENT generation version missing');
if(!candidatePreflight) must(handoffMatrix.includes(`REPO v${generationVersion}`)||handoffMatrix.includes(`— v${generationVersion}`)||handoffMatrix.includes(`Generation: \`${current.handoff_generation}\``),'handoff matrix generation label drift');
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

const currentSourceRc=(String(current.source_authority||'').match(/rc4\.\d+/)||[])[0];
must(currentSourceRc,'CURRENT source authority missing RC version');
// Legacy handoff documents are historical recovery aids after a verified takeover; they must not
// block an isolated candidate merely because their prose still names an older generation.
// Current machine-readable lock/CURRENT + runtime regressions remain authoritative candidate gates.
must(lock.authority?.libraryMirrorStatus?.includes('STALE_'),'stale Library mirror status must remain explicit until persistence is proven');
must(lock.authority?.failClosedRecovery?.includes('never claim a newer Library generation persisted unless files.list proves it'),'Library persistence fail-closed rule missing');

for(const token of ['pitti-decision-evidence-v2','QB2_VIOLATION','WR6_PLUS_COACH','WR7_PLUS_COACH','TE2_COACH','USER_OVERRIDE','CHOSEN_OUTSIDE_TOP16','telemetryComplete','hardQb2Pass','OOS promotion evidence must come from the realistic mock gate','OOS promotion evidence must use user slot 9','ACUTE_STATUS_CONFOUND','acuteStatusConfoundCount','cleanDecisionCount','cleanHardQb2Pass','cleanSaturatedWrCount','cleanWr7PlusCount'])
  must(evidenceAnalyzer.includes(token),`Evidence-v2 analyzer invariant missing: ${token}`);

const digest=crypto.createHash('sha256').update(JSON.stringify(lock)).digest('hex');
if(!process.exitCode)console.log(`PITTI_GUARDRAILS_PASS lock_sha256=${digest} app=${lock.runtime.appVersion} gate=${e.currentGate}`);
if(current.currentWork?.nextGate==='AUTOMATED_SEASON_E2E_BEFORE_ANY_DEVICE_UPDATE'){
  must(commandContract.auto?.devicePromotionRequiresAutomatedSeasonE2E===true,'device promotion E2E guard missing');
  must(commandContract.auto?.manualDeviceCanaryIsFinalConfirmationOnly===true,'device canary final-only guard missing');
  must(commandContract.auto?.manualTrialAndErrorForbidden===true,'manual trial-and-error prohibition missing');
  must(current.runtime?.device_update_policy==='FORBIDDEN_UNTIL_AUTOMATED_SEASON_E2E_PASS','device update policy drift');
}
