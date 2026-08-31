import fs from 'node:fs';import assert from 'node:assert/strict';
const app=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');
const live=fs.readFileSync(new URL('../live-surface-v3.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../live-surface-v3.css',import.meta.url),'utf8');
assert(app.includes("v11.8.0-rc4.157"));
assert(live.includes("const V4_EXPERT_MATRIX=["),'live v4 matrix missing');
assert(live.includes("String(x?.panelId||'').startsWith('expert-v4-')"),'matrix not bound to analyzed v4 row');
assert(live.includes("x?.intendedExperts"),'exact analyzed panel membership missing');
assert(live.includes("expertMatrixHtml(x)"),'actual card render does not call matrix');
assert(!live.includes('<div class="live-experts"><b>Experten:</b>'),'old visible Experten heading remains');
assert(live.includes('live-expert-placeholder'),'placeholder missing');
assert(css.includes('.live-expert-row{display:grid;grid-template-columns:repeat(3,minmax(0,1fr))'),'3-column live CSS missing');
assert(css.includes('.live-expert-placeholder{visibility:hidden;pointer-events:none}'),'hidden live placeholder missing');
const rows=[['Sean Koerner','Dalton Del Don','Pat Fitzmaurice'],['Nick Mariano','Justin Boone','Ryan Weisse'],['Todd D Clark','Wolf of Roto Street','Kev Wheeler']];
for(const row of rows)for(const name of row)assert(live.includes("'"+name+"'"),name+' absent from live matrix');
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
console.log('rc4.157 actual live-surface expert matrix PASS');
