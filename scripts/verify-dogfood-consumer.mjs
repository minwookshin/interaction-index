import { execFile } from "node:child_process";
import { cp, mkdtemp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { promisify } from "node:util";

const exec = promisify(execFile);
const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const root = process.cwd();
const bin = (name) => resolve(root, `node_modules/.bin/${name}${process.platform === "win32" ? ".cmd" : ""}`);
const work = await mkdtemp(join(tmpdir(), "whatiuse-dogfood-"));
const tarballs = resolve(work, "tarballs");
const fixture = resolve(work, "issue-workspace");

try {
  await readFile(resolve(root, "dist/package/index.js"));
  await mkdir(tarballs, { recursive: true });
  const packed = await exec(npm, ["pack", "--json", "--pack-destination", tarballs], {
    cwd: root,
    maxBuffer: 32 * 1024 * 1024,
  });
  const filename = JSON.parse(packed.stdout)[0].filename;
  const tarball = resolve(tarballs, filename);

  await cp(resolve(root, "tests/fixtures/issue-workspace"), fixture, { recursive: true });
  const manifestPath = resolve(fixture, "package.json");
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  manifest.dependencies["whatiuse"] = `file:${tarball}`;
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

  const appSource = await readFile(resolve(fixture, "src/App.tsx"), "utf8");
  if (!appSource.includes('from "whatiuse"')) {
    throw new Error("[dogfood] the product must import the component contract from the public package entry point");
  }
  if (/from\s+["'][.]{1,2}\//.test(appSource) || appSource.includes("/src/components")) {
    throw new Error("[dogfood] the product reached into private source instead of the public package API");
  }

  await exec(npm, ["install", "--ignore-scripts", "--no-audit", "--no-fund", "--prefer-offline"], {
    cwd: fixture,
    maxBuffer: 64 * 1024 * 1024,
  });
  await exec(bin("tsc"), ["--noEmit"], { cwd: fixture, maxBuffer: 64 * 1024 * 1024 });
  const built = await exec(bin("vite"), ["build"], { cwd: fixture, maxBuffer: 64 * 1024 * 1024 });
  process.stdout.write(built.stdout);

  const assets = await readdir(resolve(fixture, "dist/assets"));
  const css = (await Promise.all(assets.filter((file) => file.endsWith(".css")).map((file) => readFile(resolve(fixture, "dist/assets", file), "utf8")))).join("\n");
  const js = (await Promise.all(assets.filter((file) => file.endsWith(".js")).map((file) => readFile(resolve(fixture, "dist/assets", file), "utf8")))).join("\n");
  for (const selector of [".whatiuse-action-list", ".whatiuse-dialog", ".whatiuse-shared-detail", ".whatiuse-undo-bar", ".whatiuse-toast"]) {
    if (!css.includes(selector)) throw new Error(`[dogfood] production CSS omitted ${selector}`);
  }
  for (const proof of ["Interface quality", "Issue archived", "Create issue"]) {
    if (!js.includes(proof)) throw new Error(`[dogfood] production JavaScript omitted the ${proof} workflow proof`);
  }

  console.log(`[dogfood] ${filename} built the issue workspace from public exports only`);
} catch (error) {
  if (error?.code === "ENOENT" && String(error?.path).endsWith("dist/package/index.js")) {
    throw new Error("[dogfood] run npm run build:package before the dogfood verification");
  }
  throw error;
} finally {
  await rm(work, { recursive: true, force: true });
}
