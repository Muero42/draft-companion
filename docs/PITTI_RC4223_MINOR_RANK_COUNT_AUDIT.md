# rc4.223 minor Start/Sit rank-count correction

Android core repaired functionality is USER-CONFIRMED PASS. This minor UI/diagnostic correction does not reopen functional acceptance.

Both missingRank predicates previously counted non-IR skill players without checking eligibility or usable projections. Both now require lineup_eligible===true, projection_available===true and rank_available!==true. The physical result is1 (Sadiq), excluding Price/Jefferson OUT. The static cache suffix changes v1 to v2 to deliver the corrected app; runtime version remains rc4.223. Every other runtime byte is preserved by the bounded-scope regression.

Focused eligibility and lineup-evidence regressions PASS, including OUT with/without projection, Questionable projected without rank, missing projection, locked/IR exclusions and UI/diagnostic equality. No local full Strict Suite. Exact-head cloud validation/publication pending.

Additional focused checks PASS: syntax app/sw; unchanged compact persistence/lock regression; offline mocked mobile browser including reload/reopen. Guardrails and bounded runtime-scope/history checks PASS. Core physical PASS is a separate current user-confirmed receipt; old pre-device Production receipts remain immutable historical evidence.

## Completion

PR225 merged 7437f12b47fa20c5d2ae0ede0bfa8a53dbf952e4; tree 5c9e2244b035419a4b6d6bdf159e1680ff729ff7 equals reviewed 853b0bf170ea775a07dc1ca8b006d018dc15491f. Exact-head candidate and canonical cloud Strict274/274 + browser PASS; canonical8/8 checks. Deployment f39eaba5-5b89-4c25-a46b-bcb35edcd128, check111237920079; all16 served static assets match canonical including the2 predicates and static-v2 cache. No local full Strict run. Android core physical acceptance remains USER_CONFIRMED PASS; no corrected-UI physical claim or reopened acceptance. Localv295Authority-only checkpoint remains unpushed.
