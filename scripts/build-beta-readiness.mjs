import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const checkOnly = process.argv.includes("--check");
const jsonPath = resolve(root, "release/beta-readiness.json");
const markdownPath = resolve(root, "release/beta-readiness.md");
const readJson = async (path) => JSON.parse(await readFile(resolve(root, path), "utf8"));
const fail = (message) => { throw new Error(`[beta-readiness] ${message}`); };
const isUrl = (value) => typeof value === "string" && /^https:\/\//.test(value);
const isDate = (value) => typeof value === "string" && Number.isFinite(Date.parse(value));

const packageJson = await readJson("package.json");
const publication = await readJson("publication.json");
const releaseEvidence = await readJson("release/evidence.json");
const adoption = await readJson("release/adoption-dx.json");
const beta = await readJson("beta/evidence.json");
const externalEvidence = await readJson("release/beta-external-evidence.json");
const stabilityEvidence = await readJson("release/beta-stability.json");

if (beta.schemaVersion !== 1) fail("unsupported beta evidence schema");
if (beta.candidate !== packageJson.version) fail(`beta evidence belongs to ${beta.candidate}, not ${packageJson.version}`);
if (releaseEvidence.release?.version !== packageJson.version || releaseEvidence.automation?.browserMatrix?.status !== "passed") {
  fail("release evidence is not passing for the beta candidate");
}
if (releaseEvidence.automation?.accessibility?.status !== "passed" || releaseEvidence.automation?.runtimePerformance?.status !== "passed") {
  fail("accessibility or runtime evidence is not passing for the beta candidate");
}
if (adoption.version !== packageJson.version || adoption.status !== "passed") fail("Adoption DX evidence is stale");
if (packageJson.private !== true) fail("the repository package lock must remain enabled until the publication step");
if (publication.repository !== "minwookshin/teum" || publication.homepage !== packageJson.homepage) fail("canonical publication metadata drifted");
if (externalEvidence.schemaVersion !== 1
  || externalEvidence.generatedBy !== "scripts/verify-beta-external-evidence.mjs"
  || externalEvidence.candidate !== packageJson.version
  || externalEvidence.repository !== publication.repository) {
  fail("external beta evidence is stale or belongs to another repository");
}
if (!Array.isArray(externalEvidence.verifiedFeedback) || !Array.isArray(externalEvidence.verifiedInstallations)) {
  fail("external beta evidence inventory is invalid");
}
if (stabilityEvidence.schemaVersion !== 1
  || stabilityEvidence.generatedBy !== "scripts/verify-beta-stability.mjs"
  || stabilityEvidence.candidate !== packageJson.version
  || stabilityEvidence.repository !== publication.repository) {
  fail("beta stability evidence is stale or belongs to another repository");
}
if (!Array.isArray(beta.feedbackRounds) || beta.feedbackRounds.length !== 2) fail("exactly two feedback rounds must be tracked");

const verifiedFeedbackByUrl = new Map(externalEvidence.verifiedFeedback.map((entry) => [entry.url, entry]));
const verifiedInstallations = new Map(externalEvidence.verifiedInstallations.map((entry) => [entry.id, entry]));
const usedFeedbackUrls = new Set();

for (const [index, round] of beta.feedbackRounds.entries()) {
  if (round.round !== index + 1) fail("feedback rounds must be ordered 1 then 2");
  if (!["pending", "open", "complete"].includes(round.status)) fail(`feedback round ${round.round} has an invalid status`);
  if (!Array.isArray(round.evidenceUrls) || !Array.isArray(round.changes)) fail(`feedback round ${round.round} must own evidence and changes arrays`);
  if (round.changes.some((url) => !isUrl(url))) fail(`feedback round ${round.round} changes must be evidence URLs`);
  if (round.status === "pending" && (round.openedAt !== null || round.completedAt !== null)) fail(`pending feedback round ${round.round} cannot have dates`);
  if (round.status === "open" && (!isDate(round.openedAt) || round.completedAt !== null)) fail(`open feedback round ${round.round} needs only an opened date`);
  if (round.status === "complete") {
    if (!isDate(round.openedAt) || !isDate(round.completedAt) || Date.parse(round.completedAt) < Date.parse(round.openedAt)) {
      fail(`feedback round ${round.round} has invalid completion dates`);
    }
    if (!round.evidenceUrls.length || !round.evidenceUrls.every((url) => isUrl(url) && verifiedFeedbackByUrl.has(url))) {
      fail(`feedback round ${round.round} requires maintainer-accepted independent feedback evidence`);
    }
    for (const url of round.evidenceUrls) {
      if (usedFeedbackUrls.has(url)) fail(`feedback evidence cannot be reused across rounds: ${url}`);
      usedFeedbackUrls.add(url);
      const createdAt = verifiedFeedbackByUrl.get(url).createdAt;
      if (!isDate(createdAt) || Date.parse(createdAt) < Date.parse(round.openedAt) || Date.parse(createdAt) > Date.parse(round.completedAt)) {
        fail(`feedback evidence for round ${round.round} falls outside the round dates`);
      }
    }
    if (!isUrl(round.decisionUrl) || !round.summary.trim()) {
      fail(`feedback round ${round.round} cannot be complete without a linked decision and summary`);
    }
  }
}
if (beta.feedbackRounds[1].status !== "pending" && beta.feedbackRounds[0].status !== "complete") {
  fail("feedback round 2 cannot open before round 1 is complete");
}
if (beta.feedbackRounds[1].openedAt && Date.parse(beta.feedbackRounds[1].openedAt) < Date.parse(beta.feedbackRounds[0].completedAt)) {
  fail("feedback round 2 must start after round 1 completes");
}

if (!Array.isArray(beta.independentInstallations)) fail("independentInstallations must be an array");
const usedInstallIds = new Set();
const usedInstallEvidenceUrls = new Set();
for (const install of beta.independentInstallations) {
  if (!install.id || install.version !== packageJson.version || install.maintainerIndependent !== true || !isDate(install.recordedAt)) {
    fail(`independent install ${install.id ?? "<missing>"} is incomplete`);
  }
  if (!isUrl(install.evidenceUrl) || !["pinned-registry", "github-registry", "npm"].includes(install.distribution)) {
    fail(`independent install ${install.id} has invalid evidence or distribution`);
  }
  const checks = new Set(install.checks);
  if (!checks.has("typecheck") || !checks.has("production-build")) fail(`independent install ${install.id} lacks build evidence`);
  if (usedInstallIds.has(install.id) || usedInstallEvidenceUrls.has(install.evidenceUrl)) fail(`independent install ${install.id} duplicates existing evidence`);
  usedInstallIds.add(install.id);
  usedInstallEvidenceUrls.add(install.evidenceUrl);
  const verified = verifiedInstallations.get(install.id);
  if (!verified || verified.evidenceUrl !== install.evidenceUrl || verified.version !== install.version || verified.distribution !== install.distribution) {
    fail(`independent install ${install.id} is not present in the verified external evidence ledger`);
  }
}

const reviewEntries = Object.entries(beta.externalReviews ?? {});
const requiredReviews = [
  "edgeWindows",
  "iosSafari",
  "androidChrome",
  "operatingSystemAccessibilityModes",
  "humanTranslationAndRtl",
  "independentAccessibility",
  "linuxVisualBaselines",
];
if (JSON.stringify(reviewEntries.map(([name]) => name)) !== JSON.stringify(requiredReviews)) fail("external review inventory drifted");
for (const [name, review] of reviewEntries) {
  if (!["pending", "pass", "conditional-pass", "fail"].includes(review.status) || !Array.isArray(review.evidenceUrls)) fail(`${name} has an invalid record`);
  if (["pass", "conditional-pass", "fail"].includes(review.status) && (!review.evidenceUrls.length || !review.evidenceUrls.every(isUrl))) {
    fail(`${name} requires dated evidence links once reviewed`);
  }
}

const completedRounds = beta.feedbackRounds.filter((round) => round.status === "complete").length;
const completedReviews = reviewEntries.filter(([, review]) => review.status === "pass").length;
const started = isDate(beta.stableApiWindow?.startedAt) ? Date.parse(beta.stableApiWindow.startedAt) : null;
const ended = isDate(beta.stableApiWindow?.endedAt) ? Date.parse(beta.stableApiWindow.endedAt) : null;
const minimumStabilityDays = beta.stableApiWindow?.minimumDays;
if (!Number.isInteger(minimumStabilityDays) || minimumStabilityDays < 28) fail("stable API window must be at least 28 days");
if (stabilityEvidence.startedAt !== beta.stableApiWindow.startedAt || stabilityEvidence.minimumDays !== minimumStabilityDays) {
  fail("beta stability evidence does not match the declared API window");
}
if (!["collecting", "passed"].includes(stabilityEvidence.status)
  || !Number.isInteger(stabilityEvidence.consecutiveCompletedDays)
  || stabilityEvidence.consecutiveCompletedDays < 0
  || stabilityEvidence.consecutiveCompletedDays > minimumStabilityDays
  || !Array.isArray(stabilityEvidence.missingDates)
  || !Array.isArray(stabilityEvidence.creditedRuns)) {
  fail("beta stability evidence has an invalid coverage record");
}
const stabilityDays = stabilityEvidence.consecutiveCompletedDays;
const stabilityPassed = stabilityEvidence.status === "passed"
  && stabilityDays >= minimumStabilityDays
  && stabilityEvidence.missingDates.length === 0
  && stabilityEvidence.creditedRuns.length >= minimumStabilityDays
  && started !== null
  && ended !== null
  && ended >= started + minimumStabilityDays * 86_400_000;

const publicationChecks = {
  githubRelease: isUrl(beta.publication?.githubRelease),
  site: isUrl(beta.publication?.site),
  registry: isUrl(beta.publication?.registry),
  npm: isUrl(beta.publication?.npm),
};
const publicBetaReady = publicationChecks.githubRelease && publicationChecks.site && publicationChecks.registry;
const v1Checks = {
  independentInstallation: beta.independentInstallations.length >= 1,
  feedbackRounds: completedRounds === 2,
  stableApiWindow: stabilityPassed,
  externalReviews: completedReviews === requiredReviews.length,
  npmPublication: publicationChecks.npm,
};
const v1Ready = publicBetaReady && Object.values(v1Checks).every(Boolean);
const blockers = [
  ...(!publicationChecks.githubRelease ? ["Publish the verified GitHub prerelease"] : []),
  ...(!publicationChecks.site ? ["Promote and verify the candidate site"] : []),
  ...(!publicationChecks.registry ? ["Verify the live immutable registry bytes"] : []),
  ...(!v1Checks.npmPublication ? ["Publish and verify the npm beta package"] : []),
  ...(!v1Checks.independentInstallation ? ["Record one independent install, typecheck, and production build"] : []),
  ...(!v1Checks.feedbackRounds ? [`Complete two feedback rounds (${completedRounds}/2)`] : []),
  ...(!v1Checks.stableApiWindow ? [`Complete the ${minimumStabilityDays}-day API stability window (${stabilityDays}/${minimumStabilityDays})`] : []),
  ...(!v1Checks.externalReviews ? [`Complete the external support matrix (${completedReviews}/${requiredReviews.length})`] : []),
];

const value = {
  schemaVersion: 1,
  generatedBy: "scripts/build-beta-readiness.mjs",
  generatedAt: new Date().toISOString(),
  candidate: packageJson.version,
  programStage: beta.programStage,
  localCandidate: {
    status: "passed",
    releaseEvidence: true,
    adoptionDx: true,
    publicationLocked: true,
  },
  publicBeta: { ready: publicBetaReady, publication: publicationChecks },
  v1: {
    ready: v1Ready,
    checks: v1Checks,
    independentInstallations: beta.independentInstallations.length,
    completedFeedbackRounds: completedRounds,
    completedExternalReviews: completedReviews,
    stabilityDays,
    minimumStabilityDays,
  },
  blockers,
  claimBoundary: beta.claimBoundary,
};

const mark = (status) => status ? "complete" : "open";
const markdown = `# Teum beta readiness\n\nCandidate: \`${value.candidate}\`\n\nLocal candidate: passed\n\nPublic beta: ${mark(value.publicBeta.ready)}\n\nv1: ${mark(value.v1.ready)}\n\n## Evidence\n\n| Gate | Status |\n| --- | --- |\n| GitHub prerelease | ${mark(publicationChecks.githubRelease)} |\n| Live site | ${mark(publicationChecks.site)} |\n| Immutable registry | ${mark(publicationChecks.registry)} |\n| npm beta | ${mark(publicationChecks.npm)} |\n| Independent install | ${value.v1.independentInstallations}/1 |\n| Feedback rounds | ${value.v1.completedFeedbackRounds}/2 |\n| External support reviews | ${value.v1.completedExternalReviews}/${requiredReviews.length} |\n| API stability window | ${value.v1.stabilityDays}/${value.v1.minimumStabilityDays} days |\n\n## Open gates\n\n${blockers.map((blocker) => `- ${blocker}`).join("\n") || "- None"}\n\n## Claim boundary\n\n${value.claimBoundary}\n`;

const stable = (input) => {
  const { generatedAt: _generatedAt, ...rest } = input;
  return rest;
};
if (checkOnly) {
  const current = await readJson("release/beta-readiness.json").catch(() => null);
  const currentMarkdown = await readFile(markdownPath, "utf8").catch(() => null);
  if (!current || JSON.stringify(stable(current)) !== JSON.stringify(stable(value)) || currentMarkdown !== markdown) {
    fail("generated beta readiness is stale; run npm run build:beta");
  }
  console.log(`[beta-readiness] verified ${packageJson.version}; public beta ${mark(publicBetaReady)}; v1 ${mark(v1Ready)}`);
} else {
  await writeFile(jsonPath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await writeFile(markdownPath, markdown, "utf8");
  console.log(`[beta-readiness] wrote ${packageJson.version}; public beta ${mark(publicBetaReady)}; v1 ${mark(v1Ready)}`);
}
