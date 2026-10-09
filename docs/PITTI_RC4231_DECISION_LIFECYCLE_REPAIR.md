# RC4.231 local decision lifecycle repair

Generation: `20261009T2010Z-v308`. Canonical baseline: `171933ed024525e5c3bb7df864ab07d3bc27bb82`. Parent diagnostic: `3e352462b534a9b0a9233664ec4239e6a676b535`.

## Defect and correction

A render pass captures an evidence deadline before cooperative work. Crossing it clears every decision surface. On first bootstrap this can happen before an expiry timer exists, leaving no scheduled successor and a generic pending HOLD indefinitely.

The current context/revision may now request exactly one expiry successor through the existing coalescing queue. Bootstrap hands over the already-requested revision rather than inventing a new generation. A second expiry within that generation clears all results and renders a final explanatory HOLD requesting refresh. An independent refresh creates a new generation and can recover. Expired results are never reused or granted a longer TTL.

An asynchronous-ordering regression also proved that forced bootstrap could enter while a queued renderer owned the surfaces. Bootstrap now rejects concurrent ownership and holds the existing render lock during acquisition as well as rendering. Notifications during acquisition remain queued for its final handoff. Navigation remains independent from these flags; existing cooperative work units, directory transport, timers and scoring are unchanged.

## Evidence and validation scope

- Historical cold/warm failure is replayed from the pinned canonical commit; candidate tests execute the actual edited functions, without an in-memory correction.
- Twelve cold/warm cases cover missing, pre-expired and fresh evidence, independent Trade/Weekly completion order and expiry during publication.
- Six bootstrap/queue cases prove one bounded expiry successor, final fail-closed HOLD after repeated expiry, and recovery on independent refresh.
- Burst notifications prove coalescing and maximum one active queue renderer. Two bootstrap/queue interleaving cases prove shared ownership and retained wakeups.
- Obsolete context/revision and snapshot/clock/expiry cache rejection remain tested. Existing RC4219 adversarial tests execute real domain scoring and verify parity, protected drops and stale-result removal. Existing responsiveness tests cover 12,000 candidates and 6,804 trade packages with cooperative yields.
- Exact Android invalidation trigger and initial recommendation validity remain unproven. User-observed rc4.230 approximately six-second loading and usable navigation are preserved as scoped historical acceptance, not rc4.231 physical evidence.

Focused runtime and release-binding tests passed, including the preserved rc4227–rc4230 binding regressions and no-Git seal harnesses. Package/re-extraction passed for all 18 files with syntax and version parity; archive SHA256 `744dd3c70fa8f642e5c6e59be96571731fcee236ab549979d749e7c0a098318c` is run-scoped, not a canonical release identity. Final Strict outcome is reported with the local commit; this document does not pre-claim a green suite, publication, deployment or physical acceptance.

## Release and adversarial review

All 18 runtime blobs are manifest-bound. Deliberate differences: `app.js` lifecycle changes and version; `index.html`, `sw.js`, `manifest.webmanifest` version/cache references only. Other 14 runtime files, including provider/worker, evidence validators, scoring and UI styles, remain byte-identical to the parent. No source acquisition was rerun.

Generation v308 and rc4.231 supersede the active candidate fields. Production receipts and rc4.230 parser-only carry-forward remain immutable historical evidence. The successor explicitly has no carry-forward, CI, publication, merge, deployment or physical acceptance. Exact inverse fixtures preserve every earlier authority layer; new mutation tests reject successor overclaims and unrelated bytes. No validator is bypassed or removed; the original rc4.230 release test now reads its exact reconstructed historical layer, while the new test validates every current runtime blob and the full inverse.

Adversarial review checks: external completion versus expiry ordering; retry-budget preservation across bootstrap handoff; repeated-expiry termination; independent-refresh recovery; obsolete context/revision rejection; bootstrap/queue mutual exclusion; empty stale-action surfaces; unchanged domain gates; version-only companion assets; exact historical authority reconstruction; no promotion claims.

Next safe gate after the tested local commit: external review and separately authorized publication/CI orchestration. No push, PR, merge, deployment or device work is authorized here.
