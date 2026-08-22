# Universal Sleeper Autodraft State Model — 2026-08-22

## Scope
Research/design specification only. No production coefficient or runtime promotion.

## Core requirement
Every opponent manager may be in one of three live states at every pick:
- `MANUAL`
- `AUTODRAFT`
- `UNKNOWN`

The state is time-varying. A manager may start on autodraft, switch to manual later, or enter autodraft mid-draft.

## Evidence precedence
1. Direct current Sleeper UI status reported/observed for that manager.
2. Current-draft behavioral evidence consistent with Sleeper autodraft.
3. Pre-draft user report / known availability information.
4. Historical manager tendency only for the MANUAL branch.

Direct Sleeper status should dominate historical inference immediately for future picks.

## Pick generation
### MANUAL
Use the canonical 2026 market/plausibility candidate set, then apply the manager-specific shrunk/capped historical/current profile, sequential roster state, K/DST behavior, value-slide guard and live adaptation.

### AUTODRAFT
Do not apply personal-manager preference modifiers. Generate the pick from the Sleeper-autodraft model calibrated from completed 2026 Sleeper mocks / observed Sleeper autodraft behavior, conditioned on current availability and legal roster state.

### UNKNOWN
Marginalize over MANUAL and AUTODRAFT branches. Do not invent a precise probability when evidence is weak. Use a conservative prior and expose uncertainty in diagnostics.

## Learning quarantine
- Picks made while state is AUTODRAFT never update the personal manager profile.
- Picks with material unresolved autodraft probability receive reduced or zero personal-learning weight.
- A later switch back to MANUAL does not retroactively relabel earlier autodraft picks.
- Current roster state always updates from every pick regardless of mode.

## Live transitions
A user message such as `Autodraft: 3,5,8` sets those managers to AUTODRAFT for subsequent picks.
A later message such as `5 wieder manuell` sets manager 5 to MANUAL prospectively only.
A manager can switch multiple times without corrupting historical learning.

## Simulation scenarios
Realistic simulations must include:
- zero autodrafters;
- one autodraft manager at arbitrary slot;
- multiple simultaneous autodrafters;
- pre-draft autodraft followed by manual takeover;
- manual start followed by later autodraft;
- unknown state marginalized until evidence resolves it.

Scenario frequencies must not be guessed from sparse anecdote. Use observed 2026 Sleeper-mock/live evidence where available; otherwise report sensitivity bands rather than a single false-precision prior.

## Required diagnostics
For each opponent pick where material to Return-v2 / user choice, persist:
- manager slot / identity;
- mode before pick;
- source/confidence of mode evidence;
- manual-branch candidate probability;
- autodraft-branch candidate probability;
- combined probability if UNKNOWN;
- whether the pick was allowed to update personal manager learning.

## Invariants
- Exact slot-9 snake geometry and sequential roster mutation remain unchanged.
- Autodraft mode affects opponent generation only; it must not modify the user's own Coach scoring policy.
- Known/suspected autodraft behavior must not leak into manual manager preference learning.
- Sleeper autodraft model must come from Sleeper evidence, not NFL.com ordering. Historical NFL.com machine drafts may inform only the probability that a manager is automated.
- No production promotion without deterministic tests for state switching, learning quarantine, roster-state continuity, and reproducibility.
