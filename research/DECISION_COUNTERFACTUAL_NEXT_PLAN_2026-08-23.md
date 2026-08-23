# Decision-level counterfactual evaluation — preregistration 2026-08-23

## Motivation
PairSum-v2 fixed a major sequencing defect (notably 1.09 urgent elite -> 2.02 Chase Brown rather than forcing Brown at 1.09 or Bowers at 2.02), but PAIRSUM_LONG2 still trails MARKET_ROSTER by ~0.38 expected wins in the 10-seed baseline screen. We should not respond by inventing another global coefficient.

The next research layer must answer the user's actual strategic question directly: **given the same realistic draft state, which available decision produces the best downstream draft/season outcome?**

## Method
For a sampled canonical draft state at one of our picks, create one branch per quality-plausible candidate. In every branch:
1. force only that current candidate;
2. use common random numbers for opponent selections conditional on the resulting board;
3. continue the draft with the same frozen continuation policy;
4. persist the complete draft and free-agent pool;
5. evaluate with the independent roster/bye-aware outcome anchor and, when ready, the shallow-league/championship-tail challengers.

This is a **decision counterfactual**, not a new scoring heuristic. It directly estimates downstream consequences of TAKE A vs TAKE B.

## Candidate set
Do not use the canonical Coach top-5 as the only frontier. That frontier is itself under investigation. Candidate eligibility is the union of:
- top quality-plausible selected-panel candidates;
- top market/ADP candidates still available;
- any candidate with material Return-v2 timing pressure;
- independently evidence-supported PITTI targets.

Exclude candidates that are clearly outside a preregistered plausibility band unless a documented injury/role/evidence override exists. The exact band must be fixed before outcome inspection.

## First states
Prioritize 1.09, 2.02, 3.09, 4.02, 5.09, 6.02. In particular, explicitly compare the plausible 1.09/2.02 families around James Cook III, Amon-Ra St. Brown, Jaxon Smith-Njigba, Jonathan Taylor, Chase Brown, Ashton Jeanty, CeeDee Lamb, Saquon Barkley, and any other actually available quality-plausible player in that state.

At 2.02, Brock Bowers remains a branch when quality-plausible; he is not suppressed. The purpose is to measure the downstream cost/benefit of Bowers vs RB/WR alternatives rather than encode a Late-TE preference.

## Continuation-policy problem
A forced-pick comparison is only valid if continuation policy does not systematically favor one branch. Therefore run at least two frozen continuations:
- PairSum-LONG2 continuation (current best research candidate, not certified);
- a market-aware neutral continuation that obeys roster legality and does not use the outcome evaluator.

A decision is robust only if its sign is reasonably stable across continuation policies or the interaction is explicitly understood.

## CRN / causal rules
- Same outer seed and opponent random stream at the shared prefix.
- After a forced user pick changes availability, opponent choices may legitimately diverge; this is part of the treatment effect.
- Internal Return-v2 / nested rollouts must use separate deterministic RNG streams and must never advance the outer opponent RNG.
- Persist opponent picks so shared-prefix equality can be audited exactly.
- Fail closed if two branches differ before the forced decision or if identical forced decisions produce different immediate opponent prefixes under the same seed.

## Outcome interpretation
Primary screen metric remains independent expected wins only as an anchor. It is not equivalent to title probability. Do not promote from expected-wins alone.

Required reporting per decision:
- mean downstream expected-wins delta vs each alternative;
- paired uncertainty;
- resulting roster construction and starter quality;
- return/availability consequences at next own pick;
- sensitivity to continuation policy;
- shallow-league replacement sensitivity when available;
- championship-tail direction when available.

## Anti-overfit rules
- No coefficient tuning on these same branches.
- No hard-coded Brown/Bowers/Cook rule.
- Do not choose a winner merely because it matches user preference or ADP.
- If outcome anchor and market/panel plausibility strongly disagree, audit the evaluator/data before changing production rankings.
- Research result cannot promote production directly; fresh held-out states/seeds are required.

## Important diagnostic from PairSum-v2
PAIRSUM_LONG2 changed average Coach roster composition from ~5.5 RB / 7.5 WR / 1 TE / 1 QB to ~6.05 RB / 6.95 WR / 1 TE / 1 QB and improved the baseline gap vs MARKET_ROSTER from ~-0.644 to ~-0.380 expected wins. This is useful causal evidence that early sequencing matters, but the remaining gap must be decomposed rather than tuned away.

Also note a material panel-vs-outcome tension in the screen: PairSum-LONG2 Coach rosters have substantially better (lower) aggregate selected-panel ranks than MARKET_ROSTER while still losing in the independent outcome anchor. This requires an evaluator/forecast-vs-panel disagreement audit before treating MARKET_ROSTER dominance as proof that the selected panel is wrong.
