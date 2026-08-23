# Decision-counterfactual continuation override — 2026-08-23

This is a prospective override written **after PairSum-v2 mechanism audit and before decision-counterfactual outcome execution**. It supersedes only the continuation-policy portion of the earlier `DECISION_COUNTERFACTUAL_HARNESS_SPEC_2026-08-23.md` / `DECISION_COUNTERFACTUAL_NEXT_PLAN_2026-08-23.md`. All causal invariants, candidate-frontier rules, raw-evidence-first persistence and holdout discipline remain unchanged.

## Why the override is necessary
PairSum-LONG2 failed its preregistered mechanism requirement at pick 12: the next-pick term differed by only ~0.03 panel-rank points on average across candidates, so the rule effectively re-ranked the frontier by current raw panel rank and overrode canonical Coach order without meaningful downstream-board information. It is therefore rejected for policy promotion.

Using that rejected rule as a required continuation in the next forced-pick causal experiment would unnecessarily entangle the treatment effect with an unvalidated downstream policy.

## Frozen primary continuations for the next experiment
### A. CANONICAL_COACH
- Exact rc4.59 Coach continuation already source/dynamic-locked in the full-policy harness.
- No PairSum/joint aggregation override.
- Same production-like Player Quality / Return-v2 / urgency / Safety Gate behavior already under investigation.

### B. MARKET_NEUTRAL
- Market-aware, roster-legal continuation.
- Does not call or optimize the downstream outcome evaluator.
- No candidate-specific or named-player hand rules.
- Explicitly distinct from MARKET_ROSTER if the latter is tied to the ADP-conditioned outcome lens in a way that would contaminate interpretation.

### Secondary sensitivity only
`PAIRSUM_LONG2` may be run only as a labelled rejected-policy sensitivity arm if it adds little compute. It cannot be required for causal validity and cannot promote a decision.

## Treatment states
Keep the existing treatment set `{9,12,29,32,49,52}`. First causal-plumbing screen remains 9/12. Extend to 29/32/49/52 only after all shared-prefix/RNG/legality/determinism invariants pass.

## Interpretation
A forced pick is robust only if its downstream sign is reasonably stable across CANONICAL_COACH and MARKET_NEUTRAL, or if a continuation interaction is explicitly explained. The ADP-conditioned historical outcome bridge remains a market-regret guardrail rather than sole truth; panel/roster, non-ADP forecast, shallow-FA/replacement and championship-tail challengers remain required layers before production strategy certification.
