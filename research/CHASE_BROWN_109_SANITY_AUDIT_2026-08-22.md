# Chase Brown 1.09 sanity audit — 2026-08-22

## Purpose
Correctly separate three questions that were temporarily conflated after the invalid Turn-Pair screen:
1. Is Chase Brown a bad 2026 player/value? No.
2. Is Chase Brown ever defensible near the 1.09/2.02 turn? Potentially yes.
3. Is a deterministic Chase Brown 1.09 lock in 20/20 simulations credible evidence? No; that observed lock came from a research-harness mutation bug.

## Exact fresh PITTI freeze
Source: `freeze_2026/FRESH_2026_MARKET_PANEL_RAW.json`, as-of 2026-08-22T06:58:45Z, fresh freeze PASS.

Chase Brown:
- selected standard panel rank: **11.8**
- selected RB panel rank: **11.892857...**
- Sleeper Half-PPR ADP: **16.6**

Therefore the correct interpretation is nuanced:
- 1.09 is only ~2.8 picks ahead of the selected-panel mean, so a one-off evidence-backed reach is not intrinsically absurd;
- it is ~7.6 picks ahead of current Sleeper Half-PPR ADP, so there is meaningful timing/opportunity cost to taking him at 9 rather than 12 or later;
- Brown is a completely legitimate 2.02 candidate in many boards, especially if higher-valued names are gone;
- **20/20 at 1.09 regardless of board is the implausible part**, not Brown being anywhere near the turn.

## Root-cause evidence
The invalid Turn-Pair harness overwrote shared `rawScore` objects in candidate-loop order. The resulting synthetic values put Brown above 300 and recursively contaminated later candidates. PR #6 is closed unmerged and those outcomes are not policy evidence.

The later Rolling-v1 screen, which did not contain that mutation defect, immediately returned plausible 1.09 variation (James Cook III / Amon-Ra St. Brown / Jonathan Taylor in the first completed arm) and zero Brown 1.09 selections. Rolling-v1 itself is also invalid for long-horizon policy evidence because of a separate top-five fallback defect, but this contrast is valid forensic evidence that the 20/20 Brown lock was not the canonical rc4.59 Player Quality board.

## Draft-day policy consequence
Do **not** hard-code a Brown penalty or a blanket ADP reach cap. Instead:
- preserve selected-panel Player Quality as the primary admissibility layer;
- use Sleeper ADP/Return-v2 as timing information;
- compare 1.09 versus 2.02 jointly through valid next-state simulation;
- if Brown is the best current value and has material loss risk before 12, TAKE can be correct;
- if a materially better player is available and Brown is highly likely to return, WAIT is normally preferred.

This audit supersedes any shorthand description of Brown as simply a Round-3 player. The exact current PITTI inputs put him near the 1/2 turn in Player Quality and around mid-Round 2 in Sleeper ADP.
