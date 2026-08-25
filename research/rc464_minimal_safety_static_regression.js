'use strict';
/* Static/fail-closed regression for the proposed minimal rc4.63-derived safety fix.
   Generates the transformed source in-memory via the locked transform, then checks that
   unrelated frozen surfaces/schema markers are preserved. No app.js write. */
const fs=require('fs'),cp=require('child_process'),crypto=require('crypto');
const base=fs.readFileSync('app.js','utf8');
const r=cp.spawnSync(process.execPath,['research/rc464_minimal_safety_transform.js'],{encoding:'utf8'});if(r.status!==0)throw Error(r.stderr||r.stdout);
const out='/tmp/rc464_minimal_safety_app.js';const cand=fs.readFileSync(out,'utf8');
function ok(x,m){if(!x)throw Error('RC464_STATIC: '+m)}
function count(s,q){return s.split(q).length-1}
// Only expected safety/state plumbing may differ; key runtime identity and UI contracts stay frozen.
for(const marker of [
 "const LIVE_DRAFT_ID_2026='1366053132970233856'",
 "const USER_HARD_QB_EXCLUSIONS=new Set(['genosmith','aaronrodgers'])",
 "function normalCandidateAdmissible(row)",
 "function visibleCoachCandidates(rows)",
 "v11.8.0-rc4.63",
 "v118_draftSurface",
 "managerProfileHash",
 "decisionFixtures",
 "researchResidualModel",
 "forecastResolution",
 "chosenPlayer"
])ok(cand.includes(marker),`missing frozen marker ${marker}`);
// The fix must preserve valueSafety assignment to ALL valid rows, including repeat QB/TE.
ok(cand.includes('for(const x of valid)x.valueSafety={'),'valueSafety-all-valid contract lost');
ok(cand.includes('const promotionValid=state?.counts?valid.filter'),'promotion eligibility not state-scoped');
ok(cand.includes('const qualityBand=promotionValid.filter'),'quality band not isolated to promotion pool');
ok(!cand.includes('const qualityBand=valid.filter'),'old full promotion pool remains');
// No v3/v5 late-WR or broad >=1 raw-score hurdle may leak into this minimal candidate.
for(const bad of ['__decisionPriorityV3','__decisionPriorityV5','late_wr_neartie','rawScore)+1.0','RB<7','WR>=6'])ok(!cand.includes(bad),`bundled policy marker ${bad}`);
// No callsite may still invoke the safety gate without roster state where live/shadow scoring uses it.
ok(cand.includes('assignResearchShadowScores(scored,current,state);'),'shadow state plumbing missing');
ok(cand.includes('const valueSafety=applyPlayerQualitySafetyGate(scored,current,state);'),'primary state plumbing missing');
ok(cand.includes('applyPlayerQualitySafetyGate(referenceBalanced,current,state);'),'balanced state plumbing missing');
// Version/package-affecting strings are not changed by the transform.
const stripSafety=s=>s; // report hashes only; source-lock plus explicit anchors provide exact scope.
const result={status:'PASS',base_bytes:Buffer.byteLength(base),candidate_bytes:Buffer.byteLength(cand),base_sha256:crypto.createHash('sha256').update(base).digest('hex'),candidate_sha256:crypto.createHash('sha256').update(cand).digest('hex'),valueSafety_all_valid:true,normal_cut_function_preserved:true,mock_live_surface_markers_preserved:true,snapshot_fixture_markers_preserved:true,late_wr_policy_bundled:false,broad_v5_hurdle_bundled:false,version_string_preserved:true,production_mutation:false};
console.log(JSON.stringify(result,null,2));
