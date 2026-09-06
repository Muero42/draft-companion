import fs from 'node:fs';import assert from 'node:assert/strict';
export function permissionErrors(text){
  const allowed=text.split('these reversible actions are preapproved:')[1]?.split('These actions require separate explicit authorization:')[0]||'';
  const denied=text.split('These actions require separate explicit authorization:')[1]||'';
  const errors=[];
  for(const token of ['Read/search','local commits','repository-locally','fast-forward-only','non-production','pull requests','tests','helper scripts','read CI'])if(!allowed.includes(token))errors.push('missing allowed '+token);
  for(const token of ['Merge to main','force-push','destructive reset','Deployment','secrets','External communication','purchases','Sleeper Add/Drop','FAAB'])if(!denied.includes(token))errors.push('missing restricted '+token);
  if(/Merge to main|Deployment|force-push|Sleeper Add\/Drop/.test(allowed))errors.push('restricted action promoted to preapproval');
  return errors;
}
const text=fs.readFileSync('AGENTS.md','utf8');assert.deepEqual(permissionErrors(text),[]);
assert(permissionErrors(text.replace('These actions require separate explicit authorization:','')).length);
assert(permissionErrors(text.replace('these reversible actions are preapproved:','these reversible actions are preapproved: Merge to main')).length);
console.log('PERMISSION_CONTRACT_PASS positive + 2 negatives');
