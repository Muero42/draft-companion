# PITTI HANDOFF CURRENT — v213
Handoff generation: `20260831T1028Z-v213`

## Current authority
- **Android/PWA accepted and observed:** v11.8.0-rc4.152.
- **Source + deployed candidate:** v11.8.0-rc4.153.
- rc4.153 is merged on main and deployed to gh-pages with exact runtime parity for app.js, index.html, manifest.webmanifest and sw.js.
- PR #83 head passed Release Contract, Candidate Package Gate and Project Guardrails before merge.
- **No model change in rc4.153.** It is presentation-only.

## Exact next gate
**RC4.153_DEVICE_ACCEPTANCE_THEN_DRAFT_FREEZE**

One controlled phone refresh/update only. Confirm:
1. version rc4.153;
2. player-card expert order is stable across positions;
3. common v4 experts appear first in this order: **Sean Koerner → Dalton Del Don → Pat Fitzmaurice**;
4. remaining shared experts follow, then position specialists;
5. missing player ranks remain `#– / fehlt`, never substituted.

If PASS: freeze the runtime for the real draft. Do not reopen tiers, Return-v2, panel weights/sources, manager history or scoring without a new proven release-critical defect. No cache clear, app-data clear or reinstall.

## What is already working on rc4.152 and must not regress
- LIVE page nine-manager vertical quick-control grid.
- Manual/AUTO/unknown state can be changed for opponents and applied directly to the Coach at the current pick; earlier picks remain unchanged.
- LIVE v3/v4/v5 selector is available; v4 PRIMARY, v5 CHALLENGER, v3 failsafe.
- Faster LIVE analysis path.
- Global cross-position v4 tiers visible.
- Current individual player descriptions visible, including the previously missing Montgomery/Warren coverage.
- Tier display is context only and does not feed Coach/Return/history.
- Latest backup adopted: `draft-companion-v7-backup-2026-08-31T09-21-02-891Z.json`. Its Return audit does not justify a generic pre-draft Return-v2 retune.

## rc4.153 expert display order
Global display priority:
1. Sean Koerner
2. Dalton Del Don
3. Pat Fitzmaurice
4. Nick Mariano
5. Justin Boone
6. Todd D Clark
7. Ryan Weisse
8. Kev Wheeler
9. Wolf of Roto Street

Only experts actually belonging to the analyzed position panel are shown. This ordering is visual only; panel membership and weights remain untouched.

## Immutable draft locks
- Exact order: **1 Michael · 2 Pascal Voerde · 3 Marc Düsseldorf · 4 Thomas · 5 Björn · 6 Pascal Gelderner · 7 Giuliano · 8 Bastian · 9 Muerotechnik · 10 Dutch Marc.**
- Never shift/reindex historical picks, manager ownership, decision evidence or snapshot fingerprints.
- Michael history includes 2020–2025.
- Pascal Voerde = Bracht Eagles 2017–2022 + Voerde Eagles 2023–2025; Pascal Gelderner is separate.
- Björn 2021/2023 exclusions remain.
- Starter maxima 4 WR / 3 RB / 2 TE are not roster/draft caps.
- No K/DST draft.
- Exactly one QB; no QB2.
- Geno Smith and Aaron Rodgers are hard exclusions.
- v4 PRIMARY / v5 CHALLENGER / v3 failsafe.
- Panel is player-quality baseline; Return is timing context, never an automatic pick command.
- Manager AUTO/MANUELL state is forward-looking live evidence; changing it must not rewrite earlier pick history.
- Tiers remain display-only.
- Preserve Josh Jacobs acute-status handling and current description coverage.

## Draft-day continuation after device PASS
Freeze the runtime and use the execution-only real-draft workflow. High-value remaining non-runtime work is final pre-draft transaction/waiver/depth-chart/news freshness and live decision support. Do not spend draft-day time on another v4/v5 mock comparison.

`PITTI AUTO` / `AUTO BLOCK` means autonomous execution with no empty progress replies. `STATUS` reports state only and does not start work.
