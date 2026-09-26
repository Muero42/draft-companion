import fs from 'node:fs';import assert from 'node:assert/strict';
import {RUNTIME_FILES} from './runtime-files.mjs';
const source=fs.readFileSync('app.js','utf8');
const start=source.indexOf("const SPECIAL_TEAMS_W1_BASELINE_EXPIRES_AT=");
const end=source.indexOf('\nfunction waiverMarketSummary',start);
assert(start>=0&&end>start,'Special Teams temporal implementation missing');
const implementation=source.slice(start,end);
const makeSurface=(week,overrides={})=>{
  const lastDraftContext={draftComplete:true,season:{},availableDST:[{name:'Chargers D/ST',team:'LAC'},{name:'Bills D/ST',team:'BUF'},{name:'Bears D/ST',team:'CHI'}],availableK:[{name:'Cameron Dicker'},{name:'Cam Little'}],seasonRows:[{p:{name:'Cameron Dicker',pos:'QB'}},{p:{name:'Chris Boswell',pos:'K'}}],...overrides};
  return Function('lastDraftContext','els','seasonEvidenceContext','esc',implementation+';return {historicalSpecialTeamsBaselineAllowed,renderSpecialTeamsBoard};')(
    lastDraftContext,{waiverList:{}},()=>({week}),value=>String(value)
  );
};
const before=Date.parse('2026-09-08T11:59:59Z'),after=Date.parse('2026-09-08T12:00:01Z');
const allowed=makeSurface(1),caseA=allowed.renderSpecialTeamsBoard(before);
assert.equal(allowed.historicalSpecialTeamsBaselineAllowed({week:1,now:before}),true,'Week 1 before expiry must allow historical baseline');
assert(caseA.includes('RotoBaller pre-W1 waiver #1')&&caseA.includes('TARGET')&&caseA.includes('FantasyPros W1 Consensus-Projektion'),'Week 1 before expiry must preserve historical baseline behavior');
for(const token of ['>WATCH<','>EMERGENCY<','vs ARI','vs HOU','vs CAR','8.7 proj.','KLEINER EDGE','Edge ggü. Chris Boswell +1.1'])assert(caseA.includes(token),'historical positive control missing: '+token);
assert(!caseA.includes('Edge ggü. Cameron Dicker'),'QB must never become the roster kicker comparison');
assert.equal(allowed.historicalSpecialTeamsBaselineAllowed({week:1,now:Date.parse('2026-09-08T12:00:00Z')}),true,'expiry is inclusive');
const empty=makeSurface(1,{availableDST:[],availableK:[]}).renderSpecialTeamsBoard(before);
assert(!empty.includes('Chargers D/ST')&&!empty.includes('Cameron Dicker')&&!empty.includes('Edge ggü.'),'historical baseline must not resurrect players absent from live FA pools');
const forbidden=['RotoBaller pre-W1 waiver #','vs ARI','>TARGET<','>WATCH<','>EMERGENCY<','FantasyPros W1 Consensus-Projektion','UPGRADE PRÜFEN','KLEINER EDGE','Edge ggü.'];
for(const [name,week,now] of [['week 1 after expiry',1,after],['week 3 before expiry',3,before],['week 3 current time',3,Date.parse('2026-09-26T12:00:00Z')],...[undefined,null,NaN,1.5,0,-1,Infinity,'1',''].map(week=>['invalid week '+String(week),week,before]),...[null,NaN,Infinity,'bad',''].map(now=>['invalid time '+String(now),1,now])]){
  const api=makeSurface(week),html=api.renderSpecialTeamsBoard(now);
  assert.equal(api.historicalSpecialTeamsBaselineAllowed({week,now}),false,name+' must block historical baseline');
  for(const token of forbidden)assert(!html.includes(token),name+' emitted stale evidence: '+token);
  assert(html.includes('Current-week Special Teams evidence is not verified.'),name+' must render fail-closed explanation');
  assert(html.includes('Live Sleeper ownership remains authoritative.'),name+' must preserve live ownership authority');
  assert(html.includes('3 D/ST · 2 Kicker')&&html.includes('AKTUELLER KICKER: Chris Boswell'),'fail-closed surface must retain live counts and roster kicker');
  assert(!html.includes('Chargers D/ST')&&!html.includes('Cam Little')&&!html.includes('proj.')&&!html.includes('vs HOU')&&!html.includes('vs CAR'),'fail-closed surface cannot rank free agents or show old matchups/projections');
}
for(const invalid of [undefined,null,Number.NaN,Infinity,'bad'])assert.equal(allowed.historicalSpecialTeamsBaselineAllowed({week:1,now:invalid}),false,'invalid time must fail closed');
for(const stale of ["['PIT',3,1,'ATL',19.25]","Opp implied '+x.rb.implied","Vegas-Implied-Points"]) assert(!source.includes(stale),'stale/unverified DST evidence resurrected: '+stale);
assert.equal(RUNTIME_FILES.length,17);
for(const retired of ['dst-k-season-stream.js','season-evidence-layer.js']){
  assert(!RUNTIME_FILES.includes(retired));
  for(const file of ['index.html','sw.js'])assert(!fs.readFileSync(file,'utf8').includes(retired),file+' must not reactivate '+retired);
}
console.log('WEEK1_DST_TEMPORAL_BASELINE_REGRESSION_PASS');
