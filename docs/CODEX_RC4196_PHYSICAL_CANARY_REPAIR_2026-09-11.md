# rc4.196 physical canary repair — 2026-09-11

## Live authority at canary
- Canonical main after PR #145: `082d77003f6616e290146698641aebe63f37b8c2`.
- Production deployment of exact main commit `082d770` succeeded in Cloudflare Pages at 2026-09-11 16:25 CEST.
- Existing installed Android PWA updated in-place; no cache clear or reinstall was used.
- Device visibly reports `v11.8.0-rc4.196`.

## Physical canary result
Classification: **PARTIAL / NOT ACCEPTED** for rc4.196 Start/Sit / Weekly Context scope.

Preserved PASS evidence:
- Sleeper Live-State fresh (`< 1 Min.`).
- Weekly projection fetch/publish lane reports W1 and 728 FantasyPros records.
- Waiver/FA v3 behavior remains fail-closed; skill-position HOLD preserved.
- D/ST streaming board rendered as before.
- Kicker comparisons remain K-only with Harrison Mevis as current kicker.
- Trade Offer Board v8 remains fail-closed with live rosters / Boone-Yahoo values and no fabricated offer.
- Watcher remains PASS/read-only.
- Roster/bench/Reserve-IR separation is correct; Zach Charbonnet remains Reserve/IR.

Canary failures in the new rc4.196 scope:
1. Weekly expert-rank lane is physically unavailable. UI reports `Ranks UNAVAILABLE` / `Expert-Ranks ... fail-closed` and all roster players show W1 rank unavailable.
2. The roster cards also show `Half-PPR nicht verfügbar` for every displayed skill player even though the top-level projection lane reports 728 records. This is a publish/consumer-consistency failure and must be repaired; top-level `AVAILABLE` must mean the decision consumer can actually use the published player projections.
3. Start/Sit v6 cannot produce actionable reassignment because 14 realistic skill-position players lack complete current rank + projection evidence. UI correctly reports `START/SIT TEILWEISE NICHT BEWERTBAR`.
4. Game/opponent/lock context is physically unavailable. Roster cards show opponent/weather unavailable and Start/Sit reports Spiel-/Lock-Kontext unavailable.
5. Team-total context remains unavailable; Vegas remains intentionally fail-closed.

Do not mark rc4.196 physically accepted until per-player projections, weekly ranks and game context pass on the installed device.
Do not roll back solely because of this canary: released rc4.195 Waiver/Trade/weekly-projection fetch behavior remains operational and the rc4.196 additions fail closed rather than fabricating decisions.

## Independently identified Weekly Projection publish/consumer mismatch
Current `projectionLane()` can publish records and declare the projection lane `AVAILABLE` without requiring source-time metadata to be usable by the downstream decision consumer. The downstream `seasonEvidenceValue()` separately requires chronology evidence (`publishedAt`, or recognized timestamp/date-only source metadata) before it returns a record as `VERIFIED`.

The documented FantasyPros projection response shape guarantees season/week/player projections but does not document a top-level `updated` / `last_updated` field. Therefore a production payload can legitimately produce 728 mapped projection records with `sourceTimePrecision: UNKNOWN`; the top status reports projections verified while roster consumers reject every projection as unverifiable chronology. The physical canary is consistent with exactly this contract mismatch.

Required repair:
- make projection-lane publication criteria and downstream consumer freshness criteria identical and explicit;
- never display `Weekly Projections verifiziert` when no roster consumer can use the records;
- if FantasyPros does not provide trustworthy source publication time for projections, use a bounded request/verification timestamp policy only if it is semantically justified and explicitly labeled as retrieval verification rather than fabricated source publication time;
- preserve the 3-hour snapshot refresh policy and 24-hour record expiry without weakening fail-closed chronology;
- add regression coverage in which the production-shaped projection payload has no top-level source timestamp;
- assert that a snapshot declared projection `AVAILABLE` yields usable `projected_points` for mapped PITTI roster players through the exact `seasonEvidenceValue()` path.

## Independently identified Weekly-Rank production defect
The current `weekly-evidence-v2.js` rank parser was regression-tested against synthetic rows using projection-style fields (`fpid`, `name`, `position_id`, `team_id`) and synthetic ISO date metadata.

FantasyPros consensus-rankings production response uses different canonical fields, including:
- `player_id`
- `player_name`
- `player_team_id`
- `player_position_id`
- `rank_ecr`
- `last_updated` (commonly month/day-style source metadata)

Current production code checks row position with `position_id || position`, maps source IDs through `fpid`, and team through `team_id || team`; therefore real consensus-ranking rows can fail position/mapping validation even though the upstream endpoint is valid. Current regression fixtures do not exercise the production response shape.

Required repair:
- accept the real consensus-ranking field aliases without weakening collision/team safeguards;
- preserve position/scoring/week validation;
- normalize source time safely for actual FantasyPros `last_updated` formats using the requested season/current verification context, without fabricating precision;
- add regression fixtures representing the real consensus-rankings response shape;
- expose a bounded fail reason/status per ranking position so a future physical failure is diagnosable instead of collapsing to generic `UNAVAILABLE`.

## Game-context diagnostic / repair requirement
Do not guess the cause from the device screenshot alone.

Before changing parser semantics, capture the exact production `/api/nfl-week-context?season=2026&week=1` response (status, event count, representative event geometry, rejected fields) and run it through `game-context-v1.js`.

Required behavior:
- verified schedule must publish team/opponent, home/away, kickoff, venue and game-lock context;
- a missing optional weather/roof field must not invalidate an otherwise complete schedule event;
- genuinely incomplete or ambiguous schedule data must remain fail-closed;
- include a production-shaped ESPN fixture in regression tests, not only hand-built synthetic events;
- surface bounded game-context failure reason/coverage in UI diagnostics;
- weather stays fail-closed unless fresh event-bound outdoor forecast evidence exists;
- Vegas stays unavailable unless a robust verified source is separately approved.

## Start/Sit v6 acceptance requirements
After the evidence repair, preserve all existing optimizer invariants:
- actual Sleeper starter slots;
- global legal-slot optimization;
- FLEX/W-R/W-T/Superflex eligibility;
- two-TE legality where slots permit;
- Reserve/IR/TAXI exclusion;
- K/DST isolation;
- no duplicate players;
- locked-player preservation after verified kickoff only;
- cross-position decisions use comparable Half-PPR projections/common evidence, never subtract unlike positional ranks.

Physical acceptance requires the installed Android app, without cache clear/reinstall, to show:
- `v11.8.0-rc4.197` (or the explicitly chosen repair version);
- fresh Sleeper Live-State;
- a weekly projection lane whose mapped PITTI roster projections are actually consumable by Start/Sit;
- verified weekly rank lane for the current PITTI roster with honest broad-ECR labeling unless the selected expert panel is separately implemented;
- verified opponent/kickoff/lock context for current roster teams;
- Start/Sit v6 either an evidence-backed legal reassignment or a true evidence-backed HOLD, not a blanket missing-evidence state;
- unchanged Waiver/Trade/K/DST/Reserve/Watcher behavior.

## Required validation
- strict suite
- weekly evidence regression with production-shaped FantasyPros projections that omit source-time metadata
- weekly evidence regression with real FantasyPros consensus-ranking response aliases/date metadata
- integration assertion through the exact `seasonEvidenceValue()` consumer path
- Start/Sit weekly-context regression with production-shaped ESPN scoreboard fixture
- failure-mode negatives for wrong week/scoring/position, stale ranks, collisions, team mismatch, partial schedule, duplicate team/event, stale context
- 390x844 Chromium review
- package/re-extraction and runtime byte checks
- coupled PITTI checkpoint/seal regeneration
- exact-head CI before merge

## Promotion discipline
- No production deployment from Codex.
- No cache clear/reinstall.
- No Sleeper transaction.
- Merge only after independent review and exact-head CI PASS.
- After production promotion, repeat physical Android canary before accepting the repair.
