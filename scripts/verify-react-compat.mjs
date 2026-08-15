import { execFile } from "node:child_process";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { promisify } from "node:util";

const exec = promisify(execFile);
const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const root = process.cwd();
const bin = (name) => resolve(root, `node_modules/.bin/${name}${process.platform === "win32" ? ".cmd" : ""}`);
const work = await mkdtemp(join(tmpdir(), "teum-react-compat-"));
const tarballs = resolve(work, "tarballs");
const matrix = [
  { label: "react-18", react: "18.3.1", types: "^18.3.0" },
  { label: "react-19", react: "19.2.8", types: "^19.2.0" },
];

try {
  await mkdir(tarballs, { recursive: true });
  const packed = await exec(npm, ["pack", "--json", "--pack-destination", tarballs], {
    cwd: root,
    maxBuffer: 32 * 1024 * 1024,
  });
  const filename = JSON.parse(packed.stdout)[0].filename;
  const tarball = resolve(tarballs, filename);

  for (const target of matrix) {
    const fixture = resolve(work, target.label);
    await mkdir(fixture, { recursive: true });
    await writeFile(resolve(fixture, "package.json"), `${JSON.stringify({
      name: `teum-${target.label}-consumer`,
      private: true,
      type: "module",
      dependencies: {
        teum: `file:${tarball}`,
        react: target.react,
        "react-dom": target.react,
      },
      devDependencies: {
        "@types/react": target.types,
        "@types/react-dom": target.types,
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
    await writeFile(resolve(fixture, "main.tsx"), `import { createRoot } from "react-dom/client";\nimport { Button, SharedDetail } from "teum";\nimport "teum/styles.css";\nconst items = [{ id: "one", title: "Compatibility proof", meta: "RC3", description: "Fresh React ${target.react} consumer" }];\ncreateRoot(document.getElementById("root")!).render(<main><Button>React ${target.react}</Button><SharedDetail items={items} defaultSelectedId="one" /></main>);\n`);

    await exec(npm, ["install", "--ignore-scripts", "--no-audit", "--no-fund", "--prefer-offline"], {
      cwd: fixture,
      maxBuffer: 64 * 1024 * 1024,
    });
    await exec(bin("tsc"), ["--noEmit"], { cwd: fixture, maxBuffer: 64 * 1024 * 1024 });
    await exec(bin("vite"), ["build"], { cwd: fixture, maxBuffer: 64 * 1024 * 1024 });
    console.log(`[react-compat] ${target.react} passed TypeScript and Vite production builds`);
  }
} finally {
  await rm(work, { recursive: true, force: true });
}
