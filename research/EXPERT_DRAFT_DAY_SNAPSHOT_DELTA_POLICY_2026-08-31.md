# EXPERT DRAFT-DAY SNAPSHOT / DELTA POLICY — 2026-08-31

> HISTORICAL/SUPERSEDED operational checkpoint: runtime, device, deployment, release/activation gates and CURRENT/OVERRIDE instructions below describe the original dated context only. They must not be executed as current work or override ../PITTI_CURRENT_STATE.json and ../NEW_CHAT_HANDOFF_CURRENT.md. Research evidence and durable invariants remain as provenance, subject to later explicit corrections.

## Decision
Do not modify rc4.157 before the real draft. The current runtime already persists each expert acquisition independently in `v7_rank_<expertId>` with an `updated` timestamp and preserves verified source context. A full refresh loops every selected/preset/v4-v5 expert and reacquires all lists.

Therefore the user's proposed optimization is correct as an OPERATING procedure, but implementing new HTTP conditional/fingerprint logic in the frozen runtime today would violate the release freeze and create unnecessary regression risk.

## Today
1. Acquire one complete verified same-day baseline for every v4 expert as soon as today's source is available.
2. Preserve each successful per-expert cache; never replace a complete verified same-day list with an incomplete/error result.
3. Later checks are change-detection checks first (published/update marker where exposed). Only if a source has a newer marker or material news implies a likely ranking change should its list be reacquired.
4. If the upstream source does not expose a reliable modified timestamp/ETag, compare a compact ranking signature after one bounded fetch; unchanged signature => no panel/decision work.
5. At final pre-draft pass, do not run repeated blanket `Alles aktualisieren` merely to obtain a new timestamp.
6. Any changed expert must pass source-context/coverage plausibility before replacing today's baseline.
7. No change to v4 PRIMARY / v5 CHALLENGER / v3 failsafe from freshness alone.

## Panel experts to baseline
Todd D Clark; Sean Koerner; Justin Boone; Dalton Del Don; Nick Mariano; Pat Fitzmaurice; Ryan Weisse; Kev Wheeler; Wolf of Roto Street.

## Existing runtime evidence
- `persistExpertRankCache(expertId,result)` stores independent expert results.
- successful `loadExpertRanks` results contain `updated: Date.now()`, verifiedIndividual, coverage, counts, sourceContextVerified, sourceSeason and sourceScoring.
- source failure falls back to a previously verified schema>=13 ranking rather than blanking it.
- `rankingSignature(cache)` already exists for ranking-content comparison.
- `loadAllRanks()` currently loops through the whole expert set, so repeated full refreshes are not the desired draft-day operating method once a complete baseline exists.

## Safety
This policy is data handling only. rc4.157 remains DRAFT_READY_FROZEN. Do not add new UI, cache schema, network logic, or refresh behavior today absent a critical defect.
