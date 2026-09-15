import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

export const AUTHORITY_GATE='ELIGIBLE_FOR_SEPARATELY_AUTHORIZED_PRODUCTION_DEPLOYMENT_GATE';
export const GENERATION='20260915T1206Z-v254';
const CHECKPOINT_AT='2026-09-15T12:06:00Z';
const SOURCE='v11.8.0-rc4.204';
const SOURCE_COMMIT='8baf1799589550373d36357258d6d882e79e9842';
const REPAIR_HEAD='fe8b6a397dac2b60522cb959ffdb225b767fbcae';
const PROD='v11.8.0-rc4.203';
const PROD_COMMIT='fb458e076de6710a91f1162e504b5b79fb67167c';
const DEPLOYMENT='ef65bcf6-92d1-4c34-9873-c362bec002c7';
const DEVICE_VERDICT='RC4.203_PHYSICAL_FAIL_WEEKLY_PROJECTION_SEMANTIC_SCOPE_MISMATCH';
const DEVICE_EVIDENCE='docs/PITTI_BRIDGE_HANDOFF_RC4203_PHYSICAL_PROJECTION_LANE_FAIL_2026-09-15.md';
const PACKAGE_SHA='d9fc7432c5cbea4a48a3fda97c13151bb56e0a14a8ea7deeb81822faa51400f3';
const WATCHER_HEAD='77221ceeb900458e95c32d78c1ad395a37422e5d';
const core=['PITTI_CURRENT_STATE.json','PITTI_EXECUTION_LOCK.json','PITTI_COMMAND_CONTRACTS.json','PITTI_HANDOFF_SEAL.json'];
const docs=['PITTI_NEW_CHAT_BOOTSTRAP.md','NEW_CHAT_HANDOFF_CURRENT.md','HANDOFF_COMPLETENESS_MATRIX.md','PITTI_AUTO_PREFLIGHT.md','PITTI_PROJECT_STATE.md','README.md','docs/PITTI_BRIDGE_HANDOFF_V254_2026-09-15.md','docs/PITTI_CODEX_HANDOFF_AUDIT_V254_2026-09-15.md',DEVICE_EVIDENCE];

export function validateContinuationEvidence(e){
  const errors=[];
  if(e?.fresh!==true||e?.repo!=='Muero42/draft-companion'||e?.canonicalBranch!=='main')errors.push('fresh canonical Git/GitHub identity required');
  if(!/^[a-f0-9]{40}$/.test(e?.head??'')||!/^[a-f0-9]{40}$/.test(e?.canonicalHead??'')||e?.clean!==true)errors.push('verified HEADs and clean worktree required');
  if(e?.prState==='OPEN'){if(e.prHead!==e.head||e.branch==='main'||!e.branch)errors.push('open PR exact-head branch evidence required');}
  else if(e?.prState==='MERGED'){if(e.branch!=='main'||e.head!==e.canonicalHead||e.containingCommitVerified!==true)errors.push('merged canonical containment evidence required');}
  else errors.push('verified PR state required');
  const required=['project_guardrails','release_contract_v2','candidate_package'];
  const checks=Array.isArray(e?.checks)?e.checks:[];
  if(e?.ciHead!==e?.head||checks.length!==required.length||!required.every(name=>{const m=checks.filter(x=>x?.name===name);return m.length===1&&m[0].result==='PASS';}))errors.push('all three unambiguous exact-head checks required');
  if(e?.authorizedWorkPackage!==true)errors.push('current user authorization required');
  return errors;
}

export function loadAuthority(root='.'){
  return Object.fromEntries([...core,...docs].map(p=>[p,core.includes(p)?JSON.parse(fs.readFileSync(path.join(root,p),'utf8')):fs.readFileSync(path.join(root,p),'utf8')]));
}

export function validateAuthority(data){
  const errors=[];
  const check=(ok,p,msg)=>{if(!ok)errors.push(`${p}: ${msg}`);};
  const [c,l,k,s]=core.map(p=>data[p]);
  const q=c.qb_policy;
  check(c.invariants.user_draft_qb_limit===1&&c.invariants.user_draft_qb_limit_scope==='DRAFT_ONLY'&&!Object.hasOwn(c.invariants,'user_qb_limit'),'CURRENT.invariants','QB limit must remain draft-scoped');
  check(q?.draft?.qb_limit===1&&q.draft.exclude_qb2_after_qb1===true&&q?.season?.qb2_exception_allowed===true&&q.season_exception_weakens_draft_rule===false,'CURRENT.qb_policy','draft QB2 exclusion and season exception boundary drift');
  check(l.league.userQb2Policy==='DRAFT_ONLY_EXCLUSION_AFTER_QB1'&&l.canaries.draftQb2MustNotAppearOnUserCoachSurfaceAfterQb1===true,'LOCK.QB2','draft-only QB2 policy drift');
  for(const [label,o] of [['LOCK',l],['COMMAND',k]])check(o.qb_policy_reference==='PITTI_CURRENT_STATE.json:qb_policy',label+'.qb_policy_reference','canonical QB policy reference required');

  check(c.handoff_generation===GENERATION&&c.handoffGeneration===GENERATION&&l.handoff_generation===GENERATION&&l.handoffGeneration===GENERATION&&k.handoff_generation===GENERATION&&k.handoffGeneration===GENERATION&&s.handoff_generation===GENERATION,'generation','all v254 generation aliases must agree');
  check(c.updated_at===CHECKPOINT_AT&&l.updatedAt===CHECKPOINT_AT&&l.updated_at===CHECKPOINT_AT&&k.updated_at===CHECKPOINT_AT&&s.updated_at===CHECKPOINT_AT&&s.created_at===CHECKPOINT_AT,'timestamp','all v254 timestamp aliases must agree');
  for(const [label,o] of [['CURRENT',c],['LOCK',l]]){
    for(const p of ['gate','nextGate'])check(o[p]===AUTHORITY_GATE,`${label}.${p}`,'deployment eligibility gate drift');
    check(o.currentWork?.nextGate===AUTHORITY_GATE,`${label}.currentWork.nextGate`,'deployment eligibility gate drift');
    check(o.handoff?.generation===GENERATION&&o.handoff?.transaction_in_progress===false,`${label}.handoff`,'handoff generation/transaction drift');
    const pending=o.handoff?.status==='PENDING_SECOND_PASS'&&o.handoff.ready===false&&o.handoff.secondPass===false&&o.status==='AUTHORITY_RECONCILIATION_PENDING_SECOND_PASS';
    const complete=o.handoff?.status==='PASS'&&o.handoff.ready===true&&o.handoff.secondPass===true&&o.status==='AUTHORITY_RECONCILED_REVERIFY_BEFORE_CONTINUATION';
    check(pending||complete,`${label}.handoff`,'handoff may be pending or truthfully completed only');
    check(o.currentWork?.status===o.status,`${label}.status`,'duplicate status drift');
    check(o.handoff?.resume===c.handoff.resume,`${label}.handoff.resume`,'resume drift');
  }
  for(const [p,v] of Object.entries({currentGate:k.currentGate,currentResearchGate:k.currentResearchGate,boundary:k.currentBoundary?.currentResearchGate,boundaryNext:k.currentBoundary?.nextGate,season:k.seasonCompanion?.nextGate,seal:s.exact_gate}))check(v===AUTHORITY_GATE,`COMMAND/SEAL.${p}`,'gate drift');
  check(k.exactNextAction===c.handoff.resume&&k.currentBoundary.exactNextAction===c.handoff.resume&&l.exactNextAction===c.handoff.resume&&l.failClosedRecovery===c.handoff.resume,'resume','coupled resume drift');

  check(c.authority.repo==='Muero42/draft-companion'&&c.authority.branch==='DYNAMIC_VERIFICATION_REQUIRED'&&c.authority.reconciled_base_main==='DYNAMIC_EXTERNAL_EVIDENCE'&&c.authority.source_candidate===SOURCE,'CURRENT.authority','source identity drift');
  const merge=c.authority.rc4204_source_merge;
  check(merge?.checkpoint==='v254'&&merge.version===SOURCE&&merge.pr===176&&merge.status==='MERGED/SOURCE_ONLY_NOT_PRODUCTION'&&merge.base_head===PROD_COMMIT&&merge.repair_head===REPAIR_HEAD&&merge.merge_commit===SOURCE_COMMIT&&merge.canonical_branch==='main'&&merge.deployment_proven===false&&merge.device_observation_proven===false&&merge.device_acceptance_proven===false,'CURRENT.authority.rc4204_source_merge','exact PR #176 source-only provenance required');
  check(String(merge?.repair_semantics).includes('omit ros')&&String(merge?.repair_semantics).includes('ros=false must not be restored')&&String(merge?.repair_semantics).includes('no unsupported scoring parameter')&&String(merge?.repair_semantics).includes('stats.points_half'),'CURRENT.authority.rc4204_source_merge.repair_semantics','proven repair semantics drift');
  check(merge?.validation?.focused==='7/7 PASS'&&merge.validation.strict==='225/225 PASS'&&merge.validation.package_reextract==='PASS'&&merge.validation.observed_archive_sha256===PACKAGE_SHA&&String(merge.validation.archive_sha_semantics).includes('RUN_AND_ENVIRONMENT_SCOPED')&&merge.validation.exact_head_ci?.length===5,'CURRENT.authority.rc4204_source_merge.validation','pre-merge validation provenance drift');
  const candidate=c.authority.rc4204_candidate;
  check(candidate?.version===SOURCE&&candidate.status==='SOURCE_MERGED_NOT_PRODUCTION'&&candidate.deployment_proven===false&&candidate.device_observation_proven===false&&candidate.device_acceptance_proven===false,'CURRENT.authority.rc4204_candidate','rc4.204 must remain merged source only');

  const prod=c.authority.rc4203_production_deployment,device=c.authority.rc4203_physical_failure,alias=c.authority.rc4203_candidate;
  check(prod?.version===PROD&&prod.source_commit===PROD_COMMIT&&prod.deployment_id===DEPLOYMENT&&prod.status==='VERIFIED_SUCCESS'&&prod.branch==='main'&&prod.device_acceptance_proven===false,'CURRENT.authority.rc4203_production_deployment','rc4.203 Production history drift');
  check(device?.version===PROD&&device.source_commit===PROD_COMMIT&&device.evidence===DEVICE_EVIDENCE&&device.acceptance==='FAIL'&&device.classification===DEVICE_VERDICT,'CURRENT.authority.rc4203_physical_failure','rc4.203 failed physical history drift');
  check(alias?.status==='MERGED/HISTORICAL_PRODUCTION_DEVICE_OBSERVED_FAILED'&&alias.deployment_proven===true&&alias.device_observation_proven===true&&alias.device_acceptance_proven===false,'CURRENT.authority.rc4203_candidate','rc4.203 historical alias drift');
  for(const token of [SOURCE,SOURCE_COMMIT,REPAIR_HEAD,PROD,PROD_COMMIT,DEPLOYMENT,DEVICE_VERDICT,'rc4.202','rc4.201','rc4.200','rc4.199','rc4.198','rc4.195'])check(String(c.source_authority).includes(token),'CURRENT.source_authority',`chronology missing ${token}`);

  check(c.runtime.season_candidate.includes(SOURCE)&&c.runtime.season_candidate.includes('NOT Production-deployed')&&c.runtime.source_candidate_status==='RELEASE_CANDIDATE_VALIDATING'&&c.runtime.preview_candidate.includes(SOURCE)&&c.runtime.preview_candidate.includes('non-production'),'CURRENT.runtime.source','rc4.204 source/preview-only state drift');
  check(c.runtime.installed_android===PROD&&c.runtime.latest_android_observed===PROD&&c.runtime.latestAndroidVersionObserved===PROD,'CURRENT.runtime.device aliases','latest device alias drift');
  check(c.runtime.latest_device_evidence?.version===PROD&&c.runtime.latest_device_evidence.acceptance==='FAIL'&&c.runtime.latest_device_evidence.classification===DEVICE_VERDICT,'CURRENT.runtime.latest_device_evidence','latest failed physical evidence drift');
  check(c.runtime.deployed_production_version===PROD&&c.runtime.deployed_pages_head===PROD_COMMIT&&c.runtime.production_deployment?.deployment_id===DEPLOYMENT&&c.runtime.deployed_pages_app_byte_parity_with_main===false&&String(c.runtime.deployment_parity).includes('ARBITRARY_BYTE_PARITY_NOT_PROVEN'),'CURRENT.runtime.production','Production identity/parity boundary drift');
  check(l.runtime.appVersion===SOURCE&&l.runtime.deployedPagesVersion===PROD&&l.runtime.latestAndroidVersionObserved===PROD&&l.runtime.androidVerified===false&&l.runtime.testChallengerAndroidObserved===false&&l.runtime.testChallengerAndroidAccepted===false,'LOCK.runtime','source/device boundary drift');
  check(k.currentBoundary.sourceAuthority.includes(SOURCE)&&k.currentBoundary.sourceAuthority.includes('NOT Production')&&k.currentBoundary.productionDeployment?.version===PROD&&k.currentBoundary.androidAuthority.includes(DEVICE_VERDICT),'COMMAND.currentBoundary','source/Production/device boundary drift');
  check(s.branch_locks.source_baseline===SOURCE&&s.branch_locks.codex_work.includes('v254 rc4.204')&&s.branch_locks.latest_physical_android.includes(DEVICE_VERDICT)&&s.branch_locks.deployment_parity.includes(PROD_COMMIT)&&s.branch_locks.deployment_parity.includes('rc4.204 undeployed'),'SEAL.branch_locks','seal boundary drift');

  for(const [label,pkg] of [['CURRENT',c.runtime.local_candidate_package],['LOCK',l.runtime.localCandidatePackage],['COMMAND',k.currentBoundary.localCandidatePackage]]){
    check(pkg?.version===SOURCE&&pkg.files===17&&pkg.sha256===null&&pkg.status==='PACKAGED_ONLY_NOT_DEPLOYED'&&String(pkg.archive_sha_semantics||pkg.archiveShaSemantics).includes('RUN_AND_ENVIRONMENT_SCOPED')&&(pkg.validation_observed_archive_sha256||pkg.validationObservedArchiveSha256)===PACKAGE_SHA,`${label}.package`,'package evidence/noncanonical SHA boundary drift');
  }
  check(c.runtime.latest_package_sha256===null&&l.runtime.preinstallSha256===null&&k.currentBoundary.latestPackageSha256===null,'package aliases','archive SHA must not become canonical identity');

  const targets=l.authority.liveVerificationTargets;
  check(Array.isArray(targets)&&targets.length===4,'LOCK.liveVerificationTargets','four bounded lanes required');
  check(targets.some(x=>x.pr===176&&x.lane==='HISTORICAL_MERGED_RC4.204_SOURCE_PROVENANCE'&&x.expectedHead===REPAIR_HEAD),'LOCK.liveVerificationTargets.PR176','merged PR #176 provenance missing');
  check(targets.some(x=>x.pr===175&&x.lane==='HISTORICAL_DISCOVERABLE_V253_HANDOFF_DRAFT_ONLY'&&x.head==='DYNAMIC_EXTERNAL_EVIDENCE'),'LOCK.liveVerificationTargets.PR175','PR #175 must remain dynamic handoff-only history');
  check(targets.some(x=>x.pr===163&&x.lane==='HISTORICAL_DISCOVERABLE_V248_ANCHOR_ONLY'),'LOCK.liveVerificationTargets.PR163','PR #163 historical lane missing');
  check(targets.some(x=>x.repository==='Muero42/pitti-watcher'&&x.pr===6&&x.expectedHead===WATCHER_HEAD),'LOCK.liveVerificationTargets.watcher','watcher lane drift');
  check(String(s.branch_locks.mutable_live_verification_targets?.draft_companion_pr_175).includes('handoff-only')&&String(s.branch_locks.mutable_live_verification_targets?.draft_companion_pr_175).includes('cannot override v254'),'SEAL.liveTargets.PR175','PR #175 must not become current runtime authority');

  const evidence=data[DEVICE_EVIDENCE];
  for(const token of [PROD,PROD_COMMIT,DEPLOYMENT,DEVICE_VERDICT,'FAILED / NOT ACCEPTED','ros=false','after the rc4.203 physical observation'])check(evidence.includes(token),DEVICE_EVIDENCE,`historical evidence missing ${token}`);
  check(c.runtime.accepted_android==='v11.8.0-rc4.195'&&c.runtime.android_accepted==='v11.8.0-rc4.195'&&String(l.runtime.acceptedAndroidAuthority).startsWith('v11.8.0-rc4.195')&&String(s.branch_locks.accepted_rollback).startsWith('v11.8.0-rc4.195'),'rollback','accepted rollback drift');

  const activeJson=JSON.stringify([c.authority.rc4204_source_merge,c.authority.rc4204_candidate,c.runtime.season_candidate,c.runtime.ci,l.authority.liveVerificationTargets,k.currentBoundary,s.branch_locks]);
  check(!/rc4\.203[^\n]{0,80}(?:current source|source candidate)/i.test(activeJson),'anti-resurrection','rc4.203 cannot return as current source');
  check(!/PR #175[^\n]{0,120}(?:current runtime|repair lane|Production lane)/i.test(activeJson),'anti-resurrection','PR #175 cannot become runtime lane');
  check(!/ros=false (?:is|remains|as) (?:correct )?weekly semantics/i.test(activeJson),'anti-resurrection','ros=false cannot be weekly semantics');
  for(const p of docs.slice(0,7)){
    const text=data[p];
    for(const token of [SOURCE,GENERATION,AUTHORITY_GATE])check(text.includes(token),p,`current v254 token missing: ${token}`);
    if(!p.includes('RC4203_PHYSICAL'))for(const token of [SOURCE_COMMIT,REPAIR_HEAD,PROD,PROD_COMMIT,DEPLOYMENT,DEVICE_VERDICT,'PR #176','PR #175','stats.points_half','run/environment-scoped'])check(text.includes(token),p,`current authority token missing: ${token}`);
  }
  check(data['docs/PITTI_CODEX_HANDOFF_AUDIT_V254_2026-09-15.md'].includes(GENERATION),'v254 audit','audit generation missing');
  check(data['docs/PITTI_CODEX_HANDOFF_AUDIT_V254_2026-09-15.md'].includes('PENDING_SECOND_PASS')||data['docs/PITTI_CODEX_HANDOFF_AUDIT_V254_2026-09-15.md'].includes('PASS'),'v254 audit','audit state missing');
  return errors;
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const data=loadAuthority(),errors=validateAuthority(data);
  for(const error of errors)console.error('POSTMERGE_AUTHORITY_FAIL:',error);
  if(errors.length)process.exitCode=1;else console.log(`POSTMERGE_AUTHORITY_PASS generation=v254 state=${data['PITTI_HANDOFF_SEAL.json'].status}`);
}
