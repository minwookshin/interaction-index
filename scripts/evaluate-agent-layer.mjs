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
const contract = JSON.parse(await readFile(resolve(root, "agent/generated/teum-agent.json"), "utf8"));
const evaluation = JSON.parse(await readFile(resolve(root, "agent/evals/product-tasks.json"), "utf8"));
const mutableRegistryRoot = resolve(root, "public/r");
const versionedRegistryRoot = resolve(root, "public/r/v", packageJson.version);
const hasVersionedAgent = await access(resolve(versionedRegistryRoot, "teum-agent.json")).then(() => true).catch(() => false);
const registryRoot = hasVersionedAgent ? versionedRegistryRoot : mutableRegistryRoot;
const registryScope = hasVersionedAgent ? "@teum-pinned" : "@teum";
const fixture = await mkdtemp(join(tmpdir(), "teum-agent-evaluation-"));
const executable = process.platform === "win32" ? resolve(root, "node_modules/.bin/shadcn.cmd") : resolve(root, "node_modules/.bin/shadcn");
const evidencePath = resolve(root, "release/agent-evaluation.json");
let server;

const normalize = (value) => value.toLocaleLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

function selectRecipe(prompt) {
  const task = normalize(prompt);
  return contract.recipes.map((recipe) => {
    const matchedSignals = recipe.signals.filter((signal) => task.includes(normalize(signal)));
    const score = matchedSignals.reduce((sum, signal) => sum + normalize(signal).split(" ").length, 0);
    return { recipe, score, matchedSignals };
  }).filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score || left.recipe.id.localeCompare(right.recipe.id))[0] ?? null;
}

function importPath(modulePath) {
  return `./${modulePath.replace(/^components\//, "components/")}`;
}

async function startRegistryServer() {
  server = createServer(async (request, response) => {
    const name = decodeURIComponent(new URL(request.url ?? "/", "http://localhost").pathname.slice(1));
    if (!/^[a-z0-9.-]+\.json$/.test(name)) return response.writeHead(404).end("Not found");
    try {
      const source = await readFile(resolve(registryRoot, name));
      response.writeHead(200, {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
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
  if (!address || typeof address === "string") throw new Error("[agent-evaluation] registry server did not bind a port");
  return `http://127.0.0.1:${address.port}/{name}.json`;
}

if (evaluation.schemaVersion !== 1 || evaluation.tasks.length !== 30) {
  throw new Error(`[agent-evaluation] expected schema version 1 with 30 tasks, received ${evaluation.tasks.length}`);
}

const ids = new Set();
const results = evaluation.tasks.map((task) => {
  if (ids.has(task.id)) throw new Error(`[agent-evaluation] duplicate task id ${task.id}`);
  ids.add(task.id);
  const selection = selectRecipe(task.prompt);
  const selected = selection?.recipe ?? null;
  const violations = [];
  if (!selected) violations.push("No recipe selected");
  if (selected && selected.id !== task.expectedRecipe) violations.push(`Selected ${selected.id}; expected ${task.expectedRecipe}`);
  for (const component of task.requiredComponents) {
    if (!selected?.components.includes(component)) violations.push(`Missing required component ${component}`);
  }
  for (const component of task.forbiddenComponents) {
    if (selected?.components.includes(component)) violations.push(`Included forbidden component ${component}`);
  }
  if (selected && (!selected.rules.length || !selected.forbidden.length || !selected.state.length)) {
    violations.push("Selected recipe has an incomplete composition contract");
  }
  return {
    id: task.id,
    expectedRecipe: task.expectedRecipe,
    selectedRecipe: selected?.id ?? null,
    matchedSignals: selection?.matchedSignals ?? [],
    score: selection?.score ?? 0,
    requiredComponents: task.requiredComponents,
    forbiddenComponents: task.forbiddenComponents,
    violations,
    status: violations.length ? "failed" : "passed",
  };
});

const contractViolations = results.reduce((total, result) => total + result.violations.length, 0);
if (contractViolations) {
  const failures = results.filter(({ violations }) => violations.length);
  throw new Error(`[agent-evaluation] ${contractViolations} contract violations: ${JSON.stringify(failures)}`);
}

try {
  const template = process.env.TEUM_REGISTRY_TEMPLATE ?? await startRegistryServer();
  if (!template.includes("{name}")) throw new Error("[agent-evaluation] registry template must contain {name}");
  await mkdir(resolve(fixture, "src/generated"), { recursive: true });
  await writeFile(resolve(fixture, "src/index.css"), "/* Teum source registry owns component CSS. */\n");
  await writeFile(resolve(fixture, "package.json"), `${JSON.stringify({
    name: "teum-agent-evaluation", private: true, version: "0.0.0", type: "module",
    dependencies: { react: packageJson.devDependencies.react, "react-dom": packageJson.devDependencies["react-dom"] },
    devDependencies: { "@types/react": packageJson.devDependencies["@types/react"], "@types/react-dom": packageJson.devDependencies["@types/react-dom"], typescript: packageJson.devDependencies.typescript, vite: packageJson.devDependencies.vite },
  }, null, 2)}\n`);
  await writeFile(resolve(fixture, "components.json"), `${JSON.stringify({
    $schema: "https://ui.shadcn.com/schema.json", style: "new-york", rsc: false, tsx: true,
    tailwind: { config: "", css: "src/index.css", baseColor: "neutral", cssVariables: true, prefix: "" },
    iconLibrary: "lucide", aliases: { components: "components", utils: "lib/utils", ui: "components/ui", lib: "lib", hooks: "hooks" },
  }, null, 2)}\n`);
  await writeFile(resolve(fixture, "tsconfig.json"), `${JSON.stringify({
    compilerOptions: { target: "ES2022", lib: ["ES2022", "DOM", "DOM.Iterable"], module: "ESNext", moduleResolution: "Bundler", types: ["vite/client"], jsx: "react-jsx", strict: true, noEmit: true },
    include: ["src/**/*.ts", "src/**/*.tsx"],
  }, null, 2)}\n`);
  await writeFile(resolve(fixture, "index.html"), '<!doctype html><html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /><title>Teum agent evaluation</title></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>\n');

  const startedAt = performance.now();
  await exec(executable, ["registry", "add", `${registryScope}=${template}`, "-c", fixture], { cwd: root, env: { ...process.env, CI: "1" }, maxBuffer: 32 * 1024 * 1024, timeout: 120_000 });
  const install = await exec(executable, ["add", `${registryScope}/teum-agent`, "-y", "-c", fixture], { cwd: root, env: { ...process.env, CI: "1" }, maxBuffer: 64 * 1024 * 1024, timeout: 240_000 });
  process.stdout.write(install.stdout); process.stderr.write(install.stderr);
  await access(resolve(fixture, "src/lib/teum-agent.json"));
  await access(resolve(fixture, "src/lib/teum-agent-contract.ts"));

  const modules = [];
  for (const [index, task] of evaluation.tasks.entries()) {
    const recipe = contract.recipes.find(({ id }) => id === task.expectedRecipe);
    if (!recipe) throw new Error(`[agent-evaluation] missing recipe ${task.expectedRecipe}`);
    const name = `Task${String(index + 1).padStart(2, "0")}`;
    const path = resolve(fixture, `src/generated/${task.id}.tsx`);
    await writeFile(path, `import { ${recipe.exportName} } from "../${importPath(recipe.modulePath).slice(2)}";\nexport function ${name}() { return <section data-agent-task="${task.id}"><${recipe.exportName} /></section>; }\n`);
    modules.push({ name, id: task.id, file: `./generated/${task.id}` });
  }
  const imports = modules.map(({ name, file }) => `import { ${name} } from "${file}";`).join("\n");
  const renders = modules.map(({ name }) => `<${name} />`).join("\n");
  await writeFile(resolve(fixture, "src/main.tsx"), `import { createRoot } from "react-dom/client";\n${imports}\nconst root = document.getElementById("root");\nif (!root) throw new Error("Missing app root");\ncreateRoot(root).render(<main>${renders}</main>);\n`);

  const tsc = process.platform === "win32" ? resolve(fixture, "node_modules/.bin/tsc.cmd") : resolve(fixture, "node_modules/.bin/tsc");
  await exec(tsc, ["--noEmit"], { cwd: fixture, maxBuffer: 64 * 1024 * 1024, timeout: 180_000 });
  const vite = process.platform === "win32" ? resolve(fixture, "node_modules/.bin/vite.cmd") : resolve(fixture, "node_modules/.bin/vite");
  await exec(vite, ["build"], { cwd: fixture, maxBuffer: 64 * 1024 * 1024, timeout: 180_000 });
  await access(resolve(fixture, "dist/index.html"));
  const assets = await readdir(resolve(fixture, "dist/assets"));
  const bundle = (await Promise.all(assets.filter((name) => name.endsWith(".js")).map((name) => readFile(resolve(fixture, "dist/assets", name), "utf8")))).join("\n");
  for (const task of evaluation.tasks) if (!bundle.includes(task.id)) throw new Error(`[agent-evaluation] production bundle omitted ${task.id}`);

  const elapsedMs = Math.round(performance.now() - startedAt);
  const evidence = {
    schemaVersion: 1,
    generatedBy: "scripts/evaluate-agent-layer.mjs",
    generatedAt: new Date().toISOString(),
    version: packageJson.version,
    status: "passed",
    scope: "One clean React + TypeScript + Vite consumer installed the Teum agent registry item; 30 generated task modules were collectively type-checked and production-built.",
    taskCount: results.length,
    selectedCorrectly: results.filter(({ status }) => status === "passed").length,
    selectionSuccessRate: 1,
    installBuildSuccessRate: 1,
    contractViolations,
    cleanInstall: "passed",
    typecheck: "passed",
    productionBuild: "passed",
    installedItem: `${registryScope}/teum-agent`,
    registryChannel: hasVersionedAgent ? "immutable versioned" : "mutable pre-release",
    elapsedMs,
    results,
  };
  if (process.env.TEUM_AGENT_EVIDENCE === "1") await writeFile(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
  console.log(`[agent-evaluation] ${results.length}/${results.length} tasks selected correctly; clean install and production build passed with ${contractViolations} contract violations in ${elapsedMs} ms`);
} finally {
  if (server) await new Promise((resolveClose, reject) => server.close((error) => error ? reject(error) : resolveClose()));
  if (!process.env.TEUM_KEEP_FIXTURE) await rm(fixture, { recursive: true, force: true });
}
