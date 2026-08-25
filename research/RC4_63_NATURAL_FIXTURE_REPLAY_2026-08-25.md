# rc4.63 natural-fixture challenger replay — 2026-08-25

## Source
Materialized/verified backup: `draft-companion-v7-backup-2026-08-24T19-40-47-213Z.json`, draft `1397557585325891584`.
All 15 own-pick fixtures are present: 9/12/29/32/49/52/69/72/89/92/109/112/129/132/149. The first three fixtures were created under rc4.60; the remaining 12 under rc4.63. This explains why a strict rc4.63-only fixture filter appeared to return 12 rather than 15.

## Replay method
Applied the isolated `decisionPriority` challenger exactly to each stored candidate set, using the actual roster position counts before the decision. This is an offline diagnostic only; chosen user picks are not treated as ground truth.

## Baseline top → challenger top → actual user choice
- 9: James Cook → James Cook → James Cook
- 12: Brock Bowers → Brock Bowers → Justin Jefferson
- 29: Chris Olave → Chris Olave → Jeremiyah Love
- 32: Chris Olave → Chris Olave → Chris Olave
- 49: Ladd McConkey → Ladd McConkey → Ladd McConkey
- 52: Jaylen Waddle → Jaylen Waddle → Jaylen Waddle
- 69: Parker Washington → Tucker Kraft → Tucker Kraft
- 72: Parker Washington → Parker Washington → Parker Washington
- 89: Justin Herbert → Justin Herbert → Justin Herbert
- 92: Trevor Lawrence → Blake Corum → Blake Corum
- 109: Stefon Diggs → Stefon Diggs → Josh Downs
- 112: Stefon Diggs → Rachaad White → Chris Rodriguez
- 129: Jalen Coker → Jonah Coleman → Jonah Coleman
- 132: Jalen Coker → Mike Washington → Keaton Mitchell
- 149: Jalen Coker → Jalen Coker → Jalen Coker

## What this validates
The challenger leaves the early/mid baseline leader unchanged through pick 52. It fixes the known sequencing/roster-reality cases at 69 and 92 and moves pick 129 from ordinary WR7 depth to Jonah Coleman, matching the desired late-RB timing direction. At pick 149 it correctly stops blind RB accumulation and returns to Jalen Coker.

## What remains unresolved
Pick 132 is the strongest warning against immediate promotion. The challenger chooses Mike Washington, while the actual decision was Keaton Mitchell. This is not automatically a challenger failure, but it exposes a missing distinction between `contingent upside` and `durable/standalone championship utility`.

At pick 132:
- Mike Washington: Coach 94, panel 127.94, ADP 159.9, Return 78.7%; panel ranks 82/100/135/152 (high disagreement; weighted median 135).
- Keaton Mitchell: Coach 80, panel 132.56, ADP 161.3, Return 82.6%; panel ranks 121/124/125/147 (materially tighter; weighted median 124).
- Jalen Coker: Coach 100, panel 111.7, Return 21.1%.

A generic late-RB boost plus WR7 penalty is therefore not sufficient evidence to distinguish which RB lottery ticket has the better championship-EV. Do not add a Mike-Washington-specific rule. Candidate reliability/robust-rank information and current role/evidence may need to enter only if independently validated.

## Timing-term sensitivity
The global `12*(1-Return)` urgency term is the minimum of the tested simple values {0,4,6,8,12} that flips pick 69 from Parker Washington to Tucker Kraft. At 112/129 the roster-state terms drive the desired movement even without the full urgency term. Since canonical Coach already contains Return-v2 scoring, this raises a real double-counting risk.

Therefore the running 120-seed A/B should be treated as a stress test of challenger-v1, not as a promotion candidate. If it causes material early/mid reordering or overreacts to low Return, prefer a v2 that narrows any extra timing adjustment to turn-sequencing states rather than globally adding Return urgency a second time.

## Gate status
- Natural-fixture breadth: PASS for coverage (15/15 recovered).
- Early/mid stability through pick 52: PASS in this natural path.
- Known QB2/WR-depth corrections: directionally PASS.
- RB lottery-ticket discrimination: UNRESOLVED (pick 132).
- Global extra Return urgency: UNRESOLVED / possible double count.
- Production promotion: NOT AUTHORIZED.

Keep rc4.63 production frozen until paired-scale and downstream utility evidence resolve these two open issues.