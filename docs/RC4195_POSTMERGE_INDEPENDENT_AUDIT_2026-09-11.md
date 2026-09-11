# rc4.195 post-merge independent audit findings

Repository: `Muero42/draft-companion`
Audit target: canonical main after merged PR #141
Observed main during audit: `f1340a2c2d6248212c7652dc58b2f3323f74b1f5`

This file is preparation evidence for `CODEX_RC4195_POSTMERGE_RECONCILIATION_2026-09-11.md`. It is not current runtime authority and must not replace fresh Git/GitHub verification.

## Additional stale active/current claims reproduced

### `PITTI_NEW_CHAT_BOOTSTRAP.md`

Current generation is still v239 and active text says:

- rc4.195 is PR-only on Draft PR #141 from `5e29f285...`
- rc4.195 remains unmerged, undeployed and device-unverified

After PR #141 merge, only the unmerged/PR-only source claims are stale. Deployment/device claims remain fail-closed.

### `HANDOFF_COMPLETENESS_MATRIX.md`

Current PASS definition still requires:

- rc4.195 PR-only on Draft PR #141
- rc4.195 not merged/deployed/device-accepted

The merge portion is stale and would cause a new takeover to restore the wrong source boundary unless reconciled.

### `README.md`

Top current block currently says:

- feature candidate rc4.195 on Draft PR #141, not merged
- canonical main remains rc4.193
- rc4.195 is PR-only

All three source/merge statements are stale after PR #141. The README must say rc4.195 source is merged while deployment parity remains unknown and physical rc4.193 remains latest device PASS.

## Guardrail observations

### `tools/postmerge-authority-contract.mjs`

Observed main contract still contains v239-specific requirements, including:

- handoff generation regex requiring `...-v239`
- source candidate rc4.195 checks built around the v239 checkpoint
- dynamic deployment/device separation that should be preserved
- historical audit assertions tied to earlier base/main observations

Do not simply replace every historical SHA. Preserve historical performed-audit facts, but update the active generation/current-source semantics to v240 and PR #141 merged.

A robust pattern is:

- active current authority remains dynamic (`main` must be freshly verified)
- a separately scoped historical verification record captures that PR #141 was observed MERGED and contained by main at `f1340a2...`
- contract rejects stale operative `PR #141 OPEN/UNMERGED/PR-only` claims while permitting the historical merged record

### `tools/pitti_guardrail_check.mjs`

The guardrail already directly loads and behaviorally checks `boone-trade-values-v1.mjs`, including the production Worker path, automatic app refresh/storage, provenance and FAAB basis. Preserve these checks.

The mandatory `requiredSealFiles` set currently covers the core checkpoint files plus `app.js` and `live-surface-v3.js`; it does not require the new Boone module in seal integrity. The existing seal also does not list `boone-trade-values-v1.mjs`.

Codex should make an explicit decision:

- if the seal is intentionally only a checkpoint/core handoff integrity set, leave that design unchanged and document why Boone behavioral guards are sufficient;
- if current critical runtime modules are intended to be sealed, add `boone-trade-values-v1.mjs` consistently to `requiredSealFiles` and the final seal.

Do not expand the integrity set casually if that creates a self-referential or brittle handoff loop.

## Runtime package inventory

`tools/runtime-files.mjs` on merged main defines exactly 15 runtime files and includes:

- `weekly-evidence-v2.js`
- `boone-trade-values-v1.mjs`
- `_worker.js`
- the existing app/static expert/runtime assets

Checkpoint reconciliation must not change this runtime inventory or its byte digest.

Expected re-extracted package identity remains:

`sha256:01f51099435ef226b410c8f2ab4f23f77498e4e82d8371b48cfa7717ec155eca`

## Promotion boundary after checkpoint repair

After a clean checkpoint-only PR is merged, the next separate lane is:

1. dynamically verify final canonical main + exact-head gates
2. production deploy rc4.195 using the already established Cloudflare deployment path
3. verify uploaded asset inventory including Boone runtime asset and Worker endpoint
4. verify production alias / Boone endpoint / runtime byte parity
5. refresh existing Android/PWA without cache clear/reinstall unless a verified failure requires otherwise
6. physically verify Waiver/FA and Trades on device

Do not perform any of these promotion steps inside the checkpoint-only reconciliation task.
