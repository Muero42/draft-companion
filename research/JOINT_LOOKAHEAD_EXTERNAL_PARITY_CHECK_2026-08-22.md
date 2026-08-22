# Joint-lookahead external parity check — preregistered 2026-08-22

## Purpose
Before interpreting the currently running joint next-own-pick screen's long-gap results, validate its nested opponent rollout against a **pre-existing, independently persisted rc4.59-parity turn artifact**. This check is written while run 32598923886 is still in progress and before candidate-screen results are visible.

Reference artifact:
`simulation_2026/RC459_TURN_PAIR_MARKET_2026.json`
Gate: PASS; freeze hash `5339a37d...`; scope `rc4.59 profiled-baseline opponent kernel; neutral user control; conditional turn timing only`; 2,000 parent runs; every reported candidate >=100 eligible runs.

## Existing 9 -> 12 controls
Reference `take_branch_second_best_panel_mean` after forcing the named player at 1.09:
- Amon-Ra St. Brown: 11.78
- Jaxon Smith-Njigba: 11.62
- Jonathan Taylor: 11.78
- James Cook III: 11.89
- Chase Brown: 11.75
- Ashton Jeanty: 11.44

Reference `return_if_wait` for timing sanity:
- Amon-Ra: 1.79%
- JSN: 0%
- Jonathan Taylor: 0%
- James Cook: 11.96%
- Chase Brown: 97.5%
- Ashton Jeanty: 68.86%

These values already establish that taking Chase Brown at 1.09 normally wastes timing value: he is overwhelmingly likely to return, unlike the strongest alternatives.

## Validation rule for new JOINT_EARLY4
The new harness forces candidate A, simulates the intervening board and records expected best available selected-panel rank at the actual next own pick. At 9 -> 12 this statistic should be directly comparable in direction and approximate magnitude to the reference `take_branch_second_best_panel_mean` above.

Because the new initial screen has only 120 nested rollouts/candidate and may reach different parent states, exact equality is not required. Before trusting the new **12 -> 29** or **32 -> 49** long-gap outputs:
1. candidate-level 9 -> 12 expected-next values must preserve the reference ordering broadly and remain within a reasonable Monte-Carlo/state-composition envelope;
2. no systematic multi-rank displacement is acceptable without a diagnosed state-definition difference;
3. if 9 -> 12 parity is poor, reject the new nested kernel for policy evidence even if its aggregate outcome looks favorable;
4. do not tune the joint utility coefficient to repair parity; fix state/kernel semantics first.

This is a validation control only and does not alter the current running policy or scoring function.
