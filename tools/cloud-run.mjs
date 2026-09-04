// Trusted orchestration. Always execute this file from the verified controller checkout,
// never from the agent's patch. No merge, deployment, or transaction endpoint exists.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {REPO,CI_FILES,CI_SPECS,REVIEW_TOPICS,requestErrors,diffErrors,pathCollisionErrors,secretMaterial,exactCiErrors,reviewErrors,protectionErrors,requirePass} from './cloud-contract.mjs';
import {loadAuthority,validateAuthority,validateContinuationEvidence} from './postmerge-authority-contract.mjs';
const work=path.resolve(process.env.PITTI_WORK||'.'),out=path.resolve(process.env.PITTI_OUTPUT||'.pitti-cloud-output');
const git=(...a)=>execFileSync('git',['-c','core.hooksPath=/dev/null',...a],{cwd:work,encoding:'utf8',maxBuffer:20*1024*1024}).trim();
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const write=(p,o)=>{fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,JSON.stringify(o,null,2)+'\n');};
const result=(k,v)=>{if(process.env.GITHUB_OUTPUT)fs.appendFileSync(process.env.GITHUB_OUTPUT,k+'='+v+'\n');};
const token=()=>{if(!process.env.GH_TOKEN)throw Error('GitHub authentication missing');return process.env.GH_TOKEN;};
async function api(resource,method='GET',body){
  const publishPost=resource==='pulls'||['git/blobs','git/trees','git/commits','git/refs'].includes(resource);
  if(method!=='GET'&&!(method==='POST'&&publishPost))throw Error('endpoint mutation forbidden');
  const r=await fetch('https://api.github.com/repos/'+REPO+'/'+resource,{method,headers:{Authorization:'Bearer '+token(),Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'},...(body?{body:JSON.stringify(body)}:{})});
  if(!r.ok)throw Error('GitHub '+method+' '+resource+' HTTP '+r.status);
  return r.json();
}
async function protection(){const repo=await api('');if(repo.default_branch!=='main')throw Error('canonical default branch is not main');const rules=await api('rulesets?includes_parents=true');const details=await Promise.all(rules.map(x=>api('rulesets/'+x.id)));requirePass(protectionErrors(details,repo.default_branch));return{default_branch:repo.default_branch,rules:details};}
async function observations(head,pr){
  const all=[];for(let page=1;page<=5;page++){const r=await api('actions/runs?head_sha='+head+'&per_page=100&page='+page);all.push(...r.workflow_runs);if(r.workflow_runs.length<100)break;}
  const selected=CI_SPECS.map(([file])=>all.filter(x=>x.path?.split('/').pop()===file).sort((a,b)=>b.id-a.id)[0]).filter(Boolean);
  return Promise.all(selected.map(async x=>{const jobs=await api('actions/runs/'+x.id+'/jobs?filter=latest&per_page=100'),expected=CI_SPECS.find(y=>y[0]===x.path?.split('/').pop())?.[1],matches=jobs.jobs.filter(j=>j.name===expected),j=matches.length===1?matches[0]:{};return {file:x.path?.split('/').pop(),id:x.id,head:x.head_sha,status:x.status,conclusion:x.conclusion,url:x.html_url,event:x.event,branch:x.head_branch,repository:x.repository?.full_name,headRepository:x.head_repository?.full_name,pr:x.pull_requests?.length===1?x.pull_requests[0].number:null,jobName:j.name,jobHead:j.head_sha,jobStatus:j.status,jobConclusion:j.conclusion};}));
}
async function unchanged(main,pr,head){
  if((await api('branches/main')).commit.sha!==main)throw Error('main moved; new authorization required');
  if(pr){const p=await api('pulls/'+pr);if(p.state!=='open'||p.merged||p.base.ref!=='main'||p.head.sha!==head||p.head.repo.full_name!==REPO)throw Error('PR state/head changed');}
}
function requestFromEnv(){const inputs=JSON.parse(process.env.PITTI_INPUTS||'{}');return {...inputs,allowed_scope:JSON.parse(inputs.allowed_scope||'null'),max_attempts:Number(inputs.max_attempts),repo:process.env.GITHUB_REPOSITORY,actor:process.env.GITHUB_ACTOR,triggering_actor:process.env.GITHUB_TRIGGERING_ACTOR,event:process.env.GITHUB_EVENT_NAME,ref:process.env.GITHUB_REF,workflow_sha:process.env.GITHUB_WORKFLOW_SHA,run_id:process.env.GITHUB_RUN_ID,run_attempt:process.env.GITHUB_RUN_ATTEMPT};}
function boundRequest(){const r=read(path.join(out,'request.json')),trusted=requestFromEnv();for(const [k,v] of Object.entries(trusted))if(JSON.stringify(r[k])!==JSON.stringify(v))throw Error('request tampering: '+k);if(r.branch!=='pitti/cloud-auto/'+r.task_id+'-'+r.run_id+'-'+r.run_attempt)throw Error('request branch tampering');return r;}
async function authority(r,head,pr){
  const ci=await observations(head,pr);requirePass(exactCiErrors(head,ci,pr));
  const e={repo:REPO,canonicalBranch:'main',canonicalHead:r.expected_main_sha,head,branch:pr?r.branch:'main',clean:true,prState:pr?'OPEN':'MERGED',prHead:head,containingCommitVerified:!pr,ciHead:head,checks:['project_guardrails','release_contract_v2','candidate_package'].map((name,i)=>({name,result:'PASS',runId:ci.filter(x=>x.file===CI_FILES[i]).sort((a,b)=>b.id-a.id)[0].id})),fresh:true,verifiedAt:Date.now(),evidenceSource:'GITHUB_API',authorizedWorkPackage:true};
  requirePass(validateContinuationEvidence(e));
  write(path.join(out,'authority-'+head+'.json'),{...e,ci});
  requirePass(validateAuthority(loadAuthority(work)));
  return ci;
}
function changes(r,allowDerived=false){
  if(git('rev-parse','HEAD')!==r.expected_main_sha)throw Error('agent must leave base HEAD unchanged; publisher owns commits');
  const files=git('diff','--name-only','--no-renames',r.expected_main_sha).split('\n').filter(Boolean);
  files.push(...git('ls-files','--others','--exclude-standard').split('\n').filter(Boolean));
  const unique=[...new Set(files)];if(allowDerived)verifyDerivedSeal(unique);requirePass(diffErrors(unique.filter(f=>allowDerived&&f==='PITTI_HANDOFF_SEAL.json'?false:true),r.allowed_scope,git('branch','--show-current'),git('rev-parse','HEAD'),r.expected_main_sha));
  requirePass(pathCollisionErrors(git('ls-files','-z').split('\0').filter(Boolean),unique));
  for(const f of files){const p=path.join(work,f);if(fs.existsSync(p)){const s=fs.lstatSync(p);if(!s.isFile()||s.size>2*1024*1024)throw Error('regular text files under 2 MiB only: '+f);const b=fs.readFileSync(p);if(b.includes(0)||secretMaterial(b.toString('utf8')))throw Error('binary/secret-material rejected: '+f);}}
  return unique;
}
function indexModeErrors(base){const raw=execFileSync('git',['diff','--cached','--raw','-z',base],{cwd:work,encoding:'utf8'}),e=[];for(const h of raw.split('\0').filter((x,i)=>i%2===0&&x)){const m=h.match(/^:\d{6} (\d{6}) /)?.[1];if(m!=='100644'&&m!=='000000')e.push('non-regular/non-portable Git mode: '+(m||'unknown'));}return e;}
function derivedSeal(files){const sealPath=path.join(work,'PITTI_HANDOFF_SEAL.json');if(!fs.existsSync(sealPath))return;const seal=read(sealPath),touched=files.filter(f=>Object.prototype.hasOwnProperty.call(seal.integrity||{},f));if(!touched.length)return;for(const f of touched)seal.integrity[f]=git('rev-parse',':'+f);fs.writeFileSync(sealPath,JSON.stringify(seal,null,2)+'\n');git('add','--','PITTI_HANDOFF_SEAL.json');}
function verifyDerivedSeal(files){if(!files.includes('PITTI_HANDOFF_SEAL.json'))return;const candidate=read(path.join(work,'PITTI_HANDOFF_SEAL.json')),base=JSON.parse(git('show','HEAD:PITTI_HANDOFF_SEAL.json')),changed=files.filter(f=>f!=='PITTI_HANDOFF_SEAL.json');for(const f of changed)if(Object.prototype.hasOwnProperty.call(base.integrity||{},f))base.integrity[f]=git('rev-parse',':'+f);requirePass(JSON.stringify(candidate)===JSON.stringify(base)?[]:['derived seal mismatch']);}
const mode=process.argv[2];
if(mode==='protection'){
  const r=requestFromEnv();
  requirePass(requestErrors(r,{repo:REPO,head:git('rev-parse','HEAD'),main:(await api('branches/main')).commit.sha,branch:'main',clean:git('status','--porcelain=v1','--untracked-files=all')===''}));
  const protectedMain=await protection();
  write(path.join(out,'protection.json'),{main:r.expected_main_sha,run_id:r.run_id,run_attempt:r.run_attempt,...protectedMain});
}else if(mode==='preflight'){
  const r=requestFromEnv();
  requirePass(requestErrors(r,{repo:git('remote','get-url','origin').replace(/^https:\/\/github.com\//,'').replace(/\.git$/,''),head:git('rev-parse','HEAD'),main:(await api('branches/main')).commit.sha,branch:git('branch','--show-current'),clean:git('status','--porcelain=v1','--untracked-files=all')===''}));
  if(process.env.PITTI_NONDEPLOYING_BRANCHES_CONFIRMED!=='true')throw Error('admin must verify cloud workbranches do not auto-deploy');
  const policy=read(path.join(out,'protection.json'));
  if(policy.main!==r.expected_main_sha||policy.run_id!==r.run_id||policy.run_attempt!==r.run_attempt)throw Error('protection receipt mismatch');
  requirePass(protectionErrors(policy.rules,policy.default_branch));
  const p118=await api('pulls/118');if(p118.merged||p118.state!=='open')throw Error('PR118 boundary changed');
  const merged=(await api('commits/'+r.expected_main_sha+'/pulls')).find(p=>p.merged_at&&p.base.ref==='main'&&p.merge_commit_sha===r.expected_main_sha);
  if(!merged)throw Error('canonical merge containment evidence missing');
  r.branch='pitti/cloud-auto/'+r.task_id+'-'+r.run_id+'-'+r.run_attempt;
  await authority(r,r.expected_main_sha);
  write(path.join(out,'request.json'),r);
  git('switch','-c',r.branch,r.expected_main_sha);
  const prompt=`Implement the authorized PITTI task below. Read AGENTS and coupled authority documents through PROJECT_STATE EOF. Stay on ${r.branch}, base ${r.expected_main_sha}. Only change these exact files or directory prefixes: ${JSON.stringify(r.allowed_scope)}. No implicit scope exceptions: if coupled authority/tests are needed outside scope, stop and report. Do not change controller/workflow/dependency/permission files. Do not commit, push, merge, deploy, execute transactions, or contact anyone. The separate publisher owns git publication. No secrets or network. Use Node 22 project tests. Run all relevant tests and diagnose failures within this single 25-minute invocation; on inability, report failure. Built/package is never device acceptance. Before finishing, stage intent only with git add -N for new files and create the complete binary/full-index patch with git diff --binary --full-index HEAD. Return only schema JSON: patchBase64 is the canonical base64 encoding of those exact patch bytes; summary describes changes, tests and gaps. Do not return a partial patch. Authorization reference (not merge permission): ${r.authorization_reference}.\n\nTask: ${r.task_prompt}`;
  fs.writeFileSync(path.join(out,'implementation-prompt.md'),prompt);
}else if(mode==='capture'){
  const r=boundRequest(),files=changes(r);
  git('add','--',...files);
  // Staged mode check prevents executable symlinks/gitlinks even if content checks were bypassed.
  requirePass(indexModeErrors(r.expected_main_sha));
  const patch=execFileSync('git',['diff','--cached','--binary','--full-index',r.expected_main_sha],{cwd:work,maxBuffer:20*1024*1024});
  if(secretMaterial(patch.toString('utf8')))throw Error('secret material in patch (including deletions)');
  fs.writeFileSync(path.join(out,'change.patch'),patch);
  write(path.join(out,'implementation.json'),{base:r.expected_main_sha,branch:r.branch,files,tree:git('write-tree'),patch_sha256:crypto.createHash('sha256').update(patch).digest('hex'),run_id:r.run_id,run_attempt:r.run_attempt});
}else if(mode==='capture-payload'){
  const r=boundRequest(),payload=JSON.parse(process.env.PITTI_IMPLEMENTATION_PAYLOAD||'null');
  if(!payload||Object.keys(payload).sort().join(',')!=='patchBase64,summary'||typeof payload.patchBase64!=='string'||typeof payload.summary!=='string'||payload.summary.length<10||payload.summary.length>12000||secretMaterial(payload.summary))throw Error('invalid implementation payload');
  const patch=Buffer.from(payload.patchBase64,'base64');if(patch.length>128*1024||patch.toString('base64')!==payload.patchBase64)throw Error('non-canonical/oversized patch payload');
  if(secretMaterial(patch.toString('utf8')))throw Error('secret material in patch');fs.writeFileSync(path.join(out,'change.patch'),patch);fs.writeFileSync(path.join(out,'implementation-summary.md'),payload.summary+'\n');
  git('apply','--index','--',path.join(out,'change.patch'));requirePass(indexModeErrors(r.expected_main_sha));const agentFiles=changes(r);derivedSeal(agentFiles);const files=changes(r,true);
  write(path.join(out,'implementation.json'),{base:r.expected_main_sha,branch:r.branch,files,tree:git('write-tree'),patch_sha256:crypto.createHash('sha256').update(patch).digest('hex'),run_id:r.run_id,run_attempt:r.run_attempt});
}else if(mode==='apply'){
  const r=boundRequest(),i=read(path.join(out,'implementation.json')),patch=fs.readFileSync(path.join(out,'change.patch'));
  if(git('status','--porcelain=v1','--untracked-files=all')||git('rev-parse','HEAD')!==r.expected_main_sha||i.base!==r.expected_main_sha||crypto.createHash('sha256').update(patch).digest('hex')!==i.patch_sha256)throw Error('artifact/base mismatch');
  git('switch','-c',r.branch,r.expected_main_sha);git('apply','--index','--',path.join(out,'change.patch'));
  requirePass(indexModeErrors(r.expected_main_sha));const agentFiles=changes(r);derivedSeal(agentFiles);changes(r,true);if(git('write-tree')!==i.tree)throw Error('tree mismatch');
}else if(mode==='validated'){
  const r=boundRequest(),i=read(path.join(out,'implementation.json'));changes(r,true);
  if(git('write-tree')!==i.tree||git('diff','--name-only'))throw Error('tests changed candidate');
  const receipt=read(path.join(out,'validation','validation.json'));if(receipt.status!=='PASS'||receipt.schema!=='pitti.isolated-validation.v1'||receipt.repo!==REPO||receipt.base!==r.expected_main_sha||receipt.run_id!==r.run_id||receipt.run_attempt!==r.run_attempt||receipt.patch_sha256!==i.patch_sha256||receipt.tree!==i.tree)throw Error('validation missing');
  write(path.join(out,'validated.json'),receipt);
}else if(mode==='publish'){
  const r=boundRequest(),i=read(path.join(out,'implementation.json')),v=read(path.join(out,'validated.json'));
  requirePass(indexModeErrors(r.expected_main_sha));changes(r,true);if(v.status!=='PASS'||v.schema!=='pitti.isolated-validation.v1'||v.base!==r.expected_main_sha||v.run_id!==r.run_id||v.run_attempt!==r.run_attempt||v.tree!==i.tree||v.patch_sha256!==i.patch_sha256||git('write-tree')!==v.tree||git('diff','--name-only'))throw Error('unvalidated tree');
  await unchanged(r.expected_main_sha);await protection();
  // Token is exposed only to this trusted publisher, never to candidate tests or Codex.
  const summary=fs.readFileSync(path.join(out,'implementation-summary.md'),'utf8');if(secretMaterial(summary))throw Error('summary secret-material rejected');
  const fields=git('diff','--cached','--name-status','-z',r.expected_main_sha).split('\0').filter(Boolean),entries=[];
  for(let n=0;n<fields.length;){const status=fields[n++],file=fields[n++];if(!/^[AMD]$/.test(status)||!file)throw Error('rename/copy/unknown index state rejected');if(status==='D')entries.push({path:file,mode:'100644',type:'blob',sha:null});else{const content=execFileSync('git',['show',':'+file],{cwd:work,maxBuffer:2*1024*1024+1});const blob=await api('git/blobs','POST',{content:content.toString('base64'),encoding:'base64'});entries.push({path:file,mode:'100644',type:'blob',sha:blob.sha});}}
  const tree=(await api('git/trees','POST',{base_tree:git('rev-parse',r.expected_main_sha+'^{tree}'),tree:entries})).sha;if(tree!==v.tree)throw Error('remote tree construction mismatch');
  const head=(await api('git/commits','POST',{message:'PITTI Cloud AUTO: '+r.task_id,tree,parents:[r.expected_main_sha]})).sha;
  await api('git/refs','POST',{ref:'refs/heads/'+r.branch,sha:head});await unchanged(r.expected_main_sha);
  const pr=await api('pulls','POST',{title:'PITTI Cloud AUTO: '+r.task_id,head:r.branch,base:'main',body:`Authorized task ${r.task_id}; reference ${r.authorization_reference}. Base ${r.expected_main_sha}; head ${head}.\n\n${summary.slice(0,12000)}\n\nNo merge/deployment/device acceptance authorized. Exact-head CI and independent review still required.`});
  write(path.join(out,'published.json'),{head,pr:pr.number,url:pr.html_url,base:r.expected_main_sha,branch:r.branch});result('head',head);result('pr',pr.number);result('branch',r.branch);
}else if(mode==='ci'){
  const r=boundRequest(),p=read(path.join(out,'published.json'));const until=Date.now()+20*60000;let ci;
  while(true){await unchanged(r.expected_main_sha,p.pr,p.head);ci=await observations(p.head,p.pr);if(!exactCiErrors(p.head,ci,p.pr).length)break;
    if(ci.some(x=>CI_FILES.includes(x.file)&&x.status==='completed'&&['failure','cancelled','timed_out','action_required'].includes(x.conclusion)))throw Error('exact-head CI failed; new explicitly dispatched attempt required');
    if(Date.now()>until)throw Error('CI time budget exhausted');await new Promise(r=>setTimeout(r,15000));}
  write(path.join(out,'ci.json'),{head:p.head,main:r.expected_main_sha,ci,verifiedAt:Date.now()});
}else if(mode==='review-input'){
  const r=boundRequest(),p=read(path.join(out,'published.json'));await unchanged(r.expected_main_sha,p.pr,p.head);
  if(git('rev-parse','HEAD')!==p.head||git('status','--porcelain=v1','--untracked-files=all')||fs.existsSync(path.join(out,'review-raw.json')))throw Error('review checkout/output precondition mismatch');
  // Checkout an operative local PR branch for the existing takeover validator.
  git('switch','-c',r.branch,p.head);await authority(r,p.head,p.pr);
  const diff=execFileSync('git',['diff','--no-ext-diff',r.expected_main_sha,p.head],{cwd:work,maxBuffer:20*1024*1024}),binding={repo:REPO,pr:p.pr,runId:r.run_id,diffSha256:crypto.createHash('sha256').update(diff).digest('hex')};fs.writeFileSync(path.join(out,'review.diff'),diff);write(path.join(out,'review-input.json'),binding);
  fs.writeFileSync(path.join(out,'review-prompt.md'),`Echo this immutable binding exactly in the schema: ${JSON.stringify(binding)}. Independent read-only PITTI acceptance. No changes, commits, network, publication, merge, deployment or transaction. Exact head ${p.head}; current main ${r.expected_main_sha}. Read the COMPLETE diff in ${path.join(out,'review.diff')}, all affected code and coupled authority. Current CI and takeover evidence are in ${out}. Do not trust the implementer's conclusions. Inspect adversarial counterexamples and all 14 distinct semantic topics: ${JSON.stringify(REVIEW_TOPICS)}. Return schema-compliant JSON with exact head/main, verdict PASS only with no unresolved findings, one evidenced check per exact topic ID; readOnly and independent true. deployment/deviceAccepted/mergeAuthorized false. Missing evidence means FAIL.`);
}else if(mode==='review-receipt'){
  const r=boundRequest(),p=read(path.join(out,'published.json')),review=process.env.PITTI_REVIEW_PAYLOAD?JSON.parse(process.env.PITTI_REVIEW_PAYLOAD):read(path.join(out,'review-raw.json'));
  const binding=read(path.join(out,'review-input.json'));requirePass(reviewErrors(review,p.head,r.expected_main_sha,binding));await unchanged(r.expected_main_sha,p.pr,p.head);const ci=await observations(p.head,p.pr);requirePass(exactCiErrors(p.head,ci,p.pr));
  if(git('rev-parse','HEAD')!==p.head||git('status','--porcelain=v1','--untracked-files=all'))throw Error('read-only review modified checkout');
  write(path.join(out,'review-receipt-'+p.head+'.json'),{...review,pr:p.pr,ci,verifiedAt:Date.now(),promotion:'AWAITING_EXPLICIT_USER_APPROVAL_FOR_THIS_PR_HEAD',mergeExecuted:false,pcIndependentProven:false});
  console.log('CLOUD_REVIEW_PASS; PROMOTION_REQUIRES_EXPLICIT_USER_APPROVAL; NO_MERGE');
}else throw Error('unknown controller mode');
