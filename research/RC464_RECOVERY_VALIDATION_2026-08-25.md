# rc4.64 Recovery Validation — 2026-08-25

## Candidate
Commit `4df014a9d63fa4bbff293b27e26685c585f22229` on `pitti-rc464-recovery-fixtures`.
Frozen production baseline remains Android-verified rc4.63 commit `a106b39dcf72fed6e0ac151382bc9ba19316fdb6` until packaging/runtime verification.

## Actual production-code delta
`app.js`: 13 insertions, 3 deletions. No PairSum, Rolling, threshold-family search, global position cap, player-name forcing, or late-WR quota was introduced.

## Causal repair
The Player-Quality Safety gate may no longer promote an already-rostered QB/TE merely because that repeated position has the strongest overall panel rank. The repair acts only on Safety-promotion eligibility. It does not add another generic QB/TE score penalty and does not block a repeated QB/TE that wins naturally before Safety.

The exceptional-slide path reuses the pre-existing rc4.63 conditions exactly:
- QB: panel rank <=45 and slide vs ADP >=35 picks.
- TE: panel rank <=35 and slide vs ADP >=30 picks.

## Deterministic validation
GitHub Actions run `32886315760`, job `97927501637`: SUCCESS.
Passed:
- `node --check app.js`
- `RC4_64_SAFETY_RESURRECTION_REGRESSION.js`
- dress-rehearsal hardening regression
- position-path regression
- player-quality / expert-health regression
- Return geometry / market regression
- scarcity double-count regression

The new mechanism regression covers:
1. Pick-92-style QB2 Safety resurrection is blocked.
2. TE2 Safety resurrection is blocked.
3. First QB remains normal.
4. First TE remains normal.
5. A repeated QB that naturally wins remains allowed.
6. A repeated TE that naturally wins remains allowed.
7. Exceptional QB slide remains Safety-eligible.
8. Exceptional TE slide remains Safety-eligible.
9. Clean RB/WR Safety behavior remains intact.

## Important diagnostic correction
The earlier `rc464-safety-resurrection-recovery.yml` failures had zero jobs and therefore were workflow-definition failures, not model/regression failures. The parser-safe `rc464-recovery-v2` path subsequently executed the actual patch and tests successfully. Do not treat the earlier red runs as evidence against the candidate.

## Promotion status
Candidate is code/regression validated but NOT yet Android-verified and therefore is not the installed/production release. Do not relabel it as rc4.64 installed. Before any phone installation package is promoted, run the normal version/cache/package-integrity gates and preserve rc4.63 as rollback.

## Remaining highest-value validation
Use natural decision fixtures / a prospective natural Sleeper mock ahead of synthetic full-roster utility. Synthetic full-roster optimization remains diagnostic only because its roster construction was invalid for the league.
