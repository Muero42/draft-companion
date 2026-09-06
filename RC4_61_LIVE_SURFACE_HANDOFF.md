# rc4.62 Decision UI — current checkpoint

> HISTORICAL/SUPERSEDED operational checkpoint: runtime, device, deployment, release/activation gates and CURRENT/OVERRIDE instructions below describe the original dated context only. They must not be executed as current work or override PITTI_CURRENT_STATE.json and NEW_CHAT_HANDOFF_CURRENT.md. Research evidence and durable invariants remain as provenance, subject to later explicit corrections.

Date: 2026-08-24

## Current canonical state
- rc4.62 is generated and published on `main` by the regression-gated release workflow.
- Publish commit: `9c3d6387a44350050dc190b53cd2b1875b630f2c`.
- Active runtime assets: `index.html`, `app.js`, `sw.js`, `manifest.webmanifest`, `live-surface-v3.js`, `live-surface-v3.css`.
- Same canonical Draft/Return/Player-Quality engine remains active; no second scoring engine was introduced.

## rc4.62 changes
- Candidate ordering no longer groups normal-cut candidates ahead of fallback candidates. The canonical scored Draft-Utility order is preserved for the visible top 10; `outsideNormalCut` is now a warning annotation only. This prevents a high-value/falling player such as Jeremiyah Love from being hidden below otherwise weaker candidates solely because of the normal-cut gate.
- `WARTEN` is no longer presented as the UI's global draft verdict. Return remains a timing signal; the decision surface exposes short decision labels such as TOP-PICK, JETZT, EHER JETZT, KNAPPES RETURN-FENSTER, HOHE RETURN-CHANCE, LOSS HOCH, INJURY-CHECK and ECHTE ALTERNATIVE.
- Top candidate is explicitly marked TOP-PICK even when the underlying Return engine says WARTEN.
- P/ADP/R/Confidence numeric values are bold for scan speed.
- 10ER-ÜBERSICHT uses larger mobile typography and spacing comparable to the main decision cards.
- Normal-cut exceptions are marked per candidate (`NORMAL-CUT WARNUNG`) rather than creating a separator that incorrectly implies every later candidate is fallback.
- Analysis jump control remains retained.

## Release verification
- Workflow completed successfully and committed the generated runtime/package.
- JavaScript syntax gates passed for `app.js`, `sw.js`, `live-surface-v3.js`.
- Required version, top-10, decision-signal, numeric-emphasis, normal-cut-warning, hard-QB and acute-status gates passed.
- Package integrity test (`unzip -t`) passed in CI.

## Current Android test package
- Repository path: `dist/Draft_Companion_v11.8.0-rc4.62_FULL_TEST.zip`
- Convenience copy: `dist/PITTI-rc462.zip`
- SHA-256: `de7059794444319aa3a4345c4976a4df43c6f01617bd16ca5ef38bb469f803d4`.

## Safety constraints retained
- No removal or retuning of Return-v2, Player Quality, expert panel ranks, ADP, roster rules, decision fixtures, hard-QB rules or acute injury/uncertainty guards.
- Repository/CI verification is not Android runtime verification.

## Immediate next action
1. Install/open rc4.62 on Android.
2. Re-run the same paused/mock decision point if convenient.
3. Verify: splash exits; jump arrow; top candidate label; Love/other fallback-value candidates remain in true top-10 order; bold metrics; larger 10er list; no misleading all-WARTEN display.
4. After this UI/runtime gate, run a 2-minute mock stress test.
