# PITTI NEW CHAT BOOTSTRAP — v180
Generation: `20260829T1951Z-v180`

## Mandatory takeover
Read, in order: PITTI_COMMAND_CONTRACTS.json → PITTI_CURRENT_STATE.json → PITTI_HANDOFF_SEAL.json → PITTI_EXECUTION_LOCK.json → PITTI_AUTO_PREFLIGHT.md → PITTI_PROJECT_STATE.md to EOF → NEW_CHAT_HANDOFF_CURRENT.md → this file → HANDOFF_COMPLETENESS_MATRIX.md. Then verify actual main/runtime/research-branch facts. Fail closed on contradiction.

## Runtime truth
- Accepted Android/runtime baseline: **v11.8.0-rc4.106**.
- Production main runtime restored to validated rc4.106 bytes.
- Expert v4/v5 research branch: **pitti/expert-v4-v5-v180**.
- Staged expert selector UI exists only on research history/branch; do not treat it as production until validation + package/release/device gates pass.

## First blocker
Do not build/enable v4/v5 before fixing expert missingness/coverage semantics:
- Spears expert-v3-rb panelN5 including Draft Sharks.
- Bigsby expert-v3-rb panelN4, Draft Sharks missing.
- Root cause in ensureExpertV3Panels() can silently rebuild/renormalize using different available expert sets.
Required: distinguish true unranked vs import failure vs short board, make coverage fail-visible, no blind imputation, no silent materially different ensemble normalization.

## Expert models
- v3 = frozen/selectable baseline.
- v2 = retired from new comparison path; historical only.
- v4 = individual-only, position-specific, 4–6 experts. DS Team excluded for attribution ambiguity, not organizational quality.
- v5 = v3 + Koerner, primarily reducing DS share, position-specific.
- Koerner current 2026 ranking is visible in FantasyPros screenshots dated 2026-08-29; old paywall-only assumption is superseded, but exact import/coverage still must be verified.
- Preserve provisional candidate map and methodology from NEW_CHAT_HANDOFF_CURRENT / Project State EOF.

## Deferred evidence
Do **not** analyze `draft-companion-v7-backup-2026-08-29T19-44-43-926Z.json` yet. It is the missing natural mock with the user's own decisions and is deliberately reserved for later evaluation.

## UI
Selector directly above Analyze; v3/v4/v5 should re-analyze identical board/roster state. Preset change alone must not mutate state. Active preset must be visible.

## Future research
Preserve post-season phase/archetype expert-panel idea. Now collect only irretrievable raw ranking/provenance/ADP snapshots; defer reconstructible analysis.

## Exact next action
On research branch: coverage fix/audit → current expert accuracy/freshness/coverage matrix → finalize v4/v5 → v3/v4/v5 counterfactual regressions → only PASS may wire selector/package/promote/deploy/device-test.
