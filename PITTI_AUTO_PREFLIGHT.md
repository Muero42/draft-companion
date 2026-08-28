# PITTI AUTO PREFLIGHT — MANDATORY

Use before every PITTI AUTO execution and after any chat handoff. This is an execution gate, not optional documentation.

## 0. HANDOFF TRANSACTION STATE
- On takeover, verify `PITTI_CURRENT_STATE.json` + `PITTI_HANDOFF_SEAL.json` first.
- Require matching generation with `NEW_CHAT_HANDOFF_CURRENT.md`, PASS seal, `handoff_ready=true`, `second_pass_pass=true`, and current seal-listed blob integrity.
- If a PITTI HANDOFF transaction is still marked in progress, AUTO finishes that transaction before ordinary project development.

## 1. SOURCE OF TRUTH
- Read `PITTI_PROJECT_STATE.md`.
- Identify newest material decisions and NEXT GATE.
- Verify relevant branch/build/artifact/runtime instead of assuming the document is still current.
- If reality differs, repair `PITTI_PROJECT_STATE.md` before proceeding.

## 2. ANTI-REGRESSION
Before acting, answer internally:
- Is this approach already recorded as failed/rejected?
- Am I reintroducing an old expert, format, UI behavior, ranking assumption, roster-cap error, duplicate-snapshot bug, or stale-data path?
- Is there a regression test/guard that should protect this rule?
- Am I confusing built/prepared with Android verified?
If any answer is unsafe/unknown, inspect evidence first.

## 3. END-TO-END ROUTE
- Define the shortest robust path from current state to the actual user goal.
- Confirm prerequisites exist before changing code.
- Prefer additive/small changes near draft freeze.
- Do not create parallel infrastructure when an existing verified capability already solves the problem.

## 4. AUTO CONTINUITY — DURABLE USER CONTRACT
- `PITTI AUTO` / `AUTO` means the longest safe autonomous work blocks by default, with as few interruptions as technically possible. This is persistent project authority; the user must never need to repeat it in later turns or chats.
- AUTO is a repeated work loop, not a one-package action: **execute work package -> checkpoint any material change -> re-inventory all independent lanes -> execute next package -> repeat**.
- Re-inventory after **EVERY** completed work package. One inventory at the start/end of an AUTO turn is insufficient.
- Execute all autonomously possible steps before messaging user.
- If lane A waits or hits an OOS/device/CI gate, immediately work independent lane B/C/D; a blocked gate blocks only its dependent lane, never PITTI AUTO globally.
- Mandatory inventory: decision/evidence validation, regression/release safety, evidence tooling, draft-day failsafe, expert freshness, post-draft/FA readiness, Watcher draft-critical readiness, checkpoint/handoff integrity, and independent strategy/current-evidence research.
- Do not send 'AUTO läuft', 'ich mache weiter', 'next I will...', a priority list, or a status-only response when executable work remains. Promise-only AUTO responses are invalid.
- A model/experiment freeze forbids contaminating that experiment; it does NOT forbid independent project work.
- An external/device/OOS gate is a valid interruption only after all independent non-contaminating positive-value lanes have actually been exhausted.
- If no safe autonomous lane remains, record the exhaustion reason and exact external gate before interrupting.

## 5. CHECKPOINT WRITE-THROUGH
Immediately update `PITTI_PROJECT_STATE.md` after material:
- requirement/decision change,
- implementation or promotion,
- runtime verification,
- new failure/root cause,
- rejected approach,
- artifact/version/hash change,
- priority/next-gate change.

## 6. USER INTERRUPTION TEST
Interrupt only if at least one is true:
- user/device action is technically unavoidable now,
- required information cannot be obtained autonomously,
- irreversible/destructive/security-sensitive action needs approval,
- unresolved contradiction makes further work unsafe,
- a meaningful completed artifact/result now requires runtime verification.
Otherwise continue AUTO.

## 7. PITTI-SPECIFIC CANARIES
- Draft identity includes Draft-ID; cross-draft duplicate false positives forbidden.
- Half-PPR 1QB; reject Superflex/2QB.
- Starter maxima are not roster caps.
- K/DST normally not drafted.
- Geno Smith/Aaron Rodgers are ordinary QB candidates; they must rank organically and must never be player-name hard-excluded.
- Excess WR depth must materially reduce redundant WR utility.
- Expert-v2: Brown excluded; Erickson challenger; Koerner no current-draft acquisition effort; Mariano availability already solved; Draft Sharks counted as one correlated family; availability-only automatic restoration of the old Weisse/Gianni/Bobal trio rejected; Ryan Weisse or others may be freshly qualified individually with evidence.
- Frozen Expert-v2 weights/profile semantics in `PITTI_EXECUTION_LOCK.json` are authoritative for the current experiment; do not invent, silently renormalize, or retune them without new promotion evidence.


## 8. HANDOFF / AUTO RESPONSE DISCIPLINE — v119
- Never answer an AUTO turn with “AUTO läuft”, “ich mache weiter”, or equivalent future-tense progress prose. Work must be executed **before** any reply.
- During PITTI HANDOFF, finish the complete transactional audit/reseal before replying unless an unavoidable blocker prevents it.
- Current update path: rc4.94 is source + CI/release/package/re-extract + exact 13-file gh-pages deployment parity + fresh Android Pick-9 presentation verified. rc4.94 prioritizes normal-cut candidates before outside-cut fallback context without changing Coach scoring, Expert-v3, Return-v2, ADP, injury penalties or player-specific treatment.

## 9. AUTO TURN TERMINATION — HARD GATE
- Completing one work package is **not** permission to end the assistant turn.
- After every package, re-inventory and execute the next safe positive-value autonomous package **inside the same assistant turn**.
- A normal final, status final, acknowledgement final, **or empty final after tool work** is forbidden while executable autonomous work remains.
- Because execution cannot continue after the assistant turn is ended without another user message, early turn termination is a functional AUTO failure, not a cosmetic response issue.
- Valid turn end requires one of: unavoidable user/device input; approval-gated consequential action; unsafe unresolved contradiction; material end result with no higher-value package remaining; or demonstrated exhaustion of all safe positive-value independent lanes.
- rc4.92 correction: Geno Smith/Aaron Rodgers are NOT exclusions. Any active runtime/test/checkpoint rule that special-cases either name for demotion/removal is a regression. Exactly-one-QB remains a roster strategy only after QB1 is drafted.
- v145 takeover canary: rc4.94 source/package/deployment/Android Pick-9 presentation PASS. Kenneth Walker must not receive a player-specific boost; the fix remains generic normal-cut-first Top-10 selection.


## AUTO BLOCK — HARD OUTPUT GATE
When the user writes `AUTO BLOCK`, enter silent execution mode:
- no progress, status, acknowledgement, or promise-only assistant messages;
- an individual tool/work-package ending is NOT a valid reason to return;
- immediately re-inventory and continue with the next autonomous package;
- never emit an empty assistant response;
- visible output is permitted only for a concrete useful end-result, unavoidable user action/input, safety/irreversible confirmation, or a blocker after every independent lane is exhausted.
