import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { evaluateAdopterIssue } from "./beta-evidence-lib.mjs";

const root = process.cwd();
const writeEvidence = process.argv.includes("--write-evidence");
const readJson = async (path) => JSON.parse(await readFile(resolve(root, path), "utf8"));
const fail = (message) => { throw new Error(`[beta-external-evidence] ${message}`); };
const packageJson = await readJson("package.json");
const publication = await readJson("publication.json");
const [owner, repository] = publication.repository.split("/");
if (!owner || !repository) fail("publication repository is invalid");

const apiBase = process.env.GITHUB_API_URL ?? "https://api.github.com";
const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": "teum-beta-evidence-verifier",
  "X-GitHub-Api-Version": "2022-11-28",
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
};

async function requestJson(url, label) {
  const response = await fetch(url, { headers });
  if (!response.ok) fail(`${label} returned ${response.status}`);
  return response.json();
}

async function fetchFeedbackIssues() {
  const issues = [];
  for (let page = 1; page <= 10; page += 1) {
    const url = `${apiBase}/repos/${publication.repository}/issues?state=all&labels=feedback&per_page=100&page=${page}`;
    const batch = await requestJson(url, `feedback issue page ${page}`);
    issues.push(...batch.filter((issue) => !issue.pull_request));
    if (batch.length < 100) break;
  }
  return issues.sort((a, b) => a.number - b.number);
}

const issues = await fetchFeedbackIssues();
const evaluations = issues.map((issue) => evaluateAdopterIssue(issue, {
  candidate: packageJson.version,
  owner,
}));
const verifiedFeedback = evaluations
  .filter((evaluation) => evaluation.feedback.verified)
  .map((evaluation) => ({
    issue: evaluation.issue,
    url: evaluation.url,
    author: evaluation.author,
    createdAt: evaluation.createdAt,
  }));
const verifiedInstallations = evaluations
  .filter((evaluation) => evaluation.installation.verified)
  .map((evaluation) => ({
    id: `github-issue-${evaluation.issue}`,
    version: packageJson.version,
    maintainerIndependent: true,
    recordedAt: evaluation.createdAt,
    evidenceUrl: evaluation.url,
    publicEvidenceUrl: evaluation.publicEvidenceUrl,
    distribution: evaluation.distribution,
    checks: ["typecheck", "production-build"],
  }));

const report = {
  schemaVersion: 1,
  generatedBy: "scripts/verify-beta-external-evidence.mjs",
  generatedAt: new Date().toISOString(),
  candidate: packageJson.version,
  repository: publication.repository,
  reviewedIssues: evaluations.length,
  verifiedFeedback,
  verifiedInstallations,
  candidates: evaluations,
  claimBoundary: "Only closed, maintainer-accepted issues from independent authors count. Installation credit additionally requires a public evidence URL and passing consumer typecheck and production build results.",
};

if (writeEvidence) {
  await writeFile(resolve(root, "release/beta-external-evidence.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
}

console.log(`[beta-external-evidence] reviewed ${evaluations.length}; feedback ${verifiedFeedback.length}; installations ${verifiedInstallations.length}`);
