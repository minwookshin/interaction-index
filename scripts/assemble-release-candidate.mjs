import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { copyFile, lstat, mkdir, mkdtemp, readFile, readdir, rename, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { promisify } from "node:util";

const exec = promisify(execFile);
const root = process.cwd();
const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const git = process.platform === "win32" ? "git.exe" : "git";
const packageJson = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
const version = packageJson.version;
const sha256 = (value) => createHash("sha256").update(value).digest("hex");

if (packageJson.private !== true) throw new Error("[rc] publication lock must remain enabled");
if (!/^\d+\.\d+\.\d+-rc\.\d+$/.test(version)) throw new Error(`[rc] expected an rc SemVer, received ${version}`);

const status = await exec(git, ["status", "--porcelain"], { cwd: root });
if (status.stdout.trim()) throw new Error("[rc] assemble from a clean local commit so the artifact maps to one exact source tree");

const commit = (await exec(git, ["rev-parse", "HEAD"], { cwd: root })).stdout.trim();
const output = resolve(root, "artifacts/release-candidate", version);
if (await lstat(output).then(() => true).catch(() => false)) {
  throw new Error(`[rc] output already exists; inspect or archive it before assembling again: ${output}`);
}
await mkdir(dirname(output), { recursive: true });
const staging = await mkdtemp(resolve(dirname(output), `.${version}-`));

const required = [
  "COMPATIBILITY.md",
  "RELEASE_CHECKLIST.md",
  "RELEASE_FREEZE.md",
  "RELEASE_QA.md",
  "RC_EXTERNAL_GATES.md",
  "performance-report.json",
  "release/runtime-performance.json",
  "release/public-surface.freeze.json",
  "release/evidence.json",
  "release/evidence.md",
  "release/quickstart.json",
  "release/package-contract.json",
  "release/accessibility.json",
  "release/teum-data-install.json",
  "release/teum-analytics-install.json",
  "release/teum-product-patterns-install.json",
  `public/r/v/${version}/release.json`,
  "dist/package/integrity.json",
];
for (const path of required) await readFile(resolve(root, path));

try {
const packed = await exec(npm, ["pack", "--json", "--pack-destination", staging], {
  cwd: root,
  maxBuffer: 64 * 1024 * 1024,
});
const packReport = JSON.parse(packed.stdout)[0];
const tarballPath = resolve(staging, packReport.filename);
const tarball = await readFile(tarballPath);

const sbom = await exec(npm, ["sbom", "--sbom-format", "cyclonedx"], {
  cwd: root,
  maxBuffer: 64 * 1024 * 1024,
});
await writeFile(resolve(staging, "sbom.cdx.json"), sbom.stdout, "utf8");

for (const path of required) {
  const target = path.replaceAll("/", "__");
  await copyFile(resolve(root, path), resolve(staging, target));
}

const candidate = {
  schemaVersion: 1,
  name: packageJson.name,
  version,
  status: "unpublished-release-candidate",
  publicationLocked: true,
  packagePrivate: true,
  sourceCommit: commit,
  package: {
    file: packReport.filename,
    bytes: tarball.length,
    sha256: sha256(tarball),
    fileCount: packReport.entryCount,
    unpackedBytes: packReport.unpackedSize,
  },
  externalGates: "RC_EXTERNAL_GATES.md",
};
await writeFile(resolve(staging, "candidate.json"), `${JSON.stringify(candidate, null, 2)}\n`, "utf8");

const expectedFiles = [
  packReport.filename,
  "sbom.cdx.json",
  "candidate.json",
  ...required.map((path) => path.replaceAll("/", "__")),
].sort();
const files = (await readdir(staging)).filter((name) => name !== "SHA256SUMS").sort();
if (JSON.stringify(files) !== JSON.stringify(expectedFiles)) {
  throw new Error(`[rc] unexpected candidate file set: ${files.join(", ")}`);
}
const checksums = [];
for (const name of files) checksums.push(`${sha256(await readFile(resolve(staging, name)))}  ${name}`);
await writeFile(resolve(staging, "SHA256SUMS"), `${checksums.join("\n")}\n`, "utf8");
await rename(staging, output);

console.log(`[rc] assembled unpublished ${version} from ${commit.slice(0, 12)} at ${output}`);
console.log(`[rc] ${packReport.filename}: ${candidate.package.sha256}`);
} catch (error) {
  await rm(staging, { recursive: true, force: true });
  throw error;
}
