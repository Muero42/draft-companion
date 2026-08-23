# PITTI market reality gate — frozen 2026-08-23

Purpose: keep strategy refinement anchored to realistic 10-team half-PPR draft decisions. Research controls remain allowed but cannot contaminate primary strategy comparisons.

## Source sanity at freeze
Fresh Aug-22/23 FantasyPros Half-PPR evidence is internally heterogeneous by page, so page type must be recorded. The generic `position=OP` page is unsafe for overall skill-player strategy because it currently renders QB-heavy ordering. Do not use that page as an overall 1QB board.

Useful current anchors:
- FantasyPros 34-expert Half-PPR cheat sheet: Taylor 7, Lamb 9, Jefferson 10, Cook 11, Jeanty 12, London 13, Chase Brown 14, A.J. Brown 15, Barkley 16, Bowers 17, Achane 18, Nico 19, Hampton 20, Henry 21, Walker 22, Pickens 23, McBride 24.
- Fantasy BR Aug-20 Half-PPR: Taylor 5, JSN 6, Amon-Ra 7, Jefferson 8, Lamb 9, Cook 10, London 11, CMC 12, Jeanty 13, A.J. Brown 14, Chase Brown 15, McBride 16, Achane 17, Nabers 18, Nico 19, Walker 20.
- Pat Fitzmaurice Aug-22 Half-PPR: JSN 5, Amon-Ra 6, CMC 7, Taylor 8, Jeanty 9, Bowers 10, Jefferson 11, Cook 12, Walker 13, Chase Brown 14, Barkley 15, Lamb 16, Achane 17.

These sources are evidence inputs, not a command to copy ECR.

## Reality classification
At each own pick classify available players:
- CORE: market center is close enough that taking the player now is ordinary/plausible.
- FALLER/VALUE: normally earlier, unexpectedly available; always include if strategically relevant.
- SMALL REACH: modestly later market cost but plausible if PITTI has a validated edge or return-risk makes waiting costly.
- CONTROL/MAJOR REACH: materially later market cost; exclude from primary strategy simulation unless strong independent evidence preregistered before testing justifies promotion.

Use current Sleeper room/ADP as the primary availability market when available; current FantasyPros/experts are cross-checks. Opponent-specific profiles modify availability probability, not intrinsic player quality.

## Current pick 1.09 / overall 9
Primary core/value universe must cover:
- normal/core around the turn: Justin Jefferson, James Cook III, Ashton Jeanty, CeeDee Lamb when available;
- favorable fallers: Jaxon Smith-Njigba, Amon-Ra St. Brown, Jonathan Taylor, Christian McCaffrey and any higher elite unexpectedly available.
- Chase Brown and Brock Bowers are NOT primary 1.09 options under current evidence; retain only as controls unless materially new evidence changes market/value.

Do not hardcode probabilities from these rank snapshots. Calibrate actual availability from Sleeper/opponent simulation.

## Current pick 2.02 / overall 12
Primary frontier is conditional on the 1.09 pick and actual intervening selections. It should normally consist of:
- any first-round-quality faller still available (Jefferson/Lamb/Cook/Jeanty or higher elite as applicable);
- realistic turn/early-second players near the current market such as London, Chase Brown, A.J. Brown, Barkley, Achane and other players whose current Sleeper/market position makes pick 12 plausible;
- Bowers only as a value-sensitive TE option when evidence/availability supports it; not an automatic priority.

Josh Allen is CONTROL/MAJOR REACH at 2.02 under current evidence and must be excluded from primary 2.02 strategy comparisons. A generic QB utility model cannot promote him without a separately preregistered, independently validated reach case.

## Return-risk rule
Market realism is not ADP obedience. A player can be a rational small reach when:
1. PITTI's independent player/value evidence is materially stronger than market;
2. probability of surviving to the next user pick is low enough;
3. opportunity cost versus realistic alternatives is acceptable.
Major reaches require substantially stronger evidence than small reaches.

## Simulation rule
Primary mocks/counterfactuals must sample realistic boards first, then compare only CORE/FALLER/justified SMALL-REACH choices. CONTROL branches can run in parallel for evaluator diagnostics but are excluded from strategy aggregates and recommendation logic.

## Immediate practical target
Use realistic 1.09 -> 2.02 pair construction to refine, not replace, the established strategy. Then repeat at 3.09 -> 4.02. The objective is robust draft-day TAKE/WAIT guidance under actual availability, not discovery of exotic optimizer solutions.