'use strict';
/* Research-only rc4.63 pre-Safety threshold arm.
   Starts from the exact production-like Full-Safety baseline source, freezes Sleeper metadata from
   PITTI_META_SNAPSHOT, and changes only repeated-position QB/TE Safety resurrection. Natural
   leaders and the already-defined rosterExceptionPenalty elite-slide exception remain admissible.
   No production mutation; no Late-WR rule; no roster quota; no player-name rule. */
const fs=require('fs'),cp=require('child_process'),path=require('path'),crypto=require('crypto');
const BASE='research/rc463_full_safety_baseline_roster_120_shard_2026.js';
const BASE_BLOB='aac28c9b443b81705355728087acdc60912b86eb';
function gitBlob(s){const b=Buffer.from(s);return crypto.createHash('sha1').update(Buffer.from(`blob ${b.length}\0`)).update(b).digest('hex')}
const base0=fs.readFileSync(BASE,'utf8');if(gitBlob(base0)!==BASE_BLOB)throw Error('BASE_DRIFT '+gitBlob(base0));
const shard=Number(process.env.PITTI_SHARD),thr=Number(process.env.PITTI_SAFETY_GAP_THRESHOLD);
if(!Number.isInteger(shard)||shard<0||shard>11)throw Error('PITTI_SHARD 0..11 required');
if(![-15,0].includes(thr))throw Error('PITTI_SAFETY_GAP_THRESHOLD must be -15 or 0');
if(!process.env.PITTI_META_SNAPSHOT||!fs.existsSync(process.env.PITTI_META_SNAPSHOT))throw Error('PITTI_META_SNAPSHOT missing');
// Force the exact shared metadata snapshot instead of a mutable network fetch.
const shared="const j=JSON.parse(require('fs').readFileSync(process.env.PITTI_META_SNAPSHOT,'utf8'));";
const metaRe=/const res=await fetch\('https:\/\/api\.sleeper\.app\/v1\/players\/nfl',\{headers:\{'User-Agent':'PITTI-FullSafetyBaseline\/1\.0'\}\}\);if\(!res\.ok\)throw Error\('metadata fetch '\+res\.status\);const j=await res\.json\(\);/g;
if((base0.match(metaRe)||[]).length!==1)throw Error('METADATA_ANCHOR_DRIFT');
let src=base0.replace(metaRe,shared);
// Inject exactly one transformation into the generated full-draft source immediately before shard execution.
const shardAnchor="const shard=Number(process.env.PITTI_SHARD);";
if(src.split(shardAnchor).length!==2)throw Error('SHARD_ANCHOR_DRIFT');
const treatment=`\nconst __thr=Number(process.env.PITTI_SAFETY_GAP_THRESHOLD);\nconst __safetyAnchor='const safety=C.applyPlayerQualitySafetyGate(scored,pn);';\nif(full.split(__safetyAnchor).length!==2)throw Error('SAFETY_ANCHOR_DRIFT');\nfull=full.replace(__safetyAnchor,\`const __preSafetyRaw=new Map(scored.map(x=>[String(x.p.key),Number(x.rawScore)]));const __preValid=scored.filter(x=>x?.r&&Number.isFinite(x.r.rank)&&Number.isFinite(x.rawScore)&&!x.hardExcluded&&!x.recommendationBlocked);const __preNatural=__preValid.slice().sort((a,b)=>b.rawScore-a.rawScore||a.r.rank-b.r.rank)[0]||null;const __preBestSkill=__preValid.filter(x=>x.p.pos==='RB'||x.p.pos==='WR').sort((a,b)=>b.rawScore-a.rawScore||a.r.rank-b.r.rank)[0]||null;const safety=C.applyPlayerQualitySafetyGate(scored,pn);const __promoted=scored.find(x=>x.valueSafety?.promoted===true)||null;if(__promoted&&(__promoted.p.pos==='QB'||__promoted.p.pos==='TE')&&Number(state.counts?.[__promoted.p.pos]||0)>=1){const __orig=__preSafetyRaw.get(String(__promoted.p.key));const __gap=(Number.isFinite(__orig)&&__preBestSkill)?__orig-Number(__preBestSkill.rawScore):null;const __elite=__promoted.p.pos==='QB'?(__promoted.r.rank<=45&&Number.isFinite(__promoted.a)&&pn-__promoted.a>=35):(__promoted.r.rank<=35&&Number.isFinite(__promoted.a)&&pn-__promoted.a>=30);const __natural=!!(__preNatural&&String(__preNatural.p.key)===String(__promoted.p.key));if(!__natural&&!__elite&&Number.isFinite(__gap)&&__gap<__thr){__promoted.rawScore=__orig;__promoted.valueSafety={...__promoted.valueSafety,thresholdTreatmentSuppressed:true,preSafetyGapToBestSkill:__gap,treatmentThreshold:__thr};__promoted.reasons=(__promoted.reasons||[]).filter(r=>!String(r).startsWith('Value-Safety Gate:'));}}\`);\n`;
src=src.replace(shardAnchor,treatment+shardAnchor);
const tmp=path.join('/tmp',`pitti_rc463_threshold_${thr}_${shard}.js`);fs.writeFileSync(tmp,src);
const r=cp.spawnSync(process.execPath,[tmp],{stdio:'inherit',env:{...process.env,PITTI_SHARD:String(shard),PITTI_SAFETY_GAP_THRESHOLD:String(thr)}});if(r.error)throw r.error;if((r.status??2)!==0)process.exit(r.status??2);
const baselineOut=`simulation_2026/RC463_FULL_SAFETY_BASELINE_ROSTER_SHARD_${shard}_2026.json`;if(!fs.existsSync(baselineOut))throw Error('TREATMENT_OUTPUT_MISSING');
const x=JSON.parse(fs.readFileSync(baselineOut,'utf8'));if(x.status!=='PASS'||x.drafts?.length!==10)throw Error('TREATMENT_OUTPUT_INVALID');
x.rc463_presafety_threshold_treatment=true;x.threshold=thr;x.metadata_snapshot_sha256=crypto.createHash('sha256').update(fs.readFileSync(process.env.PITTI_META_SNAPSHOT)).digest('hex');x.safety_policy=`Full Safety except repeated-position QB/TE Safety resurrection requires original pre-Safety gap to best legal RB/WR >= ${thr}; natural leader and rosterExceptionPenalty elite-slide exception preserved`;x.production_mutation=false;
const dst=`simulation_2026/RC463_PRESAFETY_THRESHOLD_${thr===-15?'M15':'ZERO'}_SHARD_${shard}_2026.json`;fs.writeFileSync(dst,JSON.stringify(x));fs.unlinkSync(baselineOut);console.log(JSON.stringify({status:'PASS',threshold:thr,shard,output:dst,metadata_sha256:x.metadata_snapshot_sha256},null,2));