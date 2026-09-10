import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {RUNTIME_FILES} from './runtime-files.mjs';

const root=process.cwd();
const output=path.join(root,'pitti-runtime');
fs.rmSync(output,{recursive:true,force:true});
fs.mkdirSync(output,{recursive:true});

for(const file of RUNTIME_FILES){
  const source=path.join(root,file);
  assert(fs.existsSync(source),`Missing runtime source: ${file}`);
  fs.copyFileSync(source,path.join(output,file));
}

const staged=fs.readdirSync(output).sort();
const expected=[...RUNTIME_FILES].sort();
assert.deepEqual(staged,expected,'Cloudflare Pages staged runtime set differs from canonical manifest');

console.log(`PITTI_PAGES_STAGE_PASS ${RUNTIME_FILES.length} runtime entries -> ${output}`);
