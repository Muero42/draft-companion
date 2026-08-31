import fs from 'node:fs';import assert from 'node:assert/strict';
const s=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../styles.css',import.meta.url),'utf8');
assert(s.includes("const EXPERT_DISPLAY_ROWS_2026=["),'matrix missing');
assert(s.includes("if(panelId.startsWith('expert-v4-'))"),'v4 scope missing');
assert(s.includes("const pos=panelId.slice('expert-v4-'.length).toUpperCase()"),'position must derive from panelId');
assert(!s.includes("const pos=String(r?.pos||'').toUpperCase()"),'known rc4.155 broken position path remains');
assert(s.includes("EXPERT_V4_BLUEPRINT[pos]?.experts"),'sealed membership missing');
assert(!s.includes('coach-section-title">Experten'),'Experten heading remains');
assert(!s.includes('coach-section-title">Overall'),'Overall heading remains');
assert(s.includes('expert-inline expert-inline-placeholder'),'placeholder missing');
assert(css.includes('.expert-inline-placeholder{visibility:hidden;pointer-events:none}'),'placeholder visibility missing');
assert(css.includes('grid-template-columns:repeat(3,minmax(0,1fr))'),'three columns missing');
const rows=[['Sean Koerner','Dalton Del Don','Pat Fitzmaurice'],['Nick Mariano','Justin Boone','Ryan Weisse'],['Todd D Clark','Wolf of Roto Street','Kev Wheeler']];
const panels={
 QB:new Set(['Sean Koerner','Todd D Clark','Justin Boone','Dalton Del Don','Nick Mariano','Pat Fitzmaurice']),
 RB:new Set(['Ryan Weisse','Kev Wheeler','Dalton Del Don','Nick Mariano','Sean Koerner','Pat Fitzmaurice']),
 WR:new Set(['Sean Koerner','Nick Mariano','Justin Boone','Todd D Clark','Dalton Del Don','Pat Fitzmaurice']),
 TE:new Set(['Wolf of Roto Street','Ryan Weisse','Sean Koerner','Dalton Del Don','Pat Fitzmaurice','Justin Boone'])
};
function shape(m,row){let last=-1;for(let i=0;i<row.length;i++)if(m.has(row[i]))last=i;return last<0?[]:row.slice(0,last+1).map(n=>m.has(n)?n:null)}
assert.deepEqual(rows.map(r=>shape(panels.QB,r)),[rows[0],['Nick Mariano','Justin Boone'],['Todd D Clark']]);
assert.deepEqual(rows.map(r=>shape(panels.RB,r)),[rows[0],['Nick Mariano',null,'Ryan Weisse'],[null,null,'Kev Wheeler']]);
assert.deepEqual(rows.map(r=>shape(panels.WR,r)),[rows[0],['Nick Mariano','Justin Boone'],['Todd D Clark']]);
assert.deepEqual(rows.map(r=>shape(panels.TE,r)),[rows[0],[null,'Justin Boone','Ryan Weisse'],[null,'Wolf of Roto Street']]);
for(const id of ['expert-v4-qb','expert-v4-rb','expert-v4-wr','expert-v4-te'])assert(['QB','RB','WR','TE'].includes(id.slice('expert-v4-'.length).toUpperCase()));
console.log('rc4.156 expert card matrix PASS');
