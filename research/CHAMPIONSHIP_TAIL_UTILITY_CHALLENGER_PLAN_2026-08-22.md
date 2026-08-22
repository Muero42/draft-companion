# Championship-Tail Utility Challenger Plan — 2026-08-22

## Why this exists
Current rc4.59 outcome-v2 and the existing 'Championship Utility' dynamic challenger ultimately summarize 14-week expected win probability. That is a useful, independent structural objective, but the user's actual objective is league-title probability, not merely regular-season expected wins.

A roster with slightly lower median weekly value but materially more right-tail playoff upside can be rational in a shallow managed league, especially when waivers allow replacement of failed bench bets. Conversely, chasing variance that lowers playoff qualification too much can reduce title probability. We therefore need a separate tail/championship sensitivity rather than assuming expected wins is a perfect proxy.

## Do not replace the existing evaluator
Expected-wins outcome-v2 remains the primary independent structural anchor for policy development. Championship-tail is a challenger/sensitivity. Policy decisions must not be tuned directly to one noisy simulated title metric.

## Required league settings before execution
Fetch and freeze the actual Sleeper league settings for the real league, including:
- number of playoff teams;
- playoff start week / championship week;
- reseeding/byes if applicable;
- matchup format if nonstandard.

Do not assume a generic 4- or 6-team playoff bracket if the actual settings can be obtained from Sleeper/project data.

## First model
For each frozen simulated draft roster and each player-outcome scenario draw:
1. generate weekly skill-lineup scores using the same exact Half-PPR lineup topology and dated bye schedule as outcome-v2;
2. draw nine opponent weekly skill scores from the empirical league distribution / validated market bridge, preserving reasonable week-level league variance;
3. simulate regular-season head-to-head record and playoff qualification using actual league settings;
4. simulate playoff matchups with the roster's weekly score distribution;
5. estimate `P(playoffs)`, `P(final)`, `P(title)` and conditional `P(title | playoffs)`.

Use common random numbers across policy comparisons.

## Tail / correlation treatment
Player weekly outcomes are not independent. Initial challenger should include at least:
- independent residual baseline;
- same-team positive/negative correlation sensitivity for QB-pass-catcher and offense-wide game environment;
- injury/role scenarios kept separate from statistical weekly residuals.

Do not invent precise correlation coefficients from intuition. Use empirical historical ranges or broad conservative scenarios, preregistered before policy comparison.

## Managed-redraft extension
A second-stage challenger can allow limited waiver replacement/churn after early-season information, using the separately preregistered shallow-league free-agent pool. Do not combine this with the first title simulation until the no-waiver title challenger is stable; otherwise too many mechanisms change at once.

## Output
For each frozen policy / regime:
- expected wins (existing anchor);
- P(playoffs);
- P(title);
- P(title | playoffs);
- mean/median weekly score;
- 75th/90th percentile weekly score;
- downside percentile;
- pairwise delta vs MARKET_ROSTER and CONTROL with Monte Carlo uncertainty.

Also report cases where expected-wins ranking and title-probability ranking disagree.

## Interpretation gate
- If title probability and expected-wins ranking agree: confidence in policy ranking increases.
- If they disagree only within Monte Carlo noise: classify inconclusive.
- If a robust disagreement persists across plausible correlation/replacement scenarios: prioritize actual title probability, but require larger fresh-seed validation before production.

## Anti-overfit
- Freeze policy before running title challenger.
- Do not tune draft-policy parameters to maximize title simulation on the same seeds.
- Use actual league settings and common random numbers.
- Keep replacement/waiver sensitivity separate at first.
- Preserve all existing legality, source-lock and panel-independence gates.
