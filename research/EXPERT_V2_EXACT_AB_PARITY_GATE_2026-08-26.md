# PITTI Expert-v2 — exact A/B parity gate (2026-08-26)

Status: RESEARCH / SHADOW ONLY. No production/main/gh-pages/device mutation.

## Evidence re-audited
Canonical natural backup `draft-companion-v7-backup-2026-08-24T19-40-47-213Z.json`, draft `1397557585325891584`, contains all 15 frozen user decision states. Provenance is mixed and must remain explicit: picks 9/12/29 are rc4.60; picks 32/49/52/69/72/89/92/109/112/129/132/149 are rc4.63.

Each fixture preserves the pre-decision roster, ranked pool, candidates, Return-v2 outputs, manager snapshot/RNG provenance and incumbent `coachScore`. This is sufficient for panel-sensitivity diagnostics but **the stored `coachScore` is not panel-neutral**: it was computed using the incumbent panel rank and downstream value-safety/board-relative logic at capture time.

## Critical A/B integrity finding
A naive A/B that merely substitutes Expert-v2 `panelRank` while retaining the fixture's stored incumbent `coachScore` is invalid. It would mix treatment and control: the candidate panel would be new while Coach/Value-Safety components would still contain incumbent-panel information.

Likewise, the first three fixtures cannot simply be called an rc4.64 baseline because they were captured under rc4.60. The correct comparison must replay **both** baseline and candidate through one fixed current decision kernel on the identical frozen pre-decision state.

Therefore the earlier panel-only sensitivity numbers remain useful diagnostics, but they are not promotion evidence.

## Exact treatment contract
For each of the 15 frozen states:
1. Deserialize identical pre-decision state twice.
2. Hold fixed: available players, user roster, pick geometry, Sleeper ADP, Return-v2 coefficients/results or deterministic Return inputs, manager state, injury/research inputs, roster/championship utility, Value-Safety semantics and all non-panel coefficients.
3. Control arm: recompute selected-panel ranks using the unchanged rc4.64 incumbent expert configuration.
4. Treatment arm: recompute only selected-panel ranks from the frozen Expert-v2 candidate source set/weights.
5. Run the same current rc4.64 decision kernel from raw inputs in both arms; do **not** reuse stored `coachScore` as final score.
6. Persist full candidate ordering, raw/adjusted scores, normal-cut/value-safety status, Return adjustment, roster/championship adjustment and winner for both arms.
7. Fail closed if any non-panel input fingerprint differs between arms.

## Mandatory controls
- Pick 89: QB1 must remain legal.
- Pick 92: after Herbert, ordinary QB2 must face the existing marginal-value hurdle; candidate panel quality alone must not resurrect the old QB2 failure.
- Picks 112/129/132/149: deep-WR diminishing marginal utility and late-RB optionality/saturation must remain state-dependent; no hard WR cap or blind RB accumulation.
- Exceptional QB/TE slides remain legal.
- No PairSum/Rolling, player-name forcing, fixed roster quotas/caps or generic Return-v2 retune.

## Promotion criterion
Expert-v2 can advance only if the exact fixed-kernel replay shows no material regression on natural controls and any changed decisions have a defensible Championship-Utility / opportunity-cost rationale. Historical user choices are evidence, not labels to fit.

## Immediate engineering next step
Build a research-only browserless/extracted-kernel replay from the **current rc4.64 app source**, with explicit dependency injection for panel ranks. Validate the harness first by reproducing the current kernel's control ordering on frozen rc4.63 fixtures before running the Expert-v2 treatment. If control reproduction fails, stop and diagnose parity; do not tune panel weights around a broken harness.
