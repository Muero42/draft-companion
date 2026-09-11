# Start/Sit / Weekly Evidence Source Audit — 2026-09-11

Purpose: narrow the next Codex implementation to sources that are current, repeatable and provenance-safe. This is a source-feasibility note, not runtime authority.

## Weekly ranks — preferred source is FantasyPros official API

Fresh documentation review confirms FantasyPros exposes official NFL ranking APIs under the same authenticated API family already used by PITTI's weekly projection lane.

Relevant documented capabilities:

- `GET /nfl/{season}/consensus-rankings`
- `week` parameter for weekly rankings
- `scoring=HALF`
- position filters including QB/RB/WR/TE/K/DST/FLX
- expert filters / expert detail support
- per-expert ranking APIs are documented separately
- responses include ECR rank, best/worst/spread fields and update metadata

This is preferred over scraping FantasyPros HTML because PITTI already has the user-authorized key and a Cloudflare proxy with retry/rate-limit handling.

Implementation must still probe the current 2026 response schema and selected-expert availability. Never guess an expert id or silently accept a different scoring/week.

## Justin Boone weekly Half-PPR — viable current individual anchor

Fresh public Yahoo pages on 2026-09-10/11 expose Justin Boone's Week-1 rankings and explicitly link Half-PPR rankings for QB/RB/WR/TE/FLEX/DST/K. Yahoo states the rankings are updated during the week.

Because rc4.195 already has a physically accepted bounded server-side Yahoo parser for Boone trade-value charts, a separate weekly-rank parser is technically feasible if the official FantasyPros selected-expert route cannot provide Boone reliably.

Rules if used:

- server-side only
- discover current week/position URL rather than hard-code player values
- validate Half-PPR context explicitly
- retain publication/update time and source URL
- fail closed on table/iframe/schema changes
- do not confuse Boone weekly rank with Boone ROS trade value

## Current FantasyPros Week-1 web evidence

Fresh FantasyPros Week-1 pages show current weekly rankings and expert update dates. Current pages include Pat Fitzmaurice weekly ranks and comparison pages for Justin Boone / Sean Koerner versus ECR. This confirms the target experts are actively represented in the current weekly ecosystem, but runtime ingestion should use the official API when possible.

## Weather — Open-Meteo is technically suitable for a bounded lane

Open-Meteo provides a no-key forecast API with hourly variables including:

- temperature
- precipitation probability / precipitation
- weather code
- visibility
- wind speed / direction / gusts

Forecasts are available globally and can cover NFL kickoff windows. Data provenance and attribution requirements are explicit.

A PITTI weather lane can therefore be built if the game-context layer supplies verified venue coordinates and roof/outdoor classification.

Required guards:

- outdoor venues only
- verified venue coordinate mapping
- kickoff-window hourly selection, not generic daily weather
- source fetchedAt/model/update metadata where available
- bounded TTL, conflict/staleness fail-closed
- no weather penalty for closed-roof/dome games
- international games must use the same verified venue mapping rule

## Canonical game schedule / venue source — still requires implementation-time verification

Do not infer opponent/kickoff from stale player metadata or weekly article text. Codex must select and validate a repeatable current schedule/venue source before enabling opponent, lock or weather automation.

Minimum completeness requirement: all games for the current NFL week map uniquely to two teams, kickoff UTC and venue. Partial/duplicate team mapping blocks the affected game context.

## Vegas / implied totals — unresolved source lane

No robust no-new-secret Vegas provider is promoted by this audit. Therefore:

- do not block Weekly Ranks or Start/Sit on Vegas
- do not scrape brittle displayed odds merely to fill the UI
- leave spread/total/implied-team-total unavailable until a reliable provider is proven
- if later available, require total + spread from the same event/source/time context before deriving implied team totals

This preserves the existing fail-closed contract and allows Start/Sit to improve materially from ranks + projections + legal lineup optimization before Vegas is solved.

## Implementation order implied by this audit

1. FantasyPros official weekly Half-PPR ranks / selected-panel evidence
2. Start/Sit v6 optimizer and evidence semantics
3. verified schedule/opponent/kickoff/venue
4. Open-Meteo outdoor weather
5. Vegas only after source authority is solved

No source in this audit authorizes hard-coded current player ranks or one-off Week-1 values.
