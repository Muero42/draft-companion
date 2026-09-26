# PITTI CODEX HANDOFF AUDIT — v248

Generation: `20260913T1250Z-v248`
Purpose: independent regression-resistant review of the v248 bridge and the newly published P1 repair transport before the next chat performs consequential PITTI work.

## 0. MODE

READ-ONLY audit only.

Do not merge, deploy/promote production, device-test, clear cache/app data, reinstall, execute Sleeper transactions, or edit runtime/product code in this audit.

## 1. REQUIRED INPUTS

Read fully:

- `docs/PITTI_BRIDGE_HANDOFF_V248_2026-09-13.md`
- `docs/PITTI_BRIDGE_HANDOFF_V247_2026-09-13.md` only as predecessor history
- `AGENTS.md`
- current Draft Companion `main`
- PR #162 metadata/diff/checks/reviews/comments
- PR #165 metadata/full diff/checks/reviews/comments
- current Watcher `main`
- Watcher PR #6 metadata/diff/checks
- current handoff PR #163 metadata/head

Live GitHub wins over the bridge for mutable state.

## 2. EXPECTED LIVE FACTS AT V248 HANDOFF — VERIFY, DO NOT BLINDLY TRUST

Draft Companion:

- main `c9f7eb1a3dea788fb56eac517dab63b39ed9ef59`
- PR #162 OPEN/mergeable, base main, branch `pitti/rc4198-operational-restore-or1`, head `aac987501d2ab7366f738f7b5bef8a478581d2a8`
- PR #162 remains engineering FAIL_CLOSED until the two P1 repairs are integrated and final exact-head review is clean

New P1 transport:

- PR #165 OPEN/mergeable
- title `rc4.199 follow-up: close chronology and Watcher player-state bypasses`
- base branch `pitti/rc4198-operational-restore-or1`
- base SHA `aac987501d2ab7366f738f7b5bef8a478581d2a8`
- exact head `e3917a9f6d5bed912a7fdd7ab7fb02e6e487aab5`
- exactly five changed files at handoff:
  - `PITTI_HANDOFF_SEAL.json`
  - `app.js`
  - `tools/season-watcher-feed-v2-regression.mjs`
  - `tools/weekly-evidence-v2-regression.mjs`
  - `weekly-evidence-v2.js`

Watcher:

- main `90473a6e7b5a79097a8a0816329113a8c492698b`
- PR #6 OPEN/mergeable, head `77221ceeb900458e95c32d78c1ad395a37422e5d`

Handoff:

- PR #163 docs-only draft branch `pitti/handoff-v246-20260912`
- v248 files are current takeover docs

If live state moved, report the newer state and classify the bridge fact as `STALE_NONBLOCKING` unless it creates a material authority conflict.

## 3. AUDIT P1-A — WEEKLY EVIDENCE CHRONOLOGY

Original defect on `aac987...`:

- invalid fresh chronology could still enter the fresh record set
- replacement keys derived from those fresh records could suppress a still-valid prior record
- another healthy position could make the partial snapshot persist, erasing valid cached projection evidence

Required repair contract:

1. fresh projection record must pass `weeklyRecordChronology()` before publication/replacement eligibility
2. invalid fresh provider chronology must not claim replacement key
3. valid prior record must survive byte/value/verification-time unchanged until a valid replacement exists
4. do not restamp retained prior evidence
5. regression must use a production-shaped partial snapshot with another healthy/AVAILABLE position and prove persistence keeps the valid prior projection

Audit PR #165 code, not merely its description. Mark P1-A CLOSED only if all points are satisfied without weakening the consumer chronology contract.

## 4. AUDIT P1-B — WATCHER PLAYER-STATE SEASONEVIDENCE BYPASS

Original defect on `aac987...`:

- top-level v2 `events` were filtered by lane
- `seasonEvidence` player-state-derived records/events/roleGraphs could still be persisted/ingested while `player_state_status != PASS`

Required repair contract:

1. v2 player-state unhealthy => block all player-state-derived `seasonEvidence.records`, nested fundamental events, and `roleGraphs`
2. healthy market data remains independently usable
3. v1 compatibility remains intact
4. player-state PASS restores player-state evidence path
5. regressions prove market PASS + player-state FAIL cannot leak season player-state evidence

Audit the exact PR #165 diff and relevant downstream consumers such as `seasonNewsReactions()`/Waiver routing. Mark CLOSED only if the bypass is fully shut.

## 5. PRESERVED RC4.199 INVARIANTS — NO REGRESSION

Verify PR #165 does not regress any already integrated behavior:

- rank-cache recovery preserves protected research/return-validation/decision/current season-weekly evidence
- projection positions settle independently
- projection-stage snapshot persists before optional ranks
- rank positions settle independently
- record-valid partial projections remain consumable
- all-fresh-projection failure stays fail-closed
- FP deadline includes response-body consumption
- HTTP 429 remains no-retry
- unrelated APIs bypass FP service-worker path
- unique rc4.199 runtime/PWA/cache identity remains coherent
- Watcher top-level v2 lane filtering and partial-health UI remain
- candidate seal/docs do not promote stale production/device authority
- Waiver v3 and Trade v8 fail closed on missing/unverified evidence
- no automatic Sleeper transaction

## 6. WATCHER PR #6 CROSS-REPO AUDIT

Verify Watcher #6 remains internally sound:

- overall PASS if either lane independently PASS
- server event rows filtered by lane health
- all-unhealthy fail-closed
- free-agency radar requires league state and excludes owned players
- scheduled collectors delegated exactly once
- no D1 migration/cron/automatic transaction

Confirm PR #165 fixes the remaining bypass client-side and does not require weakening Watcher #6.

## 7. PR #165 TRANSPORT / INTEGRATION SEMANTICS

Verify that PR #165 targets PR #162's feature branch, not `main`.

Required safe sequence if clean:

- integrate/merge PR #165 into `pitti/rc4198-operational-restore-or1`
- then re-resolve PR #162 exact head
- do not treat PR #165 local task SHA `fc367f9...` as canonical after publication; published authority is live PR #165 head
- do not merge PR #165 directly as a substitute for the final PR #162 main merge path

If PR #165 base or head changed materially, report exact live refs.

## 8. HANDOFF COMPLETENESS

Verify the v248 bridge explicitly preserves:

- current main SHA
- PR #162 exact head and engineering FAIL_CLOSED state
- PR #165 exact transport identity and both repair contracts
- Watcher PR #6 authority
- Waiver first / Trades second product priority
- Sleeper live authority
- Reserve/IR protection
- K vs K
- FLEX TE legality
- no universal in-season QB2 ban
- no auto transaction
- no fabricated selected panel
- no cross-position rank arithmetic
- game/weather/opponent fail-closed
- no cache clear/reinstall shortcut
- source/package/preview/production/device separation
- exact next integration/review sequence

The handoff itself may be complete while engineering remains FAIL_CLOSED. Do not turn handoff accuracy into engineering approval.

## 9. REQUIRED VERDICT FORMAT

Return exactly these sections:

- `AUTHORITY`
- `HANDOFF_COMPLETENESS`
- `PR162_STATE`
- `PR165_TRANSPORT`
- `P1_A_CHRONOLOGY`
- `P1_B_WATCHER_SEASON_EVIDENCE`
- `WATCHER_PR6`
- `NON_REGRESSION_INVARIANTS`
- `SAFE_NEXT_SEQUENCE`

Allowed labels:

- `PASS`
- `PASS_WITH_NONBLOCKING_NOTES`
- `FAIL_CLOSED`
- `STALE_NONBLOCKING`
- `AUTHORITY_CONFLICT`

End with exactly one machine-readable line:

`CODEX_V248_HANDOFF_AUDIT_RESULT=<PASS|FAIL_CLOSED>;PR162=<PASS|FAIL_CLOSED>;PR165=<PASS|FAIL_CLOSED>;P1A=<OPEN|CLOSED>;P1B=<OPEN|CLOSED>;WATCHER_PR6=<PASS|FAIL_CLOSED>`

Overall result rules:

- `HANDOFF_COMPLETENESS` may be PASS if the bridge accurately records a fail-closed engineering state.
- machine-readable overall remains `FAIL_CLOSED` until PR #165 itself is audited clean and both P1s are CLOSED.
- after P1s close on PR #165, overall may still remain FAIL_CLOSED if PR #162 has not yet integrated the repair or if exact-head gates/final review remain outstanding.
- the audit never authorizes merge to main, production promotion or device acceptance.
