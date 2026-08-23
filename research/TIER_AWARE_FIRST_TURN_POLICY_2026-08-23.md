# PITTI tier-aware first-turn policy — 2026-08-23

## Purpose
Make tier membership / tier-boundary confidence a first-class input for close 1.09 -> 2.02 decisions. Overall rank differences alone are not sufficient evidence of meaningful player-quality differences.

## Core rule
Do NOT treat rank 12 vs rank 17 as intrinsically meaningful unless the selected-expert/evidence set also supports a real tier boundary between those players.

Decision order:
1. verified availability / hard Reality Gate;
2. independent intrinsic evidence and selected-expert tier structure;
3. tier-boundary confidence;
4. only within the same/overlapping intrinsic tier: TAKE/WAIT return asymmetry, roster construction, positional economics and risk can break ties;
5. a robust higher-tier player is normally TAKE and must not be passed merely to optimize return probability for a lower-tier player.

## Tier representation
For each relevant player store separately:
- `intrinsic_tier`: PITTI evidence tier, not market tier;
- `tier_confidence`: HIGH/MID/LOW;
- `boundary_above` and `boundary_below`: HIGH/MID/LOW confidence that a meaningful quality break exists;
- `expert_tier_agreement`: how often selected experts place two players in the same explicit/derived tier;
- `rank_dispersion`: descriptive only; never itself a tier boundary;
- `market_tier`: availability/market cluster only, kept separate from intrinsic tier.

Do not average tier numbers across analysts mechanically. The useful question is pairwise: `P(same practical tier | selected experts + independent evidence)` and whether any boundary is robust across strong sources.

## Current first-turn implication
Current fresh public evidence demonstrates why this matters:
- FantasyPros 34-expert Half-PPR consensus currently has Lamb 9, Jefferson 10, Cook 11, Jeanty 12, Brown 14, Saquon 16, Bowers 17, Achane 18.
- Pat Fitzmaurice (Aug 22) has Jeanty 9, Bowers 10, Jefferson 11, Cook 12, Walker 13, Brown 14, Saquon 15, Lamb 16, Achane 17.
- Fantasy BR (Aug 20) has Jefferson 8, Lamb 9, Cook 10, Jeanty 13, Brown 15, Achane 17, Walker 20.
- Adam Pelletier's explicit tiers (Aug 19) put Cook in Tier 1; Jefferson and Jeanty together in Tier 2; Brown and Bowers in Tier 3.

These sources strongly warn against treating small overall-rank gaps as cardinal utility differences. They do NOT by themselves define PITTI tiers because source quality/track record and independent role/risk evidence still matter.

## Provisional PITTI tier hypotheses — NOT frozen rankings
- Elite/faller region: JSN / Amon-Ra / Taylor, with CMC conditional on current health/downside assessment. Any robust tier superiority here should dominate sequencing games.
- Normal 1.09 core: Cook / Lamb / Jefferson / Jeanty are currently close enough that tier-boundary testing is mandatory before rank-order optimization.
- 2.02 comparison cluster: Brown / Saquon / Achane / Hampton / Walker / Bowers plus any remaining higher-tier faller and other market-realistic WRs. Do not assume all are one intrinsic tier.

The immediate research question is specifically whether selected-expert + independent evidence supports a robust boundary between Cook/Lamb/Jefferson and Jeanty, or whether all four overlap in one practical tier. If one practical tier, TAKE/WAIT asymmetry can legitimately decide Cook/Lamb/Jeanty vs Jefferson sequencing. If Jeanty is robustly lower-tier, availability cannot promote him over a higher-tier Jefferson. Conversely, if evidence puts Jeanty in the same tier, his modest sequencing advantage is actionable.

## Guardrails
- Tier != ADP bucket. Market tiers estimate availability; intrinsic tiers estimate player value.
- Explicit analyst tiers are stronger evidence than reverse-engineering tiers from arbitrary rank gaps.
- Derived tiers may use projections/outcome distributions/role evidence, but boundary thresholds must be predeclared and sensitivity-tested.
- Never create a tier break solely because the snake crosses a round boundary or because ranks differ by N positions.
- Never let one outlier analyst create a hard tier boundary.
- Preserve disagreements rather than forcing a scalar consensus.
- The user's league topology matters: only 1 mandatory RB, 2 WR, two asymmetric flexes; positional tier scarcity must be evaluated in that topology.

## Next implementation target
Build a selected-expert tier matrix for the realistic first-turn pool, prioritizing explicit tiers where available and deriving only where necessary. Report pairwise same-tier agreement and boundary confidence. Overlay TAKE/WAIT only after that matrix is built. Do not alter production ranking weights yet.