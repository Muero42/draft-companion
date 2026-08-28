# PITTI Draft-Day Freshness Plan — 2026-08-31

Real draft: 20:00 Germany local time.
Frozen runtime: v11.8.0-rc4.96.
Purpose: maximize fresh information without destabilizing the frozen decision kernel.

## Operating principle

Fresh information is an overlay on the frozen board, not permission for indiscriminate coefficient/rank changes. Separate:
1. confirmed material facts,
2. corroborated role/injury signals,
3. weak contextual signals,
4. noise.

## Monday cadence

### Overnight / early morning
Low expected incremental US news value. Consolidate already-known changes; do not repeatedly poll the same players/sources.

### ~14:00–17:30 Germany
Increase freshness monitoring as the US workday develops.
Focus:
- material injury/availability changes,
- trades/signings/waivers/releases,
- depth-chart/role changes,
- expert ranking timestamps/deltas,
- Sleeper half-PPR ADP movement.

### ~17:30–18:15
Primary full pre-draft freshness pass.
Produce a delta set against the frozen rc4.96 inputs. No runtime mutation unless a genuinely material source-data defect is proven and deterministic gates can still be completed safely.

### after late transaction/waiver processing, roughly ~19:05–19:30
Targeted delta scan, not a full research rebuild.
For every relevant new RB/WR/TE transaction:
- identify acquired/released player's likely roster purpose;
- map same-position incumbents in PITTI candidate corridor;
- check whether an incumbent already had injury/availability/role uncertainty;
- seek corroboration from team/beat/injury reporting;
- classify signal as NONE / WEAK / CORROBORATED / MATERIAL.

Weak-signal rule:
- transaction alone is never injury proof;
- special teams, generic depth, practice-squad planning and opportunistic talent acquisition remain alternative explanations;
- uncorroborated same-position acquisition may break a near-tie but must not create a hard rank penalty;
- early-round movement requires much stronger evidence than late-round contingent-upside movement.

### ~19:40–19:50
Final materiality scan.
Only incorporate:
- confirmed/strongly corroborated injury or availability changes,
- material trades/signings/claims with clear role consequences,
- meaningful expert-board deltas,
- major depth-chart/role information.

Do not chase trivial rank movement.

### ~19:50
Operational freeze for draft start.
Keep web/news research available for genuinely breaking information during the draft, but do not rebuild the runtime.

## Live-draft integration

- WAIT leader is not automatic TAKE. At the 9/10 turn, evaluate the two-pick portfolio, Return/loss risk, positional opportunity cost and fresh evidence.
- New transaction/injury evidence is an overlay and tiebreaker unless corroboration makes it materially stronger.
- Preserve no-K/DST, one-QB user path, soft WR saturation, no roster caps, no named-player forcing.
- Never resurrect PairSum/Rolling or globally retune Return-v2 from a late news item.

## Final checklist
- Expert-v3 QB/RB/TE health/freshness
- frozen Expert-v2 WR health/freshness
- Sleeper half-PPR ADP freshness
- acute injury/availability deltas
- transaction/claim role deltas
- emergency queue/failsafe
- device/app rc4.96 availability
- ChatGPT live-decision context loaded
