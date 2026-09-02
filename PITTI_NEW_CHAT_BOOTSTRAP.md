# PITTI NEW CHAT BOOTSTRAP — v228
Generation: `20260902T1315Z-v228`

Read: COMMAND → CURRENT → SEAL → LOCK → PREFLIGHT → PROJECT_STATE EOF → CURRENT HANDOFF → BOOTSTRAP → MATRIX → actual PR/CI evidence.

Current truth: POST_DRAFT_SEASON_COMPANION. rc4.185 is merged source baseline. PR #108 on branch `pitti/trade-slot-geometry` is OPEN/UNMERGED and contains canonical trade-slot geometry, removal of blanket TE2 waiver penalty, full 10-team Sleeper league-state persistence (manager/roster/starter/reserve/taxi/FAAB), and opponent waiver-market inputs. Latest prior exact head 0a41ca11: release contract PASS, project guardrails PASS, candidate package FAIL only because existing live-trade regression requires the explicit invariant text “Sleeper roster_id is a league roster identifier, NOT the historical draft slot.” Runtime identity behavior remained correct. That invariant has now been restored; query latest exact head and CI, never reuse older results.

Lawrence lane: no manual opponent-roster screenshots as architecture. After PR #108 is valid, use Sleeper all-team state for opponent QB need + remaining FAAB + bounded manager/current-season priors. Our acquisition cost must include Lawrence active-slot drop AND the later mandatory D/ST active drop; IR/Reserve never ordinary capacity. Same bye with Jayden Daniels is a negative, not an automatic veto. Draft-era no-QB2 is not an in-season hard ban.

AUTO/AUTO BLOCK: continuous same-turn execution; reconstruct active/ready lanes from CURRENT; checkpoint/re-inventory after every package; no interim progress/status/ack, no empty response, no promise-only continuation. External wait blocks only its lane. STATUS = report-only.

Device: rc4.183 remains latest physical observation and DEVICE_REJECTED for Kader FA-card + IR ordinary-drop semantics. Accepted rollback rc4.169. No device-side trial-and-error; next device action only after rc4.186 automated gates/deploy parity, exactly one canary.
