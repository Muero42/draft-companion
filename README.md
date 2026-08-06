# Draft Companion – Mock-Ready Final 2026 (v7.2.0)

## Neu

### Positionsränge

Für jeden Experten wird zuerst das Overall-Ranking geladen.

- Overall-Rang bleibt die primäre Bewertungsgrundlage.
- QB-, RB-, WR- und TE-Ränge werden daraus zuverlässig abgeleitet.
- Ein separates Positionsranking überschreibt nur den Positionsrang, wenn es verfügbar ist.
- Fehlende QB-/RB-/WR-/TE-Endpunkte brechen das Panel nicht mehr ab.

Im Draft Coach erscheint je Experte beispielsweise:

`Pat Fitzmaurice #28 (QB4)`

### Sleeper-ADP

„Alles aktualisieren“ prüft automatisch mehrere FantasyPros-API-Varianten.

Eine ADP wird nur übernommen, wenn sie in der Antwort ausdrücklich als **Sleeper**
gekennzeichnet ist. Ein generischer FantasyPros-Composite oder Sleeper-`search_rank`
wird niemals als Sleeper-ADP ausgegeben.

Falls die API keine eindeutige Sleeper-Quelle liefert, bleibt der manuelle,
verifizierte Import unter **Erweitert** erhalten. Eine bereits gespeicherte ADP
wird automatisch weiterverwendet.

## Eingefrorener Stand

Diese Version ist für die Mock-Draft-Phase bestimmt. Weitere Änderungen erfolgen
nur bei reproduzierbaren Fehlern oder zwingenden Datenkorrekturen.
