# Chase Brown 1.09 sanity audit — 2026-08-22

## Purpose
Correctly separate three questions that were temporarily conflated after the invalid Turn-Pair screen:
1. Is Chase Brown a bad 2026 player/value? No.
2. Is Chase Brown ever defensible near the 1.09/2.02 turn? Potentially yes.
3. Is a deterministic Chase Brown 1.09 lock in 20/20 simulations credible evidence? No; that observed lock came from a research-harness mutation bug and directly contradicts already-persisted rc4.59 turn-timing evidence.

## Exact fresh PITTI freeze
Source: `freeze_2026/FRESH_2026_MARKET_PANEL_RAW.json`, as-of 2026-08-22T06:58:45Z, fresh freeze PASS.

Chase Brown:
- selected standard panel rank: **11.8**
- selected RB panel rank: **11.892857...**
- Sleeper Half-PPR ADP: **16.6**

James Cook III, a useful same-turn control:
- selected standard panel rank: **8.3288**
- Sleeper Half-PPR ADP: **9.6**

Therefore the correct interpretation is nuanced:
- 1.09 is only ~2.8 picks ahead of Brown's selected-panel mean, so a one-off evidence-backed reach is not intrinsically absurd;
- it is ~7.6 picks ahead of current Sleeper Half-PPR ADP, so there is meaningful timing/opportunity cost to taking him at 9 rather than 12 or later;
- Brown is a completely legitimate 2.02 candidate in many boards, especially if higher-valued names are gone;
- **20/20 at 1.09 regardless of board is the implausible part**, not Brown being anywhere near the turn.

## Existing rc4.59 parity timing evidence — decisive
This project had already persisted a much stronger timing artifact that should have been consulted immediately:
`simulation_2026/RC459_TURN_PAIR_MARKET_2026.json`, gate PASS, fresh freeze hash `5339a37d...`, 2,000 parent runs, scope `rc4.59 profiled-baseline opponent kernel; neutral user control; conditional turn timing only`.

For the 1.09 -> 2.02 turn when the player is reachable:
- **Chase Brown return_if_wait = 0.975 (97.5%)** over 2,000 eligible runs; only 0.9% taken by slot 10's first pick and 1.6% by slot 10's second pick.
- James Cook III return_if_wait = **0.1196 (12.0%)** across 1,564 eligible runs.
- Amon-Ra St. Brown return_if_wait = **0.0179 (1.8%)**.
- JSN and Jonathan Taylor return_if_wait = **0%** in their reported eligible samples.

This makes the strategic error concrete: under the project's own rc4.59-parity timing model, Brown is normally a WAIT-at-1.09 / likely-available-at-2.02 candidate, while several higher-quality alternatives are much more likely to disappear. A valid timing layer should strongly preserve that distinction rather than erase it.

The same artifact reports that if Brown is taken at 1.09, the 2.02 second pick is most often Ashton Jeanty (72.9%), James Cook (14.8%), Kenneth Walker (11.3%). If Brown is waited on, Brown himself is the 2.02 pick in 95.25% of those conditional branches. That is direct full-turn opportunity-cost evidence, not merely marginal ADP intuition.

## Root-cause evidence
The invalid Turn-Pair harness overwrote shared `rawScore` objects in candidate-loop order. The resulting synthetic values put Brown above 300 and recursively contaminated later candidates. PR #6 is closed unmerged and those outcomes are not policy evidence.

The later Rolling-v1 screen, which did not contain that mutation defect, immediately returned plausible 1.09 variation (James Cook III / Amon-Ra St. Brown / Jonathan Taylor in the first completed arm) and zero Brown 1.09 selections. Rolling-v1 itself is also invalid for long-horizon policy evidence because of a separate top-five fallback defect, but this contrast is valid forensic evidence that the 20/20 Brown lock was not the canonical rc4.59 Player Quality board.

## Draft-day policy consequence
Do **not** hard-code a Brown penalty or a blanket ADP reach cap. Instead:
- preserve selected-panel Player Quality as the primary admissibility layer;
- use exact rc4.59 turn timing / Return-v2 as timing information;
- at 1.09, when Brown and materially stronger low-return alternatives are both present, **WAIT on Brown is the default evidence-based sequence**;
- Brown becomes a natural 2.02 candidate if he returns, which the current parity timing model says happens about 97.5% in the relevant conditional states;
- override that sequence only if the live board, injuries/role evidence or observed opponent/autodraft state materially changes the return distribution.

This audit supersedes any shorthand description of Brown as simply a Round-3 player. The exact current PITTI inputs put him near the 1/2 turn in Player Quality and around mid-Round 2 in Sleeper ADP; what makes 1.09 unattractive in normal states is primarily the **very high probability that he returns to 2.02 while stronger alternatives do not**.
