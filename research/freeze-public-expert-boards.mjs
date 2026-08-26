import fs from 'node:fs';
import crypto from 'node:crypto';

const OUT='expert-v2-public-freeze';
fs.mkdirSync(OUT,{recursive:true});
const UA='Mozilla/5.0 (compatible; PITTI-ExpertV2-Research/1.0)';
const decode=s=>String(s||'').replace(/&nbsp;/gi,' ').replace(/&amp;/gi,'&').replace(/&quot;/gi,'"').replace(/&#39;|&apos;/gi,"'").replace(/&ndash;|&#8211;/gi,'–').replace(/&mdash;|&#8212;/gi,'—').replace(/&#(\d+);/g,(_,n)=>String.fromCharCode(Number(n))).replace(/&#x([0-9a-f]+);/gi,(_,n)=>String.fromCharCode(parseInt(n,16)));
const strip=s=>decode(String(s||'').replace(/<script\b[\s\S]*?<\/script>/gi,' ').replace(/<style\b[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim();
const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'');
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
function tableRows(html){return [...html.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].map(m=>({html:m[1],cells:[...m[1].matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(x=>strip(x[1]))})).filter(x=>x.cells.length)}
function pos(text){const m=String(text||'').toUpperCase().match(/\b(QB|RB|WR|TE|K|DST)(?:\s*[-#]?\s*(\d+))?\b/);return m?{pos:m[1],posRank:m[2]?Number(m[2]):null}:null}
async function get(url){const r=await fetch(url,{headers:{accept:'text/html,application/xhtml+xml','user-agent':UA}});if(!r.ok)throw Error(`${url} HTTP ${r.status}`);const html=await r.text();return{url,html,status:r.status}}
function dateFrom(html){const p=strip(html);return p.match(/(?:Aug(?:ust)?\s+\d{1,2},\s+2026|2026-08-\d{2})/i)?.[0]||''}
function parseMariano(html){const out=[],seen=new Set();for(const r of tableRows(html)){if(r.cells.length<4)continue;const tier=Number(r.cells[0]),rank=Number(r.cells[1]),name=r.cells[2]?.trim(),pp=pos(r.cells[3]);if(!Number.isFinite(rank)||rank<1||rank>500||!name||!pp||!['QB','RB','WR','TE'].includes(pp.pos))continue;const k=norm(name);if(seen.has(k))continue;seen.add(k);out.push({key:k,name,pos:pp.pos,rank,tier:Number.isFinite(tier)&&tier>0?tier:null})}return out.sort((a,b)=>a.rank-b.rank)}
function jsonCandidates(html){const out=[];for(const m of html.matchAll(/<script[^>]*type=["']application\/json["'][^>]*>([\s\S]*?)<\/script>/gi)){try{out.push(JSON.parse(decode(m[1])))}catch{}}for(const m of html.matchAll(/<script[^>]*id=["']__NEXT_DATA__["'][^>]*>([\s\S]*?)<\/script>/gi)){try{out.push(JSON.parse(decode(m[1])))}catch{}}return out}
function walk(v,fn,d=0){if(d>12||v==null)return;if(Array.isArray(v)){for(const x of v)walk(x,fn,d+1);return}if(typeof v==='object'){fn(v);for(const x of Object.values(v))walk(x,fn,d+1)}}
function parseDSJson(html){const rows=[];for(const root of jsonCandidates(html)){walk(root,o=>{const name=o.player_name||o.playerName||o.full_name||o.fullName||o.name;const rank=Number(o.rank??o.overall_rank??o.overallRank??o.rank_order??o.rankOrder);const p=String(o.position||o.pos||o.player_position||o.playerPosition||'').toUpperCase();if(name&&Number.isFinite(rank)&&rank>0&&rank<500&&['QB','RB','WR','TE','K','DST'].includes(p))rows.push({key:norm(name),name:String(name),pos:p,rank,tier:Number(o.tier)>0?Number(o.tier):null})})}const map=new Map();for(const r of rows){const old=map.get(r.key);if(!old||r.rank<old.rank)map.set(r.key,r)}return [...map.values()].sort((a,b)=>a.rank-b.rank)}
function parseDSHtml(html){const out=[],seen=new Set();for(const r of tableRows(html)){const rank=Number(String(r.cells[0]||'').match(/^\s*(\d{1,3})\b/)?.[1]);if(!Number.isFinite(rank)||rank<1||rank>500)continue;let name='';for(const a of r.html.matchAll(/<a\b[^>]*(?:href=["'][^"']*(?:player|players)[^"']*["'])[^>]*>([\s\S]*?)<\/a>/gi)){const t=strip(a[1]);if(/[A-Za-z]/.test(t)&&!/^([A-Z]{2,3}|\d+)$/.test(t)){name=t;break}}if(!name){for(const attr of r.html.matchAll(/(?:data-player-name|aria-label|title)=["']([^"']+)["']/gi)){const t=strip(attr[1]);if(t.length>3&&/[A-Za-z]/.test(t)){name=t;break}}}let pp=null;for(const c of r.cells){pp=pos(c);if(pp)break}if(name&&pp&&!seen.has(norm(name))){seen.add(norm(name));out.push({key:norm(name),name,pos:pp.pos,rank,tier:null})}}return out.sort((a,b)=>a.rank-b.rank)}
function parseDS(html){const a=parseDSJson(html),b=parseDSHtml(html);return a.length>=b.length?a:b}
function validate(rows,name,min){if(rows.length<min)throw Error(`${name}: only ${rows.length} draftable rows`);if(new Set(rows.map(x=>x.key)).size!==rows.length)throw Error(`${name}: duplicate players`);if(rows.some(x=>!Number.isFinite(x.rank)||x.rank<=0))throw Error(`${name}: invalid rank`)}
const sources=[
 {id:'mariano',name:'Nick Mariano',site:'RotoBaller',url:'https://www.rotoballer.com/updated-top-400-half-ppr-fantasy-football-rankings-2026/1916255',parse:parseMariano,min:180},
 {id:'draftsharks',name:'Draft Sharks Team',site:'Draft Sharks',url:'https://www.draftsharks.com/rankings/half-ppr',parse:parseDS,min:80}
];
const manifest={schema:'pitti-expert-v2-public-freeze-v1',createdAt:new Date().toISOString(),season:2026,scoring:'HALF',type:'DRAFT',league:'1QB',sources:[]};
for(const s of sources){const {html}=await get(s.url);fs.writeFileSync(`${OUT}/${s.id}.raw.html`,html);const rows=s.parse(html).filter(x=>['QB','RB','WR','TE'].includes(x.pos));let error=null;try{validate(rows,s.name,s.min)}catch(e){error=e.message}fs.writeFileSync(`${OUT}/${s.id}.json`,JSON.stringify({name:s.name,site:s.site,url:s.url,sourceDate:dateFrom(html),rows},null,2));manifest.sources.push({id:s.id,name:s.name,site:s.site,url:s.url,sourceDate:dateFrom(html),rowCount:rows.length,rawSha256:sha(html),normalizedSha256:sha(JSON.stringify(rows)),status:error?'error':'ok',error});}
fs.writeFileSync(`${OUT}/manifest.json`,JSON.stringify(manifest,null,2));
console.log(JSON.stringify(manifest,null,2));
if(manifest.sources.some(x=>x.status!=='ok'))process.exit(2);
