'use strict';
/* Current-market 1.09 -> 2.02 raw harness. Research-only.
   Fixes the prior inconsistency where user frontier used Aug-23 anchors but opponents still sampled old ADP 90%.
   Early opponent choice uses the SAME frozen market anchors, with canonical roster/history/trait modifiers retained. */
const fs=require('fs'),crypto=require('crypto');
const CORE='research/rc459_decision_counterfactual_screen_2026.js';
const EXPECT='8cd71b5d01af8fe0f03ab0ff9ee3573486d4b5c3';
const raw=fs.readFileSync(CORE,'utf8'),buf=Buffer.from(raw),blob=crypto.createHash('sha1').update(Buffer.from(`blob ${buf.length}\0`)).update(buf).digest('hex');
if(blob!==EXPECT)throw Error('CORE_DRIFT '+blob);const main=raw.indexOf('(async()=>');if(main<0)throw Error('main boundary');
const exp=`\nreturn {getFixture,apiFrom,init,clone,advance,earlyLegal,prefixData,force,finish,stable,sha,ok};`;
const C=new Function('require','fetch','structuredClone',raw.slice(0,main)+exp)(require,fetch,structuredClone);
const stable=v=>{if(v===null||typeof v!=='object')return JSON.stringify(v);if(v instanceof Set)return stable([...v].sort());if(Array.isArray(v))return '['+v.map(stable).join(',')+']';return '{'+Object.keys(v).sort().map(k=>JSON.stringify(k)+':'+stable(v[k])).join(',')+'}'};
const sha=v=>crypto.createHash('sha256').update(typeof v==='string'?v:stable(v)).digest('hex');
const market={'Jaxon Smith-Njigba':5.5,'Amon-Ra St. Brown':6.5,'Jonathan Taylor':7.5,'Christian McCaffrey':9,'CeeDee Lamb':9.5,'James Cook III':10,'Justin Jefferson':10.5,'Ashton Jeanty':12,'Drake London':13.5,'A.J. Brown':15,'Saquon Barkley':16,'Chase Brown':16,"De'Von Achane":17.5,'Nico Collins':18,'Brock Bowers':18,'Derrick Henry':19,'Omarion Hampton':20,'Kenneth Walker III':21,'George Pickens':23,'Trey McBride':23.5};
const pick9Names=['Justin Jefferson','James Cook III','Ashton Jeanty','CeeDee Lamb','Jaxon Smith-Njigba','Amon-Ra St. Brown','Jonathan Taylor','Christian McCaffrey'];
const seeds=Array.from({length:80},(_,i)=>459401001+i),pick12Max=22;
const meta=p=>({key:p.key,name:p.name,pos:p.pos,panel:Number.isFinite(p.panel)?p.panel:null,adp:Number.isFinite(p.adp)?p.adp:null,market_anchor:market[p.name]??null});
function installCurrentMarketOpponent(api){
 const old=api.oppWeight;
 api.oppWeight=(p,pn,c,name,stress)=>{
   if(pn>32||!Number.isFinite(market[p.name]))return old(p,pn,c,name,stress);
   /* Strip old market-center component from canonical weight, retain need/history/traits via ratio.
      Canonical early tau=1.35. The ratio isolates non-market modifiers exactly enough for research calibration. */
   const oldCenter=.90*p.adp+.10*p.panel,tau=1.35*(stress==='stress'?1.18:1);
   const oldMarket=Math.exp(Math.max(-9,Math.min(3.8,(pn-oldCenter)/tau)));
   const nonMarket=Math.max(.00005,old(p,pn,c,name,stress))/Math.max(.00005,oldMarket);
   const curMarket=Math.exp(Math.max(-9,Math.min(3.8,(pn-market[p.name])/tau)));
   return Math.max(.00005,curMarket*nonMarket);
 };
}
(async()=>{const fix=await C.getFixture(),api=C.apiFrom(fix);await api.loadMeta();installCurrentMarketOpponent(api);const players=api.buildPlayers();C.ok(Object.keys(players).length>=225,'pool');api.initRepl(players);const states=[],survival={};
for(const seed of seeds){const pre9=C.advance(api,players,C.init(api,players,seed),9,'MARKET_NEUTRAL');for(const nm of pick9Names){const c9=[...pre9.available].map(k=>players[k]).find(p=>p&&p.name===nm);if(!c9||!C.earlyLegal(api,pre9,c9))continue;const s=C.clone(pre9);C.force(api,s,c9,9);C.advance(api,players,s,12,'MARKET_NEUTRAL');const dutch=s.picks.filter(x=>+x.pick_no===10||+x.pick_no===11).map(x=>x.metadata?.player_name);C.ok(dutch.length===2,'Dutch 10/11 missing');const availableNames=new Set([...s.available].map(k=>players[k]?.name).filter(Boolean));for(const n of Object.keys(market)){const z=survival[n]||(survival[n]={eligible:0,survived:0});if(n!==nm){z.eligible++;if(availableNames.has(n))z.survived++}}const frontier=[...s.available].map(k=>players[k]).filter(Boolean).filter(p=>C.earlyLegal(api,s,p)).filter(p=>Number.isFinite(market[p.name])&&market[p.name]<=pick12Max).sort((a,b)=>market[a.name]-market[b.name]||a.name.localeCompare(b.name));if(frontier.length<2)continue;states.push({seed,forced_1_09:meta(c9),dutch_10_11:dutch,primary_frontier_2_02:frontier.map(meta)})}}
const rates=Object.fromEntries(Object.entries(survival).map(([n,z])=>[n,{...z,rate:z.eligible?z.survived/z.eligible:null}]));
/* Calibration guards: no deterministic survival of every core turn player across a meaningful sample. */
for(const n of ['CeeDee Lamb','James Cook III','Justin Jefferson','Ashton Jeanty']){const z=rates[n];C.ok(z&&z.eligible>=100,'sample '+n);C.ok(z.rate<.995,'deterministic survival '+n+' '+z.rate)}
const out={schema:1,status:'PASS',raw_only:true,strategy_certified:false,design:'current-market opponent calibration for picks <=32; same Aug-23 anchors as user Reality Gate; canonical non-market manager modifiers retained',seeds,market_anchors:market,states,survival_to_2_02:rates};fs.mkdirSync('counterfactual_2026',{recursive:true});const p='counterfactual_2026/RC459_TURN12_CURRENT_MARKET_2026.json';fs.writeFileSync(p,JSON.stringify(out,null,2));console.log(JSON.stringify({status:'PASS',states:states.length,survival_to_2_02:Object.fromEntries(['Jaxon Smith-Njigba','Amon-Ra St. Brown','Jonathan Taylor','Christian McCaffrey','CeeDee Lamb','James Cook III','Justin Jefferson','Ashton Jeanty','Drake London','A.J. Brown','Saquon Barkley'].map(n=>[n,rates[n]])),output:p,sha256:sha(fs.readFileSync(p,'utf8'))},null,2));})().catch(e=>{console.error(e.stack||e);process.exit(2)});