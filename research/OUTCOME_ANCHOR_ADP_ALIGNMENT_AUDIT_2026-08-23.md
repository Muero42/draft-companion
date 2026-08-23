# Outcome-anchor ADP alignment audit — 2026-08-23

## Finding
The current independent outcome anchor is independent of the selected expert panel, but it is **not independent of market ADP as a predictor**.

`MARKET_OUTCOME_BRIDGE_2026.json` explicitly declares its method as:

> Direct historical Sleeper Half-PPR ADP -> realized Sleeper weekly Half-PPR neighbor bridge

using 2022-2025 data and k=24 historical neighbors.

The `MARKET_ROSTER` comparator, meanwhile, directly selects primarily by current Sleeper ADP (with roster penalties). Therefore a comparison of PITTI Coach vs MARKET_ROSTER under this outcome anchor structurally favors decisions that remain close to current ADP, because current ADP is the principal feature used to assign the 2026 weekly outcome forecast.

This is not data leakage in the narrow train/test sense, and the selected expert panel is indeed excluded from the outcome fit. But it **is evaluator/comparator feature alignment** and materially limits the interpretation of `COACH vs MARKET_ROSTER` as evidence that MARKET_ROSTER is strategically superior.

## Empirical symptom in PairSum-v2 screen
PAIRSUM_LONG2 Coach rosters have substantially *better* aggregate selected-panel rank than MARKET_ROSTER while still losing under the ADP-neighbor outcome anchor. In the 20 Coach rows:
- mean aggregate selected-panel rank: ~975.1 Coach vs ~1144.1 MARKET_ROSTER (lower is better);
- mean aggregate ADP: ~1165.0 Coach vs ~1064.6 MARKET_ROSTER (lower is better).

The outcome anchor prefers the more ADP-conforming roster, exactly as its construction would predict.

This does **not** prove the panel is right. It proves that the current outcome comparison cannot by itself adjudicate panel-vs-market disagreements.

## Consequence
Reclassify the existing expected-wins anchor as an **ADP-conditioned historical outcome anchor**, useful for:
- detecting strategies that make extreme unsupported market reaches;
- measuring historical outcome consequences conditional on draft-cost neighborhood;
- sensitivity analysis.

Do not use it alone to certify that an ADP-following strategy has higher true championship probability than a panel/evidence strategy.

## Required independent challengers before production strategy certification
At least one outcome model must contain meaningful information not reducible to current ADP. Preferred stack:
1. ADP-conditioned historical anchor (existing; retained unchanged).
2. Expert/panel-independent player projection or statistical forecast challenger whose 2026 player forecasts are not generated solely from current ADP.
3. Shallow-league waiver/replacement model based on actual post-draft free-agent pools.
4. Championship-tail simulation using league playoff rules rather than only expected regular-season wins.

If (2) cannot be built reliably before the real draft, treat the ADP anchor as a conservative market-regret guardrail, not a final objective.

## Immediate policy implication
Do not tune PairSum or any future policy to erase the remaining ~-0.38 expected-wins gap vs MARKET_ROSTER on this anchor. Doing so would risk mechanically forcing PITTI back toward ADP and destroying any legitimate expert/evidence edge.

Instead, proceed with decision-level counterfactuals and report multiple lenses:
- selected-panel/player-quality delta;
- market/ADP opportunity cost;
- Return-v2 / joint availability;
- ADP-conditioned historical outcome delta;
- independent forecast/championship-tail delta when available.

## Additional harness check
The outer opponent RNG is recreated from the same seed for each policy. When user decisions are identical, opponent choices before the next differing user action should therefore match; after user decisions differ, opponent boards may legitimately diverge because availability changes. Nested Coach Return-v2 and PairSum rollouts use separate deterministic streams and should not advance the outer opponent RNG. Preserve an explicit shared-prefix equality audit in future counterfactual harnesses.
