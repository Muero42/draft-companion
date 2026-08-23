# PairSum-v2 LONG2 2.02 lookahead collapse audit — 2026-08-23

Status: research finding; no production promotion. Outcome evaluation intentionally NOT used for this audit.

## Data
Isolated early-lookahead run `32625856926`, artifact `rc459-isolated-early-lookahead`, digest `sha256:ac8fdd59c164febbddca8d6949a84d6f51e07508397aeb7f3db84bb6caf191ec`.
Fresh seeds 459277001-005. Realistic 1.09 forced-path set was corrected before outcome inspection to Cook, Amon-Ra, JSN, Taylor, Jefferson, Jeanty; unavailable paths omitted. Chase Brown and Brock Bowers were excluded as equal-plausibility 1.09 paths and retained only as negative-control concepts.

Run produced 16 valid shared-prefix states / 32 complete branches. `outcome_evaluated=false`. All causal/RNG/legality gates PASS.

## Raw decision result
At 2.02, PairSum-LONG2 selected **Chase Brown in 16/16 valid states**.
The same states under MARKET_NEUTRAL selected:
- CeeDee Lamb 8/16
- Saquon Barkley 5/16
- Ashton Jeanty 3/16

Thus the isolated experiment reproduces a deterministic Chase-Brown-at-2.02 tendency even after removing Brown/Bowers from the 1.09 strategy frontier.

## Mechanism audit
PairSum package cost is `current selected-panel rank + expected selected-panel rank of the best candidate at the next own pick` over 120 inner CRN rollouts.

Across the 16 valid states:
- mean range of `meanNext` across the five PairSum frontier candidates = ~0.0257 panel-rank points;
- median range = ~0.0272;
- minimum/maximum range = ~0.0136 / ~0.0411;
- mean current-panel-rank range across the same frontier = ~3.568;
- average `meanNext-range / current-panel-range` = ~0.0083 (~0.83%).

The future-board term is therefore effectively flat relative to current player-quality differences. PairSum is not materially distinguishing downstream opportunity cost at 2.02; it almost collapses to selecting the best current selected-panel rank in its frontier. Chase Brown has panel rank ~11.89 in the frozen pool, narrowly ahead of Jeanty (~12.40), Walker (~12.48), Jefferson (~13.60) and Bowers (~14.00), so Brown wins mechanically despite tiny/non-informative future-board deltas.

## Interpretation
This is a plausibility/mechanism failure of PairSum-LONG2 as an **opportunity-cost lookahead at 2.02**, not evidence that Chase Brown is the correct 2.02 pick. Do NOT spend outcome-evaluator effort trying to certify the 16/16 Brown decision before fixing the estimand.

The core problem is the future term: `expected best overall future panel rank` barely changes when one candidate is removed, because another similarly ranked player is usually available. It does not measure the actual loss in roster/startable/championship utility from passing a position/tier now.

## Consequence
- PairSum-LONG2 is **not promotable** at 2.02 in its current form.
- Do not encode a Brown-specific penalty or blacklist; that would treat the symptom.
- Retain direct candidate counterfactuals as the preferred evidence path.
- Any next lookahead variant must estimate a meaningful candidate-dependent downstream opportunity cost, e.g. roster-conditioned/startability/replacement utility or direct common-continuation branch value, not merely the next pick's best overall panel rank.
- New variant requires preregistration and fresh held-out states. Do not reuse these 16 states for tuning and certification.
