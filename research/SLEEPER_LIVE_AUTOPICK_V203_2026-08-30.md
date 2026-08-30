# PITTI Sleeper live-autopick model — v203 — 2026-08-30

## Verified platform contract
Sleeper Support documents:
1. CPU auto-pick uses the owner's draft queue first.
2. When no queued players remain, CPU considers positions the roster needs and selects one of the higher-ranked available players.
3. A queue is draft-room specific and ordered; drafted players are removed automatically.
4. Sleeper does not document the exact empty-queue tie-break/need formula.

## PITTI consequence
- Mock CPU behavior is not used as the live-autopick model.
- In LIVE mode only, a manager classified as autodraft now uses a dedicated narrow Sleeper-board + roster-need distribution inside Return-v2.
- Sleeper SearchRank is the primary board signal; ADP/panel are fallbacks only.
- We intentionally retain stochastic uncertainty because Sleeper says "one of the higher-ranked players" and does not publish its exact tie-break.
- Unknown private queues are an irreducible uncertainty. We must not claim exact prediction unless the queue is known/observed empty.
- Manual managers retain the existing market + manager-profile opponent model.

## Safety
This changes only opponent Return-v2 simulation for LIVE managers already classified as autodraft. It does not alter player-quality rankings or mock behavior.
