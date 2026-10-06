import {rc4230Binding,rc4229AuthorityBeforeBinding} from './rc4230-release-baseline.mjs';
import {validateRc4229Authority} from './rc4229-authority.mjs';
// User-verified Production receipt, independent of release reconstruction fixtures.
export function validateRc4230ProductionIdentity(d){
  const expected={version:'v11.8.0-rc4.229',main:'a7f27740d33a7a39127d51515cc2fd8c3d9f28ff',tree:'7c6984ea77f70fd56a261110225476047d93fdd1',pr:232,deployment:'0951da55-4845-49ec-ada3-550922c071e7',reviewed:'c5612d947512ebdb6dc8ec632c5cbbda4b883132'},errors=[];
  const c=d['PITTI_CURRENT_STATE.json'],l=d['PITTI_EXECUTION_LOCK.json'],k=d['PITTI_COMMAND_CONTRACTS.json'];
  for(const [label,obj,keys] of [
    ['CURRENT Production',c?.runtime?.production_deployment,{version:'version',main:'source_commit',tree:'tree',pr:'pr',deployment:'deployment_id'}],
    ['COMMAND Production',k?.currentBoundary?.productionDeployment,{version:'version',main:'sourceCommit',tree:'tree',pr:'pr',deployment:'deploymentId'}],
    ['LOCK Production target',l?.authority?.liveVerificationTargets?.[0],{version:'version',main:'mergeCommit',tree:'runtimeTree',pr:'pr',deployment:'deploymentId',reviewed:'reviewedHead'}]
  ])for(const [key,field] of Object.entries(keys))if(obj?.[field]!==expected[key])errors.push(label+': incoherent '+field);
  for(const field of ['sourceBaseline','failClosedRecovery']){
    const text=l?.authority?.[field]||'';
    for(const token of [expected.version+' Production',expected.main,expected.tree,expected.deployment,'PR232 MERGED',expected.reviewed])if(!text.includes(token))errors.push('LOCK '+field+': missing Production '+token);
    const versions=[...text.matchAll(/v11\.8\.0-rc4\.\d+/g)].map(m=>m[0]);
    if(versions.some(v=>v!==expected.version&&(field!=='failClosedRecovery'||v!=='v11.8.0-rc4.230'))||/PR\s*#?231\b|ab7a9b02-d8e1-4244-969d-9ec3254798d4|7d73a445c9cbad34eb9508b3b07a9a575b583d22/.test(text))errors.push('LOCK '+field+': cross-release evidence');
  }
  return errors;
}
export function validateRc4230Authority(d){
  const f=rc4230Binding(),errors=validateRc4230ProductionIdentity(d);
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
