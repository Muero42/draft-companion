'use strict';
/* Research-only same-input parity harness.
   Root cause addressed: the old parity comparison paired an 11:xx UTC full-safety run with a
   15:xx UTC instrumented run while both independently fetched mutable Sleeper player metadata.
   A single workflow snapshot is now served locally to BOTH arms. The treatment is therefore
   instrumentation only. No production/runtime mutation. */
const fs=require('fs'),cp=require('child_process'),path=require('path'),crypto=require('crypto');
const BASE='research/rc463_full_safety_baseline_roster_120_shard_2026.js';
const INST='research/rc463_full_safety_presafety_instrumented_120_shard_2026.js';
const BASE_BLOB='aac28c9b443b81705355728087acdc60912b86eb';
const INST_BLOB='81a1c953404eaf405de7aaf7d1d9a35542866e25';
function gitBlob(s){const b=Buffer.from(s);return crypto.createHash('sha1').update(Buffer.from(`blob ${b.length}\0`)).update(b).digest('hex')}
const b0=fs.readFileSync(BASE,'utf8'),i0=fs.readFileSync(INST,'utf8');
if(gitBlob(b0)!==BASE_BLOB)throw Error('BASE_DRIFT '+gitBlob(b0));
if(gitBlob(i0)!==INST_BLOB)throw Error('INST_DRIFT '+gitBlob(i0));
const shard=Number(process.env.PITTI_SHARD);if(!Number.isInteger(shard)||shard<0||shard>11)throw Error('PITTI_SHARD 0..11 required');
const endpoint='https://api.sleeper.app/v1/players/nfl',local='http://127.0.0.1:8765/players.json';
function patched(src,label){if(src.split(endpoint).length!==2)throw Error(label+'_ENDPOINT_ANCHOR_DRIFT');return src.replace(endpoint,local)}
function run(src,label){const p=path.join('/tmp',`pitti_${label}_${shard}.js`);fs.writeFileSync(p,patched(src,label));const r=cp.spawnSync(process.execPath,[p],{stdio:'inherit',env:{...process.env,PITTI_SHARD:String(shard)}});if(r.error)throw r.error;if((r.status??2)!==0)throw Error(label+'_FAIL '+r.status)}
run(b0,'sameinput_base');
const baseSrc=`simulation_2026/RC463_FULL_SAFETY_BASELINE_ROSTER_SHARD_${shard}_2026.json`;if(!fs.existsSync(baseSrc))throw Error('BASE_OUTPUT_MISSING');const base=JSON.parse(fs.readFileSync(baseSrc));
run(i0,'sameinput_inst');
const instSrc=`simulation_2026/RC463_FULL_SAFETY_PRESAFETY_SHARD_${shard}_2026.json`;if(!fs.existsSync(instSrc))throw Error('INST_OUTPUT_MISSING');const inst=JSON.parse(fs.readFileSync(instSrc));
function decisionCore(d){const {pre_safety_audit,...z}=d;return z}
const rows=[];for(let j=0;j<10;j++){
 const a=base.drafts[j],b=inst.drafts[j];if(a.seed!==b.seed)throw Error('SEED_PAIR_DRIFT');
 const sameDec=JSON.stringify(a.decisions.map(decisionCore))===JSON.stringify(b.decisions.map(decisionCore));
 const sameRoster=JSON.stringify(a.user_roster)===JSON.stringify(b.user_roster);
 const sameFp=a.complete_fingerprint===b.complete_fingerprint;
 rows.push({seed:a.seed,same_decisions:sameDec,same_roster:sameRoster,same_fingerprint:sameFp,instrumented_decisions:b.decisions});
 if(!(sameDec&&sameRoster&&sameFp))throw Error('SAMEINPUT_INSTRUMENTATION_POLICY_DRIFT '+a.seed);
}
const meta=JSON.parse(fs.readFileSync(process.env.PITTI_META_SNAPSHOT||'/tmp/meta/players.json','utf8'));
const pw=Object.entries(meta).find(([,p])=>String(p?.full_name||'').toLowerCase()==='parker washington');
const out={schema:1,status:'PASS',research_only:true,production_mutation:false,shard,seed_start:459820001+10*shard,seed_end:459820010+10*shard,metadata_snapshot_sha256:crypto.createHash('sha256').update(fs.readFileSync(process.env.PITTI_META_SNAPSHOT||'/tmp/meta/players.json')).digest('hex'),parker_washington_snapshot:pw?{sleeper_id:pw[0],injury_status:pw[1]?.injury_status??null,years_exp:pw[1]?.years_exp??null,team:pw[1]?.team??null}:null,parity:'10/10 exact decision-core + roster + fingerprint',rows};
fs.mkdirSync('simulation_2026',{recursive:true});const dst=`simulation_2026/RC463_PRESAFETY_SAMEINPUT_PAIR_SHARD_${shard}_2026.json`;fs.writeFileSync(dst,JSON.stringify(out));console.log(JSON.stringify({status:'PASS',shard,metadata_sha256:out.metadata_snapshot_sha256,parker:out.parker_washington_snapshot,output:dst},null,2));
