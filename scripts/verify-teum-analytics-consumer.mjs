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
const fixture = await mkdtemp(join(tmpdir(), "teum-analytics-consumer-"));
const executable = process.platform === "win32"
  ? resolve(root, "node_modules/.bin/shadcn.cmd")
  : resolve(root, "node_modules/.bin/shadcn");
const evidencePath = resolve(root, "release/teum-analytics-install.json");

let server;

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
  if (!address || typeof address === "string") throw new Error("[teum-analytics-consumer] registry server did not bind a port");
  return `http://127.0.0.1:${address.port}/{name}.json`;
}

try {
  const template = process.env.TEUM_REGISTRY_TEMPLATE ?? await startRegistryServer();
  if (!template.includes("{name}")) throw new Error("[teum-analytics-consumer] registry template must contain {name}");

  await mkdir(resolve(fixture, "src"), { recursive: true });
  await writeFile(resolve(fixture, "src/index.css"), "/* Teum registry components load their own scoped CSS. */\n");
  await writeFile(resolve(fixture, "package.json"), `${JSON.stringify({
    name: "teum-analytics-consumer",
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
  }, null, 2)}\n`);
  await writeFile(resolve(fixture, "components.json"), `${JSON.stringify({
    $schema: "https://ui.shadcn.com/schema.json",
    style: "new-york",
    rsc: false,
    tsx: true,
    tailwind: { config: "", css: "src/index.css", baseColor: "neutral", cssVariables: true, prefix: "" },
    iconLibrary: "lucide",
    aliases: { components: "components", utils: "lib/utils", ui: "components/ui", lib: "lib", hooks: "hooks" },
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
    include: ["src/**/*.ts", "src/**/*.tsx"],
  }, null, 2)}\n`);
  await writeFile(resolve(fixture, "index.html"), '<!doctype html><html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>Teum Analytics consumer</title></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>\n');
  await writeFile(resolve(fixture, "src/main.tsx"), 'import { createRoot } from "react-dom/client";\nimport { AnalyticsRendererGallery, ConversionRetentionRecipe, ProductUsageRecipe, SaaSOverviewRecipe } from "./components/patterns/analytics-recipes";\n\nconst root = document.getElementById("root");\nif (!root) throw new Error("Missing app root");\ncreateRoot(root).render(<main><AnalyticsRendererGallery /><SaaSOverviewRecipe /><ProductUsageRecipe /><ConversionRetentionRecipe /></main>);\n');

  const startedAt = performance.now();
  await exec(executable, ["registry", "add", `@teum-pinned=${template}`, "-c", fixture], {
    cwd: root,
    env: { ...process.env, CI: "1" },
    maxBuffer: 32 * 1024 * 1024,
    timeout: 120_000,
  });
  if (process.env.TEUM_REGISTRY_TEMPLATE) {
    await exec(executable, ["registry", "add", `@teum=${template}`, "-c", fixture], {
      cwd: root,
      env: { ...process.env, CI: "1" },
      maxBuffer: 32 * 1024 * 1024,
      timeout: 120_000,
    });
  }
  const install = await exec(executable, ["add", "@teum-pinned/teum-analytics", "-y", "-c", fixture], {
    cwd: root,
    env: { ...process.env, CI: "1" },
    maxBuffer: 32 * 1024 * 1024,
    timeout: 180_000,
  });
  process.stdout.write(install.stdout);
  process.stderr.write(install.stderr);

  const verifiedFiles = [
    "src/components/patterns/analytics-recipes.tsx",
    "src/components/ui/metric.tsx",
    "src/components/ui/sparkline.tsx",
    "src/components/ui/chart.tsx",
    "src/components/ui/donut-chart.tsx",
    "src/components/ui/heatmap.tsx",
    "src/components/ui/comparison.tsx",
    "src/components/ui/breakdown.tsx",
    "src/components/ui/goal.tsx",
    "src/components/ui/funnel.tsx",
    "src/components/ui/cohort.tsx",
    "src/components/ui/timeline.tsx",
    "src/lib/analytics.ts",
    "src/lib/teum-analytics-contract.ts",
    "src/styles/patterns/analytics-recipes.css",
  ];
  for (const path of verifiedFiles) {
    await access(resolve(fixture, path)).catch(() => {
      throw new Error(`[teum-analytics-consumer] registry install omitted ${path}`);
    });
  }

  const tsc = process.platform === "win32" ? resolve(fixture, "node_modules/.bin/tsc.cmd") : resolve(fixture, "node_modules/.bin/tsc");
  const typecheck = await exec(tsc, ["--noEmit"], { cwd: fixture, maxBuffer: 32 * 1024 * 1024, timeout: 120_000 });
  process.stdout.write(typecheck.stdout);
  process.stderr.write(typecheck.stderr);

  const vite = process.platform === "win32" ? resolve(fixture, "node_modules/.bin/vite.cmd") : resolve(fixture, "node_modules/.bin/vite");
  const build = await exec(vite, ["build"], { cwd: fixture, maxBuffer: 32 * 1024 * 1024, timeout: 120_000 });
  process.stdout.write(build.stdout);
  process.stderr.write(build.stderr);
  await access(resolve(fixture, "dist/index.html"));
  const builtAssets = await readdir(resolve(fixture, "dist/assets"));
  const builtJavaScript = (await Promise.all(builtAssets
    .filter((name) => name.endsWith(".js"))
    .map((name) => readFile(resolve(fixture, "dist/assets", name), "utf8")))).join("\n");
  for (const proof of ["Analytics primitives", "SaaS Overview", "Product Usage", "Conversion & Retention"]) {
    if (!builtJavaScript.includes(proof)) throw new Error(`[teum-analytics-consumer] production bundle omitted ${proof}`);
  }

  const elapsedMs = Math.round(performance.now() - startedAt);
  if (process.env.TEUM_ANALYTICS_EVIDENCE === "1") {
    await writeFile(evidencePath, `${JSON.stringify({
      schemaVersion: 1,
      generatedBy: "scripts/verify-teum-analytics-consumer.mjs",
      generatedAt: new Date().toISOString(),
      version,
      status: "passed",
      fixture: "Fresh React + TypeScript + Vite application using the source registry",
      item: "teum-analytics",
      recipes: ["SaaS Overview", "Product Usage", "Conversion & Retention"],
      components: ["Metric", "Sparkline", "Chart", "DonutChart", "Heatmap", "Comparison", "Breakdown", "Goal", "Funnel", "Cohort", "Timeline"],
      verifiedFiles,
      externalChartRuntime: false,
      semanticDataTable: true,
      typecheck: "passed",
      productionBuild: "passed",
      elapsedMs,
    }, null, 2)}\n`, "utf8");
  }
  console.log(`[teum-analytics-consumer] ${version} installed, type-checked, and built Teum Analytics in ${elapsedMs} ms`);
} finally {
  if (server) await new Promise((resolveClose, reject) => server.close((error) => error ? reject(error) : resolveClose()));
  if (!process.env.TEUM_KEEP_FIXTURE) await rm(fixture, { recursive: true, force: true });
}
