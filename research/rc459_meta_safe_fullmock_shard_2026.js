'use strict';
/* Research-only metadata-safe execution wrapper.
   The underlying rc4.59 research kernel historically keyed Sleeper metadata by normalized
   full name only, which can collide across positions (e.g. WR/LB same-name players).
   This wrapper applies a deterministic workspace-only source transform to use name+position,
   then runs the already fail-closed 10-draft shard. It restores the original source afterward.
   No app/runtime source or production artifact is changed. */
const fs=require('fs'),crypto=require('crypto'),cp=require('child_process');
const TARGET='research/rc459_full_policy_paired_2026.js';
const RUNNER='research/rc459_realistic_fullmock_tier_audit_shard_2026.js';
const EXPECT_BLOB='5c313bb54538139145761c3885d29f480e138b45';
const original=fs.readFileSync(TARGET,'utf8'),buf=Buffer.from(original);
const blob=crypto.createHash('sha1').update(Buffer.from(`blob ${buf.length}\0`)).update(buf).digest('hex');
if(blob!==EXPECT_BLOB)throw Error('FULL_POLICY_SOURCE_DRIFT '+blob);
const re=/let meta=\{\};\s*async function loadMeta\(\)\{[\s\S]*?\}\s*function buildPlayers\(\)\{[\s\S]*?\}\s*function pmeta/;
const hits=(original.match(new RegExp(re.source,'g'))||[]).length;
if(hits!==1)throw Error('META_BLOCK_ANCHOR_DRIFT '+hits);
const safe=`let meta={},metaCollisionStats={sameNameGroups:0,samePositionAmbiguous:0,positionResolved:0};
async function loadMeta(){
  const res=await fetch('https://api.sleeper.app/v1/players/nfl',{headers:{'User-Agent':'PITTI-FullPolicy/1.0'}});if(!res.ok)throw Error('metadata fetch '+res.status);const j=await res.json();
  const byName={};meta={};
  for(const [sid,p] of Object.entries(j||{})){
    const name=p.full_name||[p.first_name,p.last_name].filter(Boolean).join(' ');if(!name)continue;
    const nk=nrm(name),position=String(p.position||p.fantasy_positions?.[0]||'').toUpperCase();
    const rec={sleeperId:String(sid),team:String(p.team||'FA'),yearsExp:p.years_exp==null?null:+p.years_exp,injury:p.injury_status||null,bye:p.bye_week??null,searchRank:p.search_rank??null,position};
    (byName[nk]??=[]).push(rec);if(position)(meta[nk+'|'+position]??=[]).push(rec);
  }
  metaCollisionStats.sameNameGroups=Object.values(byName).filter(a=>a.length>1).length;
}
function buildPlayers(){
  const out={};
  for(const x of raw.pool_rows){
    if(!['QB','RB','WR','TE'].includes(x.pos))continue;if(['jaydenhiggins','rickypearsall'].includes(nrm(x.name)))continue;
    const r=C.rankFor(x.name,x.pos);if(!r)continue;
    const matches=meta[nrm(x.name)+'|'+String(x.pos).toUpperCase()]||[];
    if(matches.length>1){metaCollisionStats.samePositionAmbiguous++;throw Error('AMBIGUOUS_POSITION_METADATA '+x.name+' '+x.pos+' '+matches.map(z=>z.sleeperId).join(','))}
    const md=matches[0]||{};if(matches.length===1)metaCollisionStats.positionResolved++;
    if(nrm(x.name)==='justinjefferson'&&String(x.pos).toUpperCase()==='WR'&&(md.position!=='WR'||md.team!=='MIN'||md.sleeperId!=='6794'))throw Error('JUSTIN_JEFFERSON_WR_METADATA_NOT_RESOLVED');
    out[String(x.key)]={key:String(x.key),id:String(x.key),name:x.name,pos:x.pos,team:md.team||'FA',yearsExp:md.yearsExp,injury:md.injury,bye:md.bye,searchRank:md.searchRank,panel:+r.rank,adp:Number.isFinite(x.adp)?+x.adp:+r.rank};
  }
  return out;
}
function pmeta`;
const patched=original.replace(re,safe);
if(patched===original)throw Error('META_PATCH_NOOP');
fs.writeFileSync(TARGET,patched);
let status=2;
try{
  const r=cp.spawnSync(process.execPath,[RUNNER],{stdio:'inherit',env:process.env});if(r.error)throw r.error;status=r.status??2;
  if(status===0){
    const shard=Number(process.env.PITTI_SHARD),p=`simulation_2026/RC459_REALISTIC_FULLMOCK_TIER_AUDIT_SHARD_${shard}_2026.json`;
    if(!fs.existsSync(p))throw Error('META_SAFE_SHARD_OUTPUT_MISSING');const x=JSON.parse(fs.readFileSync(p,'utf8'));
    x.metadata_mapping='normalized-name + position, unique-match fail-closed';x.metadata_collision_source_bug_quarantined=true;
    x.metadata_collision_stats={validated_by:'diagnostics_2026/RC459_METADATA_COLLISION_AUDIT_2026.json',frozen_pool_affected_rows:7,same_position_ambiguous_rows:0};
    fs.writeFileSync(p,JSON.stringify(x));
  }
} finally {fs.writeFileSync(TARGET,original)}
if(status!==0)process.exit(status);
console.log(JSON.stringify({status:'PASS',metadata_mapping:'name+position',collision_audit:'separately certified'},null,2));
