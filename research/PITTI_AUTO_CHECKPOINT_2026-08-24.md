# PITTI AUTO checkpoint — 2026-08-24

Authority: subordinate to canonical Library `PITTI_CURRENT_STATE.json` generation `20260823T210148Z-v57` and newer verified evidence. Read after `PITTI_HANDOFF_CURRENT_OVERRIDE_LATEST_2026-08-23.md`.

## FINALIZATION PIVOT — user-directed Aug 24
Primary objective is delivery of a stable final Draft Companion that maximizes championship probability in the user's actual 10-team Half-PPR league. Research is subordinate to release readiness. Do not extend narrow research after it is decision-sufficient.

## Freshness policy
Refresh health/role event-driven when material new news exists, plus draft-window refreshes. Do not spend AUTO capacity repeatedly reconfirming unchanged CMC/Nabers/Warren/Bowers states.

### Ashton Jeanty — ACUTE STATUS UPDATED Aug 24
Reports from ESPN/NFL Network relayed by Reuters now indicate the Aug-23 right-leg injury is believed to be a sprained ankle and is not expected to be long-term; Raiders had not yet issued an official detailed diagnosis in that report. Replace the previous unknown-severity emergency HOLD with `ACUTE_ANKLE_STATUS_PENDING_PARTICIPATION`. Do not treat him as fully healthy yet and do not invent a numeric penalty. Final draft-window decision should use the latest official/practice participation evidence.

## Certified stale-error guards
- Tier-first precedes TAKE/WAIT/timing.
- Turn-Pair Brown 1.09 INVALID; Rolling-v1 INVALID; PairSum-v2 REJECTED.
- Chase Brown not normal 1.09; Josh Allen not normal 2.02.
- Name-only later-round lineage contaminated; position-aware metadata-safe evidence required.
- No global QB2/TE2 hard ban and no seed-fit cutoff.
- Bowers is no longer a critical-path research question; superior RB/WR fallers precede him. Reopen TE research only for a replicated acceptance pathology.
- Research-only outcomes never authorize production promotion. Prepared rc4.52 baseline and rc4.59 research/test boundary remain distinct from Android-installed runtime.
- AUTO never starts an interactive user mock.

## FIRST TURN — DECISION-SUFFICIENT as of Aug 24
Source: `research/FIRST_TURN_INTRINSIC_FINALIZATION_2026-08-24.md`.
- Superior healthy fallers override sequencing; JT belongs in faller conversation. CMC remains high-ceiling with wider structural downside, not an acute injury-auto-fade.
- Normal T1 turn core: Lamb / Jefferson / Cook. No fabricated scalar winner.
- Jeanty is now acute-ankle-status-pending rather than unknown-severity HOLD; do not promote back to healthy tier until practice/status clarity.
- T2 / normal 2.02 comparisons: Barkley, Achane, London, Hampton, Chase Brown, Kenneth Walker and state-realistic A.J. Brown/Nico/Henry; Bowers exceptional-value-only behind superior RB/WR.
- Close Lamb-vs-Jefferson: Lamb first / Jefferson wait. Close Cook-vs-Jefferson: Cook first / Jefferson wait. Intrinsic tier gaps override timing.
- Pick 12 always rebuilds the whole available board after Dutch 10/11; never begin at nominal rank 13.
First-turn research is CLOSED unless material news or a replicated acceptance failure reopens it.

## Pick 29/32 — DECISION-SUFFICIENT as of Aug 24
Source: `research/ROUND34_FINAL_DECISION_MAP_2026-08-24.md`.
- Olave has strongest current median case: elite 2025 target/efficiency profile and healthy WR1 role.
- Nabers has the highest championship ceiling of the focal trio but materially wider ACL/meniscus recovery distribution until contact clearance.
- Flowers is healthy/usable but generally the most waitable of the focal trio.
- Existing 29->32 survival evidence remains Nabers 47.44% / Olave 80.17% / Flowers 97.75%, sequencing-only after intrinsic tier/health.
- If Nabers is contact-cleared by draft, Nabers/Olave become a close high-value tier; championship-oriented default may take Nabers at 29 and exploit Olave's higher survival. If Nabers remains restricted, Olave moves ahead on health-adjusted intrinsic value.
- Keep nearby Pickens/Rice/DeVonta/Tee/Tet/Egbuka and any RB/WR faller visible; do not reduce the turn to three WR names.
Round 3/4 focal research is CLOSED unless material news or acceptance pathology reopens it.

## Later windows — RELEASE PRIORITIES
Source: `research/LATER_WINDOWS_RELEASE_BOARD_2026-08-24.md`.
- 49/52: RB/WR still primary; true fallers override quotas. Explicitly preserve visibility for high-upside/value names such as Tuten/Judkins/Henderson and Egbuka/Tet/DeVonta/Garrett as board-appropriate, without hard-coding them.
- 69/72 onward: increasingly buy asymmetric upside in a shallow 10-team league; RB contingency/receiving/goal-line paths are preferred when tiers are close, but clear WR tier fallers remain valid.
- QB1 becomes increasingly live from this zone; Late-QB is a preference/tiebreaker, not a hard suppression. Geno Smith/Aaron Rodgers remain hard exclusions.
- Later bench: ceiling/role-change optionality over replaceable veteran floor. Parker Washington remains a price-sensitive preferred target, not a forced pick.

## Stable release lineage audit
Known prepared baseline `pitti-auto/finalization-rc4.52` has deterministic workflow: restore rc4.50 runtime, apply rc4.52 runtime+hardening, syntax/contract gates, deterministic eight-file ZIP, unzip integrity, SHA-256 and provenance. Last recorded PASS: run 32230244548; runtime commit 8adb47c363785df54a06a96a831268939e1812e7; ZIP SHA-256 38e46c942e2b95c862587fdab1bd5bf71b2da524e5efc1ef0107acaad2c7bf32. Prepared provenance only, not Android-installed proof.

### rc4.60 candidate — PRE-CANDIDATE, NOT YET PROMOTED
Branch `pitti-auto/final-rc-20260824` builds deterministic rc4.60 and all local/runtime/service-worker syntax/contract gates pass. Eight-file ZIP SHA-256: `9f67b17b9f7ab53bf2ef8d643de6a6330f4f3ed1fc48763cc9835a776da1d454`. It contains hard Geno/Rodgers exclusions, Jeanty acute-status fail-closed recommendation block, and phase-sensitive QB2/TE2 soft penalties. Do NOT ask user to install yet: full-draft mechanism validation uncovered a harness invalidation described below.

## CRITICAL INVALIDATION — prior rc4.60 phase-threshold full-draft run is NO-OP
Run `32701499038` / branch `pitti-qbte-threshold-challenger` must be quarantined even if every shard reports PASS.
- Shard 0 was compared against exact position-safe baseline shard 0 from run `32651366239`; roster geometry and choices were identical.
- Root cause: `scoreCandidate` is created inside the VM context and closes lexically over the original `rosterExceptionPenalty`. The challenger assigned `C.rosterExceptionPenalty = ...` only after `context()` returned. Reassigning that exported object property cannot alter the lexical binding used by `scoreCandidate`.
- Therefore PASS from that run proves execution/integrity only, NOT that the rc4.60 phase policy was tested.
- Baseline itself exposes the motivating pathology: some complete drafts contain 2–4 QBs and up to 3 TEs. This means a purely soft duplicate penalty needs a real structural acceptance test before release.
- Never infer strategy from `32701499038`; do not wait for it on the serial critical path.

## Corrected QB2/TE2 validation — current serial gate
Branch `pitti-qbte-hybrid-challenger`, draft PR #20, workflow `PITTI QBTE corrected capped phase hybrid v2`.
Corrected harness `research/rc459_meta_safe_qbte_hybrid_v2_fullmock_shard_2026.js`:
1. patches `app` source BEFORE `context()` extracts lexical helpers, so `rosterState`, `rosterExceptionPenalty`, and `scoreCandidate` see the intended rc4.60 phase policy;
2. exports lexical helpers only for canary verification;
3. fail-closed canaries verify exact early/mid/late QB/TE penalty behavior before any full draft;
4. uses position-safe metadata mapping;
5. applies an effective caller-level admissibility layer: QB3/TE3 always forbidden; before pick 121 QB2/TE2 only when the existing absurd-elite-slide exception is met; at 121+ a second QB/TE may remain available under the phase-sensitive penalty;
6. each shard fails if QB>2 or TE>2 appears.
Run id when created: `32703572114` (60 seeds, six shards + paired complete-roster Utility-v3.5 against exact metadata-safe baseline run `32651366239`).
Promotion requires exact seed union, canary PASS, position-safe metadata, no QB>2/TE>2, plausible roster geometry, and no unacceptable paired utility loss. Average utility alone is insufficient; inspect displaced RB/WR/upside and concentration.

## Global hard QB2/TE2 guard remains REJECTED
The previously tested global admissibility guard (essentially one QB/one TE except narrow elite slide) reduced paired complete-roster expected wins by about 0.1165 across the exact 60-seed comparison (better 9/60, worse 51/60). Do not solve the baseline multi-QB pathology by restoring a permanent one-QB/one-TE ban. The corrected hybrid explicitly tests a count-capped, phase-sensitive compromise.

## Serial critical path NOW
1. Complete corrected hybrid-v2 60-seed run and paired utility; ignore/no-op run `32701499038` for strategy evidence.
2. If hybrid improves roster geometry without unacceptable utility loss, port the minimal structural rule to stable finalization lineage as rc4.61; also fix the stale user-facing `index.html` text claiming Live-Coach score is unchanged on rc4.44 basis.
3. Add executable production gates for QB3/TE3 cap, pre-121 duplicate admissibility, late second-QB/TE exception, acute status, hard QB exclusions, transformed service-worker runtime.
4. Run deterministic build/syntax/contracts + fresh complete-draft acceptance on disjoint seeds.
5. Fix only replicated explainable defects, then package/seal rc4.61.
6. Android install + natural 2-minute dress rehearsal only when device runtime is the remaining gate.
7. Freeze passed RC for Aug 31; afterward only material data/injury refresh and necessary low-risk bug fixes.

## Acceptance hard fails
- repeated Chase Brown 1.09 without explicit new re-tier;
- repeated Josh Allen 2.02;
- acute-status player presented as normal healthy recommendation while restriction is active;
- deterministic Bowers 2.02 concentration;
- repeated early QB2/TE2 without exceptional-value evidence;
- QB3 or TE3 roster accumulation;
- permanent late QB2/TE2 ban despite clear exceptional value;
- user K/DST drafting policy;
- deterministic player/position domination caused by artifact rather than board state.

## Parallel queue
While compute/build is pending: later-round intrinsic/upside/downside board; breakout/decline evidence; opponent/return timing; mock infrastructure; stable-lineage regression/version hygiene; Sleeper queue fallback. Health only event-driven. Watcher is secondary until draft release is unblocked.

AUTO scheduling rule: never idle merely because serial work is pending. Work independent parallel queue unless it risks contamination or repository-write conflict. Diagnose failures before retrying. Interrupt only for a genuine device/user/external-decision gate or an unresolved ambiguity that would contaminate release/evidence.

No user action currently required.