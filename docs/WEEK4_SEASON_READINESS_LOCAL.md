# Week 4 local candidate — rc4.212

Classification: WEEK4_SEASON_READY_LOCAL_CANDIDATE. Final full strict suite 244/244 PASS; no Production or physical acceptance claimed.

Canonical parent: 2a157f6458e5940e13629110267dcf6f82823f11; tree: 6f2715534691f4f8953db4882be6869c6efad9e1. The explicitly requested fetch verified both before creating codex/week4-season-readiness-closure. Current task limits remote verification to that fetch; no PR/CI/API takeover or publication was performed. Existing v270 Production/device evidence remains scoped to its recorded rc4.211 tree.

## Proven defects and repair

The initial rollover regression failed because a newly persisted Week-3 snapshot returned fresh before consulting Sleeper. Week authority also changed only after optional evidence acquisition succeeded. Refresh now resolves Sleeper first, changes consumer context before provider gates, validates freshness against that context, and bypasses old-week retry throttling while respecting provider Retry-After. Cached bytes survive failure but cannot authorize new-week decisions. No production week is hardcoded.

A second regression failed because broad ECR responses explicitly marked Week 3 were relabeled Week 4 by the client. Passing the original provider payload preserves scope checks. The Week-3 control remains Week 3 even on a later calendar date.

The offline integration uses the production Sleeper adapter, refresh function, real weekly parser/atomic storage, Start/Sit optimizer and live-ownership acquisition consumer. It proves four Week-4 projection requests, persistence and consumption, a concrete RB1/RB0 ADD/DROP, owned-player rejection, Reserve protection, stale legacy and snapshot rejection, failed acquisition and Retry-After. Missing selected ranks/game context/Team Total/weather do not suppress healthy projections or legal lineup improvements. Existing selected-panel and broad-ECR parser regressions independently verify identity and scope.

## Local validation

All 21 requested focused scripts PASS (exact filenames are the task names with their existing -regression suffix where applicable); additionally week1-dst-current-baseline-regression covers weeks 4, 5 and 6. season-watcher-feed-v2-regression now verifies timeout and network failure leave evidence caches untouched. season-boone-production-parity-regression preserves all 16 decisions and unchanged decision-body hashes.

Command: node tools/season-browser-review.mjs .pitti-cloud-output/week4-browser
Result: PASS, repository-pinned Chromium, 390x844, all external responses mocked. Real module startup, Week-4 live/ranking/Start-Sit status, 11 rows including IR, four workspace routes, automatic Boone ingestion, no duplicate starter grid, no horizontal overflow, expiry protections and no uncaught exceptions. No screenshots or Production access. This browser scenario uses verified fixture evidence; it does not prove live provider availability or physical-device acceptance.

Full required suite: node tools/strict-suite.mjs .pitti-cloud-output/week4-strict.json ran exactly ONCE: 240/242 PASS. Two obsolete source/version test assertions failed, were corrected, and both focused reruns PASS: tools/season-ranking-freshness-regression.mjs and Draft_Companion_IR_Stash_And_Fetch_Regression_2026-08-13.js. All suite syntax checks PASS; both subsequently edited test files also pass node --check. This earlier attempt is historical; the final 244/244 receipt below supersedes it.

## Shipped D/ST closure

The follow-up integrates the planner directly into app.js and the existing Waiver surface; no eighteenth file or retired module is shipped. Current Sleeper week controls three horizons (current/+1/+2, up to Week 18). Live ownership includes all roster/reserve/taxi IDs; only active roster D/ST provides the owned comparison. Week-1 static data remains behind its historical expiry guard.

Core evidence is an existing Season projected_points record plus fresh existing game-context record for the same player, season, week and game ID. Missing, stale, contradictory or mismatched evidence yields MONITOR with the missing input. Team Total and outdoor weather are optional and do not enter scoring. No new acquisition provider or fabricated projection is introduced. Live upstream D/ST evidence availability has not been proven; the board explicitly handles its absence.

Current ADD requires 0.75 projected points of net improvement. Future STASH retains current D/ST, requires 1.25 net points, and charges verified lineup loss plus an explicit conservative slot policy of 0.5 points per advance week. Full-roster drops use active-only structural protections and preserve filled starter slots; Reserve/IR/taxi and protected players cannot fund capacity. Kicker remains live-roster-only HOLD without verified K-vs-K evidence.

Production regression exercises actual app functions and rendering: Week 4/5/6; current ADD, +1/+2 STASH; insufficient evidence MONITOR; below-cost HOLD; ownership union; expired ownership; protected drops; open slots; and unchanged 17-file manifest. The mobile review ran on this D/ST runtime at 390x844 and passed all horizon/candidate/missing-evidence checks without horizontal overflow or uncaught errors. All 23 focused scripts pass.

Final strict suite: node tools/strict-suite.mjs .pitti-cloud-output/week4-final-strict.json ran ONCE after the D/ST repair and focused tests: 244/244 PASS, including all syntax checks. This supersedes the earlier 240/242 attempt. Subsequent changes only record this receipt and reseal checkpoint metadata; runtime and tests are unchanged.

Next safe gate: External review/publication and exact amended-head CI, then separately authorized promotion and physical acceptance. No push/PR/deployment performed.

## Exact changed files

- Draft_Companion_IR_Stash_And_Fetch_Regression_2026-08-13.js
- PITTI_CURRENT_STATE.json
- PITTI_EXECUTION_LOCK.json
- PITTI_HANDOFF_SEAL.json
- README.md
- app.js
- index.html
- manifest.webmanifest
- sw.js
- tools/season-boone-production-parity-regression.mjs
- tools/season-browser-review.mjs
- tools/season-ranking-freshness-regression.mjs
- tools/season-watcher-feed-v2-regression.mjs
- tools/week1-dst-current-baseline-regression.mjs
- docs/WEEK4_SEASON_READINESS_LOCAL.md
- tools/season-week-rollover-e2e.mjs
- tools/season-dst-production-regression.mjs
- tools/pitti_guardrail_check.mjs
