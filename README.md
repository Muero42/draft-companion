# Draft Companion – Final Draft Edition 2026 (v11.6.2)

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
- PUP ist bei ansonsten draftbarem Spieler ein kleiner Stash-Vorteil, kein Reach-Grund. IR erhält keinen Bonus und muss auf season-ending geprüft werden.
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
