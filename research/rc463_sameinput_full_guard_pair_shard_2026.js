'use strict';
/* Research-only: regenerate full-safety and minimal-guard rosters from ONE immutable Sleeper metadata snapshot. */
const fs=require('fs'),cp=require('child_process'),path=require('path'),crypto=require('crypto');
const FULLW='research/rc463_full_safety_baseline_roster_120_shard_2026.js',MINW='research/rc463_baseline_roster_120_shard_2026.js',MINS='research/rc459_meta_safe_qbte_no_safety_resurrection_shard_2026.js';
const FULLW_BLOB='aac28c9b443b81705355728087acdc60912b86eb',MINW_BLOB='6d005b798ec3bc31e5356734fc727c3fbbd51862',MINS_BLOB='8827e0c83b4a55e5a38b5033d88d1effc8e8622b';
function blob(s){const b=Buffer.from(s);return crypto.createHash('sha1').update(Buffer.from(`blob ${b.length}\0`)).update(b).digest('hex')}
const fw0=fs.readFileSync(FULLW,'utf8'),mw0=fs.readFileSync(MINW,'utf8'),ms0=fs.readFileSync(MINS,'utf8');if(blob(fw0)!==FULLW_BLOB||blob(mw0)!==MINW_BLOB||blob(ms0)!==MINS_BLOB)throw Error('SOURCE_DRIFT');
const shard=Number(process.env.PITTI_SHARD);if(!Number.isInteger(shard)||shard<0||shard>11)throw Error('PITTI_SHARD');
const shared="const j=JSON.parse(require('fs').readFileSync(process.env.PITTI_META_SNAPSHOT,'utf8'));";
function inject(src){const re=/const res=await fetch\('https:\/\/api\.sleeper\.app\/v1\/players\/nfl',\{headers:\{'User-Agent':'PITTI-(?:FullSafetyBaseline|FullPolicy)\/1\.0'\}\}\);if\(!res\.ok\)throw Error\('metadata fetch '\+res\.status\);const j=await res\.json\(\);/g;const m=src.match(re)||[];if(m.length!==1)throw Error('META_ANCHOR '+m.length);return src.replace(re,shared)}
function runFile(src,label){const f=path.join('/tmp',`${label}_${shard}.js`);fs.writeFileSync(f,src);const r=cp.spawnSync(process.execPath,[f],{stdio:'inherit',env:{...process.env,PITTI_SHARD:String(shard)}});if(r.error)throw r.error;if((r.status??2)!==0)throw Error(label+'_FAIL '+r.status)}
// Full-safety wrapper contains its safe metadata block directly.
runFile(inject(fw0),'sameinput_full');
// Minimal wrapper hashes its underlying source. Patch that source to the same disk snapshot and adjust only the wrapper's expected research blob in /tmp.
const ms=inject(ms0),newBlob=blob(ms);let mw=mw0.replace(MINS_BLOB,newBlob);if(mw===mw0)throw Error('MIN_WRAPPER_EXPECT_ANCHOR');
try{fs.writeFileSync(MINS,ms);runFile(mw,'sameinput_guard')}finally{fs.writeFileSync(MINS,ms0)}
const fp=`simulation_2026/RC463_FULL_SAFETY_BASELINE_ROSTER_SHARD_${shard}_2026.json`,gp=`simulation_2026/RC463_BASELINE_ROSTER_SHARD_${shard}_2026.json`;if(!fs.existsSync(fp)||!fs.existsSync(gp))throw Error('OUTPUT_MISSING');
const f=JSON.parse(fs.readFileSync(fp)),g=JSON.parse(fs.readFileSync(gp));if(f.drafts?.length!==10||g.drafts?.length!==10)throw Error('OUTPUT_INVALID');for(let i=0;i<10;i++)if(f.drafts[i].seed!==g.drafts[i].seed)throw Error('SEED_PAIR_DRIFT');
const mb=fs.readFileSync(process.env.PITTI_META_SNAPSHOT),meta=JSON.parse(mb),pw=Object.entries(meta).find(([,p])=>(p?.full_name||'').toLowerCase()==='parker washington');
const manifest={schema:1,status:'PASS',research_only:true,production_mutation:false,shard,seed_start:459820001+10*shard,seed_end:459820010+10*shard,metadata_snapshot_sha256:crypto.createHash('sha256').update(mb).digest('hex'),parker_washington_snapshot:pw?{sleeper_id:pw[0],injury_status:pw[1].injury_status??null,years_exp:pw[1].years_exp??null}:null,full_roster_file:fp,guard_roster_file:gp};fs.writeFileSync(`simulation_2026/RC463_SAMEINPUT_FULL_GUARD_MANIFEST_${shard}_2026.json`,JSON.stringify(manifest));console.log(JSON.stringify(manifest,null,2));
