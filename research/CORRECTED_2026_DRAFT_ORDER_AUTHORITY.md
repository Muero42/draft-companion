# Corrected real 2026 manager identity/order authority — 2026-08-29

This supersedes the erroneous rc4.84 "manager-slot correction" and any later handoff text that inherited it.

## Actual draft order (user-confirmed latest corrections)
1. Michael
2. Pascal Voerde
3. Marc Düsseldorf
4. Thomas
5. Björn
6. Pascal Gelderner
7. Giuliano
8. Bastian
9. User — team name **Muerotechnik**
10. Dutch Marc

Critical corrections:
- There is no "Michael K." in the league. Slot 7 is Giuliano, a distinct manager with his own historical profile.
- Bastian is slot 8, not slot 5.
- User's team is Muerotechnik, not "Moers Venom".
- The pre-rc4.84 app mapping had the correct slot geometry for 5–8: Björn / Pascal Gelderner / Giuliano / Basti. rc4.84 incorrectly changed it to Basti / Björn / Giuliano / Pascal Gelderner.
- Historical note only: rc4.106 inherited the rc4.84 wrong mapping. Current accepted Android authority is rc4.131; the v203 main/gh-pages delta is unreleased until rc4.132. rc4.132 must hard-assert the exact canonical order and migrate stale localStorage/backup mappings.

## Identity anchors / history mapping
- Pascal Voerde = one continuous identity chain: **Pascal_Bracht/Bracht Eagles 2017-2022 + Pascal_Voerde/Voerde Eagles 2023-2025 = 9 canonical seasons**. Never truncate this to the separate Pascal Gelderner 2023-2025 profile.
- Pascal Gelderner = profile identity Pascal_Gelderner, history sample 2023–2025 (3 seasons). Distinguish as "Pascal Gelderner".
- Marc Düsseldorf = profile identity Marc_Duesseldorf, history sample 2021, 2022, 2024, 2025 (4 seasons). Distinguish as "Marc Düsseldorf".
- Dutch Marc = profile identity Marc_Dutch, history sample 2017–2025 (9 seasons). Distinguish as "Dutch Marc".
- Giuliano = profile identity Giuliano, history sample 2018, 2019, 2020, 2021, 2023, 2024, 2025 (7 seasons). Never alias to Michael.
- Bastian = historical profile identity Bastian / runtime label Basti. Slot 8.

## Regression requirement
Any runtime/handoff/test claiming slot5=Bastian, slot6=Björn, slot7=Michael K/Giuliano alias, slot8=Pascal Gelderner, or user team=Moers Venom is stale/invalid.
Required 2026 live/mock map: 1 Michael, 2 Pascal Voerde, 3 Marc Düsseldorf, 4 Thomas, 5 Björn, 6 Pascal Gelderner, 7 Giuliano, 8 Bastian, 9 Muerotechnik/user, 10 Dutch Marc.


## Identity-history correction lock
- The earlier takeover note saying Pascal Voerde had only 2023–2025 / 3 seasons was wrong and is superseded.
- **Do not truncate Pascal Voerde to the Pascal Gelderner sample.** Pascal Gelderner is the separate 3-season 2023–2025 profile.
- The old `history.years=8` wording is stale. v205 raw-corpus re-audit established **9 canonical person-seasons, 2017-2025 inclusive**. rc4.132 must rebuild the detailed runtime profile from that complete chain and regression-lock it.
- Legacy aliases/team names Bracht Eagles and Voerde Eagles belong to Pascal Voerde's identity chain and must not create separate managers.

## v206 anti-regression clarification
- This file is no longer allowed to carry the stale "8 seasons" Pascal-Voerde count.
- Canonical count is **9 seasons (2017-2025)**, with no currently authorized season exclusion.
- User draft hard-QB exclusions are separate from manager identity/order authority: Geno Smith and Aaron Rodgers must never be recommended/drafted for the user, while generic engine ranking remains name-agnostic.
