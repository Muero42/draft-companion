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


## HANDOFF WRITE-THROUGH — 2026-08-27 rc4.77 DECISION-EVIDENCE

- Current working branch: `pitti-auto/rc4.77-decision-evidence`.
- Current pre-install candidate: **v11.8.0-rc4.77**; **NOT Android-verified / NOT installation-approved**.
- User Android evidence on rc4.76 showed the live decision cards still failed the intended information architecture: Gibbs/Bijan shared generic expert-consensus advantages; Taylor/St. Brown lacked useful differentiating strengths. The next work must test the actual decision quality in parallel with fixing this presentation/evidence defect.
- rc4.77 changes on the working branch make structured player-specific causal Research Evidence win over generic fallback text. README/version references on that branch are synchronized to rc4.77.
- Required decision UI contract remains: Return % is the normal timing signal; do not add redundant NOW/JETZT wording. WAIT is retained only when high Return probability must not be overlooked. Value remains useful. Do not force artificial differences between genuinely similar players, but surface meaningful differentiators when evidence exists (multi-year consistency, workload/role, athletic/ceiling traits, elite-QB environment, etc.).
- Four clear candidate cards: player-specific +/− reasons; expert rankings always visible (not collapsible), **ranks not weights**, and deterministic expert order with experts common to all position panels first. Only selected experts are displayed.
- Player-name suffix: only established upside/regression arrows plus concise reason; preserve Parker Washington invariant **WR2 mit WR1-Upside**. Top-10 keywords belong after metrics, not appended to player names; injury warning may be additional.
- Never release another install ZIP merely because source/unit tests are green. Mandatory pre-install path: behavioral/semantic render gate against actual live presentation -> regressions/invariants -> README/version/cache coherence -> build/package -> re-extract actual runtime ZIP and retest extracted contents. Only then request Android installation.
- README drift is a release-blocking regression, not documentation cleanup.
- No status/intermediate messages during PITTI AUTO/HANDOFF while autonomous useful work remains. HANDOFF must persist and verify state before reporting completion.

### Immediate continuation after handoff
1. Verify rc4.77 branch contents and run the full Release Contract v2 gates; repair failures rather than asking for Android install.
2. Test whether structured causal evidence actually produces distinct, decision-useful reasons for representative players including Gibbs, Bijan, Taylor and Amon-Ra St. Brown, while allowing equal text where players truly share the same rationale.
3. In parallel audit the **actual draft decisions/ranking order**, not merely UI wording, against current locked model/expert/Return/roster rules.
4. Preserve all prior Expert-v2/WR-only qualification locks unless a newer verified checkpoint explicitly supersedes them; do not infer production status from the rc4.77 presentation branch.
5. If all gates pass, package/re-extract/retest and only then mark a concrete ZIP pre-install-ready; Android verification remains a separate state.


## 2026-08-27 HANDOFF v100 ALIGNMENT
- Library handoff v100 is the current transfer authority.
- Machine lock corrected to preserve **three selectable expert profiles**: incumbent, Expert-v2 ALL, Expert-v2 WR-only. Earlier full-v2 A/B failure is historical evidence against promotion as winner, not permission to remove the selectable ALL profile.
- AUTO/HANDOFF continuity is fail-closed: no intermediate user-facing status while autonomous useful work remains; parallelize independent lanes; autonomously diagnosable CI/test/build/research failures are repaired and rerun internally.
- Runtime tested content remains commit `25ce5df410a4b9be2ce6ec75ba0817bdbb858d3e`; subsequent commits are state/lock documentation only and do not alter rc4.77 runtime bytes.
