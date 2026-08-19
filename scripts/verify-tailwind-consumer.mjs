import { execFile } from "node:child_process";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { promisify } from "node:util";

const exec = promisify(execFile);
const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const root = process.cwd();
const work = await mkdtemp(join(tmpdir(), "whatiuse-tailwind-"));
const tarballs = resolve(work, "tarballs");
const fixture = resolve(work, "consumer");

try {
  await mkdir(tarballs, { recursive: true });
  const packed = await exec(npm, ["pack", "--json", "--pack-destination", tarballs], {
    cwd: root,
    maxBuffer: 32 * 1024 * 1024,
  });
  const filename = JSON.parse(packed.stdout)[0].filename;
  const tarball = resolve(tarballs, filename);
  await mkdir(fixture, { recursive: true });
  await writeFile(resolve(fixture, "package.json"), `${JSON.stringify({
    name: "whatiuse-tailwind-consumer",
    private: true,
    type: "module",
    dependencies: {
      whatiuse: `file:${tarball}`,
      react: "19.2.8",
      "react-dom": "19.2.8",
      tailwindcss: "4.3.3",
      "@tailwindcss/cli": "4.3.3",
    },
  }, null, 2)}\n`);
  await writeFile(resolve(fixture, "input.css"), `@import "tailwindcss";\n@import "whatiuse/tokens.css";\n@import "whatiuse/tailwind.css";\n@source inline("bg-background text-foreground bg-flyout rounded-control shadow-flyout font-sans text-ui");\n`);

  await exec(npm, ["install", "--ignore-scripts", "--no-audit", "--no-fund", "--prefer-offline"], {
    cwd: fixture,
    maxBuffer: 64 * 1024 * 1024,
  });
  const cli = resolve(fixture, `node_modules/.bin/tailwindcss${process.platform === "win32" ? ".cmd" : ""}`);
  await exec(cli, ["-i", "input.css", "-o", "output.css", "--minify"], {
    cwd: fixture,
    maxBuffer: 64 * 1024 * 1024,
  });
  const output = await readFile(resolve(fixture, "output.css"), "utf8");
  for (const proof of [".bg-background", ".shadow-flyout", "--whatiuse-bg-canvas", "var(--whatiuse-bg-flyout)"]) {
    if (!output.includes(proof)) throw new Error(`[tailwind-consumer] compiled CSS omitted ${proof}`);
  }
  console.log(`[tailwind-consumer] ${filename} produced semantic Tailwind v4 utilities from whatiuse tokens`);
} finally {
  await rm(work, { recursive: true, force: true });
}
