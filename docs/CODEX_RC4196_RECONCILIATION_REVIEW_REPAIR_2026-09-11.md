# rc4.196 v242 reconciliation review repair

This file records a blocking independent review of PR #145 after the Codex v242 checkpoint reconciliation was published.

## Binding authority

- canonical source: v11.8.0-rc4.196 merged through PR #143; historical merge commit `555487237c9075d5e5ceeb1fee196f4763f87cc3`; always re-verify current main dynamically before dependent promotion.
- production/device authority: v11.8.0-rc4.195 physical PASS.
- rc4.196 production/device state: NOT production-deployed, NOT physically accepted; deployment parity `UNKNOWN_REQUIRES_REVERIFICATION`.
- rc4.196 package identity: 17 files, SHA-256 `a654422c907e3127335c20df1956fc974442c3eb3be011a5d8eb1e9b71f4500d`.
- no runtime/product behavior change is authorized by this repair.

## Blocking contradictions to repair

1. `HANDOFF_COMPLETENESS_MATRIX.md` active section still carries v240 heading and rc4.195/rc4.193 current-authority claims. Make the active matrix v242-consistent: rc4.196 source-merged; rc4.195 production/device authority; rc4.196 deployment/device fail-closed.
2. `PITTI_AUTO_PREFLIGHT.md` section 8 still names rc4.195/PR #141 as canonical source, rc4.193 as latest physical Android, and says rc4.195 has no deployment/device acceptance. Replace only the operative CURRENT section; preserve explicitly historical sections.
3. `PITTI_NEW_CHAT_BOOTSTRAP.md` still opens with stale rc4.195-not-deployed / rc4.193-latest-physical authority. Align its operative bootstrap block with v242.
4. `README.md` top authority quote is correct, but the next built/source/package/deployment paragraph is stale. Align only the current authority prose above the historical release log.
5. `PITTI_COMMAND_CONTRACTS.json.currentBoundary` contains stale operative fields: `sourceAuthority`, `latestDeviceEvidence`, `reconciledBaseMain`, old package references/localCandidatePackage, and `deployedPagesAppByteParityWithMain=true` after canonical main advanced to rc4.196 while production remains rc4.195. Reconcile the fields without inventing deployment evidence.
6. `PITTI_CURRENT_STATE.json.runtime` still contains stale package/deployment parity aliases. In particular do not claim `deployed_pages_app_byte_parity_with_main=true` when rc4.196 is explicitly not deployed. Preserve the last verified deployed rc4.195 head separately from rc4.196 source authority. Keep `UNKNOWN_REQUIRES_REVERIFICATION` semantics for rc4.196 deployment parity.
7. `PITTI_EXECUTION_LOCK.json.runtime` still carries operative rc4.193/rc4.169 Android authority aliases, old package aliases, and `deployedPagesAppByteParityWithMain=true` / `mainGhPagesParity=true`. Align all operative aliases to rc4.195 accepted production/device authority and rc4.196 source-merged/not-deployed state. Historical nested blocks may remain historical.
8. `tools/postmerge-authority-contract.mjs` currently requires several contradictory stale values, including current-main parity=true while main=rc4.196 and deployed production authority=rc4.195. Correct the contract so the truthful state passes and the stale combinations fail.
9. Extend `tools/postmerge-authority-regression.mjs` with targeted negatives for all above regressions: rc4.193 latest-physical resurrection, rc4.169 active Android-authority resurrection, rc4.195 physical acceptance marked pending, rc4.196 source treated as PR-only/unmerged, current-main deployment parity true while rc4.196 is not deployed, and stale package identity aliases.
10. Regenerate `PITTI_HANDOFF_SEAL.json` against the final repaired blobs. Do not preserve PASS with stale integrity hashes.

## Verification

Run and repair until all pass on the exact final local head:

- `node tools/strict-suite.mjs`
- `node tools/pitti_guardrail_check.mjs`
- `node tools/postmerge-authority-contract.mjs`
- `node tools/postmerge-authority-regression.mjs`
- `node tools/package-reextract.mjs /tmp/pitti-rc4196-reextract`
- verify all 17 runtime blobs remain byte-identical to canonical rc4.196 main runtime bytes
- `git diff --check`

No runtime/product file should change. If a runtime/product byte changes, stop and report the unexpected diff.

Commit the repair locally on `pitti/rc4196-postmerge-authority-reconcile`. If shell push lacks GitHub credentials, finish the clean local commit and report its exact SHA for Codex platform PR handoff. Do not merge or deploy from the Codex task.