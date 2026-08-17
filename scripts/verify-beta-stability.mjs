import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { buildStabilityCoverage } from "./beta-evidence-lib.mjs";

const root = process.cwd();
const writeEvidence = process.argv.includes("--write-evidence");
const readJson = async (path) => JSON.parse(await readFile(resolve(root, path), "utf8"));
const fail = (message) => { throw new Error(`[beta-stability] ${message}`); };
const packageJson = await readJson("package.json");
const publication = await readJson("publication.json");
const beta = await readJson("beta/evidence.json");
if (beta.candidate !== packageJson.version) fail("beta candidate does not match package version");

const apiBase = process.env.GITHUB_API_URL ?? "https://api.github.com";
const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": "teum-beta-stability-verifier",
  "X-GitHub-Api-Version": "2022-11-28",
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
};

async function requestJson(url, label) {
  const response = await fetch(url, { headers });
  if (!response.ok) fail(`${label} returned ${response.status}`);
  return response.json();
}

async function fetchSuccessfulRuns() {
  const runs = [];
  for (let page = 1; page <= 10; page += 1) {
    const url = `${apiBase}/repos/${publication.repository}/actions/workflows/beta-health.yml/runs?status=success&per_page=100&page=${page}`;
    const payload = await requestJson(url, `workflow runs page ${page}`);
    const batch = payload.workflow_runs ?? [];
    runs.push(...batch);
    if (batch.length < 100) break;
  }
  return runs;
}

const now = process.env.TEUM_NOW ?? new Date().toISOString();
const runs = await fetchSuccessfulRuns();
const coverage = buildStabilityCoverage({
  startedAt: beta.stableApiWindow.startedAt,
  minimumDays: beta.stableApiWindow.minimumDays,
  now,
  runs,
});
const report = {
  schemaVersion: 1,
  generatedBy: "scripts/verify-beta-stability.mjs",
  generatedAt: new Date().toISOString(),
  candidate: packageJson.version,
  repository: publication.repository,
  workflow: "beta-health.yml",
  startedAt: beta.stableApiWindow.startedAt,
  minimumDays: beta.stableApiWindow.minimumDays,
  targetEndsOn: coverage.targetEndsOn,
  expectedCompletedDays: coverage.expectedCompletedDays,
  consecutiveCompletedDays: coverage.consecutiveCompletedDays,
  missingDates: coverage.missingDates,
  verifiedThrough: coverage.verifiedThrough,
  status: coverage.passed ? "passed" : "collecting",
  creditedRuns: coverage.creditedRuns,
  claimBoundary: "A stability day is credited only when the completed UTC day has a successful public-beta-health workflow run. The first missing day stops the consecutive window.",
};

if (writeEvidence) {
  await writeFile(resolve(root, "release/beta-stability.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
}

console.log(`[beta-stability] ${report.status}; ${report.consecutiveCompletedDays}/${report.minimumDays} completed days; ${report.missingDates.length} missing`);
