# Expert-v2 exact Return-v2 A/B — 2026-08-26

Kernel pin: `9ba6db89fc1e7550052a7526bd0c68d6cc7459dc`

## Result

- **Control Return-v2 parity: exact.** For every captured prediction in all 14 fixtures with a return pick, the extracted harness reproduces the stored rc4.64 Return-v2 probability exactly (MAE 0, max error 0).
- **Control decision parity: 14/15 leaders.** The only mismatch is pick 92, the already-preregistered provenance boundary: stored fixture semantics are rc4.63 whereas current-kernel rc4.64 correctly applies the QB2 marginal-value safety behavior.
- **Expert-v2 fails promotion in its current weights/source form.** Full Return-v2 recomputation does not remove the material regression at pick 149: with QB1 already rostered, v2 promotes Kyler Murray to #1. Late WR saturation also remains problematic at picks 129/132.
- This is a panel-treatment failure signal, not permission to tune player names, hard-cap positions, or retune Return-v2. Incumbent remains unchanged/selectable.

## Natural fixture leaders

| Pick | Roster before pick | rc4.64 control | Expert-v2 | Assessment |
|---:|---|---|---|---|
| 9 | QB0/RB0/WR0/TE0 | James Cook | James Cook (RB) | same |
| 12 | QB0/RB1/WR0/TE0 | Brock Bowers | Justin Jefferson (WR) | changed |
| 29 | QB0/RB1/WR1/TE0 | Chris Olave | Chris Olave (WR) | same |
| 32 | QB0/RB2/WR1/TE0 | Chris Olave | Chris Olave (WR) | same |
| 49 | QB0/RB2/WR2/TE0 | Ladd McConkey | Ladd McConkey (WR) | same |
| 52 | QB0/RB2/WR3/TE0 | Jaylen Waddle | Jaylen Waddle (WR) | same |
| 69 | QB0/RB2/WR4/TE0 | Parker Washington | Tucker Kraft (TE) | changed |
| 72 | QB0/RB2/WR4/TE1 | Parker Washington | Parker Washington (WR) | same |
| 89 | QB0/RB2/WR5/TE1 | Justin Herbert | Justin Herbert (QB) | same |
| 92 | QB1/RB2/WR5/TE1 | Stefon Diggs | Jordan Addison (WR) | changed |
| 109 | QB1/RB3/WR5/TE1 | Stefon Diggs | Josh Downs (WR) | changed |
| 112 | QB1/RB3/WR6/TE1 | Stefon Diggs | Stefon Diggs (WR) | same |
| 129 | QB1/RB4/WR6/TE1 | Jalen Coker | Xavier Worthy (WR) | WR saturation watch |
| 132 | QB1/RB5/WR6/TE1 | Jalen Coker | Romeo Doubs (WR) | WR saturation watch |
| 149 | QB1/RB6/WR6/TE1 | Jalen Coker | Kyler Murray (QB) | FAIL: QB2 regression |

## Consequence

Do **not** integrate/promote the current Expert-v2 candidate. Preserve it as shadow evidence. The next research question is whether the failure is caused by source/weight construction or by a decision-surface issue shared by both arms. Because the exact rc4.64 control behaves correctly at pick 149 while v2 does not, the primary diagnosis is panel-quality/value-safety interaction, not Return-v2 parity.

No production/main/gh-pages/device mutation is authorized by this result.
