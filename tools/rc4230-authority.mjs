import {rc4230Binding,rc4229AuthorityBeforeBinding} from './rc4230-release-baseline.mjs';
import {validateRc4229Authority} from './rc4229-authority.mjs';
export function validateRc4230Authority(d){
  const f=rc4230Binding(),errors=[];
  for(const e of f.patch){
    if(e.documentPrefix){if(!d[e.file]?.startsWith(e.documentPrefix))errors.push(e.file+': rc4230 prefix drift');continue;}
    let value=d[e.file];for(const k of e.path.split('.'))value=value?.[k];
    if(JSON.stringify(value)!==JSON.stringify(e.value))errors.push(e.file+': '+e.path+' drift');
  }
  if(f.version!=='v11.8.0-rc4.230'||!/^\d{8}T\d{4}Z-v306$/.test(f.generation)||f.functionalHead!=='5be01f00c74f7b611058130f6a84c2a2c2c76aba'||f.baselineHead!=='a7f27740d33a7a39127d51515cc2fd8c3d9f28ff'||f.unpublished!==true||f.merged!==false||f.deployed!==false||f.physicalAccepted!==false||f.adapterImplemented!==false||f.previewAuditRequired!==true)errors.push('RC4230 binding overclaim');
  const candidate=d['PITTI_CURRENT_STATE.json']?.runtime_candidate;
  if(candidate?.preview_audit?.required!==true||candidate.preview_audit.acceptance_proven!==false||candidate.merge_eligible!==false||candidate.exact_head_ci!=='PENDING'||candidate.cloud_validation!=='PENDING')errors.push('RC4230 exact-head CI and real preview gate required');
  if(!d['app.js']?.includes("APP_VERSION='v11.8.0-rc4.230'"))errors.push('rc4230 runtime version drift');
  return [...errors,...validateRc4229Authority(rc4229AuthorityBeforeBinding(d))];
}
