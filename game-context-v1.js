(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.PittiGameContextV1=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const SCHEMA='pitti.game-context.v1',CACHE_KEY='pitti.game-context.v1.current',TTL_MS=6*60*60*1000;
const team=s=>String(s||'').trim().toUpperCase();
function buildSnapshot({season,week,events,verifiedAt=Date.now(),sourceUrl}={}){
 const games=[],seen=new Set(),rejections=[];
 for(const event of Array.isArray(events)?events:[]){
  const competition=event?.competitions?.[0],competitors=competition?.competitors||[],home=competitors.find(x=>x.homeAway==='home'),away=competitors.find(x=>x.homeAway==='away'),homeTeam=team(home?.team?.abbreviation),awayTeam=team(away?.team?.abbreviation),kickoff=Date.parse(event?.date||competition?.date||''),venue=String(competition?.venue?.fullName||event?.venue?.fullName||'').trim();
  if(!homeTeam||!awayTeam||homeTeam===awayTeam||!Number.isFinite(kickoff)||!venue||seen.has(homeTeam)||seen.has(awayTeam)){rejections.push({eventId:event?.id||null,reason:'AMBIGUOUS_OR_INCOMPLETE_EVENT'});continue;}
  seen.add(homeTeam);seen.add(awayTeam);const indoor=competition?.venue?.indoor,roof=indoor===true?'DOME':indoor===false?'OUTDOOR':'UNKNOWN';
  const weather=competition?.weather,weatherAt=Date.parse(weather?.lastUpdated||''),weatherValid=roof==='OUTDOOR'&&weather&&Number.isFinite(weatherAt)&&weatherAt<=verifiedAt&&verifiedAt-weatherAt<=TTL_MS;
  games.push({eventId:String(event.id||''),homeTeam,awayTeam,kickoffAt:new Date(kickoff).toISOString(),venue,roof,status:'VERIFIED',sourceId:'espn_nfl_scoreboard',sourceUrl,verifiedAt,expiresAt:verifiedAt+TTL_MS,weather:weatherValid?{status:'VERIFIED',summary:String(weather.displayValue||''),temperature:Number.isFinite(Number(weather.temperature))?Number(weather.temperature):null,sourceId:'espn_event_weather',sourceUrl,forecastAt:new Date(weatherAt).toISOString(),verifiedAt,expiresAt:Math.min(kickoff,verifiedAt+TTL_MS)}:{status:'UNAVAILABLE',reason:roof==='DOME'?'INDOOR_NO_WEATHER_REQUIRED':roof!=='OUTDOOR'?'ROOF_UNKNOWN':'FRESH_FORECAST_UNAVAILABLE'},vegas:{status:'UNAVAILABLE',reason:'NO_APPROVED_ROBUST_SOURCE'}});
 }
 const expectedGames=Array.isArray(events)?events.length:0,status=expectedGames>=2&&games.length===expectedGames?'AVAILABLE':games.length?'PARTIAL':'UNAVAILABLE';
 return{schema:SCHEMA,snapshotId:`game-${season}-${week}-${verifiedAt}`,season:Number(season),week:Number(week),verifiedAt,expiresAt:verifiedAt+TTL_MS,status,games:status==='AVAILABLE'?games:[],coverage:{games:games.length,teams:seen.size},rejections};
}
function validateSnapshot(snapshot,{season,week}={},now=Date.now()){if(snapshot?.schema!==SCHEMA)return{ok:false,reason:'SCHEMA'};if(snapshot.season!==Number(season)||snapshot.week!==Number(week))return{ok:false,reason:'CONTEXT_MISMATCH'};if(snapshot.status!=='AVAILABLE'||snapshot.games?.length<2||snapshot.coverage?.teams!==snapshot.games.length*2)return{ok:false,reason:'INCOMPLETE_WEEK'};if(!Number.isFinite(snapshot.verifiedAt)||snapshot.verifiedAt>now||snapshot.expiresAt<=now)return{ok:false,reason:'STALE'};return{ok:true};}
function contextForTeam(snapshot,abbr,now=Date.now()){const game=(snapshot?.games||[]).find(x=>x.homeTeam===team(abbr)||x.awayTeam===team(abbr));if(!game)return{status:'UNAVAILABLE',reason:'TEAM_NOT_MAPPED'};return{...game,team:team(abbr),opponent:game.homeTeam===team(abbr)?game.awayTeam:game.homeTeam,home:game.homeTeam===team(abbr),locked:now>=Date.parse(game.kickoffAt)};}
function impliedTeamTotal({total,spread,eventId,sourceId,verifiedAt,expiresAt,teamSide}){if(!Number.isFinite(total)||!Number.isFinite(spread)||!eventId||!sourceId||!Number.isFinite(verifiedAt)||!Number.isFinite(expiresAt)||expiresAt<=verifiedAt)return{status:'UNAVAILABLE',reason:'UNVERIFIED_TOTAL_SPREAD_PAIR'};return{status:'VERIFIED',value:(total+(teamSide==='FAVORITE'?-spread:spread))/2,eventId,sourceId,verifiedAt,expiresAt};}
return{SCHEMA,CACHE_KEY,TTL_MS,buildSnapshot,validateSnapshot,contextForTeam,impliedTeamTotal};
});
