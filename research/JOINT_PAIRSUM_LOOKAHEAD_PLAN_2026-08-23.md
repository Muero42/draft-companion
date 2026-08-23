# Joint next-own-pick pair-sum lookahead v2 — preregistration 2026-08-23

## Motivation
Joint-v1 established that the full-board next-own-pick simulator can reproduce the independent rc4.59 9->12 timing control, but its decision rule was invalid because separate within-state z-scales amplified microscopic future-board differences. This v2 retains only the board-state simulator and changes the aggregation before seeing fresh-seed outcomes.

## Fixed hypothesis
Within the canonical quality-safe top-five frontier, choose the candidate minimizing the two-pick selected-panel package cost:

`PAIR_SUM(A) = current_selected_panel_rank(A) + E[best LEGAL selected-panel rank at next own pick | take A now]`.

Current and future value are therefore in exactly the same unit. No z transform, learned weight, ADP reach penalty, positional quota, named-player rule or same-screen coefficient tuning is permitted.

## Next-pick legality
The next-own-pick candidate must be legal under the same generic shallow-league feasibility wrapper used in the causal screens. In particular:
- once the simulated user roster already contains a QB, QB is excluded from the future candidate set;
- once it already contains a TE, TE is excluded from the future candidate set;
- if remaining own picks equal the number of still-missing starter positions among QB/RB/WR/TE, the future candidate set is restricted to those missing positions;
- otherwise RB/WR remain unrestricted and compete normally.

This is a research feasibility rule, not a claim that QB2/TE2 can never be rational as an absolute exception in production.

## Arms
- CONTROL: feasible canonical Coach, no joint package selection.
- PAIRSUM_LONG2: activate only at 12 and 32 (long gaps 12->29, 32->49).
- PAIRSUM_EARLY4: activate at 9, 12, 29 and 32.

No additional arm or activation set may be added after outcomes are seen.

## Simulation
For every top-five frontier candidate A at an activated pick:
1. clone the exact parent state;
2. insert A and remove A from availability;
3. sequentially simulate every opponent pick to the actual next user pick using the validated research opponent kernel, exact snake geometry, manager modifiers, roster counts and K/DST hazards;
4. use common random numbers across candidate branches;
5. select the best legal remaining next-pick player by selected-panel rank from the full skill-player board;
6. repeat 120 nested rollouts in the initial causal screen.

## Fresh-seed requirement
The outer draft seed base is moved away from Joint-v1's 459260000 family before execution. The harness must fail closed if the expected old seed literal cannot be uniquely replaced. These outcomes are therefore not same-seed tuning of Joint-v1.

## Mandatory invariants
- canonical `score` and `rawScore` are unchanged before/after package evaluation;
- forward vs reverse frontier evaluation yields identical expected-next values and winner;
- candidate A is removed before opponent simulation;
- opponent picks are legal, unique and exact-snake;
- future best is selected from the actual simulated full remaining board;
- future QB/TE/starter-feasibility rules are enforced from the simulated user roster after A;
- common-random-number seed does not depend on candidate iteration order;
- package cost uses untransformed panel-rank units only.

Any invariant failure invalidates the screen before outcome interpretation.

## Initial screen and advancement
Run 10 fresh drafts per regime/arm. Outcome remains diagnostic unless the existing outcome gate's minimum sample is satisfied; plausibility is mandatory regardless of outcome.

Advancement requires all of:
1. invariants PASS;
2. no `QUALITY_TIMING_DOMINANCE` or obvious pick-plausibility failure;
3. behavior corrects a real sequencing problem rather than merely swapping names;
4. independent outcome direction improves on CONTROL and is competitive with the DEFER_TE69 diagnostic anchor;
5. effect is not one-seed/player-state driven.

If promising, freeze exactly and use new held-out seeds with larger nested rollout count. If rejected, diagnose mechanism; do not tune weights on these seeds.

No production Coach/Return/panel/runtime change is made by this experiment.