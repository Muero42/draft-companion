# rc4.63 Pre-Safety Threshold Challenger — Freeze Contract

Research-only. No production/main/gh-pages/Android mutation is authorized by this document.

## Baseline
- Production reference remains Android-verified rc4.63.
- Threshold research branch is isolated: `pitti-rc463-presafety-threshold-ab`.
- Input metadata must be the exact previously parity-validated frozen Sleeper snapshot used by the same-input 120-seed gate.
- The failed PR merge-ref/source-mixing run and the earlier `__thr` scope-leak run are quarantined and are not evidence.

## Allowed behavioral delta
Only this decision is allowed to differ from Full Safety:
1. candidate is QB or TE;
2. that position is already rostered at least once;
3. candidate was promoted by Player Quality Safety;
4. candidate was not the natural pre-Safety leader;
5. candidate is not covered by the existing elite Exceptional-Slide semantics;
6. original pre-Safety raw gap versus best legal RB/WR is below the tested threshold.

Then, and only then, undo the Safety raw-score promotion for that candidate. No hard exclusion is introduced: the candidate remains on the board at its original raw score.

## Explicitly forbidden regressions
- no global QB2/TE2 ban;
- no position quota derived from starter maxima;
- no player-name forcing or Chase-Brown special case;
- no PairSum-v2, Rolling-v1 or v4 resurrection;
- no Late-WR-v3 bundling in this causal test;
- no K/DST policy change;
- no change to first-QB/first-TE behavior;
- no change to RB/WR admissibility;
- no reinterpretation of user preference tie-breakers as hard rules;
- no mutation of the already Android-verified rc4.63 package during research.

## Required gates before promotion discussion
A challenger must pass all of the following:
- 120/120 frozen-input threshold shards complete with no source/input drift;
- aggregate seed completeness and deterministic artifact audit;
- Natural Pick-92 executable fixture: the known QB2 resurrection defect is suppressed and Blake Corum remains the natural skill-position leader unless a genuinely stronger legal candidate exists under the unchanged model;
- boundary controls around the chosen threshold;
- existing Exceptional-Slide cases remain admissible;
- first QB/TE and RB/WR non-interference controls;
- static Championship Utility comparison to Full Safety;
- repair-aware Pre-Week-1 Championship Utility comparison to Full Safety;
- full diff audit showing no unrelated production behavior change;
- freeze-risk assessment must prefer the smallest semantically sufficient implementation.

Roster aesthetics alone are never a promotion criterion. If Utility and structural correctness disagree, remain on rc4.63 and investigate rather than promoting.