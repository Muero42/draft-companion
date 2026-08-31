# PITTI live-draft decision matrix audit — v201 — 2026-08-30

## Purpose
Precompute interpretation rules for Slot 9 turn states without changing rc4.131 scoring.

## Verified runtime mechanics
- Tier geometry is diagnostic-only; replacement-aware positional alternatives are the scored scarcity channel. This prevents double-counting tier scarcity.
- Return-v2 is resolved before its score effect. Legacy ADP return pressure is not simultaneously scored.
- Loss-if-gone is computed after Return-v2 resolution and is an action/timing context, not an automatic pick command.
- Research Residual v2 is shadow-only and cannot mutate live Coach score.
- Player-quality safety gate runs before normalized Coach scores.
- Sparse-panel penalty is explicit below 4 voices; missing expert ranks are not silently imputed.

## Slot-9 two-pick matrix
### WR-light / RB-heavy
Example: WR1/RB2 at pick 32 after Love.
- A generic RB-need preference is invalid.
- If WR and RB leaders are within 1-3 normalized Coach points, prefer the player with stronger panel/player quality unless a real RB tier cliff / loss-of-access signal exists.
- Nabers/Javonte is the regression canary.

### RB-light / WR-heavy
- Mirror logic: near-tie can favor RB if the RB tier is genuinely thinner and WR alternatives are comparable.
- Do not manufacture positional need solely from starter maxima.

### Balanced RB/WR
- Panel/player quality first; use Return-v2 and tier alternatives to sequence the two turn picks.
- If both likely survive only one/two picks, take the higher championship-utility player first.

### QB not yet drafted
- QB remains late by default in 10-team 1QB.
- A rushing-upside QB can beat a near-equal pocket QB.
- QB urgency cannot override a materially better RB/WR merely because Return is critical.
- Once QB1 is drafted, QB2 is strategy-excluded except explicit emergency/absolute exception. Geno Smith and Aaron Rodgers are explicit user hard exclusions and must never be recommended/drafted.

### TE not yet drafted
- TE1 may be deferred through a run if RB/WR utility dominates.
- TE2 is exception-only.
- Loveland/Warren/Kraft path is sequencing context, not a forced reach.

### Late bench
- Progressive ceiling increases from round 9.
- Prefer direct contingent lead-role / receiving / goal-line paths.
- K/DST are not drafted; roster start maxima never become roster caps.

## Regression verdict
No missing runtime mechanism was found that justifies another model patch. The remaining risk is interpretation of normalized near-ties; the existing Override Guard is the correct control.
