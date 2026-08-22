# Slot 9 5.09 -> 6.02 sequence map — rc4.59 parity evidence, 2026-08-22

Timing / sequencing only; Player Quality, roster construction and health remain separate axes. Source: PASS `RC459_DECISION_INSIGHTS_2026`, fresh freeze `5339a37d...`, rc4.59 profiled-baseline opponent kernel.

| Player | Panel | Sleeper ADP | P(return to 6.02) | Timing |
|---|---:|---:|---:|---|
| Colston Loveland | 31.54 | 44.4 | 16.24% | TAKE_FIRST_IF_TARGET |
| Garrett Wilson | 38.48 | 43.1 | 35.38% | MATERIAL_COLLISION_RISK |
| Tyler Warren | 42.64 | 50.7 | 52.49% | MATERIAL_COLLISION_RISK |
| Jaylen Waddle | 31.96 | 47.5 | 53.05% | MATERIAL_COLLISION_RISK |
| D'Andre Swift | 44.48 | 52.4 | 82.98% | WAITABLE_WITH_RISK |
| Terry McLaurin | 45.45 | 53.6 | 88.52% | WAITABLE_WITH_RISK |
| Jameson Williams | 48.30 | 57.6 | 94.73% | VERY_WAITABLE |
| Parker Washington | 58.23 | 74.4 | 99.75% | EXTREMELY WAITABLE at this turn |

## Practical sequencing implications
For two genuinely comparable targets:
- Loveland must normally be acquired before the later-market WR/RB group if he is actually the desired player; he survives the turn only ~16%.
- Garrett Wilson generally before Swift/McLaurin/Jamo on timing.
- Waddle / Tyler Warren are roughly coin-flip turn survivors; quality/roster need has more weight than for the extreme cases.
- Swift, McLaurin and especially Jamo can usually be sequenced second when paired with a lower-return target.
- Parker Washington should almost never be forced at 5.09/6.02 solely from fear of losing him; this model places his value much later. Preserve the previously established Parker target logic for the later window instead.

## Important strategy caveat
This table does not prove that Loveland or another TE should be selected in this range. Early-/mid-TE opportunity cost is a separate utility question. It says only that **if** Loveland is already inside the quality/roster target set, waiting from 49 to 52 is risky. Conversely, high return probability never makes a player worse; it makes WAIT cheaper.

Fresh health/evidence on 30/31 Aug and observed MANUAL/AUTODRAFT state override today's timing probabilities. Exact sequencing is re-evaluated at the live board.
