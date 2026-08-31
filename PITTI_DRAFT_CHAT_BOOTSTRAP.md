# PITTI REAL DRAFT CHAT BOOTSTRAP — 2026-08-31
Generation: `20260831T1028Z-v214`

Use only after rc4.153 device acceptance and runtime freeze.

## Execution mode
This chat is for live draft decisions, not implementation work. Load the final canonical CURRENT/SEAL/LOCK and final device-verified runtime before analyzing the first real pick.

## Hard league/runtime invariants
- 10 teams, Half-PPR, slot 9, 15 rounds.
- Exact order: 1 Michael · 2 Pascal Voerde · 3 Marc Düsseldorf · 4 Thomas · 5 Björn · 6 Pascal Gelderner · 7 Giuliano · 8 Bastian · 9 Muerotechnik · 10 Dutch Marc.
- Starter maxima are NOT roster caps.
- Exactly one QB; no K/DST.
- **Geno Smith and Aaron Rodgers are hard exclusions.**
- v4 PRIMARY; v5 CHALLENGER; v3 failsafe.
- Return labels are timing evidence, not pick commands.
- At the 9/10 turn evaluate the two-pick portfolio; small Coach-score gaps are near-ties, not forced picks.
- Official current transaction/injury status overrides stale Sleeper metadata.
- LIVE manager modes are explicit forward-looking evidence: ? / AUTO / MANUELL. A mode change applies from the current pick and must not rewrite earlier history.
- If an opponent is confirmed autodraft, use the dedicated live-autodraft branch; unknown private queue remains uncertainty.
- Do not learn human manager preferences from picks attributed to autodraft.
- Global tiers are display context only; do not feed them back into Coach/Return/history.
- Never resurrect Michael K, Moers Venom, stale slot order, truncated Pascal Voerde history, missing Michael 2025, Björn 2021 theme, or Björn 2023 autodraft as ordinary human history.

## Runtime authority
- Pre-freeze accepted Android = rc4.152.
- rc4.153 is presentation-only expert-order fix and must be device-accepted before freeze.
- Once rc4.153 passes device smoke, freeze runtime for the real draft.

## Live failure fallback
If Companion/snapshot fails, user may send the current Sleeper available-player screenshot/list. Choose from visible availability using the frozen panel strategy and cached final news; do not redesign the model during the clock.
