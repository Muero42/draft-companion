# PITTI isolated early-lookahead causal test — preregistered 2026-08-23

Research-only. No production ranking/Coach changes authorized by this specification.

## Question
Does the PairSum-v2 LONG2 lookahead add causal value at the specific early decision point itself, independent of later policy differences?

## Why this test supersedes the naive hybrid idea
Audit of `rc459_decision_counterfactual_screen_2026.js` shows PairSum-LONG2 is not a late-round policy: it only substitutes package-cost lookahead at user picks 12 (2.02) and 32 (4.02); other user picks use the normal Coach path. Therefore 7-RB/8-WR final rosters cannot be attributed to a continuously active late PairSum policy. We must isolate the treatment decision, not merely 'turn PairSum off late'.

## Frozen design
For each eligible shared pre-pick state S and each candidate treatment C:
1. Clone S with identical outer RNG state.
2. Force C without consuming outer RNG.
3. At the next user decision under test, compute both MARKET_NEUTRAL and PairSum-LONG2 choices without advancing outer RNG.
4. Create two child states differing ONLY in that one user choice.
5. From immediately after that choice onward, BOTH children use the same frozen continuation policy: MARKET_NEUTRAL.
6. Opponent picks use the actual validated rc4.59 opponent kernel and common random numbers.
7. Persist complete picks, final user roster, actual FA ids, RNG/fingerprints, and the chosen divergent decision.

Primary decision points:
- 2.02 (pick 12), conditioned across multiple plausible forced 1.09 treatments.
- 4.02 (pick 32), conditioned across multiple plausible earlier paths after the 2.02 diagnostic.

## Candidate/path selection — corrected before outcome inspection
Outcome-blind only. The realistic forced 1.09 strategy frontier is frozen as:
- James Cook III
- Amon-Ra St. Brown
- Jaxon Smith-Njigba
- Jonathan Taylor
- Justin Jefferson
- Ashton Jeanty

A name is omitted for a seed when already drafted/unavailable. This list reflects the independently plausible elite 1.09 window rather than previous anomalous PairSum/Coach outputs.

Chase Brown and Brock Bowers are **not** equal-plausibility 1.09 strategy paths. They remain useful negative-control/stress concepts because earlier invalid/rejected experiments over-selected them. They must not be used to estimate the normal 1.09 strategy frontier unless later independent news/evidence materially changes their draft value.

This candidate correction was made before any isolated-lookahead outcome artifact was produced or inspected, after a direct plausibility challenge. It is therefore a design correction, not winner-driven pruning.

No candidate/path may subsequently be added or removed because of downstream results.

## Required invariants
- Shared-prefix fingerprint identical before divergent user decision.
- Treatment/user-decision code consumes zero outer RNG.
- Child RNG snapshots identical immediately after divergent choice.
- Opponent continuation code and stress regime byte-identical across children.
- Complete draft feasible under league roster topology.
- Raw artifact written before any outcome evaluator runs.
- Any invariant failure invalidates the pair fail-closed.

## Evaluation order
1. Raw plausibility/roster-shape audit.
2. Starter/startability regular-season utility challenger.
3. Panel-quality and market-regret lenses as diagnostics, neither sole truth.
4. Actual-FA replacement lens once complete FA metadata coverage exists.
5. True P(title) only after playoff rules are resolved and stochastic title evaluator is validated.

## Interpretation
This test estimates the downstream causal effect of the single PairSum-vs-neutral early decision under a common continuation. It does NOT certify PairSum as a global policy. A production TAKE/WAIT influence requires directionally stable evidence across held-out states and multiple non-redundant evaluators, with effect greater than simulation noise.

## Anti-overfit rule
No scoring coefficient, frontier, seed family, or evaluator may be altered after viewing this test's outcome to make PairSum win. Any subsequent variant requires a new preregistered held-out seed family.
