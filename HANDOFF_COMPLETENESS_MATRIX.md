# rc4.197 post-merge source/package authority — v244
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
