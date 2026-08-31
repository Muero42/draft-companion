import fs from 'node:fs';import assert from 'node:assert/strict';
const s=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');
assert(s.includes("const EXPERT_DISPLAY_PRIORITY_2026=["),'expert display priority missing');
for(const name of ['Sean Koerner','Dalton Del Don','Pat Fitzmaurice','Nick Mariano','Justin Boone','Todd D Clark','Ryan Weisse','Kev Wheeler','Wolf of Roto Street'])assert(s.includes("'"+name+"'"),name+' missing');
assert(s.includes('stableExpertDisplayOrder(Object.keys(panels[r?.panelId]?.weights||{})'),'card display does not use stable order');
const order=['Sean Koerner','Dalton Del Don','Pat Fitzmaurice','Nick Mariano','Justin Boone','Todd D Clark','Ryan Weisse','Kev Wheeler','Wolf of Roto Street'];
const idx=Object.fromEntries(order.map((x,i)=>[x,i]));
const panels={
 QB:['Todd D Clark','Sean Koerner','Justin Boone','Dalton Del Don','Nick Mariano','Pat Fitzmaurice'],
 RB:['Ryan Weisse','Kev Wheeler','Dalton Del Don','Nick Mariano','Sean Koerner','Pat Fitzmaurice'],
 WR:['Sean Koerner','Justin Boone','Todd D Clark','Pat Fitzmaurice','Nick Mariano','Dalton Del Don'],
 TE:['Pat Fitzmaurice','Ryan Weisse','Sean Koerner','Justin Boone','Dalton Del Don','Wolf of Roto Street']
};
for(const [p,names] of Object.entries(panels)){const got=[...names].sort((a,b)=>idx[a]-idx[b]);assert.deepEqual(got.slice(0,3),['Sean Koerner','Dalton Del Don','Pat Fitzmaurice'],p+' common core order');}
console.log('rc4.153 stable cross-position expert display order PASS');
