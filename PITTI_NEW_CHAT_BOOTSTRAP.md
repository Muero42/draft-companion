# rc4.203 Production/device-failure authority — v253
Handoff generation: `20260915T0558Z-v253`

## v253 CURRENT
Canonical `main@fb458e076de6710a91f1162e504b5b79fb67167c` is rc4.203, merged via historical PR #174 and successfully Production-deployed as `ef65bcf6-92d1-4c34-9873-c362bec002c7`. Android/PWA observed `v11.8.0-rc4.203`, but Weekly Evidence failed `PROJECTION_LANE_UNAVAILABLE`; the physical verdict is `RC4.203_PHYSICAL_FAIL_WEEKLY_PROJECTION_SEMANTIC_SCOPE_MISMATCH`, FAILED and **NOT device-accepted**. Production success and device acceptance remain distinct. rc4.202 -> rc4.201 -> rc4.200 -> rc4.199 -> rc4.198 are historical; rc4.195 remains the accepted rollback reference.

The proven first boundary is pre-mapping semantic scope: at least one numeric `stats.points_half` per QB/RB/WR/TE lane exceeded the weekly ceiling. Missing access/numerics, mapping, proxy mutation, and chronology are disproven as the first failure. Broad season scale, sparse outliers, and query-shape impact remain UNKNOWN.

Exact gate: `RC4203_SECRET_SAFE_PROVIDER_AB_DIAGNOSTIC_THEN_PROVEN_REPAIR`. First fresh-verify main, merged PR #174, historical/discoverable PR #163 (cannot override v253), and separate `pitti-watcher` PR #6 at expected head `77221ceeb900458e95c32d78c1ad395a37422e5d`; then execute exactly one secret-safe same-credential provider A/B. These are mutable verification targets. Keep source, package, preview, Production, device-observed, and device-accepted distinct. No speculative rc4.204, automatic Sleeper transaction, app reinstall, cache/app-data clear, or device loop. AUTO works silently on independent safe work; AUTO BLOCK affects only the dependent lane; STATUS is report-only.

Takeover reading order: `AGENTS.md`, CURRENT, LOCK, COMMAND, immutable rc4.203 evidence, root-cause diagnosis, v253 bridge, v253 audit, SEAL, then this file. Start/Sit is WEEKLY-primary; Waiver/FA and Trade are not globally blocked by WEEKLY when sufficient independent evidence exists; K/DST is separate; freshness is cadence-aware.

## HISTORICAL/SUPERSEDED CHECKPOINT CONTENT
The content below is retained only as history and cannot override v253.

# rc4.203 source/candidate authority — v252
Handoff generation: `20260914T1727Z-v252`

`v11.8.0-rc4.203` is the current source/package/preview candidate in this tree and is not Production-deployed, device-observed, or device-accepted. Canonical `main`, PR state, containing commit, and exact-head CI remain mutable external evidence. The 17-file package has `PACKAGED_ONLY_NOT_DEPLOYED` semantics and its archive identity is run/environment-scoped, never cross-environment authority.

Newest verified Production and newest device-observed failure is `v11.8.0-rc4.202` at exact `main@4e2b9af1c8562c0273f39503c2c1c90a15acce00`, Cloudflare deployment `d1e38b4b-27ed-4f87-bfa7-0e99f282de5d`, status `success`. Its separate physical verdict is `RC4.202_PHYSICAL_FAIL_YEARLESS_PROJECTION_CHRONOLOGY_REJECTED`; it is **not device-accepted**. Immutable observation: `docs/PITTI_BRIDGE_HANDOFF_RC4202_PHYSICAL_PROJECTION_LANE_FAIL_2026-09-14.md`.

Preserved history remains explicit: rc4.201 is the immediate prior Production/physical-failure history, followed by rc4.200, rc4.199 (`RC4.199_PHYSICAL_FAIL_WEEKLY_PROJECTION_SEMANTIC_MISMATCH`), and older rc4.198; rc4.195 remains the accepted rollback.

## Mutable live takeover targets
Fresh live READ-ONLY verification must cover merged PR #173 as historical rc4.202 provenance only, the new rc4.203 follow-up Draft PR as the current candidate lane, PR #172 as historical rc4.201 provenance only, PR #163 as a historical/discoverable v248 anchor only, and separate pitti-watcher PR #6 at expected head `77221ceeb900458e95c32d78c1ad395a37422e5d`. These are mutable verification targets. Keep source, package, preview, Production, device-observed, and device-accepted distinct.

Root cause and repair boundary: a yearless current FantasyPros projection update date such as `09/14` reached `Date.parse`, became a 2001 timestamp, and made every otherwise mapped current-week record fail `INVALID_PROVIDER_CHRONOLOGY`. rc4.203 applies the existing bounded requested-season inference (within eight days of authenticated retrieval) to projections. Out-of-window dates and every malformed, contradictory, wrong season/week/position/ROS/provenance, season-scale, all-zero, or definitively unmapped lane still purge current and prior rows. `stats.points_half` remains Half-PPR authority and the projections request still has no unsupported `scoring` parameter.

Current gate: `VERIFY_CANONICAL_AUTHORITY_THEN_AUTHORIZED_WORK`.

## HISTORICAL/SUPERSEDED CHECKPOINT CONTENT
# rc4.198 post-merge source/package authority — v245
Handoff generation: `20260912T1317Z-v245`

Canonical main was dynamically verified at `826a1f3327ffac643f3c32217246133ea32bd3ac`. `v11.8.0-rc4.198` is the current source/main authority and has a verified **17-file source-byte/re-extraction parity** package with status `PACKAGED_ONLY_NOT_DEPLOYED`. Archive SHA values are observations scoped to one run/environment and MUST NOT be treated as cross-environment archive-byte identity.

Production and device authority remain `v11.8.0-rc4.196` at exact deployed commit `082d77003f6616e290146698641aebe63f37b8c2`, deployment `da039536-7733-4b07-8f0c-70cc6e0bc8b7`, with verdict `RC4.196_PHYSICAL_PARTIAL_PASS_NOT_ACCEPTED`. `v11.8.0-rc4.195` remains the prior fully accepted rollback reference. No rc4.198 deployment or device evidence is claimed.

PR #156 was squash-merged from reviewed head `931713f8f8beaa70edbfb75041b2c708fae66109` onto base `62d7ecf11774700551b6e5a0497ec054e327a0d7` as commit `826a1f3327ffac643f3c32217246133ea32bd3ac` with tree `1e91afc64a61f4aad08f7fc50d687736211b3d87`. This is historical merge provenance only and proves neither deployment nor device acceptance. The rc4.198 archive SHA is noncanonical run/environment-scoped evidence only.

Current gate: `VERIFY_CANONICAL_AUTHORITY_THEN_AUTHORIZED_WORK`. Before continuation or promotion, dynamically verify canonical Git/GitHub authority and exact-head checks.

## HISTORICAL/SUPERSEDED v244 CONTENT

# rc4.197 post-merge source/package authority — v244 [HISTORICAL/SUPERSEDED]
Handoff generation: `20260912T0545Z-v244`

Canonical main was dynamically verified at `a2d3b4395d207ce54ccf90d2e028300ba35d40d1`. `v11.8.0-rc4.197` is the current source/main authority and has a verified **17-file source-byte/re-extraction parity** package with status `PACKAGED_ONLY_NOT_DEPLOYED`. Archive SHA values are observations scoped to one run/environment and MUST NOT be treated as cross-environment archive-byte identity.

Production and device authority remain `v11.8.0-rc4.196` at exact deployed commit `082d77003f6616e290146698641aebe63f37b8c2`, deployment `da039536-7733-4b07-8f0c-70cc6e0bc8b7`, with verdict `RC4.196_PHYSICAL_PARTIAL_PASS_NOT_ACCEPTED`. `v11.8.0-rc4.195` remains the prior fully accepted rollback reference. No rc4.197 deployment or device evidence is claimed.

Current gate: `VERIFY_CANONICAL_AUTHORITY_THEN_AUTHORIZED_WORK`. No runtime/product behavior changed. No deployment, cache clear/reinstall, or Sleeper transaction is authorized by this checkpoint.

AUTO queue takeover remains fail-closed. No device-side trial-and-error. Never send status/progress/acknowledgement messages during AUTO. Empty assistant response after tool work is forbidden.

## HISTORICAL/SUPERSEDED v243 CONTENT

# rc4.196 physical-partial authority — v243
Handoff generation: `20260911T1735Z-v243`

Canonical main was dynamically verified at `082d77003f6616e290146698641aebe63f37b8c2`. rc4.196 is source-merged and its Cloudflare Production deployment is **VERIFIED SUCCESS** for that exact commit (deployment `da039536-7733-4b07-8f0c-70cc6e0bc8b7`). This proves deployment identity, not arbitrary byte parity or full device acceptance.

The installed Android/PWA showed `v11.8.0-rc4.196` without cache clearing or reinstall. Canonical verdict: `RC4.196_PHYSICAL_PARTIAL_PASS_NOT_ACCEPTED`. Preserved physical lanes: Sleeper Live `<1 Min.`, W1 projection refresh with an observed 728 records, fail-closed Waiver/FA, D/ST streaming, K-only comparison, Trade Board v8 with Boone/Yahoo 263/264 and HOLD, Watcher PASS, and separate Reserve/IR. Blockers: weekly ranks and selected PITTI panel unavailable; Start/Sit cards did not consume/display valid projections independently; game/opponent/weather/lock context unavailable; 14 realistic skill players lacked complete Rank+Projection evidence. Full rc4.196 acceptance is forbidden until a later fixed build passes a new canary.

rc4.195 is the prior fully accepted historical/rollback reference, **not current production**. rc4.196 package identity remains 17 files, `sha256:a654422c907e3127335c20df1956fc974442c3eb3be011a5d8eb1e9b71f4500d`, and is distinct from source, deployment, byte parity, and device acceptance. Current gate: `VERIFY_CANONICAL_AUTHORITY_THEN_AUTHORIZED_WORK`. Runtime/product behavior is unchanged by this checkpoint.

## HISTORICAL/SUPERSEDED v242 CONTENT
Generation: `20260911T1352Z-v242`
AUTO queue takeover: load CURRENT active/ready lanes and continue them in the same turn within user-authorized scope.
No device-side trial-and-error. Empty assistant response after tool work is forbidden. Never send status/progress/acknowledgement messages during AUTO while executable work exists.

# PITTI NEW CHAT BOOTSTRAP — v242

Source/runtime v11.8.0-rc4.196 is merged through PR #143; merge commit `555487237c9075d5e5ceeb1fee196f4763f87cc3` is historical provenance and current main must be verified dynamically. v11.8.0-rc4.195 remains production/device authority. rc4.196 is not deployed or physically accepted; deployment parity is UNKNOWN_REQUIRES_REVERIFICATION. Its local package identity is 17 files, SHA-256 `a654422c907e3127335c20df1956fc974442c3eb3be011a5d8eb1e9b71f4500d`, PACKAGED_ONLY_NOT_DEPLOYED.

Current gate: `VERIFY_CANONICAL_AUTHORITY_THEN_AUTHORIZED_WORK`. Before continuation or promotion, dynamically verify local repository identity, branch, HEAD and working tree against canonical Git/GitHub remote, main HEAD, relevant PR state and exact-head CI. If evidence is unavailable or contradictory, stop the dependent action fail-closed. Then follow the currently user-authorized work package. A source commit or merge never proves deployment parity or physical device acceptance.

Historical v235 provenance (not an operative boundary): see PITTI_CURRENT_STATE.json historical_superseded.v235_local_request. Verify current file and branch authority dynamically.

AUTO/AUTO BLOCK continuous same-turn execution; checkpoint/re-inventory after every package; waiting blocks only dependent lane; STATUS report-only.

Canonical permission boundary: AGENTS.md. Deterministic local validation: `node tools/strict-suite.mjs`; dynamic takeover: `node tools/takeover-authority.mjs <fresh-github-evidence.json>`. The evidence file is an external observation, never tracked CURRENT status. Read the schema and limits in PITTI_CODEX_WORK_PACKAGE.md.

QB2 phase authority: Draft: after QB1, QB2 recommendation/drafting is excluded until a future explicit user decision. Season: context-dependent QB2 exceptions through waiver/free agency/trade/roster optimization remain possible with verified evidence and legal capacity; same-bye and future D/ST costs matter. Season exceptions never retroactively weaken the draft rule. Canonical machine policy: PITTI_CURRENT_STATE.json:qb_policy.

Earlier rc4.190/rc4.192/rc4.194 identities are historical and cannot override the v242 authority above.

rc4.196 source is MERGED/HISTORICAL through PR #143; rc4.195 remains production/device authority. rc4.196 deployment parity is UNKNOWN_REQUIRES_REVERIFICATION and no physical acceptance is claimed.
