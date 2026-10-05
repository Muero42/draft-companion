import fs from 'node:fs';import {authorityDigest} from './rc4226-authority.mjs';
export function validateRc4227Authority(d){
 const errors=[],expected=JSON.parse(fs.readFileSync(new URL('./fixtures/rc4227/authority-digests.json',import.meta.url))),c=d['PITTI_CURRENT_STATE.json'],l=d['PITTI_EXECUTION_LOCK.json'],k=d['PITTI_COMMAND_CONTRACTS.json'],s=d['PITTI_HANDOFF_SEAL.json'],f=JSON.parse(fs.readFileSync(new URL('./fixtures/rc4227/local-candidate.json',import.meta.url))),V='v11.8.0-rc4.227',G='RC4227_EXACT_HEAD_CLOUD_VALIDATION_PENDING';
 for(const [file,hash]of Object.entries(expected))if(authorityDigest(file,d[file])!==hash)errors.push(file+': RC4227 pinned current aliases/history drift');
 if(c?.authority?.source_candidate!==V||l?.runtime?.appVersion!==V||!d['app.js']?.includes("const APP_VERSION='"+V+"'"))errors.push('RC4227 runtime/source mismatch');
 if(![c,l,k,s].every(x=>x.handoff_generation===f.generation)||!/^20\d{6}T\d{4}Z-v304$/.test(f.generation))errors.push('RC4227 coupled generation mismatch');
 if(c.gate!==G||l.gate!==G||k.currentGate!==G||s.exact_gate!==G)errors.push('RC4227 exact-head publication gate mismatch');
 if(c.runtime.deployed_production_version!=='v11.8.0-rc4.226'||c.authority.canonical_main!==f.baselineHead||c.runtime.production_deployment.source_commit!==f.baselineHead||c.runtime.production_deployment.version!=='v11.8.0-rc4.226')errors.push('RC4226 Production truth drift');
 for(const x of [c.runtime_candidate,c.candidate_work,l.runtimeCandidate,k.currentBoundary.runtimeCandidate,s.runtime_candidate])if(x?.version!==V||x.status!=='RELEASE_CANDIDATE_UNMERGED'||x.merged!==false||x.production_proven!==false||x.physical_accepted!==false||x.pr!==null||x.published_head!==null||x.merge_commit!==null||x.head_binding!=='CURRENT_GIT_HEAD_AFTER_LOCAL_COMMIT'||x.functional_head!==f.functionalHead)errors.push('RC4227 local-only candidate overclaim or identity drift');
 if(f.runtimeVersion!==V||f.unpublished!==true||f.publicationReady!==true||f.productionVerified!==false||f.providerContractVerified!==false||f.androidAcceptance!=='PENDING'||c.runtime.source_candidate_status!=='RELEASE_CANDIDATE_UNMERGED'||c.runtime.current_physical_acceptance.proven!==false||c.runtime.current_physical_acceptance.acceptance!=='PENDING')errors.push('RC4227 publication-ready is not published/physically accepted');
 if(s.status!=='PASS'||s.handoff_ready!==true||s.second_pass_pass!==true)errors.push('RC4227 seal structural readiness mismatch');
 return errors;
}
