# PITTI Cloud-AUTO Foundation

Status: source implementation for review. No merge, deployment, rc4.190 device acceptance, server configuration or proven PC-independent operation is implied.

## Architecture and bounded authorization

`PITTI Cloud AUTO` is **workflow_dispatch only**. It accepts task_id, task_prompt, expected_main_sha, allowed_scope (JSON array), max_attempts and authorization_reference. Only an owner-triggered manual run from canonical main at exactly the expected SHA is accepted. Authorization_reference is a non-secret audit reference to that dispatch, not a reusable bearer credential or permission to merge. No automatic issue/comment/push trigger starts an implementation.

Stages: isolated protection inspection → trusted preflight → official Codex implementation → captured patch → fresh-runner validation → separate publisher → fresh exact-head CI → separate read-only Codex review → receipt awaiting explicit user approval. Every job checks out its controller from the authorized base; candidate code cannot replace the publisher. Requests are re-bound to GitHub's workflow inputs/run/attempt rather than trusted from agent-writable artifacts. Expected main is checked again before publication, CI and review.

The initial budget is deliberately **one attempt**, one 25-minute implementation invocation and one 25-minute review invocation; jobs also have deadlines. A bounded agent can diagnose and repair within that invocation. Failed tests publish nothing. Failed later CI/review leaves an unmerged work PR and a failed run; a new explicitly dispatched task creates a new unique branch. No endless retries, implicit budget reset or automatic merge exists. This Foundation does not claim a monetary spend cap; configure the API project's budget separately.

Workbranch: `pitti/cloud-auto/<task_id>-<run_id>-<run_attempt>`. Existing remote branches are never overwritten. Re-running a failed workflow gets a new attempt suffix. The Foundation authoring branch `pitti/cloud-auto-foundation` is separate.

Scope accepts exact paths or directory prefixes ending `/`. No wildcard, traversal, symlink, gitlink, binary, secret filename, or file over 2 MiB. Necessary coupled authority/test files must be explicitly included in the authorized scope; there is no silent exception. Controller, workflow, AGENTS, dependency and permission files cannot be modified by ordinary Cloud tasks, even through a broad prefix. Foundation maintenance is a separate reviewed work package.

Codex does not commit/push. It must leave the base HEAD unchanged; the trusted publisher creates one commit from the validated tree. Before publication it rechecks base, branch, patch hash, tree, scope, clean tracked content, server protection and obvious secret-material signatures. This scan is defense in depth, not proof that arbitrary text cannot contain a secret. Credentials are never provided to candidate tests or the implementation process.

## Official integration and runtimes

Uses official `openai/codex-action`, resolved from v1 to commit `86365089eb2b84e0a8fb0717b304f8bdcb13b20e`, with documented inputs prompt-file, output-file, output-schema-file, codex-version, permission-profile, safety-strategy and codex-args. CLI/proxy version is pinned to 0.153.0. Implementation uses `:workspace`; review uses `:read-only`; both use `drop-sudo` and fresh ephemeral contexts. Neither receives publisher credentials. The action supplies the model API through its protected proxy. No hand-built Codex exec wrapper replaces the official action.

The current official action internally installs Node 24. PITTI setup/validation explicitly selects **Node 22.23.2**, including after the action. Python 3.13, Git and GitHub-hosted Ubuntu provide package tooling. Playwright **1.62.1** and YAML **2.9.0** are exact lockfile dependencies. Chromium is installed from the pinned Playwright distribution. Local `PITTI_PLAYWRIGHT`/`PITTI_BROWSER` overrides still work, but CI uses neither a Codex-runtime path nor Windows Edge. Browser fixture remains 390×844 mobile emulation, mocked external network, physicalAndroid=false.

Source: [official Codex GitHub Action](https://learn.chatgpt.com/docs/github-action), [verified action manifest](https://github.com/openai/codex-action/blob/86365089eb2b84e0a8fb0717b304f8bdcb13b20e/action.yml). Node 24 inside the action is tooling isolation, not a change to the Node 22 project test target.

## Required administrator configuration — not created by this work

1. Separately approve/merge the Foundation after its exact-head tests and review. Until then, the canonical-main-only dispatcher cannot run this new workflow.
2. Apply and verify the two rulesets in `PITTI_CLOUD_MAIN_PROTECTION.md`. No Cloud App bypass, auto-merge or deployment permission.
3. Create environment `pitti-cloud-development`, restricted to protected main. Store **PITTI_OPENAI_API_KEY** there, using a project-scoped key with an administrator-approved budget. No real key is generated/read/copied by this work.
4. Create a GitHub App installed only on `Muero42/draft-companion`, with **Contents: read/write**, **Pull requests: read/write**, implicit **Metadata: read**. No Administration, Actions write, Workflows write, Deployments, Secrets, Pages or main-bypass permission. Set **PITTI_CLOUD_APP_ID** as an environment variable and **PITTI_CLOUD_APP_PRIVATE_KEY** as a secret in environment **pitti-cloud-publisher**, restricted to protected main. The official create-github-app-token action creates a short-lived repository-specific installation token and revokes it at job completion.
5. Confirm hosting excludes Cloud workbranches, then set repository variable **PITTI_NONDEPLOYING_BRANCHES_CONFIRMED=true**. Do not set it before actual verification.
6. GitHub must permit the workflow's read token to inspect Actions and PRs. A separate pre-agent job uses a short-lived App token to inspect full rulesets, then revokes it before implementation starts. The publisher repeats that inspection. GitHub may omit bypass lists when access is insufficient: an omitted list is UNKNOWN, never an empty list. Verify full bypass visibility with the configured App during administrator setup. If unavailable, this Foundation remains blocked; do not widen App administration/main permissions or substitute a boolean claiming protection exists.

GitHub App authentication is chosen over relying on GITHUB_TOKEN-triggered follow-up CI. App-created PR events can launch the existing PR workflows; GITHUB_TOKEN events are not assumed reliable for unattended follow-up. The controller observes the newest run of each required workflow on exactly the published head and rejects missing, stale, failed or superseded results. [GitHub's trigger semantics](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow)

## CI, review and promotion

Existing three workflows retain their checks and add Foundation regressions; checkout explicitly targets the PR head instead of silently using a synthetic merge checkout. `PITTI cloud validation` adds the unique job `pitti-cloud-validation`: full Strict Suite, YAML contracts, mobile Chromium, package/re-extraction, behavioral tests on re-extracted bytes, seal and no tracked mutations. The takeover validator consumes freshly collected GitHub evidence after all four CI workflows pass. A new head or changed main invalidates the old review/CI basis.

Review runs on a separate runner/context with no code-write permission. It receives the complete diff, exact head, current main, CI and takeover evidence; checks 14 distinct semantic topics and adversarial counterexamples. Its schema-bound receipt requires exact SHAs, no unresolved findings, distinct evidenced topics, independent=true and readOnly=true. A failed/incomplete review cannot produce a PASS receipt.

The final receipt always says `AWAITING_EXPLICIT_USER_APPROVAL_FOR_THIS_PR_HEAD`. The Foundation contains **no merge implementation**. A later promotion must reverify the same PR/head, latest CI, review and current authority and obtain fresh explicit user authorization for exactly that PR/head. No source/CI/review receipt authorizes deployment or device acceptance.

## Legacy workflow classification

rc461: B historical, C unsafe to revive because it generates/commits obsolete runtime. rc462: B historical, C formerly automatic main writer. rc463: B historical, C obsolete version rewriting and commit/push under always(). None is A/currently required.

Original bytes are retained in `docs/archive/*.yml.historical`. Their executable workflow entries are manual-only, read-only and unconditionally skipped. No evidence/runtime helper was deleted. The current three release/guard/package workflows remain active; other read-only historical draft gates are preserved.

## Receipts and later PC-off test

Before commit, validation binds to base SHA + exact candidate Git tree + patch SHA256 + run/attempt. After publication, artifacts are named by final commit SHA. They include Strict Suite JSON, browser receipt/screenshot, package ZIP/receipt, authority/takeover evidence, implementation summary, complete diff, CI and read-only review receipt. No desktop path is operative authority; runner paths in package receipts are artifact-local paths.

Later test, only after configuration and separately approved Foundation merge:

1. Fully switch off Windows PC; use GitHub Web/Mobile.
2. Dispatch a harmless documentation-only task with fresh expected_main_sha, unique task_id, explicit scope such as `["docs/cloud-smoke.md"]`, one attempt and an owner authorization reference. Avoid sealed files for the first rehearsal.
3. Observe cloud startup, unique workbranch, implementation, tests, commit, App push and PR.
4. Verify four exact-head CI workflows, independent read-only receipt, unchanged main and no deployment. Download SHA-bound artifacts from the web.
5. Only real observations from this test can establish **PC_UNABHÄNGIG_PASS**. CI alone and this implementation never set it.

Local PC/GCM/Edge are not needed by the proposed normal cycle. Personal browser credentials/backups and optional ADB diagnosis remain local; physical Android/PWA acceptance remains a separate hardware gate. Source rc4.190, physical PASS rc4.188, rollback rc4.169 and deployment UNKNOWN_REQUIRES_REVERIFICATION remain unchanged.
