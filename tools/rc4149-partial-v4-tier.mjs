import fs from 'node:fs';import assert from 'node:assert/strict';
const s=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');
assert(s.includes('if(present.length<4)continue'),'tier minimum must be 4/6');
assert(s.includes("label:'T '+Number(row.tier)+(n&&n<6?' · '+n+'/6':'')"),'visible partial coverage label missing');
assert(s.includes("const tier=Number(row.tier)"),'must use panel-computed tier');
assert(!s.includes("exactSix=expected.every"),'6/6 hard gate resurrected');
console.log('rc4.149 partial-v4 tier contract PASS');
