import fs from 'node:fs';
const s=fs.readFileSync('app.js','utf8');
for(const token of [
// Merged rc4.189 superseded the old draft DST board with pre-W1 waiver evidence.
"['LAC',1,2,'ARI','12+']","['BAL',2,2,'IND','12+']","['GB',3,2,'MIN','12+']","['TEN',4,2,'NYJ','12+']",
"['BUF',5,3,'HOU','12+']","['LV',6,3,'MIA','12+']","['CHI',7,4,'CAR','14+']","['NYJ',8,4,'TEN','14+']",
"Special Teams v2.2 · aktuelles RotoBaller Pre-W1-Waiver-Ranking × LIVE Sleeper-Ownership.",
"const dst=c.availableDST||[],ks=c.availableK||[];",
"filter(x=>x.rb&&x.rb.tier<=4)",
"12+/14+-Team-Empfehlungen sind Vergleichssignale, kein automatischer Add."
]) if(!s.includes(token)) throw new Error('current W1 DST baseline missing: '+token);
for(const stale of ["['PIT',3,1,'ATL',19.25]","Opp implied '+x.rb.implied","Vegas-Implied-Points"]) if(s.includes(stale)) throw new Error('stale/unverified DST evidence resurrected: '+stale);
console.log('week1 DST current baseline regression PASS');
