# WR-v2 only qualification gate

Research-only branch. Production rc4.64 is unchanged.

## Scope
Qualify only the WR component of Expert-v2 while QB/RB/TE remain exactly incumbent. Reuse the exact-return input and pinned decision-kernel semantics. Natural controls: picks 89, 92, 112, 129, 132, 149. Signal states: 69, 92, 112, 132, 149. No hard WR cap, player-name forcing, generic Return-v2 retune, or reactivation of rejected full-panel variants.

## Exact Return-v2 harness result
GitHub Actions run `32980105582`, job `98214379963`, completed SUCCESS on branch commit `2c54ffcdcdda8345c95ed10a03f1e49b688fb7d5`.

Control parity is now exact over the full captured comparison surface: 224 predictions = 215 direct Return-v2 + 9 production-fallback values, MAE 0, max error 0. This closes harness/parity debugging; do not reopen it without new contradictory evidence.

WR-only treatment materially changes simulated return geometry, including non-WR opportunity costs. Selected late-roster states:

- Pick 89, QB0/RB2/WR5/TE1: max Return delta 0.01222.
- Pick 92, QB1/RB2/WR5/TE1: max delta 0.06556; Jayden Reed 0.31444 -> 0.24889, Quentin Johnston 0.40667 -> 0.35444, Josh Downs 0.39444 -> 0.44556, Stefon Diggs 0.73556 -> 0.76889.
- Pick 112, QB1/RB3/WR6/TE1: max delta 0.04444; Stefon Diggs 0.01556 -> 0.04000, Romeo Doubs 0.52556 -> 0.49222; non-WR return values also move.
- Pick 129, QB1/RB4/WR6/TE1: max delta 0.06222; Xavier Worthy 0.75889 -> 0.69667, Jalen Coker 0.96222 -> 0.98000.
- Pick 132, QB1/RB5/WR6/TE1: max delta 0.05444; Jalen Coker 0.21111 -> 0.26556; RB/QB alternatives also move.

## Interpretation / next gate
Return-v2 recomputation alone is not a promotion criterion. Because a WR-only rank treatment changes opponent simulation and therefore cross-position return probabilities, WR-v2 must now be evaluated through the pinned rc4.64 decision surface / TAKE-WAIT and marginal roster utility, especially at WR5/WR6 states. Required checks remain: late-RB optionality, QB2 opportunity cost, and no reintroduction of the full-panel pick-149 QB2 regression.

Do not promote WR-v2 merely because individual WR rankings look preferable. Production/control remains rc4.64 and must remain selectable. Integration, if later qualified, is additive/selectable only.
