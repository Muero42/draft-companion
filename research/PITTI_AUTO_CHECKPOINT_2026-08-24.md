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
New source: `research/ROUND34_FINAL_DECISION_MAP_2026-08-24.md`.
- Olave has strongest current median case: elite 2025 target/efficiency profile and healthy WR1 role.
- Nabers has the highest championship ceiling of the focal trio but materially wider ACL/meniscus recovery distribution until contact clearance.
- Flowers is healthy/usable but generally the most waitable of the focal trio.
- Existing 29->32 survival evidence remains Nabers 47.44% / Olave 80.17% / Flowers 97.75%, sequencing-only after intrinsic tier/health.
- If Nabers is contact-cleared by draft, Nabers/Olave become a close high-value tier; championship-oriented default may take Nabers at 29 and exploit Olave's higher survival. If Nabers remains restricted, Olave moves ahead on health-adjusted intrinsic value.
- Keep nearby Pickens/Rice/DeVonta/Tee/Tet/Egbuka and any RB/WR faller visible; do not reduce the turn to three WR names.
Round 3/4 focal research is CLOSED unless material news or acceptance pathology reopens it.

## Later windows — RELEASE PRIORITIES
New source: `research/LATER_WINDOWS_RELEASE_BOARD_2026-08-24.md`.
- 49/52: RB/WR still primary; true fallers override quotas. Explicitly preserve visibility for high-upside/value names such as Tuten/Judkins/Henderson and Egbuka/Tet/DeVonta/Garrett as board-appropriate, without hard-coding them.
- 69/72 onward: increasingly buy asymmetric upside in a shallow 10-team league; RB contingency/receiving/goal-line paths are preferred when tiers are close, but clear WR tier fallers remain valid.
- QB1 becomes increasingly live from this zone; Late-QB is a preference/tiebreaker, not a hard suppression. Geno Smith/Aaron Rodgers remain hard exclusions.
- Later bench: ceiling/role-change optionality over replaceable veteran floor. Parker Washington remains a price-sensitive preferred target, not a forced pick.

## Stable release lineage audit
Source: `research/FINAL_RELEASE_ACCEPTANCE_PLAN_2026-08-24.md`.
Known prepared baseline `pitti-auto/finalization-rc4.52` has deterministic workflow: restore rc4.50 runtime, apply rc4.52 runtime+hardening, syntax/contract gates, deterministic eight-file ZIP, unzip integrity, SHA-256 and provenance. Last recorded PASS: run 32230244548; runtime commit 8adb47c363785df54a06a96a831268939e1812e7; ZIP SHA-256 38e46c942e2b95c862587fdab1bd5bf71b2da524e5efc1ef0107acaad2c7bf32. This is prepared provenance only, not Android-installed proof.

### Stable-lineage code audit Aug 24
- Existing `rosterState` and `rosterExceptionPenalty` on rc4.52 still contain effectively global QB2/TE2 suppression (`need` roughly -24/-22 plus exception penalties reaching -42). This is stale versus the metadata-safe mechanism audit: early/mid duplicates are usually bad, but very late QB2 can have real option/startability value. Final RC must make duplicate suppression phase-sensitive rather than a permanent blanket ban.
- Existing quality safety gate is valuable and must stay; do not replace it with hard player ranking or opaque scalar collapse.
- Best low-risk insertion path is via deterministic finalization scripts/tests, not wholesale rc4.59 simulator code.

## Serial critical path NOW
1. Create release-candidate branch from verified stable rc4.52 lineage.
2. Implement minimal transparent policy hardening only: acute-status guard/provenance, phase-sensitive QB2/TE2 handling, preserve tier-first quality safety, no hard-coded first-turn player winner.
3. Add targeted regression tests before large simulation: no active acute-HOLD recommendation as healthy; early QB2/TE2 strongly suppressed; late exceptional duplicate can remain visible; Geno/Rodgers exclusions; K/DST policy; top candidate visibility.
4. Run deterministic build/syntax/contract tests.
5. Run large fresh complete-draft acceptance battery at slot 9 with position-aware metadata. Frequency audit: pathological players, true-faller capture, early QB/TE duplicates, RB/WR construction, late upside, acute-status violations.
6. Fix only replicated explainable defects; rerun acceptance on fresh/disjoint seeds.
7. Build deterministic RC ZIP, regression/audit provenance.
8. Android install + natural 2-minute dress rehearsal only when runtime verification becomes necessary.
9. Freeze passed RC for Aug 31; afterward only material data/injury refresh and necessary low-risk bug fixes.

## Acceptance hard fails
- repeated Chase Brown 1.09 without explicit new re-tier;
- repeated Josh Allen 2.02;
- acute-status player presented as normal healthy recommendation while restriction is active;
- deterministic Bowers 2.02 concentration;
- repeated early QB2/TE2 without exceptional-value evidence;
- permanent late QB2/TE2 ban despite clear exceptional value;
- user K/DST drafting policy;
- deterministic player/position domination caused by artifact rather than board state.

## Parallel queue
While compute/build is pending: later-round intrinsic/upside/downside board; breakout/decline evidence; opponent/return timing; mock infrastructure; stable-lineage regression/version hygiene; Sleeper queue fallback. Health only event-driven. Watcher is secondary until draft release is unblocked.

AUTO scheduling rule: never idle merely because serial work is pending. Work independent parallel queue unless it risks contamination or repository-write conflict. Diagnose failures before retrying. Interrupt only for a genuine device/user/external-decision gate or an unresolved ambiguity that would contaminate release/evidence.

No user action currently required.