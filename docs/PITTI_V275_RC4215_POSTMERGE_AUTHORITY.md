# v275 rc4.215 post-merge authority reconciliation

Generation: 20260929T1738Z-v275

v11.8.0-rc4.215: PR #215 reviewed head 092f36fa46c90feaf733cc3b7784046beb194c03, merged canonical main 2bd7bb286238f5e6ed4268e952cfc3d8a9dc006c, identical reviewed/merged tree 3ca1006598b3ee843da68e6292f54ec5bd40a9e5. SOURCE MERGED_CANONICAL; PRODUCTION DEPLOYED_SUCCESS (ec99d1fa-6eea-4448-9047-e881bcd025ce, check 109437418574); PHYSICAL PENDING. Premerge Exact-HEAD CI PASS. Postmerge authority-coupled checks failed only on runtime version lock drift while Cloudflare Pages deployed exact main successfully. Next gate: V275_AUTHORITY_PUBLICATION_EXACT_HEAD_CHECKS_PENDING. v275 is authority-only; physical acceptance must bind the future post-v275 canonical main/tree and its successful Production deployment.

Canonical main: `2bd7bb286238f5e6ed4268e952cfc3d8a9dc006c`; tree: `3ca1006598b3ee843da68e6292f54ec5bd40a9e5`.
Runtime: `v11.8.0-rc4.215`; PR #215 reviewed head `092f36fa46c90feaf733cc3b7784046beb194c03`; reviewed/merged tree identity PASS.
Current gate: `V275_AUTHORITY_PUBLICATION_EXACT_HEAD_CHECKS_PENDING`.
published_branch = codex/v275-rc4215-postmerge-authority; published_head = DYNAMIC_VERIFICATION_REQUIRED.
Freshly resolve the remote v275 authority branch HEAD immediately before PR creation and bind PR/CI to that exact observed SHA.

## Verified live identity

- PR #215 final reviewed head: `092f36fa46c90feaf733cc3b7784046beb194c03`.
- PR #215 merge / current canonical main: `2bd7bb286238f5e6ed4268e952cfc3d8a9dc006c`.
- Reviewed tree = merged tree: `3ca1006598b3ee843da68e6292f54ec5bd40a9e5`.
- Cloudflare Pages exact-main deployment: `ec99d1fa-6eea-4448-9047-e881bcd025ce`; check `109437418574`; SUCCESS.
- Premerge Exact-HEAD CI: PASS.
- Postmerge authority-coupled jobs: FAIL only because the execution lock still named rc4.214 while app.js is rc4.215.

## Classification

- SOURCE: MERGED_CANONICAL.
- PRODUCTION: DEPLOYED_SUCCESS.
- PHYSICAL: PENDING.
- Latest actual device observation remains rc4.214 FAIL / NOT ACCEPTED; no rc4.215 physical observation is invented.
- rc4.210 remains the last broad fully accepted physical baseline.

## Runtime boundary

- v275 changes authority/checkpoint/test-contract files only.
- All 17 canonical runtime files must remain byte-identical to PR #215 reviewed head.
- D/ST current/+1/+2 logic and provider retry policy are unchanged.

## Next gate

`V275_AUTHORITY_PUBLICATION_EXACT_HEAD_CHECKS_PENDING`

Freshly verify remote v275 authority branch HEAD -> create v275 authority PR against main -> require Exact-HEAD CI for that observed PR head.

Continuation: fresh remote v275 HEAD -> authority PR against main -> exact-head CI -> merge -> resolve NEW canonical main/tree -> exact-main Production SUCCESS -> `RC4215_PRODUCTION_PHYSICAL_ACCEPTANCE_PENDING`.

After a successful v275 authority-only merge, freshly resolve the new canonical main/tree and require a successful Production deployment of that exact main/tree with the rc4.215 runtime blobs unchanged. Only then is `RC4215_PRODUCTION_PHYSICAL_ACCEPTANCE_PENDING` executable.
