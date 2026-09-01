# NEW CHAT HANDOFF — PITTI SEASON COMPANION
Handoff generation: `20260901T2050Z-v222`

- rc4.171 is already installed on the user's Android/PWA.
- rc4.171 is NOT accepted: user reports persistent hanging and ineffective Kader/Ranking refresh behavior.
- Recent assumption that rc4.170 was still installed was stale and caused incorrect status/release reasoning.
- Device-first iteration is explicitly revoked.
- Mandatory next gate: `AUTOMATED_SEASON_E2E_BEFORE_ANY_DEVICE_UPDATE`.
- Build automated browser-equivalent E2E before any new preview/device promotion.
- Device canary may only happen after automated E2E PASS and is final confirmation, not debugging.
- Manual trial-and-error with unfinished versions is forbidden.
- AUTO: continuous; no progress/ack messages, no empty replies, no false “AUTO läuft weiter”.

- Transaction canary preserved: Harrison Mevis rostered; Tank Bigsby absent; Zach Charbonnet Reserve/IR.

- Never send status/progress/acknowledgement messages while executable AUTO work remains.
