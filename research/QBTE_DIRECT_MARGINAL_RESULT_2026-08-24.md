# QB2/TE2 direct marginal mechanism result — 2026-08-24

Research-only. No production/runtime promotion. Seeds `459710001..459710060` remain quarantined mechanism/audit data and MUST NOT be used to fit a policy threshold.

## Important correction during AUTO
The first direct-marginal run reported only 73 events because it mistakenly reused the original repeat-centered PlayerQualitySafety band to identify an RB/WR alternative. That silently reproduced the diagnosed architectural defect (`admissibility` should precede Safety): in 93/166 repeat decisions the repeat QB/TE itself made the original quality band so narrow that no RB/WR alternative qualified. That run is INVALID for mechanism conclusions.

The corrected schema-v2 run `32681654639` fails closed unless all **166/166** metadata-safe repeat QB/TE decisions are covered. It compares the repeated QB/TE with the highest-raw visible eligible RB/WR natural alternative, deliberately without reusing the repeat-centered safety band. PASS, exact coverage 166.

## Corrected direct-value result
Using the independent Sleeper-history market/outcome bridge and exact 1QB/2WR/1RB/1TE/2FLEX topology, with no later-draft cascade:
- 166 repeat decisions total.
- repeated QB/TE beats the natural RB/WR alternative on direct mean weekly lineup value in 120 states, ties 1, loses 45.
- Aggregate mean delta is approximately **-0.0074 weekly points** and median **+0.1218**: the distribution is strongly heterogeneous and the mean is pulled down by several large early losses.
- QB repeats: 130 states, 99 wins / 1 tie / 30 losses, mean about **+0.139 weekly points**.
- TE repeats: 36 states, 21 wins / 15 losses, mean about **-0.534 weekly points** despite a slightly positive median. This is another warning against a single global rule.

## Draft-stage structure is the key new signal
Direct repeat-vs-RB/WR value by own pick:
- pick 49: n=8, repeats 0/8 better, mean ~**-1.433** weekly points (all Colston Loveland TE2).
- pick 52: n=4, 0/4 better, mean ~**-1.195** (all Tyler Warren TE2).
- pick 89: n=6, 0/6 better, mean ~**-1.682** (QB2).
- pick 92: n=12, 0/12 better, mean ~**-0.661** (QB2).
- pick 109: n=3, 1/3 better, mean ~**-0.097**.
- pick 112: n=22, 19/22 better, mean ~**+0.065** but with a large negative outlier; mixed transition zone.
- pick 129: n=44, 37/44 better, mean ~**+0.045**; still heterogeneous.
- pick 132: n=22, 18/22 better, mean ~**-0.083** because of large negative outliers.
- pick 149: n=45, **45/45 better**, mean ~**+0.705**; almost all Kyler Murray as a final-pick QB alternative versus fringe RBs.

## Interpretation
This resolves an apparent contradiction. A global QB2/TE2 hard ban loses because late-draft repeat QB/TE can have genuine direct startability/streaming/contingency value versus fringe RB/WR. But the same evidence strongly argues that **early/mid-draft repeat QB/TE promotions are often directly harmful**, especially TE2 at 49/52 and QB2 at 89/92.

Do not turn these pick cutoffs into a production rule from this seed family. They are mechanism evidence only. The next policy candidate should be state/value-aware and naturally become more permissive late as RB/WR alternatives weaken. Candidate admissibility should be based on independent marginal lineup/option value versus the best eligible RB/WR alternative, plus separate Return/market evidence and roster-stage option value. It should not use a fixed roster-count ban, a repeat-centered Safety band, or a threshold tuned on these 60 seeds.

## Regression invariant
Any future QB2/TE2 challenger must:
1. evaluate admissibility before PlayerQualitySafety;
2. compare against the best eligible RB/WR natural alternative, not against a band defined by the repeat itself;
3. preserve exact 166-event audit coverage on this mechanism set;
4. keep this set excluded from threshold fitting;
5. clear fresh/disjoint full-draft validation before any production consideration.
