# NEW CHAT HANDOFF — PITTI SEASON COMPANION
Handoff generation: `20260902T0810Z-v225`
Created: 2026-09-02 10:10 CEST

## ACTUAL AUTHORITY — DO NOT RECONSTRUCT FROM OLDER CHAT MEMORY
- Repository authority: `Muero42/draft-companion` main plus actual PR/CI evidence.
- Android currently runs **v11.8.0-rc4.182**. This version is **DEVICE_REJECTED**, not a candidate awaiting acceptance.
- User reconfirmed at 10:09 CEST: **Kader still does not load and experts still do not load**.
- Earlier rc4.182 screenshot: Season shell/Kader workspace visible, Draft decision surface leak absent, but Sleeper Live-State stayed `-` and Live-Kader stayed loading.
- Accepted rollback authority remains **rc4.169**. Do not call rc4.182 accepted merely because it is installed.

## PR #98 — CURRENT BLOCKER
- PR #98 `pitti/rc4182-hydration-rootcause` is OPEN and unmerged.
- Latest head: `de3eed64b4c750c53ad8413deb0c1d71acf85d48`.
- GitHub reports mergeable=true, but **project policy forbids merge/promotion because latest-head CI fails**.
- Candidate Package run **33607037207 FAIL**: `AUTO stop code invalid` + `Season Companion CURRENT next gate regression`.
- Project Guardrails run **33607037186 FAIL**: same guardrail failures.
- Release Contract v2 run **33607037209 FAIL**: `season-startup-resilience-regression` → `automatic Season startup sequence invalid`. In that run, `SEASON_BOOTSTRAP_RUNTIME_REGRESSION_PASS rc4.182` and `SEASON_INTERACTION_E2E_GATE_PASS` occurred before the resilience failure.
- Earlier PR #98 heads did pass, but that evidence is superseded by the failing latest head. Never cite old-head green CI as current validation.

## ROOT-CAUSE DISCIPLINE
- Current leading failure class is **early app.js/module initialization**, before normal Season hydration; PR #98 isolates one concrete localStorage-cleanup exception path.
- This hypothesis/fix is **not yet accepted**, because latest PR head is red and the physical app also fails expert loading.
- Treat Kader + Experten as potentially common startup/initialization symptoms until proven otherwise.
- Before another version: audit/reproduce every pre-startup top-level path needed to reach both Season bootstrap and expert initialization. Do not patch downstream UI blindly.

## EXACT NEXT ORDER
1. Load this handoff + CURRENT + LOCK + COMMAND contracts; compare with actual main and PR #98 head/CI.
2. Fix only the exact latest-head guardrail/startup-sequence failures.
3. Run strict gates on the exact head.
4. Run a real-shape/browser-equivalent startup harness proving:
   - JS startup marker reached,
   - Sleeper league/roster hydration reaches success or bounded visible fail-closed state,
   - Kader rows render,
   - expert initialization/load path executes and produces usable expert/panel state,
   - no indefinite static placeholders,
   - no Draft UI leakage into Season workspaces,
   - removed/optional DOM cannot abort startup.
5. Only after all automated PASS may one new device version be promoted for a final physical canary.
6. After loading is fixed: **FA/Waiver first, then Trade**, then gradual Week-1+ in-season expert transition.

## EXPERT PHASE PLAN — PRESERVE BUT DO NOT PRIORITIZE OVER STARTUP
- Jody Smith is the individual Draft Sharks expert we had wanted for Draft-phase use; preserve as a pre-Week-1 candidate once loading works.
- Justin Boone is a strong in-season source and his public redraft Trade Value Charts are planned as a major Trade input when the current 2026 redraft chart exists.
- Pre-Week-1: do not abruptly discard draft/preseason evidence. Transition gradually toward in-season/ROS accuracy after real games begin.
- No expert-weight redesign may hide or delay the current Kader/Experten loading defect.

## WATCHER / D1 PARALLEL STATE
- `Muero42/pitti-watcher` main = **v0.2.5**.
- Acute D1 amplification is considered remediated; recent Cloudflare screenshots showed low current hourly reads/writes.
- v0.2.6 FA/trade foundation is isolated on draft PR #1 / branch `pitti-auto/v0.2.6-fa-trade-foundation`; **not main, not production authority**.
- Keep this as secondary work only until Companion startup is healthy.

## AUTO / AUTO BLOCK — EXACT BEHAVIOR
- AUTO means continuous autonomous work in the same assistant turn while safe executable work exists.
- After every package: checkpoint material changes, re-inventory all independent lanes, execute the next highest-value safe package.
- **No progress/status/acknowledgement messages**, no empty messages, no “AUTO läuft weiter”, no promise-only terminal replies.
- External CI/deploy: at most one immediate status poll. If still pending, checkpoint `waiting_external`, continue independent lanes, and end only if no safe independent work remains.
- A blocked lane does not stop other independent lanes.
- Device trial-and-error is forbidden. Device interaction is final confirmation only after automated E2E PASS.
- Every user device screenshot/version report is a mandatory checkpoint event before further code/promotion.
- `STATUS` is strictly report-only: no tools, no CI polls, no mutations, no AUTO continuation.

## ANTI-REGRESSION
- Do not resurrect rc4.171–176 device-debug loops, rc4.175 truncated runtime, stale handoff generations, stale installed-version fields, or old green CI from a superseded PR head.
- Do not treat Draft as Season state authority. Current roster = live Sleeper; completed draft = immutable history.
- No cache/app-data clearing, reinstall, or repeated refresh instructions before server/runtime proof.
- Preserve current manager identities/team name/QB exclusions and all frozen draft evidence; these are historical, not the current Season blocker.
