import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { lstat, readFile, readdir } from "node:fs/promises";
import { relative, resolve, sep } from "node:path";
import { promisify } from "node:util";

const exec = promisify(execFile);
const root = process.cwd();
const historyRoot = resolve(root, "public/r/v");
const ledgerPath = resolve(root, "release/registry-history.json");
const git = process.platform === "win32" ? "git.exe" : "git";

const sha256 = (value) => createHash("sha256").update(value).digest("hex");

async function listFiles(directory, base = directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    const path = resolve(directory, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`[registry-history] symbolic links are forbidden: ${path}`);
    if (entry.isDirectory()) files.push(...(await listFiles(path, base)));
    else if (entry.isFile()) files.push(relative(base, path).split(sep).join("/"));
    else throw new Error(`[registry-history] unsupported filesystem entry: ${path}`);
  }

  return files.sort();
}

function digestEntries(entries) {
  const digest = createHash("sha256");
  for (const entry of entries) {
    digest.update(entry.path);
    digest.update("\0");
    digest.update(String(entry.bytes));
    digest.update("\0");
    digest.update(entry.sha256);
    digest.update("\n");
  }
  return digest.digest("hex");
}

async function snapshotDirectory(version) {
  const directory = resolve(historyRoot, version);
  const files = await listFiles(directory);
  const entries = [];

  for (const path of files) {
    const absolutePath = resolve(directory, path);
    const metadata = await lstat(absolutePath);
    const contents = await readFile(absolutePath);
    entries.push({ path, bytes: metadata.size, sha256: sha256(contents) });
  }

  return { version, fileCount: entries.length, treeSha256: digestEntries(entries), entries };
}

async function snapshotCommit(version, commit) {
  const prefix = `public/r/v/${version}/`;
  let tree;
  try {
    tree = await exec(git, ["ls-tree", "-r", "--name-only", commit, "--", `public/r/v/${version}`], {
      cwd: root,
      maxBuffer: 16 * 1024 * 1024,
    });
  } catch (error) {
    throw new Error(
      `[registry-history] cannot inspect anchor ${commit} for ${version}; fetch full git history before release verification`,
      { cause: error },
    );
  }

  const files = tree.stdout
    .split("\n")
    .filter(Boolean)
    .filter((path) => path.startsWith(prefix))
    .map((path) => path.slice(prefix.length))
    .sort();
  if (files.length === 0) throw new Error(`[registry-history] anchor ${commit} has no files for ${version}`);

  const entries = [];
  for (const path of files) {
    const object = await exec(git, ["show", `${commit}:${prefix}${path}`], {
      cwd: root,
      encoding: "buffer",
      maxBuffer: 64 * 1024 * 1024,
    });
    entries.push({ path, bytes: object.stdout.byteLength, sha256: sha256(object.stdout) });
  }

  return { version, fileCount: entries.length, treeSha256: digestEntries(entries), entries };
}

const packageJson = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
const ledger = JSON.parse(await readFile(ledgerPath, "utf8"));
if (ledger.schemaVersion !== 1) throw new Error("[registry-history] unsupported ledger schema");
if (ledger.currentCandidate !== packageJson.version) {
  throw new Error(`[registry-history] ledger candidate ${ledger.currentCandidate} does not match ${packageJson.version}`);
}

const directories = (await readdir(historyRoot, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

if (process.argv.includes("--snapshot")) {
  const snapshots = [];
  for (const version of directories) {
    const snapshot = await snapshotDirectory(version);
    snapshots.push({ version, fileCount: snapshot.fileCount, treeSha256: snapshot.treeSha256 });
  }
  console.log(JSON.stringify(snapshots, null, 2));
  process.exit(0);
}

const recorded = ledger.versions.map((entry) => entry.version).sort();
if (JSON.stringify(directories) !== JSON.stringify(recorded)) {
  throw new Error(
    `[registry-history] version set differs from ledger\nactual: ${directories.join(", ")}\nledger: ${recorded.join(", ")}`,
  );
}

for (const entry of ledger.versions) {
  if (!['anchored', 'legacy-preview', 'candidate'].includes(entry.status)) {
    throw new Error(`[registry-history] invalid status for ${entry.version}: ${entry.status}`);
  }
  if (entry.status === "anchored" && !/^[0-9a-f]{40}$/.test(entry.anchorCommit ?? "")) {
    throw new Error(`[registry-history] ${entry.version} requires a full commit anchor`);
  }
  if (entry.status !== "anchored" && entry.anchorCommit) {
    throw new Error(`[registry-history] only anchored versions may declare anchorCommit: ${entry.version}`);
  }

  const current = await snapshotDirectory(entry.version);
  if (current.fileCount !== entry.fileCount || current.treeSha256 !== entry.treeSha256) {
    throw new Error(`[registry-history] immutable files changed for ${entry.version}`);
  }

  if (entry.status === "anchored") {
    const anchored = await snapshotCommit(entry.version, entry.anchorCommit);
    if (anchored.fileCount !== current.fileCount || anchored.treeSha256 !== current.treeSha256) {
      throw new Error(`[registry-history] ${entry.version} differs from anchor ${entry.anchorCommit}`);
    }
  }
}

console.log(`[registry-history] verified ${ledger.versions.length} immutable version directories`);
