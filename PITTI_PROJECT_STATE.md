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
