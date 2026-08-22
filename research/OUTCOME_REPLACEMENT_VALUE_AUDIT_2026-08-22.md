# Outcome-v2 Replacement-Value Audit — 2026-08-22

## Finding
The current independent outcome-v2 evaluator does model replacement players, but its replacement baseline is not explicitly calibrated to this league's 10-team / 6-bench waiver environment.

Implementation inspected: `research/rc459_full_policy_outcome_certification_v2_2026.py`.

Current method:
- collect all market-bridge players by position with Sleeper ADP;
- sort by ADP;
- take the final 20% of each positional pool (`tail = a[int(len(a)*.80):]`);
- use the median weekly forecast of that tail as replacement scoring;
- use those values only when a weekly optimized lineup lacks enough rostered players at a required position.

## Why this matters
This is a generic deep-tail proxy, not an explicit estimate of the best freely available player in a 10-team league after roughly 130 retained skill-player roster spots. In a shallow league, waiver replacement can be materially stronger than the median of the bottom 20% of the entire modeled player pool.

If replacement is understated, outcome-v2 can overvalue:
- generic bench depth;
- positional scarcity;
- early QB/TE insurance;
- low-ceiling players whose main benefit is avoiding a replacement-level lineup hole.
It can undervalue:
- consolidation into elite starters;
- churnable upside bets;
- strategies that intentionally rely on waiver replacement at deep positions.

This is especially important because our current policy work is comparing early TE/RB/WR opportunity cost. A too-low TE replacement baseline could make early TE appear more valuable; a too-low RB/WR replacement baseline can also distort roster-depth effects.

## Important limitation
The evaluator does NOT currently simulate waivers, FAAB competition, injuries, weekly add/drop decisions or opponent ownership. Therefore simply raising replacement values by intuition would be another unvalidated assumption.

## Correct next method
Before changing outcome-v2:
1. derive expected post-draft free-agent pools from realistic 10-team drafts with 13 retained skill players/team;
2. for each position/week, estimate distribution of best realistically obtainable free agents rather than bottom-tail player distribution;
3. include a conservative acquisition haircut for FAAB/competition and uncertainty;
4. preregister one baseline and one stress replacement scenario without looking at candidate-policy winner;
5. rerun CONTROL and any surviving policy on fresh/common seeds;
6. require conclusions to be robust across current conservative replacement and shallow-league calibrated replacement.

Until that audit is implemented, outcome-v2 remains useful as an independent structural challenger, but absolute Championship-Utility differences involving bench depth/positional replacement should be interpreted cautiously.

## Decision
Do not modify the current evaluator during the live Turn-Pair screen. That would contaminate comparability. Build the shallow-league replacement challenger as a separate sensitivity after the current screen artifacts are frozen.
