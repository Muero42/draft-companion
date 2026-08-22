# Universal Sleeper Autodraft State Model — 2026-08-22

## Scope
Research/design specification only. No production coefficient or runtime promotion.

## Core requirement
Every opponent manager may be in one of three live states at every pick:
- `MANUAL`
- `AUTODRAFT`
- `UNKNOWN`

The state is time-varying. A manager may start on autodraft, switch to manual later, or enter autodraft mid-draft.

**Baseline correction:** absent current contrary evidence, every opponent defaults to `MANUAL`. `UNKNOWN` is reserved for genuinely conflicting/transition evidence; it is not a probabilistic excuse to inject autodraft into the normal baseline.

## Official Sleeper behavior now verified
Sleeper's current support documentation establishes the following mechanics relevant to calibration:
- CPU auto-pick uses a team's Draft Queue when one exists; the queue is ordered and drafted players are removed automatically.
- Once the queue is empty, CPU auto-pick chooses a higher-ranked available player while considering roster needs.
- Sleeper does not provide a supported custom pre-draft ranking upload; the league-specific Draft Queue is the supported workaround and carries into the draft.
- Commissioner-forced CPU auto-pick likewise follows the team's queue first and otherwise considers positional needs plus higher-ranked available players.

Model consequence: AUTODRAFT must not be represented as pure ADP/rank sampling. It is a latent two-stage policy: `QUEUE_IF_AVAILABLE` -> `SLEEPER_RANK_PLUS_ROSTER_NEED`. For opponents we normally cannot observe private queue contents, so queue behavior must be represented as uncertainty/sensitivity, not silently learned as manager preference.

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
Do not apply personal-manager preference modifiers. Use the official two-stage semantics:
1. `QUEUE_IF_AVAILABLE`: if a private queue is known/observed, take its highest eligible available item according to Sleeper behavior.
2. `SLEEPER_RANK_PLUS_ROSTER_NEED`: if queue is empty/unknown, use a Sleeper-2026 calibrated higher-ranked-player model conditioned on current roster need and availability.

When an opponent's private queue is unobserved, do not invent its contents. Run queue/no-queue sensitivity where the distinction is decision-relevant to Return-v2.

### UNKNOWN
Use only for genuinely conflicting or transition evidence. Marginalize over MANUAL and AUTODRAFT branches only when the state truly cannot be resolved. Do not invent a precise probability when evidence is weak; expose uncertainty in diagnostics.

## Learning quarantine
- Picks made while state is AUTODRAFT never update the personal manager profile.
- Picks with material unresolved autodraft probability receive reduced or zero personal-learning weight.
- A later switch back to MANUAL does not retroactively relabel earlier autodraft picks.
- Current roster state always updates from every pick regardless of mode.
- Queue-driven picks are never treated as evidence of a manager's ordinary manual preference unless independent evidence establishes that the queue itself encodes that preference and the learning method explicitly models this distinction.

## Live transitions
A user message such as `Autodraft: 3,5,8` sets those managers to AUTODRAFT for subsequent picks.
A later message such as `5 wieder manuell` sets manager 5 to MANUAL prospectively only.
A manager can switch multiple times without corrupting historical learning.

## Simulation scenarios
The normal realistic baseline is **zero autodrafters unless current evidence says otherwise**. Separate stress/sensitivity scenarios must include:
- one autodraft manager at arbitrary slot;
- multiple simultaneous autodrafters;
- pre-draft autodraft followed by manual takeover;
- manual start followed by later autodraft;
- genuinely unknown transition state marginalized until evidence resolves it;
- AUTODRAFT with plausible private queue;
- AUTODRAFT with exhausted/no queue, using Sleeper rank + roster need.

Scenario frequencies must not be guessed from sparse anecdote. Use observed 2026 Sleeper-mock/live evidence where available; otherwise report sensitivity bands rather than a single false-precision prior.

## Required diagnostics
For each opponent pick where material to Return-v2 / user choice, persist:
- manager slot / identity;
- mode before pick;
- source/confidence of mode evidence;
- queue state (`KNOWN_NONEMPTY`, `KNOWN_EMPTY`, `UNOBSERVED`);
- manual-branch candidate probability;
- autodraft queue-branch candidate probability where estimable;
- autodraft rank+need branch candidate probability;
- combined probability if genuinely UNKNOWN;
- whether the pick was allowed to update personal manager learning.

## Invariants
- Exact slot-9 snake geometry and sequential roster mutation remain unchanged.
- Autodraft mode affects opponent generation only; it must not modify the user's own Coach scoring policy.
- Known/suspected autodraft behavior must not leak into manual manager preference learning.
- Sleeper autodraft model must come from Sleeper evidence, not NFL.com ordering. Historical NFL.com machine drafts may inform only the probability that a manager is automated.
- No production promotion without deterministic tests for state switching, learning quarantine, roster-state continuity, queue-first behavior, queue exhaustion fallback, and reproducibility.

## Source notes
Official Sleeper support pages checked 2026-08-22:
- `How does the draft timer work?` — CPU auto-pick follows queue if present, otherwise considers roster needs and higher-ranked available players.
- `Watch List vs. Draft Queue` — queue is ordered, CPU uses it on auto-pick, drafted players are removed, empty queue falls back to next-best player based on roster needs.
- `Can I set pre-draft rankings?` — no direct custom-ranking upload; league-specific queue is the supported workaround and persists into the draft.
