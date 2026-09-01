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
