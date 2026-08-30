import fs from 'node:fs';
const src=fs.readFileSync('app.js','utf8');
for(const x of [
  "...Object.values(EXPERT_V4_BLUEPRINT).flatMap(x=>x.experts)",
  "EXPERT_V5_BLUEPRINT.add",
  "directory presence must never decide whether a configured expert exists"
]) if(!src.includes(x)) throw new Error('configured-expert identity contract missing: '+x);
if(!src.includes("if(!merged.has(key))merged.set(key,{id:`pub:${slugifyExpert(name)}`")) throw new Error('virtual configured expert seed missing');
console.log('rc4.113 configured expert identity PASS');
