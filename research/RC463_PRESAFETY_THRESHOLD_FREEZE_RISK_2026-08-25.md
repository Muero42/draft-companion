# rc4.63 Pre-Safety Threshold Challenger — Freeze-Risk Contract

Research only. Android/main/gh-pages rc4.63 remain frozen.

## Intended treatment surface
Only the post-`applyPlayerQualitySafetyGate` raw-score mutation for a Safety-promoted QB/TE is reversible when all are true: (1) that position is already rostered; (2) the promoted row was not the original pre-Safety natural leader; (3) it is not the existing `rosterExceptionPenalty` elite-slide exception; and (4) its ORIGINAL pre-Safety raw gap to the best legal RB/WR is below the tested threshold.

No changes to panel ranks, ADP, Return-v2, opponent simulation, RNG, manager profiles, roster need, late-upside logic, candidate visibility, hard exclusions, first QB/TE behavior, RB/WR scoring, player names, roster quotas, starter maxima, or Late-WR v3 logic.

## Existing exceptional-slide semantics preserved
The rc4.63 roster exception already defines an elite repeated QB as panel rank <=45 with current pick minus ADP >=35, and an elite repeated TE as panel rank <=35 with current pick minus ADP >=30. The threshold challenger preserves these cases rather than inventing a new exception definition.

## Promotion gates
1. Harness source/metadata anchors fail closed.
2. Shared metadata snapshot must equal the previously 120/120 parity-validated snapshot.
3. Boundary controls PASS at threshold-epsilon / threshold / threshold+epsilon.
4. Natural Pick 92 must correct the known ordinary-QB2 resurrection.
5. First QB/TE and RB/WR behavior must be unaffected by the treatment predicate.
6. Existing elite-slide exception must remain admissible.
7. Paired 120-seed decision/roster diff must be explainable solely by suppressed repeated-position Safety promotions.
8. Static and Pre-Week-1 repair-aware Championship Utility must not show material harm.
9. Freeze-risk review must prefer the smallest semantically robust treatment; prettier roster composition alone is insufficient.

No rc4.64 package is authorized by this document.