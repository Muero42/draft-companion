# PITTI NEW CHAT HANDOFF — CURRENT
Handoff generation: `20260828T172200Z-v150`
Updated: 2026-08-28 17:22Z

## Mandatory takeover order
1. Read `PITTI_COMMAND_CONTRACTS.json`.
2. Read `PITTI_CURRENT_STATE.json`.
3. Read `PITTI_HANDOFF_SEAL.json`; require PASS, handoff_ready=true, second_pass_pass=true.
4. Require CURRENT == SEAL == this handoff generation and verify every seal-listed blob hash.
5. Read `PITTI_AUTO_PREFLIGHT.md`, then `PITTI_EXECUTION_LOCK.json`.
6. Read `PITTI_PROJECT_STATE.md` to EOF. Newer appended facts override historical sections.
7. Read `PITTI_NEW_CHAT_BOOTSTRAP.md` and `HANDOFF_COMPLETENESS_MATRIX.md`.
8. Verify actual GitHub CI/package/deployment state before acting. Chat memory is not authority.

## Current authority — v150
- League: 10-team Half-PPR, 1QB, slot 9; real draft 2026-08-31.
- Production/control baseline remains rc4.64 and selectable.
- Source authority: **v11.8.0-rc4.96**.
- Package/re-extract authority: **v11.8.0-rc4.96**, 13 runtime files, run **33183057716**, artifact **9690504450**, SHA-256 **18d168661f8fbe2cdbe00d8829531f9c721845efb98fa8c2925c76e7cd21cca0**.
- Exact five primary workflows PASS at commit **6eafbb297fa999a28dae14375a65544b73a97d7c**.
- Deployment authority: **v11.8.0-rc4.96**. Independent 13/13 main↔gh-pages blob parity PASS at gh-pages head **35b68015aa79e8976f3ee9a230be3710be503b32**.
- Android authority remains **v11.8.0-rc4.94** until a fresh device snapshot proves rc4.96 functionally. Do not conflate deployed with Android-verified.
- Exact next gate: **RC496_ANDROID_VERIFY**. Do not start a mock automatically.

## Decision-Evidence audit now part of authority
Canonical source: `PITTI-Decision-Evidence-1398976368485625856-2026-08-28T14-07-09-294Z.json`.
Repo audit: `research/DECISION_EVIDENCE_AUDIT_1398976368485625856_2026-08-28.md`.

Accepted rc4.96 generic repairs:
- QUESTIONABLE alone = zero score penalty; concrete injury evidence can still downgrade.
- NORMAL-CUT display decoupled from PlayerQualitySafety; display warning must not appear artificially early.
- Sparse Expert panel: n=2/n=3 reduces score/confidence; n<3 surfaces PANEL-CHECK. J.K. Dobbins is a canary, not a name-specific rule.
- Embedded Expert rows export `effectiveWeight` correctly.
- Decision evidence canonicalizes duplicate own-pick states and exposes mixed model versions.
- Cam Ward/Cameron Ward and Kenny Gainwell/Kenneth Gainwell split aliases merged.
- Observed mock decision corridor received player-specific evidence coverage rather than generic Panel/ADP filler.
- Late WR7+ opportunity cost strengthened softly; **no hard WR cap**.
- Dedicated `tools/rc496-draft-critical.mjs` exists and is wired into release/package contracts.

Evidence audit non-actions:
- no generic Return-v2 retune from one mock;
- no Dobbins/Flowers/Smith/Williams name forcing;
- no fixed roster quotas;
- no player-name QB forcing;
- no Expert-v3 weight change from this audit.

## Draft invariants / old-error blockers
- Exactly one user-drafted QB; after QB1 the user Coach surface excludes QB2 by user strategy.
- Geno Smith/Aaron Rodgers rank organically; no player-name hard exclusions.
- K/DST not drafted normally.
- Starter maxima are not roster caps.
- TE2 only exceptional-soft, not globally banned.
- WR saturation is soft; exceptional value remains legal.
- PairSum/Rolling must not resurrect.
- No blind RB forcing, no Superflex evidence, no Brown numeric-v2 resurrection, no live renormalization of frozen Expert weights.
- Duplicate snapshot guard remains draft-id/fingerprint aware.

## Expert authority
Expert-v3 positional profile remains selectable:
- QB: Todd D Clark 10%.
- RB: Ryan Weisse 10%.
- TE: Wolf of Roto Street 10%.
- WR: exact Expert-v2 fallback.
Expert-v2/control profiles remain selectable. Draft Sharks counted once. Derek Brown stays excluded from new v2; Erickson is qualitative/challenger context, not an extra numeric vote.

## AUTO / AUTO BLOCK contract
AUTO means actual long autonomous work, not a promise/status response.
Re-inventory after EVERY completed work package.
A blocked lane blocks only itself; use independent lanes in parallel.
AUTO BLOCK = zero-ack immediate continuation.
No empty/status-only final while safe useful autonomous work exists.

## Legacy canaries intentionally retained
Historical rc4.82 and rc4.83 gates remain minimum-feature regression canaries. They were made successor-safe after alias/evidence changes and must not be reverted to stale exact counts/strings.

## Checkpoint caveat
Library mirror is stale/writeback-blocked. Repo CURRENT + PASS SEAL + Execution Lock + Project-State EOF + this handoff + actual CI/device evidence win on contradiction. Do not claim Library persistence unless Files proves it.

## Exact continuation
1. Verify v150 seal hashes and confirm five-gate rc4.96 PASS + 13/13 deployed parity.
2. Request/inspect one fresh Android/PWA rc4.96 snapshot only when device verification is the next unavoidable action.
3. If functional verification passes, promote Android authority to rc4.96 and run final draft-ready freeze audit.
4. Preserve the Decision-Evidence findings and all anti-regression canaries above.
