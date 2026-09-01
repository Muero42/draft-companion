import fs from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';

const app=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../styles.css',import.meta.url),'utf8');
function between(a,b){const i=app.indexOf(a),j=app.indexOf(b,i+1);assert.ok(i>=0&&j>i,'missing runtime function anchor '+a);return app.slice(i,j)}
const version=Number((app.match(/const APP_VERSION='v11\.8\.0-rc4\.(\d+)'/)||[])[1]);
assert.ok(version>=169,'Season runtime regression requires rc4.169+');

const offerSrc=between('function tradeOfferCandidates','function renderTradeWorkspace');
assert.ok(!offerSrc.includes('target.x.'),'tradeOfferCandidates must consume the row passed by renderTradeWorkspace');
assert.ok(offerSrc.includes('target.r?.rank')&&offerSrc.includes('target.p.name'),'trade target row contract missing');
const code=["const TRADE_TARGET_DEPTH={QB:1,RB:3,WR:4,TE:1};","const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));","const norm=v=>String(v||'').toLowerCase().replace(/[^a-z0-9]/g,'');",between('function tradeLineupBenchmark','function tradeRosterNeed'),between('function tradeRosterNeed','function tradeOfferCandidates'),offerSrc,"globalThis.__pitti={tradeOfferCandidates};"].join('\n');
const ctx={};vm.createContext(ctx);vm.runInContext(code,ctx);
const mk=(name,pos,rank)=>({p:{name,pos},r:rank==null?null:{rank}});
let out;assert.doesNotThrow(()=>{out=ctx.__pitti.tradeOfferCandidates([mk('Mine RB','RB',42),mk('Mine WR','WR',51)],[mk('Opp RB','RB',65),mk('Opp WR','WR',72)],mk('Target WR','WR',48));});assert.ok(Array.isArray(out.oppNeeds)&&Array.isArray(out.offers));

const surfaceSrc=between('function runSeasonSurface','async function bootstrapSeasonWorkspace');
const surfaceCtx={console:{error(){}}};vm.createContext(surfaceCtx);vm.runInContext(surfaceSrc+'\nglobalThis.__run=runSeasonSurface;',surfaceCtx);
const status={className:'',textContent:''},list={innerHTML:'stale'};
const isolated=surfaceCtx.__run('Trades',()=>{throw new Error('fixture crash')},status,list);
assert.equal(isolated.ok,false);assert.match(status.textContent,/Trades FAIL-CLOSED/);assert.equal(list.innerHTML,'');

const boot=between('async function bootstrapSeasonWorkspace','async function fetchDraftFresh');
for(const token of ["runSeasonSurface('Aufstellung'","const faLane=runSeasonSurface('FA-vs-Roster'","runSeasonSurface('Trades'","if(faLane.ok)","blockSeasonDependentSurface('Waiver/FA'","stage+' · '"])assert.ok(boot.includes(token),'season isolation/diagnostic token missing: '+token);
assert.ok(boot.includes('draftComplete:true'),'Season mode must not depend on optional draft archive completion');
assert.ok(boot.includes('Season Auto-Sync FAIL-CLOSED'),'global hydration failure must remain fail-closed');

assert.match(css,/\[hidden\]\s*\{\s*display:none!important\s*\}/,'hidden workspace rule must override author display styles');
assert.ok(html.includes('data-workspace="draft" aria-label="Draft-Ansicht"'),'Draft surface must remain archive-scoped');
assert.ok(html.includes('data-season-only')&&html.includes('id="seasonRefreshRanksBtn"')&&html.includes('id="seasonRankingAge"'),'Season ranking controls missing');
const workspace=between('function setWorkspace','document.querySelectorAll(\'[data-workspace-target]\')');
assert.ok(workspace.includes("document.querySelectorAll('[data-season-only]')")&&workspace.includes("el.hidden=name==='draft'"),'Season/Draft workspace visibility contract missing');
assert.ok(app.includes('SEASON_RANKING_AUTO_MS=12*60*60*1000'),'12h controlled ranking freshness policy missing');
assert.ok(app.includes("void refreshSeasonRankings({auto:true})")&&app.includes("refreshSeasonRankings({force:true})"),'automatic/manual season ranking refresh wiring missing');
console.log('SEASON_BOOTSTRAP_RUNTIME_REGRESSION_PASS rc4.'+version);
