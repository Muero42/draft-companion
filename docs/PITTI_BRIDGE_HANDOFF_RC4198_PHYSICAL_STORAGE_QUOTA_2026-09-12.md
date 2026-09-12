# PITTI rc4.198 physical canary — storage quota blocker

Observed: 2026-09-12 after verified Cloudflare Production deployment.

## Deployment authority

- Canonical source/main before this checkpoint: `493e5aac9cea5a7a667efec81e1bdc733935baf9`.
- Runtime: `v11.8.0-rc4.198`.
- Cloudflare Production deployment: `81598205-07db-47c9-93ef-3a968d460682`.
- Production URL: `https://81598205.draft-companion.pages.dev`.
- Deployment status observed physically in Cloudflare: `success`.
- Production branch/commit: `main` / `493e5aa`.

## Physical Android/PWA evidence

The already-installed app updated to `v11.8.0-rc4.198` without cache clearing, reinstall, or app-data deletion.

PASS observations:

- Runtime badge/footer both show `v11.8.0-rc4.198`.
- Sleeper Live-State remains `< 1 Min.` and reports a direct live-roster update.
- Live roster geometry remains intact: 16 players, Reserve/IR 1, Zach Charbonnet remains separate in Reserve/IR rather than an ordinary drop target.
- Start/Sit retains the rc4.197/rc4.198 lane-separation semantics: missing positional rank does not delete projection eligibility and no season rank fallback is introduced.
- UI explicitly reports `POSITIONSRANG NICHT VERFÜGBAR` while stating that active skill players remain projection-based evaluable when projections exist.

BLOCKING observations:

- Weekly Evidence is stale (`1 Tag(e)`).
- The refresh attempt fails with `STORAGE_QUOTA_EXCEEDED`.
- The subsequent automatic retry is throttled as designed.
- Because no fresh projection snapshot is persisted, all 14 realistic active QB/RB/WR/TE players remain without a verified current Half-PPR projection in the physical session.
- Start/Sit therefore remains `TEILWEISE NICHT BEWERTBAR`.
- Game/lock/opponent/weather context remains unavailable; rc4.198 only added bounded diagnostics and did not fabricate parser evidence.

## Physical verdict

`RC4.198_PHYSICAL_PARTIAL_PASS_NOT_ACCEPTED_STORAGE_QUOTA`

The rc4.198 projection/rank separation repair is preserved, but the build is not physically accepted because the current browser storage state prevents fresh Weekly Evidence persistence/consumption.

## Safety boundary

Do **not** ask the user to clear cache/app data or reinstall. Preserve local draft/research/decision evidence. Repair the Weekly Evidence persistence path so a verified projection lane can remain usable under a full localStorage condition without sacrificing protected append-only evidence.
