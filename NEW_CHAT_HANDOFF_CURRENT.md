# PITTI NEW CHAT HANDOFF — CURRENT
Handoff generation: `20260828T085400Z-v129`
Updated: 2026-08-28 08:54Z

## BOOTSTRAP — mandatory
1. Read `PITTI_COMMAND_CONTRACTS.json` fully.
2. Read `PITTI_CURRENT_STATE.json` fully.
3. Read `PITTI_HANDOFF_SEAL.json` fully and require PASS, `handoff_ready=true`, `second_pass_pass=true`.
4. Require CURRENT generation == SEAL generation == this handoff generation and verify every seal-listed repo blob hash.
5. Read `PITTI_AUTO_PREFLIGHT.md` fully.
6. Read `PITTI_EXECUTION_LOCK.json` fully.
7. Read `PITTI_PROJECT_STATE.md` to EOF. Newest appended sections override older NEXT_ACTION/current-version statements.
8. Read `PITTI_NEW_CHAT_BOOTSTRAP.md` and `HANDOFF_COMPLETENESS_MATRIX.md`.
9. Verify actual repo/runtime/artifact state before acting. Chat memory and stale Library mirrors are never authority.
10. Continue with `PITTI AUTO` as a repeated long-block loop: execute work -> checkpoint material changes -> re-inventory ALL independent lanes -> continue. A blocked lane blocks only itself.

## CURRENT AUTHORITY
- League: 10-team Half-PPR, 1QB, real draft 2026-08-31, user slot 9.
- User strategy: exactly one drafted QB; after QB1 all QBs disappear from user's Coach surface. Geno Smith and Aaron Rodgers are hard exclusions.
- K/DST normally not drafted. Starter maxima are NOT roster caps.
- rc4.87 = current Android authority; compact Expert-v3 export verified Weisse RB, Wolf TE and Todd QB; Joey Wright WR is unavailable.
- rc4.85 export attempt exposed a deterministic defect: `loadSingleExpert is not defined`.
- rc4.88 = current deployed Expert-v3 integration candidate. It adds a fourth selectable positional profile; Decision Kernel/Return-v2 remain unchanged.
- rc4.85 changes ONLY the integrated Expert-v3 challenger export. rc4.84 Decision Kernel, Return-v2 and Frozen Expert-v2 remain unchanged.
- Expert-v2 remains fully selectable/control. Brown stays excluded. Erickson remains qualitative/challenger only. Weisse may be freshly qualified; old availability-driven temporary-pool restoration remains forbidden.
- Upside-v3/player research remains a parallel lane only during genuine Expert-v3 wait time. Settled players are not repeatedly re-queried without genuinely new decision-changing news.

## WHY RC4.83 EXISTS
User showed late-round Coach recommendations that remained WR-heavy despite already having 7 WR. A later completed roster cannot be treated as Coach success because the user manually overrode many recommendations.
Audit found two structural issues:
1. late WR6+/WR7+ marginal utility was too weak;
2. PlayerQualitySafety could resurrect a WR after saturation scoring.
rc4.83 is a bounded soft-saturation challenger, explicitly NOT a hard WR cap. Initial stronger coefficients were rejected as too cap-like and reduced before deployment.

## EVIDENCE / VALIDATION
- Decision fixtures now persist Coach top recommendation and actual chosen player.
- Evidence-v2 export includes per-pick rosterCounts, frozen candidates, chosen player, followedCoach/override, score and panel deltas, WR6+/WR7+ saturation flags and QB2 violation flags.
- Pre-mock audit fixed a telemetry defect: frozen userRoster now stores position directly; exporter no longer infers already-drafted positions from rankedAvailable.
- Evidence-v2 schema is regression-guarded.
- Dedicated UI: Erweitert -> Sicherung -> Pick-Evidenz exportieren.
- Required OOS flow: reload rc4.83 -> ordinary realistic mock with natural user decisions/overrides -> refresh once after completion -> export PITTI-Decision-Evidence JSON -> analyze pick by pick.
- Do NOT ask user to manually document picks during the mock.

## CURRENT EXTERNAL GATE
`ANDROID_RC4.88_EXPERT_V3_PROFILE_VERIFY`

The preferred update route is the already deployed Companion/PWA path. **Do not ask for or regenerate the expired ChatGPT PREINSTALL link as the default solution.** First reload/update the installed app and verify badge `v11.8.0-rc4.85`. If it remains rc4.84, diagnose the service-worker/cache/update path before inventing another install route.

After rc4.85 is Android-verified: press `Expert-v3 Challenger exportieren` once and share the credential-free JSON. No mock is needed. Then AUTO: exact vector validation -> v2/v3 marginal grids -> DS35/30/25 redistribution test -> composition/weights -> separate selectable Expert-v3 preset -> regression/package/device gates. No broad expert re-screening.

## QB EVIDENCE — KEEP QUALITATIVE, AVOID DOUBLE COUNTING
- Pat Fitzmaurice direct answer supports a late/fallback path centered on Kyler Murray / Jared Goff / Malik Willis; user considers Goff floor + observe Willis in FA a plausible late strategy.
- Andrew Erickson direct answer to user's 10-team 1QB Half-PPR question: Caleb Williams, Trevor Lawrence, Justin Herbert are his preferred mid/late targets. These also match user's earlier preferred QB options.
- Independent cross-check recorded in Project State: Herbert/Caleb/Lawrence cluster as primary mid-round upside QB1 tier; Goff/Murray/Willis are later price-dependent fallback/challenger paths.
- Do not count direct answers as extra numeric expert votes on top of frozen expert rankings.
- Willis is FA/watchlist-only after any QB1 because user will not draft QB2.

## PARALLEL LANES ALREADY AUDITED
- Draft-day Emergency Queue/failsafe.
- Expert freshness/stale fallback semantics.
- Post-draft/FA workspace and contingent-RB protection.
- Watcher integration fail-closed.
- Release/regression/evidence tooling.
Do not claim PITTI AUTO is globally blocked merely because OOS mock evidence is pending. Re-inventory independent positive-value lanes before stopping.

## AUTO CONTRACT — CRITICAL
User has repeatedly required this and should NEVER need to repeat it:
- AUTO means the longest safe autonomous blocks with minimal interruptions; the user must never need to repeat this.
- AUTO is a repeated loop: execute package -> checkpoint -> re-inventory -> execute next package -> repeat.
- Re-inventory after EVERY completed work package, not only once per AUTO invocation.
- Do not reply with a promise to continue and then stop; `AUTO läuft`, `ich mache weiter`, priority-only and status-only responses are invalid while executable work remains.
- A blocked OOS/device/CI lane blocks only itself; independent positive-value lanes continue.
- Before any stop inventory decision/evidence, regressions/release, draft-day failsafe, expert freshness, post-draft/FA, Watcher, handoff/checkpoint integrity and independent strategy/current evidence.
- An external/device/OOS gate is a valid stop only after independent non-contaminating lanes are actually exhausted.
- Interrupt only for an unavoidable device/user action, unavailable required information, unsafe contradiction, irreversible action, or meaningful runtime-verification gate after parallel exhaustion.
- Material changes must be written through immediately to Project State / Execution Lock / handoff.

## ANTI-REGRESSION CANARIES
Never resurrect without new evidence:
- PairSum/Rolling old logic;
- fixed roster quotas/caps;
- generic/global QB2 ban (the hard ban is user-strategy-specific);
- generic TE2 ban;
- player-name forcing;
- generic Return-v2 retune;
- stale cross-draft duplicate logic;
- Superflex/2QB evidence;
- Brown in new Expert-v2;
- live renormalization of Frozen Expert-v2 weights.

## KNOWN CHECKPOINT CAVEAT
Library mirror is stale/writeback-blocked. Repo `PITTI_EXECUTION_LOCK.json` + repo Project-State EOF win on contradiction.

## V105 TRANSFER CANARY
- A v105 Library reseal was prepared locally and passed an independent semantic/hash second pass, but persistent Library upload-back failed again with `container_session_expired`. Therefore **do not claim Library v105 is persisted** until a later `files.list` proves it.
- If Library still surfaces v102/v103 or rc4.76/77 current pointers, treat them as stale. Repo `PITTI_COMMAND_CONTRACTS.json` + `PITTI_EXECUTION_LOCK.json` + repo Project-State EOF + this handoff + repo bootstrap/matrix + verified device facts win and the contradiction fails closed.
- Current factual boundary: rc4.64 production/control; rc4.82 last fully Android-verified authority; rc4.83 deployed TEST challenger OOS-pending/not promoted/not Android-verified; rc4.78 latest package+reextract boundary; Library rc4.52 aliases recovery-only.


## V106 HANDOFF RESUMPTION CANARY
- User clarified on 2026-08-27 17:43 CEST that the immediately preceding `AUTO` meant: **resume the PITTI HANDOFF transaction at the correct point**, not resume ordinary project-development AUTO.
- Therefore this generation is a handoff transaction. Do not perform new Decision-Kernel tuning while sealing it.
- Latest material addition since v105: independent QB1 cross-check is recorded in Project State; it remains qualitative and does not alter the frozen rc4.83 OOS experiment.
- Runtime parity reverified during this handoff: main == gh-pages byte/blob parity for app.js, index.html, decision-policy.js, sw.js and manifest.webmanifest.
- Current external continuation after takeover remains `ANDROID_RC4.83_REALISTIC_MOCK_THEN_EVIDENCE_V2_EXPORT`; AUTO itself must not start the mock.
- Receiving chat must distinguish `PITTI HANDOFF` (transactional transfer preparation) from `PITTI AUTO` (verified takeover/continuation). If the user says AUTO while a HANDOFF transaction is in progress, finish the handoff transaction first.

## V106 SEAL STATUS
- Transactional second pass: **PASS**.
- `handoff_ready=true`; `second_pass_pass=true`.
- New-chat user message: **PITTI AUTO** only.


## V107 TRANSFER-AUDIT REPAIR — SUPERSEDES V106 TAKEOVER PROCEDURE
A receiving-chat audit found transfer-hardening defects even though the v106 hash seal itself was internally consistent:
- command-contract/bootstrap/handoff primary load orders did not all require `PITTI_CURRENT_STATE.json` + `PITTI_HANDOFF_SEAL.json` before project work;
- the completeness matrix still identified itself as repo v105;
- preflight retained a stale generic sentence implying current Expert-v2 weights still needed to be invented/reselected;
- CI path triggering did not cover every file read by the guardrail checker.

These are transfer/guard defects, not Decision-Kernel changes. v107 repairs them and adds executable generation + seal-integrity verification. Runtime boundary and OOS gate remain unchanged: rc4.82 Android authority; rc4.83 deployed test challenger, frozen pending realistic Evidence-v2.

## V107 SEAL STATUS
- Transactional second pass: **PASS**.
- `handoff_ready=true`; `second_pass_pass=true`.
- New-chat user message: **PITTI AUTO** only.


## V108 AUTO CONTINUATION CANARY
- Post-v107 AUTO found and repaired a stale release path: release contracts now execute rc4.83 draft-critical gates, and candidate packaging derives its version from APP_VERSION instead of hard-coding rc4.82.
- Evidence-v2 offline analysis now fails closed on exact rc4.83, complete 15-pick mock telemetry and unique own-pick fixtures.
- No rc4.83 Decision-Kernel coefficient changed. OOS gate remains unchanged.
- Fresh independent QB/RB research is checkpointed as qualitative dated evidence only.


## V109 AUTHORITY-CLEANUP CANARY
- v108 read-back closed 20/20 exact.
- Subsequent independent audit found active Execution Lock recovery prose still named repo v107 explicitly. That stale scalar could have become an old-state resurrection path despite a newer valid seal.
- Active recovery semantics are now generation-generic: newest fully sealed repo generation + verified device facts win over stale Library.
- Release-tooling guards remain: rc4.83 mandatory release gate, dynamic APP_VERSION package naming, Evidence-v2 exact rc4.83/15 unique own picks.
- Decision Kernel remains unchanged/frozen; external OOS gate unchanged.


## V110 OOS-CONFOUND / GUARD-CONSISTENCY CANARY
- Guard now matches generation-generic Library fail-closed semantics; no stale v105 literal is required for PASS.
- Known rc4.83 OOS confound: Jeanty acute hard blocker dated 24.08.; Week 1 still uncertain on 27.08. Do not use a Jeanty-affected early decision to judge the late-WR saturation challenger.
- Do not mutate the frozen rc4.83 experiment to “fix” that confound before Evidence-v2; revisit the blocker in the mandatory pre-real-draft freshness pass.
- Runtime/OOS gate otherwise unchanged.


## V111 OOS-IDENTITY CANARY
- Promotion Evidence-v2 must be realistic mock mode + slot 9.
- Jeanty-affected rows are ACUTE_STATUS_CONFOUND and are not causal evidence for the late-WR saturation challenger.
- Same-day injury evidence still leaves Week 1 uncertain; do not silently clear the frozen rc4.83 overlay before OOS.
- No runtime/kernel/expert-weight change.


## V112 GENERATION-GENERIC GUARD CANARY
- The executable handoff guard no longer requires the historical phrase tied to Library v105; it requires the current generic stale/writeback-blocked Library invariant instead.
- This prevents future cleanup of historical prose from falsely breaking a valid takeover.
- rc4.83 remains frozen; slot-9 realistic Evidence-v2 remains the experiment gate; Jeanty-affected rows remain a separate acute-status confound.
- No runtime/kernel/expert-weight/Return-v2 change.


## V113 PRE-DRAFT FRESHNESS CANARY
- New non-runtime gate: `tools/pre-draft-freshness-gate.mjs`.
- Before the real draft/live promotion, blocking acute-status entries must be refreshed within the configured age window; default 2 days. The currently frozen Jeanty overlay dated 24.08. will intentionally fail an Aug-31 gate unless reviewed/updated.
- This safeguard is outside rc4.83 runtime and does not contaminate the OOS experiment.
- External OOS gate remains realistic rc4.83 slot-9 mock -> refresh -> Evidence-v2 export.


## V114 EMERGENCY-FALLBACK CANARY
- Emergency Queue has an independent deterministic executable contract: max 35; one QB/TE candidate only while QB1/TE1 open; none after filled; K/DST omitted; draft/version metadata retained.
- Contract is protected by rc4.83 regression + PITTI guard and does not alter runtime/kernel.


## V115 CLEAN OOS CONFOUND CANARY
- Evidence-v2 analysis reports acute-status-confounded and clean non-confounded metrics separately; frozen rc4.83 runtime remains unchanged.


## V116 CRITICAL MANAGER-MAP CORRECTION
- Return-v2 audit found rc4.83 forced stale 2026 manager slots: 5 Björn / 6 Pascal / 8 Basti. Confirmed order is 5 Basti / 6 Björn / 7 Michael K (profile alias Giuliano) / 8 Pascal B (profile alias Pascal Gelderner).
- rc4.84 corrects only this mapping plus version/cache identity; late-WR challenger coefficients and Decision Kernel are unchanged.
- rc4.83 realistic OOS gate is invalid/superseded because manager geometry was wrong. Gate is now rc4.84 device verify -> realistic slot-9 mock -> Evidence-v2.
- main rc4.84 runtime deployed byte-identically to gh-pages; rc4.82 remains last Android-verified authority pending device verification.


## UPSIDE RESEARCH v3 — NON-RUNTIME PENDING
- `PITTI_UPSIDE_RESEARCH_V3.md` is the new ceiling/opportunity research ledger.
- Jameson Williams is explicitly CONSOLIDATION (already broke out) rather than generic BREAKOUT; Parker/Egbuka/Tate carry stronger WR1-takeover/ascension paths.
- RB upside uses opportunity elasticity/events-needed; TE uses target-hierarchy/route-volume ceiling.
- Do not load this ledger into the active rc4.84 mock. Integration waits for current Evidence-v2 export.


## V117 EXPERT-v3 ACQUISITION CANARY
- rc4.84 mock/Evidence-v2 work is complete enough for the current Expert-v3 lane; manager-slot correction is retained.
- rc4.85 adds only a local authenticated challenger export for Ryan Weisse, Wolf of Roto Street, Todd D Clark and Joey Wright. No challenger is yet a numeric Expert-v3 vote.
- Weisse/Gianni/Bobal old lock means no unqualified availability-driven auto-restore; it does not prohibit fresh Weisse qualification.
- Expert-v3 is primary. Player research is parallel only during genuine wait time and settled players are not repeatedly re-queried without new decision-changing news.
- Next user action is prohibited until package/re-extract gates pass.


## V118 RC4.85 PACKAGE/DEPLOY PASS
- Release Contract + candidate package/re-extract PASS for rc4.85.
- PREINSTALL SHA-256 `53a26943b6e86da751c7c98c9d3b8b58f3b476c794b4f69bda7265eb47b6dfed`; 12 runtime files; every re-extracted Git blob matches current main.
- main/gh-pages parity for all 12 runtime files PASS.
- rc4.85 changes only Expert-v3 challenger acquisition/export UI/path; no Expert-v3 numeric vote or weight exists yet.
- Next and only necessary user action: reload/update rc4.85, press the new export button, share JSON.


## V119 CRITICAL HANDOFF CANARY — 2026-08-28
- This handoff occurs at a critical update boundary: the installed Android app is still rc4.84 while rc4.85 is already release/package/re-extract verified and deployed.
- Previous assistant error: it gave an expiring ChatGPT PREINSTALL file link even though the project had already been using the deployed/self-update path. That expired-link path is now explicitly non-preferred and must not be repeated without evidence that normal updating cannot work.
- Another repeated assistant failure was replying to AUTO with “AUTO läuft/ich mache weiter” even though execution stops after the message. In the receiving chat, AUTO means EXECUTE the largest safe batch first and reply only at a meaningful result/unavoidable gate. Never send future-tense continuation prose as an AUTO result.
- Expert-v3 is PRIMARY until finished. Current acquisition targets: Ryan Weisse (RB primary), Wolf of Roto Street (TE primary), Todd D Clark (QB primary), Joey Wright (WR only if exact current complete vector resolves). Do not restart candidate screening.
- First controlled weight grids after exact vectors: RB v2 DS35 vs DS30+Weisse5 vs DS25+Weisse10; TE v2 DS35 vs DS30+Wolf5 vs DS25+Wolf10; QB v2 DS35 vs DS30+Todd5 vs DS25+Todd10. Expand only if evidence warrants. WR gets no forced new expert.
- Evaluate marginal/OOS positional loss, decision-zone stability, correlation/leverage, and ceiling-tail behavior. Availability is never a positive selection criterion. Draft Sharks Team output must be validated as its own model; individual DS analyst accuracy is not direct validation because DS rankings are projections + 3D Value, not averaged analyst boards.
- Upside-v3 semantics preserved: ↑↑ strong high-end outcome + short causal path; ↑ meaningful/moderate ceiling; ↓↓ material health/role/availability deterioration; ↓ moderate downside; mixed arrows allowed. Mechanism must be named. Jameson Williams = established-breakout consolidation, not generic breakout. Parker Washington = WR1-path, subject to fresh news override.
- Anti-repeat research lock: Likely/Jacobs/Pacheco and any other recently settled player are not rechecked/reported again unless genuinely new decision-changing news exists. New research must move to uncovered players and be done in large batches.
- rc4.85 package/re-extract SHA-256 authority: `53a26943b6e86da751c7c98c9d3b8b58f3b476c794b4f69bda7265eb47b6dfed`. A later GitHub artifact digest is an Actions artifact container digest and must not silently replace the canonical preinstall SHA without an explicit artifact-boundary decision.
- User action in the receiving chat is only necessary after handoff verification: verify/update Android to rc4.85 through normal deployed update path; then export Expert-v3 JSON. Do not start a mock.


## V120 SECOND-PASS REPAIR
- v119 seal correctly exposed one stale guardrail assumption: the bootstrap checker still required historical literals rc4.82 and rc4.83 even after the bootstrap was intentionally synchronized to rc4.84/rc4.85. The guard is now successor-safe and checks semantic boundary labels instead of obsolete version literals.
- This is a transfer/regression-tool repair only; no runtime, Decision Kernel, Return-v2, Expert-v2 or Expert-v3 candidate data changed.


## V121 RC4.86 EXPERT-v3 EXPORT HOTFIX
- User's rc4.85 export proved the acquisition UI path executed, but Ryan Weisse/Wolf/Todd failed with `loadSingleExpert is not defined`; Joey Wright remained directory-missing.
- Root cause: rc4.85 integration called a helper that never existed in the production app even though the verified general loader `loadExpertRanks(expertId)` already existed. This was a deterministic integration defect and should have been caught before device use.
- rc4.86 replaces only that call/serialization path, adds an explicit regression canary forbidding `loadSingleExpert(`, and reuses the existing verified per-expert ranking cache/pipeline.
- main/gh-pages parity has been restored for all 12 runtime files. rc4.84 remains latest Android authority until device reload proves rc4.86.
- Exact next action: reload/update to rc4.86, verify badge, run Expert-v3 Challenger export once. No mock.
- Research breadth lock remains: move to uncovered players; settled players reopen only on genuinely decision-changing news.


## V122 RC4.86 RELEASE CLOSURE
- Full release contract PASS, package/re-extract PASS, and independent artifact inspection confirms 12 runtime files.
- Canonical rc4.86 PREINSTALL SHA-256: `49cbcdc8ee7eb5833249aa2482611de07d8327450aa41c2542ba3d00137593d1`.
- main/gh-pages parity remains 12/12. rc4.84 remains latest Android-observed authority until reload/update proves rc4.86.
- Next action remains one device step only: update/reload -> verify v11.8.0-rc4.86 -> run Expert-v3 Challenger export once -> return JSON. No mock.


## V123 RC4.87 COMPACT EXPERT-v3 TRANSFER
- rc4.86 is confirmed installed by user and produced a materially larger Expert-v3 result; however Android/ChatGPT could not reliably transfer it: file export did not work and pasting the huge JSON made ChatGPT slow/crash and exceeded message size.
- Therefore do NOT ask user to manually trim/copy sections.
- rc4.87 is a transfer-only hotfix: Weisse exports RB only, Wolf TE only, Todd QB only, Wright WR only; rows are compact [name, overallRank] tuples. It copies the compact JSON straight to clipboard and falls back to file export only if clipboard fails.
- No Decision Kernel, Return-v2, manager model, roster policy, Expert-v2 weights or expert qualification logic changed.
- Exact next action: update/reload to rc4.87 -> tap “Expert-v3 kompakt kopieren” once -> paste clipboard into chat. No mock.


## V125 EXPERT-v3 WEIGHTING / rc4.88
- rc4.87 compact vector transfer succeeded.
- Final bounded Expert-v3 candidate:
  - QB: DS25 / Mariano25 / Del Don20 / Boone10 / Pat10 / Todd D Clark10.
  - RB: DS25 / Mariano25 / Del Don25 / Pat15 / Ryan Weisse10.
  - WR: unchanged Expert-v2 WR board; Joey Wright current vector missing, no proxy/fabrication.
  - TE: DS25 / Pat30 / Del Don25 / Boone10 / Wolf of Roto Street10.
- Track-record basis: Ryan Weisse 2025 RB #8 and 2023-25 RB #2; Todd D Clark 2025 QB #8 and 2023-25 QB #5; Wolf 2023-25 TE #2, with 2025 TE #42 as the reason not to exceed 10%.
- 10-point sensitivity remains bounded: v3-v2 Spearman ~0.9991 QB, ~0.9972 RB, ~0.9972 TE.
- rc4.88 adds expert-v3-board.js and keeps incumbent/control, Expert-v2 ALL and Expert-v2 WR-only selectable.
- Exact next device gate: reload/update to rc4.88 -> choose “Expert-v3 · positionsspezifisch” -> verify green panel health. No mock required for this verification.
- Research breadth lock remains active: cover new/unsettled players; do not recycle settled names without new decision-changing evidence.


## V126 EXPERT-v3 INTEGRATION GATE
- rc4.88 deployed with selectable Expert-v3 positional profile: Todd D Clark QB 10%, Ryan Weisse RB 10%, Wolf of Roto Street TE 10%; WR deliberately remains Expert-v2 because Joey Wright vector is missing.
- Legacy rc4.82/83 profile guards were found structurally over-strict (exact object shape) and repaired additively; no old behavior was removed.
- v126 current/seal synchronized. Full gates must pass before Android verification.


## V127 RC4.88 EXPERT-v3 FULL CLOSURE
- Final sealed rc4.88 commit b1f70fe7: all five primary gates PASS (Project Guardrails, release contract v2, package/re-extract, rc4.82, rc4.83).
- Expert-v3 is separate/selectable: Todd QB 10%, Weisse RB 10%, Wolf TE 10%; WR stays Expert-v2 because qualified fresh Wright vector is missing.
- AUTO diagnosed/repaired successor-hostile legacy assertions and a real missing index loader before closure; do not revert these repairs.
- gh-pages synchronized after closure. Exact next action: Android/PWA update to rc4.88 -> verify badge + Expert-v3 selectable. Then broad non-repetitive upside research. No mock.


## V128 RC4.88 ANDROID VERIFIED
- User screenshot verifies badge v11.8.0-rc4.88 on Android/PWA and Expert-v3 · positionsspezifisch selected in the UI.
- Runtime authority advances to rc4.88. No further install gate remains for this change.
- Continue AUTO with broad anti-repeat upside/differentiator research and Expert-v3 effect validation; do not start a mock unless explicitly requested.


## V129 RC4.89 LIVE-PRESENTATION REPAIR
- User screenshot exposed two genuine rc4.88 presentation regressions:
  1. Live surface profile detector knew only incumbent/v2 maps, so selected Expert-v3 rendered as CUSTOM and reused old incumbent expert-name ordering.
  2. First four players were full decision cards, then all ten were duplicated again in a weaker compact 10er list.
- rc4.89 fixes presentation only:
  - recognizes exact Expert-v3 map QB v3 / RB v3 / WR v2 / TE v3;
  - displays actual selected v3 experts (Todd QB, Weisse RB, Wolf TE; WR remains frozen v2);
  - renders candidates 1-10 exactly once, all with the same full card structure;
  - NORMAL-CUT warning is orange at bottom of each affected card;
  - no duplicated hierarchy/10ER compact block.
- Weak early-round generic Pro/Contra was not merely a late-draft coverage problem. Added explicit current display/risk evidence for James Cook, CeeDee Lamb, Justin Jefferson and Brock Bowers; broader anti-repeat research continues separately.
- Decision Kernel, Return-v2, roster policy, Expert-v2 board and Expert-v3 weights are unchanged.
- Exact gate: full rc4.89 release/package/guardrails -> gh-pages parity -> Android visual verification. No mock.


## V130 RC4.89 FULL RELEASE CLOSURE
- rc4.89 final sealed CI set PASS: Project Guardrails, Release Contract v2, Candidate Package/Re-extract, rc4.82 gate and rc4.83 gate.
- Independent artifact inspection: `Draft_Companion_v11.8.0-rc4.89_PREINSTALL.zip`, exactly 13 runtime files, SHA-256 `2b4ea3de5523efbdeba24a6224504ec90ec825a06a6856b08482574f1d776608`; candidate.sha256 matches.
- main/gh-pages runtime parity verified 13/13.
- Android authority remains rc4.88 until device update/reload proves rc4.89.
- Exact next action: update/reload to rc4.89 and visually verify Expert-v3 voices, uniform full Top-10 cards, orange per-card Normal-Cut warning, richer Pro/Contra. No mock.


## V129 LIVE SURFACE CORRECTION
- Expert-v3 live expert labels fixed by position; no fallback to old INC experts.
- Ten candidates now use ten full cards; duplicate 10ER overview removed; normal-cut warning at card bottom in orange.
- Generic pro/contra fallback phrases removed in favor of evidence/context-linked fallbacks.
- Final five-workflow set PASS after root-cause repairs. Deployed to gh-pages; Android reload/visual verification is next gate, then broad anti-repeat research.
