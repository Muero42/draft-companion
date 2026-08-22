# Elite-TE opportunity-cost gate — research plan (2026-08-22)

Status: RESEARCH ONLY. Do not modify production rc4.59 from this document.

## Evidence motivating the next screen
The completed small CRN ablation screen shows:
- QB1_ONLY remains materially below MARKET_ROSTER.
- QB1_TE1 also remains materially below MARKET_ROSTER.
- QB1_TE1_DEFER_TE69 improves sharply: approximately -0.148 expected wins in baseline and -0.283 in stress versus MARKET_ROSTER in the 10-seed/regime screen.
- The main observed early-path change is Pick 12: QB1_TE1 selects Brock Bowers essentially deterministically, whereas DEFER_TE69 selects Chase Brown in the screened runs.

Interpretation: this is evidence against the current deterministic early-TE behavior, not evidence that elite TE is intrinsically bad or that TE must always be delayed to Pick 69.

## Production-candidate principle
Replace a hard TE-delay rule with a dynamic opportunity-cost gate. An elite TE remains admissible early only when its marginal value over the best non-TE alternative exceeds the expected value lost by passing on that alternative until the return pick.

The gate must use existing audited ingredients where possible:
1. current Coach score / player value;
2. Return-v2 probability for the TE and best RB/WR alternatives;
3. roster/position opportunity cost;
4. next-pick geometry for slot 9;
5. uncertainty safeguards so a noisy Return estimate cannot create a hard exclusion.

Personal Late-QB/Late-TE preferences remain context/tiebreakers, not hard suppression.

## Next causal screens
Before production integration, screen a small pre-registered family against identical CRN seeds and MARKET_ROSTER control:
- DEFER_TE69 (existing causal anchor);
- TE_RETURN_GATE: early TE allowed only when return-adjusted marginal utility beats best RB/WR by a conservative threshold;
- TE_SOFT_PENALTY: no hard exclusion; apply opportunity-cost penalty proportional to best-alternative non-return risk;
- optional PICK12_ONLY gate if diagnostics show the defect is highly localized to 2.02.

Do not tune thresholds on the final certification seeds. Use a small research screen, select a simple robust rule, then run a fresh larger held-out certification.

## Required diagnostics
For every candidate report:
- expected-wins delta vs MARKET_ROSTER by baseline/stress;
- paired confidence intervals;
- pick distributions at 9/12/29/32/49/52/69/72;
- roster position counts after picks 12, 32, 52, 72 and final roster;
- frequency elite TE is accepted/rejected and the displaced alternative;
- sensitivity to Return-v2 uncertainty.

## Separate open gate
QB1_TE1_RB2_BY52 completed its draft simulation but the outcome evaluator failed with `no legal pre-Week1 drop`. Diagnose the exact seed/roster and retain13 constraint before using it as policy evidence. Do not rerun its draft simulation merely to diagnose the evaluator.

## Universal opponent mode
Normal realistic mocks default every opponent to MANUAL. AUTODRAFT is activated only by current Sleeper/user evidence. UNKNOWN is reserved for genuinely conflicting transition evidence; autodraft/unknown picks must not train personal manager profiles. Multiple-autodrafter and mid-draft mode-switch scenarios are separate stress layers calibrated from Sleeper-2026 evidence.
