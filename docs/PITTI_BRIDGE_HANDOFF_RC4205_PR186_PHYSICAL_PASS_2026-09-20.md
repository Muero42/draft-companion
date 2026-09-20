# PITTI bridge handoff — RC4.205 PR #186 physical PASS

Generation: `20260920T1036Z-v259`

Version: `v11.8.0-rc4.205`

Canonical main physically observed after Production deployment:
`66a6551d4a4520bd06f3b77a2f6bbdb297bfe6f1`

Cloudflare Pages deployment:
`ec6cd004-6e54-480f-8752-e8e37755ac66`

Cloudflare Pages check:
`106063674827` — PASS

Reviewed PR #186 source repair:
- head `9c407d5a705713a630d7e62f020b72b48169d131`
- merge `01ceef33dba6d79be48461d85532a1e2a39bd9aa`
- tree `d1c9e2660e60d305a8a1f4727404d676e83c2164`

Physical diagnostic:
- schema: `pitti.physical-evidence-lanes-diagnostic.v1`
- captured: `2026-09-20T10:36:57.320Z`
- season: 2026
- week: 2

## Physical result

Classification:
`RC4.205_PR186_PHYSICAL_PASS_LAWRENCE_MAPPING_AND_GAME_CONTEXT_FAILURE_PROVENANCE`

Weekly projections are physically AVAILABLE for QB/RB/WR/TE.

QB:
- HTTP 200
- 80 source rows
- 80 numeric `stats.points_half`
- 80 mapped
- mapping coverage 1.000
- 80 consumer-usable records
- lane AVAILABLE

Current active skill roster:
- 13 total
- 13 projection-usable
- 0 unusable

This closes the prior physical Trevor Lawrence mapping defect in the bounded PR #186 scope. The provider JAC -> Sleeper JAX alias now produces no unusable active roster player and the QB lane maps 80/80.

Other projection lanes:
- RB 115/123 mapped, 0.935 coverage, AVAILABLE
- WR 206/207 mapped, 0.995 coverage, AVAILABLE
- TE 123/124 mapped, 0.992 coverage, AVAILABLE

Request provenance remains:
- `EXPLICIT_WEEK_POSITION_ROS_OMITTED`
- `rosPresent=false`
- `scoringParameterPresent=false`

Broad current Expert-Ranks are physically AVAILABLE:
- QB 89/89 mapped, 1.000
- RB 124/133 mapped, 0.932
- WR 218/220 mapped, 0.991
- TE 132/135 mapped, 0.978
- source date 2026-09-20

This does **not** establish selected PITTI-Panel evidence.

Canonical game context remains DATA-UNAVAILABLE:
- request `/api/nfl-week-context?season=2026&week=2`
- app HTTP 502
- sanitized `upstreamStatus=403`
- `failureType=UPSTREAM_HTTP_ERROR`
- validation `INCOMPLETE_WEEK`
- 0 source events / games / teams

The PR #186 failure-provenance repair is therefore physically proven even though the upstream data lane remains unavailable. No exception text, provider body, credentials, cookies, tokens, or authorization headers were present.

Remaining unavailable/unproven lanes:
- PITTI-Panel
- Team Total
- canonical game-context data / opponent-weather because upstream currently returns HTTP 403

Next gate:
`SEPARATELY_AUTHORIZED_INDEPENDENT_EVIDENCE_LANE_DIAGNOSIS`
