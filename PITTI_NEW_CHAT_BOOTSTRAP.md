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
- source/package/deployment: rc4.92; main/gh-pages runtime parity verified
- Android version authority: rc4.92, observed directly in user screenshot 2026-08-28 13:04 local
- Android functional verification: OPEN
- Expert-v3 integrated; do not restart acquisition/export
- Geno Smith/Aaron Rodgers are ordinary QB candidates; no player-name exclusion
- Library mirror remains fail-closed if stale

## Current gate
`RC492_WALKER_ROOT_CAUSE_AND_ANDROID_FUNCTIONAL_VERIFY`

On takeover, require the latest CURRENT/SEAL/handoff generation and verify seal hashes. First diagnose Kenneth Walker III disappearing from the fresh Pick-9 Top-10; do not rationalize it from the minor ankle/foot issue without scoring arithmetic. Then finish focused rc4.92 Android functional verification (actual Expert-v3 rows, evidence polarity/quality, unified Top-10, Return-v2 short-turn tau 4.25). Continue broad anti-repeat upside research in parallel. No mock unless explicitly requested.

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