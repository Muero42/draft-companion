(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.PittiWeeklyEvidenceV2=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const SCHEMA='pitti.weekly-evidence.v2';
  const CACHE_KEY='pitti.weekly-evidence.v2.current';
  const TEMP_KEY='pitti.weekly-evidence.v2.pending';
  const MAPPING_VERSION='fp-sleeper-v1';
  const MAX_AGE_MS=3*60*60*1000;
  const EVIDENCE_TTL_MS=24*60*60*1000;
  const POSITIONS=['QB','RB','WR','TE'];
  const MIN_COUNTS={QB:24,RB:60,WR:70,TE:24};
  const norm=value=>String(value||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\b(jr|sr|ii|iii|iv)\b\.?/g,'').replace(/[^a-z0-9]/g,'');
  const iso=ms=>new Date(ms).toISOString();
  const finite=value=>typeof value==='number'&&Number.isFinite(value)?value:null;
  const scoring=value=>['HALF','HALF_PPR','HALF-PPR'].includes(String(value||'').toUpperCase())?'HALF_PPR':null;

  function sourceTime(payload){
    for(const key of ['updated','last_updated','updated_at','as_of','date']){
      const raw=payload?.[key];
      if(raw==null||String(raw).trim()==='')continue;
      const value=String(raw).trim();
      if(/^\d{4}-\d{2}-\d{2}$/.test(value))return{sourcePublishedAt:null,sourcePublishedDate:value,sourceTimePrecision:'DATE'};
      const ms=typeof raw==='number'?(raw<1e12?raw*1000:raw):Date.parse(value);
      if(Number.isFinite(ms))return{sourcePublishedAt:iso(ms),sourcePublishedDate:null,sourceTimePrecision:'TIMESTAMP'};
    }
    return{sourcePublishedAt:null,sourcePublishedDate:null,sourceTimePrecision:'UNKNOWN'};
  }

  function sleeperIndexes(players){
    const byFp=new Map(),byNamePosition=new Map();
    for(const [id,player] of Object.entries(players||{})){
      if(!player||!POSITIONS.includes(String(player.position||'').toUpperCase()))continue;
      const row={id:String(id),name:player.full_name||[player.first_name,player.last_name].filter(Boolean).join(' '),position:String(player.position).toUpperCase(),team:String(player.team||'FA').toUpperCase()};
      const fp=String(player.fantasy_data_id??'').trim();
      if(fp){const rows=byFp.get(fp)||[];rows.push(row);byFp.set(fp,rows);}
      const key=`${norm(row.name)}|${row.position}`,rows=byNamePosition.get(key)||[];rows.push(row);byNamePosition.set(key,rows);
    }
    return{byFp,byNamePosition};
  }

  function mapFantasyProsPlayer(row,indexes){
    const fpid=String(row?.fpid??'').trim(),position=String(row?.position_id||row?.position||'').toUpperCase();
    if(fpid){const found=indexes.byFp.get(fpid)||[];if(found.length===1&&found[0].position===position)return{ok:true,player:found[0],method:'FANTASY_DATA_ID',sourcePlayerId:fpid};if(found.length>1)return{ok:false,reason:'FP_ID_COLLISION',sourcePlayerId:fpid};}
    const name=String(row?.name||row?.player_name||'').trim(),found=indexes.byNamePosition.get(`${norm(name)}|${position}`)||[];
    if(found.length!==1)return{ok:false,reason:found.length?'NAME_POSITION_COLLISION':'NO_MATCH',sourcePlayerId:fpid||null};
    const sourceTeam=String(row?.team_id||row?.team||'').toUpperCase(),sleeperTeam=found[0].team;
    if(sourceTeam&&sleeperTeam&&sourceTeam!=='FA'&&sleeperTeam!=='FA'&&sourceTeam!==sleeperTeam)return{ok:false,reason:'TEAM_MISMATCH',sourcePlayerId:fpid||null};
    return{ok:true,player:found[0],method:'EXACT_NAME_POSITION_TEAM',sourcePlayerId:fpid||null};
  }

  function projectionLane(payloads,{season,week,scoring:scoringInput,sleeperPlayers,verifiedAt=Date.now()}={}){
    const normalizedScoring=scoring(scoringInput),indexes=sleeperIndexes(sleeperPlayers),records=[],positions={},rejects=[];
    for(const position of POSITIONS){
      const payload=payloads?.[position],players=Array.isArray(payload?.players)?payload.players:[],time=sourceTime(payload);
      let reason='';
      if(!normalizedScoring)reason='WRONG_SCORING';
      else if(Number(payload?.season)!==Number(season))reason='WRONG_SEASON';
      else if(Number(payload?.week)!==Number(week))reason='WRONG_WEEK';
      else if(!Array.isArray(payload?.players))reason='MISSING_PLAYERS';
      else if(players.some(row=>String(row?.position_id||row?.position||'').toUpperCase()!==position))reason='WRONG_POSITION';
      const numeric=players.filter(row=>finite(row?.stats?.points_half)!=null).length,minimum=MIN_COUNTS[position],sourceSufficient=!reason&&players.length>=minimum&&numeric/Math.max(players.length,1)>=.9;
      let mapped=0;
      if(sourceSufficient){for(const row of players){
        const value=finite(row?.stats?.points_half);if(value==null)continue;
        const mapping=mapFantasyProsPlayer(row,indexes);if(!mapping.ok){rejects.push({position,name:String(row?.name||''),sourcePlayerId:mapping.sourcePlayerId,reason:mapping.reason});continue;}
        mapped++;
        records.push({schema:SCHEMA,playerId:mapping.player.id,sleeperId:mapping.player.id,sourcePlayerId:mapping.sourcePlayerId,mappingMethod:mapping.method,mappingVersion:MAPPING_VERSION,metric:'projected_points',value,unit:'HALF_PPR_POINTS',position,season:Number(season),week:Number(week),scoring:normalizedScoring,status:'VERIFIED',sourceId:'fantasypros',sourceUrl:`https://api.fantasypros.com/public/v2/json/nfl/${Number(season)}/projections?week=${Number(week)}&position=${position}&ros=false`,expert:null,...time,verifiedAt,expiresAt:verifiedAt+EVIDENCE_TTL_MS,provenance:{provider:'FantasyPros',field:'stats.points_half',requestScoringParameter:null,ros:false},confidence:mapping.method==='FANTASY_DATA_ID'?.98:.8});
      }}
      const mappingCoverage=numeric?mapped/numeric:0,status=sourceSufficient&&mappingCoverage>=.9?'AVAILABLE':sourceSufficient?'PARTIAL':'UNAVAILABLE';
      positions[position]={status,count:players.length,numericPointsHalf:numeric,mapped,mappingCoverage:Math.round(mappingCoverage*1000)/1000,reason:reason||(!sourceSufficient?'INSUFFICIENT_SOURCE_COVERAGE':status==='PARTIAL'?'INSUFFICIENT_MAPPING_COVERAGE':null),...time};
    }
    const available=POSITIONS.every(position=>positions[position].status==='AVAILABLE');
    return{lane:{id:'fantasypros_weekly_projections',status:available?'AVAILABLE':Object.values(positions).some(x=>x.status!=='UNAVAILABLE')?'PARTIAL':'UNAVAILABLE',coverage:{positions},sourceId:'fantasypros',metric:'projected_points'},records:available?records:[],rejects};
  }

  function buildSnapshot({season,week,scoring:scoringInput,projectionPayloads,sleeperPlayers,verifiedAt=Date.now()}={}){
    const normalizedScoring=scoring(scoringInput);if(!normalizedScoring)throw new Error('WEEKLY_EVIDENCE_WRONG_SCORING');
    if(!Number.isInteger(Number(season))||!Number.isInteger(Number(week)))throw new Error('WEEKLY_EVIDENCE_INVALID_CONTEXT');
    const projections=projectionLane(projectionPayloads,{season,week,scoring:normalizedScoring,sleeperPlayers,verifiedAt});
    const lanes={projections:projections.lane,expertWeeklyRanks:{status:'UNAVAILABLE',reason:'NO_QUALIFIED_RUNTIME_INGESTION'},vegas:{status:'UNAVAILABLE',reason:'SOURCE_UNAVAILABLE'},weather:{status:'UNAVAILABLE',reason:'SOURCE_UNAVAILABLE'},roleGraphs:{status:'UNAVAILABLE',reason:'SOURCE_UNAVAILABLE'}};
    const snapshot={schema:SCHEMA,snapshotId:`wev2-${Number(season)}-${Number(week)}-${normalizedScoring}-${verifiedAt}`,season:Number(season),week:Number(week),scoring:normalizedScoring,fetchedAt:verifiedAt,lastAttemptAt:verifiedAt,lastSuccessAt:projections.lane.status==='AVAILABLE'?verifiedAt:null,status:projections.lane.status==='AVAILABLE'?'DEGRADED':'UNAVAILABLE',lanes,records:projections.records,rejections:projections.rejects,panel:{weeklyRank:{status:'UNAVAILABLE',sources:[],aggregation:null},projection:{status:projections.lane.status,source:'fantasypros'}}};
    return snapshot;
  }

  function validateSnapshot(snapshot,context={},now=Date.now()){
    if(!snapshot||snapshot.schema!==SCHEMA||!snapshot.snapshotId)return{ok:false,reason:'SCHEMA'};
    if(Number(snapshot.season)!==Number(context.season)||Number(snapshot.week)!==Number(context.week)||snapshot.scoring!==scoring(context.scoring))return{ok:false,reason:'CONTEXT_MISMATCH'};
    if(snapshot.lanes?.projections?.status!=='AVAILABLE'||!Array.isArray(snapshot.records)||!snapshot.records.length)return{ok:false,reason:'PROJECTION_LANE_UNAVAILABLE'};
    if(!Number.isFinite(snapshot.lastSuccessAt)||snapshot.lastSuccessAt>now||now-snapshot.lastSuccessAt>MAX_AGE_MS)return{ok:false,reason:'STALE'};
    return{ok:true};
  }

  function atomicWrite(storage,snapshot){
    const text=JSON.stringify(snapshot);storage.setItem(TEMP_KEY,text);
    const staged=JSON.parse(storage.getItem(TEMP_KEY)||'null');
    if(!staged||staged.schema!==SCHEMA||staged.snapshotId!==snapshot.snapshotId)throw new Error('WEEKLY_EVIDENCE_ATOMIC_VERIFY_FAILED');
    storage.setItem(CACHE_KEY,text);storage.removeItem(TEMP_KEY);return snapshot;
  }

  return{SCHEMA,CACHE_KEY,TEMP_KEY,MAPPING_VERSION,MAX_AGE_MS,EVIDENCE_TTL_MS,POSITIONS,MIN_COUNTS,sourceTime,sleeperIndexes,mapFantasyProsPlayer,projectionLane,buildSnapshot,validateSnapshot,atomicWrite};
});
