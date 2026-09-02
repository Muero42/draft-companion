import fs from 'node:fs';
const app=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');
function extract(name,next){const s=app.indexOf('function '+name+'(');if(s<0)throw new Error(name+' missing');const e=app.indexOf('\nfunction '+next+'(',s);if(e<0)throw new Error(next+' missing');return app.slice(s,e)}
const src=extract('removeLegacyRankingStorage','pruneNonCriticalStorageForRankWrite');
let calls=0;const localStorage={removeItem(key){calls++;throw new Error('simulated Android WebView cleanup denial: '+key)}};const console={warn(){}};
const fn=new Function('localStorage','console',`return (${src.replace('function removeLegacyRankingStorage','function')})`)(localStorage,console);
let escaped=null;try{fn()}catch(e){escaped=e}
if(escaped)throw new Error('cleanup exception escaped startup boundary: '+escaped.message);
if(calls!==2)throw new Error('expected both cleanup attempts, got '+calls);
if(!app.includes("let rankCache=loadRankCacheCompact();\nremoveLegacyRankingStorage();\nlet panelRanks={};"))throw new Error('real startup ordering fixture drift');
if(!app.includes("if(els.seasonLiveStateAge)els.seasonLiveStateAge.textContent='JS gestartet';"))throw new Error('physical startup marker missing');
if(!app.includes("const rosterResult=await bootstrapSeasonWorkspace();"))throw new Error('Season hydration startup tail missing');
console.log('PASS rc4.182 Android storage cleanup exception cannot abort Season hydration startup');

const marker=app.indexOf("if(els.seasonLiveStateAge)els.seasonLiveStateAge.textContent='JS gestartet';");
const expertRehydrate=app.indexOf('rehydrateDerivedExpertPanelsOnStartup();');
if(marker<0||expertRehydrate<0||expertRehydrate<marker)throw new Error('expert rehydration still precedes physical startup marker');

const preMarker=app.slice(0,marker);
if(preMarker.includes("setDraftSurface(localStorage.getItem('v118_draftSurface')"))throw new Error('unguarded draft-surface localStorage startup restored');
if(preMarker.includes("setWorkspace(localStorage.getItem('v117_workspace')"))throw new Error('unguarded workspace localStorage startup restored');
if(!preMarker.includes("try{setDraftSurface(store.text('v118_draftSurface','mock')||'mock')}catch"))throw new Error('draft-surface startup fail-open guard missing');
if(!preMarker.includes("try{setWorkspace(store.text('v117_workspace','roster')||'roster')}catch"))throw new Error('workspace startup fail-open guard missing');
