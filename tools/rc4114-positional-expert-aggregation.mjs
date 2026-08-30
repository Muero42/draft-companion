import fs from 'node:fs';
const s=fs.readFileSync('app.js','utf8');
for(const x of [
  "v4/v5 are POSITION-SPECIFIC models",
  "rank:Number.isFinite(Number(x.posRank))&&Number(x.posRank)>0?Number(x.posRank):i+1",
  "vals.push({expertName:koerner,rank:Number(k.rank)"
]) if(!s.includes(x)) throw new Error('rc4.114 positional aggregation contract missing: '+x);
if(s.includes("rank:Number(x.rank),posRank:Number(x.posRank??x.rank)")) throw new Error('legacy Overall-as-position aggregation resurrected');
console.log('rc4.114 positional expert aggregation PASS');
