# PITTI handoff current override — 2026-08-23

This file supersedes stale immediate-next-action sections in `PITTI_HANDOFF_2026-08-22.md`. Canonical `/Pitti/PITTI_PROJECT_STATE.md` remains Source of Truth and should be read to EOF first when available.

## Invalidated/rejected research paths
- Original turn-pair probe: INVALID. Candidate-score mutation caused recursive/order-dependent inflation and the 20/20 Chase Brown 1.09 artifact. Never reuse its outcomes.
- Rolling-v1: INVALID. Long-gap future quality used current top-5 fallback instead of actual future board.
- Joint-v1 z-score aggregation: REJECTED. Separate z-scaling amplified tiny future-board differences and allowed implausible Bowers 1.09 choices.

## PairSum-v2 status
PR #9 / `pitti-joint-pairsum-probe`, run `32615699210`.
1.09 across 20 Coach drafts: Cook 9, Amon-Ra 5, Taylor 4, JSN 2, Brown 0, Bowers 0. CONTROL 2.02 Bowers 20/20; PairSum 2.02 Brown 18/20, Jeanty 1, Walker 1.
Existing ADP-neighbor outcome anchor: CONTROL ~-0.644 baseline/-0.729 stress vs MARKET_ROSTER; PAIRSUM_LONG2 ~-0.380/-0.170; PAIRSUM_EARLY4 ~-0.396/-0.279. n=10/regime only; no certification. PairSum LONG2 remains frozen research candidate.

## Evaluator alignment warning
`MARKET_OUTCOME_BRIDGE_2026.json` is historical Sleeper ADP -> realized weekly Half-PPR neighbor forecasting; MARKET_ROSTER also selects mainly by current Sleeper ADP. Thus this outcome anchor structurally favors ADP-like policies and is only a market-regret guardrail, not sole strategic truth. Do not tune PITTI toward MARKET_ROSTER merely to close this gap.

## Direct decision counterfactual path — actual kernel gates PASS
Actual validated kernel source is `research/rc459_full_policy_paired_2026.js` (58/58 source lock + exact rc4.59 Coach execution, profiled opponent kernel).
Research branch/PR #12: `pitti-decision-counterfactual-kernel`. No production ranking/scoring change.

### Actual-kernel RNG parity
`research/rc459_actual_kernel_rng_parity_2026.js`, Actions run `32620973626` PASS.
One captured Sleeper metadata fixture (12,221 players) was used for both runs. Only the exact legacy RNG definition was replaced by the snapshot-capable bit-equivalent form. Complete full-policy JSON outputs were byte-identical across 6 full drafts (COACH, BRIDGE_GREEDY, MARKET_ROSTER × baseline/stress). Output SHA-256 `20e0b698978d1ee40988ba53132381f7193ab5469c2976333d6fac4d70bc574f`.
This closes the previous caveat: stateful RNG instrumentation is now verified directly on the actual validated rc4.59 full-policy kernel, not merely a synthetic control-flow mirror.

### Actual-kernel causal plumbing
`research/rc459_decision_counterfactual_plumbing_2026.js`, Actions run `32621088496` PASS.
Fresh seeds 459271001/459271002; treatment picks 9 and 12; 4 states / 40 full-draft branches. Verified on actual kernel:
- shared-prefix fingerprints identical across candidate branches;
- cloned RNG snapshots identical at treatment;
- forced treatment consumes zero outer RNG;
- candidate execution is order-independent/deterministic;
- full drafts remain legal with 15 user skill players and starter feasibility;
- complete picks and actual post-draft FA pools are persisted.
This plumbing screen intentionally used MARKET_ROSTER continuation only and made no outcome claim.

Observed diagnostic states were realistic: seed 459271001 picks 1-8 = Bijan, CMC, Gibbs, Chase, Puka, JSN, Taylor, Amon-Ra; seed 459271002 = Chase, Gibbs, Puka, Bijan, CMC, Taylor, JSN, Amon-Ra. MARKET_ROSTER then selected James Cook at 1.09 in both diagnostic states. At 2.02 after Cook, the outcome-blind panel/ADP frontier included Chase Brown, Jeanty, Walker, Jefferson, Bowers, Hampton, Achane, London, Henry and A.J. Brown.

## Raw direct decision screen — RUNNING
`research/rc459_decision_counterfactual_screen_2026.js`; workflow `PITTI rc4.59 raw decision counterfactual screen`, current run `32621203190`.
Fresh seed family 459272xxx. First diagnostic seed only. Treatment picks 1.09 and 2.02. Candidate frontier = outcome-blind union top-8 selected-panel + top-8 Sleeper ADP; Bowers retained at 2.02 if legal. Two frozen continuations:
1. `MARKET_NEUTRAL` = roster-aware MARKET_ROSTER continuation; no downstream evaluator.
2. `PAIRSUM_LONG2` = exact screened PairSum-v2 mechanism: canonical Coach except package-cost lookahead at picks 12 and 32, frontier 5, 120 inner CRN rollouts, `current selected-panel rank + expected best legal next-own-pick selected-panel rank`.
The raw workflow persists complete picks, roster, FA pool, prefix/RNG fingerprints and continuation decisions BEFORE any outcome evaluator. For this first plumbing/diagnostic state, 2.02 prefix uses MARKET_NEUTRAL at 1.09; later strategic certification must condition 2.02 across multiple plausible 1.09 branches.

## Independent outcome stack still required
Keep existing ADP-conditioned anchor as conservative market-regret lens. Add where reliable: (1) non-ADP-only player forecast/statistical challenger, (2) shallow-league replacement/waiver model using actual post-draft FA pools, (3) championship-tail simulation using actual league playoff rules. Existing `independent_utility_v3_3_2025.py` is useful as historical functional-form validation but uses realized 2025 production and therefore is NOT a 2026 player forecast.

## Immediate next actions
1. Let raw screen `32621203190` finish; inspect causal/plausibility invariants and raw picks BEFORE evaluating outcomes.
2. If raw PASS, download raw artifact and audit candidate/continuation behavior, especially Brown/Bowers/Cook sanity and PairSum outer-RNG isolation.
3. Only after raw audit, evaluate branches through multiple lenses; never let the ADP-neighbor anchor alone choose the winner.
4. Expand 2.02 to conditional states from multiple plausible 1.09 treatments, then extend to 3.09/4.02/5.09/6.02 on fresh seeds.
5. In parallel continue independent forecast/shallow-waiver/championship-tail work and health/role evidence refresh. No production promotion yet.
