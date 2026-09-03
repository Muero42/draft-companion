# PITTI Cloud main protection — required configuration, not applied

Target: `Muero42/draft-companion`, `refs/heads/main`. At the Foundation precheck main was `685770c13c977481eb94e4142d227ebc58c10499`, unprotected, with no active rulesets. This observation is historical; every Cloud run re-reads the server configuration.

The Foundation does **not** enable protection, merge, auto-merge or deployment. An administrator must configure the following two **active branch rulesets** before enabling Cloud publication. A repository-scoped contents-write token is not intrinsically branch-scoped: the separate update restriction is what prevents the Cloud App from writing main. Never claim that `contents: write` alone is workbranch-only.

## 1. PITTI main review and checks

- Target branch: explicit `refs/heads/main`; no exclusions.
- Enforcement: active. Bypass list: **empty**, including administrators and Apps.
- Require pull request, at least one approving review, dismiss stale reviews on new commits, require code-owner review. `.github/CODEOWNERS` names `@Muero42`.
- Require these exact check contexts: `guardrails`, `behavioral-contract`, `package`, `pitti-cloud-validation`.
- Block deletion and non-fast-forward updates.
- Initially `strict_required_status_checks_policy: false`: exact PR HEAD is explicitly checked; current main must still equal the authorized base at review and promotion. If main moves, fail closed and start a new authorized attempt. Do not silently rebase or reuse old review evidence.
- Select the GitHub Actions integration as the check source where available. Verify the source identity and the real context names in the final Foundation PR before activation.

The first three job names were read from successful GitHub jobs `100656225014`, `100656225886`, `100656225702` on the canonical precheck SHA. The new `pitti-cloud-validation` context must be observed in the Foundation PR before adding the rule. Workflow display titles are not substitutes for check contexts.

## 2. PITTI main update restriction

- Same explicit main target, active, no exclusions.
- Rule: restrict updates (`update`).
- Sole bypass: repository administrator role (`RepositoryRole`, actor_id `5`, bypass mode `always`). No Integration, Team, deploy key or Cloud App bypass.
- This bypass applies only to the update rule. It must not be added to the separate review/check ruleset.

This means the owner can perform a separately authorized, fully checked merge; the publisher App cannot update main or merge a PR. The Cloud App installation must not be a repository administrator. Ordinary agent, validator and reviewer jobs use only read permissions.

## Additional non-deployment requirement

Before setting `PITTI_NONDEPLOYING_BRANCHES_CONFIRMED=true`, inspect the actual hosting integration and exclude `pitti/cloud-auto/**` from automatic deployments. No Pages/Cloudflare credential is supplied to the Foundation. Production branches beyond main, such as gh-pages, should have their own update restriction; the publisher code accepts only the generated workbranch ref and implements no deployment API. Do not infer deployment parity from these settings.

## Later acceptance

Read `GET /repos/Muero42/draft-companion/rulesets` and every referenced full ruleset. `tools/cloud-contract.mjs:protectionErrors` must PASS. Missing access, missing rules, inactive enforcement, incomplete checks or an App bypass must stop the publisher. Confirm with a disposable non-production rehearsal that the App can create its workbranch/PR and is denied main updates; never test a destructive update on main. Validate settings in the GitHub UI as well as API evidence.

The API restricts bypass visibility by caller access. Require an explicit `bypass_actors` array on every applicable ruleset; omission must fail closed. The isolated protection job and publisher use the App token for this read, never the implementation agent. Full visibility with the actual least-privilege App is a setup acceptance gate, not proven by this source change. Do not grant Administration or main bypass to make this check pass.

After the Foundation is separately merged, run the PC-off test in `PITTI_CLOUD_AUTO.md`. This document is a target configuration, never evidence that it has been applied.

Sources: [GitHub ruleset API](https://docs.github.com/en/rest/repos/rules), [GitHub workflow triggering](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow).
