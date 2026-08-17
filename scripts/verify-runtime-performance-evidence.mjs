import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const packageJson = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
const evidence = JSON.parse(await readFile(resolve(root, "release/runtime-performance.json"), "utf8"));

if (evidence.schemaVersion !== 1) throw new Error("[runtime-performance] unsupported evidence schema");
if (evidence.releaseVersion !== packageJson.version) throw new Error(`[runtime-performance] evidence belongs to ${evidence.releaseVersion}, not ${packageJson.version}`);
if (evidence.status !== "passed" || evidence.mode !== "local-production-preview") throw new Error("[runtime-performance] latest local production-preview run is not passing");
if (evidence.viewport?.width !== 1280 || evidence.viewport?.height !== 720 || evidence.reducedMotion !== true) throw new Error("[runtime-performance] viewport or reduced-motion contract drifted");

const { budgets, measurements } = evidence;
const assertions = [
  [measurements.landing.fcpMs, budgets.landingFcpMs, "landing FCP"],
  [measurements.landing.lcpMs, budgets.landingLcpMs, "landing LCP"],
  [measurements.documentation.fcpMs, budgets.documentationFcpMs, "documentation FCP"],
  [measurements.documentation.lcpMs, budgets.documentationLcpMs, "documentation LCP"],
  [measurements.landing.cls, budgets.cls, "landing CLS"],
  [measurements.documentation.cls, budgets.cls, "documentation CLS"],
  [measurements.landing.longestTaskMs, budgets.longestTaskMs, "landing longest task"],
  [measurements.documentation.longestTaskMs, budgets.longestTaskMs, "documentation longest task"],
  [measurements.documentationTransitionMs, budgets.documentationTransitionMs, "documentation transition"],
  [measurements.interactions.sharedDetailSelectionMs, budgets.sharedDetailSelectionMs, "Shared Detail selection"],
  [measurements.interactions.dialogOpenMs, budgets.dialogOpenMs, "Dialog open"],
];
for (const [actual, budget, label] of assertions) {
  if (!Number.isFinite(actual) || actual > budget) throw new Error(`[runtime-performance] ${label} is outside the recorded budget: ${actual} > ${budget}`);
}
if (!Array.isArray(evidence.externalGates) || evidence.externalGates.length < 3) throw new Error("[runtime-performance] field and real-device gates are not explicit");

console.log(`[runtime-performance] verified passing ${evidence.releaseVersion} local production-preview evidence from ${evidence.generatedAt}`);
