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
const CARD3={
 QB:{rank:3,pos:'QB',name:'Patrick Mahomes',team:'KC',gp:15,ppr:314,rec:0,needle:'Patrick Mahomes KC 15 3,882 25 367 314'},
 RB:{rank:3,pos:'RB',name:"De'Von Achane",team:'MIA',gp:15,ppr:268,rec:56,needle:"De'Von Achane MIA 15 1,045 7 56 416 268"},
 WR:{rank:3,pos:'WR',name:'Puka Nacua',team:'LA',gp:15,ppr:288,rec:103,needle:'Puka Nacua LA 15 103 1,351 7 288'},
 TE:{rank:3,pos:'TE',name:'Kyle Pitts',team:'ATL',gp:16,ppr:158,rec:62,needle:'Kyle Pitts ATL 16 62 717 4 158'}
};
function makeRow(x){const half=x.ppr-.5*x.rec;return{rank:x.rank,pos:x.pos,name:x.name,team:x.team,gp:x.gp,ppr:x.ppr,rec:x.rec,half_ppr:+half.toFixed(3),half_ppr_per_game:+(half/Math.max(1,x.gp)).toFixed(4),range_ppr:null,responsive_card_fallback:true}}
function parse(html,pos){
  const txt=strip(html);if(!/zero betting or expert-ranking input/i.test(txt))throw Error(pos+' independence statement missing');
  const rows=[];for(const tr of html.match(/<tr\b[\s\S]*?<\/tr>/gi)||[]){const cells=(tr.match(/<td\b[\s\S]*?<\/td>/gi)||[]).map(strip);if(cells.length<7)continue;const rank=num(cells[0]);if(!Number.isFinite(rank))continue;const pl=parsePlayerCell(cells[1]),gp=num(cells[2]),ppr=num(cells[cells.length-2]);if(!pl.name||!Number.isFinite(gp)||!Number.isFinite(ppr))continue;let rec=0;if(pos==='RB')rec=num(cells[5])??0;else if(pos==='WR'||pos==='TE')rec=num(cells[3])??0;const half=ppr-.5*rec;rows.push({rank,pos,name:pl.name,team:pl.team,gp,ppr,rec,half_ppr:+half.toFixed(3),half_ppr_per_game:+(half/Math.max(1,gp)).toFixed(4),range_ppr:cells[cells.length-1],responsive_card_fallback:false})}
  const ranks=new Set(rows.map(x=>x.rank));if(!ranks.has(3)){const f=CARD3[pos];if(!txt.includes(f.needle))throw Error(`${pos} responsive rank-3 source needle changed`);rows.push(makeRow(f))}
  rows.sort((a,b)=>a.rank-b.rank);const seen=new Set();for(const r of rows){if(seen.has(r.rank))throw Error(`${pos} duplicate rank ${r.rank}`);seen.add(r.rank)}
  if(rows.length<(pos==='QB'?50:80))throw Error(`${pos} parsed only ${rows.length}`);if(!seen.has(1)||!seen.has(2)||!seen.has(3)||!seen.has(4))throw Error(pos+' top4 incomplete');return rows;
}
(async()=>{const all=[],pages={};for(const pos of POS){const u=URL(pos),r=await fetch(u,{headers:{'User-Agent':'PITTI-IndependentProjectionAudit/1.0'}});if(!r.ok)throw Error(pos+' HTTP '+r.status);const h=await r.text();pages[pos]={url:u,sha256:sha(h),bytes:Buffer.byteLength(h)};const rows=parse(h,pos);all.push(...rows);console.error(pos,rows.length)}const names=new Set(all.map(x=>x.pos+'|'+x.name.toLowerCase()));if(names.size!==all.length)throw Error('duplicate pos/name rows');const out={schema:2,status:'PASS',fetched_at:new Date().toISOString(),source:'NoPunt 2026 Player Stat Lines',source_claim:'pure model: multi-year usage x efficiency, empirical-Bayes position shrinkage, frozen age curve, games-played durability; zero betting or expert-ranking input',scoring_conversion:'Half-PPR central season projection = published PPR - 0.5 * published receptions; QB unchanged unless receiving receptions are listed (not used)',responsive_rank3_note:'Site renders rank 3 in a separate responsive card outside standard table rows. Four fail-closed source-needle-verified rank-3 rows are normalized into the freeze.',pages,counts:Object.fromEntries(POS.map(p=>[p,all.filter(x=>x.pos===p).length])),players:all};fs.mkdirSync('independent_2026',{recursive:true});fs.writeFileSync('independent_2026/NOPUNT_PURE_MODEL_HALF_PPR_2026.json',JSON.stringify(out,null,2));console.log(JSON.stringify({status:'PASS',counts:out.counts,total:all.length,rank3:POS.map(p=>all.find(x=>x.pos===p&&x.rank===3)?.name),pages},null,2))})().catch(e=>{console.error(e.stack||e);process.exit(2)});
