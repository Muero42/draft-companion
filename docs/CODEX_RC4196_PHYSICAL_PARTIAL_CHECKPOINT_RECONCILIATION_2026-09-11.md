# CODEX WORK PACKAGE — rc4.196 PHYSICAL PARTIAL CHECKPOINT RECONCILIATION

Date: 2026-09-11
Branch: `pitti/rc4196-physical-partial-handoff`
PR: #149
Mode: checkpoint / authority reconciliation only

## Goal

Reconcile the coupled PITTI checkpoint/handoff surfaces with the newer post-deployment physical evidence recorded in:

`docs/PITTI_BRIDGE_HANDOFF_RC4196_PHYSICAL_PARTIAL_2026-09-11.md`

Do not repair runtime behavior in this task. The purpose is to make the next chat/Codex takeover truthful and fail-closed before the Start/Sit fix begins.

## Mandatory first step — live authority

Read `AGENTS.md` and the bridge file completely, then verify live Git/GitHub authority.

Expected starting evidence at work-package creation:
- canonical main: `082d77003f6616e290146698641aebe63f37b8c2`
- handoff branch starts from that main and contains only bridge/work-package docs before your reconciliation edits
- PR #149 is Draft

These values are provenance, not permanent authority. If live state differs, stop dependent work and reconcile the difference; do not restore an older SHA mechanically.

## Read completely before editing

- `AGENTS.md`
- `docs/PITTI_BRIDGE_HANDOFF_RC4196_PHYSICAL_PARTIAL_2026-09-11.md`
- `PITTI_CURRENT_STATE.json`
- `PITTI_EXECUTION_LOCK.json`
- `PITTI_COMMAND_CONTRACTS.json`
- `PITTI_HANDOFF_SEAL.json`
- `NEW_CHAT_HANDOFF_CURRENT.md`
- `PITTI_NEW_CHAT_BOOTSTRAP.md`
- `PITTI_AUTO_PREFLIGHT.md`
- `PITTI_PROJECT_STATE.md`
- `HANDOFF_COMPLETENESS_MATRIX.md`
- `README.md`
- authority/postmerge regression tooling that validates those surfaces

## Binding reconciled truth

The final checkpoint must distinguish these states exactly:

### Source
- rc4.196 is merged to canonical main through PR #143 and the later checkpoint reconciliation PR #145.
- Current main is dynamically verified; do not hard-code a future-current SHA as immutable authority.

### Production deployment
- rc4.196 production deployment is now VERIFIED on the physical Cloudflare evidence for exact main `082d770...`.
- Deployment ID: `da039536-7733-4b07-8f0c-70cc6e0bc8b7`.
- Any operative statement that rc4.196 is still `PACKAGED_ONLY_NOT_DEPLOYED`, or that rc4.195 remains the current production version, is stale and must be removed/re-scoped as historical.

### Physical device state
- Android/PWA physically shows `v11.8.0-rc4.196` without cache clear/reinstall.
- Verdict is **PARTIAL PASS / NOT FULLY ACCEPTED**, not PASS and not generic DEVICE_REJECTED.
- Canonical token/wording should be unambiguous, e.g. `RC4.196_PHYSICAL_PARTIAL_PASS_NOT_ACCEPTED`.

Preserved physical PASS lanes:
- Sleeper live state `<1 Min.`
- Weekly projection refresh physically present, including observed W1 `728 Records`
- Waiver/FA fail-closed behavior
- D/ST streaming lane
- K-only comparison with Mevis retained
- Trade Offer Board v8 with Boone/Yahoo `263/264` and `TRADE HOLD`
- Watcher PASS
- Reserve/IR separation with Charbonnet on Reserve/IR

Physical blocker:
- weekly rank lane `UNAVAILABLE`
- PITTI selected-panel lane `UNAVAILABLE`
- shown skill-player cards report weekly rank and Half-PPR evidence unavailable in Start/Sit consumption
- game/opponent/weather/lock context unavailable
- Start/Sit v6 reports 14 realistic skill players without complete current Rank+Projection evidence
- therefore full rc4.196 physical acceptance is forbidden until a later fixed build passes a new canary

### Prior version role
- rc4.195 is the latest prior **fully accepted** production/device reference and a historical comparison/rollback reference.
- It is no longer the current production version after the verified rc4.196 deployment.
- rc4.193 and rc4.169 remain historical only where already correctly scoped; do not resurrect them as current physical authority.

### Package
- rc4.196 package identity remains 17 files, SHA-256 `a654422c907e3127335c20df1956fc974442c3eb3be011a5d8eb1e9b71f4500d`.
- Package identity and deployed/device state are distinct facts.

## Required checkpoint edits

Update all active/coupled authority aliases, not only prose. At minimum audit and reconcile:

- `PITTI_CURRENT_STATE.json`
- `PITTI_EXECUTION_LOCK.json`
- `PITTI_COMMAND_CONTRACTS.json`
- `PITTI_HANDOFF_SEAL.json`
- `NEW_CHAT_HANDOFF_CURRENT.md`
- `PITTI_NEW_CHAT_BOOTSTRAP.md`
- `PITTI_AUTO_PREFLIGHT.md`
- `PITTI_PROJECT_STATE.md`
- `HANDOFF_COMPLETENESS_MATRIX.md`
- `README.md`

Advance the coupled generation beyond v242 using the repository's established generation scheme.

Do not leave contradictory aliases such as:
- rc4.196 undeployed
- rc4.195 current production
- rc4.196 fully accepted
- deployment parity unknown after the exact verified production deployment if the field specifically refers to that deployed exact rc4.196 source

If a parity field cannot truthfully be proven from the available evidence, model that distinction explicitly rather than overclaiming. The Cloudflare screenshot proves deployment of exact main commit identity; it does not automatically prove every arbitrary byte-parity claim outside the observed deployment contract.

## Regression hardening

Update authority/postmerge regressions so they fail closed on at least these future regressions:

1. rc4.196 reverted to `PACKAGED_ONLY_NOT_DEPLOYED` after verified production deployment.
2. rc4.195 resurrected as current production after rc4.196 deployment.
3. rc4.196 partial physical canary incorrectly promoted to full accepted/PASS.
4. partial Start/Sit blocker omitted from active handoff while rc4.196 remains not fully accepted.
5. rc4.193 or rc4.169 resurrected as current physical authority.
6. source/deployment/device acceptance collapsed into one state.
7. package digest/file count changed without matching package evidence.

Preserve existing negative regressions and unrelated season invariants.

## Seal

Regenerate the coupled handoff seal from the final reconciled blobs using the repository's canonical process. Do not hand-edit hashes inconsistently.

## Verification

Run, repair and rerun until green as applicable:

- `node tools/strict-suite.mjs`
- `node tools/pitti_guardrail_check.mjs`
- `node tools/postmerge-authority-contract.mjs`
- `node tools/postmerge-authority-regression.mjs`
- package/re-extraction/parity validation required by the current repository contract
- `git diff --check`

Confirm no runtime/product files changed. If any runtime file changes, stop and separate that work into the later repair package.

## Output

Commit the checkpoint reconciliation locally with a clear message.

If shell push is unavailable only because GitHub HTTPS credentials are absent, do not introduce credentials. Report the exact clean local commit SHA and use the Codex platform `PR-Entwurf erstellen` handoff when instructed by the user/ChatGPT.

Report:
- live authority observed
- generation produced
- files changed
- exact physical state encoded
- negative regressions added
- every verification result
- final commit SHA
- whether push/publication succeeded

## Hard prohibitions

Do NOT:
- modify runtime/product behavior
- merge PR #149 or any other PR
- deploy/retry production
- clear cache or reinstall
- execute Sleeper transactions
- fabricate missing weekly ranks, projections, weather, Vegas, game context or physical acceptance

The runtime Start/Sit repair is a separate next work package after this checkpoint is independently reviewed.
