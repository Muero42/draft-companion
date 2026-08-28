# PITTI NEW CHAT BOOTSTRAP — FAIL-CLOSED

When the user writes **PITTI AUTO**, load and verify in this order:
1. `PITTI_COMMAND_CONTRACTS.json`
2. `PITTI_CURRENT_STATE.json`
3. `PITTI_HANDOFF_SEAL.json`
4. `PITTI_EXECUTION_LOCK.json`
5. `PITTI_AUTO_PREFLIGHT.md`
6. `PITTI_PROJECT_STATE.md` to EOF
7. `NEW_CHAT_HANDOFF_CURRENT.md`
8. this file
9. `HANDOFF_COMPLETENESS_MATRIX.md`
10. actual repo/runtime/device evidence

Fail closed unless CURRENT/SEAL/HANDOFF generation is `20260828T155300Z-v152`, seal is PASS with handoff_ready and second_pass_pass, and seal-listed blob hashes match.

## Current boundary
- rc4.96 source/package/deployment/Android authority.
- Five primary CI gates PASS; 13-file package/re-extract PASS; 13/13 main-pages parity PASS.
- Complete recommendation-following Android mock 1399085353452761088 supplies 15/15 exact rc4.96 fixtures.
- Runtime/decision kernel is frozen.
- Current gate: `RC496_PRE_DRAFT_FREEZE_FRESHNESS_ONLY`.

## Takeover rules
- Do not start another mock automatically.
- Do not retune Return-v2 from one OOS mock.
- Do not resurrect PairSum/Rolling to solve turn ordering.
- WAIT is timing, not automatic TAKE; evaluate turn portfolio in the ChatGPT decision layer.
- Preserve sparse-panel guard, QUESTIONABLE neutrality, Expert-v3, Return tau 4.25, soft WR saturation, no named QB forcing, no K/DST path.
- Only pre-draft freshness/data/failsafe work remains unless new material evidence appears.
- Library mirror may be stale; newest verified repo/device facts win.

AUTO must execute long blocks and re-inventory after each package; blocked lanes block only themselves.

- production/control: preserve verified rc4.96 authority while rc4.97 is challenger only.
- Android version authority: preserve verified rc4.96 authority while rc4.97 is challenger only.
- latest package/re-extract: preserve verified rc4.96 authority while rc4.97 is challenger only.
- work package -> checkpoint -> re-inventory: preserve verified rc4.96 authority while rc4.97 is challenger only.
- user must never need to remind: preserve verified rc4.96 authority while rc4.97 is challenger only.