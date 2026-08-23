'use strict';
/* Outcome-blind isolated early-lookahead causal harness.
   Source-locks the validated raw screen, instruments one divergent 2.02 decision,
   then gives both children the identical MARKET_NEUTRAL continuation. */
const fs=require('fs'),crypto=require('crypto'),path=require('path');
const CORE='research/rc459_decision_counterfactual_screen_2026.js';
const EXPECT='8cd71b5d01af8fe0f03ab0ff9ee3573486d4b5c3';
const raw=fs.readFileSync(CORE,'utf8'),buf=Buffer.from(raw);
const blob=crypto.createHash('sha1').update(Buffer.from(`blob ${buf.length}\0`)).update(buf).digest('hex');
if(blob!==EXPECT)throw Error('ISOLATED_LOOKAHEAD_CORE_DRIFT '+blob);
const stable=v=>{if(v===null||typeof v!=='object')return JSON.stringify(v);if(v instanceof Set)return stable([...v].sort());if(Array.isArray(v))return '['+v.map(stable).join(',')+']';return '{'+Object.keys(v).sort().map(k=>JSON.stringify(k)+':'+stable(v[k])).join(',')+'}'};
const sha=v=>crypto.createHash('sha256').update(typeof v==='string'?v:stable(v)).digest('hex');
function cut(name,next){const a=raw.indexOf(`function ${name}(`);if(a<0)throw Error('missing '+name);const b=raw.indexOf(`function ${next}(`,a+1);if(b<0)throw Error('missing next '+next);return raw.slice(a,b)}
/* Build a module from the already validated core without executing its main IIFE. */
const main=raw.indexOf('(async()=>');if(main<0)throw Error('main boundary');
const exportsCode=`\nreturn {getFixture,apiFrom,init,clone,opponent,marketChoice,pairSumChoice,userPick,advance,earlyLegal,frontier,prefixData,force,finish,stable,sha,ok};`;
const apiCore=new Function('require','fetch','structuredClone',raw.slice(0,main)+exportsCode)(require,fetch,structuredClone);
const seeds=[459277001,459277002,459277003,459277004,459277005];
const forced109=['James Cook III','Ashton Jeanty','Justin Jefferson','Chase Brown','Brock Bowers'];
(async()=>{const fix=await apiCore.getFixture(),api=apiCore.apiFrom(fix);await api.loadMeta();const players=api.buildPlayers();apiCore.ok(Object.keys(players).length>=225,'pool');api.initRepl(players);const states=[];
for(const seed of seeds){const pre9=apiCore.advance(api,players,apiCore.init(api,players,seed),9,'MARKET_NEUTRAL');for(const nm of forced109){const c9=[...pre9.available].map(k=>players[k]).find(p=>p&&p.name===nm);if(!c9||!apiCore.earlyLegal(api,pre9,c9))continue;const s9=apiCore.clone(pre9);apiCore.force(api,s9,c9,9);apiCore.advance(api,players,s9,12,'MARKET_NEUTRAL');const before=apiCore.prefixData(s9),pf=apiCore.sha(before),r0=s9.r.snapshot();
const neutral=apiCore.marketChoice(api,players,s9,12);apiCore.ok(apiCore.stable(r0)===apiCore.stable(s9.r.snapshot()),'neutral decision RNG');const pd=apiCore.pairSumChoice(api,players,s9,12);apiCore.ok(apiCore.stable(r0)===apiCore.stable(s9.r.snapshot()),'pairsum decision RNG');const pair=pd.chosen;apiCore.ok(neutral&&pair&&s9.available.has(neutral.key)&&s9.available.has(pair.key),'choices');
const branches=[];for(const [decision,ch] of [['MARKET_NEUTRAL_DECISION',neutral],['PAIRSUM_LONG2_DECISION',pair]]){const s=apiCore.clone(s9);apiCore.ok(apiCore.sha(apiCore.prefixData(s))===pf,'shared prefix');apiCore.force(api,s,ch,12);apiCore.ok(apiCore.stable(s.r.snapshot())===apiCore.stable(r0),'child RNG parity');const fin=apiCore.finish(api,players,s,'MARKET_NEUTRAL');branches.push({decision,chosen:{key:ch.key,name:ch.name,pos:ch.pos,panel:ch.panel,adp:ch.adp},post_decision_continuation:'MARKET_NEUTRAL',user_roster:fin.mine.map(x=>({key:x.key,name:x.name,pos:x.pos,panel:x.panel,adp:x.adp})),position_counts:fin.c,complete_picks:s.picks,free_agent_ids:[...s.available].sort(),final_rng:s.r.snapshot(),complete_fingerprint:apiCore.sha({picks:s.picks,fa:[...s.available].sort(),rng:s.r.snapshot()})})}
apiCore.ok(branches[0].final_rng.draws===branches[1].final_rng.draws,'final RNG draw parity');states.push({seed,forced_1_09:{key:c9.key,name:c9.name,pos:c9.pos,panel:c9.panel,adp:c9.adp},treatment_pick:12,prefix_fingerprint:pf,prefix_rng:r0,choices_same:neutral.key===pair.key,pairsum_diag:pd.diag,branches})}}
const out={schema:1,status:'PASS',raw_only:true,outcome_evaluated:false,design:'single 2.02 decision divergence then identical MARKET_NEUTRAL continuation',kernel:'actual validated rc4.59 full-policy opponent kernel via source-locked raw screen',source_core:CORE,source_core_blob:blob,seeds,forced_1_09_frontier:forced109,states};fs.mkdirSync('counterfactual_2026',{recursive:true});const p='counterfactual_2026/RC459_ISOLATED_EARLY_LOOKAHEAD_2026.json';fs.writeFileSync(p,JSON.stringify(out,null,2));console.log(JSON.stringify({status:'PASS',states:states.length,branches:states.length*2,divergent:states.filter(s=>!s.choices_same).length,output:p,sha256:sha(fs.readFileSync(p,'utf8'))},null,2));})().catch(e=>{console.error(e&&e.stack||e);process.exit(1)});
