# PITTI handoff current override — 2026-08-23

This file supersedes stale immediate-next-action sections in `PITTI_HANDOFF_2026-08-22.md`. Canonical `/Pitti/PITTI_PROJECT_STATE.md` remains Source of Truth and should be read to EOF first when available.

## Invalidated/rejected research paths
- Original turn-pair probe: INVALID. Candidate-score mutation caused recursive/order-dependent inflation and the 20/20 Chase Brown 1.09 artifact. Never reuse its outcomes.
- Rolling-v1: INVALID. Long-gap future quality used current top-5 fallback instead of actual future board.
- Joint-v1 z-score aggregation: REJECTED. Separate z-scaling amplified tiny future-board differences and allowed implausible Bowers 1.09 choices.

## PairSum-v2 status
PR #9 / `pitti-joint-pairsum-probe`, run `32615699210`.
1.09 across 20 Coach drafts: Cook 9, Amon-Ra 5, Taylor 4, JSN 2, Brown 0, Bowers 0. CONTROL 2.02 Bowers 20/20; PairSum 2.02 Brown 18/20, Jeanty 1, Walker 1.
Existing ADP-neighbor outcome anchor: CONTROL ~-0.644 baseline/-0.729 stress vs MARKET_ROSTER; PAIRSUM_LONG2 ~-0.380/-0.170; PAIRSUM_EARLY4 ~-0.396/-0.279. n=10/regime only; no certification. PairSum LONG2 remains frozen research candidate.

## Evaluator alignment warning
`MARKET_OUTCOME_BRIDGE_2026.json` is historical Sleeper ADP -> realized weekly Half-PPR neighbor forecasting; MARKET_ROSTER also selects mainly by current Sleeper ADP. Thus this outcome anchor structurally favors ADP-like policies and is only a market-regret guardrail, not sole strategic truth. Do not tune PITTI toward MARKET_ROSTER merely to close this gap.

## Direct decision counterfactual path — actual-kernel gates PASS
Actual validated kernel source is `research/rc459_full_policy_paired_2026.js` (58/58 source lock + exact rc4.59 Coach execution, profiled opponent kernel). Research branch/PR #12: `pitti-decision-counterfactual-kernel`. No production ranking/scoring change.

Actual-kernel RNG parity run `32620973626` PASS: complete full-policy outputs byte-identical across COACH/BRIDGE_GREEDY/MARKET_ROSTER × baseline/stress after only replacing legacy RNG with snapshot-capable bit-equivalent RNG. Output SHA-256 `20e0b698978d1ee40988ba53132381f7193ab5469c2976333d6fac4d70bc574f`.

Actual-kernel causal plumbing run `32621088496` PASS: fresh seeds, treatment picks 9/12, shared-prefix identity, cloned RNG identity, zero treatment RNG consumption, legal complete drafts and actual FA pools.

## Direct counterfactual evidence
### MARKET_NEUTRAL breadth-100 — PASS
Run `32623713022`, artifact `rc459-cf-market-breadth100`, digest `sha256:fbc78b672851c895548f52d6ac77a6e0297ae614d1ab6860427c71cdfc603a38`: 200 fresh states and 2,000 complete MARKET_NEUTRAL branches. Broad direct A/B evidence does NOT reproduce Brown-always-1.09 or Bowers-always-2.02. Evaluator lenses disagree materially, confirming no single evaluator should dictate strategy.

### Targeted PairSum-vs-neutral — PASS
Run `32623556347`, artifact `rc459-cf-targeted-pairsum`, digest `sha256:0aa62faa7d210397a7f83bdaf9d97eedc60bc3842c7098b59aa10e6e7ae142bf`: 3 fresh seeds, 56 complete raw causal branches, `outcome_evaluated=false`. PairSum consistently improves aggregate selected-panel rank while worsening aggregate ADP, reproducing the panel-vs-market disagreement under causal controls. It can also yield 7-RB/8-WR rosters; do not interpret raw panel-sum improvement as championship utility.

## 1.09 plausibility correction — IMPORTANT
A direct plausibility challenge identified that Chase Brown and Brock Bowers had been incorrectly carried into an isolated 1.09 strategy-path test as equal-plausibility candidates. This was corrected BEFORE any isolated-lookahead outcome artifact was produced/inspected.

Frozen realistic 1.09 path frontier is now: James Cook III, Amon-Ra St. Brown, Jaxon Smith-Njigba, Jonathan Taylor, Justin Jefferson, Ashton Jeanty; unavailable names are omitted per seed. Chase Brown and Brock Bowers remain negative-control/stress concepts only at 1.09 unless later independent evidence materially changes their value.

Persistent spec: `research/ISOLATED_EARLY_LOOKAHEAD_CAUSAL_SPEC_2026-08-23.md`. Harness `research/rc459_isolated_early_lookahead_2026.js`, run `32625856926` is currently in progress using fresh seeds 459277001-005. Design: compare MARKET_NEUTRAL vs PairSum choice at 2.02 from the exact same state, then BOTH children receive identical MARKET_NEUTRAL continuation through pick 150.

## FA-enriched shallow-league evidence — instrumentation PASS
Run `32625856925` PASS; artifact `rc459-cf-fa-enriched20`, digest `sha256:1e32b530322ed5e673092b7186669149c5fbaefac11fa97a5c066a535665cbff`.
20 fresh seeds, 40 states, 399 complete branches. Player-pool snapshot contains 230 skill players and gives 100% metadata coverage for every actual post-draft FA id in all branches (93-95 FAs/branch). This fixes the prior ~43.5% reconstruction problem without rerunning the older expensive drafts.

Descriptive FA cutline (NOT yet utility calibration): across 399 branches, best available by ADP averages roughly RB 152.2 (median 150.3), WR 157.1 (157.2), TE 135.3 (125.8), QB 148.6 (149.9). By selected-panel rank the best available averages roughly RB 132.2, WR 137.2, TE 131.8, QB 114.4. These are availability facts, not proof that a bench player is replaceable at zero cost; actual weekly/role/title utility still required.

## Outcome/title layer correction
Existing `rc459_dynamic_championship_utility_challenger_2026.py` is NOT a true P(title) model: it sums weeks 1-14 empirical weekly win probabilities. Treat it as a regular-season/startability utility lens only. True title-probability requirements are preregistered in `research/TITLE_PROBABILITY_CHALLENGER_SPEC_2026-08-23.md`. Actual playoff team count/start week/byes/seeding/bracket rules remain unresolved in reliable artifacts, so `TITLE_RULES_UNRESOLVED` must fail closed rather than invent defaults.

## Fresh external market/expert sanity — 2026-08-21 snapshot
Current external sanity continues to place the elite 1.09 window around Amon-Ra/JSN/Cook/Taylor rather than Chase Brown/Bowers. This is a plausibility guardrail, not an instruction to copy ECR.

## Parallel-work rule
Whenever a long Actions/simulation job is active, automatically use independent capacity on outcome-challenger, shallow-league FA/waiver, panel-vs-market disagreement, TAKE/WAIT, health/role, opponent-realism, championship-tail, harness/audit and draft-day usability work where useful. Do not return merely because a healthy long run is still computing.

## Immediate next actions
1. Let isolated run `32625856926` finish; audit raw invariants and how often PairSum actually differs from MARKET_NEUTRAL at 2.02 across realistic 1.09 paths BEFORE any outcome scoring.
2. Use FA-enriched 399-branch dataset to build actual shallow-league replacement/startability diagnostics; do not use raw ADP cutlines as utility by themselves.
3. Apply regular-season/startability, panel and market-regret lenses to isolated divergent pairs; preserve conflicts.
4. Resolve real league playoff settings from canonical/Sleeper evidence before implementing/reporting true P(title).
5. Only after 2.02 isolation is understood extend to 4.02 and then later turns on fresh held-out states.
6. No production promotion yet.
