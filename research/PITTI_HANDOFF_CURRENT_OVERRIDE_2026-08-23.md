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

## Critical evaluator audit
The existing `MARKET_OUTCOME_BRIDGE_2026.json` is explicitly a historical Sleeper Half-PPR ADP -> realized weekly Half-PPR neighbor bridge (2022-2025, k=24). MARKET_ROSTER directly selects mainly by current Sleeper ADP. Therefore Coach-vs-MARKET_ROSTER under this anchor has structural evaluator/comparator feature alignment toward ADP.

This is not narrow train/test leakage and the selected expert panel is not used in the fit, but the remaining PairSum gap must NOT be tuned away mechanically. PairSum-LONG2 Coach rosters have materially better aggregate selected-panel rank (~975 vs ~1144, lower better) while MARKET_ROSTER has better aggregate ADP (~1065 vs ~1165). The ADP-neighbor anchor cannot alone adjudicate panel-vs-market disagreements.

Persisted audit: `research/OUTCOME_ANCHOR_ADP_ALIGNMENT_AUDIT_2026-08-23.md`.

## Decision-counterfactual path — CAUSAL CORE + STATEFUL RNG GATES PASS
Do not invent another global coefficient. Direct decision-level counterfactuals are the next strategic method: same realistic pre-pick state, force each quality-plausible candidate, continue the full draft under frozen continuation policies with CRN, then compare downstream outcomes and roster consequences.

Candidate frontier is NOT only canonical Coach top-5. It is the outcome-blind union of selected-panel quality, market/ADP, material Return-v2 pressure, and independently documented PITTI targets. Bowers remains explicitly eligible at 2.02 when quality-plausible; no Brown/Cook/Bowers special rule.

Persistent preregistration: `research/DECISION_COUNTERFACTUAL_NEXT_PLAN_2026-08-23.md`.
Persistent implementation contract: `research/DECISION_COUNTERFACTUAL_HARNESS_SPEC_2026-08-23.md`.

Isolated branch: `pitti-decision-counterfactual`, draft PR #10. Research-only; no production scoring/ranking change.
Implemented/tested:
- `research/decision_counterfactual_core_2026.js`
- `research/decision_counterfactual_core_test_2026.js`
- `research/stateful_rng_2026.js`
- `research/stateful_rng_test_2026.js`
- `research/counterfactual_state_machine_test_2026.js`
- `.github/workflows/pitti-decision-counterfactual-core.yml`

Actions run `32620561415` PASS. Verified gates:
1. immutable shared-prefix clone / base immutability;
2. forced-treatment availability + legality fail-closed plumbing;
3. prefix RNG mismatch fail-closed;
4. treatment may not advance outer opponent RNG;
5. new stateful RNG is bit-exact against legacy rc4.59 research RNG for 5 seeds x 10,000 draws;
6. snapshot/resume parity for 5,000 subsequent draws;
7. clone does not advance parent RNG;
8. synthetic snapshot -> branch -> resume state machine gives deterministic same-treatment replay, immutable base, equal outer RNG draw consumption and legitimate divergent boards after different treatment.

The stateful wrapper changes no random-number mathematics; it only exposes `{a,draws}` snapshot/clone so the real rc4.59 kernel can branch at picks 9/12 without replay ambiguity.

First target turns remain 1.09 and 2.02 for plumbing/plausibility; only after full-kernel causal invariants pass extend to 3.09/4.02/5.09/6.02. Raw causal artifacts must be uploaded before downstream evaluator execution.

## Independent outcome stack required
Retain existing ADP-conditioned historical anchor as conservative market-regret lens, but before production strategy certification add independent lenses where feasible:
1. player forecast/statistical challenger not generated solely from current ADP;
2. shallow-league replacement/waiver model using actual post-draft FA pools;
3. championship-tail simulation using actual league playoff rules.

If a sufficiently independent forecast cannot be built reliably before 2026-08-31, do not fake precision: treat ADP anchor as a guardrail and combine panel quality + market timing + Return-v2/joint availability + direct counterfactual evidence.

## CRN invariant
Outer opponent RNG is recreated from the same seed per policy. Branches must match exactly before their forced user decision. After different user decisions, opponent boards may legitimately diverge because availability changed. Nested Return-v2 / joint rollouts must use separate deterministic streams and never advance outer opponent RNG. Counterfactual harness persists opponent picks and fails closed on shared-prefix mismatch.

## Immediate next actions
1. Integrate the validated rc4.59 opponent/full-draft kernel with the now-PASS stateful RNG for 1.09/2.02 only; preserve exact opponent weighting and special-position draw order.
2. Add a legacy-vs-stateful whole-draft parity gate BEFORE branching: same seeds must produce byte-identical complete drafts when no treatment is forced.
3. Persist complete opponent picks, FA pool, continuation fingerprint and shared-prefix audit in first raw screen; upload raw artifact before evaluation.
4. Run small fresh diagnostic seed family under frozen PairSum-LONG2 plus MARKET_NEUTRAL continuation; inspect causal/plausibility gates before outcomes.
5. In parallel audit selected-panel vs ADP-conditioned forecast disagreements and pursue a genuinely non-ADP-only outcome challenger.
6. Preserve PairSum LONG2 unchanged as research candidate until fresh held-out evidence; no production promotion yet.
