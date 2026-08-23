# Decision counterfactual harness contract — frozen 2026-08-23

Purpose: turn the preregistered decision-counterfactual plan into a fail-closed implementation contract before outcome inspection. This is research-only; no production coefficient or ranking change is authorized by this file.

## Unit of treatment
A treatment is exactly one forced user selection at one own pick from {9,12,29,32,49,52}. The pre-treatment draft state is generated once from the canonical realistic opponent kernel. All candidate branches clone that exact state.

## Candidate frontier (must be outcome-blind)
Union, deduplicated by player id/key, of:
1. top selected-panel quality candidates still available;
2. top current Sleeper-market/ADP candidates still available;
3. material Return-v2 timing-pressure candidates;
4. independently documented PITTI targets.

A player outside the plausibility band requires a pre-existing documented health/role/research override. Bowers is explicitly retained at pick 12 whenever he is quality-plausible. No Brown/Cook/Bowers special rule.

## Causal invariants — FAIL CLOSED
For each seed/state/candidate/continuation:
- serialized pre-treatment board, rosters, pick number, available-player ids and opponent RNG state fingerprint must be identical across branches;
- the only mutation at treatment is the forced candidate selection;
- opponent picks before treatment are persisted and byte-identical across branches;
- nested Return-v2/joint-lookahead RNG uses a disjoint deterministic stream and must not advance the outer opponent RNG;
- re-running the same candidate with same seed and continuation must produce the same immediate post-treatment opponent sequence;
- candidate must be available and roster-legal at treatment;
- full continuation must finish with legal roster length and required QB/RB/WR/TE starter feasibility; K/DST remain excluded from user strategy.

Any invariant failure invalidates the entire affected seed/state comparison; do not silently drop only the inconvenient branch.

## Continuations
Run each forced decision under two frozen continuation families:
A. PairSum-LONG2 exactly as screened in run 32615699210; no retuning.
B. MARKET_NEUTRAL: market-aware roster-legal continuation that does not call the downstream outcome evaluator and does not use candidate-specific hand rules.

The continuation label, code/blob fingerprint and configuration must be persisted with every row.

## Persisted raw row
At minimum:
- seed/regime/state id; treatment pick; candidate id/name/pos;
- full shared prefix including opponent picks;
- pre-treatment available-player ids fingerprint;
- complete post-treatment draft picks for all teams;
- user final roster and position counts;
- actual free-agent pool after pick 150;
- next-own-pick availability and best legal alternatives;
- continuation id/fingerprint;
- invariant/audit fields.

Raw simulations are uploaded before any evaluator runs. Evaluator failure must not destroy expensive causal evidence.

## Evaluation stack
1. Existing ADP-neighbor expected-wins anchor = MARKET-REGRET GUARDRAIL, not sole truth.
2. Selected-panel/quality and roster-construction diagnostics.
3. Independent non-ADP-only player forecast challenger when reliable.
4. Shallow-league replacement/waiver challenger using persisted actual FA pool.
5. Championship-tail challenger when playoff rules and weekly distributions are ready.

No candidate is promoted solely for winning #1 because MARKET_ROSTER and #1 share strong ADP alignment.

## First screen and holdout discipline
First diagnostic screen: picks 9 and 12 only, small fresh seed family not used to tune PairSum-v2. Its purpose is causal plumbing, plausibility and sign exploration, not certification.

Before inspecting its outcome winner, freeze the exact extension contract for picks 29/32/49/52. No coefficient tuning on diagnostic branches. Any proposed policy change requires new held-out seeds/states.

## Required decision report
For each state and candidate pair report:
- paired delta under each continuation and each outcome lens;
- uncertainty / sample size;
- next-pick availability consequences;
- roster construction and starter-quality consequences;
- continuation interaction;
- whether the sign is robust or evaluator-dependent.

If evidence conflicts, preserve the conflict. Do not convert it into a hard positional rule.
