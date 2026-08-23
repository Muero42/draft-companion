'use strict';
/* PITTI decision-counterfactual causal core, 2026-08-23.
   Research-only. This module deliberately contains no player/position preference.
   It supplies immutable treatment branching, prefix fingerprints, RNG-state
   fingerprints, legality checks and complete-pick persistence helpers. */
const crypto=require('crypto');
function stable(v){
  if(v===null||typeof v!=='object')return JSON.stringify(v);
  if(Array.isArray(v))return '['+v.map(stable).join(',')+']';
  return '{'+Object.keys(v).sort().map(k=>JSON.stringify(k)+':'+stable(v[k])).join(',')+'}';
}
function sha(v){return crypto.createHash('sha256').update(typeof v==='string'?v:stable(v)).digest('hex')}
function deepClone(v){return structuredClone(v)}
function invariant(ok,msg){if(!ok)throw new Error('COUNTERFACTUAL_INVARIANT: '+msg)}
function makeStateFingerprint(s){
  return sha({pickNo:s.pickNo,available:[...s.available].map(String).sort(),picks:s.picks,rosters:s.rosters,outerRngState:s.outerRngState});
}
function prefixFingerprint(s){return sha({pickNo:s.pickNo,picks:s.picks,rosters:s.rosters,available:[...s.available].map(String).sort(),outerRngState:s.outerRngState})}
function assertSamePrefix(base,branch){
  invariant(base.pickNo===branch.pickNo,'pick number mismatch');
  invariant(prefixFingerprint(base)===prefixFingerprint(branch),'shared prefix mismatch');
}
function forceTreatment(base,candidate,{playerById,isRosterLegal,applyPick}){
  const b=deepClone(base); assertSamePrefix(base,b);
  const id=String(candidate.id??candidate.key); const p=playerById[id];
  invariant(!!p,'unknown candidate '+id); invariant(b.available.includes(id),'candidate unavailable '+id);
  invariant(isRosterLegal(b,p),'candidate roster-illegal '+id);
  const before=makeStateFingerprint(b); const rngBefore=stable(b.outerRngState);
  applyPick(b,p,b.pickNo,9); b.available=b.available.filter(x=>String(x)!==id);
  invariant(stable(b.outerRngState)===rngBefore,'treatment advanced outer RNG');
  invariant(makeStateFingerprint(b)!==before,'treatment did not mutate state');
  return b;
}
function auditCompletedState(s,{userSlot=9,userPicks=15}){
  const mine=s.picks.filter(x=>+x.draft_slot===userSlot);
  invariant(mine.length===userPicks,'wrong user roster length '+mine.length);
  const pos={}; for(const x of mine){const p=s.playerById[String(x.player_id)]||x.metadata||{};const q=p.pos||p.position||x.metadata?.position;pos[q]=(pos[q]||0)+1}
  invariant((pos.QB||0)>=1,'no QB'); invariant((pos.RB||0)>=1,'no RB'); invariant((pos.WR||0)>=2,'fewer than 2 WR'); invariant((pos.TE||0)>=1,'no TE');
  invariant((pos.K||0)===0&&(pos.DEF||0)===0,'user drafted K/DST');
  return pos;
}
function rawRow({seed,regime,stateId,treatmentPick,candidate,continuation,base,finished,nextOwnPick,bestNextLegal,freeAgents,audit}){
  return {seed,regime,state_id:stateId,treatment_pick:treatmentPick,candidate:{id:String(candidate.id??candidate.key),name:candidate.name,pos:candidate.pos},continuation,shared_prefix_fingerprint:prefixFingerprint(base),pre_available_fingerprint:sha([...base.available].map(String).sort()),outer_rng_fingerprint:sha(base.outerRngState),shared_prefix_picks:deepClone(base.picks),complete_picks:deepClone(finished.picks),user_roster:deepClone(finished.picks.filter(x=>+x.draft_slot===9)),position_counts:audit,free_agent_ids:[...freeAgents].map(String).sort(),next_own_pick:nextOwnPick??null,best_next_legal:deepClone(bestNextLegal??[]),invariants:'PASS'};
}
module.exports={stable,sha,deepClone,invariant,makeStateFingerprint,prefixFingerprint,assertSamePrefix,forceTreatment,auditCompletedState,rawRow};
