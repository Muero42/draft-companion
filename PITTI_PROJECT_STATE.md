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
