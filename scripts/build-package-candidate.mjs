import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { lstat, mkdir, mkdtemp, readFile, readdir, rename, rm, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, resolve } from "node:path";
import { promisify } from "node:util";

const exec = promisify(execFile);
const root = process.cwd();
const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const packageJson = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
const requestedOutput = process.env.WHATIUSE_PACKAGE_CANDIDATE_DIR;
const sha256 = (value) => createHash("sha256").update(value).digest("hex");

if (!requestedOutput || !isAbsolute(requestedOutput)) {
  throw new Error("[package-candidate] WHATIUSE_PACKAGE_CANDIDATE_DIR must be an explicit absolute path");
}
const output = resolve(requestedOutput);
await mkdir(dirname(output), { recursive: true });
if (await lstat(output).then(() => true).catch(() => false)) {
  throw new Error(`[package-candidate] output already exists: ${output}`);
}
const staging = await mkdtemp(resolve(dirname(output), ".whatiuse-package-candidate-"));

try {
const packed = await exec(npm, ["pack", "--json", "--pack-destination", staging], {
  cwd: root,
  maxBuffer: 64 * 1024 * 1024,
});
const reports = JSON.parse(packed.stdout);
if (reports.length !== 1 || !reports[0]?.filename?.endsWith(".tgz")) {
  throw new Error("[package-candidate] npm pack did not return exactly one tarball");
}
const packReport = reports[0];
const tarball = await readFile(resolve(staging, packReport.filename));

const sbom = await exec(npm, ["sbom", "--sbom-format", "cyclonedx"], {
  cwd: root,
  maxBuffer: 64 * 1024 * 1024,
});
await writeFile(resolve(staging, "sbom.cdx.json"), sbom.stdout, "utf8");

const candidate = {
  schemaVersion: 1,
  status: "unpublished-package-candidate",
  name: packageJson.name,
  version: packageJson.version,
  publicationLocked: packageJson.private === true,
  package: {
    file: packReport.filename,
    bytes: tarball.byteLength,
    sha256: sha256(tarball),
    fileCount: packReport.entryCount,
    unpackedBytes: packReport.unpackedSize,
  },
};
if (!candidate.publicationLocked) throw new Error("[package-candidate] package publication lock is disabled");
await writeFile(resolve(staging, "package-candidate.json"), `${JSON.stringify(candidate, null, 2)}\n`, "utf8");

const expectedBeforeChecksums = [packReport.filename, "package-candidate.json", "sbom.cdx.json"].sort();
const current = (await readdir(staging)).sort();
if (JSON.stringify(current) !== JSON.stringify(expectedBeforeChecksums)) {
  throw new Error(`[package-candidate] unexpected output set: ${current.join(", ")}`);
}
const checksums = [];
for (const name of current) checksums.push(`${sha256(await readFile(resolve(staging, name)))}  ${name}`);
await writeFile(resolve(staging, "SHA256SUMS"), `${checksums.join("\n")}\n`, "utf8");
await rename(staging, output);

console.log(`[package-candidate] assembled exact ${packageJson.version} subject ${packReport.filename}`);
} catch (error) {
  await rm(staging, { recursive: true, force: true });
  throw error;
}
