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

### Actual-kernel causal plumbing
`research/rc459_decision_counterfactual_plumbing_2026.js`, Actions run `32621088496` PASS.
Fresh seeds 459271001/459271002; treatment picks 9 and 12; 4 states / 40 full-draft branches. Verified shared-prefix identity, cloned RNG identity, zero treatment RNG consumption, order-independent deterministic treatment, legal full drafts, complete picks and actual post-draft FA pools.

## Direct counterfactual evidence
### MARKET_NEUTRAL breadth-100 — PASS
Workflow run `32623713022`, artifact `rc459-cf-market-breadth100` (digest `sha256:fbc78b672851c895548f52d6ac77a6e0297ae614d1ab6860427c71cdfc603a38`). Generated 100 fresh causal states per treatment (200 states total) and 2,000 complete MARKET_NEUTRAL branches, then evaluated through frozen multi-lens diagnostics. This is a broad diagnostic/robustness reference, not production certification.

Key interpretation: the broad direct A/B screen does NOT reproduce either invalid extreme pattern (Brown-always-1.09 or Bowers-always-2.02). Different lenses disagree materially in some player comparisons, confirming that no single evaluator should be allowed to dictate the strategy. Existing ADP-neighbor outcome bridge remains a market-regret guardrail rather than sole objective.

### Fresh external market/expert sanity — 2026-08-21 snapshot
Fresh FantasyPros Half-PPR consensus (Derek Brown, Andrew Erickson, Pat Fitzmaurice; Aug 20-21) continues to place the elite 1.09 window around Amon-Ra/JSN/Cook/Taylor rather than Chase Brown/Bowers. Position consensus has Cook RB3, Taylor RB4, Chase Brown RB7, while WR consensus has JSN WR3 and Amon-Ra WR4. Derek Brown's Aug-21 overall ranks Cook 5, JSN 6, Amon-Ra 7, Taylor 12, Chase Brown 15, Bowers 16. Most-accurate-expert aggregate from the prior week similarly had Amon-Ra 5, JSN 6, Taylor 8, Cook 10, Chase Brown 14 and Bowers 19. This is a sanity anchor, not an instruction to copy ECR.

Implication: any future policy again producing deterministic Brown 1.09 or Bowers 1.09/2.02 across diverse states requires extraordinary independent evidence and should fail plausibility audit by default. Conversely, Cook/Amon-Ra/JSN/Taylor mixtures at 1.09 are externally plausible and should be distinguished by direct causal/return evidence rather than forced into one universal pick.

## Targeted PairSum-vs-neutral run — still active
Run `32623556347` remains in the expensive `Fresh targeted MARKET_NEUTRAL vs frozen PairSum-LONG2 raw branches` step as of the latest check. Do not interrupt while active. This is the important continuation-policy cross-check against breadth-100 MARKET_NEUTRAL evidence.

## Independent outcome stack still required
Keep existing ADP-conditioned anchor as conservative market-regret lens. Add where reliable: (1) non-ADP-only player forecast/statistical challenger, (2) shallow-league replacement/waiver model using actual post-draft FA pools, (3) championship-tail simulation using actual league playoff rules. Existing `independent_utility_v3_3_2025.py` is useful as historical functional-form validation but uses realized 2025 production and therefore is NOT a 2026 player forecast.

## Parallel-work rule
Whenever a long Actions/simulation job is active, automatically use independent capacity on outcome-challenger, shallow-league FA/waiver, panel-vs-market disagreement, TAKE/WAIT, health/role, opponent-realism, championship-tail, harness/audit and draft-day usability work where useful. Do not return merely because a healthy long run is still computing.

## Immediate next actions
1. Let targeted run `32623556347` finish; inspect raw causal/plausibility invariants before outcome interpretation.
2. Compare its PairSum-vs-MARKET_NEUTRAL signs against the completed breadth-100 reference; preserve continuation/evaluator conflicts rather than tuning them away.
3. Expand conditional 2.02 states from multiple plausible 1.09 treatments, then 3.09/4.02/5.09/6.02 on fresh seeds only after the targeted cross-check.
4. Parallel: build shallow-league actual-FA replacement diagnostics from persisted breadth-100 FA pools; continue non-ADP forecast and championship-tail work.
5. Keep current external expert/market sanity snapshot as plausibility guardrail; refresh again close to 2026-08-31 or on material news.
6. No production promotion yet.
