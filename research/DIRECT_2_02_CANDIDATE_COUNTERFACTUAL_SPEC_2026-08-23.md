# PITTI direct 2.02 candidate counterfactual — preregistered 2026-08-23

Research-only. No production Coach/ranking changes.

## Estimand
For realistic shared draft prefixes reaching pick 2.02 (overall 12), estimate the downstream effect of forcing each actually available, defensible 2.02 candidate and then using the exact same frozen continuation policy and common-random-number opponent process.

This supersedes PairSum-v2 as the primary 2.02 research path. PairSum-v2 is retained only as a negative-control/mechanism artifact.

## Prefix generation
Use fresh held-out seeds not used by the isolated PairSum audit. Generate pre-1.09 states with the validated rc4.59 opponent kernel. Condition on the already frozen realistic 1.09 frontier: James Cook III, Amon-Ra St. Brown, Jaxon Smith-Njigba, Jonathan Taylor, Justin Jefferson, Ashton Jeanty, only when actually available/legal in that seed. Advance to 2.02 with MARKET_NEUTRAL opponent continuation.

## 2.02 candidate frontier
Outcome-blind candidate construction per shared prefix:
1. all actually available players with current Sleeper ADP <= 22; AND
2. all actually available players with selected-panel rank <= 22;
3. legal under actual roster constraints.

This rule, not a handpicked winner list, determines the candidate set. It intentionally permits players such as Lamb, Barkley, Jeanty, Jefferson, Walker, Brown or Bowers when their frozen metadata and actual availability qualify. It does not imply that all are equally desirable.

Fail closed if fewer than 3 candidates qualify in a state. Persist the full qualifying frontier, including players not ultimately favored by any evaluator.

## Causal branch design
For each prefix and each qualifying candidate C:
- clone identical state and RNG snapshot;
- force C at pick 12 without consuming outer RNG;
- assert child RNG parity immediately after treatment;
- finish all children with identical MARKET_NEUTRAL continuation;
- use identical validated opponent kernel and common random numbers;
- persist all 150 picks, user roster, final actual FA ids, final RNG snapshot, and fingerprints.

Raw artifact MUST be written before any outcome/utility evaluator is run.

## Metadata
Persist enough player-pool metadata to join 100% of drafted and actual FA ids: key, name, position, team if present, selected-panel rank, Sleeper ADP, and any stable forecast identifiers already available from the source-locked core. Missing FA metadata invalidates replacement-aware evaluation, not the raw causal draft.

## Evaluation — separate lenses, no premature scalar
1. Regular-season/startability utility (existing weeks 1-14 challenger, correctly labeled).
2. Actual-FA marginal-depth diagnostic: starter/bench contribution and incremental depth over the branch's real FA pool.
3. Selected-panel quality diagnostic.
4. Market-regret/ADP diagnostic.
5. True P(title) only after actual playoff rules and stochastic title simulator are validated.

Report pairwise candidate deltas and uncertainty by prefix/seed. Preserve disagreements. Do not sum normalized lenses into a winner score unless a separate preregistered calibration justifies it.

## Anti-overfit / promotion gate
No candidate-specific penalty/bonus may be introduced after viewing results. No production TAKE/WAIT rule from this experiment alone. Any proposed policy change must reproduce on a new held-out seed family and remain plausible under actual availability/opponent profiles.