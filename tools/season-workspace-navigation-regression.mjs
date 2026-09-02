import fs from 'node:fs';import assert from 'node:assert/strict';
const app=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8'),html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert.ok(app.length>380000,'app truncation '+app.length);
assert.ok(Number((app.match(/const APP_VERSION='v11\.8\.0-rc4\.(\d+)'/)||[])[1])>=176);
assert.ok(app.includes('function setWorkspace('));
assert.ok(app.includes("document.querySelectorAll('[data-workspace-target]').forEach(btn=>btn.addEventListener('click',()=>setWorkspace(btn.dataset.workspaceTarget)))"));
for(const name of ['roster','waiver','trade','live','draft'])assert.ok(html.includes('data-workspace-target="'+name+'"'),'tab '+name);
for(const id of ['seasonRefreshLiveBtn','seasonRefreshRanksBtn']){assert.ok(!html.includes('id="'+id+'"'));assert.ok(!app.includes("'"+id+"'"));}
assert.ok(!app.includes('bindCriticalSeasonControlsEarly'));
const rankConst=app.indexOf('const SEASON_RANKING_AUTO_MS='),startup=app.lastIndexOf('const rosterResult=await bootstrapSeasonWorkspace();');
assert.ok(rankConst>=0&&startup>rankConst,'startup before ranking constants');
assert.ok(app.includes('void refreshSeasonRankings({auto:true});'));
console.log('SEASON_WORKSPACE_NAVIGATION_REGRESSION_PASS');
// liveDecisionSurfaceV3 workspace visibility ownership
const liveSurface=fs.readFileSync('live-surface-v3.js','utf8');
assert.ok(!liveSurface.includes("root.hidden=false"),'live decision renderer must not override workspace hidden state');
assert.ok(html.includes('id="liveDecisionSurfaceV3"')&&html.includes('data-workspace="draft"'),'live decision surface must remain Draft-scoped');
