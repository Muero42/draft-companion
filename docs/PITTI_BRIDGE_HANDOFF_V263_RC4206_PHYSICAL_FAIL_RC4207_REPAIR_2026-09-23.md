# PITTI v263 — rc4.206 physical failure and rc4.207 bounded repair

Generation: `20260923T1834Z-v263`

## Corrected authority

- `v11.8.0-rc4.206` is canonical source authority at `main@d5954d66877df877f950a4a41f32baad59a66748` (tree `07248a6ac3c5f8872893a2c805155be8a1a5e806`).
- It is also Production authority through successful Cloudflare deployment `8322e9b3-a293-4454-8ef9-d5e98c217889` from branch `main`.
- Its physical/device acceptance is **false**. Verdict: `RC4.206_PHYSICAL_PARTIAL_PASS_NOT_ACCEPTED_SELECTED_PANEL_AND_GAME_CONTEXT_UNAVAILABLE`.
- `v11.8.0-rc4.205` remains the last device-accepted control.
- PR #192 is Draft at head `6c523297` and encodes stale v262 Production authority. It is not merge-ready and must not be merged unchanged.

## Physical result preserved

- PASS: Sleeper live roster hydration.
- PASS: FantasyPros weekly QB/RB/WR/TE projections and existing Start/Sit projection behavior.
- UNAVAILABLE: selected PITTI weekly panel.
- UNAVAILABLE: canonical game context/opponent; weather consequently remains unavailable.
- UNAVAILABLE: Team Total. No total, spread, odds source, or synthesis was added.

## Proven production root causes

### Selected PITTI weekly panel

The rc4.206 weekly refresh resolved configured expert names only through the separate authenticated `/nfl/{season}/rankings/experts?position=...` directory before it could request filtered weekly consensus. The public expert-directory fallback returns the configured experts with `apiId: null`, while the already-working current-week consensus response can expose the needed expert identity map when requested with `experts=show`. Therefore the selected lane could not form exact expert filters even though broad weekly ranks were independently available. Broad ECR was correctly not substituted.

The bounded rc4.207 repair changes `app.js` functions `consensusWeeklyExperts`, `resolveSeasonWeeklyExpertIds`, `acquireSelectedWeeklyRankPayloads`, and `refreshSeasonWeeklyEvidence`: broad per-position weekly consensus is requested with `experts=show`; only after those current-week responses arrive are exact configured identities resolved and filtered requests issued. Missing, contradictory, or incomplete identity evidence remains per-position fail-closed and cannot erase healthy projections or become broad-ECR substitution.

### Canonical game context/opponent

Production request `/api/nfl-week-context?season=2026&week=3` returned sanitized HTTP 502 / `UPSTREAM_HTTP_ERROR` after every rc4.206 `site.api.espn.com` scoreboard variant returned upstream HTTP 403. The failure occurs during acquisition before schedule parsing/persistence/consumption. The official ESPN CDN scoreboard for the same exact season/type/week returned a complete 16-event payload under `content.sbData`.

The bounded rc4.207 repair changes `_worker.js` `espnScoreboardUrls`, `normalizedEspnWeekPayload`, and `getNflWeekContext` to add that single official CDN endpoint after the existing variants and reject wrong season, wrong type, wrong week, or an event count outside 13–16. `game-context-v1.js` expands only the official-source allowlist to `cdn.espn.com`; existing complete-week, unique-event, unique-team, kickoff/venue, freshness, and sanitized-provenance validation remains mandatory. Partial or ambiguous schedules are never promoted.

## Candidate boundary

`v11.8.0-rc4.207` exists only on `codex/rc4.206-physical-failure-repair`. It is not Production-deployed, device-observed, device-accepted, merged, or authorized for automatic fantasy transactions. Pitti Watcher was not modified; its remote-secured branch remains `codex/watcher-p0-chunked-frames` at `3122adf0a71d7ae5e4d896b2b4824dede7c1ea5a`, pending Production cost calibration before budget/outbox activation.

Exact next gate: `RC4207_EXACT_HEAD_CI_AND_NONPRODUCTION_PREVIEW`. A passing repair PR may then be reviewed for a separately authorized merge. Because automatic Production deployments are enabled on `main`, merging is itself a Production-impacting action and is forbidden in this work package.
