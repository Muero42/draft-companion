import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const app=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');
const start=app.indexOf('const FP_DIAGNOSTIC_TIMEOUT_MS=');
const end=app.indexOf('function weeklyProjectionMetadata',start);
assert(start>=0&&end>start,'Sleeper week-context production block missing');
const source=app.slice(start,end)+';globalThis.__weekContext={deriveSleeperNflWeek,currentSleeperNflWeek,isTransientSleeperNflStateError,deriveSleeperLeagueWeekFallback};';
const NOW=1_789_462_800_000;
const validFallback=(patch={})=>({
  ok:true,source:'Sleeper direct',generated_at:NOW-30_000,transaction_round:7,
  league:{season:'2026',status:'in_season',season_type:'regular',settings:{leg:7}},
  ...patch
});
function runtime({fresh,freshError,fallback=validFallback()}={}){
  const context={AbortController,setTimeout,clearTimeout,Date:{now:()=>NOW},Math,Number,String,Array,Object,RegExp,Error,TypeError,
    fetch:()=>{throw new Error('unexpected FantasyPros request')},S:'https://api.sleeper.app/v1',lastDraftContext:{season:fallback},
    jf:async()=>{if(freshError)throw freshError;return fresh??{season:'2026',season_type:'regular',week:8}}};
  context.globalThis=context;vm.createContext(context);vm.runInContext(source,context);return context.__weekContext;
}

assert.equal(await runtime({fresh:{season:'2026',season_type:'regular',week:8},fallback:validFallback()}).currentSleeperNflWeek(2026),8,'fresh validated Sleeper NFL week must remain primary');
assert.equal(await runtime({freshError:new Error('Sleeper NFL State: Timeout nach 6s')}).currentSleeperNflWeek(2026),7,'timeout may use fresh verified league week');
assert.equal(await runtime({freshError:new TypeError('Failed to fetch')}).currentSleeperNflWeek(2026),7,'network failure may use fresh verified league week');

await assert.rejects(runtime({freshError:new Error('Sleeper NFL State: Timeout nach 6s'),fallback:null}).currentSleeperNflWeek(2026),error=>error.code==='SLEEPER_WEEK_FALLBACK_UNVERIFIED','timeout without fallback must fail closed');
await assert.rejects(runtime({freshError:new Error('Sleeper NFL State: Timeout nach 6s'),fallback:validFallback({league:{season:'2025',status:'in_season',season_type:'regular',settings:{leg:7}}})}).currentSleeperNflWeek(2026),error=>error.code==='SLEEPER_WEEK_FALLBACK_SEASON_MISMATCH','wrong-season fallback must fail closed');
await assert.rejects(runtime({freshError:new Error('Sleeper NFL State: Timeout nach 6s'),fallback:validFallback({generated_at:NOW-300_001})}).currentSleeperNflWeek(2026),error=>error.code==='SLEEPER_WEEK_FALLBACK_UNVERIFIED','stale fallback must fail closed');
await assert.rejects(runtime({freshError:new Error('Sleeper NFL State: Timeout nach 6s'),fallback:validFallback({transaction_round:6})}).currentSleeperNflWeek(2026),error=>error.code==='SLEEPER_WEEK_FALLBACK_AMBIGUOUS','contradictory fallback week fields must fail closed');
await assert.rejects(runtime({freshError:new Error('Sleeper NFL State: Timeout nach 6s'),fallback:validFallback({league:{season:'2026',status:'complete',season_type:'regular',settings:{leg:7}}})}).currentSleeperNflWeek(2026),error=>error.code==='SLEEPER_WEEK_FALLBACK_NOT_REGULAR_SEASON','inactive-season fallback must fail closed');

await assert.rejects(runtime({fresh:{season:'2025',season_type:'regular',week:7}}).currentSleeperNflWeek(2026),error=>error.code==='SLEEPER_SEASON_MISMATCH','fresh wrong-season semantics must not be hidden by fallback');
await assert.rejects(runtime({fresh:{season:'2026',season_type:'pre',week:0}}).currentSleeperNflWeek(2026),error=>error.code==='SLEEPER_NOT_REGULAR_SEASON','fresh preseason semantics must not be hidden by fallback');
await assert.rejects(runtime({fresh:{season:'2026',season_type:'regular',week:null}}).currentSleeperNflWeek(2026),error=>error.code==='SLEEPER_WEEK_UNAVAILABLE','fresh malformed week must not be hidden by fallback');
await assert.rejects(runtime({freshError:new Error('Sleeper NFL State: HTTP 503')}).currentSleeperNflWeek(2026),/HTTP 503/,'HTTP failures are not silently reclassified as transient fallback authority');

const diagnostic=app.slice(app.indexOf('async function runAuthenticatedWeeklyProjectionDiagnostic'),app.indexOf('function formatAuthenticatedWeeklyProjectionDiagnostic'));
const production=app.slice(app.indexOf('async function refreshSeasonRankings('),app.indexOf('\nfunction startSeasonRankingRefreshScheduler',app.indexOf('async function refreshSeasonRankings(')));
for(const [label,block] of [['authenticated diagnostic',diagnostic],['production refresh',production]]){
  assert(block.includes('/projections?week=${week}&position=${position}'),`${label} must retain explicit week + position`);
  assert(!/\/projections\?[^`'"\n]*\b(?:ros|scoring)=/.test(block),`${label} projections must omit ros and scoring`);
}
assert(!app.slice(app.indexOf('async function fetchSeasonLeagueState'),app.indexOf('function seasonRosterRows')).includes('currentSleeperNflWeek'),'live roster hydration must remain independent of weekly context resolution');

console.log('SEASON_WEEK_CONTEXT_TIMEOUT_REGRESSION_PASS');
