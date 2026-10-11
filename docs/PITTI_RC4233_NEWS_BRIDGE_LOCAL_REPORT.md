# rc4.233 local news bridge

2026-10-11; generation `20261011T0758Z-v310`.

Local-only successor to `0966857e48d3e0267e65c14db8b0b51a1d443306`, branch `codex/rc4233-watcher-news-bridge`. Watcher counterpart: `codex/watcher-news-source-v1` based on `d11e4018ce47d0931180dd306d9cb1f72d305df3`.

The news bridge adds independently gated, timestamp-validated publisher reports to the research cache. Replays deduplicate; historical cutoffs exclude not-yet-observed source revisions; headlines remain review hints and cannot enter actionable research weighting. Recommendations, push and source activation are not implemented by this candidate. Existing Android generic-HOLD diagnosis remains unresolved and its prior evidence is preserved.

Only app.js changes functionality. index.html, manifest.webmanifest and sw.js change version strings to distinguish the new candidate. The new release-binding fixture records the exact app delta, all 18 runtime blobs, original parent blobs, and reversible authority updates. Prior candidate assertions remain intact behind the exact inverse; the new binding adds 37 mutation/overclaim negatives. No published/deployed/device-accepted status is inherited or invented.

Validation on final source bytes:

- `season-watcher-news-regression.mjs`: PASS.
- `season-watcher-feed-v2-regression.mjs`: PASS.
- `season-watcher-news-binding-regression.mjs`: PASS.
- `season-rc4232-release-binding-regression.mjs`: PASS, historical assertions preserved.
- `pitti_guardrail_check.mjs` and `postmerge-authority-regression.mjs`: PASS, ordinary seal integrity enabled.
- Full `npm test`: 331/333 PASS. The two no-Git extraction tests copied only Git-listed files and initially omitted new untracked news modules. Staging the files fixed both without code/test changes. Targeted rc4229 and rc4230 release-binding reruns both PASS, including extracted seal/authority verification. Combined validation covers all 333 checks; do not label it a single green full-suite run.
- Watcher counterpart: full 232/232, focused 16/16 real local D1, syntax PASS.

Raw local logs are retained outside the commit: `watcher-news-final-suite.log`, `watcher-news-package-focused.log`, `watcher-news-package-rc4230-focused.log`. Older failed-run logs remain historical evidence.

Next gate: paired local commit review/publication authorization. Source activation and push remain separate. No push, PR, merge or deployment in this work package. News retention and measured operating costs remain activation prerequisites documented by the Watcher report.
