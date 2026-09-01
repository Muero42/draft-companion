# PITTI NEW CHAT BOOTSTRAP — v221
Generation: `20260901T2038Z-v221`
- POST_DRAFT_SEASON_COMPANION.
- Main source candidate: rc4.170 at `862e3e92a9b72ec4f2aa5ac923bdd2bd56659a44`.
- Installed Android/PWA: rc4.169; user reported roster stuck on loading and refresh ineffective.
- rc4.170 removes Cloudflare watcher from live-roster transport. Live roster loads directly from bounded-timeout Sleeper draft/league-roster endpoints.
- Explicit Kader aktualisieren control has busy/error feedback and fresh-origin slot->roster recovery.
- Watcher remains evidence-only; D1 quota cannot hang roster hydration.
- AUTO: continuous same-turn; no progress/empty/false continuation responses. Do NOT repeat rc4.160 device testing.
- Next gate: RC4170_PREVIEW_THEN_DEVICE_REFRESH.
- STATUS is report-only.
