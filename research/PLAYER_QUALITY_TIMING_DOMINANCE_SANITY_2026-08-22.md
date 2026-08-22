# Player Quality × Timing dominance sanity — 2026-08-22

## Purpose
Add a **validation invariant**, not a scoring rule, so optimization experiments cannot silently produce strategically nonsensical reaches while still looking good in an aggregate outcome sample.

## Two-axis dominance concept
At a fixed draft state, candidate B dominates candidate A on the two principal pre-draft information axes when:
1. B has materially better selected-panel Player Quality (lower panel rank), AND
2. B has materially earlier Sleeper Half-PPR market price / lower ADP, AND
3. both are legal/currently available, and no explicit independent evidence state (injury, role, roster feasibility, hard exclusion) favors A enough to reverse the comparison.

If B is better both as a football/fantasy value estimate and as a market-scarcity/timing estimate, a timing-only lookahead should not systematically promote A over B. Such an override requires an explicit third-axis reason; it cannot be justified by generic 'opportunity cost'.

This is a **fail/sanity diagnostic**, not an automatic production tie-break or ADP obedience rule. A valid model can still reach ahead of ADP when Player Quality/evidence supports it.

## Fresh 2026 example that exposed the need
Exact PITTI fresh freeze as-of 2026-08-22T06:58:45Z:
- James Cook III: standard panel **8.3288**, Sleeper Half-PPR ADP **9.6**.
- Chase Brown: standard panel **11.8**, Sleeper Half-PPR ADP **16.6**.

At an empty-roster 1.09 state where both are available and there is no new independent negative Cook evidence / positive Brown override, Cook dominates Brown on both axes. Therefore a deterministic Brown-over-Cook 1.09 result is a red-flag requiring mechanism audit. The invalid Turn-Pair harness produced exactly such a lock because of score-object mutation; it must not be interpreted as a genuine strategic reach.

## General preregistered audit
For every experimental full draft and each user decision:
- inspect the chosen candidate versus every available candidate in the canonical quality-safe frontier;
- flag a `QUALITY_TIMING_DOMINANCE_VIOLATION` when another candidate is better by at least 1.5 selected-panel ranks AND at least 3.0 Sleeper ADP picks, unless an explicit evidence/feasibility override is logged;
- thresholds are diagnostic tolerances, not scoring coefficients and must not be tuned to make a candidate pass;
- report violation frequency and exact pairs before reading aggregate outcome as promotion evidence.

A few contextually explained violations may be defensible. Repeated/deterministic unexplained violations invalidate the experimental mechanism for promotion even if an outcome evaluator happens to prefer its rosters.

## Why this is not a hard market gate
The invariant does not say 'never reach'. Examples of allowed states:
- A has meaningfully better selected-panel/evidence quality but later ADP: justified value reach can be correct.
- A has similar quality but much lower return probability due manager-specific collision: TAKE can be correct.
- B has injury/role downside not yet incorporated into static panel/ADP: explicit evidence override can make A correct.

It only catches the particularly suspicious case where the chosen player is simultaneously worse on current Player Quality and easier to obtain later, with no logged reason to reverse both signals.
