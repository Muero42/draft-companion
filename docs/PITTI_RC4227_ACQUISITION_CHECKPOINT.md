# RC4.227 acquisition diagnostic checkpoint

Status: LOCAL DIAGNOSTIC CANDIDATE. RC4.227 repair and publication are not complete.

The current work preserves the unpublished v303 Authority checkpoint. Baseline
branch was changed to `codex/rc4227-live-evidence-acquisition` without resetting
or discarding that checkpoint. Git-read baseline HEAD:
`2f94102b6196d53c7b1189490e1376e63cdbe16c`; tree:
`4b7651c471b06cf991790786df9f85aed38154a9`; parent and fetched origin/main:
`31e915fd6cce95ee9ec073c00113c8a2fc9e26c4`.

Canonical production remains v11.8.0-rc4.226 / PR #229, canonical tree
`859a10fe9d824c4a39fdbf0c5716ff576084eb06`. Its historical cloud Strict
287/287 and postmerge 8/8 do not certify this new diagnostic candidate.
No new branch push, PR, merge, deployment, production change, or physical test
has occurred in this work package.

## Findings proved from current implementation

- `resolveSeasonWeeklyExpertIds` consumes broad ranking membership and the
  authenticated official expert endpoint. It does not consume the qualified
  current directory held in `seasonDecisionSources`. This explains how exact
  identities can be known to the adaptive path but unavailable to the selected
  resolver. Integration repair is still outstanding.
- `refreshSeasonDecisionSources` returns early while its directory is under
  one hour old. This suppresses retry of missing individual snapshots. Retry
  separation is still outstanding.
- Safe roster diagnostics mapped string missing-expert names as objects and
  exported `{}`. The local candidate now preserves name, numeric ID or null,
  and reason.
- No authenticated singleton or primary projection response was observed.
  The accessible Codex browser had an empty, masked API-Key field. This is a
  property of this browser session, not a diagnosis of the Android credential
  or provider entitlement. No random credential files were searched and no
  key was requested in chat.

## Bounded diagnostic implementation

An explicit Advanced button runs at most one incumbent singleton probe per
skill position (four total), followed by six primary projection probes. It
uses the existing `fpProxyRequest` credential transport and request pacing.
Requests are serial, share one flight, and never run from roster rendering.
401/403 stops that provider lane with a one-hour manual backoff; 429 stops all
remaining provider calls and respects the greater of Retry-After and fifteen
minutes. Projection entitlement is probed separately from ranking entitlement.

The current Season directory must have matching season/week/position and
fresh root and directory timestamps. Duplicate normalized names and duplicate
IDs are excluded. The audit reports exact resolved active identities without
substituting Draft identities. It is not yet the shared production resolver.

The export contains bounded scope/identity metadata, HTTP/retry classification,
row/rank-collapse/mapping counts, chronology presence, and the existing strict
singleton rejection reason. It contains no key, request headers, cookies,
tokens, provider error text, player arrays, or raw response body. It creates
no learning snapshot and changes no decision evidence or effective weights.

`individualPayloadReason` explains the existing validator contract.
`individualPayloadValid` delegates to it. No equivalent provider shape has
been accepted without live proof. The six-position projection diagnostic now
uses the existing K/DST minimum of twenty rows as well as skill minima.

## Validation

- `node tools/season-rc4227-acquisition-audit-regression.mjs` PASS.
  Strict positive/negative shape reasons, directory ambiguity and stale scope,
  ten-request cap, serial single flight, six-position mapping, credential
  absence, malformed JSON, 401/403/429 stop and retry protection, safe missing
  expert serialization, secret sentinel exclusion.
- `node tools/season-weekly-projection-diagnostic-regression.mjs` PASS.
- `node tools/season-rc4226-adaptive-decision-regression.mjs` PASS.
- `node tools/season-rc4226-sources-regression.mjs` PASS.
- `node tools/season-rc4226-runtime-regression.mjs` PASS.
- Node syntax checks and `git diff --check` PASS.

These are synthetic regressions, not evidence of live expert activation or
primary provider recovery. No local full Strict or new cloud CI was run.
The coupled v303 Authority was valid at entry; it is intentionally not resealed
to certify this incomplete runtime candidate. No release version was bumped.

## Remaining safe gate

Obtain access to the user's existing FantasyPros credential through a private
configured app UI. Run the bounded local audit through the existing secure
proxy, keep only its sanitized result, and prove actual singleton and primary
projection contracts before making acquisition/parser changes. Do not publish
this partial candidate. Do not ask the user to paste a key into chat.

Continue with the original RC4.227 work package after that gate: canonical
shared identity authority, retry separation, active-first acquisition,
structured persisted source status, truthful compact health, selected fallback,
live coverage and canary verification, then candidate Authority/version,
focused tests, mobile review, exact-head cloud validation, adversarial review,
and authorized clean/green publication.

Physical authority remains separated: RC4.226 UI PHYSICAL PASS (user reported),
RC4.226 Decision Engine PHYSICAL PENDING, historical RC4.223 core PASS.
RC4.227 ANDROID ACCEPTANCE = PENDING. After eventual production deployment,
require exactly one Android Kader refresh and one safe diagnostic.

## Autonomous provider validation attempt — credential blocker

This section supersedes the earlier manual credential-entry continuation gate.
The user prohibits requesting preview setup, terminal commands, another key
entry, secret copying, or manual development-diagnostic clicks.

Start identity reverified unchanged: branch
`codex/rc4227-live-evidence-acquisition`, HEAD
`3a165dfdd788e53235091abf3ce25d52e2b39f86`, tree
`64175ec1f66e08ea865318f60ae36f0238bbcb59`, clean worktree.

CREDENTIAL_SOURCE_AVAILABLE = NO in the bounded inspected sources:

- Existing scoped FantasyPros/PITTI helpers have no reusable credential source.
  The ignored preview helper merely forwards the client's supplied header.
- No matching PITTI/FantasyPros process, user, or machine environment variable,
  or explicitly named local root configuration was found.
- The existing local PITTI tab's exact masked API-Key field is empty. Its old
  NO_CREDENTIAL diagnostic is historical, not a new authenticated live result.
- A script-free resource at the exact Production PITTI origin was selected to
  avoid launching the regular acquisition batch. The browser's read-only
  evaluation interface does not expose localStorage; the attempted exact-key
  lookup could not execute. That temporary tab was closed.
- A targeted, read-only check of the discovered Codex browser storage locations
  found no exact PITTI-origin credential key in the small WAL-only partition.
  Target-byte checks in the other discovered Codex partition also found no key
  or PITTI Production-origin bytes. This is not a complete LevelDB Get and does
  not establish global credential absence, nor inspect unrelated browser origins.
  No database dump/copy, decoded unrelated records, secret output, or credential
  persistence occurred.

No existing credential was available to a tiny secure bridge. No authenticated
FantasyPros request was sent. No preview server was started or left running.
The real expert singleton response contract and primary projection failure
classification remain UNKNOWN; no entitlement/authentication/outage diagnosis
can be inferred from this missing local access.

Static findings remain proven: selected resolution does not consume the known
Season directory; a fresh directory returns before singleton retries; regular
individual failures remain silent. Diagnostic pacing and backoff have prior
synthetic coverage only. No new live result proves a successful singleton retry.

No runtime, model, projection parser, fallback, Authority, version, or helper
change was made in this validation attempt. No tests/full Strict were rerun,
no commit was created, and nothing was pushed/published/deployed. Only this
existing checkpoint was updated with sanitized facts.

Next safe evidence gate: an authenticated execution context already configured
for PITTI that exposes the exact existing credential through a supported secure
bridge, or sanitized provider structural evidence from the already configured
actual app. No repeated key entry or manual development setup is requested.
Preserve the current candidate until that evidence exists; do not infer a
provider-parser repair from the missing local credential.

## Bounded expert repair and automatic safe acquisition diagnostics

This section supersedes the static-defect statements above as candidate findings;
the previous credential-access audit remains historical evidence and is preserved.

Entry identity was reverified directly from Git at 3a165dfdd788e53235091abf3ce25d52e2b39f86.
The only entry modification was this checkpoint. No provider request, browser,
preview, credential extraction, publication, PR, deployment or device test occurred.

Repairs:
- Selected and adaptive acquisition share the current Season directory and one
  directory flight. Exact name/ID ambiguity remains fail-closed. No third ID list.
- Fresh directory identity no longer bypasses missing/stale singleton acquisition.
  Active experts precede challengers, requests remain paced and serial, current
  successful snapshots are reused, transient retries are bounded, and forced
  refresh cannot bypass 401/403/429 backoff. Stale context cannot persist results.
- Normal singleton and six-position projection requests automatically populate
  bounded structural diagnostics. Captures include acquisition/context/expert,
  HTTP/body state/retry timing, allowlisted structural keys and array paths/counts,
  numeric/mapping counts and normalized rejection. No raw values, headers,
  cookies, keys, errors or payloads are exported. Stored diagnostics are allowlisted
  again when loaded. Diagnostics add no provider request and stay below 24 KB.
- Zero adaptive coverage renders PITTI-Panel offen; partial coverage is labeled.
  Compact cards and the projection/game availability guards remain unchanged.

Projection state: LIVE ROOT CAUSE UNKNOWN. Request, parser, points_half field,
mapping/thresholds and labeled sleeper_rotowire fallback remain unchanged.
No entitlement, live singleton success or Production/Android PASS is asserted.

Metadata: immutable rc4.226 Production/runtime receipts and coupled v303 authority
remain historical and unchanged. A separate rc4.227 local-candidate descriptor
pins the current eighteen runtime blobs and explicitly denies publication,
Production verification and provider-contract verification. Runtime version stays
v11.8.0-rc4.226 pending a separately authorized promotion/release package.
Only seal integrity is refreshed for the bounded local files; historical authority
digests are not repinned. The authority regression validates both the immutable
canonical rc4.226 blobs and the separate restricted local candidate.

Focused coverage passes: runtime/shared-flight/cache retry/403/429/stale-context/
active-before-challenger; shared selected/adaptive authority in both cold orders;
ambiguity; normal projection refresh with six unchanged requests; structural
nested-array diagnostics without parser acceptance; secret sentinels including
poisoned stored diagnostics; acquisition audit; adaptive decision, source, weekly
projection diagnostics, lane isolation, eligibility and weekly evidence guards.
Full Strict Suite: pending the single required run after final focused gates.

Next safe gate after the local commit: external exact-head canonical validation
under a separately authorized publication package; later, normal configured app
refresh and its automatically populated safe export can prove live acquisition.
No repeated key entry, preview setup or developer diagnostic click is required.

### Single Strict run and focused harness corrections

The one authorized full Strict Suite completed with 289/291 PASS. The two
failures were isolated VM harness dependencies, not provider/model assertions:
- season-rc4222-data-completeness-regression omitted seasonMissingExpertDiagnostic
  (already introduced in the preceding candidate), plus the newly shared
  automatic diagnostic functions.
- season-week-rollover-e2e omitted the automatic acquisition diagnostic functions
  required by its extracted normal refresh.
Both now load the actual production functions. Their original data completeness,
secret safety, week rollover, persistence, eligibility and decision assertions
remain unchanged and both focused reruns PASS. No runtime code changed after
that full run. Additional coupled VM tests were likewise repaired before the
full run by loading the actual functions, preserving their assertions.

STRICT_SUITE_PASS = NOT ESTABLISHED for the final corrected test tree.
A second full run has not been executed. Explicit permission for that run and,
only if green, the single local commit has been requested because the package
limits the expensive suite to once. Until authorized and green: no commit,
publication or promotion. All work remains preserved in the current worktree.

The user explicitly authorized a second full Strict run and the one local commit
on PASS. This overrides only the original one-run budget boundary. The two
focused harness corrections are green; runtime bytes remain unchanged from the
first run. Publication, PR, merge, deployment and device work remain forbidden.

### Authorized final validation

The explicitly authorized second full Strict Suite completed with **291/291 PASS**.
The original one-run result remains **289/291**, with the two proven VM dependency
failures corrected and focused-green before the authorized repeat. No assertions
were removed or weakened. Runtime bytes did not change between those runs.
Guardrail/seal integrity and git diff --check also PASS. No live provider request
or credential extraction occurred, and no Production/Android acceptance is claimed.
Exactly one local commit is now permitted; stop after its clean Git identity.

Files in this bounded commit (16):

- `PITTI_HANDOFF_SEAL.json`
- `app.js`
- `docs/PITTI_RC4227_ACQUISITION_CHECKPOINT.md`
- `tools/handoff-seal-reseal.mjs`
- `tools/postmerge-authority-regression.mjs`
- `tools/season-rc4222-data-completeness-regression.mjs`
- `tools/season-rc4224-roster-presentation-regression.mjs`
- `tools/season-rc4226-runtime-regression.mjs`
- `tools/season-selected-weekly-acquisition-regression.mjs`
- `tools/season-week-rollover-e2e.mjs`
- `tools/season-weekly-metadata-quota-regression.mjs`
- `tools/season-weekly-persisted-snapshot-regression.mjs`
- `tools/season-weekly-projection-diagnostic-regression.mjs`
- `tools/season-weekly-rank-retry-regression.mjs`
- `tools/fixtures/rc4227/local-candidate.json`
- `tools/season-rc4227-normal-acquisition-regression.mjs`
