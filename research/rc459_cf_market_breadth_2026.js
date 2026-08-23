'use strict';
/* Fast causal breadth diagnostic: reuse the already-PASS actual-kernel plumbing code,
   expand to ten fresh seeds, retain MARKET_ROSTER continuation only, and persist raw
   branches. No outcome evaluator and no strategy certification. */
const fs=require('fs'),cp=require('child_process'),crypto=require('crypto'),path=require('path');
const CORE='research/rc459_decision_counterfactual_plumbing_2026.js';
const EXPECT='3aa5bdbc40d5cd1811f2a6dd9dd1ca76f98eed06';
let src=fs.readFileSync(CORE,'utf8'),buf=Buffer.from(src);const blob=crypto.createHash('sha1').update(Buffer.from(`blob ${buf.length}\0`)).update(buf).digest('hex');if(blob!==EXPECT)throw Error('plumbing core drift '+blob);
const old='const seeds=[459271001,459271002],rows=[];';const seeds=Array.from({length:10},(_,i)=>459274001+i);const repl=`const seeds=${JSON.stringify(seeds)},rows=[];`;if(src.split(old).length-1!==1)throw Error('seed needle');src=src.replace(old,repl);
const outOld="const out={schema:1,status:'PASS',purpose:'causal plumbing only; NO outcome interpretation'";const outNew="const out={schema:2,status:'PASS',raw_only:true,outcome_evaluated:false,seed_family:'fresh 459274xxx',purpose:'MARKET_NEUTRAL causal breadth diagnostic; NO policy certification'";if(src.split(outOld).length-1!==1)throw Error('out needle');src=src.replace(outOld,outNew);
src=src.replace("'counterfactual_2026/RC459_DECISION_COUNTERFACTUAL_PLUMBING_2026.json'","'counterfactual_2026/RC459_CF_MARKET_BREADTH_2026.json'");
const tmp=path.join('/tmp','rc459_cf_market_breadth_generated.js');fs.writeFileSync(tmp,src);const r=cp.spawnSync(process.execPath,[tmp],{cwd:process.cwd(),stdio:'inherit',timeout:180000});if(r.status!==0)process.exit(r.status??2);const p='counterfactual_2026/RC459_CF_MARKET_BREADTH_2026.json',x=JSON.parse(fs.readFileSync(p,'utf8'));if(x.status!=='PASS'||x.rows.length!==20)throw Error('breadth invariant');console.log(JSON.stringify({status:'PASS',states:x.rows.length,branches:x.rows.reduce((n,s)=>n+s.branches.length,0),seeds:x.seeds,output:p},null,2));
