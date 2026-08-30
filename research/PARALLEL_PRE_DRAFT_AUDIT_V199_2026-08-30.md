# PITTI parallel pre-draft audit — v199 — 2026-08-30

## Scope
Parallel work requested under AUTO: data-quality audit hardening, v4/v5 divergence diagnosis, and live-draft invariant hardening. No scoring/model retune unless a reproducible release-critical defect is established.

## v4/v5 divergence diagnosis
- Exact paired backup evidence remains 14 states; 11/14 share the same leader.
- Pick 32 is the important portfolio canary. Before pick 29 the user roster was WR1/RB1. v4 correctly led with Malik Nabers while Nabers' modeled short-turn return probability was ~64.8%; the user selected Jeremiyah Love instead.
- At pick 32 the roster was therefore WR1/RB2. Nabers was still available and had the better v4 panel rank (26.65) than Javonte Williams (28.95), yet v4 Coach put Javonte first by only two score points (100 vs 98). v5 put Nabers first.
- This confirms the user's concern is structurally valid: adding Love cannot logically create a stronger generic RB-need argument. The divergence is a near-tie sequencing/portfolio effect, not evidence that Javonte is clearly better.
- Decision: do NOT retune rc4.131 on one near-tie. For live interpretation, the Override Guard must treat this shape as a plausible reorder: when top candidates are within a few Coach points, roster portfolio + panel rank + championship utility may put Nabers ahead. Return labels are timing, not pick commands.
- Audit tooling is extended to emit roster counts and the relevant Need/Return/Loss/Tier/alternatives reasons for every v4/v5 leader comparison so this failure mode is visible in future backups.

## Data-quality hardening
- Existing backup audit already detects sparse expert coverage and generic-only top candidates.
- McLaurin remains the canonical sparse-coverage canary (4/6 in both profiles, missing Boone + Koerner).
- Swift remains the canonical generic-description canary in rc4.130 evidence; rc4.131 adds player-specific context.
- No blind rank/position imputation is allowed. Missing expert position/rank stays missing and lowers coverage/confidence rather than silently becoming an opinion.

## Live-draft hardening
The existing release/guardrail suite remains authoritative for:
- starter maxima != roster caps;
- no normal K/DST draft;
- exactly one user QB after QB1, with Geno/Rodgers ranking organically before QB1;
- duplicate snapshot guard;
- candidate visibility/no unexplained disappearance;
- Return-v2 sequencing not overriding a clear championship-utility gap;
- no Superflex/2QB contamination;
- emergency fallback preserved.

No new runtime code is justified by this audit. The audit-tool change is offline-only and must pass its self-test plus the full release/guardrail/package suite before merge.

## Freshness
Same-day web scan during roster cutdown found no new material IR/PUP/season-ending or depth-role event that justifies a model change. Roster transactions remain active through the cutdown deadline, so draft-day freshness remains the next material gate.
