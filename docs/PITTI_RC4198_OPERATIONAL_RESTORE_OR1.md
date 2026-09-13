# PITTI rc4.198 operational restore OR1

Base authority: `c9f7eb1a3dea788fb56eac517dab63b39ed9ef59` (merged rc4.198 storage-quota repair).

Scope is intentionally narrow and production-shaped:

- Weekly Projection requests get at most two bounded upstream attempts inside the service worker, each 4.4 s, so the existing 10 s client boundary can still receive a result.
- Optional FantasyPros weekly-rank requests fail fast after 2.5 s. A slow rank lane therefore returns an ordinary non-2xx response to the existing app code instead of consuming the full client timeout and preventing already-successful projections from being persisted.
- HTTP 429 is never retried; provider backoff semantics remain intact.
- Unrelated live APIs still bypass the static CacheStorage path.
- No cache/app-data deletion, reinstall, Sleeper transaction, production deployment or device acceptance is part of this branch.

This is not claimed as a complete source-level refactor of the Weekly Evidence transaction. It is an operational latency boundary that makes the existing projection/rank separation executable under the observed timeout failure mode. A later structural refactor may move projection persistence ahead of rank acquisition in `app.js`, but OR1 does not depend on that larger change.
