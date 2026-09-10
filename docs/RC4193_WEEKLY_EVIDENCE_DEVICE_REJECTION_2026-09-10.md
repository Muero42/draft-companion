# rc4.193 Weekly Evidence — physical device rejection

Date: 2026-09-10

## Authority

- Repository: `Muero42/draft-companion`
- Canonical source main observed before this evidence record: `fa8dc144ccd8d4c65f06c46429920578a9b20f0c`
- Runtime/source version: `v11.8.0-rc4.193`
- Production deployment recorded in the canonical handoff: deployment ID `5002f2a0-e149-4c3b-b49e-ac4668e82c91`, branch `main`, source `fa8dc14`.
- This document is evidence-only on a non-production branch. It does not authorize or claim merge, deployment, cache clearing, reinstall, or device mutation.

## Physical Android/PWA evidence

User-supplied screenshots from the actual Android device show:

1. `v11.8.0-rc4.193` is visibly running.
2. Sleeper live roster bootstrap succeeds (`Sleeper Live-State <1 Min.`; 16 players; Reserve/IR 1).
3. Weekly Evidence remains `nicht geladen`.
4. The UI reports `Weekly-Evidence-v2-Modul fehlt · keine Saisonentscheidung freigegeben.`
5. Pressing `Jetzt prüfen` does not load Weekly Evidence.
6. Weekly player ranks/projections/team totals/matchup-weather remain unavailable and Start/Sit remains fail-closed.

Classification: **DEVICE_RC4193_REJECTED_WEEKLY_EVIDENCE_MODULE_MISSING**.

The fail-closed decision behavior is correct, but rc4.193 is **not device-accepted**.

## Production asset observations

From Chrome on the same Android device, both of these production-alias requests rendered the PITTI Companion HTML/app shell instead of JavaScript source:

- `https://draft-companion.pages.dev/weekly-evidence-v2.js?v=v11.8.0-rc4.193`
- `https://draft-companion.pages.dev/weekly-evidence-v2.js`

This proves that the production alias does not currently serve the expected `weekly-evidence-v2.js` asset at that path. The observed response is consistent with SPA/root HTML fallback for a missing or unroutable asset.

## Source/package contrast

Canonical source contains `weekly-evidence-v2.js` and the rc4.193 service worker lists `./weekly-evidence-v2.js?v=v11.8.0-rc4.193` in its static app shell. The package/re-extraction tool also explicitly packages 14 runtime files including `weekly-evidence-v2.js` and checks byte parity after extraction.

Therefore the physical failure is downstream of source presence and package/re-extraction inclusion.

## Root-cause boundary

Established:

- Not a query-string-only problem: both query and no-query production-alias paths fall back to the Companion HTML.
- Not a missing source file: canonical Git source contains the module.
- Not explained by the 14-file package generator: it includes the module.

Still to distinguish fail-closed:

A. the exact rc4.193 Cloudflare deployment artifact/output itself omitted or failed to route the new 14th runtime file; or
B. the exact deployment contains it but the production alias is serving a different/stale edge state.

Historical deployment evidence for rc4.192 used a 13-file build/deployment parity set. Because rc4.193 adds a 14th runtime file, an unchanged 13-file Cloudflare staging/output list is a high-priority hypothesis, not yet a proven root cause.

## Next gate

Check the exact successful rc4.193 deployment URL for `/weekly-evidence-v2.js` before changing app code or Android state. If the exact deployment also returns the app shell, inspect/fix the Cloudflare build/output asset set and add a release/deployment regression that requires all 14 runtime assets. If the exact deployment returns JavaScript while the production alias falls back, diagnose production alias/edge state instead.

No cache clearing, reinstall, production deployment, merge, or fantasy transaction is authorized by this evidence record.
