# PITTI NEW CHAT BOOTSTRAP — FAIL-CLOSED
Generation: `20260828T175500Z-v155`

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

Fail closed unless CURRENT/SEAL/HANDOFF generation is `20260828T175500Z-v155`, the seal is PASS/ready/second-pass and its integrity set is non-empty and validates.

## Current facts
- production/control: rc4.64.
- rollback/Android accepted authority: rc4.96.
- main/source + latest package/re-extract: rc4.98.
- Android version observed: rc4.98; final Android acceptance still pending because semantic/evidence defects remain.
- gh-pages: rc4.96 and NOT byte-parity with main rc4.98.
- current gate: RC498_WR_SATURATION_AND_EVIDENCE_COVERAGE_AUDIT.
- canonical OOS backup: draft-companion-v7-backup-2026-08-28T17-30-01-853Z.json.
- strict Coach draft 1399114762087895040 = 9 WR / 4 RB / 1 TE / 1 QB. Any 7-WR count is stale/wrong.
- PR #33 CMC substantive positive-evidence patch is UNMERGED.

## Takeover invariants
- no automatic mock;
- no PairSum/Rolling;
- no hard WR cap/quota;
- no blind RB forcing;
- no player-name forcing;
- no generic Return-v2 retune;
- no expert-weight redesign;
- starter maxima are not roster caps;
- WAIT/Return is timing, not automatic TAKE;
- QUESTIONABLE alone stays neutral;
- sparse-panel protection stays generic;
- AUTO/AUTO BLOCK continues across work packages without progress-only/empty replies.


## Guard-compatibility canaries — historical semantics only
- Android version authority: rc4.96 rollback/accepted authority; rc4.98 is observed active candidate, not accepted authority.
- work package -> checkpoint -> re-inventory remains mandatory AUTO sequencing.
- user must never need to remind: AUTO/AUTO BLOCK must continue without repeated nudges.
