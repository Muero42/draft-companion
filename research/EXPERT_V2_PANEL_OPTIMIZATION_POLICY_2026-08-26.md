# PITTI Expert-v2 panel optimization policy — 2026-08-26

Status: research-only. rc4.64 baseline remains untouched.

## Non-negotiable correction
The v2 panel MUST NOT be selected from whichever experts happen to expose the easiest public board. The provisional Bobal/Gianni/Weisse construction is quarantined as a control arm only. Derek Brown is excluded from the new panel by user decision. Andrew Erickson has no automatic seat.

## Optimization target
For EACH position (QB/RB/WR/TE), select 4–6 ranking voices only when every added voice contributes measurable marginal information. Four is a floor for a production candidate, not a target. Five or six are preferred when they add independent signal.

Candidate pool to evaluate first:
- Sean Koerner
- Nick Mariano
- Justin Boone
- Dalton Del Don
- Pat Fitzmaurice
- Draft Sharks team board (one composite voice; never double-count with constituent staff)
- Matt Harmon only as a WR specialist candidate; default role is separate WR thesis/evidence layer unless ranking marginal value is demonstrated
- Andrew Erickson only if current position-specific marginal-value tests justify inclusion
- additional historically strong experts may enter only after the same tests

## Evidence dimensions
Panel membership and weights are position-specific and must jointly consider:
1. multi-year draft accuracy, with position accuracy preferred over generic overall rank;
2. current 2026 Half-PPR freshness and coverage;
3. pairwise rank correlation / redundancy on a common player universe;
4. disagreement around draft-relevant ranges and tier boundaries, not only global Spearman;
5. tier information as a first-class signal;
6. source independence (a composite board counts as one voice);
7. missingness and stale-source risk.

## Weighting constraints
- Do not equal-weight by default.
- Penalize redundant voices; do not allow two near-duplicate boards to dominate merely because both have strong historical accuracy.
- A fifth/sixth expert may receive a small weight (e.g. 10–15%) when it adds useful orthogonal signal.
- Normalize per player only across actually available, verified, fresh voices.
- No production weight is frozen until the current-board correlation/tier audit is complete.

## FantasyPros/API path
Reuse the existing app-local FantasyPros API key and existing proxy/single-expert fetch path. Do NOT create a second secret infrastructure. For FantasyPros-listed candidates, test exact expert-ID filtered requests first. A HTTP 200 is not success unless returned expert identity matches the requested expert. Preserve rank, position rank, tier, expert publication timestamp, source timestamp, scoring and season provenance.

## Tiers
Tiers are not discarded after ingest. Preserve each expert's tier boundaries separately. A tier boundary should carry more decision significance than a small ordinal difference within the same tier. Do not manufacture tiers for sources that do not provide defensible tier information.

## A/B requirement
Keep rc4.64 baseline selectable and unchanged. Expert-v2 remains a separate selectable test arm until mock/replay evaluation supports promotion. Compare at least the best 4-, 5-, and 6-voice candidate per position; assess decision changes at realistic draft states, especially tier cuts and roster-constrained late rounds.

## Current freshness note
FantasyPros' Half-PPR directory on 2026-08-26 shows current updates including Pat Fitzmaurice 08/26, Dalton Del Don 08/25 and Justin Boone 08/25. Freshness alone does not determine membership.
