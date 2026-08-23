'use strict';
/* Actual rc4.59 full-policy-kernel RNG parity gate.
   Runs the validated full-policy harness twice against one captured Sleeper metadata
   response. The only source change in the second run is the exact legacy rng()
   definition -> snapshot-capable bit-equivalent rng(). Full JSON outputs must match. */
const fs=require('fs'),cp=require('child_process'),crypto=require('crypto'),path=require('path');
const SRC='research/rc459_full_policy_paired_2026.js';
const OUT='policy_certification_2026/RC459_FULL_POLICY_PAIRED_DRAFTS_2026.json';
const TMP='research/.tmp_rc459_stateful_parity.js';
const PRE='research/.tmp_rc459_fetch_preload.js';
const FIX='research/.tmp_sleeper_players_fixture.json';
const LEG="function rng(seed){let a=seed>>>0;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}";
const ST="function rng(seedOrState){let a=(typeof seedOrState==='object'?seedOrState.a:seedOrState)>>>0;let draws=(typeof seedOrState==='object'?(seedOrState.draws||0):0)>>>0;const r=function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;draws++;return((t^t>>>14)>>>0)/4294967296};r.snapshot=()=>({a:a>>>0,draws});r.clone=()=>rng(r.snapshot());return r}";
function sha(v){return crypto.createHash('sha256').update(typeof v==='string'?v:JSON.stringify(v)).digest('hex')}
function run(script,label){
  fs.rmSync('policy_certification_2026',{recursive:true,force:true});
  const env={...process.env,NODE_OPTIONS:`--require ${path.resolve(PRE)}`};
  const x=cp.spawnSync(process.execPath,[script,'1'],{encoding:'utf8',env,timeout:180000});
  if(x.status!==0)throw Error(label+' failed '+x.status+'\n'+x.stdout+'\n'+x.stderr);
  if(!fs.existsSync(OUT))throw Error(label+' missing output');
  return JSON.parse(fs.readFileSync(OUT,'utf8'));
}
(async()=>{
  const src=fs.readFileSync(SRC,'utf8');
  if((src.split(LEG).length-1)!==1)throw Error('legacy rng source lock failed');
  const res=await fetch('https://api.sleeper.app/v1/players/nfl',{headers:{'User-Agent':'PITTI-RNG-Parity/1.0'}});
  if(!res.ok)throw Error('fixture fetch '+res.status);
  const fixture=await res.json();
  if(!fixture||Object.keys(fixture).length<1000)throw Error('fixture implausible');
  fs.writeFileSync(FIX,JSON.stringify(fixture));
  fs.writeFileSync(PRE,`'use strict';const fs=require('fs');const fixture=JSON.parse(fs.readFileSync(${JSON.stringify(path.resolve(FIX))},'utf8'));global.fetch=async function(url){if(String(url)!=='https://api.sleeper.app/v1/players/nfl')throw new Error('unexpected fetch '+url);return {ok:true,status:200,json:async()=>structuredClone(fixture)}};`);
  fs.writeFileSync(TMP,src.replace(LEG,ST));
  const legacy=run(SRC,'legacy');
  const stateful=run(TMP,'stateful');
  const a=JSON.stringify(legacy),b=JSON.stringify(stateful);
  if(a!==b){
    const lr=legacy.rows||[],sr=stateful.rows||[];let at=-1;
    for(let i=0;i<Math.max(lr.length,sr.length);i++){if(JSON.stringify(lr[i])!==JSON.stringify(sr[i])){at=i;break}}
    throw Error('ACTUAL_KERNEL_PARITY_MISMATCH row='+at+' legacy_sha='+sha(a)+' stateful_sha='+sha(b));
  }
  const result={status:'PASS',gate:'actual-rc459-full-policy-legacy-stateful-byte-parity',drafts:(legacy.rows||[]).length,runs_per_regime:legacy.runs_per_regime,policies:legacy.policies,regimes:legacy.regimes,output_sha256:sha(a),fixture_players:Object.keys(fixture).length,source_sha256:sha(src),stateful_source_sha256:sha(src.replace(LEG,ST))};
  fs.mkdirSync('diagnostics_2026',{recursive:true});fs.writeFileSync('diagnostics_2026/RC459_ACTUAL_KERNEL_RNG_PARITY_2026_GATE.json',JSON.stringify(result,null,2));
  console.log(JSON.stringify(result,null,2));
})().catch(e=>{console.error(e.stack||e);process.exit(2)}).finally(()=>{for(const f of[TMP,PRE,FIX])try{fs.unlinkSync(f)}catch{}});
