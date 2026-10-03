import fs from 'node:fs';
import crypto from 'node:crypto';

const sealPath='PITTI_HANDOFF_SEAL.json';
const seal=JSON.parse(fs.readFileSync(sealPath,'utf8'));
if(seal.status!=='PASS'||seal.handoff_ready!==true||seal.second_pass_pass!==true)throw new Error('refuse to hash a non-final handoff state');
if(seal.integrity_algorithm!=='git_blob_sha1'||seal.integrity_normalization!=='UTF8_LF_TEXT')throw new Error('unsupported seal convention');

const additions=[
  'tools/fixtures/rc4225/initial-runtime-blobs.json',
  'docs/PITTI_RC4225_PRODUCTION_RECEIPT.json',
  'docs/PITTI_RC4225_PRODUCTION_RECEIPT.json',
  'docs/PITTI_RC4225_ROSTER_SURFACE_AUDIT.md',
  'tools/season-rc4225-roster-refinement-regression.mjs',
  'tools/rc4225-authority.mjs',
  'tools/fixtures/rc4225/authority-digests.json',
  'tools/fixtures/rc4225/runtime-blobs.json',
  'tools/fixtures/rc4225/wr-calendar.html',
  'docs/PITTI_RC4224_PRODUCTION_RECEIPT.json',
  'docs/PITTI_RC4224_ROSTER_SURFACE_AUDIT.md',
  'tools/season-rc4224-roster-presentation-regression.mjs',
  'tools/rc4224-authority.mjs',
  'tools/fixtures/rc4224/authority-digests.json',
  'tools/fixtures/rc4224/runtime-blobs.json',
  'tools/fixtures/rc4224/sleeper-week4.json',
  'docs/PITTI_RC4223_MINOR_RANK_COUNT_AUDIT.md',
  'docs/PITTI_RC4223_PRODUCTION_RECEIPT.json',
  'docs/PITTI_RC4223_LOCK_RANK_PERSISTENCE_AUDIT.md',
  'tools/season-rc4223-persistence-lock-regression.mjs',
  'tools/season-rc4223-eligibility-regression.mjs',
  'tools/season-rc4223-tottenham-regression.mjs',
  'tools/fixtures/rc4223/runtime-blobs.json',
  'tools/fixtures/rc4223/physical-shape.mjs',
  'tools/fixtures/rc4223/tottenham-forecast.json',
  'docs/PITTI_BRIDGE_HANDOFF_V270_PR207_PRODUCTION_TRADE_RATIONALE_PHYSICAL_PASS_2026-09-27.md',
  'docs/PITTI_CODEX_HANDOFF_AUDIT_V270_2026-09-27.md',
  'docs/PITTI_BRIDGE_HANDOFF_V269_PR207_PRODUCTION_TRADE_RATIONALE_PENDING_2026-09-27.md',
  'docs/PITTI_CODEX_HANDOFF_AUDIT_V269_2026-09-27.md',
  'docs/PITTI_BRIDGE_HANDOFF_V268_PR205_PRODUCTION_BOONE_PHYSICAL_PASS_2026-09-27.md',
  'docs/PITTI_CODEX_HANDOFF_AUDIT_V268_2026-09-27.md',
  'docs/PITTI_BRIDGE_HANDOFF_V266_RC4211_PRODUCTION_BOUNDED_PHYSICAL_PASS_2026-09-26.md',
  'docs/PITTI_CODEX_HANDOFF_AUDIT_V266_2026-09-26.md',
  'docs/PITTI_BRIDGE_HANDOFF_RC4205_PHYSICAL_PASS_2026-09-19.md',
  'docs/PITTI_BRIDGE_HANDOFF_V256_2026-09-19.md',
  'docs/PITTI_CODEX_HANDOFF_AUDIT_V256_2026-09-19.md',
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
