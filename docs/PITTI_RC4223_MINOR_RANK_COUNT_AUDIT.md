# rc4.223 minor Start/Sit rank-count correction

Android core repaired functionality is USER-CONFIRMED PASS. This minor UI/diagnostic correction does not reopen functional acceptance.

Both missingRank predicates previously counted non-IR skill players without checking eligibility or usable projections. Both now require lineup_eligible===true, projection_available===true and rank_available!==true. The physical result is1 (Sadiq), excluding Price/Jefferson OUT. The static cache suffix changes v1 to v2 to deliver the corrected app; runtime version remains rc4.223. Every other runtime byte is preserved by the bounded-scope regression.

Focused eligibility and lineup-evidence regressions PASS, including OUT with/without projection, Questionable projected without rank, missing projection, locked/IR exclusions and UI/diagnostic equality. No local full Strict Suite. Exact-head cloud validation/publication pending.

Additional focused checks PASS: syntax app/sw; unchanged compact persistence/lock regression; offline mocked mobile browser including reload/reopen. Guardrails and bounded runtime-scope/history checks PASS. Core physical PASS is a separate current user-confirmed receipt; old pre-device Production receipts remain immutable historical evidence.
