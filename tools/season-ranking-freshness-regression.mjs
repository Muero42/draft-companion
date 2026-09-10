import fs from 'node:fs';
const s=fs.readFileSync('app.js','utf8');
for(const token of [
"SEASON_RANKING_AUTO_MS=3*60*60*1000",
"SEASON_RANKING_RETRY_MS=45*60*1000",
"Weekly Evidence älter als 3 Std. · automatische Prüfung wird versucht.",
"FantasyPros Weekly Projections verifiziert · Expert-Ranks/Matchup-Lanes bleiben separat fail-closed.",
// Manual Season controls were retired by rc4.176. Protect the automatic path.
"void refreshSeasonRankings({auto:true});",
"if(!force&&last&&now-last<SEASON_RANKING_AUTO_MS)",
"if(auto&&attempt&&now-attempt<SEASON_RANKING_RETRY_MS)",
"if(!navigator.onLine)"
]) if(!s.includes(token)) throw new Error('season ranking freshness regression: '+token);
if(s.includes("SEASON_RANKING_AUTO_MS=12*60*60*1000")) throw new Error('stale 12h season ranking policy resurrected');
const start=s.indexOf('async function refreshSeasonRankings('),end=s.indexOf('// Do not run derived-panel',start),refresh=s.slice(start,end);
if(refresh.includes('loadExperts()')||refresh.includes('loadAllRanks()'))throw new Error('Season refresh routed back into draft ranking architecture');
for(const token of ['currentSleeperNflWeek(season)','stats.points_half','api.atomicWrite(localStorage','trigger:\'timer\'','trigger:\'resume\'','trigger:\'online\'','trigger:\'manual\'','retryAfterUntil'])if(!s.includes(token))throw new Error('weekly evidence lifecycle missing: '+token);
console.log('season ranking freshness regression PASS');
