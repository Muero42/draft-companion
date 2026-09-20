import assert from 'node:assert/strict';import {loadAuthority,validateAuthority,validateContinuationEvidence} from './postmerge-authority-contract.mjs';
const b=loadAuthority();assert.deepEqual(validateAuthority(b),[],'baseline v262 authority must validate');
const cases=[
['generation',d=>d['PITTI_CURRENT_STATE.json'].handoff_generation='old'],
['source',d=>d['PITTI_CURRENT_STATE.json'].authority.source_candidate='v11.8.0-rc4.205'],
['merge status',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4206_pr191_source_merge.status='DEPLOYED'],
['reviewed head',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4206_pr191_source_merge.reviewed_head='a'.repeat(40)],
['merge commit',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4206_pr191_source_merge.merge_commit='b'.repeat(40)],
['production claim',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4206_pr191_source_merge.production_deployment_proven=true],
['panel physical claim',d=>d['PITTI_CURRENT_STATE.json'].authority.independent_evidence_lane_repair.pitti_panel='AVAILABLE'],
['game physical claim',d=>d['PITTI_CURRENT_STATE.json'].authority.independent_evidence_lane_repair.canonical_game_context='AVAILABLE'],
['team total',d=>d['PITTI_CURRENT_STATE.json'].authority.independent_evidence_lane_repair.team_total='AVAILABLE'],
['parity',d=>d['PITTI_CURRENT_STATE.json'].runtime.deployed_pages_app_byte_parity_with_main=true],
['command gate',d=>d['PITTI_COMMAND_CONTRACTS.json'].currentGate='DONE'],
['lock version',d=>d['PITTI_EXECUTION_LOCK.json'].runtime.appVersion='v11.8.0-rc4.205'],
['seal',d=>d['PITTI_HANDOFF_SEAL.json'].exact_gate='DONE']
];for(const[n,f]of cases){const d=structuredClone(b);f(d);assert(validateAuthority(d).length,`must reject ${n}`)}
const h='a'.repeat(40),m='b'.repeat(40),ev={fresh:true,repo:'Muero42/draft-companion',canonicalBranch:'main',canonicalHead:m,head:h,clean:true,branch:'pitti/v262-rc4206-postmerge-authority-reconciliation-20260920',prState:'OPEN',prHead:h,ciHead:h,authorizedWorkPackage:true,checks:['project_guardrails','release_contract_v2','candidate_package'].map(name=>({name,result:'PASS'}))};assert.deepEqual(validateContinuationEvidence(ev),[]);for(const f of[x=>x.fresh=false,x=>x.clean=false,x=>x.prHead=m,x=>x.ciHead=m,x=>x.authorizedWorkPackage=false,x=>x.checks.push({name:'project_guardrails',result:'PASS'})]){const x=structuredClone(ev);f(x);assert(validateContinuationEvidence(x).length)}console.log(`POSTMERGE_AUTHORITY_REGRESSION_PASS generation=v262 mutations=${cases.length} external=6`);
