# WR-v2 decision-surface qualification — 2026-08-26

Status: **PANEL-ISOLATION GATE PASS / SHADOW TEST-READY, NOT PRODUCTION**

Kernel pin: `9ba6db89fc1e7550052a7526bd0c68d6cc7459dc` (rc4.64 decision kernel)

Return harness: Actions run `32982121037`, job `98221061142`.

## Preconditions / parity

- Only the WR ranking surface changes. QB/RB/TE stay incumbent rc4.64.
- Frozen natural fixture states are unchanged.
- Exact resolved Return-v2 parity on the control arm remains closed: **224 predictions = 215 Return-v2 + 9 production fallbacks, MAE 0, max error 0**.
- No player-name forcing, WR cap/quota, generic Return-v2 retune, QB2/TE2 ban, or rejected full-panel resurrection is used.

## Decision-kernel reconstruction

The rc4.64 scoring/safety surface was reconstructed from the pinned `app.js` and checked against the frozen natural fixtures. Relevant control leaders/scores reproduce the stored fixture surface essentially exactly (including the known pick-92 rc4.63→rc4.64 provenance boundary). The replay includes:

- selected-panel quality score;
- ADP/value and phase-aware reach scaling;
- roster need, redundancy and progressive-upside terms;
- positional-alternative context;
- resolved Return-v2 + top-12 median urgency adjustment;
- player-quality safety gate;
- normalized Coach score.

The compact WR-v2 exact input contains exact treatment ranks but not the treatment panel's `sd/n` agreement metadata. This is not hidden as certainty: WR agreement contributes only one bounded raw-score term (`-3`, `0`, or `+1.5`). The decision replay therefore swept the full admissible WR agreement range, including targeted adversarial cases where one WR receives +1.5 and competing WRs -3 and vice versa.

## Natural late-state result

| Pick | Roster before pick | rc4.64 control | WR-v2 treatment across full agreement sensitivity | Assessment |
|---:|---|---|---|---|
| 69 | QB0/RB2/WR4/TE0 | Parker Washington | Parker Washington **or** Tucker Kraft | bounded ambiguity; both are viable and no positional regression |
| 72 | QB0/RB2/WR4/TE1 | Parker Washington | Parker Washington | robust |
| 89 | QB0/RB2/WR5/TE1 | Justin Herbert | Justin Herbert | robust control preserved |
| 92 | QB1/RB2/WR5/TE1 | current-kernel safety resolves toward Blake Corum | Blake Corum | robust; full-v2 WR/QB contamination removed |
| 109 | QB1/RB3/WR5/TE1 | Stefon Diggs | **Kenny Gainwell** | robust; reduces WR accumulation |
| 112 | QB1/RB3/WR6/TE1 | Stefon Diggs | **Rachaad White** | robust; removes WR7 recommendation |
| 129 | QB1/RB4/WR6/TE1 | Jalen Coker | **Xavier Worthy** | robust WR7 remains; shared B-axis safety/roster-utility issue, not a WR-v2-only regression |
| 132 | QB1/RB5/WR6/TE1 | Jalen Coker | **Mike Washington** | robust; removes WR7 recommendation |
| 149 | QB1/RB6/WR6/TE1 | Jalen Coker | **Mike Washington** | robust; removes WR7 and no QB2 regression |

At picks 72/89/92/109/112/129/132/149, no admissible WR agreement assignment changed the treatment leader. Only pick 69 is agreement-sensitive, and its two possible leaders are Parker Washington and Tucker Kraft; this is not sufficient evidence to reject the WR board.

## Important shared B-axis finding

Pick 129 exposes a separate rc4.64 decision-surface issue. With six WR already rostered, the natural raw-score winner can be an RB, but the player-quality safety gate may re-promote a WR because the safety gate is panel-quality-first and does not currently distinguish deep-WR redundancy the way it already protects against ordinary repeated QB/TE.

This explains why merely changing experts cannot guarantee elimination of the previously observed WR7 behavior. The correct follow-up is a **general roster-aware safety/utility audit**, not panel manipulation and not a hard WR cap. Exceptional value slides must remain legal.

## Promotion decision

The isolated WR-v2 board **passes the panel-isolation research gate** because it preserves the key controls, removes the full-v2 QB2 failure, and produces repeated favorable late-roster changes without introducing a new material natural-control regression. It is **not production-certified** because:

1. pick 129 confirms a shared B-axis WR-redundancy/safety interaction still needs qualification;
2. the exact WR-v2 `sd/n` source-agreement metadata is not materialized, although full bounded sensitivity shows this does not affect the gate conclusion except the defensible 69 Parker/Tucker ambiguity;
3. Android/runtime testing has not yet occurred.

Next authorized product step: build WR-v2 only as an **additional selectable SHADOW configuration** while keeping rc4.64 unchanged/default/selectable. Run regression + mock validation before any production promotion. In parallel, qualify the general roster-aware player-quality-safety interaction using both control and WR-v2 arms.
