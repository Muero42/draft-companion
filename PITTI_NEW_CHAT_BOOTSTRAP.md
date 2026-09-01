# PITTI NEW CHAT BOOTSTRAP — v217
Generation: `20260901T1058Z-v217`

## Mandatory takeover order
1. `PITTI_COMMAND_CONTRACTS.json`
2. `PITTI_CURRENT_STATE.json`
3. `PITTI_HANDOFF_SEAL.json`
4. `PITTI_EXECUTION_LOCK.json`
5. `PITTI_AUTO_PREFLIGHT.md`
6. `PITTI_PROJECT_STATE.md` to EOF
7. `NEW_CHAT_HANDOFF_CURRENT.md`
8. `HANDOFF_COMPLETENESS_MATRIX.md`
9. actual branch/runtime/version/CI/device evidence

Fail closed on contradiction. Chat memory and stale Library mirrors are not authority. The newest verified repo/device facts win.

## Current authority
- POST_DRAFT_SEASON_COMPANION.
- Branch `season-companion-rc4.159` is historical naming only.
- Source/preview candidate **v11.8.0-rc4.161**.
- Accepted Android authority **v11.8.0-rc4.158** until physical rc4.161 acceptance.
- Current Sleeper league state is roster/ownership Source of Truth.
- Draft roster is immutable history only.
- rc4.160 device already proved automatic transaction detection: Mevis rostered, Bigsby absent, Charbonnet Reserve/IR.
- Do NOT repeat rc4.160 device testing.
- rc4.161 separates FA ownership discovery from ranking hydration and includes executable FA ownership regression.

## First gate
Reconcile v217 generation + seal integrity + repo/version/CI. If consistent, the only remaining dependent release gate is **DEVICE_RC4161_ACCEPTANCE**.

## AUTO queue takeover
Before executing `PITTI AUTO` in a new chat:
1. Load `PITTI_CURRENT_STATE.json:auto_execution_state`.
2. Reconcile `active/ready/waiting_external/blocked_user` against actual repo/CI/runtime evidence.
3. Orphaned `active` work becomes `ready` unless evidence proves complete, failed, or waiting externally.
4. Dispatch highest-priority safe `ready` work continuously.
5. After EVERY work package: checkpoint → re-inventory → execute next package in the SAME turn.
6. CI/deploy/device waiting blocks only dependent lanes.
7. A visible AUTO response is forbidden while `active.length>0` or `ready.length>0`.
8. Never send “AUTO läuft”, “ich mache weiter”, “CI läuft”, “Commit erstellt”, “keine Nutzerhandlung nötig”, status-only acknowledgements, or empty assistant messages after tool work.
9. Visible output requires `active=[]`, `ready=[]`, `stop_evaluation.allowed=true`, and an approved stop code.
10. AUTO BLOCK uses the same logic with zero progress chatter.

## STATUS
STATUS reports current known state only. No tool calls, CI polling, new analysis, or AUTO continuation.
