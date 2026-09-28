import {execFileSync,spawnSync} from 'node:child_process';import {RUNTIME_FILES} from './runtime-files.mjs';import {MAIN} from './postmerge-authority-contract.mjs';
import assert from 'node:assert/strict';import {loadAuthority,validateAuthority,validateContinuationEvidence} from './postmerge-authority-contract.mjs';
const b=loadAuthority();assert.deepEqual(validateAuthority(b),[],'baseline v271 authority must validate');
const cases=[
 ['generation',d=>d['PITTI_CURRENT_STATE.json'].handoff_generation='old'],
 ['main',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4213_source_production.merge_commit='a'.repeat(40)],
 ['tree',d=>d['PITTI_CURRENT_STATE.json'].runtime.current_physical_acceptance.tree='b'.repeat(40)],
 ['deployment',d=>d['PITTI_CURRENT_STATE.json'].runtime.production_deployment.deployment_id='wrong'],
 ['physical overclaim',d=>{d['PITTI_CURRENT_STATE.json'].runtime.current_physical_acceptance.proven=true;d['PITTI_CURRENT_STATE.json'].runtime.current_physical_acceptance.acceptance='PASS'}],
 ['app blob',d=>d['PITTI_CURRENT_STATE.json'].historical_superseded.rc4211_pr207_source_production.app_blob='c'.repeat(40)],
 ['historical device tree',d=>d['PITTI_CURRENT_STATE.json'].runtime.latest_device_evidence.version='v11.8.0-rc4.213'],
 ['panel overclaim',d=>d['PITTI_CURRENT_STATE.json'].runtime.independent_evidence_lane_status.pitti_panel='AVAILABLE'],
 ['team total',d=>d['PITTI_CURRENT_STATE.json'].runtime.independent_evidence_lane_status.team_total='AVAILABLE'],
 ['candidate',d=>d['PITTI_CURRENT_STATE.json'].candidate_work.pr=205],
 ['lock device',d=>d['PITTI_EXECUTION_LOCK.json'].runtime.androidVerified=true],
 ['command device',d=>d['PITTI_COMMAND_CONTRACTS.json'].currentBoundary.productionDeployment.deviceAcceptanceProven=true],
 ['runtime lock',d=>d['PITTI_EXECUTION_LOCK.json'].runtime.appVersion='v11.8.0-rc4.212'],
 ['RB overclaim',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4213_source_production.repair_scope.rb_wrong_position='FIXED'],
 ['selected identity overclaim',d=>d['PITTI_CURRENT_STATE.json'].authority.rc4213_source_production.repair_scope.selected_pitti='AVAILABLE'],
 ['broad baseline',d=>d['PITTI_CURRENT_STATE.json'].runtime.last_broad_physical_evidence_baseline.version='v11.8.0-rc4.213'],
 ['postmerge CI overclaim',d=>d['PITTI_CURRENT_STATE.json'].runtime.ci.current_exact_main_head_ci='PASS'],
 ['seal',d=>d['PITTI_HANDOFF_SEAL.json'].exact_gate='DONE']
];
for(const[n,f]of cases){const d=structuredClone(b);f(d);assert(validateAuthority(d).length,`must reject ${n}`)}
const h='a'.repeat(40),ev={fresh:true,repo:'Muero42/draft-companion',canonicalBranch:'main',canonicalHead:h,head:h,clean:true,branch:'main',prState:'MERGED',containingCommitVerified:true,ciHead:h,authorizedWorkPackage:true,checks:['project_guardrails','release_contract_v2','candidate_package'].map(name=>({name,result:'PASS'}))};
assert.deepEqual(validateContinuationEvidence(ev),[]);
for(const f of[x=>x.fresh=false,x=>x.clean=false,x=>x.containingCommitVerified=false,x=>x.ciHead='b'.repeat(40),x=>x.authorizedWorkPackage=false,x=>x.checks.push({name:'project_guardrails',result:'PASS'})]){const x=structuredClone(ev);f(x);assert(validateContinuationEvidence(x).length)}
console.log(`POSTMERGE_AUTHORITY_REGRESSION_PASS generation=v271 mutations=${cases.length} external=6`);

assert.equal(RUNTIME_FILES.length,17);
const parentProbe=spawnSync('git',['cat-file','-e',MAIN+'^{commit}'],{encoding:'utf8'});
if(parentProbe.error)throw parentProbe.error;
if(parentProbe.status!==0){
  assert.equal(execFileSync('git',['rev-parse','--is-shallow-repository'],{encoding:'utf8'}).trim(),'true','required parent missing outside a shallow checkout');
  // Fetch only the pinned parent. Network/auth/object failures remain fatal.
  execFileSync('git',['fetch','--no-tags','--depth=1','origin',MAIN],{stdio:'inherit'});
  execFileSync('git',['cat-file','-e',MAIN+'^{commit}'],{stdio:'inherit'});
}
for(const file of RUNTIME_FILES){const expected=execFileSync('git',['rev-parse',MAIN+':'+file],{encoding:'utf8'}).trim(),actual=execFileSync('git',['hash-object','--path='+file,file],{encoding:'utf8'}).trim();assert.equal(actual,expected,'authority-only runtime blob changed: '+file);}
console.log('V271_RUNTIME_IDENTITY_PASS 17/17 parent '+MAIN);
