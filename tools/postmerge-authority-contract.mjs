import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

export const AUTHORITY_GATE='VERIFY_CANONICAL_AUTHORITY_THEN_AUTHORIZED_WORK';
const BASE='2749537945ec7e6b96d95e2f6b55a26e455124fa';
const core=['PITTI_CURRENT_STATE.json','PITTI_EXECUTION_LOCK.json','PITTI_COMMAND_CONTRACTS.json','PITTI_HANDOFF_SEAL.json'];
const docs=['PITTI_NEW_CHAT_BOOTSTRAP.md','NEW_CHAT_HANDOFF_CURRENT.md','HANDOFF_COMPLETENESS_MATRIX.md','PITTI_AUTO_PREFLIGHT.md','PITTI_PROJECT_STATE.md','README.md'];
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
  if(e?.ciHead!==e?.head||e?.checks?.length!==3||!['project_guardrails','release_contract_v2','candidate_package'].every(n=>e.checks.some(x=>x.name===n&&x.result==='PASS'))) errors.push('all three exact-head checks required');
  if(e?.authorizedWorkPackage!==true) errors.push('current user authorization required');
  return errors;
}
export function loadAuthority(root='.') {
  return Object.fromEntries([...core,...docs].map(p=>[p,core.includes(p)?JSON.parse(fs.readFileSync(path.join(root,p),'utf8')):fs.readFileSync(path.join(root,p),'utf8')]));
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
  check(/^202609\d{2}T\d{4}Z-v242$/.test(generation),'CURRENT.handoff_generation','v242 generation required');
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
  check(c.authority?.postmerge?.pr===121&&c.authority.postmerge.checkpoint==='v233'&&c.authority.postmerge.status==='MERGED/HISTORICAL'&&c.authority.postmerge.pending_merge===false&&c.authority.postmerge.pending_strict_ci===false,'CURRENT.authority.postmerge','PR #121/v233 must be merged/historical, never pending');
  const rc4195=c.authority?.rc4195_source_merge;
  check(rc4195?.checkpoint==='v240'&&rc4195.pr===141&&rc4195.status==='MERGED/HISTORICAL'&&rc4195.source_head==='5661d08a3d1e449f6b5ba505c381ec30bff7ecf0'&&rc4195.base_head==='5e29f285103531b81c7579036e7a885e487e0650'&&rc4195.merge_commit==='f1340a2c2d6248212c7652dc58b2f3323f74b1f5'&&rc4195.deployment_proven===false&&rc4195.device_acceptance_proven===false&&String(rc4195.evidence_scope||'').includes('historical merge provenance'),'CURRENT.authority.rc4195_source_merge','PR #141 merge must be timestamped historical provenance without deployment/device inference');
  const rc4196=c.authority?.rc4196_source_merge;
  check(rc4196?.checkpoint==='v242'&&rc4196.pr===143&&rc4196.status==='MERGED/HISTORICAL'&&rc4196.source_head==='69a0593410ab5db754090a01d5b0e5beef2ed38b'&&rc4196.base_head==='8aedc4ea3b7b71591cbc45f971ccf85fe5167074'&&rc4196.merge_commit==='555487237c9075d5e5ceeb1fee196f4763f87cc3'&&rc4196.deployment_proven===false&&rc4196.device_acceptance_proven===false&&String(rc4196.evidence_scope||'').includes('historical merge provenance'),'CURRENT.authority.rc4196_source_merge','PR #143 merge must be timestamped provenance without deployment/device inference');
  check(c.authority?.pr118?.status==='DYNAMIC_VERIFICATION_REQUIRED'&&c.authority.pr118.conservative_boundary==='OPEN / UNMERGED / NON-PRODUCTION UNTIL FRESH GITHUB VERIFICATION','CURRENT.authority.pr118','PR118 requires fresh external verification before changing its conservative boundary');
  check(c.authority?.repo==='Muero42/draft-companion'&&c.authority.branch==='main'&&c.authority.source_candidate==='v11.8.0-rc4.196','CURRENT.authority','canonical source identity drift');
  check(JSON.stringify(c.authority.promotion)===JSON.stringify({"status":"DYNAMIC_VERIFICATION_REQUIRED","verify_before":["CONTINUATION","PROMOTION"],"sources":["LOCAL_GIT","CANONICAL_GITHUB"],"permission_source":"CURRENT_USER_AUTHORIZED_WORK_PACKAGE","merge_implies_deployment":false,"merge_implies_device_acceptance":false,"unavailable_evidence":"FAIL_CLOSED_DEPENDENT_ACTION","operative_branch":"DYNAMIC_VERIFICATION_REQUIRED","pr_status":"DYNAMIC_VERIFICATION_REQUIRED","exact_head_ci":"DYNAMIC_VERIFICATION_REQUIRED"}),'CURRENT.authority.promotion','dynamic verification and current authorization contract required');
  check(!c.authority.local_repair,'CURRENT.authority.local_repair','operative repair-branch binding forbidden');
  check(c.authority.permission_contract==='AGENTS.md#pitti-codex-permission-contract','CURRENT.authority.permission_contract','canonical permission reference required');
  check(c.authority.source_scope==='SOURCE_IN_THIS_TREE; canonical main containment is dynamically verified; source/build/package never imply deployment or device acceptance','CURRENT.authority.source_scope','source tree must remain separate from canonical containment and deployment');
  check(c.runtime.candidate_branch==='DYNAMIC_VERIFICATION_REQUIRED','CURRENT.runtime.candidate_branch','operative branch must not be frozen across promotion');
  check(c.runtime.source_candidate_status==='SOURCE_MERGED_PRODUCTION_PENDING'&&String(c.runtime.season_candidate||'').includes('source merged through PR #143')&&String(c.runtime.season_candidate||'').includes('rc4.195 remains production/device accepted'),'CURRENT.runtime.source merge','merged source must remain separate from deployment and physical acceptance');
  check(c.runtime.local_candidate_package?.source_scope==='MERGED_TO_CANONICAL_MAIN_VIA_PR143; package remains local artifact identity'&&!Object.hasOwn(c.runtime.local_candidate_package||{},'source_branch'),'CURRENT.runtime.local_candidate_package','package identity must not retain an operative pre-merge branch');
  check(l.runtime?.appVersion==='v11.8.0-rc4.196'&&s.branch_locks?.source_baseline==='v11.8.0-rc4.196','LOCK/SEAL.runtime','runtime changed');
  check(s.branch_locks?.branch==='main'&&s.branch_locks.reconciled_base_main==='555487237c9075d5e5ceeb1fee196f4763f87cc3'&&String(s.branch_locks.codex_work||'').includes('PR #145')&&String(s.note||'').includes('rc4.196 source merge'),'SEAL.rc4196 reconciliation','seal must record accepted rc4.195 and merged-source rc4.196');
  for(const p of ['installed_android','latest_android_observed','latestAndroidVersionObserved']) check(c.runtime[p]==='v11.8.0-rc4.195',`CURRENT.runtime.${p}`,'latest physical version drift');
  check(c.runtime.latest_device_evidence?.version==='v11.8.0-rc4.195'&&c.runtime.latest_device_evidence.acceptance==='PASS'&&c.runtime.latest_device_evidence.fail.length===0,'CURRENT.runtime.latest_device_evidence','physical evidence drift');
  check(c.runtime.accepted_android==='v11.8.0-rc4.195'&&c.runtime.android_accepted==='v11.8.0-rc4.195'&&l.runtime.acceptedAndroidAuthority==='v11.8.0-rc4.195'&&s.branch_locks.accepted_rollback==='v11.8.0-rc4.195','rollback','rollback drift');
  check(c.runtime.deployed_pages_head==='8aedc4ea3b7b71591cbc45f971ccf85fe5167074'&&c.runtime.deployed_production_version==='v11.8.0-rc4.195'&&c.runtime.deployment_parity==='UNKNOWN_REQUIRES_REVERIFICATION'&&c.runtime.deployed_pages_app_byte_parity_with_main===false&&l.runtime.deployedPagesVersion==='v11.8.0-rc4.195'&&l.runtime.deployedPagesAppByteParityWithMain===false&&l.runtime.mainGhPagesParity===false&&k.currentBoundary.deployedPagesVersion==='v11.8.0-rc4.195'&&k.currentBoundary.deployedPagesAppByteParityWithMain===false&&k.currentBoundary.deploymentParity==='UNKNOWN_REQUIRES_REVERIFICATION'&&s.branch_locks.deployment_parity==='VERIFIED_RC4195','deployment','rc4.195 production evidence must remain separate from unknown rc4.196 current-main parity');
  check(c.runtime.android_acceptance_pending===true&&l.runtime.androidVerified===true&&l.runtime.latestAndroidVersionObserved==='v11.8.0-rc4.195'&&l.runtime.androidAuthority==='v11.8.0-rc4.195 accepted production/device authority'&&l.runtime.android_authority===l.runtime.androidAuthority,'device','rc4.195 physical acceptance and rc4.196 pending acceptance must remain distinct');
  const packageSha='sha256:a654422c907e3127335c20df1956fc974442c3eb3be011a5d8eb1e9b71f4500d';
  for(const [label,pkg] of [['CURRENT',c.runtime.local_candidate_package],['LOCK',l.runtime.localCandidatePackage],['COMMAND',k.currentBoundary.localCandidatePackage]]) check(pkg?.version==='v11.8.0-rc4.196'&&pkg.files===17&&pkg.sha256===packageSha&&pkg.status==='PACKAGED_ONLY_NOT_DEPLOYED',`${label}.package`,'rc4.196 17-file package identity required');
  check(c.runtime.latest_package_sha256===packageSha&&c.runtime.package_reference_run===null&&l.runtime.preinstallSha256===packageSha&&l.runtime.preinstallRuntimeFiles===17&&l.runtime.preinstallReferenceRun===null&&l.runtime.preinstallReferenceArtifactId===null&&k.currentBoundary.latestPackageSha256===packageSha&&k.currentBoundary.packageReferenceRun===null,'package aliases','stale package aliases forbidden');
  check(c.runtime.package_reference_scope===k.currentBoundary.packageReferenceScope&&c.runtime.package_reference_scope.includes('rc4.196 local')&&l.runtime.preinstallHashSemantics.includes('rc4.196 local byte-exact'),'package scope','package scope must be current and non-deployment');
  check(['candidate_package','release_contract_v2','project_guardrails'].every(key=>c.runtime.ci[key]==='PASS_EXACT_MAIN_HEAD')&&c.runtime.ci.validated_code_head==='555487237c9075d5e5ceeb1fee196f4763f87cc3','remote CI','fresh exact-main-head CI evidence required');
  check(c.codex.local_main_verified===BASE&&c.codex.working_tree_at_precheck==='clean'&&c.codex.audit_result==='FAIL_CLOSED_ON_RESIDUAL_POSTMERGE_STATE_POINTERS'&&c.codex.status==='HISTORICAL_AUDIT_RECORD','Codex audit','performed post-merge failure must be preserved separately from local repair');
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
    for(const token of ['rc4.196','rc4.195','UNKNOWN_REQUIRES_REVERIFICATION','MERGED/HISTORICAL']) check(text.includes(token),p,`current authority token missing: ${token}`);
    if(p!=='README.md') check(text.includes(generation),p,'generation missing');
    // Scope chronological blocks explicitly. A later CURRENT section returns to active scope.
    let historical=false;
    for(const [i,line] of text.split(/\r?\n/).entries()) {
      if(/^##? .*HISTORICAL(?:\/SUPERSEDED)? (?:LOG|release log)/.test(line)) historical=true;
      if(/^## v234 CURRENT/.test(line)) historical=false;
      if(!historical) check(!/PR\s*#?\s*(?:118|122)\s+(?:is|=|:)\s*(?:OPEN|MERGED|UNMERGED)|REQUIRES_UNMERGED|pitti\/v234-postmerge-authority-repair/i.test(line),`${p}:${i+1}`,'current prose cannot freeze PR state or operative repair branch');
      if(/^## .*v\d+.*(?:OVERRIDE|SUPERSESSION)/.test(line)) check(line.includes('HISTORICAL/SUPERSEDED'),`${p}:${i+1}`,'old override lacks local historical label');
      if(!historical) {check(!/local[ _-]only|LOCAL_AUTHORITY_REVIEW_ONLY|no push, merge|no merge authorized|requires?\s+(?:an?\s+)?unmerged|remote_actions_authorized\s*[=:]\s*false/i.test(line),`${p}:${i+1}`,'active prose must survive promotion'); check(!/V233_STRICT_GATES_THEN_MERGE|V233_SEALED_PENDING_STRICT_CI/.test(line),`${p}:${i+1}`,'active pre-merge v233 pointer');}
    }
  }
  for(const p of ['PITTI_NEW_CHAT_BOOTSTRAP.md','NEW_CHAT_HANDOFF_CURRENT.md','HANDOFF_COMPLETENESS_MATRIX.md','README.md']) {
    check(!/(?:rc4\.195[^\n]{0,160}(?:PR-only|not merged|remains unmerged)|PR-only[^\n]{0,160}rc4\.195)/i.test(data[p]),p,'active takeover prose cannot retain rc4.195 PR-only/unmerged authority');
  }
  const projectCurrent=(data['PITTI_PROJECT_STATE.md'].split('## v242 CURRENT')[1]||'');
  check(projectCurrent.includes('PR #143')&&projectCurrent.includes('source-merged')&&projectCurrent.includes('UNKNOWN_REQUIRES_REVERIFICATION'),'PITTI_PROJECT_STATE.md v242 CURRENT','latest project-state authority must record rc4.196 source merge without deployment inference');
  return errors;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const errors=validateAuthority(loadAuthority());
  for(const error of errors) console.error('POSTMERGE_AUTHORITY_FAIL:',error);
  if(errors.length) process.exitCode=1;
  else console.log('POSTMERGE_AUTHORITY_PASS');
}
