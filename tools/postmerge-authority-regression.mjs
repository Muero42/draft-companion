import assert from 'node:assert/strict';import {loadAuthority,validateAuthority,validateContinuationEvidence} from './postmerge-authority-contract.mjs';
const b=loadAuthority();assert.deepEqual(validateAuthority(b),[],'baseline v263 authority must validate');
const cases=[
['generation',d=>d['PITTI_CURRENT_STATE.json'].handoff_generation='old'],
['candidate',d=>d['PITTI_CURRENT_STATE.json'].authority.source_candidate='v11.8.0-rc4.206'],
['production claim',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4206_pr191_source_merge.production_deployment_proven=false],
['deployment',d=>d['PITTI_CURRENT_STATE.json'].runtime.production_deployment.deployment_id='wrong'],
['physical acceptance',d=>d['PITTI_CURRENT_STATE.json'].runtime.production_deployment.device_acceptance_proven=true],
['physical verdict',d=>d['PITTI_CURRENT_STATE.json'].runtime.latest_device_evidence.classification='PASS'],
['panel substitution',d=>d['PITTI_CURRENT_STATE.json'].runtime.independent_evidence_lane_status.pitti_panel='BROAD_ECR'],
['team total',d=>d['PITTI_CURRENT_STATE.json'].runtime.independent_evidence_lane_status.team_total='AVAILABLE'],
['command production',d=>d['PITTI_COMMAND_CONTRACTS.json'].currentBoundary.productionDeployment.deviceAcceptanceProven=true],
['command gate',d=>d['PITTI_COMMAND_CONTRACTS.json'].currentGate='DONE'],
['lock version',d=>d['PITTI_EXECUTION_LOCK.json'].runtime.appVersion='v11.8.0-rc4.206'],
['lock deployment',d=>d['PITTI_EXECUTION_LOCK.json'].runtime.productionDeployment.deploymentId=null],
['seal',d=>d['PITTI_HANDOFF_SEAL.json'].exact_gate='DONE']
];for(const[n,f]of cases){const d=structuredClone(b);f(d);assert(validateAuthority(d).length,`must reject ${n}`)}
const h='a'.repeat(40),m='b'.repeat(40),ev={fresh:true,repo:'Muero42/draft-companion',canonicalBranch:'main',canonicalHead:m,head:h,clean:true,branch:'codex/rc4.206-physical-failure-repair',prState:'OPEN',prHead:h,ciHead:h,authorizedWorkPackage:true,checks:['project_guardrails','release_contract_v2','candidate_package'].map(name=>({name,result:'PASS'}))};assert.deepEqual(validateContinuationEvidence(ev),[]);for(const f of[x=>x.fresh=false,x=>x.clean=false,x=>x.prHead=m,x=>x.ciHead=m,x=>x.authorizedWorkPackage=false,x=>x.checks.push({name:'project_guardrails',result:'PASS'})]){const x=structuredClone(ev);f(x);assert(validateContinuationEvidence(x).length)}console.log(`POSTMERGE_AUTHORITY_REGRESSION_PASS generation=v263 mutations=${cases.length} external=6`);
