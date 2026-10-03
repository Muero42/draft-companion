import {POSITIONS,WEEK1_URLS,parseBooneChartHtml,buildBooneTradeValueSnapshot,discoverBooneTradeChartUrls} from './boone-trade-values-v1.mjs';

const UPSTREAM='https://api.fantasypros.com/public/v2/json';
const ALLOWED_PREFIXES=['/nfl/'];

export default {
  async fetch(request, env) {
    const url=new URL(request.url);
    if(url.pathname==='/api/season-players') return handleSeasonPlayers(request);
    if(url.pathname==='/api/fantasypros') return handleFantasyPros(request,url);
    if(url.pathname==='/api/sleeper-adp') return handleSleeperAdp(request,url);
    if(url.pathname==='/api/fp-expert-directory') return handleFpExpertDirectory(request,url);
    if(url.pathname==='/api/expert-ranking') return handleExpertRanking(request,url);
    if(url.pathname==='/api/boone-trade-values') return handleBooneTradeValues(request,url);
    if(url.pathname==='/api/weekly-public-evidence')return handleWeeklyPublicEvidence(request,url);
    if(url.pathname==='/api/nfl-week-context') return handleNflWeekContext(request,url);
    return env.ASSETS.fetch(request);
  }
};


// Verified coordinates bound to ESPN venue ID AND name; never infer location from home team.
const WEATHER_VENUES={
 '3679':['Huntington Bank Field',41.506111,-81.699444],
 '5534':['Tottenham Hotspur Stadium',51.6044,-.0664],
 '11938':['Highmark Stadium',42.773056,-78.792222],
 '3933':['Soldier Field',41.8623,-87.6167],
 '3874':['Paycor Stadium',39.095,-84.516],
 '3839':['MetLife Stadium',40.813611,-74.074444],
 '3806':['Lincoln Financial Field',39.900833,-75.1675],
 '3886':['Raymond James Stadium',27.975833,-82.503333],
 '3814':['M&T Bank Stadium',39.278056,-76.622778],
 '4738':["Levi's Stadium",37.403,-121.97],
 '3673':['Lumen Field',47.5952,-122.3316],
 '3628':['Bank of America Stadium',35.2258,-80.8528]
};
async function publicJson(url,ttl=900){const r=await fetch(url,{headers:{accept:'application/json'},signal:AbortSignal.timeout(8000),cf:{cacheTtl:ttl,cacheEverything:true}});if(!r.ok)throw Error('PUBLIC_HTTP_'+r.status);return r.json();}
const canonicalNflTeam=s=>({WSH:'WAS',JAC:'JAX',LA:'LAR'}[s]||s);
async function enrichWeekEvents(events,scoreboardUrl){
 // At most four concurrent events; each failure affects one optional lane only.
 let index=0;await Promise.all(Array.from({length:Math.min(4,events.length)},async()=>{while(index<events.length){const e=events[index++],c=e?.competitions?.[0],kickoff=Date.parse(e.date||'');if(!c||!e.id||!Number.isFinite(kickoff))continue;const now=Date.now(),binding={eventId:String(e.id),kickoffAt:new Date(kickoff).toISOString(),venueId:String(c.venue?.id||''),teams:(c.competitors||[]).map(x=>canonicalNflTeam(x.team?.abbreviation)).sort()};
   c.pittiAcquiredAt=now;
   if(kickoff<=now){c.pittiWeather={status:'UNAVAILABLE',reason:'GAME_ALREADY_STARTED'};continue;}
   const embedded=c.weather,embeddedAt=Date.parse(embedded?.lastUpdated||''),embeddedValid=c.venue?.indoor===false&&typeof embedded?.temperature==='number'&&Number.isFinite(embedded.temperature)&&embedded.temperature>=-60&&embedded.temperature<=140&&(!embedded.lastUpdated||(Number.isFinite(embeddedAt)&&embeddedAt<=now&&now-embeddedAt<=3600000));
   if(embeddedValid)c.pittiWeather={...binding,status:'VERIFIED',sourceId:'espn_scoreboard_weather',sourceUrl:scoreboardUrl,verifiedAt:now,expiresAt:Math.min(kickoff,now+3600000),forecastAt:binding.kickoffAt,temperature:embedded.temperature,temperatureUnit:'F',summary:String(embedded.displayValue||embedded.temperature+' °F')};
   if(embeddedValid&&c.odds?.length)continue;
   let summary=null;
   if(c.venue?.indoor===false||!c.odds?.length){try{summary=await publicJson('https://site.api.espn.com/apis/site/v2/sports/football/nfl/summary?event='+encodeURIComponent(e.id));const sc=summary.header?.competitions?.[0];if(String(summary.header?.id)!==String(e.id)||Date.parse(sc?.date)!==kickoff||JSON.stringify((sc?.competitors||[]).map(x=>canonicalNflTeam(x.team?.abbreviation)).sort())!==JSON.stringify(binding.teams)||String(summary.gameInfo?.venue?.id)!==binding.venueId)summary=null;}catch{}}
   if(!c.odds?.length&&summary?.pickcenter?.length)c.odds=summary.pickcenter;
   if(c.venue?.indoor!==false||embeddedValid)continue;
   const w=summary?.gameInfo?.weather;if(typeof w?.temperature==='number'&&Number.isFinite(w.temperature)&&w.temperature>=-60&&w.temperature<=140){c.pittiWeather={...binding,status:'VERIFIED',sourceId:'espn_event_summary_weather',sourceUrl:'https://site.api.espn.com/apis/site/v2/sports/football/nfl/summary?event='+e.id,verifiedAt:now,expiresAt:Math.min(kickoff,now+3600000),forecastAt:binding.kickoffAt,temperature:w.temperature,temperatureUnit:'F',precipitationProbability:typeof w.precipitation==='number'?w.precipitation:null,summary:w.temperature+' °F'+(typeof w.precipitation==='number'?' · Niederschlag '+w.precipitation+'%':'')};}
   const v=WEATHER_VENUES[binding.venueId];if(!v||v[0]!==c.venue?.fullName){if(c.pittiWeather?.status==='VERIFIED')continue;c.pittiWeather={status:'UNAVAILABLE',reason:'VENUE_COORDINATES_UNVERIFIED'};continue;}
   const sourceUrl='https://api.open-meteo.com/v1/forecast?latitude='+v[1]+'&longitude='+v[2]+'&hourly=temperature_2m,precipitation_probability,wind_speed_10m,wind_gusts_10m&timezone=GMT&forecast_days=16';
   try{const p=await publicJson(sourceUrl,1800),h=p.hourly||{},ts=h.time||[],nearest=ts.map((t,i)=>({i,d:Math.abs(Date.parse(t+'Z')-kickoff)})).sort((a,b)=>a.d-b.d)[0],i=nearest?.i;
    if(p.utc_offset_seconds!==0||typeof p.latitude!=='number'||!Number.isFinite(p.latitude)||typeof p.longitude!=='number'||!Number.isFinite(p.longitude)||Math.abs(p.latitude-v[1])>.15||Math.abs(p.longitude-v[2])>.15||!Number.isFinite(nearest?.d)||nearest.d>1800000||!nearest||p.hourly_units?.temperature_2m!=='°C'||p.hourly_units?.wind_speed_10m!=='km/h'||p.hourly_units?.wind_gusts_10m!=='km/h'||p.hourly_units?.precipitation_probability!=='%'||![h.temperature_2m?.[i],h.precipitation_probability?.[i],h.wind_speed_10m?.[i],h.wind_gusts_10m?.[i]].every(x=>typeof x==='number'&&Number.isFinite(x)))throw Error('FORECAST_SHAPE');
    c.pittiWeather={...binding,status:'VERIFIED',sourceId:'open_meteo',sourceUrl,coordinateSource:'https://en.wikipedia.org/wiki/'+encodeURIComponent(v[0].replaceAll(' ','_')),latitude:v[1],longitude:v[2],verifiedAt:now,expiresAt:Math.min(kickoff,now+3600000),forecastAt:ts[i]+'Z',temperature:h.temperature_2m[i],temperatureUnit:'C',precipitationProbability:h.precipitation_probability[i],windKmh:h.wind_speed_10m[i],gustKmh:h.wind_gusts_10m[i],summary:h.temperature_2m[i]+' °C · Regen '+h.precipitation_probability[i]+'% · Wind '+h.wind_speed_10m[i]+' km/h · Böen '+h.wind_gusts_10m[i]+' km/h'};
   }catch{if(c.pittiWeather?.status!=='VERIFIED')c.pittiWeather={status:'UNAVAILABLE',reason:'FORECAST_FETCH_OR_VALIDITY_FAILED'};}
 }}));
}
async function handleWeeklyPublicEvidence(request,url){
 if(request.method!=='GET')return json({error:'GET only'},405);const season=Number(url.searchParams.get('season')),week=Number(url.searchParams.get('week'));if(!Number.isInteger(season)||season<2026||season>2100||!Number.isInteger(week)||week<1||week>18)return json({error:'Invalid week'},400);
 const verifiedAt=Date.now(),sourceUrl='https://api.sleeper.app/projections/nfl/'+season+'/'+week+'?season_type=regular',ranks={},failures={};let sleeper=null;
 await Promise.all([publicJson(sourceUrl,900).then(rows=>{if(!Array.isArray(rows))throw Error('SHAPE');sleeper={season,week,sourceUrl,verifiedAt,rows:rows.filter(r=>['QB','RB','WR','TE','K','DEF','DST'].includes(r.player?.position)).map(r=>({player_id:r.player_id,player:{position:r.player?.position},team:r.team,stats:{pts_half_ppr:r.stats?.pts_half_ppr},category:r.category,sport:r.sport,season:r.season,week:r.week,season_type:r.season_type,updated_at:r.updated_at,last_modified:r.last_modified,company:r.company}))};}).catch(()=>{failures.projections='PUBLIC_SLEEPER_UNAVAILABLE'}),...['RB','WR','TE'].map(async position=>{const sourceUrl='https://www.fantasypros.com/nfl/rankings/half-point-ppr-'+position.toLowerCase()+'.php';try{const r=await fetch(sourceUrl,{signal:AbortSignal.timeout(8000),cf:{cacheTtl:900,cacheEverything:true}});if(!r.ok)throw Error('HTTP');const html=await boundedText(r),match=html.match(/var ecrData = (.*?);/),p=match?JSON.parse(match[1]):null;if(p?.sport!=='NFL'||p.ranking_type_name!=='weekly'||Number(p.year)!==season||Number(p.week)!==week||p.scoring!=='HALF'||p.position_id!==position||!Array.isArray(p.players))throw Error('CONTEXT');ranks[position]={...p,season:Number(p.year),sourceUrl,publicWeeklySource:true};}catch{failures[position]='PUBLIC_RANK_CONTEXT_OR_FETCH_FAILED'}})]);
 failures.QB='PUBLIC_QB_PAGE_STD_ONLY_NOT_HALF_PPR';
 return json({season,week,verifiedAt,sleeperProjectionPayload:sleeper,rankingPayloads:ranks,failures});
}

const NFL_WEEK_MIN_GAMES=13,NFL_WEEK_MAX_GAMES=16;
function espnWeekCandidates(season,week){
  const base='https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard';
  return[
    `${base}?dates=${season}&seasontype=2&week=${week}&limit=100`,
    `${base}?week=${week}&seasontype=2&limit=100`,
    `${base}?season=${season}&week=${week}&seasontype=2&limit=100`,
    `https://cdn.espn.com/core/nfl/scoreboard?xhr=1&year=${season}&seasontype=2&week=${week}`
  ];
}
function normalizedEspnWeekPayload(payload,sourceUrl){
  if(/^https:\/\/cdn\.espn\.com\/core\/nfl\/scoreboard\?/.test(sourceUrl)){
    const scoreboard=payload?.content?.sbData;
    return{season:Number(scoreboard?.season?.year),seasonType:Number(scoreboard?.season?.type),week:Number(scoreboard?.week?.number),events:Array.isArray(scoreboard?.events)?scoreboard.events:[]};
  }
  return{season:Number(payload?.season?.year),seasonType:Number(payload?.season?.type),week:Number(payload?.week?.number),events:Array.isArray(payload?.events)?payload.events:[]};
}
async function handleNflWeekContext(request,url){
  if(request.method!=='GET')return json({error:'Nur GET ist erlaubt.'},405);
  const season=Number(url.searchParams.get('season')),week=Number(url.searchParams.get('week'));
  if(!Number.isInteger(season)||season<2026||season>2100||!Number.isInteger(week)||week<1||week>18)return json({error:'NFL-Wochenkontext ungültig.'},400);
  const attempts=[];
  for(const sourceUrl of espnWeekCandidates(season,week)){
    try{
      const response=await fetch(sourceUrl,{headers:{accept:'application/json','accept-language':'en-US,en;q=0.9','user-agent':'Mozilla/5.0 (compatible; PITTI-Companion/11.8; +https://pages.dev)'},cf:{cacheTtl:900,cacheEverything:true}});
      if(!response.ok){attempts.push({sourceUrl,failureType:'UPSTREAM_HTTP_ERROR',upstreamStatus:response.status});continue;}
      const payload=await response.json(),normalized=normalizedEspnWeekPayload(payload,sourceUrl),events=normalized.events;
      if(normalized.season!==season||normalized.seasonType!==2||normalized.week!==week){attempts.push({sourceUrl,failureType:'CONTEXT_MISMATCH',upstreamStatus:response.status,sourceEvents:events.length});continue;}
      if(events.length<NFL_WEEK_MIN_GAMES||events.length>NFL_WEEK_MAX_GAMES){attempts.push({sourceUrl,failureType:'INCOMPLETE_WEEK',upstreamStatus:response.status,sourceEvents:events.length});continue;}
      await enrichWeekEvents(events,sourceUrl);
      return json({season,week,sourceUrl,events,acquisition:{provider:'ESPN',variant:attempts.length+1,sourceEvents:events.length,attempts:attempts.map(x=>({failureType:x.failureType,upstreamStatus:x.upstreamStatus,sourceEvents:x.sourceEvents??null}))}});
    }catch{attempts.push({sourceUrl,failureType:'FETCH_EXCEPTION',upstreamStatus:null});}
  }
  const last=attempts[attempts.length-1]||{},lastHttp=[...attempts].reverse().find(x=>x.failureType==='UPSTREAM_HTTP_ERROR'),failureType=attempts.some(x=>x.failureType==='UPSTREAM_HTTP_ERROR')?'UPSTREAM_HTTP_ERROR':attempts.some(x=>x.failureType==='CONTEXT_MISMATCH')?'CONTEXT_MISMATCH':attempts.some(x=>x.failureType==='INCOMPLETE_WEEK')?'INCOMPLETE_WEEK':'FETCH_EXCEPTION';
  return json({error:'NFL schedule upstream unavailable.',failureType,upstreamStatus:failureType==='UPSTREAM_HTTP_ERROR'?(lastHttp?.upstreamStatus??null):null,sourceUrl:last.sourceUrl||null,attempts:attempts.map(x=>({failureType:x.failureType,upstreamStatus:x.upstreamStatus,sourceEvents:x.sourceEvents??null}))},502);
}

async function handleFantasyPros(request,url){
  if(request.method==='OPTIONS') return new Response(null,{headers:cors()});
  if(request.method!=='GET') return json({error:'Nur GET ist erlaubt.'},405);
  if(url.searchParams.get('health')==='1') return json({ok:true,service:'fantasypros-proxy',version:'9.8.0-coach-return-research-2026'});

  const path=url.searchParams.get('path')||'';
  if(!path.startsWith('/')||!ALLOWED_PREFIXES.some(prefix=>path.startsWith(prefix))){
    return json({error:'Nicht erlaubter API-Pfad.',path},400);
  }
  if(path.includes('/projections?')){
    const upstreamUrl=new URL(UPSTREAM+path),week=Number(upstreamUrl.searchParams.get('week'));
    const ros=upstreamUrl.searchParams.get('ros');
    if(!Number.isInteger(week)||week<1||week>18||(ros!==null&&ros!=='false')){
      return json({error:'Weekly projections require an explicit week without ROS ambiguity.'},400);
    }
  }
  const key=request.headers.get('x-fp-key');
  if(!key) return json({error:'API-Key fehlt.'},401);

  try{
    const upstream=await fetch(`${UPSTREAM}${path}`,{
      headers:{'x-api-key':key,'accept':'application/json'},
      cf:{cacheTtl:0,cacheEverything:false}
    });
    const body=await upstream.text();
    const headers={...cors(),'content-type':upstream.headers.get('content-type')||'application/json','x-upstream-status':String(upstream.status),'cache-control':'no-store'},retryAfter=upstream.headers.get('retry-after');
    if(retryAfter)headers['retry-after']=retryAfter;
    return new Response(body,{status:upstream.status,headers});
  }catch(error){
    return json({error:'FantasyPros nicht erreichbar.',detail:error?.message||String(error)},502);
  }
}

function cors(){return {'access-control-allow-origin':'*','access-control-allow-headers':'x-fp-key,content-type','access-control-allow-methods':'GET,OPTIONS'}}
function json(value,status=200){return new Response(JSON.stringify(value),{status,headers:{...cors(),'content-type':'application/json','cache-control':'no-store'}})}

const BOONE_DISCOVERY_URL='https://sports.yahoo.com/author/justin-boone/';
const BOONE_NEWS_URLS=['https://sports.yahoo.com/fantasy/news/','https://sports.yahoo.com/fantasy/football/news/'];
const BOONE_HTML_LIMIT=2*1024*1024;
async function boundedText(response,limit=BOONE_HTML_LIMIT){
  const declared=Number(response.headers.get('content-length'));if(Number.isFinite(declared)&&declared>limit)throw new Error('HTML_TOO_LARGE');
  if(!response.body)throw new Error('HTML_BODY_MISSING');
  const reader=response.body.getReader(),decoder=new TextDecoder(),parts=[];let bytes=0;
  try{for(;;){const {done,value}=await reader.read();if(done)break;bytes+=value.byteLength;if(bytes>limit)throw new Error('HTML_TOO_LARGE');parts.push(decoder.decode(value,{stream:true}));}parts.push(decoder.decode());return parts.join('');}
  finally{reader.releaseLock();}
}
async function fetchBooneHtml(url,cacheTtl=1800){
  const response=await fetch(url,{signal:AbortSignal.timeout(5000),headers:{accept:'text/html,application/xhtml+xml','user-agent':'Mozilla/5.0 (compatible; PITTI-Companion/11.8; +https://pages.dev)'},cf:{cacheTtl,cacheEverything:true}});
  if(!response.ok)throw new Error(`HTTP_${response.status}`);return boundedText(response);
}
function booneFailure(error){
  const http=String(error?.message||'').match(/^HTTP_(\d{3})$/);
  if(http)return{failureType:'HTTP_'+http[1],upstreamStatus:Number(http[1])};
  return{failureType:['HTML_TOO_LARGE','HTML_BODY_MISSING'].includes(error?.message)?error.message:['TimeoutError','AbortError'].includes(error?.name)?'TIMEOUT':'NETWORK_ERROR',upstreamStatus:null};
}
async function discoverBooneCandidates({season,week}){
  const candidates=Object.fromEntries(POSITIONS.map(p=>[p,[]])),attempts=[],pages=new Map(),seeded=new Set();
  const merge=found=>{for(const p of POSITIONS)for(const url of found[p])if(candidates[p].length<2&&!candidates[p].includes(url))candidates[p].push(url);};
  const complete=()=>POSITIONS.every(p=>candidates[p].length);
  const counts=()=>Object.fromEntries(POSITIONS.map(p=>[p,candidates[p].length]));
  const article=url=>{if(!pages.has(url))pages.set(url,fetchBooneHtml(url));return pages.get(url);};
  for(const [i,url] of [BOONE_DISCOVERY_URL,...BOONE_NEWS_URLS].entries()){
    if(complete())break;
    const lane=['AUTHOR','FANTASY_NEWS','FANTASY_FOOTBALL_NEWS'][i];
    try{
      const html=await fetchBooneHtml(url,900),found=discoverBooneTradeChartUrls(html,{season,week});merge(found);
      const positions=POSITIONS.filter(p=>found[p].length);
      attempts.push({discoverySource:url,status:'FETCHED',failureType:positions.length?null:lane+'_NO_EXACT_WEEK_SEED',upstreamStatus:200,candidateCounts:counts(),positionsDiscovered:positions});
    }catch(error){const failure=booneFailure(error);attempts.push({discoverySource:url,status:'FAILED',...failure,failureType:lane+'_'+failure.failureType,candidateCounts:counts(),positionsDiscovered:[]});}
    // At most two validated seed articles, no recursive crawl or pagination.
    for(const position of POSITIONS){
      if(complete()||seeded.size>=2)break;
      const seed=candidates[position].find(u=>!seeded.has(u));if(!seed)continue;seeded.add(seed);
      try{
        const html=await article(seed),parsed=parseBooneChartHtml(html,{position,season,week,sourceUrl:seed});
        if(!parsed.ok){attempts.push({discoverySource:seed,status:'REJECTED',failureType:'SEED_PARSE_REJECTED',reason:parsed.reason});continue;}
        merge(discoverBooneTradeChartUrls(html,{season,week}));
        attempts.push({discoverySource:seed,status:'VALIDATED_SEED',failureType:complete()?null:'SEED_CROSSLINKS_INCOMPLETE',candidateCounts:counts(),positionsDiscovered:POSITIONS.filter(p=>candidates[p].length)});
      }catch(error){attempts.push({discoverySource:seed,status:'FAILED',...booneFailure(error)});}
    }
  }
  return{candidates,attempts,article};
}
async function handleBooneTradeValues(request,url){
  if(request.method!=='GET')return json({error:'Nur GET ist erlaubt.'},405);
  const season=Number(url.searchParams.get('season')),week=Number(url.searchParams.get('week'));
  if(season!==2026||!Number.isInteger(week)||week<1||week>18)return json({error:'Boone-Kontext ungültig.'},400);
  const verifiedAt=Date.now();
  try{
    const [discovery,playersResponse]=await Promise.all([
      discoverBooneCandidates({season,week}),
      fetch('https://api.sleeper.app/v1/players/nfl',{headers:{accept:'application/json'},cf:{cacheTtl:86400,cacheEverything:true}})
    ]);
    if(!playersResponse.ok)return json({error:`Sleeper players HTTP ${playersResponse.status}`},502);
    const sleeperPlayers=await playersResponse.json(),discovered=discovery.candidates,charts={};
    await Promise.all(POSITIONS.map(async position=>{
      const candidates=[...(week===1?[WEEK1_URLS[position]]:[]),...(discovered[position]||[])].filter((value,index,all)=>value&&all.indexOf(value)===index).slice(0,2),errors=[];
      for(const sourceUrl of candidates){try{const html=await discovery.article(sourceUrl),parsed=parseBooneChartHtml(html,{position,season,week,sourceUrl,now:verifiedAt});if(parsed.ok){charts[position]=parsed;return;}errors.push('SOURCE_PARSE_REJECTED:'+parsed.reason);}catch(error){errors.push(booneFailure(error).failureType);}}
      charts[position]={ok:false,position,reason:errors.join('|')||'SOURCE_URL_UNAVAILABLE'};
    }));
    const snapshot=buildBooneTradeValueSnapshot({charts,sleeperPlayers,season,week,verifiedAt});
    snapshot.acquisition={attempts:discovery.attempts,candidateCounts:Object.fromEntries(POSITIONS.map(p=>[p,Math.min(2,discovered[p].length+(week===1?1:0))])),terminal:Object.fromEntries(POSITIONS.map(p=>[p,charts[p].ok?'VALIDATED':charts[p].reason]))};
    if(snapshot.status!=='AVAILABLE')return json({error:'Boone Trade Values unvollständig; keine Records freigegeben.',...snapshot,rejections:snapshot.rejections.slice(0,100)},422);
    return json(snapshot);
  }catch(error){return json({error:'Boone Trade Values nicht erreichbar.',acquisition:booneFailure(error)},502);}
}


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
  const normalized=String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/['’]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
  // FantasyPros' public Wheeler page uses his canonical first-name slug "kevin-wheeler"
  // although the published expert display name is "Kev Wheeler".
  if(normalized==='kev-wheeler')return 'kevin-wheeler';
  return normalized;
}
async function fetchHtml(url){
  const r=await fetch(url,{headers:{
    'accept':'text/html,application/xhtml+xml',
    'user-agent':'Mozilla/5.0 (compatible; DraftCompanion/11.8; +https://pages.dev)'
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
  // Source parsing intentionally keeps K/DST so original Overall rank numbers
  // are never altered by removing non-draftable positions too early.
  const m=String(text||'').toUpperCase().match(/\b(QB|RB|WR|TE|K|DST)\s*[-#]?\s*(\d+)?\b/);
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
    // FantasyPros' expert selector carries the numeric expert id in row controls/links.
    // Preserve it when present so Custom-ECR can be built even if the authenticated
    // /rankings/experts endpoint is temporarily unavailable. Never infer an id from order.
    const idMatch=row.html.match(/(?:data-expert-id|data-expert|expert_id|expert-id|value)=["'](\d{1,9})["']/i)
      ||row.html.match(/[?&](?:expert|expert_id|experts|filters)=(\d{1,9})(?:[&#"']|$)/i);
    const apiId=idMatch?String(idMatch[1]):null;
    const sourceMatch=txt.match(/\(([^)]+)\)/);
    if(sourceMatch)site=sourceMatch[1];
    experts.push({name,site,slug,directPublic,comparisonPublic,apiId});
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
function expectedScoringLabel(scoring){return scoring==='PPR'?'PPR':scoring==='STD'?'Standard':'Half Point PPR'}
function validateFantasyProsContext(html,season,scoring){
  const plain=stripHtml(html),expected=expectedScoringLabel(scoring);
  const yearOk=new RegExp(`\\b${String(season)}\\b`).test(plain);
  const scoringOk=scoring==='HALF'
    ?/Half Point PPR Rankings|Half PPR Rankings/i.test(plain)
    :scoring==='PPR'
      ?/\\bPPR Rankings\\b/i.test(plain)&&!/Half Point PPR/i.test(plain)
      :/Standard Rankings|Non-PPR Rankings/i.test(plain);
  const draftOk=/Overall .*Rankings|Draft Rankings/i.test(plain);
  const updated=plain.match(/Rankings\\s*-\\s*([A-Z][a-z]{2,8}\\s+\\d{1,2},\\s+20\\d{2})/i)?.[1]||'';
  return {ok:yearOk&&scoringOk&&draftOk,yearOk,scoringOk,draftOk,expected,updated};
}
async function tryFantasyProsDirect(name,scoring,season='2026'){
  const slug=slugify(name),url=`https://www.fantasypros.com/nfl/rankings/${slug}.php?scoring=${scoring}&type=draft`;
  try{
    const html=await fetchHtml(url),context=validateFantasyProsContext(html,season,scoring),players=parseFantasyProsDirect(html);
    if(!context.ok)return {ok:false,error:`FantasyPros direkt: Scoring/Saison nicht verifiziert (${context.expected}, ${season})`,context};
    if(players.length>=80)return {ok:true,source:'FantasyPros direkte Einzelrangliste',sourceUrl:url,players,updated:context.updated,
      sourceContextVerified:true,sourceSeason:String(season),sourceScoring:scoring,sourceContext:context};
    return {ok:false,error:`FantasyPros direkt: ${players.length} Spieler`,context};
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
const ROTOBALLER_MARIANO_HALF_PPR_URLS=[
  'https://www.rotoballer.com/updated-top-400-half-ppr-fantasy-football-rankings-2026/1916255',
  'https://www.rotoballer.com/top-400-updated-half-ppr-fantasy-football-rankings-2026/1910000',
  'https://www.rotoballer.com/fantasy-football-draft-rankings-august-updates-2026/1905031'
]
function parseRotoBallerOverall(html){
  const out=[],seen=new Set();
  for(const row of tableRows(html)){
    const c=row.cells;
    if(c.length<3)continue;
    let rank=null,name='',pp=null;
    // Current RotoBaller overall tables are Tier | Rank | Player Name | Pos.
    // Rank is the numeric cell immediately before the player-name cell, not Tier.
    let posIndex=-1;
    for(let i=0;i<c.length;i++){const p=parsePosToken(c[i]);if(p){pp=p;posIndex=i;break}}
    if(!pp||posIndex<2)continue;
    const nameIndex=posIndex-1;
    name=String(c[nameIndex]||'').trim();
    for(let i=nameIndex-1;i>=0;i--){
      const n=Number(String(c[i]||'').trim());
      if(Number.isFinite(n)&&n>=1&&n<=500){rank=n;break}
    }
    if(!rank||!pp)continue;
    if(!name||!/\p{L}/u.test(name)||seen.has(name.toLowerCase()))continue;
    seen.add(name.toLowerCase());out.push({rank,name,pos:pp.pos,posRank:pp.posRank});
  }
  return out.sort((a,b)=>a.rank-b.rank);
}
async function tryRotoBallerMariano(name,scoring,season='2026'){
  if(!/nick mariano/i.test(name))return {ok:false,error:'kein Mariano-Adapter'};
  if(scoring!=='HALF')return {ok:false,error:'RotoBaller Mariano Adapter nur für Half-PPR freigegeben'};
  const errors=[];
  for(const url of ROTOBALLER_MARIANO_HALF_PPR_URLS){
    try{
      const html=await fetchHtml(url),plain=stripHtml(html);
      if(!new RegExp('\\b'+season+'\\b').test(plain)||!/half[- ]?ppr/i.test(plain)||!/Nick Mariano/i.test(plain)){
        errors.push(url+': Kontext nicht verifiziert');continue;
      }
      // Reject stale fallback whenever the page itself exposes a newer Mariano
      // Half-PPR publication link. This prevents silently accepting an older board.
      const newer=[...String(html).matchAll(/href=["']([^"']*half-ppr[^"']*2026[^"']*)["']/gi)]
        .map(m=>m[1]).filter(x=>/1916255/.test(x));
      if(!/1916255/.test(url)&&newer.length){errors.push(url+': neuere Mariano-Half-PPR-Publikation vorhanden');continue}
      const players=parseRotoBallerOverall(html);
      const draftable=players.filter(x=>['QB','RB','WR','TE'].includes(x.pos));
      if(draftable.length>=120)return {
        ok:true,source:'RotoBaller – Nick Mariano Half-PPR Overall',sourceUrl:url,players,
        exactCount:players.length,reconstructedCount:0,coverage:1,confidence:'external-exact',
        updated:'',sourceContextVerified:true,sourceSeason:String(season),sourceScoring:'HALF',
        sourceContext:{ok:true,method:'RotoBaller published Nick Mariano Half-PPR overall table'}
      };
      errors.push(url+': nur '+draftable.length+' draftbare Zeilen');
    }catch(e){errors.push(url+': '+e.message)}
  }
  return {ok:false,error:'RotoBaller Mariano: '+errors.join(' | ')};
}
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

function median(nums){
  const a=nums.filter(Number.isFinite).sort((x,y)=>x-y);
  if(!a.length)return null;
  const m=Math.floor(a.length/2);
  return a.length%2?a[m]:(a[m-1]+a[m])/2;
}
function comparisonTables(html,targetName){
  const target=String(targetName||'').toLowerCase();
  const out=new Map();
  for(const tm of String(html||'').matchAll(/<table\b[^>]*>([\s\S]*?)<\/table>/gi)){
    const table=tm[1],rows=tableRows(table);
    if(!rows.length)continue;
    let header=null,targetCol=-1,playerCol=-1;
    for(const row of rows){
      const lower=row.cells.map(x=>x.toLowerCase());
      const pc=lower.findIndex(x=>x==='player'||x.includes('player'));
      const tc=lower.findIndex(x=>x.includes(target)&&x.includes('rank'));
      if(pc>=0&&tc>=0){header=row;playerCol=pc;targetCol=tc;break}
    }
    if(!header)continue;
    let after=false;
    for(const row of rows){
      if(row===header){after=true;continue}
      if(!after||row.cells.length<=Math.max(playerCol,targetCol))continue;
      const rank=Number(String(row.cells[targetCol]||'').match(/(\d{1,3})/)?.[1]);
      const ptxt=String(row.cells[playerCol]||'').trim();
      if(!Number.isFinite(rank)||!ptxt)continue;
      const pm=ptxt.match(/^(.*?)\s+[A-Z]{2,3}\s*-\s*(QB|RB|WR|TE|K|DST)\b/i);
      const name=(pm?pm[1]:ptxt).trim(),pos=(pm?pm[2]:'').toUpperCase();
      if(!name||!['QB','RB','WR','TE','K','DST'].includes(pos))continue;
      out.set(name.toLowerCase(),{name,pos,rank,exact:true});
    }
  }
  return out;
}
async function fetchComparisonPair(targetName,anchorName,scoring){
  const target=slugify(targetName),anchor=slugify(anchorName);
  const urls=[
    `https://www.fantasypros.com/nfl/rankings/${anchor}-${target}.php?scoring=${scoring}&type=draft`,
    `https://www.fantasypros.com/nfl/rankings/${target}-${anchor}.php?scoring=${scoring}&type=draft`
  ];
  const errors=[];
  for(const url of urls){
    try{
      const html=await fetchHtml(url),rows=comparisonTables(html,targetName);
      if(rows.size)return {ok:true,url,rows};
      errors.push(`${url}: 0 exakte Zeilen`);
    }catch(e){errors.push(`${url}: ${e.message}`)}
  }
  return {ok:false,errors};
}
async function directRankingForAnchor(name,scoring,season='2026'){
  const res=await tryFantasyProsDirect(name,scoring,season);
  if(!res.ok)return null;
  // Keep every ranked position here. Original Overall numbers include K/DST.
  // Draft filtering happens later in app.js, never inside the source reconstruction.
  return res.players.filter(x=>['QB','RB','WR','TE','K','DST'].includes(x.pos));
}

function reconstructionQuality(players,exactCount,reconstructedCount){
  const draftable=players.filter(x=>['QB','RB','WR','TE'].includes(x.pos));
  const exactDraftable=draftable.filter(x=>x.exact!==false);
  const reconstructedDraftable=draftable.filter(x=>x.exact===false);
  const exactCoverage=draftable.length?exactDraftable.length/draftable.length:0;
  const avgSpread=reconstructedDraftable.length
    ?reconstructedDraftable.reduce((s,x)=>s+(Number(x.spread)||0),0)/reconstructedDraftable.length
    :0;
  const maxSpread=reconstructedDraftable.length
    ?Math.max(...reconstructedDraftable.map(x=>Number(x.spread)||0))
    :0;

  const reasons=[];
  if(draftable.length<120)reasons.push(`nur ${draftable.length} draftbare Spieler`);
  if(exactDraftable.length<50)reasons.push(`nur ${exactDraftable.length} exakte draftbare Ränge`);
  if(exactCoverage<0.55)reasons.push(`nur ${Math.round(exactCoverage*100)}% exakte Abdeckung`);
  if(avgSpread>9)reasons.push(`mittlerer Rekonstruktions-Spread ${avgSpread.toFixed(1)} > 9`);
  if(maxSpread>14)reasons.push(`maximaler Spread ${maxSpread} > 14`);

  return {
    ok:reasons.length===0,
    reasons,
    draftableCount:draftable.length,
    exactDraftableCount:exactDraftable.length,
    reconstructedDraftableCount:reconstructedDraftable.length,
    exactCoverage,
    avgSpread,
    maxSpread
  };
}

async function tryFantasyProsReconstruction(name,scoring,season='2026'){
  const anchors=['Pat Fitzmaurice','Andrew Erickson','Derek Brown'];
  const anchorLists={},comparisons=[],exact=new Map();

  for(const anchor of anchors){
    const list=await directRankingForAnchor(anchor,scoring,season);
    if(list&&list.length>=80)anchorLists[anchor]=list;
  }
  const usableAnchors=Object.keys(anchorLists);
  if(usableAnchors.length<2)return {ok:false,error:`Rekonstruktion: nur ${usableAnchors.length} Ankerlisten verfügbar`};

  for(const anchor of usableAnchors){
    const cmp=await fetchComparisonPair(name,anchor,scoring);
    if(cmp.ok){
      comparisons.push({anchor,url:cmp.url,count:cmp.rows.size});
      for(const [k,v] of cmp.rows){
        const prev=exact.get(k);
        if(!prev||prev.rank===v.rank)exact.set(k,v);
      }
    }
  }
  if(!comparisons.length||exact.size<20)return {ok:false,error:`Rekonstruktion: nur ${exact.size} exakte Comparison-Ränge`};

  // Candidate universe from the trusted direct anchors. Missing target rows on a dissent page
  // mean "no large disagreement", not "no ranking". Estimate those from the anchor median and
  // mark them explicitly as reconstructed; exact comparison ranks always override estimates.
  const universe=new Map();
  for(const [anchor,list] of Object.entries(anchorLists)){
    for(const row of list){
      const k=row.name.toLowerCase(),u=universe.get(k)||{name:row.name,pos:row.pos,anchorRanks:[]};
      u.anchorRanks.push(Number(row.rank));
      universe.set(k,u);
    }
  }

  const players=[];
  for(const [k,u] of universe){
    if(exact.has(k)){
      const e=exact.get(k);
      const anchorRanks=u.anchorRanks.filter(Number.isFinite);
      const spread=anchorRanks.length?Math.max(...anchorRanks)-Math.min(...anchorRanks):0;
      players.push({...e,pos:e.pos||u.pos,posRank:null,spread,anchors:anchorRanks.length});
    }else{
      const ar=u.anchorRanks.filter(Number.isFinite);
      if(ar.length<2)continue;
      const m=median(ar),spread=Math.max(...ar)-Math.min(...ar);
      // Conservative inclusion: if the trusted anchors strongly disagree, this is too uncertain
      // to impute for the target expert.
      if(!Number.isFinite(m)||spread>14)continue;
      players.push({name:u.name,pos:u.pos,rank:m,posRank:null,exact:false,spread,anchors:ar.length});
    }
  }

  players.sort((a,b)=>a.rank-b.rank||Number(b.exact)-Number(a.exact)||a.name.localeCompare(b.name));
  const exactCount=players.filter(x=>x.exact).length,reconstructedCount=players.length-exactCount;
  const coverage=players.length?exactCount/players.length:0;
  const quality=reconstructionQuality(players,exactCount,reconstructedCount);
  if(!quality.ok)return {
    ok:false,
    error:`Rekonstruktion Qualitätsprüfung nicht bestanden: ${quality.reasons.join(', ')}`,
    quality
  };

  return {
    ok:true,
    source:'FantasyPros Comparison-Rekonstruktion',
    sourceUrl:comparisons.map(x=>x.url).join(' | '),
    players,
    exactCount,reconstructedCount,coverage,
    quality,
    confidence:quality.exactCoverage>=.70?'reconstructed-strong':'reconstructed',
    updated:'',
    sourceContextVerified:true,sourceSeason:String(season),sourceScoring:scoring,
    sourceContext:{ok:true,method:'validated direct anchors + scoring-param comparison'},
    comparisons
  };
}
async function handleExpertRanking(request,url){
  if(request.method!=='GET')return json({error:'Nur GET ist erlaubt.'},405);
  const name=String(url.searchParams.get('name')||'').trim();
  const site=String(url.searchParams.get('site')||'').trim();
  const season=String(url.searchParams.get('season')||new Date().getFullYear());
  const scoring=scoringCode(url.searchParams.get('scoring'));
  if(!name||name.length<3)return json({error:'Expertenname fehlt.'},400);
  if(season!=='2026')return json({error:`Multi-Source-Adapter derzeit nur für Saison ${season} validiert.`},422);

  const attempts=[];

  // Nick Mariano's current 2026 Half-PPR overall board is published by RotoBaller,
  // while FantasyPros does not expose a usable individual Overall page. Prefer the
  // named expert's own published board rather than reconstructing/renormalizing it.
  if(/nick mariano/i.test(name)&&scoring==='HALF'){
    const rb=await tryRotoBallerMariano(name,scoring,season);attempts.push(rb.error||rb.source);
    if(rb.ok)return json(rb);
  }

  // 1) Exact public individual list.
  const fp=await tryFantasyProsDirect(name,scoring,season);attempts.push(fp.error||fp.source);
  if(fp.ok){
    return json({...fp,exactCount:fp.players.length,reconstructedCount:0,coverage:1,confidence:'exact'});
  }

  // 2) Generic FantasyPros reconstruction against several exact anchor experts.
  const rec=await tryFantasyProsReconstruction(name,scoring,season);attempts.push(rec.error||rec.source);
  if(rec.ok)return json(rec);

  // 3) External official source as final fallback, where available.
  if(/yahoo/i.test(site)||/Justin Boone|Matt Harmon/i.test(name)){
    const yh=await tryYahooExpert(name);attempts.push(yh.error||yh.source);
    if(yh.ok)return json({...yh,exactCount:yh.players.length,reconstructedCount:0,coverage:1,confidence:'external-exact'});
  }

  return json({error:`${name}: keine ausreichend vollständige automatische Overall-Quelle. ${attempts.filter(Boolean).join(' | ')}`},404);
}

async function handleSeasonPlayers(request){
  if(request.method!=='GET')return json({error:'GET required'},405);
  try{
    const fetchedAt=Date.now();
    // Unlike the daily ADP directory, decision identity must fit the six-hour bound.
    const response=await fetch('https://api.sleeper.app/v1/players/nfl',{signal:AbortSignal.timeout(12000),headers:{accept:'application/json'},cf:{cacheTtl:0,cacheEverything:false}});
    if(!response.ok)throw Error('DIRECTORY_HTTP_'+response.status);
    const raw=JSON.parse(await boundedText(response,32*1024*1024)),players={};
    if(!raw||Array.isArray(raw)||typeof raw!=='object')throw Error('DIRECTORY_SHAPE');
    const fields=['full_name','first_name','last_name','position','team','active','search_rank','injury_status','bye_week','years_exp','fantasy_data_id'];
    for(const [id,p] of Object.entries(raw)){
      if(!/^[a-zA-Z0-9]+$/.test(id)||!p||!['QB','RB','WR','TE','K','DEF','DST'].includes(p.position))continue;
      const row={player_id:id};for(const key of fields){const value=p[key];if(value===null||typeof value==='boolean'||(typeof value==='number'&&Number.isFinite(value))||(typeof value==='string'&&value.length<=120))row[key]=value;}
      players[id]=row;
    }
    const count=Object.keys(players).length;if(!count||count>12000)throw Error('DIRECTORY_COUNT');
    const body=JSON.stringify({schema:'pitti.players.v1',fetchedAt,players});if(new TextEncoder().encode(body).byteLength>2*1024*1024)throw Error('DIRECTORY_TOO_LARGE');
    return new Response(body,{headers:{...cors(),'content-type':'application/json','cache-control':'no-store'}});
  }catch{return json({error:'Compact player directory unavailable'},502);}
}
