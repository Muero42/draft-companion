# PITTI Expert-v2 decision sensitivity — corrected source freeze (2026-08-26)

Status: RESEARCH/SHADOW ONLY. No production promotion.

Inputs: corrected Draft Sharks v5 parser freeze + Nick Mariano + Pat Fitzmaurice + Dalton Del Don. Boone remains part of the candidate hypothesis but its exact 264-row V3 export is not materialized in this runtime, so numeric sensitivity below renormalizes the available weights and must not be treated as final A/B certification.

## Key finding
Global Spearman similarity is high, but decision-level source influence is not uniformly small. Late WR/TE and several mid-round RB decisions are source-sensitive, so global correlation is insufficient to justify shrinking or increasing weights.

## QB highest leave-one-source-out sensitivity (score <=180)

| Player | v2 score* | source spread | max |LOO| | ranks |
|---|---:|---:|---:|---|
| C.J. Stroud | 175.2 | 58 | 21.5 | draftsharks 209, mariano 151, deldon 158, pat 152 |
| Malik Willis | 137.1 | 44 | 12.1 | draftsharks 156, mariano 123, deldon 134, pat 112 |
| Kyler Murray | 95.2 | 32 | 9.7 | draftsharks 80, mariano 112, deldon 93, pat 111 |
| Josh Allen | 31.4 | 28 | 7.2 | draftsharks 20, mariano 37, deldon 36, pat 48 |
| Daniel Jones | 147.7 | 29 | 7.2 | draftsharks 159, mariano 130, deldon 154, pat 140 |
| Baker Mayfield | 122.4 | 24 | 5.9 | draftsharks 131, mariano 107, deldon 126, pat 124 |
| Matthew Stafford | 109.9 | 23 | 5.7 | draftsharks 118, mariano 95, deldon 118, pat 103 |
| Patrick Mahomes | 99.9 | 27 | 5.4 | draftsharks 101, mariano 86, deldon 113, pat 105 |
| Jared Goff | 110.7 | 22 | 4.5 | draftsharks 115, mariano 99, deldon 121, pat 104 |
| Tyler Shough | 123.1 | 18 | 3.8 | draftsharks 120, mariano 133, deldon 115, pat 125 |

## RB highest leave-one-source-out sensitivity (score <=180)

| Player | v2 score* | source spread | max |LOO| | ranks |
|---|---:|---:|---:|---|
| Jonah Coleman | 175.1 | 96 | 25.3 | draftsharks 222, mariano 166, deldon 148, pat 126 |
| Mike Washington Jr. | 155.9 | 71 | 20.5 | draftsharks 194, mariano 148, deldon 123, pat 135 |
| Chris Rodriguez | 135.7 | 64 | 19.6 | draftsharks 172, mariano 108, deldon 111, pat 138 |
| MarShawn Lloyd | 169.9 | 57 | 18.9 | draftsharks 205, mariano 154, deldon 150, pat 148 |
| Tyler Allgeier | 168.2 | 55 | 17.6 | draftsharks 201, mariano 147, deldon 157, pat 146 |
| Keaton Mitchell | 157.3 | 50 | 12.8 | draftsharks 181, mariano 131, deldon 153, pat 153 |
| Aaron Jones | 140.1 | 46 | 11.8 | draftsharks 162, mariano 134, deldon 130, pat 116 |
| Zach Charbonnet | 165.8 | 61 | 10.7 | draftsharks 158, mariano 198, deldon 162, pat 137 |
| Rachaad White | 131.3 | 43 | 10.6 | draftsharks 151, mariano 121, deldon 128, pat 108 |
| Chuba Hubbard | 108.5 | 38 | 10.5 | draftsharks 128, mariano 90, deldon 108, pat 95 |

## WR highest leave-one-source-out sensitivity (score <=180)

| Player | v2 score* | source spread | max |LOO| | ranks |
|---|---:|---:|---:|---|
| Jalen Coker | 150.2 | 114 | 31.4 | mariano 120, draftsharks 213, pat 129, deldon 99 |
| Denzel Boston | 166.5 | 94 | 25.2 | mariano 150, draftsharks 217, pat 123, deldon 138 |
| Jalen Nailor | 173.2 | 62 | 24.0 | mariano 156, pat 218, deldon 166 |
| Khalil Shakir | 152.4 | 69 | 21.8 | mariano 127, draftsharks 196, pat 133, deldon 140 |
| Wan'Dale Robinson | 132.3 | 88 | 21.4 | mariano 124, draftsharks 175, pat 87, deldon 101 |
| De'Zhaun Stribling | 146.6 | 65 | 20.2 | mariano 122, draftsharks 187, pat 131, deldon 135 |
| Michael Wilson | 124.6 | 63 | 17.5 | mariano 97, draftsharks 149, pat 159, deldon 96 |
| Jalen McMillan | 165.6 | 57 | 16.7 | mariano 142, draftsharks 199, pat 168, deldon 144 |
| Rashid Shaheed | 152.3 | 48 | 15.8 | mariano 136, draftsharks 184, pat 136, deldon 139 |
| Josh Downs | 102.7 | 55 | 14.7 | mariano 89, draftsharks 132, pat 93, deldon 77 |

## TE highest leave-one-source-out sensitivity (score <=180)

| Player | v2 score* | source spread | max |LOO| | ranks |
|---|---:|---:|---:|---|
| Juwan Johnson | 164.7 | 108 | 40.3 | draftsharks 228, pat 128, deldon 120 |
| Hunter Henry | 178.7 | 88 | 32.6 | draftsharks 230, pat 142, deldon 151 |
| Dalton Kincaid | 125.3 | 77 | 29.1 | draftsharks 171, pat 98, deldon 94 |
| Isaiah Likely | 146.8 | 83 | 28.7 | draftsharks 192, pat 109, deldon 129 |
| Jake Ferguson | 161.1 | 79 | 27.3 | draftsharks 204, pat 141, deldon 125 |
| Dallas Goedert | 145.4 | 74 | 27.1 | draftsharks 188, pat 122, deldon 114 |
| Brenton Strange | 166.1 | 62 | 23.5 | draftsharks 203, pat 144, deldon 141 |
| Mark Andrews | 142.9 | 69 | 22.9 | draftsharks 179, pat 110, deldon 132 |
| Kyle Pitts | 89.9 | 42 | 12.4 | draftsharks 99, pat 65, deldon 107 |
| Travis Kelce | 119.9 | 36 | 10.5 | draftsharks 135, pat 99, deldon 124 |

\* Boone omitted from numeric calculation where applicable because the exact V3 board is not available as a runtime file; candidate weights are renormalized across available sources.

## Interpretation / anti-overfit
- Keep the recovered weights as the starting shadow hypothesis.
- Do not retune from aggregate correlation alone.
- Prioritize frozen-fixture A/B around the sensitive cases, especially Bowers/Allen early, Tuten and Kyle Pitts mid-draft, and Josh Downs/Wan'Dale Robinson/Chris Rodriguez/Jalen Coker late.
- Draft Sharks remains one source family only.
- No player-name override and no WR hard cap may be introduced from these disagreements.
- Final promotion remains blocked until Boone is included and candidate-vs-incumbent replay uses identical Coach/Return/roster inputs.
