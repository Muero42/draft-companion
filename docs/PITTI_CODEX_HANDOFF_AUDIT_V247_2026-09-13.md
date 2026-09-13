# PITTI CODEX HANDOFF AUDIT — v247

Generation: `20260913T1230Z-v247`
Purpose: independent regression-resistant audit of the v247 chat handoff before the next chat continues consequential PITTI work.

## 0. MODE

READ-ONLY REVIEW of live authority + handoff accuracy.

Do not merge, deploy, production-promote, device-test, clear cache/app data, reinstall, execute Sleeper transactions, or rewrite runtime/product code as part of this audit.

The audit is intended to detect stale restoration, omitted blockers, wrong SHA/PR authority, cross-repo confusion and handoff statements that could cause the next chat to undo a verified fix.

## 1. REQUIRED INPUTS

Read fully:

- `docs/PITTI_BRIDGE_HANDOFF_V247_2026-09-13.md`
- `docs/PITTI_BRIDGE_HANDOFF_V246_2026-09-12.md` only as historical predecessor
- `AGENTS.md`
- current PR #162 metadata, exact diff and complete review/comments newer than the final `aac987...` Codex review
- current Watcher PR #6 metadata/diff
- current Draft Companion main
- current Watcher main
- current handoff PR #163 metadata/head

Do not use old rc4.196/v243 or stale v245 checkpoint claims to override newer live facts.

## 2. EXPECTED LIVE FACTS AT HANDOFF TIME — VERIFY, DO NOT BLINDLY TRUST

Draft Companion expected-at-handoff:

- main `c9f7eb1a3dea788fb56eac517dab63b39ed9ef59`
- PR #162 OPEN, mergeable, base main/c9f7eb1a, branch `pitti/rc4198-operational-restore-or1`
- PR #162 head `aac987501d2ab7366f738f7b5bef8a478581d2a8`
- exact-head workflows green: project guardrails, release contract v2, candidate package gate, cloud validation
- PR #162 body gate `FAIL_CLOSED_PENDING_P1_REPAIR`

Watcher expected-at-handoff:

- main `90473a6e7b5a79097a8a0816329113a8c492698b`
- PR #6 OPEN, mergeable, head `77221ceeb900458e95c32d78c1ad395a37422e5d`
- watcher tests green

Handoff PR expected after v247 publication:

- PR #163, branch `pitti/handoff-v246-20260912`
- docs-only draft PR
- contains both v246 historical files and v247 current takeover files

If live state has moved, report the newer live state and mark the corresponding expected fact `STALE_NONBLOCKING` or `AUTHORITY_CONFLICT` depending on materiality.

## 3. TWO ACTIVE P1 FINDINGS — MUST NOT BE LOST

Verify that v247 accurately records the final exact-head Codex findings on `aac987501d...`:

### P1-A Weekly Evidence chronology replacement

Concrete defect:

- fresh mapped records enter the fresh set before `weeklyRecordChronology()` consumer validity determines whether they may replace prior records
- `freshKeys` can therefore suppress a still-valid prior record even when the fresh record has future/stale/invalid provider chronology
- if another position is fresh/AVAILABLE, the partial snapshot can persist and valid cached projection evidence can disappear from Waiver/Trade

Minimum repair contract:

- derive replacement keys only from consumer-valid fresh records, or equivalently retain valid prior evidence until a valid replacement exists
- never restamp the prior record to make a failed fresh fetch look current
- regression must persist a partial snapshot with another healthy position and prove the prior valid record survives the invalid replacement

### P1-B Watcher seasonEvidence player-state bypass

Concrete defect:

- top-level `v.events` receives v2 lane filtering
- `v.seasonEvidence.events` is still appended without player-state health gating
- `v.seasonEvidence.roleGraphs` is still stored without player-state health gating
- those paths can affect `seasonNewsReactions()`/Waiver routing despite `player_state_status=FAIL`

Minimum repair contract:

- player-state unhealthy => block all player-state-derived `seasonEvidence.events` and `roleGraphs`
- healthy market lane must continue independently
- player-state PASS must still permit the player-state evidence
- v1 behavior must remain compatible

If either P1 is missing or softened in the bridge, verdict must be FAIL_CLOSED.

## 4. PRESERVED rc4.199 FIXES — AUDIT FOR REGRESSION RISK

Confirm the v247 bridge correctly preserves these already integrated candidate behaviors rather than asking the next chat to reimplement/undo them:

- rank-cache recovery does not delete protected research/return-validation/active decision/current season-weekly evidence
- projections settle independently by position
- a projection-stage snapshot persists before optional rank acquisition
- ranks settle independently
- record-valid partial projection evidence can be consumed
- all-fresh-projection failure remains fail-closed
- FP deadline covers response-body consumption
- 429 no-retry remains
- unrelated APIs bypass the FP service-worker path
- runtime/PWA/cache identity is uniquely rc4.199 on the candidate
- Watcher v2 top-level event filtering/partial UI remains
- candidate README/seal wording does not promote stale v245 production/device authority

Report any bridge wording that would cause these to be reverted.

## 5. WAIVER / TRADE PRIORITY + INVARIANTS

Verify the handoff preserves the actual product priority:

1. Waiver / Free Agency
2. Trades
3. Start/Sit / matchup / weather
4. Draft archive

Verify it does not suggest rebuilding Waiver/Trade engines from scratch when the current P0 bottleneck is evidence availability/reliability.

Verify these invariants are explicit enough to survive takeover:

- Sleeper live state is roster/ownership/starter/reserve/FAAB authority
- Reserve/IR not ordinary drop
- K vs K only
- FLEX permits TE / two TE legal
- draft-only QB2 rule not universal in season
- no automatic Sleeper transaction
- no fabricated selected expert panel
- no cross-position rank arithmetic
- missing game/weather/lock/opponent remains unavailable
- no cache clear/app-data clear/reinstall shortcut
- source/package/preview/production/device states remain separate

## 6. CROSS-REPO AUDIT

Check Watcher PR #6 itself remains internally healthy and that the v247 bridge correctly attributes the current remaining bypass to Draft Companion client consumption rather than requiring Watcher #6 to be weakened or redesigned.

Specifically verify Watcher #6:

- overall PASS when at least one lane is independently PASS
- event rows are server-filtered by lane health
- all-unhealthy fails closed
- free-agency radar excludes owned players and requires league state
- scheduled base collectors remain delegated once
- no automatic fantasy transaction

If Draft Companion P1-B can be fixed entirely client-side while preserving Watcher #6, say so explicitly.

## 7. OUTSTANDING CODEX REPAIR TASK / DUPLICATION GUARD

The v247 bridge says a targeted `@codex address that feedback` request was posted on PR #162 at `2026-09-13T08:59:49Z`, but no repair was yet published into live PR #162 at handoff time.

Audit live GitHub now:

- Did Codex publish a new transport branch/PR/commit after the bridge was written?
- Did PR #162 head move?
- Are there new comments/results after the repair request?

If yes, report the exact new object and state that the next chat must audit/integrate it rather than create duplicate repair work.

If no, confirm `P1_REPAIR_STILL_OUTSTANDING`.

## 8. REQUIRED VERDICT FORMAT

Return exactly these sections:

- `AUTHORITY`
- `HANDOFF_COMPLETENESS`
- `PR162_STATE`
- `P1_A_CHRONOLOGY`
- `P1_B_WATCHER_SEASON_EVIDENCE`
- `WATCHER_PR6`
- `NON_REGRESSION_INVARIANTS`
- `CODEX_REPAIR_DISCOVERY`
- `SAFE_NEXT_SEQUENCE`

Allowed verdict labels per section:

- `PASS`
- `PASS_WITH_NONBLOCKING_NOTES`
- `FAIL_CLOSED`
- `STALE_NONBLOCKING`
- `AUTHORITY_CONFLICT`

End with one machine-readable line:

`CODEX_V247_HANDOFF_AUDIT_RESULT=<PASS|FAIL_CLOSED>;PR162=<PASS|FAIL_CLOSED>;P1A=<OPEN|CLOSED>;P1B=<OPEN|CLOSED>;WATCHER_PR6=<PASS|FAIL_CLOSED>;REPAIR_DISCOVERY=<NONE|FOUND>`

The overall result must be `FAIL_CLOSED` if either P1 is still open, if authority conflicts materially, or if the bridge omits a required blocker/invariant.

## 9. SAFE NEXT SEQUENCE IF AUDIT IS CLEAN AS A HANDOFF

A handoff audit may be `PASS` for accuracy even while the engineering state remains fail-closed. If the bridge accurately records open blockers, the next chat should:

1. fresh live verify authority
2. check for a newly published Codex P1 repair
3. audit that repair against both P1 contracts
4. integrate only into existing PR #162 lane (transport PR only if technically required)
5. run exact-head GitHub gates on the new head
6. obtain one final exact-head Codex P0/P1 review
7. consider merge only if no unresolved P0/P1 remains and current authorization allows it
8. re-resolve main after merge
9. verify Production source SHA + served build identity separately
10. one bounded physical canary only after production identity proof
11. coupled canonical checkpoint reconciliation only after P0 restore settles

Do not let the audit itself authorize merge, production promotion or device acceptance.
