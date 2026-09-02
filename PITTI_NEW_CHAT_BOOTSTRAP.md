# PITTI NEW CHAT BOOTSTRAP — v225
Generation: `20260902T0810Z-v225`

Current authority: POST_DRAFT_SEASON_COMPANION. Physical Android runs **v11.8.0-rc4.182**, but Season hydration is **DEVICE_REJECTED**: Sleeper Live-State remains '-' and Live-Kader remains loading. Draft leakage in the captured Kader frame is fixed. **v11.8.0-rc4.169 remains accepted rollback authority.**

PR #98 (`pitti/rc4182-hydration-rootcause`) is unmerged. The storage-cleanup/pre-marker failure path is a reproduced fix hypothesis/component, not proven sole root cause. The startup-resilience regression itself had become stale after fail-open startup ordering changed; its contract was repaired. Exact-head strict CI must pass before merge, version bump, deployment or another device test.

AUTO/AUTO BLOCK: same-turn continuous execution; re-inventory after every package; no progress/status/acknowledgement messages, empty replies, or “AUTO läuft weiter”. STATUS is report-only.

Do not resurrect rc4.171–181 device-debug loops, stale v224 rc4.176 authority, or any claim that rc4.182 is accepted merely because installed.
