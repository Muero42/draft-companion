'use strict';
/* Research-only narrower QB/TE safety challenger.
   Preserve full safety for QB1/QB2 and TE1/TE2. Only a third-or-later QB/TE loses
   safety-only resurrection unless already the natural pre-safety leader or an existing
   elite-slide exception. This directly tests whether the hard n>=1 guard was too broad.
   No runtime/production mutation. */
const fs=require('fs'),crypto=require('crypto'),cp=require('child_process'),path=require('path');
const SRC='research/rc459_meta_safe_qbte_no_safety_resurrection_shard_2026.js';
const EXPECT='8827e0c83b4a55e5a38b5033d88d1effc8e8622b';
function gitBlob(s){const b=Buffer.from(s);return crypto.createHash('sha1').update(Buffer.from(`blob ${b.length}\0`)).update(b).digest('hex')}
const src0=fs.readFileSync(SRC,'utf8');if(gitBlob(src0)!==EXPECT)throw Error('SOURCE_DRIFT '+gitBlob(src0));
let s=src0;
const swaps=[
 ["(pos==='QB'||pos==='TE')&&n>=1","(pos==='QB'||pos==='TE')&&n>=2"],
 ["shard<0||shard>5","shard<0||shard>11"],
 ["PITTI_SHARD 0..5 required","PITTI_SHARD 0..11 required"],
 ["const start=459710001+10*shard;","const start=459820001+10*shard;"],
 ["RC459_META_SAFE_QBTE_NO_SAFETY_RESURRECTION_SHARD_${shard}_2026.json","RC463_TWO_DEEP_SAFETY_ROSTER_SHARD_${shard}_2026.json"],
 ["x.metadata_collision_source_bug_quarantined=true;x.qbte_repeat_policy='soft QB2/TE2 retained; no safety-only resurrection unless natural pre-safety leader or existing elite-slide exception';x.draft_end_feasibility","x.metadata_collision_source_bug_quarantined=true;x.rc463_two_deep_roster_export=true;x.rc463_seed_family='459820001..459820120';x.qbte_repeat_policy='full safety through QB2/TE2; third-or-later QB/TE cannot be safety-only resurrected unless natural pre-safety leader or existing elite-slide exception';x.draft_end_feasibility"]
];
for(const [a,b] of swaps){if(!s.includes(a))throw Error('ANCHOR_DRIFT '+a);s=s.replace(a,b)}
const shard=String(process.env.PITTI_SHARD??'');const tmp=path.join('/tmp',`pitti_rc463_two_deep_${shard}.js`);fs.writeFileSync(tmp,s);
const r=cp.spawnSync(process.execPath,[tmp],{stdio:'inherit',env:process.env});if(r.error)throw r.error;process.exit(r.status??2);
