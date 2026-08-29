# PITTI NEW CHAT BOOTSTRAP — FAIL-CLOSED
Generation: `20260828T2002Z-v157`

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

Fail closed unless CURRENT/SEAL/HANDOFF/bootstrap/matrix generation is `20260828T2002Z-v157`, the seal is PASS/ready/second-pass, and every seal-listed Git blob SHA validates.

## Current facts
- production/control: rc4.64.
- rollback accepted functional authority: rc4.96.
- main/source: rc4.100.
- rc4.100 PR #36 candidate gates: release 33205458705 PASS; package/re-extract 33205458721 PASS; guardrails 33205458745 PASS.
- rc4.100 merged to main as 1b85656e40a182ca6be2397c5bf6674006b97bd2.
- post-merge main verification: **PASS**; release/package/project guardrails plus rc4.82/rc4.83 draft-critical gates are GREEN.
- gh-pages: rc4.100; exact 13-file packaged-runtime parity with main PASS.
- Android/PWA last observed: rc4.99; rc4.100 device observation/acceptance NOT yet established.
- current gate: RC4100_ANDROID_OBSERVATION.

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
verified candidate -> main promotion/post-merge verification -> gh-pages exact runtime deployment + byte parity -> Android/PWA refresh -> device observation. The first three stages are complete for rc4.100; only device observation remains.
Do not revert to gh-pages-only promotion while main is stale, repeated refresh loops, cache clearing, reinstall, or manual ZIP as the default route.
