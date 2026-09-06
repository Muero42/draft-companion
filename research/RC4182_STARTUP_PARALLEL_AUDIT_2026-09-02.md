# rc4.182 startup parallel audit — 2026-09-02

> HISTORICAL/SUPERSEDED operational checkpoint: runtime, device, deployment, release/activation gates and CURRENT/OVERRIDE instructions below describe the original dated context only. They must not be executed as current work or override ../PITTI_CURRENT_STATE.json and ../NEW_CHAT_HANDOFF_CURRENT.md. Research evidence and durable invariants remain as provenance, subject to later explicit corrections.

## Authority
Physical rc4.182 remains DEVICE_REJECTED: Live-State '-', roster loading, experts not initialized. rc4.169 remains accepted rollback authority. No device promotion from this document.

## PR #98 vs main conflict classification
Current comparison is divergent. Importantly, the main-only side changes only PITTI state/handoff documentation files in the compare result; no app.js/runtime file appears among the 10 main-side commits. PR #98 changes app.js plus startup tests and state/handoff files. Therefore the runtime hydration patch can be preserved without choosing stale PR state documents as authority. Integration must resolve state/handoff files in favor of newest verified main semantics, then reapply/validate runtime+test changes.

## Pre-marker exception inventory
Known synchronous startup operations before the physical JS marker:
1. compact rank-cache load — storage reads are wrapped by store.get and localStorage enumeration is try/catch.
2. legacy ranking cleanup — now each removeItem is independently best-effort.
3. direct element initialization — Season HTML/runtime shape must guarantee required controls or guard optional legacy Draft controls.
4. live-manager grid population — renderer is invoked pre-marker and therefore remains a candidate for deeper dynamic harnessing.
5. workspace click binding / draft-surface restore / workspace restore — guarded fail-open.
6. research-cache status update — guarded fail-open.

The real-shape gate added in this branch locks the known storage denial path, Season DOM shape, optional Draft DOM tolerance, marker ordering, roster bootstrap and expert rehydration.

## Shared roster/expert startup dependency
Roster and expert symptoms are consistent with one pre-marker module abort because both automatic paths occur after the marker. Expert rehydration is now deliberately after the marker and before roster bootstrap; automatic network rank refresh is after roster bootstrap. A physical failure where the marker itself is absent strongly implicates earlier synchronous startup. If the marker appears but both remain unloaded, the diagnosis must move downstream and treat roster bootstrap and expert hydration separately.

## Next safe gate
Run exact-head CI including tools/season-realshape-startup-e2e.mjs. Do not merge/version/deploy/device-test until strict gates pass and branch divergence is reconciled without importing stale handoff authority.
