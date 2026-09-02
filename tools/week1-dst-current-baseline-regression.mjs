import fs from 'node:fs';
const s=fs.readFileSync('app.js','utf8');
for(const token of [
"['JAX',1,1,'CLE']","['LAC',2,1,'ARI']","['HOU',3,1,'BUF']","['PIT',10,3,'ATL']","['KC',18,4,'DEN']",
"Special Teams v2 · RotoBaller W1: Rank + Tier + Gegner."
]) if(!s.includes(token)) throw new Error('current W1 DST baseline missing: '+token);
for(const stale of ["['PIT',3,1,'ATL',19.25]","Opp implied '+x.rb.implied","Vegas-Implied-Points"]) if(s.includes(stale)) throw new Error('stale/unverified DST evidence resurrected: '+stale);
console.log('week1 DST current baseline regression PASS');
