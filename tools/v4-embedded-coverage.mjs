import fs from 'node:fs';import assert from 'node:assert/strict';
const b2src=fs.readFileSync('expert-v2-board.js','utf8'),b3src=fs.readFileSync('expert-v3-board.js','utf8');
const b2=JSON.parse(b2src.match(/window\.PITTI_EXPERT_V2=([\s\S]+);\s*$/)[1]);
const w={};new Function('window',b3src)(w);const b3=w.PITTI_EXPERT_V3;
const norm=v=>String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\b(jr|sr|ii|iii|iv)\b\.?/g,'').replace(/[^a-z0-9]/g,'');
const bp={QB:['Pat Fitzmaurice','Justin Boone','Dalton Del Don','Nick Mariano','Todd D Clark'],RB:['Pat Fitzmaurice','Nick Mariano','Dalton Del Don','Ryan Weisse'],WR:['Pat Fitzmaurice','Nick Mariano','Dalton Del Don','Justin Boone'],TE:['Pat Fitzmaurice','Justin Boone','Dalton Del Don','Wolf of Roto Street']};
const need={QB:24,RB:60,WR:70,TE:24},report={};
function rows(name,pos){const m=new Map();for(const row of b2.rows?.[pos]||[]){const h=(row.individual||[]).find(x=>x.expertName===name&&Number.isFinite(Number(x.rank)));if(h)m.set(norm(row.name),Number(h.rank));}const c=b3.challengers?.[pos];if(c?.name===name)for(const [n,r] of c.ranks||[])if(Number.isFinite(Number(r)))m.set(norm(n),Number(r));return m}
for(const pos of Object.keys(bp)){const maps=Object.fromEntries(bp[pos].map(n=>[n,rows(n,pos)]));const union=new Set(Object.values(maps).flatMap(m=>[...m.keys()]));const complete=[...union].filter(k=>bp[pos].every(n=>maps[n].has(k)));report[pos]={need:need[pos],sourceCounts:Object.fromEntries(bp[pos].map(n=>[n,maps[n].size])),completeIntersection:complete.length};for(const n of bp[pos])assert.ok(maps[n].size>=need[pos],pos+' '+n+' source depth '+maps[n].size+' < '+need[pos]);assert.ok(complete.length>=need[pos],pos+' complete intersection '+complete.length+' < '+need[pos]);}
console.log('V4_EMBEDDED_COVERAGE_PASS '+JSON.stringify(report));
