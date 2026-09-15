# Immutable rc4.203 physical evidence — 2026-09-15

- Source/main: `fb458e076de6710a91f1162e504b5b79fb67167c` (merged PR #174, reviewed head `31f9e6991cd9f6928e023282ccd266e6a1ba6004`).
- Cloudflare Production deployment succeeded for that exact commit: `ef65bcf6-92d1-4c34-9873-c362bec002c7`. Exact-commit deployment identity does not assert arbitrary byte parity.
- Android/PWA visibly reached `v11.8.0-rc4.203` normally, without cache/app-data clearing or reinstall.
- One normal Weekly Evidence refresh ended `nicht geladen` / `PROJECTION_LANE_UNAVAILABLE`; QB, RB, WR and TE were all UNAVAILABLE.
- Physical acceptance: **FAILED / NOT DEVICE-ACCEPTED**. Classification: `RC4.203_PHYSICAL_FAIL_WEEKLY_PROJECTION_SEMANTIC_SCOPE_MISMATCH`. Production success is not device acceptance.

## Secret-safe authenticated diagnostic

| Position | HTTP / players / identities / numeric `stats.points_half` | Coverage | Consumer |
|---|---|---|---|
| QB | 200 / 107 / 107 / 107 | 100%, access SUFFICIENT | mapped=0, usable=0, semantic-scope mismatch |
| RB | 200 / 182 / 182 / 182 | 100%, access SUFFICIENT | mapped=0, usable=0, semantic-scope mismatch |
| WR | 200 / 296 / 296 / 296 | 100%, access SUFFICIENT | mapped=0, usable=0, semantic-scope mismatch |
| TE | 200 / 182 / 182 / 182 | 100%, access SUFFICIENT | mapped=0, usable=0, semantic-scope mismatch |

Source time was `UNKNOWN:none`; current roster coverage was `0/13 usable`. The proven boundary is pre-mapping semantic/distribution validation: each lane has at least one value above its weekly ceiling. Broad season/ROS scale, sparse outliers, and an explicit-`ros=false` query effect remain UNKNOWN.
