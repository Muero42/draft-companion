# PITTI NEW CHAT HANDOFF — CURRENT
Handoff generation: `20260828T155300Z-v152`
Updated: 2026-08-28 15:53Z

## Mandatory takeover order
1. Read `PITTI_COMMAND_CONTRACTS.json`.
2. Read `PITTI_CURRENT_STATE.json`.
3. Read `PITTI_HANDOFF_SEAL.json`; require PASS, handoff_ready=true, second_pass_pass=true.
4. Require CURRENT == SEAL == this handoff generation and verify every seal-listed repo blob hash.
5. Read `PITTI_AUTO_PREFLIGHT.md`, `PITTI_EXECUTION_LOCK.json`, and `PITTI_PROJECT_STATE.md` to EOF.
6. Read bootstrap/matrix and verify actual repo/runtime/device facts. Newest verified repo/device facts override stale Library mirrors.

## Current authority — v152
- League: 10-team Half-PPR, 1QB, slot 9; real draft 2026-08-31.
- Frozen draft runtime / Android authority: **v11.8.0-rc4.96**.
- Package/re-extract: rc4.96, 13 runtime files, run 33183057716, artifact 9690504450, SHA-256 18d168661f8fbe2cdbe00d8829531f9c721845efb98fa8c2925c76e7cd21cca0.
- Five primary workflows PASS at 6eafbb297fa999a28dae14375a65544b73a97d7c.
- main ↔ gh-pages exact 13/13 runtime parity PASS at gh-pages 35b68015aa79e8976f3ee9a230be3710be503b32.
- Android/PWA rc4.96 is functionally evidenced by complete mock 1399085353452761088 plus 15 exact rc4.96 decision fixtures.

## Latest OOS recommendation audit
Canonical input: Library backup `draft-companion-v7-backup-2026-08-28T15-39-01-624Z.json`.
- 15/15 own picks are rc4.96 and followedCoach=true.
- Return-v2: 167 resolved predictions; mean Brier 0.080186. Do not globally retune.
- Dobbins sparse-panel failure family: OOS PASS; n=2 now confidence-limited/PANEL-CHECK behavior. No player-name rule.
- 89/92 Lawrence/Corum is a genuine turn-order tension, but isolated and insufficient to revive PairSum/Rolling.
- WR7 Diggs at 109 is not a PlayerQualitySafety resurrection; no hard WR cap.
- WAIT is a timing signal. A WAIT board leader is **not automatically TAKE**; ChatGPT must assess the turn portfolio before the actual pick.
- Current source causal evidence coverage covers 65/84 names seen in this OOS Top-10 corridor; missing-name contexts are cached for live review. Do not build a new runtime merely to hard-code the corridor.

Detailed audit: `research/RC496_RECOMMENDATION_FOLLOWING_MOCK_1399085353452761088_2026-08-28.md`.

## Frozen invariants
- Exactly one user-drafted QB; QB2 excluded from user Coach only after QB1.
- Geno Smith/Aaron Rodgers rank organically; no name blacklist.
- No normal K/DST.
- Starter maxima are not roster caps.
- WR saturation soft; exceptional value legal.
- TE2 exceptional-soft, not global ban.
- No PairSum/Rolling, fixed quotas/caps, blind RB forcing, Superflex contamination, Brown numeric-v2 resurrection, frozen-weight live renormalization, generic Return-v2 retune, or player-name forcing.
- Expert-v3 positional authority preserved: QB Todd / RB Weisse / TE Wolf; WR exact frozen Expert-v2 fallback.
- QUESTIONABLE alone remains neutral.
- Return-v2 early tau 4.25 remains preserved.

## Exact continuation
Gate: **RC496_PRE_DRAFT_FREEZE_FRESHNESS_ONLY**.
No automatic mock and no runtime/model retune absent genuinely new material evidence.
Before the real draft, only:
1. fresh Expert-v3 + WR-v2 source/health check,
2. fresh Sleeper half-PPR ADP,
3. acute injury/role/news freshness,
4. emergency queue/failsafe smoke,
5. real-draft ChatGPT decision support with special attention to WAIT leaders/turn geometry.

Library mirror remains stale/fail-closed; do not let it overwrite this sealed repo state.

- Library mirror is stale/writeback-blocked: retained takeover invariant.
- rc4.82: retained takeover invariant.
- rc4.83: retained takeover invariant.
- Re-inventory after EVERY completed work package: retained takeover invariant.