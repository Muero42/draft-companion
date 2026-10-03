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
  const PROJECTION_POSITIONS=[...POSITIONS,'K','DST'];
  const MIN_COUNTS={QB:24,RB:60,WR:70,TE:24,K:20,DST:20};
  const RANK_MIN_COUNTS={QB:20,RB:48,WR:60,TE:20};
  const SELECTED_PANEL_MIN_EXPERTS={QB:2,RB:3,WR:2,TE:2};
  const WEEKLY_PROJECTION_QUERY_SHAPE='EXPLICIT_WEEK_POSITION_ROS_OMITTED';
  // These are deliberately generous corruption/scope ceilings, not player ranks
  // or expected outcomes. A one-game Half-PPR payload exceeding them is unsafe to
  // distinguish from the season/ROS payload physically observed on rc4.199.
  const WEEKLY_HALF_PPR_MAX={QB:80,RB:70,WR:70,TE:70,K:40,DST:60};
  const PROJECTION_RESPONSE_CLASSIFICATION={ABSENT_TRANSIENT:'ABSENT_TRANSIENT',CURRENT_ACCEPTED:'CURRENT_ACCEPTED',DEFINITIVE_REJECTION:'DEFINITIVE_REJECTION'};
  const norm=value=>String(value||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\b(jr|sr|ii|iii|iv)\b\.?/g,'').replace(/[^a-z0-9]/g,'');
  const team=value=>({JAC:'JAX',WSH:'WAS',LA:'LAR'}[String(value||'').trim().toUpperCase()]||String(value||'').trim().toUpperCase());
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
    if(record?.sourceId==='sleeper_rotowire')return sleeperProjectionChronology(record,context,now);
    const verified=Number(record?.verifiedAt),expires=Number(record?.expiresAt);
    return record?.schema===SCHEMA&&record?.metric==='projected_points'&&record?.sourceTimePrecision==='RETRIEVAL'&&record?.sourcePublishedAt==null&&record?.sourcePublishedDate==null&&record?.sourceId==='fantasypros'&&record?.provenance?.provider==='FantasyPros'&&record?.provenance?.field==='stats.points_half'&&record?.provenance?.providerScope==='WEEKLY'&&record?.provenance?.request?.scope==='WEEKLY'&&record?.provenance?.request?.queryShape===WEEKLY_PROJECTION_QUERY_SHAPE&&!Object.prototype.hasOwnProperty.call(record?.provenance?.request||{},'ros')&&record?.provenance?.request?.week===Number(context.week)&&record?.provenance?.request?.position===record?.position&&Number(record?.season)===Number(context.season)&&Number(record?.week)===Number(context.week)&&record?.scoring==='HALF_PPR'&&record?.unit==='HALF_PPR_POINTS'&&/^https:\/\/api\.fantasypros\.com\/public\/v2\/json\/nfl\/\d{4}\/projections\?/.test(record?.sourceUrl||'')&&new URL(record.sourceUrl).searchParams.get('week')===String(context.week)&&new URL(record.sourceUrl).searchParams.get('position')===record.position&&!new URL(record.sourceUrl).searchParams.has('ros')&&!new URL(record.sourceUrl).searchParams.has('scoring')&&Number.isFinite(record?.value)&&record.value>=0&&record.value<=WEEKLY_HALF_PPR_MAX[record.position]&&Number.isFinite(record?.confidence)&&record.confidence>=.7&&record.confidence<=1&&Number.isFinite(verified)&&verified<=now&&now-verified<=MAX_AGE_MS&&Number.isFinite(expires)&&expires>now&&expires-verified<=EVIDENCE_TTL_MS;
  }
  function weeklyRecordChronology(record,context={},now=Date.now()){
    const verified=Number(record?.verifiedAt);
    if(record?.schema!==SCHEMA||!Number.isFinite(verified)||verified>now||Number(record?.season)!==Number(context.season)||Number(record?.week)!==Number(context.week)||record?.scoring!=='HALF_PPR')return false;
    if(record?.metric==='projected_points'&&(!Number.isFinite(record?.value)||record.value<0||record.value>WEEKLY_HALF_PPR_MAX[record.position]||record?.provenance?.providerScope!=='WEEKLY'))return false;
    if(record?.sourceTimePrecision==='RETRIEVAL')return retrievalProjectionChronology(record,context,now);
    if(!['projected_points','weekly_rank','broad_weekly_ecr_rank'].includes(record?.metric)||!['fantasypros','fantasypros_weekly_ecr','fantasypros_pitti_selected_weekly_panel'].includes(record?.sourceId)||!(String(record?.sourceUrl||'').startsWith('https://api.fantasypros.com/')||(record?.metric==='broad_weekly_ecr_rank'&&/^https:\/\/www\.fantasypros\.com\/nfl\/rankings\/half-point-ppr-(rb|wr|te)\.php$/.test(record?.sourceUrl||'')&&record?.provenance?.publicWeeklySource===true)))return false;
    if(record?.metric==='weekly_rank'&&record?.sourceId!=='fantasypros_pitti_selected_weekly_panel')return false;
    if(record?.metric==='broad_weekly_ecr_rank'&&record?.sourceId!=='fantasypros_weekly_ecr')return false;
    if(record?.sourceTimePrecision==='TIMESTAMP'){
      const published=Date.parse(record?.sourcePublishedAt||'');return Number.isFinite(published)&&published<=verified&&now-published<=EVIDENCE_TTL_MS;
    }
    return record?.sourceTimePrecision==='DATE'&&/^\d{4}-\d{2}-\d{2}$/.test(record?.sourcePublishedDate||'')&&record.sourcePublishedDate<=iso(verified).slice(0,10)&&now-verified<=EVIDENCE_TTL_MS;
  }

  function sleeperIndexes(players){
    const byFp=new Map(),byNamePosition=new Map(),byDefenseTeam=new Map();
    for(const [id,player] of Object.entries(players||{})){
      if(!player||![...PROJECTION_POSITIONS,'DEF'].includes(String(player.position||'').toUpperCase()))continue;
      const row={id:String(id),name:player.full_name||[player.first_name,player.last_name].filter(Boolean).join(' '),position:String(player.position).toUpperCase()==='DEF'?'DST':String(player.position).toUpperCase(),team:team(player.team||'FA')};
      if(row.position==='DST'){const rows=byDefenseTeam.get(row.team)||[];rows.push(row);byDefenseTeam.set(row.team,rows);}
      const fp=String(player.fantasy_data_id??'').trim();
      if(fp){const rows=byFp.get(fp)||[];rows.push(row);byFp.set(fp,rows);}
      const key=`${norm(row.name)}|${row.position}`,rows=byNamePosition.get(key)||[];rows.push(row);byNamePosition.set(key,rows);
    }
    return{byFp,byNamePosition,byDefenseTeam};
  }

  function mapFantasyProsPlayer(row,indexes){
    const fpid=String(row?.fpid??row?.player_id??'').trim(),position=String(row?.position_id??row?.player_position_id??row?.position??'').toUpperCase();
    if(fpid){const found=indexes.byFp.get(fpid)||[];if(found.length===1&&found[0].position===position)return{ok:true,player:found[0],method:'FANTASY_DATA_ID',sourcePlayerId:fpid};if(found.length>1)return{ok:false,reason:'FP_ID_COLLISION',sourcePlayerId:fpid};}
    if(position==='DST'){
      const sourceTeam=team(row?.team_id??row?.player_team_id??row?.team??''),found=indexes.byDefenseTeam.get(sourceTeam)||[],canonical=found.filter(p=>p.id===sourceTeam),selected=canonical.length===1?canonical:found;
      if(!/^(ARI|ATL|BAL|BUF|CAR|CHI|CIN|CLE|DAL|DEN|DET|GB|HOU|IND|JAX|KC|LAC|LAR|LV|MIA|MIN|NE|NO|NYG|NYJ|PHI|PIT|SEA|SF|TB|TEN|WAS)$/.test(sourceTeam)||selected.length!==1)return{ok:false,reason:'DST_TEAM_AMBIGUOUS_OR_UNMAPPED',sourcePlayerId:fpid||null};
      return{ok:true,player:selected[0],method:'EXACT_CANONICAL_DEFENSE_TEAM',sourcePlayerId:fpid||null};
    }
    const name=String(row?.name||row?.player_name||'').trim(),found=indexes.byNamePosition.get(`${norm(name)}|${position}`)||[];
    if(found.length!==1)return{ok:false,reason:found.length?'NAME_POSITION_COLLISION':'NO_MATCH',sourcePlayerId:fpid||null};
    const sourceTeam=team(row?.team_id??row?.player_team_id??row?.team??''),sleeperTeam=found[0].team;
    if(sourceTeam&&sleeperTeam&&sourceTeam!=='FA'&&sleeperTeam!=='FA'&&sourceTeam!==sleeperTeam)return{ok:false,reason:'TEAM_MISMATCH',sourcePlayerId:fpid||null};
    return{ok:true,player:found[0],method:'EXACT_NAME_POSITION_TEAM',sourcePlayerId:fpid||null};
  }

  function projectionLane(payloads,{season,week,scoring:scoringInput,sleeperPlayers,verifiedAt=Date.now(),positions:requestedPositions=POSITIONS}={}){
    const normalizedScoring=scoring(scoringInput),indexes=sleeperIndexes(sleeperPlayers),records=[],positions={},rejects=[];
    for(const position of requestedPositions){
      const hasLane=Object.prototype.hasOwnProperty.call(payloads||{},position),envelope=hasLane?payloads[position]:null,isEnvelope=envelope!=null&&typeof envelope==='object'&&Object.prototype.hasOwnProperty.call(envelope,'providerPayload'),payload=isEnvelope?envelope.providerPayload:envelope,request=isEnvelope?envelope.requestProvenance:null,responsePresent=hasLane&&(isEnvelope||payload!=null),players=Array.isArray(payload?.players)?payload.players:[],rawTime=sourceTime(payload,{season,verifiedAt,allowSeasonDateInference:true}),time=rawTime.sourceTimePrecision==='UNKNOWN'?{sourcePublishedAt:null,sourcePublishedDate:null,sourceTimePrecision:'RETRIEVAL'}:rawTime;
      const invalidRequest=isEnvelope&&(Number(request?.season)!==Number(season)||Number(request?.week)!==Number(week)||String(request?.position||'').toUpperCase()!==position||request?.scope!=='WEEKLY'||request?.queryShape!==WEEKLY_PROJECTION_QUERY_SHAPE||Object.prototype.hasOwnProperty.call(request||{},'ros'));
      let reason='';
      if(!normalizedScoring)reason='WRONG_SCORING';
      else if(!responsePresent)reason=invalidRequest?'INVALID_REQUEST_PROVENANCE':'NO_CURRENT_PROVIDER_RESPONSE';
      else if(payload==null||typeof payload!=='object'||Array.isArray(payload)||!Object.prototype.hasOwnProperty.call(payload,'season')||!Object.prototype.hasOwnProperty.call(payload,'week'))reason='MALFORMED_PROVIDER_RESPONSE';
      else if(Number(payload?.season)!==Number(season))reason='WRONG_SEASON';
      else if(Number(payload?.week)!==Number(week))reason='WRONG_WEEK';
      else if(invalidRequest||!isEnvelope)reason='INVALID_REQUEST_PROVENANCE';
      else if(payload?.rankings||payload?.ranking_type||/\bros\b|rest.of.season/i.test(String(payload?.type||payload?.projections||payload?.scope||'')))reason='NON_WEEKLY_PROJECTION_PAYLOAD';
      else if(payload?.ros===true)reason='CONTRADICTORY_PROVIDER_ROS_SCOPE';
      else if(Object.prototype.hasOwnProperty.call(payload||{},'positions')&&String(payload.positions||'').toUpperCase()!==position)reason='WRONG_PROVIDER_POSITION';
      else if(rawTime.sourceTimePrecision==='INVALID')reason='INVALID_PROVIDER_CHRONOLOGY';
      else if(!Array.isArray(payload?.players))reason='MISSING_PLAYERS';
      else if(players.some(row=>String(row?.position_id??row?.player_position_id??row?.position??'').toUpperCase()!==position))reason='WRONG_POSITION';
      const numericValues=players.map(row=>finite(row?.stats?.points_half)).filter(value=>value!=null),numeric=numericValues.length,scopeMismatch=numericValues.some(value=>value<0||value>WEEKLY_HALF_PPR_MAX[position]),allZero=numeric>0&&numericValues.every(value=>value===0),minimum=MIN_COUNTS[position],sourceSufficient=!reason&&!scopeMismatch&&!allZero&&players.length>=minimum&&numeric/Math.max(players.length,1)>=.9;
      if(!reason&&scopeMismatch)reason='WEEKLY_PROJECTION_SEMANTIC_SCOPE_MISMATCH';
      if(!reason&&allZero)reason='ALL_ZERO_WEEKLY_PROJECTION_DISTRIBUTION';
      let mapped=0;
      if(sourceSufficient){for(const row of players){
        const value=finite(row?.stats?.points_half);if(value==null){rejects.push({position,name:String(row?.name||''),sourcePlayerId:String(row?.fpid||''),reason:'NO_NUMERIC_PROVIDER_PROJECTION'});continue;}
        const mapping=mapFantasyProsPlayer(row,indexes);if(!mapping.ok){rejects.push({position,name:String(row?.name||''),sourcePlayerId:mapping.sourcePlayerId,reason:mapping.reason});continue;}
        mapped++;
        const record={schema:SCHEMA,playerId:mapping.player.id,sleeperId:mapping.player.id,sourcePlayerId:mapping.sourcePlayerId,mappingMethod:mapping.method,mappingVersion:MAPPING_VERSION,team:mapping.player.team,metric:'projected_points',value,unit:'HALF_PPR_POINTS',position,season:Number(season),week:Number(week),scoring:normalizedScoring,status:'VERIFIED',sourceId:'fantasypros',sourceUrl:`https://api.fantasypros.com/public/v2/json/nfl/${Number(season)}/projections?week=${Number(week)}&position=${position}`,expert:null,...time,verifiedAt,expiresAt:verifiedAt+EVIDENCE_TTL_MS,provenance:{provider:'FantasyPros',field:'stats.points_half',providerScope:'WEEKLY',providerScoring:String(payload.scoring||'').toUpperCase()||null,request},confidence:mapping.method==='FANTASY_DATA_ID'?.98:.8};
        if(weeklyRecordChronology(record,{season,week,scoring:normalizedScoring},verifiedAt))records.push(record);
        else rejects.push({position,name:String(row?.name||''),sourcePlayerId:mapping.sourcePlayerId,reason:'INVALID_PROVIDER_CHRONOLOGY'});
      }}
      const mappedRecords=records.filter(record=>record.position===position),mappedConsumerUsable=mappedRecords.filter(record=>weeklyRecordChronology(record,{season,week,scoring:normalizedScoring},verifiedAt)).length;
      const mappingCoverage=numeric?mapped/numeric:0,status=sourceSufficient&&mappingCoverage>=.9&&mappedConsumerUsable===mapped?'AVAILABLE':sourceSufficient?'PARTIAL':'UNAVAILABLE';
      const rejectReasonCounts={};for(const reject of rejects.filter(item=>item.position===position))rejectReasonCounts[reject.reason]=(rejectReasonCounts[reject.reason]||0)+1;
      const finalReason=reason||(!sourceSufficient?'INSUFFICIENT_SOURCE_COVERAGE':status==='PARTIAL'?'INSUFFICIENT_MAPPING_COVERAGE':null);
      const responseClassification=!responsePresent&&!invalidRequest?PROJECTION_RESPONSE_CLASSIFICATION.ABSENT_TRANSIENT:sourceSufficient&&mappedConsumerUsable>0?PROJECTION_RESPONSE_CLASSIFICATION.CURRENT_ACCEPTED:PROJECTION_RESPONSE_CLASSIFICATION.DEFINITIVE_REJECTION;
      // Context/numeric/time rejection owns and purges the lane. Partial mapping
      // keeps only individually validated current rows; missing players stay unavailable.
      if(responseClassification===PROJECTION_RESPONSE_CLASSIFICATION.DEFINITIVE_REJECTION)for(let i=records.length-1;i>=0;i--)if(records[i].position===position)records.splice(i,1);
      const consumerUsable=responseClassification===PROJECTION_RESPONSE_CLASSIFICATION.CURRENT_ACCEPTED?mappedConsumerUsable:0;
      positions[position]={status,responseClassification,sourceRows:players.length,count:players.length,numericPointsHalf:numeric,mappedRows:mapped,mapped,mappingCoverage:Math.round(mappingCoverage*1000)/1000,consumerUsableRecords:consumerUsable,rejectReasonCounts,finalLaneStatus:status,finalLaneReason:finalReason,reason:finalReason,...time};
    }
    const available=requestedPositions.every(position=>positions[position].status==='AVAILABLE');
    return{lane:{id:'fantasypros_weekly_projections',status:available?'AVAILABLE':Object.values(positions).some(x=>x.status!=='UNAVAILABLE')?'PARTIAL':'UNAVAILABLE',coverage:{positions},sourceId:'fantasypros',metric:'projected_points'},records,rejects};
  }

  function sleeperProjectionChronology(r,c,now){
    const u=String(r?.sourceUrl||'');
    return r?.schema===SCHEMA&&r.metric==='projected_points'&&r.sourceTimePrecision==='RETRIEVAL'&&r.sourcePublishedAt==null&&r.sourcePublishedDate==null&&r.provenance?.provider==='Sleeper / Rotowire'&&r.provenance?.company==='rotowire'&&r.provenance?.field==='stats.pts_half_ppr'&&r.provenance?.providerScope==='WEEKLY'&&r.provenance?.category==='proj'&&r.provenance?.seasonType==='regular'&&u==='https://api.sleeper.app/projections/nfl/'+c.season+'/'+c.week+'?season_type=regular'&&r.season===Number(c.season)&&r.week===Number(c.week)&&r.scoring==='HALF_PPR'&&r.unit==='HALF_PPR_POINTS'&&PROJECTION_POSITIONS.includes(r.position)&&typeof r.value==='number'&&Number.isFinite(r.value)&&r.value>=0&&r.value<=WEEKLY_HALF_PPR_MAX[r.position]&&r.confidence>=.7&&r.confidence<=1&&Number.isFinite(r.verifiedAt)&&r.verifiedAt<=now&&now-r.verifiedAt<=MAX_AGE_MS&&r.expiresAt>now&&r.expiresAt-r.verifiedAt<=EVIDENCE_TTL_MS&&Number.isFinite(r.provenance.providerUpdatedAt)&&r.provenance.providerUpdatedAt<=r.verifiedAt&&r.verifiedAt-r.provenance.providerUpdatedAt<=7*86400000;
  }
  function sleeperProjectionLane(payload,{season,week,sleeperPlayers,verifiedAt=Date.now()}={}){
    const records=[],rejects=[],seen=new Set(),coverage={};
    for(const position of PROJECTION_POSITIONS)coverage[position]={sourceRows:0,numericRows:0,mappedRows:0,rejectedRows:0};
    if(!Array.isArray(payload?.rows)||payload.season!==Number(season)||payload.week!==Number(week)||payload.sourceUrl!=='https://api.sleeper.app/projections/nfl/'+season+'/'+week+'?season_type=regular'||!Number.isFinite(payload.verifiedAt)||payload.verifiedAt>verifiedAt||verifiedAt-payload.verifiedAt>MAX_AGE_MS)return{records,rejects,lane:{status:'UNAVAILABLE',reason:'NO_CURRENT_SLEEPER_RESPONSE',coverage}};
    for(const row of payload.rows){const id=String(row.player_id||''),p=sleeperPlayers?.[id],position=String(p?.position||row.player?.position||'').toUpperCase()==='DEF'?'DST':String(p?.position||row.player?.position||'').toUpperCase(),sourcePosition=String(row.player?.position||'').toUpperCase()==='DEF'?'DST':String(row.player?.position||'').toUpperCase();if(!PROJECTION_POSITIONS.includes(position))continue;
      const count=coverage[position];count.sourceRows++;const value=row.stats?.pts_half_ppr;if(typeof value==='number'&&Number.isFinite(value))count.numericRows++;
      const reason=seen.has(id)?'DUPLICATE_PLAYER':!p||position!==sourcePosition||team(row.team)!==team(p.team)?'IDENTITY_MISMATCH':row.category!=='proj'||row.sport!=='nfl'||row.season_type!=='regular'||Number(row.season)!==Number(season)||Number(row.week)!==Number(week)?'CONTEXT_MISMATCH':typeof value!=='number'||!Number.isFinite(value)||value<0||value>WEEKLY_HALF_PPR_MAX[position]?'INVALID_POINTS':null;
      if(reason){count.rejectedRows++;rejects.push({playerId:id,position,reason});continue;}seen.add(id);
      const record={schema:SCHEMA,playerId:id,sleeperId:id,position,team:team(p.team),mappingMethod:'EXACT_SLEEPER_ID_POSITION_TEAM',mappingVersion:MAPPING_VERSION,metric:'projected_points',value,unit:'HALF_PPR_POINTS',season:Number(season),week:Number(week),scoring:'HALF_PPR',status:'VERIFIED',sourceId:'sleeper_rotowire',sourceUrl:payload.sourceUrl,sourcePublishedAt:null,sourcePublishedDate:null,sourceTimePrecision:'RETRIEVAL',verifiedAt:payload.verifiedAt,expiresAt:payload.verifiedAt+MAX_AGE_MS,confidence:.95,provenance:{provider:'Sleeper / Rotowire',field:'stats.pts_half_ppr',providerScope:'WEEKLY',category:row.category,seasonType:row.season_type,providerUpdatedAt:Number(row.updated_at??row.last_modified),company:row.company==='rotowire'?'rotowire':null}};
      if(row.company!=='rotowire'||!sleeperProjectionChronology(record,{season:Number(season),week:Number(week)},verifiedAt)){count.rejectedRows++;rejects.push({playerId:id,position,reason:'INVALID_PROVIDER_CHRONOLOGY_OR_PROVIDER'});continue;}count.mappedRows++;records.push(record);
    }
    for(const [position,count] of Object.entries(coverage))count.status=count.mappedRows>=MIN_COUNTS[position]&&count.mappedRows/Math.max(1,count.numericRows)>=.9?'AVAILABLE':count.mappedRows?'PARTIAL':'UNAVAILABLE';
    return{records,rejects,lane:{status:PROJECTION_POSITIONS.every(p=>coverage[p].status==='AVAILABLE')?'AVAILABLE':records.length?'PARTIAL':'UNAVAILABLE',sourceId:'sleeper_rotowire',coverage}};
  }
  function rankingRows(payload){
    if(Array.isArray(payload?.players))return payload.players;
    if(Array.isArray(payload?.rankings))return payload.rankings;
    if(Array.isArray(payload?.data?.players))return payload.data.players;
    return null;
  }

  // DATE is a calendar interval, never an exact midnight publication time.
  // Reject dates whose entire day lies outside the existing freshness window.
  function rankingSourceFresh(time,verifiedAt){
    if(time.sourceTimePrecision==='TIMESTAMP'){
      const published=Date.parse(time.sourcePublishedAt||'');
      return Number.isFinite(published)&&published<=verifiedAt&&verifiedAt-published<=EVIDENCE_TTL_MS;
    }
    if(time.sourceTimePrecision!=='DATE'||!/^\d{4}-\d{2}-\d{2}$/.test(time.sourcePublishedDate||''))return false;
    const day=Date.parse(time.sourcePublishedDate),dayEnd=day+86400000;
    return Number.isFinite(day)&&time.sourcePublishedDate<=iso(verifiedAt).slice(0,10)&&verifiedAt-dayEnd<EVIDENCE_TTL_MS;
  }

  function rankingPayloadDiagnostic(payload){
    const allowed=['QB','RB','WR','TE','K','DST','DEF'];
    const cleanPosition=value=>allowed.includes(String(value||'').toUpperCase())?String(value).toUpperCase():value==null?'MISSING':'OTHER';
    const positionCounts={};
    for(const row of rankingRows(payload)||[]){
      const position=cleanPosition(row?.position_id??row?.player_position_id??row?.position);
      positionCounts[position]=(positionCounts[position]||0)+1;
    }
    const identityFieldTypes=Object.fromEntries(['expert_name','expert_pub','total_experts','filters','experts'].map(key=>[key,payload?.[key]==null?'ABSENT':Array.isArray(payload[key])?'ARRAY':typeof payload[key]]));
    return{providerPosition:cleanPosition(payload?.position_id??payload?.position),positionCounts,identityFieldTypes};
  }

  function rankValue(row){
    for(const raw of [row?.rank_ecr,row?.ecr,row?.rank,row?.rank_ave,row?.rank_mean]){
      const value=Number(raw);if(Number.isFinite(value)&&value>0)return value;
    }
    return null;
  }

  // FantasyPros ECR is deliberately a broad current-week stabilizer. It is never
  // represented as PITTI's selected-expert panel when individual votes are absent.
  function containRankingRows(players,position,rejects,lane){
    const accepted=[];
    for(const row of players||[]){
      const actual=String(row?.position_id??row?.player_position_id??row?.position??'').toUpperCase();
      if(actual===position)accepted.push(row);
      else rejects.push({lane,position,rowPosition:actual,reason:'WRONG_POSITION'});
    }
    return{accepted,rejected:(players||[]).length-accepted.length,ratio:players?.length?accepted.length/players.length:0};
  }
  function weeklyRankLane(payloads,{season,week,scoring:scoringInput,sleeperPlayers,verifiedAt=Date.now()}={}){
    const normalizedScoring=scoring(scoringInput),indexes=sleeperIndexes(sleeperPlayers),records=[],positions={},rejects=[];
    for(const position of POSITIONS){
      const payload=payloads?.[position],players=rankingRows(payload),payloadTime=sourceTime(payload||{},{season,verifiedAt,allowSeasonDateInference:true}),minimum=RANK_MIN_COUNTS[position];
      const contained=containRankingRows(players,position,rejects,'expertWeeklyRanks');
      let reason='';
      if(!normalizedScoring)reason='WRONG_SCORING';
      else if(String(payload?.position_id??payload?.position??position).toUpperCase()!==position)reason='WRONG_POSITION';
      else if(Number(payload?.season??season)!==Number(season))reason='WRONG_SEASON';
      else if(Number(payload?.week??week)!==Number(week))reason='WRONG_WEEK';
      else if(scoring(payload?.scoring??payload?.format??scoringInput)!==normalizedScoring)reason='WRONG_SCORING';
      else if(!players)reason='MISSING_PLAYERS';
      else if(contained.ratio<.9)reason='WRONG_POSITION';
      const ranked=contained.accepted.filter(row=>rankValue(row)!=null),timed=ranked.map(row=>({row,time:sourceTime(row,{season,verifiedAt,allowSeasonDateInference:true})})).map(x=>x.time.sourceTimePrecision==='UNKNOWN'?{...x,time:payloadTime}:x),isFresh=time=>rankingSourceFresh(time,verifiedAt),freshRows=timed.filter(x=>isFresh(x.time)),staleOrAmbiguous=timed.length-freshRows.length;
      let mapped=0;
      if(!reason&&freshRows.length>=minimum)for(const {row,time} of freshRows){
        const mapping=mapFantasyProsPlayer(row,indexes);if(!mapping.ok){rejects.push({position,name:String(row?.name||row?.player_name||''),reason:mapping.reason});continue;}
        mapped++;records.push({schema:SCHEMA,playerId:mapping.player.id,sleeperId:mapping.player.id,sourcePlayerId:mapping.sourcePlayerId,mappingMethod:mapping.method,mappingVersion:MAPPING_VERSION,metric:'broad_weekly_ecr_rank',value:rankValue(row),unit:'POSITIONAL_RANK',position,season:Number(season),week:Number(week),scoring:normalizedScoring,status:'VERIFIED',sourceId:'fantasypros_weekly_ecr',sourceUrl:payload?.publicWeeklySource===true?payload.sourceUrl:`https://api.fantasypros.com/public/v2/json/nfl/${Number(season)}/consensus-rankings?week=${Number(week)}&position=${position}&scoring=HALF`,expert:null,...time,verifiedAt,expiresAt:verifiedAt+EVIDENCE_TTL_MS,provenance:{provider:'FantasyPros',aggregation:'CURRENT_WEEK_HALF_PPR_ECR',publicWeeklySource:payload?.publicWeeklySource===true,panelMembership:[],coverage:'BROAD_CONSENSUS_ONLY'},confidence:mapping.method==='FANTASY_DATA_ID'?.96:.78});
      }
      const coverage=ranked.length?mapped/ranked.length:0,status=!reason&&freshRows.length>=minimum&&freshRows.length/ranked.length>=.9&&coverage>=.9?'AVAILABLE':mapped?'PARTIAL':'UNAVAILABLE';
      const primaryReason=reason||(freshRows.length<minimum||freshRows.length/ranked.length<.9?'STALE_OR_AMBIGUOUS_ROW_TIME':status!=='AVAILABLE'?'INSUFFICIENT_MAPPING_COVERAGE':null);
      positions[position]={status,sourceRows:(players||[]).length,rejectedPositionRows:contained.rejected,samePositionCoverage:contained.ratio,rankedRows:ranked.length,freshRows:freshRows.length,mappedRows:mapped,mappingCoverage:Math.round(coverage*1000)/1000,staleOrAmbiguousTimeCount:staleOrAmbiguous,primaryRejectionReason:primaryReason,reason:primaryReason};
    }
    const available=POSITIONS.every(position=>positions[position].status==='AVAILABLE');
    return{lane:{id:'fantasypros_weekly_ecr',status:available?'AVAILABLE':Object.values(positions).some(x=>x.status!=='UNAVAILABLE')?'PARTIAL':'UNAVAILABLE',coverage:{positions},metric:'broad_weekly_ecr_rank',panelStatus:'BROAD_CONSENSUS_ONLY'},records,rejects};
  }


  function explicitExpertMembership(payload){
    const names=payload?.expert_name&&typeof payload.expert_name==='object'&&!Array.isArray(payload.expert_name)?payload.expert_name:{};
    const pubs=payload?.expert_pub&&typeof payload.expert_pub==='object'&&!Array.isArray(payload.expert_pub)?payload.expert_pub:{};
    const ids=[...new Set([...Object.keys(names),...Object.keys(pubs)].filter(id=>/^\d+$/.test(String(id))))];
    return ids.map(id=>({id:String(id),name:String(names[id]||'').trim(),site:String(pubs[id]||'').trim()}));
  }
  function numericFilterIds(value){return [...new Set(String(value??'').match(/\d+/g)||[])].sort((a,b)=>Number(a)-Number(b));}
  function sameIds(a,b){const aa=[...new Set((a||[]).map(String))].sort((x,y)=>Number(x)-Number(y)),bb=[...new Set((b||[]).map(String))].sort((x,y)=>Number(x)-Number(y));return aa.length===bb.length&&aa.every((id,index)=>id===bb[index]);}

  // Selected weekly ranks are provider-generated consensus restricted to the exact
  // current PITTI expert IDs. Broad ECR remains a separate lane and can never stand
  // in for a missing selected expert or a missing selected panel.
  function selectedWeeklyRankLane(payloads,{season,week,scoring:scoringInput,sleeperPlayers,verifiedAt=Date.now()}={}){
    const normalizedScoring=scoring(scoringInput),indexes=sleeperIndexes(sleeperPlayers),records=[],positions={},rejects=[];
    for(const position of POSITIONS){
      const envelope=payloads?.[position],payload=envelope?.providerPayload,request=envelope?.requestProvenance||{},requested=(Array.isArray(envelope?.requestedExperts)?envelope.requestedExperts:[]).map(expert=>({id:String(expert?.id||''),name:String(expert?.name||'').trim()})).filter(expert=>/^\d+$/.test(expert.id)&&expert.name);
      const configuredNames=(Array.isArray(envelope?.configuredExpertNames)?envelope.configuredExpertNames:requested.map(expert=>expert.name)).map(String);
      const directoryMissing=(Array.isArray(envelope?.missingDirectoryExperts)?envelope.missingDirectoryExperts:[]).map(String);
      const requestedIds=requested.map(expert=>expert.id),providerFilterIds=numericFilterIds(payload?.filters),membership=explicitExpertMembership(payload),membershipIds=membership.map(expert=>expert.id),totalExperts=Number(payload?.total_experts);
      const players=rankingRows(payload),payloadTime=sourceTime(payload||{},{season,verifiedAt,allowSeasonDateInference:true}),minimum=RANK_MIN_COUNTS[position],minimumExperts=SELECTED_PANEL_MIN_EXPERTS[position];
      const knownNames=new Map(requested.map(expert=>[expert.id,expert.name])),actualMembership=membership.filter(expert=>requestedIds.includes(expert.id)).map(expert=>({...expert,name:expert.name||knownNames.get(expert.id)||''}));
      const actualIds=actualMembership.map(expert=>expert.id),missingRequested=requested.filter(expert=>!actualIds.includes(expert.id)).map(expert=>expert.name),unexpectedMembership=membership.filter(expert=>!requestedIds.includes(expert.id));
      const contained=containRankingRows(players,position,rejects,'pittiSelectedWeeklyRanks');
      const requestValid=Number(request?.season)===Number(season)&&Number(request?.week)===Number(week)&&String(request?.position||'').toUpperCase()===position&&String(request?.scoring||'').toUpperCase()==='HALF'&&request?.experts==='show'&&sameIds(request?.requestedExpertIds,requestedIds);
      let reason='';
      if(!normalizedScoring)reason='WRONG_SCORING';
      else if(!envelope)reason='NO_CURRENT_PROVIDER_RESPONSE';
      else if(!requestValid)reason='INVALID_REQUEST_PROVENANCE';
      else if(requested.length<minimumExperts)reason='INSUFFICIENT_RESOLVED_EXPERT_IDS';
      else if(payload==null||typeof payload!=='object'||Array.isArray(payload))reason='MALFORMED_PROVIDER_RESPONSE';
      else if(Number(payload?.season??payload?.year??season)!==Number(season))reason='WRONG_SEASON';
      else if(Number(payload?.week)!==Number(week))reason='WRONG_WEEK';
      else if(String(payload?.position_id??payload?.position??position).toUpperCase()!==position)reason='WRONG_POSITION';
      else if(scoring(payload?.scoring??payload?.format??scoringInput)!==normalizedScoring)reason='WRONG_SCORING';
      else if(!players)reason='MISSING_PLAYERS';
      else if(providerFilterIds.length&&!sameIds(providerFilterIds,requestedIds))reason='FILTER_IDENTITY_MISMATCH';
      else if(!membership.length||unexpectedMembership.length||!Number.isFinite(totalExperts)||totalExperts!==membership.length)reason='UNPROVEN_EXPERT_IDENTITY';
      else if(actualMembership.length<minimumExperts)reason='INSUFFICIENT_SELECTED_EXPERTS';
      else if(contained.ratio<.9)reason='WRONG_POSITION';
      const ranked=contained.accepted.filter(row=>rankValue(row)!=null),timed=ranked.map(row=>({row,time:sourceTime(row,{season,verifiedAt,allowSeasonDateInference:true})})).map(x=>x.time.sourceTimePrecision==='UNKNOWN'?{...x,time:payloadTime}:x),isFresh=time=>rankingSourceFresh(time,verifiedAt),freshRows=timed.filter(x=>isFresh(x.time)),staleOrAmbiguous=timed.length-freshRows.length;
      let mapped=0;
      const sourceReady=!reason&&freshRows.length>=minimum&&freshRows.length/Math.max(ranked.length,1)>=.9;
      if(sourceReady)for(const {row,time} of freshRows){
        const mapping=mapFantasyProsPlayer(row,indexes);if(!mapping.ok){rejects.push({position,name:String(row?.name||row?.player_name||''),reason:mapping.reason,lane:'pittiSelectedWeeklyRanks'});continue;}
        mapped++;
        const filters=requestedIds.slice().sort((a,b)=>Number(a)-Number(b)).join(':');
        records.push({schema:SCHEMA,playerId:mapping.player.id,sleeperId:mapping.player.id,sourcePlayerId:mapping.sourcePlayerId,mappingMethod:mapping.method,mappingVersion:MAPPING_VERSION,metric:'weekly_rank',value:rankValue(row),unit:'POSITIONAL_RANK',position,season:Number(season),week:Number(week),scoring:normalizedScoring,status:'VERIFIED',sourceId:'fantasypros_pitti_selected_weekly_panel',sourceUrl:`https://api.fantasypros.com/public/v2/json/nfl/${Number(season)}/consensus-rankings?week=${Number(week)}&position=${position}&scoring=HALF&filters=${filters}&experts=show`,expert:null,...time,verifiedAt,expiresAt:verifiedAt+EVIDENCE_TTL_MS,provenance:{provider:'FantasyPros',aggregation:'FILTERED_ECR_SELECTED_PITTI_PANEL',requestedExperts:requested,actualExperts:actualMembership,missingSelectedExperts:[...directoryMissing,...missingRequested],providerFilters:providerFilterIds,totalExperts,identityBound:true},confidence:mapping.method==='FANTASY_DATA_ID'?.97:.8});
      }
      const coverage=ranked.length?mapped/ranked.length:0,status=sourceReady&&coverage>=.9?'AVAILABLE':mapped?'PARTIAL':'UNAVAILABLE';
      const primaryReason=reason||(!sourceReady?'STALE_OR_AMBIGUOUS_ROW_TIME':status!=='AVAILABLE'?'INSUFFICIENT_MAPPING_COVERAGE':null);
      if(status!=='AVAILABLE')for(let i=records.length-1;i>=0;i--)if(records[i].position===position)records.splice(i,1);
      positions[position]={status,responsePresent:envelope?.providerResponsePresent===true,sourceRows:(players||[]).length,rejectedPositionRows:contained.rejected,samePositionCoverage:contained.ratio,rankedRows:ranked.length,freshRows:freshRows.length,mappedRows:status==='AVAILABLE'?mapped:0,mappingCoverage:Math.round(coverage*1000)/1000,staleOrAmbiguousTimeCount:staleOrAmbiguous,configuredExperts:configuredNames,requestedExperts:requested,actualExperts:actualMembership,missingExperts:[...directoryMissing,...missingRequested],primaryRejectionReason:primaryReason,reason:primaryReason};
    }
    const available=POSITIONS.every(position=>positions[position].status==='AVAILABLE'),some=POSITIONS.some(position=>positions[position].status==='AVAILABLE');
    return{lane:{id:'fantasypros_pitti_selected_weekly_panel',status:available?'AVAILABLE':some?'PARTIAL':'UNAVAILABLE',coverage:{positions},metric:'weekly_rank',panelStatus:available?'AVAILABLE':some?'PARTIAL':'UNAVAILABLE'},records,rejects};
  }

  function buildSnapshot({season,week,scoring:scoringInput,projectionPayloads,projectionPositions=POSITIONS,rankingPayloads,selectedRankingPayloads,sleeperPlayers,priorSnapshot,verifiedAt=Date.now()}={}){
    const normalizedScoring=scoring(scoringInput);if(!normalizedScoring)throw new Error('WEEKLY_EVIDENCE_WRONG_SCORING');
    if(!Number.isInteger(Number(season))||!Number.isInteger(Number(week)))throw new Error('WEEKLY_EVIDENCE_INVALID_CONTEXT');
    const projections=projectionLane(projectionPayloads,{season,week,scoring:normalizedScoring,sleeperPlayers,verifiedAt,positions:arguments[0]?.sleeperProjectionPayload?PROJECTION_POSITIONS:projectionPositions});
    const ranks=weeklyRankLane(rankingPayloads,{season,week,scoring:normalizedScoring,sleeperPlayers,verifiedAt});
    const selectedRanks=selectedWeeklyRankLane(selectedRankingPayloads,{season,week,scoring:normalizedScoring,sleeperPlayers,verifiedAt});
    const lanes={projections:projections.lane,expertWeeklyRanks:ranks.lane,pittiSelectedWeeklyRanks:selectedRanks.lane,vegas:{status:'UNAVAILABLE',reason:'INDEPENDENT_GAME_CONTEXT_LANE'},weather:{status:'UNAVAILABLE',reason:'GAME_CONTEXT_REQUIRED'},roleGraphs:{status:'UNAVAILABLE',reason:'SOURCE_UNAVAILABLE'}};
    const fallback=sleeperProjectionLane(arguments[0]?.sleeperProjectionPayload,{season,week,sleeperPlayers,verifiedAt}),primaryIds=new Set(projections.records.map(r=>r.playerId));
    const fallbackRecords=fallback.records.filter(r=>!primaryIds.has(r.playerId));
    projections.records.push(...fallbackRecords);
    lanes.projections.fallback=fallback.lane;
    for(const pos of PROJECTION_POSITIONS){const usable=projections.records.filter(r=>r.position===pos).length;if(usable){const coverage=lanes.projections.coverage.positions[pos];coverage.consumerUsableRecords=usable;if(coverage.status==='UNAVAILABLE'){coverage.status=fallback.lane.coverage[pos]?.status||'PARTIAL';coverage.reason='LABELED_SLEEPER_FALLBACK';}}}
    if(projections.records.length)lanes.projections.status=Object.values(lanes.projections.coverage.positions).every(p=>p.status==='AVAILABLE')?'AVAILABLE':'PARTIAL';
    const fresh=[...projections.records,...selectedRanks.records,...ranks.records],freshKeys=new Set(fresh.map(record=>`${record.metric}|${record.position}|${record.playerId}`));
    const laneAvailable=(metric,position)=>metric==='projected_points'?['AVAILABLE','PARTIAL'].includes(projections.lane.coverage.positions[position]?.status):metric==='weekly_rank'?selectedRanks.lane.coverage.positions[position]?.status==='AVAILABLE':metric==='broad_weekly_ecr_rank'?ranks.lane.coverage.positions[position]?.status==='AVAILABLE':false;
    // Carry-forward is reserved for a lane for which no provider response exists.
    // Any present response (or contradictory authenticated request context) owns its
    // lane and purges prior rows when it cannot satisfy the weekly invariants.
    const explicitlyRejected=(metric,position)=>metric==='projected_points'?projections.lane.coverage.positions[position]?.responseClassification===PROJECTION_RESPONSE_CLASSIFICATION.DEFINITIVE_REJECTION:metric==='weekly_rank'?selectedRanks.lane.coverage.positions[position]?.responsePresent===true&&selectedRanks.lane.coverage.positions[position]?.status!=='AVAILABLE':metric==='broad_weekly_ecr_rank'?ranks.lane.coverage.positions[position]?.status!=='AVAILABLE'&&Object.prototype.hasOwnProperty.call(rankingPayloads||{},position):false;
    const priorValid=priorSnapshot?.schema===SCHEMA&&Number(priorSnapshot.season)===Number(season)&&Number(priorSnapshot.week)===Number(week)&&priorSnapshot.scoring===normalizedScoring&&Array.isArray(priorSnapshot.records)?priorSnapshot.records.filter(record=>weeklyRecordChronology(record,{season,week,scoring:normalizedScoring},verifiedAt)&&!laneAvailable(record.metric,record.position)&&!explicitlyRejected(record.metric,record.position)&&!freshKeys.has(`${record.metric}|${record.position}|${record.playerId}`)):[];
    const records=[...fresh,...priorValid];
    const freshProjectionUsable=projections.records.length>0;
    const selectedExpertSummary=Object.fromEntries(POSITIONS.map(position=>[position,{status:selectedRanks.lane.coverage.positions[position]?.status||'UNAVAILABLE',requested:selectedRanks.lane.coverage.positions[position]?.requestedExperts||[],actual:selectedRanks.lane.coverage.positions[position]?.actualExperts||[],missing:selectedRanks.lane.coverage.positions[position]?.missingExperts||[]}]));
    const snapshot={schema:SCHEMA,snapshotId:`wev2-${Number(season)}-${Number(week)}-${normalizedScoring}-${verifiedAt}`,season:Number(season),week:Number(week),scoring:normalizedScoring,fetchedAt:verifiedAt,lastAttemptAt:verifiedAt,lastSuccessAt:freshProjectionUsable?verifiedAt:Number(priorSnapshot?.lastSuccessAt)||null,status:projections.lane.status==='AVAILABLE'&&selectedRanks.lane.status==='AVAILABLE'?'AVAILABLE':freshProjectionUsable?'DEGRADED':'UNAVAILABLE',lanes,records,rejections:[...projections.rejects,...fallback.rejects,...selectedRanks.rejects,...ranks.rejects],retainedPriorRecords:priorValid.length,panel:{weeklyRank:{status:selectedRanks.lane.status,sources:selectedRanks.lane.status==='UNAVAILABLE'?[]:['FantasyPros filtered current-week Half-PPR consensus'],selectedExperts:selectedExpertSummary,aggregation:'Exact configured PITTI expert IDs only; missing experts remain missing; no broad-ECR fallback'},broadWeeklyEcr:{status:ranks.lane.status,sources:ranks.lane.status==='UNAVAILABLE'?[]:['FantasyPros current-week Half-PPR ECR'],aggregation:'BROAD_CONSENSUS_ONLY'},projection:{status:projections.lane.status,source:'fantasypros'}}};
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
      lanes:{...snapshot.lanes,expertWeeklyRanks:{...(snapshot.lanes?.expertWeeklyRanks||{}),status:'UNAVAILABLE',reason:'STORAGE_QUOTA_PROJECTION_ONLY'},pittiSelectedWeeklyRanks:{...(snapshot.lanes?.pittiSelectedWeeklyRanks||{}),status:'UNAVAILABLE',reason:'STORAGE_QUOTA_PROJECTION_ONLY'}},
      panel:{...snapshot.panel,weeklyRank:{status:'UNAVAILABLE',sources:[],selectedExperts:{},aggregation:'SELECTED_PANEL_NOT_PERSISTED_STORAGE_QUOTA'},broadWeeklyEcr:{status:'UNAVAILABLE',sources:[],aggregation:'BROAD_CONSENSUS_NOT_PERSISTED_STORAGE_QUOTA'}},
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
        // Individual numeric expert caches contain provider-rebuildable draft ranks.
        // Reclaim one at a time, largest first, stopping as soon as the full write fits.
        const caches=[];
        for(let i=0;i<storage.length;i++){
          const key=storage.key(i);
          if(/^v7_rank_\d+$/.test(key))caches.push({key,size:String(storage.getItem(key)||'').length});
        }
        caches.sort((a,b)=>b.size-a.size);
        for(const {key} of caches){
          safeRemove(storage,key);
          try{return commit(snapshot);}catch(retry){if(!storageQuotaError(retry))throw retry;}
        }
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

  return{sleeperProjectionLane,rankingPayloadDiagnostic,SCHEMA,CACHE_KEY,TEMP_KEY,MAPPING_VERSION,MAX_AGE_MS,EVIDENCE_TTL_MS,POSITIONS,PROJECTION_POSITIONS,MIN_COUNTS,RANK_MIN_COUNTS,SELECTED_PANEL_MIN_EXPERTS,WEEKLY_PROJECTION_QUERY_SHAPE,WEEKLY_HALF_PPR_MAX,sourceTime,retrievalProjectionChronology,weeklyRecordChronology,sleeperIndexes,mapFantasyProsPlayer,projectionLane,weeklyRankLane,selectedWeeklyRankLane,buildSnapshot,validateSnapshot,projectionOnlyStorageSnapshot,atomicWrite};
});
