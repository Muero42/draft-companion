# Draft Companion – Final Draft Edition 2026 (v9.0.5)

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


## v9.0.5 – FantasyPros Ranking-Fix

- Einzel-Expertenrankings werden über den dokumentierten `consensus-rankings`-Endpunkt mit `filters=<expert_id>` geladen.
- FantasyPros-Felder `position_id` und `rank_ecr_pos` werden erkannt.
- Leere/fehlerhafte Ranking-Caches aus älteren Builds werden nicht mehr 12 Stunden weiterverwendet.
- Ein fehlgeschlagenes Update kann gültige vorhandene Panel-Rankings nicht mehr mit leeren Panels überschreiben.
- Diagnose prüft jetzt den verwendeten Consensus-Rankings-Endpunkt.


## v9.0.5 – Expert-Overall + Sleeper-ADP

- `rank_ecr` hat Vorrang als FantasyPros-Overall-Rang; alte v9.0.3-Ranking-Caches werden verworfen.
- `pos_rank`-Strings wie `WR8` werden korrekt gelesen.
- Sleeper-ADP wird direkt aus der Sleeper-Projections-Datenquelle versucht; nur substanzielle Datensätze werden akzeptiert.
- Falls Sleeper keine nutzbaren ADPs liefert, bleibt der FantasyPros-Fallback bzw. die klare FEHLT-Kennzeichnung aktiv.


## v9.0.5 – verifizierte Experten + Sleeper-ADP

- Einzelrankings werden nur akzeptiert, wenn FantasyPros die Filterung auf den konkreten Experten nachweisbar bestätigt oder `rank_min == rank_max` ein echtes Einzelranking belegt.
- Identische Expertenlisten werden erkannt und nicht mehrfach als Konsens gezählt.
- Alte v9.0.4-Ranking-Caches werden verworfen.
- Sleeper-ADP läuft serverseitig über den Worker, damit Browser-CORS die versteckte Sleeper-Projections-Quelle nicht blockiert.
- ADP wird aus `adp_half_ppr` geladen und über Sleeper-Spieler-IDs auf Namen gemappt.
- Service-Worker-Cache wurde auf v9.0.5 angehoben, damit alte JS-Dateien nicht weiter ausgeliefert werden.
