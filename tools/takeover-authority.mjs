import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';import {execFileSync} from 'node:child_process';
import {loadAuthority,validateAuthority,validateContinuationEvidence} from './postmerge-authority-contract.mjs';
export function takeoverErrors(e,local,now=Date.now()){
  const errors=validateContinuationEvidence(e);
  if(!Number.isFinite(e?.verifiedAt)||e.verifiedAt>now||now-e.verifiedAt>300000)errors.push('fresh timestamp required (5 minute maximum)');
  if(e?.evidenceSource!=='GITHUB_API')errors.push('GitHub API provenance required');
  for(const key of ['branch','head','clean'])if(e?.[key]!==local[key])errors.push('local '+key+' mismatch');
  if(!/^https:\/\/github\.com\/Muero42\/draft-companion(?:\.git)?$/.test(local.origin))errors.push('canonical origin mismatch');
  if(e?.canonicalHead!==local.remoteMain)errors.push('remote main mismatch');
  return errors;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  execFileSync(process.execPath,['tools/pitti_guardrail_check.mjs'],{stdio:'inherit',env:{...process.env,PITTI_SKIP_SEAL_INTEGRITY:'0',PITTI_CANDIDATE_PREFLIGHT:'0'}});
  const git=(...args)=>execFileSync('git',args,{encoding:'utf8'}).trim();
  const errors=validateAuthority(loadAuthority());
  const evidencePath=process.argv[2];
  if(!evidencePath)errors.push('GitHub evidence JSON required; obtain current PR state and all three exact-head check results from GitHub API, never reuse a checkpoint observation');
  else{
    const e=JSON.parse(fs.readFileSync(evidencePath,'utf8'));
    const local={origin:git('remote','get-url','origin'),branch:git('branch','--show-current'),head:git('rev-parse','HEAD'),clean:git('status','--porcelain=v1','--untracked-files=all')==='',remoteMain:git('ls-remote','origin','refs/heads/main').split(/\s/)[0]};
    errors.push(...takeoverErrors(e,local));
  }
  if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}else console.log('TAKEOVER_AUTHORITY_PASS (source only; no merge/deployment/device authorization)');
}
