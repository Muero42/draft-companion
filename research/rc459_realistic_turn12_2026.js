'use strict';
/* Market-realistic 1.09 -> 2.02 raw counterfactual.
   Strategy candidates are admitted by frozen market anchors, not panel rank.
   Research controls are excluded from primary branches. */
const fs=require('fs'),crypto=require('crypto');
const CORE='research/rc459_decision_counterfactual_screen_2026.js';
const EXPECT='8cd71b5d01af8fe0f03ab0ff9ee3573486d4b5c3';
const raw=fs.readFileSync(CORE,'utf8'),buf=Buffer.from(raw);
const blob=crypto.createHash('sha1').update(Buffer.from(`blob ${buf.length}\0`)).update(buf).digest('hex');
if(blob!==EXPECT)throw Error('REALISTIC_TURN12_CORE_DRIFT '+blob);
const main=raw.indexOf('(async()=>');if(main<0)throw Error('main boundary');
const exp=`\nreturn {getFixture,apiFrom,init,clone,advance,earlyLegal,prefixData,force,finish,stable,sha,ok};`;
const C=new Function('require','fetch','structuredClone',raw.slice(0,main)+exp)(require,fetch,structuredClone);
const stable=v=>{if(v===null||typeof v!=='object')return JSON.stringify(v);if(v instanceof Set)return stable([...v].sort());if(Array.isArray(v))return '['+v.map(stable).join(',')+']';return '{'+Object.keys(v).sort().map(k=>JSON.stringify(k)+':'+stable(v[k])).join(',')+'}'};
const sha=v=>crypto.createHash('sha256').update(typeof v==='string'?v:stable(v)).digest('hex');
/* Fresh family; not used in PairSum/direct-202 experiments. */
const seeds=Array.from({length:20},(_,i)=>459301001+i);
/* Current Reality Gate: normal/core plus genuine first-round fallers. */
const pick9Names=['Justin Jefferson','James Cook III','Ashton Jeanty','CeeDee Lamb','Jaxon Smith-Njigba','Amon-Ra St. Brown','Jonathan Taylor','Christian McCaffrey'];
/* Frozen Aug-23 Half-PPR market anchors. Use consensus of current one-QB overall boards; lower is earlier. */
const market={
 'Jaxon Smith-Njigba':5.5,'Amon-Ra St. Brown':6.5,'Jonathan Taylor':7.5,'Christian McCaffrey':9.0,
 'CeeDee Lamb':9.5,'James Cook III':10.0,'Justin Jefferson':10.5,'Ashton Jeanty':12.0,
 'Drake London':13.5,'A.J. Brown':15.0,'Saquon Barkley':16.0,'Chase Brown':16.0,'De\'Von Achane':17.5,
 'Nico Collins':18.0,'Brock Bowers':18.0,'Derrick Henry':19.0,'Omarion Hampton':20.0,'Kenneth Walker III':21.0,
 'George Pickens':23.0,'Trey McBride':23.5
};
const pick12Max=22.0; // ordinary/small-reach turn window; no panel override.
const meta=p=>({key:p.key,name:p.name,pos:p.pos,team:p.team||null,panel:Number.isFinite(p.panel)?p.panel:null,adp:Number.isFinite(p.adp)?p.adp:null,market_anchor:market[p.name]??null});
(async()=>{const fix=await C.getFixture(),api=C.apiFrom(fix);await api.loadMeta();const players=api.buildPlayers();C.ok(Object.keys(players).length>=225,'pool');api.initRepl(players);const poolSnapshot=Object.fromEntries(Object.entries(players).map(([k,p])=>[k,meta(p)]));const states=[];
for(const seed of seeds){const pre9=C.advance(api,players,C.init(api,players,seed),9,'MARKET_NEUTRAL');for(const nm of pick9Names){const c9=[...pre9.available].map(k=>players[k]).find(p=>p&&p.name===nm);if(!c9||!C.earlyLegal(api,pre9,c9))continue;const s=C.clone(pre9);C.force(api,s,c9,9);C.advance(api,players,s,12,'MARKET_NEUTRAL');const pf=C.sha(C.prefixData(s)),r0=s.r.snapshot();const frontier=[...s.available].map(k=>players[k]).filter(Boolean).filter(p=>C.earlyLegal(api,s,p)).filter(p=>Number.isFinite(market[p.name])&&market[p.name]<=pick12Max).sort((a,b)=>market[a.name]-market[b.name]||a.name.localeCompare(b.name));if(frontier.length<2)continue;const branches=[];for(const ch of frontier){const child=C.clone(s);C.ok(C.sha(C.prefixData(child))===pf,'prefix parity');C.force(api,child,ch,12);C.ok(C.stable(child.r.snapshot())===C.stable(r0),'child RNG parity');const fin=C.finish(api,players,child,'MARKET_NEUTRAL');const fa=[...child.available].sort();for(const id of fa)C.ok(poolSnapshot[id]!=null,'missing FA metadata '+id);branches.push({candidate:meta(ch),pair:{pick_1_09:meta(c9),pick_2_02:meta(ch),construction:c9.pos+'->'+ch.pos},continuation:'MARKET_NEUTRAL',user_roster:fin.mine.map(meta),position_counts:fin.c,complete_picks:child.picks,free_agent_ids:fa,final_rng:child.r.snapshot(),complete_fingerprint:C.sha({picks:child.picks,fa,rng:child.r.snapshot()})})}C.ok(branches.every(b=>b.final_rng.draws===branches[0].final_rng.draws),'RNG parity');states.push({seed,forced_1_09:meta(c9),prefix_fingerprint:pf,prefix_rng:r0,primary_frontier:frontier.map(meta),branches})}}
C.ok(states.length>=40,'insufficient realistic states '+states.length);const out={schema:1,status:'PASS',raw_only:true,outcome_evaluated:false,design:'market-realistic 1.09->2.02 pair counterfactual; identical MARKET_NEUTRAL continuation',source_core:CORE,source_core_blob:blob,seeds,pick_1_09_universe:pick9Names,pick_2_02_market_max:pick12Max,market_anchor_method:'frozen Aug-23 current one-QB Half-PPR consensus anchors; no panel admission',market_anchors:market,player_pool_snapshot:poolSnapshot,states};fs.mkdirSync('counterfactual_2026',{recursive:true});const p='counterfactual_2026/RC459_REALISTIC_TURN12_2026.json';fs.writeFileSync(p,JSON.stringify(out,null,2));console.log(JSON.stringify({status:'PASS',states:states.length,branches:states.reduce((n,s)=>n+s.branches.length,0),pairs:[...new Set(states.flatMap(s=>s.branches.map(b=>b.pair.construction)))],output:p,sha256:sha(fs.readFileSync(p,'utf8'))},null,2));})().catch(e=>{console.error(e&&e.stack||e);process.exit(1)});
