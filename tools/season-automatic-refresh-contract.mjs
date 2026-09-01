import fs from 'node:fs';import assert from 'node:assert/strict';
const app=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8'),html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert.ok(app.includes("const APP_VERSION='v11.8.0-rc4.175'"));
for(const id of ['seasonRefreshLiveBtn','seasonRefreshRanksBtn']){assert.ok(!html.includes('id="'+id+'"'));assert.ok(!app.includes("'"+id+"'"));}
assert.ok(app.includes('const rosterResult=await bootstrapSeasonWorkspace();'));
assert.ok(app.includes('void refreshSeasonRankings({auto:true});'));
assert.ok(app.includes('SEASON_RANKING_AUTO_MS=12*60*60*1000'));
console.log('SEASON_AUTOMATIC_REFRESH_CONTRACT_PASS');