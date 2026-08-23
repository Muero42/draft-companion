'use strict';
/* Freeze an external 2026 projection challenger that explicitly states it uses no
   betting or expert-ranking input. Research-only; never used to tune the source model. */
const fs=require('fs'),crypto=require('crypto');
const POS=['QB','RB','WR','TE'];
const URL=p=>`https://www.nopunt.com/2026/players?pos=${p}`;
function strip(s){return String(s).replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/&#x27;|&#39;/g,"'").replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/\s+/g,' ').trim()}
function num(s){const x=+String(s).replace(/[^0-9.\-]/g,'');return Number.isFinite(x)?x:null}
function sha(s){return crypto.createHash('sha256').update(s).digest('hex')}
function parsePlayerCell(s){let t=strip(s).replace(/ᴿ/g,'').trim();const m=t.match(/^(.*)\s([A-Z]{2,3})$/);return m?{name:m[1].trim(),team:m[2]}:{name:t,team:null}}
function parse(html,pos){
  if(!/zero betting or expert-ranking input/i.test(strip(html)))throw Error(pos+' independence statement missing');
  const rows=[];for(const tr of html.match(/<tr\b[\s\S]*?<\/tr>/gi)||[]){const cells=(tr.match(/<td\b[\s\S]*?<\/td>/gi)||[]).map(strip);if(cells.length<7)continue;const rank=num(cells[0]);if(!Number.isFinite(rank))continue;const pl=parsePlayerCell(cells[1]),gp=num(cells[2]),ppr=num(cells[cells.length-2]);if(!pl.name||!Number.isFinite(gp)||!Number.isFinite(ppr))continue;let rec=0;if(pos==='RB')rec=num(cells[5])??0;else if(pos==='WR'||pos==='TE')rec=num(cells[3])??0;const half=ppr-.5*rec;rows.push({rank,pos,name:pl.name,team:pl.team,gp,ppr,rec,half_ppr:+half.toFixed(3),half_ppr_per_game:+(half/Math.max(1,gp)).toFixed(4),range_ppr:cells[cells.length-1]})}
  if(rows.length<(pos==='QB'?50:80))throw Error(`${pos} parsed only ${rows.length}`);return rows;
}
(async()=>{const all=[],pages={};for(const pos of POS){const u=URL(pos),r=await fetch(u,{headers:{'User-Agent':'PITTI-IndependentProjectionAudit/1.0'}});if(!r.ok)throw Error(pos+' HTTP '+r.status);const h=await r.text();pages[pos]={url:u,sha256:sha(h),bytes:Buffer.byteLength(h)};const rows=parse(h,pos);all.push(...rows);console.error(pos,rows.length)}const names=new Set(all.map(x=>x.pos+'|'+x.name.toLowerCase()));if(names.size!==all.length)throw Error('duplicate pos/name rows');const out={schema:1,status:'PASS',fetched_at:new Date().toISOString(),source:'NoPunt 2026 Player Stat Lines',source_claim:'pure model: multi-year usage x efficiency, empirical-Bayes position shrinkage, frozen age curve, games-played durability; zero betting or expert-ranking input',scoring_conversion:'Half-PPR central season projection = published PPR - 0.5 * published receptions; QB unchanged unless receiving receptions are listed (not used)',pages,counts:Object.fromEntries(POS.map(p=>[p,all.filter(x=>x.pos===p).length])),players:all};fs.mkdirSync('independent_2026',{recursive:true});fs.writeFileSync('independent_2026/NOPUNT_PURE_MODEL_HALF_PPR_2026.json',JSON.stringify(out,null,2));console.log(JSON.stringify({status:'PASS',counts:out.counts,total:all.length,pages},null,2))})().catch(e=>{console.error(e.stack||e);process.exit(2)});
