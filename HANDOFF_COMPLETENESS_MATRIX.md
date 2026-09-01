# PITTI HANDOFF COMPLETENESS MATRIX — v217
Generation: `20260901T1058Z-v217`

Takeover is PASS only if ALL current items below are recognized without contradiction.

## Current runtime/release
- Mode = **POST_DRAFT_SEASON_COMPANION**.
- Branch = `season-companion-rc4.159` (historical branch label only).
- Source/preview candidate = **v11.8.0-rc4.161** across app.js/index.html/sw.js/manifest.
- Accepted Android authority = **v11.8.0-rc4.158** until rc4.161 physical acceptance.
- Real draft `1366053132970233856` = complete, immutable history.
- Current roster/ownership authority = live Sleeper league state.
- rc4.160 device transaction canary = PASS for automatic roster transaction detection: Mevis rostered, Bigsby absent, Charbonnet Reserve/IR.
- rc4.160 FA audit = FAIL because it could render false `0 ranked FAs → HOLD`.
- rc4.161 fixes ownership/ranking coupling and adds executable `tools/season-fa-ownership-regression.mjs`.
- Candidate package, release contract and project guardrails for rc4.161 code = PASS.
- Exact next gate = **DEVICE_RC4161_ACCEPTANCE**.
- Do not repeat rc4.160 device test.

## Season anti-regression locks
- Draft roster, current roster and transaction history are distinct.
- Post-draft free agents are players unowned across all live Sleeper rosters; “undrafted” is never sufficient.
- Live ownership discovery must not depend on expert-ranking hydration.
- A live FA pool with rankings not ready must show “ranking not ready” and must not infer HOLD.
- FA actions fail closed if current league state cannot be resolved.
- No automatic external add/drop, FAAB claim or trade.
- Mevis/Bigsby decisions must ignore acquisition recency/sunk cost.
- Price, Watson and Downs are not casual K-drop candidates.
- Historical Mevis comparison ordering before the actual transaction: Bigsby → Spears → Gainwell.
- Current Sleeper state supersedes that historical comparison after any transaction.

## League/model historical locks that must not regress
- 10-team Half-PPR, 1QB, user slot 9.
- Starter maxima are not roster caps.
- Exactly one QB for user draft strategy; Geno Smith and Aaron Rodgers remain hard user exclusions on the user's draft recommendation surface.
- v4 PRIMARY / v5 CHALLENGER / v3 failsafe historical model remains preserved.
- Exact 2026 manager order remains Michael / Pascal Voerde / Marc Düsseldorf / Thomas / Björn / Pascal Gelderner / Giuliano / Bastian / Muerotechnik / Dutch Marc.
- No Michael K; no Moers Venom; Bastian slot 8.
- Five-WR historical identity remains DeVonta Smith / Zay Flowers / Emeka Egbuka / Tetairoa McMillan / Jaylen Waddle.

## AUTO takeover integrity
- Generation must be **20260901T1058Z-v217** across CURRENT / SEAL / CURRENT HANDOFF / BOOTSTRAP / MATRIX / LOCK / COMMAND.
- AUTO persistent queue = `PITTI_CURRENT_STATE.json:auto_execution_state`.
- No visible AUTO response while `active` or `ready` is non-empty.
- After every work package, re-inventory and execute the next safe autonomous package in the SAME turn.
- Waiting CI/deploy/device gates block only dependent lanes.
- Forbidden terminal/progress messages include “AUTO läuft”, “ich mache weiter”, “CI läuft”, “Commit erstellt”, “keine Nutzerhandlung nötig”.
- Empty assistant response after tool work is forbidden.
- Visible stop requires active=[], ready=[], stop_evaluation.allowed=true and an approved stop code.
- STATUS never starts work or tool calls.

## Stale-pointer rejection
Any current pointer that says v215/v216, DRAFT_READY_FROZEN, DRAFT_DAY_TIME_DEPENDENT_FINALIZATION, Bigsby still rostered after the Mevis transaction, rc4.159/160 as the current candidate, or rc4.160 still requiring another device test is stale historical context and MUST NOT override v217.
