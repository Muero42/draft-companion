# PITTI rc4.190 migration — implementation and evidence contract

Current authority is the coupled CURRENT/LOCK/COMMAND/SEAL, with permissions in AGENTS.md. Gate: VERIFY_CANONICAL_AUTHORITY_THEN_AUTHORIZED_WORK. Source in this tree is rc4.190; main containment, PR state and exact-head CI require dynamic verification. Source, built, packaged, deployed and device accepted are separate states.

## Historical migration evidence

Verified migration base: edc4e670388f90f9209a15194b3b937f01ad1681 (PR122 merge). Old PR118 evidence head: 17503032a955ede8cba4d9a64fa4bc78ac1f795b. Its 12 commits are evidence, not current authority or a mechanical cherry-pick plan. Baseline: 154/154 strict local checks PASS before edits. This record does not assert current remote PR status.

## A/B/C/D/E classification of all seven changed files

| Old file / commits | Class | Migration decision |
|---|---|---|
| app.js / 55cd2199 | A/E | Compact roster, remove duplicate alternatives; protect only active QB/TE and IR through legal-drop checks. Repair all four version surfaces, not only APP_VERSION. |
| app.js / 27018817 | A/B/E | Preserve main's live identity and FLEX geometry. Replace ADP pseudo-fairness and one-sided utility with actual draft picks, current trade values and bilateral lineup improvement. Missing values do not produce offers/probabilities. |
| AGENTS.md / 920a6ebf | A/C | Retain durable Season rules; use v234 authority and the agreed permission contract, without old branch permissions. |
| PITTI_CODEX_WORK_PACKAGE.md / d509fe33, d6679761 | A/B/C | Reconcile against main and this implementation; existing roster/ownership/FAAB/navigation/freshness fixes remain. |
| PITTI_LIVE_NEWS_REACTION_ARCHITECTURE.md / e026860f | A/D/E | Keep role graphs, timestamps, tiers, dedupe, conflicts and league conversion. Eliminate the time-pressure verification exception. Actual feed/role coverage remains unavailable until verified. |
| data/rb-contingency-seed-2026-09-02.json / 5b85e335, 14c536c9 | D/E | Preserve all 32 room hypotheses in historicalHypothesis. Current mapping/hierarchy/beneficiary, confidence and source verification are UNKNOWN. No seed activates an action; RB2 ordinal is not succession. |
| data/live-news-source-registry.json / 9a107c6b | A/D/E | Retain policy; current markers become historical. Generic source names are not verified feeds/reporters. Registry rows alone grant no action authority. |
| PITTI_PROJECT_STATE.md / 4b378ccd, a37b65da, 17503032 | B/C/D | Preserve v234 history and append migration. Never restore old gates, tool-access claims, unverified research or PR118-only file authority. |

## Implemented boundaries

- Kader has a compact live-state strip, Sleeper slots and optional verified weekly evidence. Numeric duplicate grid and lightweight alternatives are removed. Async rerenders also keep FA decisions out of Kader.
- Acquisition rejects Reserve/IR, preserves the last active QB/TE, isolates K/DST, evaluates legal projected lineup gain and future active D/ST-drop/same-bye costs. Missing evidence yields HOLD; no positional roster caps.
- Exact slot-mask assignment replaces greedy FLEX allocation; two TE remain legal.
- Trade exploration supports 1:1, 2:1 and 1:2. Both rosters must improve with current projections; capacity, structural starters, comparable trade values and pre-W1 actual draft picks are checked. No panel-only near-even story or invented acceptance percentage.
- Live/News groups event identity/chronology, upgrades confirmation, retains conflicts/committee successors and requires verified functional roles and fresh league state. Owned successors route to roster/trade review; FA successors still pass acquisition gates. No automatic transaction exists.

## Adapter and cache contract

Existing read-only watcher transport may optionally carry seasonEvidence with schema `pitti.season-evidence.v1`. Unavailable data never delays Sleeper startup. No fabricated provider data or new endpoint is introduced.

- records: playerId, metric (weekly_rank/projected_points/implied_team_total/trade_value), numeric value, season/week, scoring HALF_PPR, status VERIFIED, confidence, sourceId/sourceUrl, publishedAt/verifiedAt/expiresAt, conflict. Maximum age/validity 24 hours; conflicting values stay unavailable. Cache v190_seasonEvidence.
- gameContext: playerId, season/week, verified source, timestamps/expiry, opponent, dome/weatherSummary; maximum age six hours. Cache v190_gameContext.
- roleGraphs: playerId, verification state/timestamp/source, functional successors with role evidence/confidence, conflicts and invalidators. Cache v190_roleGraphs. Research ordinal/name alone never satisfies the contract.
- events: eventKey, playerId, eventOccurredAt/sourcePublishedAt/observedAt/ingestedAt/verifiedAt, sourceUrl/sourceTier/sourceOriginality, status, verified, conflict. Existing append-only research cache is reused. Trusted upstream ingestion must supply verification; the client validates schema/chronology/consistency, not truth from an arbitrary URL.

Verified provider payloads, a credentialed 32-team beat registry, current primary RB graphs, current projections/Boone values/weather/Vegas data and physical rc4.190 acceptance are not established here. Defaults remain UNAVAILABLE/UNKNOWN. Historical seed assignments are not current facts.

## Deterministic validation and takeover

`node tools/strict-suite.mjs [results.json]` runs the complete strict local suite. `node tools/package-reextract.mjs <output-directory>` requires Python 3 or PITTI_PYTHON and produces a byte-exact 13-file archive/re-extraction receipt. Research seeds/policy files are not live runtime data.

`node tools/takeover-authority.mjs <fresh-github-evidence.json>` verifies strict seal/authority, local origin/branch/HEAD/cleanliness, live remote main and current GitHub evidence. Evidence fields: repo, canonicalBranch, canonicalHead, branch, head, clean, prState, prHead (OPEN), containingCommitVerified (MERGED), ciHead, checks (project_guardrails/release_contract_v2/candidate_package with result PASS), fresh, verifiedAt (milliseconds, maximum five minutes), evidenceSource GITHUB_API, authorizedWorkPackage. Obtain these observations and authorization freshly; never manufacture them from checkpoint text. The validator fails closed without external evidence and never merges, deploys or executes transactions.
