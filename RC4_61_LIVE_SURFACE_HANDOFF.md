# rc4.61 Live Decision Surface — staged checkpoint

Date: 2026-08-24

## Canonical baseline
- `app.js` remains the verified rc4.60 baseline (`98d40a436fc455fe34583ca970ad7c9877a647c2`).
- `index.html` remains rc4.60 and therefore the new module is **not yet runtime-active**.
- No existing rc4.60 decision-engine logic was changed.

## Staged rc4.61 files
- `live-surface.js`: isolated presentation/handoff layer. Reads rendered Coach output; does not recompute or mutate player scores.
- `live-surface.css`: compact sticky mobile live surface and denser Coach presentation.
- `RC4_61_LIVE_SURFACE_REGRESSION.js`: guards version, compact handoff, analysis jump, diagnostic path, canonical safety gate, and the intentional integration gate.

## Intended runtime behavior after integration
1. LIVE view shows a compact sticky decision surface with up to five candidates.
2. Top candidate remains visually primary; underlying ranking/order is read from the canonical Coach DOM.
3. `↓ Analyse` jumps directly to `#coachSectionCard`.
4. `Chat-Handoff kopieren` produces a short live-decision payload rather than forcing the full Snapshot through the normal live path.
5. `Full Diagnostic kopieren` remains available separately from `#snapshot`.
6. Existing full Snapshot stays diagnostic/audit output and is not deleted.

## Safety constraints
- No alternate scoring engine.
- No player-specific blacklist or override introduced.
- No mutation of Return-v2, Player Quality gate, panel ranks, ADP, roster rules, decision fixtures, or research residuals.
- Integration must bump both visible HTML version and Snapshot/App model version together to rc4.61.
- Do not ship/install as rc4.61 until the two new assets are actually referenced by `index.html` (or equivalently injected by the serving layer) and regression checks pass.

## Next action
Integrate `<link rel="stylesheet" href="live-surface.css">` after `styles.css` and `<script src="live-surface.js"></script>` after the canonical `app.js` script, bump rc4.60 strings to rc4.61, then run existing regressions plus `RC4_61_LIVE_SURFACE_REGRESSION.js`. If integration cannot be performed atomically, leave rc4.60 as the runtime release and keep these files staged only.
