# rc4.195 Physical Android Acceptance — 2026-09-11

Evidence source: user-supplied physical Android screenshots after the canonical main deployment. This document records observed device facts only; it does not infer unobserved behavior.

## Production deployment observed

Cloudflare Pages deployment details shown on-device:

- repository: `Muero42/draft-companion`
- branch: `main`
- commit shown: `8aedc4e`
- deployment ID: `d131aae9-a3aa-496b-bfb1-2596fd88dc6d`
- status: `success`
- observed timestamp in Cloudflare UI: September 11, 2026 1:58 PM local display

Canonical GitHub main had previously been verified as full SHA `8aedc4ea3b7b71591cbc45f971ccf85fe5167074` with post-merge CI green.

## Physical Android canary procedure

The installed PITTI PWA was fully closed/swiped away and reopened. The user did **not** clear cache/app data and did **not** reinstall.

## Observed PASS evidence

### Runtime identity

- badge: `v11.8.0-rc4.195`
- footer: `v11.8.0-rc4.195: Waiver/Trades mit automatisch verifizierten Justin-Boone/Yahoo-ROS-Werten; Weekly Evidence rc4.193 bleibt erhalten.`

### Live roster / Weekly Evidence

- Sleeper Live-State: `< 1 Min.`
- green status: live roster refreshed directly from Sleeper
- Weekly Evidence: fresh (1–4 Min. across screenshots)
- green status: FantasyPros Weekly Projections verified
- one screenshot explicitly showed `W1 · 728 Spieler`
- Expert-Ranks/Matchup-Lanes remained separately fail-closed, as designed
- live roster rendered 16 players with `Reserve/IR 1`
- Zach Charbonnet rendered under `RESERVE / IR`, not as an ordinary active drop candidate

### Watcher / Live

- `Pitti Watcher: PASS`
- no automatic transaction occurred
- Research Cache and fail-closed chronology messaging rendered normally

### Waiver / FA v3

- Waiver / Free Agents route loaded successfully
- current skill-position lane rendered `SKILL-POSITION HOLD` because no evidence-supported ADD/DROP swap cleared the gate
- no fabricated FAAB bid was shown
- D/ST streaming lane rendered ranked available free-agent defenses
- kicker lane showed Harrison Mevis as current kicker and compared only against available kickers; no RB/WR/TE cross-position replacement

### Trades v8 / Boone runtime ingestion

- Trades route loaded successfully
- Trade Offer Board v8 reported `263/264 gemappt` current Justin-Boone/Yahoo trade values
- board rendered `TRADE HOLD` because no legal bilateral positive verified package cleared the gate
- no fabricated trade offer and no automatic trade execution

## Acceptance classification

`DEVICE_RC4195_WAIVER_TRADE_WEEKLY_EVIDENCE_PASS`

Accepted scope:

- rc4.193 Weekly-Evidence/module/quota behavior preserved
- rc4.195 Boone runtime ingestion visible on physical device
- Waiver/FA v3 production route functional and fail-closed correctly
- Trade Offer Board v8 production route functional and fail-closed correctly
- live Sleeper roster and Reserve/IR separation preserved

Known intentionally incomplete scope:

- Weekly Expert-Ranks are not yet ingested in runtime
- matchup / Vegas / weather lanes remain unavailable
- Start/Sit therefore remains `NICHT VOLLSTÄNDIG BEWERTBAR` despite verified projections

Those incomplete lanes are the next development package, not a failure of the accepted rc4.195 Waiver/Trade release scope.

## Prohibited inference

Do not interpret this acceptance as evidence that every unvisited UI path is perfect. Do not use it to weaken future fail-closed source checks. Any later runtime change requires a new candidate identity and its own promotion/device verification.
