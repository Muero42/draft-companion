# Immutable rc4.201 Production / physical projection-lane evidence — 2026-09-14

This document records only the supplied Production and physical Android/PWA observations. It does not claim source-package parity, successful projection consumption, or device acceptance.

- Repository: `Muero42/draft-companion`
- Production branch: `main`
- Exact Production commit: `bd666824dac9264795de687e915faaa06c5a4f20`
- Cloudflare Production deployment: `cd1814a9-8602-4efd-b08c-b3676f231be8`
- Cloudflare deployment status: `success`
- Physical Android/PWA version displayed without cache clear or reinstall: `v11.8.0-rc4.201`
- Physical action: one `Weekly Evidence -> Jetzt prüfen`
- Physical result: the UI remained `nicht geladen`
- Exact reported failure: `PROJECTION_LANE_UNAVAILABLE · kein gültiger aktueller Projection-Snapshot verfügbar · Projections UNAVAILABLE · QB UNAVAILABLE · RB UNAVAILABLE · WR UNAVAILABLE · TE UNAVAILABLE`
- Preserved conclusion: the rc4.200 stale-green status leak is repaired because no stale `AVAILABLE` remained, but the genuinely fresh projection lane is still physically unavailable.

Canonical verdict: `RC4.201_PHYSICAL_FAIL_FRESH_PROJECTION_LANE_UNAVAILABLE_STALE_STATUS_REPAIRED`.

Production deployment success and physical device acceptance are separate states. rc4.201 is Production-deployed and physically observed, but **not device-accepted**. No cache/app-data clearing, reinstall, Production promotion, or Sleeper transaction is evidenced by this record.
