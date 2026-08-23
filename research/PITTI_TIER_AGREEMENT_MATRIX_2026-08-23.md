# PITTI Tier Agreement Matrix — 2026-08-23

Purpose: operationalize tier-first decisions for the verified 1.09 -> 2.02 turn without converting rank noise into fake precision.

## Source discipline
- Explicit tier votes count only when a source actually publishes tier boundaries.
- Fresh ordinal Half-PPR ranks are retained as supporting proximity evidence, never silently converted into tier votes.
- PITTI intrinsic evidence (role, usage, receiving/GL, health, workload/decline, upside/downside) is separate from both expert tier and market availability.
- Sleeper ADP is availability evidence only.

## Fresh ordinal cross-check (Aug 18-22)
Recent independent Half-PPR ranks show the normal turn core is tightly overlapping rather than separated by a stable ordinal gap:
- Fantasy BR (Aug 20): Jefferson 8, Lamb 9, Cook 10, Jeanty 13, Brown 15, Achane 17, Walker 20.
- Justin Fuhr (Aug 22): Lamb 7, Cook 9, Jefferson 11, Achane 12, Jeanty 13, Bowers 16, Saquon 17, Walker 18.
- Justin Bauerle (Aug 18): Jefferson 6, Lamb 8, Achane 10, Cook 12, Saquon 13; CMC 15.
- Mike Maher (Aug 18): Jeanty 8, Cook 10, Lamb 11, Hampton 12, Jefferson 13, Brown 14, Saquon 16, Walker 17, Achane 18, Bowers 20.
- Ed Birdsall (Aug 12; older supporting evidence): Jefferson 8, Lamb 9, Cook 12, Jeanty 13, Achane 15, Bowers 16, Saquon 20.

Interpretation: Cook/Lamb/Jefferson/Jeanty have strongly overlapping fresh ordinal support. Their exact order is unstable across credible current sources, so differences of a few overall slots are weak evidence. Achane/Saquon/Brown/Bowers/Hampton/Walker overlap the back of the turn but generally have less consistent top-12 support.

## Explicit-tier evidence already verified
- Adam Pelletier (Aug 19 Half-PPR): Cook Tier 1; Amon-Ra/Jefferson/Taylor/Jeanty/Hampton Tier 2; Chase Brown/Bowers Tier 3.
- Wolf of Roto Street (Aug 19 Half-PPR): JSN/Amon-Ra/Cook/Taylor/CMC Tier 3; Jeanty/Walker/Chase Brown Tier 4. Jefferson/Lamb were not visible in the returned segment and therefore receive NO inferred vote from this source.

These tier sources disagree materially. Therefore no single published tier boundary is sufficiently robust to force Cook > Jefferson/Jeanty or similar by itself.

## PITTI provisional boundary map
This is a decision cluster, not a numeric ranking.

### Superior-faller cluster — HIGH boundary relevance when available at 1.09
- JSN
- Amon-Ra St. Brown
- Jonathan Taylor
- CMC only after current health/decline-risk check; market rank alone does not grant automatic superior status.

Rule: normally TAKE over sequencing optimization if intrinsic audit still supports superior-cluster membership.

### Core turn cluster — HIGH overlap / LOW confidence in internal boundaries
- CeeDee Lamb
- James Cook III
- Justin Jefferson
- Ashton Jeanty

Evidence says these four should be treated as overlapping until stronger intrinsic evidence establishes a real boundary. Do NOT let rank #9 vs #13 create a tier boundary by itself.

Within this cluster:
- Cook vs Jefferson: TAKE/WAIT may break tie -> Cook first, Jefferson wait.
- Lamb vs Jefferson: TAKE/WAIT may break tie -> Lamb first, Jefferson wait.
- Jeanty vs Jefferson: only modest sequencing edge -> intrinsic evidence dominates; if still tied, Jeanty first / Jefferson wait.
- Cook/Lamb/Jeanty ordering among themselves remains intrinsic-evidence driven unless a direct return-asymmetry comparison is validated.

### Next-turn comparison cluster — MEDIUM/uncertain boundary versus core
- De'Von Achane
- Saquon Barkley
- Chase Brown
- Omarion Hampton
- Kenneth Walker III
- Brock Bowers
- plus any actual available London/A.J. Brown/Nico/other superior faller at 2.02.

This is deliberately NOT a declaration that all six are equal. It means evidence does not justify treating raw overall slots as exact utility gaps. At 2.02 rebuild the actual board and compare intrinsic tier/boundary evidence before TAKE/WAIT or positional economics.

## Boundary-confidence rules
- HIGH: multiple independent explicit-tier/intrinsic signals support separation and fresh contrary evidence is limited.
- MEDIUM: likely separation but credible current sources cross the boundary.
- LOW: rankings/tier votes materially overlap; treat candidates as same decision tier and let intrinsic/league-specific/TAKE-WAIT evidence decide.

Current core Cook/Lamb/Jefferson/Jeanty internal boundary confidence = LOW.
Superior-faller vs core boundary = generally MEDIUM-HIGH, player-specific and health-dependent.
Core vs next-turn cluster = MEDIUM overall, but must be player-specific; do not apply one blanket boundary.

## Draft-day output contract
At each own pick show, for realistic candidates only:
`Player | PITTI tier/cluster | boundary confidence | TAKE/WAIT | short reason`

Order of operations:
1. actual available board;
2. superior-tier faller check;
3. intrinsic tier/boundary comparison;
4. league-specific starter economics;
5. TAKE/WAIT asymmetry if still close;
6. roster construction/preferences only as final tiebreaker.

No scalar tier score. No averaging tier numbers across experts. No fabricated tier for rank-only sources.

## Next validation
Apply this matrix to the verified-current-market pair dataset and quantify how often TAKE/WAIT changes a decision only INSIDE low-confidence/shared boundaries. Flag any case where sequencing would cross a medium/high intrinsic boundary for manual evidence review. Then proceed to realistic full mocks.