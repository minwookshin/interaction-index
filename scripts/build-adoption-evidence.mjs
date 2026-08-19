import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const checkOnly = process.argv.includes("--check");
const jsonPath = resolve(root, "release/adoption-dx.json");
const readJson = async (path) => JSON.parse(await readFile(resolve(root, path), "utf8"));
const packageJson = await readJson("package.json");
const vite = await readJson("release/quickstart.json");
const next = await readJson("release/next-quickstart.json");
const update = await readJson("release/registry-upgrade.json");
const fail = (message) => { throw new Error(`[adoption-evidence] ${message}`); };

for (const [name, proof] of Object.entries({ vite, next, update })) {
  if (proof.status !== "passed" || proof.version !== packageJson.version) {
    fail(`${name} evidence is not passing for ${packageJson.version}`);
  }
  if (proof.humanNoviceTimingClaim !== false) fail(`${name} evidence must not claim independent novice timing`);
}
if (vite.results?.map((entry) => entry.runtime).join("|") !== "React 18|React 19") {
  fail("Vite evidence must cover React 18 and React 19");
}
if (vite.results.some((entry) => entry.elapsedMs >= vite.targetMs || !entry.themeToggle || !entry.semanticOverride)) {
  fail("Vite evidence is missing the timed theme-customization journey");
}
if (next.elapsedMs >= next.targetMs || !next.themeToggle || !next.serverComponentBoundary || !next.globalCssBoundary) {
  fail("Next.js evidence is missing the timed App Router theme-customization journey");
}
if (update.elapsedMs >= update.targetMs || !update.localSourcePreservedDuringReview || !update.explicitOverwriteRequired || !update.acceptedBuild) {
  fail("update evidence is missing non-destructive review and explicit acceptance");
}

const elapsedValues = [...vite.results.map((entry) => entry.elapsedMs), next.elapsedMs, update.elapsedMs];
const value = {
  schemaVersion: 1,
  generatedBy: "scripts/build-adoption-evidence.mjs",
  generatedAt: new Date().toISOString(),
  version: packageJson.version,
  status: "passed",
  targetMs: 10 * 60 * 1000,
  longestAutomatedJourneyMs: Math.max(...elapsedValues),
  journeys: {
    viteReact18: { elapsedMs: vite.results[0].elapsedMs, typecheck: true, productionBuild: true, themeCustomization: true },
    viteReact19: { elapsedMs: vite.results[1].elapsedMs, typecheck: true, productionBuild: true, themeCustomization: true, optionalTailwindBridge: vite.optionalTailwindBridgeVerified },
    nextAppRouter: { version: next.frameworkVersion, elapsedMs: next.elapsedMs, typecheck: true, productionBuild: true, themeCustomization: true, clientBoundary: true },
    reviewedUpdate: { fromVersion: update.fromVersion, elapsedMs: update.elapsedMs, dryRun: true, fileDiff: true, localSourcePreserved: true, explicitAcceptance: true },
  },
  claimBoundary: "Repository-owned automated journeys are under ten minutes. No independent first-time-user timing, external adoption, deployment, or publication is claimed.",
};
const stable = (input) => {
  const { generatedAt: _generatedAt, ...rest } = input;
  return rest;
};
if (checkOnly) {
  const current = await readJson("release/adoption-dx.json").catch(() => null);
  if (!current || JSON.stringify(stable(current)) !== JSON.stringify(stable(value))) {
    fail("generated adoption evidence is stale; run npm run build:adoption");
  }
  console.log(`[adoption-evidence] verified ${packageJson.version}`);
} else {
  await writeFile(jsonPath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  console.log(`[adoption-evidence] wrote ${packageJson.version}`);
}
