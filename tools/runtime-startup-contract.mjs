import fs from 'node:fs';
import assert from 'node:assert/strict';

const app=fs.readFileSync('app.js','utf8');
const sw=fs.readFileSync('sw.js','utf8');
const html=fs.readFileSync('index.html','utf8');
const policy=fs.readFileSync('decision-policy.js','utf8');

const version=(app.match(/const APP_VERSION='([^']+)'/)||[])[1];
assert(version,'APP_VERSION missing');
for(const src of [html,sw])assert(src.includes(version),'runtime version parity missing: '+version);

// Parse source app after removing its static import.
new Function(app.replace(/^import[^\n]*\n/,''));

// Parse decision policy after removing ESM export keywords.
new Function(policy.replace(/\bexport\s+/g,''));

// Static parsing is insufficient for module startup: catch temporal-dead-zone regressions
// where Season helpers reference a lexical dependency declared only much later in the module.
const seasonHelperAt=app.indexOf('async function fetchSeasonLeagueState');
const sleeperConstAt=app.indexOf("const S='https://api.sleeper.app/v1'");
assert(sleeperConstAt>=0&&seasonHelperAt>=0&&sleeperConstAt<seasonHelperAt,'Sleeper base URL must initialize before Season helpers (TDZ startup risk)');

// Browser-visible controls required before any refresh can work.
for(const id of ['refreshAllBtn','qualityStatus','apiKey','season','scoring','draftInput','slot','topN','snapshotMode','draftMode','replayCutoff','managerMap','stressMode','strategyMode']){
  assert(new RegExp('id=["\\\']'+id+'["\\\']').test(html),'required DOM id missing: '+id);
}

// Reproduce exactly the service-worker app transform that the Android/PWA runtime receives.
const base=sw.match(/const BASE='([^']+)',TARGET='([^']+)'/);
assert(base,'service-worker BASE/TARGET missing');
const start=sw.indexOf('function patchApp(s){');
const end=sw.indexOf('\nfunction patchText',start);
assert(start>=0&&end>start,'patchApp extraction failed');
const patchApp=Function('const BASE='+JSON.stringify(base[1])+',TARGET='+JSON.stringify(base[2])+';\n'+sw.slice(start,end)+'; return patchApp')();
const patched=patchApp(app);
new Function(patched.replace(/^import[^\n]*\n/,''));
assert.equal(patched.replaceAll(base[2],base[1]),app,'service worker must not structurally rewrite canonical app runtime');

// The exact failure that broke rc4.138-rc4.140: adjacent object properties without a comma.
assert(!/\]\}\s+\[norm\(/.test(app),'fatal RESEARCH_RESIDUAL_PRIORS property adjacency without comma');

// Season-first HTML intentionally omits legacy Draft status nodes. Startup render/status
// must therefore never dereference them unguarded before bootstrapSeasonWorkspace.
assert(app.includes("if(els.onlineState){els.onlineState.textContent=navigator.onLine?'Online':'Offline';"),'Season-first startup must null-guard legacy onlineState');
const startupTail=app.slice(app.lastIndexOf('rehydrateDerivedExpertPanelsOnStartup();'));
const bootAt=startupTail.indexOf('await bootstrapSeasonWorkspace()');
assert(bootAt>=0,'automatic roster bootstrap missing');
const preBoot=startupTail.slice(0,bootAt);
assert(!/els\.onlineState\.(?:textContent|className)/.test(preBoot.replace(/if\(els\.onlineState\)\{[^}]*\}/g,'')),'unguarded legacy onlineState access before Season bootstrap');

// rc4.175 Season startup is automatic-only. Runtime parsing above is the startup gate;
// manual refresh-handler observability contracts were retired with their controls.
assert(!app.includes("'seasonRefreshLiveBtn'")&&!app.includes("'seasonRefreshRanksBtn'"),'manual Season controls resurrected');
assert(app.includes('const rosterResult=await bootstrapSeasonWorkspace();'),'automatic roster bootstrap missing');
assert(app.includes('void refreshSeasonRankings({auto:true});'),'automatic ranking refresh missing');

console.log('RUNTIME_STARTUP_CONTRACT_PASS',version);
