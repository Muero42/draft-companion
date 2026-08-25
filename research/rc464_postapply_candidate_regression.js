'use strict';
/* Post-apply verifier for the isolated rc4.64 candidate. It intentionally fails before
   app.js is transformed, and becomes eligible only after the gated apply workflow commits
   the exact locked transform. No runtime/package mutation. */
const fs=require('fs'),crypto=require('crypto'),cp=require('child_process'),assert=require('assert');
const APP='app.js',EXPECTED='241aafa02e407f2c8db4cfed0126796d167042dc';
function blob(s){const b=Buffer.from(s);return crypto.createHash('sha1').update(Buffer.from(`blob ${b.length}\0`)).update(b).digest('hex')}
const s=fs.readFileSync(APP,'utf8');if(blob(s)!==EXPECTED)throw Error('POSTAPPLY_APP_BLOB '+blob(s));
const chk=cp.spawnSync(process.execPath,['--check',APP],{encoding:'utf8'});if(chk.status!==0)throw Error(chk.stderr);
function ok(x,m){if(!x)throw Error('POSTAPPLY '+m)}
for(const x of [
 'function applyPlayerQualitySafetyGate(rows,current,state=null)',
 'const promotionValid=state?.counts?valid.filter',
 'const qualityBand=promotionValid.filter',
 'assignResearchShadowScores(scored,current,state);',
 'const valueSafety=applyPlayerQualitySafetyGate(scored,current,state);',
 'applyPlayerQualitySafetyGate(referenceBalanced,current,state);',
 'for(const x of valid)x.valueSafety={',
 "const LIVE_DRAFT_ID_2026='1366053132970233856'",
 "const USER_HARD_QB_EXCLUSIONS=new Set(['genosmith','aaronrodgers'])",
 'function normalCandidateAdmissible(row)',
 'function visibleCoachCandidates(rows)',
 'decisionFixtures','managerProfileHash','forecastResolution','chosenPlayer'
])ok(s.includes(x),'missing '+x);
for(const x of ['__decisionPriorityV3','__decisionPriorityV5','late_wr_neartie'])ok(!s.includes(x),'forbidden bundled marker '+x);
// The candidate must still identify itself as rc4.63 until a separately gated release/version
// synchronization step creates a true rc4.64 package. This prevents half-versioned artifacts.
ok(s.includes('v11.8.0-rc4.63'),'unexpected premature version mutation');
console.log(JSON.stringify({status:'PASS',app_blob:EXPECTED,syntax:'PASS',state_plumbing:true,valueSafety_all_valid:true,mock_live_markers:true,snapshot_markers:true,late_wr_policy_bundled:false,premature_version_mutation:false,production_mutation:false},null,2));
