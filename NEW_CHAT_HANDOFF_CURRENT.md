# PITTI HANDOFF CURRENT — v204
Handoff generation: `20260830T1755Z-v204`

## CRITICAL FIRST GATE — rc4.132
- **rc4.131 is the last accepted Android authority.**
- v203 merged a real runtime change in `app.js`: dedicated Sleeper LIVE-autodraft Return-v2 opponent weighting. Because the visible version remained rc4.131, this is an **unreleased runtime delta**, not a completed phone release.
- First task in the new chat: build a genuine **v11.8.0-rc4.132** release. Do not start with another general research block.
- rc4.132 must contain BOTH:
  1. dedicated LIVE-autodraft Return-v2 path (Sleeper SearchRank + roster need; mock CPU stays separate; private queue remains unknown), and
  2. encoded/tested Pick32 Nabers/Javonte portfolio correction.

## Pick32 regression canary
After user picked Jeremiyah Love at 29, roster = **WR1/RB2**. At 32 v4 had Nabers panel 26.7 vs Javonte 28.9 yet Coach Javonte 100 / Nabers 98. Adding Love cannot create a generic reason to prefer a third RB. In a 1–3 point near-tie, roster/replacement/tier alternatives must permit Nabers first unless a concrete RB tier/loss scarcity signal justifies Javonte.

## Required release path
Implement deterministic Pick32 regression + deterministic live-autodraft Return-v2 regression -> release contract + guardrails + package/re-extract PASS -> merge main -> fast-forward gh-pages -> byte parity -> one controlled Android refresh -> verify visible rc4.132. **No cache clear/reinstall.**

## Preserved authority
v4 PRIMARY / v5 CHALLENGER / v3 failsafe. Latest backup `draft-companion-v7-backup-2026-08-30T16-02-06-862Z.json` is 29/30, missing pick29 expertv5; never call it complete. McLaurin sparse-panel and Swift/Lamar description audits remain preserved. Final cutdown/IR/PUP freshness follows the rc4.132 release gate.
