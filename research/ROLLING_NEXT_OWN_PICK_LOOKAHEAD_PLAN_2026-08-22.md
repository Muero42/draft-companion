# Rolling Next-Own-Pick Opportunity-Cost Probe — preregistration 2026-08-22

## Motivation
The completed PAIR_FIRST and PAIR_FIRST_TWO arms changed pick 1.09 but failed to repair 2.02: Chase Brown moved to 1.09, while Brock Bowers still appeared at 2.02 in 18/20 Coach drafts. Both candidate arms remained clearly dominated by MARKET_ROSTER and worse than the earlier DEFER_TE69 diagnostic anchor.

The mechanism error is temporal: turn-start-only lookahead evaluates 9->12 and 29->32, but the opportunity cost of the second turn pick is the NEXT own pick after it. For slot 9, the actual next-own-pick chain is:
9->12, 12->29, 29->32, 32->49, 49->52, 52->69, 69->72, 72->89, 89->92, 92->109, 109->112, 112->129, 129->132, 132->149.
The long gaps (12->29, 32->49, 52->69, etc.) are where scarcity/replaceability should matter most.

## Hypothesis
A bounded rolling one-step lookahead at every selected own pick can improve Championship Utility by explicitly valuing the best expected option at the next own pick rather than only applying a return-probability adjustment to the current player's isolated score.

This is position-agnostic. No RB quota, TE suppression, Hero-RB target, WR cap or Late-QB/Late-TE objective is permitted.

## Preregistered candidate arms
CONTROL: audited rc4.59 feasible Coach, unchanged.
ROLL_LONG: rolling lookahead only on long-gap turn exits: picks 12, 32, 52, 72, 92, 112, 132.
ROLL_EARLY4: rolling lookahead on picks 9, 12, 29, 32 only, to localize early structural effects.
ROLL_ALL: rolling lookahead on every own pick with a next own pick.

The first screen compares these fixed arms. Do not add/remove activation picks after seeing their outcomes.

## Candidate frontier and scoring
At an activated pick p:
1. build the canonical scored/quality-safe candidate board exactly as rc4.59 does;
2. retain only the top 5 quality-plausible candidates after hard exclusions/feasibility;
3. for each candidate A, use Return-v2 information for the actual next own pick n(p);
4. estimate the expected quality of the best available candidate at n(p) using the preregistered marginal ordered-survival approximation already documented in the turn-pair probe;
5. score A with a normalized current-quality + expected-next-pick-quality objective plus a small symmetric starter-coverage continuation term.

Initial fixed form:
`ROLL(A,p) = zQ(A,p) + zEbest(next|A,p) + 0.25 * CoverageDelta(A,p)`

Where zQ and zEbest are standardized within the current top-5 frontier BEFORE outcome evaluation. CoverageDelta is bounded [0,1] and symmetric across QB/RB/WR/TE starter-type coverage. The smaller 0.25 coefficient is fixed prospectively because rolling activation occurs more often than the prior pair probe; no grid search is allowed on the same screen.

If implementation cannot produce stable within-frontier z-scores without using outcome information, use rank-percentile normalization within the five-candidate frontier instead. This fallback must be selected before the screen is run and recorded in the artifact.

## Important architecture rule
Do NOT replace an individual player's raw score with a pair-total measured on a different scale and then feed that unmodified through single-player normalization. The rolling utility layer should rank only the candidate frontier and choose the winner, while preserving canonical scores for diagnostics and downstream presentation.

## Return-state caveat
Existing Return-v2 supplies marginal player return probabilities, not joint board states. The initial screen may use ordered-survival marginal approximation for screening only. A positive candidate cannot advance to production until validated against joint-state simulation or conservative dependence bounds.

## CRN small screen
- same opponent kernels, seeds and baseline/stress regimes as the prior research screens;
- 10 seeds/regime for causal screening only;
- common random numbers across all four arms;
- persist raw drafts before outcome evaluation;
- fail closed on roster/core illegality;
- evaluate with the unchanged independent roster/bye-aware outcome-v2 for comparability;
- shallow-league replacement sensitivity remains a separate challenger and must not be used to tune this first screen.

## Mandatory diagnostics
For every activated pick persist:
- canonical top 5 with current Q and Return-v2 probabilities;
- actual next own pick number and gap length;
- expected-next-pick quality estimate for each A;
- normalization inputs;
- CoverageDelta;
- rolling utility ranking;
- canonical winner and rolling winner;
- whether the rolling layer changed the pick.

Aggregate by pick:
- selection frequencies;
- position frequencies;
- override rate;
- expected-wins paired delta vs CONTROL and MARKET_ROSTER;
- first RB/TE/QB timing as diagnostics only;
- roster composition after picks 12, 32, 52, 72;
- legality/core failures.

## Pass gate
A candidate can advance only if:
1. legal/core-valid in every row;
2. materially improves over CONTROL in both baseline and stress or has an explainable utility-positive tradeoff;
3. competitive with or better than the DEFER_TE69 diagnostic anchor, not merely slightly better than the bad canonical Coach;
4. improvement is not driven by one named-player path;
5. early behavior is plausible rather than a hidden positional quota;
6. no same-screen tuning of coefficient, frontier size, activation picks or normalization.

A passing arm is frozen exactly and tested on fresh held-out seeds before any integration.
