'use strict';
/* Dry-run source transform for the smallest rc4.63-derived repeat-QB/TE safety-resurrection fix.
   It does not write app.js unless --apply is explicitly supplied. Anchors are exact and fail closed. */
const fs=require('fs'),crypto=require('crypto'),cp=require('child_process');
const APP='app.js',EXPECTED_BLOB='f5260ca1eb1f67295d81b7181effbc8d25716fbb';
function gitBlob(s){const b=Buffer.from(s);return crypto.createHash('sha1').update(Buffer.from(`blob ${b.length}\0`)).update(b).digest('hex')}
const src=fs.readFileSync(APP,'utf8');if(gitBlob(src)!==EXPECTED_BLOB)throw Error('RC463_APP_DRIFT '+gitBlob(src));
let s=src;
function one(a,b,label){if(s.split(a).length!==2)throw Error(label+'_ANCHOR_COUNT '+(s.split(a).length-1));s=s.replace(a,b)}
one('function applyPlayerQualitySafetyGate(rows,current){',`function applyPlayerQualitySafetyGate(rows,current,state=null){`,'SAFETY_SIGNATURE');
one(`  const naturalLeader=valid.slice().sort((a,b)=>b.rawScore-a.rawScore||a.r.rank-b.r.rank)[0];\n  const bestPanelRank=Math.min(...valid.map(x=>x.r.rank));`,`  const naturalLeader=valid.slice().sort((a,b)=>b.rawScore-a.rawScore||a.r.rank-b.r.rank)[0];\n  // Minimal roster-aware safety-promotion eligibility. Repeat QB/TE remain on the normal\n  // scored board; only safety-only resurrection is restricted. Natural raw leaders and\n  // existing exceptional slides remain eligible. No position quota or player-name rule.\n  const promotionValid=state?.counts?valid.filter(x=>{\n    const pos=String(x?.p?.pos||''),n=Number(state.counts?.[pos]||0);\n    if(!((pos==='QB'||pos==='TE')&&n>=1))return true;\n    if(x===naturalLeader)return true;\n    const panel=Number(x?.r?.rank),slide=Number.isFinite(x?.a)?current-Number(x.a):0;\n    return pos==='QB'?(panel<=45&&slide>=35):(panel<=35&&slide>=30);\n  }):valid;\n  if(!promotionValid.length)return{triggered:false,reason:'no-safety-promotion-candidates'};\n  const bestPanelRank=Math.min(...promotionValid.map(x=>x.r.rank));`,'PROMOTION_POOL');
one('  const qualityBand=valid.filter(x=>x.r.rank<=qualityBandMax);','  const qualityBand=promotionValid.filter(x=>x.r.rank<=qualityBandMax);','QUALITY_BAND');
one('function assignResearchShadowScores(rows,current){','function assignResearchShadowScores(rows,current,state=null){','SHADOW_SIGNATURE');
one('  applyPlayerQualitySafetyGate(clones,current);normalizeCoachScores(clones);','  applyPlayerQualitySafetyGate(clones,current,state);normalizeCoachScores(clones);','SHADOW_GATE');
one('    assignResearchShadowScores(scored,current);','    assignResearchShadowScores(scored,current,state);','SHADOW_CALL');
one('    const valueSafety=applyPlayerQualitySafetyGate(scored,current);','    const valueSafety=applyPlayerQualitySafetyGate(scored,current,state);','PRIMARY_GATE');
one('      applyPlayerQualitySafetyGate(referenceBalanced,current);','      applyPlayerQualitySafetyGate(referenceBalanced,current,state);','BALANCED_GATE');
if((s.match(/applyPlayerQualitySafetyGate\(/g)||[]).length!==(src.match(/applyPlayerQualitySafetyGate\(/g)||[]).length)throw Error('CALL_COUNT_DRIFT');
if(!s.includes("pos==='QB'?(panel<=45&&slide>=35):(panel<=35&&slide>=30)"))throw Error('EXCEPTIONAL_SLIDE_MISSING');
if(s.includes('QB2 hard')||s.includes('TE2 hard'))throw Error('HARD_GUARD_MARKER');
const out='/tmp/rc464_minimal_safety_app.js';fs.writeFileSync(out,s);const ck=cp.spawnSync(process.execPath,['--check',out],{encoding:'utf8'});if(ck.status!==0)throw Error('TRANSFORMED_SYNTAX '+ck.stderr);
const changed=src===s?0:1;if(!changed)throw Error('NOOP');
console.log(JSON.stringify({status:'PASS',source_blob:EXPECTED_BLOB,transformed_blob:gitBlob(s),source_bytes:Buffer.byteLength(src),transformed_bytes:Buffer.byteLength(s),anchors:8,syntax:'PASS',hard_ban:false,player_name_rule:false,late_wr_policy_bundled:false,apply:process.argv.includes('--apply')},null,2));
if(process.argv.includes('--apply'))fs.writeFileSync(APP,s);
