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
