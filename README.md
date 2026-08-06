# Draft Companion – Mock-Ready Final 2026 (v7.1.0)

Diese Version ist für die Mock-Draft-Phase eingefroren.

## Ein-Klick-Workflow

Der Button **Alles aktualisieren**:

1. prüft den FantasyPros-API-Zugang,
2. lädt die aktuelle Expertenliste,
3. verwendet das empfohlene Preset,
4. lädt alle verfügbaren Panel-Rankings,
5. prüft die aktuellen Sleeper-Spielerdaten.

## Sleeper-ADP

Die offizielle Sleeper-API stellt keinen dokumentierten echten ADP-Endpunkt bereit.
Daher wird `search_rank` ausdrücklich **nicht** als ADP ausgegeben.

Eine einmal importierte, verifizierte Sleeper-ADP bleibt lokal gespeichert und wird
bei jedem Mock automatisch verwendet. Der Import befindet sich nur noch unter
**Erweitert → Verifizierte Sleeper-ADP**.

Fehlt diese Datenquelle, funktionieren Expertenpanels und Draft-Coach weiterhin;
Reach und Return werden aber bewusst als unsicher beziehungsweise fehlend markiert.

## Diagnose

Die Diagnose prüft nun korrekt:

- FantasyPros Experten
- FantasyPros Rankings
- Sleeper Spielerdaten
- Status der lokal gespeicherten verifizierten ADP

Der frühere fehlerhafte FantasyPros-Spieler-Endpunkt wurde entfernt.
