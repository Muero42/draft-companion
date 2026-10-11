# rc4.234 bootstrap diagnostic repair

Local candidate generation `20261011T1433Z-v311`, parent `c4ca793288d728f84f92e0319d18e9bb4f1373a0` (rc4.233). Branch `codex/rc4234-bootstrap-diagnostic-repair`. Last verified main `f65cfa891ba2cb64999bfa1fc7855bea8024778a`; this task does not claim a fresh remote, deployment or physical observation.

The separate-agent review of rc4.232 reproduced a bootstrap diagnostic defect: PASS_DONE preceded a fallible localStorage write. A quota exception then cleared Waiver and Trades while leaving a successful completion event. Earlier lineup/status exceptions could likewise omit a trace error. This was a diagnosis defect; existing fail-closed behavior was not weakened.

The bootstrap now records a sanitized ERROR in its existing catch, tagged bootstrap and UNEXPECTED_ERROR. Only allowlisted exception names are exported; QuotaExceededError is added to that list. PASS_DONE now follows the existing persistence and status updates. No requests, retries, timers, recommendation gates or decision-model logic change. No exception messages, keys, values or stacks are added to the trace.

Eight additional cold/warm bootstrap regressions execute the real bootstrap with roster-render, late status and quota failures plus successful completion. They assert empty decision lists on failure, no false completion, sanitized error type, released render lock, and no PASS_DONE observed during the persistence operation. Existing lifecycle and trace regressions remain in place. Domain scoring/providers remain fixture stubs; these tests do not certify recommendations or physical Android performance.

Runtime changes: app.js contains the fix; index.html, manifest.webmanifest and sw.js change release identity only. The other 14/18 runtime files are unchanged from rc4.233. Exact inverse binding tests preserve all rc4.233 Watcher news code and earlier release contracts. Historical deployment/device receipts and source activation restrictions are retained. New active authority, generation, runtime hashes, seals and release fixtures are coupled to this local candidate.

The 64-event cap and other documented diagnostic limits remain. Exceptions outside the instrumented bootstrap try/catch (including finally cleanup) are not newly covered. The repair closes the three reproduced catch-path cases; it does not claim universal exception capture or proof of the original Android HOLD trigger.

Focused lifecycle, trace and new binding tests passed before the full suite. Final validation and follow-up review results are recorded separately in PITTI_RC4234_LOCAL_VALIDATION.json after execution. No full-suite PASS is claimed by this document in advance.

Six preexisting untracked watcher-news logs belong to prior work and remain untouched and uncommitted. After one tested local commit, stop. The next gate is review of the successor commit and explicit publication authorization; no push, PR, merge, deployment, acquisition rerun or physical acceptance is performed here.
