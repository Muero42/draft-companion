# PITTI NEW CHAT BOOTSTRAP — FAIL-CLOSED
Generation: `20260829T1018Z-v175`

When the user writes **PITTI AUTO**, verify in this order:
1. PITTI_COMMAND_CONTRACTS.json
2. PITTI_CURRENT_STATE.json
3. PITTI_HANDOFF_SEAL.json
4. PITTI_EXECUTION_LOCK.json
5. PITTI_AUTO_PREFLIGHT.md
6. PITTI_PROJECT_STATE.md to EOF
7. NEW_CHAT_HANDOFF_CURRENT.md
8. this file
9. HANDOFF_COMPLETENESS_MATRIX.md
10. actual repo/main/gh-pages/device evidence

Fail closed unless CURRENT/SEAL/HANDOFF/bootstrap/matrix generation is `20260829T1018Z-v175`, the seal is PASS/ready/second-pass, and every seal-listed Git blob SHA validates.

## Current facts
- production/control: rc4.64.
- historical rollback reference: rc4.96.
- main/source: rc4.106.
- rc4.100 PR #36 candidate gates: release 33205458705 PASS; package/re-extract 33205458721 PASS; guardrails 33205458745 PASS.
- rc4.100 merged to main as 1b85656e40a182ca6be2397c5bf6674006b97bd2.
- post-merge main verification: **PASS**; release/package/project guardrails plus rc4.82/rc4.83 draft-critical gates are GREEN.
- gh-pages: rc4.106; exact 13/13 packaged runtime-file parity with main PASS.
- Android/PWA last accepted authority: rc4.105. rc4.106 display-only candidate Android observation is pending.
- current gate: RC4106_ANDROID_DISPLAY_ACCEPTANCE.

## Canonical evidence
- full draft backup: draft-companion-v7-backup-2026-08-28T19-24-03-389Z.json, SHA-256 1fc70dc81e8d9a4e28b5f0450f1a57e8cf8873b7541040acc0033e13cf6725ab.
- full draft 1399141058222280704: rc4.99, 15/15 fixtures, final user roster 1 QB / 6 RB / 7 WR / 1 TE, Coach followed 10/15.
- Return-v2: short 3-pick turns 91.4% forecast vs 90.9% actual; 17-pick turns 37.1% vs 30.4%. Do not globally retune from one draft.
- pick 89: Trevor Lawrence 96.1% Return/WAIT survived to 92; defect was #1 turn-portfolio ordering, not short-turn Return calibration.
- strict Coach control draft 1399114762087895040 = **9 WR / 4 RB / 1 TE / 1 QB**, never 7 WR.

## rc4.100 changes to preserve
- signed evidence before neutral context; positive evidence cannot leak into Contra via displayRisk.
- neutral age/fair-range filler cannot masquerade as substantive Plus.
- soft WR saturation retained; no hard cap/quota.
- conservative short-turn portfolio ordering only for <=3-pick turn, WAIT leader Return>=85%, comparable unblocked normal-cut alternative Return<=82%, <=25 panel ranks worse.
- emergency queue + acute-status freshness mandatory in release/package gates.
- Jeanty acute status refreshed 2026-08-28; monitored, not hard-blocked.

## Hard invariants
No automatic mock; no PairSum/Rolling; no hard WR cap/quota; no blind RB forcing; no player-name forcing; no global Return-v2 retune; no expert-weight redesign; starter maxima are not roster caps; user overrides are not Coach-success labels; WAIT is timing, not automatic TAKE; exactly-one-QB strategy after QB1 remains.

## AUTO / AUTO BLOCK
Execute long autonomous same-turn blocks. Re-inventory after every package. No progress/status/promise-only or empty replies while useful autonomous work remains. A blocked dependent lane does not stop independent lanes.

## Canonical self-update path
verified candidate -> main promotion/post-merge verification -> gh-pages exact runtime deployment + byte parity -> Android/PWA refresh -> device observation. All stages are complete for rc4.104 through Android post-draft Snapshot observation. The bounded frozen-fixture replay is CI PASS; current work is draft-day readiness/freshness/failsafe.
Do not revert to gh-pages-only promotion while main is stale, repeated refresh loops, cache clearing, reinstall, or manual ZIP as the default route.

## rc4.104 canonical new evidence
- Backup `draft-companion-v7-backup-2026-08-29T05-28-09-291Z.json`, draft 1399284498113294336, rc4.101.
- Strict Coach path reproduced 9 WR / 4 RB / 1 QB / 0 TE before pick149; 14/14 completed own picks followed Coach #1.
- Pick92 Value-Safety promoted WR7 despite WR6/RB2; pick132 93.3% WAIT Spears remained #1 over Mark Andrews 0.6% Return.
- rc4.104 generic bounded repair merged; no hard cap, player-name forcing, Return retune, or expert retune.

## v166 replay truth — supersedes historical pending text
- rc4.104 is main/source/deployment/accepted Android authority; exact 13-file main/gh-pages parity PASS and user post-draft Snapshot PASS.
- Canonical completed mock: `draft-companion-v7-backup-2026-08-29T05-28-09-291Z.json`, draft 1399284498113294336, generated on rc4.101.
- Bounded frozen-fixture replay under rc4.104 is **CI PASS** for the observed failure mechanisms: pick92/109/112 roster economics and exact pick132 Spears/Andrews long-turn reorder. Return-v2 is unchanged.
- Browser-equivalent full historical recomputation is unavailable because not every transient runtime input was preserved; do not mislabel this evidence boundary as a failed/pending bounded replay.
- Current gate: `RC4104_REPLAY_BOUNDED_PASS_DRAFTDAY_READINESS`. Continue freshness, failsafe, Watcher/post-draft readiness and checkpoint integrity; FantasyPros capture is optional external benchmark.

## v167 rc4.105 OOS canary
- Latest canonical OOS backup: draft-companion-v7-backup-2026-08-29T06-53-52-495Z.json, runtime rc4.104, draft 1399308446632800256, 15 fixtures.
- Pick129 regression: score-0 WR promoted over score-100 RB by short-turn timing override. rc4.105 adds generic normalized-Coach floor >=40; preserves prior Corum score47 case.
- PR #46 all three gates PASS; merged main 93a7619ec5af3468b71d62238b77f4f01e37822c; gh-pages 13/13 runtime parity PASS.
- Android rc4.105 NOT YET accepted. rc4.104 remains last accepted device authority.

## v169 rc4.106 / mock-pause canary
- rc4.105 Android + fresh Snapshot/Coach behavior PASS.
- rc4.106 fixes only Snapshot embedded individual-rank display; no ranking/Coach/Return/model change. PR #47 all gates PASS; main 0818bc9632eca79c4d055d444a6eae0af53f3a9f; gh-pages 13/13 parity PASS; Android rc4.106 observation pending.
- Mock 1399325404598124544 paused before pick9. Cook recommended, not confirmed drafted.
