# Trade vNext source boundary

`trade-boone-source-contract-v1.mjs` is the dedicated Boone-to-Trade vNext entry point. Call `evaluateBooneTradeOffer` with the raw snapshot and independently supplied current season/week/HALF_PPR context on every decision. It revalidates expiry even if the caller previously adapted the snapshot. Generic evidence maps are not accepted.

`trade-team-needs-v2.js` remains a low-level utility engine, not a source validator. Its legacy `adaptEvidence` accepts arbitrary source/as_of/values and `evaluateOffer` trusts an available map. Do not expose either as the Trade vNext evidence boundary. The new wrapper supplies only validated Boone values; utility, gap thresholds and acceptance formulas are unchanged.

Current Production is a separate path: `_worker.js` builds Boone snapshots; `app.js` refreshes and validates them, stores them atomically, then `seasonEvidenceCache` / `seasonEvidenceValue` / `seasonWeeklyMetric` feed `seasonTradeDecision`. Production does not import the team-needs v2 engine. This local bridge is not a Production integration or acceptance claim. The existing Boone validator alone does not check all record schemas, duplicate IDs, context scoring or actual positional record counts; the bridge adds those checks without changing the sealed Production module.

Canonical keys are verified Sleeper IDs, never player names. Values retain BOONE_TRADE_VALUE units without rescaling. Missing requested values return MONITOR / PLAYER_VALUE_UNAVAILABLE. Source and per-record provenance are preserved; stale, expired, wrong-context, malformed, partial and duplicate snapshots fail closed. Caller context must come from live authority, not from the snapshot itself.

## Secondary source gate

PEAKED_SOURCE_CONTRACT_NOT_VERIFIED

No local verified Peaked/PeakedInHighSkool contract was found. No provider research, importer or source-shaped Peaked fixture was added. Valid Boone evidence does not depend on Peaked. Never sum or average raw Boone and Peaked numbers: a separately verified source contract and explicit scale calibration are required before any combined numeric signal.

Next integration gate: separately authorize Production wiring and its runtime/authority validation. No live transaction, provider fetch, deployment or authority promotion is performed here.
