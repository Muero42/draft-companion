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

## Rolling NEXT-own-pick lookahead v1 — INVALIDATED
Branch: `pitti-rolling-lookahead-probe`; PR #7 closed unmerged.
This harness did preserve canonical score/rawScore and therefore did **not** contain the Turn-Pair mutation defect. It failed for a different reason: long-horizon `expectedNext` was inferred only from the current canonical top-five return probabilities. If those candidates all had Return-v2 near zero for a long gap such as 2.02->3.09, the residual probability mass was assigned to the current fifth candidate. The actual later-round candidate pool was omitted.

Forensic ROLL_EARLY4 result:
- 1.09 returned to plausible names (James Cook III 11/20, Amon-Ra 7/20, Jonathan Taylor 2/20, Chase Brown 0/20), confirming the Brown 20/20 lock was specific to the pair mutation bug;
- Brock Bowers remained 2.02 in 20/20;
- outcome remained poor, but those deltas cannot select/reject a policy because the long-horizon state model is invalid.

Decision: do not retune the rolling coefficients/activation set. Replace marginal top-five horizon arithmetic with actual simulated full-board next-own-pick states.

## Joint full-board next-own-pick lookahead — ACTIVE
Branch: `pitti-joint-lookahead-probe`; Draft PR #8; Actions run `32598923886`.
Smoke completed SUCCESS, including a nested JOINT_LONG2 one-draft exercise. At latest ledger update the three matrix jobs CONTROL / JOINT_LONG2 / JOINT_EARLY4 are healthy in the preregistered 5-seed/regime simulation.

Fixed design:
- current admissible frontier = canonical quality-safe top five after Return-v2 + Player Quality Safety Gate + normalization;
- for each candidate A, clone/freeze state, insert/remove A, then simulate every intervening opponent pick to the actual next user pick with exact snake, sequential roster state, manager modifiers and K/DST hazards;
- common random numbers across A branches;
- evaluate the best player actually remaining across the FULL skill-player board at next own pick;
- initial utility = z(canonical current normalized Coach score) + z(-expected best-next selected-panel rank), no position/roster-construction bonus;
- initial 120 nested rollouts/candidate; 5 outer drafts/regime = causal screen only, never certification.

Mandatory validity gates before any outcome interpretation:
- canonical score/rawScore byte/numerically unchanged;
- forward/reverse frontier evaluation gives identical expected-next values/winner;
- candidate A removed before rollout;
- legal unique exact-snake intervening picks;
- next-best calculated from actual full remaining board;
- nested CRN seed independent of candidate iteration order;
- 9->12 nested results must broadly match the already-persisted rc4.59 turn-market reference before long-gap 12->29 / 32->49 results are trusted.

Because outcome-v2 certification requires >=50 runs/regime, this n=5 causal screen may intentionally produce a FAIL_CLOSED sample-size gate. Do not weaken that criterion; inspect paired diagnostics/behavior only.

## Existing rc4.59 timing anchor — use before inventing new timing models
PASS `simulation_2026/RC459_TURN_PAIR_MARKET_2026.json`, 2,000 parent runs, fresh freeze `5339a37d...`, rc4.59 profiled-baseline opponent kernel.
Key 1.09->2.02 return_if_wait: JSN 0%, Jonathan Taylor 0%, Amon-Ra 1.79%, James Cook III 11.96%, Ashton Jeanty 68.86%, Chase Brown 97.5%.
Chase Brown is therefore a legitimate high-end player but normally a WAIT-to-2.02 sequencing candidate when materially stronger low-return alternatives are present. Do not hard-code a Brown penalty or an ADP reach cap.

## Global anti-overfit / research-integrity rules
- No parameter grid-search on seeds already used to choose a mechanism.
- Negative variants are evidence; invalid variants are labeled invalid rather than treated as negative causal evidence.
- Named-player observations diagnose mechanisms but never become named-player hard code.
- Roster-construction labels (Hero RB, Zero RB, Late TE, Robust RB, etc.) are descriptive, not objectives.
- MARKET_ROSTER remains the independent primary baseline; BRIDGE_GREEDY is diagnostic upper-bound style context only.
- Current outcome-v2 replacement model remains the comparable conservative anchor; separately preregistered shallow-league sensitivity must not be used to tune the draft policy on the same seeds.
- Every future lookahead implementation must freeze/clone canonical candidate scores and prove iteration-order invariance before outcome testing.
- `QUALITY_TIMING_DOMINANCE` is a validation diagnostic, not a scoring rule: repeated unexplained choice of a candidate materially worse on both selected-panel Player Quality and Sleeper timing/ADP than another available quality-safe candidate invalidates the experiment even if aggregate outcome happens to improve. Evidence/health/feasibility can legitimately explain an override.
