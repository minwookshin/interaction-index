import { execFile } from "node:child_process";
import { createServer } from "node:http";
import { access, mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { promisify } from "node:util";

const exec = promisify(execFile);
const root = process.cwd();
const packageJson = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
const version = packageJson.version;
const versionedRoot = resolve(root, "public/r/v", version);
const fixture = await mkdtemp(join(tmpdir(), "teum-shadcn-consumer-"));
const executable = process.platform === "win32"
  ? resolve(root, "node_modules/.bin/shadcn.cmd")
  : resolve(root, "node_modules/.bin/shadcn");

let server;
let template = process.env.TEUM_REGISTRY_TEMPLATE;

async function startRegistryServer() {
  server = createServer(async (request, response) => {
    const name = decodeURIComponent(new URL(request.url ?? "/", "http://localhost").pathname.slice(1));
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
  if (!address || typeof address === "string") throw new Error("[shadcn-consumer] local registry did not bind a port");
  return `http://127.0.0.1:${address.port}/{name}.json`;
}

try {
  if (!template) template = await startRegistryServer();
  if (!template.includes("{name}")) throw new Error("[shadcn-consumer] registry template must contain {name}");

  await mkdir(resolve(fixture, "src"), { recursive: true });
  await writeFile(resolve(fixture, "src/index.css"), "/* Plain CSS consumer: Tailwind is intentionally not installed. */\n");
  await writeFile(resolve(fixture, "package.json"), `${JSON.stringify({
    name: "teum-shadcn-consumer",
    private: true,
    version: "0.0.0",
    type: "module",
    dependencies: {
      react: packageJson.devDependencies.react,
      "react-dom": packageJson.devDependencies["react-dom"],
    },
    devDependencies: {
      "@types/react": packageJson.devDependencies["@types/react"],
      "@types/react-dom": packageJson.devDependencies["@types/react-dom"],
      typescript: packageJson.devDependencies.typescript,
      vite: packageJson.devDependencies.vite,
    },
    registries: { "@teum-pinned": template },
  }, null, 2)}\n`);
  await writeFile(resolve(fixture, "components.json"), `${JSON.stringify({
    $schema: "https://ui.shadcn.com/schema.json",
    style: "new-york",
    rsc: false,
    tsx: true,
    tailwind: {
      config: "",
      css: "src/index.css",
      baseColor: "neutral",
      cssVariables: true,
      prefix: "",
    },
    iconLibrary: "lucide",
    aliases: {
      components: "components",
      utils: "lib/utils",
      ui: "components/ui",
      lib: "lib",
      hooks: "hooks",
    },
  }, null, 2)}\n`);
  await writeFile(resolve(fixture, "tsconfig.json"), `${JSON.stringify({
    compilerOptions: {
      target: "ES2022",
      lib: ["ES2022", "DOM", "DOM.Iterable"],
      module: "ESNext",
      moduleResolution: "Bundler",
      types: ["vite/client"],
      jsx: "react-jsx",
      strict: true,
      noEmit: true,
    },
    include: ["**/*.ts", "**/*.tsx"],
  }, null, 2)}\n`);
  await writeFile(resolve(fixture, "src/main.tsx"), 'import { Button } from "./components/ui/button";\nexport const ConsumerProof = () => <Button>Verified action</Button>;\n');

  const result = await exec(executable, ["add", "@teum-pinned/button", "@teum-pinned/teum-tailwind", "-y", "-c", fixture], {
    cwd: root,
    env: { ...process.env, CI: "1" },
    maxBuffer: 16 * 1024 * 1024,
    timeout: 120_000,
  });
  process.stdout.write(result.stdout);
  process.stderr.write(result.stderr);

  for (const path of [
    "src/components/ui/button.tsx",
    "src/lib/cn.ts",
    "src/styles/teum-base.css",
    "src/styles/components/button.css",
    "src/styles/teum-tailwind.css",
  ]) {
    await access(resolve(fixture, path)).catch(() => {
      throw new Error(`[shadcn-consumer] CLI did not install ${path}`);
    });
  }

  const installedPackage = JSON.parse(await readFile(resolve(fixture, "package.json"), "utf8"));
  const dependencies = installedPackage.dependencies ?? {};
  for (const dependency of ["@base-ui/react", "@fontsource-variable/inter", "class-variance-authority", "clsx", "tailwind-merge"]) {
    if (!dependencies[dependency]) throw new Error(`[shadcn-consumer] CLI omitted ${dependency}`);
  }
  if (dependencies.tailwindcss || installedPackage.devDependencies?.tailwindcss) {
    throw new Error("[shadcn-consumer] plain CSS install unexpectedly added Tailwind CSS");
  }
  if (Object.keys(installedPackage.registries ?? {}).some((name) => name === "@teum")) {
    throw new Error("[shadcn-consumer] pinned install silently depends on the mutable registry");
  }

  const tsc = process.platform === "win32"
    ? resolve(fixture, "node_modules/.bin/tsc.cmd")
    : resolve(fixture, "node_modules/.bin/tsc");
  const typecheck = await exec(tsc, ["--noEmit"], { cwd: fixture, maxBuffer: 16 * 1024 * 1024, timeout: 120_000 });
  process.stdout.write(typecheck.stdout);
  process.stderr.write(typecheck.stderr);

  console.log(`[shadcn-consumer] ${version} installed and type-checked Button, base CSS, and the optional Tailwind bridge from ${template}`);
} finally {
  if (server) await new Promise((resolveClose, reject) => server.close((error) => error ? reject(error) : resolveClose()));
  if (!process.env.TEUM_KEEP_FIXTURE) await rm(fixture, { recursive: true, force: true });
}
