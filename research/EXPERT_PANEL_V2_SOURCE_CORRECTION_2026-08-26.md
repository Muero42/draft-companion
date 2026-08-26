# PITTI Expert Panel v2 — source-selection correction (2026-08-26)

Status: RESEARCH / SHADOW ONLY. No production/main/gh-pages/Android promotion. This document corrects the expert-selection process after the temporary Bobal/Gianni/Weisse availability-driven detour.

## Binding process correction
Expert quality is selected first; technical availability is a downstream ingestion gate. Never construct the panel primarily from whichever complete boards happen to be easiest to scrape. Historical accuracy must be multi-year and position-specific where possible; current 2026 freshness/provenance and rank-correlation/marginal information are separate gates. Baseline rc4.64 remains preserved/selectable.

## Existing user-approved constraints retained
- Derek Brown is excluded from NEW v2.
- Andrew Erickson has no incumbency protection; retain only if position-specific marginal value is demonstrated.
- Small panel preferred; avoid double-counting correlated experts/sources.
- Position-specific panels are allowed/preferred where evidence supports them.
- No weights are authorized until candidate-source audit and correlation/marginal-value testing are complete.

## Candidate status after fresh source audit
### Nick Mariano — SOLVED / high-priority RB+WR candidate
- RotoBaller published a fresh 2026 Top-400 Half-PPR overall board on 2026-08-25.
- The page explicitly states the Half-PPR rankings are put together by Nick Mariano.
- This supersedes older checkpoint wording that no <=2-day exact Mariano board had been verified.
- Historical FantasyPros 2023-2025 signal retained: overall #6, RB #11, WR #8.

### Justin Boone — KEEP IN AUDIT; individual public 2026 rankings exist
- Yahoo publishes individual Justin Boone 2026 rankings pages and links Half-PPR QB/RB/WR/TE/Top-300 boards.
- Public article publication timestamp surfaced as 2026-08-20; pages state Boone updates rankings through camp/preseason and for material August news.
- Do NOT silently label Boone as <=2-day fresh unless an exact underlying update timestamp/state is captured. But Boone is not technically unavailable and must not disappear from the candidate set merely because other boards are easier to ingest.
- Yahoo states Boone is a two-time FantasyPros Most Accurate Expert winner (2019, 2025) with nine top-10 finishes; verify/use appropriate historical position-specific evidence separately before weighting.

### Sean Koerner — highest-priority quality candidate, exact board paywalled/unresolved
- FantasyLabs currently advertises 2026 season-long draft projections/rankings for standard/.5 PPR/PPR, tiered rankings and cheat sheets under its NFL Season package.
- The exact comprehensive ranking product is therefore real/current but commercially gated; public exact full-board ingestion remains unresolved.
- Continue searching legitimate public/partner surfaces, but never fabricate exact ranks from tiers/articles.

### Draft Sharks Team — serious ENSEMBLE challenger, one source only
- Public 2026 Half-PPR Team board provides overall/position ranks, DS projections, floor/ceiling and injury risk; page states rankings update in real time.
- Provenance: `Draft Sharks Team`, reviewed by Jared Smola. Do not relabel it as Jody Smith/Jared Smola individual ranks.
- User-provided Draft Sharks team profile explicitly says its rankings are consensus/aggregate staff output rather than a single contributor.
- FantasyPros individual Jared Smola 2026 Half-PPR page currently says draft rankings unavailable; no verified public Jody/Smola individual board has replaced the team board.
- Treat DS Team as at most one panel source. Do not additionally count individual DS analysts without proven incremental independence.
- Historical strength of DS analysts/team makes the source worthy of testing, but exact panel weight remains unassigned until correlation and marginal decision value are measured.

### Matt Harmon — WR specialist hypothesis only
- Preserve as an explicit WR-specialist/diversity candidate from the original design.
- Yahoo has current 2026 Harmon rankings hub and points to Half-PPR rankings, but source freshness/exact extraction must be verified before live use.
- Generic overall accuracy alone is not the reason for inclusion; require independent WR information relative to Mariano/Koerner/Boone/DS Team.

### Pat Fitzmaurice — retained stabilizer/core candidate
- Already available in PITTI and current enough to remain the comparison anchor while the challenger set is audited.
- Especially defensible at TE in the existing multi-year position-specific accuracy audit.

### Bobal / Gianni / Weisse — QUARANTINED AS RESEARCH CONTROLS, NOT v2 DEFAULTS
- Their temporary v2 presets were an availability-driven methodological mistake.
- They are not declared bad experts; they may be tested if they independently pass the same quality/source gates.
- Existing exact-board audit showed heavy redundancy, especially Bobal/Gianni (RB/WR near-identical rank order). This further blocks treating the temporary panel as a promotion candidate.
- Do not delete the research arm; retain it as a control/comparison artifact only.

## Required next test order
1. Freeze exact current Mariano board with provenance/timestamp and stable player identities.
2. Capture Boone exact Half-PPR board plus the freshest verifiable update-state; do not confuse publication date with ranking-update date.
3. Continue legitimate Koerner acquisition; paid-only exact rankings remain an unresolved blocker, not a reason to substitute a weaker expert.
4. Freeze Draft Sharks Team Half-PPR board as one ensemble source, keeping DS projections/floor/ceiling separate from its ranking vote to avoid double counting.
5. Verify/freeze Harmon current Half-PPR/WR ranks if public exact access is available.
6. Compare Pat/Boone/Mariano/DS Team/(Koerner when available)/Harmon-by-WR on the same common player universe: positional Spearman, disagreement clusters, missingness, and current-news sensitivity.
7. Only then construct small position-specific candidate panels and estimate weights; no pre-committed percentages.
8. Replay on frozen natural decision fixtures and prospectively on new mock snapshots. Preserve roster/Return/Coach variables across panel arms.

## Anti-regression
No player-name overrides; no hard WR roster cap; no PairSum/Rolling resurrection; no generic Return-v2 retune; no stale expert-board promotion; no promotion of Bobal/Gianni/Weisse merely because their payload is already frozen.
