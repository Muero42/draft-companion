'use strict';
/* Research-only v3 challenger.
   Goal: preserve player-quality ordering except in explicit late WR-saturation near-ties,
   while retaining the already-established QB2/TE2 opportunity-cost hurdle.
   No player-specific bonus/blacklist. No app/runtime/production mutation. */
const fs=require('fs'),crypto=require('crypto'),cp=require('child_process'),path=require('path');
const SRC='research/rc459_meta_safe_qbte_no_safety_resurrection_shard_2026.js';
const EXPECT='8827e0c83b4a55e5a38b5033d88d1effc8e8622b';
function gitBlob(s){const b=Buffer.from(s);return crypto.createHash('sha1').update(Buffer.from(`blob ${b.length}\0`)).update(b).digest('hex')}
const src0=fs.readFileSync(SRC,'utf8');if(gitBlob(src0)!==EXPECT)throw Error('BASE_SHARD_DRIFT '+gitBlob(src0));
let s=src0;
for(const [a,b] of [["shard<0||shard>5","shard<0||shard>11"],["PITTI_SHARD 0..5 required","PITTI_SHARD 0..11 required"],["const start=459710001+10*shard;","const start=459820001+10*shard;"],["RC459_META_SAFE_QBTE_NO_SAFETY_RESURRECTION_SHARD_${shard}_2026.json","RC463_ROSTER_CHAMPIONSHIP_V3_NEARTIE_SHARD_${shard}_2026.json"]]){if(!s.includes(a))throw Error('V3_SCALE_ANCHOR_DRIFT '+a);s=s.replace(a,b)}
const insertAnchor=`full=full.replace(feasibilityAnchor,"H.ok(c.QB>=1&&c.RB>=1&&c.WR>=2,'draft-end user-policy feasibility');");`;
if(s.split(insertAnchor).length!==2)throw Error('V3_INSERT_ANCHOR_DRIFT');
const inject=`${insertAnchor}\nconst decisionAnchor="C.normalizeCoachScores(scored);scored.sort((a,b)=>b.score-a.score||b.rawScore-a.rawScore||a.r.rank-b.r.rank);";\nif(full.split(decisionAnchor).length!==2)throw Error('V3_DECISION_PRIORITY_ANCHOR_DRIFT');\nconst decisionPatch=\`C.normalizeCoachScores(scored);for(const x of scored)x.__decisionPriorityV3=Number(x.score||0);const __counts=state.counts||{};if(pn>=100){for(const x of scored){const pos=String(x.p.pos||''),panel=Number(x.r.rank),slide=Number.isFinite(panel)?pn-panel:0;if(pos==='QB'&&Number(__counts.QB||0)>=1&&slide<35)x.__decisionPriorityV3-=32;if(pos==='TE'&&Number(__counts.TE||0)>=1&&slide<32)x.__decisionPriorityV3-=26;}}if(pn>=120&&Number(__counts.WR||0)>=6){const valid=scored.filter(x=>!x.hardExcluded&&!x.recommendationBlocked&&Number.isFinite(x.rawScore));const bestWR=valid.filter(x=>String(x.p.pos||'')==='WR').sort((a,b)=>b.rawScore-a.rawScore||a.r.rank-b.r.rank)[0];const bestRB=valid.filter(x=>String(x.p.pos||'')==='RB').sort((a,b)=>b.rawScore-a.rawScore||a.r.rank-b.r.rank)[0];if(bestWR&&bestRB){const gap=Number(bestWR.rawScore)-Number(bestRB.rawScore);const rbCount=Number(__counts.RB||0);if(gap>=0&&gap<=1.0&&rbCount<7)bestRB.__decisionPriorityV3=Math.max(bestRB.__decisionPriorityV3,bestWR.__decisionPriorityV3+0.01);}}scored.sort((a,b)=>b.__decisionPriorityV3-a.__decisionPriorityV3||b.score-a.score||b.rawScore-a.rawScore||a.r.rank-b.r.rank);\`;\nfull=full.replace(decisionAnchor,decisionPatch);`;
s=s.replace(insertAnchor,inject);
const marker="x.production_mutation=false;";if(s.split(marker).length!==2)throw Error('V3_OUTPUT_MARKER_ANCHOR_DRIFT');s=s.replace(marker,"x.production_mutation=false;x.rc463_roster_championship_v3_neartie=true;x.rc463_ab_seed_family='459820001..459820120';");
const shard=String(process.env.PITTI_SHARD??'');const tmp=path.join('/tmp',`pitti_rc463_roster_championship_v3_${shard}.js`);fs.writeFileSync(tmp,s);const r=cp.spawnSync(process.execPath,[tmp],{stdio:'inherit',env:process.env});if(r.error)throw r.error;process.exit(r.status??2);
