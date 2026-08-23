'use strict';
/* Preregistered targeted causal breadth for the expensive frozen PairSum-LONG2 continuation.
   This wrapper changes ONLY fresh outer seeds and the outcome-blind treatment frontier
   of the already-PASS raw counterfactual screen. It does not inspect or optimize any
   downstream outcome. PairSum itself remains byte-for-byte defined by the source screen. */
const fs=require('fs'),cp=require('child_process'),crypto=require('crypto'),path=require('path');
const CORE='research/rc459_decision_counterfactual_screen_2026.js';
const EXPECT='8cd71b5d01af8fe0f03ab0ff9ee3573486d4b5c3';
let src=fs.readFileSync(CORE,'utf8'),buf=Buffer.from(src);const blob=crypto.createHash('sha1').update(Buffer.from(`blob ${buf.length}\0`)).update(buf).digest('hex');if(blob!==EXPECT)throw Error('raw-screen core drift '+blob);
const seedOld='const seeds=[459272001],policies=';
const seeds=[459276001,459276002,459276003];
if(src.split(seedOld).length-1!==1)throw Error('seed needle');src=src.replace(seedOld,`const seeds=${JSON.stringify(seeds)},policies=`);
const fOld="f=frontier(api,players,base,pn);ok(f.length>=6,'frontier');";
const fNew="allf=frontier(api,players,base,pn),wanted=new Set(pn===9?['James Cook III','Chase Brown','Ashton Jeanty','Justin Jefferson','Brock Bowers']:['Chase Brown','Ashton Jeanty','Kenneth Walker III','Justin Jefferson','Brock Bowers']),f=allf.filter(p=>wanted.has(p.name));ok(f.length>=3,'target frontier');";
if(src.split(fOld).length-1!==1)throw Error('frontier needle');src=src.replace(fOld,fNew);
src=src.replace("seed_family:'fresh 459272xxx'","seed_family:'fresh targeted 459276xxx'");
src=src.replace("frontier_rule:'outcome-blind union top-8 selected-panel + top-8 Sleeper ADP; Bowers explicitly retained at 2.02 if legal'","frontier_rule:'PRE-OUTCOME targeted subset of outcome-blind panel/ADP frontier. 1.09={Cook,Brown,Jeanty,Jefferson,Bowers}; 2.02={Brown,Jeanty,Walker,Jefferson,Bowers}; unavailable names omitted. No result-driven substitutions.'");
src=src.replace("const out={schema:1,status:'PASS'","const out={schema:2,status:'PASS',targeted_pairsum_breadth:true,preregistered_candidate_sets:{pick9:['James Cook III','Chase Brown','Ashton Jeanty','Justin Jefferson','Brock Bowers'],pick12:['Chase Brown','Ashton Jeanty','Kenneth Walker III','Justin Jefferson','Brock Bowers']} ");
const oldOut="'counterfactual_2026/RC459_DECISION_COUNTERFACTUAL_RAW_SCREEN_2026.json'";if(src.split(oldOut).length-1!==1)throw Error('output needle');src=src.replace(oldOut,"'counterfactual_2026/RC459_CF_TARGETED_PAIRSUM_BREADTH_2026.json'");
const tmp=path.join('/tmp','rc459_cf_targeted_pairsum_generated.js');fs.writeFileSync(tmp,src);const r=cp.spawnSync(process.execPath,[tmp],{cwd:process.cwd(),stdio:'inherit',timeout:2700000});if(r.status!==0)process.exit(r.status??2);const p='counterfactual_2026/RC459_CF_TARGETED_PAIRSUM_BREADTH_2026.json',x=JSON.parse(fs.readFileSync(p,'utf8'));if(x.status!=='PASS'||x.seeds.length!==3)throw Error('target breadth invariant');console.log(JSON.stringify({status:'PASS',states:x.states.length,branches:x.states.reduce((n,s)=>n+s.branches.length,0),seeds:x.seeds,output:p},null,2));
