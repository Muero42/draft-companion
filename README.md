# Draft Companion – Final Draft Edition 2026
> **Current source candidate:** v11.8.0-rc4.189 Season waiver-semantics candidate. It fails closed on stale skill-position swap evidence, refreshes the pre-Week-1 DST waiver board against LIVE Sleeper ownership, and gates QB2 opportunities with current weekly evidence. Physical Android rc4.188 has passed the live Waiver/FA route canary; rc4.169 remains accepted rollback authority until rc4.189 is physically verified.
> **Season mode:** current Sleeper league state is Source of Truth; completed draft roster is immutable historical evidence only.
> **HISTORICAL rc4.158 bounded change:** adds a draft-day v4 expert baseline/delta workflow. Unchanged or failed/incomplete refreshes restore the prior verified baseline; panel rebuild can run cache-only and occurs only for baseline creation/repair or a real ranking delta.
> **HISTORICAL rc4.158 scope:** expert membership, weights, panel ranks semantics, tiers, Coach, Return-v2, manager logic, history and fingerprints are unchanged.
> **Draft locks:** exact canonical manager order/history; no K/DST; exactly one QB; Geno Smith and Aaron Rodgers hard excluded; starter maxima are not roster caps.

Built/source/package/deployment/device-observed/device-accepted are distinct states. Canonical source/runtime rc4.189 on main (verify HEAD dynamically); latest physical Android rc4.188 PASS; rollback rc4.169; deployment parity UNKNOWN_REQUIRES_REVERIFICATION. PR #121 / v233 MERGED/HISTORICAL; PR #118 OPEN / UNMERGED / NON-PRODUCTION. Current local checkpoint gate: `LOCAL_AUTHORITY_REVIEW_ONLY_NO_REMOTE_ACTION`.

Historical release-contract baseline canary retained for regression tooling: `v11.8.0-rc4.64`.

## HISTORICAL/SUPERSEDED release log
All release, Android, deployment, gate and CURRENT claims below are historical at the named version; they cannot override the current source/physical/rollback boundary above or PITTI_CURRENT_STATE.json. This includes the obsolete rc4.92 named-QB policy, old package counts, and old Season candidates.

### rc4.142 startup root-cause
- rc4.138-rc4.140 contained a fatal missing comma between the Ray Davis and Tyler Warren `RESEARCH_RESIDUAL_PRIORS` entries. The HTML shell/version badge could load while the module failed before any UI handler bound, exactly matching the observed inert `Alles aktualisieren` button and `–` status fields.
- rc4.142 repairs that syntax defect and adds `tools/runtime-startup-contract.mjs`, which parses both source `app.js` and the service-worker-transformed runtime, checks required DOM ids, and guarantees visible refresh feedback before the first network call.

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









## HISTORICAL/SUPERSEDED Season Companion candidates
- v11.8.0-rc4.171 — candidate: gives live-roster bootstrap first network priority, defers ranking/watcher background traffic until roster settles, keeps refresh buttons interactive while busy, and exposes 1/3–3/3 roster loading stages. Pending CI/preview/device acceptance.
- v11.8.0-rc4.170 — candidate: direct bounded-timeout Sleeper roster bootstrap, explicit Kader refresh with busy/error feedback, and fresh-origin slot-to-roster mapping recovery; Cloudflare watcher remains evidence-only. Pending CI/preview/device acceptance.
- v11.8.0-rc4.169 — candidate: fixes workspace leakage caused by author CSS overriding `hidden`, adds visible season ranking freshness/manual refresh with 12h controlled auto-refresh, and isolates Season render lanes so one Trade/FA renderer crash cannot blank unrelated live surfaces. Pending CI/preview/device acceptance.
- v11.8.0-rc4.168 — supersedes failed v11.8.0-rc4.167 and fixes the deterministic Season Trade startup crash caused by `tradeOfferCandidates` dereferencing nonexistent `target.x`; the function now consumes the row actually passed by `renderTradeWorkspace` (`target.r` / `target.p`). A new executable Season bootstrap runtime regression is mandatory in both candidate-package and release-contract gates. Kader remains season-first; Draft is archive only; FAIL-CLOSED behavior remains intact. Current installed Android app remains rc4.158 until automated gates and one final canary pass.


### rc4.173 startup-resilience candidate
- Device rc4.172 disproved the prior static interaction gate: `seasonRankingAge` rendered, but `seasonLiveStateAge` remained at the HTML dash and both Season refresh buttons were ineffective.
- That narrows the failure boundary to startup after workspace selection but before Season live-state/control completion. Legacy local research evidence is now sanitized; optional research-cache status rendering is fail-isolated so it cannot abort startup.
- A malformed-cache startup regression is now mandatory in release/package validation. No further device test before those automated gates pass.
