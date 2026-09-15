# rc4.203 Production/device-failure authority — v253
Handoff generation: `20260915T0558Z-v253`

## v253 CURRENT
Canonical `main@fb458e076de6710a91f1162e504b5b79fb67167c` is rc4.203, merged via historical PR #174 and successfully Production-deployed as `ef65bcf6-92d1-4c34-9873-c362bec002c7`. Android/PWA observed `v11.8.0-rc4.203`, but Weekly Evidence failed `PROJECTION_LANE_UNAVAILABLE`; the physical verdict is `RC4.203_PHYSICAL_FAIL_WEEKLY_PROJECTION_SEMANTIC_SCOPE_MISMATCH`, FAILED and **NOT device-accepted**. Production success and device acceptance remain distinct. rc4.202 -> rc4.201 -> rc4.200 -> rc4.199 -> rc4.198 are historical; rc4.195 remains the accepted rollback reference.

The proven first boundary is pre-mapping semantic scope: at least one numeric `stats.points_half` per QB/RB/WR/TE lane exceeded the weekly ceiling. Missing access/numerics, mapping, proxy mutation, and chronology are disproven as the first failure. Broad season scale, sparse outliers, and query-shape impact remain UNKNOWN.

Exact gate: `RC4203_SECRET_SAFE_PROVIDER_AB_DIAGNOSTIC_THEN_PROVEN_REPAIR`. First fresh-verify handoff-only Draft PR #175 at public head `0bd7a77361b95cf212b9e59417f20dc820461dc3`, main, historical merged PR #174 (never a candidate), historical/discoverable PR #163 (cannot override v253), and separate `pitti-watcher` PR #6 at expected head `77221ceeb900458e95c32d78c1ad395a37422e5d`; then execute exactly one secret-safe same-credential provider A/B. These are mutable verification targets. Keep source, package, preview, Production, device-observed, and device-accepted distinct. No speculative rc4.204, automatic Sleeper transaction, app reinstall, cache/app-data clear, or device loop. AUTO works silently on independent safe work; AUTO BLOCK affects only the dependent lane; STATUS is report-only.

Takeover reading order: `AGENTS.md`, CURRENT, LOCK, COMMAND, immutable rc4.203 evidence, root-cause diagnosis, v253 bridge, v253 audit, SEAL, then this file. Start/Sit is WEEKLY-primary; Waiver/FA and Trade are not globally blocked by WEEKLY when sufficient independent evidence exists; K/DST is separate; freshness is cadence-aware.

## HISTORICAL/SUPERSEDED CHECKPOINT CONTENT
The content below is retained only as history and cannot override v253.

# rc4.203 source/candidate authority — v252
Handoff generation: `20260914T1727Z-v252`

`v11.8.0-rc4.203` is the current source/package/preview candidate in this tree and is not Production-deployed, device-observed, or device-accepted. Canonical `main`, PR state, containing commit, and exact-head CI remain mutable external evidence. The 17-file package has `PACKAGED_ONLY_NOT_DEPLOYED` semantics and its archive identity is run/environment-scoped, never cross-environment authority.

Newest verified Production and newest device-observed failure is `v11.8.0-rc4.202` at exact `main@4e2b9af1c8562c0273f39503c2c1c90a15acce00`, Cloudflare deployment `d1e38b4b-27ed-4f87-bfa7-0e99f282de5d`, status `success`. Its separate physical verdict is `RC4.202_PHYSICAL_FAIL_YEARLESS_PROJECTION_CHRONOLOGY_REJECTED`; it is **not device-accepted**. Immutable observation: `docs/PITTI_BRIDGE_HANDOFF_RC4202_PHYSICAL_PROJECTION_LANE_FAIL_2026-09-14.md`.

Preserved history remains explicit: rc4.201 is the immediate prior Production/physical-failure history, followed by rc4.200, rc4.199 (`RC4.199_PHYSICAL_FAIL_WEEKLY_PROJECTION_SEMANTIC_MISMATCH`), and older rc4.198; rc4.195 remains the accepted rollback.

## Mutable live takeover targets
Fresh live READ-ONLY verification must cover merged PR #173 as historical rc4.202 provenance only, the new rc4.203 follow-up Draft PR as the current candidate lane, PR #172 as historical rc4.201 provenance only, PR #163 as a historical/discoverable v248 anchor only, and separate pitti-watcher PR #6 at expected head `77221ceeb900458e95c32d78c1ad395a37422e5d`. These are mutable verification targets. Keep source, package, preview, Production, device-observed, and device-accepted distinct.

Root cause and repair boundary: a yearless current FantasyPros projection update date such as `09/14` reached `Date.parse`, became a 2001 timestamp, and made every otherwise mapped current-week record fail `INVALID_PROVIDER_CHRONOLOGY`. rc4.203 applies the existing bounded requested-season inference (within eight days of authenticated retrieval) to projections. Out-of-window dates and every malformed, contradictory, wrong season/week/position/ROS/provenance, season-scale, all-zero, or definitively unmapped lane still purge current and prior rows. `stats.points_half` remains Half-PPR authority and the projections request still has no unsupported `scoring` parameter.

Current gate: `VERIFY_CANONICAL_AUTHORITY_THEN_AUTHORIZED_WORK`.

## HISTORICAL/SUPERSEDED CHECKPOINT CONTENT
# v11.8.0-rc4.201 integrated P0 candidate (PR #162; not deployed or device-accepted)

# rc4.198 post-merge source/package authority — v245
Handoff generation: `20260912T1317Z-v245`

Canonical main was dynamically verified at `826a1f3327ffac643f3c32217246133ea32bd3ac`. `v11.8.0-rc4.198` is the current source/main authority and has a verified **17-file source-byte/re-extraction parity** package with status `PACKAGED_ONLY_NOT_DEPLOYED`. Archive SHA values are observations scoped to one run/environment and MUST NOT be treated as cross-environment archive-byte identity.

Production and device authority remain `v11.8.0-rc4.196` at exact deployed commit `082d77003f6616e290146698641aebe63f37b8c2`, deployment `da039536-7733-4b07-8f0c-70cc6e0bc8b7`, with verdict `RC4.196_PHYSICAL_PARTIAL_PASS_NOT_ACCEPTED`. `v11.8.0-rc4.195` remains the prior fully accepted rollback reference. No rc4.198 deployment or device evidence is claimed.

PR #156 was squash-merged from reviewed head `931713f8f8beaa70edbfb75041b2c708fae66109` onto base `62d7ecf11774700551b6e5a0497ec054e327a0d7` as commit `826a1f3327ffac643f3c32217246133ea32bd3ac` with tree `1e91afc64a61f4aad08f7fc50d687736211b3d87`. This is historical merge provenance only and proves neither deployment nor device acceptance. The rc4.198 archive SHA is noncanonical run/environment-scoped evidence only.

Current gate: `VERIFY_CANONICAL_AUTHORITY_THEN_AUTHORIZED_WORK`. Before continuation or promotion, dynamically verify canonical Git/GitHub authority and exact-head checks.

## HISTORICAL/SUPERSEDED v244 CONTENT

# rc4.197 post-merge source/package authority — v244 [HISTORICAL/SUPERSEDED]
> **Draft candidate:** `v11.8.0-rc4.198` on PR #156 repairs weekly projection chronology, production-shaped broad ECR freshness/aliases, and bounded game-context diagnostics. It is not deployed or device-accepted; canonical main remains rc4.197 and production/device authority remains rc4.196.

Handoff generation: `20260912T0545Z-v244`

Canonical main was dynamically verified at `a2d3b4395d207ce54ccf90d2e028300ba35d40d1`. `v11.8.0-rc4.197` is the current source/main authority and has a verified **17-file source-byte/re-extraction parity** package with status `PACKAGED_ONLY_NOT_DEPLOYED`. Archive SHA values are observations scoped to one run/environment and MUST NOT be treated as cross-environment archive-byte identity.

Production and device authority remain `v11.8.0-rc4.196` at exact deployed commit `082d77003f6616e290146698641aebe63f37b8c2`, deployment `da039536-7733-4b07-8f0c-70cc6e0bc8b7`, with verdict `RC4.196_PHYSICAL_PARTIAL_PASS_NOT_ACCEPTED`. `v11.8.0-rc4.195` remains the prior fully accepted rollback reference. No rc4.197 deployment or device evidence is claimed.

Current gate: `VERIFY_CANONICAL_AUTHORITY_THEN_AUTHORIZED_WORK`. No runtime/product behavior changed. No deployment, cache clear/reinstall, or Sleeper transaction is authorized by this checkpoint.

AUTO queue takeover remains fail-closed. No device-side trial-and-error. Never send status/progress/acknowledgement messages during AUTO. Empty assistant response after tool work is forbidden.

## HISTORICAL/SUPERSEDED v243 CONTENT

# Draft Companion – Final Draft Edition 2026 · v11.8.0-rc4.196
## rc4.196 current production / physical partial authority

> **Draft candidate:** `v11.8.0-rc4.197` repairs Start/Sit projection-lane independence on PR #152. It is not deployed or device-accepted; the rc4.196 production authority below remains unchanged.

# rc4.196 physical-partial authority — v243
Handoff generation: `20260911T1735Z-v243`

Canonical main was dynamically verified at `082d77003f6616e290146698641aebe63f37b8c2`. rc4.196 is source-merged and its Cloudflare Production deployment is **VERIFIED SUCCESS** for that exact commit (deployment `da039536-7733-4b07-8f0c-70cc6e0bc8b7`). This proves deployment identity, not arbitrary byte parity or full device acceptance.

The installed Android/PWA showed `v11.8.0-rc4.196` without cache clearing or reinstall. Canonical verdict: `RC4.196_PHYSICAL_PARTIAL_PASS_NOT_ACCEPTED`. Preserved physical lanes: Sleeper Live `<1 Min.`, W1 projection refresh with an observed 728 records, fail-closed Waiver/FA, D/ST streaming, K-only comparison, Trade Board v8 with Boone/Yahoo 263/264 and HOLD, Watcher PASS, and separate Reserve/IR. Blockers: weekly ranks and selected PITTI panel unavailable; Start/Sit cards did not consume/display valid projections independently; game/opponent/weather/lock context unavailable; 14 realistic skill players lacked complete Rank+Projection evidence. Full rc4.196 acceptance is forbidden until a later fixed build passes a new canary.

rc4.195 is the prior fully accepted historical/rollback reference, **not current production**. rc4.196 package identity remains 17 files, `sha256:a654422c907e3127335c20df1956fc974442c3eb3be011a5d8eb1e9b71f4500d`, and is distinct from source, deployment, byte parity, and device acceptance. Current gate: `VERIFY_CANONICAL_AUTHORITY_THEN_AUTHORIZED_WORK`. Runtime/product behavior is unchanged by this checkpoint.

## HISTORICAL/SUPERSEDED README CONTENT
> **Current authority:** v11.8.0-rc4.195 is production/device accepted for its released Waiver/Trade/Weekly-Evidence scope. v11.8.0-rc4.196 Start/Sit / Weekly Context source is merged through PR #143; it is not deployed or physically accepted, and deployment parity is UNKNOWN_REQUIRES_REVERIFICATION.
> **Season mode:** current Sleeper league state is Source of Truth; completed draft roster is immutable historical evidence only.
> **HISTORICAL rc4.158 bounded change:** adds a draft-day v4 expert baseline/delta workflow. Unchanged or failed/incomplete refreshes restore the prior verified baseline; panel rebuild can run cache-only and occurs only for baseline creation/repair or a real ranking delta.
> **HISTORICAL rc4.158 scope:** expert membership, weights, panel ranks semantics, tiers, Coach, Return-v2, manager logic, history and fingerprints are unchanged.
> **Draft locks:** exact canonical manager order/history; no K/DST; exactly one QB; Geno Smith and Aaron Rodgers hard excluded; starter maxima are not roster caps.

Built/source/package/deployment/device-observed/device-accepted are distinct states. Canonical main contains v11.8.0-rc4.196 source merged through PR #143; the observed merge commit is historical evidence only. v11.8.0-rc4.195 remains the current production/device authority. rc4.196 is not deployed or physically accepted, and its deployment parity is UNKNOWN_REQUIRES_REVERIFICATION. The rc4.196 local package remains PACKAGED_ONLY_NOT_DEPLOYED with 17 files and SHA-256 `a654422c907e3127335c20df1956fc974442c3eb3be011a5d8eb1e9b71f4500d`. Current checkpoint gate: `VERIFY_CANONICAL_AUTHORITY_THEN_AUTHORIZED_WORK`.

Promotion-stable checkpoint gate: `VERIFY_CANONICAL_AUTHORITY_THEN_AUTHORIZED_WORK`. Historical compatibility tokens retained for checkpoint validation: rc4.190, rc4.188, `UNKNOWN_REQUIRES_REVERIFICATION`, `MERGED/HISTORICAL`.

Historical release-contract baseline canary retained for regression tooling: `v11.8.0-rc4.64`.

## rc4.195 season evidence and FAAB convention

- The app automatically requests the current Justin Boone/Yahoo weekly ROS trade-value charts through the Cloudflare Worker. QB uses the published `1QB` column; RB/WR/TE use `HALF`. Publication/update timestamps, source URL, provider/author, weekly edition, mapping method, verification time and expiry are retained on every `trade_value` record. Missing, stale, malformed, ambiguous or partial-position evidence publishes no actionable snapshot.
- FAAB recommendation percentages always mean **percent of the league's original FAAB budget**. Displayed absolute units use that same original-budget basis and are capped at the manager's actual remaining FAAB. Historical transaction bids remain comparable because Sleeper records them in absolute units against the same original league budget.

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

## v11.8.0-rc4.196 Start/Sit / Weekly Context — source merged, production pending

The source merged through PR #143 adds current-week Half-PPR ECR evidence, global legal-slot Start/Sit optimization, and provenance-preserving NFL game context. rc4.195 remains the production/device-accepted authority; rc4.196 is not deployed or physically accepted.
