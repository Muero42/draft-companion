# PITTI first turn — verified current-market results — 2026-08-23

Status: RESEARCH EVIDENCE, not production promotion.

## Source locks
- Verified league geometry: user slot 9; Dutch slot 10; first turn = user 9 -> Dutch 10 -> Dutch 11 -> user 12.
- Availability market: `SLEEPER_HALF_PPR_MARKET_ANCHORS_2026-08-23.json`, Sleeper-derived Half-PPR ADP updated 2026-08-22.
- Reality controls excluded: Chase Brown/Brock Bowers at 1.09; Josh Allen at 2.02.
- Current-market opponent sampling used through the early draft, with Dutch roster/history modifiers retained.
- Exact verified starter topology used by independent weeks-1-14 lineup lens; actual final FA pool retained for every branch.

## New harness
`research/rc459_verified_current_market_pair_harness_2026.js`, run `32632366086`: PASS.
- 80 fresh seeds.
- 484 realistic pick-9-conditioned states.
- 5,835 complete draft branches.
- Pick 9 primary universe is market-driven RB/WR ADP <=14, so it correctly includes not only Cook/Lamb/Jeanty/Jefferson but also Saquon Barkley and De'Von Achane when available, plus genuine earlier fallers.
- Pick 12 primary frontier is realistic RB/WR/TE market <=24.5, with Josh Allen excluded from primary strategy.

## Key structural result: sequencing mostly changes AVAILABILITY, not roster utility after the same pair is secured
Direct opposite-order comparisons use only seeds where BOTH exact sequences were feasible and then complete the draft under identical continuation.

Independent weeks-1-14 full-roster utility:
- Cook -> Jefferson vs Jefferson -> Cook: common n=9; Cook-first 2 wins, Jefferson-first 0, ties 7.
- Lamb -> Jefferson vs Jefferson -> Lamb: n=32; 1-1, ties 30.
- Jeanty -> Jefferson vs Jefferson -> Jeanty: n=60; Jeanty-first 3, Jefferson-first 1, ties 56.
- Saquon -> Jefferson vs Jefferson -> Saquon: n=62; Saquon-first 1, Jefferson-first 5, ties 56.
- Achane -> Jefferson vs Jefferson -> Achane: n=71; 1-1, ties 69.

Interpretation: once the SAME two players are actually acquired, order has very little downstream effect in most states. Therefore TAKE/WAIT should be driven primarily by (a) intrinsic player-quality differences and (b) the asymmetric probability that the other player survives Dutch's 10/11 turn, not by an invented package-synergy scalar.

## Tau=2.4 current-market conditional survival snapshot (descriptive, not exact forecast)
After Cook 1.09: Jefferson 82.8%, Jeanty 64.1%, Saquon 56.2%, Lamb 14.1%, Achane 92.2% survive to 2.02.
After Lamb 1.09: Jefferson 94.2%, Jeanty 69.6%, Saquon 53.6%, Cook 2.9%, Achane 92.8%.
After Saquon 1.09: Jefferson 92.3%, Jeanty 76.9%, Lamb 42.3%, Cook 5.1%, Achane 92.3%.
After Jeanty 1.09: Jefferson 89.3%, Saquon 82.7%, Lamb 36.0%, Cook 6.7%, Achane 93.3%.
After Achane 1.09: Jefferson 93.7%, Jeanty 75.9%, Saquon 83.5%, Lamb 43.0%, Cook 11.4%.
After Jefferson 1.09: Jeanty 75.9%, Saquon 84.8%, Lamb 41.8%, Cook 11.4%, Achane 94.9%.

These point values use one middle dispersion setting. The previously completed dispersion sensitivity remains the authority for robust ranges, especially Cook/Lamb/Jeanty vs Jefferson.

## Important evaluator disagreement — DO NOT collapse to one score
The selected expert panel currently rates several 2.02 players aggressively (e.g. Chase Brown / Kenneth Walker / Bowers), while the independent weeks-1-14 bridge often prefers other RB paths such as Hampton/Henry or a surviving top-turn player. This disagreement is useful evidence but means no single-lens winner is certified.

Current Pat Fitzmaurice Half-PPR rank check (Aug 22) independently confirms that Chase Brown at 2.02 is NOT an absurd market reach: Fitz #14 overall, while current Sleeper-derived ADP is ~16.6. He is therefore a legitimate secondary 2.02 candidate, but there is no evidence supporting deterministic Brown at 2.02, and he remains excluded from 1.09 primary strategy.

## Current practical map, before final intrinsic-value adjudication
1. Genuine top faller at 1.09 remains TAKE/value, but apply current health evidence rather than blindly treating the label as automatic.
2. Cook/Lamb vs Jefferson: availability strongly favors taking Cook/Lamb first if intrinsic value is judged close enough; same-pair downstream simulations show no meaningful reverse-order advantage.
3. Jeanty vs Jefferson: sequencing advantage is smaller but still generally Jeanty-first on availability; intrinsic value can override.
4. Saquon/Achane must now be explicitly included in realistic 1.09/2.02 analysis because current Sleeper-derived ADP places them in the actual turn window. Earlier core-four-only framing was incomplete.
5. Bowers/Brown/Walker can be real 2.02 alternatives; none should be auto-selected. Josh Allen remains out of the primary 2.02 strategy set.

## Fresh health note relevant to a faller
Christian McCaffrey has recently missed 49ers practice with soreness/tightness. Team reporting indicates the absence has been treated as precautionary / health-related rather than a confirmed major injury, but this is material enough that a CMC fall to 1.09 should be re-checked immediately before treating him as an automatic TAKE.

## Next
- Compare intrinsic value of the realistic turn group using separate expert/quality, independent outcome, decline/injury, and role/usage evidence; preserve disagreements.
- Build the actual 1.09 action map on common pre-pick states: what to take first and which surviving 2.02 options trigger TAKE/WAIT.
- Then run complete realistic mocks and move to 3.09/4.02. No new exotic optimizer.