import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const sourceRoot = resolve(root, "public/r");
const packageJson = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
const publication = JSON.parse(await readFile(resolve(root, "publication.json"), "utf8"));
const version = packageJson.version;
const checkOnly = process.argv.includes("--check");

const fail = (message) => {
  throw new Error(`[versioned-registry] ${message}`);
};
const sha256 = (value) => createHash("sha256").update(value).digest("hex");

if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/.test(version)) {
  fail(`package version is not valid SemVer: ${version}`);
}

const artifactNames = (await readdir(sourceRoot, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
  .map((entry) => entry.name)
  .sort();
if (!artifactNames.includes("manifest.json") || !artifactNames.includes("registry.json")) {
  fail("build the mutable registry and integrity manifest before the versioned release");
}

const artifacts = {};
const expectedFiles = new Map();
for (const name of artifactNames) {
  const source = await readFile(resolve(sourceRoot, name), "utf8");
  expectedFiles.set(name, source);
  artifacts[name] = { bytes: Buffer.byteLength(source), sha256: sha256(source) };
}

const release = {
  schemaVersion: 1,
  name: packageJson.name,
  version,
  immutable: true,
  channel: "versioned",
  urlTemplate: `${publication.homepage}/r/v/${version}/{name}.json`,
  cacheControl: "public, max-age=31536000, immutable",
  sourceManifestSha256: artifacts["manifest.json"].sha256,
  artifacts,
};
expectedFiles.set("release.json", `${JSON.stringify(release, null, 2)}\n`);

const outputRoot = resolve(sourceRoot, "v", version);
const currentNames = await readdir(outputRoot).catch(() => null);
if (currentNames) {
  const expectedNames = [...expectedFiles.keys()].sort();
  const actualNames = currentNames.filter((name) => name.endsWith(".json")).sort();
  if (JSON.stringify(expectedNames) !== JSON.stringify(actualNames)) {
    fail(`${version} already exists with a different artifact set; bump package.json before changing a versioned release`);
  }
  for (const name of expectedNames) {
    const current = await readFile(resolve(outputRoot, name), "utf8");
    if (current !== expectedFiles.get(name)) {
      fail(`${version}/${name} is immutable and no longer matches the current build; bump package.json`);
    }
  }
  console.log(`[versioned-registry] verified immutable ${version} with ${artifactNames.length} registry artifacts`);
} else {
  if (checkOnly) fail(`immutable release ${version} is missing; run npm run build:registry`);
  await mkdir(outputRoot, { recursive: true });
  for (const [name, source] of expectedFiles) await writeFile(resolve(outputRoot, name), source, "utf8");
  console.log(`[versioned-registry] created immutable ${version} with ${artifactNames.length} registry artifacts`);
}
