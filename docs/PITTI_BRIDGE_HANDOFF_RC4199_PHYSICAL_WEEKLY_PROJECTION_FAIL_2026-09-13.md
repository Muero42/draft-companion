# rc4.199 physical weekly-projection failure — 2026-09-13

## Immutable observation

An Android/PWA installation identifying as `v11.8.0-rc4.199` displayed Jaxon Smith-Njigba at approximately `270.6`, Justin Jefferson at `224.8`, and George Pickens at `210.6` as current-week Half-PPR projections in Start/Sit. Those values are structurally season/ROS-scale rather than plausible one-game projections.

Verdict: `RC4.199_PHYSICAL_FAIL_WEEKLY_PROJECTION_SEMANTIC_MISMATCH`.

This is a failed physical observation, not acceptance. It does not authorize deployment, cache/app-data clearing, reinstall, or any Sleeper transaction. No Cloudflare deployment identifier was supplied with the observation, so this evidence must not manufacture one. The previously verified rc4.198 production deployment record remains separate historical deployment evidence; rc4.195 remains the accepted rollback reference.

## Repair boundary

`v11.8.0-rc4.200` is the unmerged source candidate that corrects the documented weekly request, separates provider payload semantics from request provenance, rejects season/ROS-shaped values independently, and invalidates rc4.199 Weekly Evidence through the consumer schema. It is not production-deployed, physically observed, or accepted.

The official FantasyPros Public API OpenAPI contract was retrieved from
`https://api.fantasypros.com/public/v2/docs/fantasypros_v2_public.yml` on
2026-09-13. Its NFL projections operation defines `week` as the weekly selector,
defines `ros` separately for rest-of-season output, requires response `season`,
`week`, `positions`, `scoring`, and `players`, and defines the NFL Half-PPR scoring
token as `HALF`. The repair therefore requests `week=<current>&position=<POS>&scoring=HALF`,
omits the ROS switch, and requires the provider response—not client context—to
prove those response semantics before publication.
