import { execFile } from "node:child_process";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { promisify } from "node:util";

const exec = promisify(execFile);
const root = process.cwd();
const checkOnly = process.argv.includes("--check");
const jsonOutput = resolve(root, "release/evidence.json");
const npx = process.platform === "win32" ? "npx.cmd" : "npx";

const fail = (message) => {
  throw new Error(`[evidence] ${message}`);
};

const read = (path) => readFile(resolve(root, path), "utf8");
const readJson = async (path) => JSON.parse(await read(path));

function count(source, pattern) {
  return [...source.matchAll(pattern)].length;
}

async function listPngFiles(path) {
  const directory = resolve(root, path);
  const entries = await readdir(directory, { recursive: true, withFileTypes: true }).catch(() => []);
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".png"))
    .map((entry) => resolve(entry.parentPath, entry.name));
}

function platformFromSnapshot(path) {
  return path.match(/-(darwin|linux)\.png$/)?.[1] ?? null;
}

function countPlatform(files, platform) {
  return files.filter((path) => platformFromSnapshot(path) === platform).length;
}

function stableEvidence(value) {
  const { generatedAt: _generatedAt, ...stable } = value;
  return stable;
}

function verifyClaim(source, path, claim) {
  if (!source.includes(claim)) fail(`${path} is missing the generated claim: ${claim}`);
}

const [
  packageJson,
  registry,
  publicApi,
  tokenManifest,
  performance,
  browserMatrix,
  quickstart,
  adoptionDx,
  packageContract,
  analyticsInstall,
  productPatternsInstall,
  accessibility,
  runtimePerformance,
  routeSource,
  storySource,
  analyticsStorySource,
  productPatternStorySource,
  playwrightSource,
] = await Promise.all([
  readJson("package.json"),
  readJson("registry.json"),
  readJson("api/generated/public-api.json"),
  readJson("tokens/generated/token-manifest.json"),
  readJson("performance-report.json"),
  readJson("release/browser-matrix.json"),
  readJson("release/quickstart.json"),
  readJson("release/adoption-dx.json"),
  readJson("release/package-contract.json"),
  readJson("release/whatiuse-analytics-install.json"),
  readJson("release/whatiuse-product-patterns-install.json"),
  readJson("release/accessibility.json"),
  readJson("release/runtime-performance.json"),
  read("tests/browser/public-routes.ts"),
  read("tests/storybook/visual-regression.spec.ts"),
  read("tests/storybook/analytics-visual.spec.ts"),
  read("tests/storybook/product-patterns-visual.spec.ts"),
  read("playwright.config.ts"),
]);

const componentCount = registry.items.filter((item) => item.type === "registry:ui").length;
const productComponentCount = registry.items.filter((item) => item.type === "registry:component").length;
const registryItemCount = registry.items.length;
const documentationRouteCount = count(routeSource, /^\s*\["[^"]+",\s*"[^"]+",\s*"docs"\],?$/gm);
const foundationRouteCount = count(routeSource, /^\s*\["[^"]+",\s*"[^"]+",\s*"foundations"\],?$/gm);
const patternRouteCount = count(routeSource, /^\s*\["[^"]+",\s*"[^"]+",\s*"patterns"\],?$/gm);
const documentationShellRouteCount = documentationRouteCount + foundationRouteCount + patternRouteCount + componentCount;
const landingRouteCount = 1;
const publicRouteCount = documentationShellRouteCount + landingRouteCount;
const storyComponentCount = count(storySource, /^\s*\["components-[^"]+",\s*"[^"]+"\],?$/gm);
const analyticsStoryCount = count(analyticsStorySource, /^\s*\["product-analytics--[^"]+",\s*"[^"]+"\],?$/gm);
const productPatternStoryCount = count(productPatternStorySource, /^\s*\["product-patterns--[^"]+",\s*"[^"]+"\],?$/gm);
const browserProjectNames = [...playwrightSource.matchAll(/\{\s*name:\s*"([^"]+)"/g)].map((match) => match[1]);

if (componentCount !== publicApi.componentCount) fail(`registry/API component drift: ${componentCount} versus ${publicApi.componentCount}`);
if (componentCount !== storyComponentCount) fail(`registry/Storybook component drift: ${componentCount} versus ${storyComponentCount}`);
if (documentationShellRouteCount !== 69) fail(`documentation shell must expose 69 routes; found ${documentationShellRouteCount}`);
if (publicRouteCount !== 70) fail(`public site must expose 70 routes including the landing page; found ${publicRouteCount}`);
if (new Set(browserProjectNames).size !== browserProjectNames.length || browserProjectNames.length !== 5) {
  fail(`browser matrix must expose five unique projects; found ${browserProjectNames.join(", ") || "none"}`);
}
if (browserMatrix.status !== "passed" || browserMatrix.failed !== 0) {
  fail(`latest browser matrix is not passing: ${browserMatrix.status}, ${browserMatrix.failed} failed`);
}
if (browserMatrix.releaseVersion !== packageJson.version) {
  fail(`latest browser matrix belongs to ${browserMatrix.releaseVersion}, not ${packageJson.version}`);
}
if (browserMatrix.total !== browserMatrix.passed + browserMatrix.skipped + browserMatrix.failed + browserMatrix.flaky) {
  fail("latest browser matrix counts do not add up");
}
if (browserMatrix.projects.join("|") !== browserProjectNames.join("|")) {
  fail("latest browser matrix project list drifted from playwright.config.ts");
}
if (quickstart.status !== "passed" || quickstart.version !== packageJson.version) {
  fail(`latest quickstart evidence is not passing for ${packageJson.version}`);
}
if (!quickstart.verifiedFiles?.includes("src/components/ui/button.tsx") || quickstart.results?.length !== 2 || quickstart.results.some((entry) => !entry.elapsedMs)) {
  fail("latest quickstart evidence is missing the Button install or React 18/19 elapsed-time observations");
}
if (adoptionDx.status !== "passed" || adoptionDx.version !== packageJson.version || adoptionDx.longestAutomatedJourneyMs >= adoptionDx.targetMs) {
  fail(`latest adoption evidence is not passing under the ten-minute automated target for ${packageJson.version}`);
}
if (packageContract.status !== "passed" || packageContract.version !== packageJson.version) {
  fail(`latest package contract is not passing for ${packageJson.version}`);
}
if (packageContract.clientBoundary !== "use client" || packageContract.hydrationRecoverableErrors !== 0 || packageContract.runtimeExports < 100 || packageContract.runtimeApiMatchesCompiler !== true || packageContract.declaredExports !== publicApi.exportCount) {
  fail("latest package contract is missing the client boundary, runtime API, or clean hydration proof");
}
if (analyticsInstall.status !== "passed" || analyticsInstall.version !== packageJson.version || analyticsInstall.item !== "whatiuse-analytics") {
  fail(`latest whatiuse Analytics install evidence is not passing for ${packageJson.version}`);
}
if (analyticsInstall.externalChartRuntime !== false || analyticsInstall.semanticDataTable !== true || analyticsInstall.recipes?.length !== 3) {
  fail("latest whatiuse Analytics install evidence is missing its dependency and semantic-table boundary");
}
if (productPatternsInstall.status !== "passed" || productPatternsInstall.version !== packageJson.version || productPatternsInstall.item !== "whatiuse-product-patterns") {
  fail(`latest whatiuse Product Patterns install evidence is not passing for ${packageJson.version}`);
}
if (productPatternsInstall.recipes?.length !== 3 || productPatternsInstall.verifiedFiles?.length < 7) {
  fail("latest whatiuse Product Patterns install evidence is missing its three recipes or representative dependency proof");
}
if (accessibility.status !== "passed" || accessibility.releaseVersion !== packageJson.version || accessibility.failed !== 0 || accessibility.flaky !== 0) {
  fail(`latest accessibility evidence is not passing for ${packageJson.version}`);
}
if (accessibility.routes?.public !== publicRouteCount || accessibility.projects?.join("|") !== browserProjectNames.join("|")) {
  fail("latest accessibility evidence drifted from the public route or browser project matrix");
}
if (Object.values(accessibility.contracts ?? {}).some((contract) => contract.status !== "passed")) {
  fail("latest accessibility evidence contains an unverified required contract");
}
if (performance.schemaVersion !== 2) fail("bundle performance report does not use the route-aware schema");
const bundleAssertions = [
  [performance.totals.initialJsGzipBytes, performance.budgets.initialJsGzipBytes],
  [performance.totals.initialCriticalGzipBytes, performance.budgets.initialCriticalGzipBytes],
  [performance.routes.documentationShell.jsGzipBytes, performance.budgets.documentationShellJsGzipBytes],
  [performance.routes.publicDocumentation.jsGzipBytes, performance.budgets.publicDocumentationJsGzipBytes],
  [performance.routes.dataRecipes.jsGzipBytes, performance.budgets.dataRecipesJsGzipBytes],
  [performance.routes.analyticsRecipes.jsGzipBytes, performance.budgets.analyticsRecipesJsGzipBytes],
  [performance.routes.productPatterns.jsGzipBytes, performance.budgets.productPatternsJsGzipBytes],
  [performance.totals.largestComponentRouteJsGzipBytes, performance.budgets.largestComponentRouteJsGzipBytes],
  [performance.totals.largestJavaScriptRawBytes, performance.budgets.largestJavaScriptRawBytes],
  [performance.totals.largestJavaScriptGzipBytes, performance.budgets.largestJavaScriptGzipBytes],
  [performance.totals.totalJsGzipBytes, performance.budgets.totalJsGzipBytes],
  [performance.totals.initialCssGzipBytes, performance.budgets.initialCssGzipBytes],
  [performance.totals.totalCssGzipBytes, performance.budgets.totalCssGzipBytes],
];
if (bundleAssertions.some(([actual, budget]) => !Number.isFinite(actual) || actual > budget)) fail("bundle performance evidence exceeds a release budget");
if (runtimePerformance.status !== "passed" || runtimePerformance.releaseVersion !== packageJson.version || runtimePerformance.mode !== "local-production-preview") {
  fail(`latest runtime performance evidence is not passing for ${packageJson.version}`);
}

// Keep discovery single-worker. The public component catalog imports a broad
// icon surface, and parallel discovery can exhaust macOS' system-wide file
// table even when the per-process descriptor limit is high.
const vitest = await exec(npx, ["vitest", "list", "--json", "--maxWorkers=1"], {
  cwd: root,
  maxBuffer: 16 * 1024 * 1024,
});
const sourceTests = JSON.parse(vitest.stdout);

const [routeSnapshots, storySnapshots, analyticsSnapshots, productPatternSnapshots, supportingSnapshots] = await Promise.all([
  listPngFiles("tests/browser/full-catalog-visual.spec.ts-snapshots"),
  listPngFiles("tests/storybook/visual-regression.spec.ts-snapshots"),
  listPngFiles("tests/storybook/analytics-visual.spec.ts-snapshots"),
  listPngFiles("tests/storybook/product-patterns-visual.spec.ts-snapshots"),
  listPngFiles("tests/browser/visual-regression.spec.ts-snapshots"),
]);
const snapshotPlatforms = [...new Set([...routeSnapshots, ...storySnapshots, ...analyticsSnapshots, ...productPatternSnapshots].map(platformFromSnapshot).filter(Boolean))].sort();
const expectedShellSnapshots = documentationShellRouteCount * 2;
const expectedLandingSnapshots = landingRouteCount * 2;
const expectedStorySnapshots = componentCount * 4;
const expectedAnalyticsSnapshots = analyticsStoryCount * 2;
const expectedProductPatternSnapshots = productPatternStoryCount * 2;
const expectedReleaseBaselines = publicRouteCount * 2 + expectedStorySnapshots + expectedAnalyticsSnapshots + expectedProductPatternSnapshots;

const platforms = [];
const incompletePlatformBaselines = [];
for (const platform of snapshotPlatforms) {
  const shellCount = countPlatform(routeSnapshots, platform);
  const landingCount = supportingSnapshots.filter((path) => platformFromSnapshot(path) === platform && /landing-(light|dark)-/.test(path)).length;
  const storyCount = countPlatform(storySnapshots, platform);
  const analyticsCount = countPlatform(analyticsSnapshots, platform);
  const productPatternCount = countPlatform(productPatternSnapshots, platform);
  const coverage = { platform, shellCount, landingCount, storyCount, analyticsCount, productPatternCount };
  if (shellCount === expectedShellSnapshots && landingCount === expectedLandingSnapshots && storyCount === expectedStorySnapshots && analyticsCount === expectedAnalyticsSnapshots && productPatternCount === expectedProductPatternSnapshots) {
    platforms.push(platform);
  } else {
    incompletePlatformBaselines.push(coverage);
  }
}
const currentSnapshotPlatform = process.platform === "darwin" ? "darwin" : process.platform === "linux" ? "linux" : null;
if (!currentSnapshotPlatform || !platforms.includes(currentSnapshotPlatform)) {
  fail(`current ${currentSnapshotPlatform ?? process.platform} visual baseline is incomplete`);
}

const evidence = {
  schemaVersion: 1,
  generatedBy: "scripts/build-evidence.mjs",
  generatedAt: new Date().toISOString(),
  release: {
    name: packageJson.name,
    version: packageJson.version,
    status: packageJson.version.includes("-") ? "pre-release" : "stable",
    npmPublished: false,
    publicationLocked: packageJson.private === true,
  },
  catalog: {
    components: componentCount,
    productComponents: productComponentCount,
    registryItems: registryItemCount,
    publicExports: publicApi.exportCount,
    semanticTokens: tokenManifest.tokens.length,
  },
  routes: {
    total: publicRouteCount,
    landing: landingRouteCount,
    documentation: documentationRouteCount,
    foundations: foundationRouteCount,
    components: componentCount,
    patterns: patternRouteCount,
  },
  automation: {
    sourceTests: sourceTests.length,
    storybookContractRuns: componentCount * 2 + analyticsStoryCount * 2 + productPatternStoryCount * 2,
    browserProjects: browserProjectNames,
    browserMatrix: {
      generatedAt: browserMatrix.generatedAt,
      status: browserMatrix.status,
      passed: browserMatrix.passed,
      skipped: browserMatrix.skipped,
      failed: browserMatrix.failed,
      flaky: browserMatrix.flaky,
    },
    quickstart: {
      generatedAt: quickstart.generatedAt,
      status: quickstart.status,
      elapsedMs: Math.max(...quickstart.results.map((entry) => entry.elapsedMs)),
      fixture: quickstart.fixture,
      optionalTailwindBridgeVerified: quickstart.optionalTailwindBridgeVerified,
    },
    adoptionDx: {
      generatedAt: adoptionDx.generatedAt,
      status: adoptionDx.status,
      targetMs: adoptionDx.targetMs,
      longestAutomatedJourneyMs: adoptionDx.longestAutomatedJourneyMs,
      journeys: Object.keys(adoptionDx.journeys),
    },
    packageContract: {
      generatedAt: packageContract.generatedAt,
      status: packageContract.status,
      fixture: packageContract.fixture,
      clientBoundary: packageContract.clientBoundary,
      declaredExports: packageContract.declaredExports,
      runtimeExports: packageContract.runtimeExports,
      runtimeApiMatchesCompiler: packageContract.runtimeApiMatchesCompiler,
      ssrMarkupBytes: packageContract.ssrMarkupBytes,
      hydrationRecoverableErrors: packageContract.hydrationRecoverableErrors,
    },
    analyticsInstall: {
      generatedAt: analyticsInstall.generatedAt,
      status: analyticsInstall.status,
      fixture: analyticsInstall.fixture,
      recipes: analyticsInstall.recipes,
      components: analyticsInstall.components,
      elapsedMs: analyticsInstall.elapsedMs,
      externalChartRuntime: analyticsInstall.externalChartRuntime,
      semanticDataTable: analyticsInstall.semanticDataTable,
    },
    productPatternsInstall: {
      generatedAt: productPatternsInstall.generatedAt,
      status: productPatternsInstall.status,
      fixture: productPatternsInstall.fixture,
      recipes: productPatternsInstall.recipes,
      verifiedFiles: productPatternsInstall.verifiedFiles,
      elapsedMs: productPatternsInstall.elapsedMs,
    },
    accessibility: {
      generatedAt: accessibility.generatedAt,
      status: accessibility.status,
      passed: accessibility.passed,
      skipped: accessibility.skipped,
      failed: accessibility.failed,
      flaky: accessibility.flaky,
      contracts: Object.keys(accessibility.contracts).length,
      publicRoutes: accessibility.routes.public,
    },
    runtimePerformance: {
      generatedAt: runtimePerformance.generatedAt,
      status: runtimePerformance.status,
      mode: runtimePerformance.mode,
      landingLcpMs: runtimePerformance.measurements.landing.lcpMs,
      documentationLcpMs: runtimePerformance.measurements.documentation.lcpMs,
      maximumCls: Math.max(runtimePerformance.measurements.landing.cls, runtimePerformance.measurements.documentation.cls),
      documentationTransitionMs: runtimePerformance.measurements.documentationTransitionMs,
      sharedDetailSelectionMs: runtimePerformance.measurements.interactions.sharedDetailSelectionMs,
      dialogOpenMs: runtimePerformance.measurements.interactions.dialogOpenMs,
    },
  },
  visuals: {
    platforms,
    incompletePlatformBaselines,
    publicRouteSnapshotsPerPlatform: publicRouteCount * 2,
    componentProductSnapshotsPerPlatform: componentCount * 2,
    componentStateSnapshotsPerPlatform: componentCount * 2,
    analyticsRecipeSnapshotsPerPlatform: expectedAnalyticsSnapshots,
    productPatternSnapshotsPerPlatform: expectedProductPatternSnapshots,
    releaseBaselinesPerPlatform: expectedReleaseBaselines,
  },
  performance: { bundle: performance, runtime: runtimePerformance },
  externalGates: [
    ...(incompletePlatformBaselines.length ? ["complete-platform-specific-visual-baselines"] : []),
    "windows-edge-and-high-contrast",
    "physical-ios-and-android",
    "macos-increase-contrast-and-reduce-transparency",
    "human-rtl-and-verbose-translation-review",
    "independent-adoption-and-accessibility-review",
    "npm-publication-and-trusted-publisher-activation",
  ],
};

const expectedJson = `${JSON.stringify(evidence, null, 2)}\n`;

const docClaims = {
  "README.md": [
    `https://whatiuse.minwookshin.com/r/v/${evidence.release.version}/{name}.json`,
  ],
};

if (checkOnly) {
  const currentJsonSource = await readFile(jsonOutput, "utf8").catch(() => null);
  if (!currentJsonSource) fail(`${relative(root, jsonOutput)} is missing; run npm run build:evidence`);
  const currentJson = JSON.parse(currentJsonSource);
  if (JSON.stringify(stableEvidence(currentJson)) !== JSON.stringify(stableEvidence(evidence))) {
    fail(`${relative(root, jsonOutput)} is stale; run npm run build:evidence`);
  }
  for (const [path, claims] of Object.entries(docClaims)) {
    const source = await read(path);
    for (const claim of claims) verifyClaim(source, path, claim);
  }
} else {
  await mkdir(dirname(jsonOutput), { recursive: true });
  await writeFile(jsonOutput, expectedJson, "utf8");
}

console.log(`[evidence] ${checkOnly ? "verified" : "generated"} ${evidence.catalog.components} components, ${evidence.routes.total} routes, ${evidence.automation.sourceTests} tests, and ${evidence.visuals.releaseBaselinesPerPlatform} visual baselines per platform`);
