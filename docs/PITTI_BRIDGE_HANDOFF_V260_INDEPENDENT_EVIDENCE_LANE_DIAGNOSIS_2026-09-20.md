# PITTI bridge handoff v260 — Independent Evidence Lane Diagnosis

Generation: `20260920T1100Z-v260`

Version: `v11.8.0-rc4.205`

Canonical main:
`2a08f856c7e72b0e1a9667e47e3e4467790d0f98`

Preserved physical classification:
`RC4.205_PR186_PHYSICAL_PASS_LAWRENCE_MAPPING_AND_GAME_CONTEXT_FAILURE_PROVENANCE`

## Diagnosis verdict

The authorized Independent Evidence Lane Diagnosis is complete. No runtime repair is included in v260.

### 1. Broad weekly Expert-Ranks

Status: **AVAILABLE**

The 2026 Week-2 physical diagnostic already proved current weekly FantasyPros Expert-Ranks for QB/RB/WR/TE with fresh 2026-09-20 source dates and high mapping coverage.

This lane is therefore no longer an unresolved blocker.

### 2. Selected PITTI-Panel

Status: **UNAVAILABLE — ROOT CAUSE IDENTIFIED**

Current Season weekly ingestion calls broad FantasyPros `consensus-rankings` by week/position/scoring without selected expert filters. The selected-panel acquisition machinery elsewhere in `app.js` is still draft/preseason-oriented: `week=0`, DRAFT/PRESEASON and draft expert boards.

Therefore broad weekly ECR cannot honestly become the selected PITTI panel.

External evidence supports a bounded repair path:
- FantasyPros API reference documents `filters` as an expert-ID whitelist on consensus rankings and documents `/nfl/{season}/rankings/experts`.
- Current Week-2 FantasyPros public expert pages/directories expose current individual weekly rankings.

Bounded repair candidate:
- resolve exact current expert IDs;
- request exact current week + position + HALF scoring with expert filters;
- bind returned expert identity explicitly;
- require current freshness and minimum position coverage;
- construct the selected PITTI panel only from actually present selected experts;
- never replace missing selected experts with broad ECR or an inferred vote.

Public references used for diagnosis:
- https://www.fantasypros.com/api-data/
- https://api.fantasypros.com/v2/docs
- https://www.fantasypros.com/nfl/rankings/?type=weekly
- https://www.fantasypros.com/nfl/rankings/pat-fitzmaurice.php?position=QB&week=2

### 3. Canonical game context

Status: **DATA UNAVAILABLE — ROOT CAUSE IDENTIFIED**

Physical Production evidence proves:
- PITTI request: `/api/nfl-week-context?season=2026&week=2`
- app HTTP 502
- upstream HTTP 403
- `failureType=UPSTREAM_HTTP_ERROR`
- no source events accepted.

The repaired failure-provenance contract is correct. The blocking failure is upstream acquisition, not Lawrence/team mapping and not the local game-context validator.

The current Worker uses:
`https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?dates=2026&seasontype=2&week=2&limit=100`

Public endpoint references confirm the weekly ESPN scoreboard family. Recent public Week-2 evidence also cites an ESPN `site.web.api.espn.com` scoreboard variant. Neither is promoted here as Production-safe without Cloudflare-runtime proof.

Bounded repair candidate:
- non-production A/B test only ESPN-hosted schedule variants and/or bounded headers;
- keep exact season/week semantics;
- require complete unique schedule/team validation;
- preserve sanitized `UPSTREAM_HTTP_ERROR` vs `FETCH_EXCEPTION`;
- fail closed if variants disagree, are partial, malformed, or cannot be proven from Cloudflare runtime.

Public references used for diagnosis:
- https://github.com/nntrn/espn-wiki/blob/main/espn-api.md
- https://parlae.io/fantasy/guides/faab-after-week-1-reading-add-rates

### 4. Team Total

Status: **UNAVAILABLE — NO APPROVED RUNTIME SOURCE**

`game-context-v1.js` already contains `impliedTeamTotal({total, spread, ...})`.

The missing component is not the arithmetic helper. No runtime lane currently acquires a verified, fresh, same-event total+spread pair. Each game is intentionally emitted with:
`vegas.status=UNAVAILABLE`
and
`reason=NO_APPROVED_ROBUST_SOURCE`.

Public ESPN core-odds examples expose event-scoped `overUnder`, `spread`, provider identity and team-side odds. This is a repair candidate only; it is not yet approved or Cloudflare-proven.

Bounded repair candidate, only after canonical event IDs are restored:
- explicitly approve one provider-selection policy;
- require same-event spread + total;
- validate favorite/team-side orientation;
- bind provider, event, verifiedAt and expiry;
- feed only then into the existing `impliedTeamTotal` helper;
- never derive a Team Total from player projections or broad heuristics.

Public reference used for diagnosis:
- https://github.com/pseudo-r/Public-NFL-API/blob/main/docs/game_endpoints.md

### 5. Opponent / weather

Status: **DEPENDENT UNAVAILABLE**

Opponent, kickoff, venue/roof and event weather all depend on a complete canonical game-context snapshot. The ESPN 403 therefore blocks these fields.

Existing weather behavior remains correct:
- dome: no weather required;
- outdoor: weather only if a fresh event-bound forecast exists;
- otherwise fail closed.

## Next gate

`SEPARATELY_AUTHORIZED_INDEPENDENT_EVIDENCE_LANE_BOUNDED_REPAIR`

No runtime/product file, Production deployment, device mutation, fantasy transaction, external communication or Pitti Watcher mutation is authorized by this diagnosis checkpoint.
