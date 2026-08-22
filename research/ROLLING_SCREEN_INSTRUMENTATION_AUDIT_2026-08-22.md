# Rolling Screen Instrumentation Audit — 2026-08-22

## Scope
Audit performed while Actions run 32597626663 is already executing. Do NOT modify/restart the active screen merely to improve diagnostics; preserve the preregistered selection logic and current CRN run.

## Selection-path audit
`rc459_rolling_lookahead_screen_2026.js` patches the audited rc4.59 Coach after resolved Return-v2 scoring / player-quality safety and canonical normalization. For active picks it:
- builds the canonical top-5 frontier;
- estimates marginal ordered-survival expected-next score;
- standardizes current and expected-next score within the frontier;
- adds fixed 0.25 symmetric starter-coverage term;
- identifies a rolling winner;
- reorders the already-scored candidate board so that winner is selected;
- leaves each player's canonical `score` / `rawScore` unchanged.

This satisfies the key architecture correction versus the failed turn-start pair probe: no pair-total is written back onto the individual-score scale.

## Instrumentation gap found
The harness computes `__rollDiag` / `scored.__rollDiag`, but the inherited `coachChoice()` return object still exports only:
- chosen player;
- canonical top-five diagnostic fields;
- return_runs;
- safety.

The downstream `decisions[].coach_diag` likewise persists only `top` and `return_runs`. Therefore the active raw draft artifact will show the resulting selected player at each activated pick, but it will NOT persist the full preregistered per-candidate rolling decomposition (zQ, zEbest, coverage, utility, branch masses).

## Consequence
- The active 10-seed screen remains valid for a coarse causal outcome/selection-frequency test because selection logic itself is unchanged and deterministic given the same state.
- However it does NOT satisfy the intended full diagnostic-observability requirement for a candidate that might advance.
- Therefore no rolling arm may go directly from this screen to production/large mocks even if outcome is positive.

## Required action if any arm looks promising
Before fresh holdout:
1. freeze the exact winning rule (activation picks/frontier/normalization/0.25 coefficient) from this screen;
2. add diagnostic export only, without changing selection logic;
3. run a small parity replay on the SAME screen seeds and assert every user pick is identical to the original artifact;
4. only if pick-for-pick parity is 100% may the diagnostic-enhanced harness be used for fresh holdout/joint-state validation.

This replay is an instrumentation parity check, not parameter tuning and not a new candidate-selection experiment.

## If all rolling arms fail
Do not spend compute on diagnostic replay. Use the selected-pick frequencies and outcome artifacts for mechanism diagnosis, preserve the failure in the experiment ledger, and design the next mechanism prospectively.
