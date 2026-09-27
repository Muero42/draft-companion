import {validateBooneTradeValueSnapshot,SCHEMA,RECORD_SCHEMA,SOURCE_ID,PROVIDER,AUTHOR,POSITIONS,MIN_COUNTS,MAX_SOURCE_AGE_MS,SNAPSHOT_TTL_MS,MAPPING_VERSION} from './boone-trade-values-v1.mjs';
import './trade-team-needs-v2.js';

const trade=globalThis.PittiTradeTeamNeedsV2;
export const PEAKED_GATE='PEAKED_SOURCE_CONTRACT_NOT_VERIFIED';
const unavailable=reason=>({available:false,reason,values:{},secondarySourceGate:PEAKED_GATE});

// Source boundary for Trade vNext. Never accept generic/previously adapted maps.
export function adaptBooneTradeEvidence(snapshot,context={},now=Date.now(),requestedPlayerIds=[]){
  if(!Number.isFinite(now)||!Number.isInteger(context.season)||!Number.isInteger(context.week)||context.week<1||context.week>18||context.scoring!=='HALF_PPR')return unavailable('CONTEXT_MISMATCH');
  if(Array.isArray(snapshot?.records)&&snapshot.records.some(row=>!row||typeof row!=='object'))return unavailable('INVALID_RECORDS');
  const checked=validateBooneTradeValueSnapshot(snapshot,context,now);
  if(!checked.ok)return unavailable(checked.reason);
  const edition=`boone-yahoo-${context.season}-week-${context.week}`;
  if(snapshot.schema!==SCHEMA||snapshot.sourceId!==SOURCE_ID||snapshot.sourceProvider!==PROVIDER||snapshot.sourceAuthor!==AUTHOR||snapshot.sourceEdition!==edition)return unavailable('INVALID_SOURCE');
  if(!Number.isFinite(snapshot.expiresAt)||snapshot.expiresAt<=now||snapshot.expiresAt>snapshot.lastSuccessAt+SNAPSHOT_TTL_MS)return unavailable('STALE');
  const values=Object.create(null),counts=Object.fromEntries(POSITIONS.map(p=>[p,0]));
  for(const row of snapshot.records){
    if(!row||row.schema!==RECORD_SCHEMA||row.status!=='VERIFIED'||row.conflict||!POSITIONS.includes(row.position)||row.season!==context.season||row.week!==context.week||row.scoring!=='HALF_PPR'||row.unit!=='BOONE_TRADE_VALUE'||row.sourceProvider!==PROVIDER||row.sourceAuthor!==AUTHOR||row.mappingVersion!==MAPPING_VERSION||row.mappingMethod!=='EXACT_NORMALIZED_NAME_POSITION'||typeof row.playerId!=='string'||!row.playerId.trim()||row.playerId!==row.sleeperId||typeof row.value!=='number'||!Number.isFinite(row.value)||row.value<0||row.value>200)return unavailable('INVALID_RECORDS');
    if(Object.hasOwn(values,row.playerId))return unavailable('DUPLICATE_PLAYER_RECORD');
    if(!Number.isFinite(row.publishedAt)||!Number.isFinite(row.verifiedAt)||!Number.isFinite(row.expiresAt)||row.publishedAt>row.verifiedAt||row.verifiedAt>now||now-row.publishedAt>MAX_SOURCE_AGE_MS||now-row.verifiedAt>SNAPSHOT_TTL_MS||row.expiresAt<=now||row.expiresAt>row.verifiedAt+SNAPSHOT_TTL_MS||row.verifiedAt!==snapshot.lastSuccessAt)return unavailable('STALE');
    if(row.provenance?.provider!==PROVIDER||row.provenance?.author!==AUTHOR||row.provenance?.chartPosition!==row.position||row.provenance?.selectedColumn!==(row.position==='QB'?'1QB':'HALF'))return unavailable('INVALID_PROVENANCE');
    counts[row.position]++;
    values[row.playerId]=Object.freeze({...row,provenance:Object.freeze({...row.provenance})});
  }
  for(const position of POSITIONS){
    const coverage=snapshot.coverage.positions[position];
    if(!Number.isInteger(coverage.sourceCount)||coverage.sourceCount<MIN_COUNTS[position]||coverage.mapped!==counts[position]||counts[position]>coverage.sourceCount||counts[position]/coverage.sourceCount<.75)return unavailable('PARTIAL_POSITION_COVERAGE');
  }
  if(!Array.isArray(requestedPlayerIds)||requestedPlayerIds.some(id=>!Object.hasOwn(values,String(id))))return unavailable('PLAYER_VALUE_UNAVAILABLE');
  return Object.freeze({available:true,reason:'OK',fresh:true,source:SOURCE_ID,provider:PROVIDER,author:AUTHOR,sourceEdition:edition,snapshotId:snapshot.snapshotId,season:context.season,week:context.week,scoring:'HALF_PPR',unit:'BOONE_TRADE_VALUE',asOf:snapshot.lastSuccessAt,expiresAt:Math.min(snapshot.expiresAt,...snapshot.records.map(r=>r.expiresAt)),values:Object.freeze(values),secondarySourceGate:PEAKED_GATE});
}

export function evaluateBooneTradeOffer({snapshot,context,now=Date.now(),...offer}){
  const requested=[...(offer.give||[]),...(offer.get||[])];
  const evidence=adaptBooneTradeEvidence(snapshot,context,now,requested.map(row=>row?.p?.id));
  if(!evidence.available)return{actionable:false,status:'MONITOR',reason:evidence.reason,acceptanceProbability:null,acceptanceLabel:'conservative heuristic'};
  // Do not let a caller bypass the engine's active-roster generator with an IR row.
  if(requested.some(row=>row.seasonStatus!=='ACTIVE'||!POSITIONS.includes(row.p?.pos))||(offer.give||[]).some(row=>!offer.mine?.includes(row))||(offer.get||[]).some(row=>!offer.opponent?.includes(row)))return{actionable:false,status:'REJECT',reason:'NON_ACTIVE_OR_UNOWNED_PLAYER',acceptanceProbability:null};
  return trade.evaluateOffer({...offer,evidence,season:{...offer.season,week:context.week},currentDate:now});
}
