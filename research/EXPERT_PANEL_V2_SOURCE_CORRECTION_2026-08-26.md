# PITTI Expert Panel v2 — source-selection correction (2026-08-26)

Status: RESEARCH / SHADOW ONLY. No production/main/gh-pages/Android promotion. This document corrects the expert-selection process after the temporary Bobal/Gianni/Weisse availability-driven detour.

## Binding process correction
Expert quality is selected first; technical availability is a downstream ingestion gate. Never construct the panel primarily from whichever complete boards happen to be easiest to scrape. Historical accuracy must be multi-year and position-specific where possible; current 2026 freshness/provenance and rank-correlation/marginal information are separate gates. Baseline rc4.64 remains preserved/selectable.

## 2026-08-26 API-first correction
FantasyPros Public API v2 is now the primary legitimate ingestion path for FantasyPros-listed experts, ahead of HTML scraping/reconstruction.

Verified public API contract:
- `GET /nfl/2026/rankings/experts` returns expert metadata/IDs and accuracy metadata.
- `GET /nfl/2026/consensus-rankings` accepts `position`, `type`, `scoring`, and `filters` (colon-delimited expert IDs), plus `experts=show`.
- Consensus responses expose `expert_pub`, `expert_name`, `last_updated`, `last_updated_ts`, player `rank_ecr`, positional rank fields where supplied, and `tier`.
- A one-ID `filters=<expert_id>` request is therefore the first test for an exact individual board. Do not assume the public web selector defines API availability.
- API authentication requires `x-api-key`; no key may be committed, logged, copied into project state, or inferred. Use a GitHub Actions secret or process environment only.
- Preserve raw response + normalized rows + request parameters + retrieval timestamp + response expert IDs/names/publication timestamps + SHA-256. Fail closed if requested expert ID is not actually represented by the response.
- Tiers are first-class evidence and must be frozen rather than discarded. Do not convert article prose/tier commentary into invented exact ranks.

This API-first route supersedes the assumption that Boone/other candidates need HTML reconstruction merely because FantasyPros' visible selector omits them. HTML/partner boards remain fallback evidence only when the API genuinely cannot return the desired expert.

## Existing user-approved constraints retained
- Derek Brown is excluded from NEW v2.
- Andrew Erickson has no incumbency protection; retain only if position-specific marginal value is demonstrated.
- Small panel preferred; avoid double-counting correlated experts/sources.
- Position-specific panels are allowed/preferred where evidence supports them.
- No weights are authorized until candidate-source audit and correlation/marginal-value testing are complete.

## Candidate status after fresh source audit
### Nick Mariano — high-priority RB+WR candidate
- RotoBaller published a fresh 2026 Top-400 Half-PPR overall board on 2026-08-25 and attributes it to Nick Mariano.
- Historical FantasyPros 2023-2025 signal retained: overall #6, RB #11, WR #8.
- Before relying on HTML ingestion, query the FantasyPros experts endpoint for Mariano's current expert ID and test exact filtered API boards by position.

### Justin Boone — high-priority API audit
- Yahoo publishes individual Justin Boone 2026 rankings pages and links Half-PPR QB/RB/WR/TE/Top-300 boards.
- Public article publication timestamp surfaced as 2026-08-20; do not equate article publication with current ranking-update state.
- First ingestion test is now FantasyPros expert-ID discovery + one-ID filtered API request. If API returns Boone, use API provenance/freshness and keep Yahoo as independent/fallback cross-check.
- Boone must not disappear from the candidate set merely because another board is easier to ingest.

### Sean Koerner — highest-priority quality candidate
- FantasyLabs currently advertises 2026 season-long draft projections/rankings for standard/.5 PPR/PPR, tiered rankings and cheat sheets.
- Exact public full-board ingestion from FantasyLabs remains unresolved.
- Before treating that as a blocker, query FantasyPros expert metadata and attempt one-ID filtered API boards. If the API does not actually return Koerner for current draft/HALF, retain the commercial-source blocker and never fabricate ranks from articles.

### Draft Sharks Team — serious ENSEMBLE challenger, one source only
- Public 2026 Half-PPR Team board provides overall/position ranks, DS projections, floor/ceiling and injury risk; page states rankings update in real time.
- Provenance is `Draft Sharks Team`, reviewed by Jared Smola. Do not relabel it as Jody Smith/Jared Smola individual ranks.
- Treat DS Team as at most one panel source. Separately test FantasyPros individual expert IDs for Jody Smith/Jared Smola; only count an individual board if the API proves it is current and distinct.

### Matt Harmon — WR specialist hypothesis only
- Preserve as an explicit WR-specialist/diversity candidate.
- Query FantasyPros API first for current individual WR/HALF draft availability and exact freshness. Yahoo remains fallback/cross-check.
- Require independent WR information relative to Mariano/Koerner/Boone/DS Team before weighting.

### Pat Fitzmaurice — retained stabilizer/core candidate
- Already available in PITTI and current enough to remain the comparison anchor.
- API payload should become the canonical exact current Pat board for v2 reproducibility, including tiers and expert publication timestamp.

### Bobal / Gianni / Weisse — QUARANTINED AS RESEARCH CONTROLS, NOT v2 DEFAULTS
- Their temporary v2 presets were an availability-driven methodological mistake.
- They are not declared bad experts; they may be tested if they independently pass the same quality/source gates.
- Existing exact-board audit showed heavy redundancy, especially Bobal/Gianni (RB/WR near-identical rank order).
- Do not delete the research arm; retain it as a control/comparison artifact only.

## Required next test order
1. Via FantasyPros API, discover current expert IDs/accuracy metadata for Boone, Koerner, Mariano, Harmon, Pat, Jody Smith, Jared Smola and other historically strong position-specific candidates.
2. For each candidate/position, request exact 2026 DRAFT/HALF one-ID filtered boards and verify response expert identity, row count, publication timestamp, tiers and missingness. Persist raw+normalized SHA-256 evidence without the API key.
3. Only for candidates the API genuinely cannot serve, use fresh legitimate partner/public boards (Mariano/RotoBaller, Boone/Harmon Yahoo, DS Team, FantasyLabs where accessible) with exact provenance.
4. Compare the quality-first candidate universe on common players: positional Spearman, tier agreement/disagreement, missingness, current-news sensitivity and marginal information relative to the baseline/core.
5. Construct small position-specific candidate panels only after those results; no pre-committed percentages.
6. Replay baseline vs v2 panel-only and unchanged full decision surface on frozen natural fixtures. Preserve roster/Return/Coach variables across arms.
7. Prospectively validate on new mock snapshots, with special attention to deep-WR states already identified by the WR-depth challenger.

## Anti-regression
No player-name overrides; no hard WR roster cap; no PairSum/Rolling resurrection; no generic Return-v2 retune; no stale expert-board promotion; no promotion of Bobal/Gianni/Weisse merely because their payload is already frozen; no secret/API key in repository artifacts.
