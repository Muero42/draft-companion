# PITTI PROJECT STATE — CANONICAL

Updated: 2026-08-27 17:55Z
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

## HISTORICAL CURRENT RUNTIME BOUNDARY — SUPERSEDED BY LATEST EOF SECTIONS

- Android verified/current control: **v11.8.0-rc4.64**.
- Decision-kernel pin: `9ba6db89fc1e7550052a7526bd0c68d6cc7459dc`.
- Current main after transfer-lock hardening carries only guard/state changes beyond the decision kernel; Draft Companion runtime remains rc4.64 control.
- Library `Draft_Companion_TEST.zip`, `Draft_Companion_LATEST.zip`, numbered rc4.52 are recovery/audit aliases only (SHA `38e46c942e2b95c862587fdab1bd5bf71b2da524e5efc1ef0107acaad2c7bf32`, 8 files). Do not infer Android truth from Library aliases.
- gh-pages remains a distinct rc4.63 runtime plus isolated audit tooling; do not equate it with current Android rc4.64.
- rc4.64 incumbent expert configuration remains **DEFAULT / CONTROL / SELECTABLE**.

## HISTORICAL EXPERT-V2 — 2026-08-26 STATE — SUPERSEDED BY 2026-08-27 THREE-PROFILE AUTHORITY BELOW

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


---

## 2026-08-27 — Fitzmaurice qualitative QB evidence (AMA, user-captured)

Source: direct Pat Fitzmaurice AMA reply captured by user on 2026-08-27. Treat as dated qualitative evidence, separate from numerical expert ranks to prevent double counting.

Pat's three stated QB favorites:
- Kyler Murray: rebound/value thesis. Pat notes 2025 was first career season outside top-12 QB fantasy points/game; rushing floor plus Justin Jefferson/Jordan Addison and Kevin O'Connell environment.
- Malik Willis: high-upside rushing thesis. Pat explicitly compares his rushing class to Lamar Jackson, cites ~8.5 fantasy points from rushing in six career starts, and credits passing development under Matt LaFleur. This is the strongest new asymmetric-upside signal and merits targeted validation, not a blind rank boost.
- Jared Goff: stable-floor/value thesis driven by weapons, potential shootouts from shaky defense, soft/indoor-heavy schedule and multi-year passing production.
- Pat would like Goff+Willis as stable QB + upside wild card, but notes both share Week 6 bye. For the user's 10-team 1QB strategy this DOES NOT override the hard no-QB2 policy; use it only to understand archetypes before QB1 is selected.
- Pat's opening “Kyren Murray” is contextually an obvious typo for Kyler Murray; do not create a player/entity from it.

Independent same-day validation:
- Malik Willis is currently Miami QB1 in current depth-chart reporting and projected starter; this materially strengthens the applicability of Pat's upside thesis.
- Current public rankings remain much lower on Willis (roughly QB25-26 in a same-day ranking source), so he is a genuine expert-disagreement/high-upside late path rather than consensus QB1.
- Kyler Murray has independent late-round QB1-upside support; Derek Brown explicitly says the risk is priced into ADP and QB1 upside is not.
- Goff remains a floor-heavy profile; current Half-PPR ADP evidence places him around pick 139-140 overall, while current rankings can be materially higher (around QB10). Do not mistake stable floor for championship ceiling.

Operational implication:
- Add/retain a qualitative Fitz evidence flag for Murray/Willis/Goff before QB1 is selected.
- Do NOT numerically count the AMA thesis as another Fitz ranking input.
- Willis should receive targeted upside/research consideration, but no player-specific hard forcing.
- Once QB1 is rostered, rc4.78 one-QB invariant removes all three from the user's Coach candidate surface.


---

## 2026-08-27 PITTI AUTO — Fitz QB thesis integrated as bounded residual (rc4.79)

Fresh validation before implementation:
- Malik Willis is independently listed as Miami QB1 on current 2026-08-27 depth-chart evidence; a current Dolphins roster projection calls him entrenched at the top.
- Current FantasyPros page: Willis ECR QB21, consensus ADP 149 / Sleeper 164, with projected 124.9 rush attempts and 642.8 rush yards. This confirms real rushing asymmetry but also material market/rank disagreement.
- Same-day independent ranks put Kyler Murray around QB5-9, Jared Goff around QB7-11 and Willis around QB24-26 depending scoring; Murray market ADP evidence remains materially later (around 133 overall/QB18 in one current consensus feed); Goff Half-PPR Sleeper-derived ADP ~139.
- Therefore Fitz's AMA is useful qualitative residual evidence, especially Willis, but not sufficient to replace Expert-v2 ranks or force a player.

Implementation in rc4.79:
- Added bounded, expiring QB qualitative priors for Kyler Murray, Malik Willis and Jared Goff to the existing Research Residual shadow architecture.
- Willis: strongest asymmetric residual, POSSIBLY_UNPRICED; causal path requires starter status + rushing + viable passing floor.
- Murray: medium positive rebound/upside residual, PARTLY_PRICED.
- Goff: smaller positive floor residual, LIKELY_PRICED.
- These are explicitly not an additional Fitz numerical ranking and therefore do not double-count his panel rank.
- Existing residual caps/pricing adjustment remain authoritative; no hard forcing/name override.
- Existing one-QB policy remains authoritative: after QB1, all QB2 candidates are excluded before this research residual can affect Coach ordering.
- Evidence expires 2026-09-01 unless refreshed/invalidated; appropriate because this is draft-week qualitative evidence.
- Runtime/version bumped to v11.8.0-rc4.79 and deployed to gh-pages. Android verification remains required before production/draft-ready promotion.


---

## 2026-08-27 PITTI AUTO — QB1 deployment-risk decision: Murray/Goff vs last-pick Willis

Question tested: Is Malik Willis already safe enough to draft as the user's only QB and start immediately, or should PITTI prefer a safer Murray/Goff QB1 and monitor Willis on waivers?

Fresh evidence:
- Willis starter/job-security risk is LOW: current Miami reporting explicitly calls him the starter while the team sorts out QB2. This removes the earlier concern that the late pick could lose the job before Week 1.
- Willis fantasy-output uncertainty remains MATERIAL: current FantasyPros draft ECR QB21 (83 experts; range QB13-QB30), consensus ADP 150 / Sleeper 164, projected 493 pass attempts, 3371 pass yards, 17.7 pass TD, 124.9 rushes, 642.4 rush yards, 4.1 rush TD. The rushing thesis is real, but consensus still prices him below reliable weekly QB1 territory.
- Goff is the safety archetype: Fitz calls him high-floor; Derek Brown independently calls him high-floor/low-end-QB1 ceiling and explicitly suggests pairing him with upside QBs including Willis. Week-1 ECR currently QB12 (8 experts), but Pat himself QB15 and Brown QB19. Four straight 4,000-yard seasons and no missed game since 2021 support reliability.
- Murray is the balanced archetype: official Minnesota depth chart lists him QB1; current Week-1 independent projection/ranking is materially stronger than Goff in at least one current source, and Fitz's qualitative thesis supplies rushing/rebound upside.
- Goff and Willis share Week 6 bye, but this is irrelevant to the user's hard one-QB draft policy because Willis would be monitored, not drafted as QB2.

Decision:
1. Do NOT classify Willis as unsafe because of starter/job-security. That concern is currently resolved.
2. Do classify Willis as HIGHER WEEKLY OUTPUT VARIANCE / insufficiently proven Week-1 QB1 floor. His tiny relevant starter sample and low passing projection create real downside even with elite rushing upside.
3. Preferred default if prices are reasonable: Murray > Goff > Willis for opening-day QB1, with Willis a high-priority waiver/FA monitor.
4. Price sensitivity is mandatory: do not spend a materially earlier pick on Murray/Goff merely for floor. If Murray/Goff cost a valuable RB-upside round while Willis survives to 15.09, Willis becomes the preferred portfolio bet.
5. No QB2 draft. A Murray/Goff selection immediately invokes the QB2 hard exclusion; Willis is then WATCHLIST/FA only.
6. If Willis is the QB1 pick, last-pick timing is preferred when return probability supports it. No premature reach solely from Fitz endorsement.

Willis promotion triggers before/after draft:
- sustained Miami QB1 status;
- designed-run/read-option/red-zone rushing usage consistent with the projected rushing profile;
- acceptable pressure-to-sack/turnover behavior and passing success sufficient to keep offense on schedule;
- Week-1/early-week snap rate and route/play-action environment;
- no material offensive-line/pass-catcher degradation.
A strong preseason box score alone is NOT enough.

Willis downgrade triggers:
- QB rotation/short leash;
- rushing usage materially below thesis;
- passing inefficiency causes stalled drives/benching risk;
- high sack/turnover rate;
- market rises enough that the last-pick opportunity-cost advantage disappears.

Coach implication:
- Add semantic archetypes: Murray=BALANCED_UPSIDE_QB1; Goff=FLOOR_QB1; Willis=LAST_PICK_UPSIDE_OR_FA_WATCH.
- These are decision semantics, not hard player forcing. Expert-v2 + ADP + Return-v2 remain authoritative.


### 2026-08-27 PITTI AUTO — QB price/risk calibration follow-up
- Fresh same-day market/rank cross-check reinforces a meaningful three-way price/risk distinction rather than a fixed player order.
- FantasyPros sleeper consensus (Aug 26): Murray sleeper ECR 17/ADP QB17; Goff ECR 16/ADP QB16; Willis ECR 20/ADP QB21. FullTimeFantasy same-day ranks are much more bullish on Murray/Goff (roughly QB5-11 depending scoring) while Willis remains QB24-26. This divergence is material.
- Murray current PPR market evidence: ~ADP 133 overall/QB18; another Aug-26 feed places him around 12.01. Goff has evidence around ADP 115 in an Aug-2026 bargain analysis. Willis remains substantially cheaper/late.
- Willis current Dolphins role remains starter; backup competition is behind him. FFToday explicitly characterizes the fantasy bet as rushing-floor dependent in an offense expected to be weak; CBS similarly flags the small-sample/LaFleur/supporting-cast translation risk while acknowledging top-five single-game upside.
- Pat's Aug-24 Willis note adds useful quantified history: 44.8 rushing yards/game across six career starts; Green Bay 2024-25 appearances showed 78.7% completion, 10.9 YPA, 6 TD/0 INT, but Miami pass-catcher quality is a major downgrade.
- Therefore Willis' risk label is refined: JOB_SECURITY_LOW_RISK; FANTASY_TRANSLATION_MEDIUM_HIGH_RISK; RUSHING_CEILING_HIGH; PRICE_OPPORTUNITY_VERY_HIGH.
- Default decision is not a fixed Murray>Goff>Willis ranking. Use expected portfolio value at the actual pick:
  * Murray: preferred if he falls enough that his rushing/rebound ceiling does not consume a materially superior RB lottery ticket.
  * Goff: preferred safety fallback when his acquisition cost is modest; do not reach merely for floor.
  * Willis: preferred very-late/last-pick QB1 when Murray/Goff cost materially more, or FA watch after drafting either safer QB.
- Because all three currently have Week 6 byes, bye-week differences do not decide among them.
- Hard one-QB rule unchanged. No Goff+Willis or Murray+Willis draft pairing.


### 2026-08-27 PITTI AUTO — Willis risk calibration corrected
- Fresh recency-7 web check confirms Miami is evaluating the backup QB role behind starter Malik Willis; therefore job-security is not the main Week-1 concern.
- Same-day market evidence materially improves the price picture: recent Sleeper-derived Half-PPR ADP is Murray 144.6 and Goff 139.2; in recent 10-team PPR samples Murray ~138 and Goff ~128.4. Both can therefore reach the user's late turns more often than a generic Round-10/11 assumption suggests.
- Independent same-day rank source remains much more bullish on Murray/Goff (Murray QB5, Goff QB10) than Willis (QB26), confirming genuine disagreement rather than a simple consensus sleeper.
- Goff's 2025 production (4,564 pass yards, 34 TD, 8 INT) and camp comfort in the new offense support floor, but essentially zero rushing means his ceiling remains passing/TD dependent.
- Willis' only 2026 preseason action to date was deliberately light (4/5, 43 pass yards; 2 rushes, 9 yards) and he sat the second game; that is insufficient to validate weekly fantasy floor.
- Corrected prior calibration in app: Willis qualitative residual reduced from .78/.88 to .72/.90 and causal text now separates confirmed starter status from unproven Week-1 fantasy floor. Invalidators explicitly include designed/read-option/red-zone rushing, sack/turnover behavior and passing efficiency.
- This is a calibration, not a reversal: Willis remains the highest asymmetric very-late QB bet; Murray/Goff remain preferable when their actual acquisition cost is sufficiently close.
- No QB2 draft; if Murray/Goff is selected, Willis moves to high-priority FA watch.


### 2026-08-27 PITTI AUTO — latest Willis/Goff market update
- Recent Dolphins reporting (Aug 24) explicitly describes the team as sorting the backup role *behind starter Malik Willis*. Willis also sat the second preseason game after going 4/5 for 43 yards plus 2/9 rushing in the opener. This further reduces job-security uncertainty; it does NOT resolve weekly fantasy-floor uncertainty.
- Fresh Sleeper-derived Half-PPR Goff ADP is ~139.2 (Aug 27, recent 1QB drafts), which is substantially later than some generic ADP feeds. In the user's 10x15 room this makes Goff plausibly a Round-14/15 safety option rather than something PITTI should automatically pay Round 10-11 prices for.
- Kyler Murray current mock-market evidence remains roughly Round 12/13 (12-team sources), therefore usually costs materially more than a last-pick Willis route.
- Portfolio conclusion strengthened: preserve RB optionality through the late rounds; do not draft a safe QB early merely because Willis is volatile. At the actual QB decision compare Murray/Goff acquisition cost against the best remaining RB lottery ticket and Willis return-to-15.09 probability.
- If Goff is still present near the final turn, his safety/price combination can dominate the choice. If he is gone and Murray required a materially earlier opportunity cost, last-pick Willis is acceptable rather than an emergency fallback.
- After selecting Murray or Goff: Willis remains FA/watch only, never QB2 draft.


### 2026-08-27 PITTI AUTO — fresh QB market convergence + Willis Week-1 risk update
- Same-day Kyle Yates QB ranks materially compress the three candidates: Kyler Murray QB16, Jared Goff QB17, Malik Willis QB18. This is useful independent evidence that Willis is no longer merely a QB25-style fringe bet.
- Same-day FullTimeFantasy remains much more conservative on Willis (QB24-26 across scoring variants) while ranking Murray QB5-9 and Goff QB7-11. The expert disagreement on Willis therefore remains large and actionable; do not erase it with a single consensus number.
- Current Dolphins reporting continues to call Willis the starter while Miami evaluates backups. CBS reports Miami sat Willis for preseason game two after a 4/5, 43-yard + 2/9 rushing opener; this is more consistent with starter protection than an open competition.
- NBC preseason snap evidence: De'Von Achane and rookie Caleb Douglas played every snap with Willis; Malik Washington and blocking TE Will Kacmarek played 12/14 with the ones. Supporting-cast quality/continuity remains a legitimate translation concern.
- FFToday's current outlook still frames Willis as rushing-floor dependent in an offense expected to be weak. Thus starter certainty is now strong enough that the remaining risk is weekly fantasy translation, not role loss.
- Decision calibration: Willis is promoted from generic QB25 lottery to LIVE LATE-QB1 CHALLENGER, but not to automatic Week-1 starter preference over Murray/Goff.
- Draft-price trigger remains portfolio-based. Current market evidence for Murray is around 12th round/ADP 133-145 in 12-team feeds; Goff evidence ranges materially earlier (~ADP 115 in one current analysis). In a 10-team room, do not mechanically translate round numbers; use actual Sleeper availability + Return-v2.
- If Willis remains until 15.09, the opportunity-cost case is strongest because the alternative pick is normally a K/DST slot or lowest marginal bench value. If Murray/Goff require sacrificing a materially better RB lottery ticket, Willis becomes preferred.
- If Murray/Goff are obtained at negligible opportunity cost, Willis becomes FA WATCH only under the hard one-QB rule.


---

## 2026-08-27 PITTI AUTO — rc4.82 draft-critical profile/health hardening

### Trigger
After Android rc4.80 confirmed the first Expert-v2 health fix, autonomous profile validation found two additional authority/runtime inconsistencies that would have caused future confusion or regression if left unresolved.

### Findings
1. Runtime metadata drift still existed in `app.js`: Emergency Queue, Decision-State export, Snapshot Coach model and backup version contained stale rc4.78/rc4.72 strings even though visible runtime was newer.
2. The first rc4.80 health fix treated *any* embedded v2 position as if the entire selected profile were embedded. That was correct for Full-v2 but unsafe for the WR-only hybrid profile because degraded live QB/RB/TE panels could be hidden.
3. Snapshot overall `Panel-Health` still used global desired acquisition-pool health rather than health of the actually selected panels.
4. Snapshot source/weight prose still described the Live Multi-Source pipeline even when the active Full-v2 board was frozen/embedded.
5. README and Execution Lock had stale release-state semantics: rc4.78/77 status persisted; `latestPreinstallVerified` had briefly been conflated with Android-deployed rc4.80 even though the latest actual package/re-extract artifact remains rc4.78.

### rc4.82 implementation
- Added centralized `APP_VERSION='v11.8.0-rc4.82'`; active Snapshot/Queue/Decision-State/backup/model metadata now derives from it.
- Added `activePanelHealthState()` and profile-aware summary/source/weight helpers.
- Full-v2 health = embedded Expert-v2 board health.
- WR-v2 health = hybrid: embedded WR board + live QB/RB/TE health. Any degraded live component remains a warning.
- Incumbent health = actual live panel membership/completeness, not global desired acquisition-pool completeness.
- Snapshot `Panel-Health` now follows active selected panels.
- Snapshot provenance now explicitly distinguishes Frozen Expert-v2 Board / Hybrid / Live Multi-Source.
- Snapshot weight semantics now distinguish frozen v2 effective weights from live renormalization.
- No Decision-/Return-v2 score coefficients changed.
- No WR cap, player-name forcing, RB force, PairSum/Rolling resurrection, generic QB2 ban or TE2 ban.
- Fitz Murray/Willis/Goff bounded residual evidence remains intact and upstream one-QB exclusion remains authoritative.

### Durable regression
Added `tools/rc482-draft-critical.mjs` and retargeted release workflows to current `main`.
It protects:
- centralized/current runtime version and no stale active RC strings;
- exact one-QB policy + OOS WR7 Safety semantics + exceptional TE2 path;
- exact three-profile routing;
- active profile health for Full-v2, healthy/degraded Hybrid and Incumbent;
- Expert-v2 schema/counts/weights and Brown exclusion;
- Fitz QB residual presence without bypassing QB2 exclusion.
Superseded `rc478-research-gate.yml` was removed and replaced by `rc482-draft-critical.yml`.

### Validation
PASS:
- 27 source/runtime policy invariants;
- executable active-health fixtures: Full-v2 healthy, Hybrid healthy, Hybrid degraded when live QB loses one required member, Incumbent healthy;
- exact Expert-v2 board counts QB46/RB102/WR143/TE54 and canonical weights;
- six legacy draft regressions, including 6000-run Return market sanity;
- release/completeness static UI invariants;
- main/gh-pages byte parity for rc4.82 runtime delta (`app.js`, `index.html`, `sw.js`, `manifest.webmanifest`).

GitHub connector pushes still emit no Actions runs. This remains an internal transport limitation; equivalent gates were executed directly and is not user work.

### Correct release boundaries
- Production/control baseline: rc4.64.
- Latest package + re-extract verified artifact: rc4.78, SHA-256 `69404f0b413440a3aa7adcf5bf7028522405d1b5183d730c4686a98e005820ba`, 12 runtime files.
- Latest Android-verified candidate: rc4.80.
- Current deployed draft-critical candidate: rc4.82.
- rc4.82 is SOURCE/REGRESSION/DEPLOY verified, **NOT Android-verified yet**.

### Exact next gate
Ordinary Android reload only; no data deletion or install package.
Verify:
1. visible rc4.82;
2. Full-v2 selected state shows active embedded v2 health without false acquisition-pool degradation;
3. fresh Snapshot says `Panel-Health: OK` for Full-v2 and reports Frozen Expert-v2 provenance/weight semantics;
4. Decision Surface still renders normally.
Only then mark rc4.82 Android-verified.


### 2026-08-27 checkpoint mirror note
- Repository `PITTI_PROJECT_STATE.md` and `PITTI_EXECUTION_LOCK.json` contain the current rc4.82 authority above.
- The attempted write-through of the same catch-up into Library `/Pitti/PITTI_PROJECT_STATE.md` / `PITTI_CURRENT_STATE.json` was blocked repeatedly by the Files upload bridge returning `container_session_expired` after materialization/editing. This is an internal tooling limitation, not a user gate.
- Fail-closed recovery rule until the Library mirror can be refreshed: if a new chat sees Library generation `20260827T083500Z-v103` or any state that still says rc4.76/rc4.77 is current, it MUST reconcile against repository Execution Lock/Project-State EOF before project work and must not revive those stale pointers.


### 2026-08-27 completed rc4.80 mock evidence — Draft 1398663778593198080
User supplied a completed Full-v2 mock snapshot from the Android rc4.80 runtime. Snapshot itself prints stale rc4.78 metadata; this is now confirmed as a real rc4.80 metadata defect, not an uncertain display issue. It also reproduces the false global `Panel-Health: DEGRADED` and misleading Live Multi-Source/renormalized-weight prose while all four active Expert-v2 boards are complete (QB 5/5 embedded, RB 4/4, WR 5/5, TE 4/4). These three defects are exactly the rc4.82 fixes and therefore provide an additional before-fix regression fixture.

Draft roster (user, slot 9):
James Cook, Justin Jefferson, Kyren Williams, Malik Nabers, Tyler Warren, Jameson Williams, Christian Watson, Parker Washington, Rico Dowdle, Jacory Croskey-Merritt, Kenny Gainwell, Josh Downs, Zach Charbonnet, Jared Goff, Jonah Coleman.
No K/DST drafted; one QB drafted at pick 132; TE1 at 49. This newly supplied rc4.80 draft ended 7 RB / 6 WR / 1 TE / 1 QB. IMPORTANT: do not conflate it with the earlier rc4.76 mock supplied previously, which the user confirms was the separate 7-WR draft used to expose WR-saturation failures.

Decision-quality observations to retain for later aggregate validation:
- Early core: Cook 1.09, Jefferson 2.02, Kyren 3.09, Nabers 4.02.
- Warren 5.09, Jameson Williams 6.02.
- Christian Watson 7.09 and Parker Washington 8.02.
- RB depth then Dowdle 9.09, JCM 10.02, Gainwell 11.09; Downs 12.02; Charbonnet 13.09.
- Goff selected only at 14.02 after QBs Allen/Lamar/Maye/Hurts/Daniels/Caleb/Herbert/Dak/Lawrence/Stafford/Dart/Mahomes/Nix/Purdy were gone; this is consistent with the safe-QB1 fallback path discussed after Pat Fitzmaurice's 27.08 answer.
- Malik Willis was not drafted by any team in the 150 picks shown, supporting the practical option of taking Goff for floor and observing Willis in free agency rather than forcing Willis into the draft.
- No post-draft retuning is authorized from this single mock. Use it as evidence alongside other realistic simulations and live expert evidence.

This snapshot is also a direct canary for rc4.82 Android verification: after reload, a fresh Full-v2 snapshot must show current rc4.82 metadata, active Full-v2 Panel-Health OK, Frozen Expert-v2 provenance, and frozen-v2 weight semantics.


### 2026-08-27 Android gate — rc4.82 visible
User reloaded Android and supplied screenshot. Badge visibly shows v11.8.0-rc4.82. Top cards show FantasyPros Online, Rankings 33 Min., Sleeper Draft 1029, Coach bereit. Expert configuration visibly selected: Expert-v2 · alle Positionen. This closes the version-badge/reload portion of the rc4.82 Android gate.
Screenshot does NOT include the lower Draftbereit/Panel-Health line, so Full-v2 health/provenance semantics remain device-unverified. Next minimal verification: scroll slightly below expert configuration until Draftbereit/Panel-Health status is visible, or produce a fresh snapshot if that exposes corrected metadata/health/provenance more efficiently.


### 2026-08-27 Android gate — rc4.82 PASS for visible Full-v2 health + roster rendering
Second Android evidence supplied after refresh:
- badge still v11.8.0-rc4.82;
- selected Expert-v2 · alle Positionen;
- former amber/degraded banner is now green: "Alles aktuell: Experten, Panels, Rankings, Sleeper-Spielerdaten und 1029 Sleeper-ADPs (Sleeper Draft ADP (half-PPR))."
- Coach bereit = Bereit;
- completed draft renders roster counts correctly: QB 1 / RB 7 / WR 6 / TE 1 and Fertig;
- completed-state card suppresses further live recommendations as intended.
Thus the user-visible false-DEGRADED regression seen in rc4.80 is fixed on Android rc4.82.
Remaining narrow metadata/provenance verification: a fresh rc4.82 snapshot should be checked once for App-Version=rc4.82 and corrected Frozen Expert-v2 provenance/weight wording. No need for another full mock merely for this check.


### 2026-08-27 Android gate — rc4.82 COMPLETE
Fresh snapshot from Android closes the remaining gate. Verified: App-Version v11.8.0-rc4.82; Full-v2 Panel-Health OK; embedded individual ranks QB 5/5, RB 4/4, WR 5/5, TE 4/4; provenance explicitly Expert-v2 Frozen Board; panel weights explicitly frozen effective weights with no live renormalization; Coach model reports rc4.82. The DUPLIKAT/UNVERÄNDERT guard is expected because the same completed draft fingerprint was intentionally recopied for metadata verification and is not a defect. rc4.82 is now fully Android-verified. Continue aggregate draft/decision-quality validation; do not retune from this single completed mock.


### 2026-08-27 PITTI AUTO — decision-quality correction + rc4.83 bounded challenger
User clarified that the rc4.80 mock's late-round 7 RB / 6 WR end roster was materially produced by manual overrides; Coach recommendations were often different. Therefore end-roster composition is NOT Coach-success evidence. Future validation must compare frozen Coach recommendation at each own pick against chosen player/override and roster state.

Code audit found a plausible structural cause: late WR saturation was still weak at WR6 (MRU only -1.5) and PlayerQualitySafety could re-promote a saturated WR after roster scoring. rc4.83 is a bounded research challenger, not a winner: WR6+ late marginal utility penalties strengthened; progressive saturation begins at WR6; from pick 101 a WR with 6+ already rostered cannot be Safety-promoted unless it has exceptional market value (ADP at least 10 picks later than current). No hard WR cap; natural elite/value WR can still win. QB2 hard user exclusion, TE2 exceptional path, Return-v2, Expert-v2 weights and opponent model unchanged.

Gate: regression + OOS decision-quality comparison before Android. rc4.82 remains last fully Android-verified candidate until this challenger proves incremental value.


### 2026-08-27 PITTI AUTO — rc4.83 policy centralization + regression gate
- Re-audit caught an implementation-quality issue before deployment: the initial WR6+ Safety exception had been duplicated inline in app.js rather than living in the canonical decision-policy module. This was repaired before Android exposure.
- Canonical safetyPromotionEligiblePolicy now owns the late saturated-WR rule: from pick 101 with 6+ WR, Safety promotion is blocked unless current pick is at least 10 picks later than ADP (exceptional value slide). This is still not a hard WR ban; ordinary Coach scoring may select a WR naturally.
- app.js now contains only the canonical policy call, eliminating divergent duplicate logic.
- Added tools/rc483-draft-critical.mjs and rc4.83 CI workflow. Static verification passes version parity, strengthened WR6+/WR7+ MRU, progressive saturation, centralized policy and preservation of QB/TE guards.
- Gate remains deliberately closed: aggregate/OOS decision-quality comparison is required before Android deployment. rc4.82 remains Android authority.


### 2026-08-27 PITTI AUTO — rc4.83 OOS methodology audit
Before promoting the first saturation coefficients, interaction accounting showed the initial combined penalty could reach roughly -13 raw-score points for WR8 in the endgame because three existing channels stack (MRU + Progressive saturation + late WR penalty). That was judged too close to an implicit position ban and inconsistent with the no-fixed-cap requirement. rc4.83 was therefore bounded before deployment: MRU WR6/7/8+ = -3/-5/-6.5; Progressive WR6 = -.75/-1.5/-2.5 by stages 1/2/3 and WR7+ = -1.5/-3/-4.5; existing pick120+ -2 late penalty retained. Combined veteran WR saturation is therefore about -3.75 at WR6/pick90, -4.5 at WR6/pick110, -7.5 at WR6/endgame; WR7 endgame -11.5. This remains soft scoring, not exclusion. Exceptional Safety promotion still has the +10 ADP slide escape.

A second validation flaw was repaired: final roster cannot proxy Coach quality when the user overrides recommendations. Frozen decision fixtures already captured the Coach candidate board and later chosen player, but did not explicitly persist the comparison. resolveDecisionFixtures now records decisionOutcome with Coach top, whether the chosen player was in the frozen candidate set, chosen frozen rank, followedCoach, score delta and panel-rank delta. This makes future mocks directly auditable without relying on final roster composition or manual reconstruction.

No Android deployment yet. Need OOS/aggregate evidence from frozen fixtures or realistic new mock(s); rc4.82 remains Android authority.


### 2026-08-27 PITTI AUTO — one-tap decision evidence transport + rc4.83 test deploy
Verified that full backups already contain decisionFixtures, but using the general backup would unnecessarily transfer rank caches/settings and make analysis noisier. Added a dedicated Advanced > Sicherung button `Pick-Evidenz exportieren`. It exports only current-draft frozen fixtures as `PITTI-Decision-Evidence-<draftId>-<timestamp>.json`, with appVersion, fixture/resolved/override counts and the full compact decision fixtures including decisionOutcome. Android Web Share/download path reuses the already-proven backup transport.

Static invariants PASS and main/gh-pages parity PASS for app.js/index.html/decision-policy.js/sw.js/manifest. rc4.83 is now deployed as a TEST candidate solely to obtain realistic OOS Coach-vs-user evidence. It is not promoted over rc4.82 yet. Required user flow is minimal: reload to rc4.83, run one ordinary realistic mock without documenting picks, refresh once after completion, Advanced > Sicherung > Pick-Evidenz exportieren, share the JSON. The final refresh is necessary so the last own pick is resolved into decisionOutcome.


### 2026-08-27 PITTI AUTO — parallel lanes completed before OOS mock
Parallel work was deliberately used instead of waiting for user mock evidence.
1. Evidence transport upgraded from v1 to self-auditing v2. Export now includes per-pick rosterCounts, Coach top, chosen candidate/rank, override/score/panel deltas and automatic wrSaturationFlag (Coach recommends WR while already 6+ WR), wr7PlusFlag and qb2Violation. Aggregate counters are included, while full frozen fixtures remain available for deeper counterfactual analysis.
2. Freeze audit extended with executable guards for exact one-QB user strategy, explicit Geno Smith/Aaron Rodgers hard exclusions, user candidate pool restricted to QB/RB/WR/TE (no K/DST), exceptional-only TE2 Safety path, no WR hard cap, three Expert profiles and Expert-v2 weights/Brown exclusion.
3. README release authority repaired so rc4.82 remains Android authority and rc4.83 is explicitly only the deployed test challenger.
4. No additional strategy coefficients were changed. Independent lanes are now exhausted without speculative tuning; next material evidence must come from realistic OOS Coach-vs-user decisions.


### 2026-08-27 PITTI AUTO — Evidence-v2 roster-count defect caught pre-mock
Parallel audit found a real telemetry defect before collecting OOS evidence: Evidence-v2 attempted to infer positions of already-drafted user-roster players from rankedAvailable, but rankedAvailable excludes drafted players. This could silently report zero/undercounted QB/RB/WR/TE and invalidate WR6+/WR7+ flags. Fixed at source: each frozen userRoster row now persists player position directly from Sleeper metadata; exporter uses persisted pos with rankedPool only as backward-compatible fallback. Regression guard added and rc4.83 main/Pages runtime resynchronized. No scoring coefficients changed.


### 2026-08-27 durable AUTO continuity correction
User explicitly requires PITTI AUTO to run in the longest safe autonomous blocks with minimal interruptions and without repeated reminders. This is now a durable project execution contract, not a conversational preference that may be forgotten.
- A blocked device/OOS gate blocks only its dependent lane.
- Before any AUTO stop, inventory independent lanes: decision validation, regression/release safety, evidence tooling, draft-day failsafe, expert freshness, post-draft/FA readiness, Watcher draft-critical readiness, checkpoint/handoff integrity, independent strategy research.
- Work every safe positive-value lane that does not contaminate a frozen experiment.
- Do not stop merely because the current primary lane needs user evidence.
- Interrupt only under PITTI_AUTO_PREFLIGHT user-interruption criteria.
- The rc4.83 Decision Kernel remains frozen pending OOS mock evidence; this does not freeze the rest of PITTI.


### 2026-08-27 PITTI AUTO — independent-lane audit while rc4.83 kernel frozen
Performed the required parallel inventory instead of stopping at the OOS gate.
- Draft-day failsafe audit: Emergency Queue uses the current scored board, is capped at 35, and preserves the one-QB/one-TE fallback semantics.
- Expert freshness audit: live expert caches use a 12h refresh window and stale fallback is explicitly degraded; Full-v2 remains a Frozen Board and does not silently live-renormalize. Pre-draft fresh-attempt rule remains authoritative.
- Post-draft/FA audit: bench review remains separate from Add/Drop; contingent RB capital is protected; CLEAR ADD requires a concrete materially better free agent plus fresh actionable evidence. No speculative FAAB amount is emitted.
- Watcher integration audit: automatic ingestion is fail-closed unless the expected feed schema and overall PASS gate are present; unavailable feed leaves the existing cache unchanged.
- No Decision-Kernel coefficients changed. Remaining improvements in these lanes are verification/data dependent rather than safe scoring changes.


### 2026-08-27 PITTI AUTO — independent QB1 market/expert cross-check while rc4.83 kernel frozen
- Used fresh public draft rankings only as independent strategy evidence; no rc4.83 scoring coefficient or frozen OOS hypothesis was changed.
- Andrew Erickson's Aug-26 QB board independently matches his direct answer: Herbert QB4, Caleb QB7, Lawrence QB8. Pat Fitzmaurice has the same trio QB8/QB7/QB9 respectively. Current 3-expert FantasyPros consensus places Herbert/Caleb/Lawrence QB7/QB8/QB9.
- Independent RotoBaller Aug-2026 board also clusters Herbert/Caleb/Lawrence QB7/QB8/QB9, while Goff is QB16, Kyler QB18 and Malik Willis QB21. This strengthens the interpretation that Herbert/Caleb/Lawrence are the primary mid-round upside QB1 tier, whereas Goff/Murray/Willis are later price-dependent fallback/challenger paths rather than interchangeable targets.
- Week-1 evidence available publicly is supportive of Herbert/Caleb/Lawrence as immediately startable (FantasyPros weekly consensus QB5/QB9/QB10), reducing the case for preferring a lower-upside floor QB solely to avoid Week-1 uncertainty if one of the trio is available at acceptable opportunity cost.
- Do NOT double-count Erickson/Fitz rankings plus their direct qualitative answers as separate numeric expert votes. Use direct answers as thesis/context and frozen Expert-v2 ranks as numeric panel evidence.
- User one-QB invariant remains absolute: once QB1 is selected, all other QBs become draft-surface exclusions; Willis becomes FA/watchlist only.
- Practical validation target for Evidence-v2: test whether rc4.83 recognizes Herbert/Caleb/Lawrence at market-appropriate opportunity cost before falling through to Goff/Murray/Willis, while still allowing continued waiting when RB/WR/TE option value dominates.
- Primary rc4.83 OOS gate remains unchanged and uncontaminated.


---

## 2026-08-27 PITTI HANDOFF v105 — CURRENT-STATE CATCH-UP / DURABLE AUTO LOOP / OLD-ERROR RESEAL

### Trigger
User again required an exact transfer audit because repeated chat switches had lost current facts and AUTO repeatedly stopped after one short work package despite explicit long-block instructions. This is treated as a material execution/reliability defect, not as style-only feedback.

### Current authority reverified
- Production/control baseline remains **v11.8.0-rc4.64**.
- **v11.8.0-rc4.82** is the last fully Android-verified authority. Device evidence includes badge, Full-v2 active health, completed roster state and fresh Snapshot version/Frozen-v2 provenance/frozen-weight semantics.
- **v11.8.0-rc4.83** is deployed only as a TEST challenger; it is not promoted and not Android-verified.
- Latest independent package + re-extract boundary remains rc4.78; Library rc4.52 TEST/LATEST aliases remain recovery-only.
- rc4.83 Decision Kernel coefficients remain **FROZEN** pending realistic OOS Evidence-v2.

### OOS / Evidence-v2 transfer lock
- End-roster composition is not Coach-success evidence when user overrides occurred.
- Evidence-v2 stores pre-pick roster positions/counts, frozen candidate board, Coach top, chosen player, override/followedCoach, score/panel deltas and WR6+/WR7+/QB2 flags.
- Pre-mock roster-position undercount bug was already fixed; frozen user-roster rows persist position directly.
- External gate remains: ordinary realistic rc4.83 Android mock -> refresh once after completion -> Erweitert/Sicherung/Pick-Evidenz exportieren -> share JSON.
- No manual pick documentation is required.

### QB qualitative evidence lock
- Andrew Erickson direct answer to the user's exact league question: Caleb Williams / Trevor Lawrence / Justin Herbert as preferred mid/late targets.
- Pat Fitzmaurice direct evidence supports later price-dependent Kyler Murray / Jared Goff / Malik Willis paths.
- Direct answers are qualitative thesis/context and must not be double-counted as extra numeric votes alongside Frozen Expert-v2 rankings.
- User drafts exactly one QB. After QB1 every QB2 is hard-excluded from the user's Coach surface; Willis becomes FA/watch only. Geno Smith and Aaron Rodgers remain hard exclusions.

### Durable AUTO defect fix — contract strengthened
The former rule "parallel inventory before stop" proved insufficient in practice: AUTO could perform one small audit, claim exhaustion and stop. The execution rule is now machine-locked as a repeated loop:

**execute work package -> checkpoint material change -> re-inventory all independent lanes -> execute next package -> repeat.**

- Re-inventory after **EVERY** completed work package; one inventory per AUTO invocation is insufficient.
- A blocked OOS/device/CI lane blocks only its dependent lane.
- Mandatory inventory: decision/evidence validation; regression/release safety; evidence tooling; draft-day failsafe; expert freshness; post-draft/FA; Watcher draft-critical readiness; handoff/checkpoint integrity; independent strategy/current evidence.
- Promise-only responses such as "AUTO läuft", "ich mache weiter", a priority list or status-only recap are forbidden while executable work remains.
- User reminder is never required.
- An external/device/OOS gate becomes a valid interruption only after all independent non-contaminating positive-value lanes are actually exhausted.

### Machine protection
- PITTI_AUTO_PREFLIGHT upgraded with the repeated post-package loop.
- PITTI_EXECUTION_LOCK now carries reinventoryAfterEveryWorkPackage, oneInventoryPerAutoTurnIsInsufficient, promiseOnlyAutoResponseForbidden, and externalGateValidStopOnlyAfterIndependentLaneExhaustion.
- tools/pitti_guardrail_check.mjs now fails if any of those durable AUTO semantics disappear.
- NEW_CHAT_HANDOFF_CURRENT includes the same v105 canary and current rc4.82/rc4.83 boundary.

### Old-error scan
Explicitly kept quarantined absent new causal evidence:
- PairSum/Rolling resurrection;
- fixed roster caps/quotas or starter-maxima-as-roster-caps;
- player-name forcing / blind RB forcing;
- generic Return-v2 retune;
- generic/global QB2 or TE2 bans;
- Superflex/2QB contamination;
- Brown numeric vote in new v2;
- temporary Weisse/Gianni/Bobal pool;
- Draft Sharks double-counting;
- live renormalization of Frozen Expert-v2 weights;
- stale cross-draft duplicate identity;
- prepared/build == Android-verified conflation;
- rc4.80 stale Snapshot version / false Full-v2 DEGRADED semantics;
- treating user overrides/final roster as Coach-quality labels.

### New-chat acceptance
PITTI AUTO remains the only user message required. The receiving chat must load Library command contract/CURRENT/PASS seal/Project State to EOF/handoff/bootstrap/matrix, verify actual repo Execution Lock + repo Project-State EOF and current runtime facts, fail closed on contradiction, and then execute actual continuation work. A "loaded/ready/AUTO runs" response without concrete work is invalid.


### v105 persistence correction — fail closed
The v105 Library reseal bytes were prepared locally from the actual Library files, updated to current rc4.82/rc4.83 semantics, and passed an independent second-pass semantic/hash verification. Persistent upload-back to /Pitti then failed for every file with the same Files bridge error container_session_expired.
Therefore:
- **Do not claim Library v105 is persisted.**
- Library v102/v103 remains stale until a later files.list proves newer bytes.
- Repo-side PITTI_COMMAND_CONTRACTS.json, PITTI_EXECUTION_LOCK.json, PITTI_PROJECT_STATE.md EOF, NEW_CHAT_HANDOFF_CURRENT.md, PITTI_NEW_CHAT_BOOTSTRAP.md, and HANDOFF_COMPLETENESS_MATRIX.md now form a redundant fail-closed recovery layer for new chats.
- A new chat must reconcile stale Library against repo/device facts and must never let an old PASS seal resurrect rc4.76/77 or old AUTO behavior.
- This is an internal Files persistence limitation, not a user-action gate.


---

## 2026-08-27 PITTI HANDOFF v106 — TRANSACTION RESUMPTION / REPO CURRENT RESTORATION

### Trigger correction
User clarified that the preceding `AUTO` was issued inside an active PITTI HANDOFF and therefore meant **resume PITTI HANDOFF at the correct transactional point**, not ordinary development AUTO. Earlier continuation work that treated it as generic project AUTO was a command-state interpretation error. Durable rule: while a PITTI HANDOFF transaction is active, AUTO resumes/finishes that transaction first; only after a PASS seal does PITTI AUTO become ordinary verified takeover/continuation.

### Current facts retained
- production/control rc4.64; last fully Android-verified authority rc4.82; rc4.83 deployed TEST challenger, OOS-pending/not promoted/not Android-verified; rc4.78 latest package+reextract; Library rc4.52 recovery aliases only.
- rc4.83 Decision Kernel remains frozen. User overrides/final roster remain forbidden as Coach-success labels.
- Evidence-v2 + direct roster-position telemetry fix remain current; external gate remains natural rc4.83 Android mock -> refresh -> one-tap Evidence-v2 export.
- Latest QB1 cross-check remains qualitative only and does not contaminate the frozen OOS experiment.
- Durable long-block AUTO semantics and anti-regression quarantine remain unchanged.

### Handoff repair
- Generation advanced to `20260827T154300Z-v106`.
- Added missing repo-side `PITTI_CURRENT_STATE.json` so the command contract no longer references a repo CURRENT that is absent while the Library mirror is stale.
- Regenerated repo `NEW_CHAT_HANDOFF_CURRENT.md` with v106 transaction-resumption canary.
- Reverified main/gh-pages blob parity for app.js, index.html, decision-policy.js, sw.js and manifest.webmanifest before seal construction.
- Library persistence remains fail-closed/stale; do not claim Library v106 persisted unless Files later proves it.

### Exact continuation after PASS takeover
Receiving chat message remains only `PITTI AUTO`. It must verify v106 repo CURRENT/handoff/seal + bootstrap/matrix + Project State EOF against actual runtime/device evidence, then execute concrete continuation work. AUTO must not itself start the interactive rc4.83 mock.


---

## 2026-08-27 PITTI HANDOFF v107 — RECEIVING-CHAT TRANSFER AUDIT / SEAL-VERIFICATION HARDENING

### Audit finding
The interrupted v106 handoff was repo-side sealed with matching hashes, but a fresh receiving-chat audit still found concrete old-error resurrection risks:
1. `PITTI_COMMAND_CONTRACTS.json`, `PITTI_NEW_CHAT_BOOTSTRAP.md`, and the top mandatory block of `NEW_CHAT_HANDOFF_CURRENT.md` did not uniformly require `PITTI_CURRENT_STATE.json` + `PITTI_HANDOFF_SEAL.json` before project work.
2. `HANDOFF_COMPLETENESS_MATRIX.md` still labeled itself “REPO v105”.
3. `PITTI_AUTO_PREFLIGHT.md` retained stale wording that could be misread as permission to reinvent current Expert-v2 weights.
4. Guardrail CI did not trigger on every file that the checker reads, leaving a path where policy/seal state could change without running the gate.
5. The guardrail checker did not itself verify CURRENT/Handoff/Seal generation equality or seal-listed Git blob integrity.

### v107 repair
- Takeover source order now explicitly starts with command contract, CURRENT and PASS SEAL, then preflight/lock/Project-State EOF/handoff/bootstrap/matrix and actual runtime evidence.
- CURRENT / SEAL / handoff generation equality is mandatory and fail-closed.
- Seal-listed Git blob integrity is executable-guarded.
- Completeness matrix advanced to repo v107 and includes generation/hash checks.
- Preflight now preserves frozen current Expert-v2 weights/profile semantics rather than suggesting they are still to be invented.
- CI trigger coverage expanded to CURRENT, SEAL, decision-policy and evidence-analyzer inputs used by the guardrail.
- Historical top-of-file runtime/expert headings are explicitly marked superseded so old 2026-08-26 text is not mistaken for current authority.
- No Decision-Kernel, Return-v2, manager-model, expert-weight, ADP, QB/TE/WR roster scoring or player-specific recommendation change was made.

### Current boundary unchanged
- production/control: rc4.64.
- Android authority: rc4.82.
- rc4.83: deployed TEST challenger, not Android-verified/promoted; Decision Kernel frozen pending realistic OOS Evidence-v2.
- latest package/re-extract: rc4.78.
- Library mirror remains stale/fail-closed; repo/device truth wins.
- external gate remains `ANDROID_RC4.83_REALISTIC_MOCK_THEN_EVIDENCE_V2_EXPORT`.
- AUTO itself does not start the mock.


---

## 2026-08-27 PITTI AUTO — post-v107 independent-lane hardening while OOS kernel remains frozen

### Takeover verification
- v107 CURRENT / Handoff / Seal generation rechecked and identical.
- Seal status PASS, handoff_ready=true, second_pass_pass=true.
- Every seal-listed repo blob SHA re-fetched from current main and matched the seal. No stale-pointer resurrection detected.
- rc4.83 Decision Kernel remains frozen; no scoring coefficient, expert weight, Return-v2 or roster policy changed.

### Release-gate defect found and repaired
Independent release audit found a concrete stale-release path:
- both release-contract workflows still stopped at rc4.82 draft-critical tests even though current deployed challenger is rc4.83;
- package workflow still hard-coded an rc4.82 package filename and artifact name, which could package current rc4.83 bytes under an rc4.82 label.
Repairs:
- rc4.83 draft-critical gate is now mandatory in both release-contract workflows;
- candidate package version is derived from APP_VERSION and cross-checked against index.html/sw.js/manifest.webmanifest;
- package filename is version-derived and shell runs fail-closed.
This does not promote/package rc4.83; it prevents future mislabeled candidate artifacts.

### Evidence-v2 analyzer hardening
The offline analyzer previously accepted any Evidence-v2 appVersion and could call a partial completed mock telemetry-complete if fixture/resolved counts merely matched each other.
It now fails closed unless:
- appVersion is exactly frozen rc4.83 for this experiment;
- draftId and slot exist;
- fixtureCount matches actual fixture array;
- resolvedCount cannot exceed fixtureCount;
- completed mock has exactly 15 own-pick fixtures;
- fixture pick numbers are unique.
rc4.83 regression now guards these analyzer requirements.

### Fresh independent strategy evidence — non-contaminating
Fresh Aug-27 public QB evidence supports the existing tier semantics rather than a kernel change:
- NFL.com current 1QB tiers: Caleb Williams QB5, Trevor Lawrence QB9, Justin Herbert QB11; Jared Goff QB16, Kyler Murray QB17.
- This independently supports Herbert/Caleb/Lawrence as the stronger mid-round upside/startable tier and Goff/Murray as later price-sensitive fallbacks.
- Fresh RB sleeper reporting raises Mike Washington Jr. after Ashton Jeanty's Aug-23 ankle sprain and first-team reps, while Jonah Coleman remains a contingency-upside late RB. Treat as dated research/watch evidence only; do not hard-force or contaminate frozen rc4.83 OOS.
- Superflex search result explicitly rejected from evidence.

### Gate
External OOS gate unchanged: ANDROID_RC4.83_REALISTIC_MOCK_THEN_EVIDENCE_V2_EXPORT.
AUTO itself does not start the interactive mock.


---

## 2026-08-27 PITTI AUTO — v108 second-pass + release-tooling regression closure

### v108 independent read-back
- CURRENT = Handoff = Seal generation `20260827T160500Z-v108`.
- Seal: PASS; handoff_ready=true; second_pass_pass=true.
- All 20 seal-listed repo blob hashes were re-fetched from current main in two independent batches: 20/20 exact matches.
- This closes the fail-closed read-back left open by the prior tool-call limit.

### Additional old-error scan
A second release-tooling pass found that the new rc4.83/package fixes were not yet themselves protected by the PITTI guardrail:
- guardrail did not assert that both release workflows execute rc4.83 draft-critical;
- guardrail workflow path filter did not include PITTI_RELEASE_CONTRACT_V2.md or the two release workflows.
Repairs:
- pitti_guardrail_check now rejects missing rc4.83 release/package gates and resurrection of hard-coded rc4.82 PREINSTALL packaging;
- it verifies package version derivation from APP_VERSION;
- pitti-project-guardrails path filter now triggers on release contract and both release workflows.
No Decision-Kernel or expert-weight change.

### GitHub Actions observation
No workflow-run/status object was returned for the seal commit through the connector. Do not infer PASS from absence. Repository configuration is consistent with GitHub's documented branch+path filter semantics; executable local/CI result remains distinct from static configuration audit.


---

## 2026-08-27 PITTI AUTO — v109 stale-authority scalar removal

Independent post-v108 audit found one more transfer hazard: active `PITTI_EXECUTION_LOCK.json` recovery prose still explicitly called “repo v107 authority” even though CURRENT/Seal had advanced. The actual machine generation checks were newer, but this stale active scalar could mislead a future recovery path.

Repair:
- active fail-closed recovery wording is now generation-generic and points to the newest fully sealed repo generation plus verified device facts;
- completeness matrix advanced to v109 and explicitly rejects stale sealed-generation authority prose;
- no Decision-Kernel, Expert-v2, Return-v2, roster scoring, ADP or player-specific recommendation changed.

v108 prior integrity evidence remains historical: 20/20 seal-listed blobs matched before subsequent guard/checkpoint changes. v109 is the new transfer generation and requires its own seal/read-back.


---

## 2026-08-27 PITTI AUTO — v110 guard/self-consistency + acute-status OOS confound audit

### Guard self-consistency defect repaired
After the v109 seal/read-back, the now-generation-generic Execution Lock exposed a guard mismatch: `pitti_guardrail_check.mjs` still required the old literal phrase “never claim Library v105 persisted”. That would make the guard fail despite the newer, safer generic authority wording. The guard now requires the generic fail-closed phrase: never claim a newer Library generation persisted unless `files.list` proves it.

### Acute-status audit — no frozen-kernel mutation
Current rc4.83 contains one hard acute status overlay: Ashton Jeanty, dated 2026-08-24, with `blockRecommendation=true`. Fresh 2026-08-27 reporting says the ankle sprain is not viewed as long-term, but Week 1 remains uncertain; Raiders coach says he is “on the mend”. Therefore:
- the status is still materially relevant;
- the hard block is a known early-round OOS confound distinct from the WR6+/WR7+ challenger hypothesis;
- do NOT retune/remove it inside the frozen rc4.83 experiment before evidence;
- Evidence-v2 interpretation must separate any Jeanty-affected early decision from the late-WR saturation promotion question;
- pre-real-draft refresh must revisit this dated blocker and must not let it persist silently if recovery/IR information changes.

No rc4.83 Decision-Kernel coefficient, Expert-v2 weight, Return-v2, roster-scoring coefficient or user-QB rule changed.


---

## 2026-08-27 PITTI AUTO — v111 OOS experiment-identity hardening

Fresh same-day injury research still supports treating Ashton Jeanty's ankle as unresolved for Week 1 rather than silently clearing the rc4.83 dated acute overlay. This is observational freshness evidence only and does not mutate the frozen challenger.

Offline Evidence-v2 analysis is now stricter:
- promotion evidence must be from mode=mock and slot=9;
- Jeanty-affected Coach/chosen rows are explicitly flagged ACUTE_STATUS_CONFOUND;
- acute-confound count is reported separately from WR6+/WR7+ and QB2 outcomes;
- rc4.83 regression and PITTI guard both protect these semantics.

Purpose: prevent a current injury overlay from contaminating the causal judgment of the rc4.83 late-WR saturation change. No runtime/Decision-Kernel/Expert-v2/Return-v2 coefficient changed.


---

## 2026-08-27 PITTI AUTO — v111 final seal/read-back + CI observability finding

v111 final seal/read-back completed:
- CURRENT = Handoff = Seal generation 20260827T171000Z-v111.
- Seal PASS; handoff_ready=true; second_pass_pass=true.
- 21/21 seal-listed repo blob hashes independently re-fetched after final seal and matched exactly.

CI observability:
- GitHub connector returns no combined statuses and no workflow_runs for the v111 seal commit even though PITTI Project Guardrails is configured for push/main and PITTI_HANDOFF_SEAL.json is explicitly in its paths filter.
- GitHub documentation confirms branch + path filters are conjunctive and a matching changed path on main is eligible to trigger.
- Absence of a returned run is therefore NOT treated as CI PASS. Static config + seal/read-back are verified; CI execution remains unobserved through the connector.
- Do not weaken the gate or invent PASS. If CI execution becomes release-critical and remains unobservable, resolve through GitHub Actions UI/runner evidence before promotion.

No runtime/kernel/expert-weight change.


---

## 2026-08-27 PITTI AUTO — v112 generation-generic guard closure

After the v111 seal, Project State was intentionally updated with the CI-observability finding, making HEAD newer than the sealed Project-State blob. Before resealing, another anti-stale scan found one remaining executable historical-generation dependency: the PITTI guard still required the literal current-handoff phrase “do not claim Library v105 is persisted”.

That was a regression hazard because deleting or condensing historical v105 prose could falsely fail a future otherwise-valid takeover. The executable guard now checks the generic active invariant instead: the Library mirror is stale/writeback-blocked and may not override newer fully sealed repo/device truth.

v112 contains only checkpoint/guard hardening. No Draft Companion runtime file, Decision Kernel coefficient, Expert-v2 weight, Return-v2 behavior, roster utility coefficient, manager model or user QB rule changed.


---

## 2026-08-27 PITTI AUTO — v113 pre-real-draft freshness fail-closed gate

Independent runtime audit found that the rc4.83 acute-status registry contains a blocking Ashton Jeanty overlay dated 2026-08-24 and that the `asOf` field is informational only at runtime. Because the OOS kernel is intentionally frozen, changing that runtime behavior now would contaminate the experiment; doing nothing would risk carrying an obsolete hard blocker into the real draft.

Added non-runtime tool `tools/pre-draft-freshness-gate.mjs`:
- scans blocking acute-status entries in app.js;
- takes an explicit as-of date and max-age window;
- fails closed when a blocking entry is older than the permitted freshness window or has no date;
- default max age is 2 days;
- is NOT inserted into ordinary rc4.83 CI, so it does not mutate or invalidate the frozen OOS challenger;
- must be run in the mandatory pre-real-draft freshness pass before promotion/live use.

PITTI guardrail protects the presence/fail-closed semantics of this tool, and guardrail workflow path filters include it.

No Draft Companion runtime bytes, Decision Kernel, Expert-v2 weights, Return-v2, manager model, roster utility or user-QB policy changed.


---

## 2026-08-27 PITTI AUTO — v114 emergency fallback executable contract

Parallel draft-day failsafe audit found that Emergency Queue behavior was only indirectly protected by app-source assertions. Added `tools/emergency-queue-contract.mjs`, an independent deterministic contract test for the actual queue builder: 35-entry cap, one QB/TE candidate while QB1/TE1 remain open, zero QB/TE after those positions are filled, draft/version metadata, and explicit K/DST omission. rc4.83 regression and PITTI guard protect the contract, and workflow paths include the test.

No runtime bytes or Decision-Kernel/Expert-v2/Return-v2 coefficients changed.


---

## 2026-08-27 PITTI AUTO — v115 OOS confound isolation

Fresh same-day injury recheck still does not justify silently clearing the frozen rc4.83 Ashton Jeanty blocker: NFL/ESPN/NBC report ankle sprain, not long-term, coach says on the mend, but return/Week-1 timing remains unresolved. No runtime mutation made.

Evidence-v2 offline analysis now explicitly reports clean non-acute-confounded decision metrics in parallel with whole-mock metrics: acuteStatusConfoundCount, cleanDecisionCount, cleanHardQb2Pass, cleanSaturatedWrCount and cleanWr7PlusCount. This prevents a Jeanty-affected early row from contaminating causal judgment of the late-WR challenger. rc4.83 regression + PITTI guard protect these outputs.

No Decision-Kernel, Expert-v2, Return-v2, manager-model or runtime coefficient changed.


---

## 2026-08-27 PITTI AUTO — v116 CRITICAL manager-slot correction / rc4.84

Independent Return-v2 audit found a material stale mapping in `ACTIVE_2026_MANAGER_MAP_TEXT`. The confirmed 2026 order has Basti at slot 5, Björn at 6, Michael K/alias Giuliano at 7, Pascal B/alias Pascal Gelderner at 8. rc4.83 instead forced Björn 5 / Pascal 6 / Giuliano 7 / Basti 8 for every 2026 10-team live/mock, ignoring the editable map. This would distort manager-specific Return-v2 risk and invalidate the intended realistic OOS mock.

Corrected runtime mapping in rc4.84: `1 Michael, 2 Pascal Voerde, 3 Marc Düsseldorf, 4 Thomas, 5 Basti, 6 Bjoern, 7 Giuliano, 8 Pascal Gelderner, 9 Tim, 10 Dutch Marc`. Only mapping + version/cache identity changed; Decision Kernel, late-WR coefficients, Expert-v2, player scoring and Return-v2 algorithm unchanged. Added rc4.84 draft-critical regression and PITTI guard canary for slots 5-8. Deployed main runtime bytes to gh-pages.

IMPORTANT: rc4.83 OOS realistic-mock gate is superseded because its forced manager map was wrong. New OOS challenger is rc4.84 with the same WR-saturation hypothesis plus corrected confirmed manager geometry. rc4.82 remains last Android-verified authority until rc4.84 is device-verified/promoted.


---

## 2026-08-27 PITTI UPSIDE RESEARCH v3 — high-leverage player-ceiling framework

User correctly identified player-ceiling recognition as a likely major competitive edge. Research lane expanded without touching the active rc4.84 mock/runtime.

New non-runtime ledger: `PITTI_UPSIDE_RESEARCH_V3.md`.

Key methodological correction:
- "breakout" is too coarse. Separate WR/TE ASCENSION from CONSOLIDATION (already broke out/flashed, question is persistence), ROLE_TAKEOVER, POST_HYPE and late target-path archetypes.
- RB upside is modeled primarily through opportunity elasticity: current standalone role + number/probability of events needed for a valuable workload.
- ↑↑ requires a materially higher ceiling than price plus a credible short causal path; ↑ covers conditional/consolidation upside; do not reward youth by itself.
- pricing state and invalidators remain mandatory to avoid double counting panel/ADP.

Jameson Williams verified as CONSOLIDATION rather than classic breakout:
- 2025 1,182 yards / first 1,000-yard season.
- current analyst evidence shows a materially stronger Weeks 10-18 usage/efficiency stretch (WR11 PPG, 18.5% target share, 84.7 yards/game, 2.34 YPRR, 21.1% first-read share), but role persistence is uncertain with LaPorta returning and Drew Petzing coordinating.
- intended live wording after post-mock integration: "↑ Konsolidierung · WR2 mit WR1-Wochen, wenn 2025-H2-Usage hält", not generic BREAKOUT.

Priority examples researched:
WR: Parker Washington ↑↑; Emeka Egbuka ↑↑; Carnell Tate ↑↑; Jameson Williams ↑; Tet McMillan ↑; Ladd McConkey ↑; Christian Watson ↑; Luther Burden ↑; Josh Downs/Jalen Nailor late WR2 paths.
RB: Jonah Coleman ↑↑ late; Mike Washington Jr acute ↑↑ while Jeanty unresolved; Keaton Mitchell/Dylan Sampson/MarShawn Lloyd ↑ conditional.
TE: Tyler Warren ↑ health-dependent; Tucker Kraft ↑; Harold Fannin ↑; Isaiah Likely ↑↑ at late price; Brenton Strange ↑ only pending stronger target-hierarchy evidence.

Do NOT integrate into rc4.84 during the active OOS mock. After Evidence-v2 export, rebuild explicit-expiry priors and add end-to-end evidence -> residual -> arrow -> causal-text tests plus top-120 coverage audit.


### 2026-08-27 20:51 CEST — Upside v3 fresh research expansion
Fresh same-day research added without mutating active rc4.84 runtime:
- D'Andre Swift: standalone + opportunity ↑; Monangai knee issue can expand immediate role, but current Round-5 price prevents automatic ↑↑.
- Dalton Schultz: TE target-ascension ↑ after Jayden Higgins season-ending ACL; 82 catches in 2025 + plausible Houston No.2 target path.
- Braelon Allen: role-earner/contingency ↑ after MCL return; Hall contract prevents clean takeover thesis.
- Alec Pierce: conditional alpha-role/health ↑ after Aug-27 PUP activation, 4y/$114m commitment and Pittman trade; Week-1 route readiness remains required.
- Coverage protocol now requires every top-120 draft-relevant WR/RB/TE to receive an Opportunity/Ceiling record, including explicit NO_ARROW outcomes.
- Freshness split into ACUTE <=24h, CAMP_ROLE <=48h, STRUCTURAL and PERFORMANCE; blanket expiry must not silently erase durable evidence.


### 2026-08-27 20:54 CEST — Upside v3 same-day adversarial research pass
Fresh same-day/last-week sources were checked for WR/RB/TE upside and counter-theses. Material refinement: ↑↑ is explicitly residual-value, not raw ceiling. Parker Washington has credible current counter-evidence (late-2025 eruption benefited from BTJ/Hunter availability context), so his initial ↑↑ confidence is reduced pending healthy-depth-chart first-read/route evidence. Carnell Tate likewise requires price-state check because current market has both breakout and fade theses. Mike Washington Jr. must refresh both Jeanty status and ADP because the market is already reacting. Isaiah Likely thesis strengthened by current TE-tier analysis; Warren remains health-gated.

Coverage audit after current mock is now specified for top ~120 WR/RB/TE with positive thesis + strongest counter-thesis + events-needed + pricing + invalidator + explicit expiry. No arrow can be promoted from a single sleeper article.

No rc4.84 runtime mutation.


### 2026-08-27 — Draft Sharks source-weight audit opened (NO runtime mutation)
Created `PITTI_DS_WEIGHT_AUDIT_2026-08-27.md`.
Fresh FantasyPros 2023-25 evidence: Jody Smith DS overall #1 (QB40/RB1/WR13/TE9), Jared Smola DS #7 (QB23/RB14/WR14/TE120), Kevin English DS #13 (QB35/RB37/WR12/TE113). DS family is therefore strong overall, especially consistently strong at WR, but TE evidence is highly heterogeneous. Current public Draft Sharks rankings are a Team 3D projection/value product reviewed by Jared Smola, not proven identical to any individual DS expert's submitted FantasyPros ranks. Individual historical accuracy must not be transferred wholesale to the Team board.

Coleman diagnostic: frozen RB ranks DS222 / Mariano166 / Del Don148 / Fitz126 produce panel175.1. Removing DS and renormalizing the other three gives ~149.85; DS shifts Coleman ~25.25 slots later. Material outlier, not sufficient by itself to downweight DS.

Next research gate: per-position/current-expert historical table + source-influence/outlier audit + draft-zone/archetype stratification + OOS challenger weighting. If DS is accurate overall but systematically conservative on late opportunity backs, prefer Upside-v3 residual correction rather than blunt global downweighting. No active rc4.84 runtime mutation from this audit.


### 2026-08-27 — Expert source-leverage challenger specified
DS audit extended from source reputation to panel mechanics. Historical 2023-25 RB ranks of current source evidence are strong overall (DS family Jody1/Smola14/English37, Mariano11, Del Don7, Fitz40), so Coleman does not justify a DS-specific downweight. Instead define a source-leverage audit: leave-one-source-out center, source-vs-other gap, caused panel displacement, lone-extreme flag, and draft-zone/archetype. Provisional research trigger SOURCE_LEVERAGE_HIGH when a lone source moves a player >=20 overall slots versus renormalized other-source center; this is diagnostic only, not automatic clipping.

Position implications: WR weights directionally supported; RB needs provenance/leverage validation; TE is highest-priority direct validation because DS-family TE history is extremely heterogeneous; QB separately needs rushing-upside policy check. Sean Koerner remains a high-value missing desired source: 2023-25 FantasyPros overall #2, QB4/RB12/WR6/TE15. Do not use incomplete/unverified 2026 reconstruction.

Challenger families to test after current Evidence-v2 analysis: incumbent weighted mean; reliability-shrunk mean; robust capped-leverage center; incumbent + orthogonal Upside-v3 residual. No production weight mutation yet.


### 2026-08-27 — CORRECTION: Weisse/Gianni/Bobal source-lock semantics
- User correction: Ryan Weisse, Guilherme Gianni and Michael Bobal were NOT rejected by a valid marginal-value/A-B expert test. They had previously been introduced opportunistically because rankings were available and displaced intended experts without adequate qualification.
- Therefore the existing wording `Temporary Weisse/Gianni/Bobal pool: rejected/control only; never resurrect from old workflows` must be interpreted narrowly as an anti-regression rule: never restore that temporary trio automatically or merely because rankings are available. It is NOT evidence that any of the three individually lacks predictive/marginal value.
- Ryan Weisse may be reconsidered as a NEW challenger if independent evidence supports him and he passes the same freshness, scoring/season verification, positional historical-accuracy, independence/correlation, source-influence and OOS/marginal-value gates as any other candidate. His historical RB accuracy is qualification evidence, not automatic admission.
- Gianni/Bobal likewise require fresh independent qualification; no inherited positive or negative verdict.
- Availability/API accessibility remains only an acquisition property, never a selection criterion.
- Any earlier note claiming Weisse had already failed PITTI marginal-value testing is incorrect and superseded.


### 2026-08-27 — Expert-v3 challenger design space (user-approved)
- Verified from current rc4.84 UI screenshot: incumbent Expert-v2 effective weights are QB DS35/Mariano25/Del Don20/Boone10/Pat10; RB DS35/Mariano25/Del Don25/Pat15; WR Mariano35/DS30/Pat15/Del Don10/Boone10; TE DS35/Pat30/Del Don25/Boone10.
- User permits 4–6 experts per positional panel. Therefore RB currently has room for up to 2 additional experts; QB/WR have room for 1; TE has room for up to 2.
- DS weight is explicitly open to redistribution if evidence supports it. Do not assume DS35 is optimal; validate the finished DS Team ranking itself rather than inferring its accuracy solely from individual DS analysts.
- Preserve incumbent Expert-v2 unchanged. Any improved composition should initially be added as a separate selectable Expert-v3/challenger preset so incumbent remains available for controlled comparison and rollback.
- Candidate admission remains evidence-first: availability/API access alone never qualifies a source. Weisse may be freshly evaluated; old Weisse/Gianni/Bobal anti-regression lock only prevents unqualified automatic restoration.


### 2026-08-27 — Expert-v3 decision gate reached; stop repetitive screening
- User correctly flagged repeated screening. Broad expert/freshness research is now CLOSED unless a concrete v3 test requires missing data.
- Current app code already contains a generic FantasyPros expert-directory + verified individual/comparison ranking pipeline (`loadExperts`, `loadExpertRanks`, `fetchMultiSourceExpertRanking`, compare reconstruction). Therefore no new acquisition architecture is needed for Weisse/Wolf/Todd/Wright; use existing pipeline when generating v3.
- Fresh public verification: Weisse has current 2026 Half-PPR Overall 08/24 and RB 08/22; Wolf has current 2026 Half-PPR Overall 08/24 and TE 08/25. These are sufficient to proceed to challenger construction; do not re-check their existence/freshness repeatedly.
- Primary v3 candidate roles remain RB Weisse; TE Wolf (+ Weisse only as secondary challenger); QB Todd D Clark; WR Wright only if existing pipeline resolves a current complete ranking, otherwise keep incumbent WR rather than force addition.
- Next substantive deliverable must be a concrete Expert-v3 composition/weight challenger and controlled comparison against frozen Expert-v2, or a precise unavoidable data blocker. Do not return another candidate-screening summary.


### 2026-08-27 — Expert-v3 decision checkpoint (stop repeated screening)
- Broad candidate/freshness re-screening is CLOSED unless a concrete implementation blocker requires it.
- Current evidence-backed roles: Ryan Weisse = RB primary challenger (2023-25 RB #2; current 2026 Half-PPR RB board verified Aug 22); Wolf of Roto Street = TE primary challenger (2023-25 TE #2; current 2026 Half-PPR TE board verified Aug 25); Todd D Clark = QB primary challenger pending exact current-rank artifact; WR = no forced addition, Joey Wright remains high-value only if current ranks can actually be reconstructed.
- Expert-v2 remains immutable control. Expert-v3 must be a separate selectable preset.
- First v3 weight grids to evaluate once exact rank vectors are in hand: RB incumbent DS35/Mariano25/DelDon25/Pat15 vs DS30 + Weisse5 and DS25 + Weisse10 (then only expand if evidence warrants); TE incumbent DS35/Pat30/DelDon25/Boone10 vs DS30 + Wolf5 and DS25 + Wolf10, plus optional Weisse only after Wolf marginal-value test; QB incumbent DS35/Mariano25/DelDon20/Boone10/Pat10 vs DS30 + Todd5 and DS25 + Todd10. Do not optimize on Coleman or any single 2026 player.
- Evaluation target: historical/OOS positional loss + decision-zone stability + source correlation/leverage + tail/breakout behavior. Availability has no positive selection weight.


### 2026-08-27 — AUTO parallelization + artifact blocker resolved
- User requests large uninterrupted AUTO blocks; when expert-v3 work is waiting/blocked, Upside-v3/player research must continue in parallel automatically.
- Previous claim that full Expert-v2 rank vectors were not locatable was false. GitHub recursive tree verification found `expert-v2-board.js` on main; it contains the complete frozen v4 board with weights and per-player individual ranks. This removes the principal v2-v3 comparison artifact blocker. Do not repeat repo-path searching for this artifact.
- Upside-v3 parallel fresh research (Aug 27): FantasyPros breakout evidence strengthens Jadarian Price workload/value, Emeka Egbuka WR1 ceiling, Isaiah Likely featured-target breakout; Draft Sharks Aug22-24 strengthens D'Andre Swift standalone+opportunity case due Monangai knee and strong camp. Rome Odunze current outlook is a useful counterweight: WR2 upside but foot-fracture/new-normal health risk, so no unqualified ↑↑. DS 10-team strategy Aug25 independently supports emphasizing difference-making breakouts/risk-reward in 10-team leagues, consistent with PITTI championship-EV objective.
- Expert-v3 next gate is now exact challenger rank-vector acquisition/import (Weisse RB, Wolf TE, Todd QB) and computed comparison against `expert-v2-board.js`; no user action required yet.


### 2026-08-28 04:43 CEST — long AUTO continuation
- Verified the existing acquisition implementation, not just docs: `expert-v2-audit.html` already contains the exact FantasyPros directory endpoint and filtered single-expert consensus-rank reconstruction (`/nfl/2026/rankings/experts?...` -> `/nfl/2026/consensus-rankings?...filters=<expertId>&experts=show`) plus fail-closed 2026/HALF/OVERALL checks. `expert-board-export.js` exports persisted verified caches. Therefore no new acquisition architecture is needed; v3 should extend this proven path for Weisse/Wolf/Todd/Wright rather than invent another scraper.
- Current FantasyPros directory web result Aug 27 explicitly lists Ryan Weisse updated 08/24 and Todd D Clark updated 08/26, strengthening current-data eligibility. Wolf's public 2026 overall is Aug24; his QB page is updated Aug27. Exact challenger vectors still need execution through the app/proxy path because GitHub itself has no FP credential and public web pages are not a reliable machine artifact.
- This is a genuine runtime boundary: exact API challenger import cannot be completed solely through GitHub connector. Do NOT interrupt user yet: continue parallel Upside-v3/current-player work until a phone/PC runtime action is actually the sole remaining high-value gate.
