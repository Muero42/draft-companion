# PITTI handoff current override — 2026-08-23

This file supersedes stale immediate-next-action sections in `PITTI_HANDOFF_2026-08-22.md`. Canonical `/Pitti/PITTI_PROJECT_STATE.md` remains Source of Truth and should be read to EOF first when available.

## VERIFIED-DATA-ONLY REALITY GATE — CRITICAL
Current NFL Elite league geometry has now been frozen from the user's clear 2026-08-23 league screenshot in `research/VERIFIED_LEAGUE_CONFIG_2026-08-23.json` and is enforced by `research/rc459_verified_league_reality_audit_2026.js`.

Verified current league facts:
- 10 teams, 15-round snake;
- user slot 9 / Muerotechnik / @Muero;
- slot 10 Dutch High Flyers / @Gipfelstuermer / research alias `Dutch Marc`;
- user picks exactly 9,12,29,32,49,52,69,72,89,92,109,112,129,132,149;
- first turn exactly user 1.09 -> Dutch 1.10 -> Dutch 2.01 -> user 2.02;
- Dutch picks 10+11 are the SAME manager and the second decision must use the roster after the first;
- roster: QB1, RB1, WR2, TE1, FLEX W/R/T 1, FLEX W/R 1, K1, DEF1, BN6, IR1;
- therefore skill starting topology is QB1 plus six RB/WR/TE slots with RB 1-3, WR 2-4, TE 1-2; TE is eligible for only one of the flex slots.

Run `32630480753` and the gated realistic run `32630893379` both PASS the fail-closed reality audit. The existing full-policy research core was in fact already correct on the critical snake geometry: `USER_SLOT=9`, exact user-pick list, slot10=`Dutch Marc`, and the opponent function reads current `s.rosters[slot]` counts before every opponent choice. Therefore the assistant's recent conversational claim that the simulator itself had Marc/Dutch geometry wrong was false; the error was in the assistant narrative/reconstruction, not this validated core. Do not discard validated raw simulations merely because of that narrative error.

Screenshot policy: if any required screenshot value is not clearly readable, report it as unreadable and obtain a clearer/smaller crop. Never plausibly reconstruct names/settings from a blurry image when verified project data exist. Verified current config outranks memory/public defaults; conflicts fail closed.

## REALISTIC 1.09 -> 2.02 TURN RUN — GEOMETRY GATED PASS
Harness `research/rc459_realistic_turn12_2026.js`, raw SHA-256 `290ec8a9d09e00f3c66d7a470a14535367704519eba781a7ba15eb9f32e4639e` is now run only after the verified league-reality audit. It uses 20 fresh seeds, market-admitted strategy candidates only, exact Dutch picks 10+11 through the validated roster-dependent opponent kernel, then identical continuation for every 2.02 branch.

Latest gated run `32630893379`: 81 raw states, 893 full branches. New `rc459_realistic_turn12_reality_diagnostic_2026.js` applies a generous opponent-major-reach diagnostic to Dutch picks 10/11: reject a state if current Sleeper ADP is >15 picks later than the actual pick. Two duplicated path-states from seed 459301005 are rejected because Dutch took Tyler Warren at 2.01 with ADP ~50.7; this is treated as an unrealistic opponent-tail draw rather than strategy evidence. 79 strategy-valid states remain.

CRITICAL faller result: EVERY ONE of the 79 valid states still has at least one market-anchor <=12 player available at 2.02. Thus the primary 2.02 question is NOT a board beginning at rank 13. It is which high-quality turn/faller survives Dutch's two picks and which 1.09 choice creates the best pair.

Conditional best market-anchored survivor at 2.02 in the current valid simulation:
- after Jefferson 1.09 (n=20): Jeanty 10, Lamb 7, Cook 3;
- after Cook 1.09 (n=17): Jefferson 14, Lamb 3;
- after Jeanty 1.09 (n=20): Jefferson 13, Lamb 6, Cook 1;
- after Lamb 1.09 (n=17): Jefferson 16, Cook 1;
- favorable top fallers at 1.09 have small n and must not be generalized yet: CMC n=2 -> Lamb/Jefferson; JSN n=1 -> Lamb; Amon-Ra n=2 -> Jefferson.

Interpretation is structural/availability evidence, not final player ranking. It strongly supports explicit TAKE/WAIT pair analysis around the turn and full inclusion of fallers at 2.02. Next work should evaluate these realistic pairs using multiple lenses and refresh/validate Dutch early-turn realism, not reopen exotic 1.09/2.02 reaches.

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
Jeanty and Jefferson are normal/plausible 1.09 core candidates; Cook is also in the normal window. Amon-Ra, Taylor and especially JSN should be modeled more as favorable fallers when still available at 1.09, subject to refreshed Sleeper/market evidence. Do not treat Jefferson/Jeanty mainly as rare fallers.

### Simulation objective
Prioritize realistic complete drafts and conditional pick-pair decisions: 1.09 -> 2.02 first; then 3.09 -> 4.02; subsequent turns only after earlier-turn realism is calibrated. Compare realistic combinations under opponent/availability distributions. Do not let broad panel thresholds admit implausible reaches into the primary frontier.

## Invalidated/rejected research paths
- Original turn-pair probe: INVALID. Candidate-score mutation caused recursive/order-dependent inflation and the 20/20 Chase Brown 1.09 artifact. Never reuse its outcomes.
- Rolling-v1: INVALID. Long-gap future quality used current top-5 fallback instead of actual future board.
- Joint-v1 z-score aggregation: REJECTED. Separate z-scaling amplified tiny future-board differences and allowed implausible Bowers 1.09 choices.
- PairSum-v2 LONG2 at 2.02: REJECTED. Its future-board term is effectively flat and it collapses toward current selected-panel rank; deterministic Chase Brown 2.02 is mechanism failure, not strategy evidence.

## Direct 2.02 research — retain data, invalidate broad frontier for strategy
The 31-state / 375-branch direct 2.02 experiment remains valid as a causal RESEARCH artifact, but its frontier rule (`ADP<=22 OR panel<=22`) is too broad for primary strategy because panel admission can create unrealistic reaches. Do not discard the branches; reclassify by Reality Gate. Josh Allen-at-2.02 is evaluator-diagnostic only, not strategy evidence.

## FA/shallow-league evidence — retain
FA-enriched run remains useful: 399 branches, complete FA metadata. Good bench depth has value, but deepest WR and some deepest RB slots approach replacement. Use this for marginal-depth economics, not blunt roster caps.

## Outcome/title layer
Existing weeks 1-14 utility is NOT P(title). The current regular-season evaluator DOES encode the verified asymmetric flex topology correctly: one W/R/T flex plus one W/R flex, TE max 2. True title-probability work remains fail-closed until actual playoff rules are resolved. Do not let this block realistic mock/strategy refinement.

## Parallel-work rule
Whenever a long job is active, use independent capacity on realistic availability calibration, opponent realism, current player/role/injury evidence, conditional TAKE/WAIT maps, FA marginal value, harness/audit, and draft-day usability. Research infrastructure must not crowd out realistic draft preparation.

## Immediate next actions — priority order
1. Build evaluator outputs specifically for the 79 reality-valid 1.09->2.02 states and compare PAIRS, not isolated players. Primary examples: Jefferson->Jeanty/Lamb/Cook; Cook->Jefferson/Lamb; Jeanty->Jefferson/Lamb/Cook; Lamb->Jefferson/Cook.
2. Add branch-specific actual-FA marginal depth and verified starter topology; compare RB+WR, WR+RB, WR+WR, RB+RB and TE only when genuinely available/value-sensitive.
3. Audit Dutch early-turn opponent realism beyond geometry: current kernel is roster-dependent and mostly market-plausible, but rare extreme tail reaches (e.g. Tyler Warren at 11) must be filtered/calibrated before strategy aggregation.
4. Refresh actual Sleeper/market availability probabilities and opponent-specific Dutch tendencies; do not use a single public ranking as probability truth.
5. Run realistic complete mocks after the pair layer, then move to 3.09->4.02 including Olave/Flowers/Nabers and genuine fallers.
6. Keep injury/role/depth-chart/news refresh active and integrate only material changes.
7. No production strategy overhaul. Promote only changes that pass verified data, market reality, held-out validation and practical draft plausibility.