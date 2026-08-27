# PITTI NEW CHAT HANDOFF — CURRENT
Updated: 2026-08-27 15:00Z

## BOOTSTRAP — mandatory
1. Read `PITTI_AUTO_PREFLIGHT.md` fully.
2. Read `PITTI_EXECUTION_LOCK.json` fully.
3. Read `PITTI_PROJECT_STATE.md` to EOF. Newest appended sections override older NEXT_ACTION/current-version statements.
4. Verify actual repo/runtime/artifact state before acting. Chat memory and stale Library mirrors are never authority.
5. Continue with `PITTI AUTO` as a repeated long-block loop: execute work -> checkpoint material changes -> re-inventory ALL independent lanes -> continue. A blocked lane blocks only itself.

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
- Library v102/v103 transfer state is superseded by the 2026-08-27 v105 reseal. New chat must verify Library generation and actual repo state; if an older Library copy is surfaced, repo Execution Lock + Project-State EOF and verified device evidence win and the Library transfer must be repaired fail-closed.
- Current factual boundary: rc4.64 production/control; rc4.82 last fully Android-verified authority; rc4.83 deployed TEST challenger OOS-pending/not promoted/not Android-verified; rc4.78 latest package+reextract boundary; Library rc4.52 aliases recovery-only.
