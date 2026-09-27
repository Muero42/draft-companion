import assert from 'node:assert/strict';import {loadAuthority,validateAuthority,validateContinuationEvidence} from './postmerge-authority-contract.mjs';
const b=loadAuthority();assert.deepEqual(validateAuthority(b),[],'baseline v269 authority must validate');
const cases=[
 ['generation',d=>d['PITTI_CURRENT_STATE.json'].handoff_generation='old'],
 ['main',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4211_pr207_source_production.merge_commit='a'.repeat(40)],
 ['tree',d=>d['PITTI_CURRENT_STATE.json'].runtime.current_physical_acceptance.tree='b'.repeat(40)],
 ['deployment',d=>d['PITTI_CURRENT_STATE.json'].runtime.production_deployment.deployment_id='wrong'],
 ['physical inherit',d=>{d['PITTI_CURRENT_STATE.json'].runtime.current_physical_acceptance.proven=true;d['PITTI_CURRENT_STATE.json'].runtime.current_physical_acceptance.acceptance='PASS'}],
 ['app blob',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4211_pr207_source_production.app_blob='c'.repeat(40)],
 ['historical device tree',d=>d['PITTI_CURRENT_STATE.json'].runtime.latest_device_evidence.tree='e496f5b8190b48c7a475bdba768b968575d40ca2'],
 ['panel overclaim',d=>d['PITTI_CURRENT_STATE.json'].runtime.independent_evidence_lane_status.pitti_panel='AVAILABLE'],
 ['team total',d=>d['PITTI_CURRENT_STATE.json'].runtime.independent_evidence_lane_status.team_total='AVAILABLE'],
 ['candidate',d=>d['PITTI_CURRENT_STATE.json'].candidate_work.pr=205],
 ['lock device',d=>d['PITTI_EXECUTION_LOCK.json'].runtime.androidVerified=true],
 ['command device',d=>d['PITTI_COMMAND_CONTRACTS.json'].currentBoundary.productionDeployment.deviceAcceptanceProven=true],
 ['seal',d=>d['PITTI_HANDOFF_SEAL.json'].exact_gate='DONE']
];
for(const[n,f]of cases){const d=structuredClone(b);f(d);assert(validateAuthority(d).length,`must reject ${n}`)}
const h='a'.repeat(40),ev={fresh:true,repo:'Muero42/draft-companion',canonicalBranch:'main',canonicalHead:h,head:h,clean:true,branch:'main',prState:'MERGED',containingCommitVerified:true,ciHead:h,authorizedWorkPackage:true,checks:['project_guardrails','release_contract_v2','candidate_package'].map(name=>({name,result:'PASS'}))};
assert.deepEqual(validateContinuationEvidence(ev),[]);
for(const f of[x=>x.fresh=false,x=>x.clean=false,x=>x.containingCommitVerified=false,x=>x.ciHead='b'.repeat(40),x=>x.authorizedWorkPackage=false,x=>x.checks.push({name:'project_guardrails',result:'PASS'})]){const x=structuredClone(ev);f(x);assert(validateContinuationEvidence(x).length)}
console.log(`POSTMERGE_AUTHORITY_REGRESSION_PASS generation=v269 mutations=${cases.length} external=6`);
