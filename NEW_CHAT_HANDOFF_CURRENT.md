# NEW CHAT HANDOFF — PITTI SEASON COMPANION
Handoff generation: `20260902T1640Z-v230`
Created: 2026-09-02 16:40Z

## CURRENT AUTHORITY
Mode POST_DRAFT_SEASON_COMPANION.
Current merged source: **v11.8.0-rc4.188** on `main`, merge commit `c4ccbd1959b986e0b810ac97c5ad0900d7fa441d`.
Latest physically observed Android: **v11.8.0-rc4.188 PARTIAL PASS** (version + Sleeper/expert freshness + 3h policy observed; Waiver/FA still pending). Accepted rollback authority remains **rc4.169**.
Do NOT restore older "PR #108 open", rc4.183-as-current-device, rc4.187-current-release, 12h expert freshness, or JAX-as-free states.

## RC4.188 CONTENT / GATES
rc4.188 contains:
- fail-closed full 10-team Sleeper league representation before FA/Waiver/Trade trust;
- unique roster/owner identities plus ownership-index parity against raw Sleeper rosters;
- live FAAB used/remaining;
- canonical Sleeper starter/FLEX geometry; TE2 allowed when a legal FLEX is won;
- active-only ordinary drop semantics; IR/Reserve never ordinary capacity;
- Season expert auto-refresh after 3h, retry throttle 45m, force/on-demand path retained;
- corrected Week-1 DST baseline; stale PIT #3 and unverified implied-points evidence removed;
- Trade targets display live manager identity + FAAB rather than opaque roster id.
PR #113 exact head `98a76cfb6c369e7ff3a36e0e25f95e130c0b9f4e` passed Project Guardrails, Release Contract v2, Candidate Package and Cloudflare preview before merge.

## NEXT PHYSICAL GATE
One physical Android rc4.188 canary is now required:
1. update/reload app to rc4.188;
2. open Waiver/FA;
3. send one screenshot;
4. perform no add/drop beforehand.
The purpose is to verify the real 10-team Sleeper ownership/FA pool on-device. Only after that may DST, Lawrence FAAB and trade recommendations use availability claims.

## LAWRENCE / DST
Trevor Lawrence is a possible in-season exception to the draft-only one-QB rule. No generic QB2 ban.
Evaluation must include:
- actual opponent QB need across all 9 opponents;
- live FAAB remaining and bounded current-season/history priors;
- same Bye Week 7 as Jayden Daniels;
- TWO active opportunity costs while D/ST is still missing: Lawrence drop now + later D/ST drop.
JAX D/ST is confirmed unavailable and must never be treated as free. No DST candidate is valid until the real Sleeper FA pool is verified.

## AUTO CONTRACT — HARD
AUTO/AUTO BLOCK = continuous same-turn execution while any safe positive-value autonomous work exists.
After every work package: checkpoint material change -> re-inventory ALL independent lanes -> execute next safe package.
No interim progress/status/acknowledgement messages, no empty replies, no promise-only “AUTO läuft weiter”, no “keine Handlung erforderlich” stop while work remains.
Waiting CI/deploy/device blocks only the dependent lane. Continue parallel lanes first.
Visible AUTO output only for concrete result, unavoidable user action/input, safety/irreversible confirmation, or demonstrated exhaustion of all independent work.
STATUS = report-only; no tools/work/polling.

Never send status/progress/acknowledgement messages while executable AUTO work remains.
