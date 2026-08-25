# rc4.63 Safety Threshold Sweep — interpretation before execution

Research only; rc4.63 remains frozen.

## Exact evidence now available
Same-input instrumentation is 120/120 exact on decision core, roster, and complete fingerprint. For all 333 repeated-position QB/TE Safety-promoted choices, ORIGINAL pre-Safety chosen-minus-best-legal-RB/WR raw gaps are negative: min -65.415, median -43.542, p95 -21.468, max -11.663.

## Consequence for the preregistered thresholds
Within this exact 120-seed sample:
- threshold -15 can retain only cases in the extreme upper tail between -15 and -11.663;
- thresholds -10, -5, 0 and +5 retain ZERO of the 333 observed pathological repeated-position Safety promotions, because even the maximum gap is -11.663.

Therefore a full expensive 5-arm 120-seed simulation would be redundant for the four thresholds >= -10 with respect to these already-observed repeated-position Safety events. It would not, however, prove behavior on unseen states or Exceptional Slides.

## Efficient next experiment
1. Execute -15 as the only boundary-sensitive arm on the frozen 120 seeds.
2. Execute one representative strict arm (0) as the equivalence-class representative for {-10,-5,0,+5} on this observed sample, while preserving natural-leader and independently defined Exceptional-Slide exceptions.
3. Require exact Natural Pick-92 correction and explicit synthetic/fixture controls around -15/-10/0/+5 plus Exceptional Slide before any promotion.
4. Compare both arms to Full Safety using static and repair-aware Championship Utility. If -15 and 0 are roster/decision equivalent on 120 seeds, prefer the semantically safer, simpler boundary only after unseen-state controls. If they differ, inspect every retained -15 event rather than selecting by aggregate roster aesthetics.

No threshold is selected from the sample maximum. No hard QB2/TE2 ban, position quota, player-name forcing, starter-max roster cap, or Late-WR v3 bundling is permitted.