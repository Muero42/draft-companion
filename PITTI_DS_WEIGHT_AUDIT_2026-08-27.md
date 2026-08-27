# Draft Sharks weighting audit — 2026-08-27

Status: RESEARCH / NO RUNTIME MUTATION

## Current frozen Expert-v2 use
- QB DS Team 35%
- RB DS Team 35%
- WR DS Team 30%
- TE DS Team 35%

## Independent historical accuracy evidence (FantasyPros 2023-2025)
- Jody Smith (Draft Sharks): overall #1; QB #40, RB #1, WR #13, TE #9.
- Jared Smola (Draft Sharks): overall #7; QB #23, RB #14, WR #14, TE #120.
- Kevin English (Draft Sharks): overall #13; QB #35, RB #37, WR #12, TE #113.
- Nick Mariano comparator: overall #6; QB #48, RB #11, WR #8, TE #77.
- Dalton Del Don comparator: overall #17; QB #56, RB #7, WR #76, TE #21.
- 2024 single-year: Kevin English won overall FantasyPros accuracy.
- 2025 single-year: Jody Smith #9 overall; 2023-25 Jody #1 and Smola #7.

## Methodology mismatch
Draft Sharks public 2026 board is a "Draft Sharks Team" product generated from 3D projections: Floor, Ceiling, Consensus projections feed a cross-positional value algorithm customized to league setup/scoring. It is reviewed by Jared Smola. Therefore it is not demonstrably identical to Jody Smith's individual FantasyPros accuracy entry, Jared Smola's individual entry, or Kevin English's individual entry.

Consequences:
1. Do NOT transfer Jody's RB #1 or TE #9 historical accuracy wholesale to the DS Team board.
2. Do NOT penalize the DS Team TE board solely because Smola/English have TE #120/#113.
3. Treat "DS Team 35%" as a source-family/model weight requiring its own validation.
4. Avoid counting multiple DS personalities as independent experts if the underlying rankings share projections/model inputs.

## Provisional interpretation
- DS family is strongly validated overall; blanket downweighting is not justified.
- WR has unusually consistent evidence across Jody (#13), Smola (#14), English (#12), supporting meaningful DS-family weight.
- RB evidence is strong but heterogeneous: Jody #1, Smola #14, English #37. 35% may be reasonable but is NOT independently proven for the Team 3D board.
- QB is solid rather than dominant (#23/#35/#40 among the three).
- TE is maximally heterogeneous (#9 vs #113/#120). A 35% DS Team TE weight requires direct board validation; historical individual-expert evidence does not justify it by itself.

## Coleman diagnostic
Frozen RB board: DS #222, Mariano #166, Del Don #148, Fitz #126 -> weighted panel 175.1.
Weighted panel without DS, renormalized over Mariano/Del Don/Fitz:
(166*25 + 148*25 + 126*15) / 65 = 149.846.
Thus DS alone shifts Coleman about +25.25 overall slots later relative to the other three experts' weighted consensus.
This is material but does not prove DS is wrong. Coleman should be a calibration case for late-RB/opportunity archetypes.

## Required validation before changing weights
A. Build per-position historical score/rank table for every current expert with comparable 2023-25 data.
B. Separate individual-expert accuracy evidence from model/team-board provenance.
C. On current frozen 2026 board, calculate source influence: panel rank with/without each expert, robust median/trimmed consensus, disagreement SD, and large-outlier clusters.
D. Stratify RB/WR by draft zone and archetype: early established, mid-round, rookie, late contingency/role-earner.
E. Test candidate weighting schemes OOS against historical seasons and current natural-mock decision evidence; never optimize on Coleman alone.
F. If DS shows systematic late-upside conservatism but good median accuracy, prefer an Opportunity/Upside residual correction over blunt global DS downweighting.
G. Any new weights are challenger-only until clean OOS validation; incumbent board remains available/control.

## Anti-overfit rule
No player-specific Coleman correction. No weight change from one draft or one disagreement. Prefer source-specific uncertainty / robust aggregation when one source is an extreme outlier.


## Year-stability pass — historical evidence interpretation

FantasyPros 2025 single-year ranks materially differ from 2023-25 aggregates:
- Jody Smith: 2025 overall #9; QB66 / RB19 / WR21 / TE23.
- Jared Smola: 2025 overall #18; QB50 / RB85 / WR7 / TE88.
- Nick Mariano: 2025 overall #17; QB32 / RB73 / WR13 / TE124.
- Pat Fitzmaurice: 2025 overall #47; QB42 / RB97 / WR70 / TE49.
- Dalton Del Don: 2025 overall #53; QB87 / RB89 / WR55 / TE54.
2024: Kevin English won overall, with QB103 / RB12 / WR2 / TE72; Jody Smith was #2 overall, QB14 / RB11 / WR68 / TE28.

Interpretation:
- Position ranks are noisy year to year. Do not convert a 3-year position rank directly into a large deterministic 2026 weight.
- DS-family WR is the most convincing persistent family signal: English WR2 in 2024, Smola WR7 and Jody WR21 in 2025, plus 3-year Jody13/Smola14/English12.
- DS-family RB is strong multi-year but not uniformly stable: Jody remains good (RB11 in 2024, RB19 in 2025), while Smola fell to RB85 in 2025. Team-board provenance remains critical.
- TE is not safe to infer from family label; both multi-year and annual results show large within-family dispersion.
- Current panel's Del Don RB25 weight has strong 3-year support (RB7) but weak 2025 result (RB89); Pat RB15 has weaker 3-year (RB40) and 2025 (RB97). This reinforces shrinkage/recency balancing rather than a DS-only correction.
- Mariano WR35 has strong 3-year (#8) and 2025 (#13) evidence; this is a comparatively well-supported current weight direction.

## Weighting-method recommendation
Use reliability shrinkage rather than raw rank-derived weights:
1. position-specific multi-year accuracy as prior;
2. recent single-year result as noisy update, capped;
3. source-provenance penalty when current 2026 board is a team/model product rather than the historically scored individual;
4. source-family correlation penalty to prevent false independence;
5. current-board disagreement robustness (Huber/winsorized influence or median anchor) only as a challenger;
6. Upside-v3 residual remains orthogonal to baseline accuracy weights.

Do not change production weights until the challenger is tested on historical seasons + natural-mock Evidence-v2.
