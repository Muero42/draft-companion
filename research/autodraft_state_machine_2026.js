'use strict';

// Research-only live opponent mode state machine.
// No production integration. Defaults all managers to MANUAL; AUTODRAFT only on current evidence.

const MODES = Object.freeze({ MANUAL:'MANUAL', AUTODRAFT:'AUTODRAFT', UNKNOWN:'UNKNOWN' });

function createState(managerIds){
  const managers={};
  for(const id of managerIds) managers[String(id)]={
    mode:MODES.MANUAL,
    provenance:'default_manual',
    sincePick:1,
    segments:[{fromPick:1,mode:MODES.MANUAL,provenance:'default_manual'}]
  };
  return {managers};
}

function setMode(state, managerId, mode, fromPick, provenance){
  if(!Object.values(MODES).includes(mode)) throw new Error('invalid mode');
  const id=String(managerId), row=state.managers[id];
  if(!row) throw new Error('unknown manager '+id);
  if(!Number.isInteger(fromPick)||fromPick<1) throw new Error('invalid pick');
  if(!provenance) throw new Error('provenance required');
  if(row.mode===mode && row.provenance===provenance) return state;
  row.mode=mode; row.provenance=provenance; row.sincePick=fromPick;
  row.segments.push({fromPick,mode,provenance});
  return state;
}

function applyUserUpdate(state, text, nextPick){
  const s=String(text||'').trim();
  let m=s.match(/^Autodraft:\s*([0-9,\s]+)$/i);
  if(m){
    for(const id of m[1].split(',').map(x=>x.trim()).filter(Boolean))
      setMode(state,id,MODES.AUTODRAFT,nextPick,'user_observed_sleeper_autodraft');
    return state;
  }
  m=s.match(/^(\d+)\s+wieder\s+manuell$/i);
  if(m){setMode(state,m[1],MODES.MANUAL,nextPick,'user_observed_manual');return state;}
  m=s.match(/^(\d+)\s+autodraft$/i);
  if(m){setMode(state,m[1],MODES.AUTODRAFT,nextPick,'user_observed_sleeper_autodraft');return state;}
  throw new Error('unrecognized update');
}

function learningWeight(row){
  if(row.mode===MODES.MANUAL) return 1;
  if(row.mode===MODES.AUTODRAFT) return 0;
  return 0; // fail closed until explicit UNKNOWN weighting has evidence
}

function autodraftBranch({queueKnown,queue}){
  if(queueKnown && Array.isArray(queue) && queue.length) return {stage:'QUEUE_IF_AVAILABLE',candidate:queue[0]};
  return {stage:'SLEEPER_RANK_PLUS_ROSTER_NEED',candidate:null};
}

function modeForPick(state, managerId, pickNo){
  const row=state.managers[String(managerId)]; if(!row) throw new Error('unknown manager');
  let seg=row.segments[0];
  for(const x of row.segments) if(x.fromPick<=pickNo) seg=x; else break;
  return seg;
}

module.exports={MODES,createState,setMode,applyUserUpdate,learningWeight,autodraftBranch,modeForPick};

if(require.main===module){
  const assert=require('assert');
  const s=createState([1,2,3,4,5,6,7,8,10]);
  for(const r of Object.values(s.managers)) assert.equal(r.mode,MODES.MANUAL);
  applyUserUpdate(s,'Autodraft: 3,5,8',20);
  assert.equal(modeForPick(s,3,19).mode,MODES.MANUAL);
  assert.equal(modeForPick(s,3,20).mode,MODES.AUTODRAFT);
  assert.equal(learningWeight(s.managers['3']),0);
  applyUserUpdate(s,'5 wieder manuell',41);
  assert.equal(modeForPick(s,5,40).mode,MODES.AUTODRAFT);
  assert.equal(modeForPick(s,5,41).mode,MODES.MANUAL);
  assert.equal(learningWeight(s.managers['5']),1);
  assert.deepEqual(autodraftBranch({queueKnown:true,queue:['A','B']}),{stage:'QUEUE_IF_AVAILABLE',candidate:'A'});
  assert.equal(autodraftBranch({queueKnown:false,queue:null}).stage,'SLEEPER_RANK_PLUS_ROSTER_NEED');
  console.log(JSON.stringify({status:'PASS',managerCount:Object.keys(s.managers).length,tests:'state-switch+learning-quarantine+queue-first'},null,2));
}
