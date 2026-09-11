# PITTI Codex Work Package — rc4.195 accepted → Start/Sit / Weekly Context

Date prepared: 2026-09-11
Repository: `Muero42/draft-companion`
Prepared branch: `pitti/rc4195-accepted-startsit-weekly-v1`
Base at preparation: `8aedc4ea3b7b71591cbc45f971ccf85fe5167074`
Mode: `POST_DRAFT_SEASON_COMPANION`

## 0. Reconcile live authority first

Before editing, read `AGENTS.md`, `PITTI_CURRENT_STATE.json`, `PITTI_EXECUTION_LOCK.json`, `PITTI_COMMAND_CONTRACTS.json`, `NEW_CHAT_HANDOFF_CURRENT.md`, `PITTI_HANDOFF_SEAL.json`, `config/season-expert-phase-policy.json`, and `research/IN_SEASON_EXPERT_PHASE_PLAN_2026-09-02.md` completely.

Fetch and verify canonical Git/GitHub authority. If `main` advanced after the preparation SHA, reconcile the newer state rather than restoring this SHA as current authority.

## 1. Binding physical acceptance that must be checkpointed before runtime edits

The user performed the production/device canary on 2026-09-11 after Cloudflare production successfully deployed exact main commit `8aedc4e...`.

Physical Android evidence, without cache clearing or reinstall:

- installed/runtime badge: `v11.8.0-rc4.195`
- Sleeper Live-State: `< 1 Min.` and live roster refreshed successfully
- Weekly Evidence: fresh green PASS, 728 verified players observed after refresh; rc4.193 missing-module/quota-safe persistence behavior remains intact
- Watcher: PASS
- live roster: 16 players with Reserve/IR separated; Zach Charbonnet remains Reserve/IR rather than ordinary DROP
- Waiver/FA v3 renders live skill/DST/K lanes; current skill-position result was evidence-gated HOLD, not a fabricated add/drop or FAAB bid
- K lane compares Harrison Mevis only against available kickers
- Trade Offer Board v8 loads live Boone/Yahoo values with `263/264` mapped and returned `TRADE HOLD` because no legal bilateral positive verified package cleared the gate; no fabricated trade
- no Sleeper transaction was executed

Treat this as **physical rc4.195 PASS for the released Waiver/Trade/Weekly-Evidence scope**. Update the coupled canonical checkpoint/seal promptly before product work. Production deployment and physical acceptance are no longer UNKNOWN for rc4.195 after this evidence, but preserve the distinction between deployed byte identity and observed functional device evidence. Do not rewrite historical v239/v240 facts; append/reconcile a new current generation.

## 2. Binding product priority

Waiver/FA and Trades are now materially implemented and physically accepted. Do not reopen them except to prevent a regression caused by the work below.

Next order:

1. Weekly Expert-Ranks / Start-Sit usability
2. canonical game/opponent context
3. matchup / Vegas / weather lanes
4. only then broader role/injury/news or K/DST enhancements unless directly required by Start/Sit correctness

## 3. Current reproduced Start/Sit gaps

Current `weekly-evidence-v2.js` publishes verified `projected_points` only. Its lanes explicitly keep `expertWeeklyRanks`, `vegas`, `weather` and `roleGraphs` unavailable.

Current `weeklyLineupEvidence()` requires both `weekly_rank` and `projected_points` for `freshEnough`; therefore physical rc4.195 can show fresh projections while Start/Sit remains `NICHT VOLLSTÄNDIG BEWERTBAR` because no real runtime `weekly_rank` producer exists.

Current Start/Sit v5 uses pairwise bench-vs-starter comparisons. Preserve legal Sleeper slot geometry, but audit whether a global lineup assignment is required to catch multi-slot reassignments involving FLEX / W/R / W/T. Do not assume a single direct swap is always sufficient.

Important cross-position invariant: **position rank numbers are not directly comparable across positions**. RB10 minus WR15 is not a meaningful FLEX edge. For cross-position FLEX decisions use comparable projected points and/or a verified common FLEX ranking. Positional weekly rank can support same-position confidence but must not be subtracted across unlike positions as if it were a common scale.

## 4. Workstream A — Weekly Expert Evidence v1

Goal: populate real, current, provenance-preserving weekly ranks automatically for QB/RB/WR/TE while preserving projection availability independently.

### Preferred source path

The existing user-authorized FantasyPros API key/proxy already powers the verified weekly projection lane. Current FantasyPros API documentation exposes:

- `/nfl/{season}/consensus-rankings`
- weekly `week` parameter
- `scoring=HALF`
- position filters
- expert filters / per-expert rankings endpoints

Use the official API path where it can be validated robustly. Probe exact response schemas and expert availability rather than guessing endpoint parameters.

Current public evidence also confirms Justin Boone publishes current Week-1 Half-PPR rankings on Yahoo and updates them through the week. A bounded server-side Yahoo parser, modeled after the already accepted Boone trade-value ingestion, may be used only if it materially improves the selected panel and is provenance/freshness safe. Do not browser-scrape cross-origin pages.

### Panel policy

Honor `config/season-expert-phase-policy.json` and the in-season phase plan. For EARLY (Weeks 1–3), preferred skill-position core remains:

- QB: Justin Boone, Dalton Del Don, Sean Koerner, Pat Fitzmaurice
- RB: Justin Boone, Dalton Del Don, Kev Wheeler, Ryan Weisse, Sean Koerner, Pat Fitzmaurice
- WR: Justin Boone, Dalton Del Don, Sean Koerner, Pat Fitzmaurice
- TE: Dalton Del Don, Justin Boone, Sean Koerner, Pat Fitzmaurice

Do not fabricate unavailable expert votes. Missing/stale experts receive zero current-week weight. Do not silently substitute draft rankings. If individual expert availability is too incomplete, a verified current FantasyPros Half-PPR ECR may be displayed as a broad consensus/stabilizer, clearly labeled, while PITTI's selected panel remains separately unavailable/partial.

### Evidence record requirements

Every accepted weekly rank record must carry at least:

- season, NFL week, scoring=`HALF_PPR`
- player Sleeper id + deterministic mapping provenance
- position and metric (`weekly_rank`; optional common `weekly_flex_rank` when genuinely sourced)
- selected expert/source identity and source URL/API path
- source update/publication time when exposed
- PITTI verifiedAt / expiresAt
- panel membership/coverage and aggregation method
- freshness state and fail-closed reason

Use explicit minimum coverage per position and reject wrong week/scoring/position, stale, malformed, ambiguous or partial snapshots. Projection lane must remain usable when rank lane is unavailable; rank failure must not delete a previously valid projection snapshot.

## 5. Workstream B — Start/Sit v6

Goal: turn the Kader surface into a useful current-week lineup decision engine without using Sleeper projections or stale draft ranks.

### Legal lineup geometry

Use the live Sleeper roster and canonical slots only:

- QB
- RB
- WR
- WR
- TE
- FLEX = RB/WR/TE
- W/R = RB/WR
- K
- DST
- bench + Reserve/IR

Two TE remain legal when FLEX permits. Reserve/IR is not an active lineup candidate. K and DST stay in their own lanes.

### Optimizer requirement

Audit pairwise v5 against a full legal-slot optimizer. Prefer a deterministic maximum-value lineup assignment across all active eligible QB/RB/WR/TE when that is required to find the true best lineup. It must support chain reassignments across WR/RB/FLEX/W-R and must not create duplicate-player or illegal-slot states.

For cross-position FLEX/W-R choices:

- verified projected Half-PPR points are a directly comparable primary numeric signal
- common FLEX rank may be used if actually sourced
- positional ranks are supporting evidence only and must never be numerically compared across different positions

### Decision semantics

Each suggested change should show:

- exact slot
- START / SIT player
- weekly projected points and source/freshness
- weekly rank evidence appropriate to the comparison
- projected lineup delta
- matchup/game context when verified
- injury/role freshness state when available
- confidence and invalidator / recheck condition

Do not call a lineup `HOLD` merely because one irrelevant compatible bench comparison lacks evidence. Scope incompleteness to the affected slot/player. Conversely, do not claim the whole lineup verified if a realistic competing player for a slot lacks required evidence.

Respect game lock. Once a player's game has started, never recommend an impossible move involving that locked player. Upcoming game times must be verified from the game-context lane before lock-sensitive automation is enabled.

## 6. Workstream C — Game / matchup context v1

Build a provenance-preserving current-week game context that can populate the existing `seasonGameContext` / `v190_gameContext` concept or a clean successor.

Required deterministic fields:

- team/opponent
- home/away
- kickoff timestamp + timezone/UTC
- venue
- roof/dome/outdoor classification when verifiable

Use one authoritative schedule source and validate team/week completeness. Do not infer opponent from stale player metadata.

### Weather

Weather is secondary evidence, not a prerequisite for indoor games. For outdoor games only, use a verified forecast tied to venue coordinates and kickoff window. Retain source URL/provider, forecast timestamp, verification time and expiry. If location/forecast mapping is ambiguous, show unavailable. Never manufacture a weather grade.

### Vegas

Add spread / total / implied team total only when a reliable current provider is available and the event/team mapping is deterministic. If no approved robust source exists, leave the Vegas lane unavailable rather than scraping brittle numbers or fabricating implied totals. Derive implied team total only from a verified spread + total pair and retain the exact source/time.

Game/opponent context can ship independently before Vegas if Vegas remains source-blocked.

## 7. Source research already verified for this package

Fresh public evidence on 2026-09-11:

- FantasyPros API documentation explicitly supports NFL consensus rankings with `week`, `scoring=HALF`, position and expert filters; per-expert rankings are documented.
- FantasyPros current Week-1 pages expose current weekly ranks and expert update dates.
- Justin Boone/Yahoo has current 2026 Week-1 Half-PPR rankings, with updates during the week; this is a viable current individual-anchor source if parsed safely server-side.

Do not encode today's player ranks into source code. Build recurring ingestion with provenance.

## 8. Required regressions

At minimum add deterministic tests proving:

1. no draft/ROS rank substitutes for missing weekly rank
2. wrong week / wrong scoring / stale weekly rankings fail closed
3. partial selected-expert coverage is labeled partial, not silently complete
4. FantasyPros-to-Sleeper mapping collision/team mismatch fails closed
5. projection lane survives weekly-rank lane failure
6. legal two-TE FLEX lineup remains possible
7. W/R accepts RB/WR only; FLEX accepts RB/WR/TE
8. global optimizer catches a multi-slot reassignment that pairwise direct swap misses
9. no player occupies two slots
10. cross-position FLEX decision never subtracts unlike positional rank numbers
11. Reserve/IR cannot enter active lineup optimization
12. K/DST are not mixed into skill-position optimizer
13. locked-game player cannot be moved after verified kickoff
14. missing game context does not fabricate opponent/weather/lock state
15. dome game never gets an outdoor-weather penalty
16. stale/conflicting weather fails closed
17. Vegas implied total cannot exist without verified total + spread from the same event/source context
18. rc4.195 Waiver/Trade/Boone/FAAB and Weekly-Evidence quota regressions remain green

## 9. Mobile UX acceptance

Review at 390×844. Kader should answer, without opening a desktop-only detail view:

- Is my current lineup already optimal under verified evidence?
- If not, who starts, who sits, and in which slot?
- What is the projected delta?
- Which rank/projection/context evidence supports it?
- What is unavailable and when should I recheck?

Do not flood every player card with repeated provenance. Use concise player rows plus expandable evidence where appropriate.

## 10. Release discipline

Implement on this branch or an isolated worktree from it. Preserve every rc4.195 physical-pass invariant.

Before any promotion:

- update coupled PITTI checkpoint/seal generation with the physical rc4.195 PASS and the new candidate state
- full strict suite
- all new weekly/start-sit/context regressions
- existing Waiver/Trade/Weekly-Evidence/Boone/quota regressions
- 390×844 Chromium review
- package/re-extraction parity
- exact-head GitHub checks

Do **not** merge or deploy production from this Codex task. Do not clear cache/reinstall. Do not execute Sleeper transactions.

Final report must include exact head, changed files, source coverage by position/expert, current PITTI roster weekly-rank/projection coverage, optimizer result on the live roster under mocked/current evidence as appropriate, game-context coverage, unavailable lanes, tests, mobile result, package digest, and remaining fail-closed conditions.
