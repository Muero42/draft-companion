# Turn-Pair Opportunity-Cost Probe — preregistration 2026-08-22

## Why this exists
The completed dynamic-TE screen showed TE_SOFT2/4/6 and TE_RETURN_GATE all reproducing the same poor outcome (~-0.630 expected wins baseline / -0.722 stress vs MARKET_ROSTER), while the intentionally hard DEFER_TE69 diagnostic improved to ~-0.148 / -0.283 but remained inferior. This rules out blind threshold escalation and shows that isolated current-pick scoring is not resolving the structural path defect.

Observed representative bad path: Amon-Ra -> Bowers -> Olave -> Flowers -> Swift -> McLaurin, with RB1 delayed until 5.09. Therefore the next probe must evaluate the two selections around a snake turn jointly rather than merely penalizing TE.

## Hypothesis
At slot 9, a bounded two-pick lookahead over the current pick and the immediately following user pick can improve Championship Utility because the opportunity cost of TAKE/WAIT depends on the joint pair and resulting roster state. The mechanism should be position-agnostic: RB/RB, WR/RB, RB/WR, WR/WR, TE/RB, etc. are all legal outputs when player value and return risk justify them.

## Scope
Research-only. No production promotion from this screen. First target turns:
- 1.09 -> 2.02 (picks 9 -> 12)
- 3.09 -> 4.02 (29 -> 32)
Later turns are diagnostic outputs, not separately tuned in the first screen.

## Inputs that may be reused
- canonical rc4.59 candidate scoring and availability state;
- Return-v2 marginal return probabilities and confidence intervals;
- exact slot-9 snake geometry;
- sequential roster state;
- existing candidate-quality score;
- legal starter/core feasibility.

No outcome-evaluator information may leak into candidate choice.

## Candidate construction
At the first pick of a turn, retain a small quality-plausible frontier only (top 5 candidates surviving the existing Player Quality Safety Gate and hard exclusions). Do not widen the frontier with low-quality names merely because their return probability is low.

## Pre-outcome implementation correction
Inspection of the audited rc4.59 `simulateReturnV2` interface after the original preregistration showed that it exposes calibrated **marginal** per-player return probabilities but not joint simulated return-state samples. No outcome from a turn-pair candidate has been generated or inspected yet. Therefore the implementable first screen is locked now, before outcome evaluation, to a deterministic marginal-return estimator rather than inventing unavailable joint states or rewriting Return-v2.

For each first-pick candidate A:
1. use the already computed canonical/Return-v2 board at the turn start;
2. remove A from the return frontier;
3. order remaining quality-plausible return candidates B by canonical quality;
4. estimate expected best-return quality using the ordered marginal-return approximation
   `Ebest = sum_i Q(B_i) * P(B_i returns) * product_{j<i}(1-P(B_j returns))`;
5. assign any residual probability mass to a conservative fallback quality equal to the lowest quality candidate retained in the return frontier;
6. compute a bounded, position-agnostic starter-coverage continuation term from the roster after A and each B branch;
7. rank A by pair utility.

This approximation deliberately does **not** claim joint independence is true. It is a screening estimator built from the calibrated information the current interface actually exposes. A candidate cannot be promoted on this estimator alone: if it passes the small outcome screen, the held-out stage must either (a) validate the decision with a joint-state-capable Return-v2 extension or (b) show robustness across conservative dependence bounds/sensitivity analysis.

## Pair utility — locked first-screen form
`PAIR(A) = Q(A) + Ebest(A) + 0.5 * E[COVERAGE_DELTA(after A,B)]`

Definitions:
- `Q` = canonical pre-normalization `rawScore` after resolved Return-v2 adjustment and Player Quality Safety Gate eligibility; no outcome data.
- `Ebest` = ordered marginal-return estimator above.
- `COVERAGE_DELTA` = number of previously missing core starter position classes among QB/RB/WR/TE filled after the pair, capped to [0,2]. This is intentionally coarse and position-agnostic; RB and WR are not given different coefficients.
- coefficient `0.5` is fixed before outcome evaluation and is not to be tuned on this screen.

Because Q already contains canonical roster utility, the coverage term is deliberately small. It exists only to distinguish otherwise close pair paths that leave a core position entirely uncovered; it must not dominate player quality.

## Control variants
- CONTROL: QB1/TE1-cap + generic final starter-feasibility safeguard, no turn-pair override.
- PAIR_FIRST: same control plus pair lookahead only at 1.09 -> 2.02.
- PAIR_FIRST_TWO: same control plus pair lookahead at 1.09 -> 2.02 and 3.09 -> 4.02.
- DEFER_TE69 remains diagnostic context only, not a candidate for promotion.

No additional RB quota, TE suppression, WR cap, or positional rule may be added to these variants.

## Small-screen design
- Common random numbers across CONTROL / PAIR_FIRST / PAIR_FIRST_TWO.
- Same opponent kernels and stress regimes as the completed rc4.59 diagnostics.
- 10 seeds/regime initially, sufficient only for causal screening.
- Persist raw drafts before outcome evaluation.
- Run legality/core audit before outcome-v2; fail closed on invalid rosters.
- Evaluate with the independent roster/bye-aware outcome model.

## Required diagnostics
For every affected user turn, persist:
- quality frontier;
- each A candidate;
- marginal P(return) for relevant B alternatives;
- ordered Ebest components and residual fallback mass;
- Q(A), Ebest, coverage term and total PAIR score;
- selected A and canonical A that would otherwise have been selected;
- roster composition after the completed turn.

Aggregate:
- pick-frequency table at 9/12/29/32/49/52;
- first-RB / first-TE / first-QB timing distributions (diagnostic only);
- pair composition frequencies without declaring any composition intrinsically desirable;
- expected-wins delta vs MARKET_ROSTER baseline/stress with paired uncertainty;
- legality/core failures.

## Promotion gate
This first screen cannot promote production code. A candidate advances only if:
1. no legality/core regression;
2. improvement is not confined to one seed or one exact named-player path;
3. baseline and stress are directionally consistent or any tradeoff is clearly utility-positive and explainable;
4. pick-level behavior remains plausible and does not simply encode a hidden positional quota;
5. it materially improves on CONTROL and is competitive with or better than the DEFER_TE69 diagnostic anchor.

If a candidate passes, freeze its rule and run fresh held-out seeds with joint-state/dependence validation before any realistic large-mock certification or production integration.

## Explicit anti-overfit rules
- Do not tune coefficient, frontier size, fallback rule, or thresholds after seeing the same outcome screen.
- Do not hard-code Bowers, Chase Brown, Amon-Ra, or any named player.
- Do not optimize to Hero RB or Late TE as an objective.
- Do not use analyst strategy metadata as a numeric bonus.
- If the pair model merely swaps early TE for another WR and RB remains implausibly delayed, treat that as a failed mechanism even if one tiny sample outcome improves.
