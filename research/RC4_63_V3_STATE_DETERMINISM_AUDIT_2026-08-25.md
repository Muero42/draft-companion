# rc4.63 v3 near-tie — state determinism audit (2026-08-25)

Status: **STATIC PASS / DYNAMIC FIXTURE GATE STILL OPEN**  
Scope: research only. No runtime/production mutation.

## Frozen facts

- Android/runtime truth remains v11.8.0-rc4.63; Mock/LIVE parity is already PASS and frozen.
- 120-seed v3 near-tie A/B is PASS as an execution result, with zero distribution drift through pick 112 and changes confined to picks 129/132/149.
- v4 slot-aware remains rejected and is not inherited.

## Determinism inspection

The v3 decision patch computes `__decisionPriorityV3` only from the frozen candidate scores/metadata, pick number, and current roster counts. The late WR-saturation branch is activated only at `pn >= 120`, `WR >= 6`, with both a valid WR and RB, a raw-score gap in `[0, 1.0]`, and `RB < 7`.

The candidate sort is deterministic:

1. `__decisionPriorityV3` descending;
2. existing score descending;
3. raw score descending;
4. panel rank ascending.

The modifier itself contains no RNG and no player-name rule. Therefore the implementation satisfies the *static* identical-input ordering requirement: simulation RNG can change the state presented to the decision function, but there is no RNG in the v3 final ordering rule itself.

## Why this is not yet a promotion certificate

The 120-seed aggregate records only pick/name frequencies and final position counts. It does not persist a canonical state fingerprint plus full candidate ordering for repeated identical states. Aggregate equality therefore cannot prove dynamic same-state replay determinism or semantic parity on the 15 frozen natural rc4.63 fixtures.

Promotion remains fail-closed until a replay/fixture harness demonstrates, at minimum:

- repeated identical frozen state -> byte-identical ordered candidate IDs/names and decision priorities;
- all 15 natural rc4.63 fixture states remain unchanged through pick 112 and only intended late near-ties can change afterward;
- QB2/TE2 ordinary backups remain behind the explicit opportunity-cost hurdle while genuine exceptional slides remain possible;
- no hard position quota or starter-max-as-roster-cap behavior appears;
- late WR-saturation preference reverses when RB saturation or a material Player Quality gap warrants it;
- full-roster Championship Utility is non-inferior/improved on paired evidence, not merely position-count aesthetics.

## Current decision

**Do not promote v3 and do not create rc4.64 yet.** v3 remains the preferred research baseline because it is materially narrower than v2 and avoids v4's early/mid-round drift. The next engineering step is a compact state-trace/replay harness; tuning before that would risk fitting aggregate distributions rather than the actual decision contract.
