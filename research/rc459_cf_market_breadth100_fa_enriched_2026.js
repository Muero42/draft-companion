'use strict';
/* FA-enriched MARKET_NEUTRAL causal breadth. Research-only.
   Fixes the instrumentation gap in the first 100-seed artifact by persisting a
   complete player-pool snapshot keyed by player id, allowing every actual final
   free_agent_id to be joined without inference. No evaluator and no policy change. */
const fs=require('fs'),cp=require('child_process'),crypto=require('crypto'),path=require('path');
const CORE='research/rc459_decision_counterfactual_plumbing_2026.js';
const EXPECT='3aa5bdbc40d5cd1811f2a6dd9dd1ca76f98eed06';
let src=fs.readFileSync(CORE,'utf8'),buf=Buffer.from(src);const blob=crypto.createHash('sha1').update(Buffer.from(`blob ${buf.length}\0`)).update(buf).digest('hex');if(blob!==EXPECT)throw Error('plumbing core drift '+blob);
const old='const seeds=[459271001,459271002],rows=[];';const seeds=Array.from({length:20},(_,i)=>459290001+i);if(src.split(old).length-1!==1)throw Error('seed needle');src=src.replace(old,`const seeds=${JSON.stringify(seeds)},rows=[];`);
const outOld="const out={schema:1,status:'PASS',purpose:'causal plumbing only; NO outcome interpretation'";if(src.split(outOld).length-1!==1)throw Error('out needle');src=src.replace(outOld,"const player_pool_snapshot=Object.fromEntries(Object.entries(players).map(([k,p])=>[k,{key:p.key,name:p.name,pos:p.pos,panel:p.panel,adp:p.adp}]));const out={schema:4,status:'PASS',raw_only:true,outcome_evaluated:false,seed_family:'fresh 459290xxx',player_pool_snapshot,purpose:'FA-enriched MARKET_NEUTRAL causal breadth; shallow-league replacement instrumentation only'");
const oldFile="'counterfactual_2026/RC459_DECISION_COUNTERFACTUAL_PLUMBING_2026.json'";if(src.split(oldFile).length-1!==1)throw Error('output needle');src=src.replace(oldFile,"'counterfactual_2026/RC459_CF_MARKET_FA_ENRICHED20_2026.json'");
const tmp=path.join('/tmp','rc459_cf_market_fa_enriched20_generated.js');fs.writeFileSync(tmp,src);const r=cp.spawnSync(process.execPath,[tmp],{cwd:process.cwd(),stdio:'inherit',timeout:480000});if(r.status!==0)process.exit(r.status??2);
const p='counterfactual_2026/RC459_CF_MARKET_FA_ENRICHED20_2026.json',x=JSON.parse(fs.readFileSync(p,'utf8'));if(x.status!=='PASS'||x.rows.length!==40)throw Error('state invariant');
let refs=0,missing=0;for(const row of x.rows)for(const b of row.branches)for(const id of b.free_agent_ids){refs++;if(!x.player_pool_snapshot[id])missing++}if(missing)throw Error(`FA metadata incomplete ${missing}/${refs}`);
console.log(JSON.stringify({status:'PASS',states:x.rows.length,branches:x.rows.reduce((n,s)=>n+s.branches.length,0),player_pool:Object.keys(x.player_pool_snapshot).length,fa_refs:refs,fa_missing:missing,coverage:1,output:p},null,2));
