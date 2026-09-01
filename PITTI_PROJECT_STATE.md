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
