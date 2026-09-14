# rc4.202 source/candidate authority — v251
Handoff generation: `20260914T1054Z-v251`

`v11.8.0-rc4.202` is the current source/candidate authority in this tree. Canonical `main`, PR state, containing commit, and exact-head CI are mutable external evidence and MUST be freshly verified. Source, merge, 17-file package/re-extraction, and preview never imply Production deployment, physical observation, or device acceptance. Archive ZIP identity is run/environment-scoped and noncanonical.

Newest verified Production is `v11.8.0-rc4.201` from exact `main@bd666824dac9264795de687e915faaa06c5a4f20`, Cloudflare deployment `cd1814a9-8602-4efd-b08c-b3676f231be8`, status `success`. Its separate physical verdict is `RC4.201_PHYSICAL_FAIL_FRESH_PROJECTION_LANE_UNAVAILABLE_STALE_STATUS_REPAIRED`: rc4.201 is Production-deployed and device-observed but **not device-accepted**. Immutable evidence: `docs/PITTI_BRIDGE_HANDOFF_RC4201_PHYSICAL_PROJECTION_LANE_FAIL_2026-09-14.md`.

Preserved history remains explicit: rc4.200 is the immediately prior verified Production at `039fbd3ff169f5476c54e893702bf3aad18035b5`, deployment `f57beed4-3794-4bae-a047-612d046432f7`, with separate failed physical verdict `RC4.200_PHYSICAL_FAIL_FRESH_PROJECTION_LANE_UNAVAILABLE_AND_STALE_STATUS_LEAK`; rc4.199 is prior Production/history with verdict `RC4.199_PHYSICAL_FAIL_WEEKLY_PROJECTION_SEMANTIC_MISMATCH`; rc4.198 is older history; rc4.195 remains the prior fully accepted rollback.

## Mutable live takeover targets
Fresh live READ-ONLY verification must cover Draft Companion PR #172 as historical merged rc4.201 provenance only, the new rc4.202 follow-up PR as the current candidate lane once created, Draft Companion PR #163 as a historical/discoverable v248 anchor only, and separate pitti-watcher PR #6 at expected head `77221ceeb900458e95c32d78c1ad395a37422e5d` subject to fresh live verification. These are mutable verification targets, not immutable authority. Keep source, package, preview, Production, device-observed, and device-accepted distinct.

Root cause and repair boundary: the authenticated current-week FantasyPros response did not echo the optional top-level `positions` field. rc4.201 treated that absent response echo as `WRONG_PROVIDER_POSITION` before player mapping, making all four HTTP-200 lanes consumer-zero despite valid request provenance, homogeneous positional rows, FP identity, and numeric `stats.points_half`. rc4.202 uses the actual authenticated request provenance plus every row's position; wrong season/week/position/ROS/scope, malformed, season-like, stale, and all-zero inputs remain fail-closed. No projections `scoring` query parameter is introduced, and `stats.points_half` remains authoritative.

Current gate: `VERIFY_CANONICAL_AUTHORITY_THEN_AUTHORIZED_WORK`. rc4.202 is not Production-deployed, physically observed, or device-accepted.

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
# PITTI HANDOFF COMPLETENESS MATRIX — v242
Generation: `20260911T1352Z-v242`

PASS requires:
- v11.8.0-rc4.196 source is MERGED/HISTORICAL through PR #143; current canonical main is always dynamically verified.
- v11.8.0-rc4.195 remains production/device authority with its physical acceptance evidence preserved.
- rc4.196 is NOT production-deployed and NOT physically accepted; deployment parity is `UNKNOWN_REQUIRES_REVERIFICATION`.
- rc4.196 local package identity is 17 files, SHA-256 `a654422c907e3127335c20df1956fc974442c3eb3be011a5d8eb1e9b71f4500d`, `PACKAGED_ONLY_NOT_DEPLOYED`.
- Gate `VERIFY_CANONICAL_AUTHORITY_THEN_AUTHORIZED_WORK` is aligned across CURRENT, LOCK, COMMAND, SEAL, bootstrap, handoff and preflight.
- Source, package, production deployment, deployed-byte parity and physical acceptance remain distinct; no source merge may imply a later state.
- Full strict, authority, negative-regression, seal-integrity and package/re-extraction checks pass; all 17 runtime blobs match canonical rc4.196 main.
- Live Sleeper state is roster/ownership authority; Reserve/IR is never an ordinary drop, K comparisons remain K-only, and Waiver/Trade/Boone fail-closed invariants remain intact.
- AUTO is continuous same-turn execution and STATUS is report-only; historical blocks cannot supersede this active matrix. Empty assistant response after tool work is forbidden.

Canonical permission boundary: AGENTS.md. Dynamic authority must be reverified before dependent continuation or promotion. QB2 authority remains draft-only exclusion after QB1 with evidence-backed, legal-capacity season exceptions as defined in `PITTI_CURRENT_STATE.json:qb_policy`.
