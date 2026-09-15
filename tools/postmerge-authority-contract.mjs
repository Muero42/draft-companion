import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
export const GENERATION='20260915T0558Z-v253';
export const AUTHORITY_GATE='RC4203_SECRET_SAFE_PROVIDER_AB_DIAGNOSTIC_THEN_PROVEN_REPAIR';
const MAIN='fb458e076de6710a91f1162e504b5b79fb67167c', DEPLOY='ef65bcf6-92d1-4c34-9873-c362bec002c7';
const VERDICT='RC4.203_PHYSICAL_FAIL_WEEKLY_PROJECTION_SEMANTIC_SCOPE_MISMATCH';
const WATCHER='77221ceeb900458e95c32d78c1ad395a37422e5d';
const PR175_HEAD='0bd7a77361b95cf212b9e59417f20dc820461dc3';
const jsonFiles=['PITTI_CURRENT_STATE.json','PITTI_EXECUTION_LOCK.json','PITTI_COMMAND_CONTRACTS.json','PITTI_HANDOFF_SEAL.json'];
export function validateContinuationEvidence(e) {
  const errors=[];
  if(e?.fresh!==true||e?.repo!=='Muero42/draft-companion'||e?.canonicalBranch!=='main') errors.push('fresh canonical Git/GitHub identity required');
  if(!/^[a-f0-9]{40}$/.test(e?.head??'')||!/^[a-f0-9]{40}$/.test(e?.canonicalHead??'')||e?.clean!==true) errors.push('verified HEADs and clean worktree required');
  if(e?.prState==='OPEN') {if(e.prHead!==e.head||e.branch==='main'||!e.branch) errors.push('open PR exact-head branch evidence required');}
  else if(e?.prState==='MERGED') {if(e.branch!=='main'||e.head!==e.canonicalHead||e.containingCommitVerified!==true) errors.push('merged canonical containment evidence required');}
  else errors.push('verified PR state required');
  const required=['project_guardrails','release_contract_v2','candidate_package'], checks=Array.isArray(e?.checks)?e.checks:[];
  if(e?.ciHead!==e?.head||checks.length!==required.length||!required.every(name=>{const m=checks.filter(x=>x?.name===name);return m.length===1&&m[0].result==='PASS';})) errors.push('all three unambiguous exact-head checks required');
  if(e?.authorizedWorkPackage!==true) errors.push('current user authorization required');
  return errors;
}
const docs=['NEW_CHAT_HANDOFF_CURRENT.md','PITTI_NEW_CHAT_BOOTSTRAP.md','PITTI_PROJECT_STATE.md','HANDOFF_COMPLETENESS_MATRIX.md','PITTI_AUTO_PREFLIGHT.md','README.md','docs/PITTI_BRIDGE_HANDOFF_RC4203_PHYSICAL_PROJECTION_LANE_FAIL_2026-09-15.md','docs/PITTI_BRIDGE_HANDOFF_V253_2026-09-15.md','docs/PITTI_CODEX_HANDOFF_AUDIT_V253_2026-09-15.md','docs/RC4203_WEEKLY_PROJECTION_ROOT_CAUSE_DIAGNOSIS_2026-09-14.md'];
export function loadAuthority(root='.') {return Object.fromEntries([...jsonFiles,...docs].map(f=>[f,jsonFiles.includes(f)?JSON.parse(fs.readFileSync(path.join(root,f))):fs.readFileSync(path.join(root,f),'utf8')]));}
export function validateAuthority(d){
 const e=[],check=(ok,label)=>{if(!ok)e.push(label)}; const c=d[jsonFiles[0]],l=d[jsonFiles[1]],k=d[jsonFiles[2]],s=d[jsonFiles[3]];
 for(const [n,o] of [['CURRENT',c],['LOCK',l],['COMMAND',k],['SEAL',s]]) check((!Object.hasOwn(o,'handoff_generation')||o.handoff_generation===GENERATION)&&(!Object.hasOwn(o,'handoffGeneration')||o.handoffGeneration===GENERATION),`${n}: stale generation`);
 const a=c.authority?.rc4203_candidate;
 check(a?.status==='MERGED/HISTORICAL_PRODUCTION_DEVICE_OBSERVED_FAILED'&&a.source_commit===MAIN&&a.deployment_id===DEPLOY&&a.deployment_proven===true&&a.device_observation_proven===true&&a.device_acceptance_proven===false,'CURRENT: rc4.203 authority contradiction');
 check(c.runtime?.deployed_production_version==='v11.8.0-rc4.203'&&c.runtime?.latestAndroidVersionObserved==='v11.8.0-rc4.203','CURRENT: stale rc4.202 newest alias');
 check(String(c.runtime?.android_authority).includes('rc4.203')&&String(c.runtime?.android_authority).includes(VERDICT)&&String(c.runtime?.android_authority).includes('NOT ACCEPTED'),'CURRENT: stale Android authority alias');
 check(c.weekly_evidence_v2_work?.classification?.startsWith('HISTORICAL/SUPERSEDED_')&&c.weekly_evidence_v2_work?.status==='HISTORICAL_MERGED_RC4.193_WORK_PACKAGE'&&String(c.weekly_evidence_v2_work?.next).startsWith('HISTORICAL ONLY:'),'CURRENT: rc4.193 work package presented as current');
 const lr=l.runtime, deployment=lr?.productionDeployment, targets=l.authority?.liveVerificationTargets||[];
 check(String(lr?.latestDeployedCandidate).includes(MAIN)&&String(lr?.latestDeployedCandidate).includes(DEPLOY)&&String(lr?.latestDeployedCandidate).includes('NOT ACCEPTED'),'LOCK: deployment/device alias');
 check(['latestAndroidObserved','latestAndroidVerified','latestAndroidFunctionalVerified','androidAuthority','android_authority','androidAcceptance'].every(key=>String(lr?.[key]).toLowerCase().includes('rc4.203')&&String(lr?.[key]).includes('NOT ACCEPTED')),'LOCK: stale latest Android alias');
 check(deployment?.version==='v11.8.0-rc4.203'&&deployment?.sourceCommit===MAIN&&deployment?.deploymentId===DEPLOY&&deployment?.deviceAcceptanceProven===false&&deployment?.physicalFailure===VERDICT,'LOCK: stale Production deployment alias');
 check(targets.some(x=>x.pr===175&&x.lane==='CURRENT_V253_HANDOFF_DRAFT_NON_PRODUCTION'&&x.head===PR175_HEAD)&&targets.some(x=>x.pr===174&&x.lane==='HISTORICAL_MERGED_RC4.203_PROVENANCE_ONLY_NEVER_CANDIDATE')&&!targets.some(x=>String(x.pr).includes('DYNAMIC')||String(x.lane).includes('CURRENT_RC4.203_CANDIDATE')),'LOCK: mutable PR target contradiction');
 const boundary=k.currentBoundary;
 check([boundary?.productionControl,boundary?.androidAuthority,boundary?.sourceAuthority,boundary?.runtimeVersion,boundary?.latestDeviceEvidence].every(x=>String(x).toLowerCase().includes('rc4.203'))&&String(boundary?.productionControl).includes(MAIN)&&String(boundary?.productionControl).includes(DEPLOY)&&String(boundary?.androidAuthority).includes(VERDICT),'COMMAND: stale current boundary alias');
 check([c.next_gate,l.exactNextAction,k.exactNextAction,s.exact_gate].every(x=>x===AUTHORITY_GATE),'provider A/B gate bypass');
 const activeDocs=docs.slice(0,6);
 for(const f of activeDocs){const current=d[f].split('## HISTORICAL/SUPERSEDED CHECKPOINT CONTENT')[0]; for(const t of [GENERATION,MAIN,DEPLOY,VERDICT,AUTHORITY_GATE,'PR #175','PR #174','PR #163','pitti-watcher']) check(current.includes(t),`${f}: missing ${t}`); check(!/rc4\.203[^\n]{0,100}(?:not Production|non-Production|source.only)/i.test(current),`${f}: rc4.203 source-only resurrection`);}
 const diagnosis=d[docs[9]]; for(const t of ['PROVEN','DISPROVEN','UNKNOWN','pre-mapping','ros=false','min/p50/p95/max','Waiver/FA','Trade','Definition of Done']) check(diagnosis.includes(t),`diagnosis: missing ${t}`);
 check(d[docs[8]].includes('**PASS.**')&&d[docs[8]].includes(WATCHER),'audit incomplete');
 check(s.status==='PASS'&&s.handoff_ready===true&&s.second_pass_pass===true,'SEAL not ready/pass');
 check(String(s.branch_locks?.mutable_live_verification_targets?.draft_companion_pr_163||'').includes('cannot override v253'),'SEAL: PR163 can override v253');
 check(String(s.branch_locks?.mutable_live_verification_targets?.draft_companion_pr_175||'').includes(PR175_HEAD)&&String(s.branch_locks?.mutable_live_verification_targets?.draft_companion_pr_175||'').includes('handoff-only'),'SEAL: PR175 is not the current handoff-only Draft lane');
 check(JSON.stringify(l).includes(WATCHER)&&JSON.stringify(s).includes(WATCHER),'watcher isolation/head missing');
 return e;
}
if(path.resolve(process.argv[1]||'')===fileURLToPath(import.meta.url)){const e=validateAuthority(loadAuthority()); e.forEach(x=>console.error('POSTMERGE_AUTHORITY_FAIL:',x)); if(e.length)process.exitCode=1; else console.log('POSTMERGE_AUTHORITY_PASS generation=v253');}
