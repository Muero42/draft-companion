# Expert-v2 weight audit — 2026-08-26

Status: **RESEARCH / SHADOW ONLY — NOT PRODUCTION**.

## Binding locks
- Exact format: 2026, DRAFT/redraft, Overall, HALF-PPR, 1QB.
- Koerner: unavailable/paywalled for this draft; no further acquisition work.
- Derek Brown: excluded from NEW v2.
- Andrew Erickson: challenger only.
- Matt Harmon: WR evidence challenger only unless incremental value is demonstrated.
- Draft Sharks is ONE correlated source family; do not count Jody Smith + Jared Smola as separate votes.
- rc4.64 remains untouched/selectable for controlled A/B.

## Deterministic current-source freeze
Workflow run `32962328901` PASS on branch `pitti-expert-v2-weight-audit-20260826`, source-freeze commit `6eae2cf92a19defbfd2b0bb96a9800631b4e3837`.

Fresh exact boards captured and fail-closed validated:
- Nick Mariano / RotoBaller: Aug 25, 2026; 340 QB/RB/WR/TE rows; normalized SHA-256 `5ecae9578b0e8fa25e2dce41a14727add59012c8043d6437090a55a45ef70c33`.
- Draft Sharks Team: Aug 26, 2026; 162 QB/RB/WR/TE rows; normalized SHA-256 `f1e2e9a48258372f49a5617f1232f2a3fe181c320cf428603ee859656ab64e65`; source overall-tier coverage 100%.
- Pat Fitzmaurice / FantasyPros: Aug 26, 2026; 296 rows; normalized SHA-256 `7c2da927703a9c458311e0525d3a7fae409bdd552e5eceb54185a393b2753931`.
- Dalton Del Don / FantasyPros: Aug 25, 2026; 256 rows; normalized SHA-256 `1ec893fe1bf6cb316bdb6b112d24450a01d3258ff96e58a05a0e148340edd2f7`.

Justin Boone exact HALF/DRAFT FantasyPros expert-directory state is Aug 25, 2026 and therefore fresh/eligible under the final-week freshness gate. The older Yahoo article publication timestamp is not used as board freshness. The successful Android V3 export already supplies Boone's verified current individual cache; its full-board correlation still needs to be included in the final reproducible correlation artifact before promotion.

## Current-board rank redundancy
Analysis universe: common players by position, draft-relevant set where at least one compared source ranks the player <=180 overall. Pairwise Spearman rho / mean absolute overall-rank difference (MAD):

| Position | Pair | n | rho | MAD |
|---|---|---:|---:|---:|
| QB | Mariano–DS | 25 | .948 | 20.0 |
| QB | Mariano–Pat | 26 | .975 | 7.7 |
| QB | Mariano–Del Don | 26 | .956 | 10.9 |
| QB | DS–Pat | 25 | .962 | 19.4 |
| QB | DS–Del Don | 25 | .982 | 15.3 |
| QB | Pat–Del Don | 26 | .963 | 11.3 |
| RB | Mariano–DS | 48 | .977 | 20.8 |
| RB | Mariano–Pat | 58 | .970 | 15.0 |
| RB | Mariano–Del Don | 55 | .982 | 12.1 |
| RB | DS–Pat | 49 | .974 | 21.2 |
| RB | DS–Del Don | 48 | .972 | 19.1 |
| RB | Pat–Del Don | 60 | .976 | 11.8 |
| WR | Mariano–DS | 59 | .976 | 21.9 |
| WR | Mariano–Pat | 74 | .963 | 14.4 |
| WR | Mariano–Del Don | 73 | .978 | 10.8 |
| WR | DS–Pat | 58 | .963 | 20.9 |
| WR | DS–Del Don | 58 | .967 | 23.5 |
| WR | Pat–Del Don | 73 | .961 | 14.8 |
| TE | Mariano–DS | 18 | .975 | 37.6 |
| TE | Mariano–Pat | 23 | .973 | 19.2 |
| TE | Mariano–Del Don | 24 | .966 | 13.3 |
| TE | DS–Pat | 18 | .969 | 40.1 |
| TE | DS–Del Don | 18 | .930 | 36.7 |
| TE | Pat–Del Don | 25 | .958 | 18.7 |

Conclusion: all four currently frozen core sources are highly correlated. Additional voices should not receive large weights merely to increase panel size. Draft Sharks contributes the greatest absolute-rank displacement from Pat/Mariano on several positions despite high ordinal correlation; this supports treating it as one differentiated family, not multiplying it through individual DS analysts.

## Historical positional priors retained
FantasyPros 2023–2025 DRAFT-accuracy audit used for the pre-existing candidate:
- Draft Sharks/Jody Smith: overall #1, QB40/RB1/WR13/TE9.
- Nick Mariano: overall #6, QB48/RB11/WR8/TE77.
- Draft Sharks/Jared Smola: overall #7, QB23/RB14/WR14/TE120 (family-quality evidence only, not a second vote).
- Dalton Del Don: overall #17, QB56/RB7/WR76/TE21.
- Pat Fitzmaurice: overall #36, QB91/RB40/WR52/TE14.
- Boone 2025 DRAFT accuracy: overall #114, QB34/RB125/WR144/TE169. Do not confuse with his #1 2025 IN-SEASON result.

## Weight decision after current-board audit
The evidence does **not** justify an intuitive rewrite of the recovered candidate weights. Boone is fresh in the correct HALF/DRAFT directory, so the previously suspected freshness-based removal is rejected. The recovered candidate remains the correct hypothesis to test:

- QB: Draft Sharks 35 / Mariano 25 / Del Don 20 / Boone 10 / Pat 10
- RB: Draft Sharks 35 / Mariano 25 / Del Don 25 / Pat 15
- WR: Mariano 35 / Draft Sharks 30 / Pat 15 / Del Don 10 / Boone 10
- TE: Draft Sharks 35 / Pat 30 / Del Don 25 / Boone 10

These remain **provisional research weights, not production weights**. Correlation alone cannot identify an optimal linear weighting because all sources are highly correlated and historical accuracy is an imperfect prior. No source weight is promoted merely because it is historically accurate.

## Remaining promotion gates
1. Add Boone's current V3 board to the reproducible full-board correlation/marginal-value artifact; do not ask the user to re-export it unless the current captured text becomes technically inaccessible.
2. Measure leave-one-source-out and disagreement-cluster effects in real draft-relevant ranges/tier boundaries rather than optimizing global rho.
3. Run identical frozen-fixture A/B against rc4.64 with Coach, Return-v2, roster utility, manager model and scoring fixed.
4. Explicitly check WR-overdraft/high-WR-roster regression.
5. Only then decide whether any weights change and whether v2 earns an additional selectable app preset.
