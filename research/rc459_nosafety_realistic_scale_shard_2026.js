'use strict';
/* Research-only scale wrapper. It reuses the already validated no-safety-resurrection
   shard generator byte-for-byte except for a fresh 120-seed family and output name.
   No production/runtime source is modified. */
const fs=require('fs'),cp=require('child_process'),path=require('path');
const SRC='research/rc459_meta_safe_qbte_no_safety_resurrection_shard_2026.js';
let s=fs.readFileSync(SRC,'utf8');
const reps=[
  ["shard<0||shard>5","shard<0||shard>11"],
  ["PITTI_SHARD 0..5 required","PITTI_SHARD 0..11 required"],
  ["const start=459710001+10*shard;","const start=459820001+10*shard;"],
  ["RC459_META_SAFE_QBTE_NO_SAFETY_RESURRECTION_SHARD_${shard}_2026.json","RC459_NOSAFETY_REALISTIC_SCALE_SHARD_${shard}_2026.json"]
];
for(const [a,b] of reps){if(!s.includes(a))throw Error('SCALE_ANCHOR_DRIFT '+a);s=s.replace(a,b)}
const tmp=path.join('/tmp','pitti_nosafety_scale_'+String(process.env.PITTI_SHARD)+'.js');
fs.writeFileSync(tmp,s);
const r=cp.spawnSync(process.execPath,[tmp],{stdio:'inherit',env:process.env});
if(r.error)throw r.error;
process.exit(r.status??2);
