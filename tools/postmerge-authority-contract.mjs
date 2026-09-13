import fs from 'node:fs';
import path from 'node:path';
export const AUTHORITY_GATE='VERIFY_CANONICAL_AUTHORITY_THEN_AUTHORIZED_WORK';
export const GENERATION='20260913T1200Z-v246';
const SOURCE='v11.8.0-rc4.199';
const PROD='v11.8.0-rc4.198';
const PROD_COMMIT='493e5aac9cea5a7a667efec81e1bdc733935baf9';
const DEPLOYMENT='81598205-07db-47c9-93ef-3a968d460682';
const VERDICT='RC4.198_PHYSICAL_PARTIAL_PASS_NOT_ACCEPTED_STORAGE_QUOTA';
const core=['PITTI_CURRENT_STATE.json','PITTI_EXECUTION_LOCK.json','PITTI_COMMAND_CONTRACTS.json','PITTI_HANDOFF_SEAL.json'];
const docs=['PITTI_NEW_CHAT_BOOTSTRAP.md','NEW_CHAT_HANDOFF_CURRENT.md','HANDOFF_COMPLETENESS_MATRIX.md','PITTI_AUTO_PREFLIGHT.md','PITTI_PROJECT_STATE.md','README.md'];
export function validateContinuationEvidence(e){
 const x=[];
 if(e?.fresh!==true||e?.repo!=='Muero42/draft-companion'||e?.canonicalBranch!=='main')x.push('fresh canonical Git/GitHub identity required');
 if(!/^[a-f0-9]{40}$/.test(e?.head??'')||!/^[a-f0-9]{40}$/.test(e?.canonicalHead??'')||e?.clean!==true)x.push('verified HEADs and clean worktree required');
 if(e?.prState==='OPEN'){if(e.prHead!==e.head||e.branch==='main'||!e.branch)x.push('open PR exact-head branch evidence required');}
 else if(e?.prState==='MERGED'){if(e.branch!=='main'||e.head!==e.canonicalHead||e.containingCommitVerified!==true)x.push('merged canonical containment evidence required');}
 else x.push('verified PR state required');
 if(e?.ciHead!==e?.head||!['project_guardrails','release_contract_v2','candidate_package'].every(n=>e?.checks?.some(v=>v.name===n&&v.result==='PASS')))x.push('exact-head checks required');
 if(e?.authorizedWorkPackage!==true)x.push('current user authorization required');
 return x;
}
export function loadAuthority(root='.') {return Object.fromEntries([...core,...docs].map(p=>[p,core.includes(p)?JSON.parse(fs.readFileSync(path.join(root,p),'utf8')):fs.readFileSync(path.join(root,p),'utf8')]));}
export function validateAuthority(d){
 const e=[],ok=(v,p)=>{if(!v)e.push(p)}; const c=d[core[0]],l=d[core[1]],k=d[core[2]],s=d[core[3]];
 for(const [n,o] of [['CURRENT',c],['LOCK',l],['COMMAND',k],['SEAL',s]])ok(o.handoff_generation===GENERATION,`${n}: generation drift`);
 ok(c.handoffGeneration===GENERATION&&c.handoff?.generation===GENERATION&&l.handoffGeneration===GENERATION&&l.handoff?.generation===GENERATION&&k.handoffGeneration===GENERATION,'generation aliases stale');
 ok(/^20260913T\d{4}Z-v246$/.test(c.handoff_generation),'v246 monotonic generation required');
 for(const [n,v] of Object.entries({cg:c.gate,cn:c.nextGate,cw:c.currentWork?.nextGate,lg:l.gate,ln:l.nextGate,lw:l.currentWork?.nextGate,kg:k.currentGate,kr:k.currentResearchGate,kb:k.currentBoundary?.nextGate,ks:k.seasonCompanion?.nextGate,se:s.exact_gate}))ok(v===AUTHORITY_GATE,`${n}: promotion-stable gate drift`);
 ok(c.authority?.repo==='Muero42/draft-companion'&&c.authority.source_candidate===SOURCE,'current rc4.199 source authority required');
 ok(c.authority?.branch==='DYNAMIC_VERIFICATION_REQUIRED'&&c.authority.reconciled_base_main==='DYNAMIC_EXTERNAL_EVIDENCE'&&k.currentBoundary?.reconciledBaseMain==='DYNAMIC_EXTERNAL_EVIDENCE'&&l.authority?.reconciledBaseMain==='DYNAMIC_EXTERNAL_EVIDENCE','canonical main must remain dynamic external evidence');
 const p=c.authority?.promotion; ok(p?.pr_status==='DYNAMIC_VERIFICATION_REQUIRED'&&p.operative_branch==='DYNAMIC_VERIFICATION_REQUIRED'&&p.exact_head_ci==='DYNAMIC_VERIFICATION_REQUIRED'&&p.merge_implies_deployment===false&&p.merge_implies_device_acceptance===false,'mutable promotion evidence frozen or collapsed');
 const candidate=c.authority?.rc4199_candidate;ok(candidate?.version===SOURCE&&candidate.status==='SOURCE_CANDIDATE_NOT_PRODUCTION'&&!candidate.deployment_proven&&!candidate.device_observation_proven&&!candidate.device_acceptance_proven&&candidate.pr_state==='DYNAMIC_VERIFICATION_REQUIRED'&&candidate.canonical_containment==='DYNAMIC_VERIFICATION_REQUIRED','rc4.199 candidate falsely promoted');
 const dep=c.runtime?.production_deployment, dev=c.runtime?.latest_device_evidence;
 ok(dep?.version===PROD&&dep.source_commit===PROD_COMMIT&&dep.deployment_id===DEPLOYMENT&&dep.status==='VERIFIED_SUCCESS','rc4.198 production evidence drift');
 ok(dev?.version===PROD&&dev.classification===VERDICT&&dev.acceptance==='PARTIAL_PASS_NOT_ACCEPTED_STORAGE_QUOTA'&&dev.evidence==='docs/PITTI_BRIDGE_HANDOFF_RC4198_PHYSICAL_STORAGE_QUOTA_2026-09-12.md','rc4.198 physical storage-quota verdict drift');
 ok(c.runtime.deployed_production_version===PROD&&c.runtime.deployed_pages_head===PROD_COMMIT&&c.runtime.deployed_pages_app_byte_parity_with_main===false,'deployment/source separation drift');
 ok(c.runtime.accepted_android==='v11.8.0-rc4.195'&&c.runtime.android_accepted==='v11.8.0-rc4.195','accepted rollback drift');
 ok(l.runtime?.appVersion===SOURCE&&s.branch_locks?.source_baseline===SOURCE,'source lock/seal runtime drift');
 ok(s.branch_locks?.branch==='DYNAMIC_VERIFICATION_REQUIRED'&&s.branch_locks?.reconciled_base_main==='DYNAMIC_EXTERNAL_EVIDENCE','seal freezes mutable git state');
 for(const [n,pkg] of [['CURRENT',c.runtime?.local_candidate_package],['LOCK',l.runtime?.localCandidatePackage],['COMMAND',k.currentBoundary?.localCandidatePackage]])ok(pkg?.version===SOURCE&&pkg.files===17&&pkg.sha256===null&&pkg.status==='PACKAGED_ONLY_NOT_DEPLOYED'&&/RUN_AND_ENVIRONMENT_SCOPED/.test(pkg.archive_sha_semantics??pkg.archiveShaSemantics??''),`${n}: package identity drift`);
 ok(c.runtime.latest_package_sha256===null&&l.runtime.preinstallSha256===null&&k.currentBoundary.latestPackageSha256===null,'archive SHA became canonical');
 ok(c.runtime.preview_candidate==='v11.8.0-rc4.199 preview/package evidence is non-production','preview cannot claim production');
 ok(c.runtime.candidate_branch==='DYNAMIC_VERIFICATION_REQUIRED'&&c.runtime.ci?.validated_code_head==='DYNAMIC_EXTERNAL_EVIDENCE'&&c.runtime.ci?.current_exact_main_head_ci==='DYNAMIC_EXTERNAL_VERIFICATION_REQUIRED_BEFORE_DEPENDENT_CONTINUATION_OR_PROMOTION','mutable branch/CI authority frozen');
 const q=c.qb_policy;ok(c.invariants?.user_draft_qb_limit===1&&c.invariants.user_draft_qb_limit_scope==='DRAFT_ONLY'&&!Object.hasOwn(c.invariants,'user_qb_limit'),'draft QB invariant drift');ok(q?.draft?.exclude_qb2_after_qb1===true&&q?.season?.qb2_exception_allowed===true&&q.season.universal_qb_roster_limit===null&&q.season_exception_weakens_draft_rule===false,'QB2 phase policy drift');
 for(const doc of docs){const t=d[doc];for(const token of [GENERATION,SOURCE,PROD,PROD_COMMIT,DEPLOYMENT,VERDICT,'v11.8.0-rc4.195','17-file','run/environment-scoped',AUTHORITY_GATE])ok(t.includes(token),`${doc}: missing ${token}`);}
 const active=JSON.stringify({c:{generation:c.handoff_generation,authority:c.authority,runtime:{candidate:c.runtime.season_candidate,source:c.runtime.source_candidate_status,package:c.runtime.local_candidate_package,production:c.runtime.production_deployment,device:c.runtime.latest_device_evidence,ci:c.runtime.ci}},l:{generation:l.handoff_generation,authority:l.authority,runtime:l.runtime},k:{generation:k.handoff_generation,boundary:k.currentBoundary},s:{generation:s.handoff_generation,locks:s.branch_locks,note:s.note}});
 ok(!/20260912T1317Z-v245/.test(active),'v245 resurrected as active generation');ok(!/pitti\/rc4198-operational-restore-or1/.test(active),'operative old repair branch pointer');ok(!/c9f7eb1a3dea788fb56eac517dab63b39ed9ef59.{0,80}(?:deployed|production)|(?:deployed|production).{0,80}c9f7eb1a3dea788fb56eac517dab63b39ed9ef59/i.test(active),'c9 main falsely deployed');
 return e;
}
