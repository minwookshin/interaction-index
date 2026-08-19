import { execFile } from "node:child_process";
import { createServer } from "node:http";
import { cp, mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { promisify } from "node:util";

export const exec = promisify(execFile);
export const root = process.cwd();
export const packageJson = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
export const shadcnCli = `shadcn@${packageJson.devDependencies.shadcn}`;
export const shadcnExecutable = process.platform === "win32"
  ? resolve(root, "node_modules/.bin/shadcn.cmd")
  : resolve(root, "node_modules/.bin/shadcn");

export async function createExampleFixture(exampleName, prefix) {
  const fixture = await mkdtemp(join(tmpdir(), prefix));
  await cp(resolve(root, "examples", exampleName), fixture, { recursive: true });
  return fixture;
}

export async function removeFixture(fixture) {
  await rm(fixture, { recursive: true, force: true });
}

export async function startRegistryServer(version = packageJson.version) {
  const versionedRoot = resolve(root, "public/r/v", version);
  const server = createServer(async (request, response) => {
    const pathname = new URL(request.url ?? "/", "http://localhost").pathname;
    const name = decodeURIComponent(pathname.slice(1));
    if (!/^[a-z0-9.-]+\.json$/.test(name)) {
      response.writeHead(404).end("Not found");
      return;
    }
    try {
      const source = await readFile(resolve(versionedRoot, name));
      response.writeHead(200, {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "public, max-age=31536000, immutable",
        "x-content-type-options": "nosniff",
      });
      response.end(source);
    } catch {
      response.writeHead(404).end("Not found");
    }
  });
  await new Promise((resolveListen, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolveListen);
  });
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("[adoption] local registry did not bind a port");
  return {
    template: `http://127.0.0.1:${address.port}/{name}.json`,
    close: () => new Promise((resolveClose, reject) => server.close((error) => error ? reject(error) : resolveClose())),
  };
}

export async function run(command, args, options = {}) {
  const result = await exec(command, args, {
    cwd: options.cwd ?? root,
    env: { ...process.env, CI: "1", ...options.env },
    maxBuffer: options.maxBuffer ?? 64 * 1024 * 1024,
    timeout: options.timeout ?? 240_000,
  });
  if (options.print !== false) {
    process.stdout.write(result.stdout);
    process.stderr.write(result.stderr);
  }
  return result;
}

export async function configureAndInstall(fixture, template, item = "button", namespace = "@whatiuse") {
  await run(shadcnExecutable, ["registry", "add", `${namespace}=${template}`, "-c", fixture]);
  const configured = JSON.parse(await readFile(resolve(fixture, "components.json"), "utf8"));
  if (configured.registries?.[namespace] !== template) {
    throw new Error(`[adoption] registry add did not persist ${namespace} in components.json`);
  }
  await run(shadcnExecutable, ["add", `${namespace}/${item}`, "-y", "-c", fixture]);
}

export async function readFilesContaining(directory, pattern) {
  const { readdir } = await import("node:fs/promises");
  const entries = await readdir(directory, { recursive: true, withFileTypes: true }).catch(() => []);
  const sources = [];
  for (const entry of entries) {
    if (!entry.isFile() || !pattern.test(entry.name)) continue;
    sources.push(await readFile(resolve(entry.parentPath, entry.name), "utf8"));
  }
  return sources.join("\n");
}
