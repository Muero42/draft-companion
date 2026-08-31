import fs from 'node:fs';import assert from 'node:assert/strict';
const s=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');
assert(s.includes("function buildV4PanelTiers()"),'v4 tier builder missing');
assert(s.includes("function externalTierHtml(x)"),'tier renderer missing');
assert(s.includes("const overall=Number(row.rank)"),'global tier must use v4 overall panel rank');
assert(s.includes("const tier=Math.max(1,Math.ceil(overall/10))"),'global tier formula missing');
assert(!s.includes("keine expliziten Tier-Zeilen"));
console.log('rc4.148+ v4 derived tier contract PASS');
