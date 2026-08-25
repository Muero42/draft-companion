'use strict';
/* Research-only A/B challenger.
   Starts from the already validated metadata-safe/no-safety-resurrection full-mock
   shard and adds ONLY the isolated rc4.63 final decision-priority layer.
   Same 120-seed family as the frozen baseline scale. No app/runtime mutation. */
const fs=require('fs'),crypto=require('crypto'),cp=require('child_process'),path=require('path');
const SRC='research/rc459_meta_safe_qbte_no_safety_resurrection_shard_2026.js';
const EXPECT='8827e0c83b4a55e5a38b5033d88d1effc8e8622b';
function gitBlob(s){const b=Buffer.from(s);return crypto.createHash('sha1').update(Buffer.from(`blob ${b.length}\0`)).update(b).digest('hex')}
const src0=fs.readFileSync(SRC,'utf8');
if(gitBlob(src0)!==EXPECT)throw Error('BASE_SHARD_DRIFT '+gitBlob(src0));
let s=src0;

// Expand the validated 6x10 shard harness to the exact frozen 12x10 baseline seed family.
const reps=[
  ["shard<0||shard>5","shard<0||shard>11"],
  ["PITTI_SHARD 0..5 required","PITTI_SHARD 0..11 required"],
  ["const start=459710001+10*shard;","const start=459820001+10*shard;"],
  ["RC459_META_SAFE_QBTE_NO_SAFETY_RESURRECTION_SHARD_${shard}_2026.json","RC463_ROSTER_CHAMPIONSHIP_AB_SHARD_${shard}_2026.json"]
];
for(const [a,b] of reps){if(!s.includes(a))throw Error('AB_SCALE_ANCHOR_DRIFT '+a);s=s.replace(a,b)}

// Inject the challenger only after canonical Coach normalization and before final ordering.
const insertAnchor=`full=full.replace(feasibilityAnchor,"H.ok(c.QB>=1&&c.RB>=1&&c.WR>=2,'draft-end user-policy feasibility');");`;
if(s.split(insertAnchor).length!==2)throw Error('AB_INSERT_ANCHOR_DRIFT');
const inject=`${insertAnchor}\nconst decisionAnchor="C.normalizeCoachScores(scored);scored.sort((a,b)=>b.score-a.score||b.rawScore-a.rawScore||a.r.rank-b.r.rank);";\nif(full.split(decisionAnchor).length!==2)throw Error('DECISION_PRIORITY_ANCHOR_DRIFT');\nconst decisionPatch=\`C.normalizeCoachScores(scored);const __dpClamp=(v,min,max)=>Math.max(min,Math.min(max,v)),__dpFade=(slide,start,end)=>__dpClamp((slide-start)/(end-start),0,1);for(const x of scored){const pos=String(x.p.pos||''),panel=Number(x.r.rank),slide=Number.isFinite(panel)?pn-panel:0,p=Number(x.ret),counts=state.counts||{};let q=Number(x.score||0);if(Number.isFinite(p))q+=12*(1-__dpClamp(p,0,1));if(pos==='QB'&&Number(counts.QB||0)>=1)q-=35*(1-__dpFade(slide,20,45));if(pos==='TE'&&Number(counts.TE||0)>=1)q-=28*(1-__dpFade(slide,20,45));if(pos==='WR'&&Number(counts.WR||0)>=6)q-=32*(1-__dpFade(slide,25,45));if(pos==='RB'&&pn>=100&&Number(counts.RB||0)<6)q+=8*Math.max(0,(6-Number(counts.RB||0))/3);if(pos==='RB'&&Number(counts.RB||0)>=6)q-=10*(Number(counts.RB||0)-5)*(1-__dpFade(slide,25,45));x.__decisionPriority=q}scored.sort((a,b)=>b.__decisionPriority-a.__decisionPriority||b.score-a.score||b.rawScore-a.rawScore||a.r.rank-b.r.rank);\`;\nfull=full.replace(decisionAnchor,decisionPatch);`;
s=s.replace(insertAnchor,inject);

// Mark the output so aggregate evaluation cannot confuse challenger with baseline.
const marker="x.production_mutation=false;";
if(s.split(marker).length!==2)throw Error('OUTPUT_MARKER_ANCHOR_DRIFT');
s=s.replace(marker,"x.production_mutation=false;x.rc463_roster_championship_decision_priority=true;x.rc463_ab_seed_family='459820001..459820120';");

const shard=String(process.env.PITTI_SHARD??'');
const tmp=path.join('/tmp',`pitti_rc463_roster_championship_ab_${shard}.js`);
fs.writeFileSync(tmp,s);
const r=cp.spawnSync(process.execPath,[tmp],{stdio:'inherit',env:process.env});
if(r.error)throw r.error;
process.exit(r.status??2);
