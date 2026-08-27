# PITTI NEW CHAT HANDOFF — CURRENT
Handoff generation: `20260827T165000Z-v110`
Updated: 2026-08-27 16:50Z

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
- User strategy: exactly one drafted QB. After QB1, all QBs disappear from user's Coach surface. Geno Smith and Aaron Rodgers are hard exclusions.
- K/DST normally not drafted. Starter maxima are NOT roster caps.
- rc4.82 = last fully Android-verified authority.
- rc4.83 = deployed TEST challenger, not promoted and not Android-verified.
- rc4.83 Decision Kernel is FROZEN pending OOS evidence. Do not retune coefficients from the user's overrides or final roster.
- Expert-v2 Frozen Board weights/provenance remain authority. Brown excluded from new v2; Erickson is qualitative/challenger evidence, not an extra numeric vote.

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
`ANDROID_RC4.83_REALISTIC_MOCK_THEN_EVIDENCE_V2_EXPORT`
Once evidence arrives, run long AUTO block:
1. validate evidence completeness/schema;
2. analyze every own pick Coach vs actual choice and roster state;
3. diagnose WR saturation, RB forcing, Safety promotion, opportunity cost/Return, QB/TE behavior;
4. compare against rc4.82-known behavior without using user picks as training labels;
5. decide PROMOTE / MODIFY / REJECT rc4.83;
6. only then alter Decision Kernel if evidence supports it;
7. run regression/package/re-extract/device gates as appropriate.

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
