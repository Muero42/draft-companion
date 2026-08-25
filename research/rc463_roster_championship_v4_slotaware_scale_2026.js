'use strict';
/* Research-only v4 challenger.
   Encodes already-established policy: local turn sequencing, QB2/TE2 opportunity cost,
   WR saturation, and pre-Week-1 option value for the final roster slots.
   No player-specific bonus/blacklist. No app/runtime/production mutation. */
const fs=require('fs'),crypto=require('crypto'),cp=require('child_process'),path=require('path');
const SRC='research/rc459_meta_safe_qbte_no_safety_resurrection_shard_2026.js';
const EXPECT='8827e0c83b4a55e5a38b5033d88d1effc8e8622b';
function gitBlob(s){const b=Buffer.from(s);return crypto.createHash('sha1').update(Buffer.from(`blob ${b.length}\0`)).update(b).digest('hex')}
const src0=fs.readFileSync(SRC,'utf8');if(gitBlob(src0)!==EXPECT)throw Error('BASE_SHARD_DRIFT '+gitBlob(src0));
let s=src0;
for(const [a,b] of [["shard<0||shard>5","shard<0||shard>11"],["PITTI_SHARD 0..5 required","PITTI_SHARD 0..11 required"],["const start=459710001+10*shard;","const start=459820001+10*shard;"],["RC459_META_SAFE_QBTE_NO_SAFETY_RESURRECTION_SHARD_${shard}_2026.json","RC463_ROSTER_CHAMPIONSHIP_V4_SLOTAWARE_SHARD_${shard}_2026.json"]]){if(!s.includes(a))throw Error('V4_SCALE_ANCHOR_DRIFT '+a);s=s.replace(a,b)}
const insertAnchor=`full=full.replace(feasibilityAnchor,"H.ok(c.QB>=1&&c.RB>=1&&c.WR>=2,'draft-end user-policy feasibility');");`;
if(s.split(insertAnchor).length!==2)throw Error('V4_INSERT_ANCHOR_DRIFT');
const inject=`${insertAnchor}\nconst decisionAnchor="C.normalizeCoachScores(scored);scored.sort((a,b)=>b.score-a.score||b.rawScore-a.rawScore||a.r.rank-b.r.rank);";\nif(full.split(decisionAnchor).length!==2)throw Error('V4_DECISION_PRIORITY_ANCHOR_DRIFT');\nconst decisionPatch=\`C.normalizeCoachScores(scored);const __cl=(v,a,b)=>Math.max(a,Math.min(b,v)),__fade=(slide,a,b)=>__cl((slide-a)/(b-a),0,1),__counts=state.counts||{},__total=['QB','RB','WR','TE'].reduce((n,p)=>n+Number(__counts[p]||0),0);const __natural=scored.filter(x=>!x.hardExcluded&&!x.recommendationBlocked).slice().sort((a,b)=>b.score-a.score||b.rawScore-a.rawScore||a.r.rank-b.r.rank)[0];for(const x of scored){const pos=String(x.p.pos||''),panel=Number(x.r.rank),slide=Number.isFinite(panel)?pn-panel:0;let q=Number(x.score||0);if(pos==='QB'&&Number(__counts.QB||0)>=1)q-=35*(1-__fade(slide,20,45));if(pos==='TE'&&Number(__counts.TE||0)>=1)q-=28*(1-__fade(slide,20,45));if(pos==='WR'&&pn>=100&&Number(__counts.WR||0)>=6)q-=38*(1-__fade(slide,25,50));if(pos==='RB'&&pn>=100&&Number(__counts.RB||0)<6)q+=4*Math.max(0,(6-Number(__counts.RB||0))/3);if(pos==='RB'&&Number(__counts.RB||0)>=6&&__total<13)q-=8*(Number(__counts.RB||0)-5)*(1-__fade(slide,25,50));if(__natural&&Number(__natural.score)-Number(x.score)<=5&&Number.isFinite(__natural.ret)&&Number.isFinite(x.ret))q+=20*__cl(Number(__natural.ret)-Number(x.ret),-0.15,0.35);x.__decisionPriorityV4=q;}scored.sort((a,b)=>b.__decisionPriorityV4-a.__decisionPriorityV4||b.score-a.score||b.rawScore-a.rawScore||a.r.rank-b.r.rank);\`;\nfull=full.replace(decisionAnchor,decisionPatch);`;
s=s.replace(insertAnchor,inject);
const marker="x.production_mutation=false;";if(s.split(marker).length!==2)throw Error('V4_OUTPUT_MARKER_ANCHOR_DRIFT');s=s.replace(marker,"x.production_mutation=false;x.rc463_roster_championship_v4_slotaware=true;x.rc463_ab_seed_family='459820001..459820120';");
const shard=String(process.env.PITTI_SHARD??'');const tmp=path.join('/tmp',`pitti_rc463_roster_championship_v4_${shard}.js`);fs.writeFileSync(tmp,s);const r=cp.spawnSync(process.execPath,[tmp],{stdio:'inherit',env:process.env});if(r.error)throw r.error;process.exit(r.status??2);
