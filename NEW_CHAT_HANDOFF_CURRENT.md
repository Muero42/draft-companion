# NEW CHAT HANDOFF — PITTI SEASON COMPANION
Handoff generation: `20260901T1058Z-v217`
Generated: 2026-09-01 13:12 CEST

## CANONICAL MODE
POST_DRAFT / SEASON_COMPANION. This supersedes every v215/v216 draft-day/current-version pointer.

## AUTHORITY
- Repository: `Muero42/draft-companion`, branch `season-companion-rc4.159`. The branch name is historical and is NOT the runtime version.
- Current source/preview candidate: **v11.8.0-rc4.161**.
- Accepted Android authority remains **v11.8.0-rc4.158** until physical rc4.161 acceptance.
- Real draft `1366053132970233856` is complete and immutable history.
- Current Sleeper league state is the sole current-roster and ownership Source of Truth.
- Draft roster is historical fallback only and must never drive post-draft FA ownership.
- Verified device transaction canary from rc4.160: Harrison Mevis rostered; Tank Bigsby absent; Zach Charbonnet Reserve/IR. The app detected the actual add/drop without the user disclosing the dropped player.

## RC4.161 ROOT FIX
The rc4.160 device exposed a false `0 gerankte Free Agents → HOLD` path. Root cause: FA ownership discovery was still coupled to expert-ranking hydration during startup. rc4.161 separates these layers:
1. derive complete live unowned QB/RB/WR/TE pool from Sleeper ownership;
2. rank/filter only downstream;
3. if live FA ownership exists but rankings are not ready, report that state and do NOT issue HOLD/ADD.
Executable regression: `tools/season-fa-ownership-regression.mjs`, wired into candidate-package CI.

## RELEASE STATE
rc4.161 code/regression verification is green. Handoff metadata is resealed separately and must be reconciled on takeover.
Do not retest rc4.160. Do not reopen draft-day gates, 6,000-draft stress, manager/autodraft stress, final expert-delta work, or pre-draft freeze logic without genuinely new evidence.

## AUTO / AUTO BLOCK — HARD CONTRACT
- AUTO is a continuous same-turn work loop, not one work package.
- After every package: checkpoint material change → re-inventory all independent lanes → immediately execute the next safe positive-value lane.
- CI/deploy/device waiting blocks only dependent work; independent lanes continue.
- Before ANY visible AUTO response, re-inventory. If `active` or `ready` contains executable work, visible output is forbidden.
- Never send status/progress/acknowledgement messages such as “AUTO läuft”, “ich mache weiter”, “CI läuft”, “Commit erstellt”, or “keine Nutzerhandlung nötig”.
- Empty assistant replies after tool work are also forbidden because they terminate the turn.
- A visible AUTO response is allowed only when `active=[]`, `ready=[]`, and `stop_evaluation.allowed=true` with an approved stop code.
- Valid stop codes only: USER_ACTION_REQUIRED, DECISION_REQUIRED, PROJECT_MILESTONE_REACHED, NO_EXECUTABLE_WORK_REMAINS, SAFETY_OR_IRREVERSIBLE_CONFIRMATION.
- STATUS is separate: report known state only; no tools, no polling, no continuation.

## NEXT GATE
New chat first loads and reconciles:
1. PITTI_COMMAND_CONTRACTS.json
2. PITTI_CURRENT_STATE.json
3. PITTI_HANDOFF_SEAL.json
4. PITTI_EXECUTION_LOCK.json
5. PITTI_AUTO_PREFLIGHT.md
6. PITTI_PROJECT_STATE.md to EOF
7. this handoff
8. PITTI_NEW_CHAT_BOOTSTRAP.md
9. HANDOFF_COMPLETENESS_MATRIX.md
10. actual repo/version/CI evidence

Only after that: **one physical Android rc4.161 acceptance**. Target: live roster remains correct and Waiver/FA no longer emits false zero-FA HOLD.
