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
  if(f.version!=='v11.8.0-rc4.230'||!/^\d{8}T\d{4}Z-v306$/.test(f.generation)||f.functionalHead!=='5be01f00c74f7b611058130f6a84c2a2c2c76aba'||f.baselineHead!=='a7f27740d33a7a39127d51515cc2fd8c3d9f28ff'||f.unpublished!==false||f.merged!==false||f.deployed!==false||f.physicalAccepted!==false||f.adapterImplemented!==false||f.previewAuditRequired!==true)errors.push('RC4230 binding overclaim');
  const head='0af2fe5736d77e4bdba14d3e03cb4e7057092da2',tree='84b35c52bbda421a5c36de2f1fb3d57dd04431a3',parent='5a09c23499933933249ad62406fdbaf3796ccac8';
  for(const candidate of [d['PITTI_CURRENT_STATE.json']?.runtime_candidate,d['PITTI_EXECUTION_LOCK.json']?.runtimeCandidate,d['PITTI_COMMAND_CONTRACTS.json']?.currentBoundary?.runtimeCandidate,d['PITTI_HANDOFF_SEAL.json']?.runtime_candidate]){
    if(candidate?.published!==true||candidate.pr!==233||candidate.pr_state!=='OPEN'||candidate.published_head!==head||candidate.head_sha!==head||candidate.tree_sha!==tree||candidate.exact_head_ci!=='PASS'||candidate.cloud_validation!=='PASS'||candidate.cloud_strict!=='314/314 PASS'||candidate.merge_eligible!==true)errors.push('RC4230 exact published receipt required');
    for(const key of ['merged','deployed','physical_accepted','adapter_implemented','merge_authorized','merge_after_exact_head_ci_authorized','expert_unavailable_claim','persistence_enabled','consumer_enabled'])if(candidate?.[key]!==false)errors.push('RC4230 forbidden claim '+key);
    const audit=candidate?.preview_audit;
    if(audit?.required!==true||audit.acceptance_proven!==true||audit.source_head!==parent||audit.validated_child_head!==head||audit.validated_child_tree!==tree||audit.request_behavior_unchanged!==true||audit.new_live_preview_required!==false||audit.accepted_conclusion!=='CONCLUSIVE_ROUTE_UNUSABLE'||audit.diagnostic_outcome!=='FILTER_NOT_HONORED'||audit.expertUnavailableClaim!==false||audit.ambiguous_acceptable!==false||audit.parser_blob!==f.parserOnlyEvidenceCarryForward.correctedAppBlob||audit.evidence_blob!==f.parserOnlyEvidenceCarryForward.evidenceBlob)errors.push('RC4230 one-time evidence receipt required');
  }
  const carry=f.parserOnlyEvidenceCarryForward;
  if(carry.sourceHead!==parent||carry.validatedChildHead!==head||carry.validatedChildTree!==tree||carry.acceptanceProven!==true||carry.requestBehaviorMustMatchSourceHead!==true||carry.exactHeadCloudRequired!==true||carry.newLivePreviewRequired!==false||carry.expertUnavailableClaim!==false)errors.push('RC4230 carry-forward drift');
  if(!d['app.js']?.includes("APP_VERSION='v11.8.0-rc4.230'"))errors.push('rc4230 runtime version drift');
  return [...errors,...validateRc4229Authority(rc4229AuthorityBeforeBinding(d))];
}
