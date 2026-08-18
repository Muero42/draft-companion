const assert = require('assert');

function visibleCandidates(rows, normalCutCount){
  const top=rows.slice(0,10);
  return top.map((row,i)=>({...row, outsideNormalCut:i>=normalCutCount}));
}

const rows=Array.from({length:15},(_,i)=>({name:`P${i+1}`}));
let shown=visibleCandidates(rows,7);
assert.equal(shown.length,10);
assert.deepEqual(shown.slice(0,7).map(x=>x.outsideNormalCut),Array(7).fill(false));
assert.deepEqual(shown.slice(7).map(x=>x.outsideNormalCut),Array(3).fill(true));

shown=visibleCandidates(rows,10);
assert.equal(shown.filter(x=>x.outsideNormalCut).length,0);

shown=visibleCandidates(rows,6);
assert.equal(shown.filter(x=>!x.outsideNormalCut).length,6);
assert.equal(shown.filter(x=>x.outsideNormalCut).length,4);

// Presentation expansion must never mutate the ranking/order itself.
assert.deepEqual(shown.map(x=>x.name),rows.slice(0,10).map(x=>x.name));

console.log('top10-candidate-visibility gate: OK');
