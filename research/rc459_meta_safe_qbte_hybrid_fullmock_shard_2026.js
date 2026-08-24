'use strict';
/* Research-only hybrid challenger on the metadata-safe rc4.59 full-draft harness.
   Goal: preserve rc4.60's late exceptional-value escape without allowing repeated QB/TE
   accumulation. QB2/TE2 is admissibility-gated before pick 121 (except truly fallen elite
   value), phase-penalized thereafter, and QB3/TE3 is always inadmissible. No production mutation. */
const fs=require('fs'),crypto=require('crypto'),cp=require('child_process'),path=require('path');
const POLICY='research/rc459_full_policy_paired_2026.js',FULL='research/rc459_realistic_fullmock_tier_audit_2026.js';
const POLICY_BLOB='5c313bb54538139145761c3885d29f480e138b45',FULL_BLOB='c1f26da2877f9b01e25ea4926c03c398e7878876';
function gitBlob(s){const b=Buffer.from(s);return crypto.createHash('sha1').update(Buffer.from(`blob ${b.length}\0`)).update(b).digest('hex')}
const policy0=fs.readFileSync(POLICY,'utf8'),full0=fs.readFileSync(FULL,'utf8');if(gitBlob(policy0)!==POLICY_BLOB)throw Error('POLICY_DRIFT '+gitBlob(policy0));if(gitBlob(full0)!==FULL_BLOB)throw Error('FULL_DRIFT '+gitBlob(full0));
const metaRe=/let meta=\{\};\s*async function loadMeta\(\)\{[\s\S]*?\}\s*function buildPlayers\(\)\{[\s\S]*?\}\s*function pmeta/;if((policy0.match(new RegExp(metaRe.source,'g'))||[]).length!==1)throw Error('META_ANCHOR_DRIFT');
const safeMeta=`let meta={};
async function loadMeta(){const res=await fetch('https://api.sleeper.app/v1/players/nfl',{headers:{'User-Agent':'PITTI-FullPolicy/1.0'}});if(!res.ok)throw Error('metadata fetch '+res.status);const j=await res.json();meta={};for(const [sid,p] of Object.entries(j||{})){const name=p.full_name||[p.first_name,p.last_name].filter(Boolean).join(' ');if(!name)continue;const nk=nrm(name),position=String(p.position||p.fantasy_positions?.[0]||'').toUpperCase(),rec={sleeperId:String(sid),team:String(p.team||'FA'),yearsExp:p.years_exp==null?null:+p.years_exp,injury:p.injury_status||null,bye:p.bye_week??null,searchRank:p.search_rank??null,position};if(position)(meta[nk+'|'+position]??=[]).push(rec)}}
function buildPlayers(){const out={};for(const x of raw.pool_rows){if(!['QB','RB','WR','TE'].includes(x.pos))continue;if(['jaydenhiggins','rickypearsall'].includes(nrm(x.name)))continue;const r=C.rankFor(x.name,x.pos);if(!r)continue;const matches=meta[nrm(x.name)+'|'+String(x.pos).toUpperCase()]||[];if(matches.length>1)throw Error('AMBIGUOUS_POSITION_METADATA '+x.name+' '+x.pos);const md=matches[0]||{};if(nrm(x.name)==='justinjefferson'&&String(x.pos).toUpperCase()==='WR'&&(md.position!=='WR'||md.team!=='MIN'||md.sleeperId!=='6794'))throw Error('JUSTIN_JEFFERSON_WR_METADATA_NOT_RESOLVED');out[String(x.key)]={key:String(x.key),id:String(x.key),name:x.name,pos:x.pos,team:md.team||'FA',yearsExp:md.yearsExp,injury:md.injury,bye:md.bye,searchRank:md.searchRank,panel:+r.rank,adp:Number.isFinite(x.adp)?+x.adp:+r.rank}}return out}
function pmeta`;
let policy=policy0.replace(metaRe,safeMeta);if(policy===policy0)throw Error('META_PATCH_NOOP');
const ctxAnchor='const C=context(), MAN=C.__MANAGER_PROFILE_DATA;';if(policy.split(ctxAnchor).length!==2)throw Error('CONTEXT_ANCHOR_DRIFT');
const override=`${ctxAnchor}
C.rosterExceptionPenalty=function(pos,state,current,rank,adp){
  if(pos==='QB'&&state.counts.QB>=1){const elite=rank<=45&&Number.isFinite(adp)&&current-adp>=35;if(current>=141)return elite?0:-8;if(current>=121)return elite?-4:-24;return elite?-8:-42;}
  if(pos==='TE'&&state.counts.TE>=1){const elite=rank<=35&&Number.isFinite(adp)&&current-adp>=30;if(current>=141)return elite?0:-10;if(current>=121)return elite?-5:-26;return elite?-7:-38;}
  return 0;
};`;
policy=policy.replace(ctxAnchor,override);
const scoreAnchor="let scored=ranked.map(p=>({p,...C.scoreCandidate(p,pn,next,state,ranked,'progressive')})).filter(x=>x.r),rv=null;";if(full0.split(scoreAnchor).length!==2)throw Error('SCORE_ANCHOR_DRIFT');
const hybrid=`let scored=ranked.map(p=>({p,...C.scoreCandidate(p,pn,next,state,ranked,'progressive')})).filter(x=>x.r);\n  scored=scored.filter(x=>{const n=Number(state.counts?.[x.p.pos]||0);if(x.p.pos==='QB'){if(n>=2)return false;if(n>=1&&pn<121)return x.r.rank<=45&&Number.isFinite(x.a)&&pn-x.a>=35;}if(x.p.pos==='TE'){if(n>=2)return false;if(n>=1&&pn<121)return x.r.rank<=35&&Number.isFinite(x.a)&&pn-x.a>=30;}return true});\n  let rv=null;`;
let full=full0.replace(scoreAnchor,hybrid);
const shard=Number(process.env.PITTI_SHARD);if(!Number.isInteger(shard)||shard<0||shard>5)throw Error('PITTI_SHARD 0..5 required');const seedAnchor="const seeds=Array.from({length:60},(_,i)=>459710001+i),drafts=[];";if(full.split(seedAnchor).length!==2)throw Error('SEED_ANCHOR_DRIFT');const start=459710001+10*shard;full=full.replace(seedAnchor,`const seeds=Array.from({length:10},(_,i)=>${start}+i),drafts=[];`);
fs.writeFileSync(POLICY,policy);const tmp=path.join('/tmp',`pitti_meta_safe_qbte_hybrid_${shard}.js`);fs.writeFileSync(tmp,full);let status=2;
try{const r=cp.spawnSync(process.execPath,[tmp],{stdio:'inherit',env:process.env});if(r.error)throw r.error;status=r.status??2;if(status===0){const src='simulation_2026/RC459_REALISTIC_FULLMOCK_TIER_AUDIT_2026.json';if(!fs.existsSync(src))throw Error('OUTPUT_MISSING');const x=JSON.parse(fs.readFileSync(src,'utf8'));if(x.status!=='PASS'||x.seeds!==10||x.drafts?.length!==10)throw Error('OUTPUT_INVALID');const expected=Array.from({length:10},(_,i)=>start+i);if(JSON.stringify(x.drafts.map(d=>d.seed))!==JSON.stringify(expected))throw Error('SEED_MISMATCH');for(const d of x.drafts){const c=d.position_counts||{};if((c.QB||0)>2||(c.TE||0)>2)throw Error('CAP_INVARIANT '+d.seed+' '+JSON.stringify(c));}x.metadata_mapping='normalized-name + position, unique-match fail-closed';x.metadata_collision_source_bug_quarantined=true;x.qbte_repeat_policy='hybrid: pre-121 QB2/TE2 admissibility gate + phase penalty later + hard QB3/TE3 cap';x.production_mutation=false;const dst=`simulation_2026/RC459_META_SAFE_QBTE_HYBRID_SHARD_${shard}_2026.json`;fs.renameSync(src,dst);fs.writeFileSync(dst,JSON.stringify(x));console.log(JSON.stringify({status:'PASS',shard,start,end:start+9,output:dst},null,2))}}finally{fs.writeFileSync(POLICY,policy0)}
if(status!==0)process.exit(status);
