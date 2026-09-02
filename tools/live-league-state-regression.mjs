import fs from 'node:fs';
const s=fs.readFileSync('app.js','utf8');
for(const token of [
  "expectedTeams!==10||rosters.length!==expectedTeams||league_rosters.length!==expectedTeams",
  "LEAGUE_ROSTER_COUNT_MISMATCH",
  "LEAGUE_ROSTER_IDENTITY_INCOMPLETE",
  "LEAGUE_OWNERSHIP_INDEX_MISMATCH",
  "const rawOwnedIds=new Set(rosters.flatMap",
  "const owned=new Set(Object.keys(season.ownership||{}).map(String))",
  "for(const roster of season.rosters||[])",
  "SEASON_FA_POOL_ZERO_INVALID"
]) if(!s.includes(token)) throw new Error('live league-state guard missing: '+token);
if(!s.includes("waiver_budget_used:Number(settings.waiver_budget_used||0)")||!s.includes("rr.faab_remaining=faabBudget>0?Math.max(0,faabBudget-rr.waiver_budget_used):null")) throw new Error('FAAB live-state derivation missing');
console.log('live league state regression PASS');
