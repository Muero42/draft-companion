import fs from 'node:fs';
import assert from 'node:assert/strict';
import {RUNTIME_FILES} from './runtime-files.mjs';

const workflow=fs.readFileSync('.github/workflows/release-contract-v2-package.yml','utf8');
const packageTool=fs.readFileSync('tools/package-reextract.mjs','utf8');
const block=packageTool.match(/const files=\[([^\]]+)\];/)?.[1]||'';
const packageFiles=[...block.matchAll(/'([^']+)'/g)].map(m=>m[1]);

assert.equal(RUNTIME_FILES.length,17,'canonical runtime manifest must remain 17 files');
assert.deepEqual(packageFiles,[...RUNTIME_FILES],'package-reextract must match canonical runtime manifest exactly');
assert(RUNTIME_FILES.includes('lineup-start-sit-v2.js'),'Start/Sit optimizer must be packaged');
assert(RUNTIME_FILES.includes('game-context-v1.js'),'game-context adapter must be packaged');
assert(workflow.includes("import {RUNTIME_FILES} from './tools/runtime-files.mjs'"),'candidate package workflow must consume canonical runtime manifest');
assert(workflow.includes('test "${#RUNTIME_FILES[@]}" -eq 17'),'candidate package workflow must guard the canonical count');
assert(workflow.includes('cp "${RUNTIME_FILES[@]}" dist/runtime/'),'candidate package workflow must stage the canonical manifest');
assert(workflow.includes('cmp -s "$file" "dist/reextract/$file"'),'candidate package workflow must byte-compare every re-extracted runtime file');
assert(!workflow.includes('test "$(unzip -Z1 "dist/$PKG" | wc -l)" -eq 15'),'stale 15-file candidate package assertion must not return');

console.log('SEASON_PACKAGE_MANIFEST_REGRESSION_PASS');
