# PITTI Expert-v2 — fixed-input intermediate A/B (2026-08-26)

Status: RESEARCH / FAIL-CLOSED FOR PROMOTION. No main/gh-pages/device/production mutation.

## Purpose and boundary
This is an intermediate diagnostic toward the exact A/B contract. It reconstructs current rc4.64 decision-kernel scoring from the current `app.js`, injects either incumbent or Expert-v2 panel ranks, and replays the canonical natural fixture sequence from `draft-companion-v7-backup-2026-08-24T19-40-47-213Z.json` / draft `1397557585325891584`.

Important limitation: this pass uses the persisted candidate frontier plus frozen per-candidate Return outputs / frozen board-median Return context. It does NOT yet rerun Return-v2 end-to-end after panel substitution. Therefore it is diagnostic/falsification evidence, not final certification.

## Control-parity diagnostic
Using the frozen incumbent panel inputs, the extracted current-rc4.64 scoring reconstruction matches the stored natural fixture leader at 14/15 decision points.

Matched picks: 9, 12, 29, 32, 49, 52, 69, 72, 89, 109, 112, 129, 132, 149.

Boundary pick 92 differs: current-rc4.64 reconstructed control gives Stefon Diggs narrowly ahead of Blake Corum, whereas the captured rc4.63 fixture had Trevor Lawrence ahead of Blake Corum. This is not silently relabeled as parity. The fixture is rc4.63 and current rc4.64 has later marginal-value/safety semantics, so pick 92 remains an explicit current-kernel semantic boundary requiring exact browserless/runtime parity rather than tuning the treatment around the stored historical leader.

Frozen roster counts used for mandatory late controls are coherent with the fixture sequence: pick92 QB1/RB2/WR5/TE1; pick129 QB1/RB4/WR6/TE1; pick132 QB1/RB5/WR6/TE1; pick149 QB1/RB6/WR6/TE1.

## Expert-v2 treatment construction
Panel ranks are recomputed using current app `computePanel` semantics from the corrected/frozen current source set:
- Draft Sharks corrected v5 public freeze;
- Nick Mariano;
- Pat Fitzmaurice;
- Dalton Del Don;
- current Justin Boone reconstruction with reconstructed-rank discount retained rather than falsely marked exact.

Recovered candidate weights remain unchanged:
- QB DS35 / Mariano25 / DelDon20 / Boone10 / Pat10.
- RB DS35 / Mariano25 / DelDon25 / Pat15.
- WR Mariano35 / DS30 / Pat15 / DelDon10 / Boone10.
- TE DS35 / Pat30 / DelDon25 / Boone10.

## Intermediate treatment results
Relative to the extracted current-kernel incumbent arm, treatment changes the local leader at 7/15 fixtures:
- pick 12: Brock Bowers -> Justin Jefferson;
- pick 69: Parker Washington -> Tucker Kraft;
- pick 92: Stefon Diggs -> Jordan Addison (Blake Corum remains very close);
- pick 109: Stefon Diggs -> Josh Downs;
- pick 129: Jalen Coker -> Xavier Worthy;
- pick 132: Jalen Coker -> Romeo Doubs (Woody Marks very close);
- pick 149: Jalen Coker -> Kyler Murray QB2.

Unchanged local leaders: pick9 James Cook, pick29/32 Chris Olave, pick49 Ladd McConkey, pick52 Jaylen Waddle, pick72 Parker Washington, pick89 Justin Herbert, pick112 Stefon Diggs.

Several changes are directionally plausible and useful diagnostics: pick69 Kraft reflects turn sequencing/opportunity cost; pick109 Downs matches the historical natural choice direction. They do not cancel the regressions below.

## Mandatory-control failures / concerns
The recovered Expert-v2 candidate is NOT promotable as-is from this pass:

1. **Pick149 QB2 regression:** with QB1 already filled and RB6/WR6, treatment elevates Kyler Murray to the local leader. This violates the required high marginal-value/opportunity-cost discipline unless a genuine exceptional QB slide is demonstrated. It is a material regression signal, not a reason for a player-name blacklist.
2. **Late-WR controls:** pick129 and pick132 still favor WRs under treatment (Xavier Worthy / Romeo Doubs) despite WR6 roster state. This does not prove those specific players are wrong, but it fails to demonstrate that Expert-v2 improves the known late-WR saturation interaction.
3. **Pick92 remains boundary-sensitive:** treatment changes the leader but still does not independently certify the desired Corum-like RB alternative. Do not tune weights to reproduce the user's historical pick.

## Source-family probe
Leave-one-source-family-out probes were run as a falsification test:
- no single QB source removal fixes the pick149 Kyler QB2 result; removing Draft Sharks alone still leaves Kyler on top;
- no single WR source removal fixes pick129 Xavier Worthy as the leader;
- some omissions change pick132, but no principled single-source removal solves the full late-control set.

Therefore do NOT respond by blaming one expert, deleting a source ad hoc, or micro-tuning 35 vs 32/38. The interaction between the changed panel and downstream marginal-roster/championship decision utility is material.

## Consequence / next gate
Recovered Expert-v2 weights remain SHADOW and additive/selectable only. No integration/promotion yet.

Next research should separate two axes cleanly:
A. incumbent vs Expert-v2 panel under identical current decision logic;
B. independently validated current marginal-roster/championship decision-surface challenger applied identically to both panel arms.

This is not authorization to alter production decision logic just to make v2 pass. Any decision-surface challenger must first satisfy the already frozen natural controls, realistic-scale/utility evidence, exceptional-slide reversibility, no hard WR cap, no blind RB accumulation, and no global QB2/TE2 ban.

Final exact Expert-v2 certification still requires end-to-end Return-v2 rerun because panel/market inputs can affect Return. The incumbent rc4.64 configuration remains selectable and unchanged throughout.
