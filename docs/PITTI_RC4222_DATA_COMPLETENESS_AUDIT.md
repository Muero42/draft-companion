# RC4.222 data completeness work checkpoint

Start: Git-read clean v290 branch `codex/v290-rc4221-postmerge-authority`, HEAD `6fab7a715645300ab03a8e7bffb2258e02927755`, tree `3d29e41ec989e341b1ee6dec19bc7aa4b6f158dd`, parent/canonical main `b4df56bbfdaeb266b7eae33e2ad8ebdc655a75d1`. Fresh fetch confirmed canonical tree `a2274042ea49b817dfb3883e0d58cc77cb450203`; GitHub PR222 confirmed merged. Guardrail PASS.

New user Android observation supersedes the prior absence of rc4.221 device evidence: rc4.221 active, live Sleeper current, Week 4 524 records, QB/RB/WR/TE projections AVAILABLE, Boone 253/253, navigation observed, trade HOLD. This is PARTIAL functional observation, **not full functional acceptance**. Prior responsiveness passes remain historical. Current work explicitly authorizes repair publication, exact-head CI, merge and Production verification; no fantasy transaction or manager communication.

## Proven gaps and source probes

- Weekly acquisition requests only QB/RB/WR/TE; K cannot map because the directory index excludes K. DST is separately fetched after all other work. A mapping coverage below 90% deletes even individually validated rows. Default roster text puts missing rank before available points without naming the distinction.
- Context uses ESPN scoreboard but permanently hardcodes odds unavailable. Current W4 scoreboard has 15 upcoming games with DraftKings totals/spreads; summary has completed-game closing odds. `spread` is signed from HOME perspective (e.g. BUF -7, WSH +4.5), verified against favorite flags/details and competitor identities. Completed games must not be presented as current betting forecasts.
- Scoreboard lacks outdoor forecasts; event summary can contain temperature and precipitation without arbitrary lastUpdated. Summary is bound to event, teams, venue, kickoff. Open-Meteo is a no-key hourly fallback requiring verified stadium coordinates and kickoff-hour validity.
- Sleeper public `/projections/nfl/2026/4?season_type=regular` returned 9422 rows, category `proj`, season/week, canonical player_id, provider Rotowire, numeric `stats.pts_half_ppr`, including K and DEF. Rows need exact context, directory identity, position, numeric bounds and chronology. Fallback must not duplicate or override valid primary player records.
- FantasyPros public weekly rankings embed current ecrData, 2026/W4/date 10/03, player identities, numeric ranks and total_experts. Public broad consensus does not establish configured selected PITTI membership. Local environment has no FantasyPros credential; device-safe export is the live selected-panel diagnostic path.

Research: https://api.fantasypros.com/v2/docs (projection positions QB,RB,WR,TE,DST,K); https://api.fantasypros.com/public/v2/docs; https://open-meteo.com/en/docs; https://docs.sleeper.com/. Public probes retained only in ignored `.pitti-cloud-output/rc4222`; no credentials captured.

## Lane trace

| Datum | Source → adapter/storage → consumer/UI | Failure boundary |
|---|---|---|
| QB/RB/WR/TE/K/DST points | FP weekly / labeled Sleeper fallback → weekly-evidence cache → seasonEvidenceValue, lineup, waiver, trade, roster | Per-record context, identity, numeric/time; missing source row separate from injury |
| Positional rank / Broad ECR | FP consensus API/public current weekly page → weekly rank adapter/cache → roster/waiver | Current week/date/scoring/position/mapping; no draft substitution |
| PITTI panel | Authenticated exact filtered FP request → selected adapter/cache → selected weekly_rank | Requested expert identities/membership; broad never substituted |
| Boone | Worker current Yahoo chart discovery → Boone snapshot/cache → central market adapter/trade | Current edition, all chart positions, exact identity, freshness |
| Opponent/kickoff/venue/roof | ESPN scoreboard → game-context cache → lineup locks/roster/DST | Event/teams/time/venue integrity; independent from optional weather/odds |
| Weather | ESPN summary then Open-Meteo verified venue/hour → game-context cache → roster/DST | DOME explicit; unknown location, expired forecast or past kickoff unavailable per game |
| Total/spread/team total | ESPN current odds → game-context cache → roster/context | Provider, sign and event binding; team total = total/2 - signed team spread/2 |
| Injury | Current Sleeper directory/live feed → player row/news consumer | Display separately; never erase a valid projection solely because of injury |
| Ownership | Direct current Sleeper league/rosters → live season snapshot → every decision | Fresh league/directory, exact roster ownership; IR protected |
| Manager evidence | Current-round completed transactions + exact draft owner/player mapping → trade scorer | Partial current-round scope, no invented preference or probability |
| Trade inputs | Current primary/fallback weekly points + Boone + live ownership → existing bounded cooperative scorer | Legal/evidence/utility/acceptance/credible gates reported independently; thresholds unchanged absent proven model defect |

Performance: preserve yield after four package evaluations, evidence reuse per work unit, revision cancellation and stale context rejection. Optional context acquisition must not wait for successful credentialed projections/ranks. Diagnostic export reads existing snapshots and counters rather than refetching provider bodies.

## Reviewed candidate findings

Current public probes through the actual candidate Worker returned 446 usable labeled Sleeper/Rotowire projections: QB32, RB96, WR156, TE98, K32, DST32. Primary FantasyPros values win per player; fallback only fills a missing valid primary record. Active roster coverage is 13/15. Jadarian Price and Justin Jefferson are OUT and have no numeric public provider projection; Kenyon Sadiq is Questionable and retains his valid 8.78 projection. No zero is fabricated. A fresh live OUT/PUP/IR/Suspended player with no projection no longer invalidates otherwise scored weekly lineup comparisons; unknown/Questionable missing data still does. Structural ownership/roster capacity and sole-QB/TE protections remain intact. A provider-supplied projection is retained even for OUT players.

Public Broad ECR RB/WR/TE are current HALF weekly and AVAILABLE (mapped RB109, WR183, TE119). QB public page is STD, never falsely labeled HALF; supplied HALF query still returns STD, and the apparent half-point QB/overall alternatives return draft week0. Thus QB Broad ECR remains unavailable through the no-key fallback. Selected PITTI is not established by public broad membership; device-local credentialed acquisition remains independently validated by exact expert identity, with one-tap sanitized export for actual requested/missing identities and row failures. No local FantasyPros credential was available to query the Android-only key.

Current context has 16 verified games/32 teams: 4 DOME, 11 upcoming outdoor forecasts from actual summary/Open-Meteo acquisition, and one completed game. Actual final Worker probes took ~1.0s context and ~1.2s weekly-public evidence on this desktop. Forecast location/query/unit/hour/chronology are verified, no mandatory nonexistent lastUpdated. Current odds/total/spread/implied total are available for 15 upcoming games, with provider DraftKings, verified HTTP retrieval and 30-minute expiry capped at kickoff. Completed CLE/PIT weather/odds is GAME_ALREADY_STARTED. Future unknown stadium coordinates remain VENUE_COORDINATES_UNVERIFIED if validated ESPN summary weather is also missing; the source-controlled map covers all current outdoor venues, not a claim of all future venue coverage.

## Real trade replay and counterfactuals

Captured live equivalent inputs at 2026-10-03T12:41:28.768Z: current Sleeper league/ownership/directory, current public Half-PPR projections, current Boone 253/253, exact owner historical mapping. This is a desktop public-fallback replay, not the Android key's private snapshot. Nine opponents, six targets each (54 targets), 6,804 evaluations / 6,384 unique packages / 420 duplicate evaluations. Capacity blocks 2,340; structural blocks 1,477; legal 2,987; incomplete full-roster weekly evidence 758; scored 2,229 (2,083 unique). Final statuses: NO_PITTI_UTILITY850, ACCEPTANCE_UNSUPPORTED1336, REVIEW_ONLY43. Acceptance is the dominant scored suppressor. Unique simultaneous failing gates: SCORE+CREDIBLE726, UTILITY+SCORE+CREDIBLE141, UTILITY+SCORE513, SCORE485, CREDIBLE3, UTILITY+CREDIBLE2, UTILITY170, PASS43. Thresholds unchanged: utility>.5, score>=18, credible required.

A remove only credible: 46 admitted versus43 (+3). B score LOW positive utility with credible but score<18, diagnostic only: 485 unique. C acceptance as ranking after legal/evidence/utility/credible: 528 unique. D additional18 quality-verified omitted targets (two/opponent): 2,268 extra evaluations, 1,869 extra unique, 615 extra unique scored, six extra admitted. Bounded six-target runtime stays unchanged; no speculative combinatorial expansion.

Top suppressed: Lawrence+Jefferson for Gibbs+Allen, utility16.5475, acceptance5 VERY LOW, crediblefalse, market71vs124, ACCEPTANCE_UNSUPPORTED. Sadiq+Jefferson for Gibbs+Bowers, utility16.265, acceptance5, crediblefalse, market67vs140; Likely+Jefferson for Gibbs+Bowers, utility16.1375, acceptance5, crediblefalse, market66vs140. These current market mismatches do not justify relaxing gates or inventing manager willingness.

Measured actual bounded scorer replay: 24,461ms total desktop CPU/drain time, 1,728 yield boundaries, maximum measured unit51.44ms, at most four evaluations between boundaries. Actual UI awaits the existing cooperative yield and cancels by revision/evidence expiry. Per-work-unit record indexing and lineup memo eliminate repeated array rescans and lineup adaptation, reset each unit; no across-revision evidence cache. Network context flights coalesce and old-week responses never persist. One-tap export reads existing snapshots/counters and excludes keys, headers, tokens and raw bodies; stale funnel IDs/live generations/times are explicitly marked stale.

## Adversarial review / test changes

Positive and negative actual Worker/adapter/UI export cases cover K/DST, per-player missing/mismatch/nonnumeric/oversized/stale/future records, injury separation, public current broad and selected rejection, scoreboard-first weather without extra requests, summary/no-lastUpdated, Open-Meteo response coordinates/query/hour/units, DOME, team/event mismatch, missing/stale odds, sign math, independent game failures, coalesced refresh and stale-week cancellation, stale diagnostic funnel and secrets exclusion. Existing rc4219 cancellation, rc4220 market/acceptance/structural guards and rc4221 WR/search quality tests remain passing.

Changed historical assertions are limited to proven obsolete behavior: partial mapping now retains validated current rows and purges omitted/prior invalid rows; four skill positions are not full six-position coverage; wording must identify labeled provider projections rather than forbid Sleeper globally. VM fixtures now import the actual live-authority function and include fresh directory timing, six-position constants, actual context acquisition and provider chronology. No score/credible/expert identity assertion removed. Runtime identity tests bind all17 candidate blob hashes; ten untouched runtime files also equal canonical221. Historical Production receipt266/266 does not certify222. Full final Strict Suite has not yet run at this checkpoint.

## Local validation receipt

33/33 focused reviewed checks PASS. The complete local Strict Suite was executed exactly once: 266/268. Its two failures proved obsolete test setup only: adversarial UI expected old combined W2 rank/points wording, and rollover VM omitted the independent context helper/six projection positions. Both tests were corrected to assert separate points/rank and all six requests, then PASS (21/21 adversarial cases plus full rollover stale/capacity/isolation checks). Runtime blobs did not change after the complete local run. No local full-suite rerun; final corrected tree must receive complete exact-head cloud CI before merge. No claim of local268/268.
