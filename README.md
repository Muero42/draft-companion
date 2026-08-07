# Draft Companion – Final Draft Edition 2026 (v9.0.3)

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


## v9.0.3 – FantasyPros Ranking-Fix

- Einzel-Expertenrankings werden über den dokumentierten `consensus-rankings`-Endpunkt mit `filters=<expert_id>` geladen.
- FantasyPros-Felder `position_id` und `rank_ecr_pos` werden erkannt.
- Leere/fehlerhafte Ranking-Caches aus älteren Builds werden nicht mehr 12 Stunden weiterverwendet.
- Ein fehlgeschlagenes Update kann gültige vorhandene Panel-Rankings nicht mehr mit leeren Panels überschreiben.
- Diagnose prüft jetzt den verwendeten Consensus-Rankings-Endpunkt.
