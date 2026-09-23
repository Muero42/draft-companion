# PITTI CODEX/HANDOFF AUDIT — v262

Handoff generation: `20260920T1624Z-v262`

## Verdict

**PASS as a source-authority reconciliation candidate; Production remains separately gated.**

Canonical runtime source is `v11.8.0-rc4.206` through merged **PR #191** at `d5954d66877df877f950a4a41f32baad59a66748` (tree `07248a6ac3c5f8872893a2c805155be8a1a5e806`), from reviewed head `888b0a8f62608ff2afabf3564409f0198f78e8fd`. The rc4.206 bounded repair is source-merged, not Production/device accepted.

## Anti-regression assertions

1. Selected PITTI weekly ranks use exact configured expert IDs; broad ECR is a distinct metric/lane and cannot silently substitute.
2. Game Context is bounded to trusted ESPN-hosted scoreboard variants and must match requested regular-season context, complete plausible week size, unique events/teams, kickoff and venue.
3. Consumer validation rechecks completeness/uniqueness; malformed/partial snapshots fail closed.
4. Team Total remains unavailable until an approved same-event total+spread source is proven.
5. Production/device authority remains rc4.205 at `66a6551d4a4520bd06f3b77a2f6bbdb297bfe6f1`; `v11.8.0-rc4.206` is not Production/device accepted.
6. Source merge `d5954d66877df877f950a4a41f32baad59a66748` does not imply deployment, physical acceptance, Sleeper transaction, Pitti Watcher mutation or Team Total availability.
7. The invalid local v261 authority is not reused.

The post-merge red gates on `d5954d66877df877f950a4a41f32baad59a66748` are classified as stale v260 authority-contract drift, not evidence that the reviewed rc4.206 runtime repair regressed. v262 updates the lock/current/command/seal/postmerge contract and adds explicit rc4.206 source-merge negatives.

Next gate: `ELIGIBLE_FOR_SEPARATELY_AUTHORIZED_PRODUCTION_DEPLOYMENT_GATE`.
