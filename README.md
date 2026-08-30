# Draft Companion – Final Draft Edition 2026

> **Current source/package candidate:** v11.8.0-rc4.109; **device-observed authority:** v11.8.0-rc4.108. rc4.109 completes the v4 readiness-core acceptance fix; package/deploy/device acceptance pending.
> **rc4.109 validation:** candidate is in pre-seal CI/package gating. No ranking/Return/player-specific rule change.
> **Deployment/device:** rc4.108 is deployed and device-observed operational with v3 default and v4/v5 fail-closed. rc4.109 is not yet device authority.
> **Fallback:** rc4.108 remains current device authority during rc4.109 gating.
> **Produktions-/Control-Baseline:** v11.8.0-rc4.64; incumbent expert-panel control remains selectable.
> **rc4.100 package artifact:** run 33205458721 / artifact 9699461048 / GitHub artifact-envelope SHA-256 4361e510841c608ae9977257d691ebf4d80994dcbba5d816e07f700d42439cae.
> **rc4.100 scope:** generic Pro/Contra semantic hardening + bounded short-turn portfolio ordering; no global ranking/Return/expert retune, no hard WR cap/quota.
> **Current gate:** RC4.109_PACKAGE_DEPLOY_AND_DEVICE_ACCEPTANCE.
> **Current gate:** RC4106_ANDROID_DISPLAY_ACCEPTANCE.

Built/source/package/deployment/device-observed/device-accepted are distinct states.

### rc4.83 — bounded late-WR challenger / decision-evidence test
- Kein Produktions-Promotion: rc4.82 bleibt Android-Authority bis zum realistischen OOS-Mock.
- WR6+/WR7+ wird spät graduell stärker abgewertet, ohne Hard-Cap oder pauschales RB-Forcing; außergewöhnlicher WR-Marktvalue bleibt zulässig.
- Coach-vs.-tatsächlichem Pick wird pro eingefrorener Entscheidung gespeichert; dedizierter `Pick-Evidenz exportieren`-Export ist draft-spezifisch.
- Evidence-v2 enthält zusätzlich automatische Flags für WR-Sättigungs-Empfehlungen und QB2-Verstöße.
- Historischer rc4.83-Abschnitt: damalige Guards enthielten Geno/Rodgers-Hard-Exclusions; **dies ist seit rc4.92 ausdrücklich verworfen**. Aktuell schützt der Guard exakt-einen-QB erst nach QB1, verbietet player-name QB exclusions, lässt Geno/Rodgers organisch ranken, lässt K/DST aus, erlaubt exceptional TE2 und schützt die Expert-Profile/Gewichte.

### rc4.82 — profile-aware health / metadata integrity candidate
- Keine Decision-/Return-v2-Retunings gegenüber rc4.80.
- Runtime-Version wird in `app.js` zentral aus `APP_VERSION` abgeleitet; Snapshot, Emergency Queue, Decision-State und Backup dürfen keine veralteten RC-Strings mehr tragen.
- Active Panel Health bewertet jetzt das **tatsächlich ausgewählte Profil**: Full-v2 vollständig eingebettet, WR-v2 als Hybrid aus eingebettetem WR-Board + Live-QB/RB/TE, Incumbent vollständig live.
- Ein degradiertes Live-Teilpanel im Hybridprofil darf nicht durch vorhandene Expert-v2-Stimmen verdeckt werden.
- Snapshot-Provenienz und Gewichtserklärung sind profilabhängig: Frozen Expert-v2 Board vs. Live-Multi-Source-Pipeline vs. Hybrid.
- Drei Profile bleiben verpflichtend auswählbar; Brown bleibt aus v2 ausgeschlossen; Erickson bleibt Challenger ohne numerisches v2-Votum.
- User-Strategie bleibt exakt ein QB; WR7+-Safety bleibt roster-aware ohne WR-Cap; TE2 bleibt nur Soft-/Exceptional-Value-Pfad.
- Draft-critical Regression `tools/rc482-draft-critical.mjs` schützt diese Semantik dauerhaft.
- Source-/Legacy-/Return-/UI-/Android-Gates PASS. Frischer Snapshot bestätigt rc4.82, Panel-Health OK, Frozen Expert-v2 Board und eingefrorene effektive Gewichte ohne Live-Neunormierung.

### rc4.78 — OOS roster/option-value research challenger
- User-Draftpfad: nach QB1 kein QB2 auf der Coach-Oberfläche; Gegner-/Return-Modell bleibt unverändert.
- WR7+ bleibt legal und kann natürlich gewinnen; PlayerQualitySafety darf einen gewöhnlichen gesättigten WR aber nicht mehr über die Roster-Utility zurückpromoten. Safety-Ausnahme nutzt den bestehenden `Starker Value`-Schwellwert (+10 vs ADP).
- Embedded Expert-v2 Einzelränge werden im Snapshot als solche berichtet statt fälschlich `0/0` / `KEINE`.
- OOS-Gates: Draft 1398395487467368448, Picks 112/129/132/149. Keine Spielername-Forcings, kein pauschaler RB-Bonus, kein WR-Cap, kein TE2-Verbot.
- Erst nach vollständigem Release Contract darf ein Nachfolger Android erreichen.

### rc4.77 — Release Contract v2 pre-install candidate
- Kandidat erst nach Behavioral-, Evidence-kind-, Draft-phase-/Roster-State-, Regression-, Completeness- und Re-Extract-Gates freigeben.
- Return/WAIT, Expert-v2, feste Expertenreihenfolge, Einzelrankings, Pfeile, Parker-These und Kartenbegründungen sind als ausführbare Invarianten geschützt.

### Release Contract v2 — Prozessumbau
- Fail-closed Behavioral Gate gegen die echten Live-Presentation-Funktionen.
- Handcodierte PLAYER_EVIDENCE-Produkttabelle entfernt; strukturierte Research-Evidence bleibt Quelle der Differenzierung.
- Return ist das normale Timing-Signal; WAIT bleibt als Ausnahmehinweis. Legacy JETZT/EHER-JETZT aus dem sichtbaren Coach-Pfad entfernt.
- Paket-Gate testet das re-extrahierte 11-Dateien-Runtime-ZIP.
- Kein Installationsrelease bis Checkpoint/README/Package-State atomar synchronisiert sind.

### rc4.75 — verworfen
- Spielerindividuelle Draft-Gründe werden vor technischen Coach-Reasons gerendert.
- `Positions-Alternativen`, Tier-/Utility-Hinweise dürfen nicht mehr die primäre Plus-Begründung verdrängen.
- Return-Chance bleibt Timing-Signal; nur `WAIT` bleibt als explizite hohe-Return-Ausnahme.
- Upside-/Regression-Pfeile und Parker-Washington-Invariante `WR2 mit WR1-Upside` bleiben erhalten.
- Expert-v2-Gewichte/Routing unverändert.

.
> **Android authority update:** fresh Pick-9 snapshot confirms v11.8.0-rc4.93. Walker remains Panel 15.3 / ADP 17.4; the reproduced defect is Top-10 presentation ordering. rc4.94 fixes display selection only.

## rc4.95 source challenger (2026-08-28)
- Source challenger: `v11.8.0-rc4.95`; Android/package/deployment authority remains `v11.8.0-rc4.94` until full release gates and device verification.
- Generic Sleeper `Questionable` alone has no Coach penalty; concrete acute injury evidence remains authoritative.


### rc4.97 isolated microfix challenger
v11.8.0-rc4.97 is a test-only actionability/presentation challenger. rc4.96 remains rollback/Android authority until all gates pass.


### rc4.98 evidence-polarity challenger
v11.8.0-rc4.98 fixes generic Pro/Contra sign routing in the live surface. rc4.96 remains Android rollback authority until full validation.


## v166 replay-status canary
- Bounded frozen-fixture replay rc4.101 -> rc4.104 is CI PASS for the observed failure mechanisms at pick92/109/112 and exact pick132 Spears/Andrews; Return-v2 unchanged.
- Canonical mock: draft-companion-v7-backup-2026-08-29T05-28-09-291Z.json / draft 1399284498113294336.
- Browser-equivalent full historical recomputation is unavailable from preserved transient inputs and must not be fabricated.
- Current gate: RC4104_REPLAY_BOUNDED_PASS_DRAFTDAY_READINESS.
