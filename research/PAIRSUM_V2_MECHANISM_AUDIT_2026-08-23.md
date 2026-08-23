# PairSum-v2 mechanism audit — 2026-08-23

Research-only. This audit occurs after the preregistered 10-seed screen and before any decision-counterfactual outcome experiment. It does not change production Coach/Return/panel/runtime logic.

## Result
**PAIRSUM_LONG2 is REJECTED for policy promotion. The full-board joint next-own-pick simulator remains useful research infrastructure.**

The reason is mechanism, not merely the small-screen expected-wins result.

## Pick 12 -> 29 decomposition
Across all 20 Coach rows (baseline + stress), PairSum-LONG2 activated at pick 12 and selected:
- Chase Brown 18/20
- Ashton Jeanty 1/20
- Kenneth Walker III 1/20

The preregistered package rule was:

`current selected-panel rank + E[best LEGAL next-own-pick selected-panel rank]`.

For the five quality-safe candidates at pick 12:
- mean cross-candidate spread in **current panel rank** = ~3.219 ranks;
- mean cross-candidate spread in **expected best legal pick-29 panel rank** = only ~0.029 ranks;
- maximum future-term spread in any of the 20 states = ~0.055 ranks.

Thus at pick 12 the supposed long-horizon lookahead contributes essentially no discrimination. The rule collapses to a re-ranking by the candidate's current raw selected-panel rank. In a representative state, Bowers was canonical Coach #1 (normalized 100), Brown #2 (98), Jefferson #3 (97), Walker #4 (96), Jeanty #5 (94), yet PairSum selected Brown because Brown's panel rank (11.893) was lower than Bowers (14.000) while every candidate's expected pick-29 best rank was ~25.17–25.20.

That is not the intended sequencing insight. It is a current-rank override wearing a lookahead label.

## Conflict with canonical Tier-first rule
The project handoff requires:
1. establish the admissible Player-Quality / health / roster tier first;
2. a real tier boundary beats TAKE/WAIT;
3. within a common/overlapping tier, Return/Collision/opportunity cost can sequence close candidates.

PairSum's raw cross-position panel-rank addition does not encode that rule. At pick 12 it can override canonical Coach order solely because one player's point rank is numerically lower even when the downstream board is effectively identical. That risks reintroducing `rank sequence` rather than `Tier-first` behavior.

## Pick 32 -> 49 nuance
The pick-32 lookahead contains more genuine information:
- mean current-panel spread across the five candidates ~8.441 ranks;
- mean expected-next-board spread ~1.475 ranks;
- maximum future spread ~3.266 ranks.

So the full-board simulator can identify state-dependent downstream differences at 32->49. But PairSum's fixed 1:1 raw-rank addition still has no validated scale/decision interpretation and should not be promoted from this screen.

## Evidence decision
- Do **not** promote PairSum-LONG2 or PAIRSUM_EARLY4 as a Coach policy.
- Do **not** infer a `Chase Brown 2.02` rule from the 18/20 screen frequency.
- Do **not** tune a coefficient on the same seeds to make the future term larger.
- Retain the full-board joint simulator and its immutability/order/CRN invariants.
- Use certified Return-v2 turn timing as timing evidence, not as a substitute for Player Quality.

## Consequence for decision counterfactuals
The next causal experiment should compare forced candidate decisions under continuations that do not themselves contain an unvalidated PairSum override:
- `CANONICAL_COACH`: exact rc4.59 Coach continuation, unchanged.
- `MARKET_NEUTRAL`: roster-legal market-aware continuation independent of the downstream evaluator.

`PAIRSUM_LONG2` may be retained as a **secondary sensitivity continuation only**, clearly labelled rejected/unvalidated, if compute is cheap. It must not be a required primary continuation or the basis for promotion.

This preserves the useful joint-state simulation work while preventing a dimensionally neat but behaviorally non-informative aggregation rule from becoming strategy.
