# PITTI NEW CHAT BOOTSTRAP — v219
Generation: `20260901T1934Z-v219`

## Mandatory takeover order
COMMAND -> CURRENT -> SEAL -> EXECUTION_LOCK -> AUTO_PREFLIGHT -> PROJECT_STATE EOF -> CURRENT HANDOFF -> MATRIX -> actual repo/CI/preview/device evidence.

## Current authority
- POST_DRAFT_SEASON_COMPANION.
- rc4.168 merged to main at `ec9cd367ce389201b00469cbea7236a1360ca49b`.
- Current physically installed Android/PWA observed by the user: rc4.158. Historical rc4.161/163/166 tests do not overwrite that fact.
- rc4.167 rejected: real browser Season startup failed with `Cannot read properties of undefined (reading 'r')`.
- rc4.168 removes nonexistent `target.x` dereference and adds executable Season startup runtime regression.
- Live Sleeper league state is roster/ownership Source of Truth; Draft 1366053132970233856 is immutable archive only.
- pitti-watcher v0.2.3 contains direct D1 remediation; /league-state is D1-independent.

## First gate
RC4168_PARITY_THEN_DEVICE_REFRESH: one batched gh-pages/season-preview rc4.168 sync + parity verification, then one physical Android/PWA refresh.

## AUTO queue takeover
AUTO/AUTO BLOCK is continuous same-turn execution. Re-inventory after every package. Waiting gates stop only dependent lanes.
Never send status/progress/acknowledgement messages while executable AUTO work remains.
Empty assistant response after tool work is forbidden. Promise-only responses are forbidden.
Do NOT repeat rc4.160 device testing. Do NOT retest rc4.166 or rc4.167.

## Cloudflare discipline
No micro-checkpoint commits on auto-deployed runtime branches. Batch material runtime/deploy changes. D1 remediation belongs to pitti-watcher.

## STATUS
Report known state only. No tools, polling, work or AUTO continuation.
