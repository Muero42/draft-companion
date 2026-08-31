# PITTI HANDOFF CURRENT — v211
Handoff generation: `20260831T0925Z-v211`

## Current release boundary
- **Android/device:** v11.8.0-rc4.137 is already visibly installed and running. Do **not** reinstall or refresh merely to reach rc4.137.
- **main:** v11.8.0-rc4.137.
- **gh-pages:** still v11.8.0-rc4.136, so main↔gh-pages parity is currently **not** established.
- rc4.137 Release Contract, Project Guardrails and package/re-extract are PASS.
- **Immediate next device gate:** verify rc4.137 tier behavior on the already-installed version.
- After that, reconcile gh-pages to the already-tested rc4.137 bytes and prove exact parity before final operational freeze.

## rc4.137 tier correction
rc4.136 hard-coded Andrew Erickson and Mariano external tier snapshots. That is invalid because Erickson is not an active Expert-v4 member and coverage was not position-safe.

rc4.137 removes those snapshots. Visible tiers are display-only and may be produced only from a FantasyPros Custom-ECR result for the **active position-specific Expert-v4 members that FantasyPros can actually select**. Unavailable active v4 experts are disclosed and **never replaced** by Erickson or any other outsider. The returned FantasyPros expert set and explicit tier field must be verified exactly; otherwise PITTI shows no external expert tier. No synthetic rank-gap tier is presented as an expert tier. Tier context never enters Coach score, Return-v2, opponent model, roster logic or history.

Active v4 panels:
- QB: Sean Koerner, Todd D Clark, Justin Boone, Dalton Del Don, Nick Mariano, Pat Fitzmaurice.
- RB: Ryan Weisse, Kev Wheeler, Dalton Del Don, Nick Mariano, Sean Koerner, Pat Fitzmaurice.
- WR: Sean Koerner, Nick Mariano, Justin Boone, Todd D Clark, Dalton Del Don, Pat Fitzmaurice.
- TE: Wolf of Roto Street, Ryan Weisse, Sean Koerner, Dalton Del Don, Pat Fitzmaurice, Justin Boone.

## Critical immutable draft invariants
Exact 2026 order:
**1 Michael · 2 Pascal Voerde · 3 Marc Düsseldorf · 4 Thomas · 5 Björn · 6 Pascal Gelderner · 7 Giuliano · 8 Bastian · 9 Muerotechnik/user · 10 Dutch Marc.**

Never resurrect Michael K, Moers Venom, Bastian at slot 5 or Pascal Gelderner at slot 8. Never shift/reindex historical picks, manager ownership, decision evidence or snapshot fingerprints.

Other locks:
- Starter maxima 4 WR / 3 RB / 2 TE are not roster/draft caps.
- No K/DST draft.
- Exactly one QB; no QB2.
- **Geno Smith and Aaron Rodgers are explicit user hard exclusions and must never be recommended/drafted.**
- Panel is baseline; Return is timing context, not a pick command.
- Preserve rc4.135 live-text expiry repairs and Josh Jacobs acute-status behavior.

## Manager-history identity locks
- Michael_Polk: 2020–2025 inclusive.
- Pascal Voerde: Pascal_Bracht/Bracht Eagles 2017–2022 + Pascal_Voerde/Voerde Eagles 2023–2025 = 9 canonical seasons.
- Pascal Gelderner remains a separate 2023–2025 identity.
- Björn 2021/2023 exclusions remain preserved.

## Evidence/model boundary
- v4 PRIMARY / v5 CHALLENGER / v3 failsafe.
- Latest evidence backup `draft-companion-v7-backup-2026-08-30T16-02-06-862Z.json` is 29/30 paired fixtures; pick29 expertv5 is missing. Never call it 30/30.
- No broad expert-weight or Return-v2 retune before the draft.

## Remaining agenda after rc4.137 device verification
1. Deferred WR comparison: Emeka Egbuka, Zay Flowers, Tetairoa McMillan, DeVonta Smith; Jaylen Waddle as reference. Compare baseline, role/injury, market and reliable v4-only tier context; rank pure upside/league-winner ceiling separately.
2. Final transaction/IR/PUP/waiver/depth-chart freshness pass; official status overrides stale Sleeper metadata.
3. Fresh expert-board + Sleeper Half-PPR ADP delta check.
4. Final late-RB/upside materiality and operational smoke checks.
5. ~19:50 operational freeze, then fresh execution-only real-draft chat.

AUTO/AUTO BLOCK means real autonomous execution with no promise/status-only replies.


## 2026-08-31 09:20Z — HANDOFF rc4.142 TIER PIPELINE
- Device evidence: rc4.141 starts and refreshes correctly; Analyze works; Tyler Warren individual description is restored. User screenshot proves expert-v4 ranks render, but NO tier labels render.
- Root cause isolated in v4 FantasyPros consensus tier verifier: it incorrectly required payload.total_experts to equal the selected v4 expert count. FantasyPros uses filters/expert metadata for the selected whitelist; total_experts is consensus-population metadata. This made valid custom-ECR tier responses fail closed.
- rc4.142 fixes ONLY that verifier semantics plus version alignment; exact returned selected expert IDs remain mandatory. No outsider substitution; Erickson remains forbidden for v4 tier provenance; tiers remain display-only and cannot alter Coach/Return/history.
- Latest rc4.142 commit with full gates PASS: f8c215b65ed3ab04c25d76af104bc2fa83639121. Runs: release 33367917513 PASS; package 33367917515 PASS; guardrails 33367917487 PASS; rc4.82 33367917505 PASS; rc4.83 33367917493 PASS.
- NEXT: verify/deploy exact rc4.142 runtime to gh-pages with byte parity, then ONE device verification for tiers. Do not send trial-and-error builds. If tiers still absent, inspect actual FP payload/provenance before another build.
- After tier acceptance: deferred 5-WR analysis = Emeka Egbuka / Zay Flowers / Tetairoa McMillan / DeVonta Smith, Jaylen Waddle reference; baseline/role-injury/market plus separate maximum-upside/league-winner ranking. Then final draft-day freshness/smoke agenda.
- Critical invariants unchanged: canonical order Michael/Pascal Voerde/Marc Düsseldorf/Thomas/Björn/Pascal Gelderner/Giuliano/Bastian/Muerotechnik/Dutch Marc; never reindex history/evidence/fingerprints; starter maxima are not roster caps; no K/DST; exactly one QB; Geno Smith + Aaron Rodgers hard excluded; v4 primary/v5 challenger/v3 failsafe; Warren/text coverage and Jacobs handling must not regress.


## 2026-08-31 09:25Z — FINAL HANDOFF AFTER rc4.142 DEVICE FAILURE
- **Android is already on v11.8.0-rc4.142.** Do not reinstall or request another update merely for version.
- Device proof: app starts, refresh works, Analyze works, Expert-v4 is selected, Tyler Warren's individual description is restored, but **NO external v4 tier labels render at all** on the visible candidates. Tier functionality is therefore **FAIL**.
- The rc4.142 code change removed the incorrect requirement `total_experts == selected-v4-count`. That hypothesis was insufficient. **Do not repeat it and do not make another speculative API-shape build.**
- **Immediate next gate: RC4.142_TIER_PAYLOAD_ROOT_CAUSE.** First inspect the actual live FantasyPros `consensus-rankings` payload for QB/RB/WR/TE through the existing proxy with the exact FantasyPros-selectable members of each active v4 panel.
- Capture request path + response structure and verify: selected expert IDs/provenance, `filters`/expert metadata, `total_experts`, where player rows actually live, position key/values, scoring/type/week semantics, and the real explicit tier field/key/value.
- Accept no tier unless the selected expert set is exactly verifiable. Missing active-v4 experts are disclosed and **never replaced by outsiders**. Erickson remains forbidden for v4 tier provenance.
- Once the payload-level root cause is reproduced, implement **one bounded fix**, add a deterministic regression fixture from the real response shape, run full release/package/guardrail + exact main↔gh-pages parity, then perform **one** device verification.
- Preserve the now-working rc4.142 startup/refresh/analyze path and **125/125 individual-description coverage**, especially Tyler Warren. No regression of Josh Jacobs handling, QB exclusions, draft order/history, Return-v2, Coach, manager mapping or snapshot fingerprints.
- After tier acceptance only: deferred 5-WR analysis (Egbuka / Flowers / Tetairoa McMillan / DeVonta Smith + Waddle reference), separate maximum-upside ordering, then final draft-day freshness/smoke.
