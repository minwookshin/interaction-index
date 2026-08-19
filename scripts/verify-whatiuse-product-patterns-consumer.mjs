import { execFile } from "node:child_process";
import { createServer } from "node:http";
import { access, mkdtemp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { performance } from "node:perf_hooks";
import { join, resolve } from "node:path";
import { promisify } from "node:util";

const exec = promisify(execFile);
const root = process.cwd();
const packageJson = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
const version = packageJson.version;
const versionedRoot = resolve(root, "public/r/v", version);
const fixture = await mkdtemp(join(tmpdir(), "whatiuse-product-patterns-consumer-"));
const executable = process.platform === "win32" ? resolve(root, "node_modules/.bin/shadcn.cmd") : resolve(root, "node_modules/.bin/shadcn");
const evidencePath = resolve(root, "release/whatiuse-product-patterns-install.json");
let server;

async function startRegistryServer() {
  server = createServer(async (request, response) => {
    const name = decodeURIComponent(new URL(request.url ?? "/", "http://localhost").pathname.slice(1));
    if (!/^[a-z0-9.-]+\.json$/.test(name)) return response.writeHead(404).end("Not found");
    try {
      const source = await readFile(resolve(versionedRoot, name));
      response.writeHead(200, { "content-type": "application/json; charset=utf-8", "cache-control": "public, max-age=31536000, immutable", "x-content-type-options": "nosniff" });
      response.end(source);
    } catch {
      response.writeHead(404).end("Not found");
    }
  });
  await new Promise((resolveListen, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", resolveListen); });
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("[whatiuse-product-patterns-consumer] registry server did not bind a port");
  return `http://127.0.0.1:${address.port}/{name}.json`;
}

try {
  const template = process.env.WHATIUSE_REGISTRY_TEMPLATE ?? await startRegistryServer();
  if (!template.includes("{name}")) throw new Error("[whatiuse-product-patterns-consumer] registry template must contain {name}");
  await mkdir(resolve(fixture, "src"), { recursive: true });
  await writeFile(resolve(fixture, "src/index.css"), "/* Registry components load scoped CSS. */\n");
  await writeFile(resolve(fixture, "package.json"), `${JSON.stringify({
    name: "whatiuse-product-patterns-consumer", private: true, version: "0.0.0", type: "module",
    dependencies: { react: packageJson.devDependencies.react, "react-dom": packageJson.devDependencies["react-dom"] },
    devDependencies: { "@types/react": packageJson.devDependencies["@types/react"], "@types/react-dom": packageJson.devDependencies["@types/react-dom"], typescript: packageJson.devDependencies.typescript, vite: packageJson.devDependencies.vite },
  }, null, 2)}\n`);
  await writeFile(resolve(fixture, "components.json"), `${JSON.stringify({
    $schema: "https://ui.shadcn.com/schema.json", style: "new-york", rsc: false, tsx: true,
    tailwind: { config: "", css: "src/index.css", baseColor: "neutral", cssVariables: true, prefix: "" },
    iconLibrary: "lucide", aliases: { components: "components", utils: "lib/utils", ui: "components/ui", lib: "lib", hooks: "hooks" },
  }, null, 2)}\n`);
  await writeFile(resolve(fixture, "tsconfig.json"), `${JSON.stringify({ compilerOptions: { target: "ES2022", lib: ["ES2022", "DOM", "DOM.Iterable"], module: "ESNext", moduleResolution: "Bundler", types: ["vite/client"], jsx: "react-jsx", strict: true, noEmit: true }, include: ["src/**/*.ts", "src/**/*.tsx"] }, null, 2)}\n`);
  await writeFile(resolve(fixture, "index.html"), '<!doctype html><html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /><title>whatiuse Product Patterns consumer</title></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>\n');
  await writeFile(resolve(fixture, "src/main.tsx"), 'import { createRoot } from "react-dom/client";\nimport { BillingUsageRecipe, CustomerWorkspaceRecipe, MembersPermissionsRecipe } from "./components/patterns/product-pattern-recipes";\nconst root = document.getElementById("root");\nif (!root) throw new Error("Missing app root");\ncreateRoot(root).render(<main><CustomerWorkspaceRecipe /><BillingUsageRecipe /><MembersPermissionsRecipe /></main>);\n');

  const startedAt = performance.now();
  await exec(executable, ["registry", "add", `@whatiuse=${template}`, "-c", fixture], { cwd: root, env: { ...process.env, CI: "1" }, maxBuffer: 32 * 1024 * 1024, timeout: 120_000 });
  const install = await exec(executable, ["add", "@whatiuse/whatiuse-product-patterns", "-y", "-c", fixture], { cwd: root, env: { ...process.env, CI: "1" }, maxBuffer: 32 * 1024 * 1024, timeout: 180_000 });
  process.stdout.write(install.stdout); process.stderr.write(install.stderr);

  const verifiedFiles = [
    "src/components/patterns/product-pattern-recipes.tsx",
    "src/lib/whatiuse-product-patterns-contract.ts",
    "src/styles/patterns/product-pattern-recipes.css",
    "src/components/ui/shared-detail.tsx",
    "src/components/ui/data-table.tsx",
    "src/components/ui/chart.tsx",
    "src/components/ui/dialog.tsx",
  ];
  for (const path of verifiedFiles) await access(resolve(fixture, path)).catch(() => { throw new Error(`[whatiuse-product-patterns-consumer] registry install omitted ${path}`); });

  const tsc = process.platform === "win32" ? resolve(fixture, "node_modules/.bin/tsc.cmd") : resolve(fixture, "node_modules/.bin/tsc");
  await exec(tsc, ["--noEmit"], { cwd: fixture, maxBuffer: 32 * 1024 * 1024, timeout: 120_000 });
  const vite = process.platform === "win32" ? resolve(fixture, "node_modules/.bin/vite.cmd") : resolve(fixture, "node_modules/.bin/vite");
  await exec(vite, ["build"], { cwd: fixture, maxBuffer: 32 * 1024 * 1024, timeout: 120_000 });
  await access(resolve(fixture, "dist/index.html"));
  const assets = await readdir(resolve(fixture, "dist/assets"));
  const builtJavaScript = (await Promise.all(assets.filter((name) => name.endsWith(".js")).map((name) => readFile(resolve(fixture, "dist/assets", name), "utf8")))).join("\n");
  for (const proof of ["Customer Workspace", "Billing & Usage", "Members & Permissions"]) if (!builtJavaScript.includes(proof)) throw new Error(`[whatiuse-product-patterns-consumer] production bundle omitted ${proof}`);

  const elapsedMs = Math.round(performance.now() - startedAt);
  if (process.env.WHATIUSE_PRODUCT_PATTERNS_EVIDENCE === "1") await writeFile(evidencePath, `${JSON.stringify({
    schemaVersion: 1, generatedBy: "scripts/verify-whatiuse-product-patterns-consumer.mjs", generatedAt: new Date().toISOString(), version, status: "passed",
    fixture: "Fresh React + TypeScript + Vite application using the source registry", item: "whatiuse-product-patterns",
    recipes: ["Customer Workspace", "Billing & Usage", "Members & Permissions"], verifiedFiles, typecheck: "passed", productionBuild: "passed", elapsedMs,
  }, null, 2)}\n`, "utf8");
  console.log(`[whatiuse-product-patterns-consumer] ${version} installed, type-checked, and built three Product Patterns in ${elapsedMs} ms`);
} finally {
  if (server) await new Promise((resolveClose, reject) => server.close((error) => error ? reject(error) : resolveClose()));
  if (!process.env.WHATIUSE_KEEP_FIXTURE) await rm(fixture, { recursive: true, force: true });
}
