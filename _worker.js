const UPSTREAM='https://api.fantasypros.com/public/v2/json';
const ALLOWED_PREFIXES=['/nfl/'];

export default {
  async fetch(request, env) {
    const url=new URL(request.url);
    if(url.pathname==='/api/fantasypros') return handleFantasyPros(request,url);
    if(url.pathname==='/api/sleeper-adp') return handleSleeperAdp(request,url);
    if(url.pathname==='/api/fp-public-ranking') return handleFantasyProsPublicRanking(request,url);
    return env.ASSETS.fetch(request);
  }
};

async function handleFantasyPros(request,url){
  if(request.method==='OPTIONS') return new Response(null,{headers:cors()});
  if(request.method!=='GET') return json({error:'Nur GET ist erlaubt.'},405);
  if(url.searchParams.get('health')==='1') return json({ok:true,service:'fantasypros-proxy',version:'9.1.0-public-expert-rankings-2026'});

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


function decodeHtml(s){
  return String(s||'')
    .replace(/&nbsp;/gi,' ')
    .replace(/&amp;/gi,'&')
    .replace(/&quot;/gi,'"')
    .replace(/&#39;|&apos;/gi,"'")
    .replace(/&ndash;|&#8211;/gi,'–')
    .replace(/&mdash;|&#8212;/gi,'—')
    .replace(/&#(\d+);/g,(_,n)=>String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi,(_,n)=>String.fromCharCode(parseInt(n,16)));
}
function cleanHtml(s){
  return decodeHtml(String(s||'').replace(/<script\b[\s\S]*?<\/script>/gi,' ').replace(/<style\b[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' '))
    .replace(/\s+/g,' ').trim();
}
function parseFantasyProsIndividual(html,expert,season){
  const plain=cleanHtml(html);
  const titleMatch=plain.match(new RegExp(`${season}\\s+Overall\\s+(?:Half Point PPR|Half PPR|PPR|Standard)?\\s*Rankings\\s*-\\s*([A-Z][a-z]{2,8}\\s+\\d{1,2},\\s+${season})`,'i'));
  const title=titleMatch?titleMatch[0]:'';
  const updated=titleMatch?titleMatch[1]:'';

  const players=[];
  const seen=new Set();
  const rowRe=/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi;
  let rm;
  while((rm=rowRe.exec(html))){
    const row=rm[1];
    const cells=[...row.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)].map(m=>cleanHtml(m[1]));
    if(cells.length<3)continue;

    const rank=Number((cells[0]||'').match(/^\s*(\d{1,3})\b/)?.[1]);
    if(!Number.isFinite(rank)||rank<1||rank>500)continue;

    let name='';
    const anchors=[...row.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)];
    for(const a of anchors){
      const attrs=a[1]||'',txt=cleanHtml(a[2]);
      if(/href\s*=\s*["'][^"']*\/nfl\/players\/[^"']+["']/i.test(attrs)&&/[A-Za-z]/.test(txt)){
        name=txt;
        break;
      }
    }
    if(!name){
      const candidate=cells[1]||'';
      if(candidate&&/[A-Za-z]/.test(candidate))name=candidate;
    }
    name=name.replace(/\s+\b(Q|O|IR|S)\b\s*$/,'').trim();
    if(!name||seen.has(name.toLowerCase()))continue;

    let posToken='';
    for(const c of cells){
      const compact=c.replace(/\s+/g,'');
      if(/^(QB|RB|WR|TE)\d+$/i.test(compact)){posToken=compact.toUpperCase();break}
    }
    if(!posToken){
      const whole=cleanHtml(row);
      const hit=whole.match(/\b(QB|RB|WR|TE)(\d+)\b/i);
      if(hit)posToken=(hit[1]+hit[2]).toUpperCase();
    }
    if(!posToken)continue;

    const pm=posToken.match(/^(QB|RB|WR|TE)(\d+)$/);
    const pos=pm[1],posRank=Number(pm[2]);
    seen.add(name.toLowerCase());
    players.push({rank,name,pos,posRank});
  }

  players.sort((a,b)=>a.rank-b.rank);
  const requested=String(expert||'').replace(/-/g,' ').toLowerCase();
  const pageLooksRight=!requested || requested.split(/\s+/).every(part=>plain.toLowerCase().includes(part));
  return {players,title,updated,pageLooksRight};
}
async function handleFantasyProsPublicRanking(request,url){
  if(request.method!=='GET')return json({error:'Nur GET ist erlaubt.'},405);
  const expert=String(url.searchParams.get('expert')||'').toLowerCase();
  const season=String(url.searchParams.get('season')||new Date().getFullYear());
  const scoring=String(url.searchParams.get('scoring')||'HALF').toUpperCase();
  if(!/^[a-z0-9-]{3,80}$/.test(expert))return json({error:'Ungültiger Experte.'},400);
  if(!/^\d{4}$/.test(season))return json({error:'Ungültige Saison.'},400);
  if(!['HALF','PPR','STD','STANDARD'].includes(scoring))return json({error:'Ungültiges Scoring.'},400);

  const scoringParam=scoring==='HALF'?'HALF':scoring==='PPR'?'PPR':'STD';
  const source=`https://www.fantasypros.com/nfl/rankings/${expert}.php?scoring=${scoringParam}&type=draft`;

  try{
    const upstream=await fetch(source,{
      headers:{
        'accept':'text/html,application/xhtml+xml',
        'user-agent':'Mozilla/5.0 (compatible; DraftCompanion/9.1; +https://pages.dev)'
      },
      cf:{cacheTtl:1800,cacheEverything:true}
    });
    if(!upstream.ok)return json({error:`FantasyPros öffentliche Seite HTTP ${upstream.status}`,source},502);
    const html=await upstream.text();
    const parsed=parseFantasyProsIndividual(html,expert,season);
    if(!parsed.pageLooksRight)return json({error:'FantasyPros-Seite passt nicht zum angeforderten Experten.',source},502);
    if(parsed.players.length<40)return json({error:`FantasyPros-Seite lieferte nur ${parsed.players.length} verwertbare Spieler.`,source,title:parsed.title},502);
    return json({expert,season,scoring:scoringParam,source,title:parsed.title,updated:parsed.updated,count:parsed.players.length,players:parsed.players});
  }catch(error){
    return json({error:'Öffentliche FantasyPros-Rangliste nicht erreichbar.',detail:error?.message||String(error),source},502);
  }
}
