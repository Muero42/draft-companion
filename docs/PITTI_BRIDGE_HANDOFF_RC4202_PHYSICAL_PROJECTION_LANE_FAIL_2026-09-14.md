# Immutable rc4.202 Production / physical projection-lane evidence — 2026-09-14

This document records the supplied Production and physical Android/PWA observation only. It does not claim source-package parity, successful projection consumption, or device acceptance.

- Repository: `Muero42/draft-companion`
- Production branch and exact commit: `main@4e2b9af1c8562c0273f39503c2c1c90a15acce00`
- Cloudflare Production deployment: `d1e38b4b-27ed-4f87-bfa7-0e99f282de5d`
- Deployment URL: `https://d1e38b4b.draft-companion.pages.dev`
- Cloudflare status: `success`
- Physical Android/PWA runtime: `v11.8.0-rc4.202`
- Physical action: exactly one normal `Weekly Evidence -> Jetzt prüfen`
- Physical result: `nicht geladen`
- Exact failure boundary: `PROJECTION_LANE_UNAVAILABLE · kein gültiger aktueller Projection-Snapshot verfügbar · Projections UNAVAILABLE · QB UNAVAILABLE · RB UNAVAILABLE · WR UNAVAILABLE · TE UNAVAILABLE`
- Cache/app data was not cleared, the app was not reinstalled, and no Sleeper transaction was executed.

Canonical verdict: `RC4.202_PHYSICAL_FAIL_YEARLESS_PROJECTION_CHRONOLOGY_REJECTED`.

The bounded source investigation found that a current FantasyPros projection response can carry its update date without a year (for example `09/14`). The rc4.202 consumer passed that value to unbounded JavaScript date parsing, which resolves it to 2001, and then rejected every mapped record as stale `INVALID_PROVIDER_CHRONOLOGY`. This diagnosis is source/fixture evidence for the next candidate; it does not rewrite the physical observation or imply device acceptance.
