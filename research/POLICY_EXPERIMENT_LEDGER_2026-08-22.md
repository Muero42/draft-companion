# PITTI Policy Experiment Ledger — 2026-08-22

Purpose: prevent circular debugging, forgotten negative evidence and accidental resurrection of failed strategies. This is a research ledger, not a production config.

## Canonical rc4.59 Coach baseline
Observed structural symptoms across small screens:
- redundant QB accumulation was one defect but not the main one;
- early TE behavior became nearly deterministic around Brock Bowers at 2.02;
- representative path could delay RB1 to 5.09;
- independent MARKET_ROSTER outcome challenger materially outperformed Coach.

## QB1_ONLY
Result: still clearly inferior to MARKET_ROSTER (~-0.572 baseline / -0.711 stress in the completed ablation context).
Conclusion: QB overdrafting matters, but fixing QB count alone does not repair Coach policy.
Do not repeat: pure QB-cap-only strategy as if it solved the main deficit.

## QB1_TE1 / feasible Coach
Result: roughly -0.630 baseline / -0.722 stress vs MARKET_ROSTER in the completed small-screen context.
Behavior: Bowers essentially deterministic at 2.02.
Conclusion: generic one-TE feasibility does not solve temporal opportunity cost.

## DEFER_TE69 diagnostic
Result: roughly -0.148 baseline / -0.283 stress, a large improvement over canonical Coach but still inferior.
Behavior: replaces early Bowers path, often allowing Chase Brown at 2.02.
Conclusion: strong causal evidence that deterministic early-TE behavior is damaging in the sampled states; NOT proof that early/elite TE is intrinsically bad.
Status: diagnostic anchor only. Never promote as a hard Late-TE rule.

## RB2_BY52 diagnostic
Simulation could produce a 15-skill roster with TE=0; core audit correctly failed closed and outcome was skipped.
Conclusion: do not relax retain13 or force outcome through. Generic final-roster starter feasibility is required. This failure does not justify an early TE mandate.
Status: invalid as policy evidence in current form.

## Dynamic TE variants
Variants: TE_SOFT2, TE_SOFT4, TE_SOFT6, TE_RETURN_GATE.
Result: all reproduced approximately -0.630 baseline / -0.722 stress; no meaningful behavioral correction.
Conclusion: blind TE threshold/penalty tuning is the wrong level of abstraction.
Do not repeat: stronger/larger TE penalties on the same mechanism/seeds without new causal evidence.

## Turn-start pair lookahead
Variants: PAIR_FIRST (9->12) and PAIR_FIRST_TWO (9->12 plus 29->32).
Results:
- PAIR_FIRST ~-0.510 baseline / -0.702 stress vs MARKET_ROSTER, both 95% dominated.
- PAIR_FIRST_TWO ~-0.470 / -0.671, both 95% dominated.
- both materially worse than DEFER_TE69 diagnostic anchor.
Behavior:
- Chase Brown 1.09 in 20/20 for both candidate arms;
- Brock Bowers still 2.02 in 18/20;
- second pair arm mainly altered WR ordering at 3.09.
Conclusion: turn-start-only temporal unit is wrong. Second turn picks have their own next-own-pick opportunity cost, especially long gaps 12->29, 32->49, 52->69.
Do not repeat: same pair lambda/frontier tuning on these seeds.

## Rolling NEXT-own-pick lookahead — ACTIVE
Branch: `pitti-rolling-lookahead-probe`; Draft PR #7.
Run: 32597626663.
Fixed arms: CONTROL, ROLL_LONG, ROLL_EARLY4, ROLL_ALL.
Design: candidate selection within canonical quality-safe top five, current quality + expected next-own-pick quality + small symmetric starter coverage; no positional quota; does not overwrite canonical individual scores.
Status at ledger creation: all four jobs running the 10-seed/regime simulation.
Promotion rule: candidate must be competitive with/better than DEFER_TE69 anchor, legal, plausible and robust; then freeze exact rule -> fresh holdout -> joint-state/dependence validation -> realistic mocks.

## Global anti-overfit rules
- No parameter grid-search on seeds already used to choose a mechanism.
- Negative variants are evidence; do not silently recycle them with renamed constants.
- Named-player observations diagnose mechanisms but never become named-player hard code.
- Roster-construction labels (Hero RB, Zero RB, Late TE, Robust RB, etc.) are descriptive, not objectives.
- MARKET_ROSTER remains the independent primary baseline; BRIDGE_GREEDY is diagnostic upper-bound style context only.
- Current outcome-v2 replacement model remains the comparable conservative anchor; separately preregistered shallow-league sensitivity must not be used to tune the draft policy on the same seeds.
