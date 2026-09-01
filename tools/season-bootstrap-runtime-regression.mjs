import fs from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';

const app=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');
function between(a,b){
  const i=app.indexOf(a),j=app.indexOf(b,i+1);
  assert.ok(i>=0&&j>i,'missing runtime function anchor '+a);
  return app.slice(i,j);
}
assert.ok(app.includes("const APP_VERSION='v11.8.0-rc4.168'"),'rc4.168 runtime version missing');
const offerSrc=between('function tradeOfferCandidates','function renderTradeWorkspace');
assert.ok(!offerSrc.includes('target.x.'),'tradeOfferCandidates must consume the row passed by renderTradeWorkspace, not nonexistent target.x');
assert.ok(offerSrc.includes('target.r?.rank')&&offerSrc.includes('target.p.name'),'trade target row contract missing');

const code=[
  "const TRADE_TARGET_DEPTH={QB:1,RB:3,WR:4,TE:1};",
  "const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));",
  "const norm=v=>String(v||'').toLowerCase().replace(/[^a-z0-9]/g,'');",
  between('function tradeLineupBenchmark','function tradeRosterNeed'),
  between('function tradeRosterNeed','function tradeOfferCandidates'),
  offerSrc,
  "globalThis.__pitti={tradeOfferCandidates};"
].join('\n');
const ctx={};vm.createContext(ctx);vm.runInContext(code,ctx);
const mk=(name,pos,rank)=>({p:{name,pos},r:rank==null?null:{rank}});
const mine=[mk('Mine RB','RB',42),mk('Mine WR','WR',51),mk('Cold Rank','WR',null)];
const opponent=[mk('Opp RB','RB',65),mk('Opp WR','WR',72),mk('Unranked','TE',null)];
const target=mk('Target WR','WR',48);
let out;
assert.doesNotThrow(()=>{out=ctx.__pitti.tradeOfferCandidates(mine,opponent,target);},'live Season trade target path must not throw');
assert.ok(Array.isArray(out.oppNeeds)&&Array.isArray(out.offers),'trade offer result shape invalid');

const boot=between('async function bootstrapSeasonWorkspace','async function fetchDraftFresh');
for(const call of ['renderRosterBenchAudit(rows,players,total,true)','renderRosterFaAudit(rows,available||[],true)','renderTradeWorkspace(picks,players,slot,teams,true)','renderWaiverWorkspace(true)','renderSeasonActionBoard(true)']){
  assert.ok(boot.includes(call),'season bootstrap lost runtime render gate: '+call);
}
assert.ok(boot.includes("Season Auto-Sync FAIL-CLOSED"),'season startup must remain fail-closed');
console.log('SEASON_BOOTSTRAP_RUNTIME_REGRESSION_PASS');
