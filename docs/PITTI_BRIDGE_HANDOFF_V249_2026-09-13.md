# PITTI bridge handoff v249 — rc4.200 P1 repair

- Generation: `20260913T1930Z-v249` (v248 is already owned by PR #163 and must not be reused).
- Source candidate: `v11.8.0-rc4.200`; not Production-deployed or device-accepted.
- Newest verified Production: `v11.8.0-rc4.199`, exact `main@2a62e52cb88187470542840053c72cd310b18e2b`, Cloudflare deployment `48ab58ba-53d5-4b74-b7e6-16629256a9ee`, status `success`, branch `main`.
- Newest physical result, recorded separately: `RC4.199_PHYSICAL_FAIL_WEEKLY_PROJECTION_SEMANTIC_MISMATCH`; rc4.199 is not device-accepted. rc4.198 is previous deployment history; rc4.195 is the prior fully accepted rollback.
- FantasyPros projections request documented `week` plus `ros=false`, never unsupported `scoring=HALF`. Provider `season`/`week`/`positions` prove weekly scope and `stats.points_half` supplies Half-PPR evidence; response metadata `scoring=STD` does not invalidate that field.
- Current gate: `VERIFY_CANONICAL_AUTHORITY_THEN_AUTHORIZED_WORK`.
