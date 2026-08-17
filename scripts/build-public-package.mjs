import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { copyFile, lstat, mkdir, mkdtemp, readFile, readdir, rename, rm, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, relative, resolve } from "node:path";
import { promisify } from "node:util";

const exec = promisify(execFile);
const root = process.cwd();
const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const requestedOutput = process.env.TEUM_PUBLIC_PACKAGE_DIR;
const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const fail = (message) => { throw new Error(`[public-package] ${message}`); };

if (!requestedOutput || !isAbsolute(requestedOutput)) fail("TEUM_PUBLIC_PACKAGE_DIR must be an explicit absolute path");
const output = resolve(requestedOutput);
if (await lstat(output).then(() => true).catch(() => false)) fail(`output already exists: ${output}`);
await mkdir(dirname(output), { recursive: true });
const staging = await mkdtemp(resolve(dirname(output), ".teum-public-package-"));
const source = resolve(staging, "source");
const artifact = resolve(staging, "artifact");

try {
  const packageJson = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
  const releaseEvidence = JSON.parse(await readFile(resolve(root, "release/evidence.json"), "utf8"));
  const betaReadiness = JSON.parse(await readFile(resolve(root, "release/beta-readiness.json"), "utf8"));
  if (packageJson.private !== true) fail("the repository package must remain publication-locked");
  if (!/^\d+\.\d+\.\d+-[0-9A-Za-z.-]+$/.test(packageJson.version)) fail("public beta candidates require an exact prerelease SemVer");
  if (releaseEvidence.release?.version !== packageJson.version || releaseEvidence.automation?.browserMatrix?.status !== "passed") fail("release evidence is not passing");
  if (betaReadiness.candidate !== packageJson.version || betaReadiness.localCandidate?.status !== "passed") fail("beta readiness is stale");

  const dryRun = await exec(npm, ["pack", "--dry-run", "--json"], { cwd: root, maxBuffer: 64 * 1024 * 1024 });
  const report = JSON.parse(dryRun.stdout)[0];
  if (!report || !Array.isArray(report.files)) fail("npm pack did not return a file inventory");
  await mkdir(source, { recursive: true });
  for (const entry of report.files) {
    const path = entry.path;
    const input = resolve(root, path);
    const confined = relative(root, input);
    if (!path || path.includes("\\") || isAbsolute(path) || confined.startsWith("..") || isAbsolute(confined)) fail(`pack path escapes the repository: ${path}`);
    const stat = await lstat(input);
    if (!stat.isFile() || stat.isSymbolicLink()) fail(`pack path is not a regular file: ${path}`);
    if (path === "package.json") continue;
    const target = resolve(source, path);
    await mkdir(dirname(target), { recursive: true });
    await copyFile(input, target);
  }

  const publicManifestKeys = [
    "name", "version", "description", "keywords", "license", "type", "files", "main", "module", "types", "exports", "sideEffects",
    "publishConfig", "dependencies", "peerDependencies", "repository", "bugs", "homepage", "engines", "author",
  ];
  const publicManifest = Object.fromEntries(publicManifestKeys.filter((key) => packageJson[key] !== undefined).map((key) => [key, packageJson[key]]));
  publicManifest.private = false;
  publicManifest.publishConfig = { access: "public", provenance: true, tag: "beta" };
  await writeFile(resolve(source, "package.json"), `${JSON.stringify(publicManifest, null, 2)}\n`, "utf8");

  await mkdir(artifact, { recursive: true });
  const packed = await exec(npm, ["pack", "--json", "--pack-destination", artifact], { cwd: source, maxBuffer: 64 * 1024 * 1024 });
  const packedReports = JSON.parse(packed.stdout);
  if (packedReports.length !== 1 || !packedReports[0]?.filename?.endsWith(".tgz")) fail("npm pack did not produce exactly one tarball");
  const packReport = packedReports[0];
  const tarball = await readFile(resolve(artifact, packReport.filename));

  const sbom = await exec(npm, ["sbom", "--sbom-format", "cyclonedx"], { cwd: root, maxBuffer: 64 * 1024 * 1024 });
  await writeFile(resolve(artifact, "sbom.cdx.json"), sbom.stdout, "utf8");
  const candidate = {
    schemaVersion: 1,
    status: "publishable-beta-candidate",
    name: packageJson.name,
    version: packageJson.version,
    distTag: "beta",
    repositoryPublicationLocked: true,
    tarballPublicationLocked: false,
    package: {
      file: packReport.filename,
      bytes: tarball.byteLength,
      sha256: sha256(tarball),
      fileCount: packReport.entryCount,
      unpackedBytes: packReport.unpackedSize,
    },
    claimBoundary: "This tarball is publishable but not published. Publication requires the beta gate, maintainer approval, and npm authentication.",
  };
  await writeFile(resolve(artifact, "public-package.json"), `${JSON.stringify(candidate, null, 2)}\n`, "utf8");

  const beforeChecksums = (await readdir(artifact)).sort();
  if (JSON.stringify(beforeChecksums) !== JSON.stringify([packReport.filename, "public-package.json", "sbom.cdx.json"].sort())) fail(`unexpected artifact set: ${beforeChecksums.join(", ")}`);
  const checksums = [];
  for (const name of beforeChecksums) checksums.push(`${sha256(await readFile(resolve(artifact, name)))}  ${name}`);
  await writeFile(resolve(artifact, "SHA256SUMS"), `${checksums.join("\n")}\n`, "utf8");
  await rename(artifact, output);
  console.log(`[public-package] assembled ${packReport.filename} for the beta dist-tag; repository lock remains enabled`);
} finally {
  await rm(staging, { recursive: true, force: true });
}
