# NEW CHAT HANDOFF — PITTI SEASON COMPANION
Handoff generation: `20260902T1325Z-v229`
Created: 2026-09-02 13:15Z

## CURRENT AUTHORITY
Mode POST_DRAFT_SEASON_COMPANION. rc4.185 merged source baseline. PR #108 OPEN/UNMERGED on `pitti/trade-slot-geometry`.

PR #108 contains: real canonical Sleeper starter/FLEX geometry for Trade Board v5; second TE allowed when it wins legal FLEX; blanket TE2 waiver penalty removed; full ten-team Sleeper league state with manager mapping, players/starters/reserve/taxi, waiver position, FAAB used/remaining persisted; opponent waiver-market foundation. Sleeper live state is roster/ownership authority; draft roster is history; Watcher evidence-only.

## EXACT CURRENT FAILURE / REPAIR
Prior exact head `0a41ca11f579719bede99cb04454a606f64bb1d3`: Release Contract PASS, Project Guardrails PASS, Candidate Package FAIL. Failure was specifically `tools/live-trade-roster-identity-regression.mjs` requiring explicit text: “Sleeper roster_id is a league roster identifier, NOT the historical draft slot.” The v5 runtime already used `myLiveRosterId` correctly; do NOT revert to draft-slot identity. Explicit invariant restored in app.js. Query latest PR #108 head/CI and diagnose exact result.

## LAWRENCE / WAIVER
Trevor Lawrence was dropped. User is willing to deviate from draft-era no-QB2 because Lawrence and Jayden Daniels are both viewed as strong fantasy QBs; same bye is a cost. Need opponent-specific bid model from live rosters, not screenshots. Price acquisition with TWO active opportunity costs when D/ST still must be added: Lawrence drop now + later D/ST drop. IR/Reserve cannot satisfy ordinary capacity. Final FAAB bid remains pending live opponent analysis.

## RELEASE / DEVICE
After PR #108 all-green: merge → rc4.186 promotion → post-merge/deploy byte parity → exactly one physical canary. Latest installed/observed Android rc4.183 is DEVICE_REJECTED for FA/Add-Drop cards under Kader and IR Charbonnet ordinary-drop semantics. Accepted rollback rc4.169. No cache/reinstall/trial loops.

## AUTO CONTRACT
AUTO/AUTO BLOCK means autonomous same-turn execution while any safe positive-value lane exists. After every package checkpoint and re-inventory. No progress/status/acknowledgement terminal messages, no empty replies, no “AUTO läuft weiter” promise. Waiting CI blocks only that lane. STATUS is report-only.
