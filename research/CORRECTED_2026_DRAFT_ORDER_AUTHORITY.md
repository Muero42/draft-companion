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
- Current rc4.106 main still inherits that rc4.84 wrong mapping and therefore must be repaired through regression/release gates before the real draft.

## Identity anchors / history mapping
- Pascal Voerde = profile identity Pascal_Voerde, history sample 2023–2025 (3 seasons). Distinguish as "Pascal Voerde".
- Pascal Gelderner = profile identity Pascal_Gelderner, history sample 2023–2025 (3 seasons). Distinguish as "Pascal Gelderner".
- Marc Düsseldorf = profile identity Marc_Duesseldorf, history sample 2021, 2022, 2024, 2025 (4 seasons). Distinguish as "Marc Düsseldorf".
- Dutch Marc = profile identity Marc_Dutch, history sample 2017–2025 (9 seasons). Distinguish as "Dutch Marc".
- Giuliano = profile identity Giuliano, history sample 2018, 2019, 2020, 2021, 2023, 2024, 2025 (7 seasons). Never alias to Michael.
- Bastian = historical profile identity Bastian / runtime label Basti. Slot 8.

## Regression requirement
Any runtime/handoff/test claiming slot5=Bastian, slot6=Björn, slot7=Michael K/Giuliano alias, slot8=Pascal Gelderner, or user team=Moers Venom is stale/invalid.
Required 2026 live/mock map: 1 Michael, 2 Pascal Voerde, 3 Marc Düsseldorf, 4 Thomas, 5 Björn, 6 Pascal Gelderner, 7 Giuliano, 8 Bastian, 9 Muerotechnik/user, 10 Dutch Marc.
