# PITTI HANDOFF CURRENT — 2026-08-23 16:42 CEST

## PURPOSE / NEW-CHAT BOOT
This is the compact current handoff for continuing PITTI without reconstructing from chat memory. Read this file first, then the referenced research artifacts on this branch. Treat verified artifacts/data as source of truth; never infer league geometry, manager order, ranking freshness, or runtime state from a blurry screenshot or stale prose.

Current working branch: `pitti-decision-counterfactual-kernel`.
Open PR #12 is research-only (`research: actual rc4.59 RNG parity gate`). Branch and main are materially diverged; do NOT casually merge/rebase or promote research changes to production.

## USER PRIORITY NOW
The user is away and wants LONG AUTO BLOCKS with parallel useful work and minimal interruption. Goal for tonight: test whether Draft Companion recommendations are again realistic/better. User believes recent recommendation quality regressed; treat this as a hypothesis to test, not as proof, but prioritize restoring/verifying realistic draft decisions over adding new strategy.

Freeze philosophy remains: refine/fix; do not overturn the established strategy without strong evidence. Draft is 2026-08-31. Major changes should be avoided when possible, but a necessary material fix is allowed if evidence shows it is needed.

## VERIFIED LEAGUE / DRAFT GEOMETRY — HARD GUARD
NFL Elite, 10 teams, Half-PPR. User is slot #9.
Snake turn is exactly: user pick 9 -> Dutch High Flyers / Marc at slot #10 makes picks 10 and 11 -> user pick 12. Later: user 29 -> Dutch/Marc 30 and 31 -> user 32.
Do not repeat the prior errors that started the 2.02 candidate group at 13 or assigned the turn picks to the wrong manager.
2026 order verified from user screenshot:
1 Michael / Niederrhein Tractors
2 Pascal / Voerde Eagles
3 Marc / Düsseldorf Sentinels
4 Thomas / Tönisvorst Dripping Blues
5 Bastian / Rumeln Fireflies
6 Björn / Team GeldernerGoofys
7 Giuliano / Italian Warriors
8 Pascal B. / Oeding Bears
9 user / Muerotechnik
10 Marc / Dutch High Flyers
League starters shown by NFL app: 1 QB, 1 RB, 2 WR, 1 TE, 1 FLEX W/R/T, 1 FLEX W/R, 1 K, 1 DEF, 6 BN, 1 IR. Earlier Companion semantics guard is correct: max simultaneously startable WR/RB/TE is not a roster/draft cap.
If a screenshot is too small/unclear, say so and request a smaller crop; NEVER manufacture an interpretation.

## WHY RECENT WORK WENT OFF TRACK
We spent days producing unrealistic first-turn recommendations/scenarios (examples: Chase Brown at 1.09 in 20/20 cases, Bowers treated too aggressively at 1.09, Josh Allen at 2.02). User correctly objected. Root process failure: evaluation/optimizer outputs and stale/mixed market assumptions were allowed to outrank verified current draft reality.
Old 893-branch mixed-market result is quarantined for strategy conclusions.
Do not resurrect old PairSum/global-score behavior merely because it produces a numerical optimum.

## CURRENT FIRST-TURN REALITY
Realistic normal 1.09 core is currently treated as an overlapping decision tier around James Cook, CeeDee Lamb, Ashton Jeanty, Justin Jefferson; Achane/Saquon remain legitimate comparisons when available. Genuine higher-tier fallers (notably JSN/Amon-Ra/Jonathan Taylor depending current evidence; CMC requires health/risk check) must be considered before normal sequencing.
Chase Brown is NOT a normal 1.09 candidate. He may be a legitimate 2.02 comparison depending board/tier.
Brock Bowers may be a legitimate 2.02 branch if quality-plausible, but no forced elite-TE preference and no automatic 1.09 promotion.
Josh Allen is not a primary 2.02 candidate in this 1-QB / Late-QB strategy. Do not accidentally use FantasyPros OP/superflex rankings as overall 1-QB strategy input.
Hard QB exclusions from established project policy remain Geno Smith and Aaron Rodgers.

## TIER-FIRST DECISION RULE — IMPORTANT NEW GUARD
User explicitly highlighted that rank 12 vs rank 17 may be meaningless if experts place both in the same tier. Adopt this.
Decision hierarchy:
1. verified availability/current board;
2. robust intrinsic/evidence tier and real higher-tier fallers;
3. within overlapping/same tiers, TAKE/WAIT / return-risk can break close decisions;
4. roster construction/opportunity cost;
5. raw overall rank differences only as weak evidence when tiers overlap.
Do not invent a tier solely from rank numbers. Preserve explicit expert tiers separately from PITTI-inferred evidence clusters. Return probability must not cross a robust tier boundary merely to optimize sequencing.
Current evidence does NOT support a hard, high-confidence tier separation among Cook/Lamb/Jefferson/Jeanty; analyst tier boundaries vary materially.

## VERIFIED FIRST-TURN COUNTERFACTUAL FINDING
Current verified-market harness: 80 fresh seeds, 484 realistic 1.09 states, 5,835 complete branches.
Key finding: if the same two players are ultimately obtained at 9+12, pick order usually has almost no downstream effect. Examples already verified:
- Lamb <-> Jefferson: 30/32 identical continuations.
- Jeanty <-> Jefferson: 56/60 identical.
- Achane <-> Jefferson: 69/71 identical.
- Cook <-> Jefferson: 7/9 identical; sample too small for extra intrinsic inference.
Therefore pair-synergy is NOT the main mechanism. Sequencing is chiefly about loss/return probability among intrinsically close players.
Robust prior result: Cook-first or Lamb-first while waiting on Jefferson has the clearest return asymmetry when they are in the same/overlapping tier. Jeanty-vs-Jefferson is closer and should lean more heavily on intrinsic/tier evidence.
Do not present model percentages as precise real-world probabilities; LOW/MID/HIGH return-risk is safer unless calibrated.

## 3.09 / 4.02 — NEXT HIGH-VALUE TURN
Once 9/12 is stable, prioritize realistic full drafts and 29/32.
Nabers, Olave, Flowers are key candidates but the candidate frontier must remain open to actual fallers/other quality-plausible players.
Current tier work found Olave/Nabers/Flowers often grouped in the same broad WR tier by current sources; raw rank gaps must not dominate.
User's new opponent hypothesis: Marc at picks 30/31 is probably more likely to draft Chris Olave than Zay Flowers. User thinks many league managers may perceive Flowers as inconsistent and less as a breakout candidate. Treat this as an informative prior, NOT verified fact. Audit Marc's historical WR behavior/current market before encoding it. If supported, Olave has higher loss-risk than Flowers at 29->32 and this can be a legitimate same-tier TAKE/WAIT lever. Nabers must be evaluated separately because expert-vs-market value may be large.

## RESEARCH METHOD / ANTI-OVERFIT
Primary active design is decision-level counterfactual evaluation, not another global coefficient. See `research/DECISION_COUNTERFACTUAL_NEXT_PLAN_2026-08-23.md` and `research/DECISION_COUNTERFACTUAL_HARNESS_SPEC_2026-08-23.md`.
For the same realistic state, force each quality-plausible candidate, use common random numbers, freeze continuation policy, persist full draft + FA pool, and compare downstream outcomes. Candidate set must include panel, market/ADP, Return-v2 pressure, and independent PITTI evidence; never only Coach top-5.
Use at least two continuation policies and audit shared prefixes/RNG isolation. No coefficient tuning on the same branches. Research output cannot promote production directly without held-out verification.
Independent expected wins is an anchor, not championship probability. Preserve disagreement between panel, outcome evaluator, market and tiers rather than hiding it in a composite score.

## CURRENT CODE / BRANCH STATE
Production/default `main` is not the same thing as the research branch. Current main app.js was fetched at commit `be8ea3e95fb892e3ffca3228371fc09907958a40` during this chat. Research branch PR #12 head was `e107c9a002835ce61a2f4167bc6770c27310dcb8` when last inspected and is hundreds of commits ahead while also behind main; treat as diverged.
The app contains canonical live draft ID `1366053132970233856`, slot 9 validation, active 2026 manager-map text, normal candidate admissibility and coach candidate logic. Do not assume branch research is installed on Android.
Prepared/repository version is NEVER proof of Android runtime version. User/runtime verification is required before claiming a new Companion build is installed.

## TONIGHT TEST OBJECTIVE
Before asking user to test, spend the AUTO block on everything that can be verified without phone runtime:
- audit current Companion recommendation path against the corrected league geometry and tier-first rules;
- identify the smallest low-risk production fix(es) required to prevent absurd 1.09/2.02 recommendations;
- test those fixes with regression + realistic draft states + held-out seeds;
- ensure genuine fallers remain surfaced;
- ensure candidate list is broad enough but excludes clear reaches absent documented override;
- validate 29/32 sequencing and Marc-opponent prior without hard-coding the user's hunch;
- run realistic complete mocks and inspect recommendation plausibility, not only aggregate score;
- compare against recent known-good behavior where possible to diagnose the perceived regression;
- keep all production-affecting changes small and auditable this close to draft day.
Only interrupt for an unavoidable Android/runtime check or a genuinely external decision. Otherwise continue long AUTO blocks and parallelize research/audit/tests.

## FILES TO READ NEXT
- `research/DECISION_COUNTERFACTUAL_NEXT_PLAN_2026-08-23.md`
- `research/DECISION_COUNTERFACTUAL_HARNESS_SPEC_2026-08-23.md`
- `research/FIRST_TURN_VERIFIED_CURRENT_MARKET_RESULTS_2026-08-23.md`
- `research/FIRST_TURN_DECISION_MAP_2026-08-23.md`
- `research/FIRST_TURN_INTRINSIC_VALUE_AUDIT_2026-08-23.md`
- `research/FIRST_TURN_PAIR_EVIDENCE_2026-08-23.md`
- `research/DIRECT_2_02_CANDIDATE_COUNTERFACTUAL_SPEC_2026-08-23.md`
- `research/FA_REPLACEMENT_RAW_AUDIT_2026-08-23.md`
Then inspect actual current code and test artifacts on the branch/default main as appropriate; never infer their state from this prose alone.

## NEW-CHAT START COMMAND
`PITTI AUTO — continue from research/PITTI_HANDOFF_CURRENT.md on branch pitti-decision-counterfactual-kernel. Read it and the referenced current artifacts first; verify actual code/branch state before acting. Long AUTO blocks, parallel useful work, no reconstruction from chat memory, no production promotion without gates.`
