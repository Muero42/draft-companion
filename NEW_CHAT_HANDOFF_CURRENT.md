# PITTI HANDOFF CURRENT — v212
Handoff generation: `20260831T0735Z-v212`

## Device/runtime truth
- **Android already runs v11.8.0-rc4.142.**
- Startup, refresh and Analyze are functional.
- Expert-v4 can be selected and individual expert ranks render.
- Individual-description coverage is **125/125**; Tyler Warren's individual text is restored.
- **External v4 tier labels do not render. Tier functionality is FAIL.**
- Do not reinstall, clear cache/app data, or repeat refresh attempts merely to change version.

## Proven failed hypothesis
rc4.142 removed the incorrect verifier requirement `total_experts == selected-v4-count`. The device result proves this was **not sufficient**. Do not repeat that fix and do not create rc4.143 from another guessed API shape.

## Immediate gate — RC4.142_TIER_PAYLOAD_ROOT_CAUSE
Before any new build, inspect the actual live FantasyPros `consensus-rankings` payload for **QB, RB, WR and TE** through the existing proxy, using the exact FantasyPros-selectable members of each active v4 panel.

Capture and verify:
1. request path and position/scoring/type/week/filter parameters;
2. exact selected expert IDs and provenance returned by FantasyPros;
3. `filters`, expert metadata and `total_experts`;
4. where the player rows actually live;
5. real position field/key/value;
6. real explicit tier field/key/value.

Accept no tier unless the selected expert set is exactly verifiable. Unavailable active-v4 experts are disclosed and never replaced. **Andrew Erickson or any other non-v4 expert must never be substituted.** No synthetic rank-gap tier may masquerade as an external expert tier.

Once the payload-level defect is reproduced: implement **one bounded fix**, add a deterministic regression fixture from the real response shape, run full syntax/runtime/release/package/guardrail checks plus exact main↔gh-pages runtime parity, then perform **exactly one** device verification.

## Active v4 panels
- QB: Todd D Clark, Sean Koerner, Justin Boone, Dalton Del Don, Nick Mariano, Pat Fitzmaurice.
- RB: Ryan Weisse, Kev Wheeler, Dalton Del Don, Nick Mariano, Sean Koerner, Pat Fitzmaurice.
- WR: Sean Koerner, Justin Boone, Todd D Clark, Pat Fitzmaurice, Nick Mariano, Dalton Del Don.
- TE: Pat Fitzmaurice, Ryan Weisse, Sean Koerner, Justin Boone, Dalton Del Don, Wolf of Roto Street.

## Immutable draft invariants
- Exact order: **1 Michael · 2 Pascal Voerde · 3 Marc Düsseldorf · 4 Thomas · 5 Björn · 6 Pascal Gelderner · 7 Giuliano · 8 Bastian · 9 Muerotechnik · 10 Dutch Marc.**
- Never shift/reindex historical picks, manager ownership, decision evidence or snapshot fingerprints.
- Michael history includes 2020–2025.
- Pascal Voerde = Bracht Eagles 2017–2022 + Voerde Eagles 2023–2025; Pascal Gelderner remains separate.
- Björn 2021/2023 exclusions remain.
- Starter maxima 4 WR / 3 RB / 2 TE are not roster/draft caps.
- No K/DST draft.
- Exactly one QB; no QB2.
- Geno Smith and Aaron Rodgers are explicit user hard exclusions.
- Panel is baseline; Return is timing context, not a pick command.
- Tier is display-only and may not alter Coach, Return-v2, opponent/roster logic, history or fingerprints.
- Preserve Josh Jacobs acute-status behavior and all working 125/125 individual-text coverage.
- v4 PRIMARY / v5 CHALLENGER / v3 failsafe.
- Latest paired evidence remains 29/30; pick29 expertv5 is missing. Do not call it 30/30.

## Remaining pre-draft agenda after tier acceptance
1. Deferred WR comparison: Emeka Egbuka, Zay Flowers, Tetairoa McMillan, DeVonta Smith; Jaylen Waddle reference. Compare baseline, role/injury, market and reliable v4-only tier context; rank pure upside/league-winner ceiling separately.
2. Final transaction/IR/PUP/waiver/depth-chart freshness pass; official status overrides stale Sleeper metadata.
3. Fresh expert-board + Sleeper Half-PPR ADP delta check.
4. Final late-RB/upside materiality and operational smoke checks.
5. Operational freeze before the real draft; execution-only draft chat.

`PITTI AUTO` / `AUTO BLOCK` means real autonomous execution, not a status/promise reply.
