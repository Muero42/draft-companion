import fs from 'node:fs';import assert from 'node:assert/strict';
const s=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');
assert(s.includes("Expert-v4 individual-only panel tiers"));
assert(s.includes("const tier=Number(row.tier)"),'display tier must come from v4 panel');
assert(s.includes("if(present.length<4)continue"),'must allow 4/6 and 5/6 coverage');
assert(s.includes("function externalTierHtml(x)"));
assert(!s.includes("keine expliziten Tier-Zeilen"));
console.log('rc4.148+ exact-v4 derived tier contract PASS');
