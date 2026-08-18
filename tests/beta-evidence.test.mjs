import test from "node:test";
import assert from "node:assert/strict";
import { buildStabilityCoverage, evaluateAdopterIssue, issueField, parseIssueFormBody } from "../scripts/beta-evidence-lib.mjs";

const issueBody = ({ evidence = "https://github.com/example/consumer/actions/runs/1" } = {}) => `### Teum version

0.1.0-rc.22

### Integration path

Pinned HTTPS registry

### Components or patterns evaluated

Button, Shared Detail

### Product task

Built an issue review flow.

### What worked and what created friction?

The source ownership was clear; the update diff needed more context.

### Environment and evidence

React 19, TypeScript 5.9, Vite 7.

### Public evidence URL

${evidence}

### Project ownership

Independently maintained project

### Evaluation outcome

Kept in an internal prototype

### May the maintainer cite this evaluation publicly?

Yes, this public issue only

### TypeScript check result

Passed

### Production build result

Passed`;

const validIssue = (overrides = {}) => ({
  number: 42,
  html_url: "https://github.com/minwookshin/whatiuse/issues/42",
  state: "closed",
  created_at: "2026-08-18T15:00:00Z",
  author_association: "NONE",
  user: { login: "external-adopter", type: "User" },
  labels: [{ name: "feedback" }, { name: "feedback-accepted" }, { name: "adoption-verified" }],
  body: issueBody(),
  ...overrides,
});

test("issue form parser preserves multiline answers by normalized heading", () => {
  const fields = parseIssueFormBody(issueBody());
  assert.equal(issueField(fields, "Teum version"), "0.1.0-rc.22");
  assert.match(issueField(fields, "What worked and what created friction?"), /source ownership/);
});

test("closed maintainer-accepted independent evidence verifies feedback and installation", () => {
  const result = evaluateAdopterIssue(validIssue(), { candidate: "0.1.0-rc.22", owner: "minwookshin" });
  assert.equal(result.feedback.verified, true);
  assert.equal(result.installation.verified, true);
  assert.equal(result.distribution, "pinned-registry");
});

test("maintainer-authored or open issues cannot become independent evidence", () => {
  const maintainer = evaluateAdopterIssue(validIssue({ user: { login: "minwookshin", type: "User" }, author_association: "OWNER" }), {
    candidate: "0.1.0-rc.22",
    owner: "minwookshin",
  });
  const open = evaluateAdopterIssue(validIssue({ state: "open" }), { candidate: "0.1.0-rc.22", owner: "minwookshin" });
  assert.equal(maintainer.feedback.verified, false);
  assert.ok(maintainer.feedback.reasons.includes("author-not-independent"));
  assert.equal(open.installation.verified, false);
  assert.ok(open.installation.reasons.includes("issue-open"));
});

test("accepted feedback without public consumer evidence does not verify installation", () => {
  const result = evaluateAdopterIssue(validIssue({ body: issueBody({ evidence: "No public URL" }) }), {
    candidate: "0.1.0-rc.22",
    owner: "minwookshin",
  });
  assert.equal(result.feedback.verified, true);
  assert.equal(result.installation.verified, false);
  assert.ok(result.installation.reasons.includes("public-evidence-url-missing"));
});

test("stability coverage credits completed UTC days in sequence", () => {
  const coverage = buildStabilityCoverage({
    startedAt: "2026-08-17T08:42:11Z",
    minimumDays: 2,
    now: "2026-08-19T14:00:00Z",
    runs: [
      { id: 1, conclusion: "success", run_started_at: "2026-08-17T09:43:51Z", html_url: "https://example.com/1" },
      { id: 2, conclusion: "success", run_started_at: "2026-08-18T13:17:00Z", html_url: "https://example.com/2" },
    ],
  });
  assert.equal(coverage.consecutiveCompletedDays, 2);
  assert.equal(coverage.passed, true);
  assert.deepEqual(coverage.missingDates, []);
  assert.equal(coverage.verifiedThrough, "2026-08-18");
});

test("a missing day stops stability credit even when a later run succeeds", () => {
  const coverage = buildStabilityCoverage({
    startedAt: "2026-08-17T08:42:11Z",
    minimumDays: 3,
    now: "2026-08-20T14:00:00Z",
    runs: [
      { id: 1, conclusion: "success", run_started_at: "2026-08-17T09:43:51Z" },
      { id: 3, conclusion: "success", run_started_at: "2026-08-19T13:17:00Z" },
    ],
  });
  assert.equal(coverage.consecutiveCompletedDays, 1);
  assert.equal(coverage.passed, false);
  assert.deepEqual(coverage.missingDates, ["2026-08-18"]);
});
