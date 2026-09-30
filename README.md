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

Historical pre-PR213-merge candidate note: rc4.214 was then not deployed or physically accepted. PR213 Production deployment is now proven; physical acceptance remains pending. See docs/PITTI_RC4214_RB_STORAGE_EVIDENCE_REPAIR.md.

Handoff generation: `20260928T1813Z-v271`
Generation: `20260928T1813Z-v271`
> **HISTORICAL AUTHORITY — v271**: v11.8.0-rc4.213: PR #211 reviewed head 481012802973301f2d9094fbccc1f6488e3e8afd, merged canonical main 158499e1b2395d9313292a0070055d539e5ce7ea, identical reviewed/merged tree d1a2bc6c7d9d5fdba83c03155682d3bf18322318. SOURCE MERGED_CANONICAL; PRODUCTION DEPLOYED_SUCCESS (ad38e02b-0553-4244-b4e4-7677c5090183, check 109061736154); PHYSICAL PENDING. CI/deployment facts are USER_SUPPLIED_EXTERNAL_EVIDENCE; Git parent/tree verified locally after fetch. Postmerge authority failure was runtime version lock drift, not a new runtime defect. Next gate: RC4213_PRODUCTION_PHYSICAL_EVIDENCE_LANES_DIAGNOSTIC_PENDING.

After external publication and green authority/postmerge checks, separately authorized rc4.213 Production evidence-lanes canary: Broad ECR DATE repair, projections, RB provider shape, selected PITTI identity, Start/Sit live authority, 16-game/32-team context and D/ST current/+1/+2. No device action authorized in this authority-only task.

Detailed reconciliation: `docs/PITTI_V271_RC4213_POSTMERGE_AUTHORITY.md`. Historical records below do not confer rc4.213 physical acceptance.

## HISTORICAL v270 AND EARLIER

Local candidate: v11.8.0-rc4.213. See RC4213_EVIDENCE_REPAIR.md; physical acceptance pending.

> **LOCAL CANDIDATE v11.8.0-rc4.212**: Week rollover checks Sleeper before cache/retry gates and invalidates prior-week consumers before optional acquisition. Local verification is recorded in `PITTI_CURRENT_STATE.json:week4_season_readiness`; Production/device evidence below applies only to its recorded rc4.211 tree.

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

> **rc4.211 CANDIDATE HISTORY — MERGED PR #200**: Runtime repair `9e97758a961ce88361b8d22aed84d135674d0730` and harness child `e3503a9f5a06e37d7d9795051d0a18eb06caa65e` are merged. Current authority is v266 above; broader rc4.210 physical evidence is historical, not re-observed on rc4.211.

> **HISTORICAL AUTHORITY — v263 (`20260923T1834Z-v263`)**: `v11.8.0-rc4.206` is canonical source **and Production** authority at `main@d5954d66877df877f950a4a41f32baad59a66748` (tree `07248a6ac3c5f8872893a2c805155be8a1a5e806`), deployment `8322e9b3-a293-4454-8ef9-d5e98c217889`. Physical/device acceptance is **false**: `RC4.206_PHYSICAL_PARTIAL_PASS_NOT_ACCEPTED_SELECTED_PANEL_AND_GAME_CONTEXT_UNAVAILABLE`. `v11.8.0-rc4.205` remains the last device-accepted control. `v11.8.0-rc4.207` is a bounded feature-branch-only repair candidate; broad ECR remains distinct, Team Total remains fail-closed unavailable, and no merge/deploy is authorized. PR #192 is stale and must not be merged unchanged. Draft PR #193 has exact-head CI and non-Production preview PASS. Next gate: `SEPARATELY_AUTHORIZED_RC4207_MERGE_AND_AUTOMATIC_PRODUCTION_DEPLOYMENT`.

> **HISTORICAL AUTHORITY — v262 (`20260920T1624Z-v262`)**: rc4.206 source was merged but its Production deployment and later physical rejection had not yet been checkpointed.

> **CURRENT AUTHORITY — v260 (`20260920T1100Z-v260`)**: Independent Evidence Lane Diagnosis is complete on canonical `main@2a08f856c7e72b0e1a9667e47e3e4467790d0f98`. Broad current weekly Expert-Ranks are physically AVAILABLE. The selected PITTI-Panel is still unavailable because the Season weekly path consumes broad FantasyPros consensus only while selected-expert ingestion remains draft/preseason (`week=0` / DRAFT) infrastructure. FantasyPros documents expert-ID filtering and a rankings/experts endpoint, so a bounded current-week selected-expert repair is technically viable but not yet implemented. Canonical game-context data remains unavailable because Production receives ESPN upstream HTTP 403; sanitized failure provenance is already physically proven. Team Total has no approved runtime total+spread source, although the existing `impliedTeamTotal` helper is ready for a future verified same-event pair. Opponent/weather remains dependent on complete game context and fresh event weather. Next gate: `SEPARATELY_AUTHORIZED_INDEPENDENT_EVIDENCE_LANE_BOUNDED_REPAIR`. Earlier v259 statements below are historical.

> **HISTORICAL CANDIDATE — v11.8.0-rc4.206 / PR #191 (MERGED INTO SOURCE)**: bounded independent-evidence repair only. Final reviewed runtime head `c18c99edbbe28dbc55f1396f4870e319ed609917` (tree `afecd5370c9209079ebaa18a3384e57106e595ff`) is bound by exact-head validation `44401e32c914ba9da41d19add7ff48cc26bd249d`, which passed Guardrails, Behavioral Contract, Candidate Package, isolated PITTI Cloud Validation (`STRICT_SUITE 232/232`) and Cloudflare Preview. The 17-file package/re-extraction gate passed byte-exact; archive hashes remain run/environment-scoped and noncanonical. Exact-ID selected weekly PITTI ranks are distinct from broad ECR, missing current selected responses may retain only still-fresh same-week prior selected ranks while contradictory current responses purge them, canonical ESPN game context is bounded and fail-closed, and Team Total remains unavailable. PR #191 was later merged as canonical source at `d5954d66877df877f950a4a41f32baad59a66748`; this historical candidate paragraph does not imply Production/device acceptance.


> **CURRENT AUTHORITY — v259 (`20260920T1036Z-v259`)**: v11.8.0-rc4.205 PR #186 repair is Production-deployed at exact `main@66a6551d4a4520bd06f3b77a2f6bbdb297bfe6f1` (deployment `ec6cd004-6e54-480f-8752-e8e37755ac66`, Cloudflare Pages check `106063674827` PASS) and now has a user-supplied bounded physical PASS: QB projections 80/80 mapped, active roster 13/13 usable, and canonical game-context failure provenance physically returns sanitized HTTP 502 / upstream 403 / `UPSTREAM_HTTP_ERROR`. Game-context data itself remains unavailable. Broad current Expert-Ranks are AVAILABLE, but PITTI-Panel is not proven. Team Total and opponent/weather remain unavailable/fail-closed. Physical classification: `RC4.205_PR186_PHYSICAL_PASS_LAWRENCE_MAPPING_AND_GAME_CONTEXT_FAILURE_PROVENANCE`. Next gate: `SEPARATELY_AUTHORIZED_INDEPENDENT_EVIDENCE_LANE_DIAGNOSIS`. Earlier v258 statements below are historical.

> **CURRENT AUTHORITY — v258 (`20260920T1011Z-v258`)**: v11.8.0-rc4.205 PR #186 repair is Cloudflare Production-deployed from exact `main@6f2ea5cc5db94a3ddff2370cf9b4f4d7b5983c80` (deployment `a3342287-3b3b-4961-9819-f2fac696b743`, Cloudflare Pages check `106050669714` PASS). Reviewed runtime/source provenance remains PR #186 head `9c407d5a705713a630d7e62f020b72b48169d131`, merge `01ceef33dba6d79be48461d85532a1e2a39bd9aa`, tree `d1c9e2660e60d305a8a1f4727404d676e83c2164`; runtime blobs are unchanged by the v257 authority-only merge. Exact-commit deployment identity is proven; arbitrary public served-byte parity is not independently claimed. The prior physical PASS remains bounded to the earlier Sleeper timeout repair. The PR #186 Lawrence/game-context repair is **not yet physically/device verified**. Next gate: `RC4.205_PR186_PHYSICAL_DEVICE_VERIFICATION_PENDING`. Earlier v257 statements below are historical.

> **CURRENT AUTHORITY — v257 (`20260920T0835Z-v257`)**: PR #186 is merged into canonical source `main@01ceef33dba6d79be48461d85532a1e2a39bd9aa` from exact reviewed head `9c407d5a705713a630d7e62f020b72b48169d131`, tree `d1c9e2660e60d305a8a1f4727404d676e83c2164`. This new main is **source authority only**; no Production deployment of `01ceef33dba6d79be48461d85532a1e2a39bd9aa` is proven. Production/device authority remains v11.8.0-rc4.205 runtime source `cdf7510034ffea179accd1e855f351775cef492f`, physically accepted only for the bounded Sleeper week-context timeout repair. Expert-Ranks/Ranks, PITTI-Panel, QB projections, Team Total, and opponent/weather remain unavailable/fail-closed. Next gate: `ELIGIBLE_FOR_SEPARATELY_AUTHORIZED_PRODUCTION_DEPLOYMENT_GATE`. Earlier v256 statements below are historical.

> **CURRENT AUTHORITY — v256 (`20260919T1813Z-v256`)**: RC4.205 authority is reconciled through `main@2fca8f155d195df7521b5810b31bf71c58fc8358`, preserving runtime-source lineage `cdf7510034ffea179accd1e855f351775cef492f`. Physical Android verification PASSED the bounded Sleeper week-context timeout repair. Expert-Ranks/Ranks, PITTI-Panel, QB projections, Team Total, and opponent/weather remain unavailable/fail-closed. Next gate: `SEPARATELY_AUTHORIZED_INDEPENDENT_EVIDENCE_LANE_DIAGNOSIS`. Earlier v255 statements below are historical.

> **CURRENT AUTHORITY — v255 (`20260919T0000Z-v255`)**: `v11.8.0-rc4.205` is canonical source at `main@cdf7510034ffea179accd1e855f351775cef492f` and has a successful Cloudflare deployment associated with that commit; deployment ID is unavailable and this is not physical acceptance. `v11.8.0-rc4.204` remains the last physical/device-observed boundary: FantasyPros weekly projection passed, `Sleeper NFL State: Timeout nach 6s` remained, and the build was not accepted. RC4.205 is pending physical acceptance. Next gate: `RC4.205_PHYSICAL_DEVICE_VERIFICATION_PENDING`. PR #179 is closed/unmerged and diagnostic-only. Earlier v254 statements below are historical.

# rc4.205 Sleeper week-context timeout repair candidate — v254 superseded pending reseal
Handoff generation: `20260915T1206Z-v254`

`v11.8.0-rc4.205` is an unsealed local repair candidate based on canonical `main@95e8f8fb0f711dd978a0cf6f85120d5e381a37ea`. It is not Production-deployed, device-observed, or device-accepted. The prior v254 handoff is explicitly superseded pending a later authorized post-merge reseal; it is not rewritten here. Source, package, preview, Production, device-observed, and device-accepted remain distinct.

Latest verified Production/device observation is `v11.8.0-rc4.204` at `main@95e8f8fb0f711dd978a0cf6f85120d5e381a37ea`, Cloudflare deployment `056e6aaf-2d58-42d6-942b-02f2196cfcdc`. Its omitted-ROS weekly projection repair is physically successful and must not be reverted. The remaining physical failure is `Sleeper NFL State: Timeout nach 6s`; the last verified Weekly Evidence snapshot is retained. rc4.203 and older Production/device outcomes remain history; rc4.195 remains the accepted rollback.

Sealed v254 source provenance remains historical: rc4.204 was merged through `main@8baf1799589550373d36357258d6d882e79e9842` from repair head `fe8b6a397dac2b60522cb959ffdb225b767fbcae`. Before that deployment, `v11.8.0-rc4.203` at `main@fb458e076de6710a91f1162e504b5b79fb67167c`, deployment `ef65bcf6-92d1-4c34-9873-c362bec002c7`, failed physically as `RC4.203_PHYSICAL_FAIL_WEEKLY_PROJECTION_SEMANTIC_SCOPE_MISMATCH`. The rc4.204 repair preserved `stats.points_half` as Half-PPR projection authority.

## Mutable live takeover targets
Fresh read-only verification must cover merged PR #176 as rc4.204 source provenance, PR #175 as historical/discoverable v253 handoff-only Draft evidence, PR #163 as historical/discoverable v248 only, and separate pitti-watcher PR #6 at expected head `77221ceeb900458e95c32d78c1ad395a37422e5d`. PR #175 must not become a runtime repair lane or override v254.

Repair boundary: fresh Sleeper NFL state remains primary week authority. Only a timeout/network failure may fall back to the already hydrated direct Sleeper league state, and only while it is at most five minutes old, season-matched, actively in-season, and its regular-season leg exactly matches the transaction round within Weeks 1–18. Missing, stale, wrong-season, inactive, or ambiguous fallback remains fail-closed. FantasyPros weekly requests remain explicit week/position with both `ros` and unsupported `scoring` omitted; projection validation is unchanged.

Current gate: `ELIGIBLE_FOR_SEPARATELY_AUTHORIZED_PRODUCTION_DEPLOYMENT_GATE`. This is eligibility only; deployment and physical acceptance remain separate, unauthorized actions.

## HISTORICAL/SUPERSEDED v252 CONTENT

## HISTORICAL/SUPERSEDED CHECKPOINT CONTENT
# v11.8.0-rc4.201 integrated P0 candidate (PR #162; not deployed or device-accepted)

# rc4.198 post-merge source/package authority — v245
Handoff generation: `20260912T1317Z-v245`

Canonical main was dynamically verified at `826a1f3327ffac643f3c32217246133ea32bd3ac`. `v11.8.0-rc4.198` is the current source/main authority and has a verified **17-file source-byte/re-extraction parity** package with status `PACKAGED_ONLY_NOT_DEPLOYED`. Archive SHA values are observations scoped to one run/environment and MUST NOT be treated as cross-environment archive-byte identity.

Production and device authority remain `v11.8.0-rc4.196` at exact deployed commit `082d77003f6616e290146698641aebe63f37b8c2`, deployment `da039536-7733-4b07-8f0c-70cc6e0bc8b7`, with verdict `RC4.196_PHYSICAL_PARTIAL_PASS_NOT_ACCEPTED`. `v11.8.0-rc4.195` remains the prior fully accepted rollback reference. No rc4.198 deployment or device evidence is claimed.

PR #156 was squash-merged from reviewed head `931713f8f8beaa70edbfb75041b2c708fae66109` onto base `62d7ecf11774700551b6e5a0497ec054e327a0d7` as commit `826a1f3327ffac643f3c32217246133ea32bd3ac` with tree `1e91afc64a61f4aad08f7fc50d687736211b3d87`. This is historical merge provenance only and proves neither deployment nor device acceptance. The rc4.198 archive SHA is noncanonical run/environment-scoped evidence only.

Current gate: `VERIFY_CANONICAL_AUTHORITY_THEN_AUTHORIZED_WORK`. Before continuation or promotion, dynamically verify canonical Git/GitHub authority and exact-head checks.

## HISTORICAL/SUPERSEDED v244 CONTENT

# rc4.197 post-merge source/package authority — v244 [HISTORICAL/SUPERSEDED]
> **Draft candidate:** `v11.8.0-rc4.198` on PR #156 repairs weekly projection chronology, production-shaped broad ECR freshness/aliases, and bounded game-context diagnostics. It is not deployed or device-accepted; canonical main remains rc4.197 and production/device authority remains rc4.196.

Handoff generation: `20260912T0545Z-v244`

Canonical main was dynamically verified at `a2d3b4395d207ce54ccf90d2e028300ba35d40d1`. `v11.8.0-rc4.197` is the current source/main authority and has a verified **17-file source-byte/re-extraction parity** package with status `PACKAGED_ONLY_NOT_DEPLOYED`. Archive SHA values are observations scoped to one run/environment and MUST NOT be treated as cross-environment archive-byte identity.

Production and device authority remain `v11.8.0-rc4.196` at exact deployed commit `082d77003f6616e290146698641aebe63f37b8c2`, deployment `da039536-7733-4b07-8f0c-70cc6e0bc8b7`, with verdict `RC4.196_PHYSICAL_PARTIAL_PASS_NOT_ACCEPTED`. `v11.8.0-rc4.195` remains the prior fully accepted rollback reference. No rc4.197 deployment or device evidence is claimed.

Current gate: `VERIFY_CANONICAL_AUTHORITY_THEN_AUTHORIZED_WORK`. No runtime/product behavior changed. No deployment, cache clear/reinstall, or Sleeper transaction is authorized by this checkpoint.

AUTO queue takeover remains fail-closed. No device-side trial-and-error. Never send status/progress/acknowledgement messages during AUTO. Empty assistant response after tool work is forbidden.

## HISTORICAL/SUPERSEDED v243 CONTENT

# Draft Companion – Final Draft Edition 2026 · v11.8.0-rc4.196
## rc4.196 current production / physical partial authority

> **Draft candidate:** `v11.8.0-rc4.197` repairs Start/Sit projection-lane independence on PR #152. It is not deployed or device-accepted; the rc4.196 production authority below remains unchanged.

# rc4.196 physical-partial authority — v243
Handoff generation: `20260911T1735Z-v243`

Canonical main was dynamically verified at `082d77003f6616e290146698641aebe63f37b8c2`. rc4.196 is source-merged and its Cloudflare Production deployment is **VERIFIED SUCCESS** for that exact commit (deployment `da039536-7733-4b07-8f0c-70cc6e0bc8b7`). This proves deployment identity, not arbitrary byte parity or full device acceptance.

The installed Android/PWA showed `v11.8.0-rc4.196` without cache clearing or reinstall. Canonical verdict: `RC4.196_PHYSICAL_PARTIAL_PASS_NOT_ACCEPTED`. Preserved physical lanes: Sleeper Live `<1 Min.`, W1 projection refresh with an observed 728 records, fail-closed Waiver/FA, D/ST streaming, K-only comparison, Trade Board v8 with Boone/Yahoo 263/264 and HOLD, Watcher PASS, and separate Reserve/IR. Blockers: weekly ranks and selected PITTI panel unavailable; Start/Sit cards did not consume/display valid projections independently; game/opponent/weather/lock context unavailable; 14 realistic skill players lacked complete Rank+Projection evidence. Full rc4.196 acceptance is forbidden until a later fixed build passes a new canary.

rc4.195 is the prior fully accepted historical/rollback reference, **not current production**. rc4.196 package identity remains 17 files, `sha256:a654422c907e3127335c20df1956fc974442c3eb3be011a5d8eb1e9b71f4500d`, and is distinct from source, deployment, byte parity, and device acceptance. Current gate: `VERIFY_CANONICAL_AUTHORITY_THEN_AUTHORIZED_WORK`. Runtime/product behavior is unchanged by this checkpoint.

## HISTORICAL/SUPERSEDED README CONTENT
> **Current authority:** v11.8.0-rc4.195 is production/device accepted for its released Waiver/Trade/Weekly-Evidence scope. v11.8.0-rc4.196 Start/Sit / Weekly Context source is merged through PR #143; it is not deployed or physically accepted, and deployment parity is UNKNOWN_REQUIRES_REVERIFICATION.
> **Season mode:** current Sleeper league state is Source of Truth; completed draft roster is immutable historical evidence only.
> **HISTORICAL rc4.158 bounded change:** adds a draft-day v4 expert baseline/delta workflow. Unchanged or failed/incomplete refreshes restore the prior verified baseline; panel rebuild can run cache-only and occurs only for baseline creation/repair or a real ranking delta.
> **HISTORICAL rc4.158 scope:** expert membership, weights, panel ranks semantics, tiers, Coach, Return-v2, manager logic, history and fingerprints are unchanged.
> **Draft locks:** exact canonical manager order/history; no K/DST; exactly one QB; Geno Smith and Aaron Rodgers hard excluded; starter maxima are not roster caps.

Built/source/package/deployment/device-observed/device-accepted are distinct states. Canonical main contains v11.8.0-rc4.196 source merged through PR #143; the observed merge commit is historical evidence only. v11.8.0-rc4.195 remains the current production/device authority. rc4.196 is not deployed or physically accepted, and its deployment parity is UNKNOWN_REQUIRES_REVERIFICATION. The rc4.196 local package remains PACKAGED_ONLY_NOT_DEPLOYED with 17 files and SHA-256 `a654422c907e3127335c20df1956fc974442c3eb3be011a5d8eb1e9b71f4500d`. Current checkpoint gate: `VERIFY_CANONICAL_AUTHORITY_THEN_AUTHORIZED_WORK`.

Promotion-stable checkpoint gate: `VERIFY_CANONICAL_AUTHORITY_THEN_AUTHORIZED_WORK`. Historical compatibility tokens retained for checkpoint validation: rc4.190, rc4.188, `UNKNOWN_REQUIRES_REVERIFICATION`, `MERGED/HISTORICAL`.

Historical release-contract baseline canary retained for regression tooling: `v11.8.0-rc4.64`.

## rc4.195 season evidence and FAAB convention

- The app automatically requests the current Justin Boone/Yahoo weekly ROS trade-value charts through the Cloudflare Worker. QB uses the published `1QB` column; RB/WR/TE use `HALF`. Publication/update timestamps, source URL, provider/author, weekly edition, mapping method, verification time and expiry are retained on every `trade_value` record. Missing, stale, malformed, ambiguous or partial-position evidence publishes no actionable snapshot.
- FAAB recommendation percentages always mean **percent of the league's original FAAB budget**. Displayed absolute units use that same original-budget basis and are capped at the manager's actual remaining FAAB. Historical transaction bids remain comparable because Sleeper records them in absolute units against the same original league budget.

## HISTORICAL/SUPERSEDED release log
All release, Android, deployment, gate and CURRENT claims below are historical at the named version; they cannot override the current source/physical/rollback boundary above or PITTI_CURRENT_STATE.json. This includes the obsolete rc4.92 named-QB policy, old package counts, and old Season candidates.

### rc4.142 startup root-cause
- rc4.138-rc4.140 contained a fatal missing comma between the Ray Davis and Tyler Warren `RESEARCH_RESIDUAL_PRIORS` entries. The HTML shell/version badge could load while the module failed before any UI handler bound, exactly matching the observed inert `Alles aktualisieren` button and `–` status fields.
- rc4.142 repairs that syntax defect and adds `tools/runtime-startup-contract.mjs`, which parses both source `app.js` and the service-worker-transformed runtime, checks required DOM ids, and guarantees visible refresh feedback before the first network call.

### rc4.83 — bounded late-WR challenger / decision-evidence test
- Kein Produktions-Promotion: rc4.82 bleibt Android-Authority bis zum realistischen OOS-Mock.
- WR6+/WR7+ wird spät graduell stärker abgewertet, ohne Hard-Cap oder pauschales RB-Forcing; außergewöhnlicher WR-Marktvalue bleibt zulässig.
- Coach-vs.-tatsächlichem Pick wird pro eingefrorener Entscheidung gespeichert; dedizierter `Pick-Evidenz exportieren`-Export ist draft-spezifisch.
- Evidence-v2 enthält zusätzlich automatische Flags für WR-Sättigungs-Empfehlungen und QB2-Verstöße.
- Historischer rc4.83-Abschnitt: damalige Guards enthielten Geno/Rodgers-Hard-Exclusions; **dies ist seit rc4.92 ausdrücklich verworfen**. Aktuell schützt der Guard exakt-einen-QB erst nach QB1, verbietet player-name QB exclusions, lässt Geno/Rodgers organisch ranken, lässt K/DST aus, erlaubt exceptional TE2 und schützt die Expert-Profile/Gewichte.

### rc4.82 — profile-aware health / metadata integrity candidate
- Keine Decision-/Return-v2-Retunings gegenüber rc4.80.
- Runtime-Version wird in `app.js` zentral aus `APP_VERSION` abgeleitet; Snapshot, Emergency Queue, Decision-State und Backup dürfen keine veralteten RC-Strings mehr tragen.
- Active Panel Health bewertet jetzt das **tatsächlich ausgewählte Profil**: Full-v2 vollständig eingebettet, WR-v2 als Hybrid aus eingebettetem WR-Board + Live-QB/RB/TE, Incumbent vollständig live.
- Ein degradiertes Live-Teilpanel im Hybridprofil darf nicht durch vorhandene Expert-v2-Stimmen verdeckt werden.
- Snapshot-Provenienz und Gewichtserklärung sind profilabhängig: Frozen Expert-v2 Board vs. Live-Multi-Source-Pipeline vs. Hybrid.
- Drei Profile bleiben verpflichtend auswählbar; Brown bleibt aus v2 ausgeschlossen; Erickson bleibt Challenger ohne numerisches v2-Votum.
- User-Strategie bleibt exakt ein QB; WR7+-Safety bleibt roster-aware ohne WR-Cap; TE2 bleibt nur Soft-/Exceptional-Value-Pfad.
- Draft-critical Regression `tools/rc482-draft-critical.mjs` schützt diese Semantik dauerhaft.
- Source-/Legacy-/Return-/UI-/Android-Gates PASS. Frischer Snapshot bestätigt rc4.82, Panel-Health OK, Frozen Expert-v2 Board und eingefrorene effektive Gewichte ohne Live-Neunormierung.

### rc4.78 — OOS roster/option-value research challenger
- User-Draftpfad: nach QB1 kein QB2 auf der Coach-Oberfläche; Gegner-/Return-Modell bleibt unverändert.
- WR7+ bleibt legal und kann natürlich gewinnen; PlayerQualitySafety darf einen gewöhnlichen gesättigten WR aber nicht mehr über die Roster-Utility zurückpromoten. Safety-Ausnahme nutzt den bestehenden `Starker Value`-Schwellwert (+10 vs ADP).
- Embedded Expert-v2 Einzelränge werden im Snapshot als solche berichtet statt fälschlich `0/0` / `KEINE`.
- OOS-Gates: Draft 1398395487467368448, Picks 112/129/132/149. Keine Spielername-Forcings, kein pauschaler RB-Bonus, kein WR-Cap, kein TE2-Verbot.
- Erst nach vollständigem Release Contract darf ein Nachfolger Android erreichen.

### rc4.77 — Release Contract v2 pre-install candidate
- Kandidat erst nach Behavioral-, Evidence-kind-, Draft-phase-/Roster-State-, Regression-, Completeness- und Re-Extract-Gates freigeben.
- Return/WAIT, Expert-v2, feste Expertenreihenfolge, Einzelrankings, Pfeile, Parker-These und Kartenbegründungen sind als ausführbare Invarianten geschützt.

### Release Contract v2 — Prozessumbau
- Fail-closed Behavioral Gate gegen die echten Live-Presentation-Funktionen.
- Handcodierte PLAYER_EVIDENCE-Produkttabelle entfernt; strukturierte Research-Evidence bleibt Quelle der Differenzierung.
- Return ist das normale Timing-Signal; WAIT bleibt als Ausnahmehinweis. Legacy JETZT/EHER-JETZT aus dem sichtbaren Coach-Pfad entfernt.
- Paket-Gate testet das re-extrahierte 11-Dateien-Runtime-ZIP.
- Kein Installationsrelease bis Checkpoint/README/Package-State atomar synchronisiert sind.

### rc4.75 — verworfen
- Spielerindividuelle Draft-Gründe werden vor technischen Coach-Reasons gerendert.
- `Positions-Alternativen`, Tier-/Utility-Hinweise dürfen nicht mehr die primäre Plus-Begründung verdrängen.
- Return-Chance bleibt Timing-Signal; nur `WAIT` bleibt als explizite hohe-Return-Ausnahme.
- Upside-/Regression-Pfeile und Parker-Washington-Invariante `WR2 mit WR1-Upside` bleiben erhalten.
- Expert-v2-Gewichte/Routing unverändert.

.
> **Android authority update:** fresh Pick-9 snapshot confirms v11.8.0-rc4.93. Walker remains Panel 15.3 / ADP 17.4; the reproduced defect is Top-10 presentation ordering. rc4.94 fixes display selection only.

## rc4.95 source challenger (2026-08-28)
- Source challenger: `v11.8.0-rc4.95`; Android/package/deployment authority remains `v11.8.0-rc4.94` until full release gates and device verification.
- Generic Sleeper `Questionable` alone has no Coach penalty; concrete acute injury evidence remains authoritative.


### rc4.97 isolated microfix challenger
v11.8.0-rc4.97 is a test-only actionability/presentation challenger. rc4.96 remains rollback/Android authority until all gates pass.


### rc4.98 evidence-polarity challenger
v11.8.0-rc4.98 fixes generic Pro/Contra sign routing in the live surface. rc4.96 remains Android rollback authority until full validation.


## v166 replay-status canary
- Bounded frozen-fixture replay rc4.101 -> rc4.104 is CI PASS for the observed failure mechanisms at pick92/109/112 and exact pick132 Spears/Andrews; Return-v2 unchanged.
- Canonical mock: draft-companion-v7-backup-2026-08-29T05-28-09-291Z.json / draft 1399284498113294336.
- Browser-equivalent full historical recomputation is unavailable from preserved transient inputs and must not be fabricated.
- Current gate: RC4104_REPLAY_BOUNDED_PASS_DRAFTDAY_READINESS.









## HISTORICAL/SUPERSEDED Season Companion candidates
- v11.8.0-rc4.171 — candidate: gives live-roster bootstrap first network priority, defers ranking/watcher background traffic until roster settles, keeps refresh buttons interactive while busy, and exposes 1/3–3/3 roster loading stages. Pending CI/preview/device acceptance.
- v11.8.0-rc4.170 — candidate: direct bounded-timeout Sleeper roster bootstrap, explicit Kader refresh with busy/error feedback, and fresh-origin slot-to-roster mapping recovery; Cloudflare watcher remains evidence-only. Pending CI/preview/device acceptance.
- v11.8.0-rc4.169 — candidate: fixes workspace leakage caused by author CSS overriding `hidden`, adds visible season ranking freshness/manual refresh with 12h controlled auto-refresh, and isolates Season render lanes so one Trade/FA renderer crash cannot blank unrelated live surfaces. Pending CI/preview/device acceptance.
- v11.8.0-rc4.168 — supersedes failed v11.8.0-rc4.167 and fixes the deterministic Season Trade startup crash caused by `tradeOfferCandidates` dereferencing nonexistent `target.x`; the function now consumes the row actually passed by `renderTradeWorkspace` (`target.r` / `target.p`). A new executable Season bootstrap runtime regression is mandatory in both candidate-package and release-contract gates. Kader remains season-first; Draft is archive only; FAIL-CLOSED behavior remains intact. Current installed Android app remains rc4.158 until automated gates and one final canary pass.


### rc4.173 startup-resilience candidate
- Device rc4.172 disproved the prior static interaction gate: `seasonRankingAge` rendered, but `seasonLiveStateAge` remained at the HTML dash and both Season refresh buttons were ineffective.
- That narrows the failure boundary to startup after workspace selection but before Season live-state/control completion. Legacy local research evidence is now sanitized; optional research-cache status rendering is fail-isolated so it cannot abort startup.
- A malformed-cache startup regression is now mandatory in release/package validation. No further device test before those automated gates pass.

## v11.8.0-rc4.196 Start/Sit / Weekly Context — source merged, production pending

The source merged through PR #143 adds current-week Half-PPR ECR evidence, global legal-slot Start/Sit optimization, and provenance-preserving NFL game context. rc4.195 remains the production/device-accepted authority; rc4.196 is not deployed or physically accepted.
