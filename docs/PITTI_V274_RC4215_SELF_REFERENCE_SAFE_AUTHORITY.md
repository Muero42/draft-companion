Handoff generation: `20260929T1322Z-v274`
Generation: `20260929T1322Z-v274`
CURRENT AUTHORITY v274: runtime candidate v11.8.0-rc4.215; published_branch = codex/rc4215-season-live-refresh-repair; publication_status = BRANCH_PUBLISHED_PR_NOT_CREATED; published_head = DYNAMIC_VERIFICATION_REQUIRED. Unmerged, nonproduction, not physically accepted.
Exact-head rule: Freshly resolve remote branch HEAD immediately before PR creation and bind PR/CI to that exact observed SHA.
Canonical main faa6d37971fd6149b039f1b6c5a6106c5e978f10; tree 33f1503af8250f47fa9892d1aeaef27ece5f45fe. Production v11.8.0-rc4.214 DEPLOYED_SUCCESS; PHYSICAL FAIL / NOT ACCEPTED.
Next gate: RC4215_PR_EXACT_HEAD_CI_PENDING. Freshly verify remote branch HEAD -> create rc4.215 PR against main -> require Exact-HEAD CI for that observed PR head.
Continuation: fresh remote HEAD -> PR against main -> exact-head CI -> merge -> resolve new canonical main/tree -> exact-main Production SUCCESS -> RC4215_PRODUCTION_PHYSICAL_ACCEPTANCE_PENDING.
Historical evidence: 74f8751b3d07bd6302fb6d3d4df6f9ff32482475 externally observed published before this follow-up; focused 12/12 PASS; strict 252/252 PASS, Exit 0, exactly once. Historical SHAs are receipts, never immutable future branch HEAD.
Details: docs/PITTI_V274_RC4215_SELF_REFERENCE_SAFE_AUTHORITY.md. No future merge, deployment or physical acceptance claimed.

First published repair head: 860323b908217c11272b74f9e5b2c2a2c417b1c5. Later observed head: 74f8751b3d07bd6302fb6d3d4df6f9ff32482475. Both observations are historical evidence, not self-authority for this commit. Branch publication is complete; PR and exact-head CI remain pending. This package performs no publication.

All 17 runtime files must remain identical to the observed v273 runtime source. rc4.214 bounded positives and failures remain unchanged in coupled authority.
