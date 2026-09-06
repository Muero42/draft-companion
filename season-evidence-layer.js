(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.PittiSeasonEvidence=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const SCHEMA='pitti.season-evidence.v1';
  const STATUS={AVAILABLE:'AVAILABLE',STALE:'STALE',UNVERIFIED:'UNVERIFIED',UNAVAILABLE:'UNAVAILABLE',CONFLICT:'CONFLICT',UNKNOWN:'UNKNOWN'};
  const iso=value=>{const ms=Date.parse(value||'');return Number.isFinite(ms)?new Date(ms).toISOString():null;};
  const finite=value=>Number.isFinite(Number(value))?Number(value):null;

  function normalizeDatum(kind,value,meta={},options={}){
    const now=options.now??Date.now(),maxAgeMs=options.maxAgeMs??7*86400000;
    const source=String(meta.provider||meta.source||'').trim()||null;
    const sourceAsOf=iso(meta.sourceAsOf||meta.source_as_of||meta.as_of||meta.asOf);
    const ingestedAt=iso(meta.ingestedAt||meta.ingested_at||new Date(now).toISOString());
    const verifiedAt=iso(meta.verifiedAt||meta.verified_at);
    const asOfMs=Date.parse(sourceAsOf||''),future=Number.isFinite(asOfMs)&&asOfMs>now+3600000;
    const fresh=Number.isFinite(asOfMs)&&!future&&now-asOfMs<=maxAgeMs;
    const verified=meta.verified===true||!!verifiedAt;
    const status=!source||!sourceAsOf||value==null?STATUS.UNAVAILABLE:!verified?STATUS.UNVERIFIED:!fresh?STATUS.STALE:STATUS.AVAILABLE;
    return{schema:SCHEMA,kind,value:value??null,unit:meta.unit||null,provider:source,sourceAsOf,ingestedAt,verifiedAt,week:Number(meta.week)||null,gameId:meta.gameId||meta.game_id||null,playerId:meta.playerId||meta.player_id||null,team:meta.team||null,status,fresh:status===STATUS.AVAILABLE};
  }

  function projectionAdapter(payload,options={}){
    const rows=[];
    for(const [playerId,raw] of Object.entries(payload?.players||{})){
      const meta={...payload,...raw,playerId,sourceAsOf:raw.source_as_of||raw.as_of||payload.source_as_of||payload.as_of};
      rows.push(normalizeDatum('PLAYER_PROJECTION',finite(raw.projected_points??raw.projection_half_ppr??raw.projection),{...meta,unit:'HALF_PPR_POINTS'},options));
      rows.push(normalizeDatum('POSITIONAL_RANK',finite(raw.positional_rank??raw.rank),{...meta,unit:'POSITION_RANK'},options));
      rows.push(normalizeDatum('OPPONENT',raw.opponent||null,meta,options));
    }
    return rows;
  }

  function gameAdapter(payload,options={}){
    const rows=[];
    for(const game of payload?.games||[]){
      const common={...payload,...game,sourceAsOf:game.source_as_of||game.as_of||payload.source_as_of||payload.as_of};
      rows.push(normalizeDatum('GAME_TOTAL',finite(game.total),{...common,unit:'POINTS'},options));
      for(const side of game.teams||[])rows.push(normalizeDatum('TEAM_SPREAD',finite(side.spread),{...common,...side,team:side.team,unit:'POINTS'},options));
    }
    return rows;
  }

  function contextAdapter(payload,options={}){
    const rows=[];
    for(const game of payload?.games||[]){
      const common={...payload,...game,sourceAsOf:game.source_as_of||game.as_of||payload.source_as_of||payload.as_of};
      rows.push(normalizeDatum('STADIUM_TYPE',game.stadium_type||null,common,options));
      if(game.weather)rows.push(normalizeDatum('WEATHER',game.weather,common,options));
    }
    return rows;
  }

  function createCache(records=[]){return{schema:SCHEMA,records:[...records]};}
  function ingest(cache,records){return createCache([...(cache?.records||[]),...(records||[])]);}
  function select(cache,query={}){
    const matching=(cache?.records||[]).filter(r=>r.kind===query.kind&&(!query.playerId||r.playerId===query.playerId)&&(!query.team||r.team===query.team)&&(!query.gameId||r.gameId===query.gameId)&&Number(r.week)===Number(query.week));
    const available=matching.filter(r=>r.status===STATUS.AVAILABLE);
    if(!available.length)return{status:matching[0]?.status||STATUS.UNAVAILABLE,value:null,record:null,candidates:matching};
    const signatures=new Set(available.map(r=>`${r.provider}|${r.sourceAsOf}|${JSON.stringify(r.value)}`));
    if(signatures.size>1)return{status:STATUS.CONFLICT,value:null,record:null,candidates:available};
    return{status:STATUS.AVAILABLE,value:available[0].value,record:available[0],candidates:available};
  }

  function impliedTeamTotal(cache,{week,gameId,team}={}){
    const total=select(cache,{kind:'GAME_TOTAL',week,gameId}),spread=select(cache,{kind:'TEAM_SPREAD',week,gameId,team});
    if(total.status!==STATUS.AVAILABLE||spread.status!==STATUS.AVAILABLE)return{status:STATUS.UNAVAILABLE,value:null,formula:'team_total = game_total / 2 - team_spread / 2',inputs:{total,spread}};
    return{status:STATUS.AVAILABLE,value:total.value/2-spread.value/2,formula:'team_total = game_total / 2 - team_spread / 2',inputs:{total:total.record,spread:spread.record},provenance:[total.record,spread.record]};
  }

  function weatherImpact(cache,{week,gameId}={}){
    const stadium=select(cache,{kind:'STADIUM_TYPE',week,gameId});
    const type=String(stadium.value||'').toUpperCase();
    if(['DOME','INDOOR','RETRACTABLE_CLOSED'].includes(type))return{status:stadium.status,material:false,caution:null,suppressed:true,reason:'INDOOR_WEATHER_SUPPRESSED',provenance:stadium.record?[stadium.record]:[]};
    const weather=select(cache,{kind:'WEATHER',week,gameId});
    if(weather.status!==STATUS.AVAILABLE)return{status:weather.status,material:false,caution:null,suppressed:false,reason:'WEATHER_UNAVAILABLE',provenance:weather.candidates};
    const wind=finite(weather.value?.wind_mph),precip=finite(weather.value?.precip_probability),temp=finite(weather.value?.temperature_f);
    const reasons=[];
    if(wind!=null&&wind>=15)reasons.push(`WIND_${wind}_MPH`);
    if(precip!=null&&precip>=60)reasons.push(`PRECIP_${precip}_PCT`);
    if(temp!=null&&(temp<=20||temp>=95))reasons.push(`EXTREME_TEMP_${temp}_F`);
    return{status:STATUS.AVAILABLE,material:reasons.length>0,caution:reasons.length?reasons.join(' / '):null,suppressed:false,reason:reasons.length?'FANTASY_RELEVANT_WEATHER':'TRIVIAL_WEATHER',provenance:[weather.record]};
  }

  function toLineupEvidence(cache,{week,playerIds=[]}={}){
    const values={},conflicts=[];
    for(const playerId of playerIds){
      const projection=select(cache,{kind:'PLAYER_PROJECTION',week,playerId}),rank=select(cache,{kind:'POSITIONAL_RANK',week,playerId}),opponent=select(cache,{kind:'OPPONENT',week,playerId});
      if([projection,rank,opponent].some(x=>x.status===STATUS.CONFLICT))conflicts.push({playerId,projection,rank,opponent});
      const gameIds=new Set([projection.record,rank.record,opponent.record].map(x=>x?.gameId).filter(Boolean));
      if(gameIds.size>1)conflicts.push({playerId,reason:'TARGET_GAME_MISMATCH',projection,rank,opponent});
      if(gameIds.size<=1&&[projection,rank,opponent].every(x=>x.status===STATUS.AVAILABLE)){
        const gameId=[...gameIds][0]||null,team=projection.record.team||rank.record.team||opponent.record.team;
        const implied=team&&gameId?impliedTeamTotal(cache,{week,gameId,team}):null,weather=gameId?weatherImpact(cache,{week,gameId}):null;
        const contextProvenance=[...(implied?.provenance||[]),...(weather?.provenance||[])],contextTimes=contextProvenance.map(r=>Date.parse(r.sourceAsOf)).filter(Number.isFinite);
        const teamContext=implied?.status===STATUS.AVAILABLE||weather?.status===STATUS.AVAILABLE?{implied_total:implied?.status===STATUS.AVAILABLE?implied.value:null,dome:weather?.suppressed===true,weather:weather?.material?weather.caution:null,source:'Normalized Season Evidence',as_of:contextTimes.length?new Date(Math.min(...contextTimes)).toISOString():null,provenance:contextProvenance}:null;
        values[playerId]={projected_points:projection.value,positional_rank:rank.value,opponent:opponent.value,game_id:gameId,team_context:teamContext,provenance:{projection:projection.record,rank:rank.record,opponent:opponent.record}};
      }
    }
    const timestamps=Object.values(values).flatMap(v=>Object.values(v.provenance).map(r=>Date.parse(r.sourceAsOf))).filter(Number.isFinite);
    return{schema:'pitti.lineup-weekly-evidence.normalized.v1',week,scoring:'HALF_PPR',available:conflicts.length===0&&timestamps.length>0,source:'Normalized Season Evidence',as_of:timestamps.length?new Date(Math.min(...timestamps)).toISOString():null,players:values,conflicts,cacheSchema:cache?.schema};
  }

  return{SCHEMA,STATUS,normalizeDatum,projectionAdapter,gameAdapter,contextAdapter,createCache,ingest,select,impliedTeamTotal,weatherImpact,toLineupEvidence};
});
