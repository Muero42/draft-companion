# rc4.63 natural-mock roster/championship audit — 2026-08-24

## Frozen evidence
Source backup: `draft-companion-v7-backup-2026-08-24T19-40-47-213Z.json`.
- App/model: `v11.8.0-rc4.63`
- Draft: `1397557585325891584`, 10 teams, slot 9, 15 rounds.
- Backup contains **all 15 user decision fixtures** for picks 9/12/29/32/49/52/69/72/89/92/109/112/129/132/149.
- It also contains 16 Return-v2 validation windows. This is materially stronger than older backups with incomplete late decision fixtures.

## Return-v2 calibration on this completed natural mock
Across resolved predictions in this draft: n=179, mean Brier ≈ **0.0857**.
- 2-opponent-pick windows: n=77, mean predicted survival ≈ **91.84%**, actual ≈ **85.71%**, Brier ≈ **0.1003**.
- 16-opponent-pick windows: n=78, mean predicted survival ≈ **30.97%**, actual ≈ **29.49%**, Brier ≈ **0.0919**.
Interpretation: Return-v2 remains useful and is not the primary failure. The new defect is conversion of player value + timing + roster state into final decision priority.

## Natural sequence evidence
- Pick 69 -> 72: Parker Washington was estimated 75.7% to survive and **did survive**. Tucker Kraft was taken at 69; Parker at 72. This validates using Return as opportunity cost even when Parker had the slightly higher raw Coach score.
- Pick 92 -> 109: after Justin Herbert filled QB1 at 89, Trevor Lawrence was still raw Coach #1 at 92. Lawrence had only 37.1% modeled survival and was indeed taken at 93. Nevertheless, spending pick 92 on QB2 would have had poor marginal roster value; Blake Corum was selected instead. This is a roster-utility failure, not a Return failure.
- Pick 112 -> 129: Stefon Diggs (1.6% modeled survival) and Rachaad White (13.2%) were both taken before 129. The app correctly saw urgency, but with six WR already rostered it overvalued ordinary WR7 depth relative to late-RB championship optionality.
- Pick 129 -> 132: Mike Washington had 99.1% modeled survival and survived. Jalen Coker had 96.2% and survived. Jonah Coleman was selected at 129. This supports using very high Return probability as an opportunity-cost reason not to reach for a contingent player whose longer-term value is uncertain.
- Pick 132 -> 149: Mike Washington had 78.7% modeled survival and survived; Jalen Coker had only 21.1% modeled survival yet also survived. This is a useful residual for Return calibration, but one miss must not be converted into a generic Return retune.

## Completed roster path
The actual user sequence after the core starters was intentionally diversified rather than position-capped:
- QB1 Justin Herbert.
- TE1 Tucker Kraft.
- RB depth added with Blake Corum, Chris Rodriguez, Jonah Coleman and Keaton Mitchell.
- Jalen Coker became the final WR7 only after the late-RB room had already been built.
This demonstrates the desired rule: starter maxima are not roster caps; marginal value changes with roster depth and draft phase.

## Diagnosis
The raw Coach score remains a player-value baseline, but the visible #1 ordering is currently too close to absolute player quality. It insufficiently prices:
1. replacement value after QB1/TE1 is filled;
2. diminishing marginal value of ordinary WR7+ depth;
3. late-round RB contingent ceiling when the RB room is not saturated;
4. Return-v2 as opportunity cost in turn sequencing.

The correction should therefore be a **small final decision-priority layer**, not a rewrite of Panel, Player Quality or Return-v2.

## Research-only challenger
`research/rc463_roster_championship_challenger.js` is an isolated pure-function harness. It deliberately does **not** modify `app.js` or production runtime.

Current challenger principles:
- add a modest urgency term from `(1 - ReturnProb)` rather than hard-sorting TAKE/WAIT;
- strong QB2/TE2 marginal-value hurdle after starter is filled, fading away for objectively exceptional falls;
- ordinary WR7+ penalty, also fading for exceptional falls;
- modest late-RB upside boost while RB depth remains below saturation;
- explicit RB7+ diminishing-value control so 'late RB' cannot become blind accumulation.

Regression targets include the real pick-69, 89, 92, 112, 129 and 149 states plus synthetic TE2 and exceptional-QB-slide controls. The current isolated harness passes all eight cases locally. This is **challenger evidence only**; coefficients are not production-certified.

## Fail-closed promotion gate
Do not promote this layer into rc4.63/main solely because it matches one natural mock. Before any runtime mutation:
1. run the challenger across every frozen decision fixture in this backup and inspect unintended reorderings;
2. combine with the realistic full-draft scale/counterfactual evidence once available;
3. require QB2/TE2 exceptional-slide controls, deep-WR controls and late-RB saturation controls to pass;
4. preserve existing normal-cut ordering semantics, hard-QB exclusions, acute injury guards, Mock/LIVE parity, Return-v2 and starter-maxima-not-roster-caps;
5. only then consider a small rc4.64 candidate.

No production coefficient/runtime change in this audit.
