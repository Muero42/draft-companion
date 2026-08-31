import fs from 'node:fs';import assert from 'node:assert/strict';
const s=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');
assert(s.includes('if(present.length<2)continue'),'global tier minimum should retain 2/6+ coverage');
assert(s.includes("label:'T '+Number(row.tier)+(n&&n<6?' · '+n+'/6':'')"),'visible coverage label missing');
assert(s.includes("const tier=Math.max(1,Math.ceil(overall/10))"),'global tier formula missing');
assert(!s.includes("exactSix=expected.every"),'6/6 hard gate resurrected');
console.log('rc4.149+ partial-coverage v4 tier contract PASS');
