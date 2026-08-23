# PITTI handoff current override — 2026-08-23

This file supersedes stale immediate-next-action sections in `PITTI_HANDOFF_2026-08-22.md`. Canonical `/Pitti/PITTI_PROJECT_STATE.md` remains Source of Truth and should be read to EOF first when available.

## PRIMARY OPERATING CORRECTION — market-realistic strategy refinement
Recent research drifted away from the actual draft objective. Effective immediately, research candidates and production strategy candidates are separate concepts.

The goal is NOT to discover mathematically interesting reaches. The goal is to refine the already strong practical draft strategy using realistic availability at the user's actual picks. Existing strategic priors (Late QB, very-late TE/streaming acceptable, early skill-position quality, late RB/upside, TAKE/WAIT opportunity cost) remain the baseline and are changed only by strong, independently validated evidence.

### Hard Reality Gate
Before a player may enter the PRIMARY strategy/counterfactual frontier at an own pick:
1. he must be realistically available at that pick under current market/draft-room evidence and opponent profiles; and
2. selecting him there must be market-plausible, not a major reach, unless independently validated evidence is strong enough to justify explicitly testing a reach.

Research controls may violate this gate, but MUST be labeled CONTROL/REACH and MUST NOT be mixed into primary strategy averages, candidate rankings, TAKE/WAIT maps, or recommendations.

Current concrete correction: Josh Allen around current FantasyPros overall #38 is NOT a realistic primary candidate at 2.02/pick 12. His prior 2.02 utility signal is retained only as evaluator-diagnostic evidence and must not drive draft strategy. Likewise Brown/Bowers at 1.09 are controls, not primary options.

### Current 1.09 availability interpretation
Correct the previous wording. Jeanty and Jefferson are normal/plausible 1.09 core candidates; Cook is also in the normal window. Amon-Ra, Taylor and especially JSN should be modeled more as favorable fallers when still available at 1.09, subject to refreshed Sleeper/market evidence. Do not treat Jefferson/Jeanty mainly as rare fallers.

### Simulation objective
Prioritize realistic complete drafts and conditional pick-pair decisions:
- 1.09 -> 2.02;
- 3.09 -> 4.02;
- subsequent turns only after earlier-turn realism is calibrated.
Compare realistic combinations (e.g. RB/WR construction, WR/RB construction, true value fallers) under opponent/availability distributions. Do not let a broad panel threshold such as `panel<=22` admit implausible reaches into the primary frontier.

## Invalidated/rejected research paths
- Original turn-pair probe: INVALID. Candidate-score mutation caused recursive/order-dependent inflation and the 20/20 Chase Brown 1.09 artifact. Never reuse its outcomes.
- Rolling-v1: INVALID. Long-gap future quality used current top-5 fallback instead of actual future board.
- Joint-v1 z-score aggregation: REJECTED. Separate z-scaling amplified tiny future-board differences and allowed implausible Bowers 1.09 choices.
- PairSum-v2 LONG2 at 2.02: REJECTED. Its future-board term is effectively flat and it collapses toward current selected-panel rank; deterministic Chase Brown 2.02 is mechanism failure, not strategy evidence.

## Direct 2.02 research — retain data, invalidate broad frontier for strategy
The 31-state / 375-branch direct 2.02 experiment remains valid as a causal RESEARCH artifact, but its frontier rule (`ADP<=22 OR panel<=22`) is too broad for primary strategy because panel admission can create unrealistic reaches. Do not discard the branches; reclassify them by Reality Gate and analyze only market-realistic subsets for strategy refinement.

The weeks 1-14 outcome challenger is also retained as evaluator research. Its Josh Allen-at-2.02 result is a useful warning about cross-position evaluator calibration, NOT evidence to draft Allen at 2.02. Audit QB calibration in parallel only if it does not displace higher-value realistic draft work.

## FA/shallow-league evidence — retain
FA-enriched run remains useful: 399 branches, complete FA metadata. Good bench depth has value, but deepest WR and some deepest RB slots approach replacement. Use this for marginal-depth economics, not blunt roster caps.

## Outcome/title layer
Existing weeks 1-14 utility is NOT P(title). True title-probability work remains fail-closed until actual playoff rules are resolved. Do not let this block realistic mock/strategy refinement.

## Parallel-work rule
Whenever a long job is active, use independent capacity on realistic availability calibration, opponent realism, current player/role/injury evidence, conditional TAKE/WAIT maps, FA marginal value, harness/audit, and draft-day usability. Research infrastructure must not crowd out realistic draft preparation.

## Immediate next actions — priority order
1. Rebuild/verify the realistic market frontier at 1.09 and 2.02 from fresh current evidence, explicitly separating CORE / PLAUSIBLE FALLER / REACH-CONTROL.
2. Reclassify the existing 375 direct 2.02 branches under that Reality Gate. Exclude Allen and other material reaches from primary strategy comparisons without deleting them from research diagnostics.
3. Reweight 1.09 paths realistically: Jeanty/Jefferson/Cook as normal core; Amon-Ra/Taylor/JSN as favorable fallers subject to fresh availability evidence.
4. Run realistic 1.09->2.02 conditional comparisons and complete mocks. Compare combinations, not isolated formula scores. Preserve existing strategy unless robust evidence supports a change.
5. Then move to realistic 3.09->4.02 decisions, including the already important Olave/Flowers/Nabers range and genuine TE fallers where applicable.
6. Keep current injury/role/depth-chart/news refresh active and integrate only material changes.
7. No production promotion from the broad research frontier. Production changes require Reality Gate + held-out validation + practical draft plausibility.