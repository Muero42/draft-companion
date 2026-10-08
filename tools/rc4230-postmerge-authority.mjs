import fs from 'node:fs';
export const rc4230PostmergeBinding=()=>JSON.parse(fs.readFileSync(new URL('./fixtures/rc4230/postmerge-authority.json',import.meta.url)));
export function rc4230PremergeAuthority(d){
  if(!d['PITTI_CURRENT_STATE.json']?.authority?.rc4230_postmerge)return d;
  const copy=structuredClone(d),f=rc4230PostmergeBinding();
  for(const e of [...f.patch].reverse()){
    if(e.documentPrefix){if(copy[e.file]?.startsWith(e.documentPrefix))copy[e.file]=copy[e.file].slice(e.documentPrefix.length);continue;}
    const keys=e.path.split('.');let x=copy[e.file];for(const k of keys.slice(0,-1))x=x[k];if(e.old===undefined)delete x[keys.at(-1)];else x[keys.at(-1)]=structuredClone(e.old);
  }
  copy['PITTI_HANDOFF_SEAL.json'].integrity=structuredClone(f.previousSeal);return copy;
}
export function validateRc4230Postmerge(d,validatePrevious){
  const f=rc4230PostmergeBinding(),errors=[],main='d304b9f31547eb34fc7eb0037fab640497ed3360',tree='cebf9854f4e00422361d19eea557549c395f3988',deployment='b9f13bd5-6aa8-4688-a183-893aec8af333';
  if(!/^20261008T\d{4}Z-v307$/.test(f.generation)||f.main!==main||f.tree!==tree||f.deployment!==deployment)errors.push('postmerge identity/generation drift');
  for(const e of f.patch){if(e.documentPrefix){if(!d[e.file]?.startsWith(e.documentPrefix))errors.push(e.file+' postmerge prefix');continue;}let value=d[e.file];for(const k of e.path.split('.'))value=value?.[k];if(JSON.stringify(value)!==JSON.stringify(e.value))errors.push(e.file+' '+e.path+' postmerge drift');}
  for(const c of [d['PITTI_CURRENT_STATE.json']?.runtime_candidate,d['PITTI_EXECUTION_LOCK.json']?.runtimeCandidate,d['PITTI_COMMAND_CONTRACTS.json']?.currentBoundary?.runtimeCandidate,d['PITTI_HANDOFF_SEAL.json']?.runtime_candidate]){
    if(c?.pr!==233||c.pr_state!=='MERGED'||c.merge_commit!==main||c.canonical_main!==main||c.canonical_tree!==tree||c.merged!==true||c.deployed!==true||c.production_proven!==true||c.postmerge_ci!=='PASS'||c.postmerge_workflows!==7||c.cloud_strict!=='314/314 PASS'||c.cloudflare_status!=='SUCCESS')errors.push('postmerge source/CI proof required');
    const p=c?.production_deployment;if(p?.version!=='v11.8.0-rc4.230'||p.source_commit!==main||p.tree!==tree||p.deployment_id!==deployment||p.cloudflare_check_run_id!==113183316198||p.status!=='DEPLOYED_SUCCESS'||p.device_acceptance_proven!==false)errors.push('postmerge deployment proof required');
    for(const key of ['physical_accepted','adapter_implemented','persistence_enabled','consumer_enabled'])if(c?.[key]!==false)errors.push('postmerge forbidden '+key);
    if(c?.preview_audit?.diagnostic_outcome!=='FILTER_NOT_HONORED'||c.preview_audit.accepted_conclusion!=='CONCLUSIVE_ROUTE_UNUSABLE'||c.preview_audit.expertUnavailableClaim!==false)errors.push('postmerge diagnostic overclaim');
  }
  return [...errors,...validatePrevious(rc4230PremergeAuthority(d))];
}
