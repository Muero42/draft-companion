# Injury-Uncertainty Visibility Guard — 2026-08-24

Status: RC4.60 challenger specification. Goal is visibility/safety, not autonomous injury-risk preference.

## Problem
A late injury can push a previously elite player down several current expert rankings. Because current panel rank is the Companion baseline and the existing rc4.60 acute-status guard can block recommendations, the player can disappear from the visible decision surface. That is unsafe for the user's decision process when prognosis is uncertain rather than clearly severe. Ashton Jeanty on 2026-08-24 is the motivating case: pre-event elite/turn value, current ankle uncertainty, no established long-term absence.

## Principle
Separate `healthyBaseline` from `currentPanel`. Do not average them. Current panel remains the scoring baseline. Healthy baseline is a visibility/reference datum used only when a material new event plausibly contaminated current rankings with uncertainty.

## Three-state injury classification
1. `KNOWN_SEVERE`: confirmed season-ending IR, clearly multi-week absence with material season-value loss, or comparable evidence. Current panel/risk model may demote normally; healthy baseline is diagnostic only and does not force top-10 visibility.
2. `KNOWN_MINOR`: credible evidence of minor/no meaningful regular-season impact. Current panel dominates; no special visibility promotion unless ordinary ranking logic already includes player.
3. `MATERIAL_UNCERTAINTY`: material injury/event with unresolved timeline or workload, while evidence does not establish severe long-term value loss. Preserve both values and force decision-surface visibility when the pre-event healthy baseline was relevant to the current pick window.

Default is fail-closed: if classification cannot be supported, do not manufacture a healthy rank or severity. A manually curated acute record may supply the state temporarily, but it must carry `asOf`, evidence/provenance, and expire/review quickly.

## Double-counting guard
Do not apply a second generic injury penalty merely because current experts already moved the player for the same event. The panel is already risk-adjusted. Injury evidence may:
- lower confidence;
- block TAKE while diagnosis is unresolved;
- change visibility;
- or override only with concrete new evidence.
It must not silently compound an unmeasured duplicate penalty.

## Healthy-baseline provenance
Preferred order:
1. stored last verified panel snapshot before event;
2. multiple verified pre-event expert ranks reconstructed into the same panel method;
3. clearly timestamped individual pre-event ranks as context only.
Never infer healthy rank from current ADP alone.

Required fields per uncertainty record:
`playerKey, state, eventAt, asOf, healthyPanelRank, healthyPanelAsOf, source/provenance, reviewBy, blockRecommendation`.

## Visibility rule
For `MATERIAL_UNCERTAINTY`, if the player was within the current pick's relevant healthy decision window, he must remain visible in the 10-player decision board even if current-panel safety/cut logic would omit him.

Relevant healthy decision window:
- healthy panel rank <= max(normal-cut quality boundary, current overall pick + 12), OR
- healthy panel tier overlaps a currently displayed clear candidate tier.

This is a VISIBILITY override only. It does not make the player TAKE, does not inflate Coach score, and does not replace current Panel/ADP/Return. If the board is full, the uncertainty player may replace the least relevant contextual fallback outside normal cut, never a normal admissible top candidate.

## Display contract
In the frozen live layout, an uncertainty player appears compactly as e.g.:
`Ashton Jeanty ⚠ — RB1 • Workhorse-Upside`
`LV · <wins> Siege · C/P/–`
`P 18,6 · Healthy ~9–12 · ADP 13,4 · R … · Confidence niedrig`
`⚠ Sprunggelenk · Timeline offen; langfristiger Ausfall derzeit nicht etabliert`

`Healthy` is shown only when provenance is valid. Current `P` remains first and remains the baseline.

## Recommendation guard
For `MATERIAL_UNCERTAINTY` with unresolved same-day/late-draft medical status, `blockRecommendation:true` means no automatic TAKE/top-favorite recommendation. The player remains visible so the user can consciously choose the risk. Once evidence resolves, update state and remove/relax block rather than leaving a stale hard-coded exclusion.

## Regression tests
A. Jeanty-like uncertainty: current panel falls from healthy top-10 to ~19; player remains in 10-board, marked uncertainty, not TAKE when block=true.
B. Confirmed season-ending injury: no forced 10-board visibility.
C. Minor injury: no artificial healthy-value promotion.
D. No event: output/order identical to rc4.60 baseline.
E. Board already has 10 normal admissible candidates: uncertainty visibility must not evict a stronger normal candidate; surface separately as explicit `RISIKO-FALLER` if necessary.
F. No valid healthy provenance: show uncertainty but no invented Healthy number.
G. Same injury already reflected by panel: no duplicate numerical penalty.

## Promotion gate
Do not modify rc4.60 production runtime until the isolated challenger passes syntax, behavioral regression A–G, unchanged-output tests for unaffected snapshots, and a realistic snapshot test reproducing the 1.09 Jeanty case. This guard is a safety/visibility layer; simulation EV improvement is not required, but no unrelated draft behavior may change.