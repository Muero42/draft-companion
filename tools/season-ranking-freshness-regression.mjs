import fs from 'node:fs';
const s=fs.readFileSync('app.js','utf8');
for(const token of [
"SEASON_RANKING_AUTO_MS=3*60*60*1000",
"SEASON_RANKING_RETRY_MS=45*60*1000",
"Rankings älter als 3 Std. · automatischer Refresh wird versucht.",
"Rankings aktuell genug · automatischer Refresh spätestens nach 3 Std.",
"refreshSeasonRankings({force:true})"
]) if(!s.includes(token)) throw new Error('season ranking freshness regression: '+token);
if(s.includes("SEASON_RANKING_AUTO_MS=12*60*60*1000")) throw new Error('stale 12h season ranking policy resurrected');
console.log('season ranking freshness regression PASS');
