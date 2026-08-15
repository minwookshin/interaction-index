import { createHash } from "node:crypto";
import { access, readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { gzipSync } from "node:zlib";

const root = process.cwd();
const registryPath = resolve(root, "registry.json");
const publicApiPath = resolve(root, "api/generated/public-api.json");
const outputDirectory = resolve(root, "public/r");

const fail = (message) => {
  throw new Error(`[registry] ${message}`);
};

const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const hash = (value) => createHash("sha256").update(value).digest("hex");
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
      fail(`${item.name} uses bare internal dependency ${dependency}; use @index/${dependency}`);
    }
    if (dependency.startsWith("@index/") && !uniqueNames.has(dependency.slice("@index/".length))) {
      fail(`${item.name} references unknown @index dependency ${dependency}`);
    }
  }

  for (const dependency of item.dependencies ?? []) {
    const separator = dependency.startsWith("@")
      ? dependency.indexOf("@", dependency.indexOf("/") + 1)
      : dependency.indexOf("@");
    if (separator === -1) fail(`${item.name} dependency ${dependency} is not pinned to a tested range`);
  }
}

const layerOrder = "@layer index.tokens, index.base, index.components;";
const registryBasePath = resolve(root, "registry/styles/index-base.css");
const registryBase = await readFile(registryBasePath, "utf8").catch(() => fail("generated base stylesheet is missing"));
if (!registryBase.includes(layerOrder)) fail("base stylesheet does not declare the public cascade order");
if (!registryBase.includes("@layer index.tokens") || !registryBase.includes("@layer index.base")) {
  fail("base stylesheet does not separate tokens from global defaults");
}
for (const selector of [".ix-button", ".ix-dialog", ".ix-table", ".ix-shared-detail"]) {
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
  const expectedImports = `import "../../styles/index-base.css";\nimport "../../styles/components/${item.name}.css";`;
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
  if (!componentStyle.includes(layerOrder) || !componentStyle.includes("@layer index.components")) {
    fail(`${item.name} stylesheet does not respect the public cascade order`);
  }
  for (const documentationSelector of [".system-window", ".live-specimen", ".component-api", ".state-tile", ".foundation-", ".pattern-"]) {
    if (componentStyle.includes(documentationSelector)) fail(`${item.name} stylesheet leaked documentation selector ${documentationSelector}`);
  }
  if (Buffer.byteLength(componentStyle) > 8_000) fail(`${item.name} stylesheet exceeds the 8 KB source budget`);
}

const buttonStyle = await readFile(resolve(root, "registry/styles/components/button.css"), "utf8");
for (const unrelatedSelector of [".ix-dialog", ".ix-table", ".ix-shared-detail"]) {
  if (buttonStyle.includes(unrelatedSelector)) fail(`button stylesheet leaked ${unrelatedSelector}`);
}

const completeSystem = items.find((item) => item.name === "interaction-index");
if (!completeSystem) fail("missing interaction-index complete-system item");

const registryStylePath = resolve(root, "src/interaction-index.css");
const registryStyle = await readFile(registryStylePath, "utf8").catch(() => fail("generated registry stylesheet is missing; run npm run build:registry"));
for (const selector of [".ix-button", ".ix-field", ".ix-menu", ".ix-dialog", ".ix-table", ".ix-shared-detail"]) {
  if (!registryStyle.includes(selector)) fail(`registry stylesheet is missing ${selector}`);
}
for (const token of ["--ix-bg-flyout", "--ix-bg-modal", "--ix-shadow-flyout", "--ix-shadow-modal", "--ix-layer-flyout", "--ix-layer-modal", "--ix-layer-toast"]) {
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
if (!/className=(?:"ix-toaster"|\{[^}]*["']ix-toaster["'][^}]*\})/s.test(toastSource)) fail("toast does not declare the toaster layer class");
for (const documentationSelector of [".system-window", ".live-specimen", ".component-api", ".state-tile"]) {
  if (registryStyle.includes(documentationSelector)) fail(`registry stylesheet leaked documentation selector ${documentationSelector}`);
}
if (Buffer.byteLength(registryStyle) > 120_000) fail("registry stylesheet exceeds the 120 KB source budget");
if (gzipSync(registryStyle).byteLength > 18_000) fail("registry stylesheet exceeds the 18 KB gzip budget");

const completePaths = new Set(completeSystem.files.map((file) => file.path));
const requiredCompletePaths = new Set([
  ...items.find((item) => item.name === "interaction-index-base").files.map((file) => file.path),
  ...components.flatMap((item) => item.files.map((file) => file.path)),
  "registry/styles/interaction-index.css",
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
const versionedArtifacts = (await readdir(versionedDirectory)).filter((name) => name.endsWith(".json") && name !== "release.json").sort();
const mutableArtifacts = (await readdir(outputDirectory, { withFileTypes: true })).filter((entry) => entry.isFile() && entry.name.endsWith(".json")).map((entry) => entry.name).sort();
if (JSON.stringify(versionedArtifacts) !== JSON.stringify(mutableArtifacts)) {
  fail("versioned registry artifact set differs from the mutable release artifact set");
}
for (const name of mutableArtifacts) {
  const mutableSource = await readFile(resolve(outputDirectory, name), "utf8");
  const versionedSource = await readFile(resolve(versionedDirectory, name), "utf8");
  if (versionedSource !== mutableSource) fail(`versioned ${name} is not a byte-for-byte release artifact`);
  if (versionedRelease.artifacts?.[name]?.sha256 !== hash(versionedSource)) fail(`versioned ${name} digest is stale`);
}
if (versionedRelease.sourceManifestSha256 !== hash(await readFile(releaseManifestPath, "utf8"))) {
  fail("versioned release manifest does not point to the current integrity manifest");
}

console.log(`[registry] verified ${components.length} components, ${items.length} items, the complete-system artifact, and immutable ${releaseManifest.version}`);
