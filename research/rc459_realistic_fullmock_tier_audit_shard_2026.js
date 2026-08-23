'use strict';
/* Research-only sharding wrapper for rc459_realistic_fullmock_tier_audit_2026.js.
   Does not change Coach/opponent/tier logic. It only replaces the fixed 60-seed range
   with a deterministic 10-seed slice so the same 60 seeds can run as six independent jobs. */
const fs=require('fs'),crypto=require('crypto'),cp=require('child_process'),path=require('path');
const SRC='research/rc459_realistic_fullmock_tier_audit_2026.js';
const EXPECT_BLOB='c1f26da2877f9b01e25ea4926c03c398e7878876';
const raw=fs.readFileSync(SRC,'utf8'),buf=Buffer.from(raw);
const blob=crypto.createHash('sha1').update(Buffer.from(`blob ${buf.length}\0`)).update(buf).digest('hex');
if(blob!==EXPECT_BLOB)throw Error('FULLMOCK_SOURCE_DRIFT '+blob);
const shard=Number(process.env.PITTI_SHARD);
if(!Number.isInteger(shard)||shard<0||shard>5)throw Error('PITTI_SHARD must be integer 0..5');
const anchor="const seeds=Array.from({length:60},(_,i)=>459710001+i),drafts=[];";
if(raw.split(anchor).length!==2)throw Error('SEED_ANCHOR_DRIFT');
const start=459710001+10*shard;
const replacement=`const seeds=Array.from({length:10},(_,i)=>${start}+i),drafts=[];`;
const tmp=path.join('/tmp',`pitti_fullmock_shard_${shard}.js`);
fs.writeFileSync(tmp,raw.replace(anchor,replacement));
const r=cp.spawnSync(process.execPath,[tmp],{stdio:'inherit',env:process.env});
if(r.error)throw r.error;
if(r.status!==0)process.exit(r.status||2);
const src='simulation_2026/RC459_REALISTIC_FULLMOCK_TIER_AUDIT_2026.json';
if(!fs.existsSync(src))throw Error('SHARD_OUTPUT_MISSING');
const x=JSON.parse(fs.readFileSync(src,'utf8'));
if(x.status!=='PASS'||x.seeds!==10||x.drafts?.length!==10)throw Error('SHARD_OUTPUT_INVALID');
const expected=Array.from({length:10},(_,i)=>start+i);
if(JSON.stringify(x.drafts.map(d=>d.seed))!==JSON.stringify(expected))throw Error('SHARD_SEED_MISMATCH');
const dst=`simulation_2026/RC459_REALISTIC_FULLMOCK_TIER_AUDIT_SHARD_${shard}_2026.json`;
fs.renameSync(src,dst);
console.log(JSON.stringify({status:'PASS',shard,start,end:start+9,output:dst},null,2));
