# rc4.193 Weekly Evidence — physical device rejection

Date: 2026-09-10

## Authority

- Repository: `Muero42/draft-companion`
- Canonical source main observed before this evidence record: `fa8dc144ccd8d4c65f06c46429920578a9b20f0c`
- Runtime/source version: `v11.8.0-rc4.193`
- Production deployment: deployment ID `5002f2a0-e149-4c3b-b49e-ac4668e82c91`, branch `main`, source `fa8dc14`.
- This document is maintained on a non-production branch. It does not authorize or claim merge, deployment, cache clearing, reinstall, or fantasy transaction.

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

## Production and deployment-specific asset observations

Chrome tests on the same Android device showed that all of the following render the PITTI Companion HTML/app shell instead of JavaScript source:

- `https://draft-companion.pages.dev/weekly-evidence-v2.js?v=v11.8.0-rc4.193`
- `https://draft-companion.pages.dev/weekly-evidence-v2.js`
- `https://5002f2a0.draft-companion.pages.dev/weekly-evidence-v2.js`

Therefore the failure is not production-alias-only and not query-string-only. The exact successful rc4.193 deployment itself lacks a routable `weekly-evidence-v2.js` asset.

## Source/package contrast

Canonical source contains `weekly-evidence-v2.js` and the rc4.193 service worker lists `./weekly-evidence-v2.js?v=v11.8.0-rc4.193` in its static app shell. The package/re-extraction tool explicitly packages 14 runtime files including `weekly-evidence-v2.js` and checks byte parity after extraction.

Therefore the physical failure is downstream of source presence and package/re-extraction inclusion.

## Proven root cause — stale Cloudflare Pages staging command

The Cloudflare build log for deployment `5002f2a0-e149-4c3b-b49e-ac4668e82c91` proves the staging command remained hard-coded to the historical 13-file runtime set:

```text
Executing user command: node -e "const fs=require('node:fs');const files=['index.html','app.js','decision-policy.js','styles.css','manifest.webmanifest','sw.js','_worker.js','icon.svg','live-surface-v3.js','live-surface-v3.css','expert-board-export.js','expert-v2-board.js','expert-v3-board.js'];fs.mkdirSync('pitti-runtime',{recursive:true});for(const f of files)fs.copyFileSync(f,'pitti-runtime/'+f);if(fs.readdirSync('pitti-runtime').length!==13)throw Error('Unexpected runtime entries');"
```

`weekly-evidence-v2.js` is absent from that array. The command then succeeds only because it explicitly requires exactly 13 entries. Cloudflare finds `_worker.js` separately in the output directory and reports `Uploading... (12/12)`, matching the dashboard's `12 Files uploaded`; the Worker is not counted as a static uploaded asset.

This establishes the root cause:

**RC4193_CLOUDFLARE_STAGING_COMMAND_STALE_13_FILE_SET**

The source/package/runtime contracts moved to a 14-file set for rc4.193, but the Cloudflare Pages build/staging command was not updated. As a result, `weekly-evidence-v2.js` was never copied into `pitti-runtime` and therefore could not be uploaded or served.

This is not an Android cache defect, service-worker cache defect, FantasyPros failure, query-routing-only defect, production-alias staleness, or missing Git source file.

## Required remediation gate

Before another production deployment:

1. Replace the stale Cloudflare Pages staging command with a 14-file-safe source of truth that includes `weekly-evidence-v2.js`; preferably avoid an independently maintained hard-coded runtime list if the repository already has a canonical runtime manifest/package list.
2. Require the build to fail if the staged output does not contain the complete canonical runtime set.
3. Verify the resulting deployment's uploaded asset list includes `weekly-evidence-v2.js` and that both the exact deployment host and production alias return JavaScript for that path.
4. Only then repeat the physical Android/PWA Weekly Evidence acceptance test.
5. Do not use reinstall/cache clearing as a substitute for proving server-side asset correctness.

No Cloudflare setting change, retry deployment, merge, cache clear, reinstall, or fantasy transaction is authorized by this evidence record itself.
