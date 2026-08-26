# PITTI Expert-v2 — additive/selectable integration contract (2026-08-26)

Status: FROZEN REQUIREMENT / RESEARCH BRANCH. No production/main/gh-pages/device mutation by this commit.

## Non-negotiable integration rule
Expert-v2 MUST be added as an additional selectable expert configuration. It MUST NOT overwrite, mutate, rename away, or silently replace the existing rc4.64 incumbent expert configuration.

The incumbent rc4.64 configuration remains available as a first-class selectable option and as the control arm for A/B/replay validation.

## A/B semantics
- Control: unchanged rc4.64 incumbent expert configuration.
- Treatment: Expert-v2 candidate configuration.
- Only the selected expert-panel rank input may differ between arms.
- Coach, Return-v2, manager/opponent model, roster/championship utility, Value-Safety, injury/research inputs, pick geometry and all other non-panel logic remain identical.
- No PairSum/Rolling resurrection, no player-name forcing, no fixed roster quotas/caps, no generic Return-v2 retune.

## UI/runtime requirement for eventual integration
The user must be able to deliberately select either the incumbent configuration or Expert-v2. Selection must be explicit and persistent; no hidden auto-migration from incumbent to v2.

If Expert-v2 later becomes preferred/default after passing promotion gates, the incumbent option still remains available for immediate fallback and comparison.

## Promotion gate
Do not integrate/promote Expert-v2 into a draft package until the exact fixed-kernel replay contract in `EXPERT_V2_EXACT_AB_PARITY_GATE_2026-08-26.md` passes its control-parity gate and treatment shows no material natural-fixture regression.
