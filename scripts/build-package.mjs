import { createHash } from "node:crypto";
import { copyFile, readFile, readdir, stat, writeFile } from "node:fs/promises";
import { relative, resolve } from "node:path";

const root = process.cwd();
const packageRoot = resolve(root, "dist/package");
const hash = (value) => createHash("sha256").update(value).digest("hex");

await copyFile(resolve(root, "src/teum.css"), resolve(packageRoot, "styles.css"));
await copyFile(resolve(root, "src/tokens/generated.css"), resolve(packageRoot, "tokens.css"));
await copyFile(resolve(root, "src/teum-tailwind.css"), resolve(packageRoot, "tailwind.css"));
await copyFile(resolve(root, "tokens/generated/token-manifest.json"), resolve(packageRoot, "tokens.json"));
await writeFile(resolve(packageRoot, "styles.d.ts"), "declare const stylesheet: string;\nexport default stylesheet;\n", "utf8");

async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...await filesIn(path));
    else if (entry.isFile() && entry.name !== "integrity.json") files.push(path);
  }
  return files;
}

const files = (await filesIn(packageRoot)).sort();
const manifest = {
  schemaVersion: 1,
  generatedBy: "scripts/build-package.mjs",
  files: Object.fromEntries(await Promise.all(files.map(async (path) => {
    const source = await readFile(path);
    const details = await stat(path);
    return [relative(packageRoot, path), { bytes: details.size, sha256: hash(source) }];
  }))),
};

await writeFile(resolve(packageRoot, "integrity.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`[package] assembled ${Object.keys(manifest.files).length} files with a deterministic integrity manifest`);
