# Paired Research Reproducibility Contract — 2026-08-25

Research-only process invariant. No production/runtime mutation.

## Why this exists

A full-safety baseline run and a later pre-safety-instrumented run independently fetched mutable Sleeper `/players/nfl` metadata. Seed `459820073` then diverged at pick 69 even though the instrumentation itself was observational. The exact decision reasons identified the cause: the old baseline scored Parker Washington with `Injury Questionable`, while the later run no longer had that injury flag. rc4.63 subtracts exactly 3.0 raw points for `QUESTIONABLE`, matching the observed `97.128 -> 100.128` shift.

Therefore a cross-time deterministic comparison can fail because an external input changed, not because the treatment changed policy.

## Mandatory contract for future paired policy/instrumentation evidence

1. **Single immutable input snapshot per paired experiment.** Mutable external inputs used by scoring or player identity (Sleeper player metadata, health/status inputs, market payloads, expert payloads) must be fetched once or sourced from a content-addressed frozen file and shared by both arms.
2. **Persist provenance.** Persist SHA-256/content identity for every shared mutable input used by the experiment.
3. **No-effect parity before interpreting instrumentation.** An instrumentation-only arm must match its uninstrumented control on decision sequence, user roster and complete fingerprint for every paired seed before any newly observed diagnostic is admissible.
4. **Fail closed.** If paired input identity or parity fails, do not calibrate thresholds or promote a mechanism from that experiment. Diagnose the first divergent state instead of retrying variants.
5. **Separate current-state research from historical evidence.** A new current metadata snapshot may be valid for a new paired experiment, but it must not be silently compared against a historical run that consumed a different live snapshot.
6. **Production unaffected.** This contract governs research evidence only and does not freeze the live app's intended current-status refresh behavior.

## Current application

The corrected pre-safety experiment uses one frozen Sleeper player-metadata artifact shared by both the production-like full-safety arm and the observational pre-safety arm. Only after exact 120/120 no-effect parity passes may its pre-safety raw-gap distribution be used for mechanism/threshold research.
