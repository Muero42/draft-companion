# PITTI / Draft Companion — rc4.197 Start/Sit projection-lane independence

Authority preparation timestamp: 2026-09-12 CEST
Repository: `Muero42/draft-companion`
Prepared branch: `pitti/rc4197-startsit-projection-lane-independence`
Prepared from main: `c6df4b05b04bc200b5ccd0a827c88f667908e869`

## 0. Fail closed / live authority first

Before editing, fetch and independently verify current live Git/GitHub authority. If `main` has moved, rebase/recreate this work branch from the verified canonical main rather than restoring the prepared SHA as authority.

Read completely before editing:
- `AGENTS.md`
- `PITTI_CURRENT_STATE.json`
- `PITTI_EXECUTION_LOCK.json`
- `PITTI_HANDOFF_SEAL.json`
- `docs/PITTI_BRIDGE_HANDOFF_RC4196_PHYSICAL_PARTIAL_2026-09-11.md`
- `lineup-start-sit-v2.js`
- `weekly-evidence-v2.js`
- `game-context-v1.js`
- `tools/season-lineup-evidence-status-regression.mjs`
- `tools/season-lineup-start-sit-v2-regression.mjs`
- `tools/season-startsit-weekly-context-regression.mjs`
- `tools/runtime-files.mjs`
- `tools/package-reextract.mjs`
- `.github/workflows/release-contract-v2-package.yml`

Current physical authority remains:
- rc4.196 production deployment: verified for the previously recorded exact source/deployment identity.
- physical verdict: `RC4.196_PHYSICAL_PARTIAL_PASS_NOT_ACCEPTED`.
- rc4.195: prior fully accepted rollback/historical reference only.
- package identity for rc4.196 remains historical evidence; do not rewrite it as rc4.197 identity before an rc4.197 package is independently generated and hashed.

No production deployment, cache clear/reinstall, or Sleeper transaction is authorized by this package.

## 1. Reproduced root cause — Start/Sit lane coupling

Independent source review reproduced the physical symptom.

### 1.1 App consumption defect

`app.js` `seasonWeeklyEvidenceValueMap()` currently requires both weekly rank and projected points to be finite before a player is emitted into the optimizer value map. It also allows a seasonal positional-rank fallback when weekly rank is unavailable.

This is incorrect for the physical state where current-week projections are verified but current-week rank is unavailable:
- verified projection evidence disappears from optimizer consumption,
- the UI then reports incomplete Rank+Projection evidence for otherwise projection-usable players,
- a seasonal positional rank may substitute for an unavailable weekly rank even though the current-week rank lane is supposed to fail closed.

### 1.2 Optimizer defect

`lineup-start-sit-v2.js` `playerEvidence()` currently returns `AVAILABLE` only when BOTH rank and projected points are present and source status is `VERIFIED`. `optimizeLineup()` then filters to that status.

This independently recreates the same coupling even if the app starts passing projection-only values.

### 1.3 Existing regression encodes the bug

`tools/season-lineup-evidence-status-regression.mjs` currently asserts the coupled Rank+Projection requirement. That assertion must be replaced by the intended independent-lane contract.

## 2. Binding rc4.197 behavior

### 2.1 Projection lane is independently usable

For Start/Sit lineup optimization:
- a current-week Half-PPR `projected_points` metric with `status === VERIFIED` is sufficient quantitative evidence for optimizer scoring;
- weekly rank is OPTIONAL supplemental evidence;
- if rank is unavailable, `rank` must remain `null`/unavailable rather than being fabricated or replaced by an unrelated seasonal positional rank;
- rank-unavailable must remain visible per metric/player without suppressing verified projection points.

Do NOT turn rank unavailability into a full-player unavailability when a verified projection exists.

### 2.2 Never compare positional rank across positions

Cross-position decisions for FLEX / W-R must be driven by the common Half-PPR projection scale. A QB/RB/WR/TE positional rank is not a cross-position scoring unit and must never be subtracted/compared across positions.

Rank may be displayed or used only in a position-safe supplemental context.

### 2.3 Legal geometry remains unchanged

Preserve:
- QB
- RB
- WR
- WR
- TE
- FLEX = RB/WR/TE
- W/R = WR/RB
- K
- DST
- two TE are legal via TE + FLEX
- Reserve/IR/TAXI never enter ordinary lineup optimization
- K and DST remain isolated to their legal slots
- no duplicate player assignment
- lock/game-state legality remains fail closed

### 2.4 Incomplete evidence becomes scoped, not blanket

The summary must distinguish:
- projection missing/unverified => player is quantitatively unavailable for projection-driven optimization;
- rank missing/unverified but projection verified => player remains projection-usable, rank shown unavailable;
- game/lock context missing => game-context/lock lane remains unavailable; do not invent kickoff/opponent/weather.

Do not state that a player lacks “complete Rank+Projection” in a way that suppresses a verified projection from lineup optimization.

## 3. Required implementation shape

### app.js

Refactor `seasonWeeklyEvidenceValueMap()` so that:
- it emits a player when `projected_points.status === VERIFIED` and the numeric projection is finite;
- weekly rank is taken only from the VERIFIED weekly-rank metric when numeric;
- remove seasonal positional-rank substitution from the Start/Sit optimizer value map;
- carry explicit lane metadata such as projection availability/source and rank availability/source so UI/optimizer can preserve metric-level status;
- do not change Waiver/Trade rank semantics accidentally.

### lineup-start-sit-v2.js

Refactor `playerEvidence()` / optimizer eligibility so that:
- VERIFIED finite projection => optimizer-eligible even with `rank === null`;
- missing/unverified projection => not optimizer-eligible;
- optional rank remains nullable;
- scoring remains projection-driven;
- do not introduce a cross-position rank edge.

## 4. Required executable regressions

Update/add executable tests proving at minimum:

1. Projection-only current-week evidence (`projected_points VERIFIED`, weekly rank unavailable) is retained and used by Start/Sit.
2. The same player exposes rank as unavailable/null; no seasonal positional-rank substitution.
3. Missing projection remains fail closed even if rank exists.
4. Projection-only evidence can produce a complete legal lineup when enough projection-verified players exist.
5. Two TE remain legal when the second TE wins FLEX on projection.
6. FLEX/W-R cross-position choice follows projected Half-PPR points, not positional-rank magnitude.
7. Reserve/IR/TAXI excluded.
8. K/DST isolation preserved.
9. No duplicate assignment.
10. Lock/game-state exclusions preserved.
11. Existing Waiver/Trade/Watcher/K-DST behavior and regression suites remain green.

Delete/replace any old static assertion whose only purpose is to require rank+projection coupling.

## 5. Rank lane: diagnose, do not weaken without evidence

Independent source review found a plausible separate blocker in `weekly-evidence-v2.js`: weekly-rank availability requires current source freshness from recognized publication metadata (`updated`, `last_updated`, `updated_at`, `as_of`, or `date`). A payload can contain broad numeric weekly ranks yet remain unavailable when no trustworthy publication timestamp/date is present.

For rc4.197:
- reproduce/diagnose against real current payload evidence if available;
- preserve fail-closed freshness if source freshness cannot be independently established;
- do NOT infer “fresh” merely from fetch time;
- do NOT fabricate PITTI-panel weekly ranks;
- do NOT let rank-lane repair block the projection-lane independence repair.

If a robust parser defect is independently proven, repair it with positive + negative fixtures. Otherwise leave the rank lane unavailable and document the evidence gap.

## 6. Game context: diagnose separately, no unsafe relaxation

`game-context-v1.js` is a separate lane. Current physical canary had opponent/kickoff/lock context unavailable.

Investigate actual endpoint/payload behavior if reproducible. Preserve fail-closed rules:
- no invented opponent/kickoff,
- no stale event-bound weather,
- no Vegas line without fresh event-bound evidence,
- duplicate/ambiguous team mapping rejected.

Do not weaken game-context validation merely to make the UI green. A separate follow-up is acceptable if current external payload evidence is unavailable.

## 7. Version/release requirements

This is a runtime behavior change, so if implementation proceeds:
- bump coherently from `v11.8.0-rc4.196` to `v11.8.0-rc4.197` across all required runtime/version/cache surfaces (`app.js`, `index.html`, `manifest.webmanifest`, `sw.js`, and any enforced version references);
- preserve the canonical 17-file runtime manifest;
- candidate packaging MUST contain all 17 runtime files including `lineup-start-sit-v2.js` and `game-context-v1.js`;
- do not deploy production as part of this package.

## 8. Verification gates

Run at minimum:
- `node tools/strict-suite.mjs`
- `node tools/pitti_guardrail_check.mjs` in the appropriate candidate-preflight mode where version lock intentionally differs
- `node tools/season-lineup-evidence-status-regression.mjs`
- `node tools/season-lineup-start-sit-v2-regression.mjs`
- `node tools/season-startsit-weekly-context-regression.mjs`
- `node tools/season-package-manifest-regression.mjs`
- `node tools/package-reextract.mjs /tmp/pitti-rc4197-reextract`
- `git diff --check`
- explicit runtime package count = 17
- explicit package/re-extraction byte parity
- explicit version/cache parity

Then publish only to a Draft PR for independent review. Exact-head GitHub CI must be green before merge.

## 9. Hard prohibitions

- no production deploy
- no Cloudflare retry/promotion
- no cache clear/reinstall
- no Sleeper transaction
- no fabricated rank, game, Vegas, weather, or acceptance evidence
- no rollback to stale v242 deployment/device claims
- no reduction/removal of the v243 authority negative-regression matrix
- no resurrection of a 15-file candidate package

## 10. Final report

Report:
- verified live starting main SHA
- exact files changed
- exact projection-only reproduction and repaired behavior
- whether weekly-rank lane was repaired or remained fail-closed, with evidence
- whether game-context lane was repaired or remained fail-closed, with evidence
- all regression/gate results
- candidate 17-file package digest/count
- final branch/commit SHA
- Draft PR number
- explicit statement that no deployment/device/Sleeper action occurred
