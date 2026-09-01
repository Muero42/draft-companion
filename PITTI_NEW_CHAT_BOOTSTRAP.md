# PITTI NEW CHAT BOOTSTRAP — v222
Generation: `20260901T2200Z-v223`

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

- Do NOT repeat rc4.160 device testing.

## v223 CURRENT OVERRIDE — rc4.176 NO-TRIAL RELEASE
- rc4.175 installed/rejected: accidental app.js truncation removed workspace routing and caused the visible Kader/Draft regression.
- rc4.176 restores the full runtime and adds executable truncation + workspace navigation gates.
- All automated candidate gates must pass before any Android action; device is final confirmation only.
- Current rollback authority rc4.169; current candidate rc4.176.
- Next gate: FINAL_DEVICE_CONFIRMATION_AFTER_RESEAL.
- Do NOT repeat rc4.160 device testing or any rc4.171–175 debugging on device.
- AUTO queue takeover: when server-side gates are executable, complete them silently before requesting the one final device confirmation.
