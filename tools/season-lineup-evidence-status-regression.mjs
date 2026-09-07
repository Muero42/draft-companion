import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const app=fs.readFileSync('app.js','utf8'),start=app.indexOf('function renderRosterBenchAudit('),end=app.indexOf('\nfunction ',start+1);
const render=app.slice(start,end);
function fixture({missing=[],live=true,benchPoints=8}={}){
  const rows=['starter','bench','missing-bench'].map(id=>({p:{id,name:id,pos:'WR'},seasonStatus:'ACTIVE'}));
  const els={rosterBenchStatus:{},rosterBenchList:{}};
  const context={els,lastDraftContext:{season:{my_roster:{starters:['starter']}}},seasonStarterSlotMap:()=>new Map([['starter',{slot:'WR'}]]),seasonStartSitCompatible:()=>true,seasonLiveAuthority:()=>live,seasonEvidenceContext:()=>({week:1}),esc:s=>s,seasonSlotLabel:()=> 'WR',weeklyEvidenceHtml:()=> 'verified',weeklyLineupEvidence:p=>({consensus:missing.includes(p.id)?null:1,freshEnough:!missing.includes(p.id),projection:missing.includes(p.id)?null:{points:p.id==='starter'?10:benchPoints},opp:{value:0}})};
  vm.createContext(context);vm.runInContext(render,context);context.renderRosterBenchAudit(rows,{},0,true);return els;
}
for(const options of [{missing:['starter','bench','missing-bench']},{missing:['missing-bench']},{live:false}]){
  const result=fixture(options);assert(!result.rosterBenchList.innerHTML.includes('LINEUP HOLD'),'unavailable evidence must not imply a reviewed hold');assert.equal(result.rosterBenchStatus.className,'notice warn');
}
assert(fixture().rosterBenchList.innerHTML.includes('LINEUP HOLD'),'fully verified no-improvement remains HOLD');
const partial=fixture({missing:['missing-bench'],benchPoints:15});assert(partial.rosterBenchList.innerHTML.includes('bench statt starter'),'verified pair remains available');assert(partial.rosterBenchList.innerHTML.includes('NICHT VOLLSTÄNDIG BEWERTBAR'),'partial coverage remains explicit');
assert(!fixture({live:false,benchPoints:15}).rosterBenchList.innerHTML.includes('bench statt starter'),'stale roster cannot authorize a move');
console.log('SEASON_LINEUP_EVIDENCE_STATUS_PASS');
