# PITTI handoff current override — 2026-08-23

This file supersedes stale immediate-next-action sections in `PITTI_HANDOFF_2026-08-22.md`. Canonical `/Pitti/PITTI_PROJECT_STATE.md` remains Source of Truth and should be read to EOF first when available.

## Invalidated/rejected research paths
- Original turn-pair probe: INVALID. Candidate-score mutation caused recursive/order-dependent inflation and the 20/20 Chase Brown 1.09 artifact. Never reuse its outcomes.
- Rolling-v1: INVALID. Long-gap future quality used current top-5 fallback instead of actual future board.
- Joint-v1 z-score aggregation: REJECTED. Separate z-scaling amplified tiny future-board differences and allowed implausible Bowers 1.09 choices.
- PairSum-v2 LONG2 at 2.02: REJECTED as opportunity-cost lookahead. Fresh isolated causal evidence shows its future-board term is effectively flat and it collapses toward current selected-panel rank; deterministic Chase Brown 2.02 is mechanism failure, not strategy evidence.

## PairSum-v2 mechanism finding — PASS, mechanism rejected
Isolated run `32626462084`: 16 valid shared-prefix states, 32 complete child drafts, 16/16 divergent. Corrected realistic 1.09 frontier was frozen before outcome inspection: James Cook III, Amon-Ra St. Brown, Jaxon Smith-Njigba, Jonathan Taylor, Justin Jefferson, Ashton Jeanty; unavailable names omitted. Brown/Bowers are negative controls at 1.09.

At 2.02 MARKET_NEUTRAL selected CeeDee Lamb 8/16, Saquon Barkley 5/16, Ashton Jeanty 3/16; PairSum-v2 selected Chase Brown 16/16. PairSum package cost's future `meanNext` term is nearly constant across candidates (~25.15–25.17 representative) while current panel ranks differ materially. Do NOT add Brown-specific penalty; replace the estimand.

Persistent audit: `research/RC459_ISOLATED_2_02_AUDIT_2026-08-23.md`.

## Direct 2.02 multi-candidate counterfactual — RAW PASS
Preregistered spec: `research/DIRECT_2_02_CANDIDATE_COUNTERFACTUAL_SPEC_2026-08-23.md`.
Harness: `research/rc459_direct_2_02_candidates_2026.js`.
Held-out seed family 459288101-110.

Raw result is deterministic/reproducible across reruns:
- 31 realistic shared-prefix states;
- 375 complete child drafts;
- 12-13 qualifying candidates per state;
- frontier outcome-blind: actually available/legal and (`Sleeper ADP <= 22` OR `selected-panel rank <= 22`);
- every child receives identical MARKET_NEUTRAL continuation;
- 230-player metadata snapshot persisted and actual FA ids joinable;
- raw JSON SHA-256 `2b8f3758b3c9f1331f7c75356a8b7956b4006f164a3718f77cf21442afb195be`.

Availability note: always/common 2.02 candidates differ from rare fallers. A.J. Brown, Bowers, Achane, Chase Brown, Derrick Henry, Kenneth Walker, Nico Collins, Josh Allen, Drake London and Omarion Hampton qualify 31/31; Barkley, Jefferson, Jeanty, Lamb and occasional 1.09 elites are availability-conditioned. Never compare raw global means without n/shared-prefix conditioning.

## Direct 2.02 selected-panel diagnostic — PASS but panel-dependent
`research/rc459_direct_2_02_diagnostic_2026.js` is diagnostic only. Its selected-panel lineup proxy ranks Jefferson/Bowers/Chase Brown/Lamb/Walker/etc. relatively well. Because selected-panel rank is the value source, this can inherit the same panel beliefs and is NOT independent confirmation. Do not promote Bowers/Brown from it.

## Independent weeks 1-14 regular-season/startability utility — PASS
New evaluator: `research/rc459_direct_2_02_regular_season_utility_2026.py`.
Latest complete workflow run `32627590992` PASS; 31 states / 375 branches / 100% forecast coverage. Latest artifact ZIP digest `sha256:db42a7885a01119b9496de3e55f4d36be5250cd6d30ffa4b5f56459c94f903b7`.

The evaluator source-locks the historical `MARKET_OUTCOME_BRIDGE_2026.json` by Git blob SHA `99271617c09a279c904618eb9af15c2f2744d6c4`, verifies its gate and `selected_panel_not_used_in_fit=true`, then evaluates complete downstream rosters with actual league starter topology across weeks 1-14 against an empirical 2025 league skill-score CDF. It is deliberately NOT P(title).

Bridge gate itself is PASS OOS: 2024 n=258, MAE 2.906 vs position-only 3.701, Spearman .671; 2025 n=261, MAE 2.807 vs 3.692, Spearman .673. This supports use as an independent-ish market/outcome challenger, but because the forecast bridge is historically Sleeper-ADP-based it can still favor market-like valuations and must not be sole truth.

### State-normalized utility audit — IMPORTANT
`research/rc459_direct_2_02_utility_pairwise_2026.py` removes the misleading effect of differing candidate availability by measuring each candidate's regret/rank relative to the best candidate in the exact same shared state and computing pairwise deltas only where both candidates are present.

Across candidates with broad 31-state coverage, lower regret is better:
- Josh Allen: mean regret ~0.0965 expected wins over weeks 1-14; mean state rank ~3.16; n=31.
- Derrick Henry: ~0.1733; rank ~2.90; n=31.
- Omarion Hampton: ~0.1962; rank ~3.45; n=31.
- Kenneth Walker III: ~0.2375; rank ~5.48; n=31.
- Chase Brown: ~0.2612; rank ~6.23; n=31.
- De'Von Achane: ~0.2832; rank ~6.71; n=31.
- Bowers: ~0.58 regret / rank ~8.68; A.J. Brown ~0.60 / ~8.87; London/Nico worse under this lens.

Availability-conditioned fallers: Lamb n=6 mean regret ~0.1843; Jefferson n=19 ~0.1890; Jeanty n=16 ~0.2590; Barkley n=21 ~0.2619. Amon-Ra appears only n=2 and wins both states; James Cook only n=1, so neither small-n value should be generalized.

Pairwise broad-state signals from the independent regular-season lens:
- Josh Allen beats Chase Brown by ~0.165 expected wins on average across all 31 shared states; Allen better ~74% (Brown better ~23%, ~3% ties).
- Allen beats Kenneth Walker by ~0.141 across 31; Allen better ~71%.
- Allen beats Omarion Hampton by ~0.100 across 31; Allen better ~65%.
- Allen beats Derrick Henry by ~0.077 across 31, but Henry still wins ~39%; not a landslide.
- Allen beats Saquon by ~0.171 across 21 shared states; Allen better ~81%.
- Allen beats Jefferson by ~0.123 across 19; Allen better ~74%.
- Allen beats Jeanty by ~0.129 across 16; Allen better ~63%.
- Allen beats Lamb by ~0.128 across only 6; Allen better 4/6. Small n.

This is a materially different result from the selected-panel diagnostic and therefore valuable. It raises Josh Allen at 2.02 as a genuine *research signal* despite the user's Late-QB strategic preference. Late-QB remains context/tiebreaker, not a hard suppression; exceptional QB value must remain surfaced. However, DO NOT yet convert this into a draft rule: the bridge is ADP-derived, true title/tail value is unresolved, and per-position bridge calibration (especially QB vs RB/WR) has not yet been separately audited.

Conditional 1.09 path behavior also matters. Under 1.09 Cook (10 states), Allen is best/near-best frequently (state-win 50%, mean regret ~0.084). Under 1.09 Jeanty (10), Allen is very strong (60%, ~0.042). Under 1.09 Jefferson (10), Derrick Henry/Hampton/other RBs compete more strongly and Allen drops to mean rank ~5.2/regret ~0.173. Thus any future TAKE/WAIT rule must be conditional on first-round construction, not global.

## FA-enriched shallow-league evidence — PASS
Run `32626387276`: 20 fresh seeds, 40 states, 399 complete branches, 37,526 actual FA references, 0 missing metadata. Actual-FA replacement diagnostic is panel/ADP scarcity only, not outcome.

Across 399 MARKET_NEUTRAL branches mean roster counts: QB 1.01, RB 6.04, WR 6.69, TE 1.26. Best actual FA panel averages: QB 114.4, RB 132.2, WR 137.2, TE 131.8. Deepest WR is often near replacement (worst drafted WR minus best FA panel median -1.35; p90 +11.35); deepest RB has more median cushion (median -21.76) but a replaceable tail (p90 +26.94). Best bench alternatives remain well above waivers (RB median gap ~-68.3; WR ~-23.2), so do not globally devalue bench depth; target marginal depth.

## Evaluator alignment warning
The independent regular-season challenger does NOT use the selected 2026 expert panel in its fit, which is important. But `MARKET_OUTCOME_BRIDGE_2026.json` forecasts from historical Sleeper ADP neighbors, so it is not fully market-independent. Treat it as an independent-ish realized-outcome/startability challenger and market-reality anchor, not sole strategic truth.

## Outcome/title layer correction
Existing `rc459_dynamic_championship_utility_challenger_2026.py` is only weeks 1-14 regular-season/startability utility, not true P(title). True title-probability requirements are preregistered in `research/TITLE_PROBABILITY_CHALLENGER_SPEC_2026-08-23.md`. Actual playoff team count/start week/byes/seeding/bracket rules remain unresolved, so `TITLE_RULES_UNRESOLVED` must fail closed.

## External plausibility sanity
Fresh Aug-20/21 sanity places realistic 1.09 elite window around Cook/Amon-Ra/JSN/Taylor plus possible Jefferson/Jeanty fallers, not Chase Brown/Bowers. Guardrail only, not an instruction to copy ECR.

## Parallel-work rule
Whenever a long Actions/simulation job is active, automatically use independent capacity on outcome-challenger, shallow-league FA/waiver, panel-vs-market disagreement, TAKE/WAIT, health/role, opponent-realism, championship-tail, harness/audit and draft-day usability work where useful. Do not return merely because a healthy long run is still computing.

## Immediate next actions
1. Audit the historical market->weekly outcome bridge by position, especially QB vs RB/WR/TE, before treating the Josh Allen 2.02 signal as strategy evidence. Need OOS accuracy/calibration and replacement-relative behavior by position, not only aggregate gate.
2. Add actual-FA marginal-depth/startability deltas to the 375 direct branches using the branch-specific actual FA pool; distinguish starter value, useful bench value and replacement-level final depth.
3. Compare independent regular-season utility against selected-panel and market-regret signs within the SAME prefixes; preserve conflict and identify robust Pareto candidates rather than scalar-collapse.
4. Build conditional 2.02 TAKE/WAIT maps by 1.09 path. Explicitly test whether Allen's apparent edge survives a stronger position-specific outcome challenger and whether first-round RB vs WR changes the result.
5. Only after direct 2.02 evidence is understood, preregister held-out 4.02 direct branching. Do not resurrect PairSum-v2.
6. Resolve actual playoff rules before true P(title); no fabricated defaults.
7. No production promotion yet.