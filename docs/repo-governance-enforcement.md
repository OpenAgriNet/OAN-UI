# OpenAgriNet Governance Enforcement

This repository enforces the policy in `Openagrinet-repo-ownership-and-pr-governance.pdf` with:

1. Pull request template checklist.
2. Automated PR governance checks in GitHub Actions.
3. Scripted branch protection for protected branches.

## What Is Enforced In-Repo

- PRs into protected branches are validated by `.github/workflows/pr-governance.yml` for:
  - branch name pattern (`feature/`, `bugfix/`, `hotfix/`, `chore/`)
  - no self-approval
  - at least one peer approval
  - re-approval on latest commit
  - all review threads resolved

## Apply GitHub Branch Protection

Run:

```bash
bash scripts/apply_repo_governance.sh
```

Optional explicit target repo:

```bash
bash scripts/apply_repo_governance.sh <org>/<repo>
```

### Script Requirements

- `gh` installed and authenticated (`gh auth login`)
- admin access to the target repository
- `jq` installed

### Script Applies These Settings

For branches that exist among `main`, `master`, `mh-main`, `bh-main`:

- pull-request reviews required (minimum 1 approval)
- code-owner review not required (one peer approval is still required)
- stale approvals dismissed on new commits
- last push requires approval from someone else
- all conversations must be resolved
- force pushes disabled
- branch deletions disabled
- admin enforcement enabled
- required status check: `PR Governance Gate / governance`

Repository changes do not modify existing GitHub settings automatically. An
administrator must rerun the script to disable code-owner review in existing
branch protections. If a repository or organization ruleset separately requires
code-owner review, an administrator must update that ruleset as well.

## Validate Governance Checks

```bash
node --test scripts/pr-governance.test.mjs
```
