# rc4.203 weekly projection root-cause diagnosis

## Result and exact boundary

No rc4.204 runtime repair is authorized by the available evidence. The first observed failure is **pre-mapping** semantic-scope validation: every QB/RB/WR/TE response contains at least one numeric `stats.points_half` value above `WEEKLY_HALF_PPR_MAX`, causing `WEEKLY_PROJECTION_SEMANTIC_SCOPE_MISMATCH` before player mapping begins.

## Root-cause tree

- **PROVEN:** provider access succeeds; each lane is HTTP 200 with complete FantasyPros identities and numeric Half-PPR values. Each lane breaches its absolute weekly ceiling. Mapping therefore never starts.
- **DISPROVEN as the first failure:** missing numeric fields, missing provider access, proxy response mutation, mapping, and chronology.
- **UNKNOWN:** whether most of the payload is season/ROS scale, whether sparse outliers alone trip lane-wide rejection, and whether explicit `ros=false` changes the provider response compared with omitting `ros`.

## Official provider contract

The retrieved FantasyPros OpenAPI contract says `week` selects the projection week, `ros` is optional and defaults to false, official weekly examples omit `ros`, projections document no `scoring` query, and `stats.points_half` is the Half-PPR field. Those contract facts do not establish which UNKNOWN hypothesis explains the same-credential physical payload.

## Why earlier tests passed

The rc4.199–rc4.203 repairs addressed real secondary defects. Their synthetic values around `20.x`/`10` represented the intended weekly distribution, not the observed production distribution. They therefore never exercised the actual pre-mapping ceiling failure, nor a captured-provider-to-visible-consumer end-to-end path.

## Availability and freshness matrix

| Product surface | Primary evidence | WEEKLY failure behavior | Freshness |
|---|---|---|---|
| Start/Sit | WEEKLY rankings/projections plus matchup, Vegas and weather | Fail closed when weekly evidence is insufficient | Weekly edition/cycle |
| Waiver/FA | ROS, role/usage/news, market/ownership and value | WEEKLY is a modifier; must not globally suppress sufficient independent evidence | Source-specific ROS edition; fast cadence for news/injury |
| Trade | ROS, trade value, replacement value and roster geometry | WEEKLY is a modifier; must not globally suppress sufficient independent evidence | Trade-value/ROS edition cadence |
| K/DST | Independent weekly matchup/streaming lane | Independent fail-closed lane | Weekly edition/cycle |

The current runtime is partially over-coupled for Waiver and materially over-coupled for Trade. Evidence fail-closed must not become product-wide fail-closed where sufficient independent evidence exists. A universal short TTL is inappropriate because weekly, ROS, trade-value, and fast news sources publish at different cadences.

## One required diagnostic

Using the same credential, compare QB/RB/WR/TE responses for (A) `week + position` with `ros` omitted and (B) `week + position + ros=false`. Emit only response metadata, numeric count, count over the positional ceiling, min/p50/p95/max, and a numeric-vector hash. Never emit credentials, player identities, or raw payloads.

## Finite Definition of Done

1. The A/B diagnostic distinguishes broad season scale, sparse outliers, and query-shape differences.
2. One coherent provider-adapter repair follows only from that proof.
3. Production-shaped fixtures cover the observed distributions and provider-to-store-to-visible-consumer flow.
4. Negative tests preserve wrong-season/week/position/ROS, malformed, all-zero, mapping-unsafe, and stale-evidence rejection.
5. Start/Sit degrades on weekly failure without erasing otherwise justified Waiver/Trade decisions; K/DST remains independent.
6. Strict, authority, package, and bounded production-shaped release gates pass. Release blockers are limited to wrong player evidence, stale evidence shown as current, invalid identity/action legality, or a core surface unable to decide despite sufficient evidence.
