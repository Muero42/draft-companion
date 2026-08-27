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
