# PITTI Codex Work Package — Waiver/FA first, Trades second

Date: 2026-09-10
Repository: `Muero42/draft-companion`
Base authority: `main` at `5e29f285103531b81c7579036e7a885e487e0650`
Runtime identity on device: `v11.8.0-rc4.193`

## Latest verified physical state

The production rc4.193 Weekly Evidence repair is physically accepted on Android without cache clearing or reinstall:

- Sleeper Live-State `< 1 Min.`
- Weekly Evidence `1 Min.`
- FantasyPros weekly projections verified for `725 Spieler`
- Watcher surface reports `PASS`
- prior missing-module failure is resolved
- prior localStorage DOMException code `22` / quota failure is resolved

Treat this as the current device authority. Do not regress it.

## Product priority — binding

The next Season Companion work is NOT a Start/Sit-first project.

Priority is:

1. **Waiver / Free Agency — maximize decision usefulness now**
2. **Trades — maximize concrete offer usefulness next**
3. Only after those are materially useful: Start/Sit, Weekly Expert-Ranks, matchup/weather and other season lanes.

Weekly-rank/matchup/weather work may be pulled forward only when it is required to make Waiver or Trade outputs materially better and can be implemented without derailing the priority order.

## Mandatory bootstrap / authority checks

Before editing:

1. Read `AGENTS.md`, `PITTI_CURRENT_STATE.json`, `PITTI_EXECUTION_LOCK.json`, `PITTI_COMMAND_CONTRACTS.json`, the latest repository handoff/checkpoint files, and the current rc4.193 runtime/test implementation.
2. Reconcile them against live Git state. Historical checkpoint claims that contradict `main 5e29f285...` and the physical Android PASS above are stale and must not be resurrected.
3. Work on a non-production feature branch based exactly on `5e29f285103531b81c7579036e7a885e487e0650` unless `main` has advanced; if it has advanced, stop dependent editing until the newer authority is reconciled.
4. Update the canonical checkpoint/state promptly with the physical rc4.193 PASS and this new Waiver->Trade priority. Preserve history rather than rewriting it.

## Existing invariants that must remain hard

- Current Sleeper league state is roster / ownership / starter / reserve / FAAB authority. Draft roster is historical only.
- 10-team Half-PPR. Legal starter geometry: QB, RB, WR, WR, TE, FLEX(RB/WR/TE), W/R(RB/WR), K, DST; bench 6 + one Reserve/IR.
- Reserve/IR is never an ordinary active drop target.
- Never recommend dropping the only active QB or only active TE for another position.
- Kicker comparisons are K-vs-K only. D/ST decisions stay in the D/ST model.
- Season QB2 is allowed only when value clears same-bye and roster-capacity / second-drop cost; draft one-QB rule must not be resurrected as a season hard cap.
- Geno Smith and Aaron Rodgers remain hard exclusions.
- No automatic Sleeper transaction, FAAB bid, trade, deployment, merge, cache clear or reinstall.
- Missing or stale evidence must fail closed; do not fabricate projections, ranks, trade values, FAAB or acceptance probability.
- Preserve the just-verified Weekly Evidence rc4.193 module and quota-safe persistence.

# Workstream A — Waiver / FA

## Goal

Turn Waiver/FA into the highest-value in-season decision surface: concrete, roster-relative, evidence-backed **ADD X / DROP Y** decisions with enough context to act, but fail-closed when the evidence does not justify action.

## Inspect before changing

Trace and test the current implementations around at least:

- `fetchSeasonLeagueState`
- `seasonRosterRows`
- `seasonAcquisitionDecision`
- `waiverOpponentMarket`
- `renderWaiverWorkspace`
- `week1WaiverMarketSignal` and any current-season transaction-history priors
- current Weekly Evidence consumers
- Watcher / research-cache ingestion and freshness gates
- D/ST future-capacity logic and K isolation

Do not replace sound existing logic just because it is old. Identify actual gaps first.

## Required Waiver capability

The final Waiver surface should, when evidence is sufficient:

- rank actual live free agents, never merely undrafted players;
- evaluate each candidate against the real roster and legal slot/capacity geometry;
- surface concrete `ADD <candidate> / DROP <roster player>` pairs;
- distinguish **this-week value**, **ROS/championship value**, and **contingent upside**;
- price starter/FLEX improvement, bench option value, injury/role contingency and replacement cost;
- use verified Weekly Evidence projections already live on rc4.193;
- ingest role/injury/news evidence only when freshness/provenance gates pass;
- compare all 9 opponent rosters for positional need and actual remaining FAAB;
- use current-season waiver transactions as bounded priors where real data exists;
- keep historical manager tendency as only a weak bounded prior, never pseudo-certainty;
- explicitly price the next mandatory D/ST roster-capacity event when no D/ST is held;
- handle QB2 candidates with same-bye + second-drop opportunity cost;
- produce a practical FAAB band only when market evidence supports it; otherwise show WATCH/HOLD rather than fake precision;
- expose why a recommendation is actionable, the main invalidator, evidence freshness, and strongest competing manager(s);
- keep no-transaction / fail-closed behavior when live ownership or decision evidence is stale.

## Waiver UX acceptance

A user should be able to open Waiver/FA on a phone and answer, with minimal scrolling:

1. Is there anyone I should add now?
2. Exactly who would I drop?
3. How much FAAB is rational, if applicable?
4. Who is likely to compete and why?
5. Is the move mainly for Week N, ROS, or contingency upside?
6. What new fact would change the recommendation?

Avoid duplicate Kader rendering inside Waiver.

# Workstream B — Trades

Start only after Waiver/FA is materially improved and its regressions are green.

## Goal

Move from target discovery / simplistic package generation to concrete, plausible trade offers using both teams' live rosters, real roster geometry and current valuation evidence.

## Inspect before changing

Trace and test at least:

- `seasonTradeDecision`
- `renderTradeWorkspace`
- existing offer/package enumeration
- live opponent roster / manager mapping
- lineup / replacement-value helpers
- revealed-preference / recent-draft constraints
- any current trade-value source adapters already present

## Required Trade capability

When sufficient evidence exists, each surfaced trade should show:

- **GET** and **GIVE** package, up to sensible 1-for-1 / 2-for-1 / 1-for-2 constructions already permitted by invariants;
- projected effect on PITTI's legal starting lineup / FLEX geometry plus replacement loss;
- projected effect on the opponent's legal lineup / positional need;
- current market/trade-value evidence, with Justin Boone as a desired anchor when a current redraft value source can be verified and ingested safely;
- recent draft capital / revealed preference as a plausibility constraint, especially this early in the season;
- conservative acceptance plausibility, explicitly heuristic unless supported by current market evidence;
- a reason the opponent might rationally accept, not merely why PITTI benefits;
- fallback package(s) if the preferred offer is too aggressive;
- an invalidator / recheck trigger for injury, role or valuation changes;
- fail closed when current valuation evidence is unavailable rather than presenting fake precision.

Keep the historical impossible example impossible: do not present JSN-for-Gibbs as a plausible near-even 1-for-1 merely because a panel rank is numerically close.

# Evidence / source strategy

Do not hard-code data that will become stale. Prefer adapters with provenance, timestamps and explicit availability states.

For this work package, prioritize only sources that materially improve Waiver or Trades. Examples of useful lanes include:

- current Sleeper roster / ownership / FAAB / transaction state;
- verified rc4.193 FantasyPros weekly projections;
- Watcher source-proven injury/role events;
- current trade-value evidence for Trades;
- current usage / role evidence where it materially changes waiver valuation.

Do not spend the work package building general Start/Sit-only weather/Vegas/UI infrastructure unless a concrete Waiver/Trade dependency requires it.

# Testing / gates

Add or extend deterministic regressions for at least:

- live-owned player never appears as FA;
- Reserve/IR never ordinary DROP;
- only active QB / only active TE protected;
- QB2 same-bye + future D/ST second-drop cost;
- two-TE legality through FLEX preserved;
- K isolated from skill-position drop comparisons;
- stale live ownership => no actionable acquisition;
- stale/unavailable market evidence => no fabricated FAAB/actionability;
- opponent FAAB/need market uses all 9 opponent rosters;
- trade package legal ownership on both sides;
- revealed-preference guard against implausible immediate post-draft reversals;
- trade unavailable without current valuation evidence;
- rc4.193 Weekly Evidence physical-pass behavior not regressed;
- quota-safe Weekly Evidence persistence not regressed;
- mobile route separation: Kader vs Waiver vs Trades remains intact.

Run the strict project gates, candidate/re-extraction checks and browser/runtime tests relevant to the changed surfaces. Repair exact-head failures autonomously on the feature branch.

# Deliverable

Produce one reviewable feature-branch/PR work package, or two sequential PRs if keeping Waiver and Trades separate materially reduces regression risk. Waiver must be completed first.

Before declaring ready:

1. exact-head tests green;
2. no known reproduced failure remains;
3. canonical checkpoint updated with implementation, test evidence, rejected approaches and next gate;
4. provide a concise final report: root gaps found, implemented changes, exact tests, remaining fail-closed lanes, PR/commit identity, and whether physical Android verification is required.

Do not merge or deploy. Those remain outside this Codex task.
