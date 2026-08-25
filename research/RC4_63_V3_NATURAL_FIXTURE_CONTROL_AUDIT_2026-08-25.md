# rc4.63 v3 near-tie — provenance-correct natural fixture/control audit (2026-08-25)

Status: **MIXED: late-WR mechanism plausible; QB2 control FAILS by construction; no promotion**  
Scope: research only. No runtime/main/gh-pages mutation.

## Source provenance

Canonical backup inspected directly: `draft-companion-v7-backup-2026-08-24T19-40-47-213Z.json`, draft `1397557585325891584`.

The 15 frozen decision fixtures are mixed-version and must not all be called rc4.63:

- rc4.60: picks 9, 12, 29.
- rc4.63: picks 32, 49, 52, 69, 72, 89, 92, 109, 112, 129, 132, 149.

For the v3 late-only WR-saturation modifier, the directly relevant rc4.63 natural fixtures are 129/132/149.

## Late natural controls

The actual user roster state before pick 129 is QB1/RB4/WR6/TE1. The frozen candidate surface is effectively a near-tie at the top: Jalen Coker WR Coach 100, Jonah Coleman RB Coach 99, then Mike Washington RB 89. The user selected Coleman. This is exactly the *shape* the v3 late near-tie mechanism is intended to address: WR saturation, RB<7, and a near-equal RB alternative. This is supporting mechanism evidence only because v3 uses raw score rather than displayed normalized Coach score.

Before pick 132 the roster is QB1/RB5/WR6/TE1. Frozen top candidates: Coker WR 100, De'Zhaun Stribling WR 97, Mike Washington RB 94, Keaton Mitchell RB 80. Before pick 149 the roster is QB1/RB6/WR6/TE1; Coker WR 100, Mike Washington RB 91. These are useful reversibility controls: a late WR-saturation rule must not blindly force RB whenever the RB alternative is materially worse, and must stop once RB saturation/quality gap warrants it.

## QB2 exceptional-slide control — material v3 failure

The rc4.63 pick-92 fixture has QB1 already rostered (Justin Herbert). The frozen candidate surface nevertheless places Trevor Lawrence QB at Coach 100 and Blake Corum RB at 99; the user selected Corum. CURRENT already classifies the ordinary QB2 recommendation at 92 as a material marginal-utility failure.

The v3 near-tie implementation cannot correct this state: its repeat-QB/TE priority penalty is guarded by `pn >= 100`. Therefore at pick 92 the v3 patch does not apply its QB2 hurdle at all. The inherited no-safety-resurrection harness can prevent safety-only backup promotion, but it deliberately allows a repeat QB/TE that is the natural pre-safety leader. Trevor Lawrence at this frozen state is exactly the control case that still requires an explicit marginal-value/opportunity-cost comparison against the best RB/WR.

**Conclusion:** v3 is not a complete strategy-policy challenger and cannot be promoted even if the 120-seed identical-state replay passes. Preserve its late WR-saturation near-tie component as a research candidate, but separate the QB2/TE2 opportunity-cost gate rather than treating v3's fixed post-100 penalty as certified.

## Required next design constraint

Any successor remains fail-closed and must:

1. preserve genuine exceptional QB/TE slides;
2. compare repeat QB/TE marginal value explicitly against the best legal RB/WR, not use a blanket ban or fixed roster quota;
3. handle the natural pick-92 QB2 control without player-name forcing;
4. leave first-QB/first-TE selection unaffected;
5. preserve v3's narrow late-WR behavior only where Player Quality is genuinely near-tied and reverse under RB saturation/material quality gaps;
6. pass paired full-roster Championship Utility before any production consideration.

No rc4.64 is authorized by this audit.
