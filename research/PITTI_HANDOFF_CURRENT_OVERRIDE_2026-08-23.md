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

The fail-closed reality audit repeatedly PASSes. The existing full-policy research core was already correct on the critical snake geometry: `USER_SLOT=9`, exact user-pick list, slot10=`Dutch Marc`, and the opponent function reads current `s.rosters[slot]` counts before every opponent choice. The assistant's recent conversational claim that the simulator itself had Marc/Dutch geometry wrong was false; the error was in assistant reconstruction/narrative, not this validated core.

Screenshot policy: if any required screenshot value is not clearly readable, report it as unreadable and obtain a clearer/smaller crop. Never plausibly reconstruct names/settings from a blurry image when verified project data exist. Verified current config outranks memory/public defaults; conflicts fail closed.

## VERIFIED CURRENT SLEEPER HALF-PPR MARKET — AVAILABILITY ANCHOR
Frozen file: `research/SLEEPER_HALF_PPR_MARKET_ANCHORS_2026-08-23.json` (commit `9b78de1b6e3317d68d111ca797ad0224cc16b24d`). Provenance: public Sleeper-derived Half-PPR ADP updated 2026-08-22. This is an AVAILABILITY anchor only; it does not replace independent player-quality evaluation.

Relevant current Sleeper-derived ADPs: CMC 5.1, Taylor 6.2, JSN 6.6, Amon-Ra 8.0, Cook 9.6, Lamb 10.5, Saquon 11.5, Jeanty 12.6, Achane 13.6, Jefferson 13.7, Hampton 15.6, Chase Brown 16.6, Henry 17.8, Walker 18.1, A.J. Brown 19.5, London 20.6, Bowers 22.1, Nico 23.1, McBride 24.1, Nabers 30.1, Olave 32.3, Flowers 41.6. Josh Allen's Sleeper-derived ADP is ~21 but he remains CONTROL/MAJOR REACH at pick 12 for this 1QB strategy; market availability alone cannot override the strategic/value gate.

This confirms the user's correction: Jeanty/Jefferson are normal/plausible 1.09 options, Cook/Lamb are also normal turn-core, while Amon-Ra/Taylor/JSN are progressively more favorable fallers.

## SLEEPER-MARKET 1.09 -> 2.02 CALIBRATION — PASS, AVAILABILITY ONLY
Harness `research/rc459_sleeper_market_turn12_calibration_2026.js`, corrected after a diagnosed syntax-scope failure, now PASSes. Run `32631519844`: 400 seeds, 2,416 conditioned states. It uses the verified Sleeper half-PPR anchors for early opponent availability while retaining canonical manager roster/history/trait modifiers. It does NOT certify strategy.

Modeled availability at pick 9 under the frozen market/kernel: Taylor 5.5%, JSN 9.25%, Amon-Ra 31.25%, Cook 76%, Lamb 89.25%, Saquon 94.25%, Jeanty 99.25%, Achane 99%, Jefferson 99%. These are model frequencies, not literal forecasts; their ordering is more important than point precision.

Dutch source-locked profile audit PASS (`research/rc459_dutch_profile_audit_2026.js`): 9 seasons, 2017-2025. Early position shares: RB 47.44%, WR 38.16%, QB 9.85%, TE 4.55%, compared with league early RB 46.18%, WR 39.38%. Thus Dutch has only a mild RB lean / mild WR underweight; huge Jefferson/Jeanty return rates cannot be explained by a strong Dutch WR-avoidance assumption.

## MARKET-DISPERSION SENSITIVITY — ROBUST TAKE/WAIT DIRECTION
Harness `research/rc459_turn12_market_dispersion_sensitivity_2026.js`, run `32631885072`, PASS. It keeps the verified Sleeper anchors and Dutch profile fixed and varies only early market dispersion `tau` across 1.35, 1.8, 2.4, 3.2, 4.2. These are sensitivity scenarios, not fitted confidence bounds.

Robust conditional return ranges across all five dispersion settings:
- Jeanty at 1.09 -> Jefferson survives to 2.02: **77.3%–91.8%**.
- Jefferson at 1.09 -> Jeanty survives: **71.4%–84.5%**.
- Cook at 1.09 -> Jefferson survives: **73.1%–86.1%**.
- Jefferson at 1.09 -> Cook survives: **15.5%–45.2%**.
- Lamb at 1.09 -> Jefferson survives: **72.9%–89.7%**.
- Jefferson at 1.09 -> Lamb survives: **40.9%–56.5%**.
- Jeanty at 1.09 -> Lamb survives: **36.4%–54.5%**.
- Lamb at 1.09 -> Jeanty survives: **67.1%–74.9%**.

The DIRECTION is stable across all tested dispersions: Jefferson is materially more likely to return after taking Jeanty/Cook/Lamb than Cook or Lamb are to return after taking Jefferson. Jeanty also remains more likely to return after Jefferson than Jefferson after Jeanty, but that asymmetry is much smaller than Jefferson-vs-Cook/Lamb.

Practical TAKE/WAIT implication, conditional on players being judged close enough in intrinsic value:
- **Do not simply take Jefferson first because he is available.** If paired with Cook or Lamb, current availability evidence strongly favors taking Cook/Lamb first and waiting on Jefferson.
- **Jeanty vs Jefferson is a much closer sequencing question.** Availability alone gives a modest Jeanty-first edge because Jefferson returns somewhat more often; final ordering must come from independent player value / roster utility.
- A genuine Amon-Ra/Taylor/JSN/CMC faller at 1.09 should normally be treated as TAKE/value and not sacrificed merely to optimize the return sequence, subject to independent value evidence.

Do not convert these ranges into exact probabilities for draft-day display until dispersion is empirically calibrated from comparable Sleeper draft-history data. Use confidence bands / LOW-MID-HIGH return risk rather than false point precision.

## FRESH ROLE / HEALTH EVIDENCE AUDIT — 2026-08-23
This layer is intrinsic-value evidence only. It must NOT redefine market availability.

- Chase Brown: current Bengals camp evidence is positive rather than alarming. Joe Burrow explicitly praised his year-over-year growth; Bengals camp reports note explosive runs. This supports Brown as a legitimate 2.02 comparison candidate, not a 1.09 primary candidate.
- Omarion Hampton: current evidence supports RB1/high-upside status, but Mike McDaniel has explicitly said the Chargers may ride the `hot hand` among Hampton, Keaton Mitchell and Kimani Vidal. Hampton remains the lead profile, but a pure bellcow assumption is too aggressive. This is a meaningful downside/role uncertainty to retain at 2.02.
- Kenneth Walker III: current evidence supports Kansas City lead-back status and strong efficiency/upside; recent preseason non-use appears consistent with veteran/starter management rather than an identified injury. Prior injury history remains part of downside risk. Treat as a real 2.02 RB comparison, not an automatic winner.
- Brock Bowers: current evidence says he is healthy after the 2025 knee issue and remains a centerpiece of the Raiders offense. This strengthens his intrinsic case at a market-realistic 2.02, but does not override roster economics/TE opportunity cost and does not promote him to 1.09.
- Jeanty: Raiders are developing Mike Washington Jr. specifically as a complement in Klint Kubiak's two-back system. Jeanty remains the lead back, but committee/touch-ceiling uncertainty is real and should remain in the Jeanty-vs-Jefferson/Cook/Lamb intrinsic comparison.

No fresh evidence in this audit justifies a first-turn strategy overhaul. The correct action is to carry these role/downside adjustments into the verified-current-market pair evaluation.

## REALISTIC 1.09 -> 2.02 OLD TURN RUN — QUARANTINED FOR STRATEGY
Harness `research/rc459_realistic_turn12_2026.js`, raw SHA-256 `290ec8a9d09e00f3c66d7a470a14535367704519eba781a7ba15eb9f32e4639e`, produced 81 states / 893 branches and had correct league geometry, but its user frontier used newer market anchors while opponents still sampled the older 90%-frozen-ADP/10%-panel market. Preserve it for diagnostics, but do not aggregate it into current strategy evidence.

## PRIMARY OPERATING CORRECTION — market-realistic strategy refinement
The goal is NOT to discover mathematically interesting reaches. The goal is to refine the already strong practical draft strategy using realistic availability at the user's actual picks. Existing strategic priors (Late QB, very-late TE/streaming acceptable, early skill-position quality, late RB/upside, TAKE/WAIT opportunity cost) remain the baseline and are changed only by strong, independently validated evidence.

### Hard Reality Gate
Before a player may enter the PRIMARY strategy/counterfactual frontier at an own pick:
1. he must be realistically available at that pick under current market/draft-room evidence and opponent profiles; and
2. selecting him there must be market-plausible, not a major reach, unless independently validated evidence is strong enough to justify explicitly testing a reach.

Research controls may violate this gate, but MUST be labeled CONTROL/REACH and MUST NOT be mixed into primary strategy averages, candidate rankings, TAKE/WAIT maps, or recommendations.

Current concrete correction: Josh Allen is NOT a realistic primary candidate at 2.02/pick 12 despite current Sleeper-derived ADP around 21. His prior 2.02 utility signal is evaluator-diagnostic only. Chase Brown/Bowers at 1.09 are controls, not primary options.

### Current 1.09 availability interpretation
Jeanty and Jefferson are normal/plausible 1.09 core candidates; Cook/Lamb are also normal turn-core under current market. Amon-Ra, Taylor and especially JSN should be modeled as favorable fallers when still available at 1.09. Do not treat Jefferson/Jeanty mainly as rare fallers.

### Simulation objective
Prioritize realistic complete drafts and conditional pick-pair decisions: 1.09 -> 2.02 first; then 3.09 -> 4.02. Compare realistic combinations under opponent/availability distributions. Do not let broad panel thresholds admit implausible reaches into the primary frontier.

## Invalidated/rejected research paths
- Original turn-pair probe: INVALID. Candidate-score mutation caused recursive/order-dependent inflation and the 20/20 Chase Brown 1.09 artifact. Never reuse its outcomes.
- Rolling-v1: INVALID. Long-gap future quality used current top-5 fallback instead of actual future board.
- Joint-v1 z-score aggregation: REJECTED. Separate z-scaling amplified tiny future-board differences and allowed implausible Bowers 1.09 choices.
- PairSum-v2 LONG2 at 2.02: REJECTED. Its future-board term is effectively flat and collapses toward current selected-panel rank; deterministic Chase Brown 2.02 is mechanism failure, not strategy evidence.

## Direct 2.02 research — retain data, broad frontier not strategy
The 31-state / 375-branch direct 2.02 experiment remains causal RESEARCH data, but its `ADP<=22 OR panel<=22` frontier is too broad for primary strategy. Josh Allen-at-2.02 is evaluator-diagnostic only.

## FA/shallow-league evidence — retain
FA-enriched research has complete actual-FA metadata. Good bench depth has value, but deepest WR and some deepest RB slots approach replacement. Use this for marginal-depth economics, not blunt roster caps.

## Outcome/title layer
Existing weeks 1-14 utility is NOT P(title). The regular-season evaluator encodes the verified asymmetric flex topology correctly: one W/R/T flex plus one W/R flex, TE max 2. True title-probability work remains fail-closed until actual playoff rules are resolved. Do not let this block realistic mock/strategy refinement.

## Parallel-work rule
Whenever a long job is active, use independent capacity on realistic availability calibration, opponent realism, current player/role/injury evidence, conditional TAKE/WAIT maps, FA marginal value, harness/audit, and draft-day usability. Research infrastructure must not crowd out realistic draft preparation.

## Immediate next actions — priority order
1. Build/complete the new **verified-current-market pair harness**, not reuse the quarantined 893 branches: actual Sleeper-derived market for opponent sampling; verified geometry; realistic available 1.09/2.02 candidates; identical continuation; full actual-FA metadata.
2. Evaluate realistic 9+12 PAIRS with separate lenses: selected-expert/player-quality, independent weeks-1-14/startability, actual-FA marginal depth, market/return regret. Carry the fresh Brown/Hampton/Walker/Bowers/Jeanty role-risk evidence above into this layer. Preserve disagreements; no exotic scalar optimizer.
3. Center first decision map on real cases: faller TAKE; Cook/Lamb vs Jefferson sequencing; Jeanty vs Jefferson close sequencing; then remaining realistic 2.02 value options.
4. Empirically calibrate market dispersion if comparable Sleeper draft-history data already exist in project artifacts; otherwise keep return as robust ranges rather than fitted point probabilities.
5. After first-turn map stabilizes, run realistic complete mocks and move to 3.09->4.02, including Olave/Flowers/Nabers and genuine fallers.
6. Keep injury/role/depth-chart/news refresh active; integrate only material changes.
7. No production strategy overhaul. Promote only changes that pass verified data, market reality, held-out validation and practical draft plausibility.