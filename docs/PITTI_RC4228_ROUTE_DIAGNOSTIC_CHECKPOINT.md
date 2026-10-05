# RC4.228 individual rank route diagnostic — LOCAL ONLY

Start: canonical main f0234123bb25e509e9f396f9f438a66f81d158b3, tree 2fd0921d559526f9d7123f3719fddf3bd754092a. Production rc4.227, deployment f4d98ddf-dd04-4c41-a40c-a1289a5a7d1f (prior publication receipt). User physical evidence: projections and selected consensus available; adaptive individual coverage/weights zero, ranks null. Selected consensus is not individual evidence. Physical adaptive acceptance remains pending.

Official sources read 2026-10-05:
- https://api.fantasypros.com/public/v2/docs
- https://api.fantasypros.com/public/v2/docs/fantasypros_v2_public.yml

The official OpenAPI `/{sport}/{season}/rankings` GET operation documents week, player, filters, min, range, rankstats, type=DRAFTERS and MLB eligibility. It does **not** document position, scoring, ranking_type or experts=show for this route. These selectors are therefore omitted. `filters` prose describes commas but its regex/example use colons; a single ID 317 avoids that discrepancy. Responses may contain multiple rank types and positional expert counts; counts do not prove authorship.

One bounded representative request: `/nfl/2026/rankings?week={currentSleeperNflWeek}&filters=317&range=true&rankstats=true`. Expected target is Justin Boone/QB/weekly/HALF, but all context and identity must be proven by the response, never inferred from the URL. No speculative nested-rank adapter is implemented. Existing strict single-expert validator plus response chronology/depth/mapping remain required.

The existing explicit acquisition audit adds `individualRankRouteResearch`; normal refresh has zero added research requests. Existing audit requests are preserved. New research budget is one, skipped after existing hard-stop failures/unresolved canonical identity; shared audit flight plus 15-minute or HTTP/retry-after backoff prevents click storms. Diagnostics expose only known structural keys, numeric counts, enum contexts, numeric expert IDs, exact canonical Boone name, safe selector echoes and normalized dates. No raw bodies, keys, headers or arbitrary provider strings are exported.

No authenticated alternate-route evidence available locally. Outcome: DIAGNOSTIC_CANDIDATE_READY / NOT_IMPLEMENTED_PENDING_REAL_EVIDENCE, not adaptive lane fixed. No release binding to rc4.228, no publication, no fantasy transaction, Watcher unchanged.

Authority coupling: normal reseal only; generation v304 retained. Existing RC4227 release fixtures and historical Production authority are immutable and remain historical. Historical regression comparisons remove only the marked diagnostic block and its exact explicit trigger, then require the original complete app Git blob 06192d6bb526867c2314fd2fb78e093dba887b68. Independent RC4228 regressions cover added behavior. This preserves prior assertions without claiming the local diagnostic is the already published runtime.

Validation: focused route/identity/date/normal-acquisition/secret/proxy/selected-panel regressions; exactly one Full Strict after focused PASS. The final Git identity and actual results are supplied in the local gate report. Next gate is separately authorized diagnostic publication, followed by one real explicit audit on the configured app; only reproducible strict real evidence can authorize an adapter.
