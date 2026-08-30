import fs from 'node:fs';
const s=fs.readFileSync('app.js','utf8');
const must=[
  "const APP_VERSION='v11.8.0-rc4.122'",
  "RB:{experts:['Ryan Weisse','Kev Wheeler','Dalton Del Don','Nick Mariano','Sean Koerner','Pat Fitzmaurice']",
  "WR:{experts:['Sean Koerner','Nick Mariano','Justin Boone','Todd D Clark','Dalton Del Don','Pat Fitzmaurice']",
  "TE:{experts:['Wolf of Roto Street','Ryan Weisse','Sean Koerner','Dalton Del Don','Pat Fitzmaurice','Justin Boone']",
  "buildPanelFromExpertRows('expert-v4-'+pos.toLowerCase(),pos,rows,bp.weights||",
  "overallRank:Number(row.overallRank)",
  "Einzelrankings · Positionsrang",
  "const v3Id=EXPERT_PROFILE_IDS.expertv3[pos]",
  "<span>${esc(x.p.pos)}-Panel</span>",
  "v5 is the controlled v3 challenger",
  "raw[koerner]=target*100",
  "Expert-v3 plus verified Sean Koerner funded primarily from Draft Sharks Team",
  "const overall=Number(row.overallRank),posRank=Number(row.posRank??row.rank);",
  "rank:mean,overallRank:mean,posRank:posMean",
  "vals.push({...x,rank:Number(x.rank),overallRank:Number(x.rank)",
  "rank:Number(k.overallRank??k.rank)"
];
for(const x of must)if(!s.includes(x))throw new Error('rc4.117 contract missing: '+x);
if(s.includes("source:'verified v4 individual-only + verified Sean Koerner'"))throw new Error('obsolete v4+Koerner v5 resurrected');
if(s.includes("const koernerWeight=.20,scale=1-koernerWeight"))throw new Error('obsolete v5 20% proportional funding resurrected');
const rb=s.match(/RB:\{experts:\[[^\n]+/m)?.[0]||'';
if(/Draft Sharks Team/.test(rb))throw new Error('v4 RB contains team ranking');
for(const p of ['QB','RB','WR','TE']){
  const m=s.match(new RegExp(p+":\\{experts:\\[([^\\]]+)\\],weights:\\{([^}]+)\\}"));
  if(!m)throw new Error('missing weighted v4 '+p);
  const vals=[...m[2].matchAll(/:([0-9]+(?:\.[0-9]+)?)/g)].map(x=>Number(x[1]));
  const sum=vals.reduce((a,b)=>a+b,0);
  if(Math.abs(sum-100)>1e-9)throw new Error(p+' weights sum '+sum);
}
const live=fs.readFileSync('live-surface-v3.js','utf8');
for(const x of [
  "function expertRankLabel(hit,pos)",
  "\${pos}#\${Math.round(posRank)} · Ovr #\${Math.round(overall)}",
  "expertv5:'Expert-v5 HYBRID + KOERNER'",
  "expertv4:'Expert-v4 INDIVIDUAL-ONLY'"
]) if(!live.includes(x)) throw new Error('compact rank/profile canary missing: '+x);
console.log('rc4.122 release-critical contract PASS');
