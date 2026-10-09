import fs from 'node:fs';
import assert from 'node:assert/strict';
export const rc4231Binding=()=>JSON.parse(fs.readFileSync(new URL('./fixtures/rc4231/release-binding.json',import.meta.url)));
// Exact inverses only. Historical contracts still validate their original bytes;
// season-rc4231-release-binding-regression independently verifies the new delta.
export function rc4230RuntimeBeforeRepair(text){
  const f=rc4231Binding();
  for(const p of f.runtimePatches){
    if(!text.includes(p.value))continue;
    assert.equal(text.split(p.value).length,2,'unique rc4231 inverse '+p.name);
    text=text.replace(p.value,p.old);
  }
  return text.replaceAll(f.version,'v11.8.0-rc4.230');
}
export function rc4230AuthorityBeforeRepair(d){
  if(d['PITTI_CURRENT_STATE.json']?.authority?.source_candidate!=='v11.8.0-rc4.231')return d;
  const copy=structuredClone(d),f=rc4231Binding();
  for(const e of [...f.patch].reverse()){
    if(e.documentPrefix){assert(copy[e.file].startsWith(e.documentPrefix));copy[e.file]=copy[e.file].slice(e.documentPrefix.length);continue;}
    const keys=e.path.split('.');let x=copy[e.file];for(const k of keys.slice(0,-1))x=x[k];
    if(e.old===undefined)delete x[keys.at(-1)];else x[keys.at(-1)]=structuredClone(e.old);
  }
  copy['PITTI_HANDOFF_SEAL.json'].integrity=structuredClone(f.previousSeal);
  copy['app.js']=rc4230RuntimeBeforeRepair(copy['app.js']);return copy;
}
export function validateRc4231Authority(d,validatePrevious){
  const f=rc4231Binding(),errors=[];
  if(f.version!=='v11.8.0-rc4.231'||f.generation!=='20261009T2010Z-v308'||f.baselineHead!=='171933ed024525e5c3bb7df864ab07d3bc27bb82'||f.parent!=='3e352462b534a9b0a9233664ec4239e6a676b535')errors.push('rc4231 identity drift');
  for(const e of f.patch){
    if(e.documentPrefix){if(!d[e.file]?.startsWith(e.documentPrefix))errors.push(e.file+' rc4231 prefix drift');continue;}
    let value=d[e.file];for(const key of e.path.split('.'))value=value?.[key];
    if(JSON.stringify(value)!==JSON.stringify(e.value))errors.push(e.file+' '+e.path+' rc4231 drift');
  }
  for(const c of [d['PITTI_CURRENT_STATE.json']?.runtime_candidate,d['PITTI_EXECUTION_LOCK.json']?.runtimeCandidate,d['PITTI_COMMAND_CONTRACTS.json']?.currentBoundary?.runtimeCandidate,d['PITTI_HANDOFF_SEAL.json']?.runtime_candidate]){
    if(c?.version!==f.version||c.status!=='LOCAL_UNPUBLISHED'||c.head_binding!=='LOCAL_COMMIT_HEAD_AFTER_VALIDATION'||c.exact_head_ci!=='NOT_RUN'||c.parser_carry_forward_applies!==false)errors.push('rc4231 candidate scope drift');
    for(const key of ['published','merged','deployed','physical_accepted','production_proven','merge_eligible','publication_authorized','merge_authorized','adapter_implemented','persistence_enabled','consumer_enabled'])if(c?.[key]!==false)errors.push('rc4231 forbidden claim '+key);
  }
  if(!d['app.js']?.includes("const APP_VERSION='v11.8.0-rc4.231'"))errors.push('rc4231 runtime version drift');
  // Reject active-layer mutations before reconstruction, never mask them as history.
  if(errors.length)return errors;
  try{return validatePrevious(rc4230AuthorityBeforeRepair(d));}catch(e){return ['rc4231 inverse failed: '+e.message];}
}
