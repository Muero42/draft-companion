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
- Return-v2 / empirical return probabilities and confidence intervals;
- exact slot-9 snake geometry;
- sequential roster state;
- existing candidate-quality score;
- legal starter/core feasibility.

No outcome-evaluator information may leak into candidate choice.

## Candidate construction
At the first pick of a turn, retain a small quality-plausible frontier only (initial target: top 5 non-K/DST candidates by canonical score after hard exclusions). Do not widen the frontier with low-quality names merely because their return probability is low.

For each candidate A at the first pick:
1. draft A into a cloned roster state;
2. estimate the distribution of availability at the return pick using the existing opponent/Return-v2 machinery;
3. for each simulated/weighted return state choose the best legal candidate B under the same canonical quality model plus only preregistered feasibility constraints;
4. compute expected pair utility from A + B plus a bounded roster-state continuation term.

## Pair utility — first preregistered form
Use normalized components so no position-specific hard rule is embedded:

`PAIR(A) = Q(A) + E[Q(B_return)] + lambda * E[STARTER_STATE_DELTA(after A,B)]`

where:
- `Q` is the existing canonical player-quality score on a common scale;
- `E[Q(B_return)]` comes from actual return-state simulation/probabilities, not ADP subtraction;
- `STARTER_STATE_DELTA` is a bounded, position-agnostic estimate of marginal best-lineup/core coverage after the pair, with no bonus for a named construction such as Hero RB;
- lambda is fixed before outcome evaluation. First screen uses one conservative lambda only; do not grid-search it on outcome.

If the existing score scale makes a single lambda uninterpretable, normalize Q and starter delta using the research sample before applying the fixed coefficient. Do not tune normalization to outcomes.

## Control variants
- CONTROL: canonical QB1/TE1-cap Coach without turn-pair override.
- PAIR_FIRST: joint lookahead only at 1.09 -> 2.02.
- PAIR_FIRST_TWO: joint lookahead at 1.09 -> 2.02 and 3.09 -> 4.02.
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
For every user turn, persist:
- available quality frontier;
- A candidate;
- P(return) / return-state summary for relevant alternatives;
- expected B distribution;
- Q(A), E[Q(B)], starter-state term, total PAIR score;
- chosen pair path;
- roster composition after the pair;
- canonical choice that was overridden, if any.

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

If a candidate passes, freeze its rule and run fresh held-out seeds before any realistic large-mock certification or production integration.

## Explicit anti-overfit rules
- Do not tune lambda, frontier size, or thresholds after seeing the same outcome screen.
- Do not hard-code Bowers, Chase Brown, Amon-Ra, or any named player.
- Do not optimize to Hero RB or Late TE as an objective.
- Do not use analyst strategy metadata as a numeric bonus.
- If the pair model merely swaps early TE for another WR and RB remains implausibly delayed, treat that as a failed mechanism even if one tiny sample outcome improves.
