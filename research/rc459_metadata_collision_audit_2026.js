'use strict';
/* Research-only audit for normalized-name metadata collisions in the rc4.59 research kernel.
   The legacy research harness indexes current Sleeper metadata by normalized full name only.
   This audit compares that behavior with position-aware matching against the frozen fantasy pool.
   No Companion/runtime policy is changed. Triggered as an isolated push audit. */
const fs=require('fs');
const RAW='freeze_2026/FRESH_2026_MARKET_PANEL_RAW.json';
const OUT='diagnostics_2026/RC459_METADATA_COLLISION_AUDIT_2026.json';
const nrm=s=>String(s||'').toLowerCase().replaceAll('’',"'").replaceAll('é','e').replaceAll('ö','o').replaceAll('ü','u').replaceAll('ä','a').replace(/\b(jr|sr|ii|iii|iv)\.?\b/g,'').replace(/[^a-z0-9]+/g,'');
const pos=p=>String(p?.position||p?.fantasy_positions?.[0]||'').toUpperCase();
function ok(x,m){if(!x)throw Error('META_COLLISION_AUDIT: '+m)}
(async()=>{
 const raw=JSON.parse(fs.readFileSync(RAW,'utf8'));ok(Array.isArray(raw.pool_rows)&&raw.pool_rows.length>=200,'frozen pool');
 const r=await fetch('https://api.sleeper.app/v1/players/nfl',{headers:{'User-Agent':'PITTI-Metadata-Collision-Audit/1.0'}});ok(r.ok,'Sleeper '+r.status);const all=await r.json();ok(Object.keys(all||{}).length>1000,'Sleeper universe');
 const groups=new Map(), legacy=new Map();
 for(const [id,p] of Object.entries(all)){
   const name=p.full_name||[p.first_name,p.last_name].filter(Boolean).join(' ');if(!name)continue;
   const k=nrm(name), rec={id:String(id),name,position:pos(p),team:String(p.team||'FA'),years_exp:p.years_exp==null?null:+p.years_exp,active:p.active??null,search_rank:p.search_rank??null,injury_status:p.injury_status??null};
   if(!groups.has(k))groups.set(k,[]);groups.get(k).push(rec);legacy.set(k,rec);
 }
 const duplicate_groups=[...groups.entries()].filter(([,v])=>v.length>1).map(([key,records])=>({key,records}));
 const affected=[];let ambiguousSamePos=0;
 for(const x of raw.pool_rows){
   if(!['QB','RB','WR','TE'].includes(String(x.pos).toUpperCase()))continue;
   const key=nrm(x.name), records=groups.get(key)||[], legacyRec=legacy.get(key)||null, matching=records.filter(z=>z.position===String(x.pos).toUpperCase());
   const exactUnique=matching.length===1?matching[0]:null;
   const collision=records.length>1;
   const legacyMismatch=!!(legacyRec&&exactUnique&&(legacyRec.id!==exactUnique.id||legacyRec.position!==exactUnique.position||legacyRec.team!==exactUnique.team||legacyRec.years_exp!==exactUnique.years_exp));
   const unresolved=matching.length!==1;
   if(matching.length>1)ambiguousSamePos++;
   if(collision||legacyMismatch||unresolved)affected.push({pool:{key:String(x.key),name:x.name,pos:String(x.pos).toUpperCase(),adp:x.adp??null},legacy:legacyRec,position_matches:matching,all_same_name:records,legacy_mismatch:legacyMismatch,position_match_count:matching.length,unresolved});
 }
 const jj=affected.find(x=>nrm(x.pool.name)==='justinjefferson'&&x.pool.pos==='WR')||null;
 ok(jj,'Justin Jefferson WR not represented in affected rows');
 ok(jj.all_same_name.some(z=>z.position==='LB'),'expected same-name LB collision missing');
 ok(jj.position_matches.length===1,'Justin Jefferson WR position-aware match not unique');
 const legacyWrongJJ=jj.legacy?.position!=='WR'||jj.legacy?.id!==jj.position_matches[0].id;
 const out={schema:1,status:'PASS',research_only:true,legacy_key:'normalized full name only; last Sleeper iteration wins',recommended_key:'normalized full name + fantasy position; fail closed when same-position match is not unique',sleeper_records:Object.keys(all).length,frozen_pool_rows:raw.pool_rows.length,duplicate_normalized_name_groups:duplicate_groups.length,affected_fantasy_pool_rows:affected.length,ambiguous_same_position_pool_rows:ambiguousSamePos,justin_jefferson_wr:{legacy_wrong:legacyWrongJJ,...jj},affected,duplicate_groups};
 fs.mkdirSync('diagnostics_2026',{recursive:true});fs.writeFileSync(OUT,JSON.stringify(out,null,2));
 console.log(JSON.stringify({status:'PASS',duplicate_groups:duplicate_groups.length,affected_pool_rows:affected.length,ambiguous_same_pos:ambiguousSamePos,justin_jefferson_legacy_wrong:legacyWrongJJ,jj_legacy:jj.legacy,jj_correct:jj.position_matches[0],output:OUT},null,2));
})().catch(e=>{console.error(e.stack||e);process.exit(2)});
