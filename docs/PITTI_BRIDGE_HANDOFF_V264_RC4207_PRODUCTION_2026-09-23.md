# PITTI v264 — rc4.207 Production authority

Generation: `20260923T1915Z-v264`

- PR #193 reviewed head `8ee120890f7aae7a7bda93a4f1e34d18526a2979` was squash-merged as canonical `main@90a87948d03264860978e6150ec22d9352694448`, tree `a5f55cba7e8d114de552060b0dd96565ee400d10`.
- Every exact-main check passed, including Guardrails, Behavioral Contract, Candidate Package, isolated PITTI Cloud Validation and Cloudflare Pages.
- Cloudflare Production deployment `ac148866-adac-4a2f-9c3e-34475daf38b6` succeeded (check run `107339846378`).
- Public `/` and `app.js` serve `v11.8.0-rc4.207` and contain the selected-expert identity repair.
- Public `/api/nfl-week-context?season=2026&week=3` returns season 2026/week 3, 16 events, provider ESPN, variant 4, official `cdn.espn.com`, after three sanitized failed prior attempts.
- Physical/device acceptance is not inferred. The selected PITTI panel needs the device-held FantasyPros credential and the opponent/game-context UI needs a physical rendering canary.
- `v11.8.0-rc4.205` remains the last device-accepted control until that canary passes.
- Broad ECR remains separate. Team Total remains `UNAVAILABLE`; no odds/total/spread source was introduced.
- PR #192 remains stale and must not be merged unchanged. Pitti Watcher remains separate and untouched.

Exact next gate: `RC4207_PHYSICAL_DEVICE_VERIFICATION_PENDING`. Refresh normally; do not clear cache/reinstall. Verify rc4.207, Sleeper roster PASS, weekly QB/RB/WR/TE projections PASS, selected PITTI panel availability, opponent/game context availability, and Team Total still unavailable. No fantasy transaction is part of the canary.
