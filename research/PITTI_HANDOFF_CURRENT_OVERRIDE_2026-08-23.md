# PITTI handoff current override — 2026-08-23

This file supersedes stale immediate-next-action sections in `PITTI_HANDOFF_2026-08-22.md`. Canonical `/Pitti/PITTI_PROJECT_STATE.md` remains Source of Truth and should be read to EOF first when available.

## Invalidated/rejected research paths
- Original turn-pair probe: INVALID. Candidate-score mutation caused recursive/order-dependent inflation and the 20/20 Chase Brown 1.09 artifact. Never reuse its outcomes.
- Rolling-v1: INVALID. Long-gap future quality used current top-5 fallback instead of actual future board.
- Joint-v1 z-score aggregation: REJECTED. Separate z-scaling amplified tiny future-board differences and allowed implausible Bowers 1.09 choices.
- PairSum-v2 LONG2 at 2.02: REJECTED as opportunity-cost lookahead in current form. Fresh isolated causal evidence shows its future-board term is effectively flat and it collapses toward current selected-panel rank; deterministic Chase Brown 2.02 is mechanism failure, not strategy evidence.

## PairSum-v2 mechanism finding — isolated audit PASS
Latest isolated run `32626462084` PASS on branch `pitti-decision-counterfactual-kernel`: 16 valid shared-prefix states, 32 complete child drafts, 16/16 divergent decisions. Raw artifact SHA-256 `3311a137a20a01e175309ab229cd762f18e0985b908eea0b9befd1e4ed4edc79`; artifact ZIP digest `sha256:0343376197f7ef3375bdca3810af8885d2c53020734c74ddeb0a8952e86b8caf`.

Corrected realistic 1.09 path frontier was frozen before outcome inspection: James Cook III, Amon-Ra St. Brown, Jaxon Smith-Njigba, Jonathan Taylor, Justin Jefferson, Ashton Jeanty; unavailable names omitted. Brown/Bowers are negative controls at 1.09, not equal-plausibility strategy paths.

At 2.02 MARKET_NEUTRAL selected CeeDee Lamb 8/16, Saquon Barkley 5/16, Ashton Jeanty 3/16. PairSum-v2 selected Chase Brown 16/16. This was audited outcome-blind.

Mechanism: PairSum package cost = current selected-panel rank + expected best selected-panel rank at next own pick. The future `meanNext` term is nearly constant across candidates (~25.15–25.17 in representative states), while current-panel rank differs materially (Brown ~11.89, Jeanty ~12.40, Walker ~12.48, Jefferson ~13.60, Bowers 14.00). The intended opportunity-cost signal therefore contributes almost no useful discrimination. Do NOT add a Brown-specific penalty; replace the estimand.

Persistent audit: `research/RC459_ISOLATED_2_02_AUDIT_2026-08-23.md` (commit `ec5ab19c7028793c18c774c72ba789562edf9ca7`).
Persistent isolated-design spec: `research/ISOLATED_EARLY_LOOKAHEAD_CAUSAL_SPEC_2026-08-23.md`.

## Direct decision counterfactual path — actual-kernel gates PASS
Actual validated kernel source is `research/rc459_full_policy_paired_2026.js` (58/58 source lock + exact rc4.59 Coach execution, profiled opponent kernel). Research branch/PR #12: `pitti-decision-counterfactual-kernel`. No production ranking/scoring change.

Actual-kernel RNG parity run `32620973626` PASS: complete full-policy outputs byte-identical across COACH/BRIDGE_GREEDY/MARKET_ROSTER × baseline/stress after only replacing legacy RNG with snapshot-capable bit-equivalent RNG. Output SHA-256 `20e0b698978d1ee40988ba53132381f7193ab5469c2976333d6fac4d70bc574f`.

Actual-kernel causal plumbing run `32621088496` PASS: fresh seeds, treatment picks 9/12, shared-prefix identity, cloned RNG identity, zero treatment RNG consumption, legal complete drafts and actual FA pools.

## Direct counterfactual evidence
### MARKET_NEUTRAL breadth-100 — PASS
Run `32623713022`, artifact `rc459-cf-market-breadth100`, digest `sha256:fbc78b672851c895548f52d6ac77a6e0297ae614d1ab6860427c71cdfc603a38`: 200 fresh states and 2,000 complete MARKET_NEUTRAL branches. Broad direct A/B evidence does NOT reproduce Brown-always-1.09 or Bowers-always-2.02. Evaluator lenses disagree materially, confirming no single evaluator should dictate strategy.

### Targeted PairSum-vs-neutral — PASS mechanically, mechanism rejected at 2.02
Run `32623556347`, artifact `rc459-cf-targeted-pairsum`, digest `sha256:0aa62faa7d210397a7f83bdaf9d97eedc60bc3842c7098b59aa10e6e7ae142bf`: 3 fresh seeds, 56 complete raw causal branches, `outcome_evaluated=false`. PairSum consistently improves aggregate selected-panel rank while worsening aggregate ADP and can produce 7-RB/8-WR rosters. The later isolated audit proves its 2.02 future-board term is too flat to be trusted as opportunity-cost evidence.

## FA-enriched shallow-league evidence — PASS
FA-enriched harness persists the complete 230-player skill-pool snapshot and requires 100% metadata join coverage for every actual final FA id. Fresh run `32626387276` PASS: 20 fresh seeds, 40 states, 399 complete branches, 37,526 FA references, 0 missing metadata.

Actual-FA replacement diagnostic `research/rc459_fa_replacement_diagnostic_2026.js` PASS. It is a panel/ADP scarcity diagnostic, NOT an outcome model.

Across 399 MARKET_NEUTRAL branches:
- mean roster counts: QB 1.01, RB 6.04, WR 6.69, TE 1.26;
- mean players beyond maximum simultaneous healthy-start capacity: QB 0.01, RB 3.04, WR 2.69, TE 0.01;
- best actual FA selected-panel rank averages: QB 114.4, RB 132.2, WR 137.2, TE 131.8;
- best actual FA ADP averages: QB 148.6, RB 152.2, WR 157.1, TE 135.3.

Marginal-depth signal: worst drafted RB minus best actual FA panel rank median -21.76, p90 +26.94; worst drafted WR minus best actual FA median -1.35, p90 +11.35. Negative means drafted player is better. Deepest WR is often close to replacement and in a meaningful tail worse than a post-draft FA; deepest RB has more median cushion but also a replaceable tail. Best bench-vs-best-FA gap remains much larger (RB median ~-68.3; WR ~-23.2), so do not globally devalue bench depth. The target is marginal depth economics.

## Evaluator alignment warning
`MARKET_OUTCOME_BRIDGE_2026.json` is historical Sleeper ADP -> realized weekly Half-PPR neighbor forecasting; MARKET_ROSTER also selects mainly by current Sleeper ADP. Thus this anchor structurally favors ADP-like policies and remains a market-regret guardrail, not sole strategic truth. Do not tune PITTI toward MARKET_ROSTER merely to close its gap.

## Outcome/title layer correction
Existing `rc459_dynamic_championship_utility_challenger_2026.py` is NOT a true P(title) model: it sums weeks 1-14 empirical weekly win probabilities. Treat it as regular-season/startability utility only. True title-probability requirements are preregistered in `research/TITLE_PROBABILITY_CHALLENGER_SPEC_2026-08-23.md`. Actual playoff team count/start week/byes/seeding/bracket rules remain unresolved in reliable artifacts, so `TITLE_RULES_UNRESOLVED` must fail closed rather than invent defaults.

## External plausibility sanity
Fresh Aug-20/21 expert/market sanity places the realistic 1.09 elite window around Cook/Amon-Ra/JSN/Taylor and possible fallers such as Jefferson/Jeanty, not Chase Brown/Bowers. This is a guardrail, not an instruction to copy ECR.

## Parallel-work rule
Whenever a long Actions/simulation job is active, automatically use independent capacity on outcome-challenger, shallow-league FA/waiver, panel-vs-market disagreement, TAKE/WAIT, health/role, opponent-realism, championship-tail, harness/audit and draft-day usability work where useful. Do not return merely because a healthy long run is still computing.

## Immediate next actions
1. Build direct candidate counterfactuals at 2.02 across realistic 1.09 paths. Candidate set must be outcome-blind and availability-conditioned; branch plausible Lamb/Saquon/Jeanty/Jefferson/Walker/Brown etc. only when actually available and defensible at 2.02.
2. Clone RNG identically after the forced 2.02 candidate and give every child identical MARKET_NEUTRAL continuation through pick 150; persist complete roster and actual FA ids/player-pool metadata.
3. Evaluate direct candidate branches separately with regular-season/startability utility, actual-FA replacement-aware marginal depth, selected-panel quality, and market-regret/ADP. Preserve conflicts; no scalar collapse until justified.
4. Any replacement lookahead must estimate roster-conditioned/startability/replacement or direct downstream branch value, be preregistered, and use fresh held-out states. No player-specific symptom patch.
5. Extend isolation to 4.02 only after 2.02 direct candidate evidence is understood.
6. Resolve real playoff rules before reporting true P(title); no fabricated defaults.
7. No production promotion yet.