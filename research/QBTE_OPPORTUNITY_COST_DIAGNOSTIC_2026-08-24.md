# QB2/TE2 opportunity-cost diagnostic — 2026-08-24

Research-only. No production/runtime mutation or promotion.

## Why this audit was reopened
The paired metadata-safe 60-seed full-roster utility artifact rejects the global hard QB2/TE2 guard: mean challenger-minus-baseline expected wins/14w = -0.11654; median -0.11742; challenger better 9/60 and worse 51/60. A normal approximation to the paired seed mean gives SE ~0.02448 and ~95% interval [-0.1645, -0.0686]. This strongly rejects the blanket guard on this evaluator/seed family, but does **not** prove that rc4.59's repeated QB/TE Safety-Gate promotions are individually sound.

## Decomposition of the exact metadata-safe 60-seed pair
Downloaded and audited all six baseline and six hard-guard shards (`459710001..459710060`) plus the persisted paired utility artifact.

- Metadata-safe baseline contains **166** repeat QB/TE selections after an earlier player at the same position; all 166 have `PlayerQualitySafetyGate.triggered=true` in these corrected shards.
- Hard-guard challenger contains **0** repeat QB/TE selections in these seeds.
- By selected-panel rank, only **1/166** baseline repeats is an intrinsic same-position upgrade over the best already-rostered same-position player. The overwhelming majority are panel downgrades; some late TE repeats are enormous downgrades (e.g. Isaiah Likely after Brock Bowers).
- Repeat frequency by own pick is concentrated late: 49=8, 52=4, 89=6, 92=12, 109=3, 112=22, 129=44, 132=22, 149=45.
- Simple raw-score advantage of the repeated QB/TE candidate over the hard-guard replacement does **not** explain whether the hard guard helps: seed-level correlation between utility delta and maximum repeat raw-gap is about -0.056; with mean repeat raw-gap about -0.034. Therefore a threshold fitted directly on rc4.59 raw-score gap would be poorly justified and risks same-seed overfit.
- The seeds where the hard guard helps are heterogeneous; some remove almost-tied repeats, others remove repeats with large raw-score advantages. Conversely many of the largest hard-guard losses occur where the repeated passer/TE is obviously worse by panel rank. This means the full-draft paired delta is strongly path-mediated through subsequent opponent/user availability, not a clean estimate of the direct marginal value of QB2/TE2.

## Important interpretation correction
Do **not** read the hard-guard rejection as vindication of redundant QB/TE drafting. In the full draft, changing a user pick changes opponent availability and therefore later user options. A useless/redundant QB can accidentally produce a favorable downstream board in a deterministic opponent path. That indirect blocking/cascade effect can dominate the paired final-roster utility even when the repeated QB/TE is intrinsically inferior and never enters the optimal lineup.

Therefore neither extreme is certified:
1. rc4.59's Safety-Gate repeat promotions are not validated merely because the blanket guard loses.
2. The blanket pre-Safety admissibility ban is rejected because it can destroy state-specific option value and alter later draft paths too aggressively.

## Next diagnostic — prospectively frozen, no same-seed coefficient tuning
The next challenger must estimate **direct marginal lineup/option value before full-draft cascade** and compare it with the best admissible RB/WR alternative, while keeping Tier-first semantics.

For a candidate repeat QB/TE at the current state:
- compute independent-outcome marginal weekly lineup value of adding the candidate relative to the already-rostered same-position set (best-of-position, not roster count alone);
- compute the same marginal value for the best quality-safe RB/WR alternative under exact 1QB/2WR/1RB/1TE/2FLEX topology;
- retain separate market/Return timing as opportunity-cost evidence, not as outcome truth;
- permit a repeat only when there is an independently meaningful same-position starter/contingency gain or an exceptional market slide **and** that value clears the RB/WR alternative by a preregistered margin;
- do not fit that margin on seeds `459710001..459710060`; use them only as a mechanism/audit set. Any threshold must be set outcome-blind or on disjoint historical/holdout evidence before a fresh-seed full-draft test.

## Regression invariant
`Admissibility -> Player Quality Safety` remains the correct architectural order, but admissibility for QB2/TE2 cannot be a binary roster-count rule. It must be state/value-aware. PlayerQualitySafety must never force a repeated QB/TE solely because its raw Coach score is within the safety band when independent marginal lineup value is negligible and a materially useful RB/WR alternative exists.

## No production action
Do not modify rc4.52 production baseline or treat research branch behavior as Android runtime. Preserve Late-QB/late-TE preference and no automatic QB2/TE2 drafting unless the calibrated challenger clears fresh validation.