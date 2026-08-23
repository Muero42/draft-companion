# PITTI Tier-first TAKE/WAIT validation — 2026-08-23

Purpose: apply the tier-first rule to the verified-current-market first-turn evidence without introducing a scalar optimizer.

## Fresh external cross-check
Current Aug-2026 Half-PPR evidence reinforces boundary uncertainty rather than exact rank precision:
- Fantasy BR Aug 20: Jefferson 8, Lamb 9, Cook 10, Jeanty 13, Brown 15, Achane 17, Walker 20.
- FantasyPros Aug tier article: Lamb is shown in Tier 1 at rank 9; Jefferson, Cook, Jeanty, London, Saquon, Brown, A.J. Brown, Bowers, Hampton, Achane and Nico are all shown in Tier 2 at ranks 10-20. This is especially important: rank 10 vs 20 can coexist inside one published tier.
- Adam Pelletier Aug 19: Cook Tier 1; Amon-Ra/Jefferson/Taylor/Jeanty/Hampton Tier 2; Brown/Bowers Tier 3.
- Wolf/Roto Street Aug 19: JSN/Amon-Ra/Cook/Taylor/CMC Tier 3; Jeanty/Walker/Brown/Lamb/Achane Tier 4.

Conclusion: published tier boundaries disagree, but multiple fresh sources directly demonstrate that ordinal gaps of 5-10 places need not represent a meaningful tier gap. PITTI must retain boundary uncertainty.

## Validation against existing verified pair evidence
Existing verified-current-market pair harness: 5,835 full branches, correct league geometry, current-market opponent layer, actual FA metadata. Existing matched-pair continuation audit found that when the same two players are secured at 9+12, order usually has negligible downstream effect (examples already verified: Lamb/Jefferson 30/32 identical, Jeanty/Jefferson 56/60 identical, Achane/Jefferson 69/71 identical; Cook/Jefferson 7/9 identical).

Therefore TAKE/WAIT is permitted to change PICK ORDER only when the two candidates occupy a shared/overlapping or LOW-confidence intrinsic boundary. It must not change the selected pair merely because one player is modeled to return more often.

## First-turn guard table

### Shared/LOW-confidence core
- Cook vs Jefferson: sequencing allowed. Current return asymmetry robustly favors Cook TAKE / Jefferson WAIT when intrinsic evidence remains close.
- Lamb vs Jefferson: sequencing allowed. Current return asymmetry robustly favors Lamb TAKE / Jefferson WAIT when intrinsic evidence remains close.
- Jeanty vs Jefferson: sequencing allowed but weak. Intrinsic evidence dominates; only if still tied use Jeanty TAKE / Jefferson WAIT.
- Cook vs Lamb vs Jeanty: do not invent sequencing preference without a directly validated pair-return comparison; intrinsic evidence first.

### Superior-faller guard
- JSN / Amon-Ra / Taylor: if intrinsic audit still places the actual available player above the core with MEDIUM/HIGH boundary confidence, TAKE. Return sequencing may NOT demote him.
- CMC: same logic only after current health/decline audit; do not grant superior status from market rank alone.

### Core vs next-turn candidates
- Brown, Hampton, Walker, Achane, Saquon, Bowers and actual WR fallers at 2.02 require player-specific boundary review.
- Do not apply a blanket `core > next` rule. Fresh explicit tier evidence sometimes groups several of these players with the core.
- If boundary is LOW/overlapping, league-specific starter economics and intrinsic evidence may decide; TAKE/WAIT is only the later tiebreaker.

## Fail-closed checks for realistic mocks
For every own pick in the first turn:
1. rebuild actual available board after Dutch 10+11;
2. assign candidate to PITTI cluster plus boundary confidence using current evidence;
3. if candidate is a credible superior-tier faller, prohibit sequencing from bypassing him;
4. only compare TAKE/WAIT inside LOW/overlapping boundary pairs;
5. log any attempted sequencing override across MEDIUM/HIGH boundary as `TIER_CROSSING_BLOCKED`;
6. no raw overall-rank delta may itself create or override a tier boundary.

## Practical first-turn map, current state
- Faller check first: JSN/Amon-Ra/Taylor; CMC conditional.
- Normal core: Cook/Lamb/Jefferson/Jeanty, overlapping boundary.
- If Cook + Jefferson: Cook first unless intrinsic evidence establishes Jefferson as clearly superior tier.
- If Lamb + Jefferson: Lamb first under same condition.
- If Jeanty + Jefferson: intrinsic comparison first; Jeanty-first only as final sequencing tiebreaker.
- At 2.02: rebuild board and compare all actual fallers plus realistic Brown/Hampton/Walker/Achane/Saquon/Bowers/London/A.J. Brown/Nico candidates. Do not begin from an ordinal cutoff.

## Promotion gate
This tier-first rule is ready for realistic mock validation, not yet production-frozen. Promote only if complete mocks show:
- zero unreviewed MEDIUM/HIGH tier crossings;
- no implausible reaches admitted by tier breadth;
- stable first-turn choices under reasonable expert-tier boundary perturbations;
- no degradation of downstream starter/outcome and actual-FA lenses.

Next: run realistic complete mocks with this guard active, then inspect 3.09 -> 4.02 using the same tier-first logic.