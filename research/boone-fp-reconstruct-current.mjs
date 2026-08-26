import fs from 'node:fs';
import crypto from 'node:crypto';

const OUT='boone-current-reconstruction'; fs.mkdirSync(OUT,{recursive:true});
const UA='Mozilla/5.0 (compatible; PITTI-ExpertV2-Research/1.0)';
const decode=s=>String(s||'').replace(/&nbsp;/gi,' ').replace(/&amp;/gi,'&').replace(/&quot;/gi,'"').replace(/&#39;|&apos;/gi,"'").replace(/&ndash;|&#8211;/gi,'–').replace(/&mdash;|&#8212;/gi,'—').replace(/&#(\d+);/g,(_,n)=>String.fromCharCode(Number(n))).replace(/&#x([0-9a-f]+);/gi,(_,n)=>String.fromCharCode(parseInt(n,16)));
const strip=s=>decode(String(s||'').replace(/<script\b[\s\S]*?<\/script>/gi,' ').replace(/<style\b[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim();
const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\b(jr|sr|ii|iii|iv)\b\.?/g,'').replace(/[^a-z0-9]/g,'');
const slugify=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/['’]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
function tableRows(html){return [...String(html||'').matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].map(m=>({html:m[1],cells:[...m[1].matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(x=>strip(x[1]))})).filter(x=>x.cells.length)}
function pos(text){const m=String(text||'').toUpperCase().match(/\b(QB|RB|WR|TE|K|DST)\s*[-#]?\s*(\d+)?\b/);return m?{pos:m[1],posRank:m[2]?Number(m[2]):null}:null}
async function get(url){const r=await fetch(url,{headers:{accept:'text/html,application/xhtml+xml','user-agent':UA}}); if(!r.ok)throw Error(`${url} HTTP ${r.status}`); return {url,html:await r.text()};}
function validateContext(html,season='2026'){const p=strip(html);const yearOk=new RegExp(`\\b${season}\\b`).test(p);const scoringOk=/Half Point PPR Rankings|Half PPR Rankings/i.test(p);const draftOk=/Overall .*Rankings|Draft Rankings/i.test(p);return{ok:yearOk&&scoringOk&&draftOk,yearOk,scoringOk,draftOk,updated:p.match(/Rankings\s*-\s*([A-Z][a-z]{2,8}\s+\d{1,2},\s+20\d{2})/i)?.[1]||''}}
function parseDirect(html){const out=[],seen=new Set();for(const row of tableRows(html)){if(row.cells.length<3)continue;const rank=Number(String(row.cells[0]).match(/^\s*(\d{1,3})\b/)?.[1]);if(!Number.isFinite(rank)||rank<1||rank>500)continue;let name='';for(const a of row.html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)){if(/\/nfl\/players\//i.test(a[1]||'')){const t=strip(a[2]);if(/[A-Za-z]/.test(t)){name=t;break}}}if(!name&&row.cells[1]&&/[A-Za-z]/.test(row.cells[1]))name=row.cells[1];name=name.replace(/\s+\b(Q|O|IR|S)\b\s*$/,'').trim();let pp=null;for(const c of row.cells){pp=pos(c);if(pp)break}const k=norm(name);if(!name||!pp||!['QB','RB','WR','TE'].includes(pp.pos)||seen.has(k))continue;seen.add(k);out.push({key:k,name,pos:pp.pos,rank})}return out.sort((a,b)=>a.rank-b.rank)}
function median(nums){const a=nums.filter(Number.isFinite).sort((x,y)=>x-y);if(!a.length)return null;const m=Math.floor(a.length/2);return a.length%2?a[m]:(a[m-1]+a[m])/2}
function comparisonTables(html,targetName){
  const target=String(targetName||'').toLowerCase(), out=new Map();
  for(const tm of String(html||'').matchAll(/<table\b[^>]*>([\s\S]*?)<\/table>/gi)){
    const rows=tableRows(tm[1]); if(!rows.length)continue;
    let header=-1,targetCol=-1,playerCol=-1,posCol=-1;
    for(let i=0;i<Math.min(rows.length,8);i++){
      const cells=rows[i].cells.map(x=>x.toLowerCase());
      const tc=cells.findIndex(x=>x.includes(target));
      const pc=cells.findIndex(x=>x==='player'||x.includes('player'));
      if(tc>=0&&pc>=0){header=i;targetCol=tc;playerCol=pc;posCol=cells.findIndex(x=>x==='pos'||x.includes('position'));break}
    }
    if(header<0)continue;
    for(let i=header+1;i<rows.length;i++){
      const c=rows[i].cells; if(c.length<=Math.max(targetCol,playerCol))continue;
      const rank=Number(String(c[targetCol]||'').match(/(\d{1,3})/)?.[1]); const name=String(c[playerCol]||'').trim();
      if(!Number.isFinite(rank)||!name)continue; let pp=posCol>=0?pos(c[posCol]):null; if(!pp){for(const cell of c){pp=pos(cell);if(pp)break}} if(!pp||!['QB','RB','WR','TE'].includes(pp.pos))continue;
      const k=norm(name); const prev=out.get(k); if(!prev||prev.rank===rank)out.set(k,{key:k,name,pos:pp.pos,rank});
    }
  }
  return out;
}
async function direct(name){const u=`https://www.fantasypros.com/nfl/rankings/${slugify(name)}.php?scoring=HALF&type=draft`;const {html}=await get(u);const ctx=validateContext(html);const rows=parseDirect(html);if(!ctx.ok||rows.length<80)throw Error(`${name}: direct context/rows fail ${JSON.stringify({ctx,n:rows.length})}`);fs.writeFileSync(`${OUT}/${slugify(name)}.direct.raw.html`,html);return{name,url:u,ctx,rows}}
async function comparison(target,anchor){
  const ts=slugify(target),as=slugify(anchor); const urls=[`https://www.fantasypros.com/nfl/rankings/${ts}-${as}.php?scoring=HALF&type=draft`,`https://www.fantasypros.com/nfl/rankings/${as}-${ts}.php?scoring=HALF&type=draft`]; const errors=[];
  for(const u of urls){try{const {html}=await get(u);const rows=comparisonTables(html,target);if(rows.size){fs.writeFileSync(`${OUT}/cmp-${ts}-${as}.raw.html`,html);return{url:u,rows,diagnosticContext:validateContext(html)}}errors.push(`${u}:0 rows`)}catch(e){errors.push(e.message)}} throw Error(`${target}/${anchor}: ${errors.join(' | ')}`)
}

const target='Justin Boone', anchors=['Pat Fitzmaurice','Andrew Erickson','Derek Brown'];
const anchorLists={}; for(const a of anchors)anchorLists[a]=await direct(a);
const exact=new Map(), comparisons=[];
for(const a of anchors){const c=await comparison(target,a);comparisons.push({anchor:a,url:c.url,count:c.rows.size,diagnosticContext:c.diagnosticContext});for(const [k,v] of c.rows){const prev=exact.get(k);if(!prev||prev.rank===v.rank)exact.set(k,v)}}
if(exact.size<20)throw Error(`only ${exact.size} exact comparison rows`);
const universe=new Map(); for(const a of anchors){for(const row of anchorLists[a].rows){const u=universe.get(row.key)||{key:row.key,name:row.name,pos:row.pos,anchorRanks:[]};u.anchorRanks.push(row.rank);universe.set(row.key,u)}}
const players=[];let exactCount=0,reconstructedCount=0;for(const u of universe.values()){
 const ex=exact.get(u.key); if(ex){players.push({...ex,exact:true,reconstructed:false,spread:Math.max(...u.anchorRanks)-Math.min(...u.anchorRanks),anchors:u.anchorRanks.length});exactCount++;continue}
 const spread=Math.max(...u.anchorRanks)-Math.min(...u.anchorRanks); if(u.anchorRanks.length<2||spread>14)continue; const rank=median(u.anchorRanks); if(!Number.isFinite(rank))continue; players.push({key:u.key,name:u.name,pos:u.pos,rank,exact:false,reconstructed:true,spread,anchors:u.anchorRanks.length});reconstructedCount++;
}
players.sort((a,b)=>a.rank-b.rank||a.name.localeCompare(b.name));
if(players.length<80)throw Error(`only ${players.length} reconstructed rows`);
const result={schema:'pitti-boone-current-fp-reconstruction-v2',createdAt:new Date().toISOString(),season:2026,scoring:'HALF',type:'DRAFT',target,anchors,comparisons,anchorUpdates:Object.fromEntries(anchors.map(a=>[a,anchorLists[a].ctx.updated])),rowCount:players.length,exactCount,reconstructedCount,exactCoverage:exactCount/players.length,players};
fs.writeFileSync(`${OUT}/boone.json`,JSON.stringify(result,null,2));
const manifest={...result,players:undefined,normalizedSha256:sha(JSON.stringify(players))}; delete manifest.players; fs.writeFileSync(`${OUT}/manifest.json`,JSON.stringify(manifest,null,2)); console.log(JSON.stringify(manifest,null,2));
