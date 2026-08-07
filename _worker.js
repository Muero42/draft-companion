const UPSTREAM='https://api.fantasypros.com/public/v2/json';
const ALLOWED_PREFIXES=['/nfl/'];

export default {
  async fetch(request, env) {
    const url=new URL(request.url);
    if(url.pathname==='/api/fantasypros') return handleFantasyPros(request,url);
    if(url.pathname==='/api/sleeper-adp') return handleSleeperAdp(request,url);
    if(url.pathname==='/api/fp-expert-directory') return handleFpExpertDirectory(request,url);
    if(url.pathname==='/api/expert-ranking') return handleExpertRanking(request,url);
    return env.ASSETS.fetch(request);
  }
};

async function handleFantasyPros(request,url){
  if(request.method==='OPTIONS') return new Response(null,{headers:cors()});
  if(request.method!=='GET') return json({error:'Nur GET ist erlaubt.'},405);
  if(url.searchParams.get('health')==='1') return json({ok:true,service:'fantasypros-proxy',version:'9.4.0-verified-api-panel-2026'});

  const path=url.searchParams.get('path')||'';
  if(!path.startsWith('/')||!ALLOWED_PREFIXES.some(prefix=>path.startsWith(prefix))){
    return json({error:'Nicht erlaubter API-Pfad.',path},400);
  }
  const key=request.headers.get('x-fp-key');
  if(!key) return json({error:'API-Key fehlt.'},401);

  try{
    const upstream=await fetch(`${UPSTREAM}${path}`,{
      headers:{'x-api-key':key,'accept':'application/json'},
      cf:{cacheTtl:0,cacheEverything:false}
    });
    const body=await upstream.text();
    return new Response(body,{status:upstream.status,headers:{...cors(),'content-type':upstream.headers.get('content-type')||'application/json','x-upstream-status':String(upstream.status),'cache-control':'no-store'}});
  }catch(error){
    return json({error:'FantasyPros nicht erreichbar.',detail:error?.message||String(error)},502);
  }
}

function cors(){return {'access-control-allow-origin':'*','access-control-allow-headers':'x-fp-key,content-type','access-control-allow-methods':'GET,OPTIONS'}}
function json(value,status=200){return new Response(JSON.stringify(value),{status,headers:{...cors(),'content-type':'application/json','cache-control':'no-store'}})}


async function handleSleeperAdp(request,url){
  if(request.method!=='GET') return json({error:'Nur GET ist erlaubt.'},405);
  const season=String(url.searchParams.get('season')||new Date().getFullYear());
  if(!/^\d{4}$/.test(season))return json({error:'Ungültige Saison.'},400);
  const order='adp_half_ppr';
  const positions=['QB','RB','WR','TE'].map(p=>`position[]=${encodeURIComponent(p)}`).join('&');
  const projectionUrl=`https://api.sleeper.app/projections/nfl/${season}?season_type=regular&${positions}&order_by=${order}`;
  try{
    const [pr,pl]=await Promise.all([
      fetch(projectionUrl,{headers:{accept:'application/json'},cf:{cacheTtl:900,cacheEverything:true}}),
      fetch('https://api.sleeper.app/v1/players/nfl',{headers:{accept:'application/json'},cf:{cacheTtl:86400,cacheEverything:true}})
    ]);
    if(!pr.ok) return json({error:`Sleeper projections HTTP ${pr.status}`},502);
    if(!pl.ok) return json({error:`Sleeper players HTTP ${pl.status}`},502);
    const projections=await pr.json(),players=await pl.json(),out=[];
    for(const row of Array.isArray(projections)?projections:[]){
      const pid=String(row.player_id||row.player?.player_id||'');
      const meta=players[pid]||row.player||{};
      const name=meta.full_name||[meta.first_name,meta.last_name].filter(Boolean).join(' ');
      const raw=row?.stats?.adp_half_ppr ?? row?.adp_half_ppr ?? row?.stats?.adp_half ?? row?.adp_half;
      const adp=Number(raw);
      if(name&&Number.isFinite(adp)&&adp>0&&adp<999)out.push({player_id:pid,name,adp});
    }
    out.sort((a,b)=>a.adp-b.adp);
    return json({season,format:'half_ppr',count:out.length,players:out});
  }catch(error){
    return json({error:'Sleeper-ADP nicht erreichbar.',detail:error?.message||String(error)},502);
  }
}


function htmlDecode(s){
  return String(s||'')
    .replace(/&nbsp;/gi,' ').replace(/&amp;/gi,'&').replace(/&quot;/gi,'"')
    .replace(/&#39;|&apos;/gi,"'").replace(/&ndash;|&#8211;/gi,'–').replace(/&mdash;|&#8212;/gi,'—')
    .replace(/&#(\d+);/g,(_,n)=>String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi,(_,n)=>String.fromCharCode(parseInt(n,16)));
}
function stripHtml(s){
  return htmlDecode(String(s||'').replace(/<script\b[\s\S]*?<\/script>/gi,' ').replace(/<style\b[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' '))
    .replace(/\s+/g,' ').trim();
}
function slugify(s){
  return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/['’]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
}
async function fetchHtml(url){
  const r=await fetch(url,{headers:{
    'accept':'text/html,application/xhtml+xml',
    'user-agent':'Mozilla/5.0 (compatible; DraftCompanion/9.4; +https://pages.dev)'
  },cf:{cacheTtl:1800,cacheEverything:true}});
  if(!r.ok)throw new Error(`HTTP ${r.status}`);
  return await r.text();
}
function tableRows(html){
  return [...String(html||'').matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].map(m=>{
    const row=m[1];
    const cells=[...row.matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(x=>stripHtml(x[1]));
    return {html:row,cells};
  }).filter(x=>x.cells.length);
}
function parsePosToken(text){
  const m=String(text||'').toUpperCase().match(/\b(QB|RB|WR|TE)\s*[-#]?\s*(\d+)?\b/);
  return m?{pos:m[1],posRank:m[2]?Number(m[2]):null}:null;
}
function parseFantasyProsDirect(html){
  const out=[],seen=new Set();
  for(const row of tableRows(html)){
    if(row.cells.length<3)continue;
    const rank=Number(String(row.cells[0]).match(/^\s*(\d{1,3})\b/)?.[1]);
    if(!Number.isFinite(rank)||rank<1||rank>500)continue;
    let name='';
    for(const a of row.html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)){
      if(/\/nfl\/players\//i.test(a[1]||'')){const t=stripHtml(a[2]);if(/[A-Za-z]/.test(t)){name=t;break}}
    }
    if(!name&&row.cells[1]&&/[A-Za-z]/.test(row.cells[1]))name=row.cells[1];
    name=name.replace(/\s+\b(Q|O|IR|S)\b\s*$/,'').trim();
    if(!name||seen.has(name.toLowerCase()))continue;
    let pp=null;
    for(const c of row.cells){pp=parsePosToken(c);if(pp)break}
    if(!pp)continue;
    seen.add(name.toLowerCase());
    out.push({rank,name,pos:pp.pos,posRank:pp.posRank});
  }
  return out.sort((a,b)=>a.rank-b.rank);
}
function parseYahooSimpleOverall(html){
  const out=[],seen=new Set();
  for(const row of tableRows(html)){
    const c=row.cells;
    if(c.length<3)continue;
    const rank=Number(String(c[0]).match(/^\s*(\d{1,3})\b/)?.[1]);
    if(!Number.isFinite(rank)||rank<1||rank>500)continue;
    let posInfo=null,posIndex=-1;
    for(let i=1;i<c.length;i++){const p=parsePosToken(c[i]);if(p){posInfo=p;posIndex=i;break}}
    if(!posInfo)continue;
    let name='';
    for(let i=1;i<c.length;i++){
      if(i===posIndex)continue;
      const t=String(c[i]||'').trim();
      if(t.length>2&&/[A-Za-z]/.test(t)&&!/^([A-Z]{2,3}|FA)$/.test(t)){name=t;break}
    }
    if(!name||seen.has(name.toLowerCase()))continue;
    seen.add(name.toLowerCase());
    out.push({rank,name,pos:posInfo.pos,posRank:posInfo.posRank});
  }
  return out.sort((a,b)=>a.rank-b.rank);
}
function parseYahooStaffTable(html,expertName){
  const rows=tableRows(html);
  let headerIndex=-1,expertCol=-1,playerCol=-1,posCol=-1;
  const needle=String(expertName||'').toLowerCase();
  for(let i=0;i<rows.length;i++){
    const cells=rows[i].cells.map(x=>x.toLowerCase());
    const ec=cells.findIndex(x=>x.includes(needle));
    const pc=cells.findIndex(x=>x==='player'||x.includes('player'));
    if(ec>=0&&pc>=0){headerIndex=i;expertCol=ec;playerCol=pc;posCol=cells.findIndex(x=>x==='pos'||x.includes('position'));break}
  }
  if(headerIndex<0)return [];
  const out=[],seen=new Set();
  for(let i=headerIndex+1;i<rows.length;i++){
    const c=rows[i].cells;
    if(c.length<=Math.max(expertCol,playerCol))continue;
    const rank=Number(String(c[expertCol]).match(/(\d{1,3})/)?.[1]);
    const name=String(c[playerCol]||'').trim();
    if(!Number.isFinite(rank)||!name||seen.has(name.toLowerCase()))continue;
    let pp=posCol>=0?parsePosToken(c[posCol]):null;
    if(!pp){for(const cell of c){pp=parsePosToken(cell);if(pp)break}}
    if(!pp)continue;
    seen.add(name.toLowerCase());
    out.push({rank,name,pos:pp.pos,posRank:pp.posRank});
  }
  return out.sort((a,b)=>a.rank-b.rank);
}
function parseFpDirectory(html){
  const experts=[],seen=new Set();
  for(const row of tableRows(html)){
    const txt=row.cells.join(' | ');
    if(!/View (?:the )?rankings|vs\.? our Expert Consensus|Expert Consensus Rankings/i.test(txt+row.html))continue;
    let name='',site='';
    const links=[...row.html.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/gi)].map(x=>stripHtml(x[1])).filter(Boolean);
    if(links.length)name=links[0];
    if(!name||name.length<3)continue;
    const slug=slugify(name);
    if(seen.has(slug))continue;
    seen.add(slug);
    const directPublic=new RegExp(`/nfl/rankings/${slug}\\.php`,'i').test(row.html);
    const comparisonPublic=new RegExp(`/nfl/rankings/${slug}-consensus-rankings\\.php`,'i').test(row.html);
    const sourceMatch=txt.match(/\(([^)]+)\)/);
    if(sourceMatch)site=sourceMatch[1];
    experts.push({name,site,slug,directPublic,comparisonPublic});
  }
  return experts;
}
async function handleFpExpertDirectory(request,url){
  if(request.method!=='GET')return json({error:'Nur GET ist erlaubt.'},405);
  const source='https://www.fantasypros.com/nfl/rankings/?type=draft';
  try{
    const html=await fetchHtml(source),experts=parseFpDirectory(html);
    return json({source,count:experts.length,experts});
  }catch(e){return json({error:'FantasyPros Expertenverzeichnis nicht erreichbar.',detail:e.message,source},502)}
}
function scoringCode(raw){
  const s=String(raw||'HALF').toUpperCase();
  return s==='PPR'?'PPR':(s==='STD'||s==='STANDARD')?'STD':'HALF';
}
async function tryFantasyProsDirect(name,scoring){
  const slug=slugify(name),url=`https://www.fantasypros.com/nfl/rankings/${slug}.php?scoring=${scoring}&type=draft`;
  try{
    const html=await fetchHtml(url),players=parseFantasyProsDirect(html);
    if(players.length>=80)return {ok:true,source:'FantasyPros direkte Einzelrangliste',sourceUrl:url,players,updated:''};
    return {ok:false,error:`FantasyPros direkt: ${players.length} Spieler`};
  }catch(e){return {ok:false,error:`FantasyPros direkt: ${e.message}`}}
}
const YAHOO_BOONE_URLS=[
  'https://sports.yahoo.com/fantasy/article/2026-fantasy-football-rankings-justin-boone-top-300-players-155300098.html',
  'https://sports.yahoo.com/fantasy/article/2026-fantasy-football-rankings-justin-boone-top-150-players-155300344.html'
];
const YAHOO_STAFF_URLS=[
  'https://sports.yahoo.com/fantasy/article/fantasy-football-rankings-consensus-top-300-players-160643696.html',
  'https://ca.sports.yahoo.com/news/fantasy-football-rankings-consensus-top-300-players-160643696.html'
];
async function tryYahooExpert(name){
  const errors=[];
  if(/justin boone/i.test(name)){
    for(const url of YAHOO_BOONE_URLS){
      try{
        const html=await fetchHtml(url),players=parseYahooSimpleOverall(html);
        if(players.length>=120)return {ok:true,source:'Yahoo Sports – Justin Boone Top 300',sourceUrl:url,players,updated:''};
        errors.push(`Boone Yahoo ${players.length}`);
      }catch(e){errors.push(`Boone Yahoo ${e.message}`)}
    }
  }
  for(const url of YAHOO_STAFF_URLS){
    try{
      const html=await fetchHtml(url),players=parseYahooStaffTable(html,name);
      if(players.length>=80)return {ok:true,source:`Yahoo Sports Staff – ${name}`,sourceUrl:url,players,updated:''};
      errors.push(`Yahoo Staff ${players.length}`);
    }catch(e){errors.push(`Yahoo Staff ${e.message}`)}
  }
  return {ok:false,error:errors.join(' | ')||'kein Yahoo-Adapter'};
}
async function tryFantasyProsComparison(name,scoring){
  // Comparison pages are intentionally only a CROSSCHECK because they omit close-to-ECR players.
  const slug=slugify(name),url=`https://www.fantasypros.com/nfl/rankings/${slug}-consensus-rankings.php?position=ALL&scoring=${scoring}&type=draft`;
  try{
    const html=await fetchHtml(url),plain=stripHtml(html);
    return {ok:/2026 Draft|Overall Fantasy Football Rankings/i.test(plain),sourceUrl:url};
  }catch{return {ok:false}}
}
async function handleExpertRanking(request,url){
  if(request.method!=='GET')return json({error:'Nur GET ist erlaubt.'},405);
  const name=String(url.searchParams.get('name')||'').trim();
  const site=String(url.searchParams.get('site')||'').trim();
  const season=String(url.searchParams.get('season')||new Date().getFullYear());
  const scoring=scoringCode(url.searchParams.get('scoring'));
  if(!name||name.length<3)return json({error:'Expertenname fehlt.'},400);
  if(season!=='2026')return json({error:`Öffentliche Multi-Source-Adapter sind derzeit für Saison ${season} nicht validiert.`},422);

  const attempts=[];
  const fp=await tryFantasyProsDirect(name,scoring);attempts.push(fp.error||fp.source);
  if(fp.ok){
    const cross=await tryFantasyProsComparison(name,scoring);
    return json({...fp,crosscheck:{ok:cross.ok,sourceUrl:cross.sourceUrl||''},confidence:cross.ok?'primary+crosscheck':'primary'});
  }

  if(/yahoo/i.test(site)||/Justin Boone|Matt Harmon/i.test(name)){
    const yh=await tryYahooExpert(name);attempts.push(yh.error||yh.source);
    if(yh.ok){
      const cross=await tryFantasyProsComparison(name,scoring);
      return json({...yh,crosscheck:{ok:cross.ok,sourceUrl:cross.sourceUrl||''},confidence:cross.ok?'primary+crosscheck':'primary'});
    }
  }

  return json({error:`${name}: keine ausreichend vollständige automatische Overall-Quelle. ${attempts.filter(Boolean).join(' | ')}`},404);
}
