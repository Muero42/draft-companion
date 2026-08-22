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

## Turn-start pair lookahead — INVALIDATED
Variants: PAIR_FIRST (9->12) and PAIR_FIRST_TWO (9->12 plus 29->32).
Previously reported outcome deltas (~-0.510/-0.702 and ~-0.470/-0.671 vs MARKET_ROSTER) are **not valid policy evidence**.

Root cause found 2026-08-22 after the implausible Chase Brown 1.09 lock was challenged:
- `qualitySorted=scored.slice()` and `frontier=...` contain references to the same score objects;
- candidate loop writes `a.rawScore=pairScore` in place;
- later candidates' `retPool` therefore consumes earlier candidates' synthetic/mutated pair scores;
- utility becomes loop-order dependent and canonical player scores are destroyed during evaluation.

Observed symptom: Chase Brown 1.09 in 20/20 and contaminated synthetic raw values above 300. This is a research-harness mutation bug, not a real Chase Brown valuation and not evidence that opportunity-cost modeling itself fails.

Decision:
- PR #6 closed unmerged and explicitly marked INVALIDATED;
- retain artifacts only for bug forensics;
- do not tune player rankings, RB weights or market gates from these outcomes;
- any future lookahead must pass score immutability + frontier-permutation/order-invariance tests.

## Rolling NEXT-own-pick lookahead — ACTIVE
Branch: `pitti-rolling-lookahead-probe`; Draft PR #7.
Run: 32597626663.
Fixed arms: CONTROL, ROLL_LONG, ROLL_EARLY4, ROLL_ALL.
Design: candidate selection within canonical quality-safe top five, current quality + expected next-own-pick quality + small symmetric starter coverage; no positional quota; **does not overwrite canonical individual score/rawScore**, so it is not affected by the specific turn-pair mutation bug.
Status at ledger correction: all four jobs running the 10-seed/regime simulation.
Promotion rule: candidate must be competitive with/better than DEFER_TE69 anchor, legal, plausible and robust; then freeze exact rule -> instrumentation parity -> fresh holdout -> joint-state/dependence validation -> realistic mocks.
Additional gate: after results, inspect whether any implausible large reach remains. Only residual reaches after correct immutable math may motivate a market-plausibility safety rule.

## Global anti-overfit / research-integrity rules
- No parameter grid-search on seeds already used to choose a mechanism.
- Negative variants are evidence; invalid variants are labeled invalid rather than treated as negative causal evidence.
- Named-player observations diagnose mechanisms but never become named-player hard code.
- Roster-construction labels (Hero RB, Zero RB, Late TE, Robust RB, etc.) are descriptive, not objectives.
- MARKET_ROSTER remains the independent primary baseline; BRIDGE_GREEDY is diagnostic upper-bound style context only.
- Current outcome-v2 replacement model remains the comparable conservative anchor; separately preregistered shallow-league sensitivity must not be used to tune the draft policy on the same seeds.
- Every future lookahead implementation must freeze/clone canonical candidate scores and prove iteration-order invariance before outcome testing.
