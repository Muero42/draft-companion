# NEW CHAT HANDOFF — PITTI SEASON COMPANION
Handoff generation: `20260901T1812Z-v218`
Generated: 2026-09-01 18:24 CEST

## CANONICAL MODE
POST_DRAFT / SEASON_COMPANION. v218 supersedes v217 and stale rc4.161/165/166 takeover pointers.

## AUTHORITY
- Repository Muero42/draft-companion, branch season-companion-rc4.159 (historical label only).
- Current source candidate **v11.8.0-rc4.167**.
- Re-read actual branch head and exact-head CI at takeover; do not trust a frozen SHA as timeless authority.
- Last physically observed Android runtime **rc4.166**; season startup FAILED.
- Last limited accepted Android authority **rc4.161**. rc4.163-166 are not accepted by inference.
- gh-pages season-preview currently serves **rc4.166**; rc4.167 preview parity remains pending.
- Draft 1366053132970233856 is complete/immutable history. Live Sleeper league state is sole operational roster/ownership authority.

## RC4.167 ARCHITECTURE
1. Kader is season default; Waiver/FA, Trades, Live/News are normal season surfaces.
2. Draft is **Draft-Archiv** and cannot gate season operation.
3. Season bootstrap hydrates live Sleeper league state first; draft history is optional enrichment.
4. Fresh-origin league identity may be recovered once from immutable draft metadata, then cached.
5. Season placeholders are live-state loading/fail-closed messages, never “Noch kein abgeschlossener Draft geladen”.
6. FAIL-CLOSED bug fixed: actual waiverStatus/waiverList and tradeStatus/tradeList nodes are used instead of nonexistent waiverWorkspace/tradeWorkspace.
7. rc4.167 SW/runtime version prevents rc4.166 cache masquerading as candidate.

## RELEASE GATE
Previous v218 draft incorrectly embedded old-head CI PASS while later handoff edits made the actual head fail metadata guardrails. Deep audit found and corrected this.
New chat must: actual head -> exact-head three CI gates -> rc4.167 preview parity/deploy as one batch -> one Android canary only after parity.
Do not claim rc4.167 deployed/device-accepted before those gates.

## PRESERVED TRANSACTION CANARY
rc4.160 proved: Harrison Mevis rostered; Tank Bigsby absent; Zach Charbonnet Reserve/IR.
Do NOT repeat rc4.160 device testing. Do NOT retest rc4.166.

## CLOUDFARE / D1
User uses Cloudflare for no other workload. Treat PITTI as primary suspect for repeated 5,000,000 rows_read alerts until disproven.
PR #89 proves Cloudflare Pages deploys this project. No direct repo D1 query/binding is proven.
At least 100 commits in ~3h15m on the Pages-connected branch created a deployment storm: confirmed infrastructure anti-pattern.
No runtime-branch micro-checkpoints. Batch/test/deploy once. Do not buy paid plan merely to hide root cause.

## FROZEN DRAFT RETROSPECTIVE
PROJECT_STATE EOF preserves PC continuation: Return-v2 calibration, decision-intent taxonomy, sequencing/single-IR corrections, manager collision/entropy findings, ex-ante pick-value, opportunity-cost/board-flow and final Return-vNext/sequence/market-vs-strategic backlog. No current rankings/outcomes may contaminate it.

## AUTO / AUTO BLOCK — HARD CONTRACT
- Continuous same-turn loop, not one work package.
- After every package: checkpoint only if materially necessary -> re-inventory -> execute next safe positive-value package.
- Waiting CI/deploy/device blocks only dependent lanes.
- Never send status/progress/acknowledgement messages such as “AUTO läuft”, “ich mache weiter”, “CI läuft”, “Commit erstellt”, or “keine Nutzerhandlung nötig” while executable work exists.
- Empty assistant response after tool work is forbidden.
- Promise-only responses are forbidden.
- Visible AUTO response only when active=[] and ready=[] and stop_evaluation.allowed=true with approved stop code.
- STATUS is report-only: no tools/work/polling/continuation.
- Cloudflare discipline: no micro-commit checkpointing on auto-deployed runtime branch.

## TAKEOVER ORDER
COMMAND -> CURRENT -> SEAL -> EXECUTION_LOCK -> AUTO_PREFLIGHT -> PROJECT_STATE EOF -> this handoff -> BOOTSTRAP -> MATRIX -> actual repo/CI/preview/device evidence.
On contradiction, newest verified actual evidence + PROJECT_STATE EOF + this v218 handoff win.
