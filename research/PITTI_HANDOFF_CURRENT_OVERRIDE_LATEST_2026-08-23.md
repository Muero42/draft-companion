# PITTI handoff CURRENT LATEST override — 2026-08-23

READ AFTER `PITTI_HANDOFF_CURRENT_OVERRIDE_2026-08-23.md`. This file supersedes that file's **Immediate next actions** and any older first-turn simulation conclusions where they conflict. It does not supersede the verified league configuration or invalidation history.

## Latest verified state
New primary research harness `research/rc459_verified_current_market_pair_harness_2026.js` PASS in run `32632366086`.
- 80 fresh seeds.
- 484 realistic pick-9-conditioned states.
- 5,835 complete full-draft branches.
- Uses verified user 9 -> Dutch 10/11 -> user 12 geometry.
- Uses the frozen Sleeper-derived Half-PPR market updated 2026-08-22 for early opponent availability.
- Retains Dutch roster/history modifiers.
- Pick 9 primary candidates are realistic RB/WR with Sleeper market <=14 plus actual earlier fallers when available. This correctly includes Cook, Lamb, Saquon, Jeanty, Achane, Jefferson and genuine top fallers. Previous 'core four' framing was incomplete.
- Pick 12 uses realistic RB/WR/TE market <=24.5. Josh Allen remains excluded from primary 2.02 strategy. Brown/Bowers remain excluded at 1.09 but may be legitimate 2.02 alternatives.
- Exact verified starter topology, independent weeks-1-14 bridge lens and actual final FA pool are retained for every branch.

Detailed result note: `research/FIRST_TURN_VERIFIED_CURRENT_MARKET_RESULTS_2026-08-23.md`.

## Strongest new structural conclusion
For the SAME unordered two-player pair, reversing order usually changes little downstream once both players are actually acquired:
- Cook->Jefferson vs Jefferson->Cook: n=9 common feasible seeds, 2-0 with 7 ties on independent full-roster weeks1-14 utility.
- Lamb->Jefferson vs reverse: n=32, 1-1 with 30 ties.
- Jeanty->Jefferson vs reverse: n=60, 3-1 with 56 ties.
- Saquon->Jefferson vs reverse: n=62, 1-5 with 56 ties.
- Achane->Jefferson vs reverse: n=71, 1-1 with 69 ties.
Therefore TAKE/WAIT value is predominantly the asymmetric probability the other player survives Dutch's two picks, conditional on intrinsic player values being close, rather than a package-synergy optimizer.

## Availability direction remains robust
Previously completed market-dispersion sensitivity remains valid and is now reinforced by full branches:
- Cook/Lamb first -> Jefferson returns materially more often than Jefferson first -> Cook/Lamb.
- Jeanty first -> Jefferson has a smaller but stable return advantage over Jefferson first -> Jeanty.
- This is sequencing evidence only; intrinsic player value may override.

Middle-dispersion full-harness descriptive survival examples:
- Cook first: Jefferson 82.8%, Jeanty 64.1%, Saquon 56.2%, Lamb 14.1%.
- Lamb first: Jefferson 94.2%, Jeanty 69.6%, Saquon 53.6%, Cook 2.9%.
- Saquon first: Jefferson 92.3%, Jeanty 76.9%, Lamb 42.3%, Cook 5.1%.
- Jeanty first: Jefferson 89.3%, Saquon 82.7%, Lamb 36.0%, Cook 6.7%.
- Achane first: Jefferson 93.7%, Jeanty 75.9%, Saquon 83.5%, Lamb 43.0%, Cook 11.4%.
- Jefferson first: Jeanty 75.9%, Saquon 84.8%, Lamb 41.8%, Cook 11.4%, Achane 94.9%.
Point values are model snapshots, not literal draft probabilities; use sensitivity ranges/LOW-MID-HIGH on draft day.

## Evaluator disagreement — fail closed on a winner
Selected expert panel and independent weeks1-14 bridge disagree materially on some 2.02 players. The panel is high on Chase Brown / Kenneth Walker / Bowers; the bridge frequently likes Hampton/Henry or surviving top-turn players. This is NOT grounds to pick one scalar winner. Preserve both lenses and adjudicate with independent role/injury/decline evidence.

Fresh public Pat Fitzmaurice Half-PPR ranking (Aug 22) places Jeanty #9, Bowers #10, Jefferson #11, Cook #12, Walker #13, Chase Brown #14, Saquon #15, Lamb #16, Achane #17. This independently confirms Brown at pick 12 is a plausible small reach/turn candidate, not a 1.09 candidate and not an automatic 2.02 pick.

## Fresh health materiality
Christian McCaffrey has recently missed 49ers practice with soreness/tightness. Current team/credible reporting treats it as health-related and likely precautionary rather than a confirmed major injury, but CMC must be re-checked before an automatic faller TAKE at 1.09.

## Immediate next actions — superseding older list
1. Adjudicate intrinsic value for the realistic first-turn group (faller tier plus Cook/Lamb/Saquon/Jeanty/Achane/Jefferson and realistic 2.02 alternatives) using separate expert-quality, role/usage, injury/decline and independent-outcome evidence. Do not collapse disagreements into a new scalar optimizer.
2. Build the actual first-turn decision map on common pre-pick states: clear TAKE fallers; then sequencing rules for close candidates; then 2.02 trigger hierarchy based on who actually survives Dutch 10/11.
3. Explicitly test Brown/Walker/Bowers/Hampton/Henry only as realistic 2.02 alternatives against surviving first-turn players. No deterministic Brown/Bowers outcome is acceptable without broad independent agreement.
4. Run full realistic mocks once first-turn map is stable; then move to 3.09/4.02 (Olave/Nabers/Flowers plus real fallers).
5. Continue current injury/role/news monitoring in parallel; integrate only material changes.
6. No production strategy overhaul. Existing Late-QB / late-TE preference remains baseline unless unusually strong evidence clears the high promotion threshold.