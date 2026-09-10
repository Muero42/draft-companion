# rc4.193 Weekly Evidence — Android localStorage quota rejection

Date: 2026-09-10

## Authority and observed sequence

- Repository: `Muero42/draft-companion`
- Production source before this repair branch: main `0b7e6d2b2ad85dba71004cbbb1edc7ad29895835`
- Runtime identity shown on device: `v11.8.0-rc4.193`
- Corrected Cloudflare Production deployment: `79291430-f347-450c-ba8a-c5d3aad393b3`
- Server-side asset gate passed: `weekly-evidence-v2.js` is present in the 13 static uploaded assets (14 runtime entries including `_worker.js`) and serves JavaScript from both the exact deployment host and `draft-companion.pages.dev`.

After the server-side staging defect was repaired, the existing Android PWA loaded the Weekly Evidence module successfully. Pressing `Jetzt prüfen` then produced:

`Weekly-Evidence-Prüfung fehlgeschlagen · letzter verifizierter Stand bleibt unverändert · 22`

The prior module-missing message was gone, proving the server/runtime-asset repair took effect.

## Proven browser error classification

The app error renderer prints `e.code || e.message`. For a Web Storage `QuotaExceededError`, legacy `DOMException.code` is numeric `22`. The observed `22` therefore classifies this device failure as a local Web Storage quota exception, not a FantasyPros HTTP status.

The Weekly Evidence publish path calls `api.atomicWrite(localStorage, snapshot)`. The rc4.193 implementation wrote the complete serialized snapshot first to `pitti.weekly-evidence.v2.pending`, then wrote the same complete payload again to `pitti.weekly-evidence.v2.current`, and only after both writes removed the pending key. This doubles peak localStorage demand. If the second write throws for quota, the pending full copy is left behind, making subsequent retries continue under elevated pressure.

This is consistent with the repository's earlier Android storage-quota history: aggregate ranking persistence previously exhausted localStorage and the existing quota policy already treats `v7_rankCache`, `v7_panelRanks`, `v118_returnValidation`, and `v117_researchEvidence` as obsolete/rebuildable or historical data that may be pruned while preserving active decision evidence.

Classification: **DEVICE_RC4193_REJECTED_WEEKLY_EVIDENCE_LOCALSTORAGE_QUOTA_22**.

## Repair on this non-production branch

The narrow repair changes only Weekly Evidence persistence and its regression coverage:

1. Validate the serialized snapshot in memory.
2. Remove any stale `pitti.weekly-evidence.v2.pending` copy from older failed attempts.
3. Publish directly to `pitti.weekly-evidence.v2.current` with one `Storage.setItem` replacement. Web Storage replacement is atomic: if the value cannot be stored, the previous current value remains unchanged.
4. On a genuine quota exception only, evict the same explicitly non-critical keys already covered by the app's established quota policy, then retry once.
5. Never evict the previous current Weekly Evidence snapshot or active decision evidence for recovery.
6. If quota remains exhausted, throw a descriptive `STORAGE_QUOTA_EXCEEDED` code instead of leaking the legacy numeric `22` into the UI.

The regression suite now simulates the physical failure mode where double-staging exceeds quota even though direct replacement fits, verifies stale pending cleanup, verifies one bounded non-critical recovery pass, and verifies that active decision evidence and a prior current snapshot remain protected on failure.

## Gate

This file records evidence and proposed remediation on a non-production branch. It does not by itself claim merge, production deployment, cache clearing, reinstall, or device acceptance. A preview/CI pass is required before promotion. After promotion, physical Android acceptance must be repeated without clearing app data first.
