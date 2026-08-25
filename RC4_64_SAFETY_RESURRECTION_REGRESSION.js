'use strict';

// Deterministic mechanism regression for rc4.64.
// This deliberately tests the narrow causal interaction only: Player-Quality Safety may
// protect materially better players, but it must not resurrect an already-demoted QB2/TE2
// merely because that repeated position owns the best overall panel rank.

function safetyEligibleForPromotion(row){
  const counts=row?.rosterCounts||{};
  if(row?.p?.pos==='QB' && Number(counts.QB||0)>=1 && !row.exceptionalRosterValue)return false;
  if(row?.p?.pos==='TE' && Number(counts.TE||0)>=1 && !row.exceptionalRosterValue)return false;
  return true;
}

function gate(rows,current){
  const threshold=current<=30?7:current<=70?9:current<=110?11:13;
  const valid=rows.filter(x=>Number.isFinite(x.r?.rank)&&Number.isFinite(x.rawScore));
  const natural=valid.slice().sort((a,b)=>b.rawScore-a.rawScore||a.r.rank-b.r.rank)[0];
  const eligible=valid.filter(safetyEligibleForPromotion);
  const best=Math.min(...eligible.map(x=>x.r.rank));
  const gap=natural.r.rank-best;
  if(gap<threshold)return natural;
  const max=best+Math.max(3,Math.floor(threshold/2));
  const band=eligible.filter(x=>x.r.rank<=max);
  return band.slice().sort((a,b)=>b.rawScore-a.rawScore||a.r.rank-b.r.rank)[0]||natural;
}

const row=(name,pos,rank,raw,counts={},exceptional=false)=>({p:{name,pos},r:{rank},rawScore:raw,rosterCounts:counts,exceptionalRosterValue:exceptional});
const assert=(ok,msg)=>{if(!ok)throw new Error(msg)};

// Reproduces the Pick-92 mechanism: QB2 has the strongest panel rank but roster scoring has
// already demoted him below the natural RB/WR leader. Safety must not undo that decision.
let rows=[row('Natural RB','RB',61,90,{QB:1}),row('Repeated QB','QB',40,72,{QB:1}),row('WR alt','WR',66,88,{QB:1})];
assert(gate(rows,92).p.name==='Natural RB','Pick-92 QB2 was resurrected by Safety');

// Same invariant for TE2.
rows=[row('Natural WR','WR',70,91,{TE:1}),row('Repeated TE','TE',45,73,{TE:1}),row('RB alt','RB',74,89,{TE:1})];
assert(gate(rows,105).p.name==='Natural WR','TE2 was resurrected by Safety');

// QB1 and TE1 remain normal Safety candidates.
rows=[row('Natural RB','RB',25,90,{QB:0}),row('First QB','QB',10,82,{QB:0})];
assert(gate(rows,52).p.name==='First QB','QB1 Safety protection changed');
rows=[row('Natural WR','WR',30,90,{TE:0}),row('First TE','TE',14,82,{TE:0})];
assert(gate(rows,58).p.name==='First TE','TE1 Safety protection changed');

// A repeated QB/TE that NATURALLY wins is untouched; the repair is not a global ban.
rows=[row('Natural QB2 winner','QB',48,94,{QB:1}),row('RB alt','RB',52,92,{QB:1})];
assert(gate(rows,118).p.name==='Natural QB2 winner','natural QB2 winner was blocked');
rows=[row('Natural TE2 winner','TE',50,94,{TE:1}),row('WR alt','WR',54,92,{TE:1})];
assert(gate(rows,118).p.name==='Natural TE2 winner','natural TE2 winner was blocked');

// Explicit exceptional-slide metadata keeps the Safety path available.
rows=[row('Natural RB','RB',75,91,{QB:1}),row('Exceptional QB slide','QB',35,80,{QB:1},true)];
assert(gate(rows,100).p.name==='Exceptional QB slide','exceptional QB2 slide lost Safety eligibility');
rows=[row('Natural WR','WR',75,91,{TE:1}),row('Exceptional TE slide','TE',35,80,{TE:1},true)];
assert(gate(rows,100).p.name==='Exceptional TE slide','exceptional TE2 slide lost Safety eligibility');

// Clean non-QB/TE Safety behavior remains intact.
rows=[row('Natural WR','WR',45,92,{}),row('Elite RB','RB',20,80,{})];
assert(gate(rows,90).p.name==='Elite RB','clean RB/WR Safety behavior changed');

console.log('PASS rc4.64 Safety-resurrection mechanism regression');
