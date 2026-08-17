import { createHash } from "node:crypto";
import { readFile, readdir, writeFile } from "node:fs/promises";
import { basename, relative, resolve } from "node:path";

const root = process.cwd();
const outputRoot = resolve(root, "public/r");
const outputPath = resolve(outputRoot, "manifest.json");
const checkOnly = process.argv.includes("--check");

const fail = (message) => {
  throw new Error(`[registry-manifest] ${message}`);
};

const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const integrity = (value) => `sha256-${createHash("sha256").update(value).digest("base64")}`;

const [packageSource, registrySource, apiSource, tokenSource, publicationSource] = await Promise.all([
  readFile(resolve(root, "package.json"), "utf8"),
  readFile(resolve(root, "registry.json"), "utf8"),
  readFile(resolve(root, "api/generated/public-api.json"), "utf8"),
  readFile(resolve(root, "tokens/generated/token-manifest.json"), "utf8"),
  readFile(resolve(root, "publication.json"), "utf8"),
]);

const packageJson = JSON.parse(packageSource);
const registry = JSON.parse(registrySource);
const publicApi = JSON.parse(apiSource);
const tokenManifest = JSON.parse(tokenSource);
const publication = JSON.parse(publicationSource);

if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/.test(packageJson.version)) {
  fail(`package version is not valid SemVer: ${packageJson.version}`);
}
if (packageJson.private !== true) fail("the package must remain private during the pre-release registry phase");
if (registry.items.length === 0) fail("registry exposes no source items");
if (new Set(registry.items.map((item) => item.name)).size !== registry.items.length) fail("registry source item names must be unique");

const expectedNames = new Set(registry.items.map((item) => item.name));
const artifactNames = (await readdir(outputRoot))
  .filter((name) => name.endsWith(".json") && name !== "manifest.json")
  .sort();
const expectedArtifactNames = ["registry.json", ...[...expectedNames].map((name) => `${name}.json`)].sort();
if (JSON.stringify(artifactNames) !== JSON.stringify(expectedArtifactNames)) {
  const missing = expectedArtifactNames.filter((name) => !artifactNames.includes(name));
  const unexpected = artifactNames.filter((name) => !expectedArtifactNames.includes(name));
  fail(`artifact set drifted; missing: ${missing.join(", ") || "none"}; unexpected: ${unexpected.join(", ") || "none"}`);
}

const artifacts = {};
for (const artifactName of artifactNames) {
  const path = resolve(outputRoot, artifactName);
  const source = await readFile(path, "utf8");
  const parsed = JSON.parse(source);
  const name = artifactName === "registry.json" ? "registry" : basename(artifactName, ".json");
  const files = (parsed.files ?? []).map((file) => ({
    path: file.path,
    target: file.target ?? null,
    bytes: Buffer.byteLength(file.content ?? ""),
    sha256: sha256(file.content ?? ""),
    integrity: integrity(file.content ?? ""),
  }));

  artifacts[name] = {
    path: relative(root, path),
    type: parsed.type ?? "registry:index",
    bytes: Buffer.byteLength(source),
    sha256: sha256(source),
    integrity: integrity(source),
    files,
  };
}

const api = Object.fromEntries(Object.entries(publicApi.components).map(([component, entry]) => [
  component,
  {
    sourceHash: entry.sourceHash,
    exports: Object.fromEntries(entry.exports.map((item) => [item.name, {
      kind: item.kind,
      typeHash: item.typeHash,
    }])),
  },
]));

const tokens = Object.fromEntries(tokenManifest.tokens.map((token) => [token.path, {
  type: token.type,
  cssVariable: token.cssVariable,
  valueHash: sha256(JSON.stringify(token.resolvedValues)),
  deprecated: token.deprecated,
}]));

const manifest = {
  schemaVersion: 1,
  name: packageJson.name,
  version: packageJson.version,
  maturity: packageJson.version.includes("-") ? "pre-release" : "stable",
  distribution: {
    package: {
      private: packageJson.private,
      published: false,
      provenance: "configured-for-future-trusted-publishing",
    },
    mutableRegistry: {
      status: "available",
      urlTemplate: `${publication.homepage}/r/{name}.json`,
      updatePolicy: "pull-review-apply",
    },
    immutableRegistry: {
      status: "available",
      version: packageJson.version,
      urlTemplate: `${publication.homepage}/r/v/${packageJson.version}/{name}.json`,
      releaseManifest: `${publication.homepage}/r/v/${packageJson.version}/release.json`,
      cacheControl: "public, max-age=31536000, immutable",
      updatePolicy: "bump-version-review-apply",
      dependencyPolicy: "same-version-internal-and-exact-external",
      installer: `shadcn@${packageJson.devDependencies.shadcn}`,
    },
  },
  sources: {
    package: { path: "package.json", sha256: sha256(packageSource) },
    registry: { path: "registry.json", sha256: sha256(registrySource) },
    api: { path: "api/generated/public-api.json", sha256: sha256(apiSource) },
    tokens: { path: "tokens/generated/token-manifest.json", sha256: sha256(tokenSource) },
  },
  catalog: {
    componentCount: registry.items.filter((item) => item.type === "registry:ui").length,
    itemCount: registry.items.length,
    artifactCount: artifactNames.length,
  },
  artifacts,
  api: {
    schemaVersion: publicApi.schemaVersion,
    exportCount: publicApi.exportCount,
    components: api,
  },
  tokens: {
    format: tokenManifest.format,
    count: tokenManifest.tokens.length,
    entries: tokens,
  },
};

const expected = `${JSON.stringify(manifest, null, 2)}\n`;
if (checkOnly) {
  const current = await readFile(outputPath, "utf8").catch(() => null);
  if (current !== expected) fail("public/r/manifest.json is stale; run npm run build:registry");
} else {
  await writeFile(outputPath, expected, "utf8");
}

console.log(`[registry-manifest] ${checkOnly ? "verified" : "generated"} ${artifactNames.length} artifacts, ${publicApi.exportCount} exports, and ${tokenManifest.tokens.length} tokens for ${packageJson.version}`);
