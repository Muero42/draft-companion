'use strict';
/* Research-only exact baseline roster exporter for the frozen 459820001..459820120 seed family.
   Uses the same metadata-safe no-safety-resurrection base as v3/v5, with no v3/v5 decision patch.
   Purpose: retain full rosters for independent paired Championship Utility. */
const fs=require('fs'),crypto=require('crypto'),cp=require('child_process'),path=require('path');
const SRC='research/rc459_meta_safe_qbte_no_safety_resurrection_shard_2026.js';
const EXPECT='8827e0c83b4a55e5a38b5033d88d1effc8e8622b';
function gitBlob(s){const b=Buffer.from(s);return crypto.createHash('sha1').update(Buffer.from(`blob ${b.length}\0`)).update(b).digest('hex')}
const src0=fs.readFileSync(SRC,'utf8');if(gitBlob(src0)!==EXPECT)throw Error('BASE_SHARD_DRIFT '+gitBlob(src0));
let s=src0;
for(const [a,b] of [["shard<0||shard>5","shard<0||shard>11"],["PITTI_SHARD 0..5 required","PITTI_SHARD 0..11 required"],["const start=459710001+10*shard;","const start=459820001+10*shard;"],["RC459_META_SAFE_QBTE_NO_SAFETY_RESURRECTION_SHARD_${shard}_2026.json","RC463_BASELINE_ROSTER_SHARD_${shard}_2026.json"]]){if(!s.includes(a))throw Error('BASELINE_120_ANCHOR_DRIFT '+a);s=s.replace(a,b)}
const marker="x.production_mutation=false;";if(s.split(marker).length!==2)throw Error('BASELINE_OUTPUT_MARKER_DRIFT');s=s.replace(marker,"x.production_mutation=false;x.rc463_baseline_roster_export=true;x.rc463_seed_family='459820001..459820120';");
const shard=String(process.env.PITTI_SHARD??'');const tmp=path.join('/tmp',`pitti_rc463_baseline_roster_${shard}.js`);fs.writeFileSync(tmp,s);const r=cp.spawnSync(process.execPath,[tmp],{stdio:'inherit',env:process.env});if(r.error)throw r.error;process.exit(r.status??2);
