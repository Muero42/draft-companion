# PITTI actual-FA replacement raw audit — 2026-08-23

Research diagnostic only; no production scoring change.

Source: Actions run 32625856925, artifact `rc459-cf-fa-enriched20`, digest `sha256:1e32b530322ed5e673092b7186669149c5fbaefac11fa97a5c066a535665cbff`.
The artifact contains 40 causal rows and 399 complete draft branches with a full persisted player-pool snapshot, allowing every actual post-draft FA id to be joined to panel rank and Sleeper ADP. This removes the prior partial-metadata blocker.

## Best actual free agent by position across 399 branches
Lower rank/ADP is better.

### Panel-rank lens
- RB: mean 132.16, median 131.83. Best-FA identity: Keaton Mitchell 330/399, Tank Bigsby 56, Jonah Coleman 11, Chris Rodriguez Jr. 1, MarShawn Lloyd 1.
- WR: mean 137.21, median 131.35. Identity: Denzel Boston 221, Keenan Allen 124, Rashid Shaheed 37, Jalen Coker 15, Khalil Shakir 2.
- TE: mean/median 131.80; Juwan Johnson 399/399.
- QB: mean 114.41, median 112.33. Identity: Kyler Murray 315, Malik Willis 80, Jared Goff 4.

### Sleeper-ADP lens
- RB: mean 152.18, median 150.30. Most frequent best FA: Woody Marks 144, Alvin Kamara 133, Brian Robinson Jr. 96.
- WR: mean 157.07, median 157.20. Most frequent: Denzel Boston 183, Ja'Kobi Lane 113, Rashid Shaheed 70.
- TE: mean 135.32, median 125.80. Most frequent: Oronde Gadsden II 214, Hunter Henry 171.
- QB: mean 148.60, median 149.90. Most frequent: Baker Mayfield 313, Kyler Murray 47, Jared Goff 33.

## Interpretation limits
These are availability/rank-floor diagnostics, NOT replacement fantasy-point values and NOT direct draft recommendations. Panel and market disagree substantially, especially at QB/TE. Do not infer that a position should be delayed merely from these ordinal ranks.

What is supported: a 10-team, 15-round draft leaves meaningful named options at every position; marginal bench value must therefore be compared with actual waiver/replacement utility rather than raw roster-rank sums. The complete metadata now makes that comparison feasible without re-running these drafts.

## Next analysis contract
Use the actual FA identities per branch and a frozen independent weekly/startability forecast to estimate marginal roster-slot value. Bench players receive value only through realistic substitution/startability/contingent-upside logic. Keep ADP and selected expert panel as diagnostics/guardrails, not the sole outcome target.