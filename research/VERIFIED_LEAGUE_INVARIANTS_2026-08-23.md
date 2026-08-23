# PITTI verified league invariants — 2026-08-23

Purpose: eliminate silent reconstruction/interpretation errors from all strategy simulation. These are hard preconditions for primary PITTI runs.

## Authority rule
Use verified project/runtime data before chat recollection or web inference. For screenshots: if a relevant field is not clearly legible, mark it unreadable and request a tighter crop when user interaction is unavoidable. Never plausibly reconstruct an unreadable name/value.

Authority order for league facts:
1. current verified league/runtime snapshot or clearly legible current league screenshot;
2. canonical PITTI checkpoint containing previously verified facts;
3. verified application artifact/code;
4. other evidence only when no verified league fact exists.

A contradiction in a material invariant is FAIL-CLOSED: no primary strategy result may be emitted until resolved.

## Verified NFL Elite structure
- 10 teams.
- User/Muero is draft slot 9 (Muerotechnik in current NFL Elite screen).
- Slot 10 is Dutch High Flyers / @Gipfelstuermer.
- Snake geometry therefore makes the first turn: user pick 9 -> Dutch pick 10 -> Dutch pick 11 -> user pick 12.
- Dutch's picks 10 and 11 are two decisions by the SAME manager. Pick 11 must be conditional on Dutch's pick 10 / resulting roster, not sampled as an independent manager.
- User snake picks: 9,12,29,32,49,52,69,72,89,92,109,112,129,132,149.
- 15 draft rounds.
- Current league roster screenshot verifies: 1 QB, 1 RB, 2 WR, 1 TE, 1 FLEX (W/R/T), 1 FLEX (W/R), 1 K, 1 DEF, 6 BN, 1 IR.

## Verified manager order from current NFL Elite screenshot
1. Niederrhein Tractors — @GringoWhiteman82
2. Voerde Eagles — @Pascal1109
3. Düsseldorfer Sentinels — @marcw90
4. Tönisvorst Dripping Blues — @ThomasToevo
5. Rumeln Fireflies — @Schumi1705
6. Team GeldernerGoofys — @GeldernerGoofys
7. Italian Warriors — @GiulianoVe
8. Oeding Bears — @RhenishBear
9. Muerotechnik — @Muero
10. Dutch High Flyers — @Gipfelstuermer

## Cross-check against current app artifact
Current branch app.js already hard-codes LIVE_DRAFT_ID_2026 = 1366053132970233856 and validateCanonicalLiveDraft requires season 2026, teams 10, rounds 15, slot 9. Its ACTIVE_2026_MANAGER_MAP_TEXT maps slot 10 to `Dutch Marc`. These are compatible with the verified geometry above, but the display/team names in this file are taken from the clearer current NFL Elite screenshot.

## Mandatory simulation assertions
Before every PRIMARY strategy/counterfactual run, assert:
- teams == 10
- rounds == 15
- userSlot == 9
- user picks begin [9,12,29,32]
- manager at pick 10 == manager at pick 11 == Dutch High Flyers / slot 10
- pick 11 decision receives Dutch roster state after pick 10
- board at user pick 12 is the board AFTER both Dutch selections
- FALLER/VALUE candidates ranked/valued above pick 12 remain eligible at pick 12 if actually available
- candidate admission obeys MARKET_REALITY_GATE_2026-08-23.md
- CONTROL/MAJOR REACH branches cannot enter primary aggregates/recommendations

Any assertion failure invalidates the run and its strategy output.

## Quarantine rule for prior research
Do not treat recent simulation output as strategy evidence unless its run can demonstrate these invariants. Preserve research artifacts for diagnostic value; quarantine unverifiable runs from primary strategy aggregation.

Already independently invalid/rejected mechanisms remain invalid per PITTI_HANDOFF_CURRENT_OVERRIDE_2026-08-23.md: original recursive turn-pair probe, Rolling-v1, Joint-v1 z-score aggregation, PairSum-v2 LONG2. The broad 375-branch direct 2.02 research remains research-only until Reality-Gate reclassification and invariant verification.

## Next execution target
Do not invent another optimizer. Build/verify a small fail-closed reality harness first, then generate realistic board states at pick 9, choose a realistic user 1.09 candidate, simulate Dutch's roster-dependent 10/11 turn, expose the actual remaining board at pick 12 including fallers, and compare realistic 9+12 pairs. Once this passes deterministic fixtures, scale to many complete mocks and then 29/32.