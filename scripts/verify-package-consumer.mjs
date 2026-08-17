import { execFile } from "node:child_process";
import { lstat, mkdtemp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { basename, isAbsolute, join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { promisify } from "node:util";

const exec = promisify(execFile);
const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const root = process.cwd();
const bin = (name) => resolve(root, `node_modules/.bin/${name}${process.platform === "win32" ? ".cmd" : ""}`);
const packageJson = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
const publicApi = JSON.parse(await readFile(resolve(root, "api/generated/public-api.json"), "utf8"));
const expectedRuntimeExports = publicApi.indexRuntimeExports;
const work = await mkdtemp(join(tmpdir(), "teum-package-"));
const tarballs = resolve(work, "tarballs");
const fixture = resolve(work, "consumer");

try {
  await mkdir(tarballs, { recursive: true });
  const providedTarball = process.env.TEUM_PACKAGE_TARBALL;
  if (providedTarball && !isAbsolute(providedTarball)) throw new Error("[package-consumer] TEUM_PACKAGE_TARBALL must be an absolute path");
  const packed = providedTarball ? null : await exec(npm, ["pack", "--json", "--pack-destination", tarballs], { cwd: root, maxBuffer: 32 * 1024 * 1024 });
  const tarball = providedTarball ? resolve(providedTarball) : resolve(tarballs, JSON.parse(packed.stdout)[0].filename);
  const filename = basename(tarball);
  await lstat(tarball).then((stat) => { if (!stat.isFile()) throw new Error("[package-consumer] package tarball is not a regular file"); });
  await mkdir(fixture, { recursive: true });
  await writeFile(resolve(fixture, "package.json"), `${JSON.stringify({
    name: "teum-package-consumer",
    private: true,
    type: "module",
    scripts: { build: "tsc --noEmit && vite build" },
    dependencies: {
      "teum": `file:${tarball}`,
      react: packageJson.peerDependencies.react,
      "react-dom": packageJson.peerDependencies["react-dom"],
    },
    devDependencies: {
      "@types/react": packageJson.devDependencies["@types/react"],
      "@types/react-dom": packageJson.devDependencies["@types/react-dom"],
      jsdom: packageJson.devDependencies.jsdom,
    },
  }, null, 2)}\n`);
  await writeFile(resolve(fixture, "tsconfig.json"), `${JSON.stringify({
    compilerOptions: {
      target: "ES2022",
      lib: ["ES2022", "DOM", "DOM.Iterable"],
      strict: true,
      skipLibCheck: true,
      module: "ESNext",
      moduleResolution: "Bundler",
      jsx: "react-jsx",
      noEmit: true,
    },
    include: ["main.tsx"],
  }, null, 2)}\n`);
  await writeFile(resolve(fixture, "index.html"), '<div id="root"></div><script type="module" src="/main.tsx"></script>\n');
  await writeFile(resolve(fixture, "main.tsx"), `import { createRoot } from "react-dom/client";\nimport { Button, SharedDetail } from "teum";\nimport { tokenPaths, tokenVar } from "teum/tokens";\nimport "teum/styles.css";\nconst items = [{ id: "one", title: "Package proof", meta: "PKG-001", description: tokenVar(tokenPaths[0]) }];\ncreateRoot(document.getElementById("root")!).render(<main><Button>Verified package</Button><SharedDetail items={items} defaultSelectedId="one" /></main>);\n`);
  await writeFile(resolve(fixture, "app.mjs"), `import React from "react";
import { Badge, Button, SharedDetail, Tabs, TabsContent, TabsList, TabsTrigger, TextField } from "teum";

const items = [{ id: "one", title: "Package proof", meta: "PKG-001", description: "Server rendered from the public package boundary." }];

export function createPackageProof() {
  return React.createElement("main", { "data-package-proof": true },
    React.createElement(Button, { variant: "primary" }, "Verified package"),
    React.createElement(Badge, { variant: "outline" }, "Ready"),
    React.createElement(TextField, { label: "Project", defaultValue: "Teum" }),
    React.createElement(Tabs, { defaultValue: "overview" },
      React.createElement(TabsList, { "aria-label": "Package views" },
        React.createElement(TabsTrigger, { value: "overview" }, "Overview"),
        React.createElement(TabsTrigger, { value: "activity" }, "Activity"),
      ),
      React.createElement(TabsContent, { value: "overview" }, "Package overview"),
      React.createElement(TabsContent, { value: "activity" }, "Package activity"),
    ),
    React.createElement(SharedDetail, { items, defaultSelectedId: "one" }),
  );
}
`);
  await writeFile(resolve(fixture, "ssr.mjs"), `import * as Teum from "teum";
import { renderToString } from "react-dom/server";
import { createPackageProof } from "./app.mjs";

const markup = renderToString(createPackageProof());
for (const contract of ["Verified package", "teum-button", "Package views", "Package proof"]) {
  if (!markup.includes(contract)) throw new Error(\`SSR markup omitted \${contract}\`);
}
console.log(JSON.stringify({ runtimeExportNames: Object.keys(Teum).sort(), markupBytes: Buffer.byteLength(markup) }));
`);
  await writeFile(resolve(fixture, "hydrate.mjs"), `import { JSDOM } from "jsdom";
import { renderToString } from "react-dom/server";
import { createPackageProof } from "./app.mjs";

const markup = renderToString(createPackageProof());
const dom = new JSDOM(\`<!doctype html><html><body><div id="root">\${markup}</div></body></html>\`, { url: "https://consumer.example" });
globalThis.window = dom.window;
globalThis.document = dom.window.document;
Object.defineProperty(globalThis, "navigator", { value: dom.window.navigator, configurable: true });
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.Element = dom.window.Element;
globalThis.SVGElement = dom.window.SVGElement;
globalThis.Node = dom.window.Node;
globalThis.MutationObserver = dom.window.MutationObserver;
globalThis.getComputedStyle = dom.window.getComputedStyle.bind(dom.window);
globalThis.requestAnimationFrame = (callback) => setTimeout(() => callback(Date.now()), 0);
globalThis.cancelAnimationFrame = clearTimeout;
globalThis.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
dom.window.matchMedia = () => ({ matches: false, media: "", onchange: null, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent() { return true; } });

const messages = [];
const originalError = console.error;
console.error = (...args) => { messages.push(args.map(String).join(" ")); };
const { hydrateRoot } = await import("react-dom/client");
const root = hydrateRoot(document.getElementById("root"), createPackageProof());
await new Promise((resolve) => setTimeout(resolve, 120));
console.error = originalError;
const hydrationErrors = messages.filter((message) => /hydration|did not match|server rendered|recoverable error/i.test(message));
if (hydrationErrors.length) throw new Error(hydrationErrors.join("\\n"));
if (!document.querySelector(".teum-button")) throw new Error("Hydrated Button is missing");
root.unmount();
dom.window.close();
console.log(JSON.stringify({ status: "passed", recoverableErrors: hydrationErrors.length }));
`);

  await exec(npm, ["install", "--ignore-scripts", "--no-audit", "--no-fund", "--prefer-offline"], { cwd: fixture, maxBuffer: 64 * 1024 * 1024 });
  await exec(bin("tsc"), ["--noEmit"], { cwd: fixture, maxBuffer: 64 * 1024 * 1024 });
  const built = await exec(bin("vite"), ["build"], { cwd: fixture, maxBuffer: 64 * 1024 * 1024 });
  process.stdout.write(built.stdout);
  const assets = await readdir(resolve(fixture, "dist/assets"));
  const css = (await Promise.all(assets.filter((file) => file.endsWith(".css")).map((file) => readFile(resolve(fixture, "dist/assets", file), "utf8")))).join("\n");
  if (!css.includes(".teum-button") || !css.includes(".teum-shared-detail")) throw new Error("[package-consumer] bundled CSS omitted public component selectors");
  const installedEntry = await readFile(resolve(fixture, "node_modules/teum/dist/package/index.js"), "utf8");
  if (!installedEntry.startsWith('"use client";')) throw new Error("[package-consumer] package entry is missing the React client boundary");
  const ssrResult = await exec(process.execPath, ["ssr.mjs"], { cwd: fixture, maxBuffer: 64 * 1024 * 1024 });
  const ssr = JSON.parse(ssrResult.stdout.trim().split("\n").at(-1));
  if (JSON.stringify(ssr.runtimeExportNames) !== JSON.stringify(expectedRuntimeExports)) throw new Error("[package-consumer] runtime exports drifted from the compiler-generated API contract");
  if (ssr.runtimeExportNames.length < 100 || ssr.markupBytes < 500) throw new Error("[package-consumer] SSR proof did not exercise the public surface");
  const hydrationResult = await exec(process.execPath, ["hydrate.mjs"], { cwd: fixture, maxBuffer: 64 * 1024 * 1024 });
  const hydration = JSON.parse(hydrationResult.stdout.trim().split("\n").at(-1));
  if (hydration.status !== "passed" || hydration.recoverableErrors !== 0) throw new Error("[package-consumer] hydration proof did not pass cleanly");
  if (process.env.TEUM_PACKAGE_EVIDENCE === "1") {
    await writeFile(resolve(root, "release/package-contract.json"), `${JSON.stringify({
      schemaVersion: 1,
      generatedBy: "scripts/verify-package-consumer.mjs",
      generatedAt: new Date().toISOString(),
      version: packageJson.version,
      status: "passed",
      fixture: "Fresh ESM consumer with TypeScript, Vite, Node SSR, and jsdom hydration",
      clientBoundary: "use client",
      declaredExports: publicApi.exportCount,
      runtimeExports: ssr.runtimeExportNames.length,
      runtimeApiMatchesCompiler: true,
      ssrMarkupBytes: ssr.markupBytes,
      hydrationRecoverableErrors: hydration.recoverableErrors,
      cssSelectorsVerified: [".teum-button", ".teum-shared-detail"],
    }, null, 2)}\n`, "utf8");
  }
  console.log(`[package-consumer] ${filename} passed TypeScript, Vite, all ${ssr.runtimeExportNames.length} compiler-derived runtime exports, Node SSR, and zero-error hydration`);
} finally {
  await rm(work, { recursive: true, force: true });
}
