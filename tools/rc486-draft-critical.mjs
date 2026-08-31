import fs from 'node:fs';
import assert from 'node:assert/strict';

const app=fs.readFileSync('app.js','utf8');
const idx=fs.readFileSync('index.html','utf8');
const sw=fs.readFileSync('sw.js','utf8');
const manifest=fs.readFileSync('manifest.webmanifest','utf8');

for(const [name,src] of [['app',app],['index',idx],['sw',sw],['manifest',manifest]])
  assert.match(src,/v11\.8\.0-rc4\.(?:86|8[7-9]|9\d|[1-9]\d{2,})/,name+' rc4.86+ version mismatch');

assert.ok(app.includes('async function exportExpertV3Challengers()'));
assert.ok(app.includes('const row=await loadExpertRanks(e.id);'));
assert.ok(!app.includes('loadSingleExpert('),'undefined rc4.85 helper resurrected');
assert.ok(app.includes("if(!row?.verifiedIndividual)throw new Error"));
assert.ok(app.includes("Object.entries(row.ranks||{})")||app.includes("Object.values(row.ranks||{})"),"Expert-v3 rank serialization missing");
assert.ok(app.includes("containsCredential:false"));
for(const n of ['Ryan Weisse','Wolf of Roto Street','Todd D Clark','Joey Wright'])assert.ok(app.includes(n),n);

// The hotfix is acquisition-only; core Expert-v2 and user-strategy invariants remain intact.
assert.ok(app.includes("incumbent:{QB:'qb',RB:'rb',WR:'wr',TE:'te'}"));assert.ok(app.includes("fullv2:{QB:'expert-v2-qb',RB:'expert-v2-rb',WR:'expert-v2-wr',TE:'expert-v2-te'}"));assert.ok(app.includes("wrv2:{QB:'qb',RB:'rb',WR:'expert-v2-wr',TE:'te'}"));
assert.ok(!app.includes('USER_HARD_QB_EXCLUSIONS'));
assert.ok(!app.includes('USER HARD EXCLUSION'));
assert.ok(!/genosmith|aaronrodgers/i.test(app));
assert.ok(app.includes("userDraftStrategyExcluded(p.pos,state.counts,p.name)"));
assert.ok(app.includes("format:'pitti-decision-evidence-v3'"));
console.log('RC486_EXPERT_V3_EXPORT_HOTFIX_PASS');