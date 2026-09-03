# PITTI MANAGER / AUTODRAFT TURN STRESS — 2026-08-31

> HISTORICAL/SUPERSEDED operational checkpoint: runtime, device, deployment, release/activation gates and CURRENT/OVERRIDE instructions below describe the original dated context only. They must not be executed as current work or override ../PITTI_CURRENT_STATE.json and ../NEW_CHAT_HANDOFF_CURRENT.md. Research evidence and durable invariants remain as provenance, subject to later explicit corrections.

## Purpose
Follow-up to the 6,000-draft independent market stress. This pass audits the *production* opponent-model assumptions that matter most at slot 9: the two immediate turn neighbors (Bastian #8 and Dutch Marc #10), live autodraft overrides, and short-turn target collision behavior. No production coefficients are changed.

## Verified production evidence
Canonical 2026 order is Bastian #8, Muerotechnik #9, Dutch Marc #10. Historical runtime corpus has Bastian 9 seasons (2017–2025) and Dutch Marc 9 seasons (2017–2025).

Bastian historical phase shares:
- early RB 36.6%, WR 35.4%, TE 21.6%, QB 6.5%
- mid1 WR 63.3%, RB 22.0%
- mid2 WR 77.1%, RB 9.5%
- late RB 35.9%, WR 30.3%, TE 19.6%
Runtime qualitative modifiers also include rookie-RB +18% and late-reach +12%.

Dutch Marc historical phase shares:
- early RB 47.4%, WR 38.2%
- mid1 TE 27.4%, WR 28.5%, QB 23.9%, RB 20.2%
- mid2 RB 44.4%, WR 41.5%
- late WR 28.5%, RB 25.7%, QB 21.1%
His long-run first-position rounds are QB 4.43, TE 4.52, RB 1.81, WR 1.46.

## Turn-neighbor stress conclusions
1. **Bastian is the more important similar-source/WR collision risk in rounds 4–9.** His historical mid1/mid2 WR concentration is extreme relative to league phase priors. At the 29/32 and 49/52 corridors, a desired WR surviving the wider market does not imply surviving Bastian's intervening pick. Live Return-v2 already models this; ChatGPT should not manually discount it away.
2. **Dutch Marc is structurally broader in mid1.** QB/TE demand is materially more plausible for him than for Bastian, which can relieve some WR/RB collision pressure around specific turns. In mid2, however, his historical profile swings strongly back toward RB/WR, so late assumptions that he will “probably take QB/TE” are unsafe.
3. **Bastian rookie-RB risk matters only as a bounded modifier.** It is not evidence to preemptively reach for every rookie RB. If a rookie RB is already close in v4 quality and Return-v2 shows Bastian as top taker, loss-if-gone becomes a legitimate sequencing tie-break.
4. **Immediate turn geometry magnifies classification value.** At picks 9/12 and all subsequent 9/10 turns, #10 can pick twice around the turn and #8 is the final manager immediately before the user's odd-round pick. Correct mode classification of these two managers is therefore disproportionately valuable.

## Autodraft stress
Production code correctly disables personal manager traits/history when a manager is explicitly/observably classified autodraft and switches LIVE simulation to Sleeper SearchRank + roster need. This is the correct direction because Sleeper's documented CPU contract uses queue first and then higher-ranked available players plus roster need; private queues remain unknowable.

Operational consequences:
- A single clock-expiry pick is insufficient to classify AUTO.
- Once AUTO is confirmed/explicitly entered, historical Bastian/Dutch-Marc traits must stop influencing that manager's Return-v2 distribution. Production code does this.
- Empty-queue AUTO makes near-Sleeper-board targets more predictable, but **never exact** because Sleeper does not publish its tie-break and a private queue may exist.
- If a manager returns online, switch that manager back to manual/infer immediately; do not retain stale AUTO assumptions. The app's mode-segment design supports mid-draft changes.

## Adverse-snipe scenarios
The correct response to an immediate-neighbor target collision is sequencing, not ranking mutation:
- two close-quality targets, one with materially higher Bastian/Dutch-Marc take risk -> take the higher loss-if-gone target first;
- large v4 quality gap -> do not sacrifice the superior player merely to avoid a possible snipe;
- high Return on both -> preserve quality leader;
- low Return on both -> current pick is the decision point; ceiling/upside becomes the tie-break among close-quality candidates.

This aligns with the existing generic Turn-Portfolio layer and avoids player-name forcing.

## Relationship to five-WR stress
The independent market stress already showed Smith/McMillan rarely returning from 29/32 to 49. Manager-specific evidence makes the *short 29→32 turn* more important, especially when Bastian has a pick in the corridor and WR demand is live. Therefore the correct five-WR operating rule is:
- do not plan around 49 for a preferred member of the cluster;
- at 29, compare the best two-pick portfolio for 29+32 using live Return-v2/taker labels;
- if McMillan is preferred on ceiling and has materially greater immediate-neighbor loss risk than a close peer, McMillan-first is justified;
- do not hardcode this ordering before the live board.

## Result
No new defect found in rc4.157 manager/autodraft architecture. No code change authorized. The residual uncertainty is genuinely live-state-dependent: unknown private Sleeper queues, actual online/offline state, and real picks. These cannot be improved by more pre-draft coefficient tuning.
