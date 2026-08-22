# rc4.59 policy ablation screen — interim diagnosis (2026-08-22)

Research-only. No production promotion.

## Screen design
Each completed variant used 10 common-random-number seeds per regime (baseline + stress), 60 total full drafts / 20 Coach drafts. This is a screening sample only; `runs_per_regime_ge_50=false`, so no policy ranking is certified.

## Primary independent comparison: Coach vs MARKET_ROSTER (expected wins over 14 weeks)

| Variant | Baseline MARKET_VALUE_DROP | Stress MARKET_VALUE_DROP | Baseline LAST_TWO_DROP | Stress LAST_TWO_DROP | Screen interpretation |
|---|---:|---:|---:|---:|---|
| QB1_ONLY | -0.572 | -0.711 | -0.573 | -0.718 | Strongly dominated; removing QB2+ alone does not repair policy |
| QB1_TE1 | -0.630 | -0.722 | -0.633 | -0.727 | Strongly dominated; TE2 suppression adds no meaningful repair |
| QB1_TE1_DEFER_TE69 | -0.148 | -0.283 | -0.149 | -0.285 | Best screen by a large margin; baseline CI crosses 0, stress remains dominated |
| QB1_TE1_RB2_BY52 | simulation PASS; outcome unavailable | simulation PASS; outcome unavailable | simulation PASS; outcome unavailable | simulation PASS; outcome unavailable | raw drafts must be preserved and drop-evaluator failure diagnosed before interpretation |

## Roster-shape diagnostics from Coach rows
- QB1_TE1: baseline mean QB/RB/WR/TE = 1.0 / 5.2 / 7.8 / 1.0; stress = 1.0 / 5.8 / 7.2 / 1.0. Brock Bowers was selected at pick 12 in all 20 Coach drafts.
- QB1_ONLY: baseline = 1.0 / 4.9 / 7.4 / 1.7; stress = 1.0 / 5.2 / 7.3 / 1.5. Brock Bowers was selected at pick 12 in all 20 Coach drafts.
- QB1_TE1_DEFER_TE69: baseline = 1.0 / 5.9 / 7.1 / 1.0; stress = 1.0 / 5.6 / 7.4 / 1.0. Chase Brown replaced Bowers at pick 12 in all 20 Coach drafts.

## Causal interpretation allowed by this screen
1. QB2/QB3/QB4 overdrafting is a real structural defect, but capping QB at one does not explain most of the full-policy deficit.
2. Simply capping TE at one also does not solve the deficit.
3. The large improvement when early TE is deferred points to the **early-TE/Bowers-at-12 decision region** as the highest-value next causal target. This is not evidence that a hard `no TE before pick 69` rule should be promoted.
4. The next experiment should search a softer early-TE opportunity-cost rule / timing threshold and preserve exceptional TE value falls rather than hard-code a permanent late-TE doctrine.
5. RB2_BY52 cannot be judged until the pre-Week1 drop evaluator is shown to be complete/legal for the generated roster states.

## Next gates
- Diagnose RB2_BY52 raw roster/seed and the exact `retain13()` legality failure without weakening constraints blindly.
- Expand only the best early-TE causal family to >=50 seeds/regime after a small threshold/exception-value screen identifies the least restrictive repair.
- Keep production rc4.59 unchanged and `policy_ranking_certified=false` until full validation + health sensitivity pass.
