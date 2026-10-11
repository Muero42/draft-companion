# PITTI BRIDGE HANDOFF — v248

Generation: `20260913T1250Z-v248`
Project: Draft Companion / PITTI
Primary repository: `Muero42/draft-companion`
Watcher repository: `Muero42/pitti-watcher`

## 0. TOP RULE — FAIL CLOSED / LIVE AUTHORITY

This v248 bridge supersedes v247 for mutable facts. v246/v247 remain historical predecessor evidence only.

On takeover:

1. Read this file completely.
2. Read `docs/PITTI_CODEX_HANDOFF_AUDIT_V248_2026-09-13.md` completely.
3. Fresh READ-ONLY verify Draft Companion `main`, PR #162, PR #165, PR #163; Watcher `main` and PR #6.
4. Live GitHub wins over this bridge for mutable state. Never restore older rc4.196/v243/v245 claims over newer verified state.
5. Source, package, preview, production, device-observed and device-accepted are separate authorities.
6. Any material contradiction is an authority conflict: stop the dependent action, determine live authority, do not guess.

## 1. USER EXECUTION CONTRACT

`PITTI AUTO` means execute safe, reversible, authorized work autonomously without interim chatter, empty messages or `AUTO läuft weiter` placeholders. Re-inventory after each block. Waiting on one external lane blocks only that lane.

`STATUS` is report-only.

No automatic Sleeper transaction. No cache/app-data clearing or reinstall. No production promotion or physical-device acceptance without separate authorization.

## 2. LIVE DRAFT-COMPANION SOURCE AUTHORITY AT HANDOFF

Freshly verified immediately before this handoff:

- repository: `Muero42/draft-companion`
- canonical `main`: `c9f7eb1a3dea788fb56eac517dab63b39ed9ef59`
- main tree: `a680607573e9d14dfe7968e6f41667a1f26b9eb2`
- main commit: `Merge PR #161: rc4.198 storage-quota hotfix`
- canonical main runtime remains rc4.198

Do not infer production/device acceptance from source main.

## 3. ACTIVE P0 CANDIDATE — PR #162

At handoff:

- PR #162 is OPEN, non-draft, mergeable
- base: `main` / `c9f7eb1a3dea788fb56eac517dab63b39ed9ef59`
- branch: `pitti/rc4198-operational-restore-or1`
- exact current head: `aac987501d2ab7366f738f7b5bef8a478581d2a8`
- runtime candidate identity: `v11.8.0-rc4.199`
- current PR body still says `FAIL_CLOSED_PENDING_P1_REPAIR`

The existing rc4.199 candidate already contains:

- protected storage policy for research/return-validation/decision/current season-weekly evidence
- projection positions settling independently
- projection-stage persistence before optional ranks
- rank positions settling independently
- record-valid partial projection consumption
- all-fresh-projection failure fail-closed
- FantasyPros response-body timeout boundary
- 429 no-retry
- unrelated API bypass
- unique rc4.199 runtime/PWA/cache identity
- Watcher v2 top-level lane filtering and partial-health UI

Do not reimplement or revert these while applying the narrow follow-up.

## 4. TWO P1 FINDINGS — REPAIR IS NOW PUBLISHED AS PR #165

The two P1 defects found by the final Codex review of `aac987...` are no longer merely an outstanding task. Codex has published a narrow transport PR:

- PR #165
- title: `rc4.199 follow-up: close chronology and Watcher player-state bypasses`
- state at handoff: OPEN
- draft: false
- mergeable: true
- base branch: `pitti/rc4198-operational-restore-or1`
- base SHA: `aac987501d2ab7366f738f7b5bef8a478581d2a8`
- head branch: `codex/github-mention-rc4.199-p0-restore-weekly-evidence,-watcher`
- exact head SHA: `e3917a9f6d5bed912a7fdd7ab7fb02e6e487aab5`
- one commit, five changed files, +38/-11

Changed files are exactly:

- `PITTI_HANDOFF_SEAL.json`
- `app.js`
- `tools/season-watcher-feed-v2-regression.mjs`
- `tools/weekly-evidence-v2-regression.mjs`
- `weekly-evidence-v2.js`

### P1-A — Weekly Evidence chronology replacement

Codex repair intent on PR #165:

- projection records are published only after passing `weeklyRecordChronology()`
- invalid fresh provider chronology cannot claim a replacement key
- still-valid prior records remain unchanged/unrestamped until a valid replacement exists
- production-shaped regression includes a future-dated QB record with another healthy/AVAILABLE position and proves prior QB projection retention through persistence

### P1-B — Watcher player-state `seasonEvidence` bypass

Codex repair intent on PR #165:

- for Watcher v2, player-state-derived `seasonEvidence.records`, nested fundamental events and `roleGraphs` are accepted only when `player_state_status === PASS`
- healthy market data remains independently ingestible
- v1 compatibility remains
- regressions prove market PASS + player-state FAIL cannot store/ingest player-state season evidence while player-state PASS restores that path

Codex local task report for the PR states:

- focused Weekly/Watcher/lane regressions PASS
- candidate guardrails PASS
- strict suite `217/217` PASS
- package re-extraction: 17 files byte-exact
- package status `PACKAGED_ONLY_NOT_DEPLOYED`
- local task commit provenance reported as `fc367f9...`; do not use that local SHA as authority now that published PR #165 exact head is `e3917a9...`

IMPORTANT: PR #165 is a transport/follow-up into PR #162's feature branch. It is NOT a production/main merge path by itself. Do not merge PR #165 to `main`; audit/integrate it into the existing PR #162 lane.

## 5. CURRENT RELEASE GATE AFTER PR #165 PUBLICATION

The engineering state remains FAIL_CLOSED until all of the following happen:

1. Audit exact PR #165 diff against both P1 contracts and preserved rc4.199 invariants.
2. Verify exact-head GitHub/Cloudflare checks for PR #165 / resulting #162 head.
3. Integrate the repair into the existing PR #162 feature branch only if the audit is clean.
4. Re-resolve PR #162's new exact head after integration.
5. Re-run exact-head gates on that new #162 head.
6. Obtain one final exact-head Codex P0/P1-only review on the new #162 head.
7. No unresolved P0/P1 may remain before merge consideration.

No merge to `main`, production promotion, device acceptance, cache/app-data clear, reinstall or Sleeper transaction is authorized by this handoff.

## 6. WATCHER AUTHORITY — PR #6

Freshly verified at handoff:

- Watcher main expected/current: `90473a6e7b5a79097a8a0816329113a8c492698b`
- PR #6 OPEN, non-draft, mergeable
- branch `pitti-auto/v0.2.7-lane-isolation`
- exact head `77221ceeb900458e95c32d78c1ad395a37422e5d`

Preserve its server-side design:

- market and player-state lanes independent
- overall PASS if at least one lane independently PASS
- server filters event rows by lane health
- all-unhealthy fail-closed
- free-agency radar requires league state and excludes owned players
- scheduled collectors delegated once
- no D1 migration, cron change, automatic transaction or production deployment

Remaining P1-B repair belongs primarily in Draft Companion client consumption; do not weaken Watcher PR #6.

## 7. PRODUCT PRIORITY / INVARIANTS

Priority remains:

1. Waiver / Free Agency
2. Trades
3. Start/Sit / matchup / weather
4. Draft archive

Waiver/Trade engines already exist; evidence reliability is the bottleneck. Do not redesign them from scratch.

Preserve all of these:

- Sleeper live league state is roster/ownership/starter/reserve/FAAB authority
- Reserve/IR never ordinary drop
- K vs K only
- FLEX allows TE; two TE legal
- draft-only QB2 rule is not a universal in-season roster cap
- no automatic Sleeper transaction
- no Sleeper projections/matchup ratings as PITTI evidence
- rank/projection lanes independent
- no cross-position rank arithmetic
- broad ECR is not fabricated selected PITTI panel evidence
- missing game/opponent/weather/lock/team total remains unavailable unless verified
- no cache clear/app-data clear/reinstall shortcut
- protect research/return-validation/decision/current season-weekly evidence ahead of rebuildable rank caches
- source/package/preview/production/device states remain separate
- productive runtime-byte changes require unique visible/build identity

## 8. HANDOFF DISCOVERY ANCHOR — PR #163

PR #163 remains the docs-only, draft, cross-chat discovery anchor. Current branch: `pitti/handoff-v246-20260912`.

v248 files are now the current takeover files. v246/v247 files are historical only.

Do not merge PR #163 as a substitute for live verification.

## 9. NEXT-CHAT TAKEOVER SEQUENCE

1. Read this v248 bridge and the v248 Codex handoff-audit file fully.
2. Fresh verify Draft Companion `main`.
3. Fresh verify PR #162 exact head/state/base/checks.
4. Fresh verify PR #165 exact head/state/base/checks and read its complete diff/reviews/comments.
5. Fresh verify Watcher main/PR #6.
6. Fresh verify PR #163 and any Codex v248 handoff-audit result newer than this file.
7. Audit PR #165 against both P1 contracts and every preserved rc4.199 invariant.
8. If clean, integrate PR #165 only into PR #162's feature branch, not directly to main.
9. Re-resolve the resulting PR #162 exact head and run/read all exact-head gates.
10. Obtain final exact-head Codex P0/P1 review of the resulting #162 head.
11. Consider merge only if no P0/P1 remains and current authorization allows it.
12. After source merge, dynamically resolve new main SHA.
13. Verify Cloudflare Production source SHA + served build identity separately.
14. One bounded physical canary only after exact production identity proof.
15. Coupled canonical checkpoint reconciliation only after P0 restore settles.

## 10. STOP CONDITIONS

Stop only for material authority conflict, red exact-head gate with no safe repair, explicit merge/deploy/device/transaction authorization boundary, unavoidable user-only physical observation, or no remaining safe independent work.
