# RC4.213 local evidence repair

Base: `0e6a0703af8f76b3e6ebfc4652fc382c8fac0c83`.
Input: user-supplied Week-3 diagnostic captured 2026-09-28T08:49:47.051Z.

- Proven defect: broad and selected rank acquisition interpreted DATE publication metadata as midnight UTC and expired September 27 on September 28 morning. Acquisition now treats DATE as a calendar interval intersecting the existing 24-hour window. Today/previous-day dates qualify; older and future dates fail. This does not prove an exact publication hour. Records retain DATE precision, null publication timestamp, and retrieval freshness. Exact timestamp TTL is unchanged.
- RB: the supplied report proves a position rejection, but contains no provider rows proving isolated contamination versus wrong request scope. Position checks remain unchanged. Diagnostics now expose bounded position counts and provider position.
- Selected identity: HTTP 200 and resolved request IDs do not prove returned membership. No actual provider body establishes a changed identity shape. Keep selected ranks unavailable when identity is unproven; broad ranks never substitute. Diagnostics expose only known identity field types, not raw values or payloads.
- Start/Sit: diagnostic and consumer already call the same `seasonLiveAuthority` predicate. No different-predicate defect was established; safety is unchanged. The temporal cause of the reported discrepancy remains unproven.
- Runtime: weekly rank freshness plus bounded diagnostic summaries; coupled app/index/service-worker version references become v11.8.0-rc4.213. No new persistence or runtime file.

Verification uses synthetic fixtures matching supplied counts, not captured provider bodies: previous-day/stale chronology, identity and position rejection, 488 projection records, separate ranking lanes, and 16 games/32 teams with weather and Vegas unavailable where required. Existing acquisition, diagnostic, isolation, worker and lineup regressions are also run. The strict suite is run once on the final candidate; its result is reported with the local commit.

Strict-suite result (one run): 239/246 PASS. Subsequent bounded corrections updated the required manifest/README candidate references, the Boone parity version assertion, and only changed-file hashes in the existing seal. Guardrail, release completeness, rc482/483/484, Boone parity, weekly persistence/retry/diagnostic/quota, backup, cloud security and emergency/parallel/IR checks passed individually afterward. The full suite was not repeated. Its truncated output did not retain one of the seven failing entries, so a fully green final-tree suite is NOT established.

Remaining gate: external complete final-tree strict validation before publication, then physical rc4.213 diagnostic. Confirm broad rank freshness/mapping, preserved 488 projections and 16/32 game context; capture RB providerShape and selected identityFieldTypes. If these do not establish semantics, obtain a sanitized actual provider response before changing validation. Recheck Start/Sit with the same live state and capture time. No production availability is claimed by local fixture tests.
