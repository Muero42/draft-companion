import assert from 'node:assert/strict';
export const REPO='Muero42/draft-companion';
export const REQUIRED_JOBS=['guardrails','behavioral-contract','package','pitti-cloud-validation'];
export const CI_SPECS=[['pitti-project-guardrails.yml','guardrails'],['release-contract-v2.yml','behavioral-contract'],['release-contract-v2-package.yml','package'],['pitti-cloud-validation.yml','pitti-cloud-validation']];
export const CI_FILES=CI_SPECS.map(x=>x[0]);
export const REVIEW_TOPICS=['ownership','ir_taxi','last_qb_te','flex_two_te','capacity','k_dst','waiver_evidence','bilateral_trades','acceptance_probability','research_seeds','conflicts','async_routing','navigation','promotion_authority'];
export const sha=x=>typeof x==='string'&&/^[a-f0-9]{40}$/.test(x);
export function requestErrors(r,local){
  const e=[];
  if(r.repo!==REPO||local.repo!==REPO)e.push('repository mismatch');
  if(!sha(r.expected_main_sha)||local.head!==r.expected_main_sha||local.main!==r.expected_main_sha)e.push('expected_main_sha mismatch');
  if(local.branch!=='main'||!local.clean)e.push('clean canonical checkout required');
  if(!/^[a-z0-9][a-z0-9-]{2,47}$/.test(r.task_id||''))e.push('invalid task_id');
  if(typeof r.task_prompt!=='string'||r.task_prompt.trim().length<10||r.task_prompt.length>12000||secretMaterial(r.task_prompt))e.push('task_prompt required, max 12000 characters, no secret material');
  if(!Array.isArray(r.allowed_scope)||!r.allowed_scope.length||r.allowed_scope.some(x=>!safePath(x)))e.push('nonempty explicit allowed_scope required');
  if(r.max_attempts!==1||r.run_attempt!=='1'||!/^[1-9][0-9]*$/.test(r.run_id||''))e.push('foundation permits exactly one bounded first attempt');
  if(!/^[A-Za-z0-9][A-Za-z0-9._:/-]{2,119}$/.test(r.authorization_reference||'')||r.actor!=='Muero42'||r.triggering_actor!=='Muero42')e.push('authorized owner dispatch and reference required');
  if(r.event!=='workflow_dispatch'||r.ref!=='refs/heads/main'||r.workflow_sha!==r.expected_main_sha)e.push('trusted main manual workflow required');
  if(r.merge||r.deploy||r.deviceAccepted)e.push('merge/deployment/device authorization forbidden');
  return e;
}
export function safePath(p){return typeof p==='string'&&p===p.normalize('NFC')&&/^[A-Za-z0-9_-]+(?:\.[A-Za-z0-9_-]+)*(?:\/[A-Za-z0-9_-]+(?:\.[A-Za-z0-9_-]+)*)*\/?$/.test(p)&&!p.split('/').some(x=>x==='.'||x==='..'||/^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(x))&&!/^(?:node_modules|\.pitti-cloud-output)(?:\/|$)/i.test(p);}
const protectedPath=p=>p==='AGENTS.md'||p==='README.md'||/^PITTI_|^NEW_CHAT_|^HANDOFF_/i.test(p)||p==='package.json'||p==='package-lock.json'||p==='.gitignore'||p==='.node-version'||p.startsWith('.github/')||p.startsWith('tools/')||p.startsWith('config/')||p.startsWith('docs/PITTI_CLOUD_');
export function diffErrors(files,scope,branch,base,expected){
  const e=[];
  if(!/^pitti\/cloud-auto\/[a-z0-9-]+-\d+-\d+$/.test(branch))e.push('isolated cloud workbranch required; main forbidden');
  if(!sha(base)||base!==expected)e.push('base changed');
  if(!files.length)e.push('empty implementation');
  if(!Array.isArray(scope)||!scope.length)e.push('empty scope');
  const folded=new Map();for(const f of files){const k=f.normalize('NFC').toLowerCase();if(folded.has(k)&&folded.get(k)!==f)e.push('case/Unicode path collision: '+f);folded.set(k,f);
    if(!safePath(f)||protectedPath(f)||!scope?.some(p=>p.endsWith('/')?f.startsWith(p):f===p))e.push('outside permitted scope: '+f);
    if(/(?:^|\/)(?:\.env(?:\..*)?|credentials(?:\..*)?|id_rsa|id_ed25519)$|\.(?:pem|p12|pfx|key)$/i.test(f))e.push('secret-material path: '+f);
  }
  return e;
}
export function secretMaterial(text){return /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\bgh[pousr]_[A-Za-z0-9]{30,}|\bgithub_pat_[A-Za-z0-9_]{30,}|\bsk-(?:proj-)?[A-Za-z0-9_-]{40,}|\bAKIA[0-9A-Z]{16}\b/.test(text);}
export function exactCiErrors(head,observations,pr){
  const e=[];if(!sha(head))e.push('invalid CI head');
  for(const [file,job] of CI_SPECS){const list=observations.filter(x=>x.file===file).sort((a,b)=>b.id-a.id);const x=list[0];if(!x||x.head!==head||x.status!=='completed'||x.conclusion!=='success'||x.repository!==REPO||x.headRepository!==REPO||x.jobName!==job||x.jobHead!==head||x.jobStatus!=='completed'||x.jobConclusion!=='success'||(pr?(x.event!=='pull_request'||x.pr!==pr):(x.event!=='push'||x.branch!=='main')))e.push('missing/latest/non-PASS exact-head CI job: '+file);}
  return e;
}
export function reviewErrors(r,head,main,binding={}){
  const e=[];if(r?.repo!==REPO||r?.head!==head||r?.main!==main||r?.pr!==binding.pr||r?.runId!==binding.runId||r?.diffSha256!==binding.diffSha256||r?.verdict!=='PASS'||r?.readOnly!==true||r?.independent!==true||!Array.isArray(r?.findings)||r.findings.length)e.push('independent exact-head/diff/run review required');
  if(!Array.isArray(r?.checks)||r.checks.length!==14||!REVIEW_TOPICS.every(t=>r.checks.some(x=>x?.topic===t))||r.checks.some(x=>!x||x.status!=='PASS'||typeof x.evidence!=='string'||x.evidence.length<8))e.push('14 distinct evidenced semantic checks required');
  if(r?.deployment||r?.deviceAccepted||r?.mergeAuthorized)e.push('review cannot grant promotion/device/deployment');
  return e;
}
export function promotionErrors(e,now=Date.now()){const a=e.approval;return [...exactCiErrors(e.head,e.ci,e.pr),...reviewErrors(e.review,e.head,e.main,e.reviewBinding),...(!e.authorityPass?['authority missing']:[]),...(!a||a.head!==e.head||a.main!==e.main||a.pr!==e.pr||a.actor!=='Muero42'||a.type!=='EXPLICIT_USER_MERGE_APPROVAL'||a.explicit!==true||!Number.isFinite(a.issuedAt)||a.issuedAt>now||now-a.issuedAt>300000?['fresh explicit user merge approval for exact PR/head/main required']:[])];}
export function protectionErrors(p){
  const e=[];
  const active=(Array.isArray(p)?p:[]).filter(x=>x.target==='branch'&&x.enforcement==='active'&&x.conditions?.ref_name?.include?.includes('refs/heads/main')&&!x.conditions.ref_name.exclude?.length);
  if(active.some(x=>!Array.isArray(x.bypass_actors)))e.push('ruleset bypass visibility missing');
  const locked=active.filter(x=>Array.isArray(x.bypass_actors)&&x.bypass_actors.length===0).flatMap(x=>x.rules||[]);
  const pr=locked.find(x=>x.type==='pull_request')?.parameters;
  if(!pr||pr.required_approving_review_count<1||!pr.dismiss_stale_reviews_on_push||!pr.require_code_owner_review||pr.require_last_push_approval!==true)e.push('non-bypassable PR + stale/last-push dismissal + owner review required');
  const contexts=locked.filter(x=>x.type==='required_status_checks').flatMap(x=>x.parameters?.required_status_checks||[]).map(x=>x.context);
  if(!REQUIRED_JOBS.every(x=>contexts.includes(x)))e.push('required check contexts missing');
  if(!['deletion','non_fast_forward'].every(t=>locked.some(x=>x.type===t)))e.push('non-bypassable force/delete block required');
  // Separate update ruleset: only repository administrators, never an Integration, bypass update restriction.
  if(!active.some(x=>x.rules?.some(r=>r.type==='update'&&r.parameters?.update_allows_fetch_and_merge===false)&&x.bypass_actors?.length===1&&x.bypass_actors[0].actor_type==='RepositoryRole'&&x.bypass_actors[0].actor_id===5&&x.bypass_actors[0].bypass_mode==='always'))e.push('admin-only strict update rule without Cloud App bypass required');
  return e;
}
export function requirePass(errors){assert.deepEqual(errors,[],errors.join('; '));}
