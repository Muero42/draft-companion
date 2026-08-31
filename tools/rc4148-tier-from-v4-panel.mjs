import fs from 'node:fs';import assert from 'node:assert/strict';
const s=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');
assert(s.includes("Expert-v4 individual-only panel tiers"));
assert(s.includes("expected.every(name=>names.has(norm(name)))"));
assert(s.includes("pos==='QB'||pos==='TE'?4:8"));
assert(s.includes("function externalTierHtml(x)"));
assert(!s.includes("keine expliziten Tier-Zeilen"));
console.log('rc4.148 exact-v4 derived tier contract PASS');
