import fs from 'node:fs';
import vm from 'node:vm';
const src=fs.readFileSync('app.js','utf8');
function body(name,next){
  const a=src.indexOf('function '+name); if(a<0)throw new Error(name+' missing');
  const b=next?src.indexOf('function '+next,a+1):src.length;
  return src.slice(a,b<0?src.length:b);
}
const helperStart=src.indexOf('function removeLegacyRankingStorage');
const helperEnd=src.indexOf('let rankCache=',helperStart);
if(helperStart<0||helperEnd<0)throw new Error('storage helper block missing');
const quota=src.slice(helperStart,helperEnd);
for(const required of [
  "localStorage.removeItem('v7_rankCache')",
  "localStorage.removeItem('v7_panelRanks')",
  "pruneNonCriticalStorageForRankWrite()",
  "return{ok:false,error:third}"
])if(!quota.includes(required))throw new Error('quota contract missing '+required);
if(!src.includes("let panelRanks={};"))throw new Error('panelRanks must not hydrate obsolete duplicate');
if(src.includes("store.set('v7_rank_'+expertId,result)"))throw new Error('unsafe expert cache write remains');
if(!src.includes("rankCache[expertId]=result;\n    const persisted=persistExpertRankCache"))throw new Error('source result must enter memory before persistence');
if(!src.includes("if(!persisted.ok)result.persistenceWarning="))throw new Error('quota must be warning, not source failure');

// Execute the storage helper against deterministic quota-pressure fakes.
const helper=quota;
function runStore(initial,quotaPredicate){
  const m=new Map(Object.entries(initial));let writes=0;
  const localStorage={
    removeItem:k=>m.delete(k),
    setItem:(k,v)=>{writes++;if(quotaPredicate(k,v,m,writes)){const e=new Error('QuotaExceededError');e.name='QuotaExceededError';throw e}m.set(k,v)}
  };
  const ctx={localStorage,JSON};vm.createContext(ctx);vm.runInContext(helper,ctx);
  return{ctx,m};
}
{
 const {ctx,m}=runStore({v7_rankCache:'OLD',v7_panelRanks:'OLD',v118_decisionFixtures:'HISTORY'},(k,v,m)=>m.has('v7_rankCache'));
 const r=ctx.persistExpertRankCache('x',{ranks:{a:{rank:1}}});
 if(!r.ok||!r.recovered||m.has('v7_rankCache')||m.has('v7_panelRanks')||!m.has('v7_rank_x'))throw new Error('legacy-duplicate recovery failed');
}
{
 const {ctx,m}=runStore({v118_decisionFixtures:'HISTORY',v118_returnValidation:'HISTORY',v117_researchEvidence:'HISTORY'},(k,v,m)=>m.has('v118_decisionFixtures'));
 const r=ctx.persistExpertRankCache('x',{ranks:{a:{rank:1}}});
 if(!r.ok||!r.recovered||m.has('v118_decisionFixtures')||!m.has('v7_rank_x'))throw new Error('history-prune recovery failed');
}
console.log('rc4.111 storage quota regression PASS');
