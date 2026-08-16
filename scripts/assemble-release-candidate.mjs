import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { copyFile, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
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
await mkdir(output, { recursive: true });

const required = [
  "COMPATIBILITY.md",
  "RELEASE_CHECKLIST.md",
  "RELEASE_FREEZE.md",
  "RELEASE_QA.md",
  "RC_EXTERNAL_GATES.md",
  "performance-report.json",
  "release/public-surface.freeze.json",
  `public/r/v/${version}/release.json`,
  "dist/package/integrity.json",
];
for (const path of required) await readFile(resolve(root, path));

const packed = await exec(npm, ["pack", "--json", "--pack-destination", output], {
  cwd: root,
  maxBuffer: 64 * 1024 * 1024,
});
const packReport = JSON.parse(packed.stdout)[0];
const tarballPath = resolve(output, packReport.filename);
const tarball = await readFile(tarballPath);

const sbom = await exec(npm, ["sbom", "--sbom-format", "cyclonedx"], {
  cwd: root,
  maxBuffer: 64 * 1024 * 1024,
});
await writeFile(resolve(output, "sbom.cdx.json"), sbom.stdout, "utf8");

for (const path of required) {
  const target = path.replaceAll("/", "__");
  await copyFile(resolve(root, path), resolve(output, target));
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
await writeFile(resolve(output, "candidate.json"), `${JSON.stringify(candidate, null, 2)}\n`, "utf8");

const files = (await readdir(output)).filter((name) => name !== "SHA256SUMS").sort();
const checksums = [];
for (const name of files) checksums.push(`${sha256(await readFile(resolve(output, name)))}  ${name}`);
await writeFile(resolve(output, "SHA256SUMS"), `${checksums.join("\n")}\n`, "utf8");

console.log(`[rc] assembled unpublished ${version} from ${commit.slice(0, 12)} at ${output}`);
console.log(`[rc] ${packReport.filename}: ${candidate.package.sha256}`);
