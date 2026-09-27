import {adaptBooneTradeEvidence,PEAKED_GATE,POSITIONS} from './boone-trade-values-v1.mjs';
import './trade-team-needs-v2.js';
export {adaptBooneTradeEvidence,PEAKED_GATE};
const trade=globalThis.PittiTradeTeamNeedsV2;

export function evaluateBooneTradeOffer({snapshot,context,now=Date.now(),...offer}){
  const requested=[...(offer.give||[]),...(offer.get||[])];
  const evidence=adaptBooneTradeEvidence(snapshot,context,now,requested.map(row=>row?.p?.id));
  if(!evidence.available)return{actionable:false,status:'MONITOR',reason:evidence.reason,acceptanceProbability:null,acceptanceLabel:'conservative heuristic'};
  // Do not let a caller bypass the engine's active-roster generator with an IR row.
  if(requested.some(row=>row.seasonStatus!=='ACTIVE'||!POSITIONS.includes(row.p?.pos))||(offer.give||[]).some(row=>!offer.mine?.includes(row))||(offer.get||[]).some(row=>!offer.opponent?.includes(row)))return{actionable:false,status:'REJECT',reason:'NON_ACTIVE_OR_UNOWNED_PLAYER',acceptanceProbability:null};
  return trade.evaluateOffer({...offer,evidence,season:{...offer.season,week:context.week},currentDate:now});
}
