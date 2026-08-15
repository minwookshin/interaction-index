import { execFile } from "node:child_process";
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { promisify } from "node:util";

const exec = promisify(execFile);
const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const root = process.cwd();
const bin = (name) => resolve(root, `node_modules/.bin/${name}${process.platform === "win32" ? ".cmd" : ""}`);
const packageJson = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
const work = await mkdtemp(join(tmpdir(), "interaction-index-package-"));
const tarballs = resolve(work, "tarballs");
const fixture = resolve(work, "consumer");

try {
  await mkdir(tarballs, { recursive: true });
  const packed = await exec(npm, ["pack", "--json", "--pack-destination", tarballs], { cwd: root, maxBuffer: 32 * 1024 * 1024 });
  const filename = JSON.parse(packed.stdout)[0].filename;
  const tarball = resolve(tarballs, filename);
  await mkdir(fixture, { recursive: true });
  await writeFile(resolve(fixture, "package.json"), `${JSON.stringify({
    name: "interaction-index-package-consumer",
    private: true,
    type: "module",
    scripts: { build: "tsc --noEmit && vite build" },
    dependencies: {
      "interaction-index": `file:${tarball}`,
      react: packageJson.peerDependencies.react,
      "react-dom": packageJson.peerDependencies["react-dom"],
    },
    devDependencies: {
      "@types/react": packageJson.devDependencies["@types/react"],
      "@types/react-dom": packageJson.devDependencies["@types/react-dom"],
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
  await writeFile(resolve(fixture, "main.tsx"), `import { createRoot } from "react-dom/client";\nimport { Button, SharedDetail } from "interaction-index";\nimport { tokenPaths, tokenVar } from "interaction-index/tokens";\nimport "interaction-index/styles.css";\nconst items = [{ id: "one", title: "Package proof", meta: "PKG-001", description: tokenVar(tokenPaths[0]) }];\ncreateRoot(document.getElementById("root")!).render(<main><Button>Verified package</Button><SharedDetail items={items} defaultSelectedId="one" /></main>);\n`);

  await exec(npm, ["install", "--ignore-scripts", "--no-audit", "--no-fund", "--prefer-offline"], { cwd: fixture, maxBuffer: 64 * 1024 * 1024 });
  await exec(bin("tsc"), ["--noEmit"], { cwd: fixture, maxBuffer: 64 * 1024 * 1024 });
  const built = await exec(bin("vite"), ["build"], { cwd: fixture, maxBuffer: 64 * 1024 * 1024 });
  process.stdout.write(built.stdout);
  const assets = await readdir(resolve(fixture, "dist/assets"));
  const css = (await Promise.all(assets.filter((file) => file.endsWith(".css")).map((file) => readFile(resolve(fixture, "dist/assets", file), "utf8")))).join("\n");
  if (!css.includes(".ix-button") || !css.includes(".ix-shared-detail")) throw new Error("[package-consumer] bundled CSS omitted public component selectors");
  console.log(`[package-consumer] ${filename} passed a fresh TypeScript and Vite production build`);
} finally {
  await rm(work, { recursive: true, force: true });
}
