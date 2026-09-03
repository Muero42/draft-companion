# Expert v4/v5 implementation decision — 2026-08-29

> HISTORICAL/SUPERSEDED operational checkpoint: runtime, device, deployment, release/activation gates and CURRENT/OVERRIDE instructions below describe the original dated context only. They must not be executed as current work or override ../PITTI_CURRENT_STATE.json and ../NEW_CHAT_HANDOFF_CURRENT.md. Research evidence and durable invariants remain as provenance, subject to later explicit corrections.

Status: implementation blueprint locked; activation remains fail-closed pending exact source acquisition + regression.

## Freshness evidence
- Pat Fitzmaurice current FantasyPros RB Half-PPR page is dated Aug 29, 2026.
- FantasyPros current staff comparison is Aug 29 and shows Derek Brown 08/29, Andrew Erickson 08/28, Pat Fitzmaurice 08/27 on that staff surface; individual Pat positional page is newer. Use per-source/per-position timestamp, not one directory timestamp.
- Wolf of Roto Street overall Half-PPR is dated Aug 27; current TE board is available and recent.
- Ryan Weisse current public Overall Half-PPR is Aug 24.
- Todd D Clark appears in current FantasyPros directory updated Aug 27.
- Sean Koerner published a 2026 draft cheat sheet Aug 28 and WR tiers Aug 29; he explicitly says his season-long tool ranks are updated daily. This proves current source activity, NOT that FantasyPros exposes a complete exact Koerner vector. FantasyPros comparison currently returns no all-position Koerner rankings, so v5 must remain disabled until exact complete import is verified. Do not reconstruct from tiers/articles.

## v4 blueprint
Individual-only, position-specific. No Draft Sharks Team.
- QB: Fitzmaurice, Boone, Del Don, Mariano, Todd D Clark.
- RB: Fitzmaurice, Mariano, Del Don, Ryan Weisse.
- WR: Fitzmaurice, Mariano, Del Don, Boone.
- TE: Fitzmaurice, Boone, Del Don, Wolf of Roto Street.
Single-expert normalized influence cap: 30%.

This is a qualification blueprint, not permission to use stale/incomplete rows. Each selected expert must pass current Half-PPR exactness, board-depth, identity, season and source timestamp gates. If one fails, v4 stays disabled or uses an explicitly prequalified reserve; it never silently shrinks to a different ensemble.

## v5 blueprint
Minimal-invasive challenger: frozen v3 + Sean Koerner, position-specific, funding primarily from Draft Sharks Team weight. Koerner weight is capped and position-specific; no blind full transfer. v5 cannot activate until a complete exact current Koerner vector is acquired with provenance.

## Missingness
No absence-as-opinion, no point-rank imputation, no silent per-player ensemble substitution. Every player row must expose intendedN/effectiveN/missingExperts/coverage status. Right-censored published-board absence is distinct from acquisition failure.

## UI
Selector is immediately above Analyze. v3 selected by default. v4/v5 disabled until their gates pass. Switching a preset must not mutate draft/roster/picks and must recompute the identical snapshot only when Analyze is pressed.

## Release
No main/Android promotion until manager-map correction + v4/v5 coverage + selector state + known candidate canaries all pass. Natural 19:44 user-decision mock remains untouched.
