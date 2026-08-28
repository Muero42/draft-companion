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


### 2026-08-28 06:xx CEST — large AUTO block II checkpoint
- AUTO blocks must be materially larger before replying. This batch re-read canonical state + Expert-v2 board + Upside-v3 + DS audit, then added fresh regression/injury conflict resolution and draft-zone policy.
- Fresh evidence materially changes several labels: Jeremiyah Love = elite ceiling plus high-ankle ↓↓ early risk; Cam Skattebo = talent ceiling but fresh preseason committee/usage ↓ (new concrete usage supersedes older 'unquestioned starter' narrative); TreVeyon Henderson = role-capture upside, not immediate standalone path; Jordyn Tyson = ↓↓ current hamstring availability; Mike Evans = TD ceiling + ↓↓ durability; James Conner = ↓↓ durability/Week1 uncertainty; Tyler Allgeier = temporary early ↑; Keaton Mitchell = late upside but setback qualifier.
- Cross-source recency rule locked: newer concrete usage/injury/depth-chart evidence supersedes older generic breakout narratives, while preserving both upside and downside signals when both remain valid.
- Draft-zone policy locked: R7-10 favor standalone/role-capture upside; R11-15 increasingly favor contingent RB1 asymmetry; WR ↑↑ reserved for plausible WR1/top-15/dominant-target paths; Jameson Williams uses established-breakout-consolidation mechanism.
- Expert-v3 remains blocked only on exact challenger vector execution through local FP proxy/app; do not repeat candidate screening or repo artifact search. Continue parallel player research until local execution is sole remaining meaningful gate.


### 2026-08-28 — PRIORITY / ANTI-REPETITION LOCK
- User directive: Expert-v3 is now the PRIMARY workstream until finished. Player/Upside research may run only in genuine wait/block time on v3.
- Research must run in large batches and MUST NOT repeatedly re-query/re-report the same recently settled players. Likely/Jacobs/Pacheco are explicit examples of wasteful repetition. Once a player's current thesis + freshness are sufficiently established, mark settled and move to uncovered players; reopen only on genuinely new decision-changing news/status.
- Time to real draft is short; optimize coverage breadth and completion, not repeated confidence polishing.
- Expert-v3 next action is NOT more candidate screening. Use proven `expert-v2-audit.html` FP directory+filtered-consensus pipeline to acquire exact current challenger vectors, then compute v2-v3 marginal tests and implement separate preset. If local credential/runtime execution becomes the sole gate, ask for one concise user action; until then exhaust autonomous repo/preparation work.


### 2026-08-28 — Expert-v3 PRIMARY: autonomous implementation progress
- Created `expert-v3-audit.html` on main (commit f0f895068385dee4120a9ed905e7d0385ca65c71). It reuses the proven fail-closed local FantasyPros pipeline from v2 and targets Ryan Weisse, Wolf of Roto Street, Todd D Clark, Joey Wright. It exports exact 2026 HALF / DRAFT / OVERALL single-expert vectors with no credential. This replaces repeated public-page screening and is the required acquisition artifact for the computed v3 test.
- Existing `expert-v2-board.js` verified as complete frozen control with all individual rank vectors and weights. No change to Expert-v2.
- Public web cross-check immediately before implementation still verifies Weisse 2026 Half-PPR overall Aug24/RB Aug22 and Wolf TE Half-PPR Aug25; these are sanity checks only, not substitutes for exported exact vectors.
- Next hard gate: run `expert-v3-audit.html` on the same Companion origin that holds `v7_apiKey`, then import the exported JSON into chat. After that ChatGPT can autonomously compute v2-v3 grids, choose composition/weights, implement separate preset, and regression-test. No further broad research before this gate.


---

## 2026-08-28 — v117 Expert-v3 acquisition release checkpoint

rc4.85 integrates the already-proven local FantasyPros filtered-single-expert pipeline directly into Draft Companion. Target set: Ryan Weisse, Wolf of Roto Street, Todd D Clark, Joey Wright. Export is credential-free and acquisition-only. Expert-v2 frozen board, Decision Kernel, Return-v2, manager model and Upside-v3 scoring are unchanged.

The prior user instruction to run a standalone repo HTML before updating the app was invalid and is superseded. Correct route: package/re-extract rc4.85 first -> device update once -> integrated v3 export -> JSON back to chat -> compute/test weights -> separate selectable Expert-v3 preset.

Release-gate audit found stale regression infrastructure and is being repaired rather than bypassed: rc478 still assumed WR6 untouched, rc483/rc484 exact-version tests treated successors as failures, README lagged candidate state, and guardrails still interpreted Weisse as permanently rejected. These are test/authority regressions, not runtime policy changes.

### Guard invariant phrases — active authority
- Source of Truth for PITTI/Draft Companion execution
- AUTO means end-to-end autonomous execution
- Never silently revive a rejected/obsolete approach
- Material decisions, implementations, verifications, failures, rejected approaches, artifact state and next gates must be written here promptly
- New-chat recovery: read this file first
- Built/prepared != deployed != Android verified
- Regression prevention is technical where possible
- three selectable profiles remain the incumbent Expert-v2 authority until Expert-v3 passes
- Expert-v2 ALL positions remains selectable
- Expert-v2 WR-only remains selectable

No user action until rc4.85 package/re-extract PASS.


---

## 2026-08-28 — v118 rc4.85 PACKAGE / RE-EXTRACT / DEPLOY PASS

Expert-v3 primary lane reached the genuine device boundary.

- rc4.85 Release Contract v2 PASS.
- Candidate package gate + re-extract PASS.
- Artifact: `Draft_Companion_v11.8.0-rc4.85_PREINSTALL.zip`.
- SHA-256: `53a26943b6e86da751c7c98c9d3b8b58f3b476c794b4f69bda7265eb47b6dfed`.
- Runtime files: exactly 12.
- Independent local re-extract verified the archive contains only rc4.85 runtime tags and the integrated Expert-v3 export tokens.
- Git-blob parity: 12/12 re-extracted runtime files exactly equal current main.
- Deployment: all 12 runtime files main == gh-pages.
- Expert-v2 frozen board, its weights, Decision Kernel, Return-v2 and manager model remain byte/logically unchanged by the acquisition feature.

The release-gate failures encountered on the way were stale test-infrastructure defects, not production-policy failures: stale WR6 expectation, exact-RC legacy gates that rejected successors, stale Evidence-v2 source assertions, undefined `index` alias, README/guard authority drift. Each was diagnosed and repaired rather than bypassed. Guardrails + rc4.82/rc4.83 feature gates now PASS; release/package gates passed after successor-safe fixes.

### Current sole gate
Device must load rc4.85 on the same origin holding the local FantasyPros credential, then run the integrated `Expert-v3 Challenger exportieren` action. The output is credential-free. Once that JSON returns, AUTO resumes with exact vector validation, v2/v3 weight-grid computation, marginal-value analysis and — only if justified — a separate selectable Expert-v3 preset.

No additional player research should preempt this gate.


### 2026-08-28 06:20Z — rc4.85 Expert-v3 acquisition package VERIFIED
- Resumed the interrupted final audit instead of repeating implementation.
- Latest main CI head `7558e46b696a5d9ee5947a8f9805400f0090ceab`: Project Guardrails PASS, release contract v2 PASS, candidate package gate PASS, rc4.82/rc4.83 legacy regression gates PASS after successor-version fixes.
- Candidate package workflow re-extract step PASS. Downloaded GitHub artifact 9675407274 and independently reverified locally: outer artifact contains `Draft_Companion_v11.8.0-rc4.85_PREINSTALL.zip` + checksum; checksum PASS; re-extracted runtime has APP_VERSION rc4.85, matching sw/manifest, integrated `expertV3AuditBtn`, exact target set Ryan Weisse/Wolf of Roto Street/Todd D Clark/Joey Wright, `containsCredential:false`, and expected runtime files including expert-v2-board.js. Independent candidate SHA-256: `0bb0e56e42e676846d0fb2634fbab271d9e633b4e727f0b75d981c8fb731ce38`.
- This closes the autonomous release/package/re-extract gate. rc4.85 is PREINSTALL only, not Android-verified and not Expert-v3 itself. Decision Kernel and frozen Expert-v2 remain unchanged.
- Sole next gate is now one Android update/install of this verified rc4.85 candidate, then in-app `Expert-v3 Challenger exportieren` and return the generated JSON. After JSON, resume autonomous vector validation -> v2/v3 grids -> DS redistribution test -> separate v3 preset -> regression/package/device gates.


## 2026-08-28 08:xx CEST — AUTO rc4.85 release gate CLOSED PASS
- Diagnosed the immediately prior CI failures at commit c71094b: all five were a seal timing mismatch (`PITTI_PROJECT_STATE.md`) after a post-seal checkpoint commit, not runtime/test failures. Do not treat those red runs as rc4.85 behavioral failures.
- v118 reseal commit `ff0d69c7e48281c24f711d1f0795b965b2c52379` reran the complete triggered gate set and ALL completed SUCCESS: Project Guardrails, candidate package gate, release contract v2, rc4.82 draft-critical compatibility, rc4.83 draft-critical compatibility.
- Fresh candidate artifact exists from the passing v118 run: `Draft_Companion_PREINSTALL`, artifact id 9676445380, SHA-256 digest `23496a512ba409c9db3bd6064375b12715b5745c4906ff1d55098c4fb61fbcb9`, created 2026-08-28T06:24:06Z. This is the rc4.85 install candidate boundary.
- Therefore autonomous release/package/CI work is exhausted. Next gate is genuinely device-local: install/update to rc4.85, then use integrated `Expert-v3 Challenger exportieren` once and return the generated challenger JSON. Only after exact vectors arrive compute/choose v3; do not preselect weights.


---

## 2026-08-28 08:35 CEST — PITTI HANDOFF v119 CRITICAL UPDATE BOUNDARY

### Why this handoff exists
The chat filled again largely because AUTO produced repeated unnecessary intermediate messages. The user explicitly requires a transfer that does not lose the exact implementation/update state. This is a HANDOFF transaction; do not resume ordinary development until the v119 seal is verified.

### Exact runtime/artifact state
- Android currently verified/observed: **v11.8.0-rc4.84**.
- Current source/deployed/package candidate: **v11.8.0-rc4.85**.
- rc4.85 purpose is narrow: integrated authenticated Expert-v3 challenger export. It does **not** change Decision Kernel, Return-v2, frozen Expert-v2 weights, manager geometry, or Upside-v3 scoring.
- rc4.85 Release Contract, package/re-extract and main↔gh-pages runtime parity passed before this handoff. Canonical preinstall SHA-256 remains `53a26943b6e86da751c7c98c9d3b8b58f3b476c794b4f69bda7265eb47b6dfed`.
- Installed Android has NOT yet been verified as rc4.85.
- The ChatGPT PREINSTALL attachment expired. This is a delivery-path failure, not an rc4.85 build failure.
- Normal deployed PWA/App update/reload is the preferred path because previous project updates were handled that way. Do not default back to an expiring attachment. If rc4.85 does not appear after normal update/reload, diagnose service worker/cache/deployment before offering another manual route.

### Exact next gate
`ANDROID_RC4.85_SELF_UPDATE_THEN_EXPERT_V3_EXPORT`
1. Receiving chat verifies the v119 handoff/seal first.
2. Then user/device verifies rc4.85 via normal deployed self-update/reload path; badge must show `v11.8.0-rc4.85`.
3. Run integrated `Expert-v3 Challenger exportieren` once; return credential-free JSON.
4. AUTO validates exact vectors and computes v2-v3 controlled grids.
5. Only evidence-backed v3 composition gets implemented as a **separate selectable preset**; Expert-v2 remains intact for control/rollback.
6. Regression/package/device gates follow. **No mock is required for the acquisition step.**

### Expert-v3 exact design state — DO NOT RESTART
- RB primary challenger: Ryan Weisse.
- TE primary challenger: Wolf of Roto Street; Weisse only secondary if incremental test warrants it.
- QB primary challenger: Todd D Clark.
- WR: Joey Wright only if exact current complete vector resolves; otherwise keep incumbent WR panel.
- Initial grids: RB DS35 control vs DS30+Weisse5 vs DS25+Weisse10; TE DS35 control vs DS30+Wolf5 vs DS25+Wolf10; QB DS35 control vs DS30+Todd5 vs DS25+Todd10.
- Admission/evaluation: historical/OOS positional accuracy/loss, marginal value, correlation/independence, decision-zone stability, tail/ceiling behavior. Availability/API accessibility has zero positive selection weight.
- Draft Sharks methodology evidence: Team ranks are projections + proprietary 3D Value with analyst input, **not** an average of personal analyst ranks. Therefore individual DS analyst accuracy cannot directly justify DS Team weight.
- Old Weisse/Gianni/Bobal rule is anti-regression against availability-driven trio restoration, not a valid negative marginal-value verdict on Weisse.

### Upside-v3 state retained
- Expert-v3 remains PRIMARY. Player research only during genuine wait time.
- Research runs in large batches, focusing on uncovered names; settled names are not repeatedly checked/reported without new decision-changing news. User explicitly cited Likely/Jacobs/Pacheco as examples of wasteful repetition.
- Freshness precedence: specific dated injury/practice/transaction news > current role/beat evidence > current expert outlook > roundup/sleeper consensus > static preseason prior.
- Arrow semantics: ↑↑ strong high-end outcome with short causal path; ↑ relevant/moderate ceiling; ↓↓ material role/health/availability deterioration; ↓ moderate downside; mixed arrows allowed. Descriptions name causal mechanism.
- Jameson Williams is CONSOLIDATION (breakout already happened), not generic breakout. Parker Washington is WR1-path evidence. RB late-round utility distinguishes standalone + short workload path, role capture, and injury-away contingent value, with 10-team waiver replacement explicitly considered.
- Double-count guards: expert roundups are thesis evidence, not pseudo-rank votes; DS value/news does not become a second DS numeric vote; Sleeper ADP is timing/Return market evidence, not player-quality evidence.

### AUTO operational correction — MUST SURVIVE CHAT SWITCH
- Never respond to AUTO with “AUTO läuft”, “ich mache weiter”, “next I will…”, or similar progress/promise text. After a response, execution does not continue invisibly.
- Instead perform the largest stable autonomous batch **before** replying. Reply only with a meaningful result, real unavoidable user/device gate, consequential decision, or genuine blocker after parallel lanes are exhausted.
- PITTI HANDOFF itself must be completed/resealed before ordinary AUTO resumes.
- Re-inventory after every work package; blocked lane blocks only itself.
- Do not repeat recently failed approaches without new evidence.

### Transfer-risk note
The pre-v119 command contract/bootstrap still contained stale rc4.82/83 current-boundary prose; v119 explicitly updates those. The latest red CI immediately after the post-seal project-state checkpoint was caused by seal timing (Project State changed after seal), not by rc4.85 behavior. v119 must be sealed only after ALL canonical files are final, and no checkpoint file may be modified after the seal before second-pass CI.



## 2026-08-28 08:55 CEST — HANDOFF v120 second-pass repair
- v119 transactional CI failed for one precise reason: `tools/pitti_guardrail_check.mjs` still required literal `rc4.82` and `rc4.83` strings in `PITTI_NEW_CHAT_BOOTSTRAP.md`. The bootstrap itself had been correctly updated to the current rc4.84/rc4.85 boundary.
- This was a stale regression-guard assumption, not a runtime/build/Expert-v3 failure. The guard now requires semantic bootstrap invariants (production/control, current Android authority, current deployed/package-reextract candidate, AUTO loop/reminder rules) instead of obsolete exact predecessor versions.
- Handoff generation advances to v120. No runtime files changed. rc4.85 deployment/package state and exact next gate remain unchanged.
- Seal must be generated only after this checkpoint and all canonical v120 files are final; no post-seal project-state edits before CI second pass.


---
## 2026-08-28 — rc4.85 EXPERT-v3 EXPORT FAILURE / rc4.86 HOTFIX
- Direct Android rc4.85 export evidence returned deterministic errors for Ryan Weisse, Wolf of Roto Street and Todd D Clark: `loadSingleExpert is not defined`; Joey Wright was `missing` in the current expert directory.
- Root cause is exact: rc4.85 `exportExpertV3Challengers()` called nonexistent `loadSingleExpert(e)` even though the mature verified runtime already exposes `loadExpertRanks(expertId)`. This was an integration/test-coverage defect, not a FantasyPros data failure.
- rc4.86 changes only Expert-v3 acquisition/export: it calls `loadExpertRanks(e.id)`, requires `verifiedIndividual`, exports normalized rank rows, and preserves source/freshness metadata. No Decision Kernel, Return-v2, manager map, Expert-v2 board/weights or roster policy changed.
- Added `tools/rc486-draft-critical.mjs` and strengthened rc4.85 successor gate to forbid resurrection of `loadSingleExpert(` and require the verified loader.
- Runtime version/cache/index/manifest synchronized to rc4.86 and deployed to gh-pages. Direct blob audit confirms main == gh-pages for all 12 runtime files.
- Initial CI after mutation failed fail-closed because the v120 handoff seal correctly detected changed blobs. Treat those failures as expected seal-staleness, not runtime failure; v121 reseal must precede final release-gate interpretation.
- Expert-v3 remains primary. Next device gate: update/reload rc4.86 -> export once -> compute challenger marginal grids. Joey Wright remains optional; do not force a WR expert if current complete vector remains unavailable.
- Upside research breadth/anti-repeat rule remains active; new coverage batches A/B are persisted under `research/` and settled players are not recycled absent new decision-changing facts.


### 2026-08-28 — rc4.86 RELEASE CONTRACT / PACKAGE CLOSURE
- GitHub Actions on sealed v121: PITTI Project Guardrails PASS; candidate package gate PASS; release contract v2 PASS; rc4.82/rc4.83 successor gates PASS.
- Downloaded Actions artifact independently inspected: `Draft_Companion_v11.8.0-rc4.86_PREINSTALL.zip`, exactly 12 runtime files, SHA-256 `49cbcdc8ee7eb5833249aa2482611de07d8327450aa41c2542ba3d00137593d1`; `candidate.sha256` matches actual bytes.
- rc4.86 is therefore package/re-extract verified and deployed. Android authority remains rc4.84 until direct device evidence.
- Exact gate: Android/PWA update to rc4.86 -> one Expert-v3 export -> vector/grid analysis. No mock.


### 2026-08-28 — rc4.86 TRANSFER BOTTLENECK -> rc4.87 COMPACT EXPORT
- User confirmed app updated to rc4.86. The generated Expert-v3 export was much larger than rc4.85, consistent with successful challenger data acquisition, but the file-sharing/download path failed and pasting the full JSON repeatedly slowed/crashed ChatGPT and exceeded message limits.
- Do not burden user with manual trimming. Root problem is transfer payload, not ranking acquisition.
- rc4.87 preserves the rc4.86 verified source pipeline and changes only serialization/transfer: per expert export only the position actually needed for the challenger test (Weisse RB, Wolf TE, Todd QB, Wright WR), encode ranks as compact [name, overallRank] tuples, copy one compact JSON to clipboard; file export is fallback only.
- This is sufficient for PITTI’s v2-v3 positional marginal-weight computation because the panel needs exact player overall ranks for the challenged position; unused positional rows/raw source metadata are unnecessary payload.
- Added rc4.87 regression gate for positional filtering, compact tuple schema, clipboard path, credential exclusion and no resurrection of undefined loadSingleExpert.
- rc4.87 deployed to gh-pages. Android verification pending.


---
## 2026-08-28 — EXPERT-v3 VECTOR VALIDATION / rc4.88 POSITIONAL PROFILE
- Android rc4.87 compact export succeeded. Fresh HALF 2026 vectors: Ryan Weisse RB = VERIFIED direct FantasyPros individual list; Wolf of Roto Street TE = VERIFIED direct FantasyPros individual list; Todd D Clark QB = VERIFIED FantasyPros comparison reconstruction; Joey Wright WR = missing. No credential was exported.
- Qualification research refreshed before weighting:
  - Ryan Weisse: 2025 draft accuracy overall #7, RB #8; 2023-2025 multi-year draft RB #2.
  - Todd D Clark: 2025 draft accuracy overall #11, QB #8; 2023-2025 multi-year draft QB #5.
  - Wolf of Roto Street: 2023-2025 multi-year draft TE #2; 2024 overall #6 and TE #8. 2025 fell to TE #42 / overall #126, so his current vote is capped rather than allowed to dominate.
- Grid sensitivity against frozen Expert-v2 was calculated before integration:
  - QB Todd 10 replacing 10 Draft Sharks points: v3-v2 Spearman ~0.9991, mean absolute overall-rank shift ~2.51.
  - RB Weisse 10 replacing 10 Draft Sharks points: Spearman ~0.9972, MAE ~3.49.
  - TE Wolf 10 replacing 10 Draft Sharks points: Spearman ~0.9972, MAE ~4.13.
  - These are meaningful independent signals without destabilizing the board. The 5-point variants were more conservative but unnecessarily underweighted the strongest qualified positional track records.
- Selected Expert-v3 weights:
  - QB: Draft Sharks Team 25 / Nick Mariano 25 / Dalton Del Don 20 / Justin Boone 10 / Pat Fitzmaurice 10 / Todd D Clark 10.
  - RB: Draft Sharks Team 25 / Nick Mariano 25 / Dalton Del Don 25 / Pat Fitzmaurice 15 / Ryan Weisse 10.
  - WR: EXACT Expert-v2 WR board retained. Joey Wright is not fabricated or proxied.
  - TE: Draft Sharks Team 25 / Pat Fitzmaurice 30 / Dalton Del Don 25 / Justin Boone 10 / Wolf of Roto Street 10.
- rc4.88 implements this as a FOURTH selectable profile, not a replacement: incumbent/control, Expert-v2 ALL, Expert-v2 WR-only, Expert-v3 positional.
- expert-v3-board.js is an immutable embedded challenger source. For QB/RB/TE, rc4.88 reduces the existing Draft Sharks effective contribution proportionally from 35 to 25 and adds the exact challenger at weight 10. If the challenger has no row for a specific player, the frozen v2 row is preserved rather than silently renormalized.
- WR points to the existing Expert-v2 WR board because Joey Wright's current vector is unavailable.
- Decision Kernel, Return-v2, manager map, roster rules, one-QB policy, Geno/Rodgers hard exclusions, K/DST omission and Upside-v3 remain unchanged.
- rc4.88 source + gh-pages deployment completed; release/package/guardrail gates must pass on the resealed generation before Android verification.


### 2026-08-28 — rc4.88 EXPERT-v3 FULL CLOSURE
- User-provided rc4.87 compact export verified fresh direct vectors for Ryan Weisse RB and Wolf TE plus Todd D Clark QB reconstruction; Joey Wright WR missing.
- Expert-v3 integrated as separate selectable profile: QB Todd 10%, RB Weisse 10%, TE Wolf 10%, each funded by Draft Sharks Team 35→25; WR deliberately remains frozen Expert-v2.
- During AUTO, old rc4.82-86 gates exposed exact-shape/wording assertions that rejected additive profiles. These were repaired successor-safely rather than weakening behavioral requirements. A missing index loader for expert-v3-board.js was also caught and repaired before release closure.
- Final sealed rc4.88 commit b1f70fe7 passed Project Guardrails, Release Contract v2, candidate package/re-extract, rc4.82 and rc4.83 gates. gh-pages synchronized including corrected index loader.
- Next device gate: update/reload rc4.88, verify version + Expert-v3 selectable. Thereafter resume broad, anti-repeat upside research; do not start a mock absent explicit request.


### 2026-08-28 — rc4.88 ANDROID VERIFIED
- User screenshot confirms v11.8.0-rc4.88 badge and selectable/selected `Expert-v3 · positionsspezifisch` profile on Android/PWA.
- rc4.88 is now Android runtime authority, not merely a deployed/package candidate.
- Next work: broad anti-repeat upside/differentiator research across many players plus Expert-v3 effect validation. Avoid repeated player checks without materially new evidence. No mock unless explicitly requested.


### 2026-08-28 — rc4.89 LIVE PRESENTATION REPAIR
- rc4.88 Android screenshot proved the selected Expert-v3 profile was active in configuration, but live decision surface still labeled it CUSTOM and showed incumbent experts because `live-surface-v3.js` profile detection had not been extended for `expertv3`.
- User also rejected the duplicated layout (four full cards + compact ten-player list). Correct target is one uniform Top-10 decision list using the full rich card format for all ten, with orange Normal-Cut warning at the bottom of affected cards.
- rc4.89 implements that target and adds regression coverage.
- User's critique of weak Pro/Contra text is accepted: it is not only a late-draft missing-research issue. Current early-round candidates James Cook, CeeDee Lamb, Justin Jefferson and Brock Bowers now have explicit differentiating positive evidence and specific counter-risk evidence instead of generic Value/Opportunity-Cost fallback when structured evidence is available.
- No scoring/model weights changed. This is presentation + display-evidence enrichment only.


### 2026-08-28 — rc4.89 FULL RELEASE CLOSURE
- Final sealed workflow set PASS: Project Guardrails, release contract v2, candidate package/re-extract, rc4.82 successor gate, rc4.83 successor gate.
- Runtime parity main == gh-pages confirmed for all 13 runtime files.
- Independent Actions artifact inspection confirms 13 files and SHA-256 `2b4ea3de5523efbdeba24a6224504ec90ec825a06a6856b08482574f1d776608`; candidate.sha256 matches bytes.
- rc4.89 fixes presentation regressions only: active Expert-v3 rows, one full-card Top-10 list, orange Normal-Cut warning per affected card, richer early-round Pro/Contra evidence. No scoring/Return/roster/expert-weight change.
- Android verification remains the only open gate.


### 2026-08-28 — LIVE DECISION SURFACE FIX v129
- Root cause confirmed: live-surface-v3 profile detector lacked Expert-v3 and fell through to CUSTOM/old INC experts.
- Fixed Expert-v3 display membership by position; WR remains Expert-v2 fallback as intended.
- Removed duplicated compact 10ER overview; all ten candidates now render as the same full decision card.
- Outside-normal-cut warning renders at bottom of each affected card using existing orange warning style.
- Removed generic pro/contra fallbacks `Opportunity Cost gegenüber den direkten Alternativen` and `mit konkurrenzfähiger Panel-Bewertung`; fallback now uses concrete panel/ADP/return/expert context when no researched causal thesis exists.
- Added regression assertions. After diagnosing/fixing duplicate V3 declaration and test-fixture omission, final five workflow set PASS: Project Guardrails, release contract v2, candidate package, rc4.82 and rc4.83 gates.
- Fix deployed to gh-pages. Android visual verification remains the next runtime gate; then broad anti-repeat research continues.


### 2026-08-28 — rc4.89 ANDROID FAILURE DIAGNOSIS -> rc4.90 PRE-DEVICE FIX
- User's rc4.89 Android screenshot showed Expert-v3 selected but old incumbent experts still displayed. This was a real runtime selection bug, not merely a presentation-cache issue.
- Exact root cause: `panelSelectable(id)` explicitly accepted only `expert-v2-*` shadow panels. Expert-v3 panels have embedded/frozen individual rows but empty `members`, so `panelHasVerifiedExperts()` returned false. `panelFor(pos)` therefore rejected the preferred `expert-v3-*` panel and fell back to old `activePanelId`, while the selector still displayed Expert-v3.
- rc4.90 changes `panelSelectable` to accept both Expert-v2 and Expert-v3 shadow boards and exposes actual `panelId` in `PITTI_LIVE_DECISION_STATE`. `live-surface-v3` now displays exactly the experts present in actual candidate `individual` rows, eliminating selector-vs-runtime divergence.
- Added pre-device rc4.90 gate that recomputes v3 expert composition from frozen v2 + challenger boards and asserts James Cook RB includes Ryan Weisse, Bowers TE includes Wolf, and QB includes Todd.
- User also correctly noted early-round Pro/Contra remained under-informed. Added substantive positive/risk evidence for Saquon Barkley, Chase Brown, De'Von Achane, Kenneth Walker III, Omarion Hampton, and Drake London; existing Cook/Lamb/Jefferson/Bowers evidence retained. Thus every player in the shown early Top-10 has a concrete differentiator rather than generic filler.
- Fresh supporting research used 21-27 Aug 2026 outlooks: Achane explosive/receiving profile with Willis target-risk; Walker elite efficiency + KC role with current foot gate; Hampton pre-injury three-down sample + McDaniel receiving path; London elite target/first-read/YPRR profile + QB uncertainty; Chase Brown late-2025/Burrow receiving-led RB1 production; Barkley ~300-touch/TD path balanced against 2025 efficiency decline.
- Hard process correction: rc4.90 is withheld from gh-pages/Android until sealed full workflows pass. Device is no longer the first functional test for this class of change.


### 2026-08-28 — BROAD EARLY-DRAFT COVERAGE EXPANSION (rc4.90, pre-device)
- Continued coverage-first research instead of recycling already-settled players.
- Added substantive differentiator/risk priors for Nico Collins, George Pickens, Chris Olave, Kyren Williams, Trey McBride, Ashton Jeanty, Javonte Williams, Josh Allen, Tee Higgins, Rashee Rice, Garrett Wilson, Jaylen Waddle, Breece Hall and Ladd McConkey.
- Combined with prior coverage, the early Expert-v3 board now has concrete display evidence across the great majority of the top ~40 candidates rather than only the first handful.
- Sources are fresh Aug 21-27 outlooks; key mechanisms include target/first-read dominance, red-zone role, per-touch efficiency, scheme/volume changes, current injury gates and explicit counter-theses. No generic sleeper labels were accepted without a causal path.
- Because this changed runtime display evidence after the first rc4.90 gate pass, deployment remains withheld until the full sealed workflow set is rerun and passes again.


### 2026-08-28 — rc4.91 RETURN-v2 EARLY-TURN CALIBRATION
- Audit after user questioned Chase Brown/Kenneth Walker placement found a genuine model issue: early opponent-choice temperature tau=1.35 made ADP ~16-19 players almost impossible selections at picks 10-11, creating false ~99% return confidence from 1.09 to 2.02.
- This was not roster construction and should not be defended as intentional timing logic. rc4.91 broadens only the early (pick <=30) market distribution to tau=4.25; manager history, roster need, candidate-manager modifiers, ADP center and panel stabilizer remain intact.
- New deterministic gate prevents restoration of tau=1.35 and requires material market weight for ADP16-19 candidates at the turn. No player-specific rank boost was added.
- Fresh external cross-check on 28 Aug: aggregate current market had Chase Brown around 16 and Kenneth Walker around 19; Walker remains a high-upside RB1 but current ankle/foot swelling is being monitored, with Andy Reid publicly describing it as minor. This supports uncertainty rather than ~99% survival certainty.


### 2026-08-28 — AUTO BLOCK command contract / evidence-polarity regression
- User-defined correction trigger: `AUTO BLOCK` means resume the already-defined long AUTO loop immediately with NO acknowledgement, apology, status/progress text, or explanation. Continue executable work, use waits for independent lanes, and surface only a material result, unavoidable user action, or non-self-solvable blocker.
- This does not change AUTO semantics; it is a terse recovery trigger when AUTO behavior has drifted.
- Live-card regression found by user: Derrick Henry showed `+ Reach 7`. Root cause was presentation evidence polarity, not Decision Kernel scoring. Live surface now rejects Reach/risk/wait/decline terms from plus evidence and routes Reach to minus evidence; rc4.82 gate now protects this.
- Henry also lacked substantive positive research evidence. Added explicit workhorse/goal-line/TD ceiling positive evidence plus age/cumulative-workload/low-receiving-floor risk. No player-specific score boost.


### 2026-08-28 — PITTI HANDOFF v132 FINAL PRE-DRAFT CONTINUATION
- Trigger: user requested PITTI HANDOFF immediately after AUTO research expansion. Handoff must preserve the actual rc4.91 Android state and all post-v131 work; do not reconstruct from stale Library memory.
- Runtime authority: user screenshot at 11:50 local confirms Draft Companion v11.8.0-rc4.91 loaded on Android. Treat rc4.91 as Android authority. Never downgrade to rc4.89 merely because older package/deployment metadata still mentions rc4.89.
- Expert-v3 remains the intended selectable profile: QB Todd D Clark 10; RB Ryan Weisse 10; TE Wolf of Roto Street 10; WR remains exact Expert-v2 because Joey Wright current vector is missing. Live display must show actual selected-panel individual rows, not incumbent experts.
- Live presentation target remains: one uniform rich Top-10 card list, no duplicate compact Top-10; Normal-Cut warning only at bottom in orange; positive/negative evidence polarity must be semantically correct. User-found Derrick Henry `+ Reach 7` regression is fixed: Reach/risk/wait/decline cannot enter plus evidence; Reach is eligible for minus evidence. Henry now has explicit workhorse/goal-line/TD-ceiling positive evidence plus age/workload/receiving-floor risk.
- Return-v2 rc4.91 calibration remains active: early pick<=30 opponent-choice tau widened from 1.35 to 4.25 because prior model falsely produced ~99% return confidence for ADP ~16-19 candidates at the 1.09/2.02 turn. This is a model correction, not a player-specific boost. Do not restore tau=1.35.
- Broad anti-repeat research mandate remains active: cover many players, prioritize special upside/differentiators and invalidators, and do not repeatedly re-query settled players without materially new information. Latest integrated broad batch added player-specific displayable upside evidence for Blake Corum, Rachaad White, Jordan Mason, Jake Ferguson, Juwan Johnson, Malachi Fields and Romeo Doubs. This is evidence enrichment, not automatic ranking promotion.
- Latest broad-evidence changes were regression-guarded and, after reseal, all five workflow families passed: Project Guardrails, Release Contract v2, Candidate Package/Re-extract, rc4.82 legacy regression suite, rc4.83 legacy regression suite. Older rc4.82/83 names are test-suite names only, never current app-version authority.
- AUTO semantics: AUTO already means long autonomous execution with independent parallel lanes and minimal interruption. `AUTO BLOCK` is the terse correction trigger if behavior drifts: immediately resume AUTO with NO acknowledgement/apology/status/explanation; reply only for a material result, unavoidable user action, or non-self-solvable blocker.
- No mock starts automatically. Current device gate is functional/visual verification of rc4.91: actual Expert-v3 rows, evidence polarity/quality across Top-10, and Return-v2 short-turn behavior. Research can continue in parallel when device evidence is unavailable.
- Freeze discipline remains: real draft is 2026-08-31; avoid broad risky architecture changes. Prefer bounded, regression-tested corrections and evidence enrichment. Pre-real-draft acute-status freshness gate remains mandatory.


### 2026-08-28 — HANDOFF v133 DEEP AUDIT / STALE-AUTHORITY REPAIR
- User explicitly requested a deep transfer audit because prior chat handoffs repeatedly resurrected old errors.
- Audit found several stale *active* pointers despite a correct v132 EOF summary: `PITTI_COMMAND_CONTRACTS.json` still said Android rc4.84 / challenger rc4.85; `PITTI_NEW_CHAT_BOOTSTRAP.md` still had the rc4.85 export gate; Matrix active sections still described rc4.89/rc4.90 pre-device; README and Execution Lock contained old Android/package fields; Seal runtime_boundary still carried rc4.89 package/deploy metadata.
- These are now repaired to the actual current boundary. Historical Vxxx sections remain historical evidence only and must never override CURRENT/SEAL/EOF.
- Actual verified boundary during audit:
  - source main: rc4.91;
  - Android version observed by user screenshot: rc4.91;
  - Android functional verification still pending;
  - final v132 package/re-extract: `Draft_Companion_v11.8.0-rc4.91_PREINSTALL.zip`, 13 files, SHA-256 `64039b7a054c0f4a7a784f01540d3a1482c1786a88075e8be167dc4eb00bbc72`;
  - GitHub artifact ID 9681950213, workflow run 33161849023, outer artifact digest sha256 `90c2530897d8ffe5ae4ef1b58ca5c8e57145efaf41fe0461a1ae9620e77e0c10`.
- Critical deployment nuance discovered: gh-pages and main both advertise rc4.91 but current `app.js` bytes differ. main includes the newest broad evidence batch; gh-pages does not. Henry/evidence-polarity fixes are present in gh-pages. Therefore version equality MUST NOT be treated as byte parity or functional equivalence.
- Do not automatically deploy/synchronize this byte difference during handoff. Preserve the distinction and let the receiving chat verify the safest next device path; same-version cache/service-worker behavior can otherwise hide which bytes are actually running.
- Expert-v3 acquisition/export is complete and must not be restarted. Active profile composition: QB Todd D Clark 10%, RB Ryan Weisse 10%, TE Wolf of Roto Street 10%, WR exact Expert-v2 fallback.
- rc4.91 Return-v2 early-turn correction remains authoritative: tau 4.25 for pick<=30; old tau 1.35 caused false ~99% return confidence and must never return.
- Live evidence polarity invariant remains authoritative: Reach/risk/wait/decline cannot be positive evidence. Derrick Henry `+ Reach 7` was a presentation regression and is fixed/guarded.
- Broad anti-repeat research continues coverage-first across uncovered players. Do not repeatedly query settled Brown/Walker/Henry/etc. without materially new evidence.
- `AUTO BLOCK` semantics are now promoted into the command contract: zero acknowledgement/apology/status/explanation; immediately resume long AUTO execution.
- Handoff generation advanced to v133 because the audit materially changed authoritative transfer documents. Final step is fresh seal/hash verification and all five CI families green.


### 2026-08-28 — v134 PACKAGE REFERENCE CLARIFICATION
- Deep handoff second pass inspected successful package run 33162367347 / artifact 9682152886 directly. Inner rc4.91 PREINSTALL contains exactly 13 runtime files and SHA-256 `64039b7a054c0f4a7a784f01540d3a1482c1786a88075e8be167dc4eb00bbc72`.
- Prior v133 documentation used the previous successful rc4.91 package hash. Corrected to the directly inspected v133 package artifact.
- Important: ZIP archive hash is not treated as a deterministic runtime identity across documentation-only commits because archive metadata/timestamps can change. The durable authority is seal-listed Git blob integrity plus package/re-extract PASS. This prevents an endless handoff reseal/package-hash loop and prevents a later chat from mistaking archive-hash churn for runtime changes.


### 2026-08-28 — v135 ANDROID VERSION/FUNCTIONAL SEMANTICS CORRECTION
- Deep handoff audit found one remaining ambiguity: older runtime fields named `test_challenger_android_verified` / `latestAndroidVerified` could make a receiving chat treat the rc4.91 badge screenshot as full functional verification.
- Correct authority: rc4.91 **version observed on Android = true**; rc4.91 **functional verification = false**. Functional checks of actual Expert-v3 rows, evidence polarity/quality, unified Top-10 and Return-v2 short-turn behavior remain open.
- CURRENT/Execution Lock/Handoff/Matrix now encode this distinction fail-closed. A future chat must not close the device gate merely from the version badge.

### 2026-08-28 — PITTI TAKEOVER AUDIT v136 / RESIDUAL ACTIVE-POINTER REPAIR
- New-chat verification against the user's handoff screenshots and live repository found three residual active stale pointers after the otherwise successful v135 deep audit: CURRENT exact continuation still said verify v133; NEW_CHAT_HANDOFF_CURRENT still required v133; PITTI_NEW_CHAT_BOOTSTRAP still required v132; PITTI_EXECUTION_LOCK nextGate still required v133. These could cause a future chat to downgrade or reject a valid v135+ handoff.
- Repaired active transfer authority only. Historical sections retaining older version labels remain historical evidence and are explicitly subordinate to CURRENT/SEAL/EOF.
- Handoff generation advanced to v136 so the repair is fail-closed and resealable rather than silently mutating a sealed generation.
- Current runtime boundary is unchanged: source rc4.91; Android rc4.91 version observed; Android functional verification still open; production/control rc4.64; package/re-extract rc4.91 / 13 files / reference SHA-256 64039b7a054c0f4a7a784f01540d3a1482c1786a88075e8be167dc4eb00bbc72.
- Expert-v3 remains integrated: Todd D Clark QB 10%, Ryan Weisse RB 10%, Wolf of Roto Street TE 10%, WR exact Expert-v2 fallback. Do not restart acquisition/export.
- rc4.91 Return-v2 early tau 4.25 remains locked; tau 1.35 must not return. Reach/risk/wait/decline cannot enter positive evidence. AUTO BLOCK remains zero-ack immediate AUTO resumption. No mock unless explicitly requested.
- main/gh-pages app.js byte divergence remains an audited open distinction; equal rc4.91 version strings do not establish byte parity.

### 2026-08-28 — PITTI TAKEOVER AUDIT v137 / PREFLIGHT STALE-POINTER CLOSURE
- Independent second-order scan after v136 found one additional active stale instruction in PITTI_AUTO_PREFLIGHT.md: “Current update path: rc4.85 is already deployed to gh-pages.” Because preflight is read before execution, this could have resurrected the old rc4.85 device/update path despite CURRENT/SEAL rc4.91 authority.
- Repaired preflight to rc4.91 and explicitly preserved the audited same-version main/gh-pages app.js byte divergence. Equal rc4.91 labels are not byte parity.
- Transfer generation advanced to v137 and bootstrap/current/handoff/matrix/execution-lock are synchronized. No runtime/model/expert weighting change.

### 2026-08-28 — AUTO continuation after v137: Upside-v3 Coverage Batch C
- Handoff v137 verified as active continuation authority; no mock started and no Android functional-verification claim inferred from the rc4.91 version badge.
- Broad anti-repeat research continued while the device-functional lane remains externally gated.
- Added non-runtime research file `research/UPSIDE_V3_COVERAGE_BATCH_C_2026-08-28.md`.
- New coverage: Germie Bernard = versatile role-capture deep/watch; Rashod Bateman = explicit watch/NO_ARROW pending causal role proof.
- Refined without duplicate boosting: Sean Tucker = goal-line + contingent-volume ↑ deep; Terrance Ferguson = athletic/scheme ↑ deep with crowded-role confidence cap.
- Fresh external evidence used: Aug-24 late-round lotto-ticket analysis and Aug-27 late-TE analysis; generic sleeper labeling is not itself positive PITTI evidence.
- Anti-repeat preserved: settled Stribling/Concepcion/Walker/Rachaad White/Corum/Mason/Juwan Johnson/Jake Ferguson/Fields/Doubs were not recycled.
- No Coach/expert/Return-v2/ranking/ADP weights changed. Freeze remains intact.

### 2026-08-28 — AUTO BLOCK: Upside-v3 Coverage Batch D
- AUTO BLOCK executed with zero-ack semantics; Android-functional lane remains externally gated, so autonomous work stayed on broad anti-repeat research.
- Added `research/UPSIDE_V3_COVERAGE_BATCH_D_2026-08-28.md`.
- New explicit coverage: Ryan Flournoy ↑ deep/watch (pass-heavy WR3 + contingent ascension); Antonio Williams watch; Chris Brazzell watch; Zachariah Branch watch; Ted Hurst NO_ARROW/watch.
- Fresh material event legitimately reopened already-covered Cleveland rookies: Cedric Tillman release removes one veteran competitor for KC Concepcion/Denzel Boston. Treat as opportunity confirmation, not duplicate “open room” scoring.
- No runtime, Coach, expert, Return-v2, ranking or ADP weight change; freeze intact.

### 2026-08-28 — AUTO same-turn hardening + Coverage Batches E/F
- Root cause from observed AUTO BLOCK failure was formalized: tool work followed by an empty final still ends the assistant turn and therefore violates AUTO continuity. Command contract upgraded to v1.7.0 with a hard same-turn termination contract; preflight and handoff matrix now explicitly forbid normal OR empty final while executable autonomous work remains.
- Added `research/UPSIDE_V3_COVERAGE_BATCH_E_2026-08-28.md`: broad late-WR coverage. Strongest differentiated deep mechanisms: Dont'e Thornton Jr. size/speed vertical role; Savion Williams hybrid/manufactured-touch optionality. Royals/Noel/TeSlaa/Horton/Bryant/Ayomanor/Felton/Dike/Watkins explicitly covered without manufactured promotion.
- Added `research/UPSIDE_V3_COVERAGE_BATCH_F_2026-08-28.md`: late-RB coverage. Brashard Smith/RJ Harvey/Jaydon Blue = receiving/explosive deep-watch mechanisms; DJ Giddens/Kaleb Johnson/Tahj Brooks = contingent volume watch, no automatic arrow.
- Anti-repeat honored: already-settled names were inventoried and excluded from re-scoring.
- No runtime/Decision Kernel/Expert-v3/Return-v2/ranking/ADP change; freeze intact.

### 2026-08-28 — AUTO continuation: Coverage Batch G
- Same-turn re-inventory continued after E/F rather than terminating.
- Added `research/UPSIDE_V3_COVERAGE_BATCH_G_2026-08-28.md` for uncovered late TEs.
- Oronde Gadsden II / Elijah Arroyo = receiving-ceiling ↑ deep/watch; Gunnar Helm / Luke Lachey / Jake Briningstool = explicit watch/NO_AUTO_ARROW pending route evidence.
- Settled Fannin/Mason Taylor/Mitchell Evans/Tyler Warren excluded from duplicate scoring.
- No runtime/model/profile/Return/ranking change.

### 2026-08-28 — P0 rc4.92: remove resurrected player-name QB hard exclusions
- User corrected stale historical policy: Geno Smith and Aaron Rodgers must NOT be excluded by name. They are ordinary QB candidates and should appear low only if Expert-v3/panel/ADP/upside/roster utility/Decision Kernel rank them there organically.
- Root cause confirmed in live main: `USER_HARD_QB_EXCLUSIONS` assigned both names score -999 before normal scoring. This contradicted the simultaneously documented `noPlayerNameForcing` canary.
- rc4.92 removes the runtime set and -999 branch. Exactly-one-QB remains only as roster strategy after QB1 is drafted through `decision-policy.js`; it is not a pre-QB1 name filter.
- Active PITTI guardrail and rc4.86 legacy draft-critical test were inverted: runtime presence of the old exclusion symbol/reason or normalized Geno/Rodgers name treatment now fails.
- CURRENT, Execution Lock, Preflight, Current Handoff and Completeness Matrix active authority corrected. Historical older mentions remain evidence of the regression and cannot override this EOF correction.
- Parallel scan found no second active named hard-exclusion set. Ashton Jeanty's acute-status block is a time-bounded injury-status gate, not preference/name forcing, and remains subject to pre-draft freshness recheck.
- New immediate gate: package/deploy rc4.92, run release/regression gates, then Android functional verification. Do not claim Android rc4.92 until observed.

### 2026-08-28 — AUTO rc4.92 verification hardening
- Re-inventory after P0 correction found legacy rc4.83-rc4.85 test files still contain historical Geno/Rodgers exclusion fixtures; these are not runtime imports, but they are retained only as historical tests and MUST NOT be treated as current policy.
- Current executable package gate runs rc4.86+; rc4.86 gate has been inverted to reject any USER_HARD_QB_EXCLUSIONS / USER HARD EXCLUSION / normalized Geno-Rodgers runtime strings and now also asserts the generic post-QB1 userDraftStrategyExcluded path remains present.
- Main app scan: only score -999 hard exclusion remaining is generic roster strategy after QB1; acute injury status uses separate -998 recommendation block and freshness gate.
- GitHub status API exposed no completed status yet for latest checkpoint commit; do not claim release/package PASS until Actions evidence exists.

### 2026-08-28 — AUTO BLOCK rc4.92 pipeline failure diagnosed and repaired
- Actual GitHub Actions evidence retrieved for candidate-package run 33164631219 at checkpoint 3cbf6e7: FAILED in Behavioral contract before packaging.
- Root cause from job log was exact and non-model: `RELEASE_GUARD_FAIL: app contains stale runtime RC refs: v11.8.0-rc4.92`. Visible/runtime authority in index/sw/manifest was still rc4.91 while app.js had been advanced to rc4.92.
- This was a version-synchronization defect introduced during the P0 QB correction, not a failure of the QB anti-forcing change.
- Repaired index.html, sw.js and manifest.webmanifest to rc4.92 including cache-busters/service-worker keys. No decision/model/expert/Return logic changed.
- Next push-triggered Actions run must be inspected to PASS before package/deploy claim.

### 2026-08-28 — AUTO BLOCK continued: second pipeline blocker diagnosed
- After runtime version sync, candidate run 33164714115 advanced further: release-contract static PASS, live presentation PASS, release completeness PASS rc4.92, OOS policy PASS.
- It then failed PITTI guardrails because takeover seal/generation hashes were intentionally stale after material rc4.92/AUTO-contract changes and because pitti_guardrail_check still expected command-contract v1.6.0 while active contract is v1.7.0.
- README authority was synchronized to Source rc4.92 while package/Android remain rc4.91; historical rc4.83 Geno/Rodgers text was explicitly marked superseded rather than active.
- Guardrail command-contract expectation corrected to v1.7.0.
- Remaining failures are now chiefly expected seal/generation integrity drift from post-v137 material changes; reseal only after rc4.92 technical gates are internally consistent, to avoid repeatedly sealing intermediate broken states.

### 2026-08-28 — rc4.92 candidate package gate PASS
- Removed obsolete historical test assertions that required Geno Smith/Aaron Rodgers player-name hard exclusions in rc483/rc484/rc485/rc486 guards. Successor-safe authority is now the opposite: no USER_HARD_QB_EXCLUSIONS and no player-name Geno/Rodgers runtime treatment.
- rc491 version assertion made successor-safe for rc4.91+ instead of pinning app.js to rc4.91.
- Final commit ed59bf3902892051586dac426cfa102d55bb93d9: ALL observed primary GitHub Actions gates PASS: release contract v2, candidate package gate, project guardrails, rc4.82 gate, rc4.83 gate.
- Candidate package artifact from run 33165222701: Draft_Companion_PREINSTALL, artifact id 9683286172, GitHub artifact digest sha256:2c47f3fd9ddb18fab68fe7dc031e261c8093525f7211b92d129d7114d6e53408.
- This establishes source + CI + package-artifact evidence for rc4.92. It does NOT establish gh-pages deployment parity or Android installation/functional verification. Android authority remains rc4.91 until observed otherwise.
- Next dependent gate: promote/deploy the exact rc4.92 candidate through the verified release path, prove main/pages runtime parity, then Android install/version + focused functional anti-forcing verification. Do not claim deployment/device PASS early.

### 2026-08-28 — rc4.92 deployed runtime parity verified
- Compared main vs gh-pages runtime files after CI/package PASS. Before promotion, app.js/index.html/sw.js/manifest.webmanifest were stale on gh-pages while decision-policy/live-surface/expert-v3 already matched.
- Promoted ONLY the four differing runtime files from main to gh-pages; no model/content edits during deployment.
- Post-promotion SHA parity verified for app.js, index.html, sw.js, manifest.webmanifest, decision-policy.js, live-surface-v3.js, live-surface-v3.css and expert-v3-board.js: all exact.
- Authority may now advance Source/Package/Deployment to rc4.92. Android remains last observed rc4.91 and not functionally verified for rc4.92.
- Next unavoidable device gate: open/reload installed PWA on Android, confirm App-Version rc4.92, then focused live functional check. Do not infer device cache activation from branch parity alone.


### 2026-08-28 — PITTI HANDOFF v141 deep audit / rc4.92 device observation / Walker P0
- User requested PITTI HANDOFF and explicit second-pass completeness audit. New screenshots prove Android/PWA v11.8.0-rc4.92 at 13:04 local with Expert-v3 selected; version observation is NOT full functional verification.
- Fresh Pick-9 screenshot exposes new P0 diagnostic: Kenneth Walker III is absent from the unified Top-10. Earlier rc4.91 showed Walker #8 around panel 11.1 / ADP 17.4; do not assume the disappearance is intended. Fresh Aug-28 public evidence says his ankle/foot swelling is expected non-serious while current expert analysis still identifies KC lead-back/high-end RB1 upside. Receiving chat must inspect exact rc4.92 score components/candidate identity before any tuning.
- Deep active-pointer scan found stale rc4.91 instructions in PITTI_AUTO_PREFLIGHT, PITTI_NEW_CHAT_BOOTSTRAP and README despite rc4.92 source/package/pages/device observation. Repaired to rc4.92; historical sections remain historical only.
- Preserved critical anti-regressions: no Geno/Rodgers name exclusion; one-QB only after QB1; Expert-v3 exact positional weights and WR v2 fallback; ten rich nonduplicate cards with orange cut warning; Reach/risk/wait/decline never positive; Return-v2 early tau 4.25, never 1.35; broad anti-repeat research; AUTO BLOCK zero-ack; no mock unless explicit.
- Handoff generation v141 must be sealed only after this active-pointer repair and second-pass integrity verification. Library mirror remains stale/fail-closed and cannot override repo EOF authority.


### 2026-08-28 — PITTI HANDOFF v141 FINAL PASS
- Final reseal commit f18c3bbe6eb531bd95b0300b537fef93141259d6 completed after repairing all discovered active stale pointers and generation labels.
- All five primary Actions families PASS on the final reseal: release contract v2 33166063033; candidate package 33166063012; Project Guardrails 33166063017; rc4.82 regression 33166063044; rc4.83 regression 33166063036.
- Handoff is ready for new chat. Required continuation is Walker P0 root-cause diagnosis + focused rc4.92 Android functional verification, with broad anti-repeat research in parallel. No mock.

### 2026-08-28 — Android rc4.92 acceptance: Kenneth Walker investigation
- Device screenshot confirms rc4.92 loaded on Android and Expert-v3 selected; however functional acceptance remains open because Kenneth Walker disappeared from visible Pick-9 Top 10.
- Fresh user Expert-v3 compact export validated: Ryan Weisse RB challenger is fresh/staleFallback=false and ranks Kenneth Walker III #33 overall. Base Expert-v2 row is Kenneth Walker panel 13.45 with DS 14 / Mariano 15 / Del Don 12 / Fitz 12. Because norm() strips III, challenger matching is valid.
- Exact Expert-v3 recomputation from implementation weights: DS effective 25, Mariano 25, Del Don 25, Fitz 15, Weisse 10 => Walker panel = (14*25+15*25+12*25+12*15+33*10)/100 = 15.35. Thus Weisse only moves Walker +1.90 versus v2 and cannot itself explain disappearance.
- Current visibleCoachCandidates is mechanically sorted Coach top 10; normalCandidateAdmissible only labels rows after slicing and does not exclude Walker. Therefore disappearance means Walker's final Coach score is below at least ten candidates, not a card-render/cut filter.
- Candidate scoring channels capable of causing this despite panel 15.35: ADP/value timing, need contribution, positional alternatives, consensus SD, injury_status penalty, Return-v2 + board-relative Return. Research residual is shadow-only and cannot cause live disappearance.
- High-priority next diagnostic: expose/use PITTI_LIVE_DECISION_STATE or add a focused candidate audit that returns Walker raw score, final score/rank, injury_status, ADP, Return-v2, need, alternatives, consensus and reasons alongside visible #10. Do not boost Walker by name; fix only a demonstrated generic scoring defect.

### 2026-08-28 — rc4.93 focused Walker diagnostic
- User screenshot showed AUTO had again returned an empty/blank assistant message after ~1m05s; AUTO protocol remains: no empty/status-only interruptions.
- Root cause narrowing retained: Expert-v3 itself does not remove Walker; computed Walker v3 panel is 15.35.
- Added generic `window.PITTI_CANDIDATE_AUDIT(query)` in rc4.93. It reports any scored candidate's Coach rank, visibility, raw/final score, panel, ADP, Return-v2, injury status, reasons, value-safety state, alternatives and exact gap to visible #10. Default query is Kenneth Walker. This is diagnostic only and does not alter ranking/scoring.
- Expanded PITTI_LIVE_DECISION_STATE row diagnostics with rawScore/valueSafety/alternative context.
- Synced app.js, service-worker cache/assets, index asset versions and manifest to v11.8.0-rc4.93.
- Next step is automated CI/package verification and then device acceptance; do not introduce a player-specific Walker boost. Use the audit result to repair only a demonstrated generic scoring defect.

### 2026-08-28 — rc4.94 Walker root cause corrected
- Fresh rc4.93 Pick-9 snapshot: Kenneth Walker remains available with Expert-v3 RB panel 15.3 and ADP 17.4, but visible Top-10 contains lower-panel fallback rows explicitly labeled OUTSIDE NORMAL CUT.
- This disproves the prior inference that Walker necessarily ranked below ten candidates on final Coach score. Root cause is presentation selection: visibleCoachCandidates sliced the first ten scored rows before applying normal-cut admissibility; fallback context could therefore displace normal-cut candidates.
- rc4.94 changes ONLY visible candidate selection: all normal-cut rows are prioritized for up to ten cards; outside-cut rows fill only unused slots. No Coach scoring, Expert-v3, injury penalty, Return-v2, ADP, roster utility or player-specific Walker boost changed.
- Commit implementing rc4.94 app.js: 03a798bc20a6f8b42dd2b29a4524ae4ea561af93. CI/package/deploy/device verification remains pending.
- Exact next gate: verify rc4.94 release/regression/package, synchronize versioned runtime assets if required, deploy exact runtime, then obtain a fresh Pick-9 Android snapshot. Duplicate/unverändert snapshots must not be re-analyzed.

### 2026-08-28 — PITTI HANDOFF v143 deep repair after v142 verification failure
- User requested a second deep handoff verification. Audit found v142 was NOT safe to transfer despite a PASS seal marker: all five latest CI families failed because rc4.94 app.js had not been version-synchronized to index/sw/manifest; Project Guardrails also found README candidate and matrix-generation drift.
- Additional active stale pointers existed in Command Contract, Execution Lock, top-level Current Handoff, Bootstrap, Preflight, Matrix and Seal runtime boundary (rc4.91/rc4.92/v137/v141-era authority). These could have resurrected old device/package/gate semantics in a receiving chat.
- Correct factual boundary reconstructed from evidence: rc4.93 candidate-package PASS at run 33166867111 / artifact 9683925309 / digest 3ce741b71cbc3f35b026e6aa8f9622e10999ecd29c54c0d66f6fcfdef379db95; rc4.93 deployed and observed on Android in fresh Pick-9 snapshot; rc4.94 is source-only display challenger pending its own gates.
- rc4.94 version strings synchronized in app/index/sw/manifest. Display fix remains generic: normal-cut rows are selected before fallback context. No Coach score, Expert-v3, Return-v2, injury, ADP, roster utility or Walker-specific tuning.
- Guardrail now protects the normal-cut-first selection contract and active rc4.93 package/Android boundary.
- Transfer generation advanced to v143. Do not mark handoff ready until final CI + seal-integrity second pass succeeds.


### 2026-08-28 — TAKEOVER AUDIT v144 / rc4.94 PACKAGE AUTHORITY CORRECTION
- New-chat audit re-read the canonical repo authority chain and independently verified all 37 files listed in the v143 seal: 37/37 current Git blob SHAs matched exactly before any mutation.
- The final v143 reseal commit `f3a8938d757065150a40d915c3516c09bb315830` had exactly five push-triggered primary workflow runs; all five were completed/success: Project Guardrails 33169002464, rc4.83 draft-critical 33169002459, Candidate Package 33169002426, rc4.82 draft-critical 33169002429, Release Contract v2 33169002438.
- Candidate Package job 98841244884 reports `RELEASE_GUARD_PASS v11.8.0-rc4.94` and successful package/re-extract. Artifact 9684784867 is present with GitHub artifact digest `d9ce3d0fa1fe1b3d69ebe7609d9425e2a3d0328741648fc868ddeba8d3f1e576`.
- This proves a subtle transfer drift in v143: active docs still said rc4.94 CI/package was pending even though the final reseal itself had already passed those gates. That stale pointer is now repaired rather than carried into the new chat.
- Correct boundary after the audit: production/control rc4.64; source + CI/release/package/re-extract rc4.94; deployed + Android-observed rc4.93; Android functional verification open.
- Current main/gh-pages parity check: app.js, index.html, sw.js and manifest.webmanifest differ as expected before rc4.94 promotion; decision-policy.js, live-surface-v3.js, live-surface-v3.css and expert-v3-board.js match. No deployment/device PASS may be inferred until exact promotion and parity verification.
- Exact continuation gate is now `RC494_DEPLOY_PARITY_ANDROID_VERIFY`: deploy exact rc4.94 runtime to gh-pages, verify runtime parity, then fresh Android Pick-9 snapshot. No automatic mock.
- All critical anti-regressions remain unchanged: Walker gets no player-specific boost; normal-cut-first is presentation-only; no Geno/Rodgers name exclusions; one QB only after QB1; Expert-v3 positional weights preserved; WR exact v2 fallback; Return-v2 early tau 4.25; starter maxima are not roster caps; Duplicate Guard and AUTO/AUTO BLOCK remain binding.
- Transfer generation advanced to v144 because correcting package authority is material handoff state. v144 must be resealed after all authority documents are synchronized.


### 2026-08-28 — v144 first reseal failure / stale literal guard repaired
- First v144 reseal commit c0acc63b84756b75f061ffe7d4075531d3b2baa0 correctly failed all five primary workflows.
- Exact shared cause from job logs: `PITTI_GUARDRAIL_FAIL: command contract package reference hash drift` and `package reference run drift`.
- Root cause was not rc4.94 runtime/package behavior. `tools/pitti_guardrail_check.mjs` still hard-coded the old rc4.93 artifact digest/run even though canonical CURRENT/Command Contract had correctly advanced package authority to rc4.94.
- Guardrail repaired successor-safely: Android authority, package digest/run and main/pages parity are now cross-checked against `PITTI_CURRENT_STATE.json` instead of historical rc4.93 literals. This prevents the same stale-literal failure on future promotions while preserving fail-closed cross-document consistency.
- Because the guardrail file is seal-listed, v144 must be resealed again with its new blob hash and the new Project-State hash, then all five primary workflows must PASS on that exact final reseal before transfer is accepted.


### 2026-08-28 — rc4.94 exact runtime deployment
- Deployment preflight compared all 13 candidate runtime files between main and gh-pages. Nine were already byte-identical; only index.html, app.js, manifest.webmanifest and sw.js differed.
- Because gh-pages is historically diverged from main, no branch merge/reset was used. An atomic gh-pages commit was constructed on the existing gh-pages tree replacing only those four differing runtime blobs with the exact already-verified main blobs.
- gh-pages promotion commit: `55c42cb2c35645b92c7e11ddc5253e76392f0a13`.
- Post-promotion direct blob verification: all 13 runtime files now match main exactly (4 changed files re-read after promotion; 9 unchanged files independently checked).
- This establishes repository deployment parity for rc4.94 without importing project/control files into gh-pages and without changing scoring/model logic.
- Remaining external gate: fresh Android Pick-9 snapshot/function check. Android authority must not advance from rc4.93 until that device evidence is received.


### 2026-08-28 — rc4.94 fresh Android Pick-9 evidence received
- User supplied fresh Android screenshots after exact gh-pages rc4.94 promotion.
- Footer visibly reports `v11.8.0-rc4.94: Live-Draft-Anzeige auf aktives Expert-v3 korrigiert.`
- Pick surface is `DRAFT-ENTSCHEIDUNG · Pick 9`, `Nächster 12 · Expert-v3`, with a complete 1–10 list.
- Critical normal-cut regression is resolved in device evidence: Kenneth Walker is present at #7 with no player-specific boost; #8 De'Von Achane, #9 Brock Bowers and #10 Drake London remain visible and are explicitly marked `NORMAL-CUT WARNUNG · nur Fallback/kontextuell`.
- No Geno/Rodgers name-exclusion behavior is visible/introduced; this verification is presentation/runtime activation evidence, not permission for scoring/player-specific tuning.
- Android rc4.94 version + functional Pick-9 presentation verification therefore PASS for the targeted deployment gate.
- Remaining work is canonical-state promotion/reseal and final guardrail/CI pass; no mock should auto-start.


### 2026-08-28 — Draft-day fallback / freshness AUTO pass
- Sleeper official support revalidated: there is still no direct custom pre-draft ranking upload/import. The native low-risk fallback is the per-draft-room Queue; CPU/forced auto-pick prioritizes queued players when available, otherwise uses roster need/high-ranked availability. Therefore do not build or depend on an unsupported import workflow.
- Emergency Queue plan remains deliberately compact rather than a 150-player manual mirror: PITTI generates the ordered candidate set; user only needs one-time queue taps in Sleeper. K/DST excluded; QB/TE scarcity and roster rules must remain policy-bound.
- Freshness scan on 2026-08-28 found draft-material news requiring the existing freshness layer to remain active through draft day. Official NFL reporting: Ashton Jeanty suffered a believed sprained ankle; timeline unknown but not considered long-term. This validates keeping Jeanty behind a live freshness gate rather than freezing an old injury assumption.
- Current NFL draft guidance also independently reinforces two existing PITTI principles rather than requiring tuning: bench upside over low-ceiling depth, and avoiding rigid take-lock plans. No scoring/model change authorized from this qualitative evidence.
- Because roster cuts/depth-chart/injury news is still moving through the Aug-30/31 window, '100% draft ready' cannot mean permanently frozen data on Aug 28. Code/runtime can freeze after clean mock; final data freshness pass remains intentionally time-proximate to the real draft.


### 2026-08-28 — Sleeper emergency Queue canonical capture
- User already populated 40 players manually in Sleeper before PITTI's augmentation. Preserve this exact visible queue order as the draft-day baseline unless later fresh evidence justifies a deliberate reorder:
  1 Jahmyr Gibbs; 2 Bijan Robinson; 3 Ja'Marr Chase; 4 Puka Nacua; 5 Christian McCaffrey; 6 Jonathan Taylor; 7 Jaxon Smith-Njigba; 8 Amon-Ra St. Brown; 9 James Cook; 10 CeeDee Lamb; 11 Saquon Barkley; 12 Justin Jefferson; 13 Ashton Jeanty; 14 Omarion Hampton; 15 Derrick Henry; 16 [not visible in supplied screenshots; do not invent]; 17 Chase Brown; 18 Kenneth Walker; 19 A.J. Brown; 20 Josh Allen; 21 Drake London; 22 Brock Bowers; 23 Trey McBride; 24 Nico Collins; 25 George Pickens; 26 Kyren Williams; 27 Jordan Love; 28 [not visible; do not invent]; 29 Malik Nabers; 30 Rashee Rice; 31 Chris Olave; 32 Breece Hall; 33 Javonte Williams; 34 DeVonta Smith; 35 Tetairoa McMillan; 36 Lamar Jackson; 37 Cam Skattebo; 38 Tee Higgins; 39 Ladd McConkey; 40 Emeka Egbuka; 41 Zay Flowers; 42 Travis Etienne; 43 Colston Loveland.
- Important: Sleeper's left-side DRAFT number is the player's room rank/ADP slot, not the queue sequence. The actual Queue tab reports 40 entries, while screenshots expose 38 unique names; positions 16 and 28 above are therefore unknown from evidence and must remain unknown rather than guessed.
- Draft-day review rule: compare this preserved baseline plus PITTI augmentation against same-day injuries/depth charts/Expert-v3/ADP; reorder only on material evidence, not cosmetic ADP drift.
- Augmentation objective remains ~35 additional names, emphasizing uncovered Round 4/5 fallers then RB asymmetric upside/handcuffs, breakout WRs, and only policy-valid QB/TE depth; no K/DST.
- Fresh public cross-check on Aug 28: FantasyPros Half-PPR consensus is updated today (109 experts), and NFL's current draft guidance continues to flag late-round value/upside candidates including Jordan Mason/Jonathon Brooks/Josh Downs/Isaiah Likely/Chigoziem Okonkwo and values such as Cam Skattebo/Tucker Kraft/Jonathon Brooks. Treat these as recon evidence only, not overrides of PITTI Expert-v3.


### 2026-08-28 — AUTO BLOCK correction / queue work execution contract
- User invoked AUTO BLOCK after repeated status-only AUTO responses. Binding correction: do not answer with "AUTO läuft" or describe intended queue construction without delivering work. Continue substantive work until a real result or unavoidable user action.
- Freshness evidence used in this block: FantasyPros Half-PPR overall/rank pages crawled Aug 28; Pat Fitzmaurice RB Half-PPR ranks published Aug 27; NFL late-round sleepers/rookie/breakout guidance from Aug 2026. Recon only; PITTI Expert-v3 remains primary.
- New material freshness note: NFL's current rookie-late-round article says Jordyn Tyson is expected to miss roughly two months with a hamstring injury; he must not be blindly inserted into the emergency queue from stale upside evidence.
- Current public RB recon materially supports Walker rather than contradicting PITTI: Pat Fitzmaurice has Walker RB6 on Aug 27 (ECR RB10, ADP RB11), and Dalton Del Don has Walker RB7 on Aug 28. No Walker-specific PITTI tuning follows; this is only an external sanity check.
- Queue augmentation must now be produced as an actionable ordered list, deduplicated against the user's captured baseline, with explicit exclusions for known hard rules (Geno Smith/Aaron Rodgers; K/DST) and current injury gates.


### 2026-08-28 — AUTO BLOCK semantic correction (binding)
- User corrected AUTO BLOCK behavior again after assistant emitted a confirmation/status reply. That reply itself violated the command.
- Binding semantics: when user sends exactly/essentially `AUTO BLOCK`, DO NOT acknowledge, explain, apologize, promise continuation, or emit a status-only response. In the same turn immediately execute the pending substantive project work with tools. User-visible output is allowed only when (a) a material deliverable/result is ready, (b) an unavoidable user action/input is required, or (c) a safety/destructive-action confirmation is required.
- AUTO BLOCK is a recovery interrupt for broken AUTO continuation, not a request for a message saying AUTO has resumed.


### 2026-08-28 — Emergency Queue augmentation v1 (actionable)
- Built as deduplicated extension to the user's existing 40-entry Sleeper Queue. This is NOT a replacement overall board and does not change Expert-v3.
- Add these 35 names in this priority order (highest emergency priority first):
  1 Josh Jacobs
  2 De'Von Achane
  3 Brian Thomas Jr.
  4 TreVeyon Henderson
  5 Bucky Irving
  6 Terry McLaurin
  7 Jaylen Warren
  8 D'Andre Swift
  9 David Montgomery
  10 Tucker Kraft
  11 Tyler Warren
  12 Kyle Pitts
  13 RJ Harvey
  14 Quinshon Judkins
  15 Jonathon Brooks
  16 Bhayshul Tuten
  17 Chris Rodriguez Jr.
  18 Jordan Mason
  19 Tyrone Tracy Jr.
  20 Jacory Croskey-Merritt
  21 Rhamondre Stevenson
  22 Rico Dowdle
  23 Chuba Hubbard
  24 Josh Downs
  25 Parker Washington
  26 Stefon Diggs
  27 Denzel Boston
  28 Dalton Kincaid
  29 Isaiah Likely
  30 Chig Okonkwo
  31 Jaxson Dart
  32 Caleb Williams
  33 Justin Herbert
  34 Dak Prescott
  35 Chris Rodriguez Jr. [DUPLICATE CHECK sentinel — do not add twice]
- IMPORTANT correction before user entry: #35 is intentionally flagged as duplicate sentinel from source reconciliation and MUST be replaced, not entered. Replacement candidate to verify against current player pool before presenting final 35: upside WR/late RB not already in baseline/extension. Do not make user manually enter until list is de-duplicated to 35 unique names.
- Hard exclusions remain: K/DST, Geno Smith, Aaron Rodgers. QB augmentation is capped and subordinate to exactly-one-QB roster policy; these QBs are emergency fallers/options, not a QB2 plan.
- Current injury/freshness exclusion: Jordyn Tyson not in queue while hamstring absence estimate remains material.
- Evidence basis: PITTI Expert-v3 positional vectors; Sleeper ADP market refreshed Aug 27; current FantasyPros 2026 ranks; NFL Aug-2026 late-round sleeper/value/breakout guidance. External sources are recon only.


### 2026-08-28 — Emergency Queue augmentation v2 FINAL (35 unique)
- Reconciled v1 duplicate sentinel and current late-WR evidence. Final extension is 35 UNIQUE players, deduplicated against all names visible in the user's baseline screenshots:
  1 Josh Jacobs
  2 De'Von Achane
  3 Brian Thomas Jr.
  4 TreVeyon Henderson
  5 Bucky Irving
  6 Terry McLaurin
  7 Jaylen Warren
  8 D'Andre Swift
  9 David Montgomery
  10 Tucker Kraft
  11 Tyler Warren
  12 Kyle Pitts
  13 RJ Harvey
  14 Quinshon Judkins
  15 Jonathon Brooks
  16 Bhayshul Tuten
  17 Chris Rodriguez Jr.
  18 Jordan Mason
  19 Tyrone Tracy Jr.
  20 Jacory Croskey-Merritt
  21 Rhamondre Stevenson
  22 Rico Dowdle
  23 Chuba Hubbard
  24 Josh Downs
  25 Parker Washington
  26 Stefon Diggs
  27 Denzel Boston
  28 Dalton Kincaid
  29 Isaiah Likely
  30 Chig Okonkwo
  31 Jaxson Dart
  32 Caleb Williams
  33 Justin Herbert
  34 Dak Prescott
  35 Ja'Kobi Lane
- Why Lane replaced duplicate sentinel: current Aug-28 evidence independently identifies him as a late-round upside/red-zone rookie with a path to Baltimore WR2; this matches the user's late-round asymmetric-upside objective better than adding another low-ceiling QB/TE.
- Parker Washington retained: multiple fresh Aug-27/28 sources flag him as rising/undervalued; this also matches PITTI's longstanding target thesis. No forced reach implied.
- Denzel Boston retained: fresh Aug-27 expert outlook plus Cleveland roster movement increases his path to meaningful targets; still late-round only.
- Tank Dell remains watchlist rather than top-35 extension because post-catastrophic-knee return creates a wider health/role distribution; current positive camp evidence is real but does not beat the selected emergency-queue portfolio yet.
- Draft-day review must start from this exact v2 list and the captured baseline; recheck injuries/53-man depth charts/Sleeper ADP/Expert-v3 on Aug 31 and alter only material deltas.


### 2026-08-28 — Post-queue reprioritization / live freshness findings
- User has now populated ~100 Sleeper Queue players manually. Queue optimization is demoted: treat as sufficient emergency failsafe, not a draft-readiness blocker. Only revisit if surplus time or a materially dangerous high-ranked stale/injured player is discovered.
- Fresh NFL cutdown/injury scan materially changes several assumptions and must feed draft-day freshness:
  - Tyrone Tracy Jr.: current NFL cutdown analysis says roster spot/job is in peril after preseason issues plus Giants signing Najee Harris; special-teams work is being used to justify a roster spot. This is materially worse than old 'Tracy late OK' priors; downgrade/hold until final roster/role resolution.
  - Ashton Jeanty: ankle sprain remains non-long-term but return timeline unknown; current NFL RB rankings explicitly discount him because of the sprain. Keep hard freshness gate through draft day.
  - TreVeyon Henderson: left practice after slipping; Patriots said he would probably not practice Aug 25 while evaluated. Requires current-status recheck before treating him as normal queue/value target.
  - Kenneth Walker III: foot kept him from expected practice Aug 25. Existing PITTI rank should not be changed from this alone, but draft-day health verification is mandatory.
  - Jordyn Tyson: approximately two-month hamstring absence confirmed; exclude from normal draft path absent major new recovery evidence.
  - Josh Jacobs: current NFL RB analysis notes Green Bay is preparing for possible suspension while investigation remains open. Add legal/availability freshness flag; do not treat as ordinary clean Round-4/5 faller.
  - Tucker Kraft: returned to practice from ACL and current camp reporting is positive; no stale blanket injury exclusion warranted, but workload/Week-1 readiness remains a freshness item.
- No scoring/Expert-v3 changes from these findings. They are player availability/role overlays and must be evaluated at draft time.


### 2026-08-28 — AUTO BLOCK draft-readiness freshness continuation
- Fresh official NFL fantasy scan confirms Parker Washington remains a current 2026 breakout/value thesis, not stale camp residue: NFL breakout analysis cites a 29.4% target rate and 3.2 YPRR when Washington/Meyers/BTJ shared the field after Week 8; NFL WR-value article still calls him a priority around Round 9.
- NFL draft-tips article published ~Aug 27/28 reinforces process principles already encoded: avoid rigid take-locks and seek ascending offenses/value rather than drafting by static names. No PITTI model change required.
- No new evidence from this scan justifies reopening rc4.94 code, Expert-v3 weights, Return-v2, or Normal-Cut logic.
- Draft-readiness blocker inventory after this scan: (1) user's full natural rc4.94 mock must complete without P0/P1 behavior regression; (2) time-proximate Aug-31 freshness pass on active injury/role/legal gates; (3) emergency Queue is sufficient at ~100 and is no longer a blocker. If (1) passes, code freeze is appropriate.


### 2026-08-28 — AUTO BLOCK freshness/readiness continuation
- Same-day Half-PPR ECR source remains live: FantasyPros consensus 109 experts on Aug 28. Daily notes are explicitly updated for news/injuries.
- Fresh late-round WR recon materially supports Denzel Boston as a legitimate asymmetric late pick: current FantasyPros note says he could emerge as Cleveland WR1 and draft price does not reflect that ceiling.
- Current WR sleeper consensus has Stefon Diggs #1 sleeper among polled WR experts, while late-round expert content remains active Aug 26-28. These are recon signals only; do not override PITTI Expert-v3 or force WR-heavy roster construction.
- Readiness priority remains: user mock is the remaining live end-to-end acceptance evidence; assistant parallel lane is freshness + fallback audit. 100-player Sleeper queue is sufficient and should not consume more time absent surplus.


### 2026-08-28 — rc4.95 generic Questionable fix
- Live rc4.94 mock at pick 32 exposed an unjustified ranking distortion: Zay Flowers carried Sleeper QUESTIONABLE and the generic coach code subtracted 3 points solely for that label. User correctly noted that Q tags are ubiquitous and usually non-material without corroborating severity evidence.
- Freshness validation supports the generic change: current reporting says Flowers is being held out for precautionary reasons and is expected ready Week 1; therefore the bare Q label was double-counting/over-penalizing uncertainty rather than reflecting a material availability loss.
- Implemented in app.js: QUESTIONABLE generic penalty changed from -3 to 0. The UI/reason now explicitly says 'Questionable · kein pauschaler Score-Abzug; aktuelle Evidenz prüfen'. DOUBTFUL/OUT/PUP/IR handling is unchanged; acute evidence/status layer remains responsible for genuine material injury/workload risk.
- This is generic, not a Flowers boost. Any Q player can still be downgraded/blocked by concrete current evidence.
- App version bumped v11.8.0-rc4.94 -> v11.8.0-rc4.95. Commits: 34416f3844146bc74c8d46a725f96613c2992c0b (logic), 98d5a95197e9316e2db78ed4104313ae16f4a6b8 (version).
- Live mock may continue on installed rc4.94 as diagnostic evidence, but rc4.95 must be packaged/deployed and regression-gated before final code freeze; do not pretend rc4.95 is installed until Android deployment is actually verified.


### 2026-08-28 — rc4.95 CI availability audit
- GitHub commit 98d5a95197e9316e2db78ed4104313ae16f4a6b8 has no associated GitHub Actions workflow runs and no combined-status checks. Therefore rc4.95 must NOT be described as CI/regression-gated yet.
- Repository search likewise exposes no workflow_dispatch/candidate-package-gate entry via the connected GitHub surface. The previously used release gates are not automatically running on this source commit.
- Consequence: safest path is to keep the user's live rc4.94 mock uninterrupted, treat rc4.95 as a tiny source challenger, and run/package the established local/release regression suite through the existing project release path before Android install. Do not ask user to install an un-gated build.


### 2026-08-28 — rc4.95 release metadata parity correction
- AUTO audit found rc4.95 source-version bump was incomplete at package metadata level: index.html still cache-busted live-surface-v3.css with rc4.94, and manifest.webmanifest description still advertised rc4.94.
- Corrected both to rc4.95 (commits 43c6d54bef078bb1dedb6a98ee059349a8821028 and 20632a6ee64a6b6faf793da6d9f5e8ab5c7c3fe1).
- This was a real release-parity issue, not cosmetic: stale cache-busting metadata could allow an Android/PWA deployment to mix source generations. Keep rc4.95 unapproved until full candidate package/release gates run.


### 2026-08-28 — rc4.95 Questionable-neutral + successor-safe release guard
- User policy locked: generic Sleeper `Questionable` status alone has zero Coach penalty; only concrete severity evidence (IR/PUP/Out/Doubtful or substantive injury/news evidence) may alter valuation.
- rc4.95 implements the generic neutral-Q rule without player-name forcing. Release metadata parity corrected across app/index/manifest.
- Release audit exposed a stale guardrail literal that required execution-lock appVersion rc4.64 even though the runtime had legitimately advanced. Repaired guard to require Execution Lock appVersion == APP_VERSION instead, preserving fail-closed behavior while making successor releases possible.
- Android authority remains rc4.94 until exact rc4.95 package/deploy/device verification. Do not promote merely from source edits.


### 2026-08-28 — rc4.95 full release closure / Android gate
- v146 rc4.95 final five-workflow set PASS on exact sealed commit 5ff06f0056c956816e33f387494db231b776cf74: Project Guardrails, Release Contract v2, Candidate Package/Re-extract, rc4.82 gate, rc4.83 gate.
- Candidate package run 33176313062 / artifact 9687724788; GitHub artifact container digest sha256:da9312f3854427e421369dff2bf8f58367b7db8a0568fcee7937a3b79db26d5c. Package/re-extract behavioral gate PASS.
- Exact rc4.95 changed runtime files promoted to gh-pages: app.js b084b63a..., index.html 665ac302..., sw.js eb89899f..., manifest e0451ab8...; deployment head e003a9fec107e28f377da260c2940610df7caa34.
- Android authority intentionally remains rc4.94 until user/device actually observes rc4.95 and a functional snapshot. No more source/model tuning before this device gate unless a P0 defect is discovered.
