# PITTI NEW CHAT BOOTSTRAP — v222
Generation: `20260901T2050Z-v222`

## Current authority
- POST_DRAFT_SEASON_COMPANION.
- Main/runtime observed: rc4.171.
- Physical Android/PWA: rc4.171 is installed, but FUNCTIONALLY REJECTED: app still hangs and refresh controls do not produce the required behavior.
- Do not infer acceptance from installed version.
- Strict release policy restored: **autonomous tests first, device install last**.

## Mandatory release gate
`AUTOMATED_SEASON_E2E_BEFORE_ANY_DEVICE_UPDATE`
Before any next device candidate is promoted, automated browser-equivalent E2E must PASS for:
1. initial Season hydration,
2. Kader refresh click and visible busy -> success/error transition,
3. Rankings refresh click and visible busy -> success/error transition,
4. bounded network timeout/failure handling,
5. no indefinite loading state,
6. Draft-only UI hidden outside Draft-Archiv,
7. Waiver/Trade/Live surfaces remain isolated/fail-closed.

Manual device testing is FINAL CONFIRMATION ONLY after automated PASS. No device-side trial-and-error.

## AUTO queue takeover
AUTO/AUTO BLOCK is continuous same-turn execution. Re-inventory after every package.
Never send status/progress/acknowledgement messages while executable AUTO work remains.
Empty assistant response after tool work is forbidden.
No “AUTO läuft weiter” messages.
No micro-deployment storm.

## STATUS
Report known state only; do not work/poll.
