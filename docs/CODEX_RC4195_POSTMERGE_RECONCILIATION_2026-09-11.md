# PITTI Codex Work Package — rc4.195 post-merge authority reconciliation

Date prepared: 2026-09-11
Repository: `Muero42/draft-companion`
Prepared branch: `pitti/rc4195-postmerge-authority-reconcile`
Branch base: `f1340a2c2d6248212c7652dc58b2f3323f74b1f5`
Scope: **checkpoint / authority reconciliation only**

## Live authority independently verified before this package

At preparation time, canonical GitHub state was:

- PR #141: **MERGED**
- PR #141 source head: `5661d08a3d1e449f6b5ba505c381ec30bff7ecf0`
- canonical `main`: `f1340a2c2d6248212c7652dc58b2f3323f74b1f5`
- merge commit message identifies PR #141 and has parents `5e29f285103531b81c7579036e7a885e487e0650` and `5661d08a3d1e449f6b5ba505c381ec30bff7ecf0`
- post-merge GitHub check-runs returned no in-progress, failed or cancelled job at the end of the independent audit; observed project/release/package/cloud checks completed successfully
- no production deployment of rc4.195 was performed as part of PR #141

Re-verify all of the above before changing files. If canonical `main` has advanced, reconcile the newer live authority first and do not restore this observed SHA as current merely because it appears here.

## Immutable runtime / device facts for this reconciliation

Do **not** alter product/runtime behavior in this work package.

Preserve:

- source/runtime version: `v11.8.0-rc4.195`
- rc4.195 package: 15 files
- rc4.195 package SHA-256: `01f51099435ef226b410c8f2ab4f23f77498e4e82d8371b48cfa7717ec155eca`
- package state: `PACKAGED_ONLY_NOT_DEPLOYED`
- deployment parity: `UNKNOWN_REQUIRES_REVERIFICATION`
- latest physical Android observed/accepted functional evidence: `v11.8.0-rc4.193`
- rc4.193 physical PASS: Sleeper Live-State, Weekly Evidence 1 Min., 725 FantasyPros projections, Watcher PASS, missing-module recovery, quota-safe persistence without cache clear/reinstall
- historical rollback authority: `v11.8.0-rc4.169`
- rc4.195 physical device acceptance: **NOT YET PERFORMED**
- Boone/Yahoo live audit: 263/264 mapped overall; QB 37/37, RB 87/87, WR 99/100, TE 40/40; current PITTI roster 15/15; opponent assets 119/119
- FAAB convention: percentages are percent of original league FAAB budget; displayed units use the same original-budget basis and are capped by actual remaining FAAB

No merge state, source state or CI result may be used as proof of deployment or physical device acceptance.

## Independently reproduced stale checkpoint contradictions on merged main

These are the known stale claims that make a coupled reconciliation necessary. Do not patch only these strings; scan the whole coupled authority set and repair all equivalent active/current claims.

### `PITTI_CURRENT_STATE.json`

Observed after merge:

- `authority.source_candidate` is rc4.195, but `runtime.season_candidate` still calls it **PR-only**.
- `source_authority` still says canonical main was verified at `5e29f285...` and rc4.195 is **PR-only / not merged**.
- `runtime.local_candidate_package.source_branch` still points only at `pitti/codex-waiver-trade-season-v1`.
- deployment/device fields correctly remain fail-closed and must stay separate.

### `PITTI_EXECUTION_LOCK.json`

Observed after merge:

- `authority.failClosedRecovery` still describes rc4.195 as **PR-only on Draft PR #141 from main 5e29f285...** and says no merge occurred.
- `currentBoundary.productionControl`, `sourceAuthority`, and `runtimeVersion` still describe rc4.195 as PR-only.
- `androidAcceptance` correctly says rc4.193 physical PASS / rc4.195 pending and must remain so.

### `PITTI_COMMAND_CONTRACTS.json`

Observed after merge:

- `currentBoundary.productionControl` says rc4.195 remains PR-only.
- `currentBoundary.sourceAuthority` still says Draft PR #141 from main `5e29f285...`.
- `currentBoundary.runtimeVersion` says rc4.195 PR-only.
- deployment remains UNKNOWN and must not be promoted merely because source merged.

### `NEW_CHAT_HANDOFF_CURRENT.md`

Observed after merge:

- CURRENT AUTHORITY still says rc4.195 is the PR-only package on Draft PR #141.
- closing paragraph says rc4.195 remains **unmerged, undeployed and device-unverified**.
- only `unmerged` is stale; `undeployed` and `device-unverified` remain true.

### `PITTI_AUTO_PREFLIGHT.md`

Observed after merge in section 8:

- canonical source candidate still described as **rc4.195 PR-only ... not merged**.
- repeated sentence says source candidate is PR-only.
- deployment/device fail-closed wording is still required.

### `PITTI_PROJECT_STATE.md`

Observed after merge:

- early Authority section still contains older rc4.192 current wording; chronology may remain historical but must not read as active authority ahead of the newest EOF/current section.
- newest rc4.195 checkpoint records PR #141 source/package evidence but explicitly says no merge occurred.
- append a new **v240 CURRENT** post-merge reconciliation at EOF rather than rewriting historical v238/v239 facts into events that did not happen at those timestamps.

### `PITTI_HANDOFF_SEAL.json`

- existing generation is v239 and integrity hashes cover the old checkpoint bytes.
- after any coupled file change, generate a fresh coupled seal; never hand-edit integrity values without verifying actual Git blob SHA-1 values of the final tree.

### Other coupled files

Audit and reconcile active/current wording in at least:

- `PITTI_NEW_CHAT_BOOTSTRAP.md`
- `HANDOFF_COMPLETENESS_MATRIX.md`
- `README.md`
- all coupled references enforced by `tools/postmerge-authority-contract.mjs` / `tools/pitti_guardrail_check.mjs`

Do not modify historical sections solely because they contain old facts. Repair active/current authority and ensure historical blocks are explicitly scoped so they cannot override the new current section.

## Required new current authority semantics

The new coupled generation should be the next generation after v239 (normally **v240**) and must express these semantics consistently:

1. `v11.8.0-rc4.195` source is **MERGED into canonical main through PR #141**.
2. Current `main` SHA is always dynamically verified. The last observed merge commit may be recorded as a timestamped/historical verification fact, but must not become self-authority for the containing checkpoint commit.
3. rc4.195 Waiver/FA + Trades + Boone/Yahoo runtime ingestion + FAAB-basis changes are source-merged.
4. rc4.195 remains **NOT PRODUCTION DEPLOYED** unless fresh external evidence independently proves otherwise during this work package. Do not infer it.
5. Deployment byte parity remains `UNKNOWN_REQUIRES_REVERIFICATION` until the later production-promotion lane.
6. rc4.195 remains **NOT PHYSICALLY ACCEPTED**.
7. Latest physical Android functional PASS remains rc4.193.
8. rc4.169 remains historical rollback authority unless an existing canonical rule explicitly promotes another rollback authority; do not infer promotion.
9. The rc4.195 package digest and 15-file re-extraction identity remain as stated above unless a byte-exact rerun proves otherwise.
10. The Boone live mapping counts remain as stated above unless a fresh rerun proves otherwise.
11. `VERIFY_CANONICAL_AUTHORITY_THEN_AUTHORIZED_WORK` remains the continuation/promotion gate.
12. Source merge never implies production deployment, cache change, reinstall, physical acceptance or Sleeper action.

## Contract / guardrail repair requirements

Inspect `tools/postmerge-authority-contract.mjs` before changing checkpoints. It currently encodes v239-specific generation and multiple historical/current invariants. Update only what is required for the v240 post-merge state.

Important:

- Preserve the dynamic-authority design; do not replace it with a permanently frozen current SHA.
- Preserve historical performed-audit records instead of mutating history.
- Add an explicit post-merge PR #141 historical verification record if that is the cleanest way to retain the observed merge and CI facts without making them future current authority.
- Ensure active-string scans no longer reject legitimate `PR #141 MERGED` historical records while still rejecting stale operative PR-state claims.
- Keep runtime/product files byte-identical unless a guard/test itself must be updated to understand the checkpoint transition. No behavior change is authorized.
- If updating tests/guardrails changes the packaged runtime file list or package digest, stop and diagnose: a checkpoint-only reconciliation should not change runtime package bytes.

## Verification

Before creating the PR, run all applicable checks on the exact final head:

- full strict suite
- postmerge authority contract/regression
- PITTI project guardrails
- release contract v2
- candidate/package gate as applicable
- package/re-extraction parity and digest verification
- JSON/diff hygiene
- any coupled-seal integrity verification

Required outcome:

- runtime files unchanged from rc4.195 source tree
- package remains 15 files and digest remains `01f51099435ef226b410c8f2ab4f23f77498e4e82d8371b48cfa7717ec155eca` unless proven otherwise by byte-exact rerun
- no product behavior change
- no deployment
- no cache clear/reinstall
- no Sleeper transaction

## Deliverable

Use this existing branch. Produce a **small Draft PR** containing only the post-merge authority/checkpoint/guardrail changes required for consistency.

Do not merge or deploy.

Final report must include:

- freshly verified canonical main before work
- exact branch + PR number + final head SHA
- changed files
- strict test counts/results
- exact-head CI results
- whether runtime bytes changed (expected: NO)
- package file count + SHA-256
- final current generation
- explicit confirmation: rc4.195 source merged, production/deployment parity still unverified, physical authority still rc4.193
