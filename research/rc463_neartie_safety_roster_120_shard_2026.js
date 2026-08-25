'use strict';
/* Research-only near-tie QB/TE PlayerQualitySafety challenger.
   Repeat QB/TE remains fully visible and may win naturally. Safety-only resurrection is
   allowed when already the natural pre-safety leader, under the existing elite-slide
   exception, or when rawScore is within 1.0 point of the best legal RB/WR. This preserves
   a narrow safety function for genuine near-ties while blocking large raw-score deficits
   such as the frozen natural pick-92 ordinary QB2 case. No late-WR patch, quota, hard ban,
   player-name rule, runtime or production mutation. */
const fs=require('fs'),crypto=require('crypto'),cp=require('child_process'),path=require('path');
const BASE='research/rc459_meta_safe_qbte_no_safety_resurrection_shard_2026.js';
const EXPECT='8827e0c83b4a55e5a38b5033d88d1effc8e8622b';
function gitBlob(s){const b=Buffer.from(s);return crypto.createHash('sha1').update(Buffer.from(`blob ${b.length}\0`)).update(b).digest('hex')}
const base0=fs.readFileSync(BASE,'utf8');if(gitBlob(base0)!==EXPECT)throw Error('BASE_DRIFT '+gitBlob(base0));
let s=base0;
const old="return x===naturalPreSafety||elite";
const neu="const bestSkill=preSafetyValid.filter(z=>['RB','WR'].includes(String(z.p.pos||''))).sort((a,b)=>b.rawScore-a.rawScore||a.r.rank-b.r.rank)[0];const nearTie=bestSkill&&Number(x.rawScore)>=Number(bestSkill.rawScore)-1.0;return x===naturalPreSafety||elite||nearTie";
if(s.split(old).length!==2)throw Error('NEARTIE_SAFETY_ANCHOR_DRIFT');s=s.replace(old,neu);
for(const [a,b] of [["shard<0||shard>5","shard<0||shard>11"],["PITTI_SHARD 0..5 required","PITTI_SHARD 0..11 required"],["const start=459710001+10*shard;","const start=459820001+10*shard;"],["RC459_META_SAFE_QBTE_NO_SAFETY_RESURRECTION_SHARD_${shard}_2026.json","RC463_NEARTIE_SAFETY_ROSTER_SHARD_${shard}_2026.json"]]){if(!s.includes(a))throw Error('SCALE_ANCHOR_DRIFT '+a);s=s.replace(a,b)}
const marker="x.production_mutation=false;";if(s.split(marker).length!==2)throw Error('OUTPUT_MARKER_DRIFT');s=s.replace(marker,"x.production_mutation=false;x.rc463_neartie_safety_roster_export=true;x.rc463_seed_family='459820001..459820120';x.qbte_repeat_policy='repeat QB/TE safety eligible if natural pre-safety leader, existing elite slide, or within 1.0 rawScore of best legal RB/WR';x.late_wr_patch_bundled=false;");
const shard=String(process.env.PITTI_SHARD??'');const tmp=path.join('/tmp',`pitti_rc463_neartie_safety_${shard}.js`);fs.writeFileSync(tmp,s);const r=cp.spawnSync(process.execPath,[tmp],{stdio:'inherit',env:process.env});if(r.error)throw r.error;process.exit(r.status??2);
