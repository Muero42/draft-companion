# RC4.98 v155 Open Audit Contract — 2026-08-28

> HISTORICAL/SUPERSEDED operational checkpoint: runtime, device, deployment, release/activation gates and CURRENT/OVERRIDE instructions below describe the original dated context only. They must not be executed as current work or override ../PITTI_CURRENT_STATE.json and ../NEW_CHAT_HANDOFF_CURRENT.md. Research evidence and durable invariants remain as provenance, subject to later explicit corrections.

This file is continuation authority for the next PITTI AUTO chat. It does not change runtime/model behavior.

## Canonical evidence
- Backup: `draft-companion-v7-backup-2026-08-28T17-30-01-853Z.json`.
- Realistic/user-decision draft: `1399109246460682240` (rc4.97).
- Strict Coach draft: `1399114762087895040` (rc4.98), 15/15 `followedCoach=true`.
- Correct strict-Coach final roster: **9 WR / 4 RB / 1 TE / 1 QB**.
- The old 7-WR / 5-RB count is invalid.

## Lane A — WR saturation / championship utility
Reconstruct all 15 strict-Coach own-pick states from frozen fixtures. For every WR selection from WR5 through WR9:
1. record pre-pick roster counts and round/pick;
2. record Coach score, panel rank, ADP, Return, Loss-if-gone, MRU/progressive/saturation reasons and Safety involvement;
3. record strongest non-WR alternatives and the same metrics;
4. identify whether the WR won because of panel quality, Return timing, Safety resurrection, weak roster penalty, or missing alternative utility;
5. compare with the realistic paired draft only as plausibility/counterfactual evidence, never as randomized A/B causality.

Acceptance target for any successor microfix:
- redundant WR utility must fall materially as WR depth rises;
- exceptional WR value remains legal;
- no hard WR cap/quota;
- no blind RB forcing;
- no player-name rules;
- no PairSum/Rolling;
- no generic Return-v2 retune;
- no expert-weight redesign;
- deterministic fixtures must prove both saturation correction and preservation of legitimate WR value.

## Lane B — substantive Pro/Contra evidence quality
The user must not be required to visually inspect every player.

Audit the candidate pool automatically for:
1. negative structured evidence rendered as Pro or positive as Contra;
2. generic/non-informative fallbacks such as `Fairer Bereich`, `Panel ...`, `Kein spezifischer ...` when substantive player-specific evidence should exist;
3. missing substantive positive evidence for high-ranked/decision-relevant players;
4. missing substantive negative/risk evidence where current or structural risk exists;
5. contradictions between arrow direction, Pro, Contra, Fazit, injury/risk and structured `dir`;
6. stale/expired evidence displayed as current;
7. duplicated or mutually contradictory evidence components.

Known reproducer:
- Christian McCaffrey: polarity defect fixed generically in rc4.98; current main can still fall back to generic Pro text.
- Draft PR #33 / branch `pitti/rc4.98-release-close` contains a proposed `elite_dual_threat_role` positive component and regression, but it is OPEN/DRAFT/UNMERGED. Do not assume it is on main.

Any evidence fix must be generic where possible and protected by exhaustive tests. Named fixtures are allowed only as regression canaries, not rank/score forcing.

## Runtime boundary
- main/source: rc4.98.
- package/re-extract: rc4.98 PASS, run 33194280926 / artifact 9695061955 / SHA-256 43887c2cbeb3a142fa383941caac0b6768687203f862e0d234a54bb9854dd44e.
- Android/PWA: rc4.98 observed installed/rendering, but final acceptance not PASS.
- rollback authority: rc4.96.
- gh-pages: rc4.96, intentionally divergent from main rc4.98.

## AUTO
No automatic mock. Continue both audit lanes autonomously in long blocks. Re-inventory after each work package. Stop only for unavoidable user/device action, consequential approval, unsafe contradiction, or exhausted independent work.
