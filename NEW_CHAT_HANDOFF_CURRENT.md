# PITTI HANDOFF CURRENT — v214
Handoff generation: `20260831T1028Z-v214`

## Current authority
- **Android/PWA accepted and observed:** v11.8.0-rc4.152.
- **Source + deployed candidate:** v11.8.0-rc4.153.
- rc4.153 is merged on `main`, deployed to `gh-pages`, and **all 13 runtime files are byte-identical main↔gh-pages**.
- PR #83 head passed **Release Contract, Candidate Package Gate and Project Guardrails**.
- rc4.153 is **presentation-only**: no panel membership/weights, tiers, Coach, Return-v2, manager logic, history or fingerprints changed.

## Exact next gate
**RC4.153_DEVICE_ACCEPTANCE_THEN_DRAFT_FREEZE**

One controlled phone refresh/update only. Confirm:
1. version = **v11.8.0-rc4.153**;
2. player-card expert order is stable across positions;
3. common v4 experts appear first: **Sean Koerner → Dalton Del Don → Pat Fitzmaurice**;
4. remaining broadly shared experts follow, then position specialists;
5. missing ranks remain `#– / fehlt`; never substitute another expert.

If PASS: **freeze the runtime for the real draft**. Do not reopen tiers, Return-v2, panel weights/sources, scoring, manager history, draft order or historical evidence unless a new release-critical defect is proven.

## What is already working on rc4.152 and must not regress
- LIVE nine-manager vertical control grid with `? / AUTO / MANUELL`.
- One button applies changed manager modes from the freshly resolved current pick and immediately recalculates Coach; earlier picks remain unchanged.
- LIVE v3/v4/v5 selector is available immediately above Analyze; **v4 PRIMARY / v5 CHALLENGER / v3 failsafe**.
- Faster LIVE path: 300 Return-v2 runs; balanced shadow pass skipped; Decision Fixtures + Return Validation still persist.
- Global cross-position v4 tiers visible.
- Current individual player descriptions visible, including David Montgomery and Tyler Warren.
- Tier display is context only and does not feed Coach/Return/history.
- Latest evidence backup: `draft-companion-v7-backup-2026-08-31T09-21-02-891Z.json` (rc4.150). Audit conclusion: no generic pre-draft Return-v2 retune and no hard WR/RB quotas.

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

Only experts actually belonging to the analyzed position panel are shown. This ordering is visual only.

## Immutable draft locks
- Exact order: **1 Michael · 2 Pascal Voerde · 3 Marc Düsseldorf · 4 Thomas · 5 Björn · 6 Pascal Gelderner · 7 Giuliano · 8 Bastian · 9 Muerotechnik · 10 Dutch Marc.**
- Never shift/reindex historical picks, manager ownership, decision evidence or snapshot fingerprints.
- Michael history includes 2020–2025.
- Pascal Voerde = Bracht Eagles 2017–2022 + Voerde Eagles 2023–2025; Pascal Gelderner is separate.
- Björn 2021/2023 exclusions remain.
- Starter maxima 4 WR / 3 RB / 2 TE are **not** roster/draft caps.
- No K/DST draft.
- Exactly one QB; no QB2.
- Geno Smith and Aaron Rodgers are hard exclusions.
- Panel is player-quality baseline; Return is timing context, never an automatic pick command.
- Manager AUTO/MANUELL state is forward-looking live evidence; changing it must not rewrite earlier history.
- Tiers remain display-only.
- Preserve Josh Jacobs acute-status handling and current description coverage.

## Draft-day continuation after device PASS
Freeze runtime. Then only execution-critical work:
- final transaction/IR/PUP/waiver/depth-chart/news freshness;
- final expert-board + Sleeper Half-PPR ADP delta;
- live decision support.
The deferred Egbuka / Flowers / Tetairoa McMillan / DeVonta Smith + Waddle comparison is optional only if time remains and must not delay draft readiness.

`PITTI AUTO` / `AUTO BLOCK` means autonomous execution without empty progress replies. `STATUS` reports state only and starts no work.
