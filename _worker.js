const UPSTREAM='https://api.fantasypros.com/public/v2/json';
const ALLOWED_PREFIXES=['/nfl/'];

export default {
  async fetch(request, env) {
    const url=new URL(request.url);
    if(url.pathname==='/api/fantasypros') return handleFantasyPros(request,url);
    if(url.pathname==='/api/sleeper-adp') return handleSleeperAdp(request,url);
    return env.ASSETS.fetch(request);
  }
};

async function handleFantasyPros(request,url){
  if(request.method==='OPTIONS') return new Response(null,{headers:cors()});
  if(request.method!=='GET') return json({error:'Nur GET ist erlaubt.'},405);
  if(url.searchParams.get('health')==='1') return json({ok:true,service:'fantasypros-proxy',version:'9.2.0-verified-api-panel-2026'});

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
