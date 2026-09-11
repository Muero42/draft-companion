import {POSITIONS,WEEK1_URLS,parseBooneChartHtml,buildBooneTradeValueSnapshot} from '../boone-trade-values-v1.mjs';

const DRAFT_ID='1366053132970233856';
const DRAFT_SLOT=9;
const now=Date.now();
const getJson=async url=>{const response=await fetch(url,{headers:{accept:'application/json'}});if(!response.ok)throw new Error(`${url} HTTP ${response.status}`);return response.json();};
const getText=async url=>{const response=await fetch(url,{headers:{accept:'text/html,application/xhtml+xml'}});if(!response.ok)throw new Error(`${url} HTTP ${response.status}`);return response.text();};

const [sleeperPlayers,draft,...htmls]=await Promise.all([
  getJson('https://api.sleeper.app/v1/players/nfl'),
  getJson(`https://api.sleeper.app/v1/draft/${DRAFT_ID}`),
  ...POSITIONS.map(position=>getText(WEEK1_URLS[position]))
]);
const charts=Object.fromEntries(POSITIONS.map((position,index)=>[position,parseBooneChartHtml(htmls[index],{position,season:2026,week:1,sourceUrl:WEEK1_URLS[position],now})]));
const snapshot=buildBooneTradeValueSnapshot({charts,sleeperPlayers,season:2026,week:1,verifiedAt:now});
if(snapshot.status!=='AVAILABLE')throw new Error(`LIVE_SOURCE_UNAVAILABLE ${JSON.stringify(snapshot.coverage)}`);

const leagueId=String(draft.league_id||'');
if(!leagueId)throw new Error('DRAFT_LEAGUE_ID_MISSING');
const rosters=await getJson(`https://api.sleeper.app/v1/league/${leagueId}/rosters`);
const mappedRosterId=Number(draft?.slot_to_roster_id?.[String(DRAFT_SLOT)]??draft?.slot_to_roster_id?.[DRAFT_SLOT]);
const ownerFromSlot=Object.entries(draft?.draft_order||{}).find(([,slot])=>Number(slot)===DRAFT_SLOT)?.[0]||'';
const mine=rosters.find(roster=>Number(roster.roster_id)===mappedRosterId)||rosters.find(roster=>String(roster.owner_id||'')===String(ownerFromSlot));
if(!mine)throw new Error('PITTI_LIVE_ROSTER_UNRESOLVED');

const recordIds=new Set(snapshot.records.map(record=>String(record.playerId)));
const skillIds=roster=>new Set(
  [...(roster.players||[]),...(roster.reserve||[]),...(roster.taxi||[])]
    .map(String)
    .filter(id=>POSITIONS.includes(String(sleeperPlayers[id]?.position||'').toUpperCase()))
);
const coverageFor=roster=>{const ids=[...skillIds(roster)];return{eligible:ids.length,mapped:ids.filter(id=>recordIds.has(id)).length};};
const opponents=rosters.filter(roster=>Number(roster.roster_id)!==Number(mine.roster_id)).map(roster=>({rosterId:Number(roster.roster_id),...coverageFor(roster)}));
const opponentTotal=opponents.reduce((acc,row)=>({eligible:acc.eligible+row.eligible,mapped:acc.mapped+row.mapped}),{eligible:0,mapped:0});
const output={
  auditedAt:new Date(now).toISOString(),sourceEdition:snapshot.sourceEdition,status:snapshot.status,
  sourceCoverage:Object.fromEntries(POSITIONS.map(position=>[position,snapshot.coverage.positions[position]])),
  total:{sourceRows:snapshot.coverage.sourceRows,mappedRows:snapshot.coverage.mappedRows,rejected:snapshot.rejections.length},
  rejectionsByReason:snapshot.rejections.reduce((counts,row)=>({...counts,[row.reason]:(counts[row.reason]||0)+1}),{}),
  liveLeague:{leagueId,rosters:rosters.length,pittiRosterId:Number(mine.roster_id),pitti:coverageFor(mine),opponents:opponentTotal,opponentRosters:opponents}
};
console.log(JSON.stringify(output,null,2));
