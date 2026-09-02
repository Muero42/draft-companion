# PITTI PROJECT STATE — Season Companion 2026
Updated: 2026-09-01
Canonical continuation trigger: **PITTI AUTO**


## Canonical execution invariants
- Source of Truth for PITTI/Draft Companion execution: this canonical project-state checkpoint reconciled against current repository/runtime artifacts.
- AUTO means end-to-end autonomous execution; interrupt only for a genuine external/user gate.
- Never silently revive a rejected/obsolete approach.
- Material decisions, implementations, verifications, failures, rejected approaches, artifact state and next gates must be written here promptly.
- New-chat recovery: read this file first, then reconcile against current repository/preview/runtime before editing.
- Built/prepared != deployed != Android verified. Keep those states explicit.
- Regression prevention is technical where possible; executable guards/tests outrank conversational promises.
- Historical draft UI contract retained for regression: three selectable profiles; Expert-v2 ALL positions; Expert-v2 WR-only.

## Authority / non-negotiable state
- Current work is **post-draft / season operation**, not draft optimization.
- Repository: `Muero42/draft-companion`; active development branch: `season-companion-rc4.159`.
- Current code version constant: **v11.8.0-rc4.160**. Branch name remains rc4.159; do not infer code version from branch name.
- Preview is deployed from `gh-pages/season-preview/` and was synchronized after the latest changes.
- Real 2026 draft ID: **1366053132970233856**, complete.
- Current Sleeper league roster is Source of Truth. Never reconstruct current roster from the completed draft.
- First real post-draft delta: Zach Charbonnet -> IR/Reserve; Tank Bigsby added. Preserve draft roster separately from current roster/transaction history.
- FantasyPros Analyzer A-/92 is benchmark/diagnostic only; it must not overwrite live roster or decisions.
- No automatic external transactions. Analysis may be autonomous; adds/drops/FAAB/trades require user confirmation before execution.

## Verified implementation state
- Sleeper live roster sync works and displays the user's current lineup, bench and reserve.
- Ownership is checked against all live Sleeper rosters before a player can be treated as a free agent.
- Live context persists season rows plus available D/ST and K pools across rerenders.
- Kader workspace is for **current lineup / Start-Sit**. Duplicate Kader heading was removed immediately before this handoff.
- The old duplicate Drop-Review/FA block in Kader was replaced by lineup review.
- Week-1 Start/Sit v2 uses weekly ranking as primary gate; ROS/draft panel alone cannot trigger a lineup switch. Health/role late news remains a recheck gate.
- Waiver/FA is the home for acquisitions: skill-position Add/Drop, D/ST, K, later FAAB.
- Trade Target Board v3 uses **live Sleeper rosters**, not draft rosters. It is target discovery only until market value, opponent utility, package/fairness and acceptance plausibility are implemented.
- D/ST early-add policy: compare edge over next-best available stream + market-loss risk against the option value of the weakest actual roster asset. Pre-Week-1 RB option value is elevated.
- JAX is a Week-1 priority target, but not an automatic early roster sacrifice. Do not hard-code Bigsby as the drop; evaluate the entire roster.
- D/ST model has a quality floor: matchup alone must not elevate a weak defense. RotoBaller Week-1 tiers/ranks are currently used; Tier 5/6 excluded from normal streaming, Tier 4 emergency only. Multiweek horizon matters.
- Kicker block currently uses verified Week-1 projections and must be filtered to actual Sleeper free agents.

## Current UX contract
- Kader: Sleeper-like roster view, current starters first, bench/reserve, position emphasis, then **possible internal lineup changes** only.
- Do not repeat the roster in Waiver/FA.
- Waiver/FA: concrete roster moves, explicitly pairing ADD X / DROP Y; distinguish current-week value from long-term/ROS championship value.
- Trades: targets and later concrete offers; distinguish value to us, value/need to opponent, fairness, acceptance chance and alternatives.
- Draft surfaces remain historical/retrospective; season logic must not drift back to draft ADP as primary evidence.

## League / strategy constraints that still matter
- 10-team Half-PPR. Starters: QB, 2 WR, 1 RB, 1 TE, 2 Flex, K, DST; bench 6.
- Max simultaneously startable: 4 WR, 3 RB, 2 TE.
- One-QB strategy; QB2 is not generic roster depth. Geno Smith and Aaron Rodgers remain hard exclusions.
- User expects weekly D/ST streaming unless a defense earns a multiweek hold. Good matchup is valuable but minimum defense quality is mandatory.
- K/DST expert panels should be developed for in-season accuracy; draft expert panels remain historical baseline, not automatically the current FA truth.

## Highest-priority next work
1. **Waiver v2:** separate THIS WEEK vs ROS/Championship EV; incorporate current role/usage, snaps/routes/targets where applicable, depth chart, health, freshness, opponent, replacement cost, market urgency and concrete drop cost. Fail closed when evidence is stale/incomplete.
2. Add FAAB only when waiver timing, league market/competing claims and evidence support a meaningful estimate; avoid fake precision.
3. **Trade engine:** from target discovery to concrete offer construction: target -> best offer/package -> our roster/lineup gain -> opponent need/gain -> market/fairness -> estimated acceptance plausibility -> fallback offer. Boone ROS Trade Value can be an input, not sole authority; adapt to 10-team Half-PPR/replacement level.
4. Improve weekly Start/Sit beyond the initial rank gate with matchup, weekly projections, role/usage and injury/late-news evidence. Example names discussed in chat (e.g. Price vs Irving) were illustrative only and must NEVER be treated as desired outcomes.
5. Build/validate K and especially D/ST in-season expert panels based on demonstrated accuracy. Preserve the D/ST quality-floor philosophy.
6. Weekly operating cycle: live roster/transactions -> usage/health/news -> waiver -> trade buy-low/sell-high -> lineup -> K/DST -> recheck near lock.

## Known risks / do not regress
- Earlier app repeatedly regressed to old draft states, wrong rosters, stale expert pools and inconsistent player panels. On continuation, reconcile this checkpoint against current repository code before editing.
- Do not assume older `PITTI_PROJECT_STATE*.md` files are current merely because they exist.
- Do not use FantasyPros delayed roster sync as Source of Truth when Sleeper API/live league state is available.
- Do not label rostered players as free agents.
- Do not recommend a drop from a standalone drop ranking; every drop must be evaluated against the concrete acquisition and opportunity cost.
- Do not produce Start/Sit from ROS rank alone.
- Do not infer that rc4.160 is a finished Season Companion. It is an in-progress conversion of the successful draft baseline.
- Watcher/research-cache evidence remains gated by run-health/provenance; stale cache evidence cannot independently trigger a CLEAR ADD.
- Draft history must remain immutable while current roster evolves separately.

## Handoff verification performed
- Repository code inspected immediately before handoff.
- Confirmed app version constant rc4.160.
- Confirmed Week-1 Start/Sit v2 present.
- Confirmed Trade Target Board v3 present.
- Confirmed D/ST Early-Add-Gate present.
- Confirmed live context persistence for available D/ST/K.
- Found one residual duplicate `Kader` heading in `index.html`; removed it and synchronized preview before writing this checkpoint.
- Next chat must first read this file and reconcile it against branch/preview before making changes.

## User workflow
- **AUTO / AUTO BLOCK:** autonomous end-to-end work, no unnecessary interim status messages.
- **STATUS:** concise state report only, not a trigger for new calculations.
- **PITTI HANDOFF:** update/reconcile this canonical state, verify code/preview, then hand over.

## rc4.160 AUTO verification update — 2026-09-01
- Project Guardrails PASS and release-contract-v2 PASS on commit 68e2980d45d64b4014df7874cdb58895349d5e8c.
- Candidate-package failure isolated to the historical rc4.158 expert-delta regression asserting the exact rc4.158 version string after the runtime advanced to rc4.160; functional delta-refresh invariants before that point passed.
- Regression was corrected to accept rc4.158 and later versions while preserving all behavioral assertions. This is a test-harness compatibility fix, not a runtime model change.
- Android authority remains rc4.158; rc4.160 remains preview/candidate until all gates PASS and device canary is verified.

## Season Companion model audit — AUTO lane
- Current rc4.160 already has LIVE Sleeper season roster/ownership, reserve/IR separation, FA-vs-roster pair generation, Waiver Priority v1, Special Teams streaming board, Season Action Board v1 and Trade Target Board v3.
- Waiver v1 explicitly avoids numeric FAAB without current waiver-week/opponent-budget/market evidence; this fail-closed behavior remains correct.
- Trade v3 is target discovery only: opponent live rosters and own marginal lineup geometry are present, but market/acceptance plausibility and concrete give/get construction remain intentionally absent.
- Next model increments remain: Waiver v2 THIS WEEK vs ROS/championship EV; trade offer construction/acceptance plausibility; weekly lineup optimizer; K/DST weekly-source specialization.
- Live roster/ownership is a hard prerequisite for actionable season recommendations; draft roster is historical fallback only and must fail closed for FA actions when season sync fails.

## Persistent AUTO protocol hardening — 2026-09-01
- User explicitly approved converting AUTO from a conversational convention into a persistent project state machine.
- `PITTI_CURRENT_STATE.json:auto_execution_state` is now the canonical work queue with `active`, `ready`, `waiting_external`, `blocked_user`, and `completed_recent`.
- The no-output rule is explicit: if any safe autonomous item remains in `active` or `ready`, a visible AUTO response is forbidden.
- CI/deploy/wait states and user-blocked device gates block only their dependent lane; they do not stop independent ready work.
- Valid visible AUTO termination now requires `active=[]`, `ready=[]`, plus `stop_evaluation.allowed=true` with an approved stop code.
- Approved stop codes: USER_ACTION_REQUIRED, DECISION_REQUIRED, PROJECT_MILESTONE_REACHED, NO_EXECUTABLE_WORK_REMAINS, SAFETY_OR_IRREVERSIBLE_CONFIRMATION.
- `PITTI_EXECUTION_LOCK.json`, `PITTI_AUTO_PREFLIGHT.md`, `PITTI_COMMAND_CONTRACTS.json`, and `PITTI_NEW_CHAT_BOOTSTRAP.md` were updated to preserve this behavior across chat switches.
- `tools/pitti_guardrail_check.mjs` now fails CI if the queue/state-machine contract is missing or if a stop is marked allowed while executable `active/ready` work exists.
- This does not remove the platform boundary that execution stops after a visible assistant reply; instead it makes ending the turn early a machine-detectable project-state violation whenever the persistent queue still contains executable work.

## Season model increments — AUTO 2026-09-01
- Waiver/FA advanced to v2 horizon semantics. THIS WEEK now fails closed to “–” when no fresh weekly role/health evidence exists; draft/ROS panel rank is not allowed to masquerade as weekly value. ROS and Championship EV remain separately visible.
- Trade Board advanced to v4: live opponent rosters are scored for positional need; indicative 1:1 GIVE/GET candidates now expose own lineup cost, opponent utility, panel-parity fairness and an explicitly heuristic acceptance plausibility. No trade is sent/executed automatically and the acceptance estimate is not represented as market-calibrated until a current trade-value source is integrated.
- Start/Sit advanced to v3: weekly consensus rank is primary and fresh role/health evidence can modify the weekly edge; ROS/draft panel remains prohibited as a standalone lineup trigger.
- Special Teams advanced to v2: D/ST Tier 5/6 quality-floor filtering is applied before sorting/surfacing; Tier 4 remains emergency-only. Kicker output remains filtered through the live Sleeper free-agent pool.
- Executable project guardrails were extended for all four season increments.

## 2026-09-01 — Bigsby transaction correction
- User corrected the post-draft history: Tank Bigsby had only been selected/intended immediately after the draft; the Sleeper add was not actually completed then.
- Bigsby remained a real free agent until 2026-09-01, when the user actually added him.
- Therefore the earlier rc4.160 screenshot without Bigsby was NOT evidence of a stale/partial Sleeper roster response. Do not encode the earlier intended Bigsby add as historical fact.
- Charbonnet on Reserve/IR remains a confirmed live roster state.
- Re-verify current live roster/ownership after the now-completed Bigsby transaction; FA-vs-Roster must use the new live state.

## 2026-09-01 — Mevis early-add gate
- Fresh public Week-1 evidence checked before encoding: FantasyPros Aug-31 consensus projects Harrison Mevis at 8.4 points, K2 by projection; RotoBaller Aug-31 Week-1 kicker tiers rank him K10/Tier 3. This is meaningful but not consensus proof of a locked elite K1.
- Mevis is therefore WATCH_NOT_AUTO_ADD, not an automatic drop trigger. His Rams scoring environment and potential season-hold value justify an early-add exception only if live league ownership/market-loss risk plus his projected replacement edge clear the opportunity cost of the weakest roster option.
- Preserve pre-Week-1 contingent RB option value: do not sacrifice a meaningful RB lottery ticket merely to avoid streaming K.
- The app Special Teams model now carries this explicit Mevis early-add watch; live Sleeper FA/ownership remains mandatory before any concrete add/drop recommendation.

## 2026-09-01 — Mevis concrete drop gate (fresh re-audit)
- User correctly rejected Price/Watson and, barring extraordinary new evidence, Downs as serious kicker-drop candidates. Do not surface them in ordinary Mevis drop choices.
- Fresh Sep-1 depth/role audit narrows the actual choice to Tank Bigsby vs Tyjae Spears vs Kenneth Gainwell.
- Bigsby: PHI RB2 behind Saquon Barkley; current Eagles roster kept Barkley/Bigsby/Shipley, and fresh depth evidence confirms Bigsby second. Highest value is still contingency/injury-driven.
- Spears: TEN RB2 behind Tony Pollard, but Titans staff has discussed Pollard + Spears as the backfield bellcows and a possible larger rushing role; therefore more standalone weekly pathway than a pure handcuff.
- Gainwell: TB official depth chart RB2 behind Bucky Irving; recent preseason usage had Irving first before Gainwell entered. Tampa's current roster discussion still supports a defined complementary role.
- Mevis: FP W1 projection 8.4 (K2 projection, Aug-31 update), Draft Sharks Sep-1 W1 K9, RotoBaller W1 K10/Tier 3. This supports a strong hold/early-add candidate but NOT a cross-source elite-K1 consensus.
- Current roster-option conclusion for an intentional Mevis add: Bigsby is the preferred drop; Spears is second; Gainwell third. This is based on standalone role + contingent ceiling, not acquisition recency or sunk cost.

- Evidence lock: never justify retaining/dropping Bigsby because he was “just added.” Acquisition recency is explicitly non-causal. Re-rank on current role, standalone weekly path, contingent ceiling, roster construction and market replacement only.
- Cross-source Mevis W1 dispersion is itself decision evidence: FP projection K2/8.4, Draft Sharks K9 (Sep-1), RotoBaller K10/Tier 3. Treat him as a strong candidate with unusually attractive environment/talent, not as a proven consensus weekly K1.

## 2026-09-01 — Device transaction canary + zero-FA root cause
- Device screenshot after the real Mevis add independently showed Harrison Mevis on roster, Tank Bigsby absent, and Charbonnet still Reserve/IR. This proves the live Sleeper roster transaction sync can detect the add/drop without the user disclosing the dropped player.
- The same screenshot still rendered “0 gerankte Free Agents / HOLD”. Root cause: bootstrapSeasonWorkspace had a second render path that did not apply the zero-FA fail-closed gate already added to the main analyze path. Startup can occur before expert rank caches are hydrated, so ownership can be valid while the rank-gated FA join collapses to zero.
- Fix: startup bootstrap now throws SEASON_FA_POOL_ZERO_INVALID on zero ranked skill-position FAs rather than rendering HOLD. Guardrail requires both startup and analyze paths to contain the zero-FA gate.

## PITTI HANDOFF v217 — 2026-09-01 10:58Z
- Canonical branch remains `season-companion-rc4.159`; branch name is historical and MUST NOT be interpreted as runtime version.
- Source/preview candidate is now **v11.8.0-rc4.161** across app.js, index.html, sw.js and manifest.webmanifest. Android accepted authority remains rc4.158 until rc4.161 physical-device acceptance.
- Real Sleeper draft 1366053132970233856 is immutable history. Current Sleeper league state is the sole current-roster/ownership authority.
- Device rc4.160 transaction canary PASS: app independently observed Harrison Mevis rostered, Tank Bigsby absent, Zach Charbonnet Reserve/IR. This proves automatic add/drop roster detection; do not ask user which player was dropped when Sleeper can resolve it.
- rc4.160 exposed a separate false-HOLD defect: valid ownership plus cold expert ranking cache could collapse the rank-gated FA join to 0. The initial bootstrap fail-closed patch was insufficient because ownership discovery itself still depended on rankFor().
- rc4.161 root fix: seasonAvailablePlayers now returns the complete live unowned QB/RB/WR/TE pool independently of expert ranking hydration. Ranking/filtering is downstream. If ownership is live but no expert-ranked FA can yet be evaluated, UI must say rankings are not ready and MUST NOT emit a HOLD/ADD conclusion.
- Added executable `tools/season-fa-ownership-regression.mjs` and wired it into the candidate-package behavioral contract. It explicitly verifies unowned skill players survive when rankFor() returns null, owned players remain excluded, and K does not leak into the skill pool.
- rc4.161 final head before handoff: b307fda15a5c20d63940e1c746a876ed7c49b3ef; all three gates PASS: PITTI release contract v2, PITTI Project Guardrails, PITTI candidate package gate.
- Mevis decision evidence remains locked: do not use acquisition recency/sunk cost. If future K/roster comparison reopens, Price/Watson/Downs are protected from casual K drops; prior Mevis drop ordering was Bigsby → Spears → Gainwell. Bigsby has now actually been dropped for Mevis per live Sleeper sync.
- Next chat MUST first read PITTI_CURRENT_STATE.json and reconcile it against repository/version/head before AUTO work. Do not repeat rc4.160 device testing. The only remaining rc4.161 release gate is physical Android acceptance: roster still correct and Waiver/FA no false zero-FA HOLD.


## Handoff v217 second-pass anti-regression audit — 2026-09-01
A second-pass review found material stale takeover pointers that could have resurrected pre-draft state despite the new CURRENT checkpoint. Specifically, PITTI_HANDOFF_SEAL was still v215, NEW_CHAT_HANDOFF_CURRENT was v216/rc4.159 with the incorrect historical “Bigsby added” canary, HANDOFF_COMPLETENESS_MATRIX and PITTI_NEW_CHAT_BOOTSTRAP were still v215/DRAFT_READY_FROZEN, and EXECUTION_LOCK / COMMAND_CONTRACTS retained draft-day currentBoundary/currentWork fields.

These are now repaired for v217 before reseal:
- current source/preview candidate rc4.161; accepted Android authority rc4.158;
- POST_DRAFT_SEASON_COMPANION and live Sleeper roster/ownership authority;
- actual transaction canary: Mevis rostered, Bigsby absent, Charbonnet Reserve/IR;
- rc4.161 FA ownership/ranking decoupling + executable regression;
- only remaining device gate: DEVICE_RC4161_ACCEPTANCE;
- AUTO state-machine/no-output semantics explicitly carried into handoff/bootstrap/matrix/preflight;
- stale v215/v216/draft-day/current-Bigsby pointers explicitly rejected as current authority.

No runtime/model code was changed by this handoff repair; it is a takeover-integrity correction designed specifically to prevent older documentation from overriding newer fixes.


## 2026-09-01 — rc4.161 preview deployment repair
- Device screenshot exposed that the season-preview URL was still delivering rc4.159 despite rc4.161 source being complete on the season branch.
- AUTO diagnosed this as a deployment/parity defect rather than a runtime-model failure and synchronized the season-preview runtime assets on gh-pages from the canonical season branch.
- Verified gh-pages head after sync: `0fdefada9fa4b751b490f552d07e6d47e5fb068e`.
- Verified on gh-pages: app.js, index.html, sw.js and manifest.webmanifest all advertise/load v11.8.0-rc4.161.
- Do not treat the earlier rc4.159 browser screenshot as rc4.161 acceptance evidence.
- Remaining gate is unchanged: DEVICE_RC4161_ACCEPTANCE on physical Android, then continue Season Companion development.


## 2026-09-01 — rc4.161 device PASS → rc4.163 season actionability
- Physical Android screenshot accepted rc4.161: correct version visible and the prior false zero-ranked-FA HOLD regression is gone.
- Fresh pre-Week-1 waiver evidence integrated in rc4.162 from Nick Mariano/RotoBaller (2026-08-31): only the top entries explicitly applicable to all/10+ team leagues influence the 10-team model; bounded bonus, explicit provenance, hard expiry 2026-09-08. Static market evidence never overrides live Sleeper ownership.
- During re-inventory, AUTO found a separate Trade Board identity defect: live Sleeper roster_id was being compared to historical draft slot 9. rc4.163 excludes the user's live roster by canonical season.my_roster.roster_id; draft-slot comparison remains fallback only when live season state is absent.
- Added executable regressions for Week-1 waiver market expiry/provenance and live trade roster identity; wired both into candidate package gate.
- rc4.163 all three gates PASS on head bdb006b618d9ae74c7ddedcfd894f42cdc47833e and season-preview is deployed.
- Remaining gate: physical Android rc4.163 Waiver/FA + Trade surface acceptance against live Sleeper state. No manual roster/FA data entry should be requested.


## 2026-09-01 — Frozen real-draft analysis checkpoint
- Canonical evidence file: PITTI-Decision-Evidence-1366053132970233856-2026-09-01T13-05-48-509Z.json. Use frozen evidence for draft evaluation; do not refresh/reconstruct with later rankings.
- User clarification for picks 29/32: true player preference was George Pickens > Chris Olave. Olave at 29 was a deliberate sequencing gamble to capture both WRs, based on reduced perceived probability that Dutch-Marc would add Pickens given existing same-NFL-team roster construction. It succeeded: Pickens returned at 32. Do NOT classify this as a player-preference mistake or hard Marc-specific rule.
- Future Return model requirement: consider same-NFL-team roster correlation (especially WR+WR, weaker RB+WR) and bye-week conflicts as bounded soft signals only. Never hard-exclude; manager-specific bye sensitivity requires repeated evidence. User himself accepts correlated RB/WR constructions (2026 examples Price/JSN/Charbonnet), so this is opponent-pick probability evidence, not roster-policy prohibition.
- Frozen-board preliminary ADP audit (absolute pick-vs-ADP deviation, where frozen ADP available) supports board-centric league: Thomas ~4.4 picks mean absolute deviation; user ~5.6; Pascal Gelderner ~6.6; Giuliano ~6.9; Dutch Marc ~7.6; Pascal Voerde ~7.5; Michael ~7.5. Basti is clear outlier ~16.8; Bjoern ~12.9. Treat as preliminary because top/special-team picks can lack ADP and later-round positional constraints distort raw deviations.
- Explicit live autodraft evidence: Marc Düsseldorf was marked autodraft from pick 1; Thomas from pick 120. Marc Düsseldorf's sequence is NOT a simple exact Sleeper-ADP walk. Examples with frozen ADP: Jeanty pick18 vs 14.2, London 23 vs21.0, Flowers38 vs42.4, Jacobs43 vs34.6, Judkins58 vs49.0, Henderson63 vs55.0, Pitts78 vs70.2, Prescott83 vs84.0, Hubbard98 vs79.7, Johnston103 vs102.7, Lawrence118 vs97.6, Meyers123 vs128.3; DST/K then followed. This strongly suggests roster/position constraints and/or a distinct Sleeper autodraft board/algorithm. Do not model autodraft as deterministic global ADP rank.
- Next analysis: normalize pick-vs-board by draft phase/position, inspect autodraft transitions and roster-needs, then evaluate all 15 user decisions including Return forecasts and manager-consumer predictions. Preserve separation between player preference and sequencing decisions.


## 2026-09-01 — Frozen Return-v2 calibration from real draft
- Calibration evaluated only against candidates present in the frozen decision fixtures and the actual intervening picks; no later rankings used. 224 candidate-return forecasts across the 14 decision intervals with a return pick.
- Overall Brier score ~0.136. Broad calibration (mean forecast -> actual return): 0-20% bucket 4.4% -> 22.4% actual (n=58); 20-40% 31.0% -> 35.0% (n=20); 40-60% 52.8% -> 52.9% (n=17); 60-80% 70.9% -> 83.3% (n=24); 80-100% 94.9% -> 93.3% (n=105).
- Critical split: short turn gaps (2 opponent picks; our pick numbers +3) calibrated much better, Brier ~0.064. Long gaps (16 opponent picks; +17) Brier ~0.208. Thus Return-v2's largest weakness is long-gap consumer/board modelling, not the basic turn calculation.
- Long-gap low forecasts are too pessimistic: <20% mean forecast ~4% but actual return ~23% (57 observations). Long-gap 80%+ is somewhat overconfident: mean ~91% vs ~73% actual (11). Do not globally recalibrate from this single draft; use as 2027 model-development evidence and validate against historical drafts/mocks.
- Override outcomes where a next pick existed: Pick 29 Olave over coach-top Pickens — model Pickens return 38.3%, actual RETURN (successful sequencing); pick 52 Price over coach-top Luther Burden — model Burden return 5.7%, actual GONE at 56 (model direction correct); pick 109 Likely over coach-top Jordan Mason — model Mason return 77%, actual RETURN; pick 132 Charbonnet over coach-top Wan'Dale Robinson — model Wan'Dale return 0%, actual RETURN. Pick 149 Spears has no subsequent user pick and is not a return-calibration case.
- Important implication: the Wan'Dale 0% -> return case and Pickens 38% -> return are not grounds for hand-coded exceptions. They reinforce bounded roster-correlation/bye/manager-context signals and long-gap calibration work. Pick 132 is a long-gap interval; Pick 29 is a turn interval where user contextual judgment beat the model.
- 2027 Return model priority: separate short-turn and long-gap calibration/consumer models; preserve board-centric base rates, then add bounded roster construction, position need, same-team correlation, bye sensitivity and autodraft-state features. No hard same-team/bye exclusions.


## 2026-09-01 — Real draft decision-quality audit (frozen evidence only)
- Final user roster sequence: 9 JSN, 12 Justin Jefferson, 29 Chris Olave, 32 George Pickens, 49 Bucky Irving, 52 Jadarian Price, 69 Christian Watson, 72 Jayden Daniels, 89 Rico Dowdle, 92 Blake Corum, 109 Isaiah Likely, 112 Josh Downs, 129 Kenny Gainwell, 132 Zach Charbonnet, 149 Tyjae Spears.
- 10/15 picks followed frozen Coach #1 exactly. Five overrides require different labels, not one generic 'user override' bucket.
- Pick 29 Olave over Pickens: STRATEGIC SEQUENCING, not preference disagreement. User preference Pickens > Olave; goal was Olave+Pickens. Frozen model itself rated Olave 75.7% return and Pickens 38.3%, but user intentionally inverted order using opponent-roster correlation intuition; Pickens returned at 32. Outcome successful. Future evaluation must score pair/sequence objective, not pick 29 in isolation.
- Pick 52 Jadarian Price over Luther Burden: ROSTER/UPSIDE OVERRIDE. Frozen Price: coachScore 60, candidate rank 9, panel ~60.95, ADP 57.4, return ~4.7%; Burden return ~5.7% and was gone at 56. This was not a sequencing play to recover Burden. It deliberately prioritized RB/upside after opening 4 WR + Bucky. Evaluate as strategic roster construction, not model-return error.
- Pick 109 Isaiah Likely over Jordan Mason: POSITIONAL/TE TIMING OVERRIDE. Frozen Likely was candidate rank 13, coachScore 34, panel ~122.9, ADP 109.2, model return 98.3%; Mason model return 77% and actually returned to 112. User secured TE before the turn despite model saying Likely was extremely likely to return. This is a key TE-demand/turn-consumer calibration case; result cannot yet be graded solely by player outcome.
- Pick 132 Zach Charbonnet over Wan'Dale Robinson: LATE-RB/IR-UTILITY OVERRIDE. Frozen Charbonnet candidate rank 8, coachScore 27, panel ~157.15, ADP 143, return ~13.6%; reasons included Late-RB Upside, Progressive-Upside and Injury-Stash. Wan'Dale model return 0% yet actually returned all the way to 149. This exposes a consumer/roster-context miss for Wan'Dale and shows the generic coach score was misaligned with user's late-draft RB/option-value strategy.
- Pick 149 Tyjae Spears over Wan'Dale: FINAL-PICK UPSIDE OVERRIDE. Frozen Spears candidate rank 3, coachScore 76, panel 135, ADP 170.3; late-RB/progressive-upside reasons. No return pick exists, so Return-v2 is irrelevant. Grade against final roster utility/upside strategy, not 'return'.
- Structural roster observation: first four picks were all WR, then the user deliberately corrected RB exposure (Bucky + Price) before QB at 72; final skill roster was WR6/RB7/QB1/TE1. This was an intentional late-RB option-value build, not accidental coach WR saturation. Future coach evaluation must distinguish lineup saturation from bench option-value and must not treat all deviations from raw panel rank as errors.
- Model-development requirement: add decision-intent taxonomy to evidence (FOLLOW_COACH, SEQUENCE, ROSTER_BALANCE, POSITION_TIMING, UPSIDE_OPTION_VALUE, OTHER) so post-draft learning does not infer wrong preferences from observed picks. Sequence decisions should store preferred player separately from selected-first player and pair objective where applicable.


## 2026-09-01 — Sequencing + single-IR-slot corrections
- Pick 109 Likely is a SEQUENCE decision, not merely TE timing. User had previously chosen Downs over JCM, wanted both Likely and Downs, considered Likely possibly the last TE he genuinely wanted, and was very confident Downs would survive the two Dutch-Marc picks. Likely's own counterfactual cannot be observed because user removed him. Correct observable proxy: Jake Ferguson was available before pick 109 and Dutch-Marc actually selected Ferguson at 111 after Stefon Diggs at 110, despite already having Fannin. Frozen candidate generator did not include Ferguson in its scored candidate set at 109, so no direct stored Return-v2 probability exists for Ferguson. This is itself a coverage/model diagnostic: the TE consumer event occurred on a player outside the candidate-return scoring set. Likely was assigned 98.33% return / only 1.67% Dutch-Marc take risk, while Dutch-Marc's live snapshot already showed 1 TE before the turn. Do not claim a Ferguson return probability that was never stored.
- Pick 132 Charbonnet: SEQUENCE + SINGLE-IR-SLOT OPTION VALUE + PRICE HEDGE. User had several RBs ranked ahead of Charbonnet but expected enough RB choice to remain at 149. Charbonnet was secured because (a) he could occupy the league's single IR slot and permit one extra post-draft add, and (b) he hedged Jadarian Price injury/performance/displacement risk. IR option value must be stateful and consumable: bonus applies only while the team's one IR slot is free/uncommitted; after an IR player has consumed/claimed it, no second player receives the same roster-slot bonus.
- Opponent IR consumer signal: Basti and Björn both made IR-eligible picks and immediately used IR after the draft to add kickers. Basti explicitly confirmed this was intentional; Björn is strong inference, not confirmed fact. Future Return model may use free IR-slot + manager evidence as a bounded take-probability feature. It disappears once that manager's IR slot is occupied/committed. Never treat injury/IR eligibility as a permanent generic bonus.
- Architecture requirement: separate OWN_CANDIDATE_IR_OPTION_VALUE from OPPONENT_IR_TAKE_SIGNAL. Track IR capacity/commitment per roster and avoid double-counting one slot. Preserve provenance strength: Basti=confirmed strategy; Björn=inferred strategy.


## 2026-09-01 — Pick 109 turn: observable consumer miss refined
- Frozen pick-109 fixture candidate probabilities vs Dutch-Marc (the only intervening manager): Likely return 98.33% / take 1.67%; Josh Downs return 94% / take 6%; JCM return 82.67% / take 17.33%; Stefon Diggs return 92.67% / take 7.33%. Actual Dutch-Marc picks were Diggs 110 and Jake Ferguson 111; user then got Downs 112.
- This gives a DIRECT stored model miss independent of reconstructing Ferguson: Diggs was forecast 92.67% to return but was taken immediately at 110. Ferguson remains qualitative/coverage evidence only because he was outside the frozen scored candidate set. Likely remains counterfactual because user selected him.
- User's sequencing thesis therefore has observable support: Downs was correctly treated as high-return and did return; the model simultaneously underestimated Dutch-Marc's actual consumption risk for at least one available player (Diggs), and likely failed to represent TE demand/coverage around Ferguson. Do not infer that Likely definitely would have been taken.
- For future turn evaluation, score sequence plans as joint objective: probability of obtaining both desired assets and scarcity/acceptable-fallback structure, not merely independent candidate return probabilities.


## 2026-09-01 — Sequencing risk taxonomy refined from user intent
- Olave -> Pickens and Likely -> Downs are both deliberate sequence decisions but NOT the same risk class.
- Pick 29 Olave -> Pickens = HIGH-LOSS GAMBLE. True preference Pickens clearly above alternatives. User intentionally exposed Pickens despite meaningful loss-if-gone because securing Olave first could maximize pair value. Frozen alternatives included Jeremiyah Love (57% modeled return) and Tetairoa McMillan (95.67% modeled return); user states Love would have been satisfactory and McMillan was considered, but Pickens was valued materially higher. Frozen model Pickens return 38.33%, so this was consciously accepting substantial loss risk, not believing return was near-certain. Pickens returned and pair objective succeeded.
- User's frozen-time Pickens thesis: meaningful upside alongside CeeDee Lamb, with possibility of narrowing Lamb's lead / functioning as genuine 1B in an offense capable of supporting two fantasy-relevant WRs. Preserve as ex-ante thesis; do not contaminate draft grade with later-season results.
- Pick 109 Likely -> Downs = LOW-LOSS / FALLBACK-RICH SEQUENCE. User wanted Likely + Downs but saw enough acceptable alternatives to Downs that losing Downs would have had limited loss. Downs was also judged very likely to survive the two-pick turn and did. This is scarcity-first sequencing, unlike the Pickens gamble.
- vNext sequencing model should estimate JOINT pair utility rather than independent return only: P(second returns), LossIfGone(second), fallback-set quality/value distribution, scarcity of first asset, and joint value if both obtained. Suggested intent classes: SEQUENCE_HIGH_LOSS_GAMBLE vs SEQUENCE_FALLBACK_RICH (or equivalent continuous loss/fallback features rather than hard labels).


## 2026-09-01 — Manager target-collision audit from frozen real draft
- Evaluated the frozen targetCollisions predictions against actual intervening opponent picks for every decision interval where each manager actually picked: 63 manager-interval observations. A hit means at least one actual player was in that manager's stored top-8 target list.
- Overall top-8 target coverage: 41/63 = 65.1%. Top-3 coverage is much weaker and manager-dependent; exact #1 target hits are rare. This supports using target lists as broad consumer sets, not precise next-pick forecasts.
- Top-8 hit rates by manager (7 observed intervals each): Dutch-Marc 85.7%, Giuliano 85.7%; Michael 71.4%, Pascal Gelderner 71.4%, Pascal Voerde 71.4%, Thomas 71.4%; Björn 57.1%, Marc Düsseldorf 57.1%; Basti only 14.3%.
- Top-3 hit rates: Dutch-Marc 57.1%, Michael 57.1%, Giuliano 57.1%, Pascal Gelderner 42.9%, Pascal Voerde 42.9%, Marc Düsseldorf 28.6%, Björn 14.3%, Thomas 14.3%, Basti 0%.
- Basti is therefore not merely an ADP-deviation outlier (~16.8 mean absolute pick-vs-ADP deviation in preliminary audit); the frozen manager-target model also failed badly on him. Future model should widen/flatten Basti's consumer distribution rather than pretend precision, until stronger behavioral features exist.
- Marc Düsseldorf autodraft target coverage only 57.1% top-8 / 28.6% top-3 despite explicit autodraft state. This independently confirms that the old autodraft consumer model did not capture Sleeper's actual auto-selection behavior sufficiently. Do not make autodraft deterministic ADP.
- Dutch-Marc was comparatively predictable as a broad consumer set (85.7% top-8, 57.1% top-3), but individual counterfactual player claims still require caution.
- Model-development implication: manager prediction should output calibrated SET COVERAGE / entropy as well as player take probabilities. For high-entropy managers (especially Basti; also autodraft until algorithm understood), flatten player-specific probabilities and increase uncertainty instead of forcing a narrow target ranking.


## 2026-09-01 — Draft-analysis synthesis: confidence-aware manager/return learning
- Frozen real-draft evidence now supports a confidence-aware architecture rather than more manager-specific hard rules.
- Manager target lists had 65.1% top-8 set coverage overall across 63 observed manager-intervals, but precision varied drastically (Dutch-Marc/Giuliano 85.7% top-8 vs Basti 14.3%). Therefore targetCollisions should expose uncertainty/entropy and Return-vNext should shrink player-specific manager effects toward board/base rates when manager evidence is weak.
- Autodraft is a distinct uncertain state, not a deterministic Sleeper-ADP rule. Marc Düsseldorf was explicit autodraft from pick 1 but only 57.1% top-8 / 28.6% top-3 target coverage; actual sequence shows roster/position constraints or a distinct Sleeper auto board/algorithm. Preserve this as a research target for future mocks/live evidence rather than fitting 2026 outcomes ad hoc.
- Board-centric prior remains justified for most managers; Basti is the strongest exception and Björn a secondary deviation. Use board/ADP as prior, then bounded contextual modifiers (position need, roster construction, same-team correlation, bye sensitivity, free IR opportunity, manager history, autodraft state) with confidence-weighted shrinkage.
- Return calibration should be horizon-aware: short-turn Brier ~0.064 vs long-gap ~0.208 in frozen 2026 evidence. Long-gap low probabilities were especially over-pessimistic. Avoid literal 0/100 unless logically forced; impose probability floors/ceilings or calibrated uncertainty for empirical manager predictions.
- Decision-learning taxonomy is mandatory before using user picks as preference labels: FOLLOW_COACH; SEQUENCE_HIGH_LOSS_GAMBLE (Olave->Pickens); SEQUENCE_FALLBACK_RICH / scarcity-first (Likely->Downs); ROSTER_BALANCE/UPSIDE; IR_OPTION_VALUE; FINAL_PICK_UPSIDE; OTHER. Store selected-first separately from true preference and fallback set.
- Single IR slot is consumable state. Own-candidate IR option value and opponent IR take signal are separate features; both become zero after the one slot is occupied/committed. Basti intentional IR strategy confirmed; Björn strongly inferred from immediate post-draft IR+kicker move.
- Do not implement these model changes yet before completing frozen draft analysis; preserve current evidence and finish retrospective first so no later rankings contaminate conclusions.


## 2026-09-01 — Frozen ex-ante value audit of user's 15 picks
- This is PROCESS/value-at-draft-time analysis only; do not use 2026 season outcomes. Compare selected pick number with frozen expert panel rank and Sleeper ADP, while recognizing intentional sequencing/IR/roster strategy can rationally override raw rank.
- Strong frozen panel values among selections: Pickens at 32 vs panel 21.75 (+10.25 picks of panel value) and ADP 24.1 (+7.9); Christian Watson 69 vs panel 50.7 (+18.3) / ADP 66.3 (+2.7); Jayden Daniels 72 vs panel 60.15 (+11.85) / ADP 69.4 (+2.6); Rico Dowdle 89 vs panel 75.7 (+13.3) / ADP 83.7 (+5.3); Josh Downs 112 vs panel 92.25 (+19.75) while Sleeper ADP 113.9 was essentially market-neutral; Kenny Gainwell 129 vs panel ~109.88 (+19.12) and ADP 107.5 (+21.5).
- Near-market/near-panel: JSN 9 vs panel 6.65 / ADP 8.7; Jefferson 12 vs panel 12.7 / ADP 12.9; Olave 29 vs panel 24.95 / ADP 30.8; Bucky 49 vs panel 48.15 / ADP 47.3; Corum 92 vs panel 89.3 / ADP 92.
- Intentional raw-rank reaches: Price 52 vs panel 60.95 / ADP 57.4 (modest market reach, larger panel reach) after four-WR opening; Likely 109 vs panel 122.9 / ADP 109.2 (market-neutral but panel reach) as scarcity-first sequence; Charbonnet 132 vs panel 157.15 / ADP 143 (raw reach whose model value omitted single-IR-slot + Price hedge); Spears 149 vs panel 135 (panel value) but ADP 170.3 (market reach) as final-pick upside choice.
- Important structural conclusion: raw ADP/panel 'reach' is not a sufficient decision grade. Several apparent reaches encode information the frozen scalar ranking did not represent (sequence objective, fallback depth, roster balance, single-IR-slot option value, portfolio hedge). Conversely, the draft also captured multiple large expert-panel falls without needing to reach. Future coach should display both MARKET VALUE and STRATEGIC/OPTION VALUE instead of collapsing them into one opaque score.
- Ex-ante roster construction was unusually WR-heavy early (WR at 9/12/29/32), but later selections deliberately exploited RB/QB/panel value and option value. Do not label the final 6 WR / 7 RB / 1 QB / 1 TE roster as generic WR saturation failure.


## 2026-09-01 — Opportunity-cost / board-flow audit from frozen real draft
- Reconstructed every actual intervening pick between the user's turns from the frozen fixtures; no current rankings used.
- Early pair 9/12: after JSN 9, opponents took James Cook 10 and CeeDee Lamb 11; Jefferson survived to 12. Thus JSN-first successfully captured JSN+Jefferson, but Lamb was the notable opportunity that disappeared. This is a clean turn-sequencing case for retrospective comparison, not evidence that JSN was wrong ex ante.
- 29/32: after Olave 29, Dutch-Marc took Jeremiyah Love 30 and Lamar Jackson 31; Pickens survived. User's explicit high-loss sequencing gamble succeeded exactly as intended. Love was also an acceptable fallback per user, so the pair decision had downside protection even though Pickens was preferred materially higher.
- 49/52: after Bucky 49, Dutch-Marc took Terry McLaurin 50 and Harold Fannin 51. Price remained; Bucky-first was therefore compatible with the later RB-balance override.
- Long gap after Price 52: Burden went 56 as Return-v2 expected (5.7% return); other notable frozen candidates consumed included Warren 54, Maye 55, Judkins 58, Jameson 59, Davante 60, Henderson 63. Christian Watson survived to 69 despite ~45.3% modeled return and was then selected. This is evidence that Price's opportunity cost included several strong market/panel options, while the specific later Watson target remained available.
- 69/72: Tuten 70 and Marvin Harrison 71 went; Jayden Daniels survived exactly as the model's 95.3% return suggested. Watson->Daniels sequencing succeeded.
- 89/92: Matthew Golden 90 and RJ Harvey 91 went; Corum survived (~89.7% modeled return). Dowdle->Corum sequencing succeeded.
- 109/112: Diggs 110 and Ferguson 111 went; Downs survived. This is the user's fallback-rich scarcity-first sequence and is directly supported by outcome.
- 129/132: Eagles DST 130 and Fairbairn K 131 went; Charbonnet survived. This turn also shows opponent special-team drafting can make late skill-player returns unusually safe; Return model should account for already-observed DST/K behavior and remaining roster requirements late in drafts.
- Long gap after Charbonnet 132: Wan'Dale Robinson, Woody Marks, Tyler Allgeier and Tyjae Spears ALL survived to 149; Chris Rodriguez was the only one of the prominent frozen late-RB/WR candidates consumed (pick 141). Actual picks 133-148 included DST/K/QB/TE and several other late players. Therefore the user's premise 'enough RB choice should remain for the final pick' was strongly validated. The model's Wan'Dale 0% return was a severe miss; Spears' 74.7% return was directionally correct and he was selected at 149.
- Late-draft structural lesson: once opponents begin filling mandatory DST/K/QB/TE slots, skill-position consumer pressure can collapse sharply. Long-gap Return-v2 must model remaining roster-slot obligations and observed special-team drafting, not extrapolate generic skill-player consumption. This likely explains part of the long-gap low-probability pessimism found earlier.
- Opportunity-cost grading must distinguish (1) assets actually lost before next pick, (2) intended follow-up assets that survived, and (3) fallback depth that survived. Do not grade a reach solely against the highest-ranked available player at the instant of selection.


## 2026-09-01 — Mobile takeover reconciliation after PC continuation
- Reconciled mobile AUTO against actual repository head rather than stale v217/rc4.166 takeover metadata. Actual branch head at takeover: bf357d304e38357e90d2b68356010ac27e1038c0; all three CI gates PASS.
- PC continuation materially advanced the frozen real-draft retrospective through Return-v2 calibration, decision-intent taxonomy, sequencing/single-IR corrections, manager target-collision calibration, confidence-aware synthesis, ex-ante pick-value audit, and opportunity-cost/board-flow audit. These newer EOF findings supersede stale currentWork/device-gate pointers in v217 files.
- Do NOT resume rc4.166 device/bootstrap trial-and-error merely because PITTI_CURRENT_STATE or handoff metadata still points there. The user explicitly identified the deeper architectural issue: season operation must not wait on or be blocked by the completed draft. Current Sleeper league state is the season runtime authority; draft data is immutable historical evidence and remains relevant for retrospective analysis only.
- Season UI target when implementation resumes: season-first navigation/status (Roster, Waiver/FA, Lineup, Trades); Draft/Mock/Live controls move out of the critical season surface into an archive/analysis module. Season hydration must be direct from Sleeper league state and independent of historical draft hydration.
- Current analysis discipline remains: finish frozen retrospective before implementing 2027 model-learning changes; no current rankings/season outcomes may contaminate ex-ante draft grading.


## 2026-09-01 — Frozen retrospective final synthesis / implementation backlog
- The 2026 retrospective has enough frozen evidence to close the diagnostic phase without importing current rankings or season outcomes. Core model findings are convergent across calibration, manager collision, ex-ante value and board-flow audits.
- Return-vNext requirements: horizon-aware calibration (short turn vs long gap); board/ADP prior; manager effects confidence-weighted and shrunk by entropy; late-draft remaining-slot obligations (DST/K/QB/TE) explicitly reduce skill-position consumption; bounded same-team/bye/roster-need/IR modifiers; empirical probabilities avoid unjustified literal 0/100.
- Sequence planner requirements: optimize joint portfolio utility rather than candidate-by-candidate return. Store true preference, selected-first asset, desired second asset, fallback distribution, scarcity, LossIfGone and sequence intent. Distinguish high-loss gamble from fallback-rich scarcity-first sequences.
- Coach/value requirements: expose MARKET/PANEL VALUE separately from STRATEGIC/OPTION VALUE. Decision-intent labels prevent user overrides from becoming false negative Coach labels. Roster balance, upside-option value, one-slot IR utility and hedge value are explicit features, not post-hoc prose.
- Manager model requirements: target lists are probabilistic consumer sets, not exact next-pick predictions. Store set coverage/entropy/confidence; flatten high-entropy managers such as Basti. Autodraft remains an uncertain distinct state until Sleeper's actual algorithm is evidenced; never deterministic global ADP.
- IR requirements: own IR option value and opponent IR take signal are separate, provenance-weighted, stateful and consumed when the single IR slot is occupied/committed.
- Evidence/coverage requirement: candidate generation must retain relevant positional consumers/fallbacks needed for turn analysis (Ferguson miss at 109 is the canonical coverage warning). Never manufacture a Return probability retrospectively for an unscored player.
- Implementation order after retrospective: (1) persist decision-intent/sequence schema and tests, (2) Return-vNext shadow model with horizon/entropy/slot-obligation features, (3) replay frozen 2026 evidence in shadow only against current Return-v2, (4) only promote after broader historical/mock validation. No ad-hoc tuning to make the 2026 draft fit.
- Separately, Season Companion architecture remains season-first: live Sleeper league state must hydrate season surfaces independently; historical Draft/Mock/Live UI moves to archive/analysis and must never gate Roster/Waiver/Lineup/Trades.


## 2026-09-01 — Cloudflare D1 rows_read incident audit
- User received Cloudflare account alert: daily D1 free-tier rows_read limit 5,000,000 exceeded; D1 reads error until 2026-09-02 00:00 UTC. Do not treat paid-plan upgrade as the default remediation.
- Repository audit at current Season Companion branch found NO D1 binding/query usage: no D1/rows_read, prepare(), env.DB, wrangler or database references; the only Cloudflare Worker file (_worker.js) proxies FantasyPros/Sleeper and serves assets, with no D1 access.
- Therefore this repository cannot presently be the direct source of D1 rows_read. The account-level D1 incident belongs to another Cloudflare Worker/Pages project/database or an external service sharing the same Cloudflare account, unless configuration outside this repository injects a D1 binding (no evidence in repo).
- PITTI season architecture must remain independent of D1. Sleeper league-state hydration should use Sleeper directly/cacheable worker transport; a D1 quota incident must not gate Roster/Waiver/Lineup/Trades.
- Follow-up only if needed: identify the Cloudflare project/database from account analytics or deployment configuration; do not alter PITTI code speculatively and do not pay merely to mask an unidentified read amplification source.


## 2026-09-01 — Cloudflare incident correction after deployment evidence
- Correction to the preceding D1 audit: repository absence of D1 query code is NOT sufficient to exonerate PITTI. User confirms this is the only Cloudflare workload and has not manually used Cloudflare for days/weeks; GitHub PR #89 contains Cloudflare Pages bot deployment notifications for this exact draft-companion branch. Treat PITTI deployment/configuration as primary suspect until disproven.
- High-confidence amplification mechanism found in project history: the Season Companion branch accumulated at least 100 commits in roughly 3h15m on 2026-09-01, and Cloudflare Pages is Git-integrated to the branch, so autonomous micro-commits can trigger a deployment per commit. This is an avoidable deployment storm even if it does not itself explain D1 rows_read.
- Immediate engineering rule: stop using Cloudflare-bound runtime branches as the persistence/checkpoint channel. Checkpoint/document-only AUTO work must not be committed to the auto-deployed Season Companion branch. Batch runtime changes into one validated deploy candidate rather than per-file/per-checkpoint pushes.
- D1 root cause remains unproven because repository/API access exposes no Cloudflare account bindings/analytics. No speculative D1 code patch and no paid upgrade. Next external evidence, if required, is Cloudflare project Settings > Bindings / D1 Analytics identifying database and query source.


## 2026-09-01 — v218 deep handoff audit
- The first v218 draft was not clean enough and must not be treated as authority. Deep verification found: rc4.163 incorrectly remained marked as accepted Android although later season hydration failed; gh-pages parity was marked true although season-preview still served rc4.166; COMMAND/LOCK contained stale rc4.163-165 runtime pointers; AUTO state simultaneously had ready work and an allowed milestone stop; guardrails still hard-coded v217 generation; and old-head CI PASS had been copied into metadata after the head had changed.
- Correct handoff authority after repair: source candidate rc4.167; last physically observed runtime rc4.166 rejected for season startup; last limited accepted Android authority rc4.161; gh-pages season-preview still rc4.166, therefore rc4.167 preview parity/deploy is pending.
- rc4.167 is season-first: current Sleeper league state is operational authority; draft is immutable archive/analysis only and never a season gate. Kader is default season workspace. Fresh-origin league identity recovery is one-time; FAIL-CLOSED diagnostics target actual Waiver/Trade DOM nodes.
- AUTO handoff semantics are now consistent: explicit HANDOFF ends at PROJECT_MILESTONE_REACHED with active=[] and ready=[]; the new chat reconstructs the next executable gate from currentWork + actual evidence. No status/progress/promise-only/empty assistant responses are permitted while AUTO has executable work. STATUS remains report-only.
- Cloudflare discipline remains mandatory: the Pages-connected runtime branch is not a micro-checkpoint channel. Material runtime work must be batched/tested/deployed once. This handoff audit itself is persisted only because it is a material transition checkpoint.
- New-chat first release gate: re-read actual branch head and exact-head CI; then verify/deploy rc4.167 preview parity in one batch; only afterward request one physical Android canary. Never repeat rc4.160 or rc4.166 device testing.


## 2026-09-01 — rc4.168 exact Season startup fix + automated runtime gate
- User browser evidence rejected rc4.167: Waiver/FA and Trades entered FAIL-CLOSED with `Cannot read properties of undefined (reading 'r')`.
- Exact root cause: `tradeOfferCandidates(mine, opponent, target)` was passed a row directly but dereferenced nonexistent `target.x.r` and `target.x.p.name`. rc4.168 uses `target.r` and `target.p.name`.
- Added `tools/season-bootstrap-runtime-regression.mjs`; it executes the real Trade offer function with fixture rows, forbids `target.x`, asserts result shape, protects Season render ordering and preserves FAIL-CLOSED semantics. It runs in Candidate Package and Release Contract.
- rc4.168 branch gates PASS; PR #89 merged to main as `ec9cd367ce389201b00469cbea7236a1360ca49b`. Main Candidate Package + Release Contract + Cloudflare Pages deploy PASS. Current device remains rc4.158 pending one final refresh.
- Initial main guardrail failures after merge were metadata-only: sealed v218 still locked rc4.167/app blob. v219 atomically reseals the promoted runtime.

## 2026-09-01 — pitti-watcher v0.2.3 D1 rows_read correction
- Earlier draft-companion-only audit was incomplete. Separate repo `Muero42/pitti-watcher` directly binds D1 as `env.DB`.
- Every 15-minute trending run previously reconstructed previous player samples using `GROUP BY player_id` + `MAX(captured_at)` over growing `trending_snapshots` history. With 96 scheduled runs/day, rows_read grows with retained history.
- All rows in a polling batch share `captured_at`; v0.2.3 therefore selects exactly the immediately previous captured_at snapshot, preserving intended comparison while bounding the read to about one batch.
- Regression forbids GROUP BY/JOIN in the previous-snapshot query. Commit `e4605c9a16ddbec8ff5ee4ab9e3df263f58195c5`; Workers Build PASS.
- D1-backed watcher feed/history may remain quota-blocked until Cloudflare reset. `/league-state` remains D1-independent.


## 2026-09-01 — rc4.169 Season workspace/UI + resilience correction
- Physical rc4.168 version canary succeeded, but the user correctly reported three remaining product defects: Draft Mock/LIVE/status UI still appeared in season workspaces; ranking refresh was inaccessible outside Draft-Archiv; and Season failures were still too globally coupled.
- Root cause of the Draft UI leak is concrete: `setWorkspace()` correctly set `hidden`, but author CSS such as `.status-card{display:grid}` overrode the browser's hidden display rule. rc4.169 adds `[hidden]{display:none!important}` and executable regression coverage.
- Ranking policy is now season-aware: ranking age and manual `Rankings aktualisieren` are visible in non-draft workspaces; a controlled automatic refresh runs only when the last verified ranking update is older than 12h, with a 2h failure retry throttle. Failed refreshes preserve the last verified ranking state.
- Season bootstrap now isolates render lanes. A Trade renderer exception fails closed only Trades; a FA-vs-Roster failure blocks only its dependent Waiver/Action surfaces. Hydration failures remain global fail-closed. Exact stage/surface appears in diagnostics.
- The executable Season runtime regression now covers the hidden CSS contract, Season ranking control/auto policy, Trade crash reproduction, and per-surface isolation.
- PR #90 full candidate gates PASS and merged to main as `ca75081e4361092e42eb75d5568a21dfe69cca33`. Main package and release contract PASS; v220 reseals machine-readable authority before preview sync.


## 2026-09-01 — rc4.170 roster loading hang correction
- User confirmed rc4.169 installed but Kader remained indefinitely on “Live-Kader wird geladen…” and refresh produced no useful action.
- Exact architecture defect: `fetchSeasonLeagueState({})` still used the Cloudflare watcher `/league-state` fetch without an Abort timeout; Cloudflare trouble could therefore leave the whole Season bootstrap pending forever. On a cold origin, the function also discarded the draft metadata after discovering league_id, leaving no slot mapping if no cached userId existed.
- rc4.170 removes watcher transport from roster authority. It retrieves draft identity directly from Sleeper with 6s timeout and league rosters directly from Sleeper with 7s timeout, resolves user roster by cached userId -> slot_to_roster_id -> draft_order, and builds ownership locally.
- Added explicit `Kader aktualisieren` control with busy/success/error feedback and a bootstrap concurrency gate. Watcher remains evidence-only, so D1 quota cannot hang live roster hydration.
- Candidate PR #91 gates PASS after updating legacy transport regressions; merged main as `862e3e92a9b72ec4f2aa5ac923bdd2bd56659a44`. Main runtime/Cloudflare deployment passed; v221 reseals metadata before one preview sync/device refresh.


## 2026-09-01 — release-discipline correction after rc4.171
- User confirmed rc4.171 had already been installed despite status records still claiming rc4.169/170. rc4.171 still hangs and refresh controls remain ineffective.
- This proves the recent workflow regressed into device-side trial-and-error and that canonical installed-version tracking was stale.
- Effective immediately: no further preview/device candidate may be promoted until a browser-equivalent automated Season E2E gate passes startup hydration, Kader refresh click, Rankings refresh click, visible busy/success/error transitions, bounded network timeout handling, no indefinite loading, Draft workspace isolation, and per-surface fail-closed isolation.
- Physical device testing is only final confirmation after automated PASS, never the primary debugging mechanism.
- rc4.171 is recorded as installed/observed but functionally rejected.


## 2026-09-01 — rc4.172 automated gate result
- rc4.172 remained test-only while branch gates ran. Branch head d653293fce545d5ea67aa00ec52811643cf2acb6 passed package, behavioral contract, guardrails, and Cloudflare checks before merge.
- New mandatory interaction regression verifies observable Kader/Ranking refresh handlers, immediate busy state, recovery to enabled controls, and bounded Sleeper timeouts. rc4.172 merged only after those automated gates passed.
- Physical device remains rc4.171 rejected. No rc4.172 device confirmation until main reseal CI is green.


## 2026-09-01 — rc4.172 physical failure → rc4.173 startup resilience
- Physical Android rc4.172 still has ineffective Kader/Ranking refresh controls. Screenshot evidence narrows execution boundary: `seasonRankingAge` is dynamically rendered (`1 Tag(e)`), but `seasonLiveStateAge` remains the static HTML dash and the roster remains the static loading placeholder. JavaScript therefore reached `setWorkspace()` but did not complete the later Season startup-control path.
- The unguarded `updateResearchCacheStatus()` sat exactly in that boundary and consumed persistent legacy localStorage evidence. A malformed/null legacy evidence row can throw while the previous static E2E gate uses a clean environment, explaining a device-only failure mode.
- rc4.173 sanitizes legacy research events and makes optional research-cache status fail-isolated. A new executable startup-resilience regression includes malformed-cache input and is wired into release/package gates.
- rc4.172 is rejected. Do not repeat it. No further physical device test before rc4.173 automated gates pass.


## 2026-09-01 — rc4.173 main promotion PASS
- rc4.173 startup-resilience candidate passed Candidate Package/Re-Extract, Release Contract v2, Project Guardrails and Cloudflare Pages on PR head, then was squash-merged to main as `a902b96b40d916b0f892c918dac453761fc50f41`.
- Main gates on the merged runtime also passed. Main package run `33548598040` produced digest `sha256:2648118ad21b0a531c9fb7c154a49f7b0d2829aa78e49cb97d3736776a6b1f2f`.
- Cloudflare Pages deployed rc4.173 from the main commit. Android remains rc4.172 observed/rejected until one final post-reseal device confirmation.
- Final user canary must specifically prove startup crosses the prior boundary: Sleeper Live-State age changes from the static dash, Kader loads/fails visibly, and both Kader/Ranking refresh controls give immediate feedback. No more device trial-and-error variants.


## 2026-09-01 — rc4.173 physical failure confirmed → rc4.174 early-control rescue
- User confirmed rc4.173 loaded on physical Android, but had already pressed both Season refresh buttons and they remained ineffective. rc4.173 is therefore rejected; the malformed research-cache hypothesis was insufficient.
- The new architectural correction does not chase another downstream startup statement. rc4.174 binds Kader/Ranking listeners immediately after the Season bootstrap implementation, before the large legacy/draft startup tail, and schedules roster hydration from an early microtask. A later synchronous startup exception can no longer leave the Season controls completely inert.
- Late duplicate onclick wiring is removed; binding is idempotent. Both early listeners provide immediate visible feedback and catch their own failures. Roster bootstrap remains bounded/fail-closed.
- Automated interaction/startup-resilience gates are updated to require the early binding and early roster-bootstrap rescue. Physical device update remains forbidden until candidate package, behavioral contract, project guardrails and Cloudflare preview are green.

## 2026-09-01 — rc4.175 regression root cause → rc4.176 no-trial repair
- Physical rc4.175 showed a major regression: Kader/Waiver/Trades could not be selected and Draft controls appeared inside Kader.
- Repository diff proved the direct cause: rc4.175 app.js had been accidentally truncated from about 395k to about 111k by an unsafe source-range replacement. The truncation removed setWorkspace and [data-workspace-target] click wiring. This was a release-process failure, not a Sleeper/device-cache issue.
- rc4.176 was built on isolated PR #97 from the full pre-truncation rc4.174 runtime, with only the premature/manual Season refresh path removed. Roster bootstrap and ranking refresh remain automatic.
- New executable no-regression gate requires app.js >380k, setWorkspace, all five workspace tabs and exact navigation wiring, absence of manual Season refresh controls, and automatic startup after ranking constants initialize.
- PR #97 exact-head Project Guardrails, behavioral/release contract, Candidate Package and Cloudflare Pages all PASS. Merged to main as 242ea4b982c5226d6958f6704d5c823d6c89aa9c.
- Main Candidate Package and behavioral-contract PASS; package run 33552319576 artifact 9817918079 digest sha256:6bd37d7dede76187ff6a38dbec625f183189f43c0af0b4b98b89cb563661a513. Main Cloudflare Pages PASS.
- Canonical strict guard failures immediately after merge were metadata/seal drift (runtime version lock + app blob mismatch), not runtime-test failures; v223 reseal aligns machine state with rc4.176.
- Installed device remains rc4.175 rejected. Last accepted rollback authority is rc4.169. No further device version may be used for debugging; next device action is one final confirmation after strict reseal PASS.


## 2026-09-01 — v224 handoff deep-audit / rc4.176 device observation
- v223 was 10/10 blob-integrity-consistent but semantically inconsistent: SEAL retained rc4.174/173 pointers; COMMAND retained handoffGeneration v222/device rc4.175 boundary; BOOTSTRAP still presented rc4.171 as current; LOCK retained v222/rc4.161 resume and stale currentWork; CURRENT still said rc4.175 installed. v224 repairs these and makes newer actual evidence authoritative.
- Physical Android screenshot at 22:09 CEST proves rc4.176 installed. Season shell/workspace buttons are visible and Draft controls are absent in the captured Kader frame, but Sleeper Live-State remains '-' and Live-Kader remains loading. Therefore rc4.176 is observed, NOT functionally accepted; static evidence does not prove navigation/hydration/automatic refresh/timeout behavior.
- Accepted rollback remains rc4.169. No downgrade to rc4.171-175 and no version-number-as-progress inference.
- New-chat first gate: repository/CI/deploy reconciliation, then browser-equivalent Season E2E. No more device-side trial-and-error/cache clearing/reinstall/repeated refresh/candidate churn before autonomous diagnosis.
- AUTO contract re-sealed: same-turn continuation; checkpoint + re-inventory after every package; no progress/status/ack finals, no empty replies, no false 'AUTO läuft weiter'. STATUS report-only.


## 2026-09-02 — v225 handoff / rc4.182 Kader + Experten unresolved
- Physical Android authority is now explicit: rc4.182 is installed and DEVICE_REJECTED. User reconfirmed at 10:09 CEST that both the live roster and experts still fail to load. Earlier rc4.182 screenshot showed static Sleeper Live-State '-' and Kader loading while the Draft decision-surface leak was absent.
- Accepted rollback remains rc4.169. Installation/version visibility is not acceptance.
- PR #98 (`pitti/rc4182-hydration-rootcause`) latest head `de3eed64b4c750c53ad8413deb0c1d71acf85d48` is OPEN/unmerged. Latest exact-head CI supersedes older green heads and is RED: Candidate Package 33607037207 and Project Guardrails 33607037186 fail on AUTO stop-code + CURRENT-next-gate regressions; Release Contract v2 33607037209 fails `season-startup-resilience-regression` with `automatic Season startup sequence invalid`, despite bootstrap-runtime and interaction-E2E passing earlier in that run.
- Therefore PR #98 must not be merged/promoted yet. New chat must reconcile/fix those exact failures, then run a real-shape startup harness proving both Kader hydration and expert initialization/load path before any further physical version.
- Root-cause discipline: the early-module/localStorage-cleanup path is a concrete hypothesis/fix candidate, not accepted truth. Kader + expert failures may share the same pre-startup boundary; audit all required top-level startup paths before downstream UI changes.
- Product priority locked: technical startup → Kader → Experts → FA/Waiver → Trade → gradual in-season expert transition. Jody Smith and Boone are preserved for the later expert/Trade phase but cannot displace the loading defect.
- Watcher parallel state: pitti-watcher main v0.2.5 with D1 amplification remediation and low recent hourly usage; v0.2.6 FA/trade foundation remains isolated as draft PR #1 and is not production authority.
- AUTO semantics re-locked: no progress/status/empty/promise-only messages; max one immediate external poll; blocked external lane does not stop independent work; STATUS is report-only; user device evidence is checkpointed immediately.


## 2026-09-02 — rc4.183 Season decision-surface correction
- Physical rc4.183 screenshot proves the former startup dead-state is crossed: Kader/Season UI renders and FA-vs-roster analysis executes. This supersedes v225's statement that Kader still does not load, but is not yet full device acceptance.
- User rejected decision semantics visible in that screenshot: generic FA engine compared skill players against roster K Harrison Mevis; Start/Sit proposed RB/WR replacements for Isaiah Likely without respecting the actual starter slot; starter cards lacked equivalent panel/projection/matchup evidence.
- Corrected architecture: Sleeper is authority only for live roster/ownership/current starter IDs and canonical league.roster_positions. Sleeper projections and matchup grades are explicitly excluded.
- Generic skill-position FA drop pool is QB/RB/WR/TE only; K and DST are excluded. Kicker evaluation exists only on Waiver/FA and compares available kickers against current roster kicker.
- Start/Sit now maps starter IDs by index to Sleeper roster_positions and uses canonical eligibility. FLEX permits RB/WR/TE, WRRB_FLEX permits RB/WR, REC_FLEX permits WR/TE, SUPER_FLEX permits QB/RB/WR/TE. Therefore two-TE lineups remain valid whenever the actual slot permits TE.
- Kader lineup labels show canonical slot labels rather than the occupying player's position, fixing Flex slots appearing as WR.
- Starter and alternative cards use the same PITTI evidence dimensions: weekly panel rank, verified expected points, PITTI matchup evidence, source/freshness.
- Added season-lineup-waiver-routing-regression and wired it into release/package gates.
- Latest CI failure after these changes was diagnosed as stale guardrail assertions for superseded Start/Sit v3 wording and the now-invalid Mevis-for-skill-player drop order. Guardrail updated to assert Start/Sit v5/PITTI panel and K-only kicker replacement instead; this is a guard modernization, not restoration of the rejected behavior.


## 2026-09-02 — Device evidence after rc4.183: Waiver surface + IR semantics
- Physical screenshot at 12:52 proves two remaining semantic defects: FA/Add-Drop cards are still rendered under Kader, and Zach Charbonnet on Reserve/IR is being selected as the drop side of skill-player swaps.
- Required behavior: Kader is lineup/start-sit only. FA/Add-Drop decisions belong to Waiver/FA. Internal pair computation may run during bootstrap solely to feed Waiver/Action Board.
- Required behavior: Reserve/IR is not an occupied active roster slot and cannot be used as a normal drop target to make room for a free agent. Live drop candidates must have seasonStatus ACTIVE. IR players remain roster assets for valuation/hold decisions but are excluded from ordinary add/drop capacity comparisons.
- Candidate PR #101 implements both rules and adds season-waiver-surface-ir-regression. Initial package failure was a stale bootstrap regression token expecting the old visible renderRosterFaAudit call; runtime release gate, project guardrails, and the new semantic regression itself all passed. Bootstrap regression was updated to require computation-only render:false semantics rather than restore the rejected visible Kader surface.
- No device promotion until exact PR head is fully green.


## 2026-09-02 — HANDOFF v226 / rc4.184 exact current boundary
- Physical Android authority: rc4.183 is installed/observed. It proves Season/Kader startup renders, but is DEVICE_REJECTED for decision-surface semantics: FA/Add-Drop cards rendered under Kader and Reserve/IR Zach Charbonnet was used as a normal drop target.
- PR #101 fixed those exact defects and passed exact-head gates before merge to main as f5f7b3933a5416ac64250abad9e425c76435d62f: Kader lineup-only, FA decisions routed to Waiver/FA, live ordinary drop candidates require seasonStatus ACTIVE, IR/reserve remains a roster asset but not an ordinary capacity/drop slot.
- Earlier PR #100 merged canonical slot/decision semantics to main as 4ac2eec9f5a73b1195de45fef00f9a5c591278c2: Sleeper league.roster_positions is slot authority; FLEX=RB/WR/TE, WRRB_FLEX=RB/WR, REC_FLEX=WR/TE, SUPER_FLEX=QB/RB/WR/TE; two TE are valid when actual slot permits. K/DST excluded from generic skill drop pool; roster K compared only with available K on Waiver/FA. Sleeper projections/matchup grades are not PITTI decision inputs. Starter and alternative comparison should use PITTI weekly panel rank + verified expected points + PITTI matchup evidence + provenance/freshness.
- Release candidate PR #102 branch pitti/rc4184-release is OPEN/unmerged. Current head after handoff repair will supersede prior heads. Initial rc4.184 head failed runtime parity because app.js alone was bumped. app.js/index.html/sw.js/README were then synchronized, proving runtime startup + realshape + lineup/waiver/IR regressions PASS, but latest observed head 6f7a82d702eeb17aafc54b7cdc579e5529c45f80 still failed package/release because manifest.webmanifest retained rc4.183. Manifest is now synchronized to rc4.184. Therefore do NOT cite 6f7a82d as green and do NOT merge/deploy until the new exact head is fully green.
- PR #102 observed tests before manifest failure included: RUNTIME_STARTUP_CONTRACT_PASS rc4.184; SEASON_BOOTSTRAP_RUNTIME_REGRESSION_PASS; SEASON_INTERACTION_E2E_GATE_PASS automatic-only; SEASON_STARTUP_RESILIENCE_PASS; SEASON_REALSHAPE_STARTUP_E2E_PASS roster+experts fail-open; SEASON_EXPERT_PHASE_POLICY_PASS; SEASON_LINEUP_WAIVER_ROUTING_PASS; SEASON_WAIVER_SURFACE_IR_PASS; automatic refresh and workspace navigation PASS. These are useful diagnostics but promotion still requires all exact-head gates green.
- Next order: (1) inspect exact PR #102 head and CI; (2) repair only actual exact-head failures if any; (3) merge only fully green exact head; (4) verify main/post-merge release/deploy; (5) only then one physical Android rc4.184 canary. Device canary must prove Kader has lineup/start-sit only, canonical slots/FLEX labels, IR excluded from ordinary drop targets, and Add/Drop cards appear under Waiver/FA.
- Expert-phase work remains parallel but must not destabilize release. Preserve position-specific phase policy and gradual pre-Week-1 -> in-season transition. Justin Boone is planned as strong in-season/Trade Value input; Jody Smith remains preserved where appropriate. DST policy preserves RotoBaller tier signal plus Polizzi-style multi-week schedule planning; opportunistic stash of the over-next-week DST is allowed only when spare roster capacity/opportunity cost is favorable and matchup advantage is material.
- AUTO contract remains exact: no intermediate/progress/ack messages, no empty replies, no false 'AUTO läuft weiter'; after each package checkpoint + re-inventory and continue independent safe lanes; max one immediate external poll, waiting external blocks only that lane; STATUS is report-only. No device-side trial-and-error.


## 2026-09-02 — v227 takeover audit / stale-authority repair
- New-chat verification of PR #102 head `8b02812180dde8b15b48ac734fcb6b88159b8a93` found material v226 inconsistencies: SEAL still v225/rc4.182/PR98; CURRENT device evidence still rc4.182 despite installed rc4.183; LOCK currentWork/gate/handoff still rc4.182/PR98/v224; COMMAND currentGate/Season nextGate still old; PREFLIGHT still had a misleading CURRENT rc4.129 block; guardrail source candidates stopped at rc4.182 and conflated a failed older device with the newer source candidate.
- Physical authority is rc4.183 installed/observed and DEVICE_REJECTED specifically for Kader FA-card routing + IR ordinary-drop semantics; former startup/Kader loading dead-state was crossed. Accepted rollback remains rc4.169. #100/#101 are merged authority; rc4.184 PR #102 remains open/unmerged.
- Pre-repair CI was RED on stale canonical/guard metadata; runtime Season gates through lineup/Waiver/IR routing passed before that guard failure. Never restore rejected product behavior to satisfy stale tests.
- v227 aligns canonical handoff files, modernizes the executable guard for rc4.184/PR102 and version-scoped device rejection, and restores the Library persistence fail-closed rule.
- AUTO contract remains: no progress/status/ack output, no empty response, no promise-only “AUTO läuft weiter”; checkpoint + re-inventory + same-turn continuation while safe work exists. STATUS is report-only.
- Next gate: newest PR #102 exact head after v227 repair must be fully green before merge, post-merge deployment verification and exactly one rc4.184 physical canary.


## 2026-09-02 — PR #108 Season league-state / Lawrence waiver / trade-slot checkpoint
- rc4.185 is the merged source baseline. PR #107 merged canonical slot/expert/trade-evidence contracts. Physical authority is unchanged: rc4.183 installed/observed DEVICE_REJECTED; rc4.169 accepted rollback.
- User surfaced Trevor Lawrence as a deliberate possible exception to the draft-only one-QB policy. Key roster constraint: the first ordinary ACTIVE drop is already needed for D/ST; adding Lawrence first therefore consumes the first drop and makes the second ordinary ACTIVE drop the later D/ST cost. Same bye with Jayden Daniels is a negative but not a hard exclusion.
- PR #108 removes static Trade Board positional depths and evaluates targets through the actual canonical Sleeper starter/FLEX geometry. A second TE is not penalized merely for being TE2 and may be valuable if it wins FLEX.
- PR #108 now persists the complete live Sleeper league state: all ten rosters, manager/user mapping, draft-slot→canonical-manager profile mapping, starters, reserve/IR, taxi, waiver priority, FAAB used/remaining, plus optional current transaction-round evidence. This shared state serves both Waiver competition and Trade evaluation.
- Waiver opponent modeling uses current live roster need and FAAB as dominant evidence. Completed current-season waiver bids and historical manager QB-roster tendency are bounded priors only; they may not override current roster geometry. Output is a claim probability and FAAB range, not a falsely precise deterministic bid.
- QB opportunity cards are independent from the generic skill Add/Drop list so a potentially valuable QB2 such as Lawrence is not silently suppressed merely because Daniels is rostered. The card explicitly shows same-bye risk, strongest opponent competition, remaining FAAB, market-clearing estimate, and two-slot QB+D/ST opportunity cost.
- The previous blanket live-season QB2/TE2 treatment was split correctly: 1QB makes ordinary QB2 expensive but not globally forbidden; TE2 has no blanket penalty because FLEX accepts TE.
- CI failure on an earlier PR #108 head was diagnosed as a stale literal guard demanding “Trade Board v4”; runtime Season tests had passed. Guard now accepts v4/v5 rather than reverting Trade Board v5 behavior. A separate stale regression sentence for Sleeper roster_id identity is preserved as a comment while v5 logic remains canonical.
- Final PR #108 gate after this checkpoint: reseal exact content, all strict gates green, merge, then promote as rc4.186 and verify deployment before one physical device canary. No manual roster screenshots are a permanent dependency.


## 2026-09-02 — v229 FINAL HANDOFF AUDIT / CURRENT-POINTER REPAIR
- Handoff generation: `20260902T1325Z-v229`.
- The requested second-pass handoff audit found three material stale-current defects after v228: PITTI_CURRENT_STATE.handoff still pointed to generation v227 / rc4.184 PR #102; PITTI_EXECUTION_LOCK.authority.failClosedRecovery still declared v227 + PR #102 current; PITTI_AUTO_PREFLIGHT section 8 still labeled v227/PR #102 as CURRENT. These could have resurrected an already superseded release lane in a fresh chat.
- v229 removes those stale current pointers without modifying product semantics. Historical v226/v227/PR102 entries remain only as chronological provenance and are explicitly superseded.
- Current authority: POST_DRAFT_SEASON_COMPANION; rc4.185 merged source baseline; PR #108 OPEN/UNMERGED on pitti/trade-slot-geometry; latest physical Android rc4.183 DEVICE_REJECTED for Kader FA-card + IR ordinary-drop semantics; accepted rollback rc4.169.
- PR #108 must preserve: live roster_id != historical draft slot invariant; canonical Sleeper slots and FLEX=RB/WR/TE; legal two-TE paths; Trade Board v5 actual slot geometry; no blanket TE2 waiver penalty; ACTIVE-only ordinary drop candidates; full ten-team Sleeper manager/roster/starter/reserve/taxi/FAAB state; opponent waiver-market foundation; Lawrence same-bye negative plus TWO active-drop opportunity cost because D/ST is still required.
- Exact-head rule remains: v229 handoff commits create a new PR #108 head. Query that newest head and its CI; never infer release readiness from 0a41ca11 or 7301e497. All strict gates green before merge; then rc4.186 promotion, post-merge/deploy parity verification, and exactly one physical canary.
- AUTO contract is current and non-negotiable: continuous same-turn execution while safe work exists; checkpoint + re-inventory after each package; no interim progress/status/ack responses; no empty response after tool work; no promise-only “AUTO läuft weiter”; waiting external blocks only dependent lane; STATUS report-only.

- Final v229 CI audit exposed two additional handoff-guard defects on sealed head `bf84c32a08fd4f85c63d01b0274e9b867a0b8a2c`: executable guard still capped Season source_candidate at rc4.184, and it accepted seal status only PASS (or explicit pending), while v229 used PASS_HANDOFF_ONLY_PR108_VALIDATION_PENDING. Runtime startup and Season semantic regressions passed before these guard failures. Guard is now extended to rc4.185 + PR108 gates; seal will use canonical PASS while exact_gate/note continue to state that PR108 release validation is pending. No product behavior is reverted.


## 2026-09-02 — HANDOFF v230 / rc4.189 post-merge reseal
- Handoff generation: `20260902T1915Z-v230`.
- rc4.189 is merged on main at `88c007732f94df7b1624a6c05a0b16af4d33d94f`; PR #108 is historical/merged and must never be resurrected as an open current gate.
- Latest physical Android authority is rc4.188 with Waiver/FA route, live Sleeper ownership, kicker-isolation and active-drop/IR semantics PASS. rc4.169 remains accepted rollback authority until rc4.189 physical acceptance.
- Post-merge CI on main proved rc4.189 runtime startup and candidate package PASS, but Project Guardrails failed because the squash merge left the handoff seal and several current-gate/AUTO tokens stale. This is a checkpoint/seal defect, not a product-runtime rollback signal.
- v230 repairs CURRENT/LOCK/COMMAND/bootstrap/handoff/matrix authority to rc4.189 and the actual rc4.188 device evidence, extends the guard to the rc4.189 post-merge reseal gate, and requires a fresh integrity seal.
- Current gate: `RC4189_POSTMERGE_RESEAL_ALL_GREEN_THEN_DEVICE_CANARY`. Exact-head strict gates must be green, then deployment parity must be verified, then exactly one rc4.189 physical canary. No cache clearing/reinstall trial-and-error.
- AUTO remains continuous same-turn execution: after every package checkpoint + re-inventory; waiting external blocks only its dependent lane; no progress/status/ack messages, no empty reply, and no promise-only “AUTO läuft weiter” while executable work exists. STATUS is report-only.
- Watcher v0.2.6 remains isolated in draft PR #1. Skill-position bench drops are now fail-closed unless current replacement/upside evidence exists; Reserve/IR remains excluded and automatic transactions remain forbidden.


## 2026-09-02 — CODEX PREPARATION / rc4.190
- Larger Season changes are intentionally grouped for Codex rather than continued as piecemeal chat patches.
- Added root `AGENTS.md` with canonical authority, anti-regression rules, Season roster geometry, Waiver/Trade invariants, fail-closed evidence policy and AUTO/handoff discipline.
- Added `PITTI_CODEX_WORK_PACKAGE.md`: compact weekly roster evidence, Waiver/team-needs v3, bilateral Trade/team-needs v2, verified projections/Vegas/weather adapters, and executable regression/release gates.
- PR #118 remains reviewable/unmerged. Existing isolated fixes: remove redundant numeric roster grid and duplicate start-alternative block; protect only active TE/QB; add pre-W1 draft-capital plausibility gate to trade offers.
- Codex execution itself is not yet verified from this chat/tool environment; no Codex tool is exposed here. PC setup/end-to-end repo access must be verified before delegating the work package. This is a capability boundary, not a code blocker.
- Do not merge/deploy rc4.190 merely because the preparation files exist. Codex/implementation output must pass strict gates and review first.


## 2026-09-02 — Live/News RB contingency seed
- Began P0 precompute rather than waiting for Codex: added `data/rb-contingency-seed-2026-09-02.json` covering all 32 RB rooms from current research, with explicit committee/role-split flags and fail-closed confidence.
- Current RotoWire 2026 handcuff research is used only as a seed/role-analysis source, not authoritative live truth. It explicitly identifies clear contingency profiles (e.g. Corum, Bigsby, Pacheco), committee risks (LAC/NYJ), and unresolved rooms (SF/DAL/MIA/BAL/IND/WAS/KC/MIN/SEA).
- Research itself exposed why fail-closed provenance is mandatory: at least one seed mapping is internally inconsistent (ARI/Allgeier) and is marked SOURCE_CONFLICT rather than silently accepted. Every room still requires primary/current depth-chart verification before event activation.
- Next data task: primary/Ourlads reconciliation for low-confidence/conflict rooms, then add live Sleeper ownership and contingent-action layer. No seed entry alone is actionable.

- RB reconciliation pass: Ourlads all-team depth charts are current to 2026-09-02 14:21 ET; RotoWire all-team depth charts report 2026-09-02 and real-time change/inactive updates. Corrected MIN seed to Aaron Jones -> Jordan Mason -> Demond Claiborne from current Ourlads. Purged the known-bad ARI/Atlanta cross-team seed entirely rather than preserving a contaminated mapping.
- Added `data/live-news-source-registry.json` with source tiers, action-authority policy, latency timestamps and a mandatory 32-team credentialed beat-reporter registry task. Structured depth feeds are corroboration/discovery, not sole action authority.
