# PITTI handoff current override — 2026-08-23

This file supersedes stale immediate-next-action sections in `PITTI_HANDOFF_2026-08-22.md`. Canonical `/Pitti/PITTI_PROJECT_STATE.md` remains Source of Truth and should be read to EOF first when available. If that Library path is unavailable in a new chat, use this override plus the verified research artifacts on branch `pitti-decision-counterfactual-kernel`; never reconstruct missing facts from chat memory.

## VERIFIED-DATA-ONLY REALITY GATE — CRITICAL
Current NFL Elite league geometry is frozen from the user's clear 2026-08-23 league screenshot in `research/VERIFIED_LEAGUE_CONFIG_2026-08-23.json` and enforced by `research/rc459_verified_league_reality_audit_2026.js`.

Verified current league facts:
- 10 teams, 15-round snake;
- user slot 9 / Muerotechnik / @Muero;
- slot 10 Dutch High Flyers / @Gipfelstuermer / research alias `Dutch Marc`;
- user picks exactly 9,12,29,32,49,52,69,72,89,92,109,112,129,132,149;
- first turn exactly user 1.09 -> Dutch 1.10 -> Dutch 2.01 -> user 2.02;
- Dutch picks 10+11 are the SAME manager and the second decision must use the roster after the first;
- roster: QB1, RB1, WR2, TE1, FLEX W/R/T 1, FLEX W/R 1, K1, DEF1, BN6, IR1;
- therefore skill starting topology is QB1 plus six RB/WR/TE slots with RB 1-3, WR 2-4, TE 1-2; TE is eligible for only one flex slot.

The fail-closed reality audit repeatedly PASSes. The existing full-policy research core was already correct on the critical snake geometry: `USER_SLOT=9`, exact user-pick list, slot10=`Dutch Marc`, and the opponent function reads current roster counts before every opponent choice. A recent conversational claim that the simulator itself had Marc/Dutch geometry wrong was false; the error was assistant reconstruction/narrative, not this validated core.

Screenshot policy: if any required screenshot value is not clearly readable, report it as unreadable and obtain a clearer/smaller crop. Never plausibly reconstruct names/settings from a blurry image when verified project data exist. Verified current config outranks memory/public defaults; conflicts fail closed.

## VERIFIED CURRENT SLEEPER HALF-PPR MARKET — AVAILABILITY ANCHOR
Frozen file: `research/SLEEPER_HALF_PPR_MARKET_ANCHORS_2026-08-23.json` (commit `9b78de1b6e3317d68d111ca797ad0224cc16b24d`). Provenance: public Sleeper-derived Half-PPR ADP updated 2026-08-22. This is an AVAILABILITY anchor only; it does not replace independent player-quality evaluation.

Relevant anchors: CMC 5.1, Taylor 6.2, JSN 6.6, Amon-Ra 8.0, Cook 9.6, Lamb 10.5, Saquon 11.5, Jeanty 12.6, Achane 13.6, Jefferson 13.7, Hampton 15.6, Chase Brown 16.6, Henry 17.8, Walker 18.1, A.J. Brown 19.5, London 20.6, Bowers 22.1, Nico 23.1, McBride 24.1, Nabers 30.1, Olave 32.3, Flowers 41.6. Josh Allen ADP ~21 but remains CONTROL/MAJOR REACH at pick 12 for this 1QB/Late-QB strategy.

This confirms the user's correction: Jeanty/Jefferson are normal/plausible 1.09 options, Cook/Lamb are also normal turn-core, while Amon-Ra/Taylor/JSN are progressively more favorable fallers.

## FIRST-TURN MARKET CALIBRATION — PASS, AVAILABILITY ONLY
`research/rc459_sleeper_market_turn12_calibration_2026.js` PASS: 400 seeds / 2,416 conditioned states. Modeled pick-9 availability ordering: Taylor 5.5%, JSN 9.25%, Amon-Ra 31.25%, Cook 76%, Lamb 89.25%, Saquon 94.25%, Jeanty 99.25%, Achane 99%, Jefferson 99%. These are model frequencies, not literal forecasts.

Dutch source-locked profile audit PASS: 9 seasons, 2017-2025. Early position shares RB 47.44%, WR 38.16%, QB 9.85%, TE 4.55%, versus league RB 46.18%, WR 39.38%. Dutch therefore has only mild RB lean / mild WR underweight; do not invent strong WR avoidance.

Market-dispersion sensitivity PASS across tau 1.35/1.8/2.4/3.2/4.2. Robust conditional return ranges:
- Jeanty -> Jefferson survives to 12: 77.3%-91.8%; Jefferson -> Jeanty: 71.4%-84.5%.
- Cook -> Jefferson: 73.1%-86.1%; Jefferson -> Cook: 15.5%-45.2%.
- Lamb -> Jefferson: 72.9%-89.7%; Jefferson -> Lamb: 40.9%-56.5%.
- Jeanty -> Lamb: 36.4%-54.5%; Lamb -> Jeanty: 67.1%-74.9%.

Direction is robust: if intrinsic value is close, Cook/Lamb first and WAIT Jefferson has a strong sequencing case. Jeanty-vs-Jefferson is much closer; intrinsic value dominates. Do not display false exact return probabilities before empirical dispersion calibration; use LOW/MID/HIGH or robust ranges.

## VERIFIED PAIR-HARNESS RESULT
The verified-current-market full pair harness completed PASS with 484 realistic states / 5,835 full branches. When the same two players are obtained, their order almost never changes the later draft materially: Lamb/Jefferson 30/32 identical continuations, Jeanty/Jefferson 56/60, Achane/Jefferson 69/71, Cook/Jefferson 7/9. Therefore do NOT invent a Pair-Synergy bonus. Sequencing value is primarily return/loss risk.

## TIER-FIRST DECISION LAYER — MANDATORY
The user explicitly identified that expert rank 12 vs 17 may be immaterial when both belong to the same expert tier. This is now a core decision rule.

Order of operations:
1. genuine higher-tier faller/value;
2. intrinsic player-quality/evidence tier;
3. TAKE/WAIT only inside the same or credibly overlapping tier;
4. roster fit / positional economics as tie-breaker.

TAKE/WAIT may reorder close players but MUST NOT cross a robust MEDIUM/HIGH-confidence tier boundary. Do not infer a published expert tier merely from rank gaps. Keep explicit analyst tiers separate from PITTI-inferred evidence clusters. Current evidence supports treating Cook/Lamb/Jefferson/Jeanty as a substantially overlapping first-turn decision cluster rather than pretending a few rank positions are precise. External tier sources disagree on exact boundaries, which is itself evidence against hard rank-number distinctions.

First-turn practical map:
- genuine JSN/Amon-Ra/Taylor faller: normally TAKE after independent value/health check; CMC is a special health/decline-risk case;
- normal core: Cook/Lamb/Jeanty/Jefferson; Saquon/Achane remain explicit comparisons when available;
- Cook vs Jefferson close-tier: Cook TAKE / Jefferson WAIT;
- Lamb vs Jefferson close-tier: Lamb TAKE / Jefferson WAIT;
- Jeanty vs Jefferson: intrinsic grade first, only modest Jeanty-first sequencing edge;
- Chase Brown/Bowers are legitimate 2.02 comparisons, not normal 1.09 candidates;
- Josh Allen is not a primary 1.09/2.02 candidate.

At 2.02 ALWAYS rebuild from the actual board after BOTH Dutch picks. Never start the candidate group at rank 13; a surviving higher-valued faller remains eligible.

## 3.09 -> 4.02 / PICKS 29 -> 32 — CURRENT NEXT FRONTIER
After first-turn stabilization, focus moves to realistic complete drafts and pick 29 -> Dutch? NO: geometry must always be derived from the verified snake/manager map for picks 30/31 before user 32, never assumed from conversational shorthand. Candidate work includes genuine fallers plus Malik Nabers, Chris Olave and Zay Flowers.

Current tier evidence: Olave/Nabers/Flowers are frequently treated as the same or overlapping WR tier despite substantial rank variation. Nabers has shown a large expert-vs-market value gap in some fresh boards, so he must remain a genuine potential value/faller at 29 rather than being filtered by ADP alone.

User hypothesis to test, NOT hard-code: Marc/Dutch may prefer Olave over Flowers; Flowers may be perceived in this league as more inconsistent and less obvious as a breakout. Treat this as an informative prior only. Validate against Marc/Dutch historical WR choices, current market and roster-conditioned behavior. If confirmed and PITTI grades Olave/Flowers in the same tier, Olave may have higher loss risk at 29 and Flowers may be the better WAIT candidate. Nabers must be evaluated separately.

## FRESH ROLE / DOWNSIDE EVIDENCE TO RETAIN
- Cook: elite 2025 output; 385 touches incl. playoffs creates workload-regression/decline flag; no current acute health alarm.
- Jeanty: lead-back/high receiving upside; Mike Washington/Kubiak two-back usage trims assumed workhorse ceiling.
- Jefferson: elite target/talent history; 2025 QB/offensive context plus some efficiency/separation concern; current camp evidence positive.
- Lamb: elite WR turn option; Pickens lowers monopoly ceiling but not WR1 role.
- Achane: huge ceiling; QB/context may trim receiving-value assumption.
- Saquon: volume remains high but age/workload/efficiency decline warrants discount vs automatic reputation pick.
- Chase Brown: positive camp evidence; legitimate 2.02 comparison, not 1.09.
- Hampton: high upside but explicit hot-hand/backfield-distribution risk; do not assume bellcow.
- Kenneth Walker: strong talent/efficiency; injury history remains material.
- Bowers: healthy/elite TE case; legitimate 2.02 comparison, but no automatic TE premium and no 1.09 promotion.

## INVALID / QUARANTINED — NEVER RESURRECT AS STRATEGY EVIDENCE
- Original recursive turn-pair probe: INVALID candidate-score mutation/order-dependent inflation; caused 20/20 Chase Brown 1.09 artifact.
- Rolling-v1: INVALID future-board fallback.
- Joint-v1 z-score aggregation: REJECTED; amplified tiny differences and produced implausible Bowers 1.09.
- PairSum-v2 LONG2: REJECTED; future term effectively flat and collapsed toward panel rank, causing deterministic Chase Brown 2.02.
- Old `rc459_realistic_turn12_2026.js` 81-state/893-branch run: QUARANTINED for strategy because user frontier used newer anchors while opponents used older 90% ADP/10% panel market.
- Direct 2.02 31-state/375-branch experiment: causal research only; broad frontier is not primary strategy and Josh Allen-at-12 is evaluator-diagnostic only.

## STRATEGIC BASELINE — DO NOT OVERTHROW WITHOUT STRONG EVIDENCE
Existing strategy remains baseline: Late QB; very-late TE/streaming acceptable; early skill-position quality; late RB/upside/league-winner focus; no K/DST draft preference; TAKE/WAIT opportunity cost; user preference is a tie-breaker among plausible candidates, not a reason to suppress clearly superior value. QB hard exclusions Geno Smith and Aaron Rodgers remain. Elite QB value may still be surfaced when genuinely exceptional, but not forced by a broken evaluator.

League start limits are not roster caps: max startable WR/RB/TE topology must never be misread as total roster caps.

## COMPANION / PRODUCTION SAFETY
The user wants to test Companion recommendations later today and feels recent recommendations regressed. Treat that perception as a diagnostic signal, not proof. Goal is to restore realistic recommendations by fixing assumptions/decision layers, NOT by wholesale strategy rewrite.

Current GitHub research PR #12 remains DRAFT and research-only. At handoff time its head is on branch `pitti-decision-counterfactual-kernel`; do not equate research branch state with Android-installed or production Companion state. No large production change should be promoted merely because research looks promising. Verify artifact/version/runtime separately before asking the user to install/test.

Known device/workflow context from prior verified state: Android rc4.54 had been verified and direct homescreen shortcut to the draft chat worked after app close; Sleeper -> Draft Companion -> draft chat remains a fallback; `Snapshot -> Draft-Chat` was still unverified at that checkpoint. Later branch/research work must not silently be called installed.

## AUTO OPERATING MODE — CURRENT USER REQUEST
User is away and explicitly wants the next AUTO calls to be as long as safely/stably possible, with parallel work whenever useful. They can only check sporadically. Do not interrupt for status updates or optional choices. Continue autonomously until a device/runtime action is genuinely unavoidable, a meaningful end result is reached, or no reliable route remains.

Whenever a long job is active, use independent capacity on realistic complete mocks, 29/32 tier/return calibration, Marc/Dutch realism, current injury/role evidence, FA marginal value, Companion recommendation audit, regression/harness checks and draft-day usability. Do not waste waiting time.

## IMMEDIATE NEXT ACTIONS — UPDATED PRIORITY
1. Audit current Companion recommendation mechanism against the verified reality/tier rules before tonight's user test. Identify why recent recommendations felt worse; distinguish research-only findings from production behavior.
2. Run realistic complete mocks from verified league geometry/current market; inspect recommendations at every user pick for plausibility, not merely aggregate utility.
3. Build/validate 29->32 tier/return structure with Nabers/Olave/Flowers plus genuine fallers; test the user's Marc-Olave-over-Flowers hypothesis as a prior, not a fact.
4. Apply `TIER_CROSSING_BLOCKED`: sequencing may not cross robust tier boundaries. Record any attempted crossing as a diagnostic failure.
5. Keep first-turn map stable unless materially new evidence appears. No more repeated optimization of 9/12 for its own sake.
6. Continue injury/role/depth-chart/news refresh and FA/replacement economics in parallel; integrate only material changes.
7. Before any production promotion/install request, reconcile current branch, release ZIP/artifact, app version and actual Android-installed version. Prefer small, low-risk fixes this close to draft; major changes only if clearly necessary and strongly validated.
8. Maintain this handoff/checkpoint promptly whenever material findings, decisions, implementations, failures or artifact states change.

## NEW-CHAT BOOT PROCEDURE — FAIL CLOSED
On `PITTI AUTO` in a new chat:
1. Read canonical `/Pitti/PITTI_PROJECT_STATE.md` to EOF if accessible; newest appended sections override stale NEXT_ACTION sections.
2. Read this `research/PITTI_HANDOFF_CURRENT_OVERRIDE_2026-08-23.md` fully.
3. Read/verify `research/VERIFIED_LEAGUE_INVARIANTS_2026-08-23.md`, current market anchors, first-turn decision map/pair evidence, and the latest relevant 29/32 artifacts.
4. Verify GitHub branch/PR head and distinguish research from main/production/Android state.
5. Reconcile current release ZIP/artifact and installed Android version before any install-dependent work.
6. Resume the updated immediate-next-action list above. Do not reconstruct from chat memory, do not repeat invalidated approaches, and do not ask the user to restate known project facts.
