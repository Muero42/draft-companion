# rc4.63 championship-v4 natural-fixture sanity — 2026-08-25

Research-only analysis; no production mutation. This is a deterministic sanity check against the complete natural rc4.63 backup, not a promotion gate and not a substitute for the running 120-seed paired test.

Target mock: `1397557585325891584`, all 15 decision fixtures preserved in the verified Aug-24 backup.

## Relevant observed rc4.63 states
- Pick 69: Parker Washington Coach 100 / Return 75.7%; Tucker Kraft Coach 97 / Return 45.9%. Actual user sequence Kraft 69, Parker 72.
- Pick 92: after Justin Herbert filled QB1, Trevor Lawrence Coach 100 / Return 37.1%; Blake Corum Coach 99 / Return 4.8%.
- Pick 112: roster had six WR after Josh Downs at 109. Stefon Diggs Coach 100 / Return 1.6%; Rachaad White Coach 68 / Return 13.2%.
- Pick 129: Jalen Coker 100 / Return 96.2%; Jonah Coleman 99 / 97.0%; Mike Washington 89 / 99.1%; Keaton Mitchell 78 / 99.6%.
- Pick 132: Coker 100 / Return 21.1%; De'Zhaun Stribling 97 / 0.1%; Mike Washington 94 / 78.7%; Mitchell 80 / 82.6%.
- Pick 149: Coker 100; Mike Washington 91; several other contingent RBs behind. No further Return window exists.

## Deterministic v4 structural sanity
Applying the v4 decision-priority formula to these frozen candidate-state summaries yields the intended structural direction:
- 69 -> Tucker Kraft (local-turn timing among near peers)
- 92 -> Blake Corum (duplicate-QB opportunity cost)
- 112 -> Rachaad White (six-WR saturation + late RB option value)
- 129 -> Jonah Coleman
- 132 -> Mike Washington
- 149 -> Mike Washington

The 132/149 result is not treated as a demand that Washington must beat Mitchell by name. Fresh Aug-25 evidence independently strengthens Washington's current contingency case (first-team work while Jeanty is sidelined; current expert handcuff support), while Mitchell retains explosive/receiving sleeper evidence. The production model, if changed, must use generic evidence/roster/option-value semantics rather than a named-player bonus.

## Interpretation boundary
- The 69, 92 and 112 changes map directly to already-established natural-mock defects/sequence evidence.
- Picks 129/132/149 are final-roster option-value states. Picks 14/15 are expected to be the most likely later K/DST drop candidates, so a seventh RB can remain rational even after six RB are rostered; do not enforce a six-RB cap.
- Exceptional WR value/catalyst remains legal through the v4 slide fade; this must be checked in the 120-seed distribution rather than inferred from one mock.
- The 120-seed baseline already contains the validated no-safety-resurrection research architecture. Any eventual rc4.64 production integration must include that admissibility-before-safety correction explicitly; the scale result does not mean rc4.63 production already has it.
