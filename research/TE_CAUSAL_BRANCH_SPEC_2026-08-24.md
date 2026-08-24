# Pick-12 elite-TE causal branch specification — 2026-08-24

RESEARCH ONLY. No production promotion from this specification.

## Question
For realistic slot-9 states at 2.02, what is the opportunity cost of taking Brock Bowers versus each plausible RB/WR alternative when later opponent behavior and availability are allowed to respond to the forced pick?

## Required construction
1. Start from the validated rc4.59 snapshot-capable opponent kernel and a common prefix immediately before pick 12.
2. Candidate frontier must be state-local and plausibility filtered. Include Bowers plus every available RB/WR candidate that is either in the intrinsic tier or a superior-faller class; do not insert Chase Brown merely because old Coach raw ranks him highest.
3. For each candidate child, clone the exact pre-pick RNG state. Force only pick 12. Thereafter use the same validated neutral continuation policy and identical opponent kernel.
4. Preserve position-aware identity metadata throughout.
5. Capture board/roster state at 29,32,49,52,69,72 and final pick 150, including best available TE and RB/WR alternatives.
6. Evaluate lenses separately: selected-panel quality, current projection/startability, actual-FA replacement-aware utility, roster construction, market regret/return risk, and health/role uncertainty. Do not scalar-collapse evaluator disagreement.

## Fail-closed invariants
- No name-only mapping.
- No PairSum-v2 or Rolling-v1 logic.
- Brown 1.09 remains invalid; Allen 2.02 remains outside normal strategy.
- Every child from a prefix must begin with identical RNG snapshot and identical available board except for the forced candidate removal.
- Missing candidate forecast/identity or missing checkpoint invalidates that state; no silent dropping.
- Report coverage denominator explicitly.
- Baseline-path TE-supply diagnostic is descriptive context only and may not be substituted for this causal branch.

## Promotion gate
No production change unless the causal branch is mechanism-PASS, findings are robust across plausible first-pick prefixes, evaluator disagreement is understood, and a held-out/fresh certification supports a simple rule. With draft proximity, prefer an explicit live decision-map correction over invasive production scoring changes unless evidence is unusually strong.