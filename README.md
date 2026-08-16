# Draft Companion – Final Draft Edition 2026 (v11.8.0-rc4.37)
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
### rc4.13.1 — validation-export only

### Paketstruktur
Diese Auslieferungs-ZIP enthält nur die 8 für Deployment/Dokumentation benötigten Dateien. Deterministische Regressionstests bleiben als Entwicklungs-/Release-Gates in `/Pitti/Development` und werden nicht mehr in jede Handy-/Deployment-ZIP dupliziert.

- No Draft Coach, Return-v2, panel, ADP, opponent, injury, scarcity, or scoring behavior changed.
- Existing Backup now also exports frozen `decisionFixtures` and `returnValidation`, plus mode/strategy/stress/manager-map state.
- Purpose: after a natural mock, one normal Backup preserves the decision-time evidence needed for strict no-future-leak full-draft counterfactual replay.


## v11.8.0-rc4.14.1 — Unified Manager Model v2.1
- Snapshot freshness guard: a duplicate/unmodified fingerprint already analyzed in chat must not trigger a second live analysis; request a fresh/current snapshot instead.
- Roster semantics are explicit: max 4 WR / 3 RB / 2 TE are simultaneous starter limits, not roster caps.
- Pre-analysis must use the same Player Quality, injury, Return/TAKE-WAIT and Championship Utility rules as live analysis.
- MOCK/TEST endgame K/DST hazard is strengthened from pick 130 onward after two natural mocks each showed 13 K/DEF selections in a 16-pick endgame window; LIVE rates remain unchanged pending real-league evidence.
- Active UI/cache/backup/version references synchronized; rc4.12 contained stale rc4.11 release identifiers outside the copied Snapshot.


## v11.8.0-rc4.11 – monotonic Player Quality + Expert Pool Health

- Player Quality is now anchored to the best available selected-panel rank; current pick/ADP no longer penalizes a player for being ranked *too highly*.
- Better selected-panel rank can never reduce the Player-Quality component. ADP/Return remain separate market/timing layers.
- Snapshot now reports desired six-expert pool health separately from position-panel completeness and exposes effective normalized position-panel weights.
- Missing desired experts are surfaced explicitly rather than hidden behind a nominal `3/3` or `4/4` position panel.
- No desired expert was automatically replaced; composition review remains an evidence-based pre-freeze decision.


## v11.8.0-rc4.11 – Snapshot-discovered Return-v2 calibration correction
- Fixes pre-draft/off-turn opponent-window geometry: if the current upcoming pick belongs to an opponent, that pick is now included. Slot 9 pre-draft correctly sees 8 opponent picks before 1.09; at 1.09 the short return to 2.02 remains 2 opponent picks.
- Re-anchors opponent candidate sampling to a tight Sleeper-ADP-dominant market center with panel rank as secondary signal, while preserving roster need, stress and manager modifiers. Elite ADP 1–4 players can no longer receive ~50% survival to pick 9 merely from an overly diffuse 70-player sampling pool.
- Snapshot opponent-pick count now uses the actual Return-v2 simulated window.
- Added deterministic geometry + early-market survival regression.

## v11.8.0-rc4.11 – Mock-retrospective scarcity correction

- Adds positional alternative/replacement scarcity to Draft Utility: passing a player is more costly when the next same-position option is materially worse; multiple near-equal alternatives reduce urgency.
- `Loss-if-Gone` now incorporates replacement gap and near-equal alternative count, not only tier geometry.
- Strengthens late WR saturation marginal utility after seven WR so an eighth WR does not beat a comparable upside RB on panel rank alone.
- Regression fixture covers the LaPorta→Herbert scarcity pattern and late 7-WR roster saturation.

## v11.8.0-rc4.11 – Return-v2 controlled validation release

### rc4.3 temporal-relevance hardening
- Critical injury/IR/PUP evidence now rejects old reports even when crawl/site placement is current. Reports older than 45 days require explicit current-status corroboration from the last 14 days.
- Crawl/observed time never substitutes for publication/event chronology.

### rc4.2 follow-up hardening
- Completed drafts now emit a dedicated post-draft snapshot only; no live research task, available-player recommendation list, or Return prompt survives completion.
- Return-validation ownership now stores/checks the user draft slot before treating a pick as the user's selected target.
- Snapshot task includes an assistant override guard: a generic roster/upside preference must not override a higher Companion choice when Return-v2 explicitly says the alternative is highly likely to return.
- Controlled-mock lesson preserved: at 11.09 the Companion had Josh Downs #1 and Jordan Mason at 91% Return/WARTEN; the user's Downs pick followed the Companion and Mason did return at 11.12.

### rc4 post-mock hardening
- Critical injury/IR/PUP research evidence now requires explicit event/publication chronology before it can become actionable; stale/unverified critical reports are retained only for audit.
- Return calibration is censor-aware: user-selected targets are excluded from Brier scoring.
- Immutable per-decision fixtures persist board/roster/candidate/Return/research/model metadata for no-future-leak replay.
- Final-pick Return is explicitly unresolved by construction.
- Late-round K/DST opponent-turn hazard remains active and is regression-gated.
- Preserves the RC3 fix for the RC2 Target-Collision temporal-dead-zone failure caused by a local `targets` declaration shadowing the outer target-player array during collision serialization.
- Adds a release-gate runtime regression that executes the actual `simulateReturnV2` implementation and forces the collision serialization path.
- Release discipline: after any runtime failure, diagnose the complete affected path and related integration boundaries before producing another RC; no one-error-at-a-time patch loop.

- Rebased onto complete v11.7.2 production package; Android single-line textarea fix preserved.
- Return-v2 sequential Monte Carlo with exact turn geometry and sequential opponent roster state.
- Player-Quality / Value-Safety regression gate integrated.
- 2026 LIVE manager map corrected; stale inactive managers blocked from active mapping.
- Basti Target Collision diagnostic integrated.
- Frozen return forecasts/calibration instrumentation integrated.
- Research Cache v2 and workspace/phase UI from v11.7.2 preserved.
- RC only: requires fresh Sleeper end-to-end validation before production promotion.

## v11.7.2 – Post-Audit Mobile Correction

- **Sleeper-Draft-Link / Android-Passwortmanager:** Das bisherige normale `<input>` war trotz `autocomplete=off` und Password-Manager-Ignore-Attributen auf dem Samsung/Android-Livetest weiterhin als Credential-Feld erkannt worden. v11.7.2 verwendet deshalb bewusst ein einzeilig gestyltes `<textarea>` mit derselben `.value`-Schnittstelle. Das vermeidet die Input-Credential-Heuristik, ohne Draft-ID/URL-Parsing, LocalStorage oder Snapshot-Logik umzubauen.
- **ADP-Status-Widerspruch behoben:** Der statische Hilfetext „Keine verifizierte Sleeper-ADP vorhanden“ wurde durch einen dynamischen Hinweis ersetzt. Bei geladenen ADPs zeigt er nun die aktive ADP-Nutzung; ohne ADP bleibt die konservative Fallback-Erklärung sichtbar.
- Keine Änderungen an Expertenpanels, Ranking-Rekonstruktion, Opponent Model, Return-Engine, Simulation Lab, Strategieprofilen oder Research Cache.
- Release-Guard: die beiden Post-Audit-Fehler sind ausdrücklich als Regression/fehlgeschlagene Live-Verifikation dokumentiert; Roadmap-Punkte bleiben unverändert erhalten.

## v11.7.2 – Konsolidierung / Phase Views / Requirement Guard

- Hauptnavigation in fünf Arbeitsbereiche getrennt: **Draft**, **Kader**, **Waiver / FA**, **Trades** und **Live / News**. Die Nicht-Draft-Bereiche sind als klar gekennzeichnete vorbereitete Views angelegt; sie behaupten noch keine angeschlossenen Live-Engines.
- **Panel-, Preset- und ADP-Details sind standardmäßig eingeklappt.** Der lange Status „Panels geladen …“ bleibt erreichbar, blockiert aber nicht mehr dauerhaft den mobilen Draft-Bildschirm.
- Research Cache v2 speichert Evidence append-only mit `observedAt`, `sourcePublishedAt`, `ingestedAt`, Player-/Thesis-Zuordnung, Source-Originalität und Confidence; identische Events werden dedupliziert.
- Replay-Schutz: Research-Evidence darf nur bis zum jeweiligen Cutoff berücksichtigt werden; automatische Quellen-Ingestion ist weiterhin bewusst als offen markiert.
- Release-Synchronität: sichtbare Version, Coach-Modell, Backup-Metadaten, Manifest, Service-Worker-Cache und `app.js`-Cache-Buster sind auf v11.7.2 synchronisiert.
- Ab v11.7.2 gilt ein Requirement-/Release-Guard: vorgemerkte Punkte werden vor Freigabe als **umgesetzt**, **bewusst verschoben** oder **blockiert** klassifiziert und nicht stillschweigend aus Folgereleases entfernt.


## Strategy Switch

- **Progressive Upside (v11)** ist die neue Standardstrategie.
- **Balanced / Anti-Reach (v10)** bleibt als eingefrorene Referenz auswählbar.
- Progressive Upside greift erst ab Runde 9 und erhöht die Ceiling-/Breakout-Gewichtung graduell in R9–10, R11–12 und R13–15.
- Panel bleibt Baseline; späte ADP-/Return-Bremsen werden schrittweise gelockert statt abgeschaltet.
- Rookie-/Year-2-RB/WR bekommen spät einen kleinen zusätzlichen Upside-Bonus; ein tiefer WR-Room bleibt nur Tiebreaker.
- Bei aktivem v11 zeigt die Coach-Karte zusätzlich den v10-Referenzscore an.
- Strategieauswahl wird lokal gespeichert und im Snapshot dokumentiert.

# Draft Companion – Final Draft Edition 2026 (v11.0.0)

## v11 – Replacement-Level & Upside

- 10-Team/1QB-spezifische Rosterlogik statt allgemeinem Overall-BPA.
- QB2 und TE2 werden nach dem ersten Starter nahezu gesperrt; nur extremer Elite-Value kann die Sperre lockern.
- QB1 bleibt Pflichtziel, darf aber bewusst spät kommen; im Snapshot wird bei ähnlichem Value Rushing-Upside als Vorteil verlangt.
- TE1 ist optional und darf bei einem TE-Run bis nach dem Draft/auf Waiver verschoben werden.
- Späte Bench-Picks erhalten einen RB-Upside-Bonus; ein sechster/weiterer WR braucht entsprechend mehr Value.
- Historischer v11.0-Stand: PUP wurde damals als kleiner Stash-Vorteil behandelt. **Seit v11.6.2 überholt:** PUP/IR erzeugen keinen automatischen Upside-Bonus; Opportunity Cost und Return-Timetable werden berücksichtigt.
- Snapshot fordert ausdrücklich aktuelle sowie angekündigte/geplante IR/PUP-Moves an.
- „Draft analysieren“ macht innerhalb eines Klicks einen kurzen zweiten Sleeper-Picks-Check, um verzögerte Pick-Daten abzufangen.
- Der Status beginnt mit „NÄCHSTER EIGENER PICK“, damit sofort sichtbar ist, ob Sleeper aktuell ist.
- Nach Draftende werden Live-Empfehlungen ausgeblendet; Review und Snapshot bleiben erhalten.
- Bestehende v7/v10 LocalStorage-Daten werden weiterverwendet/migriert.

# Draft Companion – Final Draft Edition 2026 (v10.0.0)

## v9.0.2 – Snapshot-Datenqualität

- vollständige bisherige Picks im Chat-Snapshot
- Top 25 (kompakt) bzw. Top 40 (vollständig) verfügbare Spieler nach Expertenpanel
- verwendete Panels, Ranking-Stand und echte Anzahl geladener Ranking-Spieler
- Einzelrankings für Coach-Favoriten; im vollständigen Snapshot auch für die Verfügbarkeitsliste
- kein vorzeitiges Abschneiden der Kandidaten durch Sleeper `search_rank`
- Fallback auf ein tatsächlich geladenes Panel bei leerer/veralteter Positionspanel-Zuordnung
- fehlende Sleeper-ADP bleibt ausdrücklich als Unsicherheit markiert; `search_rank` wird nicht als ADP ausgegeben

## Letzter UI-Feinschliff vor den Mocks

- verständlichere Statusanzeige
- kompakte Panelübersicht statt technischer Detailmeldung
- Pat-Fitzmaurice-Overall-Fallback bleibt aktiv
- kürzere Sleeper-ADP-Information
- nach erfolgreicher Draft-Verbindung werden Daten- und Verbindungsbereich eingeklappt
- der Draft Coach wird automatisch hervorgehoben
- Mock Review benennt besten Pick und größten Reach klarer

## Entwicklungsstopp

Ab v9.0.1 werden bis nach dem echten Draft ausschließlich klar reproduzierbare Fehler
oder zwingende Datenkorrekturen behoben.


## v10.0.0 – FantasyPros Ranking-Fix

- Einzel-Expertenrankings werden über den dokumentierten `consensus-rankings`-Endpunkt mit `filters=<expert_id>` geladen.
- FantasyPros-Felder `position_id` und `rank_ecr_pos` werden erkannt.
- Leere/fehlerhafte Ranking-Caches aus älteren Builds werden nicht mehr 12 Stunden weiterverwendet.
- Ein fehlgeschlagenes Update kann gültige vorhandene Panel-Rankings nicht mehr mit leeren Panels überschreiben.
- Diagnose prüft jetzt den verwendeten Consensus-Rankings-Endpunkt.


## v10.0.0 – Expert-Overall + Sleeper-ADP

- `rank_ecr` hat Vorrang als FantasyPros-Overall-Rang; alte v9.0.3-Ranking-Caches werden verworfen.
- `pos_rank`-Strings wie `WR8` werden korrekt gelesen.
- Sleeper-ADP wird direkt aus der Sleeper-Projections-Datenquelle versucht; nur substanzielle Datensätze werden akzeptiert.
- Falls Sleeper keine nutzbaren ADPs liefert, bleibt der FantasyPros-Fallback bzw. die klare FEHLT-Kennzeichnung aktiv.


## v10.0.0 – verifizierte Experten + Sleeper-ADP

- Einzelrankings werden nur akzeptiert, wenn FantasyPros die Filterung auf den konkreten Experten nachweisbar bestätigt oder `rank_min == rank_max` ein echtes Einzelranking belegt.
- Identische Expertenlisten werden erkannt und nicht mehrfach als Konsens gezählt.
- Alte v9.0.4-Ranking-Caches werden verworfen.
- Sleeper-ADP läuft serverseitig über den Worker, damit Browser-CORS die versteckte Sleeper-Projections-Quelle nicht blockiert.
- ADP wird aus `adp_half_ppr` geladen und über Sleeper-Spieler-IDs auf Namen gemappt.
- Service-Worker-Cache wurde auf v10.0.0 angehoben, damit alte JS-Dateien nicht weiter ausgeliefert werden.


## v10.0.0 – echtes Expertenranking statt ECR-Spalte

Der entscheidende Fehler aus v9.0.5 wurde isoliert:

- `rank_ecr` wird **nicht mehr** als Rang des ausgewählten Experten interpretiert.
- Bei einem verifizierten Einzel-Experten-Filter wird nur noch der zusammengefallene Bereich `rank_min == rank_max` als tatsächlicher Expertenrang akzeptiert.
- Die Ranking-Abfrage nennt Draft / Overall / Scoring jetzt explizit, soweit der FantasyPros-Endpunkt diese Parameter unterstützt.
- Ranking-Cache-Schema wurde auf v5 angehoben; alte ECR-Werte wie A.J. Brown #14 können nicht weiterverwendet werden.
- Der Snapshot zeigt jetzt pro Positionspanel `Verifizierte Einzelrankings: x/y`.
- Confidence wird bei nur einer Einzelmeinung bewusst abgesenkt.
- Sleeper-ADP und die funktionierende Draft-/Pick-Pipeline aus v9.0.5 wurden nicht verändert.

Referenzkontrolle für Half-PPR: Pat Fitzmaurices öffentliche FantasyPros-Seite muss mit den vom Companion ausgegebenen Einzelrängen übereinstimmen; ECR und Pat-Rang dürfen auseinanderliegen.


## v10.0.0 – keine unverifizierten Rankings mehr im Panel

Der v9.0.6-Test hat gezeigt: `0/x verifiziert`, aber alte Pat-Werte wurden noch als Panel ausgegeben. Das war ein Logikfehler.

- Nur `verifiedIndividual=true` darf jetzt in `computePanel()` eingehen.
- Stale-Fallback-Caches werden ausdrücklich auf `verifiedIndividual=false` gesetzt.
- Alte Ranking-Caches werden erneut verworfen (Schema v6).
- `rankFor()` akzeptiert nur Panels, die mindestens einen verifizierten Experten enthalten.
- Wenn kein Expertenpanel verifiziert ist, bleibt der Draft Coach bewusst leer statt alte ECR/Pat-Werte vorzutäuschen.
- Für die technische Kontrolle wird dann separat eine `DIAGNOSE OHNE EXPERTENPANEL` mit Sleeper SearchRank + echter Sleeper-ADP ausgegeben.
- Sleeper-ADP, Draft-Picks und Verfügbarkeit bleiben unverändert.


## v10.0.0 – verifizierte API-Einzelrankings

Die Expertenpipeline nutzt ausschließlich die offizielle FantasyPros-API:

1. Pro ausgewähltem Experten wird `consensus-rankings` mit `position=ALL`, `type=DRAFT`, dem gewählten Scoring und genau einer Expert-ID geladen.
2. Die Liste wird nur akzeptiert, wenn FantasyPros `total_experts = 1` meldet und die Expert-ID im Response bestätigt ist.
3. Ein zweiter, unabhängiger API-Weg (`compare-players`) prüft mindestens zwei Positionsränge gegen dieselbe Expert-ID.
4. Nur wenn beide Prüfungen bestehen, erhält die Liste `verifiedIndividual=true` und darf ins Panel.
5. Der Draft-Kandidatenpool wird ausschließlich aus den verifizierten Expertenrankings gebildet: QB 30, RB 90, WR 80, TE 30; K/DST 0. Maximal 230 Spieler.
6. Sleeper SearchRank und Sleeper ADP beeinflussen nicht, welche Spieler in den Expertenpool gelangen. Sleeper ADP wird erst danach als Marktindikator genutzt.
7. Alte Cache-Schemata werden nicht als verifizierte Quelle übernommen.

Hinweis: `compare-players` wird absichtlich nur als Positionsrang-Crosscheck verwendet. Die NFL-Dokumentation führt dort QB/RB/WR/TE/FLX als Positionen, nicht ALL; deshalb darf dieser Endpunkt nicht als Quelle für Overall-Ränge missverstanden werden.


## v10.0.0 – Draft-Expertenquelle korrigiert

Root-Cause-Fix nach Live-Diagnose:

- `/rankings/experts` wird nun ausdrücklich mit `position=ALL`, `type=DRAFT`, gewähltem Scoring und `include_overall=true` geladen.
- Das Preset wird nach dem Laden der Draft-Experten anhand der ExpertenNAMEN neu gebunden; alte IDs aus weekly/default Expertenlisten können nicht fortleben.
- Einzel-Overall wird primär als `week=0` Preseason/Draft-Consensus mit EINER Expert-ID und ohne erzwungenes `type=DRAFT` geladen.
- Erst `total_experts=1` plus bestätigte Expert-ID machen eine Liste verifiziert.
- `compare-players?ranking_type=draft` bleibt als unabhängiger Positionsrang-Crosscheck.
- Diagnose zeigt die Größe der Draft-Expertenliste sowie ID/Verfügbarkeit von Pat Fitzmaurice, Justin Boone, Sean Koerner, Andrew Erickson, Derek Brown und Matt Harmon.
- Sleeper-Draft und Sleeper Half-PPR ADP bleiben unverändert.


## v10.0.0 – Multi-Source Expertenpipeline

- Experten werden aus FantasyPros API + öffentlichem FantasyPros-Draft-Verzeichnis zusammengeführt.
- Preset-Experten bleiben auswählbar, selbst wenn die API sie vorübergehend nicht listet.
- Rankingquelle wird pro Experte automatisch aufgelöst:
  1. vollständige öffentliche FantasyPros-Einzelrangliste,
  2. für Yahoo-Experten offizielle Yahoo-Rankingtabellen,
  3. andernfalls Experte als nicht verfügbar.
- FantasyPros `*-consensus-rankings` dient nur als Crosscheck und NIE als Quelle für fehlende Ränge, da die Seite absichtlich nur größere Abweichungen zeigt.
- Ein fehlender Experte blockiert nicht mehr das gesamte Panel; verfügbare verifizierte Experten laufen weiter.
- Kandidatenpool bleibt maximal 230 (QB 30, RB 90, WR 80, TE 30), ausschließlich aus Expertenrankings.
- Sleeper ADP/Draft bleiben unverändert.


## v10.0.0 – generische Comparison-Rekonstruktion

Für Experten ohne vollständige öffentliche Einzelrangliste:

- FantasyPros-Dissenting-Comparison-Seiten werden gegen mehrere verifizierte Ankerexperten (Pat Fitzmaurice, Andrew Erickson, Derek Brown) geladen.
- Alle dort sichtbaren Ränge des Ziel-Experten sind **exakte Overall-Ränge** und werden als solche gespeichert.
- Spieler, die auf keiner Dissenting-Seite erscheinen, werden nur dann konservativ rekonstruiert, wenn mindestens zwei Anker sie ranken und deren Overall-Ränge höchstens 14 Plätze auseinanderliegen.
- Rekonstruierte Werte werden ausdrücklich mit `≈` gekennzeichnet und im Panel gegenüber exakten Einzelrängen automatisch niedriger gewichtet.
- Stark unsichere Rekonstruktionen werden verworfen.
- Ein Experte gilt nur als nutzbar, wenn mindestens 100 QB/RB/WR/TE-Spieler und mindestens 25 exakte Comparison-Ränge vorliegen.
- Direkte vollständige FantasyPros-Einzelranglisten bleiben immer Priorität 1.
- Yahoo bleibt nur letzter Fallback.
- Das Verfahren ist namens-/quellenbasiert und funktioniert damit auch für künftig ausgewählte FantasyPros-Experten, sofern FantasyPros Vergleichsdaten bereitstellt.


## v10.0.0 – Original-Overall + Qualitätsgate

- FantasyPros-Quellparser behalten QB/RB/WR/TE **und K/DST**, damit die originale Overall-Nummerierung eines Experten unverändert bleibt.
- K/DST werden erst beim App-Import bzw. Draft-Kandidatenpool entfernt. Dadurch bleiben z. B. Overall #185 und #186 genau die Originalränge des Experten.
- Rekonstruktionsqualität wird generisch geprüft:
  - mindestens 120 draftbare QB/RB/WR/TE,
  - mindestens 50 exakte draftbare Comparison-Ränge,
  - mindestens 55 % exakte Draft-Abdeckung,
  - mittlerer Spread der rekonstruierten Werte höchstens 9,
  - maximaler Spread weiterhin höchstens 14.
- Nicht bestandene Experten werden automatisch übersprungen; sie blockieren das restliche Panel nicht.
- Panelgewichte werden mathematisch nur über die pro Spieler tatsächlich verfügbaren verifizierten Experten normiert.
- Status und Snapshot unterscheiden exakte und rekonstruierte Ränge weiterhin klar.


## v10.0.0 – Coach/Return/Research
- Expertenranking- und Rekonstruktionspipeline aus v9.6.1 unverändert.
- Coach-Score startet nicht mehr am 100er-Deckel; Favoriten bleiben vergleichbar, Unterschiede werden sichtbar.
- Return-Chance wird am echten Folgepick nach dem aktuellen eigenen Pick berechnet (Snake-Draft-Bug behoben) und mit engerer ADP-Kurve kalibriert.
- Snapshot enthält Research-Kandidaten für gezielte Live-Prüfung von Sleeper-/Breakout-/League-Winner-/Bust-Artikeln, Camp-News, Rollenänderungen, Verletzungen und Depth Charts.
- Artikelkontext überschreibt die Expertenbaseline nicht automatisch; Abweichungen müssen begründet werden.

## v10.0.0 – Scoring Guard + Relative Coach
- FantasyPros-Direktlisten nur bei explizit verifiziertem Saison-/Overall-/Scoring-Kontext.
- Half-PPR muss im Quellinhalt als Half Point PPR/Half PPR erkennbar sein; kein stiller Scoring-Fallback.
- Quell-Scoring und Aktualisierungsdatum werden im Snapshot sichtbar.
- Coach-Score relativ: bester aktueller Kandidat = 100, Abstände werden sichtbar.
- Return absolut + relativ zum aktuellen Board.
- Roster-Need steigt mit der Draftphase; Runde 1/2 bewusst kleiner Faktor.
- Tier/Scarcity zusammen maximal 1,5 Punkte, damit TE1/Tier-Drop die Panelbaseline nicht überstimmt.


## v11.4.0 – Opponent Model v2 / Stress Tests
- Kontrollierte Szenarien: Baseline, RB-Druck, TE-Run, Rookie-RB-Reach, Late-Round-Upside.
- Stressfaktoren wirken ausschließlich auf Return-/Abnehmerdruck; Expertenpanel bleibt Baseline.
- Managerprofile bleiben evidenzgewichtet und werden im Live-Modus zusätzlich berücksichtigt.
- Balanced / Anti-Reach v10 bleibt unverändert als Referenzstrategie.


## v11.5.0 – Historical Timing Layer + Simulation Lab v2
- Historische Drafts 2017–2024 wurden positionsbezogen ausgewertet; 2021 bleibt bei Björn als bestätigter Rookie-Themendraft aus dem Normalprofil ausgeschlossen.
- QB-/TE-Managerdruck berücksichtigt nun zusätzlich die historische erste Besetzungsrunde, mit stärkerem Gewicht auf 2022–2024. Das ist nur ein weicher Hazard-Modifikator; aktuelle Aussagen/Strategiewechsel bleiben separat und können historische Muster abschwächen.
- Simulation Lab nutzt 5 Szenarien × 1.200 Läufe und einen deterministischen Seed: identischer Draftzustand erzeugt identische Gegenprobe.
- Ausgabe ergänzt Szenario-Mittelwert und Spanne; große Spanne markiert fragile Return-Annahmen.
- Expertenpanel bleibt unverändert Baseline; Simulation/Managerhistorie beeinflussen ausschließlich Return-/Abnehmerdruck.
- UI-Versionsbadge korrigiert (v11.4 zeigte dort noch v11.3).

## v11.6.2 – Live-Speed / Snapshot Guard

- Hauptaktion ist atomar: **Analysieren → frischen Snapshot erzeugen → kopieren**.
- Während `refresh()` sind Kopieren und Teilen gesperrt; dadurch kann nicht versehentlich der alte Snapshot kopiert werden.
- Jeder Snapshot enthält einen Fingerprint aus Draft-ID, Slot, Pick-Anzahl und den letzten Picks und markiert unveränderte Wiederholungen als `DUPLIKAT/UNVERÄNDERT`.
- Draft-ID-Eingabe nutzt explizit normale Text-/URL-Semantik und deaktiviert Autofill/Passwortmanager-Hinweise.
- Live-Speed-Tiers: FULL, FOCUSED, EMERGENCY. Der Snapshot gibt das Zeitbudget mit.
- Vorab-Research-Cache vorgesehen (`localStorage: v116_researchCache`): pro Spieler `updated` + `flags` wie ROLE_UP, ROLE_DOWN, INJURY, PUP, IR, CONTINGENT_UPSIDE, STANDALONE_ROLE, BREAKOUT, BUST_RISK, CAMP_BUZZ.
- QB-/TE-/Late-RB-Entscheidungspfade werden im Snapshot vorbereitet. Live-Websuche soll nur neue, entscheidungsändernde Informationen prüfen.
- v11.5 Opponent Model, Manager-Layer, Historical Timing, Simulation Lab und Progressive-Upside/v10-Referenz bleiben erhalten.


## v11.6.2 Replay-Calibrated
- Return v2: Effective Competition Picks; offene K/DST-Slots der Gegner reduzieren im Endgame die erwarteten Skill-Position-Picks.
- Opponent roster zählt nun QB/RB/WR/TE/K/DEF für die Endgame-Nachfrage.
- Progressive Upside ist phasenbasiert statt rein monoton.
- Marginal Roster Utility ist graduell und respektiert flexible 1–3 RB / 2–4 WR Startkonstruktionen; keine starre FantasyPros-Sollverteilung.
- PUP/IR erzeugen keinen automatischen Upside-Bonus mehr; Stash-/Opportunity-Cost und Return-Timetable werden explizit berücksichtigt.
- FantasyPros Post-Draft Grade bleibt Diagnose-Benchmark, kein Optimierungsziel.
- Replay-Referenz: letzter vollständiger 10-Team-Half-PPR-Mock, insbesondere Turns 109/112, 129/132 und 149.


## v11.6.2 regression fix
- Simulation Lab now consumes opponent endgame K/DST selections as nominal turns without falsely removing skill-position players.
- This aligns simulation return pressure with Effective Competition Picks used by the live return layer.


## Kanonisches Requirements- & Release-Ledger

Ab v11.7.2 wird dieses Ledger vor jeder GitHub-Freigabe gegen den tatsächlichen Code geprüft. Ein vorgemerkter Punkt darf nicht stillschweigend verschwinden.

### UMGESETZT
- ADP-Hilfetext ist dynamisch und kann nicht mehr gleichzeitig „keine ADP“ behaupten, wenn ADP geladen ist.
- Sleeper-Draft-Link nutzt ab v11.7.2 ein einzeiliges Textarea statt eines Input-Felds, nachdem die bisherigen Autofill-Ignore-Attribute den Android/Samsung-Passwortmanager im Livetest nicht zuverlässig unterdrückten; **Live-Verifikation auf dem Nutzergerät steht noch aus.**
- Lange „Panels geladen …“-Anzeige standardmäßig eingeklappt; Panel-/Preset-/ADP-Details bleiben aufklappbar.
- Phase-spezifische Hauptnavigation: Draft, Kader, Waiver/FA, Trades, Live/News.
- Draft-Sicht von nicht benötigten Saisonfunktionen getrennt; bestehende Draft-Funktionalität bleibt erhalten.
- Live-Speed/Snapshot Guard: kein Kopieren/Teilen eines veralteten Snapshots während laufender Analyse.
- Progressive Upside als Standard; Balanced/v10 bleibt eingefrorene Referenz.
- Bye Weeks nur kleiner Tiebreaker.
- PUP/IR ohne künstlichen Upside-Bonus; Opportunity Cost / Return-Timetable werden berücksichtigt.
- Flexible Roster-Utility statt starrer RB/WR-Sollverteilung.
- Mehrere nahezu gleichwertige Favoriten bleiben sichtbar; keine erzwungene Eindeutigkeit.
- Opponent Model / Historical Timing / Simulation Lab bleiben Druck-/Return-Layer und überschreiben das Expertenpanel nicht.
- Research Cache v2: append-only Evidence, Timestamps, Dedupe, Player/Thesis-Zuordnung und Replay-Cutoff-Grundschutz.
- Versions-Synchronitätscheck: UI, Coach-Modell, Backup-Version, Manifest, Service Worker und Cache-Buster.

### BEWUSST VERSCHOBEN – Roadmap, nicht vergessen
- Automatische Research-Cache-Befüllung aus Primär-/Beat-/Analyse-/Market-Quellen.
- Vollständige Kader-Engine für Hold/Drop/Protect inklusive Thesis Protection und Bench Opportunity Cost.
- Waiver/Free-Agent-Engine inklusive FAAB, Informational Acquisition, Market Window Closing und lokaler Gegner-/Auktionsumgebung.
- Trade-Engine inklusive Counterfactual Set, Throw-in Protection und Belief/Value/Action-Trennung.
- Live-/News-Engine für Verletzungen, Inactives, Usage, Depth Chart, Market Acceleration und vorberechnete Trigger-Aktionen.
- Automatische Archivierung zeitabhängiger Trending-/Market-Snapshots für den prospektiven Shadow Backtest.
- Vollständiger historischer Evidence-Replay mit unveränderlichen Decision-Time Snapshots, Model-Version, Alternatives/Counterfactual Set und No-Action-Snapshots.
- Opportunity-Conversion-/Contingency-Modell: Player Confirmation getrennt von Team Response / Hierarchy Revision.
- Team-State-/Playoff-Zweck im Decision Utility: Playoff-Qualifikation vs. spätere Championship-Upside.
- Regelabhängiger Roster-Liquidity-/Option-Throughput-/Sequencing-Layer für Free-Agent-Cycling.
- News-Quellenhierarchie, Source Originality und getrennte Fundamental-vs.-Market-Recognition-Signale.

### RELEASE GUARD
Vor Freigabe müssen vollständig geprüft sein: vollständige acht Release-Dateien; Versionsreferenzen synchron; JavaScript-Syntax; Service-Worker-Assets/Cache-Buster; zentrale DOM-Elemente; UI-Vormerkungen im HTML; Roadmap-Status; keine stillschweigende Überschreibung bestehender Modellregeln.

## v11.8.0-rc4.4 – release-ledger consistency correction
- Promotion audit found one contradictory visible historical-baseline sentence in the RC4.3 freeze note: it described v11.6.2 as the unchanged Draft baseline even though the package is explicitly rebased on production v11.7.2.
- The stale sentence is replaced with version-neutral preservation wording; no model behavior changes.
- Release/version identifiers synchronized to rc4.4.


## rc4.10 no-PC audit
- Positional scarcity double-count correction: tier geometry remains diagnostic; replacement-aware alternative scarcity is the single scored positional-scarcity channel.
- Added deterministic `Draft_Companion_Scarcity_Double_Count_Regression_2026-08-13.js`.
- Production remains v11.7.2; rc4.10 is test-only and inherits the natural prospective validation gate.

## v11.8.0-rc4.12 — Snapshot fail-soft + one-slot PUP stash tiebreaker
- Snapshot refresh no longer downloads the full Sleeper NFL player pool twice. The anti-stale second read checks only draft + picks and reuses the first player payload.
- Sleeper requests are bounded by AbortController timeouts; a failed short control read falls back to the successful first read instead of blocking the whole Snapshot path indefinitely.
- League-specific draft assumption preserved: one IR slot; PUP is IR-eligible under the currently verified league settings. When that slot is still free, a late PUP player can receive a small stash/tiebreak value because the roster spot can be refilled immediately after the draft.
- This is deliberately not a generic injury upside bonus. Once the IR slot is already consumed, the stash benefit disappears. IR remains materially penalized until current evidence confirms that it is not season-ending and provides a plausible return timetable.
- Draft-day emergency fallback remains: if live Snapshot/Companion loading fails, a Sleeper available-player screenshot is sufficient for a degraded-confidence emergency recommendation; Return-v2/opponent outputs must never be invented when unavailable.


## rc4.29
- Roster/Team v1.1 adds conservative bench-capital review after draft completion.
- Review is not a drop recommendation: every candidate remains REVIEW ONLY until compared against a materially better free agent.
- High-upside contingent RBs receive explicit preservation bias.
- No Coach/Return-v2/panel/ADP coefficient changes.


## v11.8.0-rc4.30 — Post-Draft FA-vs-Roster v1
- Adds read-only concrete available-pool vs roster swap analysis with CLEAR ADD / WATCH / HOLD thresholds.
- Selected expert panel remains Player Quality baseline; Sleeper ADP is market context.
- CLEAR ADD requires current Research Cache evidence; missing evidence caps action at WATCH.
- Preserves contingent RBs and strongly penalizes QB2/TE2 in 10-team 1QB context.
- No transactions, FAAB, Trade logic, Coach/Return/model coefficient changes.
- Fixes Backup provenance version to current package version.


## v11.8.0-rc4.31 — Trade Target Board v1
- Adds automatic read-only target discovery across opponent draft rosters.
- Uses selected-panel quality, positional upgrade and current Research Cache hints.
- Explicitly withholds ACCEPT/DECLINE and fairness until Boone ROS/market and opponent-utility inputs are available.
- No transactions or draft-model changes.


## v11.8.0-rc4.32 — Waiver/FA Priority v1
- Reuses FA-vs-Roster swap results for claim priority; no second Player Quality engine.
- Numeric FAAB intentionally fail-closed until current waiver-week/market evidence exists.
- No transactions or draft-model changes.


## v11.8.0-rc4.33 — Watcher public feed bridge (prepared)
- Background read-only sync to `/companion-feed`; only schema-valid gate PASS is ingested.
- No WATCHER_TOKEN is stored in Draft Companion.
- Critical player-state changes without true source publication/event chronology remain non-actionable provenance.
- Watcher v0.1.5 deployment is a separate external gate; rc4.33 fails closed while the endpoint is unavailable.


## v11.8.0-rc4.37 — Mock/LIVE phased Draft views + read-only rehearsal
- Adds separate Mock/Vorbereitung and LIVE Draft views over the same Decision Engine; no duplicate Coach/Return/Player Quality path exists.
- LIVE hides expert/panel/strategy/stress/simulation configuration and Advanced settings to reduce draft-day misnavigation; switching to LIVE sets the existing canonical draft mode to `live`.
- Adds a read-only LIVE preview using the current connected draft plus a historical pick cutoff while retaining LIVE manager/Return behavior. Preview does not resolve/freeze Return validation, Decision Fixtures, or duplicate-Snapshot state.
- Mock/Vorbereitung retains the full configuration and Simulation Lab.
- Fixes a discovered stale `index.html` app cache-buster (`rc4.28`) so index, service worker, runtime and package now coherently request rc4.37.
- No Coach, Player Quality, Return-v2, Manager Model, Research Residual, FAAB, Trade or Waiver scoring coefficients changed.
