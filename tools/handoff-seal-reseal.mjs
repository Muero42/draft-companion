import fs from 'node:fs';
import crypto from 'node:crypto';

const sealPath='PITTI_HANDOFF_SEAL.json';
const seal=JSON.parse(fs.readFileSync(sealPath,'utf8'));
if(seal.status!=='PASS'||seal.handoff_ready!==true||seal.second_pass_pass!==true)throw new Error('refuse to hash a non-final handoff state');
if(seal.integrity_algorithm!=='git_blob_sha1'||seal.integrity_normalization!=='UTF8_LF_TEXT')throw new Error('unsupported seal convention');

const additions=[
  'docs/PITTI_BRIDGE_HANDOFF_RC4204_PHYSICAL_SLEEPER_TIMEOUT_2026-09-15.md',
  'docs/PITTI_BRIDGE_HANDOFF_V255_2026-09-19.md',
  'docs/PITTI_CODEX_HANDOFF_AUDIT_V255_2026-09-19.md',
  'tools/handoff-seal-reseal.mjs',
  'tools/postmerge-authority-contract.mjs',
  'tools/postmerge-authority-regression.mjs'
];
const targets=[...new Set([...Object.keys(seal.integrity||{}),...additions])].sort();
const blobSha=p=>{
  if(!fs.existsSync(p))throw new Error(`seal target missing: ${p}`);
  const body=fs.readFileSync(p,'utf8').replace(/\r\n/g,'\n');
  const bytes=Buffer.from(body,'utf8');
  return crypto.createHash('sha1').update(Buffer.from(`blob ${bytes.length}\0`)).update(bytes).digest('hex');
};
seal.integrity=Object.fromEntries(targets.map(p=>[p,blobSha(p)]));
fs.writeFileSync(sealPath,JSON.stringify(seal,null,2)+'\n');
console.log(`HANDOFF_SEAL_RESEALED generation=${seal.handoff_generation} files=${targets.length}`);
