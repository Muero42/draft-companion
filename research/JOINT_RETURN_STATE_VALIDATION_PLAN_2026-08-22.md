# Joint Return-State Validation Plan — 2026-08-22

## Why this is needed
Return-v2 currently exposes calibrated marginal probabilities that individual players survive to the next user pick. Marginals are valuable for TAKE/WAIT, but they do not identify the joint distribution of the board at the next pick. Ordered-survival approximation is acceptable for causal screening only.

If rolling next-own-pick lookahead shows a positive signal, production promotion requires a joint-state validation that answers the actual question: after choosing candidate A now, what combinations of viable players are available at the next own pick under realistic intervening opponent decisions?

## Reuse existing simulator, do not create a second opponent model
The full-draft rc4.59 research harness already has:
- sequential draft state;
- exact 10-team snake geometry;
- market/ADP prior;
- manager-specific shrunk tendencies;
- roster need;
- baseline/stress opponent kernels;
- seeded RNG.

Joint validation should clone the current state and reuse this SAME opponent kernel for intervening picks. Do not fit a new return model to make the candidate look better.

## Conditional rollout algorithm
At a user decision pick p with next own pick n:
1. construct the canonical quality-safe frontier (max 5 candidates);
2. for each candidate A in the frontier, clone picks, available pool, rosters and manager state;
3. insert A at p;
4. simulate every intervening opponent pick p+1 ... n-1 using the same baseline/stress kernel;
5. at n record the complete available candidate set and the best legal candidate under the unchanged canonical quality model;
6. repeat with preregistered rollout count and common random numbers across candidate A choices;
7. estimate E[best-next quality], distribution of best-next player/position, and tail risk (for example 10th percentile next-pick quality).

## First research rollout counts
- screen/diagnostic: 300 conditional rollouts per candidate/state;
- holdout validation: 900 per candidate/state, matching Return-v2 scale where computationally feasible.

Do not tune rollout count based on which policy wins. If runtime is excessive, benchmark first and reduce uniformly before outcome evaluation; record the change.

## Common random numbers
For each current draft state, candidate A alternatives share the same rollout seeds. This makes the opportunity-cost difference lower-noise: only the choice of A should differ.

## Candidate utility for validation
Do NOT introduce a new tuned objective. For a frozen rolling candidate, replace only its marginal ordered-survival Ebest input with joint-rollout Ebest. Keep the already-frozen current-quality normalization, coverage coefficient and activation picks unchanged.

Compare:
- marginal approximation decision;
- joint-state decision;
- expected-next quality difference;
- selected-player agreement rate;
- downstream full-draft outcome under joint-state decisions.

## Conservative dependence bounds
As an additional cheap falsification, calculate optimistic/pessimistic bounds from marginal Return-v2 probabilities without assuming independence. If the rolling decision reverses within plausible dependence bounds for many important states, classify it as dependence-sensitive even before expensive joint rollouts.

## Production/runtime architecture if validated
Live two-minute drafting must not execute thousands of rollouts from scratch on the clock.
Preferred architecture:
- persistent pre-analysis immediately after each user pick;
- compute/cache joint lookahead for the next likely decision while opponents draft;
- cache keyed by draft fingerprint + available-pool fingerprint + roster state + next own pick;
- when on clock, use cached result; if stale/missing, fall back to canonical Coach + marginal Return-v2 rather than blocking.

This makes a potentially larger algorithmic improvement compatible with the real 2-minute phone draft.

## Pass requirements
A rolling candidate may advance from marginal screen only if joint validation shows:
- high decision agreement OR joint-state version improves/fixes disagreements without outcome regression;
- no legality/core failure;
- no dependence on a single named-player configuration;
- baseline/stress robustness;
- runtime/pre-analysis path feasible for draft day;
- fresh holdout seeds remain untouched until the rule is frozen.
