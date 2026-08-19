import { access, readFile, readdir } from "node:fs/promises";
import { posix, resolve } from "node:path";
import { gzipSync } from "node:zlib";
import {
  createVersionedArtifactSources,
  dependencyName,
  dependencyVersionsFromLockfile,
  mutableRegistryScope,
  pinnedRegistryScope,
  sha256,
} from "./versioned-registry-contract.mjs";

const root = process.cwd();
const registryPath = resolve(root, "registry.json");
const publicApiPath = resolve(root, "api/generated/public-api.json");
const outputDirectory = resolve(root, "public/r");

const fail = (message) => {
  throw new Error(`[registry] ${message}`);
};

const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const hash = sha256;
const packageName = (specifier) => specifier.startsWith("@")
  ? specifier.split("/").slice(0, 2).join("/")
  : specifier.split("/")[0];
const packageJson = await readJson(resolve(root, "package.json"));
const packageLock = await readJson(resolve(root, "package-lock.json"));
const dependencyVersions = dependencyVersionsFromLockfile(packageLock);
const installerVersion = packageJson.devDependencies?.shadcn;
const registry = await readJson(registryPath);
const publicApi = await readJson(publicApiPath).catch(() => fail("generated public API manifest is missing; run npm run build:api"));
const items = registry.items ?? [];
const names = items.map((item) => item.name);
const uniqueNames = new Set(names);

if (uniqueNames.size !== names.length) fail("item names must be unique");

const components = items.filter((item) => item.type === "registry:ui");
const productComponents = items.filter((item) => item.type === "registry:component");
const installableComponents = [...components, ...productComponents];
if (components.length === 0) fail("registry exposes no public core components");

const apiComponentNames = Object.keys(publicApi.components ?? {}).sort();
const registryComponentNames = components.map((item) => item.name).sort();
if (JSON.stringify(apiComponentNames) !== JSON.stringify(registryComponentNames)) {
  fail("registry components and generated API component modules are out of sync");
}
const apiProductComponentNames = Object.keys(publicApi.productComponents ?? {}).sort();
const registryProductComponentNames = productComponents.map((item) => item.name).sort();
if (JSON.stringify(apiProductComponentNames) !== JSON.stringify(registryProductComponentNames)) {
  fail("registry product components and generated API product modules are out of sync");
}

for (const item of items) {
  if (!item.name || !item.type) fail("every item needs a name and type");
  if (!Array.isArray(item.files) || item.files.length === 0) fail(`${item.name} has no files`);

  for (const file of item.files) {
    await access(resolve(root, file.path)).catch(() => fail(`${item.name} references missing source ${file.path}`));
  }

  for (const dependency of item.registryDependencies ?? []) {
    if (uniqueNames.has(dependency)) {
      fail(`${item.name} uses bare internal dependency ${dependency}; use @whatiuse/${dependency}`);
    }
    if (dependency.startsWith("@whatiuse/") && !uniqueNames.has(dependency.slice("@whatiuse/".length))) {
      fail(`${item.name} references unknown @whatiuse dependency ${dependency}`);
    }
  }

  for (const dependency of item.dependencies ?? []) {
    const separator = dependency.startsWith("@")
      ? dependency.indexOf("@", dependency.indexOf("/") + 1)
      : dependency.indexOf("@");
    if (separator === -1) fail(`${item.name} dependency ${dependency} is not pinned to a tested range`);
  }

  const declaredPackages = new Set((item.dependencies ?? []).map(dependencyName));
  const importedPackages = new Set();
  for (const file of item.files) {
    if (!/\.[cm]?[jt]sx?$/.test(file.path)) continue;
    const source = await readFile(resolve(root, file.path), "utf8");
    for (const match of source.matchAll(/(?:from\s+|import\s*\()["']([^"']+)["']/g)) {
      const specifier = match[1];
      if (!specifier.startsWith(".") && !specifier.startsWith("node:")) importedPackages.add(packageName(specifier));
    }
  }
  for (const importedPackage of importedPackages) {
    if (["react", "react-dom"].includes(importedPackage)) continue;
    if (!declaredPackages.has(importedPackage)) {
      fail(`${item.name} imports ${importedPackage} without declaring a tested dependency range`);
    }
  }
}

// Product components are individually installable. Verify that every local
// source import is represented by an atomic registry dependency so aggregate
// blocks cannot accidentally mask an incomplete standalone install graph.
const atomicOwnerByTarget = new Map();
for (const item of items.filter((candidate) => candidate.type !== "registry:block")) {
  for (const file of item.files) {
    if (file.target && !atomicOwnerByTarget.has(file.target)) atomicOwnerByTarget.set(file.target, item.name);
  }
}
for (const item of productComponents) {
  const declared = new Set(item.registryDependencies ?? []);
  for (const file of item.files) {
    if (!/\.[cm]?[jt]sx?$/.test(file.path)) continue;
    const source = await readFile(resolve(root, file.path), "utf8");
    for (const match of source.matchAll(/(?:from\s+|import\s*\()["'](\.{1,2}\/[^"']+)["']/g)) {
      const base = posix.normalize(posix.join(posix.dirname(file.target), match[1]));
      const candidates = [base, `${base}.ts`, `${base}.tsx`, `${base}.css`, `${base}/index.ts`, `${base}/index.tsx`];
      const owner = candidates.map((candidate) => atomicOwnerByTarget.get(candidate)).find(Boolean);
      if (!owner || owner === item.name) continue;
      const dependency = `@whatiuse/${owner}`;
      if (!declared.has(dependency)) fail(`${item.name} imports ${match[1]} from ${owner} without declaring ${dependency}`);
    }
  }
}

const layerOrder = "@layer whatiuse.tokens, whatiuse.base, whatiuse.components;";
const registryBasePath = resolve(root, "registry/styles/whatiuse-base.css");
const registryBase = await readFile(registryBasePath, "utf8").catch(() => fail("generated base stylesheet is missing"));
if (!registryBase.includes(layerOrder)) fail("base stylesheet does not declare the public cascade order");
if (!registryBase.includes("@layer whatiuse.tokens") || !registryBase.includes("@layer whatiuse.base")) {
  fail("base stylesheet does not separate tokens from global defaults");
}
for (const selector of [".whatiuse-button", ".whatiuse-dialog", ".whatiuse-table", ".whatiuse-shared-detail"]) {
  if (registryBase.includes(selector)) fail(`base stylesheet leaked component selector ${selector}`);
}
if (Buffer.byteLength(registryBase) > 12_000) fail("base stylesheet exceeds the 12 KB source budget");

for (const item of installableComponents) {
  const componentSourcePath = `registry/components/ui/${item.name}.tsx`;
  const componentStylePath = `registry/styles/components/${item.name}.css`;
  const paths = new Set(item.files.map((file) => file.path));
  if (!paths.has(componentSourcePath)) fail(`${item.name} does not ship its generated component wrapper`);
  if (!paths.has(componentStylePath)) fail(`${item.name} does not ship its scoped stylesheet`);

  const wrapper = await readFile(resolve(root, componentSourcePath), "utf8");
  const expectedImports = `"use client";\n\nimport "../../styles/whatiuse-base.css";\nimport "../../styles/components/${item.name}.css";`;
  if (!wrapper.startsWith(expectedImports)) {
    fail(`${item.name} does not declare its client boundary and automatically load the shared contract plus scoped stylesheet`);
  }
  const source = await readFile(resolve(root, `src/components/ui/${item.name}.tsx`), "utf8");
  if (wrapper !== `${expectedImports}\n${source}`) {
    fail(`${item.name} registry wrapper is stale relative to its TypeScript source`);
  }
  const apiEntry = item.type === "registry:ui"
    ? publicApi.components[item.name]
    : publicApi.productComponents[item.name];
  if (item.type === "registry:ui") {
    if (apiEntry.source !== `src/components/ui/${item.name}.tsx`) {
      fail(`${item.name} API manifest points to ${apiEntry.source}`);
    }
    await access(resolve(root, apiEntry.declaration)).catch(() => fail(`${item.name} generated declaration is missing`));
  } else {
    if (!apiEntry || apiEntry.source !== `src/components/ui/${item.name}.tsx`) {
      fail(`${item.name} product API manifest is missing or points to the wrong source`);
    }
    await access(resolve(root, apiEntry.declaration)).catch(() => fail(`${item.name} generated declaration is missing`));
  }

  const componentStyle = await readFile(resolve(root, componentStylePath), "utf8");
  if (componentStyle.includes("@import")) fail(`${item.name} stylesheet contains an unexpected transitive import`);
  if (!componentStyle.includes(layerOrder) || !componentStyle.includes("@layer whatiuse.components")) {
    fail(`${item.name} stylesheet does not respect the public cascade order`);
  }
  for (const documentationSelector of [".system-window", ".live-specimen", ".component-api", ".state-tile", ".foundation-", ".pattern-"]) {
    if (componentStyle.includes(documentationSelector)) fail(`${item.name} stylesheet leaked documentation selector ${documentationSelector}`);
  }
  const stylesheetBudget = item.type === "registry:component" ? 12_288 : 8_192;
  if (Buffer.byteLength(componentStyle) > stylesheetBudget) {
    fail(`${item.name} stylesheet exceeds its ${stylesheetBudget / 1_024} KiB source budget`);
  }
}

const buttonStyle = await readFile(resolve(root, "registry/styles/components/button.css"), "utf8");
for (const unrelatedSelector of [".whatiuse-dialog", ".whatiuse-table", ".whatiuse-shared-detail"]) {
  if (buttonStyle.includes(unrelatedSelector)) fail(`button stylesheet leaked ${unrelatedSelector}`);
}

const completeSystem = items.find((item) => item.name === "whatiuse");
if (!completeSystem) fail("missing whatiuse complete-system item");

const whatiuseData = items.find((item) => item.name === "whatiuse-data");
if (!whatiuseData) fail("missing whatiuse Data product-layer item");
for (const path of [
  "registry/components/patterns/issues-workspace.tsx",
  "registry/components/patterns/data-recipes.tsx",
  "registry/lib/data-view-state.ts",
  "registry/lib/data-export.ts",
  "registry/lib/whatiuse-data-contract.ts",
  "registry/styles/patterns/issues-workspace.css",
  "registry/styles/patterns/data-recipes.css",
]) {
  if (!whatiuseData.files.some((file) => file.path === path)) fail(`whatiuse Data is missing ${path}`);
}
const issuesWorkspaceSource = await readFile(resolve(root, "registry/components/patterns/issues-workspace.tsx"), "utf8");
if (!issuesWorkspaceSource.startsWith('"use client";\n\nimport "../../styles/whatiuse-base.css";\nimport "../../styles/patterns/issues-workspace.css";')) {
  fail("Issues Workspace does not load the shared contract and its scoped pattern stylesheet");
}
if (!issuesWorkspaceSource.includes("export function IssuesWorkspace")) fail("Issues Workspace does not expose its public composition");
const issuesWorkspaceStyle = await readFile(resolve(root, "registry/styles/patterns/issues-workspace.css"), "utf8");
if (!issuesWorkspaceStyle.includes(layerOrder) || !issuesWorkspaceStyle.includes(".pilot-workspace")) {
  fail("Issues Workspace stylesheet is missing its public layer or root selector");
}
for (const documentationSelector of [".system-window", ".live-specimen", ".component-api", ".state-tile", ".public-doc-"]) {
  if (issuesWorkspaceStyle.includes(documentationSelector)) fail(`Issues Workspace stylesheet leaked documentation selector ${documentationSelector}`);
}
if (Buffer.byteLength(issuesWorkspaceStyle) > 20_000) fail("Issues Workspace stylesheet exceeds the 20 KB source budget");

const dataRecipesSource = await readFile(resolve(root, "registry/components/patterns/data-recipes.tsx"), "utf8");
if (!dataRecipesSource.startsWith('"use client";\n\nimport "../../styles/whatiuse-base.css";\nimport "../../styles/patterns/data-recipes.css";')) {
  fail("whatiuse Data recipes do not load the shared contract and scoped pattern stylesheet");
}
for (const recipe of ["CustomerDirectoryRecipe", "AuditLogRecipe"]) {
  if (!dataRecipesSource.includes(`export function ${recipe}`)) fail(`whatiuse Data recipes omit ${recipe}`);
}
const dataRecipesStyle = await readFile(resolve(root, "registry/styles/patterns/data-recipes.css"), "utf8");
if (!dataRecipesStyle.includes(layerOrder) || !dataRecipesStyle.includes(".whatiuse-data-recipe")) {
  fail("whatiuse Data recipe stylesheet is missing its public layer or root selector");
}
for (const documentationSelector of [".system-window", ".live-specimen", ".component-api", ".state-tile", ".public-doc-"]) {
  if (dataRecipesStyle.includes(documentationSelector)) fail(`whatiuse Data recipe stylesheet leaked documentation selector ${documentationSelector}`);
}
if (Buffer.byteLength(dataRecipesStyle) > 12_000) fail("whatiuse Data recipe stylesheet exceeds the 12 KB source budget");

const whatiuseAnalytics = items.find((item) => item.name === "whatiuse-analytics");
if (!whatiuseAnalytics) fail("missing whatiuse Analytics product-layer item");
for (const path of [
  "registry/components/patterns/analytics-recipes.tsx",
  "registry/lib/analytics.ts",
  "registry/lib/whatiuse-analytics-contract.ts",
  "registry/styles/patterns/analytics-recipes.css",
]) {
  if (!whatiuseAnalytics.files.some((file) => file.path === path)) fail(`whatiuse Analytics is missing ${path}`);
}
const analyticsRecipesSource = await readFile(resolve(root, "registry/components/patterns/analytics-recipes.tsx"), "utf8");
if (!analyticsRecipesSource.startsWith('"use client";\n\nimport "../../styles/whatiuse-base.css";\nimport "../../styles/patterns/analytics-recipes.css";')) {
  fail("whatiuse Analytics recipes do not load the shared contract and scoped pattern stylesheet");
}
for (const recipe of ["SaaSOverviewRecipe", "ProductUsageRecipe", "ConversionRetentionRecipe"]) {
  if (!analyticsRecipesSource.includes(`export function ${recipe}`)) fail(`whatiuse Analytics recipes omit ${recipe}`);
}
const analyticsRecipesStyle = await readFile(resolve(root, "registry/styles/patterns/analytics-recipes.css"), "utf8");
if (!analyticsRecipesStyle.includes(layerOrder) || !analyticsRecipesStyle.includes(".whatiuse-analytics-recipe")) {
  fail("whatiuse Analytics recipe stylesheet is missing its public layer or root selector");
}
for (const documentationSelector of [".system-window", ".live-specimen", ".component-api", ".state-tile", ".public-doc-"]) {
  if (analyticsRecipesStyle.includes(documentationSelector)) fail(`whatiuse Analytics recipe stylesheet leaked documentation selector ${documentationSelector}`);
}
if (Buffer.byteLength(analyticsRecipesStyle) > 8_000) fail("whatiuse Analytics recipe stylesheet exceeds the 8 KB source budget");

const whatiuseProductPatterns = items.find((item) => item.name === "whatiuse-product-patterns");
if (!whatiuseProductPatterns) fail("missing whatiuse Product Patterns block");
for (const path of [
  "registry/components/patterns/product-pattern-recipes.tsx",
  "registry/lib/whatiuse-product-patterns-contract.ts",
  "registry/styles/patterns/product-pattern-recipes.css",
]) {
  if (!whatiuseProductPatterns.files.some((file) => file.path === path)) fail(`whatiuse Product Patterns is missing ${path}`);
}
const productPatternRecipesSource = await readFile(resolve(root, "registry/components/patterns/product-pattern-recipes.tsx"), "utf8");
if (!productPatternRecipesSource.startsWith('"use client";\n\nimport "../../styles/whatiuse-base.css";\nimport "../../styles/patterns/product-pattern-recipes.css";')) {
  fail("whatiuse Product Pattern recipes do not load the shared contract and scoped pattern stylesheet");
}
for (const recipe of ["CustomerWorkspaceRecipe", "BillingUsageRecipe", "MembersPermissionsRecipe"]) {
  if (!productPatternRecipesSource.includes(`export function ${recipe}`)) fail(`whatiuse Product Pattern recipes omit ${recipe}`);
}
const productPatternRecipesStyle = await readFile(resolve(root, "registry/styles/patterns/product-pattern-recipes.css"), "utf8");
if (!productPatternRecipesStyle.includes(layerOrder) || !productPatternRecipesStyle.includes(".whatiuse-product-pattern")) {
  fail("whatiuse Product Pattern recipe stylesheet is missing its public layer or root selector");
}
for (const documentationSelector of [".system-window", ".live-specimen", ".component-api", ".state-tile", ".public-doc-"]) {
  if (productPatternRecipesStyle.includes(documentationSelector)) fail(`whatiuse Product Pattern recipe stylesheet leaked documentation selector ${documentationSelector}`);
}
if (Buffer.byteLength(productPatternRecipesStyle) > 12_000) fail("whatiuse Product Pattern recipe stylesheet exceeds the 12 KB source budget");

const whatiuseAgent = items.find((item) => item.name === "whatiuse-agent");
if (!whatiuseAgent) fail("missing whatiuse Agent contract item");
for (const path of ["registry/lib/whatiuse-agent-contract.ts", "registry/agent/whatiuse-agent.json"]) {
  if (!whatiuseAgent.files.some((file) => file.path === path)) fail(`whatiuse Agent is missing ${path}`);
}
for (const dependency of ["@whatiuse/whatiuse-data", "@whatiuse/whatiuse-analytics", "@whatiuse/whatiuse-product-patterns"]) {
  if (!whatiuseAgent.registryDependencies?.includes(dependency)) fail(`whatiuse Agent is missing ${dependency}`);
}
const agentContract = await readJson(resolve(root, "registry/agent/whatiuse-agent.json")).catch(() => fail("whatiuse Agent machine contract is missing or invalid"));
if (agentContract.schemaVersion !== 1 || agentContract.version !== packageJson.version) fail("whatiuse Agent machine contract version is stale");
if (agentContract.recipes?.length !== 9 || agentContract.selectionRules?.length < 12 || agentContract.forbiddenRules?.length < 12) {
  fail("whatiuse Agent machine contract does not expose the required recipe and rule coverage");
}
for (const item of installableComponents) {
  if (item.meta?.whatiuse?.contract !== "/agent/whatiuse-agent.json") fail(`${item.name} does not expose whatiuse agent metadata`);
}

const tailwindBridge = items.find((item) => item.name === "whatiuse-tailwind");
if (!tailwindBridge) fail("missing optional Tailwind bridge item");
const tailwindBridgeSource = await readFile(resolve(root, "registry/styles/whatiuse-tailwind.css"), "utf8")
  .catch(() => fail("generated Tailwind bridge stylesheet is missing"));
for (const contract of ["@theme inline", "--color-background", "--shadow-flyout", "var(--whatiuse-bg-canvas)"]) {
  if (!tailwindBridgeSource.includes(contract)) fail(`Tailwind bridge is missing ${contract}`);
}

const registryStylePath = resolve(root, "src/whatiuse.css");
const registryStyle = await readFile(registryStylePath, "utf8").catch(() => fail("generated registry stylesheet is missing; run npm run build:registry"));
for (const selector of [".whatiuse-button", ".whatiuse-field", ".whatiuse-menu", ".whatiuse-dialog", ".whatiuse-table", ".whatiuse-shared-detail"]) {
  if (!registryStyle.includes(selector)) fail(`registry stylesheet is missing ${selector}`);
}
for (const token of ["--whatiuse-bg-flyout", "--whatiuse-bg-modal", "--whatiuse-shadow-flyout", "--whatiuse-shadow-modal", "--whatiuse-layer-flyout", "--whatiuse-layer-modal", "--whatiuse-layer-toast"]) {
  if (!registryStyle.includes(token)) fail(`registry stylesheet is missing layer token ${token}`);
}
for (const [path, layer] of [
  ["src/components/ui/select.tsx", "flyout"],
  ["src/components/ui/combobox.tsx", "flyout"],
  ["src/components/ui/context-switcher.tsx", "flyout"],
  ["src/components/ui/menu.tsx", "flyout"],
  ["src/components/ui/popover.tsx", "flyout"],
  ["src/components/ui/dialog.tsx", "modal"],
  ["src/components/ui/alert-dialog.tsx", "modal"],
]) {
  const source = await readFile(resolve(root, path), "utf8");
  if (!source.includes(`data-layer="${layer}"`)) fail(`${path} does not declare the ${layer} layer`);
}
const toastSource = await readFile(resolve(root, "src/components/ui/toast.tsx"), "utf8");
if (!/className=(?:"whatiuse-toaster"|\{[^}]*["']whatiuse-toaster["'][^}]*\})/s.test(toastSource)) fail("toast does not declare the toaster layer class");
for (const documentationSelector of [".system-window", ".live-specimen", ".component-api", ".state-tile"]) {
  if (registryStyle.includes(documentationSelector)) fail(`registry stylesheet leaked documentation selector ${documentationSelector}`);
}
// The longer `whatiuse` selector and token namespace adds source bytes without a
// comparable transfer-cost increase. Keep the same practical headroom while the
// stricter gzip budget below remains unchanged.
if (Buffer.byteLength(registryStyle) > 190_000) fail("Core plus Data plus Analytics registry stylesheet exceeds the 190 KB source budget");
if (gzipSync(registryStyle).byteLength > 23_000) fail("registry stylesheet exceeds the 23 KB gzip budget");

const completePaths = new Set(completeSystem.files.map((file) => file.path));
const requiredCompletePaths = new Set([
  ...items.find((item) => item.name === "whatiuse-base").files.map((file) => file.path),
  ...installableComponents.flatMap((item) => item.files.map((file) => file.path)),
  "registry/lib/data-view-state.ts",
  "registry/lib/data-export.ts",
  "registry/lib/whatiuse-data-contract.ts",
  "registry/lib/analytics.ts",
  "registry/lib/whatiuse-analytics-contract.ts",
  "registry/lib/whatiuse-product-patterns-contract.ts",
  "registry/lib/whatiuse-agent-contract.ts",
  "registry/agent/whatiuse-agent.json",
  "registry/styles/whatiuse.css",
  "registry/components/ui/index.ts",
]);

const missingFromCompleteSystem = [...requiredCompletePaths].filter((path) => !completePaths.has(path));
if (missingFromCompleteSystem.length > 0) {
  fail(`complete-system item is missing: ${missingFromCompleteSystem.join(", ")}`);
}

await access(resolve(outputDirectory, "registry.json")).catch(() => fail("generated registry index is missing; run npm run build:registry"));

for (const item of items) {
  const outputPath = resolve(outputDirectory, `${item.name}.json`);
  const generated = await readJson(outputPath).catch(() => fail(`generated item ${item.name}.json is missing or invalid`));
  if (generated.name !== item.name) fail(`${item.name}.json has the wrong item name`);
  if (!Array.isArray(generated.files) || generated.files.length !== item.files.length) {
    fail(`${item.name}.json does not contain every declared file`);
  }
  for (const file of generated.files) {
    if (typeof file.content !== "string" || file.content.length === 0) {
      fail(`${item.name}.json has empty generated content for ${file.path}`);
    }
  }
}

const releaseManifestPath = resolve(outputDirectory, "manifest.json");
const releaseManifestSource = await readFile(releaseManifestPath, "utf8").catch(() => fail("registry integrity manifest is missing; run npm run build:registry"));
const releaseManifest = JSON.parse(releaseManifestSource);
if (releaseManifest.version !== packageJson.version) fail("registry integrity manifest version is stale");
if (releaseManifest.catalog?.componentCount !== components.length || releaseManifest.catalog?.itemCount !== items.length) {
  fail("registry integrity manifest catalog counts are stale");
}
for (const item of items) {
  const path = resolve(outputDirectory, `${item.name}.json`);
  const source = await readFile(path, "utf8");
  if (releaseManifest.artifacts?.[item.name]?.sha256 !== hash(source)) fail(`${item.name} artifact digest is stale`);
}

const versionedDirectory = resolve(outputDirectory, "v", releaseManifest.version);
const versionedRelease = await readJson(resolve(versionedDirectory, "release.json")).catch(() => fail("versioned registry release manifest is missing; run npm run build:registry"));
if (versionedRelease.version !== releaseManifest.version || versionedRelease.immutable !== true) {
  fail("versioned registry release does not declare the current immutable version");
}
if (versionedRelease.cacheControl !== "public, max-age=31536000, immutable") {
  fail("versioned registry release does not declare the immutable cache contract");
}
if (versionedRelease.schemaVersion !== 3 || versionedRelease.registryScope !== pinnedRegistryScope) {
  fail("versioned registry release does not declare the pinned dependency scope");
}
if (
  versionedRelease.dependencyPolicy !== "same-version-internal-and-exact-external"
  || versionedRelease.installer !== `shadcn@${installerVersion}`
) fail("versioned registry release does not declare its exact installer and dependency policy");
const versionedArtifacts = (await readdir(versionedDirectory)).filter((name) => name.endsWith(".json") && name !== "release.json").sort();
const mutableArtifacts = (await readdir(outputDirectory, { withFileTypes: true })).filter((entry) => entry.isFile() && entry.name.endsWith(".json")).map((entry) => entry.name).sort();
if (JSON.stringify(versionedArtifacts) !== JSON.stringify(mutableArtifacts)) {
  fail("versioned registry artifact set differs from the mutable release artifact set");
}

const mutableSources = new Map();
for (const name of mutableArtifacts) mutableSources.set(name, await readFile(resolve(outputDirectory, name), "utf8"));
const expectedVersionedSources = createVersionedArtifactSources(mutableSources, { dependencyVersions, installerVersion });
for (const name of mutableArtifacts) {
  const versionedSource = await readFile(resolve(versionedDirectory, name), "utf8");
  if (versionedSource !== expectedVersionedSources.get(name)) fail(`versioned ${name} does not match the pinned release contract`);
  if (versionedRelease.artifacts?.[name]?.sha256 !== hash(versionedSource)) fail(`versioned ${name} digest is stale`);
}

const versionedRegistry = await readJson(resolve(versionedDirectory, "registry.json"));
for (const item of versionedRegistry.items ?? []) {
  for (const dependency of item.dependencies ?? []) {
    const name = dependencyName(dependency);
    if (dependency !== `${name}@${dependencyVersions.get(name)}`) {
      fail(`${item.name} dependency ${dependency} is not pinned to package-lock.json`);
    }
  }
  for (const dependency of item.registryDependencies ?? []) {
    if (mutableRegistryScope !== pinnedRegistryScope && dependency.startsWith(`${mutableRegistryScope}/`)) {
      fail(`${item.name} leaks mutable dependency ${dependency} into the pinned release`);
    }
    if (dependency.startsWith(`${pinnedRegistryScope}/`) && !uniqueNames.has(dependency.slice(`${pinnedRegistryScope}/`.length))) {
      fail(`${item.name} references unknown pinned dependency ${dependency}`);
    }
  }
}

const versionedManifestSource = await readFile(resolve(versionedDirectory, "manifest.json"), "utf8");
const versionedManifest = JSON.parse(versionedManifestSource);
if (versionedManifest.distribution?.immutableRegistry?.registryScope !== pinnedRegistryScope) {
  fail("versioned integrity manifest does not declare the pinned registry scope");
}
if (
  versionedManifest.distribution?.immutableRegistry?.dependencyPolicy !== "same-version-internal-and-exact-external"
  || versionedManifest.distribution?.immutableRegistry?.installer !== `shadcn@${installerVersion}`
) fail("versioned integrity manifest does not declare exact external resolution");
if (versionedManifest.sources?.registry?.sha256 !== releaseManifest.sources?.registry?.sha256) {
  fail("versioned integrity manifest no longer identifies the authored registry source");
}
if (
  versionedManifest.versionedFrom?.mutableManifestSha256 !== hash(releaseManifestSource)
  || versionedManifest.versionedFrom?.dependencyScopeRewrite !== `${mutableRegistryScope}/* -> ${pinnedRegistryScope}/*`
  || versionedManifest.versionedFrom?.installer !== `shadcn@${installerVersion}`
) {
  fail("versioned integrity manifest does not identify its mutable source and dependency rewrite");
}
for (const item of items) {
  const source = await readFile(resolve(versionedDirectory, `${item.name}.json`), "utf8");
  const artifact = versionedManifest.artifacts?.[item.name];
  if (artifact?.sha256 !== hash(source) || artifact?.path !== `public/r/v/${releaseManifest.version}/${item.name}.json`) {
    fail(`${item.name} versioned manifest evidence is stale`);
  }
}
if (versionedRelease.sourceManifestSha256 !== hash(releaseManifestSource)) {
  fail("versioned release does not identify the mutable source manifest");
}
if (versionedRelease.versionedManifestSha256 !== hash(versionedManifestSource)) {
  fail("versioned release does not identify its pinned integrity manifest");
}

console.log(`[registry] verified ${components.length} components, ${items.length} items, the complete-system artifact, and immutable ${releaseManifest.version}`);
