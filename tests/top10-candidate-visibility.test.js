const assert = require('assert');

function normalCandidateAdmissible(row){
  const v=row?.valueSafety;
  if(!row?.r||!Number.isFinite(row.r.rank)||!v)return false;
  const max=v.triggered&&Number.isFinite(v.qualityBandMax)
    ?v.qualityBandMax
    :Number(v.bestPanelRank)+Number(v.threshold);
  return Number.isFinite(max)&&row.r.rank<=max;
}
function visibleCandidates(rows){
  const source=(rows||[]).filter(x=>x?.p&&x?.r);
  const normal=source.filter(normalCandidateAdmissible);
  const fallback=source.filter(x=>!normalCandidateAdmissible(x));
  const normalShown=normal.slice(0,10),room=Math.max(0,10-normalShown.length);
  return normalShown.map(row=>({...row,outsideNormalCut:false}))
    .concat(fallback.slice(0,room).map(row=>({...row,outsideNormalCut:true})));
}
function row(i,rank,vs){return{p:{name:`P${i}`},r:{rank},valueSafety:vs}}

// Non-triggered safety: normal range uses bestPanelRank + phase threshold.
let rows=Array.from({length:15},(_,i)=>row(i+1,i+1,{triggered:false,bestPanelRank:1,threshold:7}));
let shown=visibleCandidates(rows);
assert.equal(shown.length,10);
assert.equal(shown.filter(x=>!x.outsideNormalCut).length,8);
assert.equal(shown.filter(x=>x.outsideNormalCut).length,2);
assert.deepEqual(shown.map(x=>x.p.name),rows.slice(0,10).map(x=>x.p.name));

// Triggered safety: the narrower qualityBandMax is authoritative.
rows=Array.from({length:15},(_,i)=>row(i+1,i+1,{triggered:true,bestPanelRank:1,threshold:11,qualityBandMax:6}));
shown=visibleCandidates(rows);
assert.equal(shown.filter(x=>!x.outsideNormalCut).length,6);
assert.equal(shown.filter(x=>x.outsideNormalCut).length,4);

// If ten normal candidates exist, no fallback is promoted merely to fill a quota.
rows=Array.from({length:15},(_,i)=>row(i+1,i+1,{triggered:false,bestPanelRank:1,threshold:13}));
shown=visibleCandidates(rows);
assert.equal(shown.length,10);
assert.equal(shown.filter(x=>x.outsideNormalCut).length,0);

// No padding: fewer than ten useful/legal source rows means fewer than ten visible rows.
rows=Array.from({length:5},(_,i)=>row(i+1,i+1,{triggered:false,bestPanelRank:1,threshold:7}));
shown=visibleCandidates(rows);
assert.equal(shown.length,5);

console.log('top10-candidate-visibility gate: OK');
