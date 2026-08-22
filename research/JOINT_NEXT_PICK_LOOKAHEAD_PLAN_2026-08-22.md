# Joint next-own-pick lookahead — preregistration 2026-08-22

## Why v1 probes are invalid
Two separate research defects were found before any production promotion:

1. `PAIR_FIRST` / `PAIR_FIRST_TWO`: in-place mutation of shared `rawScore` objects made candidate utilities loop-order dependent. These outcomes are invalid policy evidence.
2. `ROLL_* v1`: canonical scores remained immutable, but long-horizon `expectedNext` used only the current top-five candidates. At pick 12 the top-five Return-v2 probabilities were all ~0, yet the formula assigned residual mass to the current fifth candidate. That omits the actual round-3 pool and makes long-gap expected-next quality structurally wrong.

The next probe therefore uses **joint simulated next-pick board states**, not marginal top-five return arithmetic.

## Hypothesis
For a fixed current draft state and candidate A, simulate all intervening opponents to the user's actual next pick while A is removed from availability. The expected quality of the best player genuinely available in those joint board states is a valid opportunity-cost signal. Comparing this signal across candidate A values should improve TAKE/WAIT decisions without hard position rules.

## Research-only scope
No production/runtime code changes. Audited rc4.59 Coach remains the current-score baseline and opponent kernel source. Initial screen is causal/behavioral only.

Fixed arms:
- CONTROL: feasible canonical Coach, no joint lookahead.
- JOINT_LONG2: activate only at picks 12 and 32 (long gaps 12->29 and 32->49).
- JOINT_EARLY4: activate at 9,12,29,32.

No coefficient/activation-set tuning after seeing this screen.

## Candidate frontier
After canonical Return-v2, Player Quality Safety Gate and normalization, retain the canonical top five only. Joint lookahead may choose only inside that frontier. This prevents the timing layer from inventing large low-quality reaches.

## Joint board simulation
For each candidate A in the top-five frontier:
1. clone current picks/player metadata/availability;
2. insert A at the current user pick and remove A from availability;
3. simulate each intervening opponent pick sequentially through `nextOwnPick-1` using the same validated research opponent kernel, exact snake geometry, roster counts, manager modifiers and K/DST hazards;
4. use common random numbers across candidate A branches for each rollout;
5. at the next own pick, record the **best available selected-panel rank** across the full remaining skill-player board, not merely the current top five;
6. repeat for a fixed 120 rollouts in the initial screen.

The next-pick quality statistic is `E[best available panel rank]`; lower is better. Selected panel is appropriate here because it is the Companion's Player Quality substrate. Outcome evaluation remains independent and must not use this signal as its target.

## Fixed choice rule
Within the current top-five frontier:
- `zCurrent = z(canonical normalized Coach score)`
- `zNext = z(-E[best available panel rank at next own pick])`
- `JOINT_UTILITY = zCurrent + zNext`

No roster-construction bonus in the first screen. Generic final-roster feasibility remains in the existing Coach wrapper. No Hero-RB, Late-TE, positional quota, named-player rule or ADP penalty.

## Invariants before interpreting outcome
- canonical `score` and `rawScore` values must remain unchanged by joint evaluation;
- permuting frontier iteration order must not change candidate expected-next values beyond floating-point tolerance or change the winner;
- candidate A must be removed before opponent rollout;
- all simulated intervening picks must be legal/unique and exact-snake;
- next-pick best rank must be computed from the actual simulated remaining board;
- common-random-number seed must depend on the draft state/rollout index, not candidate iteration order.

Any invariant failure invalidates the screen.

## Initial sample
5 full drafts per regime per arm, common outer seeds. This is intentionally a small causal screen because each user choice contains nested rollouts. It cannot certify production.

## Required diagnostics
At each activated user pick persist for every frontier candidate:
- canonical current score/raw/panel rank;
- expected best next-pick panel rank;
- distribution/quantiles of best next-pick panel rank;
- most frequent best-next players;
- joint utility;
- selected winner;
- canonical winner and whether overridden.

Aggregate pick distributions at 9/12/29/32/49/52 and first RB/TE timing only as diagnostics.

## Advancement gate
A candidate may advance only if:
1. invariants all pass;
2. pick behavior is market/player-quality plausible (no unexplained large reaches);
3. it materially corrects known structural decisions rather than merely swapping names;
4. independent outcome direction is better than CONTROL and competitive with the DEFER_TE69 diagnostic anchor;
5. behavior is not driven by one seed/player state.

Passing candidate is frozen exactly, then tested on fresh held-out seeds with a larger nested-rollout count (300 first; 900 only if Monte Carlo uncertainty still matters), followed by realistic mock matrix. No same-seed coefficient tuning.
