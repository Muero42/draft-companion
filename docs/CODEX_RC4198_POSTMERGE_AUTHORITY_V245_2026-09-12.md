# rc4.198 post-merge authority reconciliation — v245

## 0. Binding scope

This is a **checkpoint/authority-only** repair after the validated rc4.198 runtime was merged to canonical `main` through PR #156. Do not change runtime/product behavior. Do not deploy production. Do not perform device/cache/reinstall actions. Do not execute Sleeper transactions.

The final repaired checkpoint must distinguish, without collapse:

- **source/main:** `v11.8.0-rc4.198` at the freshly verified canonical main containing PR #156;
- **package:** rc4.198, canonical runtime manifest exactly 17 files, source-byte/re-extraction parity only, `PACKAGED_ONLY_NOT_DEPLOYED`;
- **production/device:** still `v11.8.0-rc4.196`, deployed exact commit `082d77003f6616e290146698641aebe63f37b8c2`, Cloudflare deployment `da039536-7733-4b07-8f0c-70cc6e0bc8b7`, physical verdict `RC4.196_PHYSICAL_PARTIAL_PASS_NOT_ACCEPTED`;
- **prior fully accepted rollback:** `v11.8.0-rc4.195`.

No merge/source/package fact may imply rc4.198 production deployment, device observation or device acceptance.

## 1. Fresh observed GitHub authority before this branch

Repository: `Muero42/draft-companion`

Fresh canonical main immediately after PR #156:

`826a1f3327ffac643f3c32217246133ea32bd3ac`

Its tree is:

`1e91afc64a61f4aad08f7fc50d687736211b3d87`

PR #156 was squash-merged. Historical merge provenance to preserve:

- PR: `#156`
- base main before merge: `62d7ecf11774700551b6e5a0497ec054e327a0d7`
- final reviewed PR head: `931713f8f8beaa70edbfb75041b2c708fae66109`
- squash merge/current-main commit: `826a1f3327ffac643f3c32217246133ea32bd3ac`
- merged tree: `1e91afc64a61f4aad08f7fc50d687736211b3d87`

Treat those as timestamped merge provenance. Current main must still be dynamically reverified at execution time.

## 2. Why v245 is required

The rc4.198 PR exact-head gates were green before merge, including Release Contract v2, Project Guardrails, Candidate Package Gate and Cloud Validation.

After the squash merge, exact-main push CI correctly exposed stale v244 authority pointers:

- `PITTI Project Guardrails` run `34695364753` failed at **PITTI execution-lock and anti-regression gate** after syntax/startup/postmerge-regression steps had passed.
- `PITTI candidate package gate` run `34695364793` successfully completed behavioral contract, **Package then re-extract**, artifact upload and migration contracts, then failed at **Independent runtime review and strict seal**.

The deterministic stale lock is visible in canonical main:

- `app.js` is `v11.8.0-rc4.198`;
- `PITTI_EXECUTION_LOCK.json.runtime.appVersion` is still `v11.8.0-rc4.197`;
- v244 CURRENT/COMMAND/LOCK/SEAL aliases still describe rc4.197 as current source/main.

This is the intended fail-closed post-merge checkpoint gate. Repair the coupled checkpoint; do **not** revert rc4.198 runtime bytes merely to satisfy v244.

## 3. Required v245 authority

Advance the handoff generation beyond `20260912T0545Z-v244` to a coherent **v245** generation. Choose one UTC timestamp consistently across all coupled generation/timestamp aliases.

Record rc4.198 source promotion using a new `rc4198_source_merge` (or semantically equivalent) provenance block:

- checkpoint `v245`;
- PR 156;
- status `MERGED/HISTORICAL`;
- source head `931713f8f8beaa70edbfb75041b2c708fae66109`;
- base head `62d7ecf11774700551b6e5a0497ec054e327a0d7`;
- merge commit `826a1f3327ffac643f3c32217246133ea32bd3ac`;
- `deployment_proven=false`;
- `device_acceptance_proven=false`;
- evidence scope explicitly historical merge provenance only.

Current source aliases must become rc4.198 and reconcile to the freshly verified canonical main. In particular, after live verification and with equivalent naming where applicable:

- `PITTI_CURRENT_STATE.json.authority.source_candidate = v11.8.0-rc4.198`;
- source/main reconciliation pointers refer to the verified rc4.198 main, not rc4.197/`a2d3...`;
- `runtime.season_candidate`, `test_challenger`, `preview_candidate`, `source_candidate_status`, local package aliases and package scope all describe rc4.198 as current source/package, `PACKAGED_ONLY_NOT_DEPLOYED`;
- `PITTI_EXECUTION_LOCK.json.runtime.appVersion = v11.8.0-rc4.198`;
- execution-lock preinstall/package aliases describe rc4.198 17-file source-byte parity and noncanonical run/environment-scoped archive SHA semantics;
- `PITTI_HANDOFF_SEAL.json.branch_locks.source_baseline = v11.8.0-rc4.198` and reconciled-main pointer matches freshly verified main;
- COMMAND/CURRENT/LOCK exact-next-action/resume text consistently says rc4.198 source/main packaged-only, production/device rc4.196, rollback rc4.195;
- README/current handoff/bootstrap/matrix/preflight/project-state current sections say the same and place v244 under explicit historical/superseded scope.

Do not set canonical package SHA from the Codex-local archive observation. The previously observed rc4.198 archive SHA `39efb6cf1d6dc98c40cda634bf2c1e728b960608e20cf6494611658b3195ec` is run-scoped evidence only. Canonical guarantee is the exact 17-file manifest plus source-byte/re-extraction parity.

## 4. Production/device facts that MUST NOT move

Preserve all of these exactly unless fresh external evidence independently proves otherwise; this package itself supplies no such evidence:

- production version `v11.8.0-rc4.196`;
- deployed source commit `082d77003f6616e290146698641aebe63f37b8c2`;
- deployment id `da039536-7733-4b07-8f0c-70cc6e0bc8b7`;
- installed/latest physically observed Android/PWA `v11.8.0-rc4.196`;
- physical verdict `RC4.196_PHYSICAL_PARTIAL_PASS_NOT_ACCEPTED`;
- prior fully accepted rollback `v11.8.0-rc4.195`;
- `testChallengerAndroidObserved=false` for current source challenger rc4.198;
- no main/production byte-parity claim for rc4.198;
- no rc4.198 deployment/device acceptance claim.

The rc4.196 preserved PASS lanes and blockers remain historical physical evidence. Do not rewrite them as rc4.198 observations.

## 5. CI evidence semantics

Be precise about exact-main CI:

- rc4.198 runtime behavior/package already passed the full PR exact-head gate at reviewed PR head `931713...`.
- On merged main `826a1f...`, the **Package then re-extract** step passed before the strict authority seal failed.
- Main CI failures after merge are authority/checkpoint failures, not evidence that package re-extraction or rc4.198 runtime behavior failed.
- Do not falsely mark the overall failed post-merge Candidate Package/Guardrails runs as successful.
- The v245 PR itself must obtain fresh exact-head green gates before merge.
- After v245 merge, exact-main push CI must be reverified dynamically.

## 6. Coupled files

Audit and update every coupled active authority alias, not merely the obvious lock field. Expected scope includes at least:

- `HANDOFF_COMPLETENESS_MATRIX.md`
- `NEW_CHAT_HANDOFF_CURRENT.md`
- `PITTI_AUTO_PREFLIGHT.md`
- `PITTI_COMMAND_CONTRACTS.json`
- `PITTI_CURRENT_STATE.json`
- `PITTI_EXECUTION_LOCK.json`
- `PITTI_HANDOFF_SEAL.json`
- `PITTI_NEW_CHAT_BOOTSTRAP.md`
- `PITTI_PROJECT_STATE.md`
- `README.md`
- `tools/pitti_guardrail_check.mjs`
- `tools/postmerge-authority-contract.mjs`
- `tools/postmerge-authority-regression.mjs`

If another active current alias is coupled by executable validation, update it too. Historical blocks may retain old facts only when structurally scoped as historical/superseded.

Regenerate `PITTI_HANDOFF_SEAL.json` canonically after all sealed files are final. Do not hand-wave seal drift.

## 7. Regression requirements

Preserve every existing semantic negative. In particular keep the prior counts/coverage intact:

- `legacy=56`
- `new_v243=13`
- `new_authority=2`
- `external=9`
- `new_v244=8`

Adapt v244 tests to the new rc4.198 baseline without reducing their semantic protection. Add a distinct `new_v245` group protecting at minimum:

1. stale rc4.197 current source candidate after rc4.198 merge;
2. stale rc4.197 execution-lock runtime appVersion;
3. stale rc4.197 sealed source baseline/reconciled-main checkpoint;
4. false promotion of rc4.198 to production/device observed/accepted;
5. collapse of rc4.198 source/package state into rc4.196 production or vice versa.

A candidate-preflight path must never make stale post-merge CURRENT/LOCK/SEAL state valid on canonical main.

## 8. Runtime immutability for this package

This v245 package is checkpoint/contract only.

All **17 canonical runtime files must remain byte-identical to canonical main `826a1f...`**. In particular do not modify:

- `app.js`
- `weekly-evidence-v2.js`
- `game-context-v1.js`
- `lineup-start-sit-v2.js`
- `index.html`
- `manifest.webmanifest`
- `sw.js`
- `_worker.js`
- or any other file returned by `tools/runtime-files.mjs`.

Do not change rc4.198 feature behavior while repairing authority.

## 9. Required validation

Run at minimum:

- `node tools/strict-suite.mjs <fresh-result-path>`
- `node tools/postmerge-authority-contract.mjs`
- `node tools/postmerge-authority-regression.mjs`
- `node tools/pitti_guardrail_check.mjs`
- `PITTI_CANDIDATE_PREFLIGHT=1 PITTI_SKIP_SEAL_INTEGRITY=0 node tools/pitti_guardrail_check.mjs`
- `node tools/release-contract-v2.mjs`
- `node tools/season-package-manifest-regression.mjs`
- `node tools/package-reextract.mjs <fresh-temp-dir>`
- explicit 17-runtime-file byte-identity comparison against starting main `826a1f...`
- `git diff --check`

All must pass before declaring the v245 repair complete locally.

## 10. Publication/promotion discipline

Update the **existing v245 Draft PR only** once one exists. Do not create duplicate PRs.

Do not merge from Codex.
Do not deploy production.
Do not clear cache/app data or reinstall.
Do not perform a physical device action.
Do not execute Sleeper transactions.

Final report must state:

- freshly verified starting main and branch head;
- chosen v245 generation;
- exact rc4.198 source/package vs rc4.196 production/device vs rc4.195 rollback separation;
- PR #156 squash-merge provenance;
- exact changed files;
- preserved and new negative-regression counts;
- all validation results;
- proof all 17 runtime files are unchanged;
- final local commit SHA;
- whether publication to the existing v245 PR actually succeeded.