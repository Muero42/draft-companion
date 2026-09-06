# PITTI takeover audit — v180 — 2026-08-29

> HISTORICAL/SUPERSEDED operational checkpoint: runtime, device, deployment, release/activation gates and CURRENT/OVERRIDE instructions below describe the original dated context only. They must not be executed as current work or override ../PITTI_CURRENT_STATE.json and ../NEW_CHAT_HANDOFF_CURRENT.md. Research evidence and durable invariants remain as provenance, subject to later explicit corrections.

Purpose: independent new-chat verification against stale-state regressions before expert-v4/v5 implementation.

## Authority verified
- Main head / sealed handoff: f2dca789e50af020178aad418f4c974b740a4aaa, generation 20260829T1951Z-v180, PASS / handoff_ready / second_pass.
- Accepted Android/runtime baseline: v11.8.0-rc4.106.
- Production main stays frozen while expert work is isolated.
- Research branch was found stale/diverged (behind main by 9 commits). It was repaired before further work: reset to sealed v180 main, then only the disabled selector prototype and coverage audit were reapplied. Post-repair compare: behind 0, ahead 2.

## Recent state that remains authoritative and must not regress
- Manager geometry correction from rc4.84 remains authoritative: slots 5–8 are Basti / Björn / Michael K (alias Giuliano) / Pascal B (alias Pascal Gelderner). Older rc4.83 mapping is invalid.
- rc4.92 correction remains authoritative: Geno Smith and Aaron Rodgers are NOT player-name hard exclusions. They rank organically before QB1; exactly-one-QB is the user roster strategy after QB1. Any name-specific demotion/removal is a regression.
- No normal K/DST draft.
- Starter maxima are not roster caps.
- WR saturation remains soft; exceptional WR slides remain legal. No hard WR quota/cap and no blind RB forcing.
- No PairSum/Rolling resurrection, no generic Return-v2 retune, no player-name scoring forcing, no Superflex/2QB contamination.
- Real board/fundamental player value + roster utility + freshness are primary; Return/manager layer is sequencing, not permission to override a clear championship-utility gap.
- Mock manager labels are simulation aliases, not observed current-year manager decisions.
- Player-description cleanup is secondary to expert-panel integrity.

## v178 evidence preserved through v180
- rc4.106 completed mock 1399325404598124544 remains valid evidence.
- Real draft is expected to have more late-RB competition than that mock; model broadly, not as a Basti-only effect.
- Preserve Woody Marks talent/workhorse-quality correction.
- Preserve Charbonnet IR/PUP stash-package EV concept.
- Aug30 final-53 and Aug31 waiver/freshness windows remain mandatory draft-day refresh gates.
- Current transaction/source-year guards remain active; legacy same-date pages with old body years are rejected.

## Expert v4/v5 authority
- v3 is frozen/selectable control; historical outputs are not rewritten by the coverage fix.
- v2 is retired from the new v4/v5 comparison path.
- v4: individual-only, position-specific, target 4–6 experts; current-board freshness/depth and mapping are hard gates; multi-year positional draft accuracy primary, 2025 recency/stability correction; cap single-expert influence.
- Draft Sharks Team is excluded from v4 because Team-feed identity cannot be equated to identified DS-individual historical accuracy, not because the organization is weak.
- v5: minimal-invasive v3 + Sean Koerner, funded primarily from DS share, position-specific and not a blind transfer.
- Koerner current 2026 FantasyPros availability is established by 2026-08-29 screenshots; old paywall-only assumption is superseded, but import/coverage still requires exact verification.
- Selector must sit directly above Analyze, preserve the exact same draft/roster state across v3/v4/v5, and visibly identify the active preset.
- v4/v5 remain disabled until coverage/missingness semantics pass.

## Expert-coverage blocker
- Bigsby/Spears inconsistency is systemic, not isolated.
- Draft-pool incomplete coverage: QB 5/30, RB 36/90, WR 20/80, TE 12/30.
- No absence-as-opinion, no blind point-rank imputation, no silent materially-different renormalization.
- Distinguish source/acquisition failure vs genuine outside-board/right-censored rank vs intentionally short board; make effective N and reason visible.
- Coverage logic must be regression-tested across all positions before v4/v5 activation.

## Deferred evidence lock
- draft-companion-v7-backup-2026-08-29T19-44-43-926Z.json is the natural mock with user real decisions.
- It remains intentionally unanalyzed until the user explicitly lifts that restriction.

## Exact implementation order
1. Coverage/missingness source-reason classification and aggregation policy.
2. Current expert availability/freshness/depth/mapping matrix.
3. Final v4/v5 membership and weights.
4. Same-state v3/v4/v5 counterfactual/regression suite: Pick-12 RB cluster, late-RB consistency, WR accumulation canaries, one-QB invariant, TE path, candidate visibility/no disappearance.
5. Only after PASS: enable selector, package/re-extract, release gates, main promotion, gh-pages parity, Android acceptance.
