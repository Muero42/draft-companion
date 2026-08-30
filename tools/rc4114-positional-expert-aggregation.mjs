import fs from 'node:fs';
const app=fs.readFileSync('app.js','utf8');
const live=fs.readFileSync('live-surface-v3.js','utf8');

// rc4.122 invariant: v4 keeps TWO independent rank semantics.
// - Overall = common cross-position Coach scale.
// - posRank = position-specific interpretation/provenance.
// Never compare RB1/WR1/QB1 directly as one global ranking number.
for(const x of [
  "const overall=Number(row.overallRank),posRank=Number(row.posRank??row.rank);",
  "rank:overall,posRank,overallRank:overall",
  "const posMean=vals.reduce((a,x)=>a+x.posRank*x.effectiveWeight,0)/sw;",
  "rank:mean,overallRank:mean,posRank:posMean"
]) if(!app.includes(x)) throw new Error('dual-rank v4 invariant missing: '+x);

// v5 inherits frozen v3 Overall values and must add Koerner on the SAME Overall scale.
for(const x of [
  "const v3Id=EXPERT_PROFILE_IDS.expertv3[pos]",
  "vals.push({...x,rank:Number(x.rank),overallRank:Number(x.rank)",
  "rank:Number(k.overallRank??k.rank)",
  "posRank:Number(k.posRank)"
]) if(!app.includes(x)) throw new Error('v5 common-scale invariant missing: '+x);

// Compact live view must expose both semantics when both exist.
for(const x of [
  "function expertRankLabel(hit,pos)",
  "${pos}#${Math.round(posRank)} · Ovr #${Math.round(overall)}",
  "return'expertv5'",
  "return'expertv4'"
]) if(!live.includes(x)) throw new Error('compact rank/profile invariant missing: '+x);

console.log('rc4.122 dual-rank aggregation/display PASS');
