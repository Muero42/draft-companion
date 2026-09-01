# PITTI NEW CHAT BOOTSTRAP — v220
Generation: `20260901T2024Z-v220`

## Current authority
- POST_DRAFT_SEASON_COMPANION.
- rc4.169 merged to main at `ca75081e4361092e42eb75d5568a21dfe69cca33`.
- Current installed Android/PWA observed by user: rc4.168.
- rc4.169 fixes Season workspace leakage, exposes ranking freshness/manual refresh, adds 12h controlled auto-refresh, and isolates Season renderer failures per surface.
- Live Sleeper league state remains roster/ownership Source of Truth; completed draft is archive only.
- pitti-watcher v0.2.3 D1 bounded previous-snapshot fix remains active.

## First gate
RC4169_PREVIEW_PARITY_THEN_DEVICE_REFRESH: one gh-pages/season-preview sync + parity verification, then one physical Android/PWA refresh.

## AUTO queue takeover
AUTO/AUTO BLOCK is continuous same-turn execution. Re-inventory after every package. Never emit progress/empty/“AUTO läuft weiter” messages while executable work exists. Do NOT repeat rc4.160 device testing. Do NOT repeat rc4.166-168 debugging loops.

## STATUS
Report known state only; no work/polling.
