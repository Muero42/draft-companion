# PITTI NEW CHAT BOOTSTRAP — REPO FAIL-CLOSED FALLBACK

This file exists because the persistent Library mirror can lag behind verified repo/device state.

## Trigger
When the user writes **PITTI AUTO** in a new chat, do not answer with a status-only takeover.

## Mandatory load order
1. `PITTI_COMMAND_CONTRACTS.json`
2. `PITTI_EXECUTION_LOCK.json`
3. `PITTI_PROJECT_STATE.md` to actual EOF
4. `NEW_CHAT_HANDOFF_CURRENT.md`
5. this bootstrap
6. `HANDOFF_COMPLETENESS_MATRIX.md`
7. relevant actual branch/runtime/artifact/device evidence

If Library files are available, read them too. If Library still points to v102/v103, rc4.76/77, or other superseded current facts, it is stale evidence and must not override repo EOF/lock/device truth.

## Current acceptance boundary
- production/control: rc4.64
- last fully Android-verified authority: rc4.82
- deployed TEST challenger: rc4.83, OOS-pending, not promoted, not Android-verified
- latest package + re-extract boundary: rc4.78
- Library rc4.52 TEST/LATEST: recovery aliases only

## Current gate
`ANDROID_RC4.83_REALISTIC_MOCK_THEN_EVIDENCE_V2_EXPORT`

rc4.83 coefficients are frozen until realistic Evidence-v2. User choices/final roster are not training labels.

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
