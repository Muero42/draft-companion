import fs from 'node:fs';import assert from 'node:assert/strict';
const a=fs.readFileSync('app.js','utf8'),h=fs.readFileSync('index.html','utf8');
const v=(a.match(/const APP_VERSION='([^']+)'/)||[])[1];
const marker=a.indexOf("seasonLiveStateAge.textContent='JS gestartet'");
const rehydrate=a.indexOf('rehydrateDerivedExpertPanelsOnStartup();',marker);
const bootstrap=a.indexOf('const rosterResult=await bootstrapSeasonWorkspace();',rehydrate);
const ranks=a.indexOf('void refreshSeasonRankings({auto:true});',bootstrap);
assert(marker>=0&&rehydrate>marker&&bootstrap>rehydrate&&ranks>bootstrap,'real-shape startup ordering drift');
for(const id of ['seasonLiveStateAge','seasonLiveStateStatus','rosterStatus','rosterList','expertsList','analysisExpertProfile'])assert(h.includes('id="'+id+'"'),'real-shape Season DOM missing '+id);
for(const id of ['apiKey','season','scoring','draftInput','autoRefresh','slot','topN','snapshotMode','draftMode','replayCutoff','managerMap','stressMode','strategyMode'])assert(h.includes('id="'+id+'"'),'unguarded startup element missing from DOM '+id);
const cleanupStart=a.indexOf('function removeLegacyRankingStorage('),cleanupEnd=a.indexOf('\nfunction pruneNonCriticalStorageForRankWrite',cleanupStart);
assert(cleanupStart>=0&&cleanupEnd>cleanupStart);
const cleanup=new Function('localStorage','console','return ('+a.slice(cleanupStart,cleanupEnd).replace('function removeLegacyRankingStorage','function')+')')({removeItem(){throw new Error('WebView storage denied')}},{warn(){}});
assert.doesNotThrow(cleanup,'storage cleanup exception escaped startup');
for(const src of [
 "try{setDraftSurface(store.text('v118_draftSurface','mock')||'mock')}catch",
 "try{setWorkspace(store.text('v117_workspace','roster')||'roster')}catch",
 "try{updateResearchCacheStatus()}catch"
])assert(a.includes(src),'pre-marker fail-open boundary missing: '+src);
assert(a.includes("if(els.expertSearch&&els.expertsList)renderExperts();"),'expert render must tolerate Season-only DOM');
assert(a.includes("if(els.decisionLog)renderLog();"),'legacy Draft log must tolerate Season-only DOM');
assert(a.includes("['TE',els.tePanel]])if(el)el.onchange"),'legacy position-panel binding must tolerate Season-only DOM');
assert(a.includes('function bootstrapSeasonWorkspace('),'roster bootstrap missing');
assert(a.includes('rehydrateDerivedExpertPanelsOnStartup();'),'expert startup hydration missing');
console.log('SEASON_REALSHAPE_STARTUP_E2E_PASS '+v+' roster+experts fail-open');
