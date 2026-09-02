import fs from 'node:fs';import assert from 'node:assert/strict';
const app=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8'),html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const v=(app.match(/const APP_VERSION='([^']+)'/)||[])[1];const n=Number((v.match(/rc4\.(\d+)/)||[])[1]);assert.ok(n>=176,'requires rc4.176+');
for(const id of ['seasonRefreshLiveBtn','seasonRefreshRanksBtn']){assert.ok(!html.includes('id="'+id+'"'));assert.ok(!app.includes("'"+id+"'"));}
assert.ok(app.includes('const rosterResult=await bootstrapSeasonWorkspace();'));
assert.ok(app.includes('void refreshSeasonRankings({auto:true});'));
assert.ok(app.includes('SEASON_RANKING_AUTO_MS=3*60*60*1000'));
console.log('SEASON_AUTOMATIC_REFRESH_CONTRACT_PASS '+v);