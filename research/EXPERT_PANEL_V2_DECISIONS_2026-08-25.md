# Expert Panel v2 decisions — 2026-08-25

Status: RESEARCH / SHADOW ONLY. Baseline rc4.64 remains preserved.

## Locked decisions
- Derek Brown is excluded from the new v2 expert configuration. This is a user-approved design decision, not a claim that every individual Brown ranking is poor.
- Andrew Erickson is not automatically excluded, but receives no incumbency protection; retain only where current exact rankings add measurable position-specific ensemble value.
- The current baseline remains available unchanged for A/B comparison.
- Expert selection and weighting are position-specific rather than one global expert team.

## Freshness / provenance findings
- Sean Koerner remains the highest-priority acquisition. FantasyLabs' current article index shows his WR rankings/tiers dated 2026-08-25, TE rankings/tiers dated 2026-08-24, and RB work dated 2026-08-24. His season-long ranks are described as updated separately/daily, but a public exact full ranking feed remains unresolved. Do not infer exact numeric ranks from prose tiers.
- Draft Sharks is current and actively updating, but its public Half-PPR board is a Draft Sharks team product. Do not attribute it to Jody Smith individually solely because Smith is historically highly accurate.
- Nick Mariano remains a strong RB/WR accuracy candidate, but no <=2-day exact 2026 Half-PPR individual board has yet been verified for ingestion. Current RotoBaller activity by Mariano is not itself proof that his redraft Top-300 ranks changed today.
- Jeff Ratcliffe's surfaced exact Half-PPR page dated 2026-08-14 fails the v2 freshness gate.
- Dave Kluge remains a TE-specialist candidate only if a genuinely current exact 2026 redraft source is found.

## Target structure
QB: Koerner primary when exact feed is available; Pat/Boone as current stabilizers; Erickson only if marginal value proves positive; Brown excluded.
RB: Koerner and/or Mariano as primary challengers when fresh exact feeds are available; Pat anchor; Boone subject to correlation; Brown excluded.
WR: Koerner + Harmon specialist/diversity hypothesis; Mariano strong challenger; Pat/Boone stabilizers if incremental; Erickson tested; Brown excluded.
TE: Pat + Koerner core hypothesis; seek a current high-accuracy TE specialist such as Kluge; Boone/Erickson only if incremental; Brown excluded.

## Required before v2 live promotion
1. Exact current ranks, correct scoring and season, with timestamp/provenance.
2. Same-player Spearman/rank correlation by position on the common current pool.
3. Shrink highly correlated expert weights rather than counting duplicated information as independent votes.
4. Replay baseline vs v2 on frozen natural decision fixtures with identical ADP, injuries, Return-v2, roster state and Coach logic.
5. Preserve baseline as selectable fallback; no one-way overwrite.
