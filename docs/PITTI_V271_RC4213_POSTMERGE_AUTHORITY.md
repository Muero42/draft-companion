# v271 rc4.213 postmerge authority

v11.8.0-rc4.213: PR #211 reviewed head 481012802973301f2d9094fbccc1f6488e3e8afd, merged canonical main 158499e1b2395d9313292a0070055d539e5ce7ea, identical reviewed/merged tree d1a2bc6c7d9d5fdba83c03155682d3bf18322318. SOURCE MERGED_CANONICAL; PRODUCTION DEPLOYED_SUCCESS (ad38e02b-0553-4244-b4e4-7677c5090183, check 109061736154); PHYSICAL PENDING. CI/deployment facts are USER_SUPPLIED_EXTERNAL_EVIDENCE; Git parent/tree verified locally after fetch. Postmerge authority failure was runtime version lock drift, not a new runtime defect. Next gate: RC4213_PRODUCTION_PHYSICAL_EVIDENCE_LANES_DIAGNOSTIC_PENDING.

Generation: `20260928T1813Z-v271`. Local timestamp: 2026-09-28T18:13:00Z.

## Root cause

Canonical runtime is rc4.213, but runtime.appVersion was rc4.212 and coupled source/Production/device pointers remained v270/rc4.211. This reconciliation edits authority and tooling only. Exact-head PR211 CI and local 246/246 PASS plus Production SUCCESS are supplied external facts, not rechecked through GitHub or Cloudflare. Postmerge checks failed on runtime version lock drift; their external rerun remains pending.

## Repair scope (unchanged runtime)

DATE metadata treated as exact midnight timestamp; repaired with calendar-date precision, no invented publication time or global TTL extension

ROOT_CAUSE_NOT_PROVEN_FROM_RAW_ROWS; strict position validation unchanged

PROVIDER_EXPERT_IDENTITY_UNPROVEN; fail closed unless exact requested-expert identity established

NO_DISTINCT_LIVE_AUTHORITY_PREDICATE_DEFECT_PROVEN

## Historical rc4.212 physical evidence

```json
{
  "version": "v11.8.0-rc4.212",
  "observed_at": "2026-09-28",
  "acceptance": "PARTIAL_PASS_BOUNDED_HISTORICAL",
  "classification": "RC4212_BOUNDED_PHONE_AND_API_DIAGNOSTIC_RANK_LANES_UNAVAILABLE",
  "evidence_source": "USER_SUPPLIED_PHONE_SCREENSHOTS_AND_API_DIAGNOSTIC",
  "tree": null,
  "evidence_scope": "HISTORICAL_RC4212_ONLY_NOT_RC4213_ACCEPTANCE",
  "week": 3,
  "sleeper_live_age": "<1 Min.",
  "projection_positions": [
    "QB",
    "RB",
    "WR",
    "TE"
  ],
  "projection_records": 488,
  "active_projection_roster": "13/13 usable",
  "roster_players": 16,
  "reserve_ir": 1,
  "start_sit": "LINEUP OPTIMAL visible",
  "trade": "Boone/Yahoo 251/251; Trade Board v8 functioning; no automatic send",
  "broad_ecr": "UNAVAILABLE; HTTP 200 rejected by chronology/position validation",
  "selected_pitti": "UNAVAILABLE; HTTP 200 but returned expert identity unproven",
  "game_context": "AVAILABLE / PASS; 16 games / 32 teams",
  "team_total": "UNAVAILABLE",
  "outdoor_weather": "FAIL_CLOSED_WITHOUT_FRESH_FORECAST"
}
```

rc4.210 remains the last broad physical baseline proving broad ECR, selected PITTI panel, Start/Sit persistence and canonical game context. No physical acceptance transfers to rc4.213. No Team Total/weather fabrication or automatic transaction.

## Local validation

PASS: pitti_guardrail_check (including seal integrity), postmerge-authority-regression (18 mutations and 6 external-evidence negatives), takeover-authority-regression, release-contract-v2 and release-completeness-guard. All 17 runtime Git blobs match parent 158499e1b2395d9313292a0070055d539e5ce7ea. Full strict suite ran once: 246/246 PASS, exit 0, including syntax checks. Subsequent edits only record this receipt and reseal authority metadata. No browser/device tests or external actions.

## Next gate

RC4213_PRODUCTION_PHYSICAL_EVIDENCE_LANES_DIAGNOSTIC_PENDING

After external publication and green authority/postmerge checks, separately authorized rc4.213 Production evidence-lanes canary: Broad ECR DATE repair, projections, RB provider shape, selected PITTI identity, Start/Sit live authority, 16-game/32-team context and D/ST current/+1/+2. No device action authorized in this authority-only task.

## Exact authority/tooling files (14)

- HANDOFF_COMPLETENESS_MATRIX.md
- NEW_CHAT_HANDOFF_CURRENT.md
- PITTI_AUTO_PREFLIGHT.md
- PITTI_COMMAND_CONTRACTS.json
- PITTI_CURRENT_STATE.json
- PITTI_EXECUTION_LOCK.json
- PITTI_HANDOFF_SEAL.json
- PITTI_NEW_CHAT_BOOTSTRAP.md
- PITTI_PROJECT_STATE.md
- README.md
- docs/PITTI_V271_RC4213_POSTMERGE_AUTHORITY.md
- tools/pitti_guardrail_check.mjs
- tools/postmerge-authority-contract.mjs
- tools/postmerge-authority-regression.mjs

The coupled v271 generation requires the current header in the six handoff/bootstrap/project/README documents; historical bodies are preserved. The source allowlist admits rc4.213 specifically because CURRENT now names that version. Dynamic continuation authorization and exact-head checks remain mandatory.

## Same-generation shallow-CI portability correction

Root cause: CI_TEST_PORTABILITY_SHALLOW_CHECKOUT. A local depth-1 clone of the v271 candidate reproduced the missing pinned MAIN object and the original index.html rev-parse failure. The regression now probes the exact parent commit; only if absent in a shallow repository it executes git fetch --no-tags --depth=1 origin 158499e1b2395d9313292a0070055d539e5ce7ea, verifies that commit exists, and runs the unchanged strict 17-file blob comparison. Missing parent in a non-shallow repository, fetch failure and mismatched runtime blobs remain fatal. No unshallow, comparison skip or workflow modification.

Normal repository: PASS, 17/17 parent identity. Disposable depth-1 clone with local file origin and initially missing parent: PASS after exact-parent fetch, 17/17 identity; repository remains shallow. Deliberate index.html mutation in that clone is rejected. The repaired test was overlaid on the candidate checkout before the authorized amend. Generation, rc4.213 classifications and physical gate are unchanged.

Correction validation: normal and shallow postmerge regression PASS (17/17 each); shallow runtime mutation rejected; guardrail, takeover authority, release contract and release completeness checks PASS; syntax and diff checks PASS. Complete strict suite executed once after focused checks: 246/246 PASS. Only this validation receipt and its seal hash were finalized afterward.
