# Draft Companion – Final Draft Edition 2026 (v11.8.0-rc4.64)

> **Aktiver Release-Stand:** v11.8.0-rc4.64. Historische Abschnitte darunter dokumentieren frühere RCs und können ältere Versionsnummern enthalten.

### rc4.62 — decision UI / live hierarchy correction
- Live-Entscheidungsoberfläche auf den kanonischen Coach-/Draft-Utility-State synchronisiert; keine zweite Scoring-Engine.
- Top-10 bleibt in tatsächlicher Draft-Utility-Reihenfolge; `NORMAL-CUT WARNUNG` ist Kennzeichnung statt Sortierbarriere.
- Kompakte Decision-Signale, deutlichere P/ADP/Return-Werte und vier klare Hauptkandidaten für den mobilen 2-Minuten-Workflow.
- Runtime-Versionen in `app.js`, `index.html`, `sw.js`, `manifest.webmanifest` und `live-surface-v3.js` sind rc4.62.
- Android-Verifikation bleibt ein separates Release-Gate; Repository-/Build-Prüfung ersetzt keinen Test auf dem Telefon.

### rc4.61 — live decision surface
- Neue kompakte Live-Entscheidungsoberfläche mit 10er-Übersicht, Chat-Handoff und Full Diagnostic.
- Android-Renderloop der ersten rc4.61-Fassung wurde vor dem nachfolgenden rc4.62-Kandidaten behoben.

### rc4.25 — backup provenance coherence hotfix
- Fixes a deterministic rc4.24 evidence-provenance defect: normal Backup incorrectly labeled itself `11.8.0-rc4.23` although runtime/fixtures were rc4.24.
- Backup version now matches active runtime `11.8.0-rc4.29`.
- No Player Quality, expert aggregation, Return-v2, Manager Model, ADP, Research Residual, roster/championship utility, opponent, or queue behavior changed.
- rc4.24 robust-panel shadow evidence fields are preserved unchanged.

### rc4.23 — ranking objective correction / no player blacklist
- Removes the rc4.21 player-specific Geno Smith/Aaron Rodgers user blacklist after clarification that they were examples of prior ranking distortion, not permanent exclusions.
- User candidates again come from the complete selected-panel ranked pool. Low-value players remain draftable but should naturally sit low through Player Quality, market/timing, roster/championship utility and validated evidence.
- Preserves the rc4.22 **Emergency Queue kopieren** generator: manual-only, capped at 35 skill players, no K/DST, at most one QB and one TE while those starter positions are open; after QB1/TE1 is rostered, that position is omitted.
- Objective remains maximizing championship probability rather than enforcing player preferences: strong initial roster, asymmetric later-season upside, and validated residual value beyond panel + market. No model coefficient is retuned by this correction.

### rc4.22 — Emergency Sleeper Queue generator
- Added the dedicated **Emergency Queue kopieren** action derived from the current user Coach order.
- Queue output is manual-only, capped at 35 skill players, excludes K/DST, and contains at most one QB and one TE while those starter positions are still open; after QB1/TE1 is rostered, that position is omitted.
- The rc4.21 player blacklist described below was subsequently removed in rc4.23.

### rc4.21 — superseded player-specific exclusion interpretation
- Temporarily excluded Geno Smith and Aaron Rodgers from the user path after their earlier mention was misread as a permanent blacklist.
- This interpretation is explicitly superseded by rc4.23. Their current ranking should be determined by the selected expert panel and validated evidence, not a hard-coded exclusion.

### rc4.20 — validation geometry + frozen-pool evidence hardening
- Corrects Return-validation windows for pre-draft/paused snapshots so an opponent pick at `current` is not skipped.
- Aligns Return-v2 simulated `pickNo` with `firstOpponentPick` for non-user-turn snapshots.
- Freezes the complete ranked skill-player pool and resolved manager-map snapshot into each new decision fixture, enabling strict post-mock counterfactual reruns without later Sleeper metadata.
- Live Coach ranking/weights, Player Quality, Research Residual Shadow, ADP source and manager-model coefficients are unchanged.

### rc4.20 — Android backup export hardening

- Backup export now prefers Web Share with a real JSON File on supported Android/PWA environments, allowing direct share to ChatGPT or Save-to-Files.
- Browser download remains as a hardened fallback with a DOM-attached download anchor and delayed object-URL cleanup.

### rc4.18 — Lossless Backup/Restore hardening
- Restores validation state (`returnValidation`, `decisionFixtures`) that was already exported but previously not re-applied.
- Restores draft/strategy/stress modes and manager map from the backup.
- FantasyPros benchmark cache restore now replaces stale cache entries so Backup → Restore reproduces the saved state instead of merging unrelated old benchmarks.
- No Coach, Return-v2, Player Quality, Manager Model, Research Residual, ADP or expert-panel scoring change.

### rc4.15 — Research Residual Shadow v2
- Preserves rc4.14.1 Manager Model v2.1 as the live decision baseline.
- Adds a separate, bounded Breakout/Decline residual counterfactual score with position/price-sensitive caps.
- Static 2026 research priors are explicitly short-lived and expire before the draft freeze unless refreshed.
- Structured Research Cache events can provide direction/strength/confidence/pricing/causal-path/invalidator metadata; critical injury chronology still fails closed.
- Shadow values are exported in decision fixtures and Snapshot for prospective no-future-leak comparison.
- **No Shadow delta changes the live Coach ordering in rc4.18.** Promotion requires incremental validation over panel+ADP plus full-roster utility checks.

### rc4.14.1 — Unified Manager Model v2.1
Historische Manager-Positions-/Timing-Signale werden nur noch einmal gewertet; legacy Doppelzählung wurde entfernt. Live-Diagnostik verwendet jetzt für jedes Gegnerfenster den tatsächlichen Pick-Zeitpunkt. Qualitative/current-regime Managerhinweise bleiben als gekappte Sekundärsignale erhalten.
2026 Live/Mock verwenden dieselbe recency-weighted Managerprofil-Quelle (2017–2025, Sonderjahre maskiert), manager-spezifische K/DST-Hazards und einen Sleeper-ADP-dominierten Markt-Prior als Plausibilitätsrahmen. Profil-Hash wird in Decision Fixtures/Backup exportiert.

### Paketstruktur
Diese Auslieferungs-ZIP enthält nur die für Deployment/Dokumentation benötigten Runtime-Dateien. Deterministische Regressionstests bleiben als Entwicklungs-/Release-Gates im Repository und werden nicht in jede Handy-/Deployment-ZIP dupliziert.

## Strategy Switch
- **Progressive Upside (v11)** ist die Standardstrategie.
- **Balanced / Anti-Reach (v10)** bleibt als eingefrorene Referenz auswählbar.
- Progressive Upside greift erst ab Runde 9 und erhöht die Ceiling-/Breakout-Gewichtung graduell.
- Panel bleibt Baseline; ADP/Return sind getrennte Markt-/Timing-Layer.

## Release-/Vollständigkeits-Guard
Vor jedem neuen installierbaren RC müssen mindestens folgende Ebenen gegeneinander geprüft werden:
1. sichtbare App-Version, `app.js`, `index.html`, Service Worker/Cache-Buster, Manifest und Live-Surface;
2. kanonische Decision Engine, Player Quality, Panel/Einzelrankings, ADP, Return-v2, Roster-/Starterregeln, Manager Model und Injury/Acute-Status-Guards;
3. Backup/Restore, Decision Fixtures, Snapshot/Full Diagnostic und kompakter Chat-Handoff;
4. Mock/LIVE-Trennung, Draft-ID/Slot, K/DST- und QB/TE-Endgame-Logik sowie Emergency Queue;
5. Build-/Syntax-/Regression-Gates und SHA-256 des erzeugten Pakets;
6. Android-Runtime-Test als separates Gate vor Promotion.

Dokumentationsdrift allein darf künftig nicht als Beleg für Runtime-Korrektheit gelten; umgekehrt muss ein Runtime-Release die Dokumentation im selben Release-Zyklus aktualisieren.