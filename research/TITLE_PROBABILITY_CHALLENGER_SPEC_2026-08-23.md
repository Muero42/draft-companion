# PITTI true title-probability challenger — preregistered 2026-08-23

Research-only. No Coach/ranking coefficient changes are authorized by this specification.

## Why this exists
The existing file named `rc459_dynamic_championship_utility_challenger_2026.py` is not a championship-probability model. It sums weeks 1-14 empirical weekly win probabilities from lineup scores. It remains useful as a regular-season/startability utility lens, but MUST NOT be labeled or interpreted as P(title).

## Target estimand
Primary: P(win league championship | completed draft roster, league rules, weekly player distributions, replacement/waiver assumptions).
Secondary decomposition: P(make playoffs), P(reach semifinal/final where applicable), P(win title | make playoffs), expected regular-season wins, and weekly starter-vs-bench contribution.

## Required league-rule inputs — fail closed
Before reporting P(title), the evaluator must have verified actual 2026 league settings for:
- playoff team count;
- playoff start week / championship week;
- playoff seeding and bye structure;
- reseeding behavior if any;
- matchup length (one/two week rounds);
- tiebreak semantics if material.
If these are not present in a canonical artifact/API snapshot, report `TITLE_RULES_UNRESOLVED` and do not fabricate defaults.

## Weekly outcome model
- Use position/player weekly distributions rather than only season means.
- Preserve covariance/uncertainty where reliably estimable; at minimum avoid treating all player-week outcomes as deterministic means.
- Selected 2026 expert panel must not be used to fit the independent outcome lens.
- Existing ADP-neighbor bridge may be one input/guardrail, never sole truth.
- Weeks 15-17 must be modeled for playoff/title utility when league settings use them.

## Lineup topology
Use actual league topology: QB1, RB1, WR2, TE1, two flex slots with the verified eligibility constraints. Bench players contribute only through optimal substitution/availability/replacement logic; do not award raw summed bench value.

## Replacement / waivers
Use the actual post-draft free-agent pool persisted by each counterfactual branch. Future raw artifacts must include enough player metadata/forecast keys to value every FA candidate. If full metadata coverage is unavailable, mark replacement analysis incomplete rather than impute a precise title probability.

## Simulation design
- Common random numbers across candidate branches for schedule/opponent/player-week shocks where causal comparability permits.
- At least 10k season/playoff continuations per completed roster for certification; smaller runs are diagnostic only.
- Persist seed family, rules fingerprint, forecast fingerprint, FA-pool fingerprint and evaluator version.
- Report Monte Carlo SE / confidence interval for P(title) differences.

## Decision interpretation
A candidate may influence production strategy only when:
1. causal draft branch invariants PASS;
2. sign is reasonably stable across frozen continuation policies;
3. title-probability evidence is not contradicted by strong independent lineup/market-regret evidence without an explicit explanation;
4. effect exceeds simulation noise and is not driven by an obviously unrealistic late-roster construction.

Conflicting evidence remains a TAKE/WAIT uncertainty signal, not a hard positional rule.

## Immediate implementation order
1. Resolve actual league playoff settings from canonical project artifacts or Sleeper data; fail closed if unavailable.
2. Extend raw branch persistence so all actual FA ids join to forecast/player metadata.
3. Build weekly stochastic lineup simulator through championship week.
4. Validate deterministic special cases and CRN replay before running candidate comparisons.
5. First diagnostic on already frozen 1.09/2.02 counterfactual rosters; then held-out conditional later-turn states.
