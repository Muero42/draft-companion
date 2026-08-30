import fs from 'node:fs';
const s=fs.readFileSync('app.js','utf8');
// rc4.114+ invariant: v4/v5 aggregate position ranks, never Overall ranks.
// Implementations evolved after rc4.114, so assert semantics rather than one historical code string.
for(const x of [
  "v4/v5 are POSITION-SPECIFIC models",
  "rank:Number.isFinite(Number(x.posRank))&&Number(x.posRank)>0?Number(x.posRank):i+1"
]) if(!s.includes(x)) throw new Error('positional aggregation invariant missing: '+x);
if(s.includes("rank:Number(x.rank),posRank:Number(x.posRank??x.rank)")) throw new Error('legacy Overall-as-position aggregation resurrected');
// Any live individual row entering v4/v5 must aggregate with posRank fallback, while Overall
// may be retained separately for provenance/display.
if(!s.includes("rank:Number(row.posRank??row.rank)")) throw new Error('live v4 positional rank mapping missing');
console.log('rc4.114+ positional expert aggregation PASS');
