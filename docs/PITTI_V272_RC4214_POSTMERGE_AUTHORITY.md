# v272 rc4.214 post-merge authority reconciliation

Generation: 20260928T1918Z-v272

v11.8.0-rc4.214: PR #213 reviewed head 63162c9427fa70f1897331c15ffb2c6a38d50701, merged canonical main a1e6c0e4ca22a4709353840d78414f2ba6d3d5ee, identical reviewed/merged tree 2ebb61df4f077f419b91b048d321781b43785332. SOURCE MERGED_CANONICAL; PRODUCTION DEPLOYED_SUCCESS (a10c3257-2342-4fa4-a15a-d191306199b1, check 109091210171); PHYSICAL PENDING. CI/deployment facts are USER_SUPPLIED_EXTERNAL_EVIDENCE; Git parent/tree verified locally after fetch. Postmerge authority failure was runtime version lock drift, not a new runtime defect. Next gate: RC4214_PRODUCTION_COMBINED_PHYSICAL_ACCEPTANCE_PENDING.

Root cause reproduced locally: runtime version lock drift (lock rc4.213 versus merged rc4.214). No runtime defect or new deployment inferred. External PR213 checks and final candidate Strict Suite 248/248 exit 0 are user-supplied evidence. Reviewed and merged trees match exactly; fresh Git confirms canonical parent 4229a24d0e2960f279c3f05dd69c80d9530f75dc.

Current source MERGED_CANONICAL; Production DEPLOYED_SUCCESS; physical PENDING. Historical rc4.213 diagnostic and original rc4.213 source provenance are preserved in CURRENT; rc4.212 stays historical; rc4.210 remains last broad fully accepted physical baseline. Runtime behavior and all 17 package files are unchanged. No automatic transactions; Team Total remains unavailable and outdoor weather requires fresh event-bound evidence.

Repair semantics retained:
- broad_ecr: Calendar-date precision preserved; season/week/scoring/chronology/mapping gates remain strict
- rb_wrong_position: ROW_LEVEL_CONTAINMENT; wrong rows never create evidence; minimum same-position ratio 0.90; payload position and substantial contamination fail closed; 111/112 Broad RB and 106/107 selected RB regressions PASS
- selected_pitti: EXACT_REQUESTED_EXPERT_IDENTITY_REQUIRED; no relaxation
- storage: ONLY_REBUILDABLE_NUMERIC_EXPERT_CACHES; full snapshot retried after each eviction; protected evidence/history preserved; projection-only fallback only if full write cannot fit; four-position read-back regression PASS
- diagnostic: SANITIZED_TOP_TEN_KEY_NAMES_AND_CHARACTER_COUNTS_ONLY; no values or secrets
- start_sit: DOWNSTREAM_PERSISTED_EVIDENCE; no independent Start/Sit patch
- dst: UNCHANGED_CURRENT_PLUS1_PLUS2_PLANNER

Validation: guardrails, seal integrity, postmerge regression (21 authority negatives / 6 external-evidence negatives), takeover (9 negatives), release contract and release completeness PASS. Runtime identity 17/17 PASS. Complete strict suite once: 248/248 PASS, exit 0. Only this receipt, CURRENT validation receipt and seal finalized afterward; final focused authority and integrity checks PASS.

Next gate: RC4214_PRODUCTION_COMBINED_PHYSICAL_ACCEPTANCE_PENDING
After external publication and green exact-head/postmerge authority checks, separately authorized combined rc4.214 Production physical acceptance: visible version, live Sleeper freshness, four-position projections/Broad ECR/selected PITTI including RB containment and strict identity, full persisted ranks and top-key diagnostic, complete legal Start/Sit without QB omission, Game Context PASS 16 games/32 teams, D/ST current/+1/+2 ownership/capacity, no fabricated Team Total/weather and no automatic transactions. No device action in this authority-only task.
