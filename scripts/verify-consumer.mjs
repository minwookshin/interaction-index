import { execFile } from "node:child_process";
import { cp, mkdtemp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { promisify } from "node:util";

const exec = promisify(execFile);
const root = process.cwd();
const rootPackage = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
const npm = process.platform === "win32" ? "npm.cmd" : "npm";

async function readRegistryItem(name) {
  return JSON.parse(await readFile(resolve(root, `public/r/${name}.json`), "utf8"));
}

async function writeRegistryFiles(fixture, items) {
  const targets = new Set();
  for (const item of items) {
    for (const file of item.files) {
      if (targets.has(file.target)) continue;
      targets.add(file.target);
      const target = resolve(fixture, file.target);
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, file.content);
    }
  }
}

async function scaffoldFixture(fixture, mainSource) {
  await cp(resolve(root, "node_modules"), resolve(fixture, "node_modules"), { recursive: true });
  await writeFile(resolve(fixture, "package.json"), JSON.stringify({
    name: "interaction-index-consumer-smoke",
    private: true,
    type: "module",
    scripts: { build: "tsc --noEmit && vite build" },
    dependencies: rootPackage.dependencies,
    devDependencies: rootPackage.devDependencies,
  }, null, 2));
  await writeFile(resolve(fixture, "tsconfig.json"), JSON.stringify({
    compilerOptions: {
      target: "ES2022",
      useDefineForClassFields: true,
      lib: ["ES2022", "DOM", "DOM.Iterable"],
      allowJs: false,
      skipLibCheck: true,
      esModuleInterop: true,
      allowSyntheticDefaultImports: true,
      strict: true,
      forceConsistentCasingInFileNames: true,
      module: "ESNext",
      moduleResolution: "Bundler",
      resolveJsonModule: true,
      isolatedModules: true,
      noEmit: true,
      jsx: "react-jsx"
    },
    include: ["**/*.ts", "**/*.tsx"]
  }, null, 2));
  await writeFile(resolve(fixture, "index.html"), '<div id="root"></div><script type="module" src="/main.tsx"></script>\n');
  await writeFile(resolve(fixture, "vite-env.d.ts"), '/// <reference types="vite/client" />\n');
  await writeFile(resolve(fixture, "main.tsx"), mainSource);
}

async function builtCss(fixture) {
  const assets = await readdir(resolve(fixture, "dist/assets"));
  const cssFiles = assets.filter((file) => file.endsWith(".css"));
  return (await Promise.all(cssFiles.map((file) => readFile(resolve(fixture, "dist/assets", file), "utf8")))).join("\n");
}

async function runFixture(label, items, mainSource, verify) {
  const fixture = await mkdtemp(join(tmpdir(), `interaction-index-${label}-`));
  try {
    await writeRegistryFiles(fixture, items);
    await scaffoldFixture(fixture, mainSource);
    const result = await exec(npm, ["run", "build"], { cwd: fixture, maxBuffer: 16 * 1024 * 1024 });
    process.stdout.write(result.stdout);
    const unexpectedWarnings = result.stderr.split("\n").filter((line) => line && !line.includes("Module level directives cause errors when bundled"));
    if (unexpectedWarnings.length) process.stderr.write(`${unexpectedWarnings.join("\n")}\n`);
    await verify(await builtCss(fixture));
    console.log(`[consumer] ${label} fixture passed and will be removed`);
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
}

const baseItem = await readRegistryItem("interaction-index-base");
const buttonItem = await readRegistryItem("button");
await runFixture(
  "button-only",
  [baseItem, buttonItem],
  `import { StrictMode } from "react";\nimport { createRoot } from "react-dom/client";\nimport { Button } from "./components/ui/button";\nfunction App() { return <main><Button>Verified action</Button></main>; }\ncreateRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);\n`,
  async (css) => {
    if (!css.includes(".ix-button")) throw new Error("[consumer] button-only build omitted Button CSS");
    for (const selector of [".ix-dialog", ".ix-table", ".ix-shared-detail"]) {
      if (css.includes(selector)) throw new Error(`[consumer] button-only build leaked ${selector}`);
    }
    if (!css.includes("@layer index.tokens,index.base,index.components")) {
      throw new Error("[consumer] button-only build omitted the public cascade order");
    }
  },
);

const completeItem = await readRegistryItem("interaction-index");
await runFixture(
  "complete-system",
  [completeItem],
  `import { StrictMode } from "react";\nimport { createRoot } from "react-dom/client";\nimport { Button, SharedDetail, UndoBar, UndoStackProvider } from "./components/ui";\nimport "./styles/interaction-index.css";\nconst items = [{ id: "one", title: "Consumer proof", meta: "INT-001", description: "Installed from generated registry source." }];\nfunction App() { return <UndoStackProvider><main><Button>Verified action</Button><SharedDetail items={items} defaultSelectedId="one" /><UndoBar /></main></UndoStackProvider>; }\ncreateRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);\n`,
  async (css) => {
    for (const selector of [".ix-button", ".ix-dialog", ".ix-table", ".ix-shared-detail"]) {
      if (!css.includes(selector)) throw new Error(`[consumer] complete-system build omitted ${selector}`);
    }
  },
);
