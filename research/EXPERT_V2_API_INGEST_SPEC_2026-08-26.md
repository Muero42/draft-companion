# Expert-v2 FantasyPros API ingest specification — 2026-08-26

Status: RESEARCH / SHADOW ONLY. No production mutation.

## Objective
Freeze reproducible current 2026 Half-PPR draft boards for quality-first expert candidates using FantasyPros Public API v2, including tier and publication metadata, without persisting credentials.

## Authentication boundary
Read `FANTASYPROS_API_KEY` from process environment/GitHub Actions secret only. Never print it, serialize it, commit it, place it in workflow arguments, or write it to PITTI state. Send only as HTTP header `x-api-key`.

## Discovery request
`GET https://api.fantasypros.com/public/v2/json/nfl/2026/rankings/experts?type=DRAFT&scoring=HALF&include_overall=true`

Target-name audit at minimum: Justin Boone, Sean Koerner, Nick Mariano, Matt Harmon, Pat Fitzmaurice, Jody Smith, Jared Smola, Dave Kluge, Jeff Ratcliffe, Joey Wright. Preserve returned expert_id/source and available accuracy fields.

## Exact-board request
For every discovered candidate ID and each relevant position QB/RB/WR/TE:
`GET https://api.fantasypros.com/public/v2/json/nfl/2026/consensus-rankings?position=<POS>&type=DRAFT&scoring=HALF&filters=<EXPERT_ID>&experts=show`

Validation is fail-closed:
1. HTTP 200 and JSON parse.
2. Response scoring HALF and ranking type DRAFT.
3. Requested expert ID/name is represented by `expert_name`/expert metadata; never infer one-ID success solely from HTTP 200.
4. Nontrivial row count appropriate to position.
5. Capture `last_updated`, `last_updated_ts`, `expert_pub`, `expert_name`, `experts_available` where returned.
6. Preserve player ID/name/team/position, `rank_ecr`, positional rank field(s), `tier`, and any explicit rank-range/stats fields returned.
7. Missing expert, empty board, stale publication state, or identity mismatch => unavailable/degraded, never silently fall back to unfiltered ECR.

## Frozen output
Artifact directory only; never app runtime:
- `manifest.json`: retrieval UTC, endpoint parameters, candidate IDs, response status, freshness classification, raw and normalized SHA-256.
- `experts.json`: discovery response stripped only of irrelevant bulk fields; no credential.
- `raw/<expert_id>/<position>.json`: exact API response.
- `normalized/<expert_id>/<position>.json`: deterministic stable rows sorted by rank then player ID.
- `audit.md`: coverage, freshness, tier coverage, missingness and identity failures.

## Freshness
Apply the existing v2 policy to `expert_pub`/verifiable ranking publication state, not merely article publication dates:
- <=2 days current;
- 3-5 days degraded/shadow;
- >5 days expired for newly promoted v2;
- missing/unparseable publication state fail-closed until independently resolved.

## Candidate-selection boundary
API availability does not select experts. Historical multi-year/position-specific accuracy and independent information select candidates; API is the ingestion/provenance gate. Brown remains excluded from new v2; Erickson has no incumbency protection; Bobal/Gianni/Weisse remain quarantined controls.

## Analysis after ingest
For current eligible candidates compute by position on common player universes:
- Spearman rank correlation;
- tier agreement and tier-boundary disagreement;
- top-N disagreement clusters relevant to slot 9/turns;
- missingness/coverage;
- freshness/current-news response;
- marginal information relative to Pat/baseline and other candidate sources.

Only after this audit may weights/panel membership be estimated. Then replay baseline vs v2 on identical frozen fixtures with Coach/Return/roster logic held fixed.
