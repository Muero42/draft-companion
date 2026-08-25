# PITTI roster-depth challenger — 2026-08-25

Status: RESEARCH / SHADOW ONLY. Baseline rc4.64 remains untouched.

## Trigger evidence
Natural mock screenshots at picks 109, 112 and 129 show repeated WR recommendations after the user roster already contains seven WR. Examples include KC Concepcion, Wan'Dale Robinson and De'Zhaun Stribling ranking at or near the top despite multiple available RB upside tickets.

## Invariant
The league's 2 WR + 2 FLEX starting geometry is NOT a WR roster cap. Bench WR remain legal and can be optimal. Do not restore the old false roster-cap assumption.

## Failure hypothesis
The current marginalRosterUtility penalty for deep WR accumulation is too weak relative to panel/value components. As a result, the 8th WR can outrank an RB upside ticket without requiring a sufficiently large player-quality or championship-utility advantage.

## Challenger design
- Preserve all legal candidates and PlayerQualitySafety.
- Use a smooth declining marginal utility for WR depth, not a hard exclusion.
- WR5 remains broadly viable; WR6 requires stronger value; WR7 requires material upside/value; an 8th WR should normally lose to a comparable RB upside ticket unless the WR is a genuine exceptional value/slide.
- Preserve exceptional-value paths rather than using player names or fixed blacklists.
- Keep RB late-upside logic and Return-v2 unchanged in the first challenger so attribution is clean.
- Validate against frozen natural fixtures and the new seven-WR screenshots before considering any promotion.

## Acceptance tests
1. No hard WR cap.
2. At seven existing WR, near-peer RB upside tickets should beat ordinary WR depth.
3. A materially superior WR by panel/value may still rank first.
4. Early-round rankings must remain unchanged.
5. QB2/TE2 logic, Return-v2, opponent model, manager model and expert panels remain unchanged in this experiment.
6. Compare full recommendation order, not only top-1.
