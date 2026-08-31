import fs from 'node:fs';import assert from 'node:assert/strict';
const s=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../styles.css',import.meta.url),'utf8');
assert(s.includes("const EXPERT_DISPLAY_ROWS_2026=["),'v4 fixed matrix missing');
assert(s.includes("if(panelId.startsWith('expert-v4-'))"),'matrix must be scoped to v4 only');
assert(s.includes("EXPERT_V4_BLUEPRINT[pos]?.experts"),'v4 membership must come from sealed blueprint');
assert(s.includes("const NON_V4_EXPERT_DISPLAY_PRIORITY_2026=["),'non-v4 fallback order missing');
assert(s.includes("const intended=nonV4ExpertDisplayOrder(Object.keys(panelWeights)"),'non-v4 panel experts not preserved');
assert(!s.includes('coach-section-title">Experten · Overall'),'word Experten must not appear before expert view');
assert(s.includes('coach-section-title">Overall'),'Overall heading missing');
for(const name of ['Sean Koerner','Dalton Del Don','Pat Fitzmaurice','Nick Mariano','Justin Boone','Ryan Weisse','Todd D Clark','Wolf of Roto Street','Kev Wheeler'])assert(s.includes("'"+name+"'"),name+' missing');
assert(s.includes('expert-rank expert-rank-placeholder'),'placeholder contract missing');
assert(s.includes('displayRow.slice(0,last+1)'),'trailing non-members are not trimmed');
assert(css.includes('.expert-rank-placeholder{visibility:hidden;pointer-events:none}'),'placeholder not visually hidden');
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
console.log('rc4.155 v4-only matrix + non-v4 preservation PASS');
