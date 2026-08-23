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

## Direct 2.02 multi-candidate counterfactual — RAW + diagnostic PASS
Preregistered spec: `research/DIRECT_2_02_CANDIDATE_COUNTERFACTUAL_SPEC_2026-08-23.md`.
Harness: `research/rc459_direct_2_02_candidates_2026.js`.
Workflow run `32627158922` PASS on fresh held-out seed family 459288101-110.

Raw result:
- 31 realistic shared-prefix states;
- 375 complete child drafts;
- 12-13 qualifying candidates per state;
- candidate frontier fixed outcome-blind as actually available/legal and (`Sleeper ADP <= 22` OR `selected-panel rank <= 22`);
- every child receives identical MARKET_NEUTRAL continuation;
- 230-player metadata snapshot persisted and actual FA ids joinable;
- raw JSON SHA-256 `2b8f3758b3c9f1331f7c75356a8b7956b4006f164a3718f77cf21442afb195be`;
- latest artifact ZIP digest `sha256:bb798541b1a9690ada8ee174db953d344f06e34fda8105145e0effc79614bdf8`.

Availability note: across these held-out prefixes, the most common qualifying 2.02 candidates include A.J. Brown, Bowers, Achane, Chase Brown, Derrick Henry, Kenneth Walker, Nico Collins, Josh Allen, Drake London and Omarion Hampton (31/31); true fallers such as Barkley, Jefferson, Jeanty and Lamb are state-dependent. This is desired and prevents hand-picking a preferred shortlist.

Diagnostic-only script `research/rc459_direct_2_02_diagnostic_2026.js` PASS. Its selected-panel lineup proxy ranks the candidate branches on average (within-state rank; lower better): Justin Jefferson 3.89, Brock Bowers 4.48, Chase Brown 5.06, CeeDee Lamb 5.50, Kenneth Walker 5.55, Nico Collins 5.84, Ashton Jeanty 6.00, Drake London 6.32. This is NOT an independent outcome ranking: lineup quality is computed from selected-panel ranks and therefore can inherit panel bias. Do not promote Bowers/Brown from this result. Market/ADP diagnostic gives materially different ordering, confirming evaluator conflict remains.

Interpretation: direct branching solves the PairSum estimand problem, but current diagnostics still do not certify a 2.02 winner. The strongest value is now causal downstream rosters for every plausible candidate under the same continuation, ready for independent startability/outcome and actual-FA evaluation.

## Direct decision counterfactual path — kernel gates PASS
Actual validated kernel source is `research/rc459_full_policy_paired_2026.js` (58/58 source lock + exact rc4.59 Coach execution, profiled opponent kernel). Research branch/PR #12 `pitti-decision-counterfactual-kernel`; no production ranking/scoring change.

Actual-kernel RNG parity run `32620973626` PASS: byte-identical complete full-policy outputs across COACH/BRIDGE_GREEDY/MARKET_ROSTER × baseline/stress after only snapshot-capable bit-equivalent RNG replacement. Actual-kernel causal plumbing run `32621088496` PASS: shared-prefix/RNG identity, zero treatment RNG consumption, legal complete drafts, actual FA pools.

### MARKET_NEUTRAL breadth-100 — PASS
Run `32623713022`: 200 fresh states and 2,000 complete MARKET_NEUTRAL branches. Broad direct A/B evidence does NOT reproduce Brown-always-1.09 or Bowers-always-2.02. Evaluator lenses disagree materially.

## FA-enriched shallow-league evidence — PASS
Run `32626387276`: 20 fresh seeds, 40 states, 399 complete branches, 37,526 actual FA references, 0 missing metadata. Actual-FA replacement diagnostic is panel/ADP scarcity only, not outcome.

Across 399 MARKET_NEUTRAL branches mean roster counts: QB 1.01, RB 6.04, WR 6.69, TE 1.26. Best actual FA panel averages: QB 114.4, RB 132.2, WR 137.2, TE 131.8. Deepest WR is often near replacement (worst drafted WR minus best FA panel median -1.35; p90 +11.35); deepest RB has more median cushion (median -21.76) but a replaceable tail (p90 +26.94). Best bench alternatives remain well above waivers (RB median gap ~-68.3; WR ~-23.2), so do not globally devalue bench depth; target marginal depth.

## Evaluator alignment warning
`MARKET_OUTCOME_BRIDGE_2026.json` structurally favors ADP-like policies because it forecasts from historical Sleeper ADP neighbors while MARKET_ROSTER also selects mainly on Sleeper ADP. Use as market-regret guardrail, not sole truth.

## Outcome/title layer correction
Existing `rc459_dynamic_championship_utility_challenger_2026.py` is only weeks 1-14 regular-season/startability utility, not true P(title). True title-probability requirements are preregistered in `research/TITLE_PROBABILITY_CHALLENGER_SPEC_2026-08-23.md`. Actual playoff team count/start week/byes/seeding/bracket rules remain unresolved, so `TITLE_RULES_UNRESOLVED` must fail closed.

## External plausibility sanity
Fresh Aug-20/21 sanity places realistic 1.09 elite window around Cook/Amon-Ra/JSN/Taylor plus possible Jefferson/Jeanty fallers, not Chase Brown/Bowers. Guardrail only, not an instruction to copy ECR.

## Parallel-work rule
Whenever a long Actions/simulation job is active, automatically use independent capacity on outcome-challenger, shallow-league FA/waiver, panel-vs-market disagreement, TAKE/WAIT, health/role, opponent-realism, championship-tail, harness/audit and draft-day usability work where useful. Do not return merely because a healthy long run is still computing.

## Immediate next actions
1. Run independent regular-season/startability utility on the 375 direct 2.02 branches, preserving within-prefix comparisons and not relabeling it P(title).
2. Add actual-FA marginal-depth deltas to those same direct branches; distinguish starter value, useful bench value and replacement-level final depth.
3. Apply market-regret/ADP diagnostic and compare signs against selected-panel/startability; preserve conflict rather than scalar-collapse.
4. Inspect results conditional on 1.09 path and candidate availability; avoid averaging fallers with always-available candidates as if exposure were identical.
5. Only after direct 2.02 evidence is understood, preregister held-out 4.02 direct branching. Do not resurrect PairSum-v2.
6. Resolve actual playoff rules before true P(title); no fabricated defaults.
7. No production promotion yet.