import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

export const LOCAL_GATE='LOCAL_AUTHORITY_REVIEW_ONLY_NO_REMOTE_ACTION';
const BASE='2749537945ec7e6b96d95e2f6b55a26e455124fa';
const BRANCH='pitti/v234-postmerge-authority-repair';
const core=['PITTI_CURRENT_STATE.json','PITTI_EXECUTION_LOCK.json','PITTI_COMMAND_CONTRACTS.json','PITTI_HANDOFF_SEAL.json'];
const docs=['PITTI_NEW_CHAT_BOOTSTRAP.md','NEW_CHAT_HANDOFF_CURRENT.md','HANDOFF_COMPLETENESS_MATRIX.md','PITTI_AUTO_PREFLIGHT.md','PITTI_PROJECT_STATE.md','README.md'];
export function loadAuthority(root='.') {
  return Object.fromEntries([...core,...docs].map(p=>[p,core.includes(p)?JSON.parse(fs.readFileSync(path.join(root,p),'utf8')):fs.readFileSync(path.join(root,p),'utf8')]));
}
export function validateAuthority(data) {
  const errors=[];
  const check=(ok,p,msg)=>{if(!ok) errors.push(`${p}: ${msg}`);};
  const [c,l,k,s]=core.map(p=>data[p]);
  const generation=c.handoff_generation;
  check(/^202609\d{2}T\d{4}Z-v234$/.test(generation),'CURRENT.handoff_generation','local v234 generation required');
  for(const [label,o] of [['CURRENT',c],['LOCK',l]]) {
    for(const p of ['gate','nextGate']) check(o[p]===LOCAL_GATE,`${label}.${p}`,'local review gate required; merged checkpoint cannot remain pending');
    check(o.currentWork?.nextGate===LOCAL_GATE,`${label}.currentWork.nextGate`,'local review gate required');
    check(o.currentWork?.status===o.status&&o.status==='POSTMERGE_AUTHORITY_REPAIRED_LOCAL_ONLY',`${label}.status`,'duplicate work status drift');
    check(o.handoffGeneration===generation&&o.handoff_generation===generation&&o.handoff?.generation===generation,`${label}.generation`,'all generation aliases must agree');
    check(o.handoff?.transaction_in_progress===false&&o.handoff?.ready===true&&o.handoff?.secondPass===true&&o.handoff?.status==='PASS',`${label}.handoff`,'completed local handoff required');
    check(o.handoff?.resume===c.handoff.resume,`${label}.handoff.resume`,'resume drift');
  }
  for(const [p,value] of Object.entries({currentGate:k.currentGate,currentResearchGate:k.currentResearchGate,boundary:k.currentBoundary?.currentResearchGate,boundaryNext:k.currentBoundary?.nextGate,season:k.seasonCompanion?.nextGate,seal:s.exact_gate})) check(value===LOCAL_GATE,`COMMAND/SEAL.${p}`,'gate drift');
  check(k.handoff_generation===generation&&k.handoffGeneration===generation&&s.handoff_generation===generation,'COMMAND/SEAL.generation','generation drift');
  check(k.exactNextAction===c.handoff.resume&&k.currentBoundary.exactNextAction===c.handoff.resume,'COMMAND.exactNextAction','resume drift');
  check(c.authority?.postmerge?.pr===121&&c.authority.postmerge.checkpoint==='v233'&&c.authority.postmerge.status==='MERGED/HISTORICAL'&&c.authority.postmerge.pending_merge===false&&c.authority.postmerge.pending_strict_ci===false,'CURRENT.authority.postmerge','PR #121/v233 must be merged/historical, never pending');
  check(c.authority?.pr118?.status==='OPEN / UNMERGED / NON-PRODUCTION'&&c.authority.pr118.branch==='pitti/rc4190-roster-week1-needs','CURRENT.authority.pr118','PR #118 cannot become production authority');
  check(c.authority?.repo==='Muero42/draft-companion'&&c.authority.branch==='main'&&c.authority.source_candidate==='v11.8.0-rc4.189','CURRENT.authority','canonical source identity drift');
  check(c.authority.local_repair?.branch===BRANCH&&c.authority.local_repair.base_main===BASE&&c.authority.local_repair.generation===generation&&c.authority.local_repair.remote_actions_authorized===false,'CURRENT.authority.local_repair','local repair must be separate from main and PR #118');
  check(l.runtime?.appVersion==='v11.8.0-rc4.189'&&s.branch_locks?.source_baseline==='v11.8.0-rc4.189','LOCK/SEAL.runtime','runtime changed');
  for(const p of ['installed_android','latest_android_observed','latestAndroidVersionObserved']) check(c.runtime[p]==='v11.8.0-rc4.188',`CURRENT.runtime.${p}`,'latest physical version drift');
  check(c.runtime.latest_device_evidence?.version==='v11.8.0-rc4.188'&&c.runtime.latest_device_evidence.acceptance==='PASS'&&c.runtime.latest_device_evidence.fail.length===0,'CURRENT.runtime.latest_device_evidence','physical evidence drift');
  check(c.runtime.accepted_android==='v11.8.0-rc4.169'&&c.runtime.android_accepted==='v11.8.0-rc4.169'&&l.runtime.acceptedAndroidAuthority==='v11.8.0-rc4.169'&&s.branch_locks.accepted_rollback==='v11.8.0-rc4.169','rollback','rollback drift');
  check(c.runtime.deployed_pages_head==='UNKNOWN_REQUIRES_REVERIFICATION'&&c.runtime.deployed_pages_app_byte_parity_with_main===null&&l.runtime.deployedPagesVersion==='UNKNOWN_REQUIRES_REVERIFICATION'&&l.runtime.deployedPagesAppByteParityWithMain===null&&l.runtime.mainGhPagesParity===null&&k.currentBoundary.deployedPagesVersion==='UNKNOWN_REQUIRES_REVERIFICATION'&&k.currentBoundary.deployedPagesAppByteParityWithMain===null&&s.branch_locks.deployment_parity==='UNKNOWN_REQUIRES_REVERIFICATION','deployment','offline audit cannot assert deployment parity');
  check(c.runtime.android_acceptance_pending===true&&l.runtime.androidVerified===false,'rc4.189 device','local/source PASS cannot assert physical acceptance');
  check(c.runtime.package_reference_scope?.includes('HISTORICAL rc4.182')&&k.currentBoundary.packageReferenceScope===c.runtime.package_reference_scope&&l.runtime.preinstallHashSemantics.startsWith('HISTORICAL rc4.182'),'package','old package digest must remain explicitly historical');
  check(Object.values(c.runtime.ci).filter(v=>v==='NOT_REVERIFIED_OFFLINE').length===3&&c.runtime.ci.validated_code_head===null,'remote CI','offline repair must not invent current CI');
  check(c.codex.local_main_verified===BASE&&c.codex.working_tree_at_precheck==='clean'&&c.codex.audit_result==='FAIL_CLOSED_ON_RESIDUAL_POSTMERGE_STATE_POINTERS'&&c.codex.work_pr===118&&c.codex.work_package_authority==='PR_ONLY_NOT_MAIN','Codex audit','performed post-merge failure must be preserved separately from local repair');
  const a=c.auto_execution_state;
  for(const bucket of ['active','ready','waiting_external','blocked_user']) check(Array.isArray(a[bucket])&&a[bucket].length===0,`AUTO.${bucket}`,'completed local-only package must not retain stale work or external waits');
  check(a.status==='PROJECT_MILESTONE_REACHED'&&a.stop_evaluation?.allowed===true&&a.stop_evaluation.code==='PROJECT_MILESTONE_REACHED','AUTO.stop','terminal state must agree with exhausted authorized scope');
  check(a.completed_recent.some(x=>x.id==='v233-postmerge-local-readonly-audit'&&x.result.includes('FAIL_CLOSED')),'AUTO.completed_recent','performed audit missing');
  // Inspect every active JSON string, including aliases and newly added pointers. Historical
  // subtrees are explicit containers, not a magic word capable of hiding an active field.
  const historicalKeys=new Set(['historical_superseded','completed_recent','pr98','pr99','rc499']);
  function walk(value,p) {
    if(typeof value==='string') {
      check(!/V233_(?:SEALED_PENDING|STRICT_GATES|STALE_CURRENT)|(?:then|after|until)\s+(?:v233\s+)?(?:merges?|strict gates).*v233|merge v233/i.test(value)||value.includes('No v233 merge'),p,'stale v233 work pointer');
    } else if(value&&typeof value==='object') for(const [key,v] of Object.entries(value)) if(!historicalKeys.has(key)) walk(v,`${p}.${key}`);
  }
  for(const p of core) walk(data[p],p);
  for(const p of docs) {
    const text=data[p];
    check(text.includes(LOCAL_GATE),p,'current local gate missing');
    for(const token of ['rc4.189','rc4.188','rc4.169','UNKNOWN_REQUIRES_REVERIFICATION','MERGED/HISTORICAL']) check(text.includes(token),p,`current authority token missing: ${token}`);
    if(p!=='README.md') check(text.includes(generation),p,'generation missing');
    // Scope chronological blocks explicitly. A later CURRENT section returns to active scope.
    let historical=false;
    for(const [i,line] of text.split(/\r?\n/).entries()) {
      if(/^##? .*HISTORICAL(?:\/SUPERSEDED)? (?:LOG|release log)/.test(line)) historical=true;
      if(/^## v234 CURRENT/.test(line)) historical=false;
      if(/^## .*v\d+.*(?:OVERRIDE|SUPERSESSION)/.test(line)) check(line.includes('HISTORICAL/SUPERSEDED'),`${p}:${i+1}`,'old override lacks local historical label');
      if(!historical) check(!/V233_STRICT_GATES_THEN_MERGE|V233_SEALED_PENDING_STRICT_CI/.test(line),`${p}:${i+1}`,'active pre-merge v233 pointer');
    }
  }
  return errors;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const errors=validateAuthority(loadAuthority());
  for(const error of errors) console.error('POSTMERGE_AUTHORITY_FAIL:',error);
  if(errors.length) process.exitCode=1;
  else console.log('POSTMERGE_AUTHORITY_PASS');
}
