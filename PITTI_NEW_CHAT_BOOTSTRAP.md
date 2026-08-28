# PITTI NEW CHAT BOOTSTRAP — REPO FAIL-CLOSED FALLBACK

This file exists because the persistent Library mirror can lag behind verified repo/device state.

## Trigger
When the user writes **PITTI AUTO** in a new chat, do not answer with a status-only takeover.

## Mandatory load order
1. `PITTI_COMMAND_CONTRACTS.json`
2. `PITTI_CURRENT_STATE.json`
3. `PITTI_HANDOFF_SEAL.json`
4. `PITTI_EXECUTION_LOCK.json`
5. `PITTI_AUTO_PREFLIGHT.md`
6. `PITTI_PROJECT_STATE.md` to actual EOF
7. `NEW_CHAT_HANDOFF_CURRENT.md`
8. this bootstrap
9. `HANDOFF_COMPLETENESS_MATRIX.md`
10. relevant actual branch/runtime/artifact/device evidence

Before project work, require CURRENT.handoff_generation == SEAL.handoff_generation == handoff generation, SEAL PASS, handoff_ready=true, second_pass_pass=true, and verify the seal-listed repo blob hashes. Any mismatch fails closed.

If Library files are available, read them too. A v105 Library reseal was prepared and locally second-pass verified on 2026-08-27, but persistent upload-back failed with container_session_expired. Therefore, until a later files.list proves newer Library bytes, Library v102/v103 or rc4.76/77 current pointers are stale evidence and must not override repo EOF/lock/device truth.

## Current acceptance boundary
- production/control: rc4.64
- Android version authority: rc4.91, observed directly in user screenshot on 2026-08-28
- Android functional verification: still pending for actual Expert-v3 rows, evidence polarity/quality, unified Top-10 and short-turn Return-v2 behavior
- current source: rc4.91
- latest package/re-extract: rc4.91, 13 runtime files, SHA-256 `64039b7a054c0f4a7a784f01540d3a1482c1786a88075e8be167dc4eb00bbc72`
- gh-pages reports rc4.91, but `app.js` bytes currently lag main: Henry/polarity fix is present, latest broad evidence batch is not. Matching version text is NOT proof of byte parity.
- Library rc4.52 aliases remain recovery-only; stale Library state never overrides repo/device evidence.

## Current gate
`RC491_ANDROID_FUNCTIONAL_PLUS_BROAD_RESEARCH`

On takeover, verify the v132 seal/current hashes first. Continue from the rc4.91 device-observed state. Do not restart Expert-v3 acquisition/export: Todd D Clark QB, Ryan Weisse RB and Wolf of Roto Street TE are already integrated; WR intentionally remains frozen Expert-v2 because Joey Wright is unavailable. Verify actual runtime rows/evidence before any further device promotion. Continue broad anti-repeat upside/differentiator research in parallel when device evidence is unavailable. No mock unless explicitly requested.


## AUTO acceptance test
A valid PITTI AUTO run must execute the repeated loop:
**work package -> checkpoint -> re-inventory independent lanes -> next work package -> repeat**.

Re-inventory after EVERY package. A blocked lane blocks only itself. The user must never need to remind the system to use long blocks or parallel work.

Before any stop, inventory at minimum:
- decision/evidence
- regression/release
- evidence tooling
- draft-day failsafe
- expert freshness
- post-draft/FA
- Watcher readiness
- handoff/checkpoint integrity
- independent strategy/current evidence

Forbidden while executable work remains: “AUTO läuft”, “ich mache weiter”, a priority-only/status-only response, or stopping after one small audit.

AUTO itself never starts an interactive mock. An OOS/device gate becomes a valid interruption only after independent non-contaminating work is actually exhausted.
