'use strict';
/* Research-only dynamic identical-state determinism gate for rc4.63 v3 near-tie.
   Runs the exact v3 120-seed shard generator, but instruments every user decision
   to evaluate the Coach twice from the identical frozen outer state. The second
   evaluation must not advance outer RNG and must reproduce chosen player, Top-10,
   safety result and median-return state exactly. No runtime/production mutation. */
const fs=require('fs'),crypto=require('crypto'),cp=require('child_process'),path=require('path');
const SRC='research/rc463_roster_championship_v3_neartie_scale_2026.js';
const EXPECT='47bbe51f07510fba762d24ca75cc52844f6c7b81';
function gitBlob(s){const b=Buffer.from(s);return crypto.createHash('sha1').update(Buffer.from(`blob ${b.length}\0`)).update(b).digest('hex')}
const src0=fs.readFileSync(SRC,'utf8');if(gitBlob(src0)!==EXPECT)throw Error('V3_SOURCE_DRIFT '+gitBlob(src0));
const spawnAnchor="const r=cp.spawnSync(process.execPath,[tmp],{stdio:'inherit',env:process.env});";
if(src0.split(spawnAnchor).length!==2)throw Error('V3_SPAWN_ANCHOR_DRIFT');
const instrumentation=`let __inner=fs.readFileSync(tmp,'utf8');
const __userAnchor="function userPick(api,players,s,pn){const before=s.r.snapshot(),d=coachDecision(api,players,s,pn);H.ok(H.stable(before)===H.stable(s.r.snapshot()),'Coach decision advanced outer RNG '+pn);";
if(__inner.split(__userAnchor).length!==2)throw Error('STATE_REPLAY_USER_ANCHOR_DRIFT');
const __userPatch="function userPick(api,players,s,pn){const before=s.r.snapshot(),d=coachDecision(api,players,s,pn);const afterFirst=s.r.snapshot();H.ok(H.stable(before)===H.stable(afterFirst),'Coach decision advanced outer RNG '+pn);const dReplay=coachDecision(api,players,s,pn);H.ok(H.stable(afterFirst)===H.stable(s.r.snapshot()),'Replay Coach decision advanced outer RNG '+pn);const sig=x=>H.stable({chosen:x.chosen?.key,top:x.top,safety:x.safety,medianReturn:x.medianReturn,state:x.state});H.ok(sig(d)===sig(dReplay),'IDENTICAL_STATE_NONDETERMINISM '+pn);";
__inner=__inner.replace(__userAnchor,__userPatch);fs.writeFileSync(tmp,__inner);
${spawnAnchor}`;
let src=src0.replace(spawnAnchor,instrumentation);
const shard=Number(process.env.PITTI_SHARD);if(!Number.isInteger(shard)||shard<0||shard>11)throw Error('PITTI_SHARD 0..11 required');
const wrapped=path.join('/tmp',`pitti_rc463_v3_state_replay_outer_${shard}.js`);fs.writeFileSync(wrapped,src);
const r=cp.spawnSync(process.execPath,[wrapped],{stdio:'inherit',env:process.env});if(r.error)throw r.error;if((r.status??2)!==0)process.exit(r.status??2);
const out=`simulation_2026/RC463_ROSTER_CHAMPIONSHIP_V3_NEARTIE_SHARD_${shard}_2026.json`;if(!fs.existsSync(out))throw Error('STATE_REPLAY_OUTPUT_MISSING');const x=JSON.parse(fs.readFileSync(out,'utf8'));if(x.status!=='PASS'||x.drafts?.length!==10)throw Error('STATE_REPLAY_OUTPUT_INVALID');const checks=x.drafts.reduce((n,d)=>n+(d.decisions?.length||0),0);if(checks!==150)throw Error('STATE_REPLAY_CHECK_COUNT '+checks);x.identical_state_replay='PASS';x.identical_state_replay_checks=checks;x.identical_state_replay_contract='same frozen outer state -> identical chosen key + Top-10 + safety + medianReturn + roster state; neither evaluation advances outer RNG';x.production_mutation=false;const dst=`simulation_2026/RC463_V3_STATE_REPLAY_SHARD_${shard}_2026.json`;fs.writeFileSync(dst,JSON.stringify(x));console.log(JSON.stringify({status:'PASS',shard,checks,output:dst},null,2));
