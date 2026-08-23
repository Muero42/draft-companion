'use strict';
/* Preregistered direct 2.02 multi-candidate raw counterfactual.
   Outcome-blind. Every qualifying child receives identical MARKET_NEUTRAL continuation. */
const fs=require('fs'),crypto=require('crypto');
const CORE='research/rc459_decision_counterfactual_screen_2026.js';
const EXPECT='8cd71b5d01af8fe0f03ab0ff9ee3573486d4b5c3';
const raw=fs.readFileSync(CORE,'utf8'),buf=Buffer.from(raw);
const blob=crypto.createHash('sha1').update(Buffer.from(`blob ${buf.length}\0`)).update(buf).digest('hex');
if(blob!==EXPECT)throw Error('DIRECT_202_CORE_DRIFT '+blob);
const stable=v=>{if(v===null||typeof v!=='object')return JSON.stringify(v);if(v instanceof Set)return stable([...v].sort());if(Array.isArray(v))return '['+v.map(stable).join(',')+']';return '{'+Object.keys(v).sort().map(k=>JSON.stringify(k)+':'+stable(v[k])).join(',')+'}'};
const sha=v=>crypto.createHash('sha256').update(typeof v==='string'?v:stable(v)).digest('hex');
const main=raw.indexOf('(async()=>');if(main<0)throw Error('main boundary');
const exp=`\nreturn {getFixture,apiFrom,init,clone,advance,earlyLegal,prefixData,force,finish,stable,sha,ok};`;
const C=new Function('require','fetch','structuredClone',raw.slice(0,main)+exp)(require,fetch,structuredClone);
/* Held out from isolated audit 459277001-005 and prior breadth families. */
const seeds=[459288101,459288102,459288103,459288104,459288105,459288106,459288107,459288108,459288109,459288110];
const forced109=['James Cook III','Amon-Ra St. Brown','Jaxon Smith-Njigba','Jonathan Taylor','Justin Jefferson','Ashton Jeanty'];
const meta=p=>({key:p.key,name:p.name,pos:p.pos,team:p.team||null,panel:Number.isFinite(p.panel)?p.panel:null,adp:Number.isFinite(p.adp)?p.adp:null});
(async()=>{const fix=await C.getFixture(),api=C.apiFrom(fix);await api.loadMeta();const players=api.buildPlayers();C.ok(Object.keys(players).length>=225,'pool');api.initRepl(players);
const poolSnapshot=Object.fromEntries(Object.entries(players).map(([k,p])=>[k,meta(p)]));const states=[];
for(const seed of seeds){const pre9=C.advance(api,players,C.init(api,players,seed),9,'MARKET_NEUTRAL');for(const nm of forced109){const c9=[...pre9.available].map(k=>players[k]).find(p=>p&&p.name===nm);if(!c9||!C.earlyLegal(api,pre9,c9))continue;const s=C.clone(pre9);C.force(api,s,c9,9);C.advance(api,players,s,12,'MARKET_NEUTRAL');const pf=C.sha(C.prefixData(s)),r0=s.r.snapshot();
const frontier=[...s.available].map(k=>players[k]).filter(Boolean).filter(p=>C.earlyLegal(api,s,p)).filter(p=>(Number.isFinite(p.adp)&&p.adp<=22)||(Number.isFinite(p.panel)&&p.panel<=22)).sort((a,b)=>(a.adp??999)-(b.adp??999)||(a.panel??999)-(b.panel??999)||a.name.localeCompare(b.name));
if(frontier.length<3)continue;const branches=[];for(const ch of frontier){const child=C.clone(s);C.ok(C.sha(C.prefixData(child))===pf,'prefix parity');C.force(api,child,ch,12);C.ok(C.stable(child.r.snapshot())===C.stable(r0),'child RNG parity');const fin=C.finish(api,players,child,'MARKET_NEUTRAL');const fa=[...child.available].sort();for(const id of fa)C.ok(poolSnapshot[id]!=null,'missing FA metadata '+id);branches.push({candidate:meta(ch),continuation:'MARKET_NEUTRAL',user_roster:fin.mine.map(meta),position_counts:fin.c,complete_picks:child.picks,free_agent_ids:fa,final_rng:child.r.snapshot(),complete_fingerprint:C.sha({picks:child.picks,fa,rng:child.r.snapshot()})})}
C.ok(branches.every(b=>b.final_rng.draws===branches[0].final_rng.draws),'final RNG draw parity');states.push({seed,forced_1_09:meta(c9),treatment_pick:12,prefix_fingerprint:pf,prefix_rng:r0,qualifying_frontier:frontier.map(meta),branches})}}
C.ok(states.length>=20,'insufficient states '+states.length);const out={schema:1,status:'PASS',raw_only:true,outcome_evaluated:false,design:'direct 2.02 candidate branches then identical MARKET_NEUTRAL continuation',source_core:CORE,source_core_blob:blob,seeds,realistic_1_09_frontier:forced109,candidate_rule:'available && legal && (Sleeper ADP<=22 || selected-panel<=22)',player_pool_snapshot:poolSnapshot,states};fs.mkdirSync('counterfactual_2026',{recursive:true});const p='counterfactual_2026/RC459_DIRECT_2_02_CANDIDATES_2026.json';fs.writeFileSync(p,JSON.stringify(out,null,2));console.log(JSON.stringify({status:'PASS',states:states.length,branches:states.reduce((n,s)=>n+s.branches.length,0),min_frontier:Math.min(...states.map(s=>s.branches.length)),max_frontier:Math.max(...states.map(s=>s.branches.length)),output:p,sha256:sha(fs.readFileSync(p,'utf8'))},null,2));})().catch(e=>{console.error(e&&e.stack||e);process.exit(1)});
