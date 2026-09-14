# rc4.200 physical projection-lane failure — 2026-09-14

## Immutable observed evidence

The acceptance session observed Cloudflare Production `main@039fbd3ff169f5476c54e893702bf3aad18035b5`, deployment `f57beed4-3794-4bae-a047-612d046432f7`, with deployment status `success`. Deployment success is recorded separately and does not imply physical device acceptance.

The Android/PWA displayed runtime identity `v11.8.0-rc4.200`. After **Jetzt prüfen**, refresh failed with `PROJECTION_LANE_UNAVAILABLE`. Start/Sit showed 13 active skill players without current verified Half-PPR projections, while the top Weekly-Evidence card could still display stale `Projections AVAILABLE · QB/RB/WR/TE AVAILABLE`.

A subsequent authenticated device diagnostic returned HTTP 200 for QB, RB, WR, and TE with season 2026, week 1, `ros=false`, 100% FantasyPros identity coverage, and numeric `stats.points_half` coverage. Every source position was `SUFFICIENT`.

## Verdict and boundary

The physical verdict is `RC4.200_PHYSICAL_FAIL_FRESH_PROJECTION_LANE_UNAVAILABLE_AND_STALE_STATUS_LEAK`. rc4.200 is Production-deployed but **not device-accepted**. This document records only the supplied acceptance-session observations; it does not claim a repair, deployment byte parity, or acceptance of rc4.201.

The immediately prior rc4.199 history remains in `docs/PITTI_BRIDGE_HANDOFF_RC4199_PHYSICAL_WEEKLY_PROJECTION_FAIL_2026-09-13.md` and is not modified by this evidence record.
