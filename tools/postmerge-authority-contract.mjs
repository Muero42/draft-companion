import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

export const AUTHORITY_GATE='VERIFY_CANONICAL_AUTHORITY_THEN_AUTHORIZED_WORK';
export const GENERATION='20260914T0601Z-v250';
const CHECKPOINT_AT='2026-09-14T06:01:00Z';
const SOURCE='v11.8.0-rc4.201';
const PROD='v11.8.0-rc4.200';
const PROD_COMMIT='039fbd3ff169f5476c54e893702bf3aad18035b5';
const DEPLOYMENT='f57beed4-3794-4bae-a047-612d046432f7';
const DEVICE_VERSION='v11.8.0-rc4.200';
const DEVICE_VERDICT='RC4.200_PHYSICAL_FAIL_FRESH_PROJECTION_LANE_UNAVAILABLE_AND_STALE_STATUS_LEAK';
const DEVICE_EVIDENCE='docs/PITTI_BRIDGE_HANDOFF_RC4200_PHYSICAL_PROJECTION_LANE_FAIL_2026-09-14.md';
const RC4199_COMMIT='2a62e52cb88187470542840053c72cd310b18e2b';
const RC4199_DEPLOYMENT='48ab58ba-53d5-4b74-b7e6-16629256a9ee';
const RC4199_VERDICT='RC4.199_PHYSICAL_FAIL_WEEKLY_PROJECTION_SEMANTIC_MISMATCH';
const RC4199_EVIDENCE='docs/PITTI_BRIDGE_HANDOFF_RC4199_PHYSICAL_WEEKLY_PROJECTION_FAIL_2026-09-13.md';
const RC4198_MERGE='826a1f3327ffac643f3c32217246133ea32bd3ac';
const core=['PITTI_CURRENT_STATE.json','PITTI_EXECUTION_LOCK.json','PITTI_COMMAND_CONTRACTS.json','PITTI_HANDOFF_SEAL.json'];
const docs=['PITTI_NEW_CHAT_BOOTSTRAP.md','NEW_CHAT_HANDOFF_CURRENT.md','HANDOFF_COMPLETENESS_MATRIX.md','PITTI_AUTO_PREFLIGHT.md','PITTI_PROJECT_STATE.md','README.md'];
const immutableEvidence=[DEVICE_EVIDENCE,RC4199_EVIDENCE];
// External observations are deliberately not persisted as current checkpoint facts.
// This pure decision check consumes freshly collected evidence; it does not fetch it
// or authorize an action. Both PR and canonical-main contexts use the same contract.
export function validateContinuationEvidence(e) {
  const errors=[];
  if(e?.fresh!==true||e?.repo!=='Muero42/draft-companion'||e?.canonicalBranch!=='main') errors.push('fresh canonical Git/GitHub identity required');
  if(!/^[a-f0-9]{40}$/.test(e?.head??'')||!/^[a-f0-9]{40}$/.test(e?.canonicalHead??'')||e?.clean!==true) errors.push('verified HEADs and clean worktree required');
  if(e?.prState==='OPEN') {if(e.prHead!==e.head||e.branch==='main'||!e.branch) errors.push('open PR exact-head branch evidence required');}
  else if(e?.prState==='MERGED') {if(e.branch!=='main'||e.head!==e.canonicalHead||e.containingCommitVerified!==true) errors.push('merged canonical containment evidence required');}
  else errors.push('verified PR state required');
  const requiredChecks=['project_guardrails','release_contract_v2','candidate_package'];
  const checks=Array.isArray(e?.checks)?e.checks:[];
  // Require one authoritative result per required check. Duplicate or unknown rows are
  // ambiguous external evidence, especially when a stale PASS accompanies a current FAIL.
  if(e?.ciHead!==e?.head||checks.length!==requiredChecks.length||!requiredChecks.every(name=>{
    const matching=checks.filter(check=>check?.name===name);
    return matching.length===1&&matching[0].result==='PASS';
  })) errors.push('all three unambiguous exact-head checks required');
  if(e?.authorizedWorkPackage!==true) errors.push('current user authorization required');
  return errors;
}
export function loadAuthority(root='.') {
  return Object.fromEntries([...core,...docs,...immutableEvidence].map(p=>[p,core.includes(p)?JSON.parse(fs.readFileSync(path.join(root,p),'utf8')):fs.readFileSync(path.join(root,p),'utf8')]));
}
export function validateAuthority(data) {
  const errors=[];
  const check=(ok,p,msg)=>{if(!ok) errors.push(`${p}: ${msg}`);};
  const [c,l,k,s]=core.map(p=>data[p]);
  const q=c.qb_policy;
  check(c.invariants.user_draft_qb_limit===1&&c.invariants.user_draft_qb_limit_scope==='DRAFT_ONLY'&&!Object.hasOwn(c.invariants,'user_qb_limit'),'CURRENT.invariants','QB limit must be draft-scoped');
  check(q?.draft?.phase==='DRAFT'&&q.draft.qb_limit===1&&q.draft.exclude_qb2_after_qb1===true&&q.draft.supersession==='FUTURE_EXPLICIT_USER_DECISION_ONLY','CURRENT.qb_policy.draft','draft QB2 exclusion must remain enforced');
  check(q?.season?.phase==='POST_DRAFT_SEASON_COMPANION'&&q.season.universal_qb_roster_limit===null&&q.season.qb2_exception_allowed===true&&['waiver','free_agency','trade','roster_optimization'].every(x=>q.season.contexts?.includes(x))&&q.season_exception_weakens_draft_rule===false,'CURRENT.qb_policy.season','contextual season QB2 must not weaken draft or impose roster cap');
  check(l.league.userQb2Policy==='DRAFT_ONLY_EXCLUSION_AFTER_QB1'&&l.league.userQb2PolicyScope==='DRAFT_ONLY'&&l.canaries.draftQb2MustNotAppearOnUserCoachSurfaceAfterQb1===true&&!Object.hasOwn(l.canaries,'qb2MustNotAppearOnUserCoachSurfaceAfterQb1'),'LOCK.QB2','unscoped QB2 policy forbidden');
  for(const [label,o] of [['LOCK',l],['COMMAND',k]])check(o.qb_policy_reference==='PITTI_CURRENT_STATE.json:qb_policy',label+'.qb_policy_reference','canonical QB policy reference required');
  const generation=c.handoff_generation;
  check(generation===GENERATION,'CURRENT.handoff_generation','v250 generation required');
  check(c.updated_at===CHECKPOINT_AT&&l.updatedAt===CHECKPOINT_AT&&l.updated_at===CHECKPOINT_AT&&k.updated_at===CHECKPOINT_AT&&s.updated_at===CHECKPOINT_AT,'checkpoint timestamp','all v250 timestamp aliases must use the actual non-future repair checkpoint');
  for(const [label,o] of [['CURRENT',c],['LOCK',l]]) {
    for(const p of ['gate','nextGate']) check(o[p]===AUTHORITY_GATE,`${label}.${p}`,'promotion-stable gate required; merged checkpoint cannot remain pending');
    check(o.currentWork?.nextGate===AUTHORITY_GATE,`${label}.currentWork.nextGate`,'promotion-stable gate required');
    check(o.currentWork?.status===o.status&&o.status==='AUTHORITY_RECONCILED_REVERIFY_BEFORE_CONTINUATION',`${label}.status`,'duplicate work status drift');
    check(o.handoffGeneration===generation&&o.handoff_generation===generation&&o.handoff?.generation===generation,`${label}.generation`,'all generation aliases must agree');
    check(o.handoff?.transaction_in_progress===false&&o.handoff?.ready===true&&o.handoff?.secondPass===true&&o.handoff?.status==='PASS',`${label}.handoff`,'completed local handoff required');
    check(o.handoff?.resume===c.handoff.resume,`${label}.handoff.resume`,'resume drift');
  }
  for(const [p,value] of Object.entries({currentGate:k.currentGate,currentResearchGate:k.currentResearchGate,boundary:k.currentBoundary?.currentResearchGate,boundaryNext:k.currentBoundary?.nextGate,season:k.seasonCompanion?.nextGate,seal:s.exact_gate})) check(value===AUTHORITY_GATE,`COMMAND/SEAL.${p}`,'gate drift');
  check(k.handoff_generation===generation&&k.handoffGeneration===generation&&s.handoff_generation===generation,'COMMAND/SEAL.generation','generation drift');
  check(k.exactNextAction===c.handoff.resume&&k.currentBoundary.exactNextAction===c.handoff.resume,'COMMAND.exactNextAction','resume drift');
  check(k.currentBoundary.reconciledBaseMain==='DYNAMIC_EXTERNAL_EVIDENCE','COMMAND.currentBoundary.reconciledBaseMain','canonical main must remain dynamic external evidence');
  check(c.authority?.postmerge?.pr===121&&c.authority.postmerge.checkpoint==='v233'&&c.authority.postmerge.status==='MERGED/HISTORICAL'&&c.authority.postmerge.pending_merge===false&&c.authority.postmerge.pending_strict_ci===false,'CURRENT.authority.postmerge','PR #121/v233 must be merged/historical, never pending');
  const rc4195=c.authority?.rc4195_source_merge;
  check(rc4195?.checkpoint==='v240'&&rc4195.pr===141&&rc4195.status==='MERGED/HISTORICAL'&&rc4195.source_head==='5661d08a3d1e449f6b5ba505c381ec30bff7ecf0'&&rc4195.base_head==='5e29f285103531b81c7579036e7a885e487e0650'&&rc4195.merge_commit==='f1340a2c2d6248212c7652dc58b2f3323f74b1f5'&&rc4195.deployment_proven===false&&rc4195.device_acceptance_proven===false&&String(rc4195.evidence_scope||'').includes('historical merge provenance'),'CURRENT.authority.rc4195_source_merge','PR #141 merge must be timestamped historical provenance without deployment/device inference');
  const rc4196=c.authority?.rc4196_source_merge;
  check(rc4196?.checkpoint==='v243'&&rc4196.pr===143&&rc4196.status==='MERGED/HISTORICAL'&&rc4196.source_head==='69a0593410ab5db754090a01d5b0e5beef2ed38b'&&rc4196.base_head==='8aedc4ea3b7b71591cbc45f971ccf85fe5167074'&&rc4196.merge_commit==='555487237c9075d5e5ceeb1fee196f4763f87cc3'&&rc4196.deployment_proven===false&&rc4196.device_acceptance_proven===false&&String(rc4196.evidence_scope||'').includes('source-merge provenance only'),'CURRENT.authority.rc4196_source_merge','PR #143 source merge must not infer deployment or device acceptance');
  check(c.authority?.pr118?.status==='DYNAMIC_VERIFICATION_REQUIRED'&&c.authority.pr118.conservative_boundary==='OPEN / UNMERGED / NON-PRODUCTION UNTIL FRESH GITHUB VERIFICATION','CURRENT.authority.pr118','PR118 requires fresh external verification before changing its conservative boundary');
  const rc4197=c.authority?.rc4197_source_merge;
  check(rc4197?.checkpoint==='v244'&&rc4197.pr===152&&rc4197.status==='MERGED/HISTORICAL'&&rc4197.merge_commit==='a2d3b4395d207ce54ccf90d2e028300ba35d40d1'&&rc4197.deployment_proven===false&&rc4197.device_acceptance_proven===false&&String(rc4197.evidence_scope||'').includes('historical merge provenance only'),'CURRENT.authority.rc4197_source_merge','PR #152 source merge must not infer deployment or device acceptance');
  const rc4198=c.authority?.rc4198_source_merge;
  check(rc4198?.checkpoint==='v245'&&rc4198.pr===156&&rc4198.status==='MERGED/HISTORICAL'&&rc4198.source_head==='931713f8f8beaa70edbfb75041b2c708fae66109'&&rc4198.base_head==='62d7ecf11774700551b6e5a0497ec054e327a0d7'&&rc4198.merge_commit===RC4198_MERGE&&rc4198.merged_tree==='1e91afc64a61f4aad08f7fc50d687736211b3d87'&&rc4198.deployment_proven===false&&rc4198.device_acceptance_proven===false&&String(rc4198.evidence_scope||'').includes('historical merge provenance only'),'CURRENT.authority.rc4198_source_merge','PR #156 squash-merge provenance must not infer deployment or device acceptance');
  check(c.authority?.repo==='Muero42/draft-companion'&&c.authority.branch==='DYNAMIC_VERIFICATION_REQUIRED'&&c.authority.source_candidate===SOURCE&&c.authority.reconciled_base_main==='DYNAMIC_EXTERNAL_EVIDENCE','CURRENT.authority','promotion-stable source identity drift');
  check(JSON.stringify(c.authority.promotion)===JSON.stringify({"status":"DYNAMIC_VERIFICATION_REQUIRED","verify_before":["CONTINUATION","PROMOTION"],"sources":["LOCAL_GIT","CANONICAL_GITHUB"],"permission_source":"CURRENT_USER_AUTHORIZED_WORK_PACKAGE","merge_implies_deployment":false,"merge_implies_device_acceptance":false,"unavailable_evidence":"FAIL_CLOSED_DEPENDENT_ACTION","operative_branch":"DYNAMIC_VERIFICATION_REQUIRED","pr_status":"DYNAMIC_VERIFICATION_REQUIRED","exact_head_ci":"DYNAMIC_VERIFICATION_REQUIRED"}),'CURRENT.authority.promotion','dynamic verification and current authorization contract required');
  check(!c.authority.local_repair,'CURRENT.authority.local_repair','operative repair-branch binding forbidden');
  check(c.authority.permission_contract==='AGENTS.md#pitti-codex-permission-contract','CURRENT.authority.permission_contract','canonical permission reference required');
  check(c.authority.source_scope==='SOURCE_IN_THIS_TREE; canonical main containment is dynamically verified; source/build/package/preview never imply production deployment or device acceptance','CURRENT.authority.source_scope','source tree must remain separate from canonical containment and deployment');
  const candidate=c.authority.rc4201_candidate;
  check(candidate?.checkpoint==='v250'&&candidate.version===SOURCE&&candidate.status==='SOURCE_CANDIDATE_NOT_PRODUCTION'&&candidate.deployment_proven===false&&candidate.device_observation_proven===false&&candidate.device_acceptance_proven===false&&candidate.pr_state==='DYNAMIC_VERIFICATION_REQUIRED'&&candidate.canonical_containment==='DYNAMIC_VERIFICATION_REQUIRED','CURRENT.authority.rc4200_candidate','rc4.201 must remain a dynamic, non-production source candidate');
  check(String(c.runtime.preview_candidate||'').includes('non-production'),'CURRENT.runtime.preview_candidate','preview evidence must remain non-production');
  check(c.runtime.candidate_branch==='DYNAMIC_VERIFICATION_REQUIRED','CURRENT.runtime.candidate_branch','operative branch must not be frozen across promotion');
  check(c.runtime.source_candidate_status==='SOURCE_CANDIDATE_NOT_PRODUCTION'&&String(c.runtime.season_candidate||'').includes('current source/candidate authority')&&String(c.runtime.season_candidate||'').includes('NOT production-deployed'),'CURRENT.runtime.source merge','rc4.201 source/package must remain separate from production and device authority');
  check(String(c.runtime.local_candidate_package?.source_scope||'').includes('source-byte parity independently verified')&&!Object.hasOwn(c.runtime.local_candidate_package||{},'source_branch'),'CURRENT.runtime.local_candidate_package','package identity must not retain an operative pre-merge branch');
  check(l.runtime?.appVersion===SOURCE&&s.branch_locks?.source_baseline===SOURCE,'LOCK/SEAL.runtime','v250 source lock/checkpoint stale');
  check(s.branch_locks?.branch==='DYNAMIC_VERIFICATION_REQUIRED'&&s.branch_locks.reconciled_base_main==='DYNAMIC_EXTERNAL_EVIDENCE'&&String(s.branch_locks.codex_work||'').includes('v250 rc4.201')&&String(s.note||'').includes(DEVICE_VERDICT),'SEAL.rc4200 reconciliation','seal must separate rc4.201 source/package from rc4.200 production/physical-failure evidence and rc4.195 rollback');
  for(const p of ['installed_android','latest_android_observed','latestAndroidVersionObserved']) check(c.runtime[p]===DEVICE_VERSION,`CURRENT.runtime.${p}`,'latest physical version drift');
  const device=c.runtime.latest_device_evidence;
  check(device?.version===DEVICE_VERSION&&device.evidence===DEVICE_EVIDENCE&&device.acceptance==='FAILED'&&device.classification===DEVICE_VERDICT,'CURRENT.runtime.latest_device_evidence','rc4.200 physical evidence drift');
  check(c.authority.rc4200_physical_failure?.evidence===DEVICE_EVIDENCE,'CURRENT.authority.rc4200_physical_failure.evidence','rc4.200 requires its dedicated immutable evidence record');
  const rc4199=c.authority.rc4199_production_device_history;
  check(rc4199?.version==='v11.8.0-rc4.199'&&rc4199.source_commit===RC4199_COMMIT&&rc4199.deployment_id===RC4199_DEPLOYMENT&&rc4199.status==='VERIFIED_SUCCESS'&&rc4199.evidence===RC4199_EVIDENCE&&rc4199.physical_failure===RC4199_VERDICT&&rc4199.device_acceptance_proven===false&&String(rc4199.history_order||'').includes('IMMEDIATELY_PRIOR_TO_RC4.200'),'CURRENT.authority.rc4199_production_device_history','rc4.199 deployment and separate physical-failure history must remain between rc4.200 and rc4.198');
  const rc4200Evidence=data[DEVICE_EVIDENCE]||'';
  for(const token of [PROD_COMMIT,DEPLOYMENT,DEVICE_VERDICT,'PROJECTION_LANE_UNAVAILABLE','13 active skill players','stats.points_half','SUFFICIENT']) check(rc4200Evidence.includes(token),DEVICE_EVIDENCE,`immutable rc4.200 observation missing: ${token}`);
  const rc4199Evidence=data[RC4199_EVIDENCE]||'';
  check(rc4199Evidence.includes('v11.8.0-rc4.199')&&rc4199Evidence.includes(RC4199_VERDICT),RC4199_EVIDENCE,'immutable rc4.199 observation identity drift');
  check(c.runtime.accepted_android==='v11.8.0-rc4.195'&&c.runtime.android_accepted==='v11.8.0-rc4.195'&&String(l.runtime.acceptedAndroidAuthority).startsWith('v11.8.0-rc4.195')&&String(s.branch_locks.accepted_rollback).startsWith('v11.8.0-rc4.195'),'rollback','prior fully accepted rollback drift');
  check(c.runtime.deployed_pages_head===PROD_COMMIT&&c.runtime.deployed_production_version===PROD&&c.runtime.deployed_pages_app_byte_parity_with_main===false&&String(c.runtime.deployment_parity).includes('ARBITRARY_BYTE_PARITY_NOT_PROVEN')&&l.runtime.deployedPagesVersion===PROD&&l.runtime.deployedPagesAppByteParityWithMain===false&&l.runtime.mainGhPagesParity===false&&k.currentBoundary.deployedPagesVersion===PROD&&k.currentBoundary.deployedPagesAppByteParityWithMain===false&&String(k.currentBoundary.deploymentParity).includes('ARBITRARY_BYTE_PARITY_NOT_PROVEN'),'deployment','exact deployment identity must remain separate from unsupported byte parity');
  check(c.runtime.production_deployment?.version===PROD&&c.runtime.production_deployment.status==='VERIFIED_SUCCESS'&&c.runtime.production_deployment.source_commit===PROD_COMMIT&&c.runtime.production_deployment.branch==='main'&&c.runtime.production_deployment.deployment_id===DEPLOYMENT,'deployment evidence','exact rc4.200 Production evidence required');
  check(c.authority.rc4200_production_deployment?.source_commit===PROD_COMMIT&&c.authority.rc4200_production_deployment.deployment_id===DEPLOYMENT&&c.authority.rc4200_production_deployment.branch==='main'&&c.authority.rc4200_production_deployment.device_acceptance_proven===false,'CURRENT.authority.rc4200_production_deployment','deployment success and failed device acceptance must remain separate');
  check(c.runtime.android_acceptance_pending===true&&l.runtime.androidVerified===false&&l.runtime.testChallengerAndroidObserved===false&&l.runtime.latestAndroidVersionObserved===DEVICE_VERSION&&String(l.runtime.androidAuthority).includes('NOT ACCEPTED')&&l.runtime.android_authority===l.runtime.androidAuthority,'device','rc4.201 must remain unobserved while rc4.200 remains the failed physical authority');
  for(const [label,pkg] of [['CURRENT',c.runtime.local_candidate_package],['LOCK',l.runtime.localCandidatePackage],['COMMAND',k.currentBoundary.localCandidatePackage]]) check(pkg?.version===SOURCE&&pkg.files===17&&pkg.sha256===null&&pkg.status==='PACKAGED_ONLY_NOT_DEPLOYED'&&String(pkg.archive_sha_semantics||pkg.archiveShaSemantics).includes('RUN_AND_ENVIRONMENT_SCOPED'),`${label}.package`,'rc4.201 17-file package and scoped archive semantics required');
  check(c.runtime.latest_package_sha256===null&&String(c.runtime.package_reference_run).includes('ARCHIVE_SHA_NONCANONICAL')&&l.runtime.preinstallSha256===null&&l.runtime.preinstallRuntimeFiles===17&&String(l.runtime.preinstallReferenceRun).includes('ARCHIVE_SHA_NONCANONICAL')&&k.currentBoundary.latestPackageSha256===null&&String(k.currentBoundary.packageReferenceRun).includes('ARCHIVE_SHA_NONCANONICAL'),'package aliases','archive SHA must not become cross-environment canonical identity');
  check(c.runtime.package_reference_scope.includes('rc4.201 source-byte-exact 17-file')&&k.currentBoundary.packageReferenceScope.includes('no cross-environment archive SHA identity')&&l.runtime.preinstallHashSemantics.includes('archive SHA is run/environment-scoped'),'package scope','package scope must be current, source-byte exact, and non-deployment');
  const ci=c.runtime.ci;
  check(ci.validated_code_head==='DYNAMIC_EXTERNAL_EVIDENCE'&&ci.status==='LOCAL_VALIDATION_RECORDED_EXTERNAL_EXACT_HEAD_DYNAMIC'&&ci.candidate_package==='LOCAL_PASS_SOURCE_BYTE_PARITY'&&ci.current_exact_main_head_ci==='DYNAMIC_EXTERNAL_VERIFICATION_REQUIRED_BEFORE_DEPENDENT_CONTINUATION_OR_PROMOTION','remote CI','local rc4.201 verification and dynamic external exact-head boundary required');
  check(c.codex.local_main_verified===RC4198_MERGE&&c.codex.working_tree_at_precheck==='clean'&&c.codex.audit_result==='POSTMERGE_RC4198_SOURCE_LOCK_RECONCILED'&&c.codex.status==='HISTORICAL_AUDIT_RECORD'&&c.codex.audit_findings?.length===2&&c.codex.audit_findings.every(x=>x.includes('rc4.198')||x.includes('v245')),'Codex audit','performed rc4.198 post-merge reconciliation missing or mixed with stale v233 findings');
  check(c.handoff.refresh_scope.startsWith('RC4.200_WEEKLY_PROJECTION_SEMANTIC_REPAIR'),'CURRENT.handoff.refresh_scope','stale checkpoint repair scope');
  check(l.updatedAt===c.updated_at&&l.updated_at===c.updated_at,'LOCK.timestamps','v250 timestamp alias drift');
  const a=c.auto_execution_state;
  for(const bucket of ['active','ready','waiting_external','blocked_user']) check(Array.isArray(a[bucket])&&a[bucket].length===0,`AUTO.${bucket}`,'completed checkpoint package must not retain stale work or external waits');
  check(a.status==='PROJECT_MILESTONE_REACHED'&&a.stop_evaluation?.allowed===true&&a.stop_evaluation.code==='PROJECT_MILESTONE_REACHED','AUTO.stop','terminal state must agree with exhausted authorized scope');
  check(a.completed_recent.some(x=>x.id==='v233-postmerge-local-readonly-audit'&&x.result.includes('FAIL_CLOSED')),'AUTO.completed_recent','performed audit missing');
  // Inspect every active JSON string, including aliases and newly added pointers. Historical
  // subtrees are explicit containers, not a magic word capable of hiding an active field.
  const historicalPaths=new Set(['PITTI_CURRENT_STATE.json.historical_superseded','PITTI_CURRENT_STATE.json.auto_execution_state.completed_recent','PITTI_CURRENT_STATE.json.runtime.pr98','PITTI_CURRENT_STATE.json.runtime.pr99','PITTI_EXECUTION_LOCK.json.runtime.rc499']);
  function walk(value,p) {
    if(typeof value==='string') {
      check(!/rc4\.190\s+(?:merged source|on canonical main)/i.test(value),p,'source cannot assert unverified canonical containment');
      check(!/PR\s*#?\s*(?:118|122)\s+(?:is|=|:)\s*(?:OPEN|MERGED|UNMERGED)|(?:PR_|MERGE_)(?:OPEN|MERGED|UNMERGED)|REQUIRES_UNMERGED/i.test(value),p,'mutable PR state or unmerged prerequisite is not current authority');
      check(!/local[ _-]only|LOCAL_AUTHORITY_REVIEW_ONLY|no push, merge|no merge authorized|requires?\s+(?:an?\s+)?(?:unmerged|repair branch)|pitti\/v234-postmerge-authority-repair/i.test(value),p,'current authority must survive promotion');
      check(!/V233_(?:SEALED_PENDING|STRICT_GATES|STALE_CURRENT)|(?:then|after|until)\s+(?:v233\s+)?(?:merges?|strict gates).*v233|merge v233/i.test(value)||value.includes('No v233 merge'),p,'stale v233 work pointer');
    } else if(value&&typeof value==='object') for(const [key,v] of Object.entries(value)) if(!historicalPaths.has(`${p}.${key}`)) {check(!/^(remote_actions_authorized|requires_unmerged|repair_branch|local_repair_branch|merge_status|merged|mergeable|pending_merge|pending_strict_ci)$/.test(key)||p.endsWith('.postmerge'),`${p}.${key}`,'mutable authorization/merge facts cannot be static CURRENT fields'); if(/(?:^|\.)pr\d+$/.test(p)&&key==='status') check(v==='DYNAMIC_VERIFICATION_REQUIRED'||(p.endsWith('.pr121')&&v==='MERGED/HISTORICAL'),`${p}.${key}`,'PR status must be dynamically verified'); walk(v,`${p}.${key}`);}
  }
  for(const p of core) walk(data[p],p);
  for(const p of docs) {
    const text=data[p];
    check(text.includes(AUTHORITY_GATE),p,'current promotion-stable gate missing');
    for(const token of ['rc4.201','rc4.200','rc4.199','rc4.198','rc4.195',DEVICE_VERDICT,RC4199_VERDICT,'17-file','cross-environment']) check(text.includes(token),p,`current authority token missing: ${token}`);
    if(p!=='README.md') check(text.includes(generation),p,'generation missing');
    // Scope chronological blocks explicitly. A later CURRENT section returns to active scope.
    let historical=false;
    for(const [i,line] of text.split(/\r?\n/).entries()) {
      if(/^##? .*HISTORICAL(?:\/SUPERSEDED)? (?:LOG|release log)/.test(line)||/^## HISTORICAL\/SUPERSEDED .* CONTENT$/.test(line)) historical=true;
      if(/^## v250 CURRENT/.test(line)) historical=false;
      if(!historical) check(!/rc4\.196 (?:is )?(?:not production[- ]deployed|undeployed)|rc4\.195 (?:is|remains) (?:the )?current production|PASS_EXACT_MAIN_HEAD/i.test(line),`${p}:${i+1}`,'stale v242 deployment/device/CI statement escaped historical scope');
      if(!historical) check(!/PR\s*#?\s*(?:118|122)\s+(?:is|=|:)\s*(?:OPEN|MERGED|UNMERGED)|REQUIRES_UNMERGED|pitti\/v234-postmerge-authority-repair/i.test(line),`${p}:${i+1}`,'current prose cannot freeze PR state or operative repair branch');
      if(/^## .*v\d+.*(?:OVERRIDE|SUPERSESSION)/.test(line)) check(line.includes('HISTORICAL/SUPERSEDED'),`${p}:${i+1}`,'old override lacks local historical label');
      if(!historical) {check(!/local[ _-]only|LOCAL_AUTHORITY_REVIEW_ONLY|no push, merge|no merge authorized|requires?\s+(?:an?\s+)?unmerged|remote_actions_authorized\s*[=:]\s*false/i.test(line),`${p}:${i+1}`,'active prose must survive promotion'); check(!/V233_STRICT_GATES_THEN_MERGE|V233_SEALED_PENDING_STRICT_CI/.test(line),`${p}:${i+1}`,'active pre-merge v233 pointer');}
    }
  }
  for(const p of ['PITTI_NEW_CHAT_BOOTSTRAP.md','NEW_CHAT_HANDOFF_CURRENT.md','HANDOFF_COMPLETENESS_MATRIX.md','README.md']) {
    check(!/(?:rc4\.195[^\n]{0,160}(?:PR-only|not merged|remains unmerged)|PR-only[^\n]{0,160}rc4\.195)/i.test(data[p]),p,'active takeover prose cannot retain rc4.195 PR-only/unmerged authority');
  }
  const projectCurrent=(data['PITTI_PROJECT_STATE.md'].split('## v250 CURRENT')[1]?.split('## HISTORICAL/SUPERSEDED v245 CONTENT')[0]||'');
  check(data['PITTI_PROJECT_STATE.md'].includes('mutable external evidence')&&data['PITTI_PROJECT_STATE.md'].includes('not production-deployed')&&data['PITTI_PROJECT_STATE.md'].includes(DEVICE_VERDICT)&&projectCurrent.includes('run/environment-scoped'),'PITTI_PROJECT_STATE.md v250 CURRENT','latest project-state authority must separate source/package from production/device');
  return errors;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const errors=validateAuthority(loadAuthority());
  for(const error of errors) console.error('POSTMERGE_AUTHORITY_FAIL:',error);
  if(errors.length) process.exitCode=1;
  else console.log('POSTMERGE_AUTHORITY_PASS');
}
