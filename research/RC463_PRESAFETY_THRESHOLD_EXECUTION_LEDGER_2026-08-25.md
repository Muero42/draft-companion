# rc4.63 Pre-Safety Threshold Execution Ledger — 2026-08-25

## Active valid run
GitHub Actions run `32869793146` — push event on branch head, workflow `pitti-rc463-presafety-threshold-ab.yml`.
- Controls job PASS.
- 24 matrix jobs: thresholds -15 and 0 × shards 0..11.
- Checkout explicitly pins `pitti-rc463-presafety-threshold-ab`, avoiding PR merge-ref contamination.
- Exact metadata artifact: `9569895117`, previously used by the 120/120 same-input parity run.

## Quarantined failed route
Draft PR #25 was opened only as a CI trigger and immediately closed when it triggered unrelated legacy PR workflows and produced a merge-ref environment inconsistent with the frozen research branch. Its threshold run `32869628533` is INVALID for model interpretation. First observed failure was `ReferenceError: DRAFT_ACUTE_STATUS_2026 is not defined`, caused by PR merge-ref source mixing, not threshold policy behavior.

Do not reopen PR #25 and do not interpret any result from run `32869628533` as threshold evidence. The valid route is branch-head push run `32869793146` or a later branch-head push successor.

## Parallel prepared gates
- `rc463_presafety_threshold_boundary_controls_2026.js` — PASS in valid run controls job.
- `rc463_presafety_threshold_aggregate_2026.js` — prepared for 24 shard artifacts.
- `RC463_PRESAFETY_THRESHOLD_FREEZE_RISK_2026-08-25.md` — promotion contract.

No production/main/gh-pages/Android mutation. rc4.63 remains frozen.