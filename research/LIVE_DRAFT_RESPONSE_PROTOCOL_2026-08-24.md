# PITTI Live-Draft Response Protocol — 2026-08-24

Status: MANDATORY for real/live 2-minute draft decisions and dress rehearsals.

## Objective
Minimize user reading time and interaction latency while preserving the decision information actually needed on the clock. Research and reasoning happen internally; the live message is an execution surface, not an analysis report.

## Trigger
Apply whenever a fresh Sleeper snapshot says `Status: drafting` and the user is on or immediately approaching their own pick, especially when `Live-Speed: EMERGENCY` or `FULL` during a real/dress-rehearsal draft.

## Mandatory layout
The first visible line must contain the actionable pick. No preamble, no heading above it, no explanation before it.

Preferred form:

`👉 JAMES COOK — JETZT`

Then at most two compact follow-up lines when useful:

`Lamb 38% Return · Jefferson 80% Return`
`Danach: frischer Snapshot bei 2.02`

If two players are genuinely near-equal and forcing one would be false precision:

`👉 COOK / LAMB — beide OK; leichter Vorteil Cook`
`Cook 13% Return · Lamb 38%`

## Hard constraints
- Normal live answer: target 2–4 visible lines, roughly <= 40 words.
- Emergency answer: target 1–3 visible lines, roughly <= 25 words.
- No paragraphs of player analysis.
- No restatement of league format, panel composition, methodology, injuries already accounted for, or snapshot metadata unless a newly discovered fact changes the decision.
- No web-research narration on the clock. If a material new fact was checked, incorporate only its decision consequence in a few words.
- Do not list 5–10 candidates. Show the pick plus at most 1–2 alternatives if they are genuinely live.
- TAKE/WAIT information should be compressed to return probability or one short label.
- Confidence only if materially useful; do not spend a separate paragraph on it.
- The next required user action must be one short final line.
- Never make the user parse the reasoning before seeing whom to draft.

## Decision ordering behind the compact surface
Internally preserve all existing guards: intrinsic tier first; current injury/acute status; roster/championship utility; Return-v2/TAKE-WAIT; manager/opponent layer; no starter-maxima-as-roster-caps; hard QB exclusions; no K/DST; QB2/TE2 rules. Compact output changes presentation only, not decision quality.

## Example from validated dress rehearsal at pick 1.09
Instead of a long explanation, output:

`👉 JAMES COOK — JETZT`
`Lamb 38% Return · Jefferson 80% Return`
`Danach: pausieren + 2.02-Snapshot`

## Non-live analysis
Outside the clock, detailed explanations remain allowed and preferred when useful. This protocol applies specifically to time-critical draft execution.
