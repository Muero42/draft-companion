# PITTI BRIDGE HANDOFF — v247

Generation: `20260913T1230Z-v247`
Project: Draft Companion / PITTI
Primary repository: `Muero42/draft-companion`
Watcher repository: `Muero42/pitti-watcher`

## 0. TOP RULE — FAIL CLOSED / LIVE AUTHORITY

This file supersedes v246 only for facts that changed after v246. Historical v246 content remains useful, but the next chat must treat this v247 bridge as the current takeover document until live GitHub verification proves a newer state.

On takeover:

1. Read this file completely before acting.
2. Read `docs/PITTI_CODEX_HANDOFF_AUDIT_V247_2026-09-13.md` completely.
3. Fresh READ-ONLY verify both repository mains, Draft Companion PR #162, PITTI Watcher PR #6, and this handoff PR #163.
4. Live GitHub wins over this bridge for mutable state. Do not restore an older branch/head/checkpoint when a newer live state exists.
5. Source, package, preview, production, device-observed and device-accepted are separate authorities.
6. Any contradiction between live GitHub, Codex review, Cloudflare evidence, repository checkpoints or physical-device evidence is an authority conflict. Stop the dependent action and resolve authority; do not guess.

## 1. USER EXECUTION CONTRACT — PRESERVE EXACTLY

`PITTI AUTO` means execute all safe, reversible and authorized work autonomously in the same turn. No interim acknowledgement/status chatter, no empty messages, no `AUTO läuft weiter` placeholder. Re-inventory after each block. Waiting on one external gate blocks only its dependent lane.

`STATUS` is report-only.

For a handoff, preserve exact current facts, active blockers, negative constraints, next gates and provenance. Do not substitute a summary that loses SHA/PR/authority distinctions.

No automatic Sleeper transaction. No cache/app-data clearing or reinstall. No production deployment/promotion or physical-device acceptance unless separately authorized.

## 2. LIVE DRAFT-COMPANION AUTHORITY AT V247 HANDOFF

Fresh live GitHub verification immediately before this handoff:

- Repository: `Muero42/draft-companion`
- Canonical branch: `main`
- `main` HEAD: `c9f7eb1a3dea788fb56eac517dab63b39ed9ef59`
- Main tree: `a680607573e9d14dfe7968e6f41667a1f26b9eb2`
- Main commit: `Merge PR #161: rc4.198 storage-quota hotfix`
- Runtime on canonical main remains rc4.198.

Do not infer production/device acceptance from current source main.

## 3. ACTIVE DRAFT-COMPANION P0 LANE — PR #162

Fresh live state:

- PR: `#162`
- title: `rc4.199 P0: restore Weekly Evidence, Watcher lane health, and bounded FP proxy`
- state: OPEN
- draft: false
- mergeable: true
- base: `main`
- base SHA: `c9f7eb1a3dea788fb56eac517dab63b39ed9ef59`
- branch: `pitti/rc4198-operational-restore-or1`
- exact head: `aac987501d2ab7366f738f7b5bef8a478581d2a8`
- head is 8 commits ahead of current main and 0 behind at handoff time.
- changed files: 14.

Exact-head GitHub workflow runs on `aac987...` were freshly observed SUCCESS:

- PITTI Project Guardrails
- PITTI release contract v2
- PITTI candidate package gate
- PITTI cloud validation

Cloudflare Pages preview for the exact `aac987...` head was previously observed SUCCESS. That is preview evidence only, not production promotion.

### rc4.199 work already present on #162

The integrated candidate on this branch contains these intended P0 repairs:

- unique visible/runtime/PWA/cache identity `v11.8.0-rc4.199`
- rank-cache quota recovery no longer intentionally deletes protected research/return-validation/active decision evidence
- Weekly Evidence projection positions use `Promise.allSettled`
- projection-stage snapshot is persisted before optional rank acquisition
- rank positions use `Promise.allSettled`
- partial valid projections can remain consumable rather than requiring all four positions
- all-fresh-projection failure is fail-closed before overwriting prior evidence
- FantasyPros rank/projection upstream deadline extends through response-body consumption
- 429 remains no-retry and unrelated APIs bypass the FP service-worker path
- Watcher v2 top-level event ingestion understands `market` and `player_state_status`, filters top-level `v.events` by healthy lane and displays partial health
- candidate README/seal handling remains explicitly unmerged/candidate-only; stale v245 deployment/device claims were not promoted to current authority

Historical provenance only: Codex's first integrated rc4.199 implementation was reported as local commit `3484cec0047447db6adbc77627edbb803397e05b`; it was transported through a temporary Codex PR and incorporated into the existing PR #162 feature branch. Do not treat that local commit as canonical head. Canonical mutable PR authority is the live PR #162 head above.

## 4. CURRENT RELEASE GATE — TWO P1 BLOCKERS REMAIN ON EXACT HEAD `aac987...`

A final Codex exact-head P0/P1 review of `aac987501d...` found exactly two additional concrete P1 defects. They remain present on the current GitHub head at this handoff.

### P1-A — Weekly Evidence invalid fresh chronology can erase valid prior evidence

Current `weekly-evidence-v2.js` builds `freshKeys` from all fresh mapped records before record-level `weeklyRecordChronology()` validation. Therefore a fresh same-player/same-position record with future/stale/otherwise consumer-invalid chronology can claim the replacement key and suppress a still-valid prior record. If another position is fresh/AVAILABLE, that partial snapshot can be persisted, removing valid cached evidence from Waiver/Trade consumption.

Required repair:

- only consumer-valid fresh records may claim replacement keys / suppress prior records
- invalid fresh chronology must not replace or restamp still-valid prior evidence
- preserve prior record byte/value/verification-time semantics until a valid replacement exists
- add a production-shaped regression where another position is fresh/AVAILABLE so the partial snapshot is actually persisted and prove the invalid replacement cannot erase the valid prior record

### P1-B — Watcher player-state bypass through `seasonEvidence`

Current `app.js` v2 lane filtering applies to top-level `v.events`, but `v.seasonEvidence.events` is appended unconditionally and `v.seasonEvidence.roleGraphs` is stored unconditionally. With `market=PASS` and `player_state_status=FAIL`, stale/unhealthy player-state-derived season evidence can still reach `seasonNewsReactions()` and potentially affect Waiver/Trade despite the UI reporting partial health.

Required repair:

- when `player_state_status !== PASS`, block every player-state-derived ingestion path
- specifically do not persist/append `seasonEvidence.events` or `seasonEvidence.roleGraphs` from the unhealthy lane
- preserve healthy market ingestion
- preserve v1 compatibility
- add regressions proving market PASS + player-state FAIL cannot ingest/persist player-state season events/role graphs, while player-state PASS still can

The current PR body is intentionally marked `FAIL_CLOSED_PENDING_P1_REPAIR`.

## 5. CODEX REPAIR TASK — OUTSTANDING, NOT YET PUBLISHED

A targeted GitHub/Codex repair request was posted on PR #162 at `2026-09-13T08:59:49Z` for exactly the two P1 defects above, with instructions to preserve all previously green rc4.199 invariants and to produce a transport branch/commit if Codex cannot update #162 directly.

At this handoff:

- PR #162 head is still `aac987501d...`
- no newer repair commit is part of #162
- no newer published Codex repair branch/transport was visible in the repository branch inventory checked during handoff
- therefore the P1 repair must be treated as OUTSTANDING, not assumed complete merely because the Codex task was requested

Next chat must first check whether Codex has since published a repair result before creating any duplicate implementation.

## 6. PITTI WATCHER AUTHORITY — PR #6

Fresh live state:

- Watcher repository canonical main HEAD: `90473a6e7b5a79097a8a0816329113a8c492698b`
- Watcher main tree: `f7f513421f04c250eeab9a89830c57c9001fc1bb`
- PR `#6`: OPEN, non-draft, mergeable
- branch: `pitti-auto/v0.2.7-lane-isolation`
- exact head: `77221ceeb900458e95c32d78c1ad395a37422e5d`
- exact-head `pitti-watcher tests`: SUCCESS

PR #6 server-side design remains valid and should not be rewritten merely because the Draft Companion consumer still has a bypass:

- market and player-state health are independent
- overall PASS if either lane is independently healthy
- server filters event rows by lane health
- all-unhealthy remains fail-closed
- free-agency radar requires live league state and excludes owned players
- no D1 migration, cron change, automatic transaction or production deployment in PR #6

Important cross-repo point: the remaining P1-B is primarily a Draft Companion client-consumer defect in `seasonEvidence` handling. Do not weaken Watcher PR #6 to compensate for it.

## 7. WAIVER / TRADE PRODUCT PRIORITY — PRESERVE

The user priority is a usable app for fast, successful season reactions, with:

1. Waiver / Free Agency first
2. Trades second
3. Start/Sit / matchup / weather later
4. Draft archive lowest priority

The Waiver and Trade engines already exist. Do not redesign them from scratch while the evidence/data-plane blockers remain.

Preserve:

- Waiver Board v3 uses actual free Sleeper players, current PITTI roster, verified Weekly Evidence, all 9 opponent rosters and remaining FAAB; missing required evidence must result in WATCH/HOLD rather than fabricated action/bid.
- Trade Board v8 uses live Sleeper rosters, legal starter/FLEX geometry and current valuation evidence; it requires bilateral verified lineup gain, legal roster capacity and plausible fairness; no auto-send.
- Current trade actionability fails closed when required pre/post lineup projection evidence is unverified.

This is why reliable partial Weekly Evidence and correct Watcher lane isolation are P0 prerequisites for useful Waiver/Trade recommendations.

## 8. NON-REGRESSION INVARIANTS

Preserve all of these:

- Sleeper live league state is roster/ownership/starter/reserve/FAAB authority.
- League: 10-team Half-PPR, 1QB.
- Starter geometry: QB, RB, WR, WR, TE, FLEX(RB/WR/TE), W/R(RB/WR), K, DST; bench 6 + one Reserve/IR.
- IR/Reserve is never an ordinary drop target.
- Kicker comparisons are K-vs-K only.
- Two TE can legally start because FLEX accepts TE.
- Draft-only QB2 exclusion is not a universal in-season roster cap.
- Geno Smith/Aaron Rodgers were draft exclusions; do not project them into unrelated season policy.
- No automatic Sleeper Add/Drop, FAAB bid or trade.
- Do not use Sleeper projections/matchup ratings as PITTI decision evidence.
- Rank/projection lanes are independent; missing rank must never erase valid projection evidence.
- Never subtract positional rank across positions.
- Broad ECR is not a fabricated selected PITTI expert panel.
- Missing game/opponent/weather/lock/team-total data remains unavailable unless verified.
- Do not clear cache/app data or reinstall to force a pass.
- Preserve research, return-validation, active decision and current season/weekly evidence ahead of rebuildable rank caches.
- Production/device evidence is separate from source/package/preview evidence.
- Every productive runtime-byte patch should have a unique runtime/build identity; do not repeat same-version ambiguity.

## 9. HANDOFF PR #163 — DISCOVERY ANCHOR

This v247 bridge is stored on the existing docs-only handoff branch / PR so the next chat can discover it without relying on this conversation:

- Draft Companion PR `#163`
- branch `pitti/handoff-v246-20260912`
- PR remains docs-only and draft
- v246 files remain historical in the branch
- v247 files are the current takeover files
- do not merge PR #163 as a substitute for live authority verification

The PR title/body should identify v247 after this file is added.

## 10. NEXT-CHAT TAKEOVER SEQUENCE — DO THIS IN ORDER

1. Read `docs/PITTI_BRIDGE_HANDOFF_V247_2026-09-13.md` and `docs/PITTI_CODEX_HANDOFF_AUDIT_V247_2026-09-13.md` fully.
2. Fresh READ-ONLY verify Draft Companion `main`; expected-at-handoff `c9f7eb1a...`.
3. Fresh verify PR #162 state/base/head/checks and read all comments/reviews newer than `2026-09-13T08:59:49Z`.
4. Determine whether Codex published the two-P1 repair. Do not duplicate work if a transport commit/branch/PR now exists.
5. Fresh verify Watcher `main` and PR #6.
6. Fresh verify this handoff PR #163 and the Codex v247 handoff-audit result.
7. If a Codex repair exists, audit its exact diff against the two P1 requirements and preserved rc4.199 invariants, then integrate only into the existing PR #162 feature branch unless a transport PR is technically required.
8. Re-run exact-head GitHub gates on the new #162 head. Never rely on green gates from `aac987...` after the head changes.
9. Request one final exact-head Codex P0/P1 review after both P1 repairs are present. No unresolved P0/P1 may remain.
10. Only after exact-head CI + final Codex review are clean may the merge decision be considered. Merge/promotion remains separately authorization-gated.
11. After any source merge, dynamically resolve the new main SHA; do not predict it.
12. Verify Cloudflare Production source SHA and served build identity separately before any physical canary.
13. Perform at most one bounded physical canary after exact production identity is proven. No repetitive cache-clear/reinstall loop.
14. Only after the P0 restore settles, reconcile the coupled canonical checkpoint/current/seal/bootstrap files once, together, against actual source/production/device authority.

## 11. WHAT NOT TO DO ON TAKEOVER

- Do not start from rc4.196/v243 handoff authority.
- Do not restore the old v245 checkpoint as current when it conflicts with this bridge/live GitHub.
- Do not treat the first Codex five-P1 repair as final; the later exact-head review found the two additional P1 defects above.
- Do not treat the Codex repair request itself as evidence that the repair was published.
- Do not merge current `aac987...` while the two P1 findings remain.
- Do not create a duplicate Watcher repair for the Draft Companion `seasonEvidence` bypass.
- Do not run a new device test before source exact-head + production identity gates are complete.
- Do not clear app storage or reinstall.

## 12. CURRENT HANDOFF VERDICT

`V247_HANDOFF_READY_WITH_ACTIVE_FAIL_CLOSED_P1_GATE`

Current engineering state at the handoff moment:

- source main stable at `c9f7eb1a...`
- rc4.199 candidate exists on PR #162 head `aac987...`
- its current exact-head CI is green
- exact-head Codex review found two concrete P1 blockers still present
- targeted Codex repair was requested but is not yet published into live GitHub authority
- Watcher PR #6 remains green/mergeable and should be preserved
- no merge to main, production promotion, physical acceptance, cache clearing/reinstall or Sleeper transaction has occurred from this handoff work
