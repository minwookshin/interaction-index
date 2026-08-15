import { execFile } from "node:child_process";
import { cp, lstat, mkdir, mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { promisify } from "node:util";

const exec = promisify(execFile);
const root = process.cwd();
const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const git = process.platform === "win32" ? "git.exe" : "git";
const work = await mkdtemp(join(tmpdir(), "teum-clean-room-"));
const fixture = resolve(work, "source");

const excludedPrefixes = [
  ".git/",
  "artifacts/",
  "dist/",
  "node_modules/",
  "playwright-report/",
  "storybook-static/",
  "test-results/",
];

const isExcluded = (path) => excludedPrefixes.some((prefix) => path === prefix.slice(0, -1) || path.startsWith(prefix));

async function run(command, args, cwd = fixture) {
  const result = await exec(command, args, { cwd, maxBuffer: 128 * 1024 * 1024 });
  process.stdout.write(result.stdout);
  process.stderr.write(result.stderr);
}

try {
  const listed = await exec(git, ["ls-files", "--cached", "--others", "--exclude-standard", "-z"], {
    cwd: root,
    encoding: "buffer",
    maxBuffer: 64 * 1024 * 1024,
  });
  const candidates = listed.stdout.toString("utf8").split("\0").filter(Boolean).filter((path) => !isExcluded(path));
  const files = [];
  for (const path of candidates) {
    try {
      await lstat(resolve(root, path));
      files.push(path);
    } catch (error) {
      if (error?.code !== "ENOENT") throw error;
    }
  }
  if (!files.includes("package.json") || !files.includes("package-lock.json")) {
    throw new Error("[clean-room] source snapshot is missing package metadata");
  }

  for (const path of files) {
    const target = resolve(fixture, path);
    await mkdir(dirname(target), { recursive: true });
    await cp(resolve(root, path), target, { recursive: true, dereference: false });
  }

  const packageJson = JSON.parse(await readFile(resolve(fixture, "package.json"), "utf8"));
  console.log(`[clean-room] copied ${files.length} candidate files for ${packageJson.version}`);
  await run(npm, ["ci", "--no-audit", "--no-fund"]);
  await run(npm, ["run", "verify:clean"]);
  console.log(`[clean-room] ${packageJson.version} passed a fresh npm ci, build, registry, package, consumer, dogfood, and Sites verification`);
} finally {
  await rm(work, { recursive: true, force: true });
}
