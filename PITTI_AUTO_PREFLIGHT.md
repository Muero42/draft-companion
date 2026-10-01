Handoff generation: `20261001T0905Z-v281`
Generation: `20261001T0905Z-v281`
CURRENT: Source candidate v11.8.0-rc4.218 LOCAL_UNPUBLISHED. Production remains v11.8.0-rc4.217, PR218 reviewed dcf82193065b3384b211c0e7791a70aa6b34b849, canonical main c7a509e6865ade6e56043f23b19e2577a3755293, tree ea845a05e9bb8e42049d930f029289370b5e15d2, deployment be6f1d5f-b252-4b35-8d22-f34b6806b26b DEPLOYED_SUCCESS. rc4.217 PHYSICAL FAIL / NOT ACCEPTED: RC4217_PHYSICAL_FAIL_REFRESH_RESPONSIVENESS; STARTUP_PLAYER_DIRECTORY_EVENT_LOOP_STARVATION_SUSPECTED, approximately two minutes at stage 2 with blocked interaction. rc4.216 RC4216_PHYSICAL_FAIL_QB_FAAB_FAIL_OPEN and its positive Live/Weekly/DST observations remain historical; CHI->NYJ correct, CIN dedup and W5/W6 MONITOR preserved. rc4.215 RC4215_PHYSICAL_FAIL_DECISION_QUALITY historical; rc4.210 historical broad accepted baseline. rc4.218 physical PENDING, not merged or deployed. Next gate: RC4218_LOCAL_REVIEW_AND_PUBLICATION_PENDING.
Next action: Review the local rc4.218 compact player-directory and cooperative UI candidate. Publication, exact-head CI, merge, Production and physical acceptance require separately authorized gates. Stop after the tested local commit.
Repair: bounded compact server directory; one CacheStorage entry (2 MiB), six-hour source TTL, roster shell before refresh, cooperative rendering and coalesced Weekly/Trade rerenders. No raw directory on normal browser startup. No localStorage directory object.
AUTO: keine Zwischenmeldungen, keine leeren Antworten, kein „AUTO läuft weiter“. STATUS = nur Status. Externe/irreversible Aktionen nur nach Freigabe. PITTI Codex Budget Guard in AGENTS.md/Command Contracts bleibt verpflichtend.

## HISTORICAL v280 POSTMERGE CHECKPOINT

Handoff generation: `20261001T0825Z-v280`
Generation: `20261001T0825Z-v280`
CURRENT: Source and Production v11.8.0-rc4.217; PR218 MERGED, reviewed dcf82193065b3384b211c0e7791a70aa6b34b849, canonical main c7a509e6865ade6e56043f23b19e2577a3755293, identical reviewed/merged tree ea845a05e9bb8e42049d930f029289370b5e15d2, deployment be6f1d5f-b252-4b35-8d22-f34b6806b26b DEPLOYED_SUCCESS. Exact PR-head CI PASS; postmerge 8/8 SUCCESS; cloud STRICT_SUITE 254/254 PASS (job 110277133766). rc4.217 physical PENDING / NOT ACCEPTED. Latest physically observed rc4.216 remains historical FAIL / NOT ACCEPTED: RC4216_PHYSICAL_FAIL_QB_FAAB_FAIL_OPEN. Positive W4 evidence preserved; CHI->NYJ correct; CIN not duplicated; W5/W6 MONITOR. rc4.215 RC4215_PHYSICAL_FAIL_DECISION_QUALITY remains historical; rc4.210 remains historical broad accepted baseline. Next gate: RC4217_PRODUCTION_PHYSICAL_ACCEPTANCE_PENDING.
Next action: Await separately authorized rc4.217 physical acceptance against canonical main c7a509e6865ade6e56043f23b19e2577a3755293 and its successful Production deployment. No automatic device action, push, PR, merge or deployment. Local v280 authority commit is not the deployed canonical commit.
Historical rc4.216 Physical positives: Sleeper <1 Min.; W4 1376 records ~1 Min.; Broad ECR, PITTI Panel and QB/RB/WR/TE projections AVAILABLE; unsupported skill ADD/DROP HOLD; CIN not duplicated. Opponents MIN->MIA, BUF->NE, CHI->NYJ, CLE->PIT, ATL->NO, ARI->NYG, DET->CAR, LAC->SEA correct. W5/W6 fail closed. No D/ST change authorized.
AUTO: keine Zwischenmeldungen, keine leeren Antworten, kein „AUTO läuft weiter“. STATUS = nur Status. Externe/irreversible Aktionen nur nach Freigabe. Vollstaendiger PITTI Codex Budget Guard in AGENTS.md und Command Contracts bleibt verpflichtend.
Validation scope: authority/guardrail/seal checks and 17/17 canonical runtime identity; no Runtime-suite rerun for this authority-only checkpoint. Physical remains unauthorized in this task.

## HISTORICAL v279 PREPUBLICATION CHECKPOINT

Handoff generation: `20260930T1926Z-v279`
Generation: `20260930T1926Z-v279`
CURRENT: Source candidate v11.8.0-rc4.217 LOCAL_UNPUBLISHED; bounded QB FAAB fail-closed repair. Production remains rc4.216 PR217 reviewed 84a87966409ce1420d6462c6bce62177d3adaf44, canonical main 4d78271c325426c85e94e12be6e521547cdeaa34, tree e1db9d94109f1f2ec6ba4e7a8a9fc5f2baf4fe3d, deployment 6804fdb6-e9d7-4530-b1b6-188f24329a50 DEPLOYED_SUCCESS. rc4.216 PHYSICAL FAIL / NOT ACCEPTED: RC4216_PHYSICAL_FAIL_QB_FAAB_FAIL_OPEN. Positive W4 evidence and all eight D/ST opponents preserved; CHI->NYJ correct, no mapping repair. W5/W6 MONITOR correct; transient duplicate MONITOR not reproducible. rc4.215 RC4215_PHYSICAL_FAIL_DECISION_QUALITY remains historical; rc4.210 remains broad accepted baseline. Next gate: RC4217_LOCAL_REVIEW_AND_PUBLICATION_PENDING.
Next action: Review the local rc4.217 QB FAAB fail-closed candidate. Publication, PR, exact-head CI, merge, new-main Production verification and physical acceptance require their separately authorized gates. Stop after the tested local commit.
Physical positives: Sleeper <1 Min.; W4 1376 records ~1 Min.; Broad ECR, PITTI Panel and QB/RB/WR/TE projections AVAILABLE; unsupported skill ADD/DROP HOLD; CIN not duplicated. Opponents MIN->MIA, BUF->NE, CHI->NYJ, CLE->PIT, ATL->NO, ARI->NYG, DET->CAR, LAC->SEA correct. W5/W6 fail closed. No D/ST change authorized.
Regression reproduced the rc4.216 PITTI percentage band without structural acquisition. rc4.217 reuses waiverMarketSummary sufficiency; no bid without verified structural/weekly and 9/9 market evidence; existing QB penalties preserved.
AUTO: keine Zwischenmeldungen, keine leeren Antworten, kein „AUTO läuft weiter“. STATUS = nur Status. Externe/irreversible Aktionen nur nach Freigabe. Budget Guard bleibt verpflichtend. Kein Push, PR, Merge, Deployment oder Physical-Test. Preserve intentional local v278 parent ebe9b05dfbc344d6487068a0e84a9f5937728bd3.

## HISTORICAL v278 RC4216 HANDOFF

Handoff generation: `20260930T1717Z-v278`
Generation: `20260930T1717Z-v278`
CURRENT: Source and Production: v11.8.0-rc4.216; PR217 MERGED, reviewed head 84a87966409ce1420d6462c6bce62177d3adaf44, canonical main 4d78271c325426c85e94e12be6e521547cdeaa34, identical reviewed/merged tree e1db9d94109f1f2ec6ba4e7a8a9fc5f2baf4fe3d. Production DEPLOYED_SUCCESS: 6804fdb6-e9d7-4530-b1b6-188f24329a50 (check 109981281507). Post-merge 8/8 checks SUCCESS; cloud STRICT_SUITE 254/254 PASS. rc4.216 physical PENDING / NOT ACCEPTED. Latest physical observation remains rc4.215: RC4215_PHYSICAL_FAIL_DECISION_QUALITY, with positive Live/RETRIEVAL evidence preserved. rc4.210 remains the prior broad physical baseline. Next gate: RC4216_PRODUCTION_PHYSICAL_ACCEPTANCE_PENDING.
Next action: Await separately authorized rc4.216 physical acceptance against canonical main 4d78271c325426c85e94e12be6e521547cdeaa34 and its successful Production deployment. No automatic device action, push, PR, merge or deployment. Local handoff commit is not the deployed canonical commit.
Local branch: codex/rc4216-waiver-dst-decision-quality; handoff-only commit is local/unpublished and must never be confused with canonical Production main. Runtime remains identical to the merged 17-file runtime.
AUTO: keine Zwischenmeldungen; keine leeren Antworten; niemals "AUTO läuft weiter" als Fortsetzungsersatz. STATUS = ausschließlich Status, keine Aktionen. Externe oder irreversible Aktionen nur nach ausdrücklicher Freigabe. PITTI CODEX BUDGET GUARD bleibt verpflichtend: nur lokales, begrenztes Engineering; keine Runtime-/Feature-Änderung in diesem Handoff; keine erneuten Tests ohne konkreten Authority-Widerspruch; kein Push, PR, Merge, Deployment oder Physical-Test. Nach sauberem lokalem Handoff-Commit STOP.

## HISTORICAL v277 PRE-MERGE CHECKPOINT

Handoff generation: `20260930T0938Z-v277`
Generation: `20260930T0938Z-v277`
CURRENT: v11.8.0-rc4.216 PUBLISHED_PR_CANDIDATE (PR217 OPEN) candidate on codex/rc4216-waiver-dst-decision-quality. Canonical main e325e952c1e7ea93da3572afb1bef70337f0a5e8; tree b0eac858e6b6314b6a4e313960c50686bd236e56.
rc4.215 Production DEPLOYED_SUCCESS; PHYSICAL FAIL / NOT ACCEPTED: RC4215_PHYSICAL_FAIL_DECISION_QUALITY. Live refresh, <1 Min. Sleeper state, correct roster, W4 projections and resolved RETRIEVAL time failure physically confirmed. Waiver relevance/negative-score and D/ST ranking/duplicate/evidence defects remain. rc4.216 is a PUBLISHED_PR_CANDIDATE (PR217 OPEN) runtime candidate; Jefferson is not a defect; rc4.210 remains the broad accepted physical baseline.
Next gate: RC4216_PR217_CORRECTIVE_HEAD_PUBLICATION_PENDING. Publish the local PR217 authority correction only when authorized; freshly resolve PR217 head and require exact-head CI. Merge and Production remain separate future gates; resolve new canonical main/tree and exact-main deployment before rc4.216 physical acceptance.
No future commit, package, deployment or physical acceptance claimed. D/ST current-week acquisition is independent; +1/+2 remain fail-closed without verified evidence.
Details: docs/PITTI_RC4216_DECISION_QUALITY.md.

Source lock: rc4.216. Production and latest physical observation: rc4.215, RC4215_PHYSICAL_FAIL_DECISION_QUALITY. PR217 is not merged; rc4.216 has no deployment or physical acceptance. Observed f08ea197e4252aabe0d3e024c4b1078deda02f82 CI 5/5 SUCCESS and cloud strict 254/254 PASS are historical exact-head receipts; the corrective head requires fresh verification.

## HISTORICAL v275 CHECKPOINT

Handoff generation: `20260929T1738Z-v275`
Generation: `20260929T1738Z-v275`
## CURRENT AUTHORITY v275 — rc4.215 post-merge reconciliation
v11.8.0-rc4.215: PR #215 reviewed head 092f36fa46c90feaf733cc3b7784046beb194c03, merged canonical main 2bd7bb286238f5e6ed4268e952cfc3d8a9dc006c, identical reviewed/merged tree 3ca1006598b3ee843da68e6292f54ec5bd40a9e5. SOURCE MERGED_CANONICAL; PRODUCTION DEPLOYED_SUCCESS (ec99d1fa-6eea-4448-9047-e881bcd025ce, check 109437418574); PHYSICAL PENDING. Premerge Exact-HEAD CI PASS. Postmerge authority-coupled checks failed only on runtime version lock drift while Cloudflare Pages deployed exact main successfully. Next gate: V275_AUTHORITY_PUBLICATION_EXACT_HEAD_CHECKS_PENDING. v275 is authority-only; physical acceptance must bind the future post-v275 canonical main/tree and its successful Production deployment.
Canonical main: `2bd7bb286238f5e6ed4268e952cfc3d8a9dc006c`; tree: `3ca1006598b3ee843da68e6292f54ec5bd40a9e5`.
Runtime: `v11.8.0-rc4.215`; PR #215 reviewed head `092f36fa46c90feaf733cc3b7784046beb194c03`; reviewed/merged tree identity PASS.
Postmerge CI classification: authority-only failure — `RUNTIME_VERSION_LOCK_DRIFT_ONLY`; Cloudflare Pages exact-main deployment SUCCESS.
Current gate: `V275_AUTHORITY_PUBLICATION_EXACT_HEAD_CHECKS_PENDING`.
published_branch = codex/v275-rc4215-postmerge-authority; published_head = DYNAMIC_VERIFICATION_REQUIRED.
Freshly resolve the remote v275 authority branch HEAD immediately before PR creation and bind PR/CI to that exact observed SHA.
Continuation: fresh remote v275 HEAD -> authority PR against main -> exact-head CI -> merge -> resolve NEW canonical main/tree -> exact-main Production SUCCESS -> `RC4215_PRODUCTION_PHYSICAL_ACCEPTANCE_PENDING`.
Physical: rc4.215 PENDING and not executable before the post-v275 exact-main deployment. Latest device evidence remains rc4.214 FAIL / NOT ACCEPTED; rc4.210 remains the last broad accepted baseline.
17 runtime files are unchanged by v275.

## HISTORICAL v274 CHECKPOINT — superseded by v275
Handoff generation: `20260929T1322Z-v274`
Generation: `20260929T1322Z-v274`
CURRENT AUTHORITY v274: runtime candidate v11.8.0-rc4.215; published_branch = codex/rc4215-season-live-refresh-repair; publication_status = BRANCH_PUBLISHED_PR_NOT_CREATED; published_head = DYNAMIC_VERIFICATION_REQUIRED. Unmerged, nonproduction, not physically accepted.
Exact-head rule: Freshly resolve remote branch HEAD immediately before PR creation and bind PR/CI to that exact observed SHA.
Canonical main faa6d37971fd6149b039f1b6c5a6106c5e978f10; tree 33f1503af8250f47fa9892d1aeaef27ece5f45fe. Production v11.8.0-rc4.214 DEPLOYED_SUCCESS; PHYSICAL FAIL / NOT ACCEPTED.
Next gate: RC4215_PR_EXACT_HEAD_CI_PENDING. Freshly verify remote branch HEAD -> create rc4.215 PR against main -> require Exact-HEAD CI for that observed PR head.
Continuation: fresh remote HEAD -> PR against main -> exact-head CI -> merge -> resolve new canonical main/tree -> exact-main Production SUCCESS -> RC4215_PRODUCTION_PHYSICAL_ACCEPTANCE_PENDING.
Historical evidence: 74f8751b3d07bd6302fb6d3d4df6f9ff32482475 externally observed published before this follow-up; focused 12/12 PASS; strict 252/252 PASS, Exit 0, exactly once. Historical SHAs are receipts, never immutable future branch HEAD.
Details: docs/PITTI_V274_RC4215_SELF_REFERENCE_SAFE_AUTHORITY.md. No future merge, deployment or physical acceptance claimed.

## HISTORICAL v273 CHECKPOINT — superseded by v274

Handoff generation: `20260929T1200Z-v273`
Generation: `20260929T1200Z-v273`
CURRENT AUTHORITY v273: runtime candidate v11.8.0-rc4.215; branch PUBLISHED at 860323b908217c11272b74f9e5b2c2a2c417b1c5; PR not yet created, unmerged, nonproduction, not physically accepted. This corrective commit remains LOCAL_UNPUBLISHED.
Canonical main faa6d37971fd6149b039f1b6c5a6106c5e978f10; tree 33f1503af8250f47fa9892d1aeaef27ece5f45fe. Production v11.8.0-rc4.214 DEPLOYED_SUCCESS; PHYSICAL FAIL / NOT ACCEPTED.
Next gate: RC4215_PUBLICATION_EXACT_HEAD_CI_PENDING. External corrective publication / PR exact-head CI -> merge -> resolve NEW canonical main/tree -> exact-main Production SUCCESS -> RC4215_PRODUCTION_PHYSICAL_ACCEPTANCE_PENDING.
Bounded rc4.214 positives: projections, Broad ECR, selected PITTI, RB containment, healthy persistence, 13/13 Start/Sit, Game Context 16/32. Failures: WAIVER_RETRIEVAL_INVALID_TIME_VALUE; LIVE_AUTHORITY_EXPIRES_WITHOUT_LIGHTWEIGHT_RECOVERY; DST_PHYSICAL_GATE_NOT_COMPLETED.
Known final published-head receipt: 252/252 PASS, exit 0 at 860323b908217c11272b74f9e5b2c2a2c417b1c5. Future main/tree/deployment/acceptance are not claimed.
Details: docs/PITTI_V273_RC4215_PRE_PR_AUTHORITY.md and docs/PITTI_RC4215_SEASON_REPAIR.md.

## HISTORICAL v272 CHECKPOINT — superseded by v273 authority above

Handoff generation: `20260928T1918Z-v272`
Generation: `20260928T1918Z-v272`
> **CURRENT AUTHORITY — v272**: v11.8.0-rc4.214: PR #213 reviewed head 63162c9427fa70f1897331c15ffb2c6a38d50701, rc4.214 runtime merge / v272 parent a1e6c0e4ca22a4709353840d78414f2ba6d3d5ee, identical reviewed/merged tree 2ebb61df4f077f419b91b048d321781b43785332. SOURCE MERGED_CANONICAL; PRODUCTION DEPLOYED_SUCCESS (a10c3257-2342-4fa4-a15a-d191306199b1, check 109091210171); PHYSICAL PENDING. CI/deployment facts are USER_SUPPLIED_EXTERNAL_EVIDENCE; Git parent/tree verified locally after fetch. Postmerge authority failure was runtime version lock drift, not a new runtime defect. Next gate: V272_AUTHORITY_PUBLICATION_EXACT_HEAD_CHECKS_PENDING.

Externally publish the corrective v272 authority candidate and obtain exact-head checks; then merge v272 and obtain postmerge checks, resolve NEW canonical main/tree from fresh evidence, and verify successful Production deployment of that exact new main/tree with rc4.214 and 17 runtime blobs identical to the rc4.214 runtime merge/base. Only then enable RC4214_PRODUCTION_COMBINED_PHYSICAL_ACCEPTANCE_PENDING. No physical/device action is currently executable.

Details: `docs/PITTI_V272_RC4214_POSTMERGE_AUTHORITY.md`. rc4.214 PHYSICAL PENDING; rc4.213 and rc4.212 diagnostics are historical and bounded; rc4.210 remains last broad fully accepted physical baseline.


Current v272 state: LOCAL CORRECTIVE AUTHORITY CANDIDATE; publication/merge/postmerge and post-v272 Production evidence pending. The known PR213 Production deployment does not prove deployment of the future v272 merge. Future canonical main/tree must be freshly resolved; the physical acceptance binds to that new main/tree and its successful Production deployment. rc4.213 is the newest historical bounded observed installation, not accepted; rc4.210 remains the last broad accepted baseline.

## HISTORICAL v271 AND EARLIER — NOT CURRENT AUTHORITY

Handoff generation: `20260928T1813Z-v271`
Generation: `20260928T1813Z-v271`
> **HISTORICAL AUTHORITY — v271**: v11.8.0-rc4.213: PR #211 reviewed head 481012802973301f2d9094fbccc1f6488e3e8afd, merged canonical main 158499e1b2395d9313292a0070055d539e5ce7ea, identical reviewed/merged tree d1a2bc6c7d9d5fdba83c03155682d3bf18322318. SOURCE MERGED_CANONICAL; PRODUCTION DEPLOYED_SUCCESS (ad38e02b-0553-4244-b4e4-7677c5090183, check 109061736154); PHYSICAL PENDING. CI/deployment facts are USER_SUPPLIED_EXTERNAL_EVIDENCE; Git parent/tree verified locally after fetch. Postmerge authority failure was runtime version lock drift, not a new runtime defect. Next gate: RC4213_PRODUCTION_PHYSICAL_EVIDENCE_LANES_DIAGNOSTIC_PENDING.

After external publication and green authority/postmerge checks, separately authorized rc4.213 Production evidence-lanes canary: Broad ECR DATE repair, projections, RB provider shape, selected PITTI identity, Start/Sit live authority, 16-game/32-team context and D/ST current/+1/+2. No device action authorized in this authority-only task.

Detailed reconciliation: `docs/PITTI_V271_RC4213_POSTMERGE_AUTHORITY.md`. Historical records below do not confer rc4.213 physical acceptance.

## HISTORICAL v270 AND EARLIER

Handoff generation: `20260927T1958Z-v270`
> **HISTORICAL AUTHORITY — v270 (`20260927T1958Z-v270`)**: v11.8.0-rc4.211 remains the 17-file runtime. PR #207 trade-rationale repair is Production-physically accepted after exact deployed main 90fbbfea411ade27f8ed249d771de12a026b9f15 / tree 689f57f968e3ddf71ad827cec5b361f0ed2a0d7a, Cloudflare deployment 4804403c-1728-4bab-82b4-9a31de984fd4. The 2026-09-27 21:58 CEST phone canary shows Sleeper <1 Min., Week-3 FantasyPros projections QB/RB/WR/TE AVAILABLE, Justin-Boone/Yahoo 251/251, and GIVE George Pickens / GET Brock Bowers with corrected neutral "Roster-Fit verbessert"; the unsupported "Bedarf RB wird adressiert" claim is absent. Bilateral gain, market 40.0/39.0, conservative acceptance heuristic and no-auto-send remain. Classification: PR207_PRODUCTION_TRADE_RATIONALE_PHYSICAL_PASS_ROSTER_FIT_NEUTRAL. Broad ECR, selected PITTI Panel and full game-context are not reaccepted by this bounded canary; Team Total remains UNAVAILABLE_NO_APPROVED_SOURCE_IN_RUNTIME; PEAKED_SOURCE_CONTRACT_NOT_VERIFIED. Next gate: VERIFY_CANONICAL_AUTHORITY_THEN_AUTHORIZED_WORK.

## HISTORICAL/SUPERSEDED v269 AND EARLIER — NOT CURRENT PRODUCTION

> **HISTORICAL AUTHORITY — v269 (`20260927T1930Z-v269`)**: v11.8.0-rc4.211 remains the 17-file runtime. PR #207 reviewed head e4fa9077fa130ee9129ed8ef532dfda503270f97, merged as main 4f503ecd9bdb2efde6750583ff8dfc92dffafcb1, identical reviewed/merged tree e496f5b8190b48c7a475bdba768b968575d40ca2; Cloudflare Pages deployment 6890109e-fbcc-44b7-81c3-26835b35b208 / check 108690436763 SUCCESS for exact main. The bounded runtime delta is trade-rationale presentation only: the unverified positional claim derived from t.oppNeeds[0] was replaced by neutral truthful "Roster-Fit verbessert"; app blob c065c7bbf1877bfb7931045bc68dc99bf8aa306b, focused regression blob 2ab7c89b530b723209e39c0ffb49b7868428c5ef. Codex focused trade regressions PASS, full strict suite 240/240 PASS, exact-head PR CI PASS, and postmerge CI PASS. Boone source/values, seasonTradeDecision, seasonProjectionLineup, bilateral gain, capacity, fairness, conservative acceptance and no-auto-send semantics are unchanged. Current exact-tree Production physical canary is PENDING. Historical PR205 Boone physical PASS remains historical only on tree 8825347883a2eee0fd53f7d45514580b246de08e and is not inherited by this changed app.js tree. Broad ECR, selected PITTI Panel and full game-context are not reaccepted here; Team Total remains UNAVAILABLE_NO_APPROVED_SOURCE_IN_RUNTIME; PEAKED_SOURCE_CONTRACT_NOT_VERIFIED. Next gate: PR207_PRODUCTION_TRADE_RATIONALE_PHYSICAL_CANARY_PENDING.

## HISTORICAL/SUPERSEDED v268 AND EARLIER — NOT CURRENT PRODUCTION

> **HISTORICAL AUTHORITY — v268 (`20260927T1754Z-v268`)**: v11.8.0-rc4.211 remains the 17-file runtime. PR #205 reviewed head dc00ef71688f74ba740ec227330a19f7d7e71023, merged as main 2f15bba5dd78e8b4993631c60003b6ae59a930cd, identical reviewed/merged tree 8825347883a2eee0fd53f7d45514580b246de08e; Cloudflare Pages deployment cfc7aea7-031d-45e8-97ae-2a50fc949142 / check 108670306726 SUCCESS for exact main. Post-deploy phone canary at 2026-09-27 19:54 CEST physically showed Week 3 live Sleeper state, weekly projections AVAILABLE for QB/RB/WR/TE, Justin-Boone/Yahoo trade values 251/251 mapped, and a concrete Trade Offer Board consumer using current values; no trade is sent automatically. Classification: RC4.211_PR205_PRODUCTION_BOONE_PHYSICAL_PASS_251_251_TRADE_CONSUMER. Physical scope is bounded: Broad ECR and selected PITTI Panel remained unavailable/fail-closed in the observation; full game-context was not reaccepted; Team Total remains UNAVAILABLE_NO_APPROVED_SOURCE_IN_RUNTIME; PEAKED_SOURCE_CONTRACT_NOT_VERIFIED. Separate open finding: TRADE_OPPONENT_NEED_RATIONALE_MISMATCH: the visible opponent rationale can name the highest generic opponent need (oppNeeds[0]) instead of the position actually addressed by the offered GIVE package; observed as 'Bedarf RB wird adressiert' for GIVE George Pickens (WR) / GET Brock Bowers (TE). Trade legality, Boone values, fairness and bilateral lineup-gain checks remain separately computed. Next gate: TRADE_OPPONENT_NEED_RATIONALE_MISMATCH_BOUNDED_REPAIR.

## HISTORICAL/SUPERSEDED v267 AND EARLIER — NOT CURRENT PRODUCTION

> **HISTORICAL AUTHORITY — v267 (`20260927T1047Z-v267`)**: v11.8.0-rc4.211 remains the 17-file runtime. PR #203 reviewed head 84eea443886dd7fb0bdc5a1b11567e671ee8942d, merged main 7b2ac9c7aaf1383ca303a609c3db35d023d0596e, identical reviewed/merged tree 168846f85f6bf78a753b68540d1f21737a853e6f; Production deployment/check 4acd1861-4047-46c2-812e-524dba2d59a9 SUCCESS. Premerge exact-head and postmerge CI PASS are user-supplied external evidence, not independently inspected by Codex. Bounded delta: shared strong Boone source boundary; seasonTradeDecision and seasonProjectionLineup bodies unchanged, 16 parity decisions identical, native values unchanged, generic/legacy valuation bypass closed. Current exact-tree physical acceptance is PENDING. Historical rc4.211 bounded physical PASS applies only to tree b93018542ab7402b228b986e627e02aeffcabdc1, never this new tree. rc4.210 remains LAST_BROAD_PHYSICAL_EVIDENCE_BASELINE; no broader lanes newly observed. Team Total remains UNAVAILABLE_NO_APPROVED_SOURCE_IN_RUNTIME; outdoor weather fail-closed without fresh verified forecast. PEAKED_SOURCE_CONTRACT_NOT_VERIFIED. No automatic fantasy transaction. Gate: `PR203_PRODUCTION_SOURCE_BOUNDARY_DEPLOYED_CI_PASS_EXACT_TREE_PHYSICAL_ACCEPTANCE_PENDING`. Reconciled UTC: 2026-09-27T10:47:37Z. Evidence: `docs/PITTI_BRIDGE_HANDOFF_V267_PR203_PRODUCTION_PHYSICAL_PENDING_2026-09-27.md`. Handoff readiness is structural only; no device acceptance is implied.

## HISTORICAL/SUPERSEDED v266 AND EARLIER — NOT CURRENT PRODUCTION

> **HISTORICAL BOUNDED PHYSICAL AUTHORITY — v266 (`20260926T1839Z-v266`)**: v11.8.0-rc4.211 is canonical source + Production via PR #200 reviewed head e3503a9f5a06e37d7d9795051d0a18eb06caa65e, main@84971e64b89757f2b59e6f4cae7891fd8c372843, tree b93018542ab7402b228b986e627e02aeffcabdc1, deployment 2564389d-2890-4d76-a582-ed66c0eb7185 / check 108449050892. Bounded physical PASS: RC4.211_PHYSICAL_PASS_STALE_SPECIAL_TEAMS_GUARD_AND_WEEK_LABEL_CONFIRMED. rc4.210 remains LAST_BROAD_PHYSICAL_EVIDENCE_BASELINE for Weekly Evidence, selected PITTI panel, Start/Sit persistence and Game Context. Current Preview weekly evidence was not loaded; unavailable is not a proven regression. Team Total remains UNAVAILABLE_NO_APPROVED_SOURCE_IN_RUNTIME; outdoor weather remains fail-closed without fresh verified forecast. Gate: `RC4211_PRODUCTION_BOUNDED_PHYSICAL_ACCEPTED`. Reconciliation timestamp: `2026-09-26T18:39:41Z`. Supplied external and physical evidence: `docs/PITTI_BRIDGE_HANDOFF_V266_RC4211_PRODUCTION_BOUNDED_PHYSICAL_PASS_2026-09-26.md`; no new device observation by Codex.

> **HISTORICAL LAST BROAD PHYSICAL EVIDENCE BASELINE — v265 (`20260924T0945Z-v265`)**: `v11.8.0-rc4.210` is canonical source and Production authority at `main@27c1429a455a5507406a3c9c7ddda0531070f30b` (tree `dbd808856a0e56fcfc899977a072360ded3f119a`), Cloudflare deployment `8c2d3d2f-232a-4d79-a6c7-80639d3b7052` (check run `107578665328`). PR #198 reviewed head `b18151d4b51189634afd0403e6d7c850db579102` was squash-merged only after exact-head CI/preview PASS and physical rc4.210 exact-tree acceptance. The physical preview proved Weekly Projections and Broad ECR AVAILABLE for QB/RB/WR/TE, Selected PITTI Panel AVAILABLE with all four filtered requests HTTP 200, Week-3 positional-rank persistence into roster/Start-Sit, canonical Game Context PASS with 16 games/32 teams, and secret safety. Production deployed the identical Git tree. The first post-merge authority-coupled checks failed only on stale v263 `runtime version lock drift`; Cloudflare Production itself succeeded. Team Total remains fail-closed unavailable; outdoor weather remains fail-closed without a fresh verified forecast. Gate: `RC4210_PRODUCTION_PHYSICAL_ACCEPTED`.

> **HISTORICAL AUTHORITY — v262 (`20260920T1624Z-v262`)**: `v11.8.0-rc4.206` is canonical **source authority** after authorized PR #191 was squash-merged from reviewed head `888b0a8f62608ff2afabf3564409f0198f78e8fd` as `main@d5954d66877df877f950a4a41f32baad59a66748` (tree `07248a6ac3c5f8872893a2c805155be8a1a5e806`). PR #191 exact-head candidate validation passed Guardrails, Behavioral Contract, Candidate Package, PITTI Cloud Validation and Cloudflare Preview before merge. The first post-merge run on `d5954d66877df877f950a4a41f32baad59a66748` showed Cloudflare Pages PASS while authority-coupled gates failed because the repository still encoded the v260/rc4.205 diagnosis checkpoint; this v262 reconciliation repairs that checkpoint drift and does not roll back runtime bytes. **Production/device authority remains v11.8.0-rc4.205** at `66a6551d4a4520bd06f3b77a2f6bbdb297bfe6f1` with physical classification `RC4.205_PR186_PHYSICAL_PASS_LAWRENCE_MAPPING_AND_GAME_CONTEXT_FAILURE_PROVENANCE`. Selected weekly PITTI-panel and bounded ESPN game-context repairs are source-implemented but not Production/device verified. Broad weekly ECR remains separate. Team Total remains fail-closed unavailable. `v11.8.0-rc4.206` is **not Production/device accepted** by this checkpoint. Next gate: `ELIGIBLE_FOR_SEPARATELY_AUTHORIZED_PRODUCTION_DEPLOYMENT_GATE`. The invalid local ghost v261 is not restored.

> **CURRENT AUTHORITY — v260 (`20260920T1100Z-v260`)**: Independent Evidence Lane Diagnosis is complete on canonical `main@2a08f856c7e72b0e1a9667e47e3e4467790d0f98`. Broad current weekly Expert-Ranks are physically AVAILABLE. The selected PITTI-Panel is still unavailable because the Season weekly path consumes broad FantasyPros consensus only while selected-expert ingestion remains draft/preseason (`week=0` / DRAFT) infrastructure. FantasyPros documents expert-ID filtering and a rankings/experts endpoint, so a bounded current-week selected-expert repair is technically viable but not yet implemented. Canonical game-context data remains unavailable because Production receives ESPN upstream HTTP 403; sanitized failure provenance is already physically proven. Team Total has no approved runtime total+spread source, although the existing `impliedTeamTotal` helper is ready for a future verified same-event pair. Opponent/weather remains dependent on complete game context and fresh event weather. Next gate: `SEPARATELY_AUTHORIZED_INDEPENDENT_EVIDENCE_LANE_BOUNDED_REPAIR`. Earlier v259 statements below are historical.

> **CURRENT AUTHORITY — v259 (`20260920T1036Z-v259`)**: v11.8.0-rc4.205 PR #186 repair is Production-deployed at exact `main@66a6551d4a4520bd06f3b77a2f6bbdb297bfe6f1` (deployment `ec6cd004-6e54-480f-8752-e8e37755ac66`, Cloudflare Pages check `106063674827` PASS) and now has a user-supplied bounded physical PASS: QB projections 80/80 mapped, active roster 13/13 usable, and canonical game-context failure provenance physically returns sanitized HTTP 502 / upstream 403 / `UPSTREAM_HTTP_ERROR`. Game-context data itself remains unavailable. Broad current Expert-Ranks are AVAILABLE, but PITTI-Panel is not proven. Team Total and opponent/weather remain unavailable/fail-closed. Physical classification: `RC4.205_PR186_PHYSICAL_PASS_LAWRENCE_MAPPING_AND_GAME_CONTEXT_FAILURE_PROVENANCE`. Next gate: `SEPARATELY_AUTHORIZED_INDEPENDENT_EVIDENCE_LANE_DIAGNOSIS`. Earlier v258 statements below are historical.

> **CURRENT AUTHORITY — v258 (`20260920T1011Z-v258`)**: v11.8.0-rc4.205 PR #186 repair is Cloudflare Production-deployed from exact `main@6f2ea5cc5db94a3ddff2370cf9b4f4d7b5983c80` (deployment `a3342287-3b3b-4961-9819-f2fac696b743`, Cloudflare Pages check `106050669714` PASS). Reviewed runtime/source provenance remains PR #186 head `9c407d5a705713a630d7e62f020b72b48169d131`, merge `01ceef33dba6d79be48461d85532a1e2a39bd9aa`, tree `d1c9e2660e60d305a8a1f4727404d676e83c2164`; runtime blobs are unchanged by the v257 authority-only merge. Exact-commit deployment identity is proven; arbitrary public served-byte parity is not independently claimed. The prior physical PASS remains bounded to the earlier Sleeper timeout repair. The PR #186 Lawrence/game-context repair is **not yet physically/device verified**. Next gate: `RC4.205_PR186_PHYSICAL_DEVICE_VERIFICATION_PENDING`. Earlier v257 statements below are historical.

> **CURRENT AUTHORITY — v257 (`20260920T0835Z-v257`)**: PR #186 is merged into canonical source `main@01ceef33dba6d79be48461d85532a1e2a39bd9aa` from exact reviewed head `9c407d5a705713a630d7e62f020b72b48169d131`, tree `d1c9e2660e60d305a8a1f4727404d676e83c2164`. This new main is **source authority only**; no Production deployment of `01ceef33dba6d79be48461d85532a1e2a39bd9aa` is proven. Production/device authority remains v11.8.0-rc4.205 runtime source `cdf7510034ffea179accd1e855f351775cef492f`, physically accepted only for the bounded Sleeper week-context timeout repair. Expert-Ranks/Ranks, PITTI-Panel, QB projections, Team Total, and opponent/weather remain unavailable/fail-closed. Next gate: `ELIGIBLE_FOR_SEPARATELY_AUTHORIZED_PRODUCTION_DEPLOYMENT_GATE`. Earlier v256 statements below are historical.

> **CURRENT AUTHORITY — v256 (`20260919T1813Z-v256`)**: RC4.205 authority is reconciled through `main@2fca8f155d195df7521b5810b31bf71c58fc8358`, preserving runtime-source lineage `cdf7510034ffea179accd1e855f351775cef492f`. Physical Android verification PASSED the bounded Sleeper week-context timeout repair. Expert-Ranks/Ranks, PITTI-Panel, QB projections, Team Total, and opponent/weather remain unavailable/fail-closed. Next gate: `SEPARATELY_AUTHORIZED_INDEPENDENT_EVIDENCE_LANE_DIAGNOSIS`. Earlier v255 statements below are historical.

> **CURRENT AUTHORITY — v255 (`20260919T0000Z-v255`)**: `v11.8.0-rc4.205` is canonical source at `main@cdf7510034ffea179accd1e855f351775cef492f` and has a successful Cloudflare deployment associated with that commit; deployment ID is unavailable and this is not physical acceptance. `v11.8.0-rc4.204` remains the last physical/device-observed boundary: FantasyPros weekly projection passed, `Sleeper NFL State: Timeout nach 6s` remained, and the build was not accepted. RC4.205 is pending physical acceptance. Next gate: `RC4.205_PHYSICAL_DEVICE_VERIFICATION_PENDING`. PR #179 is closed/unmerged and diagnostic-only. Earlier v254 statements below are historical.

# rc4.204 post-merge source authority — v254
Handoff generation: `20260915T1206Z-v254`

`v11.8.0-rc4.204` is merged source authority at canonical `main@8baf1799589550373d36357258d6d882e79e9842`, produced by merged PR #176 from authorized repair head `fe8b6a397dac2b60522cb959ffdb225b767fbcae`. It is **not Production-deployed, device-observed, or device-accepted**. Source, package, preview, Production, device-observed, and device-accepted remain distinct.

The proven repair is bounded: FantasyPros weekly projections with explicit week + position omit the `ros` query parameter. `ros=false` must not be restored as weekly semantics; no unsupported scoring parameter was introduced. `stats.points_half` remains Half-PPR projection authority, and contradictory season/week/position/ROS, malformed, all-zero, out-of-safety, mapping-unsafe, or stale evidence remains fail-closed.

Validation provenance: focused 7/7 PASS; strict 225/225 PASS; package/re-extraction PASS. The observed archive SHA-256 `d9fc7432c5cbea4a48a3fda97c13151bb56e0a14a8ea7deeb81822faa51400f3` is run/environment-scoped evidence, never canonical cross-environment identity. PR #176 exact-head CI passed PITTI cloud validation, Project Guardrails, release contract v2, candidate package gate, and Cloudflare Pages Preview; preview is not Production.

Latest verified Production/device observation remains `v11.8.0-rc4.203` at `main@fb458e076de6710a91f1162e504b5b79fb67167c`, deployment `ef65bcf6-92d1-4c34-9873-c362bec002c7`. Its physical verdict is `RC4.203_PHYSICAL_FAIL_WEEKLY_PROJECTION_SEMANTIC_SCOPE_MISMATCH`: FAILED and NOT ACCEPTED. rc4.202 → rc4.201 → rc4.200 → rc4.199 (`RC4.199_PHYSICAL_FAIL_WEEKLY_PROJECTION_SEMANTIC_MISMATCH`) → rc4.198 remain history; rc4.195 remains the accepted rollback.

Mutable verification targets: PR #176 is merged rc4.204 source provenance; PR #175 is historical/discoverable v253 handoff-only Draft evidence and must not become a runtime lane or override v254; PR #163 is historical/discoverable v248 only; pitti-watcher PR #6 remains separate at expected head `77221ceeb900458e95c32d78c1ad395a37422e5d`. Freshly verify mutable GitHub state before dependent action.

Current gate: `ELIGIBLE_FOR_SEPARATELY_AUTHORIZED_PRODUCTION_DEPLOYMENT_GATE`. This is eligibility only, not authorization or execution. No device-side trial-and-error is authorized. Never send status/progress/acknowledgement messages during AUTO while executable work remains. Empty assistant response after tool work is forbidden.

## HISTORICAL/SUPERSEDED v252 CONTENT
# rc4.203 source/candidate authority — v252
Handoff generation: `20260914T1727Z-v252`

`v11.8.0-rc4.203` is the current source/package/preview candidate in this tree and is not Production-deployed, device-observed, or device-accepted. Canonical `main`, PR state, containing commit, and exact-head CI remain mutable external evidence. The 17-file package has `PACKAGED_ONLY_NOT_DEPLOYED` semantics and its archive identity is run/environment-scoped, never cross-environment authority.

Newest verified Production and newest device-observed failure is `v11.8.0-rc4.202` at exact `main@4e2b9af1c8562c0273f39503c2c1c90a15acce00`, Cloudflare deployment `d1e38b4b-27ed-4f87-bfa7-0e99f282de5d`, status `success`. Its separate physical verdict is `RC4.202_PHYSICAL_FAIL_YEARLESS_PROJECTION_CHRONOLOGY_REJECTED`; it is **not device-accepted**. Immutable observation: `docs/PITTI_BRIDGE_HANDOFF_RC4202_PHYSICAL_PROJECTION_LANE_FAIL_2026-09-14.md`.

Preserved history remains explicit: rc4.201 is the immediate prior Production/physical-failure history, followed by rc4.200, rc4.199 (`RC4.199_PHYSICAL_FAIL_WEEKLY_PROJECTION_SEMANTIC_MISMATCH`), and older rc4.198; rc4.195 remains the accepted rollback.

## Mutable live takeover targets
Fresh live READ-ONLY verification must cover merged PR #173 as historical rc4.202 provenance only, the new rc4.203 follow-up Draft PR as the current candidate lane, PR #172 as historical rc4.201 provenance only, PR #163 as a historical/discoverable v248 anchor only, and separate pitti-watcher PR #6 at expected head `77221ceeb900458e95c32d78c1ad395a37422e5d`. These are mutable verification targets. Keep source, package, preview, Production, device-observed, and device-accepted distinct.

Root cause and repair boundary: a yearless current FantasyPros projection update date such as `09/14` reached `Date.parse`, became a 2001 timestamp, and made every otherwise mapped current-week record fail `INVALID_PROVIDER_CHRONOLOGY`. rc4.203 applies the existing bounded requested-season inference (within eight days of authenticated retrieval) to projections. Out-of-window dates and every malformed, contradictory, wrong season/week/position/ROS/provenance, season-scale, all-zero, or definitively unmapped lane still purge current and prior rows. `stats.points_half` remains Half-PPR authority and the projections request still has no unsupported `scoring` parameter.

Current gate: `VERIFY_CANONICAL_AUTHORITY_THEN_AUTHORIZED_WORK`.

## HISTORICAL/SUPERSEDED CHECKPOINT CONTENT
# rc4.198 post-merge source/package authority — v245
Handoff generation: `20260912T1317Z-v245`

Canonical main was dynamically verified at `826a1f3327ffac643f3c32217246133ea32bd3ac`. `v11.8.0-rc4.198` is the current source/main authority and has a verified **17-file source-byte/re-extraction parity** package with status `PACKAGED_ONLY_NOT_DEPLOYED`. Archive SHA values are observations scoped to one run/environment and MUST NOT be treated as cross-environment archive-byte identity.

Production and device authority remain `v11.8.0-rc4.196` at exact deployed commit `082d77003f6616e290146698641aebe63f37b8c2`, deployment `da039536-7733-4b07-8f0c-70cc6e0bc8b7`, with verdict `RC4.196_PHYSICAL_PARTIAL_PASS_NOT_ACCEPTED`. `v11.8.0-rc4.195` remains the prior fully accepted rollback reference. No rc4.198 deployment or device evidence is claimed.

PR #156 was squash-merged from reviewed head `931713f8f8beaa70edbfb75041b2c708fae66109` onto base `62d7ecf11774700551b6e5a0497ec054e327a0d7` as commit `826a1f3327ffac643f3c32217246133ea32bd3ac` with tree `1e91afc64a61f4aad08f7fc50d687736211b3d87`. This is historical merge provenance only and proves neither deployment nor device acceptance. The rc4.198 archive SHA is noncanonical run/environment-scoped evidence only.

Current gate: `VERIFY_CANONICAL_AUTHORITY_THEN_AUTHORIZED_WORK`. Before continuation or promotion, dynamically verify canonical Git/GitHub authority and exact-head checks.

## HISTORICAL/SUPERSEDED v244 CONTENT

# rc4.197 post-merge source/package authority — v244 [HISTORICAL/SUPERSEDED]
Handoff generation: `20260912T0545Z-v244`

Canonical main was dynamically verified at `a2d3b4395d207ce54ccf90d2e028300ba35d40d1`. `v11.8.0-rc4.197` is the current source/main authority and has a verified **17-file source-byte/re-extraction parity** package with status `PACKAGED_ONLY_NOT_DEPLOYED`. Archive SHA values are observations scoped to one run/environment and MUST NOT be treated as cross-environment archive-byte identity.

Production and device authority remain `v11.8.0-rc4.196` at exact deployed commit `082d77003f6616e290146698641aebe63f37b8c2`, deployment `da039536-7733-4b07-8f0c-70cc6e0bc8b7`, with verdict `RC4.196_PHYSICAL_PARTIAL_PASS_NOT_ACCEPTED`. `v11.8.0-rc4.195` remains the prior fully accepted rollback reference. No rc4.197 deployment or device evidence is claimed.

Current gate: `VERIFY_CANONICAL_AUTHORITY_THEN_AUTHORIZED_WORK`. No runtime/product behavior changed. No deployment, cache clear/reinstall, or Sleeper transaction is authorized by this checkpoint.

AUTO queue takeover remains fail-closed. No device-side trial-and-error. Never send status/progress/acknowledgement messages during AUTO. Empty assistant response after tool work is forbidden.

## HISTORICAL/SUPERSEDED v243 CONTENT

# rc4.196 physical-partial authority — v243
Handoff generation: `20260911T1735Z-v243`

Canonical main was dynamically verified at `082d77003f6616e290146698641aebe63f37b8c2`. rc4.196 is source-merged and its Cloudflare Production deployment is **VERIFIED SUCCESS** for that exact commit (deployment `da039536-7733-4b07-8f0c-70cc6e0bc8b7`). This proves deployment identity, not arbitrary byte parity or full device acceptance.

The installed Android/PWA showed `v11.8.0-rc4.196` without cache clearing or reinstall. Canonical verdict: `RC4.196_PHYSICAL_PARTIAL_PASS_NOT_ACCEPTED`. Preserved physical lanes: Sleeper Live `<1 Min.`, W1 projection refresh with an observed 728 records, fail-closed Waiver/FA, D/ST streaming, K-only comparison, Trade Board v8 with Boone/Yahoo 263/264 and HOLD, Watcher PASS, and separate Reserve/IR. Blockers: weekly ranks and selected PITTI panel unavailable; Start/Sit cards did not consume/display valid projections independently; game/opponent/weather/lock context unavailable; 14 realistic skill players lacked complete Rank+Projection evidence. Full rc4.196 acceptance is forbidden until a later fixed build passes a new canary.

rc4.195 is the prior fully accepted historical/rollback reference, **not current production**. rc4.196 package identity remains 17 files, `sha256:a654422c907e3127335c20df1956fc974442c3eb3be011a5d8eb1e9b71f4500d`, and is distinct from source, deployment, byte parity, and device acceptance. Current gate: `VERIFY_CANONICAL_AUTHORITY_THEN_AUTHORIZED_WORK`. Runtime/product behavior is unchanged by this checkpoint.

## HISTORICAL/SUPERSEDED v242 CONTENT
# PITTI AUTO PREFLIGHT — MANDATORY

Use before every PITTI AUTO execution and after any chat handoff. This is an execution gate, not optional documentation.

## 0. HANDOFF TRANSACTION STATE
- On takeover, verify `PITTI_CURRENT_STATE.json` + `PITTI_HANDOFF_SEAL.json` first.
- Require matching generation with `NEW_CHAT_HANDOFF_CURRENT.md`, PASS seal, `handoff_ready=true`, `second_pass_pass=true`, and current seal-listed blob integrity.
- If a PITTI HANDOFF transaction is still marked in progress, AUTO finishes that transaction before ordinary project development.

## 1. SOURCE OF TRUTH
- Read `PITTI_PROJECT_STATE.md`.
- Identify newest material decisions and NEXT GATE.
- Verify relevant branch/build/artifact/runtime instead of assuming the document is still current.
- If reality differs, repair `PITTI_PROJECT_STATE.md` before proceeding.

## 2. ANTI-REGRESSION
Before acting, answer internally:
- Is this approach already recorded as failed/rejected?
- Am I reintroducing an old expert, format, UI behavior, ranking assumption, roster-cap error, duplicate-snapshot bug, or stale-data path?
- Is there a regression test/guard that should protect this rule?
- Am I confusing built/prepared with Android verified?
If any answer is unsafe/unknown, inspect evidence first.

## 3. END-TO-END ROUTE
- Define the shortest robust path from current state to the actual user goal.
- Confirm prerequisites exist before changing code.
- Prefer additive/small changes near draft freeze.
- Do not create parallel infrastructure when an existing verified capability already solves the problem.

## 4. AUTO CONTINUITY — DURABLE USER CONTRACT
- `PITTI AUTO` / `AUTO` means the longest safe autonomous work blocks by default, with as few interruptions as technically possible. This is persistent project authority; the user must never need to repeat it in later turns or chats.
- AUTO is a repeated work loop, not a one-package action: **execute work package -> checkpoint any material change -> re-inventory all independent lanes -> execute next package -> repeat**.
- Re-inventory after **EVERY** completed work package. One inventory at the start/end of an AUTO turn is insufficient.
- Execute all autonomously possible steps before messaging user.
- If lane A waits or hits an OOS/device/CI gate, immediately work independent lane B/C/D; a blocked gate blocks only its dependent lane, never PITTI AUTO globally.
- Mandatory inventory: decision/evidence validation, regression/release safety, evidence tooling, draft-day failsafe, expert freshness, post-draft/FA readiness, Watcher draft-critical readiness, checkpoint/handoff integrity, and independent strategy/current-evidence research.
- Do not send 'AUTO läuft', 'ich mache weiter', 'next I will...', a priority list, or a status-only response when executable work remains. Promise-only AUTO responses are invalid.
- A model/experiment freeze forbids contaminating that experiment; it does NOT forbid independent project work.
- An external/device/OOS gate is a valid interruption only after all independent non-contaminating positive-value lanes have actually been exhausted.
- If no safe autonomous lane remains, record the exhaustion reason and exact external gate before interrupting.


## 4A. AUTO STATE MACHINE / NO-OUTPUT GUARD
- Persistent queue authority: `PITTI_CURRENT_STATE.json:auto_execution_state`.
- Queue buckets are `active`, `ready`, `waiting_external`, `blocked_user`, `completed_recent`.
- After EVERY package or failure: checkpoint material facts, move that lane to its correct bucket, then immediately dispatch the highest-priority safe `ready` lane.
- `waiting_external` (CI, deploy, remote build, rate limit, scheduled availability) is never a global stop signal. It blocks only dependent work.
- `blocked_user` also blocks only its dependent lane. Continue every independent `ready` lane first.
- **NO-OUTPUT GUARD:** before any visible AUTO response, re-inventory. If `active.length > 0` or `ready.length > 0`, DO NOT RESPOND; continue work in the same turn.
- A visible AUTO response requires `active=[]`, `ready=[]`, and machine-readable `stop_evaluation.allowed=true`.
- Allowed stop codes only: `USER_ACTION_REQUIRED`, `DECISION_REQUIRED`, `PROJECT_MILESTONE_REACHED`, `NO_EXECUTABLE_WORK_REMAINS`, `SAFETY_OR_IRREVERSIBLE_CONFIRMATION`.
- Forbidden stop signals: CI/deploy running, commit created, tool call finished, work package finished, “no user action needed”, or existence of parallel work.
- Never emit “AUTO läuft”, “ich mache weiter”, “CI läuft”, “Commit erstellt” or “keine Nutzerhandlung nötig” as an AUTO terminal response.
- If the queue is stale or missing after a chat switch, reconstruct it from PROJECT_STATE/CURRENT/repo evidence before ordinary work, and set `stop_evaluation.allowed=false` while any autonomous lane exists.

## 5. CHECKPOINT WRITE-THROUGH
Immediately update `PITTI_PROJECT_STATE.md` after material:
- requirement/decision change,
- implementation or promotion,
- runtime verification,
- new failure/root cause,
- rejected approach,
- artifact/version/hash change,
- priority/next-gate change.

## 6. USER INTERRUPTION TEST
Interrupt only if at least one is true:
- user/device action is technically unavoidable now,
- required information cannot be obtained autonomously,
- irreversible/destructive/security-sensitive action needs approval,
- unresolved contradiction makes further work unsafe,
- a meaningful completed artifact/result now requires runtime verification.
Otherwise continue AUTO.

## 7. PITTI-SPECIFIC CANARIES
- Draft identity includes Draft-ID; cross-draft duplicate false positives forbidden.
- Half-PPR 1QB; reject Superflex/2QB.
- Starter maxima are not roster caps.
- K/DST normally not drafted.
- Geno Smith and Aaron Rodgers are explicit user hard exclusions. Never recommend or draft either player.
- Excess WR depth must materially reduce redundant WR utility.
- Expert-v2: Brown excluded; Erickson challenger; Koerner no current-draft acquisition effort; Mariano availability already solved; Draft Sharks counted as one correlated family; availability-only automatic restoration of the old Weisse/Gianni/Bobal trio rejected; Ryan Weisse or others may be freshly qualified individually with evidence.
- Frozen Expert-v2 weights/profile semantics in `PITTI_EXECUTION_LOCK.json` are preserved for the historical Expert-v2 experiment; do not invent, silently renormalize, or retune them without new promotion evidence.


- Active-draft decisionFixtures must never be deleted/pruned to recover browser quota; old history/secondary evidence may yield first.
- A full paired 15-round v4/v5 mock is invalid unless the exported backup contains exactly 30 active-draft fixtures covering all 15 own picks twice.

## 8. HANDOFF / AUTO RESPONSE DISCIPLINE — CURRENT
- Current handoff generation = **20260911T1352Z-v242**.
- Current mode = **POST_DRAFT_SEASON_COMPANION**.
- Canonical source = **v11.8.0-rc4.196, source-merged through PR #143 (MERGED/HISTORICAL)**. The observed merge commit `555487237c9075d5e5ceeb1fee196f4763f87cc3` is historical provenance only; verify current main dynamically.
- Production/device authority = **v11.8.0-rc4.195 physical PASS**. Preserve its 728-player Weekly Evidence, Watcher, Waiver/Trade fail-closed, Reserve/IR, K-only and Boone 263/264 evidence.
- rc4.196 is **NOT production-deployed and NOT physically accepted**. Its deployment parity is **UNKNOWN_REQUIRES_REVERIFICATION**; source/package/merge state never implies parity or acceptance.
- rc4.196 package identity = **17 files**, SHA-256 `a654422c907e3127335c20df1956fc974442c3eb3be011a5d8eb1e9b71f4500d`, `PACKAGED_ONLY_NOT_DEPLOYED`.
- Current gate: `VERIFY_CANONICAL_AUTHORITY_THEN_AUTHORIZED_WORK`. Dynamically verify Git/GitHub authority and exact-head CI before dependent continuation or promotion.
- Live Sleeper direct league/users/rosters state is current roster/ownership/manager/slot/FAAB authority; Watcher is evidence-only and the completed draft is immutable history.
- AUTO/AUTO BLOCK remains continuous same-turn execution while safe work exists; STATUS remains report-only.
- Older sections are chronological provenance only and cannot override this section.

## 9. AUTO TURN TERMINATION — HARD GATE
- Completing one work package is **not** permission to end the assistant turn.
- After every package, re-inventory and execute the next safe positive-value autonomous package **inside the same assistant turn**.
- A normal final, status final, acknowledgement final, **or empty final after tool work** is forbidden while executable autonomous work remains.
- Because execution cannot continue after the assistant turn is ended without another user message, early turn termination is a functional AUTO failure, not a cosmetic response issue.
- Valid turn end requires one of: unavoidable user/device input; approval-gated consequential action; unsafe unresolved contradiction; material end result with no higher-value package remaining; or demonstrated exhaustion of all safe positive-value independent lanes.
- Draft-day correction supersedes rc4.92 for these two names: Geno Smith and Aaron Rodgers are explicit user hard exclusions. Exactly-one-QB remains the historical draft strategy after QB1; the current Season contract permits evidence-backed QB2 opportunities.
- HISTORICAL/SUPERSEDED v145 takeover canary: rc4.94 source/package/deployment/Android Pick-9 presentation PASS. Kenneth Walker must not receive a player-specific boost; the fix remains generic normal-cut-first Top-10 selection.


## AUTO BLOCK — HARD OUTPUT GATE
When the user writes `AUTO BLOCK`, enter silent execution mode:
- no progress, status, acknowledgement, or promise-only assistant messages;
- an individual tool/work-package ending is NOT a valid reason to return;
- immediately re-inventory and continue with the next autonomous package;
- never emit an empty assistant response;
- visible output is permitted only for a concrete useful end-result, unavoidable user action/input, safety/irreversible confirmation, or a blocker after every independent lane is exhausted.


## HISTORICAL v169 TAKEOVER CANARIES — NOT CURRENT AUTHORITY
- Historical record only: generation `20260829T1244Z-v178` belonged to that old takeover and MUST NOT override the then-current historical generation 20260902T1325Z-v229.
- main/source/deployment/accepted Android authority = rc4.104.
- Exact 13-file main/gh-pages runtime parity = PASS.
- Android rc4.104 observed; completed post-draft Snapshot path = PASS.
- Canonical mock backup = draft-companion-v7-backup-2026-08-29T05-28-09-291Z.json; draft 1399284498113294336; source runtime rc4.101.
- Strict-Coach construction in that mock reached 9 WR / 4 RB / 1 QB / 0 TE before final pick; 14/14 preserved completed own picks followed Coach #1.
- rc4.104 bounded repairs: roster-aware WR6+ Value-Safety from pick81; extra soft WR7+/RB<=3 opportunity cost; conservative long-turn WAIT portfolio ordering; visible curated evidence with neutral polarity.
- Bounded replay rc4.101 fixtures -> rc4.104 is CI PASS for pick92/109/112 roster economics and exact pick132 Spears/Andrews reorder; Return-v2 unchanged. Continue draft-day readiness/freshness/failsafe.
- Return evidence remains: 3-pick 92.5% forecast vs 92.4% actual (Brier .044); 17-pick 35.6% vs 32.5% (Brier .077). No global Return-v2 retune.
- No PairSum/Rolling, hard WR cap/quota, blind RB forcing, player-name forcing, global QB2/TE2 rule, generic Return-v2 retune, or expert-weight redesign.
- Geno Smith and Aaron Rodgers are explicit user hard exclusions; never recommend/draft.
- Starter maxima are not roster caps; normal user draft excludes K/DST; user strategy drafts exactly one QB.
- Completed rc4.104 Snapshot is duplicate/documentation only; do not re-run live-pick analysis on it.
- FantasyPros post-draft capture is optional external benchmark, not prerequisite for replay.
- Handoff PASS is invalid if seal integrity is stale, empty, omits required core files, or takeover generations disagree.

- v167 latest OOS: backup draft-companion-v7-backup-2026-08-29T06-53-52-495Z.json, draft 1399308446632800256, rc4.104. Pick129 exposed score-0 short-turn promotion; rc4.105 generic Coach-floor fix passed PR #46 gates and deployed 13/13 parity.

- v169 mock pause canary: draft 1399325404598124544 is paused BEFORE user pick9. Picks1-8 Gibbs/Chase/Bijan/Jonathan Taylor/CMC/Puka/Amon-Ra/JSN. James Cook was recommended at 1.09 but user did not confirm the pick; never infer he is on roster.
- v169 rc4.106 canary: embedded Expert-v2/v3 individual rows must appear in Snapshot Coach Top 8; old `KEINE VERIFIZIERT` live-rankCache-only filter is rejected. PR #47 all gates PASS; main merge 0818bc9632eca79c4d055d444a6eae0af53f3a9f; 13/13 pages parity PASS.


## 10. v194 CURRENT OVERRIDE — rc4.130 [HISTORICAL/SUPERSEDED — cannot override section 8]
- This section supersedes older rc4.129/v169 current pointers above; historical sections remain for regression provenance only.
- Current source/deployment authority = **v11.8.0-rc4.130**; latest fully operational device-observed v4/v5 baseline = **rc4.126**.
- rc4.129 device mock exposed a fail-closed Decision-Evidence storage error at pick 12. Backup `draft-companion-v7-backup-2026-08-30T13-40-34-982Z.json` contains 4 current-draft fixtures = paired v4/v5 at picks 9/12, plus 22 historical fixtures.
- Exact root cause: `history.slice(-0)` retained all history, so rc4.129's final intended history-free quota retry was not history-free.
- rc4.130 fixes zero-history recovery with explicit `[]`, retains active-draft atomicity, and removes redundant rankedPool `robustRankShadow` from persisted fixtures.
- All required rc4.130 CI gates including deterministic quota regression and candidate package/re-extract are PASS; main/gh-pages parity was verified before reseal.
- Exact next gate: **RC4.130_DEVICE_REFRESH_THEN_FULL_30_FIXTURE_V4V5_MOCK**.
- One controlled device refresh only; no cache/app-data clear or reinstall.
- The acceptance mock must be **fresh**, not continuation of the interrupted rc4.129 mock. At every own pick analyze both v4 and v5 before the user pick; exported backup must contain exactly 30 current-draft fixtures before model comparison.
- v4 PRIMARY / v5 CHALLENGER / v3 failsafe; no weight/source retune.


## 11. v195 CURRENT OVERRIDE — backup 16-02-06-862Z [HISTORICAL/SUPERSEDED — cannot override section 8]
- This section supersedes older rc4.129/30-fixture continuation pointers above.
- Runtime remains **rc4.130**; no phone update is required for the audit tool.
- Latest canonical backup is **draft-companion-v7-backup-2026-08-30T16-02-06-862Z.json**.
- Exact evidence: **29 fixtures across all 15 own picks; 14 exact v4/v5 pairs; missing pick29 expertv5**. Never call this 30/30 PASS.
- Persistent audit tool **tools/audit-v45-backup.mjs** must be used on future JSON exports before model conclusions.
- Data-quality canaries are now explicit: Terry McLaurin = 4/6 coverage in both v4/v5, missing Boone + Koerner; D'Andre Swift pick52 = Top-1 both profiles with generic-only rationale.
- Partial 14-pair evidence does not justify a last-minute model retune. **v4 remains PRIMARY, v5 CHALLENGER, v3 failsafe**.


## v205 CURRENT OVERRIDE — deep handoff anti-regression [HISTORICAL/SUPERSEDED — cannot override section 8]
- Supersedes older rc4.129/130/131 continuation pointers above where they conflict.
- First gate is **RC4.132_BUILD_AND_REGRESSION**.
- rc4.132 scope is mandatory: live-autodraft Return-v2 + Pick32 Nabers/Javonte + exact 2026 manager-order regression + active-manager history repair.
- Exact order: Michael / Pascal Voerde / Marc Düsseldorf / Thomas / Björn / Pascal Gelderner / Giuliano / Bastian / Muerotechnik / Dutch Marc.
- Historical hard locks: Michael includes 2025; Pascal Voerde combines Bracht Eagles 2017-2022 with Voerde Eagles 2023-2025; Pascal Gelderner remains separate; Björn 2021 theme + 2023 autodraft excluded.
- After rc4.132 device acceptance, execute final draft-day freshness agenda. The separate real-draft chat uses `PITTI_DRAFT_CHAT_BOOTSTRAP.md` and is execution-only.


## v207 CURRENT OVERRIDE — QB-rule correction [HISTORICAL/SUPERSEDED — cannot override section 8]
- Generation: `20260830T1822Z-v207`.
- Draft-day authority: Geno Smith and Aaron Rodgers are explicit user hard exclusions. Any older checkpoint saying otherwise is superseded.
- Correct rule: both are explicit user hard exclusions and must not appear on the user's recommendation/draft surface. This user-specific exclusion does not imply a generic league-wide QB2 rule.
- First gate remains **RC4.132_BUILD_AND_REGRESSION**; exact order/history locks remain unchanged.


## 12. v212 CURRENT OVERRIDE — rc4.142 TIER PAYLOAD ROOT CAUSE [HISTORICAL/SUPERSEDED — cannot override section 8]
- Generation: `20260831T0735Z-v212`. This section supersedes all older current-version/first-gate/device-authority pointers above where they conflict.
- Android already runs **v11.8.0-rc4.142**.
- Startup, refresh, Analyze and 125/125 individual descriptions work; Tyler Warren text is restored.
- External Expert-v4 tier labels are **absent / FAIL**.
- rc4.142's `total_experts` verifier correction was insufficient. Do not treat it as the root cause.
- First gate: **RC4.142_TIER_PAYLOAD_ROOT_CAUSE**.
- Before any new build, capture/reproduce actual FantasyPros `consensus-rankings` payloads for QB/RB/WR/TE through the existing proxy with exact selectable active-v4 expert IDs; verify request parameters, expert provenance, player container, position fields and explicit tier key/value.
- No speculative rc4.143. No cache/app-data clear, reinstall or repeated-refresh loop.
- After reproduced root cause only: one bounded fix + real-shape deterministic regression fixture + full gates/parity + exactly one device verification.
- Preserve 125/125 text coverage, Warren/Jacobs handling, exact manager order/history, decision evidence/fingerprints, Coach/Return-v2, no K/DST, exactly one QB, and Geno Smith/Aaron Rodgers hard exclusions.
- After tier acceptance: deferred 5-WR analysis, then final draft-day freshness/ADP/expert-board/late-RB/smoke freeze.


## 13. v214 CURRENT OVERRIDE — rc4.153 DEVICE ACCEPTANCE THEN FREEZE [HISTORICAL/SUPERSEDED — cannot override section 8]
- Generation: `20260831T1028Z-v214`. This section supersedes every older current-version / first-gate / device-authority pointer above.
- Accepted Android/PWA authority = **v11.8.0-rc4.152**.
- Source + deployed runtime candidate = **v11.8.0-rc4.153**.
- rc4.153 PR #83 passed Release Contract, Candidate Package Gate and Project Guardrails; merged to main; **13/13 runtime files are main↔gh-pages parity**.
- rc4.153 is presentation-only: stable expert display order across positions. Common v4 experts first: **Sean Koerner → Dalton Del Don → Pat Fitzmaurice**, then broadly shared experts, then specialists. Missing ranks remain `#– / fehlt`.
- Exact next gate = **RC4.153_DEVICE_ACCEPTANCE_THEN_DRAFT_FREEZE**.
- One controlled device update only. If display order PASS, immediately freeze runtime for the real draft.
- Do not reopen public FantasyPros tier-field experiments, generic Return-v2 tuning, panel/source/weight changes, manager history, draft order, scoring or other old defect lanes without new release-critical evidence.
- LIVE nine-manager AUTO/MANUELL/? grid, direct Coach apply, LIVE v3/v4/v5 selector and rc4.151 speed/evidence behavior are protected.
- Latest adopted evidence backup remains `draft-companion-v7-backup-2026-08-31T09-21-02-891Z.json`.
- Exact manager order/history, no K/DST, exactly one QB, Geno Smith/Aaron Rodgers hard exclusions, starter maxima not roster caps remain immutable.


## 14. v215 CURRENT OVERRIDE — rc4.158 ACCEPTED / PRE-WAIVER HANDOFF [HISTORICAL/SUPERSEDED — cannot override section 8]
- Generation: `20260831T1455Z-v215`. This section supersedes every older current-version / first-gate / device-authority pointer above.
- Accepted Android/PWA authority = **v11.8.0-rc4.158**.
- Source/deployment authority = **main/gh-pages v11.8.0-rc4.158**, exact **13/13 runtime parity PASS**.
- rc4.158 Project Guardrails, Release Contract, Candidate Package/Re-Extract = **PASS**.
- Device smoke = PASS; `Experten-Delta prüfen` visible; v4 expert day baseline = **9/9 COMPLETE**.
- Runtime state = **DRAFT_READY_FROZEN**. No code/model/source-weight changes absent a critical draft-blocking defect.
- Exact gate = **DRAFT_DAY_TIME_DEPENDENT_FINALIZATION**.
- Before 19:00 CEST: material-news-only; do not rerun completed static work.
- At/after 19:00: reconcile waiver claims/destinations and only affected player paths.
- Around 19:40–19:45: one `Experten-Delta prüfen`; no blanket expert refresh.
- Around 19:50: operational freeze; 20:00 real draft execution.
- Exact manager order = Michael / Pascal Voerde / Marc Düsseldorf / Thomas / Björn / Pascal Gelderner / Giuliano / Bastian / Muerotechnik / Dutch Marc.
- Correct five-WR cluster = DeVonta Smith / Zay Flowers / Emeka Egbuka / Tetairoa McMillan / Jaylen Waddle.
- Fresh real-draft chat is created only after a FINAL PRE-DRAFT HANDOFF around 19:45–19:50. That handoff must carry final expert delta + post-waiver deltas + final injury/legal/transaction status and execution locks.


## 15. v217 CURRENT OVERRIDE — POST-DRAFT SEASON COMPANION / rc4.161 [HISTORICAL/SUPERSEDED — cannot override section 8]
- Generation: `20260901T1058Z-v217`. This section supersedes every older current-version, first-gate, generation, draft-day and device-test pointer above where they conflict.
- Canonical mode = **POST_DRAFT_SEASON_COMPANION**.
- Branch `season-companion-rc4.159` is historical naming only; current source/preview candidate = **v11.8.0-rc4.161**.
- Accepted Android authority remains **v11.8.0-rc4.158** until physical rc4.161 acceptance.
- Current Sleeper league state is the current roster/ownership Source of Truth; the real draft is immutable history.
- rc4.160 device already proved automatic transaction detection: Mevis rostered, Bigsby absent, Charbonnet Reserve/IR. Do not repeat rc4.160 testing.
- rc4.161 root fix decouples live FA ownership discovery from expert-ranking hydration. `tools/season-fa-ownership-regression.mjs` must remain in candidate-package CI.
- Exact current gate after takeover reconciliation = **DEVICE_RC4161_ACCEPTANCE**.
- Any older instruction saying v178/v205/v207/v212/v214/v215/v216 is the required current generation, DRAFT_READY_FROZEN is current, DRAFT_DAY_TIME_DEPENDENT_FINALIZATION is current, or Bigsby is currently rostered is historical and must not override v217.

### v217 AUTO hard gate
- `AUTO` and `AUTO BLOCK` must continue autonomously inside the same assistant turn while ANY safe positive-value lane is executable.
- After every work package: checkpoint material change → re-inventory all independent lanes → immediately execute the next package.
- A waiting CI/deploy/device lane blocks only that lane; it is never by itself a global stop.
- **No visible response** while `active` or `ready` contains executable work.
- Progress/status/acknowledgement messages are forbidden terminal responses: “AUTO läuft”, “ich mache weiter”, “CI läuft”, “Commit erstellt”, “keine Nutzerhandlung nötig”, or equivalents.
- An empty assistant response after tool work is also forbidden because it terminates execution.
- Visible output requires `active=[]`, `ready=[]`, and `stop_evaluation.allowed=true` with an approved stop code.
- The platform cannot continue tool work after a visible assistant turn ends; therefore a promise that AUTO “läuft weiter” after sending such a message is functionally false.

## v223 NO-TRIAL DEVICE PROMOTION OVERRIDE [HISTORICAL/SUPERSEDED — cannot override section 8]
- Current candidate = v11.8.0-rc4.176; rc4.175 is rejected for proven runtime truncation/workspace-router loss.
- Device promotion is forbidden while any automated candidate, package, deployment, workspace-navigation, startup/interactions, or strict reseal gate is not PASS.
- A device check is not a debugging instrument. After all server-side gates pass, exactly one final confirmation is permitted.
- Runtime truncation regression: app.js must remain >380k and preserve setWorkspace + all workspace tab wiring.


## v224 CURRENT OVERRIDE — RC4.176 OBSERVED, NOT ACCEPTED [HISTORICAL/SUPERSEDED — cannot override section 8]
Generation: `20260901T2210Z-v224`. Supersedes older current-version/device/gate/handoff pointers above where conflicting. Physical Android at 22:09 CEST visibly runs rc4.176, but captured Kader still has Live-State '-' and Live-Kader loading; this is observation only. Accepted rollback remains rc4.169. First new-chat gate: verify v224 against actual main/CI/deploy, then browser-equivalent Season E2E before any further device action. AUTO/AUTO BLOCK: no interim status/progress/ack, no empty response, no “AUTO läuft weiter”; re-inventory and continue while executable work exists. STATUS report-only.

## 4B. DEVICE EVIDENCE + EXTERNAL WAIT HARDENING — 2026-09-02

- A user-supplied physical device screenshot/version observation is a **checkpoint event**, not conversational context. Before any further code/CI/promotion work, update CURRENT + EXECUTION_LOCK + COMMAND_CONTRACTS with installed/observed version and PASS/FAIL evidence.
- If the same version is physically observed with a functional FAIL, it is **DEVICE_REJECTED**. Never describe it as merely a candidate awaiting acceptance.
- Never keep an AUTO response open through repeated manual CI/deploy polling. Perform at most one immediate status read after launching/triggering external work.
- If external work is still pending, checkpoint it in `waiting_external`, execute all independent lanes, then end the turn once if nothing else is executable. Do not claim background continuation.
- `STATUS` is strictly report-only. It must not be needed to cancel, unstick, or resume an AUTO turn.


## v229 HANDOFF SUPERSESSION — 2026-09-02 [HISTORICAL — SUPERSEDED BY v230/v231/v232/v233] [HISTORICAL/SUPERSEDED — cannot override section 8]
- Generation `20260902T1325Z-v229` supersedes v227/v228 current pointers wherever they conflict.
- Any earlier CURRENT statement saying PR #102/rc4.184 is open, or generation v227 is current, is historical only.
- Historical v229 release lane was rc4.185 merged baseline + PR #108 OPEN/UNMERGED; that lane is fully superseded and MUST NOT be interpreted as current authority.
- Lawrence lane and full-league-state architecture are current and must survive chat takeover.

QB2 phase authority: Draft: after QB1, QB2 recommendation/drafting is excluded until a future explicit user decision. Season: context-dependent QB2 exceptions through waiver/free agency/trade/roster optimization remain possible with verified evidence and legal capacity; same-bye and future D/ST costs matter. Season exceptions never retroactively weaken the draft rule. Canonical machine policy: PITTI_CURRENT_STATE.json:qb_policy.

Earlier rc4.190/rc4.192/rc4.194 identities are historical. rc4.193 is the physical Weekly-Evidence PASS; rc4.195 source is merged while deployment and physical acceptance remain unverified.
> CURRENT v263 (`20260923T1834Z-v263`): verify rc4.206 Production `main@d5954d66877df877f950a4a41f32baad59a66748` / deployment `8322e9b3-a293-4454-8ef9-d5e98c217889`; device acceptance false, rc4.205 last accepted. rc4.207 is repair-only. Do not merge PR #192 unchanged. Gate: `RC4207_EXACT_HEAD_CI_AND_NONPRODUCTION_PREVIEW`.
