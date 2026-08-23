# PITTI Tier Decision Layer — 2026-08-23

Purpose: replace false precision from isolated overall ranks with tier-aware decision logic, while keeping market availability separate from intrinsic player quality.

## Core rule
Overall rank differences inside a robust shared tier are weak evidence. A real tier boundary is stronger evidence than a few slots of rank difference. TAKE/WAIT, roster economics and return risk may break ties INSIDE a tier; they should not normally override a robust intrinsic tier boundary.

Do not infer tiers from one source's ordinal ranks. Build PITTI tiers from selected-expert/evidence agreement and retain uncertainty about boundary membership.

## Evidence representation
For each realistic candidate store separately:
- expert ordinal ranks (raw, source/date/scoring verified);
- explicit expert tier label/boundaries where the source actually publishes tiers;
- PITTI intrinsic evidence: role/usage, offense, receiving/goal-line profile, health/injury, workload/decline, breakout/upside/downside;
- market ADP/availability ONLY as a separate field;
- tier-membership confidence / boundary uncertainty.

Never fabricate an expert tier from ranks alone. If an expert does not publish tiers, use rank proximity only as supporting evidence for PITTI clustering, not as an explicit tier vote.

## Decision hierarchy at an own pick
1. Rebuild actual available board after all preceding picks.
2. Identify genuine superior-tier fallers. Normally TAKE; do not sacrifice them merely for return sequencing.
3. Among candidates in the same robust PITTI tier, compare intrinsic evidence and league-specific starter economics.
4. If still close, use TAKE/WAIT asymmetry / return risk as a tiebreaker.
5. If still close, use roster construction and user strategic preferences as final tiebreakers.
6. A lower-tier player can override only with strong independently validated league-specific evidence; label this explicitly rather than silently treating rank/ADP as equivalent.

## Current first-turn interpretation — provisional, not frozen player ranks
Verified market says normal turn core includes Cook/Lamb/Jeanty/Jefferson; Amon-Ra/Taylor/JSN are favorable fallers at 1.09. Current independent ranks vary enough that rank 12 vs 17 alone is not a meaningful quality gap.

Recent explicit-tier examples confirm material disagreement in boundaries:
- Adam Pelletier (Aug 19 Half-PPR) places Cook in Tier 1; Amon-Ra, Jefferson, Taylor, Jeanty and Hampton in Tier 2; Chase Brown/Bowers in Tier 3.
- Wolf of Roto Street (Aug 19 Half-PPR) places JSN/Amon-Ra/Cook/Taylor/CMC in Tier 3 and Jeanty/Walker/Chase Brown in Tier 4. (Jefferson/Lamb are absent from the returned top segment, so do NOT infer their tier from that snippet.)
This disagreement is itself evidence that PITTI must model boundary uncertainty rather than copy a single tier list.

## First-turn sequencing consequence
The already validated return asymmetry remains useful ONLY after tier check:
- Cook vs Jefferson: if PITTI intrinsic tier is shared/overlapping, Cook-first / Jefferson-WAIT is favored by return asymmetry.
- Lamb vs Jefferson: same rule if shared/overlapping tier.
- Jeanty vs Jefferson: sequencing edge is smaller; intrinsic tier/boundary evidence should dominate.
- A genuine superior-tier faller at 1.09 should normally override sequencing optimization.

## Required output for draft-day map
For each candidate show compactly: `Tier | boundary confidence | TAKE/WAIT | why`.
Do not display meaningless rank decimals or exact return percentages unless empirically calibrated.

## Next research gate
Construct a selected-expert tier-agreement matrix for realistic 1.09/2.02 candidates. Distinguish explicit published tiers from inferred PITTI clustering. Then rerun the practical decision map using tier boundary first, TAKE/WAIT second. No new scalar optimizer.