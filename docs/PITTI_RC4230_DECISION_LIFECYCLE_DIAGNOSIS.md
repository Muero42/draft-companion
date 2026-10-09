# rc4.230 decision lifecycle diagnosis — 2026-10-09

Status: DIAGNOSTIC_ONLY. Runtime unchanged. Android trigger remains unproven.

## Authority and preserved evidence

- Entry branch `codex/rc4230-cloud-apt-reliability`, HEAD `49aee28a20264eaea3f31171443512f6d2f07db7`, clean; origin `https://github.com/Muero42/draft-companion.git`.
- Local `origin/main` matches the user-supplied canonical merge `171933ed024525e5c3bb7df864ab07d3bc27bb82`, tree `c7b39f7122a0f13b76d06061a3fe426e78d82969`. Entry HEAD and canonical merge have identical trees. Work started on `codex/rc4230-decision-lifecycle-diagnosis` from that merge.
- CURRENT/SEAL v307 integrity passed without bypass. Older publication/device-pending prose is superseded by the current user instruction. No GitHub verification, publication or authority bulk rewrite was performed; PR235 merged and six passing postmerge workflows are user-supplied evidence, not a fresh API observation. The dynamic GitHub takeover verifier was inspected but not run because this package explicitly excludes remote verification.
- User-observed Android rc4.230: roster/Weekly loading approximately six seconds, acceptable, navigation usable; previous freeze/severe loading issues resolved. These observations are preserved, not reopened or extrapolated to other behavior.

## Proven failure path

`seasonRenderPassCurrent` clears all dependent surfaces and `lastPostDraftPairs` when context identity, render revision or the captured deadline is no longer current. Both `queueSeasonRerender` and this abort path produce the same generic HOLD; its wording alone cannot identify the trigger.

The deterministic cold and warm bootstrap reproduction proves a scheduling gap:

1. The pass captures a future weekly-record expiry via the real `seasonDecisionDeadline`.
2. The real Waiver renderer publishes its detailed Decision Board, including a domain HOLD explanation with no actionable pair.
3. Time reaches that expiry before the final pass guard.
4. The guard clears the board. No completion event has queued a successor, and bootstrap has not yet reached `scheduleSeasonDecisionExpiry`.
5. Bootstrap exits with no queued work and no expiry timer. The generic HOLD remains until another external refresh or invalidation.

This proves loss of a detailed, non-actionable domain explanation, not loss of an authoritative ADD/DROP or trade. Expired evidence must still be rejected. Records already expired before a pass are excluded from future scheduling deadlines; their actionability belongs to domain validation. Missing evidence alone does not reproduce this orchestration failure in the harness.

The earliest deadline can come from roster/directory freshness, weekly records, game/weather/odds/kickoff, trade values, legacy evidence or research. There is no Android trace identifying which boundary, context replacement or revision change occurred. Initial Android content provenance and whether it contained valid recommendations remain unknown.

## Candidate and adversarial checks

The smallest candidate requests one successor through the existing queue when an aborted pass still owns the current context and revision and its deadline has expired. It keeps clearing obsolete results; the next pass recomputes with current evidence and domain gates. It does not restore cached recommendations or extend TTLs.

The diagnostic regression first asserts the released failure, then applies this candidate only to a VM copy of the guard. Twelve cold/warm scenarios cover fresh, absent and already expired evidence, completion during Trade or after Waiver, and expiry during publication. Replacement renders settle after one follow-up. Obsolete context/revision tests cannot request an expiry retry; cache checks reject snapshot replacement, model expiry and backward time. Acquisition/scoring are fixture boundaries: this is lifecycle evidence, not end-to-end Android or live-data validation.

A temporary runtime application also passed existing RC4219 adversarial/scorer parity, residual responsiveness (12,000 candidates and 6,804 trade packages), bootstrap order and RC4226 runtime regressions. No scoring, legality, ownership, cooperative yield or navigation logic was changed.

## Strict gate conflict and disposition

One full Strict run on the temporary runtime correction returned **309/320**. Nine entries rejected changed app bytes under the seal and rc4227–rc4230 historical/exact release bindings. Two entries were the same cloud-foundation regression blocked by sandbox permission to create disposable Git repositories.

These are mandatory fail-closed invariants. The correction was removed from `app.js`; its blob is again `9df4c855f9a964c8e730a399dbaa9874a37c81de`. No baseline hash, seal, parser carry-forward receipt, version or release test was weakened. The executable diagnostic retains the proposed correction in memory only. All ten unique failed gates (eleven suite entries) passed individual rechecks after restoring runtime bytes and granting the cloud test its local filesystem permission. The final diagnostic and syntax check passed. The full suite was not repeated; this is not a claim of a single green full-suite run on the final commit.

## Next safe gate

A separately scoped **local** repair package must explicitly authorize evolving the runtime/release binding contracts for this non-diagnostic behavior change, preserving immutable historical receipts and distinguishing the successor from rc4.230's parser-only carry-forward evidence. Apply the proven queue correction there and validate the successor with focused and strict gates. No publication or device work is implied. To attribute the Android symptom specifically, a later authorized diagnostic capture must identify invalidation reason, pass context/revision and crossed deadline; existing physical observations cannot supply those facts.
