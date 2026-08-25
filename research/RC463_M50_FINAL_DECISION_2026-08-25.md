# rc4.63 Pre-Safety Threshold Family — FINAL DECISION (2026-08-25)

## Decision
CLOSE the pre-Safety threshold family for pre-draft production. Do not promote threshold 0, -15, -50, or tune intermediate thresholds on the same 120 seeds. Android-verified rc4.63 remains the final mock candidate.

## Final M50 gate
Workflow run 32880708411 completed successfully: all 12 M50 shards and the exact same-input independent complete-roster utility job PASS.

Frozen metadata SHA-256: `f67d33ed3f9428413667346cf501916d71fafc9e699abad896c3b327cea05a4d`.

M50 minus exact same-input Full Safety, 120 paired seeds:
- changed rosters: 66; same rosters: 54
- mean expected-wins delta Weeks 1-14: -0.0041666667
- median delta: 0
- M50 better/same/worse: 24 / 63 / 33
- changed-roster mean delta: -0.0075757576
- min/max: -0.2727272727 / +1.1136363636
- QB3+ rate under M50: 59.17%
- TE3+ rate under M50: 7.5%
- selected expert panel used in outcome fit: false
- policy promotion authorized by evaluator: false

## Interpretation
M50 is dramatically less damaging than the broader guards, but it still fails the predeclared stop rule: it changes 55% of rosters, does not produce positive independent utility, and leaves QB3+ in roughly 59% of rosters. It therefore does not provide a sufficiently strong causal/utility case to justify a late production change before the 2026-08-31 draft.

The +1.1136 outlier at seed 459820096 must not be used to justify promotion; despite that outlier, the paired mean remains negative and M50 is worse more often than better among nonzero outcomes.

## Locked consequences
1. No -45/-40/-35/... threshold search on these tuning seeds.
2. No rc4.64 Safety-threshold implementation for pre-draft production.
3. No reopening PairSum-v2, Rolling-v1/v4, global QB2/TE2 bans, starter-limit roster caps, or player-name forcing.
4. The verified Pick-92 defect remains documented evidence about Full Safety, not authorization for an unvalidated broad fix.
5. Proceed immediately to natural Sleeper mocks with the Android-verified rc4.63 candidate and collect prospective evidence.
6. Any future Safety fix is post-draft/research unless a new severe live blocker appears; it must use fresh holdout evidence and a causally isolated implementation.

## Mock gate
The mock-readiness contract in `research/RC463_FINAL_MOCK_READINESS_GATE_2026-08-25.md` now resolves to its M50-fail branch: rc4.63 is the candidate to test naturally on phone. Production/main/gh-pages remain unchanged.