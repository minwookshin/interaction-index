import { access, readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { gzipSync } from "node:zlib";
import { createVersionedArtifactSources, mutableRegistryScope, pinnedRegistryScope, sha256 } from "./versioned-registry-contract.mjs";

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
const dependencyName = (dependency) => {
  const separator = dependency.startsWith("@")
    ? dependency.indexOf("@", dependency.indexOf("/") + 1)
    : dependency.indexOf("@");
  return separator === -1 ? dependency : dependency.slice(0, separator);
};
const registry = await readJson(registryPath);
const publicApi = await readJson(publicApiPath).catch(() => fail("generated public API manifest is missing; run npm run build:api"));
const items = registry.items ?? [];
const names = items.map((item) => item.name);
const uniqueNames = new Set(names);

if (uniqueNames.size !== names.length) fail("item names must be unique");

const components = items.filter((item) => item.type === "registry:ui");
if (components.length === 0) fail("registry exposes no public components");

const apiComponentNames = Object.keys(publicApi.components ?? {}).sort();
const registryComponentNames = components.map((item) => item.name).sort();
if (JSON.stringify(apiComponentNames) !== JSON.stringify(registryComponentNames)) {
  fail("registry components and generated API component modules are out of sync");
}

for (const item of items) {
  if (!item.name || !item.type) fail("every item needs a name and type");
  if (!Array.isArray(item.files) || item.files.length === 0) fail(`${item.name} has no files`);

  for (const file of item.files) {
    await access(resolve(root, file.path)).catch(() => fail(`${item.name} references missing source ${file.path}`));
  }

  for (const dependency of item.registryDependencies ?? []) {
    if (uniqueNames.has(dependency)) {
      fail(`${item.name} uses bare internal dependency ${dependency}; use @teum/${dependency}`);
    }
    if (dependency.startsWith("@teum/") && !uniqueNames.has(dependency.slice("@teum/".length))) {
      fail(`${item.name} references unknown @teum dependency ${dependency}`);
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

const layerOrder = "@layer teum.tokens, teum.base, teum.components;";
const registryBasePath = resolve(root, "registry/styles/teum-base.css");
const registryBase = await readFile(registryBasePath, "utf8").catch(() => fail("generated base stylesheet is missing"));
if (!registryBase.includes(layerOrder)) fail("base stylesheet does not declare the public cascade order");
if (!registryBase.includes("@layer teum.tokens") || !registryBase.includes("@layer teum.base")) {
  fail("base stylesheet does not separate tokens from global defaults");
}
for (const selector of [".teum-button", ".teum-dialog", ".teum-table", ".teum-shared-detail"]) {
  if (registryBase.includes(selector)) fail(`base stylesheet leaked component selector ${selector}`);
}
if (Buffer.byteLength(registryBase) > 12_000) fail("base stylesheet exceeds the 12 KB source budget");

for (const item of components) {
  const componentSourcePath = `registry/components/ui/${item.name}.tsx`;
  const componentStylePath = `registry/styles/components/${item.name}.css`;
  const paths = new Set(item.files.map((file) => file.path));
  if (!paths.has(componentSourcePath)) fail(`${item.name} does not ship its generated component wrapper`);
  if (!paths.has(componentStylePath)) fail(`${item.name} does not ship its scoped stylesheet`);

  const wrapper = await readFile(resolve(root, componentSourcePath), "utf8");
  const expectedImports = `import "../../styles/teum-base.css";\nimport "../../styles/components/${item.name}.css";`;
  if (!wrapper.startsWith(expectedImports)) {
    fail(`${item.name} does not automatically load the shared contract and its scoped stylesheet`);
  }
  const source = await readFile(resolve(root, `src/components/ui/${item.name}.tsx`), "utf8");
  if (wrapper !== `${expectedImports}\n${source}`) {
    fail(`${item.name} registry wrapper is stale relative to its TypeScript source`);
  }
  const apiEntry = publicApi.components[item.name];
  if (apiEntry.source !== `src/components/ui/${item.name}.tsx`) {
    fail(`${item.name} API manifest points to ${apiEntry.source}`);
  }
  await access(resolve(root, apiEntry.declaration)).catch(() => fail(`${item.name} generated declaration is missing`));

  const componentStyle = await readFile(resolve(root, componentStylePath), "utf8");
  if (componentStyle.includes("@import")) fail(`${item.name} stylesheet contains an unexpected transitive import`);
  if (!componentStyle.includes(layerOrder) || !componentStyle.includes("@layer teum.components")) {
    fail(`${item.name} stylesheet does not respect the public cascade order`);
  }
  for (const documentationSelector of [".system-window", ".live-specimen", ".component-api", ".state-tile", ".foundation-", ".pattern-"]) {
    if (componentStyle.includes(documentationSelector)) fail(`${item.name} stylesheet leaked documentation selector ${documentationSelector}`);
  }
  if (Buffer.byteLength(componentStyle) > 8_000) fail(`${item.name} stylesheet exceeds the 8 KB source budget`);
}

const buttonStyle = await readFile(resolve(root, "registry/styles/components/button.css"), "utf8");
for (const unrelatedSelector of [".teum-dialog", ".teum-table", ".teum-shared-detail"]) {
  if (buttonStyle.includes(unrelatedSelector)) fail(`button stylesheet leaked ${unrelatedSelector}`);
}

const completeSystem = items.find((item) => item.name === "teum");
if (!completeSystem) fail("missing teum complete-system item");

const tailwindBridge = items.find((item) => item.name === "teum-tailwind");
if (!tailwindBridge) fail("missing optional Tailwind bridge item");
const tailwindBridgeSource = await readFile(resolve(root, "registry/styles/teum-tailwind.css"), "utf8")
  .catch(() => fail("generated Tailwind bridge stylesheet is missing"));
for (const contract of ["@theme inline", "--color-background", "--shadow-flyout", "var(--teum-bg-canvas)"]) {
  if (!tailwindBridgeSource.includes(contract)) fail(`Tailwind bridge is missing ${contract}`);
}

const registryStylePath = resolve(root, "src/teum.css");
const registryStyle = await readFile(registryStylePath, "utf8").catch(() => fail("generated registry stylesheet is missing; run npm run build:registry"));
for (const selector of [".teum-button", ".teum-field", ".teum-menu", ".teum-dialog", ".teum-table", ".teum-shared-detail"]) {
  if (!registryStyle.includes(selector)) fail(`registry stylesheet is missing ${selector}`);
}
for (const token of ["--teum-bg-flyout", "--teum-bg-modal", "--teum-shadow-flyout", "--teum-shadow-modal", "--teum-layer-flyout", "--teum-layer-modal", "--teum-layer-toast"]) {
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
if (!/className=(?:"teum-toaster"|\{[^}]*["']teum-toaster["'][^}]*\})/s.test(toastSource)) fail("toast does not declare the toaster layer class");
for (const documentationSelector of [".system-window", ".live-specimen", ".component-api", ".state-tile"]) {
  if (registryStyle.includes(documentationSelector)) fail(`registry stylesheet leaked documentation selector ${documentationSelector}`);
}
if (Buffer.byteLength(registryStyle) > 120_000) fail("registry stylesheet exceeds the 120 KB source budget");
if (gzipSync(registryStyle).byteLength > 18_000) fail("registry stylesheet exceeds the 18 KB gzip budget");

const completePaths = new Set(completeSystem.files.map((file) => file.path));
const requiredCompletePaths = new Set([
  ...items.find((item) => item.name === "teum-base").files.map((file) => file.path),
  ...components.flatMap((item) => item.files.map((file) => file.path)),
  "registry/styles/teum.css",
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
if (releaseManifest.version !== (await readJson(resolve(root, "package.json"))).version) fail("registry integrity manifest version is stale");
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
if (versionedRelease.schemaVersion !== 2 || versionedRelease.registryScope !== pinnedRegistryScope) {
  fail("versioned registry release does not declare the pinned dependency scope");
}
const versionedArtifacts = (await readdir(versionedDirectory)).filter((name) => name.endsWith(".json") && name !== "release.json").sort();
const mutableArtifacts = (await readdir(outputDirectory, { withFileTypes: true })).filter((entry) => entry.isFile() && entry.name.endsWith(".json")).map((entry) => entry.name).sort();
if (JSON.stringify(versionedArtifacts) !== JSON.stringify(mutableArtifacts)) {
  fail("versioned registry artifact set differs from the mutable release artifact set");
}

const mutableSources = new Map();
for (const name of mutableArtifacts) mutableSources.set(name, await readFile(resolve(outputDirectory, name), "utf8"));
const expectedVersionedSources = createVersionedArtifactSources(mutableSources);
for (const name of mutableArtifacts) {
  const versionedSource = await readFile(resolve(versionedDirectory, name), "utf8");
  if (versionedSource !== expectedVersionedSources.get(name)) fail(`versioned ${name} does not match the pinned release contract`);
  if (versionedRelease.artifacts?.[name]?.sha256 !== hash(versionedSource)) fail(`versioned ${name} digest is stale`);
}

const versionedRegistry = await readJson(resolve(versionedDirectory, "registry.json"));
for (const item of versionedRegistry.items ?? []) {
  for (const dependency of item.registryDependencies ?? []) {
    if (dependency.startsWith(`${mutableRegistryScope}/`)) {
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
if (versionedManifest.sources?.registry?.sha256 !== releaseManifest.sources?.registry?.sha256) {
  fail("versioned integrity manifest no longer identifies the authored registry source");
}
if (
  versionedManifest.versionedFrom?.mutableManifestSha256 !== hash(releaseManifestSource)
  || versionedManifest.versionedFrom?.dependencyScopeRewrite !== `${mutableRegistryScope}/* -> ${pinnedRegistryScope}/*`
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
