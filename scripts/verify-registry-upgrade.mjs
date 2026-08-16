import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve, sep } from "node:path";
import { promisify } from "node:util";
import { registryItemSchema } from "shadcn/schema";

const exec = promisify(execFile);
const root = process.cwd();
const packageJson = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
const versionRoot = resolve(root, "public/r/v", packageJson.version);
const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const hash = (value) => createHash("sha256").update(value).digest("hex");
const fail = (message) => { throw new Error(`[registry-upgrade] ${message}`); };

async function readItem(name) {
  const item = JSON.parse(await readFile(resolve(versionRoot, `${name}.json`), "utf8"));
  return registryItemSchema.parse(item);
}

function targetPath(fixture, target) {
  if (!target || target.startsWith("/") || target.split(/[\\/]/).includes("..")) fail(`unsafe registry target: ${target}`);
  const path = resolve(fixture, target);
  if (!path.startsWith(`${fixture}${sep}`)) fail(`registry target escaped the fixture: ${target}`);
  return path;
}

async function writeItemFiles(fixture, items) {
  const baseline = new Map();
  for (const item of items) {
    for (const file of item.files ?? []) {
      if (!file.target || typeof file.content !== "string") fail(`${item.name} contains an incomplete file payload`);
      const path = targetPath(fixture, file.target);
      await mkdir(dirname(path), { recursive: true });
      await writeFile(path, file.content, "utf8");
      baseline.set(file.target, hash(file.content));
    }
  }
  return baseline;
}

async function scaffold(fixture) {
  await symlink(resolve(root, "node_modules"), resolve(fixture, "node_modules"), "dir");
  await writeFile(resolve(fixture, "package.json"), `${JSON.stringify({
    name: "teum-upgrade-consumer",
    private: true,
    type: "module",
    scripts: { build: "tsc --noEmit && vite build" },
    dependencies: packageJson.dependencies,
    devDependencies: packageJson.devDependencies,
  }, null, 2)}\n`, "utf8");
  await writeFile(resolve(fixture, "tsconfig.json"), `${JSON.stringify({
    compilerOptions: {
      target: "ES2022",
      lib: ["ES2022", "DOM", "DOM.Iterable"],
      strict: true,
      skipLibCheck: true,
      module: "ESNext",
      moduleResolution: "Bundler",
      resolveJsonModule: true,
      isolatedModules: true,
      noEmit: true,
      jsx: "react-jsx",
    },
    include: ["**/*.ts", "**/*.tsx"],
  }, null, 2)}\n`, "utf8");
  await writeFile(resolve(fixture, "index.html"), '<div id="root"></div><script type="module" src="/main.tsx"></script>\n', "utf8");
  await writeFile(resolve(fixture, "vite-env.d.ts"), '/// <reference types="vite/client" />\n', "utf8");
  await writeFile(resolve(fixture, "main.tsx"), 'import { createRoot } from "react-dom/client";\nimport { Button } from "./components/ui/button";\ncreateRoot(document.getElementById("root")!).render(<Button>Consumer action</Button>);\n', "utf8");
}

async function build(fixture, phase) {
  const result = await exec(npm, ["run", "build"], { cwd: fixture, maxBuffer: 16 * 1024 * 1024 });
  if (result.stderr) {
    const unexpected = result.stderr.split("\n").filter((line) => line && !line.includes("Module level directives cause errors when bundled"));
    if (unexpected.length) process.stderr.write(`${unexpected.join("\n")}\n`);
  }
  console.log(`[registry-upgrade] ${phase} consumer build passed`);
}

const baseItem = await readItem("teum-base");
const buttonItem = await readItem("button");
const fixture = await mkdtemp(join(tmpdir(), "teum-upgrade-"));

try {
  const baseline = await writeItemFiles(fixture, [baseItem, buttonItem]);
  await scaffold(fixture);
  await build(fixture, "installed");

  const buttonFile = buttonItem.files?.find((file) => file.target === "components/ui/button.tsx");
  if (!buttonFile?.target || typeof buttonFile.content !== "string") fail("button source payload is missing");
  const installedButtonPath = targetPath(fixture, buttonFile.target);
  const localMarker = "// local consumer customization: keep compact billing action\n";
  await writeFile(installedButtonPath, `${await readFile(installedButtonPath, "utf8")}\n${localMarker}`, "utf8");

  const upgradeItem = structuredClone(buttonItem);
  const upgradeFile = upgradeItem.files?.find((file) => file.target === buttonFile.target);
  if (!upgradeFile || typeof upgradeFile.content !== "string") fail("synthetic upstream candidate is missing button source");
  const upstreamMarker = "// synthetic next-version candidate used only by the upgrade contract test\n";
  upgradeFile.content = `${upgradeFile.content}\n${upstreamMarker}`;

  const conflicts = [];
  for (const file of upgradeItem.files ?? []) {
    if (!file.target || typeof file.content !== "string") continue;
    const current = await readFile(targetPath(fixture, file.target), "utf8");
    if (hash(current) !== baseline.get(file.target) && hash(current) !== hash(file.content)) conflicts.push(file);
  }
  if (conflicts.length !== 1 || conflicts[0].target !== buttonFile.target) fail("local source change was not isolated as one upgrade conflict");

  const stagedRoot = resolve(fixture, ".index-update", "synthetic-next");
  for (const file of conflicts) {
    const staged = targetPath(stagedRoot, file.target);
    await mkdir(dirname(staged), { recursive: true });
    await writeFile(staged, file.content, "utf8");
  }
  const preserved = await readFile(installedButtonPath, "utf8");
  if (!preserved.includes(localMarker.trim())) fail("non-destructive review overwrote the consumer customization");
  if (!(await readFile(resolve(stagedRoot, buttonFile.target), "utf8")).includes(upstreamMarker.trim())) fail("upstream candidate was not staged for review");
  console.log(`[registry-upgrade] preserved local modification and staged ${relative(fixture, resolve(stagedRoot, buttonFile.target))}`);

  for (const file of upgradeItem.files ?? []) {
    if (!file.target || typeof file.content !== "string") continue;
    await writeFile(targetPath(fixture, file.target), file.content, "utf8");
  }
  const accepted = await readFile(installedButtonPath, "utf8");
  if (accepted.includes(localMarker.trim()) || !accepted.includes(upstreamMarker.trim())) fail("explicit acceptance did not replace the reviewed conflict");
  await build(fixture, "accepted upgrade");
  console.log(`[registry-upgrade] verified install → local modification → staged review → explicit upgrade for ${packageJson.version}`);
} finally {
  await rm(fixture, { recursive: true, force: true });
}
