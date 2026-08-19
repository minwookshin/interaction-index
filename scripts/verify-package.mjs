import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { access, readFile, readdir } from "node:fs/promises";
import { isAbsolute, relative, resolve } from "node:path";
import { promisify } from "node:util";

const exec = promisify(execFile);
const root = process.cwd();
const packageJson = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
const fail = (message) => { throw new Error(`[package] ${message}`); };
const hash = (value) => createHash("sha256").update(value).digest("hex");

if (packageJson.private !== true) fail("package publication must remain locked during pre-release");
if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/.test(packageJson.version)) fail("version is not valid SemVer");
const expectedReactRange = "^18.2.0 || ^19.0.0";
if (packageJson.peerDependencies?.react !== expectedReactRange || packageJson.peerDependencies?.["react-dom"] !== expectedReactRange) {
  fail("React peer contract must match the verified React 18 and 19 range");
}
for (const dependency of ["react", "react-dom", "vite", "@vitejs/plugin-react"]) {
  if (packageJson.dependencies?.[dependency]) fail(`${dependency} must not ship as a runtime dependency`);
}

const exportTargets = [];
const visit = (value) => {
  if (typeof value === "string" && value.startsWith("./")) exportTargets.push(value);
  else if (value && typeof value === "object") Object.values(value).forEach(visit);
};
visit(packageJson.exports);
for (const target of exportTargets.filter((target) => !target.includes("*"))) {
  await access(resolve(root, target)).catch(() => fail(`export target is missing: ${target}`));
}
const packageEntry = await readFile(resolve(root, packageJson.exports["."].import), "utf8");
if (!packageEntry.startsWith('"use client";')) fail("React entry must preserve its client boundary");
const tokenEntry = await readFile(resolve(root, packageJson.exports["./tokens"].import), "utf8");
if (tokenEntry.startsWith('"use client";')) fail("framework-neutral token helpers must not inherit the React client boundary");

const packageRoot = resolve(root, "dist/package");
const integrity = JSON.parse(await readFile(resolve(packageRoot, "integrity.json"), "utf8"));
const integrityPaths = Object.keys(integrity.files).sort();
for (const [path, expected] of Object.entries(integrity.files)) {
  const target = resolve(packageRoot, path);
  const confined = relative(packageRoot, target);
  if (!path || path.includes("\\") || isAbsolute(path) || confined.startsWith("..") || isAbsolute(confined)) {
    fail(`integrity path escapes the package root: ${path}`);
  }
  const source = await readFile(target).catch(() => fail(`integrity file is missing: ${path}`));
  if (source.length !== expected.bytes || hash(source) !== expected.sha256) fail(`integrity mismatch: ${path}`);
}

async function packageFiles(directory, base = directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = resolve(directory, entry.name);
    if (entry.isSymbolicLink()) fail(`package output contains a symbolic link: ${relative(base, path)}`);
    if (entry.isDirectory()) files.push(...(await packageFiles(path, base)));
    else if (entry.isFile() && entry.name !== "integrity.json") files.push(relative(base, path).split("\\").join("/"));
    else if (!entry.isFile()) fail(`package output contains an unsupported entry: ${relative(base, path)}`);
  }
  return files.sort();
}
const builtPaths = await packageFiles(packageRoot);
if (JSON.stringify(builtPaths) !== JSON.stringify(integrityPaths)) fail("integrity manifest does not cover the exact package output set");

const { stdout } = await exec(process.platform === "win32" ? "npm.cmd" : "npm", ["pack", "--dry-run", "--json"], {
  cwd: root,
  maxBuffer: 32 * 1024 * 1024,
});
const report = JSON.parse(stdout)[0];
const paths = report.files.map((file) => file.path);
const allowedRootFiles = new Set([
  "LICENSE",
  "README.md",
  "SECURITY.md",
  "THIRD_PARTY_NOTICES.md",
  "package.json",
]);
for (const path of paths) {
  const allowed = allowedRootFiles.has(path) || path.startsWith("dist/package/") || /^public\/r\/[^/]+\.json$/.test(path);
  if (!allowed) fail(`tarball path is outside the closed allowlist: ${path}`);
}
for (const required of ["dist/package/index.js", "dist/package/styles.css", "dist/package/tokens.css", "dist/package/tailwind.css", "dist/package/integrity.json", "public/r/manifest.json", "LICENSE", "README.md"]) {
  if (!paths.includes(required)) fail(`tarball omitted ${required}`);
}
if (report.unpackedSize > 4_000_000) fail(`tarball exceeds the 4 MB unpacked budget: ${report.unpackedSize}`);

console.log(`[package] verified ${paths.length} packed files, ${report.size} compressed bytes, and ${report.unpackedSize} unpacked bytes; publication remains locked`);
