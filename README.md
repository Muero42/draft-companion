# Draft Companion – Final 2026 (v5.1.0)

Stabile Draft-Version für Mock-Drafts und den echten Sleeper-Draft.

## Enthalten

- FantasyPros-HOF-API über Cloudflare-Proxy
- API-Diagnose
- frei gewichtete Expertenpanels
- separate Positionspanels für QB, RB, WR und TE
- Pat Fitzmaurice als vorbereitetes Einzelpanel
- verifizierter Sleeper-ADP-Import; `search_rank` wird niemals als ADP behandelt
- Panel-Rang, Tier, Streuung und Experten-Einigkeit
- Value-/Reach-Schutz
- transparente ADP-basierte Return-Schätzung
- Live-Sleeper-Draft und kompakter ChatGPT-Snapshot
- Auto-Refresh
- lokale Datenspeicherung
- Backup und Wiederherstellung ohne API-Key
- installierbare PWA

## Eingefrorener Funktionsumfang

Bis nach dem echten Draft werden keine großen Funktionen mehr ergänzt. Weitere Releases
sind nur für klar reproduzierbare Fehler oder zwingende Datenkorrekturen vorgesehen.

## Aktualisierung

Alle acht Dateien liegen im Repository-Hauptverzeichnis:

- `_worker.js`
- `app.js`
- `index.html`
- `styles.css`
- `sw.js`
- `manifest.webmanifest`
- `icon.svg`
- `README.md`

Cloudflare veröffentlicht nach einem Commit auf `main` automatisch.
