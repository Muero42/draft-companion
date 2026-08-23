# PITTI handoff current override — 2026-08-23

This file supersedes stale immediate-next-action sections in `PITTI_HANDOFF_2026-08-22.md`. Canonical `/Pitti/PITTI_PROJECT_STATE.md` remains Source of Truth and should be read to EOF first when available.

## Invalidated experiments
- Original turn-pair probe: INVALID. Candidate score mutation caused recursive/order-dependent score inflation and the 20/20 Chase Brown 1.09 artifact. Do not reuse its outcomes.
- Rolling-v1: INVALID. Long-gap future quality used an inadequate current top-5 fallback instead of the actual future board.
- Joint-v1 z-score aggregation: REJECTED. Separately standardized current quality and tiny future-board differences, allowing implausible Bowers 1.09 choices.

## PairSum-v2 result
Research branch / draft PR #9: `pitti-joint-pairsum-probe`.
Actions run `32615699210` completed successfully for CONTROL, PAIRSUM_LONG2, PAIRSUM_EARLY4 plus smoke test.

Pick plausibility improved materially:
- 1.09 across 20 Coach drafts: James Cook III 9, Amon-Ra St. Brown 5, Jonathan Taylor 4, Jaxon Smith-Njigba 2; Chase Brown 0; Brock Bowers 0.
- CONTROL 2.02: Brock Bowers 20/20.
- PairSum 2.02: Chase Brown 18/20, Ashton Jeanty 1, Kenneth Walker III 1.

Outcome-anchor screen (n=10/regime; intentionally not certification-sized):
- CONTROL vs MARKET_ROSTER: about -0.644 baseline / -0.729 stress expected wins.
- PAIRSUM_LONG2: about -0.380 baseline / -0.170 stress.
- PAIRSUM_EARLY4: about -0.396 baseline / -0.279 stress.
LONG2 is the best current research mechanism but is NOT production-certified. Baseline remains dominated on the existing anchor and n<50.

PairSum LONG2 changes average Coach construction from about 5.5 RB / 7.5 WR / 1 TE / 1 QB to 6.05 RB / 6.95 WR / 1 TE / 1 QB. This supports the causal importance of sequencing/early opportunity cost without proving a hard RB strategy.

## Critical new evaluator audit
The existing `MARKET_OUTCOME_BRIDGE_2026.json` is explicitly a `historical Sleeper Half-PPR ADP -> realized weekly Half-PPR neighbor bridge` (2022-2025, k=24). MARKET_ROSTER directly selects mainly by current Sleeper ADP. Therefore Coach-vs-MARKET_ROSTER under this anchor has structural evaluator/comparator feature alignment toward ADP.

This is not narrow train/test leakage and the selected expert panel is not used in the fit, but it means the remaining -0.38 gap must NOT be tuned away mechanically. PairSum-LONG2 Coach rosters have materially better aggregate selected-panel rank (~975 vs ~1144, lower better) while MARKET_ROSTER has better aggregate ADP (~1065 vs ~1165). The ADP-neighbor anchor preferring MARKET_ROSTER is therefore expected and cannot alone adjudicate panel-vs-market disagreements.

Persisted audit: `research/OUTCOME_ANCHOR_ADP_ALIGNMENT_AUDIT_2026-08-23.md`.

## Next strategic method
Do not invent another global coefficient. Use direct decision-level counterfactuals: at the same realistic draft state, force each quality-plausible candidate, continue the full draft under frozen continuation policies with CRN, then compare downstream outcomes and roster consequences.

Candidate frontier must NOT be only canonical Coach top-5 because that frontier is under investigation. Use union of quality-plausible selected-panel, market/ADP, material Return-v2 pressure, and independently evidence-supported PITTI targets.

Persisted preregistration: `research/DECISION_COUNTERFACTUAL_NEXT_PLAN_2026-08-23.md`.

First target turns: 1.09, 2.02, 3.09, 4.02, 5.09, 6.02. Explicitly compare Bowers when plausible; do not suppress him. Goal is to measure Bowers vs RB/WR alternatives, not encode Late TE.

## Independent outcome stack required
Retain existing ADP-conditioned historical anchor as conservative market-regret lens, but before production strategy certification add independent lenses where feasible:
1. player forecast/statistical challenger not generated solely from current ADP;
2. shallow-league replacement/waiver model using actual post-draft FA pools;
3. championship-tail simulation using actual league playoff rules.

If a sufficiently independent forecast cannot be built reliably before 2026-08-31, do not fake precision: treat ADP anchor as a guardrail and combine panel quality + market timing + Return-v2/joint availability + direct counterfactual evidence.

## CRN invariant
Outer opponent RNG is recreated from the same seed per policy. Branches must match exactly before their forced user decision. After different user decisions, opponent boards may legitimately diverge because availability changed. Nested Return-v2 / joint rollouts must use separate deterministic streams and never advance outer opponent RNG. Future counterfactual harness must persist opponent picks and fail closed on shared-prefix mismatch.

## Immediate next actions
1. Build decision-counterfactual harness rather than tune PairSum weights.
2. Audit selected-panel vs ADP-conditioned forecast disagreements by player/position, especially where Coach repeatedly reaches relative to market.
3. Seek/build a genuinely non-ADP-only outcome challenger before interpreting MARKET_ROSTER dominance as true championship superiority.
4. Preserve PairSum LONG2 unchanged as a research candidate until fresh held-out evidence; no production promotion yet.
5. Continue health/role/breakout/decline-risk refresh and realistic mock preparation in parallel.
