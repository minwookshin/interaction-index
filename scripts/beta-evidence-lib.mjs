const dayMs = 86_400_000;

export const normalizeIssueField = (value) => String(value ?? "")
  .trim()
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, " ")
  .trim();

export function parseIssueFormBody(body) {
  const fields = new Map();
  let heading = null;
  let lines = [];

  const commit = () => {
    if (!heading) return;
    fields.set(normalizeIssueField(heading), lines.join("\n").trim());
  };

  for (const line of String(body ?? "").split(/\r?\n/)) {
    const match = line.match(/^###\s+(.+?)\s*$/);
    if (match) {
      commit();
      heading = match[1];
      lines = [];
    } else if (heading) {
      lines.push(line);
    }
  }
  commit();
  return fields;
}

export const issueField = (fields, label) => fields.get(normalizeIssueField(label)) ?? "";

const isUsefulAnswer = (value) => {
  const normalized = normalizeIssueField(value);
  return Boolean(normalized && normalized !== "no response");
};

const firstHttpsUrl = (value) => String(value ?? "").match(/https:\/\/[^\s)>\]]+/)?.[0] ?? null;

const acceptedAssociations = new Set(["NONE", "CONTRIBUTOR", "FIRST_TIMER", "FIRST_TIME_CONTRIBUTOR"]);

export function evaluateAdopterIssue(issue, { candidate, owner }) {
  const fields = parseIssueFormBody(issue.body);
  const labels = new Set((issue.labels ?? []).map((label) => typeof label === "string" ? label : label.name));
  const author = issue.user?.login ?? issue.author?.login ?? null;
  const authorType = issue.user?.type ?? issue.author?.type ?? "User";
  const association = issue.author_association ?? issue.authorAssociation ?? null;
  const version = issueField(fields, "Teum version");
  const distribution = issueField(fields, "Integration path");
  const independence = issueField(fields, "Project ownership");
  const citation = issueField(fields, "May the maintainer cite this evaluation publicly?");
  const typecheck = issueField(fields, "TypeScript check result");
  const productionBuild = issueField(fields, "Production build result");
  const publicEvidenceUrl = firstHttpsUrl(issueField(fields, "Public evidence URL"));
  const issueUrl = issue.html_url ?? issue.url ?? null;
  const closed = String(issue.state).toLowerCase() === "closed";
  const independentAuthor = Boolean(
    author
    && author !== owner
    && authorType !== "Bot"
    && acceptedAssociations.has(association),
  );
  const baseFeedback = ["Product task", "What worked and what created friction?", "Environment and evidence"]
    .every((label) => isUsefulAnswer(issueField(fields, label)));
  const exactCandidate = version.trim() === candidate;
  const independentProject = normalizeIssueField(independence) === "independently maintained project";
  const citationAllowed = normalizeIssueField(citation) === "yes this public issue only";
  const feedbackAccepted = closed
    && labels.has("feedback-accepted")
    && independentAuthor
    && independentProject
    && exactCandidate
    && citationAllowed
    && baseFeedback;
  const acceptedDistribution = new Map([
    ["pinned https registry", "pinned-registry"],
    ["github registry", "github-registry"],
    ["npm beta", "npm"],
  ]).get(normalizeIssueField(distribution)) ?? null;
  const typecheckPassed = normalizeIssueField(typecheck) === "passed";
  const productionBuildPassed = normalizeIssueField(productionBuild) === "passed";
  const installationVerified = feedbackAccepted
    && labels.has("adoption-verified")
    && acceptedDistribution !== null
    && typecheckPassed
    && productionBuildPassed
    && publicEvidenceUrl !== null;

  const feedbackReasons = [
    ...(!closed ? ["issue-open"] : []),
    ...(!labels.has("feedback-accepted") ? ["missing-feedback-accepted-label"] : []),
    ...(!independentAuthor ? ["author-not-independent"] : []),
    ...(!independentProject ? ["project-not-independent"] : []),
    ...(!exactCandidate ? ["candidate-mismatch"] : []),
    ...(!citationAllowed ? ["citation-not-authorized"] : []),
    ...(!baseFeedback ? ["feedback-fields-incomplete"] : []),
  ];
  const installationReasons = [
    ...feedbackReasons,
    ...(!labels.has("adoption-verified") ? ["missing-adoption-verified-label"] : []),
    ...(acceptedDistribution === null ? ["unsupported-distribution"] : []),
    ...(!typecheckPassed ? ["typecheck-not-passed"] : []),
    ...(!productionBuildPassed ? ["production-build-not-passed"] : []),
    ...(publicEvidenceUrl === null ? ["public-evidence-url-missing"] : []),
  ];

  return {
    issue: issue.number,
    url: issueUrl,
    author,
    createdAt: issue.created_at ?? issue.createdAt ?? null,
    candidate: version.trim() || null,
    distribution: acceptedDistribution,
    publicEvidenceUrl,
    feedback: { verified: feedbackAccepted, reasons: feedbackAccepted ? [] : feedbackReasons },
    installation: { verified: installationVerified, reasons: installationVerified ? [] : installationReasons },
  };
}

const utcDay = (value) => new Date(value).toISOString().slice(0, 10);
const addDays = (date, amount) => new Date(Date.parse(`${date}T00:00:00.000Z`) + amount * dayMs).toISOString().slice(0, 10);

export function buildStabilityCoverage({ startedAt, minimumDays, now, runs }) {
  const startedMs = Date.parse(startedAt);
  const nowMs = Date.parse(now);
  if (!Number.isFinite(startedMs) || !Number.isFinite(nowMs) || nowMs < startedMs) {
    throw new Error("stability timestamps are invalid");
  }
  if (!Number.isInteger(minimumDays) || minimumDays < 1) throw new Error("minimumDays must be a positive integer");

  const startDate = utcDay(startedAt);
  const yesterday = utcDay(nowMs - dayMs);
  const targetEndsOn = addDays(startDate, minimumDays - 1);
  const expectedDates = [];
  for (let index = 0; index < minimumDays; index += 1) {
    const date = addDays(startDate, index);
    if (date > yesterday) break;
    expectedDates.push(date);
  }

  const successfulRuns = (runs ?? [])
    .filter((run) => String(run.conclusion).toLowerCase() === "success")
    .map((run) => ({
      id: run.id ?? run.databaseId,
      event: run.event ?? null,
      url: run.html_url ?? run.url ?? null,
      startedAt: run.run_started_at ?? run.created_at ?? run.createdAt,
      headSha: run.head_sha ?? run.headSha ?? null,
    }))
    .filter((run) => Number.isFinite(Date.parse(run.startedAt)) && Date.parse(run.startedAt) >= startedMs)
    .sort((a, b) => Date.parse(a.startedAt) - Date.parse(b.startedAt));
  const covered = new Map();
  for (const run of successfulRuns) {
    const date = utcDay(run.startedAt);
    if (!covered.has(date)) covered.set(date, run);
  }

  const missingDates = expectedDates.filter((date) => !covered.has(date));
  let consecutiveCompletedDays = 0;
  for (const date of expectedDates) {
    if (!covered.has(date)) break;
    consecutiveCompletedDays += 1;
  }
  const passed = consecutiveCompletedDays >= minimumDays;
  const creditedRuns = expectedDates
    .filter((date) => covered.has(date))
    .map((date) => ({ date, ...covered.get(date) }));

  return {
    startDate,
    targetEndsOn,
    expectedCompletedDays: expectedDates.length,
    consecutiveCompletedDays,
    missingDates,
    passed,
    verifiedThrough: consecutiveCompletedDays > 0 ? addDays(startDate, consecutiveCompletedDays - 1) : null,
    creditedRuns,
  };
}
