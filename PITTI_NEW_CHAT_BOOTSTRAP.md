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
- current Android authority: rc4.84 (completed realistic mock / Evidence-v2 available)
- current deployed/package-reextract candidate: rc4.85
- rc4.85 purpose: integrated Expert-v3 challenger export only; Decision Kernel / Return-v2 / frozen Expert-v2 unchanged
- rc4.85 package/re-extract PASS; gh-pages deployed; Android rc4.85 not yet verified
- Library rc4.52 TEST/LATEST: recovery aliases only

## Current gate
`ANDROID_RC4.85_SELF_UPDATE_THEN_EXPERT_V3_EXPORT`

Use the already deployed/self-update path first. Do **not** require an expiring ChatGPT ZIP if the installed PWA can update/reload from gh-pages. Verify the app badge is `v11.8.0-rc4.85`; if it remains rc4.84, diagnose service-worker/cache/update state before inventing another install path. Once rc4.85 is verified, run `Expert-v3 Challenger exportieren` once and return the credential-free JSON. Then compute/test v3 weights and only implement a separate v3 preset if validated.

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
