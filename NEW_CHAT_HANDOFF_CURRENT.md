# NEW CHAT HANDOFF — PITTI SEASON COMPANION
Handoff generation: `20260901T1812Z-v218`
Generated: 2026-09-01 18:12 CEST

## CANONICAL MODE
POST_DRAFT / SEASON_COMPANION. This v218 handoff supersedes stale v217 rc4.161/165/166 device-gate pointers.

## AUTHORITY
- Repository: `Muero42/draft-companion`, branch `season-companion-rc4.159` (historical branch label, not runtime version).
- Verified repository head at handoff: `d2d7771f778d7e3ceba86e27fc9d7a0ae059981a`.
- Current source candidate: **v11.8.0-rc4.167**.
- All three CI gates on the exact handoff head: **PASS** (Project Guardrails, Candidate Package, Release Contract v2).
- Last physically observed Android runtime: **v11.8.0-rc4.166**, and its season startup FAILED: UI still showed “Sleeper Draft: Wartet auf Draft”, Waiver/Trade “Noch kein abgeschlossener Draft geladen”.
- Therefore rc4.166 is rejected; do not retest it.
- Real draft `1366053132970233856` is complete/immutable history. Current Sleeper league state is the sole operational roster/ownership authority.

## MATERIAL ARCHITECTURE CORRECTION — rc4.167
The user correctly identified that season operation must not wait on a completed draft. rc4.167 changes the model rather than continuing bootstrap patch trial-and-error:
1. Season-first UI: Kader is default; Waiver/FA, Trades, Live/News are normal season surfaces.
2. Draft moves to **Draft-Archiv** and its status card is draft-workspace-only.
3. Season bootstrap hydrates live Sleeper league state first. Historical draft is optional archive enrichment and must never gate season surfaces.
4. On fresh browser/origin only, league identity may be recovered once from immutable draft metadata; after leagueId is cached, season operation does not wait on draft state.
5. Static “Noch kein abgeschlossener Draft geladen” season placeholders are replaced by live-state loading/fail-closed diagnostics.
6. A real bug was fixed: failure handling referenced nonexistent waiverWorkspace/tradeWorkspace nodes. rc4.167 targets actual waiverStatus/waiverList and tradeStatus/tradeList.
7. Service-worker/runtime version advanced to rc4.167 to prevent rc4.166 cache masquerading as the new build.

## RELEASE STATE
- rc4.167 implementation commit: `8c64d9180c0aa06dff87393970c2a4fd52ae5150`.
- Metadata/guard alignment completed through exact head `d2d7771f778d7e3ceba86e27fc9d7a0ae059981a`.
- Exact-head CI: all three gates PASS.
- Do NOT claim physical rc4.167 Android acceptance yet.
- Before requesting a device canary, verify preview deployment/parity for rc4.167 autonomously. Only then one physical Android canary is justified.

## CLOUDFARE / D1 INCIDENT
- User received repeated Cloudflare D1 daily rows_read limit alerts (5,000,000 rows); user states Cloudflare is used for nothing else and not manually for days/weeks.
- GitHub PR #89 shows Cloudflare Pages deployments for this exact draft-companion branch. PITTI is therefore the primary suspect; previous repository-only D1 exoneration is withdrawn.
- Repository contains no direct D1 query/binding code in `_worker.js`; account-side binding/analytics remain unavailable from current tools, so exact D1 query source is not proven.
- High-confidence infrastructure problem: this Cloudflare-bound branch accumulated at least 100 commits in ~3h15m, and Git integration can deploy per commit. Stop micro-commit/checkpoint use of the Cloudflare-bound runtime branch.
- Runtime changes must be batched/tested and deployed once. Do not buy a paid Cloudflare plan merely to mask unidentified read amplification.
- If account-side evidence becomes necessary, inspect Cloudflare project Bindings / D1 Analytics; do not speculate with code changes.

## FROZEN DRAFT RETROSPECTIVE
PC continuation completed the diagnostic retrospective far beyond v217. Preserve PITTI_PROJECT_STATE.md EOF as authority. Key implementation backlog:
- Return-vNext: horizon-aware calibration; board/ADP prior; confidence/entropy-shrunk manager effects; late DST/K/QB/TE slot obligations; bounded roster/IR modifiers; no unjustified empirical 0/100.
- Sequence planner: joint portfolio utility, true preference vs selected-first, desired second asset, fallback distribution, scarcity/LossIfGone/sequence intent.
- Coach: MARKET/PANEL VALUE separate from STRATEGIC/OPTION VALUE; decision-intent labels prevent user overrides becoming false negatives.
- Single IR slot is consumable state; own IR option value and opponent IR signal are separate.
- Manager target lists are probabilistic consumer sets; high-entropy managers flattened.
- Frozen retrospective is ex-ante only; no current rankings or season outcomes may contaminate it.
- Do not ad-hoc tune 2026. Shadow-model implementation/validation comes later.

## PRESERVED TRANSACTION CANARY
- rc4.160 device proved automatic live transaction detection: Harrison Mevis rostered; Tank Bigsby absent; Zach Charbonnet Reserve/IR. Do NOT repeat rc4.160 device testing.

## AUTO / AUTO BLOCK — HARD CONTRACT
- AUTO is a continuous same-turn loop, not one work package.
- After every package: checkpoint material change -> re-inventory all independent lanes -> immediately execute next safe positive-value lane.
- Never send status/progress/acknowledgement messages such as “AUTO läuft”, “ich mache weiter”, “CI läuft”, “Commit erstellt”, or “keine Nutzerhandlung nötig” while executable work remains.
- Empty assistant response after tool work is forbidden.
- Visible AUTO response only when active=[], ready=[] and stop_evaluation.allowed=true with approved stop code.
- STATUS is report-only: no tools/work/polling.
- Cloudflare deploy amplification changes checkpoint discipline: do NOT persist every AUTO micro-step on the auto-deployed runtime branch. Batch material runtime changes; use existing canonical files only when a handoff/milestone genuinely requires persistence.

## NEW-CHAT TAKEOVER ORDER
1. PITTI_COMMAND_CONTRACTS.json
2. PITTI_CURRENT_STATE.json
3. PITTI_HANDOFF_SEAL.json
4. PITTI_EXECUTION_LOCK.json
5. PITTI_AUTO_PREFLIGHT.md
6. PITTI_PROJECT_STATE.md to EOF
7. NEW_CHAT_HANDOFF_CURRENT.md
8. PITTI_NEW_CHAT_BOOTSTRAP.md
9. HANDOFF_COMPLETENESS_MATRIX.md
10. actual repo head/version/CI/preview/device evidence

On contradiction, newest verified repo/CI/device evidence + PITTI_PROJECT_STATE EOF + this v218 handoff override stale v217 pointers. Never resurrect rc4.161/165/166 device gates merely because old metadata still contains them.
