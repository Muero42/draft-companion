# NEW CHAT HANDOFF — PITTI SEASON COMPANION
Generation: `20260901T0340Z-v216`
Generated: 2026-09-01 05:40 CEST

## CANONICAL MODE
POST_DRAFT / SEASON_COMPANION. This supersedes pre-draft v215 operational pointers.

## AUTHORITY
- Real draft `1366053132970233856` is complete and immutable historical evidence.
- Accepted Android baseline remains `v11.8.0-rc4.158`.
- Season candidate is `v11.8.0-rc4.159` on branch `season-companion-rc4.159`; it is NOT Android-accepted yet.
- Current Sleeper league state is the season Source of Truth, never the frozen draft roster.
- First real roster delta/canary: Zach Charbonnet on IR/reserve; Tank Bigsby added.
- Watcher v0.2.0 exposes `/league-state`; rc4.159 consumes it for current roster, league ownership and real free-agent pool.
- If live league state cannot be resolved, season acquisition logic fails closed; draft roster may display only as historical baseline.

## SEASON CONTRACT
Keep `draft_roster`, `current_roster`, and transaction history semantically separate. Free agency must compare a concrete ADD X against DROP Y and classify CLEAR ADD / WATCH / HOLD with confidence, freshness/provenance and invalidator. IR/PUP/reserve are distinct roster states and consume roster-slot opportunity differently. Watcher research ingestion remains gated by scheduled-health PASS. No automatic Adds/Drops, FAAB claims or trades. FantasyPros A-/92 remains benchmark/diagnostic only.

## NEXT GATE
Static regression of rc4.159, then exactly one Android/device end-to-end verification. Required canary: app resolves current Sleeper roster, shows Bigsby as rostered, Charbonnet as reserve/IR, excludes Bigsby from FA pool, and evaluates only truly unowned players. Do not promote rc4.159 before that passes.

After live-sync acceptance: FAAB/waiver model, then lineup/start-sit, then full trade evaluation. Draft ADP is historical context and must decay in season decisions relative to ROS/usage/role/health/depth-chart evidence.
