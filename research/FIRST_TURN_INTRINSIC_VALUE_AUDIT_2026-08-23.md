# First-turn intrinsic-value audit — 2026-08-23

Purpose: resolve the realistic 1.09/2.02 tier WITHOUT allowing availability sequencing to masquerade as player quality.

## Verified inputs retained
- League geometry and roster topology: use VERIFIED_LEAGUE_CONFIG_2026-08-23.json / fail-closed audit.
- Availability: use SLEEPER_HALF_PPR_MARKET_ANCHORS_2026-08-23.json plus dispersion sensitivity. Availability is NOT player quality.
- Verified current-market pair harness: 484 states / 5,835 full branches. Pair-order result shows that when the same two players are secured, downstream continuation is overwhelmingly tied; therefore sequencing value is predominantly return-risk, not invented pair synergy.

## Fresh external quality cross-check (2026-08-23)
Recent Half-PPR expert boards continue to place the realistic first-turn group in the same broad tier, but with material expert disagreement:
- Fantasy BR (Aug 20): Jefferson 8, Lamb 9, Cook 10, CMC 12, Jeanty 13, Chase Brown 15, Achane 17.
- Justin Fuhr / Pro Football Mania (Aug 22): Lamb 7, Cook 9, CMC 10, Jefferson 11, Achane 12, Jeanty 13, Saquon 17.
- FantasyPros positional Half-PPR sheet: Cook RB5, Jeanty RB6, Chase Brown RB7, Saquon RB8, Achane RB9; Lamb WR5, Jefferson WR6.

Interpretation: no credible basis for a deterministic single-player optimizer inside the turn tier. Preserve tiering and independent evidence lenses.

## Decision architecture
At 1.09 classify available players in this order:
1. TRUE FALLER TAKE: a player independently valued above the normal turn tier and still healthy/role-secure. Do not pass merely for sequencing.
2. TURN CORE: Cook / Lamb / Jefferson / Jeanty, with Saquon / Achane entering when independent value evidence supports them.
3. 2.02-ONLY / SECONDARY TURN VALUE: realistic remaining players such as Chase Brown, Hampton, Henry, Walker, Bowers, London/A.J. Brown/Nico depending actual board. These do not get promoted to 1.09 merely because a model likes them.

## Sequencing rules supported so far
- Cook vs Jefferson: if intrinsic grades are close, TAKE Cook at 1.09 and WAIT Jefferson. The reverse sequence loses Cook materially more often.
- Lamb vs Jefferson: if intrinsic grades are close, TAKE Lamb and WAIT Jefferson.
- Jeanty vs Jefferson: sequencing edge is smaller; intrinsic grade can override it. Do not force Jeanty-first if Jefferson is materially better on independent evidence.
- True faller: intrinsic value overrides modest sequencing gains.

## Required intrinsic lenses before final map
For Cook, Lamb, Jeanty, Jefferson, Saquon, Achane and relevant 2.02 alternatives evaluate separately:
- selected expert / panel quality;
- role and touch/target ceiling, receiving and goal-line role;
- offense/QB/team environment;
- injury and recurrence risk;
- age/career workload/decline risk;
- breakout/upside residual versus market (young players);
- shallow-league replacement economics and positional scarcity;
- playoff/title-relevant ceiling only when evidence is valid; do not call regular-season utility P(title).

No single scalar may silently collapse disagreements. Record HIGH/MID/LOW confidence and the reason for any override.

## Current provisional first-turn logic (NOT production promotion)
- Faller bucket remains ahead of normal turn tier, subject to health audit.
- Within normal turn tier, availability sequencing gives Cook/Lamb a practical edge over Jefferson when intrinsic value is close.
- Jefferson remains a high-priority target because his current Sleeper-derived ADP makes him unusually likely to survive Dutch's 10/11 turn relative to Cook/Lamb.
- Jeanty/Jefferson requires intrinsic-value resolution; availability alone is insufficient.
- Saquon/Achane must be explicitly evaluated, not omitted.
- Chase Brown remains a legitimate 2.02 comparison but not a 1.09 primary candidate.
- Bowers is a legitimate 2.02 comparison only; existing late-TE strategic prior means he must show clear surplus value to override RB/WR alternatives.
- Josh Allen remains excluded from the primary 2.02 frontier for this 1QB/Late-QB strategy.

## Next
1. Run player-by-player intrinsic evidence audit with freshness priority on injuries/roles.
2. Convert results to a conditional 1.09 -> 2.02 matrix: TAKE / WAIT / only-if-faller / avoid-at-price.
3. Validate matrix in many complete realistic mocks; audit frequency distributions for deterministic artifacts.
4. Then proceed to 3.09 -> 4.02.