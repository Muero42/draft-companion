# Draft Sharks weighting audit — 2026-08-27

Status: RESEARCH / NO RUNTIME MUTATION

## Current frozen Expert-v2 use
- QB DS Team 35%
- RB DS Team 35%
- WR DS Team 30%
- TE DS Team 35%

## Independent historical accuracy evidence (FantasyPros 2023-2025)
- Jody Smith (Draft Sharks): overall #1; QB #40, RB #1, WR #13, TE #9.
- Jared Smola (Draft Sharks): overall #7; QB #23, RB #14, WR #14, TE #120.
- Kevin English (Draft Sharks): overall #13; QB #35, RB #37, WR #12, TE #113.
- Nick Mariano comparator: overall #6; QB #48, RB #11, WR #8, TE #77.
- Dalton Del Don comparator: overall #17; QB #56, RB #7, WR #76, TE #21.
- 2024 single-year: Kevin English won overall FantasyPros accuracy.
- 2025 single-year: Jody Smith #9 overall; 2023-25 Jody #1 and Smola #7.

## Methodology mismatch
Draft Sharks public 2026 board is a "Draft Sharks Team" product generated from 3D projections: Floor, Ceiling, Consensus projections feed a cross-positional value algorithm customized to league setup/scoring. It is reviewed by Jared Smola. Therefore it is not demonstrably identical to Jody Smith's individual FantasyPros accuracy entry, Jared Smola's individual entry, or Kevin English's individual entry.

Consequences:
1. Do NOT transfer Jody's RB #1 or TE #9 historical accuracy wholesale to the DS Team board.
2. Do NOT penalize the DS Team TE board solely because Smola/English have TE #120/#113.
3. Treat "DS Team 35%" as a source-family/model weight requiring its own validation.
4. Avoid counting multiple DS personalities as independent experts if the underlying rankings share projections/model inputs.

## Provisional interpretation
- DS family is strongly validated overall; blanket downweighting is not justified.
- WR has unusually consistent evidence across Jody (#13), Smola (#14), English (#12), supporting meaningful DS-family weight.
- RB evidence is strong but heterogeneous: Jody #1, Smola #14, English #37. 35% may be reasonable but is NOT independently proven for the Team 3D board.
- QB is solid rather than dominant (#23/#35/#40 among the three).
- TE is maximally heterogeneous (#9 vs #113/#120). A 35% DS Team TE weight requires direct board validation; historical individual-expert evidence does not justify it by itself.

## Coleman diagnostic
Frozen RB board: DS #222, Mariano #166, Del Don #148, Fitz #126 -> weighted panel 175.1.
Weighted panel without DS, renormalized over Mariano/Del Don/Fitz:
(166*25 + 148*25 + 126*15) / 65 = 149.846.
Thus DS alone shifts Coleman about +25.25 overall slots later relative to the other three experts' weighted consensus.
This is material but does not prove DS is wrong. Coleman should be a calibration case for late-RB/opportunity archetypes.

## Required validation before changing weights
A. Build per-position historical score/rank table for every current expert with comparable 2023-25 data.
B. Separate individual-expert accuracy evidence from model/team-board provenance.
C. On current frozen 2026 board, calculate source influence: panel rank with/without each expert, robust median/trimmed consensus, disagreement SD, and large-outlier clusters.
D. Stratify RB/WR by draft zone and archetype: early established, mid-round, rookie, late contingency/role-earner.
E. Test candidate weighting schemes OOS against historical seasons and current natural-mock decision evidence; never optimize on Coleman alone.
F. If DS shows systematic late-upside conservatism but good median accuracy, prefer an Opportunity/Upside residual correction over blunt global DS downweighting.
G. Any new weights are challenger-only until clean OOS validation; incumbent board remains available/control.

## Anti-overfit rule
No player-specific Coleman correction. No weight change from one draft or one disagreement. Prefer source-specific uncertainty / robust aggregation when one source is an extreme outlier.


## Year-stability pass — historical evidence interpretation

FantasyPros 2025 single-year ranks materially differ from 2023-25 aggregates:
- Jody Smith: 2025 overall #9; QB66 / RB19 / WR21 / TE23.
- Jared Smola: 2025 overall #18; QB50 / RB85 / WR7 / TE88.
- Nick Mariano: 2025 overall #17; QB32 / RB73 / WR13 / TE124.
- Pat Fitzmaurice: 2025 overall #47; QB42 / RB97 / WR70 / TE49.
- Dalton Del Don: 2025 overall #53; QB87 / RB89 / WR55 / TE54.
2024: Kevin English won overall, with QB103 / RB12 / WR2 / TE72; Jody Smith was #2 overall, QB14 / RB11 / WR68 / TE28.

Interpretation:
- Position ranks are noisy year to year. Do not convert a 3-year position rank directly into a large deterministic 2026 weight.
- DS-family WR is the most convincing persistent family signal: English WR2 in 2024, Smola WR7 and Jody WR21 in 2025, plus 3-year Jody13/Smola14/English12.
- DS-family RB is strong multi-year but not uniformly stable: Jody remains good (RB11 in 2024, RB19 in 2025), while Smola fell to RB85 in 2025. Team-board provenance remains critical.
- TE is not safe to infer from family label; both multi-year and annual results show large within-family dispersion.
- Current panel's Del Don RB25 weight has strong 3-year support (RB7) but weak 2025 result (RB89); Pat RB15 has weaker 3-year (RB40) and 2025 (RB97). This reinforces shrinkage/recency balancing rather than a DS-only correction.
- Mariano WR35 has strong 3-year (#8) and 2025 (#13) evidence; this is a comparatively well-supported current weight direction.

## Weighting-method recommendation
Use reliability shrinkage rather than raw rank-derived weights:
1. position-specific multi-year accuracy as prior;
2. recent single-year result as noisy update, capped;
3. source-provenance penalty when current 2026 board is a team/model product rather than the historically scored individual;
4. source-family correlation penalty to prevent false independence;
5. current-board disagreement robustness (Huber/winsorized influence or median anchor) only as a challenger;
6. Upside-v3 residual remains orthogonal to baseline accuracy weights.

Do not change production weights until the challenger is tested on historical seasons + natural-mock Evidence-v2.


## Full-panel influence interpretation — next challenger design

The current four-source RB panel must not be treated as "DS vs truth." Historical 2023-25 position ranks for current RB sources:
- Draft Sharks family evidence: Jody Smith RB1, Jared Smola RB14, Kevin English RB37.
- Nick Mariano RB11.
- Dalton Del Don RB7.
- Pat Fitzmaurice RB40.
The current DS Team board is a separate team/model product, so its reliability prior must be shrunk toward the DS-family distribution rather than assigned Jody's RB1 result.

A robust challenger should therefore compare at least:
1. incumbent weighted mean;
2. reliability-shrunk weighted mean;
3. robust weighted center with capped single-source leverage;
4. incumbent baseline + orthogonal Upside-v3 residual.

### Single-source leverage guard
For each player/source compute:
- leave-one-source-out panel rank;
- absolute source-vs-other-consensus gap;
- panel displacement caused by source;
- whether source is lone extreme or part of broader disagreement;
- draft-zone/archetype.

Provisional guardrail candidate (NOT runtime): when one source is the sole extreme and moves a player >=20 overall slots versus the renormalized other-source center, flag SOURCE_LEVERAGE_HIGH for research/uncertainty. Do not automatically clip or change rank.

Coleman qualifies diagnostically: DS moves him ~25.25 slots later than the other-three weighted center. This should trigger research, not a player-specific boost.

### Position implications
- WR: current Mariano 35% + DS 30% is directionally supported by multi-year evidence (Mariano WR8; DS family Jody13/Smola14/English12). Main risk is correlation/provenance, not obvious weak expertise.
- RB: DS35/Mariano25/DelDon25/Fitz15 has good historical ingredients, but source leverage and team-board provenance need shrinkage validation.
- TE: current DS35 cannot be justified from DS family label alone due extreme DS-family TE heterogeneity (Jody9 vs Smola120 vs English113); direct current-board validation is highest priority.
- QB: DS family is solid but not elite by 2023-25 position ranks; current QB panel should be checked against Boone/Mariano/DelDon/Fitz and rushing-upside policy separately.

### Sean Koerner implication
FantasyPros 2023-25: Koerner overall #2, QB4/RB12/WR6/TE15. This strongly supports keeping him as desired expert source if a sufficiently complete, scoring-verified 2026 ranking can be acquired. His absence is more consequential than replacing a strong incumbent source ad hoc. Do not reconstruct incomplete ranks.


## Screenshot/API candidate triage — corrected 2026-08-27

User constraint: do NOT restart expert selection. Derek Brown remains excluded. Sean Koerner is inaccessible behind paywall for a sufficiently complete current board. Availability is secondary; candidates must demonstrate likely incremental value. Current FantasyPros ranks can be reconstructed through the already working API route used for Boone/Del Don.

### Strong candidate visible in screenshots
- Kev Wheeler (Wheel Route FF), screenshot freshness 08/20: WATCH_FRESHNESS, not production yet.
  - FantasyPros 2023-25 Draft Accuracy: #9 overall; QB89 / RB4 / WR30 / TE20.
  - Primary value proposition: RB specialist. TE secondary only. Weak QB signal.
  - If refreshed close to draft, API-fetch current 2026 ranks and run RB challenger first.

### Other visible experts: evidence-based triage
- Mick Ciallela (Fantrax), screenshot 08/21: #14 overall 2023-25; QB68 / RB23 / WR19 / TE67. Broadly solid but no obvious position edge over incumbent; SECONDARY.
- Mike Maher (BettingPros), screenshot 08/24: #11 overall; RB9 / WR39 / TE49 / QB62. RB challenger candidate, below Wheeler priority.
- Ryan Weisse (Club Fantasy FFL), screenshot 08/24: #12 overall; RB2 / TE12 / QB32 / WR110. HIGH-VALUE specialist candidate for RB; TE potentially useful; avoid WR.
- Ben Wasley (Hashtag Football), screenshot 08/27: #15 overall; RB6 / WR26 / QB105 / TE87. RB specialist candidate; below Wheeler/Weisse due weaker breadth.
- Wolf of Roto Street, screenshot 08/26: #20 overall; TE2 / QB20 / RB55 / WR73. HIGH-VALUE TE specialist candidate; QB secondary.
- Marc Shannep (Fantasy Knockout), screenshot 08/26: #19 overall; WR16 / RB36 / QB47 / TE84. WR secondary candidate.
- Scott Pianowski (Yahoo), screenshot 08/27: #42 overall; TE5 / WR44 / RB53 / QB113. TE specialist candidate only; not general-panel candidate.
- Andy Behrens (The Deep Shot), screenshot 08/27: #103 overall; QB25 but RB142/WR72/TE52. Reject as general/RB challenger; prior intuition corrected.
- Brandon Funston (The Athletic), screenshot 08/26: #104 overall; no compelling position rank (QB66/RB110/WR116/TE61). Reject.
- Andrew Erickson (FantasyPros), screenshot 08/27: #108 overall; QB151/RB80/WR71/TE122 over 2023-25. Current availability does not justify expansion; retain only if an already-established project role requires him, not as accuracy-based weight challenger.
- Matt Harmon (Yahoo), screenshot 08/26: #117 overall in FantasyPros draft-accuracy table, WR117. This DOES NOT invalidate Reception Perception/qualitative WR scouting; it argues against using his FantasyPros overall rank as a weighted baseline expert.
- Todd D Clark (Fantasy Fix), screenshot 08/26: #39 overall; QB5 is notable, other positions weaker (RB43/WR62/TE147). QB specialist candidate.
- Kelly Kirby (FantasyPros), screenshot 08/24: #114 overall but TE11. TE tertiary specialist only.
- Daniel Mader, screenshot 08/25: #116 overall but TE4. TE specialist candidate, but require stability check before use.
- Clayton Cadieux, screenshot 08/20: #43 overall; RB24/TE25. Secondary only.

### Priority API challenger shortlist (without rebuilding Expert-v2)
1. RB: Ryan Weisse (#2 RB), Kev Wheeler (#4 RB, freshness watch), Ben Wasley (#6 RB), Mike Maher (#9 RB).
2. TE: Wolf of Roto Street (#2 TE), Scott Pianowski (#5 TE), Ryan Weisse (#12 TE). Daniel Mader (#4 TE) only after stability check.
3. QB: Todd D Clark (#5 QB); Wolf (#20) secondary.
4. WR: no equally compelling new specialist among screenshots versus incumbent Mariano (#8 WR) + DS-family strength. Marc Shannep (#16) is secondary; do not add merely to diversify.

### Test policy
Do not add all candidates. Fetch only current API ranks for the highest-value position-specific challengers, then test marginal benefit against incumbent and DS-reduced variants. Require freshness close to 31.08 draft and no provenance/scoring mismatch. Candidate value is position-specific; never import their weak-position ranks merely because their strong-position ranks are useful.


## Stability validation of shortlisted specialists — 2026-08-27

FantasyPros 2025 Draft Accuracy provides a useful recent-year stress test:
- Ryan Weisse: overall #7, QB16 / RB8 / WR171 / TE3. Confirms RB+TE specialization; explicitly do NOT use WR.
- Marc Shannep: overall #5, QB19 / RB54 / WR4 / TE39. Strengthens him materially as a WR challenger despite 3-year WR16.
- Jody Smith (DS individual, not Team board): overall #9, QB66 / RB19 / WR21 / TE23.
2024:
- Wolf of Roto Street: overall #6, QB41 / RB52 / WR10 / TE8.
- Mike Maher: overall #10, QB121 / RB17 / WR40 / TE33.
- DS individuals Kevin English #1 (RB12/WR2), Jody Smith #2 (RB11/WR68).
This reinforces: recent stability matters; no direct inference from DS individuals to DS Team board.

### Revised high-priority shortlist
RB:
1. Ryan Weisse — multi-year RB2 + 2025 RB8: strongest immediately actionable specialist among screenshots.
2. Kev Wheeler — multi-year RB4; freshness 08/20, WATCH until refreshed. Need annual stability extraction before production.
3. Ben Wasley — multi-year RB6; annual stability extraction needed.
4. Mike Maher — multi-year RB9 + 2024 RB17; secondary.

TE:
1. Ryan Weisse — multi-year TE12 + 2025 TE3: very strong dual-position candidate.
2. Wolf of Roto Street — multi-year TE2 + 2024 TE8: very strong TE candidate.
3. Scott Pianowski — multi-year TE5; annual stability extraction needed.
Do not infer broad usefulness from TE specialty.

WR:
1. Marc Shannep — multi-year WR16 + 2025 WR4 + 2024 in-season WR4 (in-season is secondary evidence): now a legitimate challenger, not merely generic diversification.
2. No need to add a WR specialist unless marginal/OOS test beats incumbent Mariano + DS setup.

QB:
Todd D Clark remains multi-year QB5, but annual stability must be checked before promotion; do not overvalue one aggregate.

### Selection rule tightened
A specialist can enter challenger testing when:
- multi-year position evidence is strong;
- at least one recent annual draft-accuracy result supports rather than contradicts it, where available;
- current 2026 rank is fresh enough;
- source is not redundant/correlated enough to erase marginal value;
- position-only inclusion is technically supported.
Availability alone never qualifies a source.


## Authority correction after full checkpoint re-read — 2026-08-27

Critical anti-regression finding: Project State already machine-locks `Temporary Weisse/Gianni/Bobal pool: rejected/control only; never resurrect from old workflows.` Therefore Ryan Weisse MUST NOT be revived merely because his 2023-25 RB accuracy is #2. The prior screenshot-triage section that labeled Weisse a HIGH-VALUE new candidate is superseded by this section.

This does not invalidate his historical accuracy datum; it means prior project testing already rejected his marginal value in the relevant PITTI workflow, and current work must respect that result unless genuinely new evidence specifically overturns the rejection. No such evidence has yet been established.

Revised incremental shortlist from screenshot-visible/API-accessible experts:
- RB: Kev Wheeler (2023-25 RB #4) = WATCH_FRESHNESS because current FP board is 08/20; Ben Wasley (#6) and Mike Maher (#9) are possible fresh challengers only if they were not previously rejected elsewhere. Do not use Weisse.
- TE: Wolf of Roto Street (TE #2, current FP directory updated 08/27) is the cleanest fresh specialist challenger. Scott Pianowski (TE #5, screenshot 08/27) secondary.
- QB: Todd D Clark (QB #5, screenshot 08/26) specialist challenger.
- WR: no compelling incremental specialist identified; incumbent Mariano + DS-family WR evidence remains stronger than adding a merely available ranker.

Current FantasyPros directory also confirms Kev Wheeler's 2026 board exists but is dated 08/20; do not promote stale input. Wolf's 2026 rankings are current 08/27.

Rule: historical accuracy is qualification evidence, never sufficient by itself. Prior PITTI marginal-value tests and source locks take precedence. Availability/API access remains secondary.


## USER CORRECTION — Weisse status — 2026-08-27

The immediately preceding authority-correction interpretation was too strong and is superseded here. Ryan Weisse was NOT previously rejected by a valid PITTI marginal-value/A-B test. Weisse/Gianni/Bobal were an opportunistic availability-driven temporary pool that incorrectly displaced intended experts. The durable lock means only: never reintroduce them automatically/unqualified. It does NOT prohibit fresh qualification.

Accordingly Ryan Weisse is restored to the RB challenger pool because his 2023-25 RB historical accuracy (#2 in the evidence already collected) is a strong screening signal. Admission still requires current 2026 Half-PPR freshness/completeness verification plus independence/source-leverage and OOS/marginal-value testing versus the incumbent panel and other RB challengers. Availability alone has zero evidentiary weight.


## Expert-v3 evidence gate — 2026-08-27 21:55 CEST

Fresh web verification against FantasyPros Draft Accuracy (not in-season) confirms the multi-year 2023-25 specialist screen:
- RB: Ryan Weisse #2; Kev Wheeler #4; Ben Wasley #6; Mike Maher #9. Incumbent comparators: Dalton Del Don #7, Nick Mariano #11, Pat Fitzmaurice #40.
- TE: Wolf of Roto Street #2; Scott Pianowski #5; Ryan Weisse #12. Incumbent comparators: Pat #14, Del Don #21, Boone multi-year draft rank not established in this source, DS Team finished-board accuracy still not directly established.
- QB: Todd D Clark #5; Wolf #20. Incumbent comparators include DS-family Smola #23 / Kevin English #35 / Jody Smith #40, while finished DS Team ranking remains unvalidated as a unit.
- WR: no screenshot-visible challenger currently beats incumbent Nick Mariano (#8) convincingly on the 2023-25 screen; DS-family Kevin English #12, Jody #13, Smola #14 provide strong organizational/family evidence but NOT direct validation of the finished DS Team board.

Important methodology: FantasyPros 2025 page explicitly identifies these as preseason DRAFT accuracy rankings, distinct from in-season accuracy. Do not substitute in-season ranks for the draft panel qualification gate.

Stability caveat: multi-year aggregate is a screening metric, not enough for admission. Before production weight, inspect annual draft-accuracy stability where retrievable and then run current-2026 rank influence/correlation/marginal-value tests. The current web results did not reliably expose annual draft tables for all candidates, so no fabricated year-by-year stability verdict is allowed.

Priority order for acquisition/testing:
1) TE Wolf (fresh screenshot 08/27) — strongest combination of positional evidence + freshness + open TE slots.
2) RB Weisse — strongest historical RB screen; allowed to re-qualify despite old temporary-pool anti-regression lock.
3) QB Todd D Clark — strong positional screen; only if current 2026 board completeness/scoring can be verified.
4) RB Wheeler — strong screen but WATCH_FRESHNESS at 08/20; do not use stale board.
5) TE Pianowski — secondary challenger.
6) Wasley/Maher — RB reserve challengers if top candidates fail freshness/complementarity gates.

Do not change Expert-v2. Expert-v3 remains a separate selectable challenger until it wins controlled tests.


## AUTO evidence pass — specialist stability / DS interpretation — 2026-08-27

Fresh public FantasyPros evidence confirms 2023-25 draft-accuracy position ranks used for screening: Wheeler RB4; Weisse RB2/TE12; Maher RB9; Wasley RB6; Wolf TE2/QB20; Todd D Clark QB5; Pianowski TE5. Incumbents: Mariano RB11/WR8; Del Don RB7/TE21; Pat TE14 but weaker QB/RB/WR multi-year ranks. DS individual analysts are heterogeneous: Jody Smith overall1/RB1/WR13/TE9; Jared Smola overall7/RB14/WR14/TE120; Kevin English overall13/QB35/RB37/WR12/TE113. This strengthens the need to validate the finished DS Team board separately rather than infer a universal DS35 from individual analyst results.

Year-level robustness evidence found: FantasyPros' 2025 draft-accuracy article lists Ryan Weisse #7 overall and Jody Smith #9 overall; its 2024 article lists Kevin English #1 overall and Wolf #6 overall, Mike Maher #10. Thus Weisse and Wolf have at least one recent single-year top-10 overall result in addition to strong 3-year positional ranks; they are not merely artifacts of the aggregate table. This is qualification evidence, not automatic admission.

Expert-v3 experimental policy: preserve Expert-v2 unchanged. First high-value API acquisition/test order should be (1) current Ryan Weisse RB; (2) current Wolf TE; (3) Todd D Clark QB; (4) Wheeler RB only after freshness improves; (5) Maher/Wasley as RB controls if needed; (6) Pianowski TE as secondary control. No forced WR addition.

Weight-grid principle: compare incumbent DS35/30 against modest DS reductions (e.g. -5/-10) allocated to qualified specialists, while also allowing incumbent non-DS weights to move if OOS evidence supports it. Never optimize on Coleman or another single 2026 player. Evaluate overall and decision-zone/position loss plus source correlation and tail/breakout behavior.


## AUTO current-2026 freshness correction — 2026-08-27 late

Fresh FantasyPros directory/web verification changes the acquisition assumptions:
- Ryan Weisse is listed in the live 2026 Half-PPR expert directory with Accuracy #7 and Updated 08/24/2026. His dedicated Half-PPR page surfaced an older 08/03 snapshot, while current PPR positional pages are 08/24. Therefore do NOT treat the public dedicated Half-PPR page as sufficient current Half-PPR evidence; use the already-working FantasyPros API/comparison reconstruction and verify scoring/season before import. He remains a high-priority RB challenger, not yet production.
- Todd D Clark is live in the 2026 Half-PPR directory, Accuracy #11, Updated 08/26/2026. This is fresh enough to attempt API reconstruction now.
- Kev Wheeler is live but Updated 08/20/2026 (Accuracy #26 in current directory): continue WATCH_FRESHNESS.
- Wolf dedicated public Half-PPR page currently surfaces Aug 24, despite the user's directory screenshot showing 08/26. Treat freshness as source-view dependent; API must be authoritative for the imported artifact and timestamp. Wolf remains primary TE challenger pending API verification.

Important: current FantasyPros directory 'Accuracy' numbers (e.g. Weisse #7, Todd #11) are displayed alongside 2026 rankings but should not be conflated with the previously used 2023-25 position-specific accuracy table. Keep those evidence dimensions separate.

No production panel or rc4.84 weights changed in this pass.
