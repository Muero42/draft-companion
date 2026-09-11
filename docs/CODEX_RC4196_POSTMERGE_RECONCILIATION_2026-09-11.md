# PITTI rc4.196 post-merge authority reconciliation

Date: 2026-09-11
Mode: POST_DRAFT_SEASON_COMPANION
Repository: Muero42/draft-companion

## Binding live authority to verify first

Fresh GitHub observation before this work package was created:

- PR #143 (`rc4.196 Start/Sit v6 + Weekly Expert Evidence + game context`) was merged.
- Observed merge commit: `555487237c9075d5e5ceeb1fee196f4763f87cc3`.
- The implementation source commit merged through PR #143 was `69a0593410ab5db754090a01d5b0e5beef2ed38b`.
- The previous production/device authority remains `v11.8.0-rc4.195` until a later authorized production deployment and physical Android canary proves rc4.196.
- rc4.196 package identity from the source-candidate validation: 17 runtime files, SHA-256 `a654422c907e3127335c20df1956fc974442c3eb3be011a5d8eb1e9b71f4500d`, unless a byte-exact rerun proves otherwise.
- Source-candidate local validation reported strict suite `211/211 PASS`, guardrail/seal PASS, Weekly Evidence and Start/Sit regressions PASS, mobile Chromium 390x844 PASS and byte-exact package re-extraction PASS.

These SHAs are historical observations only. Re-verify current `origin/main`, PR #143, ancestry and exact-head CI before making dependent changes. Never hard-code a containing checkpoint commit as permanent authority.

## Scope

POST-MERGE AUTHORITY RECONCILIATION ONLY.

Do not modify runtime/product behavior. Do not bump beyond `v11.8.0-rc4.196`.

Create generation `v242` (or the next internally consistent generation if repository contracts require another number) and reconcile the coupled PITTI checkpoint / handoff / seal surfaces so they state truthfully:

1. rc4.196 / PR #143 is MERGED into canonical main.
2. Start/Sit v6, Weekly Expert Evidence v1 and NFL game-context v1 are source-merged.
3. `v11.8.0-rc4.195` remains the latest physical production/device authority.
4. rc4.196 remains NOT production-deployed and NOT physically accepted.
5. Deployment parity for rc4.196 remains `UNKNOWN_REQUIRES_REVERIFICATION` until a later production promotion.
6. The selected PITTI individual-expert panel remains unavailable in rc4.196 v1; FantasyPros current-week Half-PPR ECR is explicitly broad-consensus evidence only.
7. Vegas remains fail-closed/unavailable without robust verified evidence; weather remains bounded and fail-closed without a fresh event-bound forecast.
8. Preserve rc4.195 physical acceptance evidence exactly: production main `8aedc4ea...`, Android rc4.195, Sleeper Live-State, Weekly Evidence 728 players, Watcher PASS, Waiver/FA and Trade fail-closed behavior, Reserve/IR separation, Boone 263/264 mapping.
9. Preserve all rc4.195 Waiver/Trade/Boone invariants and all historical rollback evidence.
10. Preserve package identity `sha256:a654422c907e3127335c20df1956fc974442c3eb3be011a5d8eb1e9b71f4500d` if byte-exact rerun confirms it.
11. Record exact-head CI only from the freshly verified current main head. Historical PASS from another commit is not proof.

## Known stale claims to eliminate

At generation v241, `PITTI_CURRENT_STATE.json` still contains claims that become stale after PR #143 merge, including examples such as:

- `source_candidate_status: SOURCE_CANDIDATE_PR_ONLY`
- source authority text saying rc4.196 is only on Draft PR #143
- local package `source_scope: DRAFT_PR143_ONLY`
- reconciled base pointing to pre-rc4.196 main
- rc4.196 described as source candidate rather than source-merged production-pending

Audit all coupled files rather than patching only those example strings.

## Required coupled surfaces

At minimum inspect and reconcile as applicable:

- `PITTI_CURRENT_STATE.json`
- `PITTI_EXECUTION_LOCK.json`
- `PITTI_COMMAND_CONTRACTS.json`
- `PITTI_HANDOFF_SEAL.json`
- `NEW_CHAT_HANDOFF_CURRENT.md`
- `PITTI_NEW_CHAT_BOOTSTRAP.md`
- `PITTI_AUTO_PREFLIGHT.md`
- `PITTI_PROJECT_STATE.md`
- `HANDOFF_COMPLETENESS_MATRIX.md`
- `README.md`
- relevant postmerge authority contract/regression tooling only if needed to express the new checkpoint generation without changing runtime behavior

## Required validation

Before pushing the reconciliation:

1. Freshly verify Git/GitHub authority and current main exact-head CI.
2. Confirm all 17 runtime/product Git blobs remain byte-identical to merged rc4.196 source.
3. Run strict suite; expected baseline is at least the rc4.196 candidate `211/211 PASS` unless the suite count legitimately changes due to checkpoint-only guard coverage.
4. Run coupled guardrail/seal checks.
5. Run postmerge authority regressions and negative tests.
6. Run package/re-extraction parity and verify all 17 extracted runtime files are byte-identical to committed runtime blobs.
7. Do not fabricate production parity or device evidence.

## Deliverable

Work only on branch `pitti/rc4196-postmerge-authority-reconcile` and update its Draft PR.

Report:

- exact branch head
- checkpoint generation
- exact verified main head and PR #143 merge state
- strict/authority/guardrail results
- whether any runtime/product bytes changed (expected: NO)
- package file count and digest
- remaining promotion boundary

## Prohibitions

- Do NOT merge this reconciliation PR.
- Do NOT deploy production.
- Do NOT clear app/cache data or reinstall.
- Do NOT execute Sleeper transactions or trades.
- Do NOT alter Start/Sit, ranking, game-context, Waiver, Trade or Boone runtime behavior in this task.
