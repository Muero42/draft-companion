'use strict';
/* Verified Sleeper half-PPR market calibration for slot 9 -> Dutch 10/11 -> slot 12.
   No strategy winner is produced. Market = frozen Sleeper-derived ADP; manager modifiers remain canonical. */
const fs=require('fs'),crypto=require('crypto');
const marketFile='research/SLEEPER_HALF_PPR_MARKET_ANCHORS_2026-08-23.json';
const M=JSON.parse(fs.readFileSync(marketFile,'utf8')),market=M.adp;
if(M.source?.platform!=='Sleeper'||M.source?.scoring!=='Half PPR'||M.source?.updated!=='2026-08-22')throw Error('SLEEPER_MARKET_PROVENANCE');
const CORE='research/rc459_decision_counterfactual_screen_2026.js',raw=fs.readFileSync(CORE,'utf8'),buf=Buffer.from(raw),EXPECT='8cd71b5d01af8fe0f03ab0ff9ee3573486d4b5c3';
const blob=crypto.createHash('sha1').update(Buffer.from(`blob ${buf.length}\0`)).update(buf).digest('hex');if(blob!==EXPECT)throw Error('CORE_DRIFT '+blob);
const main=raw.indexOf('(async()=>'),exp=`\nreturn {getFixture,apiFrom,init,clone,advance,earlyLegal,prefixData,force,stable,sha,ok};`;if(main<0)throw Error('main');const C=new Function('require','fetch','structuredClone',raw.slice(0,main)+exp)(require,fetch,structuredClone);
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
function install(api){const old=api.oppWeight;api.oppWeight=(p,pn,c,name,stress)=>{const m=market[p.name];if(pn>32||!Number.isFinite(m))return old(p,pn,c,name,stress);const oldCenter=.90*p.adp+.10*p.panel,tau=(pn<=30?1.35:4.5)*(stress==='stress'?1.18:1),oldMk=Math.exp(clamp((pn-oldCenter)/tau,-9,3.8)),nonMk=Math.max(.00005,old(p,pn,c,name,stress))/Math.max(.00005,oldMk),newMk=Math.exp(clamp((pn-m)/tau,-9,3.8));return Math.max(.00005,newMk*nonMk)}}
const seedN=400,seeds=Array.from({length:seedN},(_,i)=>459501001+i),pick9Max=14,pick12Max=24.5;
const control9=new Set(M.strategy_exclusions?.['1.09_major_reach_controls']||[]),control12=new Set(M.strategy_exclusions?.['2.02_major_reach_controls']||[]);
const skill=new Set(['RB','WR']);
(async()=>{const fix=await C.getFixture(),api=C.apiFrom(fix);await api.loadMeta();install(api);const players=api.buildPlayers();C.ok(Object.keys(players).length>=225,'pool');api.initRepl(players);const pByName=Object.fromEntries(Object.values(players).map(p=>[p.name,p]));
const avail9={},turn12={},dutchPairs={};let stateN=0;
for(const [n,a] of Object.entries(market))if(a<=pick9Max&&skill.has(pByName[n]?.pos)&&!control9.has(n))avail9[n]={eligible:seedN,available:0,rate:0};
for(const seed of seeds){
 const pre9=C.advance(api,players,C.init(api,players,seed),9,'MARKET_NEUTRAL');
 for(const n of Object.keys(avail9))if([...pre9.available].some(k=>players[k]?.name===n))avail9[n].available++;
 const candidates=[...pre9.available].map(k=>players[k]).filter(Boolean).filter(p=>skill.has(p.pos)&&Number.isFinite(market[p.name])&&market[p.name]<=pick9Max&&!control9.has(p.name)).sort((a,b)=>market[a.name]-market[b.name]);
 for(const c9 of candidates){
  const s=C.clone(pre9);C.force(api,s,c9,9);C.advance(api,players,s,12,'MARKET_NEUTRAL');stateN++;
  const dutch=s.picks.filter(x=>[10,11].includes(+x.pick_no)).map(x=>x.metadata?.player_name);C.ok(dutch.length===2,'Dutch picks');const pk=dutch.join(' + ');dutchPairs[pk]=(dutchPairs[pk]||0)+1;
  const av=new Set([...s.available].map(k=>players[k]?.name).filter(Boolean));
  for(const [n,a] of Object.entries(market)){
   if(n===c9.name||a>pick12Max||control12.has(n)||!pByName[n]||!['RB','WR','TE'].includes(pByName[n].pos))continue;
   const key=c9.name+' -> '+n,z=turn12[key]||(turn12[key]={pick9:c9.name,pick12:n,market9:market[c9.name],market12:a,eligible:0,survived:0});z.eligible++;if(av.has(n))z.survived++;
  }
 }
}
for(const z of Object.values(avail9))z.rate=z.available/z.eligible;for(const z of Object.values(turn12))z.rate=z.survived/z.eligible;
C.ok(stateN>=1000,'too few conditioned states '+stateN);const core=['CeeDee Lamb','James Cook III','Saquon Barkley','Ashton Jeanty','Justin Jefferson'];for(const n of core){const rows=Object.values(turn12).filter(z=>z.pick12===n);C.ok(rows.length>=3,'missing core '+n);const tot=rows.reduce((a,z)=>a+z.eligible,0),sur=rows.reduce((a,z)=>a+z.survived,0),r=sur/tot;C.ok(r>0&&r<.995,'degenerate aggregate '+n+' '+r)}
const aggregate12={};for(const z of Object.values(turn12)){const a=aggregate12[z.pick12]||(aggregate12[z.pick12]={eligible:0,survived:0});a.eligible+=z.eligible;a.survived+=z.survived}for(const z of Object.values(aggregate12))z.rate=z.survived/z.eligible;
const out={schema:1,status:'PASS',strategy_certified:false,purpose:'availability calibration only',market_provenance:M.source,market_file:marketFile,seeds:seedN,conditioned_states:stateN,pick9_adp_max:pick9Max,pick12_adp_max:pick12Max,pick9_availability:avail9,aggregate_survival_to_2_02:aggregate12,conditional_survival_to_2_02:turn12,dutch_10_11_pairs:dutchPairs};fs.mkdirSync('counterfactual_2026',{recursive:true});const p='counterfactual_2026/RC459_SLEEPER_MARKET_TURN12_CALIBRATION_2026.json';fs.writeFileSync(p,JSON.stringify(out,null,2));console.log(JSON.stringify({status:'PASS',conditioned_states:stateN,pick9_availability:avail9,aggregate_survival_to_2_02:Object.fromEntries(Object.entries(aggregate12).filter(([n])=>['Christian McCaffrey','Jonathan Taylor','Jaxon Smith-Njigba','Amon-Ra St. Brown','James Cook III','CeeDee Lamb','Saquon Barkley','Ashton Jeanty','Justin Jefferson','De\'Von Achane'].includes(n))),top_dutch_pairs:Object.entries(dutchPairs).sort((a,b)=>b[1]-a[1]).slice(0,12),output:p},null,2))})().catch(e=>{console.error(e.stack||e);process.exit(2)});