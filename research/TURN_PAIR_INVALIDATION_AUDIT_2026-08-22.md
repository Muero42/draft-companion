# Turn-Pair screen invalidation audit — 2026-08-22

## Verdict
The completed PAIR_FIRST / PAIR_FIRST_TWO screen is **INVALID AS POLICY EVIDENCE** because the research harness mutates shared score objects in-place while iterating candidate A. The resulting pair utilities are order-dependent and contaminate later candidates with already-replaced `rawScore` values.

This directly explains the implausible Chase Brown 1.09 lock observed in 20/20 Coach drafts. It is a harness bug, not evidence that Chase Brown belongs at 1.09 and not evidence against opportunity-cost modeling in general.

## Exact defect
In `research/rc459_turn_pair_screen_2026.js`:

- `qualitySorted = scored.slice().sort(...)` and `frontier = ...` are shallow array copies; both arrays contain references to the same score objects in `scored`.
- Inside `for (const a of frontier)`, the harness computes a synthetic pair score and then executes `a.rawScore = pairScore`.
- Subsequent iterations build `retPool` from `qualitySorted`, whose member objects may already have mutated `rawScore` values from earlier iterations.
- Therefore candidate utilities depend on loop order. Synthetic pair scores recursively leak into later candidate pair calculations.

This violates the preregistered requirement that each candidate A be evaluated against the same immutable canonical current-state scores.

## Observed symptom
The persisted PAIR_FIRST raw draft for baseline seed 459260001 shows at pick 9:
- Chase Brown raw = 319.636
- Brock Bowers raw = 304.350
- Ashton Jeanty raw = 245.207
- CeeDee Lamb raw = 206.591
- James Cook raw = 202.915

These values are no longer comparable canonical player scores; they are contaminated synthetic pair scores. The result cannot be interpreted as a real 1.09 valuation.

The same artifact reports Chase Brown Return-v2 probability near 0.99 for the immediate return pick in several states. That makes the 1.09 lock even more diagnostic of harness contamination: a player expected to return with such high probability should not be mechanically forced upward by a sound symmetric opportunity-cost calculation absent a separate large current-value edge.

## Consequences
1. Discard PAIR_FIRST / PAIR_FIRST_TWO outcome deltas as policy-selection evidence. They may be retained only as evidence of the buggy implementation's behavior.
2. Do not use the apparent Chase Brown 1.09 frequency to tune production ranking, RB weighting, market anchoring, or player-specific rules.
3. Dynamic-TE and DEFER_TE69 results are unaffected; they came from a different harness.
4. The Rolling Lookahead screen is **not affected by this specific mutation bug**: its current implementation computes candidate utilities without overwriting `score` or `rawScore`, chooses only among the canonical post-safety top-5, and stores the winner separately. Its results still require normal plausibility and holdout gates.
5. Any future lookahead harness must include an immutability/order-invariance test before outcome simulation.

## Mandatory new invariant
For a fixed draft state:
- clone/freeze canonical candidate score records before any lookahead computation;
- permute frontier iteration order;
- require identical candidate utilities and identical winner under every tested permutation;
- require canonical `score` and `rawScore` arrays byte/number-identical before and after the lookahead evaluation;
- fail closed if violated.

## Market-plausibility interpretation
A separate market-plausibility safety gate remains useful, but it must not be introduced as a reactionary fix for this bug. First establish correct immutable opportunity-cost math. After that, test whether any large reach remains. Only genuine residual large reaches should motivate a market-deviation safety rule, and such a rule must permit evidence-backed reaches rather than hard-code ADP obedience.

## Status
PAIR_FIRST / PAIR_FIRST_TWO = INVALIDATED / NO PROMOTION / NO RETUNING.
