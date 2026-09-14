# rc4.202 projection consumer repair checkpoint audit

Root cause: rc4.201 required an optional top-level `positions` response echo that was absent from the production-shaped authenticated response, rejecting all rows before mapping. rc4.202 instead requires exact authenticated request provenance and homogeneous row positions.

# PITTI Codex handoff audit v251 — rc4.201

The v251 repair closes the three P1 findings without weakening rc4.201's schema-v3 invalidation, position isolation, season-scale ceilings, chronology retention, retry/backoff, quota-safe persistence, Watcher/OR1 isolation, Waiver/Trade safety, runtime identity, or 17-file package contract.

Authority remains separated into Source, Package, Preview, Production, Device-observed, and Device-accepted states. v11.8.0-rc4.202 is a source/package/preview candidate only and has no Production or device claim. v11.8.0-rc4.201 is the newest verified Production deployment at exact `main@bd666824dac9264795de687e915faaa06c5a4f20`, Cloudflare deployment `cd1814a9-8602-4efd-b08c-b3676f231be8`, and separately the newest device-observed failed runtime with verdict `RC4.201_PHYSICAL_FAIL_FRESH_PROJECTION_LANE_UNAVAILABLE_STALE_STATUS_REPAIRED`; it is not device-accepted.

No merge, Production deployment/promotion, device acceptance, cache/app-data clearing, reinstall, or Sleeper transaction was performed.

## Authority-only follow-up

The corrected v251 checkpoint is `20260914T1054Z-v251` / `2026-09-14T10:54:00Z`. rc4.200 is the immediate prior Production/physical-failure history and retains dedicated immutable evidence at `docs/PITTI_BRIDGE_HANDOFF_RC4200_PHYSICAL_PROJECTION_LANE_FAIL_2026-09-14.md`. Explicit authority history then retains rc4.199 Production `2a62e52cb88187470542840053c72cd310b18e2b`, deployment `48ab58ba-53d5-4b74-b7e6-16629256a9ee`, and separate verdict `RC4.199_PHYSICAL_FAIL_WEEKLY_PROJECTION_SEMANTIC_MISMATCH`, followed by older rc4.198; rc4.195 remains the accepted rollback. These are historical boundaries and do not supersede rc4.201 as the newest Production/device-observed authority.
