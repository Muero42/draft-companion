# rc4.198 Weekly Evidence + Game Context repair — 2026-09-12

## Live starting authority
- Repository: `Muero42/draft-companion`.
- Canonical main after v244 reconciliation: `62d7ecf11774700551b6e5a0497ec054e327a0d7`.
- Current source/runtime candidate: `v11.8.0-rc4.197`, merged on main, **not deployed and not physically observed/accepted**.
- Production/device authority remains `v11.8.0-rc4.196` at deployed commit `082d77003f6616e290146698641aebe63f37b8c2`, deployment `da039536-7733-4b07-8f0c-70cc6e0bc8b7`, physical verdict `RC4.196_PHYSICAL_PARTIAL_PASS_NOT_ACCEPTED`.
- Prior fully accepted rollback remains `v11.8.0-rc4.195`.
- v244 source/package/deployment/device separation is binding. Reverify live authority before editing.

## Why this package exists
rc4.197 repaired Start/Sit projection-lane independence: a valid Half-PPR projection must remain optimizer-usable even when weekly rank is unavailable. It deliberately did **not** repair the remaining upstream evidence defects. This package must not undo rc4.197.

Three remaining lanes are distinct:
1. projection publication/consumer chronology consistency;
2. FantasyPros current-week broad-ECR production parsing/freshness;
3. NFL game/opponent/kickoff/lock context diagnosis and evidence-backed repair.

Do not couple these lanes together. A rank or game-context failure must never suppress a verified projection. A projection failure may make Start/Sit incomplete but must never fabricate fallback points/ranks/context.

## A. Projection publication must equal consumer usability
### Reproduced source defect
`weekly-evidence-v2.js::projectionLane()` can declare all positions `AVAILABLE` from valid current-week FantasyPros payloads even when `sourceTime(payload)` returns `sourceTimePrecision:'UNKNOWN'`.

The records are then published as `status:'VERIFIED'`, but `app.js::seasonEvidenceValue()` rejects them because its chronology contract accepts only a source timestamp/date. This permits a top-level `Weekly Projections ... AVAILABLE` state while every player card says Half-PPR unavailable.

### Required repair
- Publication and `seasonEvidenceValue()` usability MUST share one explicit chronology contract.
- Do not fabricate a FantasyPros publication timestamp when the provider did not supply one.
- A live successful current-week projection retrieval MAY use a dedicated retrieval-verification semantic, but only for `projected_points` from the validated FantasyPros current-week projection endpoint.
- If used, encode it explicitly (for example `sourceTimePrecision:'RETRIEVAL'` / equivalent), keep `sourcePublishedAt/sourcePublishedDate` null, and retain the real `verifiedAt` retrieval time.
- `seasonEvidenceValue()` may accept this retrieval chronology only when all existing context/source checks pass: exact season/week/HALF_PPR, trusted HTTPS/source id, finite projection, confidence threshold, non-future verifiedAt, bounded expiry, and current snapshot freshness. Do not generalize this exception to ranks/trade values/other evidence.
- Preserve the 3-hour snapshot refresh policy and 24-hour record expiry.
- A projection lane may be `AVAILABLE` only if the same published mapped records are consumer-usable through the exact `seasonEvidenceValue()` path.
- Add a production-shaped projection fixture with no top-level source timestamp and prove mapped PITTI players remain usable without manufacturing source publication time.
- Add negatives for future retrieval time, wrong week/scoring/season, expired retrieval evidence, unknown/untrusted source and mapping conflict.

## B. Weekly broad-ECR production parser/freshness
### Reproduced source defect
The current parser is still shaped around synthetic/projection aliases:
- source id: `fpid`
- position: `position_id`
- team: `team_id`

The real consensus-ranking geometry previously observed uses canonical aliases including:
- `player_id`
- `player_name`
- `player_team_id`
- `player_position_id`
- `rank_ecr`
- `last_updated`

Current `weeklyRankLane()` also derives freshness from top-level payload time only, so row-level `last_updated` evidence can be ignored and the entire lane becomes `STALE_SOURCE`/`UNAVAILABLE`.

### Required repair
- Extend mapping aliases narrowly:
  - source id: `fpid ?? player_id`
  - name: `name ?? player_name`
  - position: `position_id ?? player_position_id ?? position`
  - team: `team_id ?? player_team_id ?? team`
- Preserve collision, exact position and team-mismatch safeguards. Do not loosen mapping merely to raise coverage.
- Rank value remains current-week **positional broad ECR**, not an across-position score and not the selected PITTI expert panel.
- Parse actual `last_updated` evidence at the row/payload level without inventing precision.
- If source metadata is month/day without a year, infer the requested NFL season year only under an explicit bounded rule tied to `verifiedAt`; preserve DATE-level precision rather than manufacturing an exact time.
- Rank freshness must be evaluated for the rows actually published. Stale/ambiguous rows do not become verified merely because retrieval was recent.
- Position diagnostics must expose bounded reasons and counts: source rows, ranked rows, fresh rows, mapped rows, mapping coverage, stale/ambiguous time count, and primary rejection reason.
- Add production-shaped QB/RB/WR/TE consensus fixtures using the real aliases and realistic `last_updated` geometry.
- Preserve `BROAD_CONSENSUS_ONLY` labeling; selected PITTI panel remains separately unavailable unless separately implemented with verified individual expert evidence.
- Add negatives for wrong week/scoring/position, stale/ambiguous rank time, collisions, team mismatch, insufficient coverage and mixed stale/fresh rows.

## C. Game context: diagnose exact production response before parser relaxation
### Current implementation boundary
`_worker.js` proxies `/api/nfl-week-context?season=...&week=...` to ESPN scoreboard and returns `{season,week,sourceUrl,events}`.

`game-context-v1.js` currently requires every returned event to have:
- unique home/away abbreviations;
- finite kickoff;
- non-empty venue;
- no duplicate team across accepted events.

It then publishes the week only when `games.length === events.length`; otherwise the public snapshot is `PARTIAL` or `UNAVAILABLE` and no games are exposed. Optional weather/roof does not itself reject a schedule event.

### Mandatory diagnostic first
Before changing game parser semantics, obtain the exact current response or equivalent production capture for the app route and record:
- HTTP status;
- season/week;
- event count;
- representative raw event geometry;
- for every rejected event: bounded rejection reason and fields actually missing/ambiguous;
- accepted game/team counts;
- any abbreviation mismatch relevant to current Sleeper teams.

Preferred source is the exact app `/api/nfl-week-context` route. If the execution environment cannot access it, do **not** guess parser changes. In that case implement only bounded non-sensitive diagnostic output/storage sufficient for the next physical/public canary, while completing lanes A/B independently.

### Repair only when production evidence supports it
- Complete verified schedule evidence must publish opponent, home/away, kickoff, venue and lock context.
- Missing optional weather or unknown roof may not invalidate otherwise complete schedule evidence.
- If venue is absent in the real upstream geometry but another verified venue field is present, support the exact observed alias only.
- If ESPN/Sleeper team abbreviations differ, add an explicit finite alias map backed by the captured mismatch; do not fuzzy-match team identities.
- Duplicate team/event, missing opponent, missing kickoff, ambiguous identities and partial-week schedule remain fail-closed.
- Weather stays unavailable unless fresh event-bound outdoor forecast evidence exists.
- Vegas/team totals stay unavailable unless a separately approved robust verified source exists.
- Store/show bounded game-context failure diagnostics instead of silently discarding an invalid snapshot after refresh.
- Add a production-shaped ESPN fixture only from captured/verified response geometry, plus negatives for incomplete/duplicate/ambiguous events.

## D. Start/Sit invariants that must not regress
Preserve rc4.197 behavior and tests:
- verified finite Half-PPR projection alone makes a skill player optimizer-eligible;
- weekly rank may remain `null`/`UNAVAILABLE` without suppressing projection;
- no seasonal/draft positional-rank substitution;
- cross-position FLEX/W-R decisions use comparable Half-PPR projections, never unlike positional ranks;
- actual legal Sleeper slots and global assignment optimization;
- two TE allowed when a legal FLEX permits it;
- Reserve/IR/TAXI excluded;
- K/DST isolated;
- no duplicate player assignments;
- locked assignments only from verified kickoff/game context;
- unavailable opponent/weather/Vegas stay visibly unavailable, never fabricated.

## E. Version/package discipline
If runtime/product behavior changes, bump coherently from `v11.8.0-rc4.197` to `v11.8.0-rc4.198` across app/index/manifest/service-worker cache and every version surface required by current release guards.

Canonical runtime package remains exactly **17 files**. Do not remove `lineup-start-sit-v2.js` or `game-context-v1.js`. Source/package state after this PR is still NOT deployed until a separate production promotion is explicitly authorized and verified.

## Required executable tests
At minimum extend/add tests proving:
- timestamp-less production-shaped projection payload -> lane AVAILABLE only when exact consumer path returns VERIFIED projections;
- retrieval chronology cannot leak to non-projection metrics;
- real FantasyPros consensus aliases map correctly across QB/RB/WR/TE;
- row-level rank freshness is enforced honestly;
- rank failure preserves projections;
- projection failure never falls back to ranks;
- projection-only legal lineup still completes;
- cross-position projection ordering beats incomparable rank magnitude;
- two-TE legality;
- Reserve/IR/TAXI exclusion;
- K/DST isolation;
- duplicate prevention;
- game-context captured production fixture if available;
- game-context incomplete/duplicate/ambiguous negatives;
- current Waiver/Trade/K/DST/Watcher/Reserve regressions remain green.

Run full:
- `node tools/strict-suite.mjs`
- weekly evidence regressions
- Start/Sit evidence/status and weekly-context regressions
- package-manifest regression
- `PITTI_CANDIDATE_PREFLIGHT=1 PITTI_SKIP_SEAL_INTEGRITY=0 node tools/pitti_guardrail_check.mjs`
- `node tools/package-reextract.mjs <fresh-temp-dir>`
- `git diff --check`
- mobile Chromium review at 390x844 when browser is available
- explicit canonical 17-runtime-file unchanged/changed audit and package parity
- coupled checkpoint/seal regeneration if sealed files change

## Promotion discipline
- Work only on the dedicated feature branch / Draft PR.
- Do not merge until independent review and exact-head CI are green.
- Do not deploy production from Codex.
- Do not clear cache/app data or reinstall.
- Do not execute Sleeper adds/drops/waivers/trades.
- Do not mark rc4.198 physically accepted without a later installed-device canary.
