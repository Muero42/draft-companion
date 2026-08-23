# rc4.59 isolated 2.02 audit — 2026-08-23

## Scope
Outcome-blind audit of `RC459_ISOLATED_EARLY_LOOKAHEAD_2026.json` from Actions run 32626462084. The harness uses the actual validated rc4.59 opponent kernel, forces only realistic 1.09 paths, compares the MARKET_NEUTRAL and PairSum-v2 decisions at 2.02 from the same prefix/RNG state, and then gives both children identical MARKET_NEUTRAL continuation to pick 150.

## Mechanical result
PASS. 16 valid states, 32 complete child drafts, all 16 decisions divergent. Artifact raw JSON SHA-256 `3311a137a20a01e175309ab229cd762f18e0985b908eea0b9befd1e4ed4edc79`; uploaded ZIP digest `sha256:0343376197f7ef3375bdca3810af8885d2c53020734c74ddeb0a8952e86b8caf`.

Realistic forced 1.09 frontier: James Cook III, Amon-Ra St. Brown, Jaxon Smith-Njigba, Jonathan Taylor, Justin Jefferson, Ashton Jeanty, subject to actual seed availability. Chase Brown and Brock Bowers were excluded from the 1.09 strategy frontier as negative controls.

## 2.02 choices
MARKET_NEUTRAL chose CeeDee Lamb in 8/16 states, Saquon Barkley in 5/16, and Ashton Jeanty in 3/16.

PairSum-v2 chose Chase Brown in 16/16 states.

This is not a subtle outcome-dependent disagreement. The raw PairSum diagnostic itself ranks Brown first at 2.02 because his current selected-panel rank (~11.89) is marginally better than Jeanty (~12.40), Walker (~12.48), Jefferson (~13.60), Bowers (14.0), while the computed mean-next term is essentially constant (~25.15–25.17). Thus the alleged lookahead contributes almost no discrimination and the policy collapses to the current panel ordering.

## Interpretation
PairSum-v2 is rejected as a promotion candidate in its present form. This does NOT establish that Chase Brown is globally bad, nor does it establish that MARKET_NEUTRAL is strategically optimal. It establishes that the current PairSum-v2 future-value term fails to provide meaningful opportunity-cost information at this critical 2.02 decision and therefore cannot justify overriding the realistic market frontier.

Do not patch this with a Brown-specific penalty. The failure is structural: future-board discrimination is too weak. Preserve the raw artifact for negative-control/regression use.

## Next research gate
Replace PairSum-v2 at 2.02 with direct candidate counterfactuals over the realistic available frontier. For each common prefix, branch on each plausible 2.02 candidate, clone RNG identically, then use common MARKET_NEUTRAL continuation. Evaluate separately with (a) regular-season/startability utility, (b) actual-FA replacement-aware depth value, (c) panel quality, and (d) market-regret/ADP. Preserve evaluator disagreement rather than collapsing to a single score. No production change until held-out evidence supports one.