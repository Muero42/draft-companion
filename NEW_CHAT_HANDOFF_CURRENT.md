# PITTI NEW CHAT HANDOFF — CURRENT
Handoff generation: `20260829T0548Z-v161`
Updated: 2026-08-28 20:02Z

## FAIL-CLOSED TAKEOVER
1. Read PITTI_COMMAND_CONTRACTS.json.
2. Read PITTI_CURRENT_STATE.json.
3. Read PITTI_HANDOFF_SEAL.json and require generation `20260829T0500Z-v160`, PASS, handoff_ready=true, second_pass_pass=true, non-empty integrity map.
4. Verify every seal-listed Git blob SHA against main.
5. Read PITTI_EXECUTION_LOCK.json, PITTI_AUTO_PREFLIGHT.md, and PITTI_PROJECT_STATE.md to EOF.
6. Read PITTI_NEW_CHAT_BOOTSTRAP.md and HANDOFF_COMPLETENESS_MATRIX.md.
7. Verify actual main/gh-pages/device facts. Historical text or stale Library mirrors may never override newer verified state.

## CURRENT RUNTIME / RELEASE BOUNDARY
- production/control baseline: rc4.64.
- historical rollback reference: rc4.96.
- accepted Android authority: **rc4.101** (live Analyze/Snapshot/Coach PASS).
- **main/source: rc4.104**, squash merge `ff6c2240797c1d3303dd538204c76553fd324c16`.
- rc4.104 PR #44 candidate gates: release/package/project guardrails **PASS**.
- post-merge main: release contract PASS (33236822691), package PASS (33236822641), successor gate PASS (33236822674).
- post-merge rc4.82/rc4.83/project guard failures were diagnosed as **checkpoint/seal drift only**: runtime version lock and stale v160 blob hashes. No behavioral/package failure.
- package artifact 9710162910, digest `sha256:a35429594154cf2248851bcc9168ab6d51edf061dadf47c9ae82c1abc2b568bd`.
- gh-pages remains rc4.102 until the v161 reseal is all-green; do not claim rc4.104 deployed yet.
- canonical mock evidence: `draft-companion-v7-backup-2026-08-29T05-28-09-291Z.json`, draft 1399284498113294336, rc4.101.
- rc4.104 scope: repeated-WR9 generic repair, long-turn WAIT portfolio ordering, visible curated evidence + neutral polarity, successor-RC regression wiring. No hard WR cap, no global Return-v2 retune, no expert-weight redesign.

## CANONICAL FULL-DRAFT EVIDENCE — PITTI BACKUP 28-08 19:24
Library filename: **draft-companion-v7-backup-2026-08-28T19-24-03-389Z.json**
SHA-256: `1fc70dc81e8d9a4e28b5f0450f1a57e8cf8873b7541040acc0033e13cf6725ab`
Draft: **1399141058222280704**, rc4.99, slot 9, 15/15 own decision fixtures.
New chat retrieval: search Files/Library for the exact filename above or alias **PITTI BACKUP 28-08 19:24**. Do not substitute the older 17:30 backup for this full-draft audit.

Final user roster: **1 QB / 6 RB / 7 WR / 1 TE**.
Coach followed 10/15. Overrides are user decisions/validation evidence, never retroactively Coach-success labels.

### Return-v2
- 168 resolved non-censored forecasts.
- overall: 62.2% forecast vs 58.3% actual; Brier 0.091.
- short 3-pick turns: **91.4% forecast vs 90.9% actual** — high short-turn Return values are well calibrated in this draft.
- 17-pick turns: **37.1% vs 30.4% actual** — long-horizon optimism signal, not enough for global retune.
- Never globally depress Return-v2 because of the pick-89 screenshot.
- Aggregate compatible rc4.91+ OOS by horizon before changing hazard/tau.

### Pick 89 TLaw / Corum
Trevor Lawrence was Coach #1, Return 96.1%, Fazit WAIT. User chose Blake Corum; Lawrence survived picks 90/91 and user drafted him at 92.
Conclusion: the Return estimate was directionally correct; the defect was **turn-portfolio recommendation ordering** — WAIT with very high Return must not automatically occupy #1 if a materially comparable, more urgent alternative exists.

## RC4.100 MATERIAL FIXES
- signed substantive evidence selected before neutral context;
- displayRisk requires nonpositive polarity;
- neutral age/fair-range filler cannot masquerade as substantive Plus;
- mixed-polarity regressions protect Pro/Contra direction;
- soft WR saturation strengthened without a hard cap/quota or blind RB forcing;
- Normal-Cut remains phase-aware 18/22/26;
- conservative short-turn portfolio ordering:
  - next own pick <=3 picks away;
  - leader WAIT + Return >=85%;
  - alternative normal-cut/unblocked, Return <=82%;
  - alternative no more than 25 panel ranks worse;
  - no score mutation, no Return retune, no player/position forcing;
- emergency queue and acute-status freshness are mandatory release/package gates;
- Jeanty status refreshed 2026-08-28; monitored, no hard recommendation block.

## STRICT-COACH CONTROL — NEVER REGRESS
Draft 1399114762087895040 = **9 WR / 4 RB / 1 TE / 1 QB**, not 7 WR / 5 RB.
This is evidence that redundant WR marginal utility needed strengthening, but never permission for a roster cap/quota.
Starter maxima are not roster caps; exceptional WR value must remain legal.

## EXPERT / LEAGUE / DRAFT INVARIANTS
- 10-team Half-PPR, slot 9, 1QB.
- exactly one user QB after QB1; no player-name QB blacklist/forcing.
- no normal K/DST drafting.
- Expert-v2/v3 profile semantics and frozen weights stay intact unless new promotion evidence justifies change.
- Brown remains excluded from the new numeric v2; Draft Sharks counted once as a correlated family.
- no Superflex/2QB contamination.
- TE2 only exceptional-soft.
- no PairSum/Rolling resurrection.
- no broad expert-weight redesign from one mock/draft.
- no player-name scoring rules.
- no hard WR cap/quota or blind RB forcing.
- user preference may break close ties; only clearly non-viable deviations should be flagged.

## PRO/CONTRA QUALITY
The old CMC classes are now generic regressions:
- downside must not appear as Plus;
- neutral age/context/fair-range must not displace substantive signed evidence;
- positive evidence must not leak into Contra;
- pool-wide evidence quality remains an autonomous audit; user must not manually inspect all cards.

## AUTO / AUTO BLOCK — HARD CONTRACT
AUTO means complete autonomous work in long same-turn blocks.
After every package: checkpoint material change -> re-inventory all independent lanes -> execute next package.
No progress/status/promise-only messages, no empty final, and tool completion is not a stop condition.
A blocked CI/device lane blocks only that lane; continue decision/evidence, regression safety, draft-day failsafe, expert freshness, Watcher/post-draft readiness, checkpoint integrity, and current-evidence lanes where useful.
AUTO never starts an interactive mock unless explicitly requested.

## EXACT NEXT GATE
**RC4104_POSTMERGE_RESEAL_THEN_DEPLOY**

1. Complete v161 authority/seal consistency and require all main gates GREEN.
2. Deploy the exact 13 packaged runtime files to gh-pages and prove Git-blob parity.
3. Only then request the unavoidable Android rc4.104 observation and Analyze/Snapshot/Coach smoke.
4. Continue draft-day freshness/evidence work independently; no broad retune.