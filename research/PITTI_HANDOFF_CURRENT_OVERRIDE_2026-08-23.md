# PITTI handoff current override — 2026-08-23

This file supersedes stale immediate-next-action sections in `PITTI_HANDOFF_2026-08-22.md`. Canonical `/Pitti/PITTI_PROJECT_STATE.md` remains Source of Truth and should be read to EOF first when available.

## Invalidated experiments
- Original turn-pair probe: INVALID. Candidate score mutation caused recursive/order-dependent score inflation and the 20/20 Chase Brown 1.09 artifact. Do not reuse its outcomes.
- Rolling-v1: INVALID. Long-gap future quality used an inadequate current top-5 fallback instead of the actual future board.
- Joint-v1 z-score aggregation: REJECTED. Separately standardized current quality and tiny future-board differences, allowing implausible Bowers 1.09 choices.

## PairSum-v2 result
Research branch / draft PR #9: `pitti-joint-pairsum-probe`. Actions run `32615699210` completed successfully.
Pick plausibility: 1.09 across 20 Coach drafts = Cook 9, Amon-Ra 5, Taylor 4, JSN 2, Brown 0, Bowers 0. CONTROL 2.02 Bowers 20/20; PairSum 2.02 Brown 18/20, Jeanty 1, Walker 1.
Outcome-anchor screen n=10/regime: CONTROL about -0.644 baseline/-0.729 stress expected wins vs MARKET_ROSTER; PAIRSUM_LONG2 about -0.380/-0.170; PAIRSUM_EARLY4 about -0.396/-0.279. LONG2 remains research-only, not certified.

## Critical evaluator audit
`MARKET_OUTCOME_BRIDGE_2026.json` is historical Sleeper Half-PPR ADP -> realized weekly Half-PPR neighbors (2022-2025, k=24), while MARKET_ROSTER selects mainly by current Sleeper ADP. Thus the existing outcome anchor and comparator share structural ADP alignment. It remains a market-regret guardrail, not sole strategic truth. PairSum-LONG2 has materially better aggregate selected-panel rank (~975 vs ~1144, lower better) while MARKET_ROSTER has better aggregate ADP (~1065 vs ~1165). Do not tune the remaining gap away mechanically.

## Decision-counterfactual path — CAUSAL/RNG INSTRUMENTATION PASS
Direct decision-level counterfactuals are next: identical realistic pre-pick state, force each quality-plausible candidate, continue full draft under frozen continuation policies with CRN, compare downstream outcomes/roster consequences. Candidate frontier is outcome-blind union of panel quality, market/ADP, material Return-v2 pressure and independently documented PITTI targets. Bowers remains eligible at 2.02 when quality-plausible; no Brown/Cook/Bowers special rule.

Persistent contracts: `research/DECISION_COUNTERFACTUAL_NEXT_PLAN_2026-08-23.md` and `research/DECISION_COUNTERFACTUAL_HARNESS_SPEC_2026-08-23.md`.
Isolated branch `pitti-decision-counterfactual`, draft PR #10; no production scoring/ranking change.

Implemented/tested:
- `decision_counterfactual_core_2026.js` + negative invariant tests
- `stateful_rng_2026.js` + exact legacy parity/snapshot tests
- `counterfactual_state_machine_test_2026.js`
- `full_draft_rng_parity_2026.js`
- CI workflow `pitti-decision-counterfactual-core.yml`

Actions run `32620698365` PASS after diagnosing and fixing a test-only API-name mismatch (`StatefulRng` vs exported `statefulRng`); no simulation logic was changed by that fix. Verified:
1. shared-prefix/base immutability and treatment fail-closed gates;
2. treatment cannot advance outer opponent RNG;
3. stateful RNG bit-exact vs legacy for 5 seeds x 10,000 draws;
4. snapshot/resume exact for 5,000 subsequent draws and clone isolation;
5. snapshot->branch->resume deterministic replay with legitimate post-treatment board divergence;
6. whole-draft integration parity across 5 seeds x 150 picks, including weighted-choice and special-position multi-draw shapes, fingerprint `622c7e8d8ebe74aa887b0f3a5f09ab029b4c0d0abee7ce65eacf204bfb45ae78`.

Caveat: the whole-draft parity gate currently mirrors the RNG consumption/control-flow shapes, not yet the complete rc4.59 player/opponent weighting code. Therefore the next integration must still run a no-treatment byte-parity check on the actual validated rc4.59 full-draft kernel before causal outcome interpretation.

## Independent outcome stack required
Keep ADP-conditioned anchor as conservative market-regret lens. Add where reliable: (1) non-ADP-only player forecast challenger, (2) shallow-league replacement/waiver model using actual post-draft FA pool, (3) championship-tail simulation using actual league playoff rules. If no reliable independent forecast can be built before 2026-08-31, do not fake precision.

## Immediate next actions
1. Integrate the actual validated rc4.59 opponent/full-draft kernel with `statefulRng` for 1.09/2.02 only, preserving exact opponent weighting and special-position draw order.
2. On that actual kernel, require no-treatment legacy-vs-stateful byte-identical complete drafts for fresh parity seeds before branching.
3. Persist complete opponent picks, actual FA pool, continuation fingerprint and shared-prefix audit; upload raw artifact before evaluation.
4. Run small fresh diagnostic 1.09/2.02 seed family under frozen PairSum-LONG2 plus MARKET_NEUTRAL; causal/plausibility audit before outcome inspection.
5. Parallel: pursue independent outcome challenger and panel-vs-ADP disagreement audit. PairSum LONG2 remains frozen research candidate only.
