# rc4.59 Companion recommendation mechanism audit — 2026-08-23

Research-only static audit against the verified Tier-first/reality contract. No production mutation in this note.

## Artifact/source identity
The actual Library archive `Draft_Companion_v11.8.0-rc4.59_FULL_TEST.zip` was materialized and verified:
- ZIP SHA-256 `3b37de2efafe3235cae6ea42a3c38a4a0fdde753480b07154881eaeedfb7a506`.
- exactly eight runtime files.
- `app.js` SHA-256 `1de9c6dcbd39bec35dffd2b43575260da6601abf3a9a29fe329ffeb8a4065fa3`, matching the source lock used by the validated rc4.59 research harness.

Library alias audit also found a concrete state mismatch:
- `Draft_Companion_TEST.zip` and `Draft_Companion_LATEST.zip` are byte-identical SHA-256 `38e46c942e2b95c862587fdab1bd5bf71b2da524e5efc1ef0107acaad2c7bf32` and internally identify as **rc4.46**, not rc4.59.
- Therefore numbered rc4.59/device-used state must not be conflated with current Library TEST/LATEST aliases. Do not overwrite aliases until the recommendation audit/promotion gate is complete.

## Regression question: did scoring change from rc4.54 to rc4.59?
No. Direct function-hash comparison across actual rc4.54, rc4.55, rc4.56, rc4.57, rc4.58 and rc4.59 archives found the following recommendation/scoring functions byte-identical throughout:
- `scoreCandidate`
- `applyResolvedReturnScore`
- `playerQualitySafetyThreshold`
- `applyPlayerQualitySafetyGate`
- `tierContext`
- `positionalAlternativeContext`
- `marginalRosterUtility`
- `rosterState`
- `injuryStashAdjustment`
- `progressiveUpsideBonus`

The rc4.54->59 app changes are predominantly version/export/chat-navigation/live-UI plumbing. Thus a perceived recommendation regression across these versions is **not explained by a new scoring-coefficient change**. More likely causes are changed panel/ADP/input state, draft-state/availability, or a pre-existing scoring mechanism exposed by new states.

## Tier-first mismatch in the current production Coach
The current rc4.59 runtime does **not** implement the newly verified cross-position Tier-first decision layer.

1. `tierContext()` is same-position only and is diagnostic in `scoreCandidate`; its old tier scarcity score is explicitly not applied.
2. Player Quality uses `100 - (panelRank - bestAvailablePanelRank)`, i.e. roughly one raw point per selected-panel overall-rank gap.
3. Return pressure is applied twice by design:
   - absolute resolved Return term: up to +/-6 raw points early;
   - board-relative urgency term: up to +/-3 additional raw points.
   Combined Return/timing pressure can therefore move a candidate by as much as ~9 raw points before other components.
4. Other live raw-score terms can also materially exceed a few panel ranks: ADP value/reach up to +/-4.5, draft-phase need up to +7/-16, positional-alternative scarcity up to +5/-2, plus agreement and smaller terms.
5. `PlayerQualitySafetyGate` at picks <=30 triggers only when the natural score leader is at least **7 overall panel ranks** behind the best available player. Therefore a candidate 1-6 panel ranks worse can become recommendation #1 from timing/need/scarcity without any Tier-first review. Even when the gate triggers, it selects inside a narrow panel band; it does not reason over PITTI cross-position intrinsic tier/boundary confidence.

This architecture was coherent under the older rank-continuous model, but it is not equivalent to the current requirement: `meaningful intrinsic tier boundary > TAKE/WAIT timing`, with timing allowed to reorder only within shared/overlapping tiers.

## Injury semantic mismatch
`scoreCandidate` still assigns a generic `QUESTIONABLE` status a mechanical -3 raw-point penalty. Current PITTI evidence policy says a generic Questionable label is not itself a mechanical downgrade; injury impact must be player-specific and chronology/role/timetable aware. This is a real semantic mismatch to audit in realistic mocks before considering a small correction.

## Working diagnosis
The likely issue is **not recent code regression**. It is that the long-standing rank-continuous Coach can over-express Return/need/positional scarcity across a real tier boundary, and mutable panel/market/draft states can expose that behavior in different names. This is exactly the class of failure that the Chase Brown/Bowers research anomalies made visible, although those particular research failures came from separate invalid/rejected harnesses.

## Required dynamic gate before any fix
Run complete realistic rc4.59 Coach drafts and inspect every user decision. Record:
- actual recommendation/top-10;
- selected-panel gap;
- Return and safety-gate state;
- first-turn superior-faller/core/next-turn cluster context;
- any attempted medium/high tier crossing;
- final construction/legality and FA pool.

Only if dynamic evidence shows material decision failures should a **small, generic, position-neutral Tier-crossing block/guard** be researched. Do not tune Return weights or add named-player rules on the diagnostic seeds. Generic Questionable handling may be corrected separately only if it can be done without masking real injury evidence.