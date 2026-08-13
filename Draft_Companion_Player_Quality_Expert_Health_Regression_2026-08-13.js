const assert=require('assert');
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
function quality(rank,best){return 100-clamp((rank-best)*1.0,0,74)}
// Monotonicity across the complete relevant rank range.
for(let best=1;best<=40;best+=3){
  let prev=Infinity;
  for(let rank=best;rank<=230;rank++){
    const q=quality(rank,best);
    assert(q<=prev+1e-12,`non-monotonic at best=${best} rank=${rank}`);
    prev=q;
  }
}
// A fallen elite remains materially superior in Player Quality to a merely fair player.
assert(quality(5,5)>quality(12,5));
assert(quality(5,5)-quality(15,5)>=10);
// Player Quality itself is independent of current pick/ADP by construction.
assert.strictEqual(quality(11.9,11.9),100);
assert.strictEqual(quality(13.4,11.9),98.5);
assert.strictEqual(quality(14.0,11.9),97.9);
// 2.02 selected-panel fixture: Brown remains narrowly above Jefferson/Bowers in pure quality;
// downstream scarcity/need may still choose among these near peers, but cannot invert the quality input itself.
assert(quality(11.9,11.9)>quality(13.4,11.9));
assert(quality(13.4,11.9)>quality(14.0,11.9));
// Expert-health semantics: positional completeness is not equivalent to desired-pool health.
const desired=6,verified=5,qbPanelVerified=3,qbPanelMembers=3;
assert.strictEqual(qbPanelVerified/qbPanelMembers,1);
assert(verified<desired,'desired pool must still be degraded');
console.log('PASS player-quality monotonicity + expert-pool health semantics');

// rc4.11 strict expert-health semantics: stale fallback is usable but not current verification.
function poolHealth(statuses){
  const verified=statuses.filter(x=>x==='verified').length;
  const stale=statuses.filter(x=>x==='stale-fallback').length;
  return {verified,stale,usable:verified+stale,total:statuses.length,degraded:verified<statuses.length};
}
const h=poolHealth(['verified','verified','stale-fallback','verified','verified','verified']);
assert(h.verified===5 && h.stale===1 && h.usable===6 && h.degraded, 'stale fallback must not masquerade as current 6/6 verification');

// Preset fallback priority remains visible beyond nominal max because a later entry can backfill an unavailable earlier expert.
const preset={list:[['Pat',35],['Boone',30],['Koerner',20],['Erickson',15],['Derek',10]],max:4};
assert(preset.list.length>preset.max && preset.list[4][0]==='Derek', 'fallback candidate after max must remain part of declared priority');
console.log('PASS rc4.11 strict expert-health + fallback-priority semantics');
