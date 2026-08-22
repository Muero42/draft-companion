# PITTI HANDOFF — 2026-08-22

## Source-of-truth intent
This handoff supplements the canonical project state. On continuation, read the canonical PITTI_PROJECT_STATE.md to EOF first, then this handoff and the referenced research files. Verify current GitHub/runtime artifacts before assuming a prepared version is installed on Android.

## Immediate objective
Reach trustworthy, realistic full-draft simulations soon enough to extract actionable draft strategy for the real 10-team Half-PPR Sleeper draft on 2026-08-31 (user slot 9). Simulation realism and evidence from mocks are high priority. Avoid unnecessary/high-risk large production changes as draft day approaches, but **do not treat 2026-08-24 as a hard ban on large changes**: if evidence indicates a material Championship-Utility / league-win benefit and the change can still be implemented, tested and rolled back safely, a larger change remains explicitly allowed and desirable even after 2026-08-24. Prefer the smallest change that captures the benefit; change size itself is not the optimization target.

## Latest critical result: turn-start pair probe rejected
GitHub Actions run 32596679736 produced completed PAIR_FIRST and PAIR_FIRST_TWO artifacts; CONTROL was still running at the latest checkpoint but is no longer needed to decide whether these two candidates advance because both are independently dominated by MARKET_ROSTER and worse than the earlier DEFER_TE69 diagnostic anchor.

PAIR_FIRST vs MARKET_ROSTER:
- baseline: about -0.510 expected wins over 14 weeks, 95% CI roughly [-0.681,-0.338]
- stress: about -0.702, CI roughly [-0.857,-0.546]

PAIR_FIRST_TWO:
- baseline: about -0.470, CI roughly [-0.690,-0.251]
- stress: about -0.671, CI roughly [-0.878,-0.465]

Earlier DEFER_TE69 diagnostic anchor remained much better at roughly -0.148 baseline / -0.283 stress. Therefore PAIR_FIRST and PAIR_FIRST_TWO are rejected for holdout/production without waiting to tune anything.

Pick-level mechanism diagnosis is important:
- both pair variants selected Chase Brown at 1.09 in all 20 Coach drafts;
- Brock Bowers still appeared at 2.02 in 18/20;
- PAIR_FIRST_TWO mostly changed which WR was selected at 3.09 rather than fixing the structural 2.02->3.09 opportunity cost.

Interpretation: the temporal unit was wrong. Turn-start lookahead evaluates 9->12 and 29->32, but the second pick at each turn also has a next own pick, often after a long gap. The real chain is 9->12, 12->29, 29->32, 32->49, 49->52, 52->69, etc. The structurally important decisions include long-gap exits 12->29, 32->49, 52->69. Do NOT grid-search the failed pair lambda/frontier on the same seeds.

Persistent result note: `research/TURN_PAIR_SCREEN_INTERIM_RESULTS_2026-08-22.md` on branch `pitti-turn-pair-probe`, commit `fae096e...`.

## Current critical path: rolling NEXT-own-pick lookahead
New isolated branch: `pitti-rolling-lookahead-probe`, Draft PR #7.
Preregistered plan: `research/ROLLING_NEXT_OWN_PICK_LOOKAHEAD_PLAN_2026-08-22.md`.
Harness: `research/rc459_rolling_lookahead_screen_2026.js`.

Fixed arms, no same-screen tuning:
- CONTROL
- ROLL_LONG: long-gap exits only (12,32,52,72,92,112,132)
- ROLL_EARLY4: 9,12,29,32
- ROLL_ALL: every own pick with a next own pick

The rolling layer ranks only the canonical top-5 quality frontier and does NOT overwrite individual raw/normalized Coach scores with pair totals. Fixed research utility uses within-frontier normalized current quality + expected next-own-pick quality + a small symmetric starter-coverage term. It remains position-agnostic and has no Hero-RB/Late-TE objective.

GitHub Actions run 32597626663 (`PITTI rc4.59 Rolling Lookahead PR Trigger`) is active with all four arms in the 10-seed/regime simulation step at the latest checkpoint. Do not duplicate while healthy. As with the prior pair probe, marginal Return-v2 ordered-survival is screening-only; any positive candidate still requires joint-state/conservative-dependence validation and fresh holdout.

## Dynamic-TE screen retained as prior negative evidence
TE_SOFT2/4/6 and TE_RETURN_GATE all reproduced about -0.630 expected wins baseline / -0.722 stress vs MARKET_ROSTER. Hard DEFER_TE69 improved to about -0.148 / -0.283 but remains diagnostic only. No more blind TE threshold tuning.

## Shallow-league evaluator audit and challenger
Research files:
- `research/OUTCOME_REPLACEMENT_VALUE_AUDIT_2026-08-22.md`
- `research/SHALLOW_LEAGUE_REPLACEMENT_CHALLENGER_PLAN_2026-08-22.md`

Current outcome-v2 uses the median weekly forecast of the bottom 20% of each positional market pool as replacement scoring. This is independent/conservative but not explicitly calibrated to the actual 10-team / 6-bench managed-redraft waiver pool.

The challenger is preregistered separately and must not tune the running rolling screen. Future full-draft artifacts MUST persist final available skill-player IDs / league-wide ownership information so empirical post-draft free-agent pools can be reconstructed. Fixed sensitivity scenarios will retain current conservative replacement and compare two shallow-FAAB scenarios derived from per-draft best-free-agent distributions with preregistered acquisition haircuts. If policy conclusions reverse across plausible replacement assumptions, replacement sensitivity is material and promotion requires stronger managed-season/waiver evidence.

## TAKE/WAIT infrastructure
Reusable timing extractor added: `research/slot9_take_wait_from_drafts_2026.py` (commit `bbaafb7...`). It aggregates each Coach top-5 candidate's Return-v2 timing evidence by user pick and explicitly labels `1-P(return)` as timing pressure only. It must never promote a weak player solely because the player is unlikely to return. Use it after frozen realistic/holdout draft artifacts exist.

## Realistic mock matrix hardened
`research/REALISTIC_MOCK_VALIDATION_MATRIX_2026-08-22.md` updated at commit `1befc70...`.
New requirements include:
- rolling next-own-pick diagnostics;
- final available/free-agent pool persistence;
- shallow-league replacement challenger after frozen drafts;
- dated player-evidence states;
- market/position-run perturbation stress;
- MANUAL baseline with AUTODRAFT only as explicit stress/current state;
- no 2026-08-24 hard ban on evidence-supported large changes.

## Managed-redraft late-bench utility
Research specs:
- `research/LATE_ROUND_ASYMMETRIC_UPSIDE_2026-08-22.md`
- `research/MANAGED_REDRAFT_LATE_BENCH_UTILITY_SPEC_2026-08-22.md`

Late bench value should consider tail ceiling, favorable-role probability, time-to-information, drop flexibility, waiver replacement cost and standalone startability rather than median projection alone. This is not Best Ball logic and not a hard late-RB rule. Jacksonville officially supports a Tuten/Rodriguez committee; Rodriguez is a price-dependent upside candidate, not automatically superior. Denzel Boston has genuine Cleveland first-team work; Ja'Kobi Lane has persistent camp/preseason signal but still needs stable first-team-route evidence. Parker Washington remains a value thesis with injury recheck.

## Late-TE replacement value
Research file: `research/LATE_TE_REPLACEMENT_VALUE_2026-08-22.md`.
Dalton Kincaid has credible healthy/camp/red-zone evidence and cheap acquisition cost; Jake Ferguson is a separate later stable/value archetype; very-late tails remain available. Early TE must therefore be compared against a distribution of realistic later TE outcomes, not one fixed replacement TE. This does NOT imply a hard Bowers fade.

## Decline-risk layer
Research file: `research/DECLINE_RISK_REFRESH_2026-08-22.md`.
Christian McCaffrey is a high-priority live risk gate: age 30, 2025 career-high workload, repeated camp soreness/missed practices and weaker rushing-efficiency context versus still-elite receiving/ceiling. Do not double-count correlated downside signals or hard-exclude him. Mandatory draft-day health recheck if available near 1.09.

## Earlier RB2_BY52 diagnosis retained
Run 32590945054 simulation passed but core audit found a Coach roster with TE=0; outcome correctly skipped. Do not relax retain13. Generic final-roster starter feasibility is required; hard early TE is not.

## Opponent draft-mode semantics
All opponents default MANUAL absent current contrary evidence. AUTODRAFT switches prospectively only from current evidence and must not train personal manual profiles. Sleeper CPU uses Draft Queue first, then higher-ranked available + roster need when queue empty. Keep autodraft fallback cheap/secondary.

## Player-evidence gates
- Nabers: positive 11-on-11 progression; full contact/medical clearance remains decisive.
- Olave: no standalone downgrade; Jordyn Tyson absence may concentrate targets but offense-quality effect remains separate.
- Parker Washington: day-to-day/expected back; preserve value thesis, mandatory recheck.
- Flowers: quad contusion/day-to-day, no large downgrade absent setback.
- Chase Brown: current lead/high-volume evidence; no new warning explaining Coach RB avoidance.
- Swift: tandem evidence, not true workhorse.
- LaPorta and other injured TE/RB/WR names remain evidence gates, not automatic penalties.
- CMC: explicit high-priority decline/availability gate as above.

## AUTO operating rule — mandatory
Every AUTO block maintains serial critical path + independent parallel queue. Do not merely poll/wait while worthwhile independent work exists. For explicitly requested large/unattended AUTO blocks, continue through multiple meaningful work packages before reporting; do not stop after the first checkpoint unless blocked or user action is genuinely required.

## Immediate next actions
1. Let healthy rolling run 32597626663 continue; inspect each completed arm as soon as an artifact exists and reject immediately if clearly dominated.
2. If one rolling arm is competitive with/better than DEFER_TE69 and behavior is plausible, freeze it exactly; then fresh holdout + joint-state/dependence validation before any production integration.
3. If rolling fails, diagnose pick-level mechanism before changing activation set/normalization/coefficient; no same-seed tuning.
4. Once frozen draft artifacts exist, run `slot9_take_wait_from_drafts_2026.py` to create the actual timing map.
5. Implement final-available-pool persistence in the next full realistic harness, then run the separate shallow-league replacement challenger on frozen drafts.
6. Continue primary-source player evidence / decline-risk gates for likely slot-9 windows and late-round asymmetric upside.
7. Once a simple Coach candidate passes causal + legality + holdout + independent sensitivities, run the full realistic mock matrix.
8. Keep deep Sleeper Queue fallback minimal/cheap; K/DST omitted, QB2/TE2 deprioritized.

## Hard constraints
- 10-team Half-PPR; QB, 2 WR, RB, TE, 2 Flex, K, DST; bench 6. Four-WR limit is STARTERS, not roster cap.
- Slot 9 picks: 9,12,29,32,49,52,69,72,89,92,109,112,129,132,149.
- User does not draft K/DST in strategic queue; Late QB/very late TE are preferences, not hard suppression.
- Geno Smith and Aaron Rodgers hard QB exclusions.
- Broader but viable candidate lists in interactive mocks.
- After completed simulated draft, AUTO does post-draft analysis/validation, not a new mock unless explicitly requested.
- Fresh data/backups before real draft; own model assessment before optional FantasyPros parallel view.
- Large changes remain allowed after 2026-08-24 when evidence supports material Championship-Utility gain and sufficient test/rollback time remains.
