# rc4.59 metadata-safe QB/TE repeat-guard paired audit — 2026-08-23

Research-only. No production/runtime mutation or policy promotion.

## Inputs / identity
- Baseline run: 32651366239, branch `pitti-realistic-fullmock-meta-safe`, head `6018258a37ef4fe5bd1bfa3e8bdc2dbb6811b156`.
- Challenger run: 32651373236, branch `pitti-meta-safe-qbte-guard-challenger`, head `7d1c4590baefb2436a58ce35b4be1de7a5e3a011`.
- Both runs: all six 10-seed shards completed successfully; exact seed family 459710001..459710060.
- Both use normalized-name + fantasy-position metadata, unique-match fail-closed. The challenger changes only repeat-QB/TE admissibility after the first player at that position, preserving the documented elite-slide exception.
- Verified league topology: 1 starting QB, 1 starting TE; TE can occupy only the W/R/T flex, not the W/R flex. User draft policy also deprioritizes QB2/TE2 absent exceptional value.

## Paired roster result (60 exact common seeds)
Baseline final QB counts: QB2 14/60, QB3 26/60, QB4 16/60, QB5 4/60. Therefore **60/60 baseline drafts selected at least two QBs** and 46/60 selected at least three.

Baseline final TE counts: TE1 29/60, TE2 26/60, TE3 5/60. Therefore **31/60 baseline drafts selected at least two TEs**.

Challenger final counts: **QB1 in 60/60 and TE1 in 60/60**. The existing elite-slide exception was available but never met in these 60 states.

Largest roster-frequency substitutions (challenger minus baseline): Kyler Murray -44, Brock Purdy -35, Bo Nix -27, Isaiah Likely -23, Trevor Lawrence -21; Jonah Coleman +41, Keaton Mitchell +35, Jalen Coker +18, Kenny Gainwell +11, Jordan Mason +9, Jacory Croskey-Merritt +8, Blake Corum +8. This is the expected direction for removing low-value repeat QB/TE accumulation: later bench capital shifts primarily toward RB/WR contingency/upside inventory.

## Starter-quality sanity check
A deliberately simple, non-certifying panel-rank starter proxy was computed using the verified topology: best QB1 + RB1 + WR2 + TE1 + two best remaining RB/WR/TE flex candidates. Lower rank-sum is better. Baseline mean = 234.707; challenger mean = 236.201; paired delta challenger-baseline = +1.494 ranks, median 0.0; 45/60 seeds unchanged, 3 improved, 12 worsened. Range -39.278 to +19.182.

Interpretation: the hard repeat guard fixes an obvious roster-construction defect without a broad early-starter collapse, but the proxy is **not championship utility** and the small adverse mean prevents automatic promotion. The changed drafts need evaluation under the certified Independent Utility v3.5 / outcome framework or an equivalent complete-roster evaluator before deciding the smallest runtime correction.

## Early-round regression check
The challenger is designed to activate only after a QB/TE is already rostered. Therefore it must not alter 1.09/2.02 before the first QB/TE repeat condition can occur. Baseline and challenger artifacts preserve the same early decision mechanism and metadata-safe source lineage. Bowers-at-2.02 remains a separate concentration/economics question and is **not** to be retuned inside this test.

## Decision
- Metadata-safe baseline: valid diagnostic baseline, but **roster-construction FAIL** for repeated QB/TE accumulation.
- QB/TE repeat-guard challenger: **structural PASS / outcome PENDING**.
- Do not merge PR #15 or #16 and do not mutate rc4.59 production yet.
- Next critical step: evaluate paired complete-roster outcome/utility on these exact 60 common-seed rosters. If the challenger is non-inferior or superior on the independent utility gate and no early-turn regression appears, derive the smallest isolated runtime patch and regression-test it. If utility is worse, replace the binary guard with a calibrated late-round opportunity-cost/admissibility rule rather than reverting to the baseline defect.
