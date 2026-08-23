# PITTI first-turn pair evidence — 2026-08-23

Status: decision evidence, NOT scalar optimizer.

Verified geometry: user pick 9 -> Dutch High Flyers pick 10 -> Dutch pick 11 roster-dependently -> user pick 12. This document must not be used if that invariant fails.

## Evidence architecture
Evaluate a candidate pair on four independent axes and preserve disagreement:
1. intrinsic player quality / role / health / downside;
2. starter topology and positional portfolio value in NFL Elite (RB 1-3, WR 2-4, TE 1-2 across six RB/WR/TE starter slots);
3. market/return regret from pick 9 to pick 12;
4. later replacement/FA depth. Do not turn these into a single z-score or PairSum-style optimizer.

## Current market sanity check, 2026-08-23
Fresh external Half-PPR boards continue to put the relevant names in one broad turn tier, with meaningful disagreement. Fantasy BR (Aug 20) ranks Jefferson 8, Lamb 9, Cook 10, Jeanty 13, Chase Brown 15, Achane 17, Walker 20. FantasyPros overall Half-PPR cheat sheet currently has Lamb 9, Cook 10, Jefferson 11, Jeanty 12, Chase Brown 14, Saquon 16, Bowers 17, Achane 18, Hampton 20, Henry 21, Walker 23. This is a sanity check only; Sleeper-derived ADP remains the availability anchor.

Critical source guard: FantasyPros `position=OP` is a positional/QB-style view that can show Josh Allen #1. Never ingest that page as one-QB overall strategy evidence.

## Pair logic from verified availability work
When intrinsic grades are close, sequencing is driven by loss/regret:
- Cook + Jefferson: prefer Cook at 9 and attempt Jefferson at 12. Jefferson's modeled return direction is robustly higher than Cook's return after Jefferson.
- Lamb + Jefferson: prefer Lamb at 9 and attempt Jefferson at 12 for the same reason.
- Jeanty + Jefferson: Jeanty-first has only a modest sequencing edge; intrinsic player grade can override it.
- If the same two players are obtained either way, prior full-continuation research found overwhelmingly identical later drafts. Therefore do not invent pair synergy; sequencing value is chiefly availability/regret.

## Intrinsic evidence bands (provisional, not total ranking)
TOP-FALLER REVIEW: JSN / Amon-Ra / Jonathan Taylor. Normally TAKE when present at 9, subject to current material health/role evidence. CMC requires explicit health/downside check rather than automatic TAKE.

TURN CORE: Cook / Lamb / Jeanty / Jefferson. Current evidence does not justify a huge intrinsic gap. Cook has elite output and strong role with high prior workload; Lamb has elite WR profile with Pickens limiting monopoly ceiling; Jeanty has lead-back/receiving upside but some two-back ceiling pressure; Jefferson has elite history and current positive camp signal but 2025 context/efficiency questions.

SECONDARY REAL COMPARISONS: Achane / Saquon / Hampton / Chase Brown / Walker / Henry / London / A.J. Brown / Nico / Bowers, conditional on the actual board at 12. These are not equal. Brown/Bowers are legitimate 12 comparisons but not normal pick-9 candidates. Josh Allen remains excluded from the primary 12 frontier for this 1QB strategy.

## Draft-day decision skeleton
At pick 9:
A. If a verified top faller exists, compare him against the turn core on intrinsic evidence first.
B. Otherwise compare Cook/Lamb/Jeanty/Jefferson plus any independently strong Achane/Saquon case.
C. Use return asymmetry only after intrinsic closeness is established.

At pick 12:
A. Rebuild the actual board after BOTH Dutch picks.
B. Preserve any surviving top-12-quality faller; never begin at rank 13.
C. Select best intrinsic/roster-value option from the actual board; do not force the player we hoped would return.

## What still needs empirical resolution
1. Convert later-draft/FA evidence into descriptive pair diagnostics, not one scalar.
2. Stress-test RB+RB, RB+WR, WR+RB, WR+WR and TE-at-12 branches under identical continuation.
3. Verify whether positional scarcity in this exact shallow league materially favors an early RB anchor over WR/WR once actual FA replacement is included.
4. Resolve Jeanty-vs-Jefferson intrinsic ordering with held-out evidence rather than availability alone.
5. Do not promote any conclusion until the verified-current-market pair harness passes.