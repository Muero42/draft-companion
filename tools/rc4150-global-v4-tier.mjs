import fs from 'node:fs';import assert from 'node:assert/strict';
const s=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');
assert(s.includes('const tier=Math.max(1,Math.ceil(overall/10))'),'global 10-team tier formula missing');
assert(s.includes('if(present.length<2)continue'),'sparse coverage floor should be 2/6');
assert(s.includes("source:'Expert-v4 global overall tiers · 10-team bands'"),'global tier source label missing');
assert(s.includes("Globales v4-Overall-Tier"),'global tier tooltip missing');
console.log('rc4.150 global cross-position v4 tier contract PASS');
