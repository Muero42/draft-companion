# PITTI active-manager identity/history audit — v205 — 2026-08-30

> HISTORICAL/SUPERSEDED operational checkpoint: runtime, device, deployment, release/activation gates and CURRENT/OVERRIDE instructions below describe the original dated context only. They must not be executed as current work or override ../PITTI_CURRENT_STATE.json and ../NEW_CHAT_HANDOFF_CURRENT.md. Research evidence and durable invariants remain as provenance, subject to later explicit corrections.

## Canonical 2026 draft order — HARD LOCK
Source of truth is the user-confirmed corrected authority, not older chat memory, stale localStorage, or rc4.84-era text:

1. Michael
2. Pascal Voerde
3. Marc Düsseldorf
4. Thomas
5. Björn
6. Pascal Gelderner
7. Giuliano
8. Bastian
9. Muerotechnik / user
10. Dutch Marc

Forbidden stale mappings: slot5=Bastian, slot6=Björn, slot7=Michael K, slot8=Pascal Gelderner, user=Moers Venom. There is no Michael K identity. Giuliano is a distinct manager.

## Historical corpus authority
Canonical raw source: Library `draft_picks_2017_2025.csv`, 1,374 picks. Historical league-size regimes must remain year-specific: 2017-2019=8 teams, 2020-2022=10, 2023-2024=12, 2025=10. Person-season identity is the join key; never pool raw overall pick numbers across regimes without round/roster conditioning.

Known exclusions:
- Björn 2021 = deliberate all-rookie theme, exclude from ordinary preference learning.
- Björn 2023 = confirmed NFL.com autodraft, exclude from ordinary human-preference learning.
- Historical Kai autodraft sequences are machine evidence only and never active-manager preference evidence.
- 2025 had no autodrafter; Michael_Polk 2025 must remain human history.

## Deep-audit finding — two stale historical profiles still exist in rc4.131 source
The runtime's detailed `MANAGER_PROFILE_DATA` is the object actually consumed by `managerHistoryPosMult()`. It currently contains:
- Michael: 2020-2024 only (5 seasons), incorrectly omitting canonical Michael_Polk 2025.
- Pascal Voerde: 2023-2025 only (3 seasons), incorrectly omitting legacy Pascal_Bracht/Bracht Eagles 2017-2022 despite the confirmed identity chain.

This means the earlier documentation-only Pascal correction did NOT fully repair the live opponent model. This must be corrected in rc4.132 and locked by deterministic regression.

## Reconstructed exact profiles from canonical CSV
Method reproduces the existing generator exactly: season recency decay 0.72; per-position taken rate, recency-weighted taken rate, first-round mean/SD, final count; phase shares weighted by season and pick count.

### Michael_Polk — corrected 6-season profile
Years: 2020, 2021, 2022, 2023, 2024, 2025. No exclusions.
Phase shares:
- early: QB .0000 / RB .4709 / WR .5291 / TE .0000 / K .0000 / DEF .0000
- mid1: QB .1063 / RB .4345 / WR .3297 / TE .1294 / K .0000 / DEF .0000
- mid2: QB .0781 / RB .2532 / WR .6688 / TE .0000 / K .0000 / DEF .0000
- late: QB .1489 / RB .1699 / WR .4773 / TE .2039 / K .0000 / DEF .0000
- end: QB .0564 / RB .1777 / WR .3505 / TE .0460 / K .1154 / DEF .2541
Position summaries:
- QB final 1.18; first round 8.13; SD 2.75; taken 1.000; recent 1.000
- RB final 4.57; first 1.65; SD .69; taken/recent 1.000
- WR final 7.16; first 1.80; SD .90; taken/recent 1.000
- TE final 1.15; first 7.90; SD 3.01; taken/recent 1.000
- K final .38; first 15.00; SD 0; taken .500; recent .377
- DEF final .83; first 15.33; SD .47; taken .833; recent .831

### Pascal Voerde — corrected identity-chain profile
Confirmed chain: Pascal_Bracht/Bracht Eagles 2017-2022 + Pascal_Voerde/Voerde Eagles 2023-2025 = 9 canonical person-seasons. This supersedes the stale 3-season detailed profile and also exposes the old summary wording "8 seasons" as stale counting. No season is currently authorized for exclusion.
Years: 2017-2025 inclusive.
Phase shares:
- early: QB .1246 / RB .4201 / WR .3333 / TE .1219 / K .0000 / DEF .0000
- mid1: QB .1758 / RB .2900 / WR .3662 / TE .1680 / K .0000 / DEF .0000
- mid2: QB .0367 / RB .1855 / WR .5291 / TE .1511 / K .0137 / DEF .0838
- late: QB .1417 / RB .1097 / WR .1174 / TE .1495 / K .2251 / DEF .2566
- end: QB .1120 / RB .1563 / WR .5488 / TE .0892 / K .0849 / DEF .0089
Position summaries:
- QB final 1.81; first 4.77; SD 2.16; taken/recent 1.000
- RB final 3.54; first 1.51; SD .50; taken/recent 1.000
- WR final 5.87; first 1.60; SD .68; taken/recent 1.000
- TE final 2.07; first 4.88; SD 1.88; taken/recent 1.000
- K final 1.00; first 12.41; SD 1.16; taken/recent 1.000
- DEF final 1.05; first 10.16; SD 1.19; taken/recent 1.000

## Active-manager cross-check
Other detailed runtime histories match the canonical source/exclusion policy at the year-set level:
- Pascal Gelderner: 2023-2025 = 3
- Marc Düsseldorf: 2021, 2022, 2024, 2025 = 4
- Dutch Marc: 2017-2025 = 9
- Thomas: 2023-2025 = 3
- Björn: 2017,18,19,20,22,24,25 = 7 after 2021/2023 exclusions
- Giuliano: 2018,19,20,21,23,24,25 = 7
- Bastian: 2017-2025 = 9

## rc4.132 mandatory anti-regression
- Hard-assert exact 2026 slot map above in live AND 2026 mock.
- Restore/backup/localStorage manager-map migration must canonicalize stale rc4.84 mappings.
- Hard-assert no "Michael K" and no "Moers Venom".
- Hard-assert Michael historical years = 2020-2025 (6).
- Hard-assert Pascal Voerde combines Pascal_Bracht 2017-2022 + Pascal_Voerde 2023-2025 (9); never reuse Pascal Gelderner's 3-season profile.
- Hard-assert Björn 2021/2023 exclusions remain.
- Manager history changes may affect Return-v2 opponent demand only; they must not alter player-quality panel ranks directly.
