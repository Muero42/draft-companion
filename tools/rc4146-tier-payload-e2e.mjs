import fs from 'node:fs';import assert from 'node:assert/strict';
const src=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert(!html.includes('Bisherige Konfiguration (rc4.64)'),'obsolete top expert selector still visible');
assert(html.includes('v4 PRIMARY · v5 CHALLENGER · v3 Failsafe'),'draft-day model authority missing');
// rc4.148+ intentionally retired the public-API tier payload parser. The website may show
// tiers via client-side/private logic; runtime display must now come from the sealed v4 panel.
assert(src.includes('function buildV4PanelTiers()'),'v4 panel tier builder missing');
assert(src.includes('externalTierHtml(x)'),'coach render does not call external tier renderer');
assert(!src.includes('fpConsensusTierNumber(row)'),'obsolete undocumented public-API tier parser resurrected');
console.log('rc4.146 legacy payload contract superseded by rc4.148+ panel-tier path PASS');
