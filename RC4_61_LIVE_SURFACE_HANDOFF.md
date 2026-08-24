# rc4.61 Live Decision Surface — current checkpoint

Date: 2026-08-24

## Current canonical state
- rc4.61 live-surface v3 is integrated on `main` and runtime-active.
- `index.html`, `app.js`, `sw.js`, `live-surface-v3.js` and `live-surface-v3.css` are the active rc4.61 runtime assets.
- The analysis jump control is restored.
- The live decision surface uses the existing canonical decision state; it does not introduce a second scoring engine.
- Normal full Snapshot remains available as diagnostic/audit output; compact Chat-Handoff is the preferred external live handoff.

## Android hotfix
- The first published rc4.61 Android candidate could enter a self-triggering render loop on Android because the live-surface MutationObserver reacted to DOM mutations caused by its own render.
- Commit `8379c4e821904692a4710f9eba5fce961172d00e` fixes this render loop.
- The package was rebuilt and republished afterward.

## Current Android test package
- Repository path: `dist/Draft_Companion_v11.8.0-rc4.61_FULL_TEST.zip`
- Size: 106293 bytes.
- SHA-256: `971d0d8a84bae47a0fc28360bdae0dd7a72aa2ba869a15ccf66f65edf6c3b022`
- Publish commit: `02cb35308fa0e64ab985edbaf9108c8a8163b015`.
- This package supersedes the earlier rc4.61 package with SHA-256 `c0862a12a7f2c1fdcce1595b6a48d593764d248ff66df8d8b5ff796ecd88b139`.

## Safety constraints retained
- No alternate scoring engine.
- No removal of Return-v2, Player Quality, panel ranks, ADP, roster rules, decision fixtures, hard-QB rules or acute injury/uncertainty guards.
- Android runtime verification is still required; repository/package verification must not be equated with successful phone verification.

## Immediate next action
1. Obtain the current package above on Android.
2. Open/reload the installed app and verify that the splash screen exits normally.
3. Verify analysis jump, compact live decision layout, scroll burden, top-10 visibility, injury/risk visibility, compact Chat-Handoff and Full Diagnostic.
4. Run a 2-minute mock stress test after the UI/runtime gate passes.

## Download note
If Android/Chrome does not complete a direct `raw.githubusercontent.com` download, use the normal GitHub file page for `dist/Draft_Companion_v11.8.0-rc4.61_FULL_TEST.zip` and invoke GitHub's Download raw file action instead of repeatedly retrying the raw-host browser prompt.
