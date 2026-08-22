'use strict';
/* Deterministic sharding wrapper for the exact rc4.59 paired full-policy harness.
   It does not alter model logic. It only offsets the pre-existing seed sequence so
   independent GitHub jobs can execute disjoint common-random-number pairs. */
const fs=require('fs'),cp=require('child_process'),crypto=require('crypto'),path=require('path');
const CORE='research/rc459_full_policy_paired_2026.js';
const EXPECTED_CORE_SHA='8d15f271e192fe8202968515858fdaeea9bdf8cd5f5f2e14e7ccf9343b0c5b5d';
const count=+(process.argv[2]||10),offset=+(process.argv[3]||0);
if(!Number.isInteger(count)||count<1||!Number.isInteger(offset)||offset<0)throw Error('invalid count/offset');
const src=fs.readFileSync(CORE,'utf8');
const actual=crypto.createHash('sha256').update(src).digest('hex');
// Fail closed if the core changes without re-auditing this lexical wrapper.
if(actual!==EXPECTED_CORE_SHA)throw Error(`core hash mismatch ${actual}`);
const needle="const seed=459260000+(stress==='stress'?1000000:0)+i;";
const hits=src.split(needle).length-1;if(hits!==1)throw Error(`seed expression matches ${hits}`);
const patched=src.replace(needle,`const seed=459260000+(stress==='stress'?1000000:0)+${offset}+i;`);
const tmp=path.join('/tmp',`rc459_full_policy_shard_${offset}.js`);
fs.writeFileSync(tmp,patched);
const r=cp.spawnSync(process.execPath,[tmp,String(count)],{cwd:process.cwd(),stdio:'inherit'});
if(r.status!==0)process.exit(r.status??2);
const canonical='policy_certification_2026/RC459_FULL_POLICY_PAIRED_DRAFTS_2026.json';
const x=JSON.parse(fs.readFileSync(canonical,'utf8'));
if(x.status!=='PASS'||x.runs_per_regime!==count||x.rows.length!==count*x.regimes.length*x.policies.length)throw Error('shard invariant failed');
x.seed_offset=offset;x.shard_run_count=count;
const out=`policy_certification_2026/RC459_FULL_POLICY_PAIRED_DRAFTS_2026_SHARD_${String(offset).padStart(2,'0')}.json`;
fs.writeFileSync(out,JSON.stringify(x));
fs.unlinkSync(canonical);
console.log(JSON.stringify({status:'PASS',offset,count,rows:x.rows.length,out},null,2));
