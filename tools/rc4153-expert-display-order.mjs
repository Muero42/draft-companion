import fs from 'node:fs';import assert from 'node:assert/strict';
const s=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../styles.css',import.meta.url),'utf8');
assert(s.includes("const EXPERT_DISPLAY_ROWS_2026=["),'fixed expert matrix missing');
const expected=[
 ['Sean Koerner','Dalton Del Don','Pat Fitzmaurice'],
 ['Nick Mariano','Justin Boone','Ryan Weisse'],
 ['Todd D Clark','Wolf of Roto Street','Kev Wheeler']
];
for(const row of expected)for(const name of row)assert(s.includes("'"+name+"'"),name+' missing');
assert(s.includes('expert-rank expert-rank-placeholder'),'in-row placeholder contract missing');
assert(s.includes('displayRow.slice(0,last+1)'),'trailing non-members are not trimmed');
assert(s.includes('#–</span><span class="delta">fehlt'),'member missing-rank fallback absent');
assert(css.includes('.expert-display-row{display:grid;grid-template-columns:repeat(3,minmax(0,1fr))'),'fixed 3-column row CSS missing');
assert(css.includes('.expert-rank-placeholder{visibility:hidden;pointer-events:none}'),'placeholder not visually hidden');
const panels={
 QB:new Set(['Sean Koerner','Todd D Clark','Justin Boone','Dalton Del Don','Nick Mariano','Pat Fitzmaurice']),
 RB:new Set(['Ryan Weisse','Kev Wheeler','Dalton Del Don','Nick Mariano','Sean Koerner','Pat Fitzmaurice']),
 WR:new Set(['Sean Koerner','Nick Mariano','Justin Boone','Todd D Clark','Dalton Del Don','Pat Fitzmaurice']),
 TE:new Set(['Wolf of Roto Street','Ryan Weisse','Sean Koerner','Dalton Del Don','Pat Fitzmaurice','Justin Boone'])
};
function shape(members,row){let last=-1;for(let i=0;i<row.length;i++)if(members.has(row[i]))last=i;if(last<0)return[];return row.slice(0,last+1).map(n=>members.has(n)?n:null)}
assert.deepEqual(expected.map(r=>shape(panels.QB,r)),[expected[0],['Nick Mariano','Justin Boone'],['Todd D Clark']],'QB matrix contract');
assert.deepEqual(expected.map(r=>shape(panels.RB,r)),[expected[0],['Nick Mariano',null,'Ryan Weisse'],[null,null,'Kev Wheeler']],'RB matrix contract');
assert.deepEqual(expected.map(r=>shape(panels.WR,r)),[expected[0],['Nick Mariano','Justin Boone'],['Todd D Clark']],'WR matrix contract');
assert.deepEqual(expected.map(r=>shape(panels.TE,r)),[expected[0],[null,'Justin Boone','Ryan Weisse'],[null,'Wolf of Roto Street']],'TE matrix contract');
console.log('rc4.154 fixed 3x3 expert display matrix PASS');
