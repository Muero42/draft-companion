# PITTI PROJECT STATE — CANONICAL

Updated: 2026-08-26 16:45Z
Authority: compact repository execution state. Persistent full append-only history is `/Pitti/PITTI_PROJECT_STATE.md`. Actual verified artifacts/runtime override stale text; repair stale state immediately. Chat memory is never authority.

## EXECUTION INVARIANTS — MUST NOT REGRESS

1. AUTO is end-to-end autonomous execution. Continue while useful work exists; use independent parallel lanes while waiting. No status-only/intermediate response while useful autonomous work remains.
2. Before material work: verify canonical state, actual branch/build/artifacts, latest Android runtime, known rejected paths, prerequisites and simplest robust route.
3. Failed/rejected approaches may not be silently revived without new evidence that removes the failure cause.
4. Material decisions/failures/verification/next gates are written through promptly to checkpoint/lock.
5. Built/prepared/deployed/Android-verified are distinct states.
6. Near the 2026-08-31 draft, prefer small isolated reversible changes with deterministic regression protection.
7. New chat: read Library CURRENT/SEAL/full Project State plus this compact state and `PITTI_EXECUTION_LOCK.json`; any contradiction fails closed and must be repaired before project work.
8. AUTO never starts an interactive mock by itself.

Machine lock: `PITTI_EXECUTION_LOCK.json`. Executable guard: `tools/pitti_guardrail_check.mjs`. CI: `.github/workflows/pitti-project-guardrails.yml`.

## HARD PRODUCT / DRAFT INVARIANTS

- 10-team Half-PPR, 1QB, user slot 9, draft 2026-08-31, 120s/pick.
- Starter maxima are not roster caps: 4 WR / 3 RB / 2 TE can be simultaneously startable, but bench players remain legal.
- Normal strategy does not draft K/DST.
- QB2/TE2 are exceptional, not globally banned.
- Geno Smith and Aaron Rodgers are hard user-QB exclusions.
- Selected panel is player-quality baseline; ADP is market/timing, not truth.
- Return-v2/opponent geometry and opportunity cost remain active.
- Excess WR depth must reduce marginal WR utility, while exceptional value slides remain legal. No hard WR cap.
- Never revive PairSum-v2/Rolling-v1, Chase-Brown/player-name forcing, fixed quotas/caps, generic Return-v2 retune or global QB2/TE2 ban without new evidence.
- Reject Superflex/2QB contamination fail-closed.

## CURRENT RUNTIME BOUNDARY

- Android verified/current control: **v11.8.0-rc4.64**.
- Decision-kernel pin: `9ba6db89fc1e7550052a7526bd0c68d6cc7459dc`.
- Current main after transfer-lock hardening carries only guard/state changes beyond the decision kernel; Draft Companion runtime remains rc4.64 control.
- Library `Draft_Companion_TEST.zip`, `Draft_Companion_LATEST.zip`, numbered rc4.52 are recovery/audit aliases only (SHA `38e46c942e2b95c862587fdab1bd5bf71b2da524e5efc1ef0107acaad2c7bf32`, 8 files). Do not infer Android truth from Library aliases.
- gh-pages remains a distinct rc4.63 runtime plus isolated audit tooling; do not equate it with current Android rc4.64.
- rc4.64 incumbent expert configuration remains **DEFAULT / CONTROL / SELECTABLE**.

## EXPERT-V2 — AUTHORITATIVE 2026-08-26 STATE

### Full four-position candidate: REJECTED

The frozen tested four-position SHADOW hypothesis was:
- QB: Draft Sharks 35 / Nick Mariano 25 / Dalton Del Don 20 / Justin Boone 10 / Pat Fitzmaurice 10.
- RB: Draft Sharks 35 / Nick Mariano 25 / Dalton Del Don 25 / Pat Fitzmaurice 15.
- WR: Nick Mariano 35 / Draft Sharks 30 / Pat Fitzmaurice 15 / Dalton Del Don 10 / Justin Boone 10.
- TE: Draft Sharks 35 / Pat Fitzmaurice 30 / Dalton Del Don 25 / Justin Boone 10.

Exact rc4.64 + end-to-end Return-v2 A/B rejected the combined treatment: QB-v2 produced a material late QB2 regression (Kyler Murray at pick149 with QB1 already rostered), while late WR concerns remained. RB-v2 had no demonstrated marginal decision value; TE-v2 lacked a sufficient promotion case. **Do not integrate the QB/RB/TE treatment weights. QB/RB/TE remain incumbent rc4.64.**

### WR-v2 only: PASS SHADOW QUALIFICATION, NOT PRODUCTION

**Exact WR-v2 weights to preserve and integrate additively:**
- Nick Mariano **35%**
- Draft Sharks Team **30%**
- Pat Fitzmaurice **15%**
- Dalton Del Don **10%**
- Justin Boone **10%**
- Sum = **100%**

This is the only qualified new expert weighting. It must become an **additional selectable WR panel**; it must not overwrite/remove the rc4.64 incumbent, which stays default/control until full validation.

Exact control-parity evidence for the isolation harness: **224/224 predictions** = 215 Return-v2 + 9 production fallbacks, MAE=0, max=0. WR-v2 preserved key controls and improved/reduced WR accumulation at multiple deep-roster states. Pick129 can still surface WR7 because the common PlayerQualitySafety/roster-utility layer may resurrect a WR; this is a shared B-axis issue, not permission to alter WR weights or impose a cap.

### Source locks

- Derek Brown: **EXCLUDED FROM NEW V2**.
- Andrew Erickson: challenger-only; no current numeric vote.
- Matt Harmon: WR evidence/specialist layer only; no numeric vote unless incremental value is demonstrated.
- Sean Koerner: current-draft acquisition closed/paywalled; watchlist only. Do not spend draft-week time forcing access.
- Draft Sharks = exactly ONE correlated family; never double-count Jody Smith/Jared Smola/staff as separate votes.
- Temporary Weisse/Gianni/Bobal pool: rejected/control only; never resurrect from old workflows.
- Draft accuracy and in-season accuracy remain distinct; do not justify Boone-heavy weights from in-season results.
- Do not micro-tune 35 vs 32/38 to fit historical picks; perturbation testing showed percentage precision is not the material uncertainty.

## FRESHNESS

- Verified individual expert boards may be reused for at most ~12h before refresh attempt.
- Failed refresh may preserve only explicit `STALE-FALLBACK`; stale data must never be silently presented as fresh.
- Open draft-readiness gate: make age/stale state fail-visible and require a fresh pre-draft check.

## CURRENT INTEGRATION / RESEARCH STATE

- Research branch: `pitti-expert-v2-wr-decision-20260826`.
- Last transfer-known head: `2449f457c7a3c46a68d5d271a590ff329e5f1813` (`Trigger WR-v2 shadow integration gate`).
- WR-v2 decision gate report status: **PANEL-ISOLATION PASS / SHADOW TEST-READY, NOT PRODUCTION**.
- Integration workflow was prepared/triggered but no concrete successful integration workflow run had been verified at handoff. Preparation is not a build/package/Android verification.
- Natural frozen fixture provenance remains mixed: picks 9/12/29 rc4.60; picks 32 onward rc4.63. Never relabel all fixtures as rc4.64. Stored fixture `coachScore` is panel-contaminated and not a neutral A/B target.

## EXACT CONTINUATION

1. Verify whether the WR-v2 integration workflow produced a concrete run after `2449f457`; if absent diagnose workflow registration/trigger rather than waiting or declaring success.
2. Integrate **WR only** with exact weights Mariano35 / Draft Sharks30 / Pat15 / Del Don10 / Boone10 as an additional selectable configuration. QB/RB/TE stay incumbent rc4.64. rc4.64 stays default/control/selectable.
3. Run existing regression suite and exact Return-control parity.
4. In parallel qualify the common roster-aware PlayerQualitySafety/WR-redundancy issue exposed at pick129 without hard cap, quota, player forcing, PairSum/Rolling, generic Return retune or global QB2/TE2 ban.
5. In parallel harden expert freshness visibility/fail-closed draft readiness.
6. After CI/regression PASS, run realistic non-interactive mock/roster validation. Android install/test only after a concrete verified package exists.

## KNOWN RECENT FAILURE MODES — DO NOT REPEAT

- Handoff claiming completeness while compact state omits exact expert weights.
- Stale nested generation/runtime pointers surviving a superficially PASS seal.
- AUTO blocks announcing work instead of doing it.
- Waiting idle while parallel work exists.
- Treating prepared/build artifacts as Android verified.
- Rebuilding solved expert/source acquisition questions.
- Using old selector/audit workflows containing Koerner/Weisse/Gianni/Bobal as current authority.
- Reviving rejected full-v2 QB/RB/TE weights after WR-only qualification.

## HANDOFF LOCK

Persistent Library handoff generation **v96** is authoritative for transfer. A new chat must verify `PITTI_CURRENT_STATE.json` + `PITTI_HANDOFF_SEAL.json` + full Library Project State and then verify relevant live GitHub/runtime facts. Exact WR-v2 weights are transfer-critical and machine-locked in `PITTI_EXECUTION_LOCK.json`.


---

## 2026-08-27 PITTI AUTO — OOS rc4.76 ROSTER-OPTION-VALUE EVIDENCE / USER ONE-QB INVARIANT

### New independent natural draft evidence
- New completed natural mock: Sleeper draft `1398395487467368448`, app `v11.8.0-rc4.76`, slot 9, 10x15.
- User roster path reached seven WR by pick 72 and one QB (Trevor Lawrence) at pick 92.
- Android decision surfaces then exposed the same structural marginal-utility failure family independently of the earlier natural mock:
  - pick 112, pre-pick QB0/RB2/WR7/TE1: KC Concepcion WR was Coach #1/TOP-PICK; user chose Rachaad White RB.
  - pick 129, pre-pick QB1/RB3/WR7/TE1: Romeo Doubs WR was Coach #1 despite WR saturation; user chose Jonah Coleman RB.
  - pick 132, pre-pick QB1/RB4/WR7/TE1: Romeo Doubs remained Coach #1 despite R0%, WR saturation and LOSS HOCH; user chose Tyrone Tracy RB.
  - pick 149, pre-pick QB1/RB5/WR7/TE1: Kyler Murray QB2 #1 and Jared Goff QB2 #2 displaced late RBs; user chose Keaton Mitchell RB.
- This is OOS confirmation of the *problem shape*, not permission to restore old v3/v5 coefficients or fit player-specific bonuses.

### User strategy clarification — hard scope
- User explicitly will draft **exactly one QB** in this league.
- Once QB1 is rostered, QB2 has no useful pre-Week-1 option value for this user: it would be dropped for K/DST, and unlike a late RB (or much weaker WR/TE path) there is no plausible pre-Week-1 role/news path that earns the extra QB a retained roster slot.
- Therefore QB2 is a **hard user-strategy exclusion on the user's Draft Coach surface after QB1**, not merely a soft marginal-utility penalty.
- Scope is deliberately narrow: this is not a generic 1QB fantasy law, does not ban opponents from drafting QB2, does not alter Return-v2 opponent simulation, and does not become a TE2 ban.
- Existing Geno Smith/Aaron Rodgers user exclusions remain independent hard exclusions.

### Root cause confirmed in rc4.77 code
- rc4.77 still encoded QB2 as a soft exception path: `rosterExceptionPenalty` allowed an exceptional-slide bypass and `applyPlayerQualitySafetyGate` could keep such QB2 eligible.
- That semantics contradicts the clarified user strategy and explains why ordinary QB2 can still consume visible Coach priority.
- WR7+ is already recognized by multiple gradual penalties (`rosterState`, `progressiveUpsideBonus`, `marginalRosterUtility`), so the WR defect is not failure to detect roster saturation. It is a downstream ordering/PlayerQualitySafety interaction and must be fixed without a hard WR cap or blind RB bonus.

### Isolated rc4.78 research challenger
- Created branch `pitti-auto/rc4.78-roster-option-value` from the exact rc4.77 runtime-tested head `25ce5df410a4b9be2ce6ec75ba0817bdbb858d3e`.
- Added `USER_DRAFT_QB_LIMIT=1` and a user-strategy QB2 exclusion in `scoreCandidate`.
- QB2 is removed from the user's scored Coach/reference surface after QB1 and cannot be resurrected by PlayerQualitySafety.
- Updated branch execution lock to encode the user-specific one-QB invariant while preserving soft TE2 semantics and all three Expert-v2 selectable profiles.
- This is **research-only / not promoted / not Android-ready** until OOS fixture and full release-contract validation pass.

### Next gate
1. Reproduce the new draft's 112/129/132/149 states as deterministic OOS regression fixtures from actual snapshot/board data; do not fit to the user's chosen player identity.
2. Require after-QB1 user Coach surfaces to contain no QB2.
3. For WR7 states, require diminishing marginal WR utility to affect final ordering while preserving genuinely exceptional WR value and avoiding any WR roster cap.
4. Preserve RB saturation/reversibility controls; late-RB option value must not become blind RB accumulation.
5. Separately repair/verify snapshot expert-health semantics: `0/0` / `Aktive Expertenquellen: KEINE` must not falsely describe embedded Expert-v2 individual ranks as absent.
6. Only after these OOS gates plus the complete rc4.77 release regressions/package/re-extract contract pass may a successor candidate reach Android.


### 2026-08-27 rc4.78 continuation — causal fixes completed on research branch
- Confirmed WR7+ root cause: roster saturation was already detected by four gradual utility layers; PlayerQualitySafety could nevertheless promote an ordinary saturated WR back to #1.
- Research fix: Safety promotion for WR7+ now requires the already-existing `Starker Value` condition (pick minus ADP >=10). This is not a cap: natural post-utility WR leaders remain legal.
- Snapshot-health semantic fix: Expert-v2 panels intentionally have empty legacy `members{}` and carry individual expert ranks inside embedded board rows. Snapshot now derives Expert-v2 verification/source lines from those embedded rows instead of falsely printing `0/0`, positional `keine`, and `Aktive Expertenquellen: KEINE`.
- Desired acquisition-pool health remains a separate signal and may still correctly be DEGRADED when Koerner is unavailable.
- Runtime identifiers bumped to rc4.78 on app/index/manifest/sw; README explicitly labels rc4.78 research-only and preserves rc4.77 as last fully off-device-tested pre-install candidate.
- Draft PR #28 was opened only as a CI-trigger probe; it exposed a noisy historical diff because the research branch intentionally anchors exact rc4.77 tested head while current main diverged. PR #28 was closed immediately without merge. Do not use it for promotion.
- Added branch-local `.github/workflows/rc478-research-gate.yml` for syntax/static invariant checking. No workflow run was emitted for the branch push; treat as internal CI availability limitation, not user gate.
- Library CURRENT advanced to generation `20260827T083500Z-v103` and canonical Project State was updated with the OOS draft, one-QB invariant, research changes and pending Pat/Erickson follow-up.


### 2026-08-27 rc4.78 AUTO — provenance hardening + static invariant re-audit
- Re-audited branch head after continuation: one-QB user invariant, Coach filtering, WR7+ roster-aware Safety guard and embedded Expert-v2 health helpers are all present simultaneously.
- Expert-v2 source disclosure hardened again: active snapshot source lines now expose the board's explicit provenance string (`PITTI_EXPERT_V2.source`) rather than the ambiguous generic label `Expert-v2 Board`. This prevents an embedded/frozen board from being misread as a live-fetched individual ranking.
- Research CI invariant file now also asserts that provenance disclosure remains wired. GitHub still emits no Actions run for pushes to this isolated branch; do not convert that connector/CI limitation into user work.
- No coefficients, Return probabilities, manager model, panel weights, player-specific recommendations, WR cap, TE2 ban or RB force were added.
- Promotion remains fail-closed: rc4.78 is research-only until deterministic executable OOS behavior and full Release Contract can be reproduced from a clean promotion branch.


### 2026-08-27 PITTI AUTO — stale guardrail authority found and fail-closed repaired
- A fresh continuation audit found a material anti-regression defect in `PITTI_EXECUTION_LOCK.json` and `tools/pitti_guardrail_check.mjs`: both still machine-enforced the obsolete historical state “WR-only shadow / full-v2 rejected and unavailable”, contradicting CURRENT/Handoff and the user's later explicit three-profile requirement.
- This was exactly a potential old-error resurrection path. Work on promotion/OOS was stopped until the authority layer was repaired.
- Execution Lock now machine-locks the current three selectable profiles: incumbent/control; Expert-v2 ALL positions; Expert-v2 WR-only. Historical full-v2 regression remains evidence against declaring a winner, never authority to delete the ALL profile.
- Guardrail checker now enforces that three-profile set, fixed DS -> Del Don -> Pat -> Mariano -> Boone display order, individual player ranks rather than weights, Brown exclusion, Erickson challenger-only, Koerner acquisition limitation, Draft Sharks one-family counting, rejected temporary Weisse/Gianni/Bobal pool, and no final-winner claim.
- Guardrail checker also now enforces the user-specific one-QB strategy rather than the obsolete generic repeated-QB/TE wording; TE remains a soft exceptional-value path and is not globally banned.
- This repair changes authority/guard infrastructure only; it does not retune Coach, Return-v2, manager model, expert weights or player scores.
- rc4.78 remains research-only. Next gate remains clean-line executable OOS validation after authority consistency is rechecked.


---

## 2026-08-27 PITTI AUTO — rc4.78 CLEAN PROMOTION LINE / OOS + PACKAGE GATES PASS

### Why this continuation was necessary
- User correctly flagged that AUTO had stopped after a status-only message even though useful autonomous work remained. This violates the durable AUTO contract. Continuation resumed without treating internal CI/tooling limits as a user gate.
- A clean promotion branch `pitti-auto/rc4.78-clean-promotion` was created directly from current `main` to eliminate the noisy/diverged history of the earlier research branch while preserving the exact intended runtime bytes.
- The clean branch is ahead-only of `main` at the validation point; no behind/diverged main commits remain in this line.

### rc4.78 runtime policy architecture
- Extracted the user/roster policy into pure module `decision-policy.js` so the exact live policy is executable off-device rather than only source-grep tested.
- User-specific 1-QB invariant: after QB1, QB2 is hard-excluded from the user's Coach candidate surface. This does not alter opponents/Return-v2 and is not a generic league-wide QB2 law.
- WR7+ remains legal. PlayerQualitySafety may not mechanically resurrect an ordinary saturated WR; it may still protect a genuine existing `Starker Value` case (pick minus ADP >=10). No WR cap, no player-name forcing and no blind RB bonus were introduced.
- TE2 remains a separate soft exceptional-value path; it was not collapsed into the QB2 hard rule.
- Embedded Expert-v2 snapshot health/source semantics remain fixed and now disclose the frozen board provenance explicitly.

### Deterministic OOS policy gate
Natural completed draft `1398395487467368448` is the OOS regression anchor:
- pick 149 with Trevor Lawrence already rostered: Kyler Murray/Jared Goff QB2 path is hard-excluded.
- picks 129/132 with WR7: ordinary Romeo Doubs-type safety resurrection is blocked.
- strong WR value still passes; WR6 remains unaffected.
- late RB remains eligible without forcing RB.
- exceptional TE2 path remains available while ordinary TE2 is not safety-promoted.
Executable policy assertions PASS.

### Byte provenance / package verification
- Built rc4.78 from the previously verified rc4.77 inner ZIP and the clean-branch changes.
- All 12 runtime files were independently compared to GitHub clean-branch blobs using Git blob SHA and matched byte-for-byte.
- Runtime files: `_worker.js`, `app.js`, `decision-policy.js`, `expert-board-export.js`, `expert-v2-board.js`, `icon.svg`, `index.html`, `live-surface-v3.css`, `live-surface-v3.js`, `manifest.webmanifest`, `styles.css`, `sw.js`.
- JavaScript syntax PASS.
- Version/cache coherence PASS; service worker caches `decision-policy.js`.
- Live presentation behavioral checks PASS: no redundant JETZT/EHER-JETZT, Parker thesis retained, fixed expert rank order retained, injury cannot manufacture arrow, WR saturation surfaced, Taylor workhorse evidence retained.
- Expert-v2 board/weights contract PASS.
- Legacy regression-equivalent checks PASS: position path, PlayerQuality monotonicity/expert-health semantics, Return geometry + 6000-run market sanity, scarcity single-channel, alternative scarcity/marginal utility and dress-rehearsal endgame.
- Package -> re-extract -> byte equality PASS for all 12 files.
- Final local package: `Draft_Companion_v11.8.0-rc4.78_PREINSTALL.zip`
- SHA-256: `69404f0b413440a3aa7adcf5bf7028522405d1b5183d730c4686a98e005820ba`
- Package and gate report uploaded to Library `/Pitti/Development/`; TEST/LATEST recovery aliases were deliberately NOT overwritten.

### CI transport diagnosis
- Connector-created GitHub commits did not emit Actions runs even after workflows were retargeted to the clean branch. Combined status remained empty.
- This is an internal CI transport limitation, not a user gate. Equivalent executable/static/package/re-extract validation was completed independently in the working container, with direct blob parity against GitHub source.

### Current boundary
- Production/control remains rc4.64.
- Latest Android-observed runtime remains rc4.76 and remains UI-incomplete/not draft-ready.
- rc4.77 is superseded as the next candidate by rc4.78.
- rc4.78 is now **PREINSTALL VERIFIED / NOT ANDROID VERIFIED**.
- Do not call rc4.78 draft-ready or production until the exact candidate is observed on Android and the intended Decision Surface smoke checks pass.
- AUTO must not stop with a status-only message while autonomous work remains.
