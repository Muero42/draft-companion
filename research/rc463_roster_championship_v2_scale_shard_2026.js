'use strict';
/* Research-only v2 challenger: narrowly targets late roster construction.
   No app/runtime mutation. Removes v1 global return bonus and prevents early/mid-round effects. */
const fs=require('fs'),crypto=require('crypto'),cp=require('child_process'),path=require('path');
const SRC='research/rc459_meta_safe_qbte_no_safety_resurrection_shard_2026.js';
const EXPECT='8827e0c83b4a55e5a38b5033d88d1effc8e8622b';
function gitBlob(s){const b=Buffer.from(s);return crypto.createHash('sha1').update(Buffer.from(`blob ${b.length}\0`)).update(b).digest('hex')}
const src0=fs.readFileSync(SRC,'utf8');
if(gitBlob(src0)!==EXPECT)throw Error('BASE_SHARD_DRIFT '+gitBlob(src0));
let s=src0;
for(const [a,b] of [["shard<0||shard>5","shard<0||shard>11"],["PITTI_SHARD 0..5 required","PITTI_SHARD 0..11 required"],["const start=459710001+10*shard;","const start=459820001+10*shard;"],["RC459_META_SAFE_QBTE_NO_SAFETY_RESURRECTION_SHARD_${shard}_2026.json","RC463_ROSTER_CHAMPIONSHIP_V2_SHARD_${shard}_2026.json"]]){if(!s.includes(a))throw Error('V2_SCALE_ANCHOR_DRIFT '+a);s=s.replace(a,b)}
const insertAnchor=`full=full.replace(feasibilityAnchor,"H.ok(c.QB>=1&&c.RB>=1&&c.WR>=2,'draft-end user-policy feasibility');");`;
if(s.split(insertAnchor).length!==2)throw Error('V2_INSERT_ANCHOR_DRIFT');
const inject=`${insertAnchor}\nconst decisionAnchor="C.normalizeCoachScores(scored);scored.sort((a,b)=>b.score-a.score||b.rawScore-a.rawScore||a.r.rank-b.r.rank);";\nif(full.split(decisionAnchor).length!==2)throw Error('V2_DECISION_PRIORITY_ANCHOR_DRIFT');\nconst decisionPatch=\`C.normalizeCoachScores(scored);const __v2Clamp=(v,min,max)=>Math.max(min,Math.min(max,v)),__v2Fade=(slide,start,end)=>__v2Clamp((slide-start)/(end-start),0,1);for(const x of scored){const pos=String(x.p.pos||''),panel=Number(x.r.rank),slide=Number.isFinite(panel)?pn-panel:0,counts=state.counts||{};let q=Number(x.score||0);if(pn>=100){if(pos==='QB'&&Number(counts.QB||0)>=1)q-=35*(1-__v2Fade(slide,20,45));if(pos==='TE'&&Number(counts.TE||0)>=1)q-=28*(1-__v2Fade(slide,20,45));if(pn>=120&&pos==='WR'&&Number(counts.WR||0)>=6)q-=22*(1-__v2Fade(slide,25,45));if(pn>=120&&pos==='RB'&&Number(counts.RB||0)<6)q+=6*Math.max(0,(6-Number(counts.RB||0))/3);if(pn>=120&&pos==='RB'&&Number(counts.RB||0)>=6)q-=8*(Number(counts.RB||0)-5)*(1-__v2Fade(slide,25,45));}x.__decisionPriorityV2=q}scored.sort((a,b)=>b.__decisionPriorityV2-a.__decisionPriorityV2||b.score-a.score||b.rawScore-a.rawScore||a.r.rank-b.r.rank);\`;\nfull=full.replace(decisionAnchor,decisionPatch);`;
s=s.replace(insertAnchor,inject);
const marker="x.production_mutation=false;";
if(s.split(marker).length!==2)throw Error('V2_OUTPUT_MARKER_ANCHOR_DRIFT');
s=s.replace(marker,"x.production_mutation=false;x.rc463_roster_championship_v2=true;x.rc463_ab_seed_family='459820001..459820120';");
const shard=String(process.env.PITTI_SHARD??'');
const tmp=path.join('/tmp',`pitti_rc463_roster_championship_v2_${shard}.js`);
fs.writeFileSync(tmp,s);
const r=cp.spawnSync(process.execPath,[tmp],{stdio:'inherit',env:process.env});
if(r.error)throw r.error;
process.exit(r.status??2);
