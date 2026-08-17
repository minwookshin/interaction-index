import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const [packageJson, evidence, playwrightSource] = await Promise.all([
  readFile(resolve(root, "package.json"), "utf8").then(JSON.parse),
  readFile(resolve(root, "release/accessibility.json"), "utf8").then(JSON.parse),
  readFile(resolve(root, "playwright.config.ts"), "utf8"),
]);
const configuredProjects = [...playwrightSource.matchAll(/\{\s*name:\s*"([^"]+)"/g)].map((match) => match[1]);
const contracts = Object.values(evidence.contracts ?? {});

if (evidence.releaseVersion !== packageJson.version) throw new Error(`[accessibility-evidence] expected ${packageJson.version}, received ${evidence.releaseVersion}`);
if (evidence.status !== "passed" || evidence.failed !== 0 || evidence.flaky !== 0) throw new Error("[accessibility-evidence] the latest matrix is not clean");
if (
  evidence.routes?.public !== 69
  || evidence.routes?.landing !== 1
  || evidence.routes?.documentation !== 13
  || evidence.routes?.foundations !== 5
  || evidence.routes?.components !== 45
  || evidence.routes?.patterns !== 5
) throw new Error("[accessibility-evidence] the recorded public route catalog drifted");
if (evidence.projects?.join("|") !== configuredProjects.join("|")) throw new Error("[accessibility-evidence] the recorded browser projects drifted");
if (contracts.length !== 10 || contracts.some((contract) => contract.status !== "passed")) throw new Error("[accessibility-evidence] a required contract is missing or failed");
if (evidence.total !== evidence.passed + evidence.skipped + evidence.failed + evidence.flaky) throw new Error("[accessibility-evidence] outcome counts do not add up");

console.log(`[accessibility-evidence] verified ${evidence.passed} passing checks, ${evidence.skipped} intentional skips, and ${contracts.length} required contracts for ${evidence.releaseVersion}`);
