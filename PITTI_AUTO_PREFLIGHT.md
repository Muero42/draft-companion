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


## 4A. AUTO STATE MACHINE / NO-OUTPUT GUARD
- Persistent queue authority: `PITTI_CURRENT_STATE.json:auto_execution_state`.
- Queue buckets are `active`, `ready`, `waiting_external`, `blocked_user`, `completed_recent`.
- After EVERY package or failure: checkpoint material facts, move that lane to its correct bucket, then immediately dispatch the highest-priority safe `ready` lane.
- `waiting_external` (CI, deploy, remote build, rate limit, scheduled availability) is never a global stop signal. It blocks only dependent work.
- `blocked_user` also blocks only its dependent lane. Continue every independent `ready` lane first.
- **NO-OUTPUT GUARD:** before any visible AUTO response, re-inventory. If `active.length > 0` or `ready.length > 0`, DO NOT RESPOND; continue work in the same turn.
- A visible AUTO response requires `active=[]`, `ready=[]`, and machine-readable `stop_evaluation.allowed=true`.
- Allowed stop codes only: `USER_ACTION_REQUIRED`, `DECISION_REQUIRED`, `PROJECT_MILESTONE_REACHED`, `NO_EXECUTABLE_WORK_REMAINS`, `SAFETY_OR_IRREVERSIBLE_CONFIRMATION`.
- Forbidden stop signals: CI/deploy running, commit created, tool call finished, work package finished, “no user action needed”, or existence of parallel work.
- Never emit “AUTO läuft”, “ich mache weiter”, “CI läuft”, “Commit erstellt” or “keine Nutzerhandlung nötig” as an AUTO terminal response.
- If the queue is stale or missing after a chat switch, reconstruct it from PROJECT_STATE/CURRENT/repo evidence before ordinary work, and set `stop_evaluation.allowed=false` while any autonomous lane exists.

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
- Current handoff generation = **20260902T1325Z-v229**.
- Current mode = **POST_DRAFT_SEASON_COMPANION**.
- Source baseline = **rc4.185 merged**; current candidate = **PR #108 OPEN / UNMERGED** on `pitti/trade-slot-geometry`.
- Latest physical Android = **rc4.183 installed/observed, DEVICE_REJECTED** for Kader FA-card routing + IR ordinary-drop semantics. Accepted rollback = **rc4.169**.
- PR #108 preserves canonical Sleeper slots/FLEX (RB/WR/TE), legal two-TE paths, Trade Board v5 real slot geometry, ACTIVE-only ordinary drops, full 10-team Sleeper league state, manager/FAAB inputs, and Lawrence QB2 + future D/ST two-active-drop opportunity cost.
- The explicit invariant “Sleeper roster_id is a league roster identifier, NOT the historical draft slot.” must remain. Never restore draft-slot identity or static Trade Board positional depths.
- Newest PR #108 exact head must pass all strict gates before merge. Then rc4.186 promotion, post-merge/deploy parity, and exactly one physical canary.
- AUTO/AUTO BLOCK = continuous same-turn execution while safe positive-value work exists: no interim progress/status/acknowledgement, no empty response after tool work, no promise-only “AUTO läuft weiter”; checkpoint + re-inventory after every package; external wait blocks only its dependent lane.
- STATUS = report-only and must not trigger tools/polling/work.
- Live Sleeper direct league/users/rosters state = current roster/ownership/manager/slot/FAAB authority; Watcher evidence-only; completed draft immutable history.

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


## HISTORICAL v169 TAKEOVER CANARIES — NOT CURRENT AUTHORITY
- Historical record only: generation `20260829T1244Z-v178` belonged to that old takeover and MUST NOT override current generation 20260902T1130Z-v227.
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


## 14. v215 CURRENT OVERRIDE — rc4.158 ACCEPTED / PRE-WAIVER HANDOFF
- Generation: `20260831T1455Z-v215`. This section supersedes every older current-version / first-gate / device-authority pointer above.
- Accepted Android/PWA authority = **v11.8.0-rc4.158**.
- Source/deployment authority = **main/gh-pages v11.8.0-rc4.158**, exact **13/13 runtime parity PASS**.
- rc4.158 Project Guardrails, Release Contract, Candidate Package/Re-Extract = **PASS**.
- Device smoke = PASS; `Experten-Delta prüfen` visible; v4 expert day baseline = **9/9 COMPLETE**.
- Runtime state = **DRAFT_READY_FROZEN**. No code/model/source-weight changes absent a critical draft-blocking defect.
- Exact gate = **DRAFT_DAY_TIME_DEPENDENT_FINALIZATION**.
- Before 19:00 CEST: material-news-only; do not rerun completed static work.
- At/after 19:00: reconcile waiver claims/destinations and only affected player paths.
- Around 19:40–19:45: one `Experten-Delta prüfen`; no blanket expert refresh.
- Around 19:50: operational freeze; 20:00 real draft execution.
- Exact manager order = Michael / Pascal Voerde / Marc Düsseldorf / Thomas / Björn / Pascal Gelderner / Giuliano / Bastian / Muerotechnik / Dutch Marc.
- Correct five-WR cluster = DeVonta Smith / Zay Flowers / Emeka Egbuka / Tetairoa McMillan / Jaylen Waddle.
- Fresh real-draft chat is created only after a FINAL PRE-DRAFT HANDOFF around 19:45–19:50. That handoff must carry final expert delta + post-waiver deltas + final injury/legal/transaction status and execution locks.


## 15. v217 CURRENT OVERRIDE — POST-DRAFT SEASON COMPANION / rc4.161
- Generation: `20260901T1058Z-v217`. This section supersedes every older current-version, first-gate, generation, draft-day and device-test pointer above where they conflict.
- Canonical mode = **POST_DRAFT_SEASON_COMPANION**.
- Branch `season-companion-rc4.159` is historical naming only; current source/preview candidate = **v11.8.0-rc4.161**.
- Accepted Android authority remains **v11.8.0-rc4.158** until physical rc4.161 acceptance.
- Current Sleeper league state is the current roster/ownership Source of Truth; the real draft is immutable history.
- rc4.160 device already proved automatic transaction detection: Mevis rostered, Bigsby absent, Charbonnet Reserve/IR. Do not repeat rc4.160 testing.
- rc4.161 root fix decouples live FA ownership discovery from expert-ranking hydration. `tools/season-fa-ownership-regression.mjs` must remain in candidate-package CI.
- Exact current gate after takeover reconciliation = **DEVICE_RC4161_ACCEPTANCE**.
- Any older instruction saying v178/v205/v207/v212/v214/v215/v216 is the required current generation, DRAFT_READY_FROZEN is current, DRAFT_DAY_TIME_DEPENDENT_FINALIZATION is current, or Bigsby is currently rostered is historical and must not override v217.

### v217 AUTO hard gate
- `AUTO` and `AUTO BLOCK` must continue autonomously inside the same assistant turn while ANY safe positive-value lane is executable.
- After every work package: checkpoint material change → re-inventory all independent lanes → immediately execute the next package.
- A waiting CI/deploy/device lane blocks only that lane; it is never by itself a global stop.
- **No visible response** while `active` or `ready` contains executable work.
- Progress/status/acknowledgement messages are forbidden terminal responses: “AUTO läuft”, “ich mache weiter”, “CI läuft”, “Commit erstellt”, “keine Nutzerhandlung nötig”, or equivalents.
- An empty assistant response after tool work is also forbidden because it terminates execution.
- Visible output requires `active=[]`, `ready=[]`, and `stop_evaluation.allowed=true` with an approved stop code.
- The platform cannot continue tool work after a visible assistant turn ends; therefore a promise that AUTO “läuft weiter” after sending such a message is functionally false.

## v223 NO-TRIAL DEVICE PROMOTION OVERRIDE
- Current candidate = v11.8.0-rc4.176; rc4.175 is rejected for proven runtime truncation/workspace-router loss.
- Device promotion is forbidden while any automated candidate, package, deployment, workspace-navigation, startup/interactions, or strict reseal gate is not PASS.
- A device check is not a debugging instrument. After all server-side gates pass, exactly one final confirmation is permitted.
- Runtime truncation regression: app.js must remain >380k and preserve setWorkspace + all workspace tab wiring.


## v224 CURRENT OVERRIDE — RC4.176 OBSERVED, NOT ACCEPTED
Generation: `20260901T2210Z-v224`. Supersedes older current-version/device/gate/handoff pointers above where conflicting. Physical Android at 22:09 CEST visibly runs rc4.176, but captured Kader still has Live-State '-' and Live-Kader loading; this is observation only. Accepted rollback remains rc4.169. First new-chat gate: verify v224 against actual main/CI/deploy, then browser-equivalent Season E2E before any further device action. AUTO/AUTO BLOCK: no interim status/progress/ack, no empty response, no “AUTO läuft weiter”; re-inventory and continue while executable work exists. STATUS report-only.

## 4B. DEVICE EVIDENCE + EXTERNAL WAIT HARDENING — 2026-09-02

- A user-supplied physical device screenshot/version observation is a **checkpoint event**, not conversational context. Before any further code/CI/promotion work, update CURRENT + EXECUTION_LOCK + COMMAND_CONTRACTS with installed/observed version and PASS/FAIL evidence.
- If the same version is physically observed with a functional FAIL, it is **DEVICE_REJECTED**. Never describe it as merely a candidate awaiting acceptance.
- Never keep an AUTO response open through repeated manual CI/deploy polling. Perform at most one immediate status read after launching/triggering external work.
- If external work is still pending, checkpoint it in `waiting_external`, execute all independent lanes, then end the turn once if nothing else is executable. Do not claim background continuation.
- `STATUS` is strictly report-only. It must not be needed to cancel, unstick, or resume an AUTO turn.


## v229 CURRENT HANDOFF SUPERSESSION — 2026-09-02
- Generation `20260902T1325Z-v229` supersedes v227/v228 current pointers wherever they conflict.
- Any earlier CURRENT statement saying PR #102/rc4.184 is open, or generation v227 is current, is historical only.
- Current release lane = rc4.185 merged baseline + PR #108 OPEN/UNMERGED; next release after all-green merge = rc4.186.
- Lawrence lane and full-league-state architecture are current and must survive chat takeover.
