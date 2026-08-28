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
- source/package challenger: rc4.94; latest deployment/Android authority: rc4.93; rc4.94 CI/release/package PASS, main/gh-pages parity intentionally false until exact rc4.94 deployment
- latest package/re-extract: rc4.94 (final v143 candidate-package PASS; run 33169002426 / artifact 9684784867 / artifact digest d9ce3d0fa1fe1b3d69ebe7609d9425e2a3d0328741648fc868ddeba8d3f1e576)
- Android version authority: rc4.93, observed directly in fresh Pick-9 snapshot
- Android functional verification: OPEN
- Expert-v3 integrated; do not restart acquisition/export
- Geno Smith/Aaron Rodgers are ordinary QB candidates; no player-name exclusion
- Library mirror remains fail-closed if stale

## Current gate
`RC494_DEPLOY_PARITY_ANDROID_VERIFY`

On takeover, require the latest CURRENT/SEAL/handoff generation and verify seal hashes. Fresh rc4.93 Pick-9 evidence proved Walker remains Panel 15.3 / ADP 17.4 while outside-normal-cut fallback rows occupied visible Top-10 slots. rc4.94 fixes only visible candidate selection: normal-cut rows first, fallback only fills unused slots. CI/release/package already PASS on final v143 reseal. Deploy exact rc4.94 runtime, prove main/pages parity, then obtain a fresh Android Pick-9 snapshot. Do not retune scoring, Expert-v3, Return-v2, injury penalties or Walker specifically. No mock unless explicitly requested.

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