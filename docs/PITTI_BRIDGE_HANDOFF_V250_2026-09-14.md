# PITTI bridge handoff v250 — rc4.201 P1 repair

- Generation: `20260914T1200Z-v250` (v248 is already owned by PR #163 and must not be reused).
- Source candidate: `v11.8.0-rc4.201`; not Production-deployed or device-accepted.
- Newest verified Production: `v11.8.0-rc4.200`, exact `main@039fbd3ff169f5476c54e893702bf3aad18035b5`, Cloudflare deployment `f57beed4-3794-4bae-a047-612d046432f7`, status `success`, branch `main`.
- Newest physical result, recorded separately: `RC4.200_PHYSICAL_FAIL_FRESH_PROJECTION_LANE_UNAVAILABLE_AND_STALE_STATUS_LEAK`; rc4.200 is not device-accepted. rc4.198 is previous deployment history; rc4.195 is the prior fully accepted rollback.
- FantasyPros projections request documented `week` plus `ros=false`, never unsupported `scoring=HALF`. Provider `season`/`week`/`positions` prove weekly scope and `stats.points_half` supplies Half-PPR evidence; response metadata `scoring=STD` does not invalidate that field.
- Current gate: `VERIFY_CANONICAL_AUTHORITY_THEN_AUTHORIZED_WORK`.
