# rc4.63 Pre-Safety Threshold -15 vs 0 — Full 120-seed audit

Research-only; no production mutation.

## Completeness
All 24 corrected artifacts from workflow 32870106661 were consumed: 120 paired seeds, exactly 459820001..459820120. Both arms use the same frozen parity-validated Sleeper metadata snapshot and corrected branch-head harness.

## Final fingerprint differences
- 107/120 seeds: identical complete fingerprint between -15 and 0.
- 13/120 seeds: different complete fingerprint.
- 21 user-pick decision differences total, because one early difference can cascade through later availability/roster state.
- First divergence: 12/13 differing seeds at pick 132; 1/13 at pick 49.

## Dominant boundary behavior
The 12 pick-132 first divergences are repeated-position QB Safety resurrection under -15, overwhelmingly Brock Purdy QB2. Threshold 0 instead takes the natural RB/WR candidate. Example seed 459820001: -15 picks Brock Purdy QB2 after Safety promotion; 0 restores Purdy to original raw and takes Jalen Coker WR. The final roster changes QB2 -> WR.

The one early divergence is seed 459820008 at pick 49. The roster already contains Brock Bowers TE1 from pick 12. Threshold -15 permits Colston Loveland as TE2 via Safety promotion; threshold 0 suppresses that repeated-TE resurrection and takes David Montgomery RB. This causes a legitimate downstream cascade in later picks, but the causal first difference is TE2 resurrection, not an unrelated rule.

## Final roster composition
Threshold -15:
- QB2 in 12/120 drafts (QB2 composition counts: 8x 2/6/6/1, 2x 2/5/7/1, 1x 2/7/5/1, 1x 2/4/8/1).
- TE2 in 1/120 draft (1/6/6/2).
- Remaining 107 drafts QB1/TE1.

Threshold 0:
- QB1/TE1 in 120/120 drafts.
- Distribution: 59x 1/6/7/1; 32x 1/7/6/1; 22x 1/5/8/1; 6x 1/4/9/1; 1x 1/8/5/1.

This distribution is diagnostic only; roster aesthetics are NOT a promotion criterion.

## Causal interpretation
The -15-only behavior is not merely preserving benign close calls. In the observed sample it permits exactly the class under investigation: Safety can turn a non-natural repeated QB/TE into the chosen player. The strict 0 arm removes those observed repeated-position Safety resurrections while leaving the candidate legally selectable at original raw score. The seed-459820008 Loveland TE2 case is especially important because the user already owns Bowers; preserving Loveland via Safety at pick 49 is structurally difficult to justify absent an independently validated exceptional-slide case.

## What this does NOT establish
This audit alone does not authorize threshold 0 or rc4.64. It does not yet prove repair-aware Championship Utility superiority/non-inferiority, nor does it replace executable Natural Pick-92 and Exceptional-Slide fixtures. Those remain mandatory freeze gates.

## Next gates
1. executable Natural Pick-92 against the actual threshold treatment;
2. explicit existing Exceptional-Slide preservation;
3. static Championship Utility -15 vs 0 vs Full Safety;
4. repair-aware Pre-Week-1 Championship Utility with the established repair model;
5. minimal production diff/freeze audit before any rc4.64 discussion.