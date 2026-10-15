import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const workflow = readFileSync(new URL("../.github/workflows/pr-governance.yml", import.meta.url), "utf8");
const script = workflow.split("          script: |\n")[1].replace(/^            /gm, "");
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

for (const [name, reviews, unresolved, expectedFailure] of [
  ["accepts a peer approval without code owners", [{ user: { login: "peer" }, state: "APPROVED", commit_id: "latest" }], false, null],
  ["requires peer approval", [], false, "At least one peer approval is required."],
  ["requires approval on latest commit", [{ user: { login: "peer" }, state: "APPROVED", commit_id: "old" }], false, "No peer approval found on the latest commit."],
  ["rejects self approval", [{ user: { login: "author" }, state: "APPROVED", commit_id: "latest" }], false, "Authors cannot approve their own pull request."],
  ["requires resolved threads", [{ user: { login: "peer" }, state: "APPROVED", commit_id: "latest" }], true, "unresolved review thread(s)"],
]) {
  test(name, async () => {
    const failures = [];
    await new AsyncFunction("context", "github", "core", script)(
      {
        repo: { owner: "org", repo: "ui" },
        payload: { pull_request: {
          number: 1, base: { ref: "main" }, head: { ref: "chore/remove-codeowners", sha: "latest" },
          user: { login: "author", type: "User" },
        } },
      },
      {
        rest: { pulls: { listReviews() {} } },
        paginate: async () => reviews.map((review) => ({ ...review, submitted_at: "2026-01-01T00:00:00Z" })),
        graphql: async () => ({ repository: { pullRequest: { reviewThreads: {
          nodes: [{ isResolved: !unresolved }], pageInfo: { hasNextPage: false },
        } } } }),
      },
      { setFailed: (message) => failures.push(message), info() {} },
    );
    if (expectedFailure) {
      assert.equal(failures.length, 1);
      assert.ok(failures[0].includes(expectedFailure), failures[0]);
    } else {
      assert.deepEqual(failures, []);
    }
  });
}

test("branch protection disables code-owner review without disabling peer review", () => {
  const protection = readFileSync(new URL("./apply_repo_governance.sh", import.meta.url), "utf8");
  assert.match(protection, /require_code_owner_reviews: false/);
  assert.match(protection, /required_approving_review_count: 1/);
});
