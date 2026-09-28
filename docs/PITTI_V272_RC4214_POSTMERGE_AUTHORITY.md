# v272 rc4.214 post-merge authority reconciliation

Generation: 20260928T1918Z-v272

v11.8.0-rc4.214: PR #213 reviewed head 63162c9427fa70f1897331c15ffb2c6a38d50701, rc4.214 runtime merge / v272 parent a1e6c0e4ca22a4709353840d78414f2ba6d3d5ee, identical reviewed/merged tree 2ebb61df4f077f419b91b048d321781b43785332. SOURCE MERGED_CANONICAL; PRODUCTION DEPLOYED_SUCCESS (a10c3257-2342-4fa4-a15a-d191306199b1, check 109091210171); PHYSICAL PENDING. CI/deployment facts are USER_SUPPLIED_EXTERNAL_EVIDENCE; Git parent/tree verified locally after fetch. Postmerge authority failure was runtime version lock drift, not a new runtime defect. Next gate: V272_AUTHORITY_PUBLICATION_EXACT_HEAD_CHECKS_PENDING.

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

Next gate: V272_AUTHORITY_PUBLICATION_EXACT_HEAD_CHECKS_PENDING
Externally publish the corrective v272 authority candidate and obtain exact-head checks; then merge v272 and obtain postmerge checks, resolve NEW canonical main/tree from fresh evidence, and verify successful Production deployment of that exact new main/tree with rc4.214 and 17 runtime blobs identical to the rc4.214 runtime merge/base. Only then enable RC4214_PRODUCTION_COMBINED_PHYSICAL_ACCEPTANCE_PENDING. No physical/device action is currently executable.

Current v272 state: LOCAL CORRECTIVE AUTHORITY CANDIDATE; publication/merge/postmerge and post-v272 Production evidence pending. The known PR213 Production deployment does not prove deployment of the future v272 merge. Future canonical main/tree must be freshly resolved; the physical acceptance binds to that new main/tree and its successful Production deployment. rc4.213 is the newest historical bounded observed installation, not accepted; rc4.210 remains the last broad accepted baseline.


## Corrective v272 follow-up

Confirmed four authority defects: rc4.212 observed aliases lagged the rc4.213 diagnostic; AUTO skipped publication prerequisites; future canonical identity was conflated with the PR213 runtime source; README retained a premerge undeployed sentence. Reconciled observed aliases to bounded rc4.213, encoded ordered premerge continuation in CURRENT/LOCK/COMMAND/SEAL, bound future physical eligibility to fresh post-v272 canonical main/tree and exact successful Production deployment with 17 unchanged runtime blobs. PR213 source/deployment evidence remains provenance, never proof of future v272 deployment. README premerge sentence is explicitly historical.

Follow-up validation: focused authority/alias/AUTO/dynamic-identity checks PASS (28 authority negatives, 6 continuation negatives, 12 physical-prerequisite negatives), takeover and release checks PASS, 17/17 current runtime blobs identical to the PR213 runtime merge. Complete strict suite exactly once: 248/248 PASS, exit 0. Only this receipt and seal finalized afterward; final focused authority/seal checks PASS.
