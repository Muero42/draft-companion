# Cache growth and unavailable weekly evidence

User report: Android site storage increased from 379 MB to 479 MB after updating the installed Cloudflare PWA. The exact physical-device storage breakdown was not accessible. This is a storage observation, not a device acceptance result.

## Reproduced cause

The former service worker writes every GET response to CacheStorage using its full request URL. Season startup downloads the player directory with a new timestamp/random query. Three simulated loads produced three stored player-directory copies; this mechanism can grow without bound. The app source itself is approximately 433 KB, so storage growth is not a measure of the size or success of the update.

The repair limits CacheStorage writes to the declared same-origin runtime shell, normalizes query variants to a fixed key, and leaves live API requests to normal network handling. Successful installation migrates to a bounded static cache and removes only older `draft-companion-v*` caches. Backup exports and unrelated caches remain. Installation fails if a required shell asset is unavailable. Runtime cache-write failures do not discard online responses; failed HTTP responses do not replace a usable offline asset.

## Missing data and misleading status

Read-only observation of the configured `/companion-feed`: schema `draft-companion.watcher-feed.v2`, overall gate `FAIL`, failed/incomplete player-state collection, zero events, no `seasonEvidence` member. The current app expects feed v1. Accepting the new schema alone cannot supply the missing projections and must not bypass the failed gate. No Watcher or D1 changes were performed.

The roster renderer previously displayed green LINEUP HOLD when no verified comparisons existed. It now distinguishes unavailable/partial evidence from a fully verified no-improvement result. Independently verified positive pairs can still be displayed, with incomplete coverage disclosed. No projection, ranking, weather, trade value or recommendation is fabricated.

## Deployment history and next boundary

The earlier Cloudflare production deployment 189ff774-1349-4e35-bbf9-cdb57b69b121 published source 24d2d19fb3c25872021a91348710f3b1e2e2cadd. This report describes subsequent source changes; it does not claim their publication or Android acceptance. The earlier production authorization covered that exact prior update. New source promotion must use fresh Git/CI and explicit production authorization, including the described cleanup of rebuildable legacy app caches.

Executable coverage: `tools/season-service-worker-cache-regression.mjs` and `tools/season-lineup-evidence-status-regression.mjs`. Both are automatically discovered by the strict suite. Device settings, localStorage, backup data, fantasy transactions and the live Watcher remain unchanged by local development.
