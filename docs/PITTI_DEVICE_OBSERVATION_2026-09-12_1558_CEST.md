# PITTI device observation — 2026-09-12 15:58 CEST

Repository authority at observation handling: `Muero42/draft-companion` canonical `main` = `255d2861622dc9c8bf6c91e94285899a94ff5f7d` (`v11.8.0-rc4.198` source/package authority).

This is a physical Android/PWA observation only. It does **not** imply source rollback, rc4.198 deployment, or rc4.198 device acceptance.

## Physical runtime observed

- `installed_android`: `v11.8.0-rc4.196`
- `latest_android_observed`: `v11.8.0-rc4.196`
- Badge/footer both show `v11.8.0-rc4.196`.
- App was opened normally; no cache clear, reinstall, or app-data deletion was requested or performed for this observation.
- Sleeper Live-State: `< 1 Min.` and `Live-Kader direkt von Sleeper aktualisiert.`
- App summary: `LIVE Sleeper · 16 Spieler · Reserve/IR 1 · Auto-Sync beim Start.`
- Reserve/IR remains separated; Zach Charbonnet is shown under `RESERVE / IR`.
- Live/News Watcher remains PASS; screenshot shows `320 Evidence-Events · 190 Spieler` and no verified current news activation.

## Weekly Evidence / Start-Sit observation

- Weekly Evidence age shown as `24 Std.`.
- Automatic freshness check was triggered because evidence was older than 3 hours.
- The refresh then reported: `Weekly-Evidence-Prüfung fehlgeschlagen · letzter verifizierter Stand bleibt unverändert · TIMEOUT`.
- Player cards still show Week-1 positional evidence unavailable, Half-PPR unavailable, Team-Total unavailable, and opponent/weather unavailable.
- Start/Sit v6 still reports game/lock context unavailable.
- Start/Sit still reports `14 realistische aktive Skill-Spieler ohne vollständige aktuelle Rank+Projection-Evidence`.
- Existing player evidence is explicitly retained rather than deleted on the failed refresh.

## Classification

`RC4.196_PHYSICAL_PARTIAL_PASS_NOT_ACCEPTED` remains the latest observed device classification.

This observation is **not** an rc4.198 canary. Canonical checkpoint state before this observation already classified rc4.198 as `PACKAGED_ONLY_NOT_DEPLOYED`, while production/device authority remained rc4.196. Therefore seeing rc4.196 here is consistent with the pre-deployment state and must not be recorded as an rc4.198 failure.

## Promotion boundary

Before any rc4.198 production promotion, retain source/package/deployment/device separation. Production deployment remains a separately authorized consequential action. After an authorized rc4.198 deployment, verify server-side deployment identity/parity first, then perform a fresh physical Android/PWA canary without cache clearing or reinstall unless separate evidence requires it.
