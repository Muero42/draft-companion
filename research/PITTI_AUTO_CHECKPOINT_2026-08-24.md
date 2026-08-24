# PITTI AUTO checkpoint — 2026-08-24

Authority: subordinate to canonical Library `PITTI_CURRENT_STATE.json` generation `20260823T210148Z-v57` and newer verified evidence. Read after `PITTI_HANDOFF_CURRENT_OVERRIDE_LATEST_2026-08-23.md`.

## FINALIZATION PIVOT — user-directed Aug 24
Primary objective is now delivery of a stable final Draft Companion that maximizes championship probability in the user's actual 10-team half-PPR league. Research is subordinate to release readiness. Do not keep extending narrow research questions after they are decision-sufficient.

Mandatory work order:
1. Finish current intrinsic player board by actual pick windows, beginning 1.09/2.02, then 3.09/4.02, then later windows. Player quality/upside/downside/role/health first; TAKE/WAIT second.
2. Convert decision-sufficient findings into simple transparent Companion policy. Avoid opaque scalar collapse and avoid large architecture changes this close to draft.
3. Run realistic complete slot-9 drafts/frequency audits as acceptance tests. Diagnose pathological picks/roster construction; change policy only for replicated, explainable failures.
4. Produce one release candidate from the last verified stable runtime lineage, preserving Research vs Prepared vs Android-installed distinction.
5. Regression/audit ZIP, then Android 2-minute dress rehearsal. If passed, freeze as draft release; after freeze only data refreshes and necessary low-risk bug fixes.

## Freshness policy
Stop repetitive broad health checks every AUTO cycle. Refresh event-driven when material new news exists, plus scheduled draft-window refreshes. Acute unresolved injuries get targeted monitoring. Do not spend AUTO capacity repeatedly reconfirming unchanged CMC/Nabers/Warren/Bowers states.

### Ashton Jeanty — CRITICAL HOLD
On Aug 23 Jeanty suffered an apparent right-leg/lower-body injury in Raiders practice while diving for a pass, needed help leaving and initially could not bear weight. As of the latest Aug-24 search there is no reliable official diagnosis in the retrieved evidence. Pre-injury quality remains high (current ECR around 12; Fitz Aug-22 rank 9), but all healthy-player simulation/ranking assumptions are stale until diagnosis/participation clarity. Mark `INJURY_HOLD_DIAGNOSIS_REQUIRED`; do not delete him and do not assign an invented numeric penalty. Any final board must branch on diagnosis/status.

## Current certified corrections
- Tier-first always precedes TAKE/WAIT/timing.
- Turn-Pair Brown 1.09 INVALID; Rolling-v1 INVALID; PairSum-v2 aggregation REJECTED.
- Chase Brown not normal 1.09; Josh Allen not normal 2.02.
- Name-only later-round lineage contaminated; position-aware metadata-safe evidence required.
- No global QB2/TE2 hard ban and no seed-fit pick-cutoff rule.
- Bowers 2.02 is no longer a dedicated critical-path research question. User independently considers 2.02 early; current evidence agrees that superior RB/WR fallers should precede him. Keep Bowers as a legitimate exceptional-value candidate, not default, and reopen TE-specific research only if realistic acceptance mocks reproduce TE pathologies.
- Research-only outcomes do not authorize production promotion; rc4.52 prepared baseline and rc4.59 Android-used research/test boundary remain distinct.
- AUTO never starts an interactive user mock.

## QB2/TE2 mechanism
Exact 60-seed metadata-safe hard-guard comparison rejects blanket ban but does not vindicate old repeat behavior. Corrected direct-marginal schema-v2 audit covers 166/166 repeats after invalidating earlier 73/166 run. Heterogeneous result: QB repeats 99 better / 1 tie / 30 worse; TE repeats 21 better / 15 worse. Early/mid repeats can be harmful while very late repeats can have option/startability value. Seeds 459710001..060 are mechanism/regression only; no threshold fitting. For finalization, prefer a simple conservative early/mid duplicate guard with explicit exceptional-value escape rather than fitting a new complex model; validate in fresh realistic mocks.

## Quarantined research
- `research/rc459_te_pathwise_opportunity_2026.py`: NOT AUTHORIZED; `decision.top` may be truncated. Its workflow failed before analysis due historical artifact HTTP 404; no result exists.
- `isolated early-lookahead causal`: NOT STRATEGY EVIDENCE; treatment is `PAIRSUM_LONG2_DECISION`. Negative-control only: all 16 divergences chose Chase Brown while neutral chose Lamb/Barkley/Jeanty.
- 484-state / 5,835-branch current-market pair harness: mechanism-PASS but `strategy_certified: false`; useful diagnostic only. Strong anti-default-Bowers signal is sufficient to deprioritize TE research, not to create a hard Bowers ban.

## First-turn market snapshot Aug 24
Current FantasyPros half-PPR ECR retrieved Aug 24: Gibbs 1, Bijan 2, Chase 3, Puka 4, JSN 5, Amon-Ra 6, Jonathan Taylor 7, CMC 8, Lamb 9, Jefferson 10, James Cook 11, Jeanty 12, Drake London 13, Chase Brown 14, A.J. Brown 15, Barkley 16, Bowers 17, Achane 18, Nico 19, Hampton 20. Pat Fitz Aug-22 notably differs: Jeanty 9 pre-injury, Bowers 10, Jefferson 11, Cook 12, Kenneth Walker 13, Chase Brown 14, Barkley 15, Lamb 16, Achane 17, Hampton 18. These are evidence lenses, not automatic ranking. Jeanty injury supersedes pre-injury rank until clarified.

Immediate 1.09/2.02 adjudication pool must therefore emphasize realistic fallers among CMC/JT/Lamb/Jefferson/Cook plus London/Barkley/Achane/Hampton/Chase Brown/KW3 as appropriate, with Jeanty held pending diagnosis and Bowers below superior RB/WR fallers. Do not manufacture a fixed order before intrinsic/health/upside/downside adjudication.

## Pick 29/32
Nabers/Olave/Flowers timing remains 47.44% / 80.17% / 97.75% for 29->32, sequencing-only after intrinsic tier and health. Flowers acute quad concern closed absent setback; Olave Aug 20 absence was rest; Nabers still carries materially wider recovery uncertainty. Finish intrinsic adjudication and then move on; do not repeatedly research this trio unless new material news arrives.

## Serial critical path NOW
1. Finalize 1.09/2.02 intrinsic tier/conditional map, explicitly handling Jeanty HOLD.
2. Finalize 3.09/4.02 intrinsic map; then systematically cover later pick windows and upside targets.
3. Audit/implement minimal transparent roster-construction protections and TAKE/WAIT behavior in the stable Companion lineage.
4. Run large realistic complete-draft acceptance battery at slot 9 using opponent/market model; frequency audit for pathological picks, early QB/TE duplicates, position balance, late upside, and championship-oriented ceiling proxies.
5. Fix only replicated explainable defects with small low-risk changes; rerun acceptance.
6. Build final RC ZIP, regression/audit it, then require Android runtime/dress-rehearsal only when device verification is genuinely necessary.
7. Freeze passed RC for Aug 31; final pre-draft data/injury refresh only.

## Parallel queue
While compute/fetch is pending, independently work on: later-round intrinsic/upside/downside board; breakout and decline-risk evidence; opponent/return timing; realistic-mock readiness; deterministic artifact/version hygiene; queue/autodraft fallback; Watcher only if draft-critical work is no longer blocked. Do not repeatedly refresh unchanged injuries. Do not let optional TE research block finalization.

AUTO scheduling rule: never idle merely because a serial experiment or external job is pending. Work the independent parallel queue unless doing so could contaminate evidence or create repository-write conflicts. If a suspected state/error cannot be resolved reliably and proceeding risks contaminating the release/evidence, fail closed and ask the user only when no autonomous verification path remains.

No user action currently required.
