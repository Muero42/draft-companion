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
- Geno Smith and Aaron Rodgers are explicit user hard exclusions. Never recommend or draft either player.
- Excess WR depth must materially reduce redundant WR utility.
- Expert-v2: Brown excluded; Erickson challenger; Koerner no current-draft acquisition effort; Mariano availability already solved; Draft Sharks counted as one correlated family; availability-only automatic restoration of the old Weisse/Gianni/Bobal trio rejected; Ryan Weisse or others may be freshly qualified individually with evidence.
- Frozen Expert-v2 weights/profile semantics in `PITTI_EXECUTION_LOCK.json` are authoritative for the current experiment; do not invent, silently renormalize, or retune them without new promotion evidence.


- Active-draft decisionFixtures must never be deleted/pruned to recover browser quota; old history/secondary evidence may yield first.
- A full paired 15-round v4/v5 mock is invalid unless the exported backup contains exactly 30 active-draft fixtures covering all 15 own picks twice.

## 8. HANDOFF / AUTO RESPONSE DISCIPLINE — CURRENT
- Never answer an AUTO turn with “AUTO läuft”, “ich mache weiter”, or equivalent future-tense progress prose. Work must be executed before any reply.
- During PITTI HANDOFF, finish the complete transactional audit/reseal before replying unless an unavoidable blocker prevents it.
- Current source/deployment authority = **v11.8.0-rc4.129**; latest device-observed operational runtime = **rc4.126**.
- v4 and v5 are already operational on device. v4 remains PRIMARY; v5 remains CHALLENGER.
- rc4.129 fixes silent paired-evidence loss: active-draft decisionFixtures are atomic, may not be quota-pruned, and persistence failure must surface explicitly.
- Exact next gate: **RC4.129_DEVICE_REFRESH_THEN_FULL_30_FIXTURE_V4V5_MOCK**.
- One controlled refresh to rc4.129; then one complete 15-round realistic mock with BOTH v4 and v5 at every own pick.
- Backup acceptance requires **30 decisionFixtures = 15 exact pick states × 2 profiles** before any v4/v5 model comparison.
- Latest backup `draft-companion-v7-backup-2026-08-30T12-47-22-598Z.json` is incomplete paired evidence: 11/15 states; missing 9/12/29/32.
- No model-weight/source retune from that incomplete backup. No phone trial-and-error.

## 9. AUTO TURN TERMINATION — HARD GATE
- Completing one work package is **not** permission to end the assistant turn.
- After every package, re-inventory and execute the next safe positive-value autonomous package **inside the same assistant turn**.
- A normal final, status final, acknowledgement final, **or empty final after tool work** is forbidden while executable autonomous work remains.
- Because execution cannot continue after the assistant turn is ended without another user message, early turn termination is a functional AUTO failure, not a cosmetic response issue.
- Valid turn end requires one of: unavoidable user/device input; approval-gated consequential action; unsafe unresolved contradiction; material end result with no higher-value package remaining; or demonstrated exhaustion of all safe positive-value independent lanes.
- Draft-day correction supersedes rc4.92 for these two names: Geno Smith and Aaron Rodgers are explicit user hard exclusions. Exactly-one-QB remains the user roster strategy after QB1.
- v145 takeover canary: rc4.94 source/package/deployment/Android Pick-9 presentation PASS. Kenneth Walker must not receive a player-specific boost; the fix remains generic normal-cut-first Top-10 selection.


## AUTO BLOCK — HARD OUTPUT GATE
When the user writes `AUTO BLOCK`, enter silent execution mode:
- no progress, status, acknowledgement, or promise-only assistant messages;
- an individual tool/work-package ending is NOT a valid reason to return;
- immediately re-inventory and continue with the next autonomous package;
- never emit an empty assistant response;
- visible output is permitted only for a concrete useful end-result, unavoidable user action/input, safety/irreversible confirmation, or a blocker after every independent lane is exhausted.


## v169 TAKEOVER CANARIES
- Handoff generation must be `20260829T1244Z-v178` across CURRENT/SEAL/HANDOFF/bootstrap/matrix/lock.
- main/source/deployment/accepted Android authority = rc4.104.
- Exact 13-file main/gh-pages runtime parity = PASS.
- Android rc4.104 observed; completed post-draft Snapshot path = PASS.
- Canonical mock backup = draft-companion-v7-backup-2026-08-29T05-28-09-291Z.json; draft 1399284498113294336; source runtime rc4.101.
- Strict-Coach construction in that mock reached 9 WR / 4 RB / 1 QB / 0 TE before final pick; 14/14 preserved completed own picks followed Coach #1.
- rc4.104 bounded repairs: roster-aware WR6+ Value-Safety from pick81; extra soft WR7+/RB<=3 opportunity cost; conservative long-turn WAIT portfolio ordering; visible curated evidence with neutral polarity.
- Bounded replay rc4.101 fixtures -> rc4.104 is CI PASS for pick92/109/112 roster economics and exact pick132 Spears/Andrews reorder; Return-v2 unchanged. Continue draft-day readiness/freshness/failsafe.
- Return evidence remains: 3-pick 92.5% forecast vs 92.4% actual (Brier .044); 17-pick 35.6% vs 32.5% (Brier .077). No global Return-v2 retune.
- No PairSum/Rolling, hard WR cap/quota, blind RB forcing, player-name forcing, global QB2/TE2 rule, generic Return-v2 retune, or expert-weight redesign.
- Geno Smith and Aaron Rodgers are explicit user hard exclusions; never recommend/draft.
- Starter maxima are not roster caps; normal user draft excludes K/DST; user strategy drafts exactly one QB.
- Completed rc4.104 Snapshot is duplicate/documentation only; do not re-run live-pick analysis on it.
- FantasyPros post-draft capture is optional external benchmark, not prerequisite for replay.
- Handoff PASS is invalid if seal integrity is stale, empty, omits required core files, or takeover generations disagree.

- v167 latest OOS: backup draft-companion-v7-backup-2026-08-29T06-53-52-495Z.json, draft 1399308446632800256, rc4.104. Pick129 exposed score-0 short-turn promotion; rc4.105 generic Coach-floor fix passed PR #46 gates and deployed 13/13 parity.

- v169 mock pause canary: draft 1399325404598124544 is paused BEFORE user pick9. Picks1-8 Gibbs/Chase/Bijan/Jonathan Taylor/CMC/Puka/Amon-Ra/JSN. James Cook was recommended at 1.09 but user did not confirm the pick; never infer he is on roster.
- v169 rc4.106 canary: embedded Expert-v2/v3 individual rows must appear in Snapshot Coach Top 8; old `KEINE VERIFIZIERT` live-rankCache-only filter is rejected. PR #47 all gates PASS; main merge 0818bc9632eca79c4d055d444a6eae0af53f3a9f; 13/13 pages parity PASS.


## 10. v194 CURRENT OVERRIDE — rc4.130
- This section supersedes older rc4.129/v169 current pointers above; historical sections remain for regression provenance only.
- Current source/deployment authority = **v11.8.0-rc4.130**; latest fully operational device-observed v4/v5 baseline = **rc4.126**.
- rc4.129 device mock exposed a fail-closed Decision-Evidence storage error at pick 12. Backup `draft-companion-v7-backup-2026-08-30T13-40-34-982Z.json` contains 4 current-draft fixtures = paired v4/v5 at picks 9/12, plus 22 historical fixtures.
- Exact root cause: `history.slice(-0)` retained all history, so rc4.129's final intended history-free quota retry was not history-free.
- rc4.130 fixes zero-history recovery with explicit `[]`, retains active-draft atomicity, and removes redundant rankedPool `robustRankShadow` from persisted fixtures.
- All required rc4.130 CI gates including deterministic quota regression and candidate package/re-extract are PASS; main/gh-pages parity was verified before reseal.
- Exact next gate: **RC4.130_DEVICE_REFRESH_THEN_FULL_30_FIXTURE_V4V5_MOCK**.
- One controlled device refresh only; no cache/app-data clear or reinstall.
- The acceptance mock must be **fresh**, not continuation of the interrupted rc4.129 mock. At every own pick analyze both v4 and v5 before the user pick; exported backup must contain exactly 30 current-draft fixtures before model comparison.
- v4 PRIMARY / v5 CHALLENGER / v3 failsafe; no weight/source retune.


## 11. v195 CURRENT OVERRIDE — backup 16-02-06-862Z
- This section supersedes older rc4.129/30-fixture continuation pointers above.
- Runtime remains **rc4.130**; no phone update is required for the audit tool.
- Latest canonical backup is **draft-companion-v7-backup-2026-08-30T16-02-06-862Z.json**.
- Exact evidence: **29 fixtures across all 15 own picks; 14 exact v4/v5 pairs; missing pick29 expertv5**. Never call this 30/30 PASS.
- Persistent audit tool **tools/audit-v45-backup.mjs** must be used on future JSON exports before model conclusions.
- Data-quality canaries are now explicit: Terry McLaurin = 4/6 coverage in both v4/v5, missing Boone + Koerner; D'Andre Swift pick52 = Top-1 both profiles with generic-only rationale.
- Partial 14-pair evidence does not justify a last-minute model retune. **v4 remains PRIMARY, v5 CHALLENGER, v3 failsafe**.


## v205 CURRENT OVERRIDE — deep handoff anti-regression
- Supersedes older rc4.129/130/131 continuation pointers above where they conflict.
- First gate is **RC4.132_BUILD_AND_REGRESSION**.
- rc4.132 scope is mandatory: live-autodraft Return-v2 + Pick32 Nabers/Javonte + exact 2026 manager-order regression + active-manager history repair.
- Exact order: Michael / Pascal Voerde / Marc Düsseldorf / Thomas / Björn / Pascal Gelderner / Giuliano / Bastian / Muerotechnik / Dutch Marc.
- Historical hard locks: Michael includes 2025; Pascal Voerde combines Bracht Eagles 2017-2022 with Voerde Eagles 2023-2025; Pascal Gelderner remains separate; Björn 2021 theme + 2023 autodraft excluded.
- After rc4.132 device acceptance, execute final draft-day freshness agenda. The separate real-draft chat uses `PITTI_DRAFT_CHAT_BOOTSTRAP.md` and is execution-only.


## v207 CURRENT OVERRIDE — QB-rule correction
- Generation: `20260830T1822Z-v207`.
- Draft-day authority: Geno Smith and Aaron Rodgers are explicit user hard exclusions. Any older checkpoint saying otherwise is superseded.
- Correct rule: both are explicit user hard exclusions and must not appear on the user's recommendation/draft surface. This user-specific exclusion does not imply a generic league-wide QB2 rule.
- First gate remains **RC4.132_BUILD_AND_REGRESSION**; exact order/history locks remain unchanged.


## 12. v212 CURRENT OVERRIDE — rc4.142 TIER PAYLOAD ROOT CAUSE
- Generation: `20260831T0735Z-v212`. This section supersedes all older current-version/first-gate/device-authority pointers above where they conflict.
- Android already runs **v11.8.0-rc4.142**.
- Startup, refresh, Analyze and 125/125 individual descriptions work; Tyler Warren text is restored.
- External Expert-v4 tier labels are **absent / FAIL**.
- rc4.142's `total_experts` verifier correction was insufficient. Do not treat it as the root cause.
- First gate: **RC4.142_TIER_PAYLOAD_ROOT_CAUSE**.
- Before any new build, capture/reproduce actual FantasyPros `consensus-rankings` payloads for QB/RB/WR/TE through the existing proxy with exact selectable active-v4 expert IDs; verify request parameters, expert provenance, player container, position fields and explicit tier key/value.
- No speculative rc4.143. No cache/app-data clear, reinstall or repeated-refresh loop.
- After reproduced root cause only: one bounded fix + real-shape deterministic regression fixture + full gates/parity + exactly one device verification.
- Preserve 125/125 text coverage, Warren/Jacobs handling, exact manager order/history, decision evidence/fingerprints, Coach/Return-v2, no K/DST, exactly one QB, and Geno Smith/Aaron Rodgers hard exclusions.
- After tier acceptance: deferred 5-WR analysis, then final draft-day freshness/ADP/expert-board/late-RB/smoke freeze.


## 13. v214 CURRENT OVERRIDE — rc4.153 DEVICE ACCEPTANCE THEN FREEZE
- Generation: `20260831T1028Z-v214`. This section supersedes every older current-version / first-gate / device-authority pointer above.
- Accepted Android/PWA authority = **v11.8.0-rc4.152**.
- Source + deployed runtime candidate = **v11.8.0-rc4.153**.
- rc4.153 PR #83 passed Release Contract, Candidate Package Gate and Project Guardrails; merged to main; **13/13 runtime files are main↔gh-pages parity**.
- rc4.153 is presentation-only: stable expert display order across positions. Common v4 experts first: **Sean Koerner → Dalton Del Don → Pat Fitzmaurice**, then broadly shared experts, then specialists. Missing ranks remain `#– / fehlt`.
- Exact next gate = **RC4.153_DEVICE_ACCEPTANCE_THEN_DRAFT_FREEZE**.
- One controlled device update only. If display order PASS, immediately freeze runtime for the real draft.
- Do not reopen public FantasyPros tier-field experiments, generic Return-v2 tuning, panel/source/weight changes, manager history, draft order, scoring or other old defect lanes without new release-critical evidence.
- LIVE nine-manager AUTO/MANUELL/? grid, direct Coach apply, LIVE v3/v4/v5 selector and rc4.151 speed/evidence behavior are protected.
- Latest adopted evidence backup remains `draft-companion-v7-backup-2026-08-31T09-21-02-891Z.json`.
- Exact manager order/history, no K/DST, exactly one QB, Geno Smith/Aaron Rodgers hard exclusions, starter maxima not roster caps remain immutable.
