# Sleeper Draft Companion v4.1.0

Diese Version ist für die Bedienung am Handy optimiert: **alle Dateien liegen im Root**, es müssen keine Ordner hochgeladen werden.

## Neu

- Cloudflare-Proxy als Root-Datei `_worker.js`
- kein direkter Browserzugriff auf FantasyPros, daher kein CORS-Fehler
- ausführliche API-Diagnose mit HTTP-Status, Antwortzeit und Antwortstruktur
- Expertenliste automatisch laden
- frei gewichtetes Expertenpanel
- Rankings ausgewählter Experten automatisch laden und kombinieren
- echte Sleeper-ADP bleibt strikt getrennt von `search_rank`
- vollständiger Sleeper-Live-Snapshot
- API-Key bleibt lokal im Browser gespeichert

## Einmaliges Update

Im GitHub-Repository auf `main` diese Dateien hochladen/ersetzen:

- `_worker.js`
- `app.js`
- `index.html`
- `styles.css`
- `sw.js`
- `manifest.webmanifest`
- `icon.svg`
- `README.md` (optional)

Cloudflare Pages veröffentlicht danach automatisch.

## Erster Test

1. Cloudflare-App öffnen.
2. Prüfen, dass oben `v4.1.0` steht.
3. Der vorhandene API-Key sollte aus der vorherigen App eventuell nicht übernommen werden, da ein neuer lokaler Speicherschlüssel verwendet wird. Falls das Feld leer ist, Key erneut einfügen.
4. `API diagnostizieren` antippen.
5. Das Diagnoseergebnis teilen – niemals den Key.

## Sicherheit

Der Key wird im lokalen Browser-Speicher gehalten und an `/api/fantasypros` auf derselben Cloudflare-Domain geschickt. `_worker.js` leitet ihn an FantasyPros weiter. Der Key wird nicht in GitHub gespeichert.
