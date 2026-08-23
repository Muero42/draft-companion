# PairSum v2 pre-outcome sanity expectations — frozen before screen results

This note is written while Actions run 32615699210 is still in its nested smoke step, before any PairSum-v2 screen artifact exists. It is a plausibility check, not a target to optimize toward.

## Independent 1.09 -> 2.02 control arithmetic
Using the already-PASS rc4.59 turn-market artifact (not PairSum-v2 output), approximate two-pick selected-panel package costs for several forced 1.09 candidates are:

- Amon-Ra St. Brown: current panel 5.84 + expected next-best panel ~11.78 = ~17.62
- Jaxon Smith-Njigba: 6.52 + ~11.62 = ~18.14
- Jonathan Taylor: 8.30 + ~11.78 = ~20.08
- James Cook III: 8.45 + ~11.89 = ~20.34
- Chase Brown: 11.89 + ~11.75 = ~23.64
- Ashton Jeanty: 12.40 + ~11.44 = ~23.84

The exact candidate frontier and parent-state mix in PairSum-v2 will differ, so these are not expected selection frequencies. They do establish scale sanity:
- a PairSum branch should not repeatedly prefer Chase Brown or Brock Bowers at 1.09 over materially better current-panel players merely because of tiny future-board differences;
- Amon-Ra / JSN / Taylor / Cook are all plausible package winners depending on actual availability/frontier;
- Brown remains a natural 2.02 target because his independent 1.09->2.02 return probability is 97.5%, not because PairSum is instructed to prefer or avoid him.

## Long-gap scale expectation
Joint-v1 showed that at pick 12 candidate-dependent expected 3.09 best-panel ranks differed by only ~0.032 ranks on average in its sampled states. PairSum-v2 leaves a ~0.032 difference as ~0.032 package-cost units; it cannot become a unit-variance signal. Therefore, if current panel ranks differ by several ranks, the future term should not overturn them unless the simulated future-board difference itself is genuinely several ranks.

## Rejection triggers independent of outcome
Reject PairSum-v2 even with favorable outcome direction if any of these occur:
1. Bowers/Brown-type unexplained 1.09 large-quality reaches recur;
2. winner changes under frontier iteration reversal;
3. future QB/TE legality is violated;
4. a microscopic future-board difference repeatedly overturns multi-rank current Player Quality gaps;
5. current canonical score/rawScore mutation occurs;
6. result is driven by one seed/state rather than a repeatable sequencing mechanism.

Do not alter these expectations after seeing run 32615699210.