(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.PittiWeeklyEvidenceV2=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  // v3 invalidates rc4.199 records whose request metadata could be mistaken for
  // provider evidence and whose values were not guarded against ROS/season scope.
  const SCHEMA='pitti.weekly-evidence.v3';
  const CACHE_KEY='pitti.weekly-evidence.v2.current';
  const TEMP_KEY='pitti.weekly-evidence.v2.pending';
  const MAPPING_VERSION='fp-sleeper-v1';
  const MAX_AGE_MS=3*60*60*1000;
  const EVIDENCE_TTL_MS=24*60*60*1000;
  const POSITIONS=['QB','RB','WR','TE'];
  const MIN_COUNTS={QB:24,RB:60,WR:70,TE:24};
  const RANK_MIN_COUNTS={QB:20,RB:48,WR:60,TE:20};
  // These are deliberately generous corruption/scope ceilings, not player ranks
  // or expected outcomes. A one-game Half-PPR payload exceeding them is unsafe to
  // distinguish from the season/ROS payload physically observed on rc4.199.
  const WEEKLY_HALF_PPR_MAX={QB:80,RB:70,WR:70,TE:70};
  const PROJECTION_RESPONSE_CLASSIFICATION={ABSENT_TRANSIENT:'ABSENT_TRANSIENT',CURRENT_ACCEPTED:'CURRENT_ACCEPTED',DEFINITIVE_REJECTION:'DEFINITIVE_REJECTION'};
  const norm=value=>String(value||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\b(jr|sr|ii|iii|iv)\b\.?/g,'').replace(/[^a-z0-9]/g,'');
  const iso=ms=>new Date(ms).toISOString();
  const finite=value=>typeof value==='number'&&Number.isFinite(value)?value:null;
  const scoring=value=>['HALF','HALF_PPR','HALF-PPR'].includes(String(value||'').toUpperCase())?'HALF_PPR':null;
  const invalidSourceTime=()=>({sourcePublishedAt:null,sourcePublishedDate:null,sourceTimePrecision:'INVALID'});
  function calendarDate(year,month,day){
    if(!Number.isInteger(year)||!Number.isInteger(month)||!Number.isInteger(day)||year<1||month<1||month>12||day<1||day>31)return null;
    const ms=Date.UTC(year,month-1,day),date=new Date(ms);
    return date.getUTCFullYear()===year&&date.getUTCMonth()===month-1&&date.getUTCDate()===day?{ms,date:`${String(year).padStart(4,'0')}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`}:null;
  }

  function sourceTime(payload,{season,verifiedAt,allowSeasonDateInference=false}={}){
    for(const key of ['updated','last_updated','updated_at','as_of','date']){
      if(!Object.prototype.hasOwnProperty.call(payload||{},key))continue;
      const raw=payload?.[key];
      if(raw==null||String(raw).trim()==='')return invalidSourceTime();
      const value=String(raw).trim();
      const absoluteDate=value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if(absoluteDate){
        const date=calendarDate(Number(absoluteDate[1]),Number(absoluteDate[2]),Number(absoluteDate[3]));
        return date?{sourcePublishedAt:null,sourcePublishedDate:date.date,sourceTimePrecision:'DATE'}:invalidSourceTime();
      }
      if(allowSeasonDateInference&&Number.isInteger(Number(season))&&Number.isFinite(verifiedAt)){
        const match=value.match(/^(\d{1,2})[\/-](\d{1,2})$/);
        const named=value.match(/^([A-Za-z]{3,9})\s+(\d{1,2})$/);
        const monthNames=['january','february','march','april','may','june','july','august','september','october','november','december'];
        const namedMonth=named?monthNames.findIndex(month=>month.startsWith(named[1].toLowerCase())&&named[1].length>=3)+1:0;
        const inferred=match?calendarDate(Number(season),Number(match[1]),Number(match[2])):named&&namedMonth?calendarDate(Number(season),namedMonth,Number(named[2])):null;
        // A yearless NFL-week date is accepted only in the requested season and
        // close to the retrieval. Keep DATE precision; never manufacture a time.
        if(inferred&&Math.abs(verifiedAt-inferred.ms)<8*86400000)return{sourcePublishedAt:null,sourcePublishedDate:inferred.date,sourceTimePrecision:'DATE'};
        if(match||named)return invalidSourceTime();
      }
      const ms=typeof raw==='number'?(raw<1e12?raw*1000:raw):Date.parse(value);
      if(Number.isFinite(ms))return{sourcePublishedAt:iso(ms),sourcePublishedDate:null,sourceTimePrecision:'TIMESTAMP'};
      return invalidSourceTime();
    }
    return{sourcePublishedAt:null,sourcePublishedDate:null,sourceTimePrecision:'UNKNOWN'};
  }

  function retrievalProjectionChronology(record,context={},now=Date.now()){
    const verified=Number(record?.verifiedAt),expires=Number(record?.expiresAt);
    return record?.schema===SCHEMA&&record?.metric==='projected_points'&&record?.sourceTimePrecision==='RETRIEVAL'&&record?.sourcePublishedAt==null&&record?.sourcePublishedDate==null&&record?.sourceId==='fantasypros'&&record?.provenance?.provider==='FantasyPros'&&record?.provenance?.field==='stats.points_half'&&record?.provenance?.providerScope==='WEEKLY'&&record?.provenance?.request?.scope==='WEEKLY'&&record?.provenance?.request?.ros===false&&record?.provenance?.request?.week===Number(context.week)&&record?.provenance?.request?.position===record?.position&&Number(record?.season)===Number(context.season)&&Number(record?.week)===Number(context.week)&&record?.scoring==='HALF_PPR'&&record?.unit==='HALF_PPR_POINTS'&&/^https:\/\/api\.fantasypros\.com\/public\/v2\/json\/nfl\/\d{4}\/projections\?/.test(record?.sourceUrl||'')&&new URL(record.sourceUrl).searchParams.get('week')===String(context.week)&&new URL(record.sourceUrl).searchParams.get('position')===record.position&&new URL(record.sourceUrl).searchParams.get('ros')==='false'&&!new URL(record.sourceUrl).searchParams.has('scoring')&&Number.isFinite(record?.value)&&record.value>=0&&record.value<=WEEKLY_HALF_PPR_MAX[record.position]&&Number.isFinite(record?.confidence)&&record.confidence>=.7&&record.confidence<=1&&Number.isFinite(verified)&&verified<=now&&now-verified<=MAX_AGE_MS&&Number.isFinite(expires)&&expires>now&&expires-verified<=EVIDENCE_TTL_MS;
  }
  function weeklyRecordChronology(record,context={},now=Date.now()){
    const verified=Number(record?.verifiedAt);
    if(record?.schema!==SCHEMA||!Number.isFinite(verified)||verified>now||Number(record?.season)!==Number(context.season)||Number(record?.week)!==Number(context.week)||record?.scoring!=='HALF_PPR')return false;
    if(record?.metric==='projected_points'&&(!Number.isFinite(record?.value)||record.value<0||record.value>WEEKLY_HALF_PPR_MAX[record.position]||record?.provenance?.providerScope!=='WEEKLY'))return false;
    if(record?.sourceTimePrecision==='RETRIEVAL')return retrievalProjectionChronology(record,context,now);
    if(!['projected_points','weekly_rank'].includes(record?.metric)||!['fantasypros','fantasypros_weekly_ecr'].includes(record?.sourceId)||!/^https:\/\/api\.fantasypros\.com\//.test(record?.sourceUrl||''))return false;
    if(record?.sourceTimePrecision==='TIMESTAMP'){
      const published=Date.parse(record?.sourcePublishedAt||'');return Number.isFinite(published)&&published<=verified&&now-published<=EVIDENCE_TTL_MS;
    }
    return record?.sourceTimePrecision==='DATE'&&/^\d{4}-\d{2}-\d{2}$/.test(record?.sourcePublishedDate||'')&&record.sourcePublishedDate<=iso(verified).slice(0,10)&&now-verified<=EVIDENCE_TTL_MS;
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
    const fpid=String(row?.fpid??row?.player_id??'').trim(),position=String(row?.position_id??row?.player_position_id??row?.position??'').toUpperCase();
    if(fpid){const found=indexes.byFp.get(fpid)||[];if(found.length===1&&found[0].position===position)return{ok:true,player:found[0],method:'FANTASY_DATA_ID',sourcePlayerId:fpid};if(found.length>1)return{ok:false,reason:'FP_ID_COLLISION',sourcePlayerId:fpid};}
    const name=String(row?.name||row?.player_name||'').trim(),found=indexes.byNamePosition.get(`${norm(name)}|${position}`)||[];
    if(found.length!==1)return{ok:false,reason:found.length?'NAME_POSITION_COLLISION':'NO_MATCH',sourcePlayerId:fpid||null};
    const sourceTeam=String(row?.team_id??row?.player_team_id??row?.team??'').toUpperCase(),sleeperTeam=found[0].team;
    if(sourceTeam&&sleeperTeam&&sourceTeam!=='FA'&&sleeperTeam!=='FA'&&sourceTeam!==sleeperTeam)return{ok:false,reason:'TEAM_MISMATCH',sourcePlayerId:fpid||null};
    return{ok:true,player:found[0],method:'EXACT_NAME_POSITION_TEAM',sourcePlayerId:fpid||null};
  }

  function projectionLane(payloads,{season,week,scoring:scoringInput,sleeperPlayers,verifiedAt=Date.now()}={}){
    const normalizedScoring=scoring(scoringInput),indexes=sleeperIndexes(sleeperPlayers),records=[],positions={},rejects=[];
    for(const position of POSITIONS){
      const hasLane=Object.prototype.hasOwnProperty.call(payloads||{},position),envelope=hasLane?payloads[position]:null,isEnvelope=envelope!=null&&typeof envelope==='object'&&Object.prototype.hasOwnProperty.call(envelope,'providerPayload'),payload=isEnvelope?envelope.providerPayload:envelope,request=isEnvelope?envelope.requestProvenance:null,responsePresent=hasLane&&(isEnvelope||payload!=null),players=Array.isArray(payload?.players)?payload.players:[],rawTime=sourceTime(payload,{season,verifiedAt,allowSeasonDateInference:true}),time=rawTime.sourceTimePrecision==='UNKNOWN'?{sourcePublishedAt:null,sourcePublishedDate:null,sourceTimePrecision:'RETRIEVAL'}:rawTime;
      const invalidRequest=isEnvelope&&(Number(request?.season)!==Number(season)||Number(request?.week)!==Number(week)||String(request?.position||'').toUpperCase()!==position||request?.ros!==false||request?.scope!=='WEEKLY');
      let reason='';
      if(!normalizedScoring)reason='WRONG_SCORING';
      else if(!responsePresent)reason=invalidRequest?'INVALID_REQUEST_PROVENANCE':'NO_CURRENT_PROVIDER_RESPONSE';
      else if(payload==null||typeof payload!=='object'||Array.isArray(payload)||!Object.prototype.hasOwnProperty.call(payload,'season')||!Object.prototype.hasOwnProperty.call(payload,'week'))reason='MALFORMED_PROVIDER_RESPONSE';
      else if(Number(payload?.season)!==Number(season))reason='WRONG_SEASON';
      else if(Number(payload?.week)!==Number(week))reason='WRONG_WEEK';
      else if(invalidRequest||!isEnvelope)reason='INVALID_REQUEST_PROVENANCE';
      else if(Object.prototype.hasOwnProperty.call(payload||{},'positions')&&String(payload.positions||'').toUpperCase()!==position)reason='WRONG_PROVIDER_POSITION';
      else if(payload?.ros===true)reason='CONTRADICTORY_PROVIDER_ROS_SCOPE';
      else if(rawTime.sourceTimePrecision==='INVALID')reason='INVALID_PROVIDER_CHRONOLOGY';
      else if(!Array.isArray(payload?.players))reason='MISSING_PLAYERS';
      else if(players.some(row=>String(row?.position_id??row?.player_position_id??row?.position??'').toUpperCase()!==position))reason='WRONG_POSITION';
      const numericValues=players.map(row=>finite(row?.stats?.points_half)).filter(value=>value!=null),numeric=numericValues.length,scopeMismatch=numericValues.some(value=>value<0||value>WEEKLY_HALF_PPR_MAX[position]),allZero=numeric>0&&numericValues.every(value=>value===0),minimum=MIN_COUNTS[position],sourceSufficient=!reason&&!scopeMismatch&&!allZero&&players.length>=minimum&&numeric/Math.max(players.length,1)>=.9;
      if(!reason&&scopeMismatch)reason='WEEKLY_PROJECTION_SEMANTIC_SCOPE_MISMATCH';
      if(!reason&&allZero)reason='ALL_ZERO_WEEKLY_PROJECTION_DISTRIBUTION';
      let mapped=0;
      if(sourceSufficient){for(const row of players){
        const value=finite(row?.stats?.points_half);if(value==null)continue;
        const mapping=mapFantasyProsPlayer(row,indexes);if(!mapping.ok){rejects.push({position,name:String(row?.name||''),sourcePlayerId:mapping.sourcePlayerId,reason:mapping.reason});continue;}
        mapped++;
        const record={schema:SCHEMA,playerId:mapping.player.id,sleeperId:mapping.player.id,sourcePlayerId:mapping.sourcePlayerId,mappingMethod:mapping.method,mappingVersion:MAPPING_VERSION,metric:'projected_points',value,unit:'HALF_PPR_POINTS',position,season:Number(season),week:Number(week),scoring:normalizedScoring,status:'VERIFIED',sourceId:'fantasypros',sourceUrl:`https://api.fantasypros.com/public/v2/json/nfl/${Number(season)}/projections?week=${Number(week)}&position=${position}&ros=false`,expert:null,...time,verifiedAt,expiresAt:verifiedAt+EVIDENCE_TTL_MS,provenance:{provider:'FantasyPros',field:'stats.points_half',providerScope:'WEEKLY',providerScoring:String(payload.scoring||'').toUpperCase()||null,request},confidence:mapping.method==='FANTASY_DATA_ID'?.98:.8};
        if(weeklyRecordChronology(record,{season,week,scoring:normalizedScoring},verifiedAt))records.push(record);
        else rejects.push({position,name:String(row?.name||''),sourcePlayerId:mapping.sourcePlayerId,reason:'INVALID_PROVIDER_CHRONOLOGY'});
      }}
      const mappedRecords=records.filter(record=>record.position===position),mappedConsumerUsable=mappedRecords.filter(record=>weeklyRecordChronology(record,{season,week,scoring:normalizedScoring},verifiedAt)).length;
      const mappingCoverage=numeric?mapped/numeric:0,status=sourceSufficient&&mappingCoverage>=.9&&mappedConsumerUsable===mapped?'AVAILABLE':sourceSufficient?'PARTIAL':'UNAVAILABLE';
      const rejectReasonCounts={};for(const reject of rejects.filter(item=>item.position===position))rejectReasonCounts[reject.reason]=(rejectReasonCounts[reject.reason]||0)+1;
      const finalReason=reason||(!sourceSufficient?'INSUFFICIENT_SOURCE_COVERAGE':status==='PARTIAL'?'INSUFFICIENT_MAPPING_COVERAGE':null);
      const responseClassification=!responsePresent&&!invalidRequest?PROJECTION_RESPONSE_CLASSIFICATION.ABSENT_TRANSIENT:status==='AVAILABLE'?PROJECTION_RESPONSE_CLASSIFICATION.CURRENT_ACCEPTED:PROJECTION_RESPONSE_CLASSIFICATION.DEFINITIVE_REJECTION;
      // Mapping is part of the authoritative lane gate. Do not let individually
      // mapped rows escape from a position whose aggregate mapping failed closed.
      if(responseClassification===PROJECTION_RESPONSE_CLASSIFICATION.DEFINITIVE_REJECTION)for(let i=records.length-1;i>=0;i--)if(records[i].position===position)records.splice(i,1);
      const consumerUsable=responseClassification===PROJECTION_RESPONSE_CLASSIFICATION.CURRENT_ACCEPTED?mappedConsumerUsable:0;
      positions[position]={status,responseClassification,sourceRows:players.length,count:players.length,numericPointsHalf:numeric,mappedRows:mapped,mapped,mappingCoverage:Math.round(mappingCoverage*1000)/1000,consumerUsableRecords:consumerUsable,rejectReasonCounts,finalLaneStatus:status,finalLaneReason:finalReason,reason:finalReason,...time};
    }
    const available=POSITIONS.every(position=>positions[position].status==='AVAILABLE');
    return{lane:{id:'fantasypros_weekly_projections',status:available?'AVAILABLE':Object.values(positions).some(x=>x.status!=='UNAVAILABLE')?'PARTIAL':'UNAVAILABLE',coverage:{positions},sourceId:'fantasypros',metric:'projected_points'},records,rejects};
  }

  function rankingRows(payload){
    if(Array.isArray(payload?.players))return payload.players;
    if(Array.isArray(payload?.rankings))return payload.rankings;
    if(Array.isArray(payload?.data?.players))return payload.data.players;
    return null;
  }

  function rankValue(row){
    for(const raw of [row?.rank_ecr,row?.ecr,row?.rank,row?.rank_ave,row?.rank_mean]){
      const value=Number(raw);if(Number.isFinite(value)&&value>0)return value;
    }
    return null;
  }

  // FantasyPros ECR is deliberately a broad current-week stabilizer. It is never
  // represented as PITTI's selected-expert panel when individual votes are absent.
  function weeklyRankLane(payloads,{season,week,scoring:scoringInput,sleeperPlayers,verifiedAt=Date.now()}={}){
    const normalizedScoring=scoring(scoringInput),indexes=sleeperIndexes(sleeperPlayers),records=[],positions={},rejects=[];
    for(const position of POSITIONS){
      const payload=payloads?.[position],players=rankingRows(payload),payloadTime=sourceTime(payload||{},{season,verifiedAt,allowSeasonDateInference:true}),minimum=RANK_MIN_COUNTS[position];
      let reason='';
      if(!normalizedScoring)reason='WRONG_SCORING';
      else if(Number(payload?.season??season)!==Number(season))reason='WRONG_SEASON';
      else if(Number(payload?.week??week)!==Number(week))reason='WRONG_WEEK';
      else if(scoring(payload?.scoring??payload?.format??scoringInput)!==normalizedScoring)reason='WRONG_SCORING';
      else if(!players)reason='MISSING_PLAYERS';
      else if(players.some(row=>String(row?.position_id??row?.player_position_id??row?.position??'').toUpperCase()!==position))reason='WRONG_POSITION';
      const ranked=(players||[]).filter(row=>rankValue(row)!=null),timed=ranked.map(row=>({row,time:sourceTime(row,{season,verifiedAt,allowSeasonDateInference:true})})).map(x=>x.time.sourceTimePrecision==='UNKNOWN'?{...x,time:payloadTime}:x),isFresh=time=>time.sourcePublishedAt?Date.parse(time.sourcePublishedAt)<=verifiedAt&&verifiedAt-Date.parse(time.sourcePublishedAt)<=EVIDENCE_TTL_MS:time.sourcePublishedDate?time.sourcePublishedDate<=iso(verifiedAt).slice(0,10)&&verifiedAt-Date.parse(time.sourcePublishedDate)<EVIDENCE_TTL_MS:false,freshRows=timed.filter(x=>isFresh(x.time)),staleOrAmbiguous=timed.length-freshRows.length;
      let mapped=0;
      if(!reason&&freshRows.length>=minimum)for(const {row,time} of freshRows){
        const mapping=mapFantasyProsPlayer(row,indexes);if(!mapping.ok){rejects.push({position,name:String(row?.name||row?.player_name||''),reason:mapping.reason});continue;}
        mapped++;records.push({schema:SCHEMA,playerId:mapping.player.id,sleeperId:mapping.player.id,sourcePlayerId:mapping.sourcePlayerId,mappingMethod:mapping.method,mappingVersion:MAPPING_VERSION,metric:'weekly_rank',value:rankValue(row),unit:'POSITIONAL_RANK',position,season:Number(season),week:Number(week),scoring:normalizedScoring,status:'VERIFIED',sourceId:'fantasypros_weekly_ecr',sourceUrl:`https://api.fantasypros.com/public/v2/json/nfl/${Number(season)}/consensus-rankings?week=${Number(week)}&position=${position}&scoring=HALF`,expert:null,...time,verifiedAt,expiresAt:verifiedAt+EVIDENCE_TTL_MS,provenance:{provider:'FantasyPros',aggregation:'CURRENT_WEEK_HALF_PPR_ECR',panelMembership:[],coverage:'BROAD_CONSENSUS_ONLY'},confidence:mapping.method==='FANTASY_DATA_ID'?.96:.78});
      }
      const coverage=ranked.length?mapped/ranked.length:0,status=!reason&&freshRows.length>=minimum&&freshRows.length/ranked.length>=.9&&coverage>=.9?'AVAILABLE':mapped?'PARTIAL':'UNAVAILABLE';
      const primaryReason=reason||(freshRows.length<minimum||freshRows.length/ranked.length<.9?'STALE_OR_AMBIGUOUS_ROW_TIME':status!=='AVAILABLE'?'INSUFFICIENT_MAPPING_COVERAGE':null);
      positions[position]={status,sourceRows:(players||[]).length,rankedRows:ranked.length,freshRows:freshRows.length,mappedRows:mapped,mappingCoverage:Math.round(coverage*1000)/1000,staleOrAmbiguousTimeCount:staleOrAmbiguous,primaryRejectionReason:primaryReason,reason:primaryReason};
    }
    const available=POSITIONS.every(position=>positions[position].status==='AVAILABLE');
    return{lane:{id:'fantasypros_weekly_ecr',status:available?'AVAILABLE':Object.values(positions).some(x=>x.status!=='UNAVAILABLE')?'PARTIAL':'UNAVAILABLE',coverage:{positions},metric:'weekly_rank',panelStatus:'BROAD_CONSENSUS_ONLY'},records,rejects};
  }

  function buildSnapshot({season,week,scoring:scoringInput,projectionPayloads,rankingPayloads,sleeperPlayers,priorSnapshot,verifiedAt=Date.now()}={}){
    const normalizedScoring=scoring(scoringInput);if(!normalizedScoring)throw new Error('WEEKLY_EVIDENCE_WRONG_SCORING');
    if(!Number.isInteger(Number(season))||!Number.isInteger(Number(week)))throw new Error('WEEKLY_EVIDENCE_INVALID_CONTEXT');
    const projections=projectionLane(projectionPayloads,{season,week,scoring:normalizedScoring,sleeperPlayers,verifiedAt});
    const ranks=weeklyRankLane(rankingPayloads,{season,week,scoring:normalizedScoring,sleeperPlayers,verifiedAt});
    const lanes={projections:projections.lane,expertWeeklyRanks:ranks.lane,vegas:{status:'UNAVAILABLE',reason:'NO_APPROVED_ROBUST_SOURCE'},weather:{status:'UNAVAILABLE',reason:'GAME_CONTEXT_REQUIRED'},roleGraphs:{status:'UNAVAILABLE',reason:'SOURCE_UNAVAILABLE'}};
    const fresh=[...projections.records,...ranks.records],freshKeys=new Set(fresh.map(record=>`${record.metric}|${record.position}|${record.playerId}`));
    const laneAvailable=(metric,position)=>metric==='projected_points'?projections.lane.coverage.positions[position]?.status==='AVAILABLE':metric==='weekly_rank'?ranks.lane.coverage.positions[position]?.status==='AVAILABLE':false;
    // Carry-forward is reserved for a lane for which no provider response exists.
    // Any present response (or contradictory authenticated request context) owns its
    // lane and purges prior rows when it cannot satisfy the weekly invariants.
    const explicitlyRejected=(metric,position)=>metric==='projected_points'&&projections.lane.coverage.positions[position]?.responseClassification===PROJECTION_RESPONSE_CLASSIFICATION.DEFINITIVE_REJECTION;
    const priorValid=priorSnapshot?.schema===SCHEMA&&Number(priorSnapshot.season)===Number(season)&&Number(priorSnapshot.week)===Number(week)&&priorSnapshot.scoring===normalizedScoring&&Array.isArray(priorSnapshot.records)?priorSnapshot.records.filter(record=>weeklyRecordChronology(record,{season,week,scoring:normalizedScoring},verifiedAt)&&!laneAvailable(record.metric,record.position)&&!explicitlyRejected(record.metric,record.position)&&!freshKeys.has(`${record.metric}|${record.position}|${record.playerId}`)):[];
    const records=[...fresh,...priorValid];
    const freshProjectionUsable=projections.records.length>0;
    const snapshot={schema:SCHEMA,snapshotId:`wev2-${Number(season)}-${Number(week)}-${normalizedScoring}-${verifiedAt}`,season:Number(season),week:Number(week),scoring:normalizedScoring,fetchedAt:verifiedAt,lastAttemptAt:verifiedAt,lastSuccessAt:freshProjectionUsable?verifiedAt:Number(priorSnapshot?.lastSuccessAt)||null,status:projections.lane.status==='AVAILABLE'&&ranks.lane.status==='AVAILABLE'?'AVAILABLE':freshProjectionUsable?'DEGRADED':'UNAVAILABLE',lanes,records,rejections:[...projections.rejects,...ranks.rejects],retainedPriorRecords:priorValid.length,panel:{weeklyRank:{status:ranks.lane.status==='AVAILABLE'?'BROAD_CONSENSUS_ONLY':ranks.lane.status,sources:ranks.lane.status==='UNAVAILABLE'?[]:['FantasyPros current-week Half-PPR ECR'],selectedExperts:[],aggregation:'ECR; selected PITTI panel remains separately unavailable'},projection:{status:projections.lane.status,source:'fantasypros'}}};
    return snapshot;
  }

  function validateSnapshot(snapshot,context={},now=Date.now()){
    if(!snapshot||snapshot.schema!==SCHEMA||!snapshot.snapshotId)return{ok:false,reason:'SCHEMA'};
    if(Number(snapshot.season)!==Number(context.season)||Number(snapshot.week)!==Number(context.week)||snapshot.scoring!==scoring(context.scoring))return{ok:false,reason:'CONTEXT_MISMATCH'};
    if(!['AVAILABLE','PARTIAL'].includes(snapshot.lanes?.projections?.status)||!Array.isArray(snapshot.records)||!snapshot.records.some(record=>record?.metric==='projected_points'&&weeklyRecordChronology(record,context,now)))return{ok:false,reason:'PROJECTION_LANE_UNAVAILABLE'};
    if(!Number.isFinite(snapshot.lastSuccessAt)||snapshot.lastSuccessAt>now||now-snapshot.lastSuccessAt>MAX_AGE_MS)return{ok:false,reason:'STALE'};
    return{ok:true};
  }

  const storageQuotaError=error=>error?.name==='QuotaExceededError'||Number(error?.code)===22;
  const safeRemove=(storage,key)=>{try{storage.removeItem(key)}catch{}};
  function projectionOnlyStorageSnapshot(snapshot){
    const records=(Array.isArray(snapshot?.records)?snapshot.records:[]).filter(record=>record?.metric==='projected_points');
    if(!['AVAILABLE','PARTIAL'].includes(snapshot?.lanes?.projections?.status)||!records.length)return null;
    return{
      ...snapshot,
      status:'DEGRADED',
      records,
      rejections:[...(Array.isArray(snapshot.rejections)?snapshot.rejections:[]),{lane:'expertWeeklyRanks',reason:'STORAGE_QUOTA_PROJECTION_ONLY'}],
      lanes:{...snapshot.lanes,expertWeeklyRanks:{...(snapshot.lanes?.expertWeeklyRanks||{}),status:'UNAVAILABLE',reason:'STORAGE_QUOTA_PROJECTION_ONLY'}},
      panel:{...snapshot.panel,weeklyRank:{status:'UNAVAILABLE',sources:[],selectedExperts:[],aggregation:'BROAD_CONSENSUS_NOT_PERSISTED_STORAGE_QUOTA'}},
      persistence:{mode:'LOCAL_STORAGE_PROJECTION_ONLY',reason:'STORAGE_QUOTA'}
    };
  }
  function atomicWrite(storage,snapshot){
    const serialize=candidate=>{
      const text=JSON.stringify(candidate),validated=JSON.parse(text);
      if(!validated||validated.schema!==SCHEMA||validated.snapshotId!==snapshot.snapshotId)throw new Error('WEEKLY_EVIDENCE_ATOMIC_VERIFY_FAILED');
      return text;
    };
    const commit=candidate=>{
      const text=serialize(candidate);
      storage.setItem(CACHE_KEY,text);
      const current=JSON.parse(storage.getItem(CACHE_KEY)||'null');
      if(!current||current.schema!==SCHEMA||current.snapshotId!==snapshot.snapshotId)throw new Error('WEEKLY_EVIDENCE_ATOMIC_VERIFY_FAILED');
      return current;
    };

    // Web Storage setItem is atomic: if a replacement cannot be stored, the previous
    // value remains unchanged. Do not stage a second full snapshot in TEMP_KEY because
    // that doubles peak localStorage demand and can strand a full pending copy after a
    // QuotaExceededError. Remove any stale pending copy left by older builds first.
    safeRemove(storage,TEMP_KEY);
    try{return commit(snapshot);}
    catch(first){
      if(!storageQuotaError(first))throw first;
      // Only obsolete duplicate rank caches are expendable. Research, return-validation,
      // active decision evidence and the previous verified Weekly Evidence snapshot are
      // protected and must never be sacrificed merely to make a refresh fit.
      for(const key of ['v7_rankCache','v7_panelRanks'])safeRemove(storage,key);
      try{return commit(snapshot);}
      catch(second){
        if(!storageQuotaError(second))throw second;
        // Rank evidence is optional and already independently fail-closed. If the full
        // fresh snapshot cannot replace the previous one, persist all verified projection
        // records without ranks. This is normally smaller than the previous full snapshot
        // and keeps Start/Sit/Waiver projection evidence usable under storage pressure.
        const projectionOnly=projectionOnlyStorageSnapshot(snapshot);
        if(projectionOnly){
          try{return commit(projectionOnly);}
          catch(third){if(!storageQuotaError(third))throw third;}
        }
        const error=new Error('Weekly Evidence konnte wegen ausgeschöpftem lokalem Speicher nicht persistiert werden.');
        error.name='QuotaExceededError';
        error.code='STORAGE_QUOTA_EXCEEDED';
        error.cause=second;
        throw error;
      }
    }
  }

  return{SCHEMA,CACHE_KEY,TEMP_KEY,MAPPING_VERSION,MAX_AGE_MS,EVIDENCE_TTL_MS,POSITIONS,MIN_COUNTS,RANK_MIN_COUNTS,WEEKLY_HALF_PPR_MAX,sourceTime,retrievalProjectionChronology,weeklyRecordChronology,sleeperIndexes,mapFantasyProsPlayer,projectionLane,weeklyRankLane,buildSnapshot,validateSnapshot,projectionOnlyStorageSnapshot,atomicWrite};
});
