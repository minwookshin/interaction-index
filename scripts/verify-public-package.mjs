import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { readFile, readdir } from "node:fs/promises";
import { isAbsolute, resolve } from "node:path";
import { promisify } from "node:util";

const exec = promisify(execFile);
const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const root = process.cwd();
const requestedDirectory = process.env.TEUM_PUBLIC_PACKAGE_DIR;
const fail = (message) => { throw new Error(`[public-package] ${message}`); };
const sha256 = (value) => createHash("sha256").update(value).digest("hex");

if (!requestedDirectory || !isAbsolute(requestedDirectory)) fail("TEUM_PUBLIC_PACKAGE_DIR must be an explicit absolute path");
const directory = resolve(requestedDirectory);
const files = (await readdir(directory)).sort();
const tarballs = files.filter((file) => file.endsWith(".tgz"));
if (tarballs.length !== 1) fail("candidate must contain exactly one tarball");
if (JSON.stringify(files) !== JSON.stringify([tarballs[0], "SHA256SUMS", "public-package.json", "sbom.cdx.json"].sort())) fail(`unexpected candidate files: ${files.join(", ")}`);

const candidate = JSON.parse(await readFile(resolve(directory, "public-package.json"), "utf8"));
const packageJson = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
if (candidate.status !== "publishable-beta-candidate" || candidate.version !== packageJson.version || candidate.distTag !== "beta") fail("candidate metadata drifted");
if (candidate.repositoryPublicationLocked !== true || candidate.tarballPublicationLocked !== false) fail("publication boundaries are ambiguous");
const tarball = resolve(directory, tarballs[0]);
const tarballBytes = await readFile(tarball);
if (candidate.package?.sha256 !== sha256(tarballBytes) || candidate.package?.bytes !== tarballBytes.byteLength) fail("tarball metadata mismatch");

const checksumLines = (await readFile(resolve(directory, "SHA256SUMS"), "utf8")).trim().split("\n");
for (const line of checksumLines) {
  const match = line.match(/^([a-f0-9]{64})  ([^/]+)$/);
  if (!match || !files.includes(match[2])) fail(`invalid checksum line: ${line}`);
  if (sha256(await readFile(resolve(directory, match[2]))) !== match[1]) fail(`checksum mismatch: ${match[2]}`);
}

await exec(npm, ["publish", tarball, "--dry-run", "--tag", "beta", "--access", "public"], { cwd: root, maxBuffer: 64 * 1024 * 1024 });
await exec(process.execPath, ["scripts/verify-package-consumer.mjs"], {
  cwd: root,
  env: { ...process.env, TEUM_PACKAGE_TARBALL: tarball },
  maxBuffer: 64 * 1024 * 1024,
});
console.log(`[public-package] verified ${tarballs[0]} checksums, npm dry-run, TypeScript, Vite, SSR, and hydration`);
